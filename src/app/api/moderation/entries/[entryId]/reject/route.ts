// src/app/api/moderation/entries/[entryId]/reject/route.ts

import { NextResponse } from "next/server";
import { requirePermissionApi } from "@/lib/api-auth";
import { getEntryById, updateEntryStatus } from "@/lib/aws-entries";

type RouteContext = {
  params: Promise<{
    entryId: string;
  }>;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRejectBody(value: unknown) {
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
  const auth = await requirePermissionApi("entry:reject");

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

    const rejectableStatus =
      entry.status === "pending" || entry.status === "edit-requested";

    if (!rejectableStatus) {
      return NextResponse.json(
        {
          error: `Entry with status "${entry.status}" cannot be rejected.`,
        },
        {
          status: 400,
        },
      );
    }

    const body = parseRejectBody(await request.json().catch(() => ({})));

    const updatedEntry = await updateEntryStatus({
      entryId,
      status: "rejected",
      reviewerId: auth.user.id,
      reviewerName: auth.user.name,
      reviewMessage: body.message,
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

    return NextResponse.json(
      {
        message: "Entry rejected.",
        entry: updatedEntry,
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
            : "Could not reject entry.",
      },
      {
        status: 400,
      },
    );
  }
}