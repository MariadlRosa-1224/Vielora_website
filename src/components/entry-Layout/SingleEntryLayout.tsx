// src/components/codex/SingleEntryLayout.tsx

import GeneralContentContainer from "../containers/GeneralContentContainer";

type SingleEntryLayoutProps = {
  structuredSection: React.ReactNode;
};

export default function SingleEntryLayout({
  structuredSection,

}: SingleEntryLayoutProps) {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <GeneralContentContainer>
          {structuredSection}
        </GeneralContentContainer>


      </div>
    </main>
  );
}