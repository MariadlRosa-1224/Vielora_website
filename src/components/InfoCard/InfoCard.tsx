// src/components/InfoCard.tsx

import Image from "next/image";

type InfoCardVariant = "cyan" | "purple" | "red" | "blue" | "coral" | "aqua";

type InfoCardProps = {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  variant?: InfoCardVariant;
  reverse?: boolean;
};

const gradients: Record<InfoCardVariant, string> = {
  cyan: "from-[#271841] via-[#3547D8] via-40% to-[#19C3FB]",
  purple: "from-[#271841] via-[#3547D8] via-40% to-[#8E48D8]",
  red: "from-[#271841] via-[#692DA5] via-20% to-[#ff1656]",
  blue: "from-[#2936a7] via-[#182b91] to-[#3547D8]",
  coral: "from-[#271841] via-[#3547D8] via-40% to-[#FB8082]",
  aqua: "from-[#271841] via-[#3547D8] via-40% to-[#3FD7BC]",
};

const gradientReverse: Record<InfoCardVariant, string> = {
  cyan: "from-[#19C3FB] via-[#3547D8] via-60% to-[#271841]",
  purple: "from-[#8E48D8] via-[#3547D8] via-80% to-[#271841]",
  red: "from-[#ff1656] via-[#692DA5] via-80% to-[#271841]",
  blue: "from-[#3547D8] via-[#182b91] to-[#2936a7]",
  coral: "from-[#FB8082] via-[#3547D8] via-80% to-[#271841]",
  aqua: "from-[#3FD7BC] via-[#3547D8] via-80% to-[#271841]",
};

export default function InfoCard({
  title,
  text,
  image,
  imageAlt,
  variant = "cyan",
  reverse = false,
}: InfoCardProps) {
  return (
    <article
      className={[
        "mx-auto flex w-full max-w-5xl overflow-hidden rounded-[10px] shadow-lg",
        "bg-gradient-to-b sm:bg-gradient-to-r",
        reverse ? gradientReverse[variant] : gradients[variant],

        // Mobile: vertical card.
        "flex-col",

        // Tablet/Desktop: horizontal card.
        reverse ? "sm:flex-row-reverse" : "sm:flex-row",
      ].join(" ")}
    >
      <div
        className={[
          "relative h-[240px] w-full shrink-0",
          "sm:h-[220px] sm:w-[220px]",
          "md:h-[240px] md:w-[240px]",

          // Only use masks from sm upward. On mobile, the image is stacked,
          // so the mask often looks strange.
          reverse
            ? "sm:mask-l-from-70% sm:mask-l-to-95%"
            : "sm:mask-r-from-70% sm:mask-r-to-95%",
        ].join(" ")}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 240px"
        />
      </div>

      <div
        className={[
          "flex flex-1 flex-col justify-center px-6 py-8",
          "sm:px-8 md:px-10",
          "text-center",
          reverse ? "sm:text-left" : "sm:text-right",
        ].join(" ")}
      >
        <h3 className="font-[Spectral_SC] text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-white sm:text-base">
          {text}
        </p>
      </div>
    </article>
  );
}