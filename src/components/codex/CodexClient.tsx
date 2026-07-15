"use client";

import { useMemo, useState } from "react";
import { CodexEntryMeta } from "@/lib/codex";
import GeneralContentContainer from "../containers/GeneralContentContainer";
import ItemList from "../ItemList/ItemList";
import SearchForm from "./searchForm";

type CodexClientProps = {
  initialItems: CodexEntryMeta[];
};

export default function CodexClient({ initialItems }: CodexClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [rank, setRank] = useState("All");
  const [location, setLocation] = useState("All");
  const [rarity, setRarity] = useState("All");

  const [dangerLevel, setDangerLevel] = useState("All");
  const [tameability, setTameability] = useState("All");

  const [stat, setStat] = useState("All");
  const [school, setSchool] = useState("All");

  const [techniqueSchool, setTechniqueSchool] = useState("All");

  const [mineralType, setMineralType] = useState("All");

  const filteredItems = useMemo(() => {
    const query = normalize(search);

    return initialItems.filter((item) => {
      const searchableText = getSearchableText(item);

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      const matchesCategory =
        isAll(category) || normalize(item.category) === normalize(category);

      const matchesRank = matchesField(item, "rank", rank);
      const matchesLocation = matchesField(item, "location", location);
      const matchesDangerLevel = matchesField(
        item,
        "dangerLevel",
        dangerLevel,
      );
      const matchesRarity = matchesField(item, "rarity", rarity);
      const matchesTameability = matchesField(
        item,
        "tameability",
        tameability,
      );

      const matchesStat = matchesField(item, "stat", stat);
      const matchesSchool = matchesField(item, "school", school);
      const matchesTechniqueSchool = matchesField(item, "techniqueSchool", techniqueSchool);

      const matchesMineralType = matchesField(item, "mineralType", mineralType);


      return (
        matchesSearch &&
        matchesCategory &&
        matchesRank &&
        matchesLocation &&
        matchesDangerLevel &&
        matchesRarity &&
        matchesTameability &&
        matchesStat &&
        matchesSchool &&
        matchesTechniqueSchool &&
        matchesMineralType
      );
    });
  }, [
    initialItems,
    search,
    category,
    rank,
    location,
    dangerLevel,
    rarity,
    tameability,
    stat,
    school,
    techniqueSchool,
    mineralType,
  ]);

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-8 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider">
          Codex
        </h1>
<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
  <aside className="order-first lg:order-2 lg:sticky lg:top-24">
    <SearchForm
      search={search}
      setSearch={setSearch}
      category={category}
      setCategory={setCategory}
      rank={rank}
      setRank={setRank}
      location={location}
      setLocation={setLocation}
      dangerLevel={dangerLevel}
      setDangerLevel={setDangerLevel}
      rarity={rarity}
      setRarity={setRarity}
      tameability={tameability}
      setTameability={setTameability}
      stat={stat}
      setStat={setStat}
      school={school}
      setSchool={setSchool}
      techniqueSchool={techniqueSchool}
      setTechniqueSchool={setTechniqueSchool}
      mineralType={mineralType}
      setMineralType={setMineralType}
    />
  </aside>

  <GeneralContentContainer className="min-w-0 lg:order-1">
    <ItemList items={filteredItems} />
  </GeneralContentContainer>
</div>
      </div>
    </main>
  );
}

function matchesField(
  item: CodexEntryMeta,
  fieldName: string,
  filterValue: string,
) {
  if (isAll(filterValue)) {
    return true;
  }

  const value = getFieldValue(item, fieldName);

  return normalize(value) === normalize(filterValue);
}

function getFieldValue(item: CodexEntryMeta, fieldName: string) {
  const record = item as unknown as Record<string, unknown>;
  const value = record[fieldName];

  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

function getSearchableText(item: CodexEntryMeta) {
  const values = collectSearchableValues(item);

  return values.join(" ").toLowerCase();
}

function collectSearchableValues(value: unknown): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectSearchableValues);
  }

  if (typeof value === "object") {
    return Object.values(value).flatMap(collectSearchableValues);
  }

  return [];
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function isAll(value: string) {
  return value === "All" || value === "";
}