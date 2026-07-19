// src/app/api/moderation/entries/[entryId]/approve/route.ts

import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/api-auth";
import { getEntryById, markEntryPublished } from "@/lib/aws-entries";
import { publishEntryToGitHub } from "@/lib/entry-mdx-publisher";
import { deletePendingAssetsForEntry } from "@/lib/entry-assets";

type RouteContext = {
  params: Promise<{
    entryId: string;
  }>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseApproveBody(value: unknown) {
  if (!isObject(value)) {
    return {
      message: "",
    };
  }

  return {
    message:
      typeof value.message === "string" ? value.message.trim() : "",
  };
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requirePermissionApi("entry:approve");

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

    const approvableStatus =
      entry.status === "pending" ||
      entry.status === "rejected" ||
      entry.status === "edit-requested";

    if (!approvableStatus) {
      return NextResponse.json(
        {
          error: `Entry with status "${entry.status}" cannot be approved.`,
        },
        {
          status: 400,
        },
      );
    }

    const body = parseApproveBody(await request.json().catch(() => ({})));

    const publishedFiles = await publishEntryToGitHub(entry);

    const updatedEntry = await markEntryPublished({
      entryId,
      reviewerId: auth.user.id,
      reviewerName: auth.user.name,
      reviewMessage: body.message,
      publishedFiles,
    });

    const pendingAssetCleanup = updatedEntry
  ? await deletePendingAssetsForEntry(entry)
  : {
      totalAssets: 0,
      deletedAssets: 0,
      failedAssetDeletions: 0,
    };

    if (!updatedEntry) {
      return NextResponse.json(
        {
          error: "Entry was published, but the database status could not be updated.",
          publishedFiles,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
  {
    message:
      pendingAssetCleanup.failedAssetDeletions > 0
        ? "Entry approved and published, but some pending assets could not be deleted."
        : "Entry approved and published.",
    entry: updatedEntry,
    publishedFiles,
    pendingAssetCleanup,
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
          error instanceof Error
            ? error.message
            : "Could not approve entry.",
      },
      {
        status: 400,
      },
    );
  }
}