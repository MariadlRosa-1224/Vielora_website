// src/lib/main-locations.ts

import type { MainLocationPageProps } from "@/components/locations/MainLocationPage";

export type MainLocation = MainLocationPageProps & {
  slug: string;
};

export const mainLocations: MainLocation[] = [
  {
    slug: "the-ruins",
    title: "(Selected Area)",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est. Sed et sem sem. Nunc ultricies lorem at sapien iaculis facilisis. Ut nulla magna, luctus eu lacinia et, ullamcorper sed nulla. Etiam et mattis sem. Nulla porta lorem egestas orci iaculis, sed placerat lacus molestie.",
    backgroundImage: "/images/locations/the-ruins/background.jpg",
    mapImage: "/images/locations/the-ruins/map.jpg",
    mapAlt: "Map of The Ruins",
    entryHref: "/locations/the-ruins/the-ruins",
    subLocations: [
      {
        id: "location-1",
        title: "Location 1",
        href: "/locations/the-ruins/location-1",
      },
      {
        id: "location-2",
        title: "Location 2",
        href: "/locations/the-ruins/location-2",
      },
      {
        id: "location-3",
        title: "Location 3",
        href: "/locations/the-ruins/location-3",
      },
    ],
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
    subLocations: [
      {
        id: "flame-capital",
        title: "Flame Capital",
        href: "/locations/the-land-of-flames/flame-capital",
      },
      {
        id: "ash-fields",
        title: "Ash Fields",
        href: "/locations/the-land-of-flames/ash-fields",
      },
    ],
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
    subLocations: [
      {
        id: "hollow-capital",
        title: "The Hollow Capital",
        href: "/locations/the-hollow-capital/hollow-capital",
      },
      {
        id: "mirror-coast",
        title: "The Mirror Coast",
        href: "/locations/the-inverted/mirror-coast",
      },
    ],
  },
];

export function getMainLocation(slug: string) {
  return mainLocations.find((location) => location.slug === slug) ?? null;
}