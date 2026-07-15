// src/lib/entry-mdx-publisher.ts

import "server-only";

import { readPendingAssetAsBase64 } from "@/lib/aws-pending-assets";
import {
  deleteGithubFile,
  putGithubFile,
} from "@/lib/github-publisher";
import type { EntryRecord, PublishedFile } from "@/lib/entries-types";

const rawYamlFields = new Set(["weaknesses", "galleryImages", "abilityTree"]);

function normalizeRepoPath(path: string) {
  return path.replace(/^\/+/, "");
}

function publicPathToRepoPath(publicPath: string) {
  const cleanPath = publicPath.replace(/^\/+/, "");

  if (cleanPath.startsWith("public/")) {
    return cleanPath;
  }

  return `public/${cleanPath}`;
}

function yamlScalar(value: unknown) {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  const text = String(value ?? "");

  if (text === "") {
    return '""';
  }

  if (
    text.includes(":") ||
    text.includes("#") ||
    text.includes("\n") ||
    text.startsWith("[") ||
    text.startsWith("{") ||
    text === "true" ||
    text === "false"
  ) {
    return JSON.stringify(text);
  }

  return JSON.stringify(text);
}

function indent(text: string, spaces = 2) {
  const prefix = " ".repeat(spaces);

  return text
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

function serializeYamlValue(value: unknown, level = 0): string {
  const spacing = " ".repeat(level);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";

    return value
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return `${spacing}-\n${serializeYamlValue(item, level + 2)}`;
        }

        return `${spacing}- ${yamlScalar(item)}`;
      })
      .join("\n");
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value);

    if (entries.length === 0) return "{}";

    return entries
      .map(([key, nestedValue]) => {
        if (
          typeof nestedValue === "object" &&
          nestedValue !== null &&
          !Array.isArray(nestedValue)
        ) {
          return `${spacing}${key}:\n${serializeYamlValue(
            nestedValue,
            level + 2,
          )}`;
        }

        if (Array.isArray(nestedValue)) {
          return `${spacing}${key}:\n${serializeYamlValue(
            nestedValue,
            level + 2,
          )}`;
        }

        return `${spacing}${key}: ${yamlScalar(nestedValue)}`;
      })
      .join("\n");
  }

  return yamlScalar(value);
}

function serializeFrontmatterField(key: string, value: unknown) {
  if (
    rawYamlFields.has(key) &&
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    return `${key}:\n${indent(value.trim(), 2)}`;
  }

  if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
    return `${key}:\n${serializeYamlValue(value, 2)}`;
  }

  return `${key}: ${yamlScalar(value)}`;
}

function buildFrontmatter(entry: EntryRecord) {
  const frontmatter: Record<string, unknown> = {
    title: entry.title,
    slug: entry.slug,
  };

  if (entry.entryType.startsWith("codex.")) {
    frontmatter.author = entry.authorName;
  }

  Object.assign(frontmatter, entry.fixedFields ?? {});

  if (entry.mainImage?.publicPath) {
    frontmatter.image = entry.mainImage.publicPath;
  }

  if (entry.imageAlt) {
    frontmatter.imageAlt = entry.imageAlt;
  }

  Object.assign(frontmatter, entry.fields ?? {});

  /**
   * Important:
   * galleryImages is now managed by EntryRecord.galleryImages.
   * If it came from entry.fields during an import, remove it first
   * so deleted gallery images do not remain in the final frontmatter.
   */
  delete frontmatter.galleryImages;

  const galleryImagePaths = (entry.galleryImages ?? [])
    .map((image) => image.publicPath)
    .filter((path): path is string => Boolean(path));

  if (galleryImagePaths.length > 0) {
    frontmatter.galleryImages = galleryImagePaths;
  }

  if (!("draft" in frontmatter)) {
    frontmatter.draft = false;
  }

  return Object.entries(frontmatter)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => serializeFrontmatterField(key, value))
    .join("\n");
}

function buildMdxContent(entry: EntryRecord) {
  return `---\n${buildFrontmatter(entry)}\n---\n\n${entry.markdown ?? ""}\n`;
}

function getEntryMdxRepoPath(entry: EntryRecord) {
  if (!entry.contentFolder) {
    throw new Error("Entry contentFolder is missing.");
  }

  return normalizeRepoPath(`${entry.contentFolder}/${entry.slug}.mdx`);
}

async function publishAsset({
  publicPath,
  s3Key,
  message,
}: {
  publicPath: string;
  s3Key: string;
  message: string;
}): Promise<PublishedFile> {
  const repoPath = publicPathToRepoPath(publicPath);
  const contentBase64 = await readPendingAssetAsBase64(s3Key);

  const result = await putGithubFile({
    path: repoPath,
    contentBase64,
    message,
  });

  return {
    path: repoPath,
    htmlUrl: result.content?.html_url,
    commitUrl: result.commit?.html_url,
  };
}

function wasFileAlreadyPublished(entry: EntryRecord, repoPath: string) {
  return (entry.publishedFiles ?? []).some((file) => file.path === repoPath);
}

function mergePublishedFiles(
  existingFiles: PublishedFile[],
  newFiles: PublishedFile[],
) {
  const filesByPath = new Map<string, PublishedFile>();

  for (const file of existingFiles) {
    filesByPath.set(file.path, file);
  }

  for (const file of newFiles) {
    filesByPath.set(file.path, file);
  }

  return Array.from(filesByPath.values());
}

async function publishAssetIfNeeded({
  entry,
  publicPath,
  s3Key,
  message,
}: {
  entry: EntryRecord;
  publicPath: string;
  s3Key: string;
  message: string;
}) {
  const repoPath = publicPathToRepoPath(publicPath);

  /**
   * If the file was already published before, we do not need to read it
   * from S3 pending again. This matters because pending assets may be
   * deleted after approval.
   */
  if (wasFileAlreadyPublished(entry, repoPath)) {
    return null;
  }

  return publishAsset({
    publicPath,
    s3Key,
    message,
  });
}

export async function publishEntryToGitHub(entry: EntryRecord) {
  const message = `Publish entry: ${entry.title}`;
  const newlyPublishedFiles: PublishedFile[] = [];

  if (entry.mainImage?.publicPath && entry.mainImage.s3Key) {
    const publishedMainImage = await publishAssetIfNeeded({
      entry,
      publicPath: entry.mainImage.publicPath,
      s3Key: entry.mainImage.s3Key,
      message,
    });

    if (publishedMainImage) {
      newlyPublishedFiles.push(publishedMainImage);
    }
  }

  for (const image of entry.markdownImages ?? []) {
    if (!image.publicPath || !image.s3Key) continue;

    const publishedMarkdownImage = await publishAssetIfNeeded({
      entry,
      publicPath: image.publicPath,
      s3Key: image.s3Key,
      message,
    });

    if (publishedMarkdownImage) {
      newlyPublishedFiles.push(publishedMarkdownImage);
    }
  }

  for (const image of entry.galleryImages ?? []) {
    if (!image.publicPath || !image.s3Key) continue;

    const publishedGalleryImage = await publishAssetIfNeeded({
      entry,
      publicPath: image.publicPath,
      s3Key: image.s3Key,
      message,
    });

    if (publishedGalleryImage) {
      newlyPublishedFiles.push(publishedGalleryImage);
    }
  }

  const mdxRepoPath = getEntryMdxRepoPath(entry);
  const mdxContent = buildMdxContent(entry);
  const mdxBase64 = Buffer.from(mdxContent, "utf8").toString("base64");

  const mdxResult = await putGithubFile({
    path: mdxRepoPath,
    contentBase64: mdxBase64,
    message,
  });

  newlyPublishedFiles.push({
    path: mdxRepoPath,
    htmlUrl: mdxResult.content?.html_url,
    commitUrl: mdxResult.commit?.html_url,
  });

  /**
   * Delete gallery files that were removed during editing.
   * Do this after writing the new MDX so the entry frontmatter no longer
   * references the deleted images.
   */
  const deletedRepoPaths = new Set(
    (entry.publishedFilesToDelete ?? []).filter(
      (repoPath) =>
        repoPath !== mdxRepoPath &&
        !newlyPublishedFiles.some((file) => file.path === repoPath),
    ),
  );

  for (const repoPath of deletedRepoPaths) {
    await deleteGithubFile({
      path: repoPath,
      message: `Remove gallery image: ${entry.title}`,
    });
  }

  const remainingExistingFiles = (entry.publishedFiles ?? []).filter(
    (file) => !deletedRepoPaths.has(file.path),
  );

  return mergePublishedFiles(remainingExistingFiles, newlyPublishedFiles);
}