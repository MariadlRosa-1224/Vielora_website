"use client";

import {
  categories,
  ranks,
  locations,
  dangerLevels,
  rarities,
  tameabilities,
} from "@/lib/codex-options";

type DashboardSearchFormProps = {
  search: string;
  setSearch: (value: string) => void;

  entryState: string;
  setEntryState: (value: string) => void;

  entryType: string;
  setEntryType: (value: string) => void;

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

const entryStates = [
  "All Entries",
  "Pending",
  "Approved",
  "Published",
  "Rejected",
];

const entryTypes = ["All Entries", "Codex", "Lore"];

const categoryOptions = uniqueOptions([
  "All Entries",
  ...categories,
  "Characters",
]);

export default function DashboardSearchForm({
  search,
  setSearch,
  entryState,
  setEntryState,
  entryType,
  setEntryType,
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
}: DashboardSearchFormProps) {
  return (
    <aside className="rounded-xl border border-[#fff48e] bg-[#111120]/75 p-4 backdrop-blur-sm">
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <FieldLabel htmlFor="dashboard-search">Search</FieldLabel>

        <input
          id="dashboard-search"
          type="text"
          value={search}
          placeholder="Search"
          onChange={(event) => setSearch(event.target.value)}
          className="w-full border border-white bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/70 focus:border-[#fff48e]"
        />

        <SelectField
          id="entry-state"
          label="Entry State"
          value={entryState}
          onChange={setEntryState}
          options={entryStates}
        />

        <SelectField
          id="entry-type"
          label="Type of Entry"
          value={entryType}
          onChange={setEntryType}
          options={entryTypes}
        />

        <SelectField
          id="category"
          label="Category"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
        />

        {category === "Creatures" && (
          <>
            <SelectField
              id="location"
              label="Location"
              value={location}
              onChange={setLocation}
              options={withAll(locations)}
            />

            <SelectField
              id="danger-level"
              label="Danger Level"
              value={dangerLevel}
              onChange={setDangerLevel}
              options={withAll(dangerLevels)}
            />

            <SelectField
              id="rarity"
              label="Rarity"
              value={rarity}
              onChange={setRarity}
              options={withAll(rarities)}
            />

            <SelectField
              id="tameability"
              label="Tameability"
              value={tameability}
              onChange={setTameability}
              options={withAll(tameabilities)}
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
              options={withAll(locations)}
            />

            <SelectField
              id="flora-rarity"
              label="Rarity"
              value={rarity}
              onChange={setRarity}
              options={withAll(rarities)}
            />
          </>
        )}

        {["Items", "Potions"].includes(category) && (
          <SelectField
            id="item-rarity"
            label="Rarity"
            value={rarity}
            onChange={setRarity}
            options={withAll(rarities)}
          />
        )}

        {["Spells", "Techniques", "Runes"].includes(category) && (
          <SelectField
            id="rank"
            label="Rank"
            value={rank}
            onChange={setRank}
            options={withAll(ranks)}
          />
        )}

        {category === "Characters" && (
          <p className="text-center text-xs text-white/60">
            Character-specific filters can be added here later.
          </p>
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

function withAll(options: string[]) {
  return uniqueOptions(["All", ...options]);
}

function uniqueOptions(options: string[]) {
  return Array.from(new Set(options));
}