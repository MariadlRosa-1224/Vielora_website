// src/components/locations/MainLocationPage.tsx

import Image from "next/image";
import Link from "next/link";
import GeneralContainerNoBorder from "@/components/containers/GeneralContainerNoBorder";

export type SubLocationLink = {
  id: string;
  title: string;
  href: string;
};

export type MainLocationPageProps = {
  title: string;
  description: string;
  backgroundImage: string;
  mapImage?: string;
  mapAlt?: string;
  entryHref: string;
  subLocations: SubLocationLink[];
};

export default function MainLocationPage({
  title,
  description,
  backgroundImage,
  mapImage,
  mapAlt = "Location map",
  entryHref,
  subLocations,
}: MainLocationPageProps) {
  return (
    <main
      className="relative min-h-screen bg-[#111120] bg-cover bg-center bg-no-repeat px-6 py-24 text-white"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/25" />

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[380px_minmax(0,1fr)]">
        <GeneralContainerNoBorder className="flex min-h-[520px] flex-col items-center justify-center text-center">
          <h1 className="font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider text-white">
            {title}
          </h1>

          <p className="mt-10 text-base font-semibold leading-relaxed text-white">
            {description}
          </p>

          <Link
            href={entryHref}
            className="mt-10 rounded-md border border-[#fff48e] bg-[#111120]/50 px-12 py-2 text-sm font-semibold text-white transition hover:bg-[#fff48e] hover:text-[#111120]"
          >
            Learn more
          </Link>
        </GeneralContainerNoBorder>

        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-[6px] border border-white/50 bg-[#111120]/60 shadow-xl">
            {mapImage ? (
              <div className="relative aspect-[816/577] w-full">
                <Image
                  src={mapImage}
                  alt={mapAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[816/577] w-full items-center justify-center bg-[#111120]/80 text-sm text-white/60">
                No map available.
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-4">
            {subLocations.length > 0 ? (
              subLocations.map((location) => (
                <Link
                  key={location.id}
                  href={location.href}
                  className="rounded-md border border-[#fff48e] bg-[#111120]/50 px-4 py-2 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-[#fff48e] hover:text-[#111120]"
                >
                  {location.title}
                </Link>
              ))
            ) : (
              <p className="rounded-md border border-white/20 bg-[#111120]/50 px-4 py-4 text-center text-sm text-white/60">
                No sublocations available yet.
              </p>
            )}
          </nav>
        </div>
      </section>
    </main>
  );
}