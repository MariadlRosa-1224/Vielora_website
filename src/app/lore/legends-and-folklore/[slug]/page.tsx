// src/app/lore/legends-and-folklore/[slug]/page.tsx

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
  return getLoreStaticParams("legends-and-folklore");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entry = getLoreEntry("legends-and-folklore", slug);

  if (!entry) {
    return {
      title: "Legend Entry Not Found",
    };
  }

  return {
    title: `${entry.title} | Legends and Folklore`,
  };
}

export default async function LegendsEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getLoreEntry("legends-and-folklore", slug);

  if (!entry) {
    notFound();
  }

  return (
    <MarkdownOnlyLayout
      markdownSection={<MDXRemote source={entry.content} />}
    />
  );
}