// src/app/lore/extras/[slug]/page.tsx

import MarkdownOnlyLayout from "@/components/entry-Layout/MarkdownOnlyLayout";
import { getLoreEntry, getLoreStaticParams } from "@/lib/lore";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLoreStaticParams("extras");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entry = getLoreEntry("extras", slug);

  if (!entry) {
    return {
      title: "Extra Lore Entry Not Found",
    };
  }

  return {
    title: `${entry.title} | Lore Extras`,
  };
}

export default async function ExtrasEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getLoreEntry("extras", slug);

  if (!entry) {
    notFound();
  }

  return (
    <MarkdownOnlyLayout
      markdownSection={<MDXRemote source={entry.content} />}
    />
  );
}