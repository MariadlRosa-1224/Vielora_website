// src/app/characters/[slug]/page.tsx

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import DualEntryLayout from "@/components/entry-Layout/DualEntryLayout";
import CharacterEntryTemplate from "@/components/characters/CharacterEntryTemplate";
import {
  getAllCharacterEntries,
  getCharacterEntry,
} from "@/lib/characters";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  const entries = getAllCharacterEntries();

  console.log(
    "Generated character slugs:",
    entries.map((entry) => entry.slug),
  );

  return entries.map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entry = getCharacterEntry(slug);

  console.log(`Generating metadata for character: ${entry?.title || slug}`);

  if (!entry) {
    return {
      title: "Character Not Found",
    };
  }

  return {
    title: `${entry.title} | Characters`,
    description: entry.description,
  };
}

export default async function CharacterPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getCharacterEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <DualEntryLayout
      structuredSection={<CharacterEntryTemplate entry={entry} />}
      markdownSection={<MDXRemote source={entry.content} />}
    />
  );
}