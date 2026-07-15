// src/components/buttons/VerticalColorButton.tsx

import Link from "next/link";
import React from "react";
import { vieloraGradients, vieloraHoverGradients } from "@/theme/colors";

interface VerticalColorButtonProps {
  title: string;
  image: string;
  href: string;
  gradient?: keyof typeof vieloraGradients;
  active?: boolean;
  className?: string;
}

const VerticalColorButton: React.FC<VerticalColorButtonProps> = ({
  title,
  image,
  href,
  gradient = "blueVertical",
  active = false,
  className = "",
}) => {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      style={{ background: vieloraGradients[gradient] }}
      className={[
        "group relative isolate flex h-[280px] w-full max-w-[180px] cursor-pointer flex-col items-center justify-around overflow-hidden border-none p-0 no-underline",
        "sm:h-[320px] sm:max-w-[190px]",
        "md:h-[350px] md:max-w-[200px]",
        "rounded-[var(--border-radius)]",
        "transition-transform duration-300 ease-out",
        "hover:-translate-y-2 hover:scale-[1.04]",
        "focus:outline-none focus-visible:scale-[1.04]",
        active ? "scale-[1.04]" : "",
        className,
      ].join(" ")}
    >
      <div
        style={{ background: vieloraHoverGradients[gradient] }}
        className={[
          "pointer-events-none absolute inset-0 z-0 opacity-0",
          "transition-opacity duration-300 ease-out",
          "group-hover:opacity-100",
          active ? "opacity-100" : "",
        ].join(" ")}
      />

      <img
        src={image}
        alt={title}
        className={[
          "relative z-10 mb-[10px] h-[80px] w-[80px] object-contain",
          "sm:h-[90px] sm:w-[90px]",
          "md:h-[100px] md:w-[100px]",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-110",
          active ? "scale-110" : "",
        ].join(" ")}
      />

      <span
        className={[
          "relative z-10 px-3 text-center font-['Spectral_SC',serif] text-xl font-bold text-white",
          "sm:text-2xl",
          "transition-all duration-300 ease-out",
          "group-hover:tracking-wide",
          "hover:text-white",
        ].join(" ")}
      >
        {title}
      </span>
    </Link>
  );
};

export default VerticalColorButton;