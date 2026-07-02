// src/app/codex/[category]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import CodexEntryLayout from "@/components/codex/CodexEntryLayout";
import CreatureEntryTemplate from "@/components/codex/entry-templates/CreatureEntryTemplate";
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
    description: entry.tags.join(", "),
  };
}

export default async function CodexEntryPage({ params }: PageProps) {
  const { category, slug } = await params;
  const entry = getCodexEntry(category, slug);

  if (!entry) {
    notFound();
  }

  if (entry.category !== "creatures") {
    notFound();
  }

  return (
    <CodexEntryLayout
      structuredSection={<CreatureEntryTemplate entry={entry} />}
      markdownSection={<MDXRemote source={entry.content} />}
    />
  );
}