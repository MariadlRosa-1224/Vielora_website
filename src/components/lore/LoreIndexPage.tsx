// src/components/lore/LoreIndexPage.tsx

import LoreLinkCard, { LoreCardVariant } from "../linkButtons/LoreLinkCard";

export type { LoreCardVariant };

export type LoreIndexEntry = {
  id: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  href: string;
  variant?: LoreCardVariant;
};

export type LoreIndexSection = {
  id: string;
  title: string;
  entries: LoreIndexEntry[];
};

type LoreIndexPageProps = {
  title: string;
  description: string;
  sections: LoreIndexSection[];
};

export default function LoreIndexPage({
  title,
  description,
  sections,
}: LoreIndexPageProps) {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-6 py-24 text-white">
      <section className="mx-auto flex max-w-6xl flex-col items-center">
        <h1 className="text-center font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider text-white md:text-4xl">
          {title}
        </h1>

        <p className="mt-8 max-w-3xl text-center text-sm font-semibold leading-relaxed text-white md:text-base">
          {description}
        </p>

        <div className="mt-14 flex w-full flex-col gap-14">
          {sections.map((section) => (
            <section key={section.id} className="w-full">
              <h2 className="mb-8 text-center font-[Spectral_SC] text-2xl font-bold uppercase tracking-wider text-white md:text-3xl">
                {section.title}
              </h2>

              <div className="flex flex-col gap-8">
                {section.entries.map((entry, index) => (
                  <LoreLinkCard
                    key={entry.id}
                    title={entry.title}
                    text={entry.text}
                    image={entry.image}
                    imageAlt={entry.imageAlt}
                    href={entry.href}
                    variant={entry.variant ?? "purple"}
                    reverse={index % 2 === 1}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}