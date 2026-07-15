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
        "group flex w-full max-w-[500px] cursor-pointer rounded-[10px] border-4 transition duration-200",
        "flex-col items-center justify-center gap-4 px-4 py-5 text-center",
        "sm:min-h-[150px] sm:flex-row sm:justify-between sm:gap-5 sm:px-5 sm:py-4 sm:text-left",
        "hover:-translate-y-0.5 hover:opacity-85 hover:shadow-lg",
        palette.card,
      ].join(" ")}
      aria-disabled={locked}
    >
      <div
        className={[
          "flex shrink-0 items-center justify-center rounded-full border-4 transition duration-200",
          "h-[82px] w-[82px]",
          "sm:h-[100px] sm:w-[100px]",
          "group-hover:scale-105",
          palette.circle,
        ].join(" ")}
      >
        <Image
          src={image}
          alt={title}
          width={48}
          height={48}
          className="h-10 w-10 object-contain sm:h-12 sm:w-12"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start">
        <span
          className={[
            "font-[Spectral_SC] font-bold uppercase tracking-wide",
            "text-xl sm:text-2xl",
            "break-words",
            palette.title,
          ].join(" ")}
        >
          {title}
        </span>

        <p className="mt-2 text-sm leading-relaxed text-white/80">
          {description}
        </p>

        <p
          className={[
            "mt-2 text-sm font-semibold italic underline underline-offset-4",
            "break-words",
            palette.accent,
          ].join(" ")}
        >
          {locked ? "Locked" : `${state} by ${author ?? "Unknown"}`}
        </p>
      </div>
    </article>
  );
}