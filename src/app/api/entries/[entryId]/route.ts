// src/app/api/entries/[entryId]/route.ts

import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/auth-lib/api-auth";
import {
  deleteEntry,
  getEntryById,
  updateEntryEditableFields,
} from "@/lib/aws-entries";
import {
  canDeleteEntry,
  canEditEntry,
  canViewEntry,
} from "@/lib/entry-authorization";
import { deletePendingAssetsForEntry } from "@/lib/entry-assets";
import {
  getEntryFormat,
  type EntryFieldValue,
} from "@/lib/new-entry-format";
import {
  buildPendingAssetKey,
  deletePendingAsset,
  uploadPendingAssetFromBase64,
} from "@/lib/aws-pending-assets";

type RouteContext = {
  params: Promise<{
    entryId: string;
  }>;
};

type SubmittedImage = {
  fileName: string;
  base64: string;
  mimeType: string;
  publicPath: string;
};

type GalleryImagesUpdate = {
  keepPublicPaths: string[];
  newImages: SubmittedImage[];
};

type UpdateEntryBody = {
  entryType?: string;
  title?: string;
  slug?: string;
  contentFolder?: string;
  imageFolder?: string;
  fixedFields?: Record<string, EntryFieldValue>;
  fields?: Record<string, EntryFieldValue>;
  markdown?: string;
  imageAlt?: string;
  mainImage?: SubmittedImage | null;
  galleryImages?: GalleryImagesUpdate;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown) {
  if (typeof value !== "string") return undefined;

  return value.trim();
}

function requiredNonEmptyString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} cannot be empty.`);
  }

  return value.trim();
}

function parseSubmittedImage(value: unknown): SubmittedImage | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;

  if (!isObject(value)) {
    throw new Error("mainImage must be an object.");
  }

  return {
    fileName: requiredNonEmptyString(value.fileName, "mainImage.fileName"),
    base64: requiredNonEmptyString(value.base64, "mainImage.base64"),
    mimeType: requiredNonEmptyString(value.mimeType, "mainImage.mimeType"),
    publicPath: requiredNonEmptyString(
      value.publicPath,
      "mainImage.publicPath",
    ),
  };
}

function parseSubmittedImages(value: unknown): SubmittedImage[] {
  if (value === undefined) return [];

  if (!Array.isArray(value)) {
    throw new Error("newImages must be an array.");
  }

  return value.map((item, index) => {
    if (!isObject(item)) {
      throw new Error(`newImages[${index}] must be an object.`);
    }

    return {
      fileName: requiredNonEmptyString(
        item.fileName,
        `newImages[${index}].fileName`,
      ),
      base64: requiredNonEmptyString(
        item.base64,
        `newImages[${index}].base64`,
      ),
      mimeType: requiredNonEmptyString(
        item.mimeType,
        `newImages[${index}].mimeType`,
      ),
      publicPath: requiredNonEmptyString(
        item.publicPath,
        `newImages[${index}].publicPath`,
      ),
    };
  });
}

function parseGalleryImagesUpdate(
  value: unknown,
): GalleryImagesUpdate | undefined {
  if (value === undefined) return undefined;

  if (!isObject(value)) {
    throw new Error("galleryImages must be an object.");
  }

  const keepPublicPaths = Array.isArray(value.keepPublicPaths)
    ? value.keepPublicPaths
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const newImages = parseSubmittedImages(value.newImages);

  return {
    keepPublicPaths,
    newImages,
  };
}

function parseUpdateEntryBody(value: unknown): UpdateEntryBody {
  if (!isObject(value)) {
    throw new Error("Request body must be an object.");
  }

  const update: UpdateEntryBody = {};

  if ("entryType" in value) {
    update.entryType = optionalString(value.entryType);
  }

  if ("title" in value) {
    update.title = requiredNonEmptyString(value.title, "title");
  }

  if ("slug" in value) {
    update.slug = requiredNonEmptyString(value.slug, "slug");
  }

  if ("contentFolder" in value) {
    update.contentFolder = optionalString(value.contentFolder) ?? "";
  }

  if ("imageFolder" in value) {
    update.imageFolder = optionalString(value.imageFolder) ?? "";
  }

  if ("fixedFields" in value) {
    update.fixedFields = isObject(value.fixedFields)
      ? (value.fixedFields as Record<string, EntryFieldValue>)
      : {};
  }

  if ("fields" in value) {
    update.fields = isObject(value.fields)
      ? (value.fields as Record<string, EntryFieldValue>)
      : {};
  }

  if ("markdown" in value) {
    update.markdown =
      typeof value.markdown === "string" ? value.markdown : "";
  }

  if ("imageAlt" in value) {
    update.imageAlt = optionalString(value.imageAlt) ?? "";
  }

  if ("mainImage" in value) {
    update.mainImage = parseSubmittedImage(value.mainImage);
  }

  if ("galleryImages" in value) {
    update.galleryImages = parseGalleryImagesUpdate(value.galleryImages);
  }

  return update;
}

function publicPathToRepoPath(publicPath: string) {
  const cleanPath = publicPath.replace(/^\/+/, "");

  if (cleanPath.startsWith("public/")) {
    return cleanPath;
  }

  return `public/${cleanPath}`;
}

export async function GET(_request: Request, context: RouteContext) {
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
    const { entryId } = await context.params;

    if (!entryId || entryId.trim() === "") {
      return NextResponse.json(
        {
          error: "entryId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const entry = await getEntryById(entryId);

    if (!entry) {
      return NextResponse.json(
        {
          error: "Entry not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!canViewEntry(auth.user, entry)) {
      return NextResponse.json(
        {
          error: "Forbidden. You cannot view this entry.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        entry,
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
          error instanceof Error ? error.message : "Could not load entry.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
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

  /**
   * These are declared outside the try so the catch block can clean up
   * files uploaded to S3 if DynamoDB update fails later.
   */
  let uploadedMainImageKey: string | null = null;
  const uploadedGalleryAssetKeys: string[] = [];

  try {
    const { entryId } = await context.params;

    if (!entryId || entryId.trim() === "") {
      return NextResponse.json(
        {
          error: "entryId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const currentEntry = await getEntryById(entryId);

    if (!currentEntry) {
      return NextResponse.json(
        {
          error: "Entry not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!canEditEntry(auth.user, currentEntry)) {
      return NextResponse.json(
        {
          error: "Forbidden. You cannot edit this entry.",
        },
        {
          status: 403,
        },
      );
    }

    const body = parseUpdateEntryBody(await request.json());

    if (body.entryType && body.entryType !== currentEntry.entryType) {
      return NextResponse.json(
        {
          error: "Changing entry type is not allowed.",
        },
        {
          status: 400,
        },
      );
    }

    const format = getEntryFormat(currentEntry.entryType);

const galleryUpdateHasChanges =
  body.galleryImages !== undefined &&
  (body.galleryImages.newImages.length > 0 ||
    body.galleryImages.keepPublicPaths.length !==
      (currentEntry.galleryImages ?? []).filter((image) => image.publicPath)
        .length);

if (body.galleryImages && !format.usesGalleryImages && galleryUpdateHasChanges) {
  return NextResponse.json(
    {
      error: "This entry type does not support gallery images.",
    },
    {
      status: 400,
    },
  );
}

if (body.galleryImages && !format.usesGalleryImages) {
  body.galleryImages = undefined;
}

    /**
     * Main image update.
     * If no new mainImage is sent, DynamoDB should not touch mainImage.
     */
    let nextMainImage = currentEntry.mainImage;

    if (body.mainImage) {
      const s3Key = buildPendingAssetKey({
        authorId: currentEntry.authorId,
        entryId,
        fileName: body.mainImage.fileName,
        folder: "main",
      });

      const uploadedMainImage = await uploadPendingAssetFromBase64({
        s3Key,
        base64: body.mainImage.base64,
        contentType: body.mainImage.mimeType,
      });

      uploadedMainImageKey = uploadedMainImage.s3Key;

      nextMainImage = {
        fileName: body.mainImage.fileName,
        s3Key: uploadedMainImage.s3Key,
        publicPath: body.mainImage.publicPath,
        mimeType: uploadedMainImage.mimeType,
        sizeBytes: uploadedMainImage.sizeBytes,
      };
    }

    /**
     * Gallery update.
     * We keep selected existing images, upload new ones to S3 pending,
     * and mark removed published files so approval can delete them from GitHub.
     */
    let nextGalleryImages = currentEntry.galleryImages ?? [];
    let publishedFilesToDelete = currentEntry.publishedFilesToDelete ?? [];
    let removedPendingGalleryKeys: string[] = [];

    if (body.galleryImages) {
      const keepSet = new Set(body.galleryImages.keepPublicPaths);

      const keptExistingGalleryImages = (
        currentEntry.galleryImages ?? []
      ).filter((image) => image.publicPath && keepSet.has(image.publicPath));

      const removedGalleryImages = (currentEntry.galleryImages ?? []).filter(
        (image) => !image.publicPath || !keepSet.has(image.publicPath),
      );

      const uploadedNewGalleryImages = await Promise.all(
        body.galleryImages.newImages.map(async (image) => {
          const s3Key = buildPendingAssetKey({
            authorId: currentEntry.authorId,
            entryId,
            fileName: image.fileName,
            folder: "gallery",
          });

          const uploaded = await uploadPendingAssetFromBase64({
            s3Key,
            base64: image.base64,
            contentType: image.mimeType,
          });

          uploadedGalleryAssetKeys.push(uploaded.s3Key);

          return {
            fileName: image.fileName,
            s3Key: uploaded.s3Key,
            publicPath: image.publicPath,
            mimeType: uploaded.mimeType,
            sizeBytes: uploaded.sizeBytes,
          };
        }),
      );

      nextGalleryImages = [
        ...keptExistingGalleryImages,
        ...uploadedNewGalleryImages,
      ];

      const removedPublishedRepoPaths = removedGalleryImages
        .map((image) => image.publicPath)
        .filter((path): path is string => Boolean(path))
        .map(publicPathToRepoPath)
        .filter((repoPath) =>
          (currentEntry.publishedFiles ?? []).some(
            (file) => file.path === repoPath,
          ),
        );

      publishedFilesToDelete = Array.from(
        new Set([...publishedFilesToDelete, ...removedPublishedRepoPaths]),
      );

      /**
       * Do not delete old pending S3 assets until DynamoDB update succeeds.
       * Otherwise, a failed update could leave the entry pointing to deleted files.
       */
      removedPendingGalleryKeys = removedGalleryImages
        .map((image) => image.s3Key)
        .filter((s3Key): s3Key is string => Boolean(s3Key));
    }

    const updatedEntry = await updateEntryEditableFields({
      entryId,
      title: body.title,
      slug: body.slug,
      contentFolder: body.contentFolder,
      imageFolder: body.imageFolder,
      fixedFields: body.fixedFields,
      fields: body.fields,
      markdown: body.markdown,
      imageAlt: body.imageAlt,

      mainImage: body.mainImage === undefined ? undefined : nextMainImage,

      galleryImages:
        body.galleryImages === undefined ? undefined : nextGalleryImages,

      publishedFilesToDelete:
        body.galleryImages === undefined ? undefined : publishedFilesToDelete,
    });

    if (!updatedEntry) {
      return NextResponse.json(
        {
          error: "Entry not found.",
        },
        {
          status: 404,
        },
      );
    }

    /**
     * After successful DynamoDB update, it is safe to delete old pending assets.
     */
    if (
      body.mainImage &&
      currentEntry.mainImage?.s3Key &&
      currentEntry.mainImage.s3Key !== nextMainImage?.s3Key
    ) {
      await deletePendingAsset(currentEntry.mainImage.s3Key).catch(
        () => undefined,
      );
    }

    await Promise.allSettled(
      removedPendingGalleryKeys.map((s3Key) => deletePendingAsset(s3Key)),
    );

    return NextResponse.json(
      {
        message: "Entry updated and sent for review.",
        entry: updatedEntry,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    /**
     * If new files were uploaded but the update failed,
     * delete them so S3 pending does not accumulate orphaned files.
     */
    if (uploadedMainImageKey) {
      await deletePendingAsset(uploadedMainImageKey).catch(() => undefined);
    }

    await Promise.allSettled(
      uploadedGalleryAssetKeys.map((s3Key) => deletePendingAsset(s3Key)),
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not update entry.",
      },
      {
        status: 400,
      },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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
    const { entryId } = await context.params;

    if (!entryId || entryId.trim() === "") {
      return NextResponse.json(
        {
          error: "entryId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const entry = await getEntryById(entryId);

    if (!entry) {
      return NextResponse.json(
        {
          error: "Entry not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (!canDeleteEntry(auth.user, entry)) {
      return NextResponse.json(
        {
          error: "Forbidden. You cannot delete this entry.",
        },
        {
          status: 403,
        },
      );
    }

    await deleteEntry(entryId);

    const pendingAssetCleanup = await deletePendingAssetsForEntry(entry);

    return NextResponse.json(
      {
        message:
          pendingAssetCleanup.failedAssetDeletions > 0
            ? "Entry deleted, but some pending assets could not be deleted."
            : "Entry deleted.",
        deletedEntryId: entryId,
        deletedAssets: pendingAssetCleanup.deletedAssets,
        failedAssetDeletions: pendingAssetCleanup.failedAssetDeletions,
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
          error instanceof Error ? error.message : "Could not delete entry.",
      },
      {
        status: 400,
      },
    );
  }
}