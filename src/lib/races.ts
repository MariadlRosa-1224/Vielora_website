// src/lib/races.ts

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { raceOrigins } from "@/lib/race-origins";

const RACES_DIR = path.join(process.cwd(), "content/races");



const stringArraySchema = z.preprocess((value) => {
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

const raceWeaknessSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
});

const legacyRaceWeaknessSchema = z.object({
  id: z.string(),
  label: z.string(),
  content: z.string(),
});

const raceSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.union([
    z.string(),
    z.array(legacyRaceWeaknessSchema),
  ]),
});



const raceAbilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.union([z.string(), z.number()]).transform(String),
  branch: stringArraySchema.default([]),
  order: z.coerce.number(),

  // Requisitos reales para desbloquear.
  requires: stringArraySchema.default([]),

  // "all" = necesita todas.
  // "any" = necesita una de ellas.
  requiresMode: z.enum(["all", "any"]).default("all"),

  // Conexiones visuales del árbol.
  follows: stringArraySchema.default([]),

  description: z.string(),
});

const raceAbilityTreeSchema = z.object({
  levels: z.array(
    z.object({
      id: z.union([z.string(), z.number()]).transform(String),
      label: z.string(),
    }),
  ),

  abilities: z.array(raceAbilitySchema),
});

const raceEntrySchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.literal("races"),
  origin: z.string(),

  image: z.string(),
  imageAlt: z.string(),

  draft: z.boolean().default(false),

  size: z.string().default("Unknown"),
  lifespan: z.string().default("Unknown"),

  summary: z.string().optional(),

  description: z.string().optional(),
  history: z.string().optional(),

  weaknesses: z.array(raceWeaknessSchema).default([]),

  sections: z.array(raceSectionSchema).default([]),

  galleryImages: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
        label: z.string().optional(),
      }),
    )
    .default([]),

  abilityTree: raceAbilityTreeSchema,
});

export type RaceWeakness = z.infer<typeof raceWeaknessSchema>;
export type RaceAbility = z.infer<typeof raceAbilitySchema>;
export type RaceAbilityTree = z.infer<typeof raceAbilityTreeSchema>;

type RawRaceEntry = z.infer<typeof raceEntrySchema>;

export type RaceEntry = Omit<
  RawRaceEntry,
  "description" | "history" | "weaknesses"
> & {
  description: string;
  history: string;
  weaknesses: RaceWeakness[];
  href: string;
  content: string;
};

export type RaceEntryMeta = Omit<RaceEntry, "content">;

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

function readRaceEntry(filePath: string): RaceEntry {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);

  const normalizedData = {
    ...data,
    category: String(data.category ?? "").toLowerCase(),
    slug: String(data.slug ?? "").toLowerCase(),
  };

  const result = raceEntrySchema.safeParse(normalizedData);

  if (!result.success) {
    console.error("Invalid race entry:", filePath);
    console.error("Frontmatter:", data);
    console.error("Zod issues:", result.error.issues);

    throw new Error(
      `Invalid race frontmatter in ${path.relative(
        process.cwd(),
        filePath,
      )}. Check the terminal for details.`,
    );
  }

  const parsed = result.data;

  const description =
    parsed.description ?? getStringSectionContent(parsed.sections, "description");

  const history =
    parsed.history ?? getStringSectionContent(parsed.sections, "history");

  const weaknesses =
    parsed.weaknesses.length > 0
      ? parsed.weaknesses
      : getWeaknessesFromLegacySections(parsed.sections);

  return {
    ...parsed,
    description,
    history,
    weaknesses,
    href: `/races/${parsed.slug}`,
    content,
  };
}

function getStringSectionContent(
  sections: z.infer<typeof raceSectionSchema>[],
  sectionId: string,
) {
  const section = sections.find((item) => item.id === sectionId);

  if (!section) {
    return "";
  }

  return typeof section.content === "string" ? section.content : "";
}

function getWeaknessesFromLegacySections(
  sections: z.infer<typeof raceSectionSchema>[],
): RaceWeakness[] {
  const weaknessSection = sections.find((section) => section.id === "weaknesses");

  if (!weaknessSection) {
    return [];
  }

  if (typeof weaknessSection.content === "string") {
    return [
      {
        id: "weaknesses",
        title: "Weaknesses",
        description: weaknessSection.content,
      },
    ];
  }

  return weaknessSection.content.map((weakness) => ({
    id: weakness.id,
    title: weakness.label,
    description: weakness.content,
  }));
}

export function getAllRaceEntries(): RaceEntry[] {
  return getMdxFiles(RACES_DIR)
    .map(readRaceEntry)
    .filter((entry) => !entry.draft)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getRaceEntry(slug: string): RaceEntry | null {
  const normalizedSlug = slug.toLowerCase();

  return (
    getAllRaceEntries().find((entry) => entry.slug === normalizedSlug) ?? null
  );
}

export function getRaceEntriesByCategorySlug(categorySlug: string): RaceEntry[] {
  const category = raceOrigins.find((item) => item.slug === categorySlug);

  if (!category) {
    return [];
  }

  return getAllRaceEntries().filter(
    (race) => race.origin.toLowerCase() === category.origin.toLowerCase(),
  );
}