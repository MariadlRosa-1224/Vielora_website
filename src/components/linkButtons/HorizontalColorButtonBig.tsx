// src/components/buttons/HorizontalColorButtonBig.tsx

import Link from "next/link";
import {
  vieloraHorizontalGradients,
  vieloraHorizontalHoverGradients,
  type VieloraHorizontalGradient,
} from "@/theme/colors";

type HorizontalColorButtonBigProps = {
  href?: string;
  title: string;
  description: string;
  gradient: VieloraHorizontalGradient;
  className?: string;
  active?: boolean;
};

export default function HorizontalColorButtonBig({
  href,
  title,
  description,
  gradient,
  className,
  active = false,
}: HorizontalColorButtonBigProps) {
  const content = (
    <div
      className={[
        "group relative flex min-h-[150px] w-full max-w-[600px] cursor-pointer flex-col items-end justify-center overflow-hidden px-8 py-6 text-right",
        "transition-opacity duration-300 hover:opacity-90",
        active ? "opacity-100" : "",
        className || "",
      ].join(" ")}
    >
      <span
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: vieloraHorizontalGradients[gradient],
        }}
      />

      <span
        className={[
          "absolute inset-0 transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        ].join(" ")}
        style={{
          backgroundImage: vieloraHorizontalHoverGradients[gradient],
        }}
      />

      <h4 className="relative z-10 m-0 font-[Spectral_SC] text-3xl font-bold uppercase tracking-wider text-white drop-shadow md:text-[32px]">
        {title}
      </h4>

      <p className="relative z-10 mt-2 max-w-[440px] text-sm leading-5 text-white/85">
        {description}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-fit">
        {content}
      </Link>
    );
  }

  return content;
}