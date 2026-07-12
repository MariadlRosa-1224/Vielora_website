// src/app/locations/[location]/[slug]/page.tsx

import MarkdownOnlyLayout from "@/components/entry-Layout/MarkdownOnlyLayout";
import {
  getLocationEntry,
  getLocationEntryStaticParams,
} from "@/lib/location-entries";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

type PageProps = {
  params: Promise<{
    location: string;
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocationEntryStaticParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { location, slug } = await params;
  const entry = getLocationEntry(location, slug);

  if (!entry) {
    return {
      title: "Location Entry Not Found",
    };
  }

  return {
    title: `${entry.title} | Locations`,
  };
}

export default async function LocationEntryPage({ params }: PageProps) {
  const { location, slug } = await params;
  const entry = getLocationEntry(location, slug);

  if (!entry) {
    notFound();
  }

  return (
    <MarkdownOnlyLayout
      markdownSection={<MDXRemote source={entry.content} />} pageBackground={entry.image}
    />
  );
}