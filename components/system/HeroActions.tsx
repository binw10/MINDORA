"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function HeroActions() {
  const { dictionary, locale } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const isVisibleRef = useRef(false);
  const actions = [
    { label: dictionary.actions.exploreSystem, href: "#overview" },
    { label: dictionary.actions.viewArchitecture, href: "#architecture" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;

    if (!container || !highlight) {
      return undefined;
    }

    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>("[data-hero-action]"));

    gsap.set(highlight, {
      height: 0,
      opacity: 0,
      width: 0,
      x: 0,
      y: 0,
    });

    const getTargetState = (target: HTMLElement) => {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      return {
        height: targetRect.height,
        width: targetRect.width,
        x: targetRect.left - containerRect.left,
        y: targetRect.top - containerRect.top,
      };
    };

    const moveHighlight = (target: HTMLElement) => {
      const targetState = getTargetState(target);

      gsap.killTweensOf(highlight);

      if (!isVisibleRef.current) {
        gsap.set(highlight, targetState);
        gsap.to(highlight, {
          duration: 0.16,
          ease: "power2.out",
          opacity: 1,
          overwrite: "auto",
        });
        isVisibleRef.current = true;
      } else {
        gsap.to(highlight, {
          duration: 0.28,
          ease: "power3.out",
          opacity: 1,
          ...targetState,
          overwrite: "auto",
        });
      }

      links.forEach((link) => {
        link.dataset.active = String(link === target);
      });
    };

    const hideHighlight = () => {
      links.forEach((link) => {
        link.dataset.active = "false";
      });

      gsap.to(highlight, {
        duration: 0.18,
        ease: "power2.out",
        opacity: 0,
        overwrite: "auto",
        onComplete: () => {
          isVisibleRef.current = false;
        },
      });
    };

    const onEnter = (event: Event) => {
      moveHighlight(event.currentTarget as HTMLElement);
    };

    links.forEach((link) => {
      link.addEventListener("pointerenter", onEnter);
      link.addEventListener("focus", onEnter);
    });
    container.addEventListener("pointerleave", hideHighlight);
    container.addEventListener("focusout", hideHighlight);

    return () => {
      links.forEach((link) => {
        link.removeEventListener("pointerenter", onEnter);
        link.removeEventListener("focus", onEnter);
      });
      container.removeEventListener("pointerleave", hideHighlight);
      container.removeEventListener("focusout", hideHighlight);
      gsap.killTweensOf(highlight);
    };
  }, [locale]);

  return (
    <div
      className="relative isolate inline-flex flex-wrap items-center justify-center gap-3"
      data-motion-hero-actions
      ref={containerRef}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 rounded-full border border-white/30 bg-white/24 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_18px_42px_rgba(255,255,255,0.12)] will-change-transform"
        ref={highlightRef}
      />
      {actions.map((action) => (
        <Link
          className="relative z-10 inline-flex min-h-12 min-w-44 items-center justify-center rounded-full border border-white/26 bg-white/18 px-7 py-3 text-sm font-semibold text-white/84 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_12px_34px_rgba(0,0,0,0.18)] transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 data-[active=true]:text-white"
          data-active="false"
          data-hero-action
          data-motion-button
          href={action.href}
          key={action.href}
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
