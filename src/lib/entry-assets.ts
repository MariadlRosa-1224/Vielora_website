// src/lib/entry-assets.ts

import "server-only";

import { deletePendingAsset } from "@/lib/aws-pending-assets";
import type { EntryRecord } from "@/lib/entries-types";

export function getPendingAssetKeys(entry: EntryRecord) {
  const keys: string[] = [];

  if (entry.mainImage?.s3Key) {
    keys.push(entry.mainImage.s3Key);
  }

  for (const image of entry.markdownImages ?? []) {
    if (image.s3Key) {
      keys.push(image.s3Key);
    }
  }

  for (const image of entry.galleryImages ?? []) {
    if (image.s3Key) {
      keys.push(image.s3Key);
    }
  }

  return keys;
}

export async function deletePendingAssetsForEntry(entry: EntryRecord) {
  const pendingAssetKeys = getPendingAssetKeys(entry);

  const results = await Promise.allSettled(
    pendingAssetKeys.map((s3Key) => deletePendingAsset(s3Key)),
  );

  const failedAssetDeletions = results.filter(
    (result) => result.status === "rejected",
  ).length;

  return {
    totalAssets: pendingAssetKeys.length,
    deletedAssets: pendingAssetKeys.length - failedAssetDeletions,
    failedAssetDeletions,
  };
}