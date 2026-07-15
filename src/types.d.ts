// src/types.d.ts

import type { AppPermission, AppRole } from "@/lib/permissions";

declare global {
  type AppUser = {
    id: string;
    email: string;
    emailVerified?: boolean;
    name: string;
    image?: string | null;
    role: AppRole;
    permissions: AppPermission[];
  };
}

export {};