import Image from "next/image";
import Link from "next/link";
import InfoCard from "@/components/InfoCard/InfoCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2936A7] from-30% to-[#0D0F25] to-45%">
      {/* Hero section */}
      <section className="relative mt-16 min-h-[560px] overflow-hidden bg-[#08091c] bg-[url('/images/wip-mainpage.png')] bg-cover bg-center bg-no-repeat sm:min-h-[640px] md:min-h-[760px]">
        <div className="absolute inset-0 bg-[#05071a]/30" />

        <div className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-7xl items-center px-4 sm:min-h-[640px] sm:px-6 md:min-h-[760px] lg:px-10">
          <div className="w-full max-w-xl rounded-md bg-gradient-to-r from-[#2936A7]/90 to-transparent px-6 py-12 sm:px-8 md:px-10">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <p className="font-pinyon text-3xl text-white/90 md:text-4xl">
                Welcome to the
              </p>

              <h1 className="mt-6 font-pinyon text-5xl leading-tight text-white sm:text-6xl md:text-7xl">
                Isles Of Vielora
              </h1>

              <p className="mt-8 font-cinzel text-xs font-bold uppercase tracking-[0.18em] text-white sm:text-sm md:text-base">
                Lore ipsum solor sip ament
              </p>

              <Link
                href="https://discord.gg/example"
                target="_blank"
                rel="noreferrer"
                className="mt-12 inline-flex w-full max-w-xs justify-center rounded-md border-2 border-[#fff48e] px-8 py-3 font-cinzel text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120] sm:w-auto"
              >
                Coming soon
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#2936A7]/70 to-[#2936A7]" />
      </section>

      {/* Main content section */}
      <section className="relative flex justify-center px-4 py-16 sm:px-6 lg:px-10">
        <div className="relative mx-auto w-full max-w-7xl bg-[#111120]/50 px-4 py-16 sm:px-8 md:px-10 lg:px-14">
          {/* Intro */}
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
            <h2 className="font-pinyon text-4xl text-white md:text-5xl">
              A discord fantasy roleplay server
            </h2>

            <p className="mt-6 font-cinzel text-xs font-bold uppercase leading-7 tracking-[0.18em] text-white sm:text-sm md:text-base">
              Discover the lore, characters, and adventures that await you.
            </p>
          </div>

          <ButterflyDivider reverse />

          {/* Info cards */}
          <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 py-8 sm:gap-12">
            <InfoCard
              title="Discover the World"
              text="Journey through the islands, kingdoms, cities, and strange regions that shape the world of Vielora."
              image="/images/main-page/world-view.jpg"
              imageAlt="Lore Image"
              variant="aqua"
            />

            <InfoCard
              title="Explore the Codex"
              text="Uncover creatures, spells, techniques, relics, minerals, potions, and other wonders recorded across the ages."
              image="/images/main-page/book.jpg"
              imageAlt="Lore Image"
              variant="cyan"
              reverse
            />

            <InfoCard
              title="Meet the characters"
              text="Learn about its races, cultures, heroes, rulers, gods, and the characters whose choices shape its history."
              image="/images/main-page/Emerald.png"
              imageAlt="Lore Image"
              variant="blue"
            />

            <InfoCard
              title="Explore the Lore"
              text="Follow legends, historical events, personal chronicles, and ongoing tales from across the Isles of Vielora."
              image="/images/Deyanira.png"
              imageAlt="Lore Image"
              variant="purple"
              reverse
            />
          </div>

          <ButterflyDivider />

          {/* CTA */}
          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center pb-16 pt-8 text-center">
            <h2 className="font-pinyon text-4xl text-white md:text-5xl">
              A discord fantasy roleplay server
            </h2>

            <Link
              href="https://discord.gg/example"
              target="_blank"
              rel="noreferrer"
              className="mt-12 inline-flex w-full max-w-xs justify-center rounded-md border-2 border-[#fff48e] px-8 py-3 font-cinzel text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120] sm:w-auto"
            >
              coming soon
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ButterflyDivider({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="my-16 flex w-full justify-center overflow-hidden">
      <Image
        src="/images/crystal-butterfly.png"
        alt=""
        width={400}
        height={200}
        className={[
          "h-auto w-full max-w-[260px] sm:max-w-[340px] md:max-w-[400px]",
          reverse ? "rotate-y-180" : "",
        ].join(" ")}
      />
    </div>
  );
}