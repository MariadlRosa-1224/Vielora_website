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
};

export default function CharacterFrame({
  title,
  image,
  imageAlt,
  href,
  frame = "/images/characters/frame.png",
  locked = true,
}: CharacterFrameProps) {
  return (
    <Link
      href={href}
      className={[
        "group relative m-12 flex h-[350px] w-[250px] cursor-pointer flex-col items-center justify-end overflow-hidden rounded-[10px]",
        "bg-transparent transition-transform duration-500 hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-[#fff48e]",
      ].join(" ")}
    >
      {/* Character portrait */}
      <Image
        src={image}
        alt={imageAlt ?? title}
        fill
        sizes="250px"
        className={[
          "z-[1] object-cover transition duration-500",
          locked ? "grayscale" : "grayscale-0",
          "group-hover:scale-105",
        ].join(" ")}
      />

      {/* Purple overlay */}
      <div
        className={[
          "absolute inset-0 z-[2] bg-[#3d3357]/35 transition-opacity duration-500",
          "group-hover:opacity-0",
        ].join(" ")}
      />

      {/* PNG frame placed above the portrait */}
      <Image
        src={frame}
        alt=""
        fill
        sizes="250px"
        className="pointer-events-none z-[50] object-fill"
        aria-hidden="true"
        
      />

      {/* Text content */}
      <div className="absolute inset-x-0 bottom-[15%] z-[60] flex flex-col items-center px-4">
        <span className="text-center font-['Spectral_SC'] text-2xl font-bold uppercase tracking-wide text-white drop-shadow-md">
          {title}
        </span>

        <hr className="mt-3 w-4/5 border-2 border-white" />
      </div>

      {/* Optional locked label */}
      {locked && (
        <div className="absolute right-4 top-4 z-[60] rounded-full border border-white/60 bg-[#111120]/70 px-3 py-1 text-xs uppercase tracking-wider text-white/80 backdrop-blur-sm">
          Locked
        </div>
      )}
    </Link>
  );
}