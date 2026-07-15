// src/components/lore/LoreLinkCard.tsx

import Image from "next/image";
import Link from "next/link";

export type LoreCardVariant =
  | "cyan"
  | "purple"
  | "red"
  | "blue"
  | "coral"
  | "aqua";

type LoreLinkCardProps = {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  href: string;
  variant?: LoreCardVariant;
  reverse?: boolean;
};

const gradients: Record<LoreCardVariant, string> = {
  cyan: "from-[#271841] via-[#3547D8] via-40% to-[#19C3FB]",
  purple: "from-[#271841] via-[#3547D8] via-40% to-[#8E48D8]",
  red: "from-[#271841] via-[#692DA5] via-20% to-[#ff1656]",
  blue: "from-[#2936a7] via-[#182b91] to-[#3547D8]",
  coral: "from-[#271841] via-[#3547D8] via-40% to-[#FB8082]",
  aqua: "from-[#271841] via-[#3547D8] via-40% to-[#3FD7BC]",
};

const gradientReverse: Record<LoreCardVariant, string> = {
  cyan: "from-[#19C3FB] via-[#3547D8] via-60% to-[#271841]",
  purple: "from-[#8E48D8] via-[#3547D8] via-80% to-[#271841]",
  red: "from-[#ff1656] via-[#692DA5] via-80% to-[#271841]",
  blue: "from-[#3547D8] via-[#182b91] to-[#2936a7]",
  coral: "from-[#FB8082] via-[#3547D8] via-80% to-[#271841]",
  aqua: "from-[#3FD7BC] via-[#3547D8] via-80% to-[#271841]",
};

export default function LoreLinkCard({
  title,
  text,
  image,
  imageAlt,
  href,
  variant = "purple",
  reverse = false,
}: LoreLinkCardProps) {
  return (
    <Link
      href={href}
      className={[
        "group mx-auto flex w-full max-w-5xl overflow-hidden rounded-[10px]",
        "bg-gradient-to-b shadow-lg transition duration-200 sm:bg-gradient-to-r",
        "hover:-translate-y-1 hover:shadow-xl hover:brightness-110",
        "focus:outline-none focus:ring-2 focus:ring-[#fff48e]",

        reverse ? gradientReverse[variant] : gradients[variant],

        // Mobile: stacked card.
        "flex-col",

        // Tablet/Desktop: horizontal card.
        reverse ? "sm:flex-row-reverse" : "sm:flex-row",
      ].join(" ")}
    >
      <div
        className={[
          "relative h-[180px] w-full shrink-0",
          "sm:h-[140px] sm:w-[180px]",
          "md:h-[150px] md:w-[220px]",

          // Masks only from sm upward because stacked mobile cards look better without them.
          reverse
            ? "sm:mask-l-from-70% sm:mask-l-to-95%"
            : "sm:mask-r-from-70% sm:mask-r-to-95%",
        ].join(" ")}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 220px"
        />
      </div>

      <div
        className={[
          "flex flex-1 flex-col justify-center px-6 py-6",
          "md:px-10",
          "text-center",
          reverse ? "sm:text-left" : "sm:text-right",
        ].join(" ")}
      >
        <h3 className="font-[Spectral_SC] text-lg font-bold uppercase tracking-wide text-white md:text-xl">
          {title}
        </h3>

        <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-white sm:line-clamp-3 md:text-sm">
          {text}
        </p>
      </div>
    </Link>
  );
}