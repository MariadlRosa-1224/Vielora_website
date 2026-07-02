// src/components/codex/CodexEntryLayout.tsx

import GeneralContentContainer from "../GeneralContentContainer";

type CodexEntryLayoutProps = {
  structuredSection: React.ReactNode;
  markdownSection: React.ReactNode;
};

export default function CodexEntryLayout({
  structuredSection,
  markdownSection,
}: CodexEntryLayoutProps) {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <GeneralContentContainer>
          {structuredSection}
        </GeneralContentContainer>

        <GeneralContentContainer>
          <div className="
              mx-auto max-w-5xl
              text-white
              [&_h1]:mb-8
              [&_h1]:font-serif
              [&_h1]:text-3xl
              [&_h1]:font-bold
              [&_h1]:uppercase
              [&_h1]:tracking-wider
              md:[&_h1]:text-4xl

              [&_h2]:mb-5
              [&_h2]:mt-10
              [&_h2]:font-serif
              [&_h2]:text-2xl
              [&_h2]:font-bold
              [&_h2]:uppercase
              [&_h2]:tracking-wider

              [&_p]:my-5
              [&_p]:max-w-none
              [&_p]:text-base
              [&_p]:leading-8

              [&_ul]:my-5
              [&_ul]:list-disc
              [&_ul]:pl-8
              [&_li]:my-2

              [&_img]:mx-auto
              [&_img]:my-12
              [&_img]:max-h-[420px]
              [&_img]:w-auto
              [&_img]:rounded-md
            ">
            {markdownSection}
          </div>
        </GeneralContentContainer>
      </div>
    </main>
  );
}