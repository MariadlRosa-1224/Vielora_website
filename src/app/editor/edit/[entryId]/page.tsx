// src/app/editor/edit/[entryId]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import GeneralContentContainer from "@/components/containers/GeneralContentContainer";
import EntryEditClient from "@/components/editor/EntryEditClient";
import { verifySession } from "@/lib/dal";
import { getEntryById } from "@/lib/aws-entries";
import {
  canEditEntry,
  canViewEntry,
} from "@/lib/entry-authorization";

type PageProps = {
  params: Promise<{
    entryId: string;
  }>;
};

export default async function EditEntryPage({ params }: PageProps) {
  const { user } = await verifySession();
  const { entryId } = await params;

  const entry = await getEntryById(entryId);

  if (!entry) {
    notFound();
  }

  if (!canViewEntry(user, entry)) {
    return (
      <EditPageShell>
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
      </EditPageShell>
    );
  }

  if (!canEditEntry(user, entry)) {
    return (
      <EditPageShell>
        <GeneralContentContainer>
          <h1 className="font-[Spectral_SC] text-2xl font-bold uppercase text-white">
            Editing not allowed
          </h1>

          <p className="mt-4 text-sm text-white/70">
            You can view this entry, but you cannot edit it in its current
            status.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/dashboard/entries/${entry.entryId}`}
              className="rounded-md border border-[#fff48e] px-4 py-2 text-sm text-white hover:bg-[#fff48e] hover:text-[#111120]"
            >
              View Preview
            </Link>

            <Link
              href="/dashboard"
              className="rounded-md border border-white/40 px-4 py-2 text-sm text-white hover:border-[#fff48e]"
            >
              Dashboard
            </Link>
          </div>
        </GeneralContentContainer>
      </EditPageShell>
    );
  }

  return (
    <EditPageShell>
      <EntryEditClient initialEntry={entry} />
    </EditPageShell>
  );
}

function EditPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl bg-[url('/images/codex/codex-background.jpg')] bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6">
        {children}
      </section>
    </main>
  );
}