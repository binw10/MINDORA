import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-system-primary text-system-text-inverse shadow-[0_14px_34px_rgba(31,107,255,0.28)] hover:bg-system-primary-hover hover:shadow-[0_18px_42px_rgba(31,107,255,0.34)]",
    secondary:
      "border border-system-border-subtle bg-white/88 text-system-text-primary hover:border-system-border-strong hover:bg-white",
  };

  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-system-accent-cyan ${variants[variant]} ${className}`}
      data-motion-button
      {...props}
    >
      {children}
    </a>
  );
}
