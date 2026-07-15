// src/lib/entries-types.ts

import type { EntryFieldValue, NewEntryType } from "@/lib/new-entry-format";

export const entryStatuses = [
  "pending",
  "approved",
  "published",
  "rejected",
  "edit-requested",
] as const;

export type EntryStatus = (typeof entryStatuses)[number];

export type EntryImageAsset = {
  fileName: string;
  s3Key: string;
  publicPath?: string;
  mimeType?: string;
  sizeBytes?: number;
};

export type PublishedFile = {
  path: string;
  htmlUrl?: string;
  commitUrl?: string;
};

export type EntryRecord = {
  entryId: string;

  entryType: NewEntryType;
  title: string;
  slug: string;

  contentFolder?: string;
  imageFolder?: string;

  authorId: string;
  authorName: string;
  authorEmail: string;

  status: EntryStatus;

  fixedFields?: Record<string, EntryFieldValue>;
  fields: Record<string, EntryFieldValue>;
  markdown: string;
  imageAlt?: string;

  mainImage?: EntryImageAsset | null;
  markdownImages?: EntryImageAsset[];

  reviewerId?: string;
  reviewerName?: string;
  reviewMessage?: string;

  editRequestMessage?: string;
  editRequestedAt?: string;

  publishedFiles?: PublishedFile[];

  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  publishedAt?: string;

    // NUEVO: imágenes que irán al frontmatter galleryImages.
  galleryImages?: EntryImageAsset[];

  // NUEVO: rutas en GitHub que deben borrarse al aprobar.
  publishedFilesToDelete?: string[];



  
};