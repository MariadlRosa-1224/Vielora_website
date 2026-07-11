// src/lib/race-origins.ts

export type RaceOrigin = {
  slug: string;
  title: string;
  origin: string;
  description: string;
  backgroundImage: string;
};

export const raceOrigins: RaceOrigin[] = [
  {
    slug: "ethereals",
    title: "Ethereals",
    origin: "Ethereal",
    backgroundImage: "/images/races/ethereals/ethereals.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    slug: "remnants",
    title: "Remnants",
    origin: "Remnant",
    backgroundImage: "/images/races/remnants/remnants.jpg",
    description:
      "Remnants are the last of their kind, carrying the weight of their past and the mystery of their origins.",
  },
];

export function getRaceOrigin(slug: string) {
  return raceOrigins.find((origin) => origin.slug === slug) ?? null;
}