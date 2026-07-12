

import TransparentDropdown, { TransparentDropdownItem } from "@/components/lore/TransparentDropdown";

const items: TransparentDropdownItem[] = [
  { label: "Chapter 1", value: "chapter-1", href: "/lore/world-history#chapter-1" },
  { label: "Chapter 2", value: "chapter-2", href: "/lore/world-history#chapter-2" },
  { label: "Chapter 3", value: "chapter-3", href: "/lore/world-history#chapter-3" },
];

export default async function LocationEntryPage() {



/*   if (!entry) {
    notFound();
  } */


  return (
    <>
    <section id="chapter-1" className="flex min-h-screen flex-col items-center justify-center gap-4 mt-16">
    
    <TransparentDropdown
    label="chapter 1"
    items={items}
    selectedValue={undefined}
    variant="compact"
    className="w-[300px]"
    >

    </TransparentDropdown>

    </section>

    <section id="chapter-2" className="flex min-h-screen flex-col items-center justify-center gap-4 mt-16">
    <TransparentDropdown
    label="chapter 2"
    items={items}
    selectedValue={undefined}
    variant="compact"
    className="w-[300px]"
    >

    </TransparentDropdown>

    </section>

    <section id="chapter-3" className="flex min-h-screen flex-col items-center justify-center gap-4 mt-16 bg-white">

    <TransparentDropdown
    label="chapter 3"
    items={items}
    selectedValue={undefined}
    variant="compact"
    className="w-[300px]"
    >

    </TransparentDropdown>

    </section>
    </>
  );
}
