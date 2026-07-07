// src/components/milestones/Achievement.tsx

import Image from "next/image";

type AchievementRarity =
  | "easy"
  | "medium"
  | "hard"
  | "very-hard"
  | "legendary"
  | "sacrifice"
  | "story-milestone";

type AchievementProps = {
  title: string;
  image: string;
  description: string;
  state: string;
  rarity: AchievementRarity;
  author?: string;
  locked?: boolean;
};

const rarityStyles: Record<
  AchievementRarity,
  {
    card: string;
    circle: string;
    title: string;
    accent: string;
  }
> = {
  easy: {
    card: "border-sky-400 bg-sky-950/45",
    circle: "border-sky-300 bg-sky-500/25",
    title: "text-sky-200",
    accent: "text-sky-300",
  },
  medium: {
    card: "border-teal-300 bg-teal-950/45",
    circle: "border-teal-200 bg-teal-500/25",
    title: "text-teal-100",
    accent: "text-teal-300",
  },
  hard: {
    card: "border-red-300 bg-red-950/45",
    circle: "border-red-200 bg-red-500/25",
    title: "text-red-100",
    accent: "text-red-300",
  },
  "very-hard": {
    card: "border-pink-500 bg-pink-950/45",
    circle: "border-pink-300 bg-pink-500/25",
    title: "text-pink-100",
    accent: "text-pink-300",
  },
  legendary: {
    card: "border-[#fff48e] bg-yellow-950/35",
    circle: "border-[#fff48e] bg-[#fff48e]/20",
    title: "text-[#fff48e]",
    accent: "text-[#fff48e]",
  },
  sacrifice: {
    card: "border-indigo-500 bg-indigo-950/45",
    circle: "border-indigo-300 bg-indigo-500/25",
    title: "text-indigo-100",
    accent: "text-indigo-300",
  },
  "story-milestone": {
    card: "border-purple-400 bg-purple-950/45",
    circle: "border-purple-300 bg-purple-500/25",
    title: "text-purple-100",
    accent: "text-purple-300",
  },
};

const lockedStyles = {
  card: "border-zinc-500 bg-zinc-900/60 opacity-60 grayscale",
  circle: "border-zinc-400 bg-zinc-700/40",
  title: "text-zinc-300",
  accent: "text-zinc-400",
};

export default function Achievement({
  title,
  image,
  description,
  state,
  rarity,
  author,
  locked = false,
}: AchievementProps) {
  const palette = locked ? lockedStyles : rarityStyles[rarity];

  return (
    <article
      className={[
        "group flex min-h-[150px] w-full max-w-[500px] cursor-pointer items-center justify-between gap-5 rounded-[10px] border-4 px-5 py-4 transition duration-200",
        "hover:-translate-y-0.5 hover:opacity-85 hover:shadow-lg",
        palette.card,
      ].join(" ")}
      aria-disabled={locked}
    >
      <div
        className={[
          "flex h-[100px] w-[100px] shrink-0 items-center justify-center rounded-full border-4 transition duration-200",
          "group-hover:scale-105",
          palette.circle,
        ].join(" ")}
      >
        <Image
          src={image}
          alt={title}
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
      </div>

      <div className="flex w-[70%] flex-col text-left">
        <span
          className={[
            "font-serif text-2xl font-bold uppercase tracking-wide",
            palette.title,
          ].join(" ")}
        >
          {title}
        </span>

        <p className="mt-2 text-sm leading-snug text-white/80">
          {description}
        </p>

        <p
          className={[
            "mt-2 text-sm font-semibold italic underline underline-offset-4",
            palette.accent,
          ].join(" ")}
        >
          {locked ? "Locked" : state + " by " + author}
        </p>
      </div>
    </article>
  );
}