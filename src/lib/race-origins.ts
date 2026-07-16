// src/lib/race-origins.ts

import type {VieloraHorizontalGradient} from "@/theme/colors";

export type RaceOrigin = {
  name: string;
  slug: string;
  title: string;
  href: string;
  origin: string;
  description: string;
  backgroundImage: string;
  gradient: VieloraHorizontalGradient;
  icon: string;
};

export const racesOriginsList = [
  "remnants",
  "ethereals",
  "wilders",
  "nyxkins",
  "graveborns",
  "interwined",
  "dysphorians",
]

export const raceOrigins: RaceOrigin[] = [
  {
    name: "Ethereals",
    slug: "ethereals",
    title: "Ethereals",
    href: "/races/ethereals",
    origin: "Ethereal",
    gradient: "parchmentHorizontal",
    icon: "/images/icons/races/ethereals.png",
    backgroundImage: "/images/races/ethereals/ethereals.jpg",
    description:
      "Ethereals are races remarkable from their magical or mana related origin, they ofthen possess great magical abilities.",
  },
  {
    name: "Remnants",
    slug: "remnants",
    title: "Remnants",
    href: "/races/remnants",
    origin: "Remnant",
gradient: "skyBlueHorizontal",
    icon: "/images/icons/races/remnants.png",
    backgroundImage: "/images/races/remnants/remnants.jpg",
    description:
      "Remnants are a set of races which in one way of another resemble humanity and elements of the human era magical and technological.",
  },
  {
    name: "Wilders",
    slug: "wilders",
    title: "Wilders",
    href: "/races/wilders",
    origin: "Wilder",
    gradient: "aquaHorizontal",
    icon: "/images/icons/races/wilders.png",
    backgroundImage: "/images/races/wilders/wilders.jpg",
    description:
      "Wilders are races that have a strong connection to nature, resembling fauna and flora, from the sky, the land and the sea.",
  },
  {
    name: "Nyxkins",
    slug: "nyxkins",
    title: "Nyxkins",
    href: "/races/nyxkins",
    origin: "Nyxkin",
    gradient: "royalBlueHorizontal",
    icon: "/images/icons/races/nyxkins.png",
    backgroundImage: "/images/races/nyxkins/nyxkins.jpg",
    description:
      "The origin of nyxkins is a mystery, races that appeared suddenly at one point of history considered strange and often unconventional in nature.",
  },
  {
    name: "Graveborns",
    slug: "graveborns",
    title: "Graveborns",
    href: "/races/graveborns",
    origin: "Graveborn",
    backgroundImage: "/images/races/graveborns/graveborns.jpg",
     gradient: "violetHorizontal",
    icon: "/images/icons/races/graveborns.png",
    description:
      "Graveborns are beings marked by death, memory, and lingering souls. Their cultures are often tied to burial rites, ancestral magic, and the border between life and the afterlife.",
  },
  {
    name: "Interwined",
    slug: "interwined",
    title: "Interwined",
    href: "/races/interwined",
    origin: "Interwined",
    gradient: "coralHorizontal",
    icon: "/images/icons/races/interwined.png",
    backgroundImage: "/images/races/interwined/interwined.jpg",
    description:
      "Races that share trait and characteristics of two or more origins, often a result of interbreeding or magical influence.",
  },
  {
    name: "Dysphorians",
    slug: "dysphorians",
    title: "Dysphorians",
    href: "/races/dysphorians",
    origin: "Dysphorian",
    gradient: "roseHorizontal",
    icon: "/images/icons/races/dyphorians.png",
    backgroundImage: "/images/races/dysphorians/dysphorians.jpg",
    description:
      "Races created or infleanced by dark mana, appearance that is often disturbing and unnatural, and magic often associated with corruption and destruction.",
  },
];

export function getRaceOrigin(slug: string) {
  return raceOrigins.find((origin) => origin.slug === slug) ?? null;
}