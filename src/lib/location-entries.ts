// src/lib/location-entries.ts

import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

// Define the directory where location entries are stored
const LOCATIONS_DIR = path.join(process.cwd(), "content/locations");


// Define the schema for validating location entry frontmatter
const locationEntrySchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string().default(""),
  order: z.coerce.number().default(999),
  image: z.string().default(""),
  draft: z.boolean().default(false),
});


// Define the types for location entries and their metadata
export type LocationEntry = z.infer<typeof locationEntrySchema> & {
  location: string;
  href: string;
  content: string;
};

// Define the type for location entry metadata, omitting the content field
export type LocationEntryMeta = Omit<LocationEntry, "content">;


// Function to recursively get all .mdx files in a directory
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

// Function to read and parse a location entry from a file
function readLocationEntry(filePath: string): LocationEntry {
  const rawFile = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(rawFile);

  const relativePath = path.relative(LOCATIONS_DIR, filePath);
  const [locationFolder] = relativePath.split(path.sep);

  const normalizedData = {
    ...data,
    slug: String(data.slug ?? "").toLowerCase(),
  };

  const result = locationEntrySchema.safeParse(normalizedData);

  if (!result.success) {
    console.error("Invalid location entry:", filePath);
    console.error("Frontmatter:", data);
    console.error("Zod issues:", result.error.issues);

    throw new Error(
      `Invalid location frontmatter in ${path.relative(
        process.cwd(),
        filePath,
      )}. Check the terminal for details.`,
    );
  }

  const parsed = result.data;
  const location = locationFolder.toLowerCase();

  return {
    ...parsed,
    location,
    href: `/locations/${location}/${parsed.slug}`,
    content,
  };
}

// Function to get all location entries, filtering out drafts and sorting them
export function getAllLocationEntries(): LocationEntry[] {
  return getMdxFiles(LOCATIONS_DIR)
    .map(readLocationEntry)
    .filter((entry) => !entry.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}


// Function to get location entries by location, returning only metadata
export function getLocationEntriesByLocation(
  location: string,
): LocationEntryMeta[] {
  const normalizedLocation = location.toLowerCase();

  return getAllLocationEntries()
    .filter((entry) => entry.location === normalizedLocation)
    .map(({ content, ...meta }) => meta);
}

// Function to get a specific location entry by location and slug
export function getLocationEntry(
  location: string,
  slug: string,
): LocationEntry | null {
  const normalizedLocation = location.toLowerCase();
  const normalizedSlug = slug.toLowerCase();

  return (
    getAllLocationEntries().find(
      (entry) =>
        entry.location === normalizedLocation && entry.slug === normalizedSlug,
    ) ?? null
  );
}

// Function to generate static parameters for all location entries
export function getLocationEntryStaticParams() {
  return getAllLocationEntries().map((entry) => ({
    location: entry.location,
    slug: entry.slug,
  }));
}

// Function to get location entry links for a specific location
export function getLocationEntryLinks(location: string) {
  return getLocationEntriesByLocation(location).map((entry) => ({
    id: entry.slug,
    title: entry.title,
    href: entry.href,
  }));
}