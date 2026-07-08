"use client";

import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ContactDrawer } from "@/components/system/ContactDrawer";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const navigation = [
  { key: "about", href: "/about" },
  { key: "solutions", href: "/solutions" },
  { key: "useCases", href: "/use-cases" },
  { key: "advantages", href: "/advantages" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const highlight = highlightRef.current;

    if (!nav || !highlight) {
      return undefined;
    }

    const links = Array.from(nav.querySelectorAll<HTMLElement>("[data-nav-link]"));

    const moveHighlight = (target: HTMLElement, instant = false) => {
      const navRect = nav.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      gsap.to(highlight, {
        duration: instant ? 0 : 0.28,
        ease: "power3.out",
        height: targetRect.height,
        opacity: 1,
        width: targetRect.width,
        x: targetRect.left - navRect.left,
        y: targetRect.top - navRect.top,
        overwrite: "auto",
      });
    };

    const activeLink = links.find((link) => link instanceof HTMLAnchorElement && link.getAttribute("href") === pathname);

    if (activeLink) {
      moveHighlight(activeLink, true);
    } else {
      gsap.set(highlight, { opacity: 0 });
    }

    const onEnter = (event: Event) => {
      moveHighlight(event.currentTarget as HTMLElement);
    };

    const onLeave = () => {
      if (activeLink) {
        moveHighlight(activeLink);
        return;
      }

      gsap.to(highlight, {
        duration: 0.18,
        ease: "power2.out",
        opacity: 0,
        overwrite: "auto",
      });
    };

    links.forEach((link) => {
      link.addEventListener("pointerenter", onEnter);
      link.addEventListener("focus", onEnter);
    });
    nav.addEventListener("pointerleave", onLeave);
    nav.addEventListener("focusout", onLeave);

    return () => {
      links.forEach((link) => {
        link.removeEventListener("pointerenter", onEnter);
        link.removeEventListener("focus", onEnter);
      });
      nav.removeEventListener("pointerleave", onLeave);
      nav.removeEventListener("focusout", onLeave);
      gsap.killTweensOf(highlight);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 isolate border-b border-white/70 bg-white/88 shadow-[0_10px_34px_rgba(15,23,42,0.06)]">
      <Container className="flex min-h-16 items-center justify-between gap-6 py-3">
        <Link
          aria-label="MINDORA home"
          className="inline-flex shrink-0 items-center rounded-2xl outline-none transition hover:opacity-85 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <Image
            alt="MINDORA"
            className="h-11 w-auto object-contain sm:h-12"
            height={364}
            priority
            src="/images/brand/mindora-logo-nav.png"
            width={420}
          />
        </Link>
        <nav
          aria-label="Primary navigation"
          className="relative isolate hidden items-center gap-2 text-sm md:flex"
          ref={navRef}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-[linear-gradient(135deg,rgba(31,107,255,0.16),rgba(124,77,255,0.16))] opacity-0 shadow-[0_12px_28px_rgba(31,107,255,0.16)] will-change-transform"
            ref={highlightRef}
          />
          {navigation.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              className={`relative z-10 rounded-full px-4 py-2.5 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                pathname === item.href
                  ? "bg-system-primary text-background shadow-[0_10px_26px_rgba(31,107,255,0.24)]"
                  : "text-primary/68 hover:text-system-primary"
              }`}
              data-nav-link
              href={item.href}
              key={item.href}
            >
              {dictionary.nav[item.key]}
            </Link>
          ))}
          <button
            className="relative z-10 rounded-full px-4 py-2.5 font-medium text-primary/68 transition-colors duration-200 hover:text-system-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            data-nav-link
            onClick={() => setIsContactOpen(true)}
            type="button"
          >
            {dictionary.nav.contact}
          </button>
          <LanguageSwitcher />
        </nav>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={isOpen}
          aria-label="Toggle primary navigation"
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-system-border-subtle bg-white/75 text-primary transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          data-motion-button
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span className="grid gap-1.5" aria-hidden="true">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
      </Container>
      <div
        className={`border-t border-white/70 bg-white/94 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        id="mobile-navigation"
      >
        <Container className="grid gap-1 py-3">
          {navigation.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              className={`min-h-11 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                pathname === item.href
                  ? "bg-system-primary text-background shadow-[0_10px_26px_rgba(31,107,255,0.22)]"
                  : "text-primary/72 hover:bg-[linear-gradient(135deg,rgba(31,107,255,0.13),rgba(124,77,255,0.13))] hover:text-system-primary"
              }`}
              href={item.href}
              key={item.href}
              onClick={() => setIsOpen(false)}
            >
              {dictionary.nav[item.key]}
            </Link>
          ))}
          <button
            className="min-h-11 rounded-2xl px-4 py-3 text-left text-sm font-medium text-primary/72 transition-all duration-200 hover:bg-[linear-gradient(135deg,rgba(31,107,255,0.13),rgba(124,77,255,0.13))] hover:text-system-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => {
              setIsOpen(false);
              setIsContactOpen(true);
            }}
            type="button"
          >
            {dictionary.nav.contact}
          </button>
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
        </Container>
      </div>
      <ContactDrawer
        copy={dictionary.system.cta.contactDrawer}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </header>
  );
}
