"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  getEntryFormat,
  newEntryFormats,
  type NewEntryType,
} from "@/lib/new-entry-format";
import type { DashboardFilters, EntryStatus } from "@/lib/dashboard-types";

type FieldFilterOption = {
  name: string;
  label: string;
  options: string[];
};

type DashboardSearchFormProps = {
  filters: DashboardFilters;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
  fieldFilterOptions: FieldFilterOption[];
  className?: string;
};

const entryStates: Array<EntryStatus | "All Entries"> = [
  "All Entries",
  "Pending",
  "Approved",
  "Published",
  "Rejected",
  "Edit Requested",
];

const entryGroups = [
  "All Entries",
  ...Array.from(new Set(newEntryFormats.map((format) => format.group))),
];

export default function DashboardSearchForm({
  filters,
  setFilters,
  fieldFilterOptions,
  className = "",
}: DashboardSearchFormProps) {
  const visibleFormats =
    filters.entryGroup === "All Entries"
      ? newEntryFormats
      : newEntryFormats.filter((format) => format.group === filters.entryGroup);

  function updateFilter<K extends keyof DashboardFilters>(
    key: K,
    value: DashboardFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleEntryGroupChange(value: string) {
    setFilters((current) => ({
      ...current,
      entryGroup: value,
      entryFormat: "All Entries",
      fieldFilters: {},
    }));
  }

  function handleEntryFormatChange(value: string) {
    setFilters((current) => ({
      ...current,
      entryFormat: value as NewEntryType | "All Entries",
      fieldFilters: {},
    }));
  }

  function updateFieldFilter(name: string, value: string) {
    setFilters((current) => ({
      ...current,
      fieldFilters: {
        ...current.fieldFilters,
        [name]: value,
      },
    }));
  }

  return (
    <aside
      className={[
        "w-full rounded-xl border border-[#fff48e] bg-[#111120]/80 p-4 backdrop-blur-sm",
        "lg:sticky lg:top-24 lg:self-start",
        className,
      ].join(" ")}
    >
      <form
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <FieldLabel htmlFor="dashboard-search">Search</FieldLabel>

          <input
            id="dashboard-search"
            type="text"
            value={filters.search}
            placeholder="Search"
            onChange={(event) => updateFilter("search", event.target.value)}
            className="mt-2 w-full min-w-0 border border-white bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/70 focus:border-[#fff48e]"
          />
        </div>

        <SelectField
          id="entry-state"
          label="Entry State"
          value={filters.entryState}
          onChange={(value) =>
            updateFilter("entryState", value as EntryStatus | "All Entries")
          }
          options={entryStates}
        />

        <SelectField
          id="entry-group"
          label="Entry Group"
          value={filters.entryGroup}
          onChange={handleEntryGroupChange}
          options={entryGroups}
        />

        <SelectField
          id="entry-format"
          label="Entry Format"
          value={filters.entryFormat}
          onChange={handleEntryFormatChange}
          options={[
            "All Entries",
            ...visibleFormats.map((format) => format.entryType),
          ]}
          getOptionLabel={(value) =>
            value === "All Entries"
              ? "All Entries"
              : getEntryFormat(value as NewEntryType).label
          }
        />

        {fieldFilterOptions.map((field) => (
          <SelectField
            key={field.name}
            id={`field-filter-${field.name}`}
            label={field.label}
            value={filters.fieldFilters[field.name] ?? "All"}
            onChange={(value) => updateFieldFilter(field.name, value)}
            options={["All", ...field.options]}
          />
        ))}

        <button
          type="submit"
          className="w-full rounded-md border border-[#fff48e] px-4 py-2 text-sm text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120] sm:col-span-2 lg:col-span-1"
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
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-[Spectral_SC] text-sm font-bold uppercase tracking-wider text-white"
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
  getOptionLabel,
}: {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  getOptionLabel?: (value: string) => string;
}) {
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full min-w-0 border border-white bg-[#111120] px-3 py-2 text-sm text-white outline-none focus:border-[#fff48e]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {getOptionLabel ? getOptionLabel(option) : option}
          </option>
        ))}
      </select>
    </div>
  );
}