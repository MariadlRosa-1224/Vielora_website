import type { ReactNode } from "react";

type GeneralContentContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function GeneralContentContainer({
  children,
  className = "",
}: GeneralContentContainerProps) {
  return (
    <section
      className={[
        "min-h-[20vh] rounded-[10px] border border-[#fff48e] bg-[#111120]/70",
        "p-4 backdrop-blur-sm sm:p-6 lg:p-8",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}