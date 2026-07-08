// src/app/lore/legends-and-folklore/page.tsx

import LoreIndexPage, {
  LoreIndexSection,
} from "@/components/lore/LoreIndexPage";

const legendSections: LoreIndexSection[] = [
  {
    id: "legends",
    title: "Legends",
    entries: [
      {
        id: "old-gods",
        title: "The Old Gods",
        text: "Ancient tales, myths, and stories passed down through different cultures of Vielora.",
        image: "/images/Deyanira.png",
        imageAlt: "Old gods",
        href: "/lore/legends-and-folklore/old-gods",
        variant: "red",
      },
      {
        id: "forgotten-heroes",
        title: "Forgotten Heroes",
        text: "Stories of figures whose actions changed the world, even if few still remember their names.",
        image: "/images/Deyanira.png",
        imageAlt: "Forgotten heroes",
        href: "/lore/legends-and-folklore/forgotten-heroes",
        variant: "coral",
      },
    ],
  },
  {
    id: "folklore",
    title: "Folklore",
    entries: [
      {
        id: "children-stories",
        title: "Children Stories",
        text: "Small tales told across villages, cities, temples, and old homes.",
        image: "/images/Deyanira.png",
        imageAlt: "Children stories",
        href: "/lore/legends-and-folklore/children-stories",
        variant: "purple",
      },
    ],
  },
];

export default function LegendsAndFolklorePage() {
  return (
    <LoreIndexPage
      title="Legends and Folklore"
      description="Stories, myths, legends, and cultural tales told by the people of Vielora."
      sections={legendSections}
    />
  );
}