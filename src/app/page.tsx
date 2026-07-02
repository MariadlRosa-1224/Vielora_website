import Image from "next/image";
import Link from "next/link";
import InfoCard from "@/components/InfoCard/InfoCard";



export default function Home() {
  return (
    
      <main className="min-h-screen bg-gradient-to-b from-[#2936A7] to-[#2936A7] ">
<section className="relative min-h-[640px] overflow-hidden bg-[#08091c] bg-[url('/images/wip-mainpage.png')] bg-cover bg-center bg-no-repeat md:min-h-[760px] mt-16">
      {/* Overlay general para oscurecer un poco la imagen */}
      <div className="absolute inset-0 bg-[#05071a]/20 " />

      {/* Contenido */}
      <div className=" relative z-10 mx-0 min-h-[760px] max-w-7xl items-center ">
        <div className="flex-col min-h-[760px] max-w-xl bg-gradient-to-r from-[#2936A7]/90 to-transparent px-8 py-10 md:px-10 pt-40">
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
          <p className="font-pinyon text-3xl text-white/90 md:text-4xl">
            Welcome to the
          </p>

          <h1 className="mt-6 font-pinyon text-5xl leading-tight text-white md:text-7xl">
            Isles Of Vielora
          </h1>

          <p className="mt-8 font-cinzel text-sm font-bold uppercase tracking-[0.18em] text-white md:text-base">
            Lore ipsum solor sip ament
          </p>
          </div>

          <Link
            href="https://discord.gg/example"
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex min-w-56 justify-center rounded-md border-2 border-[#fff48e] px-8 py-3 font-cinzel text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120]"
          >
            Join the server
          </Link>
        </div>
      </div>

      {/* Gradiente inferior hacia la siguiente sección */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#2936A7]/70 to-[#2936A7]" />
    </section>

    <section className="relative min-h-[760px] flex justify-center md:min-h-[760px]">
    <div className="relative min-h-[760px] min-w-[1048px] max-w-7xl bg-[#111120]/50 my-20 mx-10 md:min-h-[760px]">
        {/* Contenido de la sección */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 py-10 md:px-10 pt-40 mb-20">
          <h2 className="font-pinyon text-4xl text-white md:text-5xl">
            a discord fantasy roleplay server
          </h2>
          <p className="mt-6 font-cinzel text-sm font-bold uppercase tracking-[0.18em] text-white md:text-base">
            Discover the lore, characters, and adventures that await you.
          </p>
        </div>
        {/* imagen que divide un div del otros*/}
        <div className="relative flex w-full items-center justify-left rotate-y-180 left-0 mb-20 pl-170 md:mb-20 ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={400}
            height={200}
          />
        </div>
        {/* infocards*/ }
        <div className=" h-[100vh]  relative box-border flex flex-col content-between items-center justify-evenly right-0 mb-20">
          <InfoCard
            title="Explore the Lore"
            text="Dive into the rich history and stories of Vielora, uncovering secrets and legends."
            image="/images/Deyanira.png"
            imageAlt="Lore Image"
            variant="purple"
          />
          <InfoCard
            title="Explore the Lore"
            text="Dive into the rich history and stories of Vielora, uncovering secrets and legends."
            image="/images/Emerald_old.png"
            imageAlt="Lore Image"
            variant="blue"
            reverse={true}
          />
                    <InfoCard
            title="Explore the Lore"
            text="Dive into the rich history and stories of Vielora, uncovering secrets and legends."
            image="/images/Emerald_old.png"
            imageAlt="Lore Image"
            variant="cyan"
          />
                    <InfoCard
            title="Explore the Lore"
            text="Dive into the rich history and stories of Vielora, uncovering secrets and legends."
            image="/images/Emerald_old.png"
            imageAlt="Lore Image"
            variant="pink"
            reverse={true}
          />

        </div>

                {/* imagen que divide un div del otros*/}
        <div className="relative flex w-full items-center justify-left left-0 mb-20 pl-170 md:mb-20 ">
          <Image
            src="/images/crystal-butterfly.png"
            alt="Imagen de ejemplo"
            width={400}
            height={200}
          />
        </div>

           
        <div className="relative z-10 flex flex-col items-center justify-center px-8 py-10 md:px-10 pt-20 mb-80">
          <h2 className="font-pinyon text-4xl text-white md:text-5xl">
            a discord fantasy roleplay server
          </h2>
          <Link
            href="https://discord.gg/example"
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex min-w-[1/2] justify-center rounded-md border-2 border-[#fff48e] px-8 py-3 font-cinzel text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#fff48e] hover:text-[#111120]"
          >
            Join Our Server
          </Link>
        </div>
         
    </div>

    </section>

      </main>
    
  );
}
