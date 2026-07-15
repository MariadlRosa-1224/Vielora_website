// src/components/characters/CharacterFrame.tsx

import Image from "next/image";
import Link from "next/link";

type CharacterFrameProps = {
  title: string;
  image: string;
  imageAlt?: string;
  href: string;

  frame?: string;
  locked?: boolean;
  className?: string;
};

export default function CharacterFrame({
  title,
  image,
  imageAlt,
  href,
  frame = "/images/characters/frame.png",
  locked = true,
  className = "",
}: CharacterFrameProps) {
  return (
    <Link
      href={href}
      className={[
        "group relative flex h-[294px] w-[210px] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[10px]",
        "sm:h-[322px] sm:w-[230px]",
        "md:h-[350px] md:w-[250px]",
        "bg-transparent transition-transform duration-500 hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-[#fff48e]",
        className,
      ].join(" ")}
    >
      <Image
        src={image}
        alt={imageAlt ?? title}
        fill
        sizes="(max-width: 640px) 210px, (max-width: 768px) 230px, 250px"
        className={[
          "z-[1] object-cover transition duration-500",
          locked ? "grayscale" : "grayscale-0",
          "group-hover:scale-105",
        ].join(" ")}
      />

      <div
        className={[
          "absolute inset-0 z-[2] bg-[#3d3357]/35 transition-opacity duration-500",
          "group-hover:opacity-0",
        ].join(" ")}
      />

      <Image
        src={frame}
        alt=""
        fill
        sizes="(max-width: 640px) 210px, (max-width: 768px) 230px, 250px"
        className="pointer-events-none z-[50] object-fill"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-[15%] z-[60] flex flex-col items-center px-4">
        <span className="text-center font-['Spectral_SC'] text-xl font-bold uppercase tracking-wide text-white drop-shadow-md sm:text-2xl">
          {title}
        </span>

        <hr className="mt-3 w-4/5 border-2 border-white" />
      </div>

      {locked && (
        <div className="absolute right-3 top-3 z-[60] rounded-full border border-white/60 bg-[#111120]/70 px-3 py-1 text-[10px] uppercase tracking-wider text-white/80 backdrop-blur-sm sm:right-4 sm:top-4 sm:text-xs">
          Locked
        </div>
      )}
    </Link>
  );
}