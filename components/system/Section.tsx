import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
  motion?: boolean;
};

export function Section({
  id,
  labelledBy,
  children,
  className = "",
  motion = true,
}: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-32 ${className}`}
      data-motion-section={motion ? "" : undefined}
      id={id}
    >
      {children}
    </section>
  );
}
