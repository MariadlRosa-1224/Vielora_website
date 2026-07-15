// src/app/dashboard/entries/[entryId]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import GeneralContentContainer from "@/components/containers/GeneralContentContainer";
import { verifySession } from "@/lib/dal";
import { getEntryById } from "@/lib/aws-entries";
import { createPendingAssetReadUrl } from "@/lib/aws-pending-assets";
import {
  canEditEntry,
  canViewEntry,
} from "@/lib/entry-authorization";
import { getEntryFormat } from "@/lib/new-entry-format";
import type { EntryRecord } from "@/lib/entries-types";

type PageProps = {
  params: Promise<{
    entryId: string;
  }>;
};

export default async function DashboardEntryPreviewPage({
  params,
}: PageProps) {
  const { user } = await verifySession();
  const { entryId } = await params;

  const entry = await getEntryById(entryId);

  if (!entry) {
    notFound();
  }

  if (!canViewEntry(user, entry)) {
    return (
      <EntryPageShell>
        <GeneralContentContainer>
          <h1 className="font-[Spectral_SC] text-2xl font-bold uppercase text-white">
            Forbidden
          </h1>

          <p className="mt-4 text-sm text-white/70">
            You do not have permission to view this entry.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-block text-[#fff48e] hover:underline"
          >
            Return to dashboard
          </Link>
        </GeneralContentContainer>
      </EntryPageShell>
    );
  }

  const canEdit = canEditEntry(user, entry);
  const mainImageSrc = await getPreviewImageSrc(entry);
  const format = getEntryFormat(entry.entryType);

  return (
    <EntryPageShell>
      <GeneralContentContainer className="space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Entry Preview
            </p>

            <h1 className="mt-2 font-[Spectral_SC] text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
              {entry.title}
            </h1>

            <p className="mt-2 text-sm text-white/60">
              {format.label} · {entry.status}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-md border border-white/40 px-4 py-2 text-sm text-white transition-colors hover:border-[#fff48e]"
            >
              Back
            </Link>

            {canEdit && (
              <Link
                href={`/editor/edit/${entry.entryId}`}
                className="rounded-md border border-[#fff48e] px-4 py-2 text-sm text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120]"
              >
                Edit
              </Link>
            )}
          </div>
        </header>

        {mainImageSrc && (
          <figure className="overflow-hidden rounded-lg border border-[#fff48e]/60 bg-black/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImageSrc}
              alt={entry.imageAlt ?? entry.title}
              className="max-h-[420px] w-full object-cover"
            />

            {entry.imageAlt && (
              <figcaption className="px-4 py-2 text-xs text-white/50">
                {entry.imageAlt}
              </figcaption>
            )}
          </figure>
        )}

        <section>
          <h2 className="mb-3 font-[Spectral_SC] text-xl font-bold uppercase tracking-wide text-white">
            Metadata
          </h2>

          <EntryMetadata entry={entry} />
        </section>

        <section>
          <h2 className="mb-3 font-[Spectral_SC] text-xl font-bold uppercase tracking-wide text-white">
            Fields
          </h2>

          <EntryFieldsPreview entry={entry} />
        </section>

        <section>
          <h2 className="mb-3 font-[Spectral_SC] text-xl font-bold uppercase tracking-wide text-white">
            Content Preview
          </h2>

          <div className="prose prose-invert max-w-none rounded-md border border-white/20 bg-[#111120]/60 px-5 py-5 text-white">
            {entry.markdown.trim() ? (
              <MDXRemote source={entry.markdown} />
            ) : (
              <p className="text-sm text-white/50">No markdown content.</p>
            )}
          </div>
        </section>
      </GeneralContentContainer>
    </EntryPageShell>
  );
}

function EntryPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl bg-[url('/images/codex/codex-background.jpg')] bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6">
        {children}
      </section>
    </main>
  );
}

async function getPreviewImageSrc(entry: EntryRecord) {
  if (!entry.mainImage) {
    return null;
  }

  if (entry.status === "published" && entry.mainImage.publicPath) {
    return entry.mainImage.publicPath;
  }

  if (entry.mainImage.s3Key) {
    return createPendingAssetReadUrl(entry.mainImage.s3Key);
  }

  return entry.mainImage.publicPath ?? null;
}

function EntryMetadata({ entry }: { entry: EntryRecord }) {
  return (
    <dl className="grid gap-3 text-sm md:grid-cols-2">
      <MetadataItem label="Author" value={entry.authorName} />
      <MetadataItem label="Status" value={entry.status} />
      <MetadataItem label="Entry Type" value={entry.entryType} />
      <MetadataItem label="Slug" value={entry.slug} />
      <MetadataItem label="Created" value={formatDate(entry.createdAt)} />
      <MetadataItem label="Updated" value={formatDate(entry.updatedAt)} />

      {entry.reviewMessage && (
        <MetadataItem label="Review Message" value={entry.reviewMessage} />
      )}

      {entry.editRequestMessage && (
        <MetadataItem
          label="Edit Request"
          value={entry.editRequestMessage}
        />
      )}
    </dl>
  );
}

function MetadataItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/20 bg-[#111120]/60 px-4 py-3">
      <dt className="text-xs uppercase tracking-wider text-white/40">
        {label}
      </dt>

      <dd className="mt-1 break-words text-white">{value}</dd>
    </div>
  );
}

function EntryFieldsPreview({ entry }: { entry: EntryRecord }) {
  const format = getEntryFormat(entry.entryType);

  const fieldRows = format.fields.map((field) => ({
    label: field.label,
    value: entry.fields[field.name],
  }));

  if (fieldRows.length === 0) {
    return (
      <p className="rounded-md border border-white/20 px-4 py-4 text-sm text-white/60">
        No fields available.
      </p>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fieldRows.map((field) => (
        <div
          key={field.label}
          className="rounded-md border border-white/20 bg-[#111120]/60 px-4 py-3 text-sm"
        >
          <p className="text-xs uppercase tracking-wider text-white/40">
            {field.label}
          </p>

          <div className="mt-2 whitespace-pre-wrap text-white">
            {formatFieldValue(field.value)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatFieldValue(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "None";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "None";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}