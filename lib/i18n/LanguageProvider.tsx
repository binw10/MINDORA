"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/locales";

type LanguageContextValue = {
  dictionary: Dictionary;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("mindora-locale");

    if (isLocale(savedLocale)) {
      const frame = window.requestAnimationFrame(() => {
        setLocaleState(savedLocale);
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    window.localStorage.setItem("mindora-locale", locale);
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale === "ms" ? "ms-MY" : "en";
    window.dispatchEvent(new CustomEvent("mindora:locale-change", { detail: { locale } }));
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      dictionary: dictionary[locale],
      locale,
      setLocale: setLocaleState,
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
