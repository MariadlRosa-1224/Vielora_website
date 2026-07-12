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
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est. Sed et sem sem. Nunc ultricies lorem at sapien iaculis facilisis. Ut nulla magna, luctus eu lacinia et, ullamcorper sed nulla. Etiam et mattis sem. Nulla porta lorem egestas orci iaculis, sed placerat lacus molestie.",
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
      "A land shaped by heat, fire, ash, and ancient power. This text can later come from the main location .mdx entry.",
    backgroundImage: "/images/locations/the-land-of-flames/background.jpg",
    mapImage: "/images/locations/the-land-of-flames/map.jpg",
    mapAlt: "Map of The Land of Flames",
    entryHref: "/locations/the-land-of-flames/the-land-of-flames",
    subLocations: [],
  },
  {
    slug: "the-hollow-capital",
    title: "The Hollow Capital",
    description:
      "A strange and unstable region where familiar laws of the world begin to twist.",
    backgroundImage: "/images/locations/the-hollow-capital/background.jpg",
    mapImage: "/images/locations/the-hollow-capital/map.jpg",
    mapAlt: "Map of The Hollow Capital",
    entryHref: "/locations/the-hollow-capital/the-hollow-capital",
    subLocations: [],
  },
];

export function getMainLocation(slug: string) {
  return mainLocations.find((location) => location.slug === slug) ?? null;
}