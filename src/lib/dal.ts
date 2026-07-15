// src/lib/dal.ts

import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { getRoleForEmail } from "@/lib/cognito-admin";
import {
  can,
  getPermissionsForRole,
  type AppPermission,
} from "@/lib/permissions";

function getSafeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

function getSafeName({
  name,
  email,
  userId,
}: {
  name?: string | null;
  email?: string | null;
  userId: string;
}) {
  const cleanName = name?.trim();

  if (cleanName) return cleanName;

  const cleanEmail = email?.trim();

  if (cleanEmail) return cleanEmail.split("@")[0] || cleanEmail;

  return userId;
}

export const verifySession = cache(async () => {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  const email = getSafeEmail(session.user.email);

  if (!email) {
    redirect("/login");
  }

  const role = await getRoleForEmail(email);

  const user: AppUser = {
    id: session.user.id,
    email,
    emailVerified: session.user.emailVerified,
    name: getSafeName({
      name: session.user.name,
      email,
      userId: session.user.id,
    }),
    image: session.user.image,
    role,
    permissions: getPermissionsForRole(role),
  };

  return { user };
});

export const verifyPermission = cache(async (permission: AppPermission) => {
  const { user } = await verifySession();

  if (!can(user, permission)) {
    redirect("/dashboard");
  }

  return { user };
});

export const verifyAdmin = cache(async () => {
  return verifyPermission("users:manage-roles");
});

export const verifyModeratorOrAdmin = cache(async () => {
  const { user } = await verifySession();

  if (user.role !== "moderator" && user.role !== "admin") {
    redirect("/dashboard");
  }

  return { user };
});