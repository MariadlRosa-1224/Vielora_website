// src/lib/local-entry-drafts.ts

import type { EntryFieldValue, NewEntryType } from "@/lib/new-entry-format";

export type LocalEntryDraft = {
  id: string;
  entryType: NewEntryType;
  title: string;
  slug: string;
  author?: string;
  imageAlt?: string;
  fields: Record<string, EntryFieldValue>;
  markdown: string;
  createdAt: string;
  updatedAt: string;
};


const LOCAL_ENTRY_DRAFTS_KEY = "vielora-local-entry-drafts";


// Functions to manage local entry drafts in localStorage
export function getLocalEntryDrafts(): LocalEntryDraft[] {
  if (typeof window === "undefined") return [];

  const rawDrafts = window.localStorage.getItem(LOCAL_ENTRY_DRAFTS_KEY);

  if (!rawDrafts) return [];

  try {
    const parsed = JSON.parse(rawDrafts);

    if (!Array.isArray(parsed)) return [];

    return parsed as LocalEntryDraft[];
  } catch {
    return [];
  }
}

// Get a specific local entry draft by its ID
export function getLocalEntryDraftById(
  draftId: string,
): LocalEntryDraft | null {
  return getLocalEntryDrafts().find((draft) => draft.id === draftId) ?? null;
}

// Save or update a local entry draft in localStorage

export function saveLocalEntryDraft(
  draft: Omit<LocalEntryDraft, "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  },
) {
  const currentDrafts = getLocalEntryDrafts();
  const existingDraft = currentDrafts.find((item) => item.id === draft.id);

  const now = new Date().toISOString();

  const nextDraft: LocalEntryDraft = {
    ...draft,
    createdAt: draft.createdAt ?? existingDraft?.createdAt ?? now,
    updatedAt: now,
  };

  const nextDrafts = [
    nextDraft,
    ...currentDrafts.filter((item) => item.id !== draft.id),
  ];

  window.localStorage.setItem(
    LOCAL_ENTRY_DRAFTS_KEY,
    JSON.stringify(nextDrafts),
  );

  window.dispatchEvent(new Event("vielora-local-drafts-updated"));

  return nextDraft;
}

// Delete a local entry draft by its ID
export function deleteLocalEntryDraft(draftId: string) {
  const nextDrafts = getLocalEntryDrafts().filter(
    (draft) => draft.id !== draftId,
  );

  window.localStorage.setItem(
    LOCAL_ENTRY_DRAFTS_KEY,
    JSON.stringify(nextDrafts),
  );

  window.dispatchEvent(new Event("vielora-local-drafts-updated"));
}

// Clear all local entry drafts from localStorage
export function clearLocalEntryDrafts() {
  window.localStorage.removeItem(LOCAL_ENTRY_DRAFTS_KEY);
  window.dispatchEvent(new Event("vielora-local-drafts-updated"));
}