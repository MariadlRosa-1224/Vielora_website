// src/lib/utils.ts

import type { AppPermission } from "@/lib/permissions";

export function can(
  user: { permissions: AppPermission[] },
  action: AppPermission,
) {
  return user.permissions.includes(action);
}