// src/app/lore/page.tsx

import HorizontalColorButtonBig from "@/components/linkButtons/HorizontalColorButtonBig";
import GeneralContainerNoBorder from "@/components/containers/GeneralContainerNoBorder";
import type { VieloraHorizontalGradient } from "@/theme/colors";

type LoreSection = {
  title: string;
  description: string;
  href: string;
  gradient: VieloraHorizontalGradient;
};

const loreSections: LoreSection[] = [
  {
    title: "World History",
    href: "/lore/world-history",
    gradient: "violetHorizontal",
    description:
      "The history of the world and its civilizations.",
  },
  {
    title: "Timeline",
    href: "/lore/timeline",
    gradient: "royalBlueHorizontal",
    description:
      "A summary of the lore and stories within Vielora's roleplay to this day.",
  },
  {
    title: "Characters",
    href: "/lore/characters",
    gradient: "royalBlueHorizontal",
    description:
      "A list of the main characters and npcs in Vielora's lore.",
  },
  {
    title: "Legends and Folklore",
    href: "/lore/legends-and-folklore",
    gradient: "skyBlueHorizontal",
    description:
      "Tales and legends from the world of Vielora.",
  },
  {
    title: "Extras",
    href: "/lore/extras",
    gradient: "aquaHorizontal",
    description:
      "Additional content and information about the world of Vielora.",
  },
];

export default function LorePage() {
  return (
    <main className="min-h-screen bg-[#2D2C42] bg-[url('/images/page-backgrounds/galaxies.jpg')] px-8 py-24 text-white">
      <section className="overflow-hidden ">
        <div className="relative min-h-[620px]  bg-cover bg-center bg-no-repeat px-8 py-10">
          <div className="absolute inset-0 bg-[#111120]/25" />

          <div className="relative z-10 grid min-h-[540px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_600px]">
            <div className="flex justify-center lg:justify-start">
              <GeneralContainerNoBorder className="flex min-h-[460px] w-full max-w-[520px] flex-col items-center justify-center bg-[#111120]/65 px-10 py-12 text-center backdrop-blur-sm">
                <h1 className="mb-12 font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider text-white">
                  Lore
                </h1>

                <p className="max-w-[360px] text-sm leading-6 text-white">
                  This page serves as an index to all the lore and stories within
                  Vielora.
                </p>
              </GeneralContainerNoBorder>
            </div>

            <nav className="flex flex-col items-end gap-4">
              {loreSections.map((section) => (
                <HorizontalColorButtonBig
                  key={section.href}
                  href={section.href}
                  title={section.title}
                  description={section.description}
                  gradient={section.gradient}
                  className="w-full max-w-[600px]"
                />
              ))}
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}