import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#101828",
        background: "#F5FAFF",
        surface: "#FFFFFF",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)",
        focus: "var(--color-focus)",
        border: "var(--color-border)",
        system: {
          page: "var(--color-system-page)",
          surface: "var(--color-system-surface)",
          muted: "var(--color-system-muted)",
          inverse: "var(--color-system-inverse)",
          primary: "var(--color-system-primary)",
          "primary-hover": "var(--color-system-primary-hover)",
          accent: {
            blue: "var(--color-system-accent-blue)",
            cyan: "var(--color-system-accent-cyan)",
            gold: "var(--color-system-accent-gold)",
          },
          text: {
            primary: "var(--color-system-text-primary)",
            secondary: "var(--color-system-text-secondary)",
            muted: "var(--color-system-text-muted)",
            inverse: "var(--color-system-text-inverse)",
          },
          border: {
            subtle: "var(--color-system-border-subtle)",
            strong: "var(--color-system-border-strong)",
          },
        },
      },
      boxShadow: {
        "system-card": "var(--shadow-system-card)",
        "system-panel": "var(--shadow-system-panel)",
      },
    },
  },
  plugins: [],
};

export default config;
