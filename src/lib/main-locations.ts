// src/lib/main-locations.ts

import type { MainLocationPageProps } from "@/components/locations/MainLocationPage";

export type MainLocation = MainLocationPageProps & {
  slug: string;
  title: string;
  description: string;
  backgroudImage: string;
  mapImage: string;
  mapAlt: string;
  entryHref: string;
  subLocations: [],
};


export const mainLocations = [
  {

    slug: "the-ruins",
    title: "The Ruins",
    description:
      "The continent where most of humanity ruins reside, a place of mystery and danger.",
    backgroundImage: "/images/locations/the-ruins/background.jpg",
    mapImage: "/images/locations/the-ruins/map.jpg",
    mapAlt: "Map of The Ruins",
    entryHref: "/locations/the-ruins/the-ruins",
    subLocations: [],
  },
  {
    slug: "the-land-of-flames",
    title: "The Land of Flames",
    description:
      "A jungle where life thrives among the heat and flames.",
    backgroundImage: "/images/locations/the-land-of-flames/background.jpg",
    mapImage: "/images/locations/the-land-of-flames/map.jpg",
    mapAlt: "Map of The Land of Flames",
    entryHref: "/locations/the-land-of-flames/the-land-of-flames",
    subLocations: [],
  },
  {
    slug: "the-land-of-artisanry",
    title: "The Land of Artisanry",
    description:
      "A land shaped by creativity, craftsmanship, and innovation.",
    backgroundImage: "/images/locations/the-land-of-artisanry/background.jpg",
    mapImage: "/images/locations/the-land-of-artisanry/map.jpg",
    mapAlt: "Map of The Land of Artisanry",
    entryHref: "/locations/the-land-of-artisanry/the-land-of-artisanry",
    subLocations: [],
  },
  {
    slug: "the-land-of-will",
    title: "The Land of Will",
    description:
      "A land shaped by determination, resilience, and strength.",
    backgroundImage: "/images/locations/the-land-of-will/background.jpg",
    mapImage: "/images/locations/the-land-of-will/map.jpg",
    mapAlt: "Map of The Land of Will",
    entryHref: "/locations/the-land-of-will/the-land-of-will",
    subLocations: [],
  },
  {
    slug: "the-land-of-nature",
    title: "The Land of Nature",
    description:
      "A land shaped by the beauty and power of the natural world.",
    backgroundImage: "/images/locations/the-land-of-nature/background.jpg",
    mapImage: "/images/locations/the-land-of-nature/map.jpg",
    mapAlt: "Map of The Land of Nature",
    entryHref: "/locations/the-land-of-nature/the-land-of-nature",
    subLocations: [],
  },
  {
    slug: "the-land-of-fantasy",
    title: "The Land of Fantasy",
    description:
      "A land shaped by imagination, creativity, and wonder.",
    backgroundImage: "/images/locations/the-land-of-fantasy/background.jpg",
    mapImage: "/images/locations/the-land-of-fantasy/map.jpg",
    mapAlt: "Map of The Land of Fantasy",
    entryHref: "/locations/the-land-of-fantasy/the-land-of-fantasy",
    subLocations: [],
  },
  {
    slug: "the-land-of-knowledge",
    title: "The Land of Knowledge",
    description:
      "A land shaped by wisdom, learning, and discovery.",
    backgroundImage: "/images/locations/the-land-of-knowledge/background.jpg",
    mapImage: "/images/locations/the-land-of-knowledge/map.jpg",
    mapAlt: "Map of The Land of Knowledge",
    entryHref: "/locations/the-land-of-knowledge/the-land-of-knowledge",
    subLocations: [],
  },
  {
    slug: "the-land-of-judgement",
    title: "The Land of Judgement",
    description:
      "A land shaped by justice, fairness, and accountability.",
    backgroundImage: "/images/locations/the-land-of-judgement/background.jpg",
    mapImage: "/images/locations/the-land-of-judgement/map.jpg",
    mapAlt: "Map of The Land of Judgement",
    entryHref: "/locations/the-land-of-judgement/the-land-of-judgement",
    subLocations: [],
  },
  {
    slug: "the-frozen-north",
    title: "The Frozen North",
    description:
      "A land shaped by ice, snow, and harsh conditions.",
    backgroundImage: "/images/locations/the-frozen-north/background.jpg",
    mapImage: "/images/locations/the-frozen-north/map.jpg",
    mapAlt: "Map of The Frozen North",
    entryHref: "/locations/the-frozen-north/the-frozen-north",
    subLocations: [],
  },
  {
    slug: "other-locations",
    title: "Other Locations",
    description:
      "A collection of other locations that don't fit into the main categories.",
    backgroundImage: "/images/locations/other-locations/background.jpg",
    mapImage: "/images/locations/other-locations/map.jpg",
    mapAlt: "Map of Other Locations",
    entryHref: "/locations/other-locations/other-locations",
    subLocations: [],
  },
  
];

export function getMainLocation(slug: string) {
  return mainLocations.find((location) => location.slug === slug) ?? null;
}