// src/app/races/[slug]/page.tsx

import { notFound } from "next/navigation";
import RaceOriginClient from "@/components/races/RaceOriginClient";
import { getRaceOrigin, raceOrigins } from "@/lib/race-origins";
import { getRaceEntriesByCategorySlug } from "@/lib/races";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return raceOrigins.map((origin) => ({
    slug: origin.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const origin = getRaceOrigin(slug);

  if (!origin) {
    return {
      title: "Race Origin Not Found",
    };
  }

  return {
    title: `${origin.title} | Races`,
  };
}

export default async function RaceCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const origin = getRaceOrigin(slug);

  if (!origin) {
    notFound();
  }

  const races = getRaceEntriesByCategorySlug(slug);

  return <RaceOriginClient category={origin} races={races} />;
}