// src/app/lore/extras/page.tsx

import LoreIndexPage, {
  LoreIndexSection,
} from "@/components/lore/LoreIndexPage";

const extrasSections: LoreIndexSection[] = [
  {
    id: "extra-lore",
    title: "Extra Lore",
    entries: [
      {
        id: "server-notes",
        title: "Server Notes",
        text: "Small pieces of additional lore, context, side details, and worldbuilding notes.",
        image: "/images/Deyanira.png",
        imageAlt: "Server notes",
        href: "/lore/extras/server-notes",
        variant: "cyan",
      },
      {
        id: "hidden-details",
        title: "Hidden Details",
        text: "Fragments of information that expand the world without belonging to a main timeline event.",
        image: "/images/Deyanira.png",
        imageAlt: "Hidden details",
        href: "/lore/extras/hidden-details",
        variant: "aqua",
      },
    ],
  },
];

export default function ExtrasPage() {
  return (
    <LoreIndexPage
      title="Lore Extras"
      description="Additional information, notes, and smaller pieces of lore that expand the world without being part of the main timeline."
      sections={extrasSections}
    />
  );
}