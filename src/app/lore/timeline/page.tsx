// src/app/lore/timeline/page.tsx

import LoreIndexPage, {
  LoreIndexSection,
} from "@/components/lore/LoreIndexPage";

const timelineSections: LoreIndexSection[] = [
  {
    id: "beta-events",
    title: "Beta Events",
    entries: [
      {
        id: "beautiful-tale",
        title: "The Title of a Beautiful Tale",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
        image: "/images/Deyanira.png",
        imageAlt: "Beta event",
        href: "/lore/timeline/beautiful-tale",
        variant: "purple",
      },
      {
        id: "many-races",
        title: "Many Races to Play As",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
        image: "/images/Deyanira.png",
        imageAlt: "Many races",
        href: "/lore/timeline/many-races",
        variant: "blue",
      },
    ],
  },
  {
    id: "act-i",
    title: "Act I",
    entries: [
      {
        id: "act-one-opening",
        title: "The Title of a Beautiful Tale",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
        image: "/images/Deyanira.png",
        imageAlt: "Act I",
        href: "/lore/timeline/act-one-opening",
        variant: "purple",
      },
    ],
  },
];

export default function TimelinePage() {
  return (
    <LoreIndexPage
      title="Roleplay Timeline"
      description="This is a summary of the previous events within the server and the consequences they had within the server going forward. Now it is empty, but it is within all of us to fill this page with our story."
      sections={timelineSections}
    />
  );
}