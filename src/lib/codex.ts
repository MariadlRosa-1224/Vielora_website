import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";


const CODEX_DIR = path.join(process.cwd(), "content/codex");

const stringListSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return ["None"];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    return [value];
  }

  return value;
}, z.array(z.string()));

// Schemas for different codex entry types

const commonCodexSchema = z.object({
  title: z.string(),
  author: z.string(),
  slug: z.string(),
  category: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  draft: z.boolean().default(false),
});

const creatureEntrySchema = commonCodexSchema.extend({
  category: z.literal("creatures"),

  location: z.string(),
  rarity: z.string(),
  tameability: z.string(),
  rank: z.string(),
  dangerLevel: z.union([z.string(), z.number()]).transform(String),

  aspects: stringListSchema.default(["None"]),
  loot: stringListSchema.default(["None"]),

  stats: z.object({
    strength: z.coerce.number(),
    speed: z.coerce.number(),
    durability: z.coerce.number(),
    magic: z.coerce.number(),
    intellect: z.coerce.number(),
    senses: z.coerce.number(),
  }),

  abilities: stringListSchema.default(["None"]),
});


const spellEntrySchema = commonCodexSchema.extend({
  category: z.literal("spells"),

  stat: z.string(),
  school: z.string(),
  rank: z.string(),
  caliber: z.string(),

  costs: stringListSchema.default(["None"]),
  downsides: stringListSchema.default(["None"]),
  cooldowns: stringListSchema.default(["None"]),
  requirements: stringListSchema.default(["None"]),
});

const techniqueEntrySchema = commonCodexSchema.extend({
  category: z.literal("techniques"),
  
  stat: z.string(),
  school: z.string(),
  rank: z.string(),
  caliber: z.string(),

  costs: stringListSchema.default(["None"]),
  downsides: stringListSchema.default(["None"]),
  cooldowns: stringListSchema.default(["None"]),
  requirements: stringListSchema.default(["None"]),
});

const FloraEntrySchema = commonCodexSchema.extend({
  category: z.literal("flora"),

  origin: z.string(),
  location: z.string(),
  rarity: z.string(),

  cost: stringListSchema.default(["None"]),
  Consumption: stringListSchema.default(["None"]),
  properties: stringListSchema.default(["None"]),
});

const MineralEntrySchema = commonCodexSchema.extend({
  category: z.literal("minerals"),
  
  location: z.string(),
  rarity: z.string(),
  mineralType: z.string(),
  density: z.string(),
  hardness: z.string(),
  solubility: z.string(),
  reactivity: z.string(),
  magicalReactivity: z.string(),
  meltingPoint: z.string(),

  cost: stringListSchema.default(["None"]),
  properties: stringListSchema.default(["None"]),
});

const PotionEntrySchema = commonCodexSchema.extend({
  category: z.literal("potions"),

  availability: z.string(),
  rarity: z.string(),

  craftability: stringListSchema.default(["None"]),
  cost: stringListSchema.default(["None"]),
  downsides: stringListSchema.default(["None"]),
  cooldowns: stringListSchema.default(["None"]),
  requirements: stringListSchema.default(["None"]),
});

const ItemEntrySchema = commonCodexSchema.extend({
  category: z.literal("items"),

  rarity: z.string(),
  location: z.string(),
  availability: z.string(),

  Cost: stringListSchema.default(["None"]),
  craftability: stringListSchema.default(["None"]),
});

const RuneEntrySchema = commonCodexSchema.extend({
  category: z.literal("runes"),

  stat: z.string(),
  school: z.string(),
  rank: z.string(),
  caliber: z.string(),

  costs: stringListSchema.default(["None"]),
  downsides: stringListSchema.default(["None"]),
  cooldowns: stringListSchema.default(["None"]),
  requirements: stringListSchema.default(["None"]),

  duration: z.string(),
  placement: z.string(),
});

const codexEntrySchema = z.union([creatureEntrySchema, spellEntrySchema, techniqueEntrySchema, FloraEntrySchema, MineralEntrySchema, PotionEntrySchema, ItemEntrySchema, RuneEntrySchema]);

export type CodexEntryData = z.infer<typeof codexEntrySchema>;

export type CodexEntry = CodexEntryData & {
  href: string;
  content: string;
};

export type CodexEntryMeta = CodexEntryData & {
  href: string;
};

// function to recursively get all .mdx files in a directory
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

  const normalizedData = {
    ...data,
    category: String(data.category ?? "").toLowerCase(),
    slug: String(data.slug ?? "").toLowerCase(),
  };

  const result = codexEntrySchema.safeParse(normalizedData);

  if (!result.success) {
    console.error("Invalid codex entry:", filePath);
    console.error("Frontmatter:", data);
    console.error("Zod issues:", result.error.issues);

    throw new Error(
      `Invalid codex frontmatter in ${path.relative(
        process.cwd(),
        filePath,
      )}. Check the terminal for details.`,
    );
  }

  const parsed = result.data;

  return {
    ...parsed,
    href: `/codex/${parsed.category}/${parsed.slug}`,
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