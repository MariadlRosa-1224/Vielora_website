// src/components/codex/SingleEntryLayout.tsx

import GeneralContentContainer from "../containers/GeneralContentContainer";

type SingleEntryLayoutProps = {
  structuredSection: React.ReactNode;
};

export default function SingleEntryLayout({
  structuredSection,
}: SingleEntryLayoutProps) {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <GeneralContentContainer className="p-5 sm:p-8">
          {structuredSection}
        </GeneralContentContainer>
      </div>
    </main>
  );
}