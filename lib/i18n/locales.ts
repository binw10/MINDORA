export const locales = ["en", "zh", "ms"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ms: "Bahasa Malaysia",
};

export const localeShortLabels: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
  ms: "MS",
};

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "zh" || value === "ms";
}
