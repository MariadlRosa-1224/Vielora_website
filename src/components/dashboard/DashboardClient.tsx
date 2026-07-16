// src/components/dashboard/DashboardClient.tsx

"use client";

import type { EntryRecord } from "@/lib/entries-types";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import GeneralContentContainer from "@/components/containers/GeneralContentContainer";
import DashboardSearchForm from "@/components/dashboard/DashboardSearchForm";
import type {
  DashboardEntry,
  DashboardFilters,
  DashboardRole,
  EntryStatus,
  ManagedUser,
} from "@/lib/dashboard-types";
import {
  getEntryFormat,
  newEntryFormats,
  type EntryFieldValue,
} from "@/lib/new-entry-format";
import {
  deleteLocalEntryDraft,
  getLocalEntryDrafts,
  type LocalEntryDraft,
} from "@/lib/local-entry-drafts";

type DashboardTab = "entries" | "drafts" | "users";

type DashboardClientProps = {
  role: DashboardRole;
  currentUserId: string;
  pageLabel: string;
};

export default function DashboardClient({
  role,
  currentUserId,
  pageLabel,
}: DashboardClientProps) {
  const [activeDashboard, setActiveDashboard] =
    useState<DashboardTab>("entries");

  const [filters, setFilters] = useState<DashboardFilters>({
    search: "",
    entryState: "All Entries",
    entryGroup: "All Entries",
    entryFormat: "All Entries",
    fieldFilters: {},
  });

  const [localDrafts, setLocalDrafts] = useState<LocalEntryDraft[]>([]);

  const [remoteEntries, setRemoteEntries] = useState<DashboardEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [entriesError, setEntriesError] = useState<string | null>(null);

  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
  const [isLoadingManagedUsers, setIsLoadingManagedUsers] = useState(false);
  const [managedUsersError, setManagedUsersError] = useState<string | null>(
    null,
  );

  void currentUserId;

  const canManageUsers = role === "admin";
  const showEntryFilters = activeDashboard !== "users";

  const loadManagedUsers = useCallback(async () => {
    if (!canManageUsers) {
      setManagedUsers([]);
      return;
    }

    setIsLoadingManagedUsers(true);
    setManagedUsersError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not load users.");
      }

      setManagedUsers(result.users ?? []);
    } catch (error) {
      setManagedUsersError(
        error instanceof Error ? error.message : "Could not load users.",
      );
    } finally {
      setIsLoadingManagedUsers(false);
    }
  }, [canManageUsers]);

  const loadRemoteEntries = useCallback(async () => {
    setIsLoadingEntries(true);
    setEntriesError(null);

    try {
      const response = await fetch("/api/entries", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not load entries.");
      }

      const entries = Array.isArray(result.entries)
        ? result.entries.map((entry: EntryRecord) => toDashboardEntry(entry))
        : [];

      setRemoteEntries(entries);
    } catch (error) {
      setEntriesError(
        error instanceof Error ? error.message : "Could not load entries.",
      );
    } finally {
      setIsLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    void loadRemoteEntries();
  }, [loadRemoteEntries]);

  useEffect(() => {
    if (!canManageUsers) return;

    void loadManagedUsers();
  }, [canManageUsers, loadManagedUsers]);

  const visibleRemoteEntries = useMemo(() => {
    return remoteEntries.filter((entry) => matchesFilters(entry, filters));
  }, [remoteEntries, filters]);

  const visibleLocalDrafts = useMemo(() => {
    return localDrafts.filter((draft) =>
      matchesFilters(draft, {
        ...filters,
        entryState: "All Entries",
      }),
    );
  }, [localDrafts, filters]);

  const fieldFilterOptions = useMemo(() => {
    return buildFieldFilterOptions(filters, [
      ...remoteEntries,
      ...localDrafts,
    ]);
  }, [filters, remoteEntries, localDrafts]);

  function reloadLocalDrafts() {
    setLocalDrafts(getLocalEntryDrafts());
  }

  useEffect(() => {
    reloadLocalDrafts();

    function handleDraftsUpdated() {
      reloadLocalDrafts();
    }

    window.addEventListener("storage", handleDraftsUpdated);
    window.addEventListener(
      "vielora-local-drafts-updated",
      handleDraftsUpdated,
    );

    return () => {
      window.removeEventListener("storage", handleDraftsUpdated);
      window.removeEventListener(
        "vielora-local-drafts-updated",
        handleDraftsUpdated,
      );
    };
  }, []);

  function handleDeleteLocalDraft(draftId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this local draft?",
    );

    if (!confirmed) return;

    deleteLocalEntryDraft(draftId);
    reloadLocalDrafts();
  }

  async function updateManagedUserRole(
    userId: string,
    nextRole: "user" | "moderator",
  ) {
    setManagedUsersError(null);

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(userId)}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: nextRole,
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Could not update user role.");
      }

      await loadManagedUsers();
    } catch (error) {
      setManagedUsersError(
        error instanceof Error ? error.message : "Could not update user role.",
      );
    }
  }

  async function runEntryAction({
    action,
    successMessage,
  }: {
    action: () => Promise<Response>;
    successMessage: string;
  }) {
    setEntriesError(null);

    try {
      const response = await action();
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Action failed.");
      }

      setEntriesError(null);
      await loadRemoteEntries();

      console.log(successMessage, result);
    } catch (error) {
      setEntriesError(
        error instanceof Error ? error.message : "Action failed.",
      );
    }
  }

  async function handleApproveEntry(entryId: string) {
    const confirmed = window.confirm(
      "Approve and publish this entry to GitHub?",
    );

    if (!confirmed) return;

    await runEntryAction({
      successMessage: "Entry approved.",
      action: () =>
        fetch(`/api/moderation/entries/${encodeURIComponent(entryId)}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Approved from dashboard.",
          }),
        }),
    });
  }

  async function handleRejectEntry(entryId: string) {
    const message = window.prompt(
      "Why is this entry being rejected?",
      "Please revise this entry before resubmitting.",
    );

    if (message === null) return;

    await runEntryAction({
      successMessage: "Entry rejected.",
      action: () =>
        fetch(`/api/moderation/entries/${encodeURIComponent(entryId)}/reject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }),
    });
  }

  async function handleRequestEditEntry(entryId: string) {
    const message = window.prompt(
      "What do you want to change in this entry?",
      "I want to update this entry.",
    );

    if (message === null) return;

    await runEntryAction({
      successMessage: "Edit request submitted.",
      action: () =>
        fetch(`/api/entries/${encodeURIComponent(entryId)}/request-edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
          }),
        }),
    });
  }

  async function handleDeleteEntry(entryId: string) {
    const confirmed = window.confirm(
      "Delete this entry? This only works for unpublished entries.",
    );

    if (!confirmed) return;

    await runEntryAction({
      successMessage: "Entry deleted.",
      action: () =>
        fetch(`/api/entries/${encodeURIComponent(entryId)}`, {
          method: "DELETE",
        }),
    });
  }

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-24 text-white sm:px-6 lg:px-8">
      <p className="px-4 pt-4 text-sm text-white/40">{pageLabel}</p>

      <section className="mx-auto w-full max-w-7xl bg-[url('/images/codex/codex-background.jpg')] bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6">
        <div
          className={
            showEntryFilters
              ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]"
              : "grid gap-8"
          }
        >
          <GeneralContentContainer className="min-h-[70vh] min-w-0">
            <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {role}
                </p>

                <h1 className="font-[Spectral_SC] text-!3xl font-bold uppercase tracking-wide text-white md:!text-4xl">
                  Dashboard
                </h1>
              </div>

              <Link
                href="/editor/new-entry"
                className="w-full rounded-md border !border-[#fff48e] px-4 py-2 text-sm text-white transition-colors hover:!bg-[#fff48e] hover:!text-[#111120] sm:w-fit"
              >
                Create entry
              </Link>
            </header>

            <DashboardTabs
              activeDashboard={activeDashboard}
              setActiveDashboard={setActiveDashboard}
              canManageUsers={canManageUsers}
            />

            {activeDashboard === "entries" && (
              <section className="space-y-4">
                {entriesError && (
                  <p className="rounded-md border border-red-400/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                    {entriesError}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-[Spectral_SC] text-lg font-bold uppercase tracking-wider text-white">
                    Entries
                  </h2>

                  <button
                    type="button"
                    onClick={() => void loadRemoteEntries()}
                    className="w-fit rounded-md border border-white/40 px-3 py-2 text-xs text-white transition-colors hover:border-[#fff48e]"
                  >
                    Refresh Entries
                  </button>
                </div>

                {isLoadingEntries ? (
                  <p className="rounded-md border border-white/20 px-4 py-6 text-center text-sm text-white/60">
                    Loading entries...
                  </p>
                ) : (
                  <DashboardTable
                    entries={visibleRemoteEntries}
                    role={role}
                    onApprove={handleApproveEntry}
                    onReject={handleRejectEntry}
                    onRequestEdit={handleRequestEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                )}
              </section>
            )}

            {activeDashboard === "drafts" && (
              <section>
                <h2 className="mb-4 font-[Spectral_SC] text-lg font-bold uppercase tracking-wider text-white">
                  Local Drafts
                </h2>

                <LocalDraftList
                  drafts={visibleLocalDrafts}
                  onDelete={handleDeleteLocalDraft}
                />
              </section>
            )}

            {activeDashboard === "users" && canManageUsers && (
              <UserRoleDashboard
                users={managedUsers}
                isLoading={isLoadingManagedUsers}
                error={managedUsersError}
                onRefresh={loadManagedUsers}
                onRoleChange={updateManagedUserRole}
              />
            )}

            {activeDashboard === "users" && !canManageUsers && (
              <p className="rounded-md border border-white/20 px-4 py-6 text-center text-sm text-white/60">
                You do not have permission to manage users.
              </p>
            )}
          </GeneralContentContainer>

          {showEntryFilters && (
            <DashboardSearchForm
              className="order-first lg:order-none"
              filters={filters}
              setFilters={setFilters}
              fieldFilterOptions={fieldFilterOptions}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function DashboardTabs({
  activeDashboard,
  setActiveDashboard,
  canManageUsers,
}: {
  activeDashboard: DashboardTab;
  setActiveDashboard: (value: DashboardTab) => void;
  canManageUsers: boolean;
}) {
  return (
    <div className="mb-8 -mx-1 overflow-x-auto pb-2">
      <div className="flex min-w-max gap-2 px-1 sm:min-w-0 sm:flex-wrap sm:gap-3">
        <DashboardTabButton
          active={activeDashboard === "entries"}
          onClick={() => setActiveDashboard("entries")}
        >
          Entries
        </DashboardTabButton>

        <DashboardTabButton
          active={activeDashboard === "drafts"}
          onClick={() => setActiveDashboard("drafts")}
        >
          Local Drafts
        </DashboardTabButton>

        {canManageUsers && (
          <DashboardTabButton
            active={activeDashboard === "users"}
            onClick={() => setActiveDashboard("users")}
          >
            User Roles
          </DashboardTabButton>
        )}
      </div>
    </div>
  );
}

function DashboardTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 rounded-md border px-4 py-2 text-xs uppercase tracking-wider transition-colors sm:text-sm",
        active
          ? "border-[#fff48e] bg-[#fff48e] text-[#111120]"
          : "border-white/40 text-white hover:border-[#fff48e]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}


function DashboardTable({
  entries,
  role,
  onApprove,
  onReject,
  onRequestEdit,
  onDelete,
}: {
  entries: DashboardEntry[];
  role: DashboardRole;
  onApprove: (entryId: string) => void | Promise<void>;
  onReject: (entryId: string) => void | Promise<void>;
  onRequestEdit: (entryId: string) => void | Promise<void>;
  onDelete: (entryId: string) => void | Promise<void>;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-md border border-white/20 px-4 py-6 text-center text-sm text-white/60">
        No entries match the current filters.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4 lg:hidden">
        {entries.map((entry) => {
          const format = getEntryFormat(entry.entryType);

          return (
            <article
              key={entry.id}
              className="rounded-md border border-white/20 bg-[#111120]/70 px-4 py-4"
            >
              <div className="flex flex-col gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-[Spectral_SC] text-lg font-bold uppercase tracking-wider text-white">
                    {entry.title}
                  </h3>

                  <p className="mt-1 text-sm text-white/60">
                    {format.label}
                  </p>
                </div>

                <StatusBadge status={entry.status} />
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <MobileEntryMeta label="Author" value={entry.author} />
                <MobileEntryMeta label="Created" value={entry.creationDate} />
                <MobileEntryMeta label="Last edited" value={entry.lastEdition} />
              </dl>

              <div className="mt-4 border-t border-white/20 pt-4">
                <EntryActions
                  entry={entry}
                  role={role}
                  onApprove={onApprove}
                  onReject={onReject}
                  onRequestEdit={onRequestEdit}
                  onDelete={onDelete}
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[780px] border-collapse text-left text-xs">
          <thead>
            <tr className="font-[Spectral_SC] uppercase tracking-wider text-white">
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
            {entries.map((entry) => {
              const format = getEntryFormat(entry.entryType);

              return (
                <tr key={entry.id} className="border-t border-white/40">
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.author}</TableCell>
                  <TableCell>{format.label}</TableCell>
                  <TableCell>
                    <StatusBadge status={entry.status} />
                  </TableCell>
                  <TableCell>{entry.creationDate}</TableCell>
                  <TableCell>{entry.lastEdition}</TableCell>
                  <TableCell>
                    <EntryActions
                      entry={entry}
                      role={role}
                      onApprove={onApprove}
                      onReject={onReject}
                      onRequestEdit={onRequestEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MobileEntryMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wider text-white/40">
        {label}
      </dt>

      <dd className="mt-1 break-words text-white/80">{value}</dd>
    </div>
  );
}

function EntryActions({
  entry,
  role,
  onApprove,
  onReject,
  onRequestEdit,
  onDelete,
}: {
  entry: DashboardEntry;
  role: DashboardRole;
  onApprove: (entryId: string) => void | Promise<void>;
  onReject: (entryId: string) => void | Promise<void>;
  onRequestEdit: (entryId: string) => void | Promise<void>;
  onDelete: (entryId: string) => void | Promise<void>;
}) {
  const canModerate = role === "moderator" || role === "admin";

  const isReviewable =
    entry.status === "Pending" ||
    entry.status === "Rejected" ||
    entry.status === "Edit Requested";

  const isUnpublished =
    entry.status === "Pending" ||
    entry.status === "Rejected" ||
    entry.status === "Edit Requested";

  if (canModerate) {
    return (
      <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
        <ActionLink href={`/dashboard/entries/${entry.id}`}>View</ActionLink>

        <ActionLink href={`/editor/edit/${entry.id}`}>Edit</ActionLink>

        {isReviewable && (
          <>
            <ActionButton
              tone="success"
              onClick={() => void onApprove(entry.id)}
            >
              Approve
            </ActionButton>

            <ActionButton
              tone="danger"
              onClick={() => void onReject(entry.id)}
            >
              Reject
            </ActionButton>
          </>
        )}

        {isUnpublished && (
          <ActionButton
            tone="danger"
            onClick={() => void onDelete(entry.id)}
          >
            Delete
          </ActionButton>
        )}
      </div>
    );
  }

  if (entry.status === "Published" || entry.status === "Approved") {
    return (
      <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
        <ActionLink href={`/dashboard/entries/${entry.id}`}>View</ActionLink>

        <ActionButton onClick={() => void onRequestEdit(entry.id)}>
          Request Edit
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
      <ActionLink href={`/dashboard/entries/${entry.id}`}>View</ActionLink>

      {isUnpublished && (
        <>
          <ActionLink href={`/editor/edit/${entry.id}`}>Edit</ActionLink>

          <ActionButton
            tone="danger"
            onClick={() => void onDelete(entry.id)}
          >
            Delete
          </ActionButton>
        </>
      )}
    </div>
  );
}

function ActionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-md border border-white/30 px-3 py-2 text-center text-xs text-[#fff48e] transition-colors hover:border-[#fff48e] hover:bg-[#fff48e] hover:text-[#111120]"
    >
      {children}
    </Link>
  );
}

function ActionButton({
  children,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "default" | "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "border-green-300/50 text-green-300 hover:bg-green-300 hover:text-[#111120]"
      : tone === "danger"
        ? "border-red-300/50 text-red-300 hover:bg-red-300 hover:text-[#111120]"
        : "border-white/30 text-[#fff48e] hover:border-[#fff48e] hover:bg-[#fff48e] hover:text-[#111120]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md border px-3 py-2 text-center text-xs transition-colors",
        toneClass,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LocalDraftList({
  drafts,
  onDelete,
}: {
  drafts: LocalEntryDraft[];
  onDelete: (draftId: string) => void;
}) {
  if (drafts.length === 0) {
    return (
      <p className="rounded-md border border-white/20 px-4 py-4 text-sm text-white/60">
        No local drafts found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {drafts.map((draft) => {
        const format = getEntryFormat(draft.entryType);

        return (
          <article
  key={draft.id}
  className="flex flex-col gap-4 rounded-md border border-[#fff48e] bg-[#111120]/60 px-4 py-4 text-xs md:flex-row md:items-center md:justify-between"
>
  <div className="min-w-0">
    <h3 className="break-words font-[Spectral_SC] uppercase tracking-wider text-white">
      {draft.title}
    </h3>

    <p className="mt-1 text-white/70">{format.label}</p>

    <p className="mt-1 text-white/40">
      Updated: {formatLocalDate(draft.updatedAt)}
    </p>
  </div>

  <div className="grid gap-2 sm:grid-cols-2 md:flex md:flex-wrap">
    <ActionLink
      href={`/editor/new-entry?draftId=${encodeURIComponent(draft.id)}`}
    >
      Edit
    </ActionLink>

    <ActionButton tone="danger" onClick={() => onDelete(draft.id)}>
      Delete
    </ActionButton>
  </div>
</article>
        );
      })}
    </div>
  );
}

function UserRoleDashboard({
  users,
  isLoading,
  error,
  onRefresh,
  onRoleChange,
}: {
  users: ManagedUser[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void | Promise<void>;
  onRoleChange: (
    userId: string,
    nextRole: "user" | "moderator",
  ) => void | Promise<void>;
}) {
  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="font-[Spectral_SC] text-lg font-bold uppercase tracking-wider text-white">
          User Role Management
        </h2>

        <button
          type="button"
          onClick={() => void onRefresh()}
          className="w-fit rounded-md border border-white/40 px-3 py-2 text-xs text-white transition-colors hover:border-[#fff48e]"
        >
          Refresh Users
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-400/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {isLoading && (
        <p className="rounded-md border border-white/20 px-4 py-6 text-center text-sm text-white/60">
          Loading users...
        </p>
      )}

      {!isLoading && users.length === 0 && (
        <p className="rounded-md border border-white/20 px-4 py-6 text-center text-sm text-white/60">
          No users found.
        </p>
      )}

      {!isLoading && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => {
            const userId = user.userId ?? user.id;
            const isAdminUser = user.role === "admin";

            return (
              <article
                key={userId}
                className="flex flex-col gap-4 rounded-md border border-white/20 bg-[#111120]/70 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-[Spectral_SC] text-sm font-bold uppercase tracking-wider text-white">
                    {user.name}
                  </h3>

                  <p className="mt-1 text-xs text-white/60">{user.email}</p>

                  <p className="mt-2 text-xs uppercase tracking-wider text-[#fff48e]">
                    Current role: {user.role}
                  </p>

                  {isAdminUser && (
                    <p className="mt-1 text-xs text-white/40">
                      Admin users cannot be modified here.
                    </p>
                  )}
                </div>

                <div className="grid gap-2 sm:grid-cols-2 md:flex md:flex-wrap">
                  <button
                    type="button"
                    disabled={isAdminUser || user.role === "user"}
                    onClick={() => onRoleChange(userId, "user")}
                    className="w-full rounded-md border border-white/40 px-3 py-2 text-xs text-white transition-colors hover:border-[#fff48e] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                  >
                    Make User
                  </button>

                  <button
                    type="button"
                    disabled={isAdminUser || user.role === "moderator"}
                    onClick={() => onRoleChange(userId, "moderator")}
                    className="w-full rounded-md border border-[#fff48e] px-3 py-2 text-xs text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
                  >
                    Make Moderator
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatLocalDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return date.toLocaleString();
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="border-r border-white/40 px-3 py-3 last:border-r-0">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="max-w-[220px] border-r border-white/30 px-3 py-3 font-bold text-white last:border-r-0">
      <div className="break-words">{children}</div>
    </td>
  );
}

function StatusBadge({ status }: { status: EntryStatus }) {
  const className =
    status === "Pending"
      ? "text-yellow-200"
      : status === "Edit Requested"
        ? "text-blue-300"
        : status === "Approved" || status === "Published"
          ? "text-green-300"
          : "text-red-300";

  return <span className={className}>{status}</span>;
}

function buildFieldFilterOptions(
  filters: DashboardFilters,
  entries: Array<DashboardEntry | LocalEntryDraft>,
) {
  const formats =
    filters.entryFormat !== "All Entries"
      ? [getEntryFormat(filters.entryFormat)]
      : filters.entryGroup !== "All Entries"
        ? newEntryFormats.filter((format) => format.group === filters.entryGroup)
        : newEntryFormats;

  const fieldLabels = new Map<string, string>();

  formats.forEach((format) => {
    format.fields.forEach((field) => {
      if (["yaml", "stats", "boolean"].includes(field.kind)) return;

      fieldLabels.set(field.name, field.label);
    });
  });

  return Array.from(fieldLabels.entries())
    .map(([name, label]) => {
      const values = new Set<string>();

      entries.forEach((entry) => {
        const value = entry.fields[name];

        stringifyFieldValue(value).forEach((item) => {
          if (item.trim()) values.add(item);
        });
      });

      return {
        name,
        label,
        options: Array.from(values).sort(),
      };
    })
    .filter((field) => field.options.length > 0);
}

function matchesFilters(
  entry: DashboardEntry | LocalEntryDraft,
  filters: DashboardFilters,
) {
  const format = getEntryFormat(entry.entryType);
  const normalizedSearch = filters.search.trim().toLowerCase();

  const searchableValues = [
    entry.title,
    format.label,
    format.group,
    ...Object.values(entry.fields).flatMap((value) => stringifyFieldValue(value)),
  ];

  const matchesSearch =
    normalizedSearch.length === 0 ||
    searchableValues.some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );

  const matchesEntryState =
    isAll(filters.entryState) ||
    ("status" in entry && entry.status === filters.entryState);

  const matchesEntryGroup =
    isAll(filters.entryGroup) || format.group === filters.entryGroup;

  const matchesEntryFormat =
    isAll(filters.entryFormat) || entry.entryType === filters.entryFormat;

  const matchesDynamicFields = Object.entries(filters.fieldFilters).every(
    ([fieldName, expectedValue]) => {
      if (isAll(expectedValue)) return true;

      return stringifyFieldValue(entry.fields[fieldName]).some(
        (actualValue) => actualValue === expectedValue,
      );
    },
  );

  return (
    matchesSearch &&
    matchesEntryState &&
    matchesEntryGroup &&
    matchesEntryFormat &&
    matchesDynamicFields
  );
}

function stringifyFieldValue(value: EntryFieldValue | undefined): string[] {
  if (value === undefined || value === null) return [];

  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "object") {
    return Object.values(value).map(String);
  }

  return [String(value)];
}

function isAll(value: string) {
  return value === "All" || value === "All Entries" || value === "";
}

function toDashboardEntry(entry: EntryRecord): DashboardEntry {
  return {
    id: entry.entryId,
    title: entry.title,
    author: entry.authorName,
    authorId: entry.authorId,
    entryType: entry.entryType,
    status: toDashboardStatus(entry.status),
    creationDate: formatLocalDate(entry.createdAt),
    lastEdition: formatLocalDate(entry.updatedAt),
    fields: entry.fields,
  };
}

function toDashboardStatus(status: EntryRecord["status"]): EntryStatus {
  if (status === "pending") return "Pending";
  if (status === "approved") return "Approved";
  if (status === "published") return "Published";
  if (status === "rejected") return "Rejected";
  if (status === "edit-requested") return "Edit Requested";

  return "Pending";
}