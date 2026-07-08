"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function SkipLink() {
  const { dictionary } = useLanguage();

  return (
    <a
      className="sr-only z-50 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-background"
      href="#main-content"
    >
      {dictionary.common.skipToMain}
    </a>
  );
}
