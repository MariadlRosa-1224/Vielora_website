"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import HorizontalColorButton from "@/components/linkButtons/HorizontalColorButton";
import GeneralContainerNoBorder from "@/components/containers/GeneralContainerNoBorder";
import type { VieloraHorizontalGradient } from "@/theme/colors";
import { raceOrigins } from "@/lib/race-origins";



const defaultRace = {
  name: "(Select category)",
  href: "/races",
  backgroundImage: "/images/races/place-holder-races.png",
  description:
    "Hover over a category to learn more about it. Click to see the full details of the race",
};


export default function RacesPage() {
  const [hoveredRaceSlug, setHoveredRaceSlug] = useState<string | null>(null);

  const selectedRace = useMemo(() => {
    return raceOrigins.find((race) => race.slug === hoveredRaceSlug) ?? defaultRace;
  }, [hoveredRaceSlug]);

  const buttonLabel =
    hoveredRaceSlug === null ? "See Races" : `See ${selectedRace.name}`;

  return (
    <main className="min-h-screen bg-[#2D2C42] text-white">


        <section className="absolute min-h-screen min-w-full overflow-hidden bg-[#111120] ">
          <div
            className="absolute  inset-x-0 top-16 min-h-screen bg-cover bg-center bg-no-repeat transition-[background-image] duration-300"
            style={{
              backgroundImage: `url('${selectedRace.backgroundImage}')`,
            }}
          />

          <div className="relative inset-0 bg-[#111120]/25" />

          <div className="relative z-10 grid min-h-screen items-center justify-center gap-10 lg:grid-cols-[minmax(0,1fr)_430px] px-18">
            <div className="flex justify-center">
              <GeneralContainerNoBorder className="max-w-full bg-[#111120]/65 px-10 py-12 text-center backdrop-blur-sm">
                <h1 className="mb-8 font-[Spectral_SC] text-2xl font-bold uppercase tracking-wider text-white">
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
              {raceOrigins.map((race) => (
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