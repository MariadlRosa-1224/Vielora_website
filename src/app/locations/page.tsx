// src/app/locations/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import TransparentDropdown, {
  TransparentDropdownItem,
} from "@/components/lore/TransparentDropdown";
import { locationGroups } from "@/lib/location-groups";


const dropdownItems: TransparentDropdownItem[] = locationGroups.map((group) => ({
  label: group.name,
  value: group.id,
}));

export default function LocationsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState("vielora");

  const selectedGroup = useMemo(() => {
    return (
      locationGroups.find((group) => group.id === selectedGroupId) ??
      locationGroups[0]
    );
  }, [selectedGroupId]);

  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-6 py-20 text-white">
      <section className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <h1 className="mb-10 font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider text-white">
            Locations
          </h1>

          <div className="relative overflow-hidden rounded-lg border border-white/50 bg-[#111120]/50 shadow-xl">
            <div className="relative aspect-[816/577] w-full">
              <Image
                src={selectedGroup.mapImage}
                alt={selectedGroup.mapAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />

              {selectedGroup.locations.map((location) => {
                if (!location.pin) return null;

                return (
                  <Link
                    key={location.id}
                    href={location.href}
                    title={location.title}
                    className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: location.pin.top,
                      left: location.pin.left,
                    }}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span className="absolute h-5 w-5 rounded-full bg-white/20 opacity-0 transition group-hover:scale-150 group-hover:opacity-100" />

                      <span className="relative h-5 w-5 rotate-45 rounded-full rounded-br-none border-2 border-white bg-white/10 shadow-md transition group-hover:border-[#fff48e] group-hover:bg-[#fff48e]/20" />

                      <span className="absolute top-[9px] h-2 w-2 rounded-full bg-white transition group-hover:bg-[#fff48e]" />
                    </span>

                    <span className="sr-only">{location.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          <TransparentDropdown
            label={selectedGroup.name}
            items={dropdownItems}
            selectedValue={selectedGroup.id}
            onSelect={(item) => {
              if (item.value) {
                setSelectedGroupId(item.value);
              }
            }}
            variant="compact"
            className="w-full"
          />

          <nav className="flex flex-col gap-3">
            {selectedGroup.locations.map((location) => (
              <Link
                key={location.id}
                href={location.href}
                className="rounded-md border border-[#fff48e] bg-[#111120]/55 px-4 py-2 text-center text-sm text-white backdrop-blur-sm transition hover:bg-[#fff48e] hover:text-[#111120]"
              >
                {location.title}
              </Link>
            ))}
          </nav>
        </aside>
      </section>
    </main>
  );
}