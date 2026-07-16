// src/lib/utils.ts

import type { AppPermission } from "@/lib/permissions";

export function can(user: AppUser, action: AppPermission) {
  return user.permissions.includes(action);
}