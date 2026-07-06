// src/app/codex/[category]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodexEntryLayout from "@/components/codex/CodexEntryLayout";
import CreatureEntryTemplate from "@/components/codex/entry-templates/CreatureEntryTemplate";
import FloraEntryTemplate from "@/components/codex/entry-templates/FloraEntryTemplate";
import ItemEntryTemplate from "@/components/codex/entry-templates/ItemEntryTemplate";
import MineralsEntryTemplate from "@/components/codex/entry-templates/MineralsEntryTemplate";
import PotionEntryTemplate from "@/components/codex/entry-templates/PotionEntryTemplate";
import RuneEntryTemplate from "@/components/codex/entry-templates/RuneEntryTemplate";
import TechniqueEntryTemplate from "@/components/codex/entry-templates/TechniqueEntryTemplate";
import SpellEntryTemplate from "@/components/codex/entry-templates/SpellEntryTemplate";
import { getAllCodexEntries, getCodexEntry } from "@/lib/codex";

type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCodexEntries().map((entry) => ({
    category: entry.category,
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const entry = getCodexEntry(category, slug);

  if (!entry) {
    return {
      title: "Codex Entry Not Found",
    };
  }

  return {
    title: `${entry.title} | Codex`,
  };
}

export default async function CodexEntryPage({ params }: PageProps) {
  const { category, slug } = await params;
  const entry = getCodexEntry(category, slug);

  if (!entry) {
    notFound();
  }

  let structuredSection: React.ReactNode;

  switch (entry.category) {
    case "creatures":
      structuredSection = <CreatureEntryTemplate entry={entry} />;
      break;

    case "spells":
      structuredSection = <SpellEntryTemplate entry={entry} />;
      break;

    case "techniques":
      structuredSection = <TechniqueEntryTemplate entry={entry} />;
      break;

    case "potions":
      structuredSection = <PotionEntryTemplate entry={entry} />;
      break;

    case "minerals":
      structuredSection = <MineralsEntryTemplate entry={entry} />;
      break;

    case "flora":
      structuredSection = <FloraEntryTemplate entry={entry} />;
      break;

    case "runes":
      structuredSection = <RuneEntryTemplate entry={entry} />;
      break;

    case "items":
      structuredSection = <ItemEntryTemplate entry={entry} />;
      break;

    default:
      notFound();
  }

  return (
    <CodexEntryLayout
      structuredSection={structuredSection}
      markdownSection={<MDXRemote source={entry.content} />}
    />
  );
}