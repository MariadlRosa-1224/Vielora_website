// src/app/locations/[location]/page.tsx

import { notFound } from "next/navigation";
import MainLocationPage from "@/components/locations/MainLocationPage";
import { getMainLocation, mainLocations } from "@/lib/main-locations";
import { getLocationEntryLinks } from "@/lib/location-entries";

type PageProps = {
  params: Promise<{
    location: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return mainLocations.map((mainLocation) => ({
    location: mainLocation.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { location } = await params;
  const currentLocation = getMainLocation(location);

  if (!currentLocation) {
    return {
      title: "Location Not Found",
    };
  }

  return {
    title: `${currentLocation.title} | Locations`,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { location } = await params;
  const currentLocation = getMainLocation(location);

  if (!currentLocation) {
    notFound();
  }

  const mdxSubLocations = getLocationEntryLinks(location);

  return (
    <MainLocationPage
      title={currentLocation.title}
      description={currentLocation.description}
      backgroundImage={currentLocation.backgroundImage}
      mapImage={currentLocation.mapImage}
      mapAlt={currentLocation.mapAlt}
      entryHref={currentLocation.entryHref}
      subLocations={
        mdxSubLocations.length > 0
          ? mdxSubLocations
          : currentLocation.subLocations
      }
    />
  );
}