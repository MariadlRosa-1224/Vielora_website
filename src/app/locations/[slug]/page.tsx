// src/app/locations/[slug]/page.tsx

import { notFound } from "next/navigation";
import MainLocationPage from "@/components/locations/MainLocationPage";
import { getMainLocation, mainLocations } from "@/lib/main-locations";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return mainLocations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const location = getMainLocation(slug);

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  return {
    title: `${location.title} | Locations`,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = getMainLocation(slug);

  if (!location) {
    notFound();
  }

  return (
    <MainLocationPage
      title={location.title}
      description={location.description}
      backgroundImage={location.backgroundImage}
      mapImage={location.mapImage}
      mapAlt={location.mapAlt}
      entryHref={location.entryHref}
      subLocations={location.subLocations}
    />
  );
}