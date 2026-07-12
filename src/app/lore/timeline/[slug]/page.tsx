// src/app/lore/timeline/[slug]/page.tsx

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
  return getLoreStaticParams("timeline");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entry = getLoreEntry("timeline", slug);

  if (!entry) {
    return {
      title: "Timeline Entry Not Found",
    };
  }

  return {
    title: `${entry.title} | Timeline`,
  };
}

export default async function TimelineEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getLoreEntry("timeline", slug);

  if (!entry) {
    notFound();
  }

  return (
    <MarkdownOnlyLayout
      markdownSection={<MDXRemote source={entry.content} />}
    />
  );
}