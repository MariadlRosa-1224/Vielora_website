// src/app/milestones/page.tsx

import Achievement from "@/components/milestones/Achievement";
import GeneralContentContainer from "@/components/GeneralContentContainer";

type AchievementRarity =
  | "easy"
  | "medium"
  | "hard"
  | "very-hard"
  | "legendary"
  | "sacrifice"
  | "story-milestone";

type Milestone = {
  id: string;
  title: string;
  image: string;
  description: string;
  state: string;
  rarity: AchievementRarity;
  locked?: boolean;
};

const normalMilestones: Milestone[] = [
  {
    id: "first-step",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Unlocked",
    rarity: "easy",
    locked: false,
  },
  {
    id: "first-rank",
    title: "Achievement", 
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "medium",
    locked: true,
  },
  {
    id: "first-battle",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "hard",
    locked: true,
  },
  {
    id: "first-legend",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "legendary",
    locked: true,
  },
];

const loreMilestones: Milestone[] = [
  {
    id: "hidden-story-1",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "story-milestone",
    locked: true,
  },
  {
    id: "hidden-story-2",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "story-milestone",
    locked: true,
  },
  {
    id: "hidden-story-3",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "story-milestone",
    locked: true,
  },
  {
    id: "hidden-story-4",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "story-milestone",
    locked: true,
  },
  {
    id: "hidden-story-5",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "sacrifice",
    locked: true,
  },
  {
    id: "hidden-story-6",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "very-hard",
    locked: true,
  },
  {
    id: "hidden-story-7",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Unlocked",
    rarity: "legendary",
    locked: true,
  },
  {
    id: "hidden-story-8",
    title: "Achievement",
    image: "/images/milestones/star.svg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut hendrerit ligula, in maximus est.",
    state: "Locked",
    rarity: "hard",
    locked: true,
  },
];

const rarityLegend: {
  label: string;
  rarity: AchievementRarity;
  className: string;
}[] = [
  {
    label: "Easy",
    rarity: "easy",
    className: "bg-sky-400",
  },
  {
    label: "Medium",
    rarity: "medium",
    className: "bg-teal-300",
  },
  {
    label: "Hard",
    rarity: "hard",
    className: "bg-red-300",
  },
  {
    label: "Very hard",
    rarity: "very-hard",
    className: "bg-pink-500",
  },
  {
    label: "Legendary",
    rarity: "legendary",
    className: "bg-[#fff48e]",
  },
  {
    label: "Sacrifice",
    rarity: "sacrifice",
    className: "bg-indigo-500",
  },
  {
    label: "Story milestone",
    rarity: "story-milestone",
    className: "bg-purple-500",
  },
];

export default function MilestonesPage() {
  return (
    <main className="min-h-screen bg-[#111120] bg-[url('/images/page-backgrounds/galaxies.jpg')] bg-fixed bg-cover bg-center bg-no-repeat px-6 py-24 text-white">
      <section className="mx-auto flex max-w-6xl flex-col items-center">
        <h1 className="font-serif text-4xl font-bold uppercase tracking-wider text-white">
          Milestones
        </h1>

        <p className="mt-10 ont-cinzel text-sm text-center tracking-[0.18em] text-white md:text-base">
          With your actions inside the world you can unlock milestones, these
          are achievements that rank from small and fun to world changing. Most
          achievements will only grant you brag rights and your name in the
          website, but some may unlock lore snippets.
        </p>

        <GeneralContentContainer className="mt-10 w-full max-w-5xl px-8 py-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {rarityLegend.map((item) => (
              <li
                key={item.rarity}
                className="flex items-center gap-4 text-lg text-white"
              >
                <span className={`h-4 w-4 ${item.className}`} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </GeneralContentContainer>

        <MilestoneSection
          title="Normal Milestones"
          milestones={normalMilestones}
        />

        <MilestoneSection title="Lore Milestones" milestones={loreMilestones} />
      </section>
    </main>
  );
}

function MilestoneSection({
  title,
  milestones,
}: {
  title: string;
  milestones: Milestone[];
}) {
  return (
    <section className="mt-16 w-full">
      <h2 className="mb-10 text-center font-serif text-4xl font-bold uppercase tracking-wider text-white">
        {title}
      </h2>

      <div className="grid justify-items-center gap-x-28 gap-y-10 lg:grid-cols-2">
        {milestones.map((milestone) => (
          <Achievement
            key={milestone.id}
            title={milestone.title}
            image={milestone.image}
            description={milestone.description}
            state={milestone.state}
            rarity={milestone.rarity}
            locked={milestone.locked}
          />
        ))}
      </div>
    </section>
  );
}