// src/components/codex/GeneralContentContainer.tsx

import type { ReactNode } from "react";

type GeneralContentContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function GeneralContainerNoBorder({
  children,
  className,
}: GeneralContentContainerProps) {
  return (
    <section className={`min-h-[20vh]  bg-[#111120]/70 p-8 backdrop-blur-sm ${className || ""}`}>
      {children}
    </section>
  );
}