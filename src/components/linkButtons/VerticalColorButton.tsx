import Link from "next/link";
import React from "react";
import { vieloraGradients, vieloraHoverGradients } from "@/theme/colors";

interface VerticalColorButtonProps {
  title: string;
  image: string;
  href: string;
  gradient?: keyof typeof vieloraGradients;
  active?: boolean;
}

const VerticalColorButton: React.FC<VerticalColorButtonProps> = ({
  title,
  image,
  href,
  gradient = "blueVertical",
  active = false,
}) => {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      style={{ background: vieloraGradients[gradient] }}
      className={[
        "group relative isolate flex h-[350px] w-[200px] cursor-pointer flex-col items-center justify-around overflow-hidden border-none p-0 no-underline mx-10",
        "rounded-[var(--border-radius)]",
        "transition-transform duration-300 ease-out",
        "hover:-translate-y-2 hover:scale-[1.04]",
        "focus:outline-none focus-visible:scale-[1.04]",
        active ? "scale-[1.04]" : "",
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
          "relative z-10 mb-[10px] h-[100px] w-[100px] object-contain",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-110",
          active ? "scale-110" : "",
        ].join(" ")}
      />

      <span
        className={[
          "relative z-10 text-center font-['Spectral_SC',serif] text-2xl font-bold text-white",
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