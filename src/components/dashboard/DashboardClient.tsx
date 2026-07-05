"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import GeneralContentContainer from "@/components/GeneralContentContainer";
import DashboardSearchForm from "@/components/dashboard/DashboardSearchForm";

type DashboardRole = "user" | "admin";

type EntryStatus = "Pending" | "Approved" | "Published" | "Rejected";

type DashboardEntry = {
  id: string;
  title: string;
  author: string;
  authorId: string;
  typeOfEntry: "Codex/creature" | "Lore/characters" | "Codex/potions";
  entryType: "Codex" | "Lore";
  category: string;
  status: EntryStatus;
  creationDate: string;
  lastEdition: string;

  location?: string;
  dangerLevel?: string;
  rarity?: string;
  tameability?: string;
  rank?: string;
};

type LocalDraft = {
  id: string;
  title: string;
  authorId: string;
  typeOfEntry: "Codex/creature" | "Lore/characters" | "Codex/potions";
  entryType: "Codex" | "Lore";
  category: string;

  location?: string;
  dangerLevel?: string;
  rarity?: string;
  tameability?: string;
  rank?: string;
};

type DashboardClientProps = {
  role: DashboardRole;
  currentUserId: string;
  pageLabel: string;
};

const remoteEntries: DashboardEntry[] = [
  {
    id: "entry-1",
    title: "A cat",
    author: "Ana",
    authorId: "user-ana",
    typeOfEntry: "Codex/creature",
    entryType: "Codex",
    category: "Creatures",
    status: "Pending",
    creationDate: "01/01/2026",
    lastEdition: "01/01/2026",
    location: "Anywhere",
    dangerLevel: "All",
    rarity: "Legendary",
    tameability: "Untameable",
  },
  {
    id: "entry-2",
    title: "Emerald",
    author: "Ghost",
    authorId: "admin-ghost",
    typeOfEntry: "Lore/characters",
    entryType: "Lore",
    category: "Characters",
    status: "Approved",
    creationDate: "01/01/2026",
    lastEdition: "01/01/2026",
  },
  {
    id: "entry-3",
    title: "Justin",
    author: "Ana",
    authorId: "user-ana",
    typeOfEntry: "Lore/characters",
    entryType: "Lore",
    category: "Characters",
    status: "Published",
    creationDate: "01/01/2026",
    lastEdition: "01/01/2026",
  },
  {
    id: "entry-4",
    title: "Old potion",
    author: "Other user",
    authorId: "user-other",
    typeOfEntry: "Codex/potions",
    entryType: "Codex",
    category: "Potions",
    status: "Rejected",
    creationDate: "01/01/2026",
    lastEdition: "01/01/2026",
    rarity: "Legendary",
  },
];

const localDrafts: LocalDraft[] = [
  {
    id: "draft-1",
    title: "Potion of Levitation",
    authorId: "user-ana",
    typeOfEntry: "Codex/potions",
    entryType: "Codex",
    category: "Potions",
    rarity: "Legendary",
  },
  {
    id: "draft-2",
    title: "Ember",
    authorId: "user-ana",
    typeOfEntry: "Lore/characters",
    entryType: "Lore",
    category: "Characters",
  },
  {
    id: "draft-3",
    title: "Admin private creature draft",
    authorId: "admin-ghost",
    typeOfEntry: "Codex/creature",
    entryType: "Codex",
    category: "Creatures",
    location: "Anywhere",
    dangerLevel: "All",
    rarity: "Legendary",
    tameability: "Untameable",
  },
];

export default function DashboardClient({
  role,
  currentUserId,
  pageLabel,
}: DashboardClientProps) {
  const [search, setSearch] = useState("");
  const [entryState, setEntryState] = useState("All Entries");
  const [entryType, setEntryType] = useState("All Entries");
  const [category, setCategory] = useState("All Entries");
  const [rank, setRank] = useState("All");
  const [location, setLocation] = useState("All");
  const [dangerLevel, setDangerLevel] = useState("All");
  const [rarity, setRarity] = useState("All");
  const [tameability, setTameability] = useState("All");

  const visibleRemoteEntries = useMemo(() => {
    const roleFilteredEntries =
      role === "admin"
        ? remoteEntries
        : remoteEntries.filter((entry) => entry.authorId === currentUserId);

    return roleFilteredEntries.filter((entry) =>
      matchesFilters(entry, {
        search,
        entryState,
        entryType,
        category,
        rank,
        location,
        dangerLevel,
        rarity,
        tameability,
      }),
    );
  }, [
    role,
    currentUserId,
    search,
    entryState,
    entryType,
    category,
    rank,
    location,
    dangerLevel,
    rarity,
    tameability,
  ]);

  const visibleLocalDrafts = useMemo(() => {
    return localDrafts
      .filter((draft) => draft.authorId === currentUserId)
      .filter((draft) =>
        matchesFilters(draft, {
          search,
          entryState: "All Entries",
          entryType,
          category,
          rank,
          location,
          dangerLevel,
          rarity,
          tameability,
        }),
      );
  }, [
    currentUserId,
    search,
    entryType,
    category,
    rank,
    location,
    dangerLevel,
    rarity,
    tameability,
  ]);

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-8 py-24 text-white">
      <p className="px-4 pt-4 text-sm text-white/40">{pageLabel}</p>

      <section className="mx-auto max-w-7xl bg-[url('/images/codex/codex-background.jpg')] bg-cover bg-center bg-no-repeat px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <GeneralContentContainer className="min-h-[70vh]">
            <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {role === "admin" ? "Admin" : "User"}
                </p>

                <h1 className="font-serif text-4xl font-bold uppercase tracking-wide text-white">
                  Dashboard
                </h1>
              </div>

              <Link
                href="/editor/new-entry"
                className="w-fit rounded-md border border-[#fff48e] px-4 py-2 text-sm text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120]"
              >
                Create entry
              </Link>
            </header>

            <DashboardTable
              entries={visibleRemoteEntries}
              role={role}
            />

            <section className="mt-10">
              <h2 className="mb-4 font-serif text-lg font-bold uppercase tracking-wider text-white">
                Local Drafts
              </h2>

              <LocalDraftList drafts={visibleLocalDrafts} />
            </section>
          </GeneralContentContainer>

          <DashboardSearchForm
            search={search}
            setSearch={setSearch}
            entryState={entryState}
            setEntryState={setEntryState}
            entryType={entryType}
            setEntryType={setEntryType}
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
      </section>
    </main>
  );
}

function DashboardTable({
  entries,
  role,
}: {
  entries: DashboardEntry[];
  role: DashboardRole;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-md border border-white/20 px-4 py-6 text-center text-sm text-white/60">
        No entries match the current filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[780px] border-collapse text-left text-xs">
        <thead>
          <tr className="font-serif uppercase tracking-wider text-white">
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Type of Entry</TableHead>
            <TableHead>Approval State</TableHead>
            <TableHead>Creation Date</TableHead>
            <TableHead>Last Edition</TableHead>
            <TableHead>Actions</TableHead>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-t border-white/40">
              <TableCell>{entry.title}</TableCell>
              <TableCell>{entry.author}</TableCell>
              <TableCell>{entry.typeOfEntry}</TableCell>
              <TableCell>
                <StatusBadge status={entry.status} />
              </TableCell>
              <TableCell>{entry.creationDate}</TableCell>
              <TableCell>{entry.lastEdition}</TableCell>
              <TableCell>
                <EntryActions entry={entry} role={role} />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EntryActions({
  entry,
  role,
}: {
  entry: DashboardEntry;
  role: DashboardRole;
}) {
  if (role === "admin") {
    return (
      <div className="flex flex-wrap gap-1 text-[#fff48e]">
        {entry.status === "Pending" && (
          <>
            <Link href={`/admin/dashboard/review/${entry.id}`}>Review</Link>
            <span className="text-white/40">|</span>
          </>
        )}

        <Link href={`/dashboard/entries/${entry.id}`}>View</Link>
        <span className="text-white/40">|</span>
        <Link href={`/editor/edit/${entry.id}`}>Edit</Link>

        {entry.status === "Pending" && (
          <>
            <span className="text-white/40">|</span>
            <button type="button" className="text-green-300">
              Approve
            </button>
          </>
        )}
      </div>
    );
  }

  if (entry.status === "Published" || entry.status === "Approved") {
    return (
      <div className="flex flex-wrap gap-1 text-[#fff48e]">
        <Link href={`/dashboard/entries/${entry.id}`}>View</Link>
        <span className="text-white/40">|</span>
        <button type="button">Request Edit</button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 text-[#fff48e]">
      <Link href={`/dashboard/entries/${entry.id}`}>View</Link>
      <span className="text-white/40">|</span>
      <Link href={`/editor/edit/${entry.id}`}>Edit</Link>
    </div>
  );
}

function LocalDraftList({ drafts }: { drafts: LocalDraft[] }) {
  if (drafts.length === 0) {
    return (
      <p className="rounded-md border border-white/20 px-4 py-4 text-sm text-white/60">
        No local drafts found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {drafts.map((draft) => (
        <article
          key={draft.id}
          className="flex flex-col gap-3 rounded-md border border-[#fff48e] bg-[#111120]/60 px-4 py-3 text-xs md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-wrap gap-3">
            <h3 className="font-serif uppercase tracking-wider text-white">
              {draft.title}:
            </h3>

            <p className="text-white/70">{draft.typeOfEntry}</p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/editor/local-drafts/${draft.id}`}
              className="text-[#fff48e] hover:underline"
            >
              Edit
            </Link>

            <span className="text-white/40">|</span>

            <button type="button" className="text-red-400 hover:underline">
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-r border-white/40 px-3 py-3 last:border-r-0">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="border-r border-white/30 px-3 py-3 font-bold text-white last:border-r-0">
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: EntryStatus }) {
  const className =
    status === "Pending"
      ? "text-yellow-200"
      : status === "Approved" || status === "Published"
        ? "text-green-300"
        : "text-red-300";

  return <span className={className}>{status}</span>;
}

function matchesFilters(
  entry: DashboardEntry | LocalDraft,
  filters: {
    search: string;
    entryState: string;
    entryType: string;
    category: string;
    rank: string;
    location: string;
    dangerLevel: string;
    rarity: string;
    tameability: string;
  },
) {
  const normalizedSearch = filters.search.trim().toLowerCase();

  const matchesSearch =
    normalizedSearch.length === 0 ||
    entry.title.toLowerCase().includes(normalizedSearch) ||
    entry.typeOfEntry.toLowerCase().includes(normalizedSearch) ||
    entry.category.toLowerCase().includes(normalizedSearch);

  const matchesEntryState =
    isAll(filters.entryState) ||
    ("status" in entry && entry.status === filters.entryState);

  const matchesEntryType =
    isAll(filters.entryType) || entry.entryType === filters.entryType;

  const matchesCategory =
    isAll(filters.category) || entry.category === filters.category;

  const matchesRank = isAll(filters.rank) || entry.rank === filters.rank;

  const matchesLocation =
    isAll(filters.location) || entry.location === filters.location;

  const matchesDangerLevel =
    isAll(filters.dangerLevel) || entry.dangerLevel === filters.dangerLevel;

  const matchesRarity =
    isAll(filters.rarity) || entry.rarity === filters.rarity;

  const matchesTameability =
    isAll(filters.tameability) || entry.tameability === filters.tameability;

  return (
    matchesSearch &&
    matchesEntryState &&
    matchesEntryType &&
    matchesCategory &&
    matchesRank &&
    matchesLocation &&
    matchesDangerLevel &&
    matchesRarity &&
    matchesTameability
  );
}

function isAll(value: string) {
  return value === "All" || value === "All Entries" || value === "";
}