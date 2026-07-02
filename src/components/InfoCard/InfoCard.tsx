// src/components/InfoCard.tsx

import Image from "next/image";

type InfoCardVariant = "cyan" | "purple" | "pink" | "blue";

type InfoCardProps = {
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  variant?: InfoCardVariant;
  reverse?: boolean;
};

const gradients: Record<InfoCardVariant, string> = {
  cyan: "from-[#271841] via-[#2936a7]/80 to-[#0ec4ff]/70",
  purple: "from-[#271841] via-[#2936a7]/80 to-[#9046d9]",
  pink: "from-[#271841] via-[#9046d9]/70 to-[#ff1656]",
  blue: "from-[#07107a] via-[#182b91] to-[#2936a7]",
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
        "mx-auto flex min-w-[2/3] overflow-hidden rounded-[10px]",
        "bg-gradient-to-r ",
        gradients[variant],
        "min-h-[200px] max-h-[200px] shadow-lg",
        reverse ? "flex-row-reverse" : "flex-row",
      ].join(" ")}
    >
      <div className="relative h-[200px] w-[200px] shrink-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="200px"
        />
      </div>

      <div
        className={[
          "flex flex-1 flex-col justify-center px-10 py-6",
          reverse ? "text-left" : "text-right",
        ].join(" ")}
      >
        <h3 className="font-serif text-2xl font-bold uppercase tracking-wide text-white">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-white">
          {text}
        </p>
      </div>
    </article>
  );
}