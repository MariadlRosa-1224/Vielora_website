"use client";

import { useMemo, useState } from "react";
import { CodexEntryMeta } from "@/lib/codex";
import GeneralContentContainer from "../GeneralContentContainer";
import ItemList from "../ItemList/ItemList";
import SearchForm from "../searchForm/searchForm";

type CodexClientProps = {
  initialItems: CodexEntryMeta[];
};



export default function CodexClient({ initialItems }: CodexClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [rank, setRank] = useState("All");
  const [location, setLocation] = useState("Anywhere");
  const [dangerLevel, setDangerLevel] = useState("All");
  const [rarity, setRarity] = useState("All");
  const [tameability, setTameability] = useState("All");



  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialItems.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.dangerLevel.toLowerCase().includes(query) ||
        item.rarity.toLowerCase().includes(query) ||
        item.tameability.toLowerCase().includes(query) ||
        item.rank.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || item.category === category.toLocaleLowerCase();

      
      const matchesRank = rank === "All" || item.rank === rank.toLowerCase();

      const matchesLocation = location === "Anywhere" || item.location === location.toLowerCase();

      const matchesDangerLevel = dangerLevel === "All" || item.dangerLevel === dangerLevel.toLowerCase();

      const matchesRarity = rarity === "All" || item.rarity === rarity.toLowerCase();
      
      const matchesTameability = tameability === "All" || item.tameability === tameability.toLowerCase();

      return matchesSearch && matchesCategory && matchesRank && matchesLocation && matchesDangerLevel && matchesRarity && matchesTameability;
    });
  }, [search, category, rank, location, dangerLevel, rarity, tameability]);

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-8 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 font-serif text-3xl font-bold uppercase tracking-wider">
          Codex
        </h1>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_300px]">
          <GeneralContentContainer>
            <ItemList items={filteredItems} />
          </GeneralContentContainer>

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
          />
        </div>
      </div>
    </main>
  );
}