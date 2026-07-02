// src/components/codex/SearchForm.tsx

import { categories, ranks, locations, dangerLevels, rarities, tameabilities } from "@/lib/codex-options";

type SearchFormProps = {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  rank: string;
  setRank: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  dangerLevel: string;
  setDangerLevel: (value: string) => void;
  rarity: string;
  setRarity: (value: string) => void;
  tameability: string;
  setTameability: (value: string) => void;
};



export default function SearchForm({
  search,
  setSearch,
  category,
  setCategory,
  rank,
  setRank,
  location,
  setLocation,
  dangerLevel,
  setDangerLevel,
  rarity,
  setRarity,
  tameability,
  setTameability,
}: SearchFormProps) {
  return (
    <aside className="rounded-xl border border-[#fff48e] bg-[#111120]/75 p-4 backdrop-blur-sm">
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <FieldLabel htmlFor="search">Search</FieldLabel>

        <input
          id="search"
          type="text"
          value={search}
          placeholder="Search"
          onChange={(event) => setSearch(event.target.value)}
          className="w-full border border-white bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/70 focus:border-[#fff48e]"
        />

        <FieldLabel htmlFor="category">Category</FieldLabel>

        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {category === "Creatures" && (
          <>

          <FieldLabel htmlFor="Location">Location</FieldLabel>

            <select
              id="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <FieldLabel htmlFor="Danger Level">Danger Level</FieldLabel>

            <select
              id="Danger Level"
              value={dangerLevel}
              onChange={(event) => setDangerLevel(event.target.value)}
              className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
            >
              {dangerLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <FieldLabel htmlFor="Rarity">Rarity</FieldLabel>

            <select
              id="Rarity"
              value={rarity}
              onChange={(event) => setRarity(event.target.value)}
              className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
            >
              {rarities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <FieldLabel htmlFor="Tameability">Tameability</FieldLabel>


            <select
              id="Tameability"
              value={tameability}
              onChange={(event) => setTameability(event.target.value)}
              className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
            >
              {tameabilities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </>
        )}

        {category === "Flora" && (
          <>

            <FieldLabel htmlFor="Location">Location</FieldLabel>

            <select
              id="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <FieldLabel htmlFor="Rarity">Rarity</FieldLabel>

            <select
              id="Rarity"
              value={rarity}
              onChange={(event) => setRarity(event.target.value)}
              className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
            >
              {rarities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </>
        )}



        {["Items", "Potions"].includes(category) && (

          <>

          <FieldLabel htmlFor="Rarity">Rarity</FieldLabel>

          <select
            id="Rarity"
            value={rarity}
            onChange={(event) => setRarity(event.target.value)}
            className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
          >
            {rarities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          </>
        )}

        {["Spells", "Techniques", "Runes"].includes(category) && (

          <>

          <FieldLabel htmlFor="Rank">Rank</FieldLabel>

          <select
            id="Rank"
            value={rank}
            onChange={(event) => setRank(event.target.value)}
            className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
          >
            {ranks.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          </>
        )}


        

        <button
          type="submit"
          className="mt-2 w-full rounded-md border border-[#fff48e] px-4 py-2 text-sm text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120]"
        >
          Search
        </button>
      </form>
    </aside>
  );
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-serif text-sm font-bold uppercase tracking-wider text-white"
    >
      {children}
    </label>
  );
}

function SelectField({
  label,
  id,
  options,
}: {
  label: string;
  id: string;
  options: string[];
}) {
  return (
    <>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <select
        id={id}
        className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
      >
        {options.map((option) => (
          <option key={option} value={option === "All" ? "" : option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}