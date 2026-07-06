// src/components/buttons/HorizontalColorButton.tsx

import Link from "next/link";
import type { ReactNode } from "react";
import {
  vieloraHorizontalGradients,
  vieloraHorizontalHoverGradients,
  type VieloraHorizontalGradient,
} from "@/theme/colors";

type HorizontalColorButtonProps = {
  href: string;
  title: string;
  gradient: VieloraHorizontalGradient;
  image: string;
  className?: string;
  active?: boolean;
};

export default function HorizontalColorButton({
  href,
  title,
  gradient,
  image,
  className,
  active = false,
}: HorizontalColorButtonProps) {
  return (
    <Link
      href={href}
      className={`group grid grid-cols-[56px_minmax(0,1fr)] items-center ${className || ""}`}
    >
      <span className="flex h-14 w-14 items-center justify-center text-white">
              <img
        src={image}
        alt={title}
        className={[
          "relative z-10 h-[50px] w-[50px] object-contain",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-110",
          active ? "scale-110" : "",
        ].join(" ")}
      />
      </span>

      <span className="relative flex h-12 min-w-[230px] items-center justify-end overflow-hidden px-6">
        <span
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            backgroundImage: vieloraHorizontalGradients[gradient],
          }}
        />

        <span
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage: vieloraHorizontalHoverGradients[gradient],
          }}
        />

        <span className="relative z-10 font-serif text-lg font-bold uppercase tracking-wider text-white drop-shadow">
          {title}
        </span>
      </span>
    </Link>
  );
}