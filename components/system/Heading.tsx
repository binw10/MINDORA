import type { ReactNode } from "react";

type HeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  level?: "h1" | "h2" | "h3";
  className?: string;
  number?: string;
};

export function Heading({
  eyebrow,
  title,
  description,
  id,
  level = "h2",
  className = "",
  number,
}: HeadingProps) {
  const Tag = level;
  const titleClass =
    level === "h1"
      ? "text-5xl leading-tight sm:text-6xl lg:text-7xl"
      : level === "h2"
        ? "text-4xl leading-tight sm:text-5xl"
        : "text-xl leading-8";

  return (
    <div className={className}>
      <div className={number && level !== "h3" ? "grid gap-5 lg:grid-cols-[96px_1fr]" : ""}>
        {number && level !== "h3" ? (
          <p className="border-t border-system-border-strong pt-4 text-sm font-semibold tabular-nums text-system-text-muted">
            {number}
          </p>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-system-primary">
              {eyebrow}
            </p>
          ) : null}
          <Tag className={`mt-4 font-semibold text-system-text-primary ${titleClass}`} id={id}>
            {title}
          </Tag>
          {description ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-system-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
