"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { LineIcon, type LineIconName } from "@/components/ui/LineIcon";

gsap.registerPlugin(useGSAP);

type StackedCardsItem = {
  body: string;
  icon: LineIconName;
  title: string;
};

type StackedCardsProps = {
  items: readonly StackedCardsItem[];
};

const stackPositions = [
  { opacity: 1, scale: 1, y: 0, zIndex: 30 },
  { opacity: 0.72, scale: 0.965, y: 28, zIndex: 20 },
  { opacity: 0.46, scale: 0.93, y: 56, zIndex: 10 },
];

export function StackedCards({ items }: StackedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const applyStack = (nextIndex: number, immediate = false) => {
    const cards = containerRef.current?.querySelectorAll<HTMLElement>("[data-stack-card]");

    if (!cards?.length) {
      return;
    }

    cards.forEach((card, index) => {
      const stackIndex = (index - nextIndex + cards.length) % cards.length;
      const position = stackPositions[stackIndex] ?? stackPositions[stackPositions.length - 1];

      gsap.to(card, {
        duration: immediate ? 0 : 0.55,
        ease: "power3.out",
        opacity: position.opacity,
        overwrite: "auto",
        scale: position.scale,
        y: position.y,
        zIndex: position.zIndex,
      });
    });
  };

  const goTo = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + items.length) % items.length;
    activeIndexRef.current = normalizedIndex;
    setActiveIndex(normalizedIndex);
    applyStack(normalizedIndex);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = window.setInterval(() => {
      goTo(activeIndexRef.current + 1);
    }, 3500);
  };

  useGSAP(
    () => {
      applyStack(0, true);
      startAutoPlay();

      return () => {
        stopAutoPlay();
      };
    },
    { dependencies: [items.length], scope: containerRef },
  );

  return (
    <div
      className="relative min-h-[430px] overflow-visible"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      ref={containerRef}
    >
      <div className="relative h-[360px] sm:h-[390px]">
        {items.map((item, index) => (
          <article
            aria-hidden={index !== activeIndex}
            className="absolute inset-x-0 top-0 min-w-0 cursor-pointer rounded-[30px] border border-system-border-subtle bg-white/94 p-7 shadow-[0_24px_70px_rgba(31,107,255,0.12)] will-change-transform sm:p-8 lg:p-10"
            data-stack-card
            key={item.title}
            onClick={() => goTo(index === activeIndexRef.current ? index + 1 : index)}
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-system-muted text-system-primary">
                  <LineIcon className="h-7 w-7" name={item.icon} />
                </span>
                <span className="rounded-full bg-[linear-gradient(135deg,rgba(31,107,255,0.14),rgba(124,77,255,0.12))] px-4 py-1.5 text-sm font-semibold text-system-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold uppercase tracking-[0.08em] text-system-text-muted">
                MINDORA
              </span>
            </div>

            <h2 className="mt-10 min-w-0 text-pretty text-3xl font-semibold leading-tight text-primary [overflow-wrap:anywhere] sm:text-4xl">
              {item.title}
            </h2>
            <p className="mt-5 min-w-0 text-lg leading-8 text-system-text-secondary [overflow-wrap:anywhere]">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3" aria-label="About card selector">
        {items.map((item, index) => (
          <button
            aria-label={item.title}
            aria-pressed={index === activeIndex}
            className={`h-2.5 rounded-full transition-all duration-200 ${
              index === activeIndex ? "w-8 bg-system-primary" : "w-2.5 bg-system-border-strong"
            }`}
            key={item.title}
            onClick={() => goTo(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
