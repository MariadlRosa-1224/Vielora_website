// src/lib/world-information.ts

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { vieloraGradients } from "@/theme/colors";

const WORLD_INFO_DIR = path.join(process.cwd(), "content/world-information");

const worldInformationEntrySchema = z.object({
  title: z.string(),
  slug: z.string(),
  section: z.string().default("General"),

  summary: z.string().default(""),
  image: z.string(),
  imageAlt: z.string().default("World information entry"),

  gradient: z.string().default("blueVertical"),
  order: z.coerce.number().default(999),

  href: z.string().optional(),

  draft: z.boolean().default(false),
});

export type WorldInformationEntry = Omit<
  z.infer<typeof worldInformationEntrySchema>,
  "gradient"
> & {
  gradient: keyof typeof vieloraGradients;
  href: string;
  content: string;
};

export type WorldInformationEntryMeta = Omit<
  WorldInformationEntry,
  "content"
>;

export type WorldInformationSection = {
  id: string;
  title: string;
  entries: WorldInformationEntryMeta[];
};

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

function readWorldInformationEntry(filePath: string): WorldInformationEntry {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);

  const normalizedData = {
    ...data,
    slug: String(data.slug ?? "").toLowerCase(),
  };

  const result = worldInformationEntrySchema.safeParse(normalizedData);

  if (!result.success) {
    console.error("Invalid world information entry:", filePath);
    console.error("Frontmatter:", data);
    console.error("Zod issues:", result.error.issues);

    throw new Error(
      `Invalid world information frontmatter in ${path.relative(
        process.cwd(),
        filePath,
      )}. Check the terminal for details.`,
    );
  }

  const parsed = result.data;

  const gradient = isGradientName(parsed.gradient)
    ? parsed.gradient
    : "blueVertical";

  return {
    ...parsed,
    gradient,
    href: parsed.href ?? `/world-information/${parsed.slug}`,
    content,
  };
}

export function getAllWorldInformationEntries(): WorldInformationEntry[] {
  return getMdxFiles(WORLD_INFO_DIR)
    .map(readWorldInformationEntry)
    .filter((entry) => !entry.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getWorldInformationEntry(
  slug: string,
): WorldInformationEntry | null {
  const normalizedSlug = slug.toLowerCase();

  return (
    getAllWorldInformationEntries().find(
      (entry) => entry.slug === normalizedSlug,
    ) ?? null
  );
}

export function getWorldInformationSections(): WorldInformationSection[] {
  const entries = getAllWorldInformationEntries();

  const sections = new Map<string, WorldInformationSection>();

  for (const entry of entries) {
    if (!sections.has(entry.section)) {
      sections.set(entry.section, {
        id: slugify(entry.section),
        title: entry.section,
        entries: [],
      });
    }

    const { content, ...meta } = entry;

    sections.get(entry.section)!.entries.push(meta);
  }

  return Array.from(sections.values());
}

export function getWorldInformationStaticParams() {
  return getAllWorldInformationEntries()
    .filter((entry) => !entry.href.startsWith("/lore/"))
    .map((entry) => ({
      slug: entry.slug,
    }));
}

function isGradientName(value: string): value is keyof typeof vieloraGradients {
  return value in vieloraGradients;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}