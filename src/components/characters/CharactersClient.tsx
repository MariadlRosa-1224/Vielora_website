// src/components/characters/CharactersClient.tsx

"use client";

import { useMemo, useState } from "react";
import CharacterFrame from "@/components/characters/CharacterFrame";
import type { CharacterEntryMeta } from "@/lib/characters";

type CharactersClientProps = {
  initialCharacters: CharacterEntryMeta[];
};

export default function CharactersClient({
  initialCharacters,
}: CharactersClientProps) {
  const [search, setSearch] = useState("");
  const [affiliation, setAffiliation] = useState("All");

  const affiliations = useMemo(() => {
    const uniqueAffiliations = new Set<string>();

    initialCharacters.forEach((character) => {
      character.affiliations.forEach((item) => uniqueAffiliations.add(item));
    });

    return ["All", ...Array.from(uniqueAffiliations).sort()];
  }, [initialCharacters]);

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialCharacters.filter((character) => {
      const matchesSearch =
        query.length === 0 ||
        character.title.toLowerCase().includes(query) ||
        character.name.toLowerCase().includes(query);

      const matchesAffiliation =
        affiliation === "All" ||
        character.affiliations.some((item) => item === affiliation);

      return matchesSearch && matchesAffiliation;
    });
  }, [initialCharacters, search, affiliation]);

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-24 text-white sm:px-6 lg:px-10">
      <section className="mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="font-['Spectral_SC'] text-3xl font-bold uppercase tracking-wider text-white md:text-4xl">
            Characters
          </h1>

          <p className="mt-8 text-sm font-semibold leading-7 text-white sm:text-base sm:leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut
            hendrerit ligula, in maximus est. Sed et sem sem. Nunc ultricies
            lorem at sapien iaculis facilisis. Ut nulla magna, luctus eu lacinia
            et, ullamcorper sed nulla.
          </p>
        </header>

        <CharacterSearchBar
          search={search}
          setSearch={setSearch}
          affiliation={affiliation}
          setAffiliation={setAffiliation}
          affiliations={affiliations}
        />

        <section className="mt-14 grid grid-cols-1 justify-items-center gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCharacters.map((character) => (
            <CharacterFrame
              key={character.slug}
              title={character.locked ? "???" : character.name}
              image={character.image}
              imageAlt={character.imageAlt}
              frame={character.frame}
              href={character.href}
              locked={character.locked}
            />
          ))}
        </section>

        {filteredCharacters.length === 0 && (
          <p className="mt-16 rounded-md border border-white/20 bg-[#111120]/70 px-6 py-8 text-center text-white/70">
            No characters match the current search.
          </p>
        )}
      </section>
    </main>
  );
}

function CharacterSearchBar({
  search,
  setSearch,
  affiliation,
  setAffiliation,
  affiliations,
}: {
  search: string;
  setSearch: (value: string) => void;
  affiliation: string;
  setAffiliation: (value: string) => void;
  affiliations: string[];
}) {
  return (
    <div className="sticky top-[72px] z-30 mx-auto mt-12 w-full max-w-5xl rounded-md border border-[#fff48e] bg-[#111120]/85 px-4 py-4 backdrop-blur-md sm:px-6">
      <form
        className="grid items-center gap-4 md:grid-cols-[auto_minmax(0,1fr)_220px]"
        onSubmit={(event) => event.preventDefault()}
      >
        <label
          htmlFor="character-search"
          className="font-['Spectral_SC'] text-sm font-bold uppercase tracking-wider text-white"
        >
          Search
        </label>

        <input
          id="character-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name"
          className="w-full min-w-0 border border-white/60 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-[#fff48e]"
        />

        <select
          value={affiliation}
          onChange={(event) => setAffiliation(event.target.value)}
          className="w-full min-w-0 border border-white/60 bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
        >
          {affiliations.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "Affiliation" : item}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}