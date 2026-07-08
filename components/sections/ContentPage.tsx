"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { PageKey } from "@/lib/i18n/dictionary";
import { PageEnterMotion } from "@/components/sections/PageEnterMotion";
import { StackedCards } from "@/components/sections/StackedCards";
import { MotionProvider } from "@/components/system/MotionProvider";
import type { LineIconName } from "@/components/ui/LineIcon";

type ContentSection = {
  title: string;
  body: string;
};

type ContentPageProps = {
  pageKey: PageKey;
};

const pageIconMap: Record<PageKey, LineIconName[]> = {
  about: ["layers", "brain", "globe", "team"],
  solutions: ["network", "automation", "spark", "image"],
  useCases: ["document", "spark", "presentation", "team"],
  advantages: ["brain", "compass", "map", "shield"],
  roadmap: ["route", "layers", "presentation", "globe"],
  contact: ["chat", "team", "globe", "document"],
};

const pageVisualMap: Partial<Record<PageKey, { alt: string; src: string }>> = {
  about: {
    alt: "MINDORA team collaboration in a Southeast Asia office",
    src: "/images/about-visual-v1.png",
  },
  solutions: {
    alt: "MINDORA product solutions workspace with modular AI workflow interface",
    src: "/images/solutions-visual-v1.png",
  },
  useCases: {
    alt: "MINDORA application scenarios workspace with notes, planning boards, and creative outputs",
    src: "/images/use-cases-visual-v1.png",
  },
  advantages: {
    alt: "MINDORA regional strategy and product delivery collaboration in Southeast Asia",
    src: "/images/advantages-visual-v1.png",
  },
};

function getTitleParts(title: string, pageKey: PageKey) {
  if (pageKey === "about") {
    return { accent: "SDN. BHD.", base: "MINDORA" };
  }

  const normalizedTitle = title.replace(/[。.]$/, "");
  const separators = ["，", ",", " / ", " to "];
  const separator = separators.find((item) => normalizedTitle.includes(item));

  if (!separator) {
    return { accent: "", base: normalizedTitle };
  }

  const parts = normalizedTitle.split(separator).filter(Boolean);
  const accent = parts.pop() ?? "";

  return {
    accent,
    base: `${parts.join(separator)}${separator}`,
  };
}

export function ContentPage({ pageKey }: ContentPageProps) {
  const { dictionary, locale } = useLanguage();
  const { eyebrow, title, description, sections } = dictionary.pages[pageKey] as {
    eyebrow: string;
    title: string;
    description: string;
    sections: readonly ContentSection[];
  };
  const pageVisual = pageVisualMap[pageKey];
  const titleParts = getTitleParts(title, pageKey);

  return (
    <MotionProvider>
    <PageEnterMotion motionKey={`${pageKey}-${locale}`}>
    <section
      className="mx-auto isolate w-full max-w-7xl px-5 py-12 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="page-title"
      data-motion-section
    >
      <div className="grid min-w-0 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="flex min-h-[430px] min-w-0 items-center justify-center text-center" data-page-enter-item>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-system-primary sm:text-sm">
              {eyebrow}
            </p>
            <h1
              id="page-title"
              className="mt-7 text-balance text-4xl font-bold leading-[1.08] text-primary sm:text-5xl lg:text-6xl"
            >
              <span>{titleParts.base}</span>{" "}
              {titleParts.accent ? (
                <span className="bg-[linear-gradient(90deg,#1f6bff,#7c4dff)] bg-clip-text text-transparent">
                  {titleParts.accent}
                </span>
              ) : null}
            </h1>
          </div>
        </div>

        <div data-page-enter-item>
        <StackedCards
          items={sections.map((item, index) => ({
            ...item,
            icon: pageIconMap[pageKey][index % pageIconMap[pageKey].length],
          }))}
        />
        </div>
      </div>

      <div className="mt-16 grid overflow-hidden rounded-[28px] border border-system-border-subtle bg-white/88 text-primary shadow-[0_24px_70px_rgba(31,107,255,0.1)] lg:grid-cols-[0.92fr_1.08fr]" data-motion-no-global data-page-enter-item>
          <div className="p-8 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-system-primary">
              {eyebrow}
            </p>
            <h2 className="mt-4 max-w-2xl text-pretty text-lg font-medium leading-8 text-primary/78 sm:text-xl sm:leading-9">
              {description}
            </h2>
            <div className="mt-8 grid gap-4 text-base font-medium text-system-text-secondary">
              {sections.map((item) => (
                <span className="flex min-w-0 items-center gap-3" key={item.title}>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-system-primary" />
                  <span className="min-w-0 [overflow-wrap:anywhere]">{item.title}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(31,107,255,0.2),transparent_18rem),linear-gradient(135deg,rgba(234,244,255,0.95),rgba(255,255,255,0.78))]">
              {pageVisual ? (
                <>
                  <Image
                    alt={pageVisual.alt}
                    className="absolute inset-0 h-[108%] w-full object-cover"
                    data-motion-media
                    fill
                    priority={pageKey === "about"}
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    src={pageVisual.src}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,250,255,0.04),rgba(245,250,255,0.18))]"
                  />
                </>
              ) : (
                <>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(31,107,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(31,107,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]"
                  />
                  <div className="absolute inset-8 rounded-[24px] border border-system-border-subtle bg-white/68 p-5 shadow-[0_24px_70px_rgba(31,107,255,0.13)]">
                    <div className="grid h-full gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                      <div className="overflow-hidden rounded-[20px] border border-system-border-subtle bg-white/72">
                        <div className="h-2/3 bg-[radial-gradient(circle_at_35%_32%,rgba(255,255,255,0.85),transparent_8rem),linear-gradient(145deg,rgba(31,107,255,0.24),rgba(56,189,248,0.14),rgba(124,77,255,0.12))]" />
                        <div className="grid h-1/3 grid-cols-3 gap-2 p-3">
                          <span className="rounded-lg bg-system-muted" />
                          <span className="rounded-lg bg-system-muted" />
                          <span className="rounded-lg bg-system-muted" />
                        </div>
                      </div>
                      <div className="grid gap-4">
                        <span className="rounded-[20px] border border-system-border-subtle bg-white/70" />
                        <span className="rounded-[20px] border border-system-border-subtle bg-white/70" />
                        <span className="rounded-[20px] border border-system-border-subtle bg-white/70" />
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>
      </div>
    </section>
    </PageEnterMotion>
    </MotionProvider>
  );
}
