// src/components/entry-Layout/MarkdownOnlyLayout.tsx

import GeneralContentContainer from "../containers/GeneralContentContainer";
import MarkdownContent from "./MarkdownContent";

type MarkdownOnlyLayoutProps = {
  markdownSection: React.ReactNode;
  pageBackground?: string;
};

export default function MarkdownOnlyLayout({
  markdownSection,
  pageBackground,
}: MarkdownOnlyLayoutProps) {
  const backgroundImage =
    pageBackground ?? "/images/page-backgrounds/dark-starry-sky.jpg";

  return (
    <main
      className="min-h-screen bg-[#111120] bg-fixed bg-cover bg-center bg-no-repeat px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <GeneralContentContainer className="p-5 sm:p-8">
          <div className="mx-auto w-full max-w-5xl">
            <MarkdownContent>{markdownSection}</MarkdownContent>
          </div>
        </GeneralContentContainer>
      </div>
    </main>
  );
}