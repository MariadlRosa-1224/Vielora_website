// src/app/api/admin/users/[userId]/role/route.ts

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth-lib/api-auth";
import { setCognitoUserRole } from "@/lib/cognito-admin";

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminApi();

  if (auth.response) {
    return auth.response;
  }

  const { userId } = await context.params;
  const body = await request.json();

  if (body.role !== "user" && body.role !== "moderator") {
    return NextResponse.json(
      {
        error: "Invalid role. Admin can only assign user or moderator.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await setCognitoUserRole({
      username: userId,
      nextRole: body.role,
      currentAdminEmail: auth.user.email,
    });

    return NextResponse.json({
      user: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not update user role.",
      },
      { status: 400 },
    );
  }
}