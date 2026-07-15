
export type LocationEntry = {
  id: string;
  title: string;
  href: string;
  pin?: {
    top: string;
    left: string;
  };
};

export type LocationGroup = {
  id: string;
  name: string;
  mapImage: string;
  mapAlt: string;
  locations: LocationEntry[];
};

export const locationGroups: LocationGroup[] = [
  {
    id: "vielora",
    name: "Vielora",
    mapImage: "/images/locations/map-placeholder.png",
    mapAlt: "Map of Vielora",
    locations: [
      {
        id: "land-of-flames",
        title: "The land of Flames",
        href: "/locations/the-land-of-flames",
        pin: { top: "85%", left: "51%" },
      },
      {
        id: "land-of-artisanry",
        title: "The land of Artisanry",
        href: "/locations/the-land-of-artisanry",
        pin: { top: "80%", left: "16%" },
      },
      {
        id: "land-of-will",
        title: "The land of Will",
        href: "/locations/the-land-of-will",
        pin: { top: "40%", left: "15%" },
      },
      {
        id: "land-of-nature",
        title: "The land of Nature",
        href: "/locations/the-land-of-nature",
        pin: { top: "52%", left: "92%" },
      },
      {
        id: "land-of-fantasy",
        title: "The land of Fantasy",
        href: "/locations/the-land-of-fantasy",
        pin: { top: "80%", left: "90%" },
      },
      {
        id: "land-of-knowledge",
        title: "The land of Knowledge",
        href: "/locations/the-land-of-knowledge",
        pin: { top: "55%", left: "30%" },
      },
      {
        id: "land-of-judgement",
        title: "The land of Judgement",
        href: "/locations/the-land-of-judgement",
        pin: { top: "25%", left: "90%" },
      },
      {
        id: "the-ruins",
        title: "The Ruins",
        href: "/locations/the-ruins",
        pin: { top: "20%", left: "51%" },
      },
      {
        id: "the-frozen-north",
        title: "The Frozen North",
        href: "/locations/the-frozen-north",
        pin: { top: "5%", left: "51%" },
      },
      {
        id: "other-locations",
        title: "Other locations",
        href: "/locations/other-locations",
        
      },
    ],
  },
  
];