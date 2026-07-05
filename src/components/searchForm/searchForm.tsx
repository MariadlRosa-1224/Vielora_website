// src/components/codex/SearchForm.tsx

import {
  categories,
  ranks,
  locations,
  dangerLevels,
  rarities,
  tameabilities,
  spellSchools,
  techniqueStats,
  techniqueSchools,
} from "@/lib/codex-options";

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

  stat: string;
  setStat: (value: string) => void;

  school: string;
  setSchool: (value: string) => void;

  caliber: string;
  setCaliber: (value: string) => void;
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
  stat,
  setStat,
  school,
  setSchool,

}: SearchFormProps) {
  const handleCategoryChange = (value: string) => {
    setCategory(value);

    setRank("All");
    setLocation("All");
    setDangerLevel("All");
    setRarity("All");
    setTameability("All");
    setStat("All");
    setSchool("All");

  };

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

        <SelectField
          id="category"
          label="Category"
          value={category}
          onChange={handleCategoryChange}
          options={uniqueOptions(["All", ...categories])}
        />

        {category === "Creatures" && (
          <>
            <SelectField
              id="location"
              label="Location"
              value={location}
              onChange={setLocation}
              options={uniqueOptions(["All", ...locations])}
            />

            <SelectField
              id="danger-level"
              label="Danger Level"
              value={dangerLevel}
              onChange={setDangerLevel}
              options={uniqueOptions(["All", ...dangerLevels])}
            />

            <SelectField
              id="rarity"
              label="Rarity"
              value={rarity}
              onChange={setRarity}
              options={uniqueOptions(["All", ...rarities])}
            />

            <SelectField
              id="tameability"
              label="Tameability"
              value={tameability}
              onChange={setTameability}
              options={uniqueOptions(["All", ...tameabilities])}
            />
          </>
        )}

        {category === "Flora" && (
          <>
            <SelectField
              id="flora-location"
              label="Location"
              value={location}
              onChange={setLocation}
              options={uniqueOptions(["All", ...locations])}
            />

            <SelectField
              id="flora-rarity"
              label="Rarity"
              value={rarity}
              onChange={setRarity}
              options={uniqueOptions(["All", ...rarities])}
            />
          </>
        )}

        {["Items", "Potions"].includes(category) && (
          <SelectField
            id="item-rarity"
            label="Rarity"
            value={rarity}
            onChange={setRarity}
            options={uniqueOptions(["All", ...rarities])}
          />
        )}

        {category === "Spells" && (
          <>
            <SelectField
              id="spell-stat"
              label="Stat"
              value={stat}
              onChange={setStat}
              options={techniqueStats}
            />

            <SelectField
              id="spell-school"
              label="School"
              value={school}
              onChange={setSchool}
              options={spellSchools}
            />

            <SelectField
              id="spell-rank"
              label="Rank"
              value={rank}
              onChange={setRank}
              options={uniqueOptions(["All", ...ranks])}
            />


          </>
        )}

        {["Techniques", "Runes"].includes(category) && (
          <SelectField
            id="rank"
            label="Rank"
            value={rank}
            onChange={setRank}
            options={uniqueOptions(["All", ...ranks])}
          />
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
  value,
  onChange,
}: {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  );
}

function uniqueOptions(options: string[]) {
  return Array.from(new Set(options));
}