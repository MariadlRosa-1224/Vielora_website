// src/lib/entry-authorization.ts

import { can } from "@/lib/permissions";
import type { EntryRecord } from "@/lib/entries-types";

export function canViewEntry(user: AppUser, entry: EntryRecord) {
  if (can(user, "entry:view:any")) {
    return true;
  }

  return can(user, "entry:view:own") && entry.authorId === user.id;
}

export function canEditEntry(user: AppUser, entry: EntryRecord) {
  if (can(user, "entry:edit:any")) {
    return true;
  }

  const isUserEditableStatus =
    entry.status === "pending" ||
    entry.status === "rejected" ||
    entry.status === "edit-requested";

  return (
    can(user, "entry:edit:own-pending") &&
    entry.authorId === user.id &&
    isUserEditableStatus
  );
}

// Determines if a user can delete an entry based on its status and ownership
export function canDeleteEntry(user: AppUser, entry: EntryRecord) {
  const isEditableStatus =
    entry.status === "pending" ||
    entry.status === "rejected" ||
    entry.status === "edit-requested";

  if (!isEditableStatus) {
    return false;
  }

  if (can(user, "entry:delete:any")) {
    return true;
  }

  return (
    can(user, "entry:delete:own-pending") &&
    entry.authorId === user.id
  );
}

export function canRequestEntryEdit(user: AppUser, entry: EntryRecord) {
  return (
    can(user, "entry:request-edit") &&
    entry.authorId === user.id &&
    (entry.status === "approved" || entry.status === "published")
  );
}

export function canModerateEntry(user: AppUser) {
  return can(user, "entry:approve") || can(user, "entry:reject");
}