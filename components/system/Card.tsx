import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div" | "li";
  children: ReactNode;
};

export function Card({ as: Component = "article", children, className = "", ...props }: CardProps) {
  return (
    <Component
      className={`rounded-[24px] border border-system-border-subtle bg-system-surface p-6 shadow-[0_10px_30px_rgba(31,107,255,0.06)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-system-border-strong hover:shadow-system-card ${className}`}
      data-motion-card
      {...props}
    >
      {children}
    </Component>
  );
}
