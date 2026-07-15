// src/lib/aws-pending-assets.ts

import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/aws-clients";

const PENDING_ASSETS_BUCKET = process.env.VIELORA_PENDING_ASSETS_BUCKET;

if (!PENDING_ASSETS_BUCKET) {
  throw new Error("VIELORA_PENDING_ASSETS_BUCKET is missing.");
}

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseBase64File(base64: string, fallbackContentType: string) {
  const dataUrlMatch = base64.match(/^data:(.+);base64,(.*)$/);

  if (dataUrlMatch) {
    return {
      contentType: dataUrlMatch[1],
      body: Buffer.from(dataUrlMatch[2], "base64"),
    };
  }

  return {
    contentType: fallbackContentType,
    body: Buffer.from(base64, "base64"),
  };
}

export function buildPendingAssetKey({
  authorId,
  entryId,
  fileName,
  folder = "main",
}: {
  authorId: string;
  entryId: string;
  fileName: string;
  folder?: "main" | "markdown" | "gallery";
}) {
  return [
    "pending",
    sanitizePathSegment(authorId),
    sanitizePathSegment(entryId),
    folder,
    sanitizePathSegment(fileName),
  ].join("/");
}

export async function createPendingAssetUploadUrl({
  s3Key,
  contentType,
}: {
  s3Key: string;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: PENDING_ASSETS_BUCKET,
    Key: s3Key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: 60 * 10,
  });
}

export async function uploadPendingAssetFromBase64({
  s3Key,
  base64,
  contentType,
}: {
  s3Key: string;
  base64: string;
  contentType: string;
}) {
  const parsedFile = parseBase64File(base64, contentType);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: PENDING_ASSETS_BUCKET,
      Key: s3Key,
      Body: parsedFile.body,
      ContentType: parsedFile.contentType,
    }),
  );

  return {
    s3Key,
    mimeType: parsedFile.contentType,
    sizeBytes: parsedFile.body.byteLength,
  };
}

export async function deletePendingAsset(s3Key: string) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: PENDING_ASSETS_BUCKET,
      Key: s3Key,
    }),
  );
}

export async function readPendingAssetAsBase64(s3Key: string) {
  const result = await s3Client.send(
    new GetObjectCommand({
      Bucket: PENDING_ASSETS_BUCKET,
      Key: s3Key,
    }),
  );

  const bytes = await result.Body?.transformToByteArray();

  if (!bytes) {
    throw new Error(`Could not read pending asset: ${s3Key}`);
  }

  return Buffer.from(bytes).toString("base64");
}

export async function createPendingAssetReadUrl(s3Key: string) {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: PENDING_ASSETS_BUCKET,
      Key: s3Key,
    }),
    {
      expiresIn: 600,
    },
  );
}