// src/app/world-information/[slug]/page.tsx

import MarkdownOnlyLayout from "@/components/entry-Layout/MarkdownOnlyLayout";
import {
  getWorldInformationEntry,
  getWorldInformationStaticParams,
} from "@/lib/world-information";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getWorldInformationStaticParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const entry = getWorldInformationEntry(slug);

  if (!entry) {
    return {
      title: "World Information Entry Not Found",
    };
  }

  return {
    title: `${entry.title} | World Information`,
  };
}

export default async function WorldInformationEntryPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const entry = getWorldInformationEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <MarkdownOnlyLayout
      markdownSection={<MDXRemote source={entry.content} />}
    />
  );
}