// src/lib/dashboard-types.ts

import type { EntryFieldValue, NewEntryType } from "@/lib/new-entry-format";
import type { AppRole } from "@/lib/permissions";

export type DashboardRole = AppRole;

export type EntryStatus =
  | "Pending"
  | "Approved"
  | "Published"
  | "Rejected"
  | "Edit Requested";

export type DashboardFilters = {
  search: string;
  entryState: EntryStatus | "All Entries";
  entryGroup: string;
  entryFormat: NewEntryType | "All Entries";
  fieldFilters: Record<string, string>;
};

export type DashboardEntry = {
  id: string;
  title: string;
  author: string;
  authorId: string;
  entryType: NewEntryType;
  status: EntryStatus;
  creationDate: string;
  lastEdition: string;
  fields: Record<string, EntryFieldValue>;
};

export type LocalDraft = {
  id: string;
  title: string;
  authorId: string;
  entryType: NewEntryType;
  fields: Record<string, EntryFieldValue>;
};

export type ManagedUser = {
  id: string;
  userId: string;
  username: string;
  name: string;
  email: string;
  role: AppRole;
  groups?: string[];
  enabled?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};