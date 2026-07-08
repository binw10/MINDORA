"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localeLabels, localeShortLabels, locales, type Locale } from "@/lib/i18n/locales";

gsap.registerPlugin(ScrollTrigger);

export function LanguageSwitcher() {
  const { dictionary, locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = menuRef.current;

    if (!menu) {
      return undefined;
    }

    if (isOpen) {
      gsap.set(menu, { display: "block", transformOrigin: "top right" });
      gsap.fromTo(
        menu,
        { opacity: 0, scaleY: 0.86, y: -8 },
        {
          opacity: 1,
          scaleY: 1,
          y: 0,
          duration: 0.22,
          ease: "power3.out",
          overwrite: "auto",
        },
      );
      return undefined;
    }

    gsap.to(menu, {
      opacity: 0,
      scaleY: 0.9,
      y: -6,
      duration: 0.16,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        gsap.set(menu, { display: "none" });
      },
    });

    return undefined;
  }, [isOpen]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const selectLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      setIsOpen(false);
      return;
    }

    const motionTargets = document.querySelectorAll<HTMLElement>(
      "main, footer",
    );

    setLocale(nextLocale);
    setIsOpen(false);

    if (!motionTargets.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setTimeout(() => ScrollTrigger.refresh(), 120);
      return;
    }

    gsap.killTweensOf(motionTargets);
    gsap
      .timeline({
        defaults: {
          ease: "power3.out",
          overwrite: "auto",
        },
        onComplete: () => {
          ScrollTrigger.refresh();
          window.setTimeout(() => ScrollTrigger.refresh(), 300);
        },
      })
      .to(motionTargets, {
        autoAlpha: 0.42,
        duration: 0.16,
        y: 8,
      })
      .to(motionTargets, {
        autoAlpha: 1,
        duration: 0.34,
        y: 0,
      });
  };

  return (
    <div className="relative z-20" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={dictionary.common.language}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-system-border-subtle bg-white/90 px-3 py-2 text-sm font-semibold text-primary/72 shadow-sm transition hover:border-system-border-strong hover:text-system-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span aria-hidden="true" className="text-base leading-none">
          文
        </span>
        <span>{localeShortLabels[locale]}</span>
        <span
          aria-hidden="true"
          className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      <div
        className="absolute right-0 top-[calc(100%+0.5rem)] hidden min-w-52 origin-top-right rounded-2xl border border-system-border-subtle bg-white/96 p-2 opacity-0 shadow-[0_20px_60px_rgba(15,23,42,0.14)]"
        ref={menuRef}
        role="menu"
      >
        {locales.map((item) => (
          <button
            aria-checked={locale === item}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
              locale === item
                ? "bg-[linear-gradient(135deg,rgba(31,107,255,0.14),rgba(124,77,255,0.14))] text-system-primary"
                : "text-primary/72 hover:bg-system-muted hover:text-system-primary"
            }`}
            key={item}
            onClick={() => selectLocale(item)}
            role="menuitemradio"
            type="button"
          >
            <span>{localeLabels[item]}</span>
            <span className="text-xs text-primary/40">{localeShortLabels[item]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
