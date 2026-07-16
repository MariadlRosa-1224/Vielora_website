// src/app/world-information/page.tsx

import Image from "next/image";
import VerticalColorButton from "@/components/linkButtons/VerticalColorButton";
import { getWorldInformationSections } from "@/lib/world-information";
import { vieloraGradients } from "@/theme/colors";

export default function WorldInformationPage() {
  const sections = getWorldInformationSections();

  return (
    <main className="min-h-screen bg-[#0D0F25] bg-[url('/images/page-backgrounds/dark-starry-sky.jpg')] bg-cover bg-center bg-no-repeat">
      <section className="relative mt-16 min-h-[280px] overflow-hidden bg-[#08091c] bg-[url('/images/world-information/library-wip.png')] bg-cover bg-center bg-no-repeat sm:min-h-[360px] md:min-h-[50vh]" />

      <section className="relative flex justify-center bg-[#0D0F25] px-4 py-16 sm:px-6 lg:px-10">
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <TitleField title="World Information" />

            <div className="relative mt-8 flex w-full max-w-3xl justify-center">
              <p className="text-center font-cinzel text-xs leading-7 tracking-[0.16em] text-white sm:text-sm md:text-base md:tracking-[0.18em]">
                From mechanics to history, this section provides a comprehensive overview of the world of Vielora, its rules, and its lore.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-20 px-4 pb-24 sm:px-6 lg:px-10">
        {sections.map((section) => (
          <InfoSection
            key={section.id}
            title={section.title}
            items={section.entries}
          />
        ))}
      </div>
    </main>
  );
}

function TitleField({ title }: { title: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 text-center sm:flex-row">
      <div className="hidden h-[80px] items-center sm:flex">
        <Image
          src="/images/crystal-butterfly.png"
          alt=""
          width={260}
          height={100}
          className="h-auto w-[220px] rotate-y-180 md:w-[300px]"
        />
      </div>

      <h2 className="font-['Spectral_SC'] text-3xl text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>

      <div className="hidden h-[80px] items-center sm:flex">
        <Image
          src="/images/crystal-butterfly.png"
          alt=""
          width={260}
          height={100}
          className="h-auto w-[220px] md:w-[300px]"
        />
      </div>
    </div>
  );
}

function InfoSection({
  title,
  items,
}: {
  title: string;
  items: {
    title: string;
    image: string;
    href: string;
    slug: string;
    gradient: keyof typeof vieloraGradients;
  }[];
}) {
  return (
    <section className="relative mx-auto flex w-full max-w-7xl flex-col items-center mt-12">
      <TitleField title={title} />

      <div className="mt-12 grid w-full grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <VerticalColorButton
            key={item.slug}
            title={item.title}
            image={item.image}
            href={item.slug}
            gradient={item.gradient}
          />
        ))}
      </div>
    </section>
  );
}