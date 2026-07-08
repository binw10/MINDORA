"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type DiagramCard = {
  accent: "blue" | "cyan" | "violet" | "slate";
  className: string;
  lines?: number;
  rotate?: string;
  size?: "sm" | "md";
  variant: "button" | "document" | "colors" | "list" | "icons" | "badge";
};

const accentClasses = {
  blue: "bg-[#3f63ff] shadow-[0_14px_30px_rgba(63,99,255,0.24)]",
  cyan: "bg-[#38bdf8] shadow-[0_14px_30px_rgba(56,189,248,0.2)]",
  slate: "bg-[#111827] shadow-[0_14px_30px_rgba(17,24,39,0.18)]",
  violet: "bg-[#7c4dff] shadow-[0_14px_30px_rgba(124,77,255,0.2)]",
};

const cards: DiagramCard[] = [
  {
    accent: "slate",
    className: "left-[19%] top-[15%]",
    rotate: "-2deg",
    size: "sm",
    variant: "button",
  },
  {
    accent: "blue",
    className: "left-[21%] top-[34%]",
    lines: 4,
    rotate: "-1deg",
    variant: "document",
  },
  {
    accent: "cyan",
    className: "left-[17%] bottom-[18%]",
    rotate: "1deg",
    variant: "icons",
  },
  {
    accent: "violet",
    className: "right-[18%] top-[14%]",
    rotate: "-1deg",
    size: "sm",
    variant: "badge",
  },
  {
    accent: "blue",
    className: "right-[10%] top-[30%]",
    rotate: "2deg",
    variant: "colors",
  },
  {
    accent: "slate",
    className: "right-[13%] bottom-[21%]",
    lines: 3,
    rotate: "-1deg",
    variant: "list",
  },
  {
    accent: "cyan",
    className: "left-[34%] bottom-[10%]",
    size: "sm",
    variant: "badge",
  },
  {
    accent: "violet",
    className: "right-[36%] bottom-[8%]",
    size: "sm",
    variant: "badge",
  },
];

const dots = [
  "left-[12%] top-[29%]",
  "left-[15%] bottom-[13%]",
  "left-[31%] top-[8%]",
  "left-[37%] bottom-[20%]",
  "right-[36%] top-[22%]",
  "right-[29%] bottom-[14%]",
  "right-[11%] top-[10%]",
  "right-[8%] bottom-[8%]",
];

function CardPreview({ card, label }: { card: DiagramCard; label: string }) {
  const lineCount = card.lines ?? 2;

  if (card.variant === "button") {
    return (
      <div className="space-y-3">
        <span className="block h-3 w-24 rounded-full bg-slate-950" />
        <span className="block h-3 w-32 rounded-full bg-slate-200" />
      </div>
    );
  }

  if (card.variant === "colors") {
    return (
      <div className="mt-1 grid grid-cols-4 gap-2">
        {["bg-slate-950", "bg-slate-200", "bg-rose-500", "bg-cyan-500", "bg-orange-500", "bg-teal-500", "bg-blue-500", "bg-slate-500"].map(
          (color) => (
            <span className={`h-4 w-4 rounded ${color}`} key={color} />
          ),
        )}
      </div>
    );
  }

  if (card.variant === "icons") {
    return (
      <div className="flex gap-3 pt-1">
        {["bg-slate-950", "bg-slate-300", "bg-slate-400", "bg-slate-500"].map((color) => (
          <span className={`h-5 w-5 rounded-md ${color}`} key={color} />
        ))}
      </div>
    );
  }

  if (card.variant === "badge") {
    return (
      <div className="space-y-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className={`h-2.5 w-2.5 rounded-full ${accentClasses[card.accent]}`} />
          {label}
        </span>
        <span className="block h-2.5 w-24 rounded-full bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {Array.from({ length: lineCount }).map((_, index) => (
        <span
          className="block h-2.5 rounded-full bg-slate-200"
          key={index}
          style={{ width: `${92 - index * 14}%` }}
        />
      ))}
    </div>
  );
}

function FloatingCard({
  card,
  cardRef,
  index,
  label,
}: {
  card: DiagramCard;
  cardRef: (node: HTMLDivElement | null) => void;
  index: number;
  label: string;
}) {
  const isSmall = card.size === "sm";

  return (
    <div
      className={`absolute ${card.className} hidden will-change-transform md:block ${
        isSmall ? "w-40" : "w-48"
      }`}
      data-system-card
      ref={cardRef}
    >
      <div
        className="relative rounded-[20px] border border-slate-200/70 bg-white/94 p-4 text-slate-900 shadow-[0_20px_54px_rgba(15,23,42,0.1)]"
        style={{ rotate: card.rotate ?? "0deg" }}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <span className={`h-3 w-3 rounded-full ${accentClasses[card.accent]}`} />
        </div>
        <CardPreview card={card} label={label} />
        <span
          aria-hidden="true"
          className={`absolute h-2 w-2 rounded-full bg-slate-300/70 ${
            index % 2 === 0 ? "-right-1 top-1/2" : "-left-1 top-1/2"
          }`}
        />
      </div>
    </div>
  );
}

export function SystemDiagram() {
  const { dictionary, locale } = useLanguage();
  const { diagram, hero } = dictionary.system;
  const diagramRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = diagramRef.current;

    if (!root) {
      return undefined;
    }

    let animationContext: gsap.Context | undefined;
    let frameId = 0;
    let settleTimer = 0;
    let resizeTimer = 0;
    const animations: gsap.core.Animation[] = [];

    const collectTargets = () => {
      const systemCards =
        (cardRefs.current.filter(Boolean) as HTMLDivElement[]).length > 0
          ? (cardRefs.current.filter(Boolean) as HTMLDivElement[])
          : gsap.utils.toArray<HTMLDivElement>(root.querySelectorAll("[data-system-card]"));
      const systemDots =
        (dotRefs.current.filter(Boolean) as HTMLSpanElement[]).length > 0
          ? (dotRefs.current.filter(Boolean) as HTMLSpanElement[])
          : gsap.utils.toArray<HTMLSpanElement>(root.querySelectorAll("[data-system-dot]"));
      const systemHub = hubRef.current ?? root.querySelector<HTMLDivElement>("[data-system-hub]");

      return { systemCards, systemDots, systemHub };
    };

    const killAnimations = () => {
      animations.splice(0).forEach((animation) => animation.kill());
      animationContext?.revert();
      animationContext = undefined;
    };

    const startAnimation = (attempt = 0) => {
      const { systemCards, systemDots, systemHub } = collectTargets();

      if (!systemCards.length && attempt < 6) {
        frameId = window.requestAnimationFrame(() => startAnimation(attempt + 1));
        return;
      }

      killAnimations();
      root.dataset.systemMotionState = "running";

      animationContext = gsap.context(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
          gsap.set([...systemCards, ...systemDots, ...(systemHub ? [systemHub] : [])], {
            clearProps: "animation,transform,opacity,willChange",
          });
          return;
        }

        gsap.set(systemCards, {
          animation: "none",
          opacity: 1,
        });

        if (systemHub) {
          gsap.set(systemHub, {
            clearProps: "willChange",
            scale: 1,
            x: 0,
            y: 0,
          });
        }

        systemCards.forEach((card, index) => {
          const amplitude = 32 + (index % 4) * 5;
          const direction = index % 2 === 0 ? 1 : -1;
          const driftDuration = 2.2 + (index % 3) * 0.18;

          gsap.set(card, {
            rotation: 0,
            transformOrigin: "50% 50%",
            willChange: "transform",
            x: 0,
            y: 0,
          });

          const timeline = gsap
            .timeline({
              delay: index * 0.12,
              repeat: -1,
              defaults: {
                duration: driftDuration,
                ease: "sine.inOut",
              },
            })
            .to(card, { rotation: direction * 3.6, x: amplitude * direction, y: -amplitude })
            .to(card, {
              rotation: direction * -3,
              x: amplitude * 0.92 * direction,
              y: amplitude,
            })
            .to(card, {
              rotation: direction * 2.4,
              x: -amplitude * 0.82 * direction,
              y: amplitude * 0.62,
            })
            .to(card, { rotation: 0, x: 0, y: 0 });

          animations.push(timeline);
        });

        if (systemDots.length) {
          animations.push(
            gsap.to(systemDots, {
              duration: 3.8,
              ease: "sine.inOut",
              opacity: 0.28,
              repeat: -1,
              stagger: 0.16,
              yoyo: true,
            }),
          );
        }
      }, root);

      gsap.ticker.wake();
    };

    const restartAnimation = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => startAnimation());
    };

    const resumeAnimation = () => {
      if (document.visibilityState === "visible") {
        if (!animations.length) {
          restartAnimation();
          return;
        }

        animations.forEach((animation) => {
          animation.invalidate().resume();
        });
        gsap.ticker.wake();
      }
    };

    const scheduleSettledRestart = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(restartAnimation, 260);
    };

    const scheduleResizeRestart = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(restartAnimation, 180);
    };

    frameId = window.requestAnimationFrame(() => startAnimation());
    scheduleSettledRestart();
    window.addEventListener("load", scheduleSettledRestart, { once: true });
    window.addEventListener("resize", scheduleResizeRestart);
    document.addEventListener("visibilitychange", resumeAnimation);
    window.addEventListener("pageshow", resumeAnimation);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(settleTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("load", scheduleSettledRestart);
      window.removeEventListener("resize", scheduleResizeRestart);
      document.removeEventListener("visibilitychange", resumeAnimation);
      window.removeEventListener("pageshow", resumeAnimation);
      killAnimations();
    };
  }, [locale]);

  return (
    <div
      aria-label="MINDORA creative system diagram"
      className="relative min-h-[460px] overflow-visible bg-white/0 pb-12 lg:min-h-[580px]"
      data-system-diagram
      ref={diagramRef}
      role="img"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.64)_48%,rgba(255,255,255,0)_82%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,rgba(31,107,255,0.025),transparent_72%)]"
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-slate-200"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1000 520"
      >
        <path d="M500 260 L330 170" stroke="currentColor" strokeWidth="2" />
        <path d="M500 260 L342 254" stroke="currentColor" strokeWidth="2" />
        <path d="M500 260 L326 372" stroke="currentColor" strokeWidth="2" />
        <path d="M500 260 L668 162" stroke="currentColor" strokeWidth="2" />
        <path d="M500 260 L735 246" stroke="currentColor" strokeWidth="2" />
        <path d="M500 260 L718 366" stroke="currentColor" strokeWidth="2" />
        <path d="M500 260 L408 438" stroke="currentColor" strokeWidth="1.5" />
        <path d="M500 260 L600 438" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {dots.map((dot, index) => (
        <span
          aria-hidden="true"
          className={`absolute ${dot} h-1.5 w-1.5 rounded-full bg-slate-300 will-change-opacity`}
          data-system-dot
          key={dot}
          ref={(node) => {
            dotRefs.current[index] = node;
          }}
        />
      ))}

      {cards.map((card, index) => (
        <FloatingCard
          card={card}
          cardRef={(node) => {
            cardRefs.current[index] = node;
          }}
          index={index}
          key={diagram.cards[index]}
          label={diagram.cards[index]}
        />
      ))}

      <div
        className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[26px] bg-[linear-gradient(145deg,#070817,#3a3a45)] shadow-[0_34px_90px_rgba(15,23,42,0.22)] will-change-transform md:h-28 md:w-28"
        data-system-hub
        ref={hubRef}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[inset_0_-10px_18px_rgba(15,23,42,0.08)]">
          <span className="h-7 w-7 rounded-xl bg-[#070817]" />
        </span>
      </div>

      <div className="absolute inset-x-6 bottom-0 grid grid-cols-2 gap-3 rounded-[26px] border border-white/70 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:hidden">
        {hero.pillars.map((pillar) => (
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-3 text-sm font-semibold text-slate-900" key={pillar}>
            {pillar}
          </div>
        ))}
      </div>
    </div>
  );
}
