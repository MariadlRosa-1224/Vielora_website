// src/lib/auth-lib/api-auth.ts

import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { can, type AppPermission } from "@/lib/permissions";

export async function requireAuthenticatedApi() {
  try {
    const { user } = await verifySession();

    return {
      user,
      response: null,
    };
  } catch {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 },
      ),
    };
  }
}

export async function requirePermissionApi(permission: AppPermission) {
  const auth = await requireAuthenticatedApi();

  if (auth.response) {
    return auth;
  }

  if (!auth.user || !can(auth.user, permission)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Forbidden. You do not have permission for this action." },
        { status: 403 },
      ),
    };
  }

  return {
    user: auth.user,
    response: null,
  };
}

export async function requireAdminApi() {
  return requirePermissionApi("users:manage-roles");
}