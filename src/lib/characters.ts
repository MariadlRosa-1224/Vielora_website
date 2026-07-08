// src/lib/characters.ts

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CHARACTERS_DIR = path.join(process.cwd(), "content/lore/characters");

const stringListSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    return [value];
  }

  return value;
}, z.array(z.string()));

const galleryImageSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  label: z.string().optional(),
});

const characterEntrySchema = z.object({
  title: z.string(),
  slug: z.string(),

  name: z.string(),
  age: z.union([z.string(), z.number()]).transform(String),
  race: z.string(),
  gender: z.string(),
  occupation: z.string(),
  affiliations: stringListSchema.default([]),
  description: z.string(),

  image: z.string(),
  imageAlt: z.string(),

  galleryImages: z.array(galleryImageSchema).default([]),


  frame: z.string().default("/images/characters/frame.png"),
  locked: z.boolean().default(false),

  draft: z.boolean().default(false),
});

export type CharacterEntry = z.infer<typeof characterEntrySchema> & {
  href: string;
  content: string;
};

export type CharacterEntryMeta = Omit<CharacterEntry, "content">;

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

function readCharacterEntry(filePath: string): CharacterEntry {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);

  const normalizedData = {
    ...data,
    slug: String(data.slug ?? "").toLowerCase(),
  };

  const result = characterEntrySchema.safeParse(normalizedData);

  if (!result.success) {
    console.error("Invalid character entry:", filePath);
    console.error("Frontmatter:", data);
    console.error("Zod issues:", result.error.issues);

    throw new Error(
      `Invalid character frontmatter in ${path.relative(
        process.cwd(),
        filePath,
      )}. Check the terminal for details.`,
    );
  }

  const parsed = result.data;

  return {
    ...parsed,
    href: `/lore/characters/${parsed.slug}`,
    content,
  };
}

export function getAllCharacterEntries(): CharacterEntryMeta[] {
  return getMdxFiles(CHARACTERS_DIR)
    .map(readCharacterEntry)
    .filter((entry) => !entry.draft)
    .map(({ content, ...meta }) => meta)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCharacterEntry(slug: string): CharacterEntry | null {
  const normalizedSlug = slug.toLowerCase();

  const entries = getMdxFiles(CHARACTERS_DIR)
    .map(readCharacterEntry)
    .filter((entry) => !entry.draft);

  return entries.find((entry) => entry.slug === normalizedSlug) ?? null;
}