// src/app/api/entries/route.ts

import { NextResponse } from "next/server";
import {
  requireAuthenticatedApi,
  requirePermissionApi,
} from "@/lib/auth-lib/api-auth";
import {
  listAllEntries,
  listEntriesByStatus,
  listEntriesForAuthor,
  putEntry,
} from "@/lib/aws-entries";
import {
  buildPendingAssetKey,
  deletePendingAsset,
  uploadPendingAssetFromBase64,
} from "@/lib/aws-pending-assets";
import {
  getEntryFormat,
  newEntryFormats,
  type EntryFieldValue,
  type NewEntryType,
} from "@/lib/new-entry-format";
import {
  entryStatuses,
  type EntryImageAsset,
  type EntryRecord,
  type EntryStatus,
} from "@/lib/entries-types";
import { can } from "@/lib/permissions";

type SubmittedImage = {
  fileName?: string;
  base64?: string;
  mimeType?: string;
  publicPath?: string;
};

type ParsedCreateEntryBody = {
  entryType: NewEntryType;
  title: string;
  slug: string;
  contentFolder: string;
  imageFolder: string;
  fixedFields: Record<string, EntryFieldValue>;
  fields: Record<string, EntryFieldValue>;
  markdown: string;
  imageAlt: string;
  mainImage: SubmittedImage | null;
  markdownImages: SubmittedImage[];
  galleryImages: SubmittedImage[];
};

type PendingAssetFolder = "main" | "markdown" | "gallery";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNewEntryType(value: string): value is NewEntryType {
  return newEntryFormats.some((format) => format.entryType === value);
}

function requiredString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function optionalString(value: unknown) {
  if (typeof value !== "string") return "";

  return value.trim();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getContentTypeFromFileName(fileName: string) {
  const lowerFileName = fileName.toLowerCase();

  if (lowerFileName.endsWith(".jpg") || lowerFileName.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (lowerFileName.endsWith(".webp")) {
    return "image/webp";
  }

  if (lowerFileName.endsWith(".gif")) {
    return "image/gif";
  }

  if (lowerFileName.endsWith(".svg")) {
    return "image/svg+xml";
  }

  return "image/png";
}

function parseSubmittedImages(value: unknown): SubmittedImage[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    if (!isObject(item)) {
      throw new Error("Each image must be an object.");
    }

    return {
      fileName: requiredString(item.fileName, "fileName"),
      base64: requiredString(item.base64, "base64"),
      mimeType: requiredString(item.mimeType, "mimeType"),
      publicPath: requiredString(item.publicPath, "publicPath"),
    };
  });
}

function parseCreateEntryBody(value: unknown): ParsedCreateEntryBody {
  if (!isObject(value)) {
    throw new Error("Request body must be an object.");
  }

  const rawEntryType = requiredString(value.entryType, "entryType");

  if (!isNewEntryType(rawEntryType)) {
    throw new Error(`Invalid entry type: ${rawEntryType}`);
  }

  const entryType: NewEntryType = rawEntryType;

  const title = requiredString(value.title, "title");
  const safeSlug = optionalString(value.slug) || slugify(title);

  if (!safeSlug) {
    throw new Error("slug is required.");
  }

  const fields = isObject(value.fields)
    ? (value.fields as Record<string, EntryFieldValue>)
    : {};

  const fixedFields = isObject(value.fixedFields)
    ? (value.fixedFields as Record<string, EntryFieldValue>)
    : {};

  const markdown = typeof value.markdown === "string" ? value.markdown : "";

  return {
    entryType,
    title,
    slug: safeSlug,
    contentFolder: optionalString(value.contentFolder),
    imageFolder: optionalString(value.imageFolder),
    fixedFields,
    fields,
    markdown,
    imageAlt: optionalString(value.imageAlt),
    mainImage: isObject(value.mainImage)
      ? (value.mainImage as SubmittedImage)
      : null,
    markdownImages: parseSubmittedImages(value.markdownImages),
    galleryImages: parseSubmittedImages(value.galleryImages),
  };
}

async function uploadSubmittedImage({
  image,
  authorId,
  entryId,
  folder,
}: {
  image: SubmittedImage;
  authorId: string;
  entryId: string;
  folder: PendingAssetFolder;
}): Promise<EntryImageAsset | null> {
  if (!image.fileName || !image.base64) {
    return null;
  }

  const contentType =
    image.mimeType?.trim() || getContentTypeFromFileName(image.fileName);

  const s3Key = buildPendingAssetKey({
    authorId,
    entryId,
    fileName: image.fileName,
    folder,
  });

  const uploadedAsset = await uploadPendingAssetFromBase64({
    s3Key,
    base64: image.base64,
    contentType,
  });

  return {
    fileName: image.fileName,
    s3Key: uploadedAsset.s3Key,
    publicPath: image.publicPath,
    mimeType: uploadedAsset.mimeType,
    sizeBytes: uploadedAsset.sizeBytes,
  };
}

async function uploadSubmittedImages({
  images,
  authorId,
  entryId,
  folder,
  uploadedKeys,
}: {
  images: SubmittedImage[];
  authorId: string;
  entryId: string;
  folder: PendingAssetFolder;
  uploadedKeys: string[];
}) {
  const uploadedImages: EntryImageAsset[] = [];

  for (const image of images) {
    const uploadedImage = await uploadSubmittedImage({
      image,
      authorId,
      entryId,
      folder,
    });

    if (uploadedImage) {
      uploadedImages.push(uploadedImage);
      uploadedKeys.push(uploadedImage.s3Key);
    }
  }

  return uploadedImages;
}

export async function POST(request: Request) {
  const auth = await requirePermissionApi("entry:create");

  if (auth.response) {
    return auth.response;
  }

  if (!auth.user) {
    return NextResponse.json(
      {
        error: "Unauthorized. Please log in.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const body = parseCreateEntryBody(await request.json());
    const format = getEntryFormat(body.entryType);

    if (format.mainImageRequired && !body.mainImage) {
      return NextResponse.json(
        {
          error: "Main image is required for this entry type.",
        },
        {
          status: 400,
        },
      );
    }

    if (body.galleryImages.length > 0 && !format.usesGalleryImages) {
      return NextResponse.json(
        {
          error: "This entry type does not support gallery images.",
        },
        {
          status: 400,
        },
      );
    }

    const entryId = crypto.randomUUID();
    const now = new Date().toISOString();
    const uploadedKeys: string[] = [];

    const mainImage = await uploadSubmittedImage({
      image: body.mainImage ?? {},
      authorId: auth.user.id,
      entryId,
      folder: "main",
    });

    if (mainImage?.s3Key) {
      uploadedKeys.push(mainImage.s3Key);
    }

    const markdownImages = await uploadSubmittedImages({
      images: body.markdownImages,
      authorId: auth.user.id,
      entryId,
      folder: "markdown",
      uploadedKeys,
    });

    const galleryImages = await uploadSubmittedImages({
      images: body.galleryImages,
      authorId: auth.user.id,
      entryId,
      folder: "gallery",
      uploadedKeys,
    });

    const entry: EntryRecord = {
      entryId,

      entryType: body.entryType,
      title: body.title,
      slug: body.slug,

      contentFolder: body.contentFolder,
      imageFolder: body.imageFolder,

      authorId: auth.user.id,
      authorName: auth.user.name,
      authorEmail: auth.user.email,

      status: "pending",

      fixedFields: {
        ...(format.fixedFields ?? {}),
        ...(body.fixedFields ?? {}),
      },
      fields: body.fields,
      markdown: body.markdown,
      imageAlt: body.imageAlt || body.title,

      mainImage,
      markdownImages,
      galleryImages,
      publishedFilesToDelete: [],

      reviewerId: "",
      reviewerName: "",
      reviewMessage: "",

      editRequestMessage: "",
      editRequestedAt: "",

      publishedFiles: [],

      createdAt: now,
      updatedAt: now,
      submittedAt: now,
    };

    try {
      await putEntry(entry);
    } catch (error) {
      await Promise.allSettled(
        uploadedKeys.map((s3Key) => deletePendingAsset(s3Key)),
      );

      throw error;
    }

    return NextResponse.json(
      {
        message: "Entry submitted for approval.",
        entry,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not submit entry.",
      },
      {
        status: 400,
      },
    );
  }
}

function isEntryStatus(value: string): value is EntryStatus {
  return entryStatuses.includes(value as EntryStatus);
}

function sortEntriesByUpdatedAt(entries: EntryRecord[]) {
  return [...entries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function GET(request: Request) {
  const auth = await requireAuthenticatedApi();

  if (auth.response) {
    return auth.response;
  }

  if (!auth.user) {
    return NextResponse.json(
      {
        error: "Unauthorized. Please log in.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");

    let requestedStatus: EntryStatus | null = null;

    if (statusParam && statusParam !== "all") {
      if (!isEntryStatus(statusParam)) {
        return NextResponse.json(
          {
            error: `Invalid status filter: ${statusParam}`,
          },
          {
            status: 400,
          },
        );
      }

      requestedStatus = statusParam;
    }

    const canViewAny = can(auth.user, "entry:view:any");

    if (canViewAny) {
      const entries = requestedStatus
        ? await listEntriesByStatus(requestedStatus)
        : await listAllEntries();

      return NextResponse.json(
        {
          scope: "all",
          entries: sortEntriesByUpdatedAt(entries),
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const ownEntries = await listEntriesForAuthor(auth.user.id);

    const filteredEntries = requestedStatus
      ? ownEntries.filter((entry) => entry.status === requestedStatus)
      : ownEntries;

    return NextResponse.json(
      {
        scope: "own",
        entries: sortEntriesByUpdatedAt(filteredEntries),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load entries.",
      },
      {
        status: 500,
      },
    );
  }
}