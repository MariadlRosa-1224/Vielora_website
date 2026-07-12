// src/lib/lore.ts

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { LoreCardVariant, LoreIndexSection } from "@/components/lore/LoreIndexPage";



export type LoreKind = "timeline" | "extras" | "legends-and-folklore";

const LORE_DIR = path.join(process.cwd(), "content/lore");

const LORE_KIND_DIRS: Record<LoreKind, string> = {
  timeline: "timeline",
  extras: "extras",
  "legends-and-folklore": "legends-and-folklore",
};

export const lorePageConfig: Record<
  LoreKind,
  {
    title: string;
    description: string;
    baseHref: string;
  }
> = {
  timeline: {
    title: "Roleplay Timeline",
    description:
      "This is a summary of the previous events within the server and the consequences they had within the server going forward. Now it is empty, but it is within all of us to fill this page with our story.",
    baseHref: "/lore/timeline",
  },
  extras: {
    title: "Lore Extras",
    description:
      "Additional information, notes, and smaller pieces of lore that expand the world without being part of the main timeline.",
    baseHref: "/lore/extras",
  },
  "legends-and-folklore": {
    title: "Legends and Folklore",
    description:
      "Stories, myths, legends, and cultural tales told by the people of Vielora.",
    baseHref: "/lore/legends-and-folklore",
  },
};

const loreVariantSchema = z.enum([
  "cyan",
  "purple",
  "red",
  "blue",
  "coral",
  "aqua",
]);

const loreEntrySchema = z.object({
  title: z.string(),
  slug: z.string(),
  kind: z.enum(["timeline", "extras", "legends-and-folklore"]),
  section: z.string().default("Entries"),
  summary: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  variant: loreVariantSchema.default("purple"),
  order: z.coerce.number().default(999),
  draft: z.boolean().default(false),
});

export type LoreEntry = z.infer<typeof loreEntrySchema> & {
  href: string;
  content: string;
};

export type LoreEntryMeta = Omit<LoreEntry, "content">;

function getMdxFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMdxFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      return [fullPath];
    }

    return [];
  });
}

function readLoreEntry(filePath: string): LoreEntry {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);

  const normalizedData = {
    ...data,
    slug: String(data.slug ?? "").toLowerCase(),
    kind: String(data.kind ?? "").toLowerCase(),
  };

  const result = loreEntrySchema.safeParse(normalizedData);

  if (!result.success) {
    console.error("Invalid lore entry:", filePath);
    console.error("Frontmatter:", data);
    console.error("Zod issues:", result.error.issues);

    throw new Error(
      `Invalid lore frontmatter in ${path.relative(
        process.cwd(),
        filePath,
      )}. Check the terminal for details.`,
    );
  }

  const parsed = result.data;
  const config = lorePageConfig[parsed.kind];

  return {
    ...parsed,
    href: `${config.baseHref}/${parsed.slug}`,
    content,
  };
}

export function getAllLoreEntries(): LoreEntry[] {
  return Object.entries(LORE_KIND_DIRS)
    .flatMap(([kind, folder]) => {
      const directory = path.join(LORE_DIR, folder);

      return getMdxFiles(directory).map(readLoreEntry);
    })
    .filter((entry) => !entry.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getLoreEntriesByKind(kind: LoreKind): LoreEntryMeta[] {
  const folder = LORE_KIND_DIRS[kind];
  const directory = path.join(LORE_DIR, folder);

  return getMdxFiles(directory)
    .map(readLoreEntry)
    .filter((entry) => !entry.draft)
    .filter((entry) => entry.kind === kind)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map(({ content, ...meta }) => meta);
}

export function getLoreEntry(kind: LoreKind, slug: string): LoreEntry | null {
  const folder = LORE_KIND_DIRS[kind];
  const directory = path.join(LORE_DIR, folder);
  const normalizedSlug = slug.toLowerCase();

  return (
    getMdxFiles(directory)
      .map(readLoreEntry)
      .filter((entry) => !entry.draft)
      .find(
        (entry) => entry.kind === kind && entry.slug === normalizedSlug,
      ) ?? null
  );
}

export function getLoreIndexSections(kind: LoreKind): LoreIndexSection[] {
  const entries = getLoreEntriesByKind(kind);

  const sections = new Map<string, LoreIndexSection>();

  for (const entry of entries) {
    if (!sections.has(entry.section)) {
      sections.set(entry.section, {
        id: slugify(entry.section),
        title: entry.section,
        entries: [],
      });
    }

    sections.get(entry.section)!.entries.push({
      id: entry.slug,
      title: entry.title,
      text: entry.summary,
      image: entry.image,
      imageAlt: entry.imageAlt,
      href: entry.href,
      variant: entry.variant as LoreCardVariant,
    });
  }

  return Array.from(sections.values());
}

export function getLoreStaticParams(kind: LoreKind) {
  return getLoreEntriesByKind(kind).map((entry) => ({
    slug: entry.slug,
  }));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}