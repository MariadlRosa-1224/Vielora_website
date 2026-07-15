// src/components/codex/DualEntryLayout.tsx

import GeneralContentContainer from "../containers/GeneralContentContainer";
import MarkdownContent from "@/components/entry-Layout/MarkdownContent";

type DualEntryLayoutProps = {
  structuredSection: React.ReactNode;
  markdownSection: React.ReactNode;
};

export default function DualEntryLayout({
  structuredSection,
  markdownSection,
}: DualEntryLayoutProps) {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <GeneralContentContainer className="p-5 sm:p-8">
          {structuredSection}
        </GeneralContentContainer>

        <GeneralContentContainer className="p-5 sm:p-8">
          <div className="mx-auto w-full max-w-5xl">
            <MarkdownContent>{markdownSection}</MarkdownContent>
          </div>
        </GeneralContentContainer>
      </div>
    </main>
  );
}