// src/components/races/RaceOriginClient.tsx

"use client";

import { useMemo, useState } from "react";
import GeneralContentContainer from "@/components/containers/GeneralContainerNoBorder";
import TransparentDropdown from "@/components/lore/TransparentDropdown";
import RaceEntryTemplate from "@/components/races/RaceEntryTemplate";
import RaceAbilityTree from "@/components/races/RaceAbilityTree";
import type { RaceOrigin } from "@/lib/race-origins";
import type { RaceEntry } from "@/lib/races";

type RaceOriginClientProps = {
  category: RaceOrigin;
  races: RaceEntry[];
};

export default function RaceOriginClient({
  category,
  races,
}: RaceOriginClientProps) {
  const [selectedRaceSlug, setSelectedRaceSlug] = useState(
    races[0]?.slug ?? "",
  );

  const selectedRace = useMemo(() => {
    return races.find((race) => race.slug === selectedRaceSlug) ?? races[0];
  }, [races, selectedRaceSlug]);

  const dropdownItems = races.map((race) => ({
    label: race.title,
    value: race.slug,
  }));

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/dark-starry-sky.jpg')] bg-fixed bg-cover bg-center bg-no-repeat text-white">
      <section
        className="relative flex min-h-[90vh] items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-24 mask-b-from-70% mask-b-to-90%"
        style={{
          backgroundImage: `url(${category.backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-[#111120]/50" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="font-['Spectral_SC'] text-3xl font-bold uppercase tracking-wider text-white md:text-4xl">
            {category.title}
          </h1>

          <p className="mt-10 text-base font-semibold leading-relaxed text-white md:text-lg">
            {category.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        {races.length === 0 ? (
          <GeneralContentContainer>
            <p className="text-center text-white/70">
              No races have been added to this category yet.
            </p>
          </GeneralContentContainer>
        ) : (
          <>
            <div className="mb-8 flex justify-start">
              <TransparentDropdown
                label={selectedRace?.title ?? "Race"}
                items={dropdownItems}
                selectedValue={selectedRaceSlug}
                onSelect={(item) => {
                  if (item.value) setSelectedRaceSlug(item.value);
                }}
                variant="compact"
                className="w-[300px]"
              />
            </div>

            {selectedRace && (
              <>
                <GeneralContentContainer>
                  <RaceEntryTemplate entry={selectedRace} />
                </GeneralContentContainer>

                <RaceAbilityTree
                  tree={selectedRace.abilityTree}
                  className="mt-12"
                />
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}