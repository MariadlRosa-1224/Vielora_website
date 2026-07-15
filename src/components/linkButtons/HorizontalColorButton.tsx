// src/components/buttons/HorizontalColorButton.tsx

import Link from "next/link";
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
  className = "",
  active = false,
}: HorizontalColorButtonProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "group grid w-full max-w-[360px] grid-cols-[48px_minmax(0,1fr)] items-center",
        "sm:max-w-[420px] sm:grid-cols-[56px_minmax(0,1fr)]",
        className,
      ].join(" ")}
    >
      <span className="flex h-12 w-12 items-center justify-center text-white sm:h-14 sm:w-14">
        <img
          src={image}
          alt={title}
          className={[
            "relative z-10 h-10 w-10 object-contain sm:h-[50px] sm:w-[50px]",
            "transition-transform duration-300 ease-out",
            "group-hover:scale-110",
            active ? "scale-110" : "",
          ].join(" ")}
        />
      </span>

      <span className="relative flex h-11 min-w-0 items-center justify-end overflow-hidden px-4 sm:h-12 sm:px-6">
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

        <span className="relative z-10 truncate font-[Spectral_SC] text-sm font-bold uppercase tracking-wider text-white drop-shadow sm:text-lg">
          {title}
        </span>
      </span>
    </Link>
  );
}