// src/app/api/entries/[entryId]/request-edit/route.ts

import { NextResponse } from "next/server";
import { requireAuthenticatedApi } from "@/lib/auth-lib/api-auth";
import { getEntryById, requestEntryEdit } from "@/lib/aws-entries";
import { canRequestEntryEdit } from "@/lib/entry-authorization";

type RouteContext = {
  params: Promise<{
    entryId: string;
  }>;
};

// Determines if a value is an object (excluding arrays and null)
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getOptionalMessage(value: unknown) {
  if (!isObject(value)) return "";

  if (typeof value.message !== "string") {
    return "";
  }

  return value.message.trim();
}

// Handles POST requests to request an edit for an entry
export async function POST(request: Request, context: RouteContext) {
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

    if (!canRequestEntryEdit(auth.user, currentEntry)) {
      return NextResponse.json(
        {
          error:
            "Forbidden. You can only request edits for your own approved or published entries.",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json().catch(() => ({}));
    const message = getOptionalMessage(body);

    const updatedEntry = await requestEntryEdit({
      entryId,
      editRequestMessage: message,
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
        message: "Edit request submitted.",
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
            : "Could not request edit.",
      },
      {
        status: 400,
      },
    );
  }
}