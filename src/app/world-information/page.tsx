// src/app/world-information/page.tsx

import Image from "next/image";
import VerticalColorButton from "@/components/linkButtons/VerticalColorButton";
import { getWorldInformationSections } from "@/lib/world-information";
import { vieloraGradients } from "@/theme/colors";

export default function WorldInformationPage() {
  const sections = getWorldInformationSections();

  return (
    <main className="min-h-screen bg-[#0D0F25] bg-[url('/images/page-backgrounds/dark-starry-sky.jpg')] bg-cover bg-center bg-no-repeat">
      <section className="relative mt-16 max-h-[50vh] overflow-hidden bg-[#08091c] bg-[url('/images/world-information/library-wip.png')] bg-cover bg-center bg-no-repeat md:min-h-[50vh]" />

      <section className="relative flex min-h-[30vh] max-h-[100vh] justify-center bg-[#0D0F25] py-10 md:min-h-[50vh]">
        <div className="relative mx-10 min-w-[1048px] max-w-7xl">
          <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-10 md:px-10">
            <TitleField title="World Information" />

            <div className="relative flex w-[60vw] justify-center">
              <p className="mt-6 pt-5 text-center font-cinzel text-sm tracking-[0.18em] text-white md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut
                hendrerit ligula, in maximus est. Sed et sem sem. Nunc
                ultricies lorem at sapien iaculis facilisis. Ut nulla magna,
                luctus eu lacinia et, ullamcorper sed nulla.
              </p>
            </div>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.id}
          className="relative flex min-h-[760px] flex-col justify-center md:min-h-[760px]"
        >
          <InfoSection title={section.title} items={section.entries} />
        </section>
      ))}
    </main>
  );
}

function TitleField({ title }: { title: string }) {
  return (
    <div className="relative flex h-[100px] w-full justify-center">
      <div className="relative flex h-[80px] rotate-y-180 items-center justify-left">
        <Image
          src="/images/crystal-butterfly.png"
          alt=""
          width={300}
          height={100}
        />
      </div>

      <h2 className="mx-[5vw] text-center font-['Spectral_SC'] text-4xl text-white md:text-5xl">
        {title}
      </h2>

      <div className="relative flex h-[80px] items-center justify-left">
        <Image
          src="/images/crystal-butterfly.png"
          alt=""
          width={300}
          height={100}
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
    gradient: keyof typeof vieloraGradients;
  }[];
}) {
  return (
    <div className="relative mx-10 my-20 flex min-h-[760px] min-w-[80vw] max-w-7xl flex-col items-center justify-center md:min-h-[760px]">
      <TitleField title={title} />

      <div className="relative mx-10 my-20 flex min-h-[760px] min-w-[1048px] max-w-7xl flex-wrap items-start justify-around md:min-h-[760px]">
        {items.map((item) => (
          <VerticalColorButton
            key={item.href}
            title={item.title}
            image={item.image}
            href={item.href}
            gradient={item.gradient}
          />
        ))}
      </div>
    </div>
  );
}