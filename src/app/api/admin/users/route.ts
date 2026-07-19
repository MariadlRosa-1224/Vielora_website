// src/app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { listManagedCognitoUsers } from "@/lib/cognito-admin";

export async function GET() {
  const auth = await requireAdminApi();

  if (auth.response) {
    return auth.response;
  }

  const users = await listManagedCognitoUsers();

  return NextResponse.json({
    users,
  });
}