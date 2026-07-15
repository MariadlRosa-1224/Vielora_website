// src/lib/permissions.ts

export const appRoles = ["user", "moderator", "admin"] as const;

export type AppRole = (typeof appRoles)[number];

export const appPermissions = [
  "entry:create",

  "entry:view:own",
  "entry:view:any",

  "entry:edit:own-pending",
  "entry:edit:any",

  "entry:delete:own-pending",
  "entry:delete:any",

  "entry:request-edit",

  "entry:approve",
  "entry:reject",

  "users:view",
  "users:manage-roles",
] as const;

export type AppPermission = (typeof appPermissions)[number];

export const rolePermissions: Record<AppRole, AppPermission[]> = {
  user: [
    "entry:create",
    "entry:view:own",
    "entry:edit:own-pending",
    "entry:delete:own-pending",
    "entry:request-edit",
  ],

  moderator: [
    "entry:create",
    "entry:view:own",
    "entry:view:any",
    "entry:edit:own-pending",
    "entry:edit:any",
    "entry:delete:own-pending",
    "entry:delete:any",
    "entry:approve",
    "entry:reject",
  ],

  admin: [
    "entry:create",
    "entry:view:own",
    "entry:view:any",
    "entry:edit:own-pending",
    "entry:edit:any",
    "entry:delete:own-pending",
    "entry:delete:any",
    "entry:approve",
    "entry:reject",
    "users:view",
    "users:manage-roles",
  ],
};

export function normalizeRole(value: unknown): AppRole {
  if (value === "admin") return "admin";
  if (value === "moderator") return "moderator";
  return "user";
}

export function getPermissionsForRole(role: AppRole): AppPermission[] {
  return rolePermissions[role];
}

export function can(user: AppUser, permission: AppPermission) {
  return user.permissions.includes(permission);
}

export function isAdmin(user: AppUser) {
  return user.role === "admin";
}

export function isModeratorOrAdmin(user: AppUser) {
  return user.role === "moderator" || user.role === "admin";
}