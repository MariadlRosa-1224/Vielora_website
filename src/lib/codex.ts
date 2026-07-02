import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CODEX_DIR = path.join(process.cwd(), "content/codex");

const codexEntrySchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),

  image: z.string(),
  imageAlt: z.string(),

  location: z.string(),
  rarity: z.string(),
  tameability: z.string(),
  rank: z.string(),
  dangerLevel: z.union([z.string(), z.number()]).transform(String),

  aspects: z.array(z.string()).default([]),
  loot: z.string().default("None"),

  stats: z.object({
    strength: z.number(),
    speed: z.number(),
    durability: z.number(),
    magic: z.number(),
    intellect: z.number(),
    senses: z.number(),
  }),

  abilities: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type CodexEntry = z.infer<typeof codexEntrySchema> & {
  href: string;
  content: string;
};

export type CodexEntryMeta = Omit<CodexEntry, "content">;

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

function readCodexEntry(filePath: string): CodexEntry {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);

  const parsed = codexEntrySchema.parse(data);

  const category = parsed.category.toLowerCase();
  const slug = parsed.slug;

  return {
    ...parsed,
    category,
    slug,
    href: `/codex/${category}/${slug}`,
    content,
  };
}

export function getAllCodexEntries(): CodexEntryMeta[] {
  return getMdxFiles(CODEX_DIR)
    .map(readCodexEntry)
    .filter((entry) => !entry.draft)
    .map(({ content, ...meta }) => meta)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getCodexEntry(
  category: string,
  slug: string,
): CodexEntry | null {
  const normalizedCategory = category.toLowerCase();
  const normalizedSlug = slug.toLowerCase();

  const entries = getMdxFiles(CODEX_DIR)
    .map(readCodexEntry)
    .filter((entry) => !entry.draft);

  return (
    entries.find(
      (entry) =>
        entry.category === normalizedCategory &&
        entry.slug === normalizedSlug,
    ) ?? null
  );
}