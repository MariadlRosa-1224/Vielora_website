"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HorizontalColorButton from "@/components/HorizontalColorButton";
import GeneralContainerNoBorder from "@/components/GeneralContainerNoBorder";
import type { VieloraHorizontalGradient } from "@/theme/colors";

type RaceCard = {
  name: string;
  slug: string;
  href: string;
  image: string;
  description: string;
  gradient: VieloraHorizontalGradient;
  icon: string;
};

const defaultRace = {
  name: "(Hover Category)",
  href: "/races",
  image: "/images/races/place-holder-races.png",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est. Sed et sem sem. Nunc ultricies lorem ut sapien iaculis facilisis. Ut nulla magna, luctus eu lacinia et, ullamcorper sed nulla. Etiam et mattis sem.",
};

const races: RaceCard[] = [
  {
    name: "Graveborns",
    slug: "graveborns",
    href: "/races/graveborns",
    image: "/images/races/place-holder-races.png",
    gradient: "violetHorizontal",
    icon: "/images/icons/races/graveborns.png",
    description:
      "Graveborns are beings marked by death, memory, and lingering souls. Their cultures are often tied to burial rites, ancestral magic, and the border between life and the afterlife.",
  },
  {
    name: "Nyxkins",
    slug: "nyxkins",
    href: "/races/nyxkins",
    image: "/images/races/place-holder-races.png",
    gradient: "royalBlueHorizontal",
    icon: "/images/icons/races/nyxkins.png",
    description:
      "Nyxkins are children of shadow and night. They are commonly associated with dreams, secrecy, lunar magic, and places where darkness is not emptiness but shelter.",
  },
  {
    name: "Remnants",
    slug: "remnants",
    href: "/races/remnants",
    image: "/images/races/place-holder-races.png",
    gradient: "skyBlueHorizontal",
    icon: "/images/icons/races/remnants.png",
    description:
      "Remnants are fragmented beings that continue existing after ruin. Some are physical remnants, others are spiritual echoes, but all carry traces of something that should have ended.",
  },
  {
    name: "Wilders",
    slug: "wilders",
    href: "/races/wilders",
    image: "/images/races/place-holder-races.png",
    gradient: "aquaHorizontal",
    icon: "/images/icons/races/wilders.png",
    description:
      "Wilders are deeply connected to nature, beasts, growth, and instinct. They often live close to forests, rivers, mountains, and territories where civilization bends to the living world.",
  },
  {
    name: "Ethereals",
    slug: "ethereals",
    href: "/races/ethereals",
    image: "/images/races/place-holder-races.png",
    gradient: "parchmentHorizontal",
    icon: "/images/icons/races/ethereals.png",
    description:
      "Ethereals are beings touched by the immaterial. Their bodies, cultures, and abilities often blur the line between spirit, light, thought, and physical existence.",
  },
  {
    name: "Interwined",
    slug: "interwined",
    href: "/races/interwined",
    image: "/images/races/place-holder-races.png",
    gradient: "coralHorizontal",
    icon: "/images/icons/races/interwined.png",
    description:
      "Intertwined are defined by bonds, dualities, shared essence, or fused origins. Their existence often depends on connection, balance, and the merging of separate forces.",
  },
  {
    name: "Dyphorians",
    slug: "dyphorians",
    href: "/races/dyphorians",
    image: "/images/races/place-holder-races.png",
    gradient: "roseHorizontal",
    icon: "/images/icons/races/dyphorians.png",
    description:
      "Dyphorians are intense, volatile, and powerful beings often associated with destructive magic, desire, conflict, and ancient forces that resist simple moral classification.",
  },
];

export default function RacesPage() {
  const [hoveredRaceSlug, setHoveredRaceSlug] = useState<string | null>(null);

  const selectedRace = useMemo(() => {
    return races.find((race) => race.slug === hoveredRaceSlug) ?? defaultRace;
  }, [hoveredRaceSlug]);

  const buttonLabel =
    hoveredRaceSlug === null ? "See Races" : `See ${selectedRace.name}`;

  return (
    <main className="min-h-screen bg-[#2D2C42] text-white">


        <section className="absolute min-h-screen min-w-full overflow-hidden bg-[#111120] ">
          <div
            className="absolute  inset-x-0 top-16 min-h-screen bg-cover bg-center bg-no-repeat transition-[background-image] duration-300"
            style={{
              backgroundImage: `url('${selectedRace.image}')`,
            }}
          />

          <div className="relative inset-0 bg-[#111120]/25" />

          <div className="relative z-10 grid min-h-screen items-center justify-center gap-10 lg:grid-cols-[minmax(0,1fr)_430px] px-18">
            <div className="flex justify-center">
              <GeneralContainerNoBorder className="max-w-full bg-[#111120]/65 px-10 py-12 text-center backdrop-blur-sm">
                <h1 className="mb-8 font-serif text-2xl font-bold uppercase tracking-wider text-white">
                  {selectedRace.name}
                </h1>

                <p className="mx-auto mb-10 max-w-[300px] text-sm leading-6 text-white">
                  {selectedRace.description}
                </p>

                <Link
                  href={selectedRace.href}
                  className="inline-flex min-w-[150px] justify-center rounded-md border border-[#fff48e] px-6 py-2 text-sm text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120]"
                >
                  {buttonLabel}
                </Link>
              </GeneralContainerNoBorder>
            </div>

            <div
              className="flex flex-col gap-3"
              onMouseLeave={() => {
                /*
                  Si quieres que vuelva al placeholder al sacar el mouse,
                  descomenta esta línea:

                  setHoveredRaceSlug(null);
                */
              }}
            >
              {races.map((race) => (
                <div
                  key={race.slug}
                  onMouseEnter={() => setHoveredRaceSlug(race.slug)}
                  onFocus={() => setHoveredRaceSlug(race.slug)}
                >
                  <HorizontalColorButton
                    href={race.href}
                    title={race.name}
                    gradient={race.gradient}
                    image={race.icon}
                  />

                </div>
              ))}
            </div>
          </div>
        </section>

    </main>
  );
}