"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Card } from "@/components/system/Card";
import { Section } from "@/components/system/Section";
import { LineIcon, type LineIconName } from "@/components/ui/LineIcon";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const capabilityIcons: LineIconName[] = ["lightbulb", "network", "image", "presentation"];
const capabilityCardStyles = [
  "lg:mt-12 bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F8FF_100%)] hover:border-system-primary/45 hover:shadow-[0_28px_70px_rgba(31,107,255,0.16)]",
  "bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F4FF_100%)] hover:border-system-accent-purple/45 hover:shadow-[0_28px_70px_rgba(124,77,255,0.14)]",
  "lg:mt-20 bg-[linear-gradient(180deg,#FFFFFF_0%,#F0FCFF_100%)] hover:border-system-accent-cyan/55 hover:shadow-[0_28px_70px_rgba(6,182,212,0.14)]",
  "lg:mt-6 bg-[linear-gradient(180deg,#FFFFFF_0%,#F7FAFF_100%)] hover:border-system-primary/45 hover:shadow-[0_28px_70px_rgba(31,107,255,0.15)]",
];

const capabilityIconStyles = [
  "bg-system-primary/10 text-system-primary",
  "bg-system-accent-purple/10 text-system-accent-purple",
  "bg-system-accent-cyan/12 text-system-accent-cyan",
  "bg-slate-950 text-white",
];

export function CapabilityGrid() {
  const { dictionary, locale } = useLanguage();
  const { capabilities } = dictionary.system;
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;

      if (!grid) {
        return undefined;
      }

      const cards = gsap.utils.toArray<HTMLElement>(grid.querySelectorAll("[data-capability-card]"));

      if (!cards.length) {
        return undefined;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set(cards, { opacity: 1, clearProps: "transform,willChange" });
        return undefined;
      }

      gsap.set(cards, {
        opacity: 0,
        transformOrigin: "50% 60%",
        willChange: "transform, opacity",
        x: 24,
        y: 28,
      });

      const reveal = gsap.to(cards, {
        opacity: 1,
        duration: 0.72,
        ease: "power3.out",
        paused: true,
        stagger: 0.1,
        x: 0,
        y: 0,
        onComplete: () => {
          gsap.set(cards, { clearProps: "willChange" });
        },
        overwrite: "auto",
      });

      const trigger = ScrollTrigger.create({
        animation: reveal,
        trigger: grid,
        start: "top 82%",
        end: "bottom 34%",
        toggleActions: "play reverse play reverse",
      });

      return () => {
        trigger.kill();
        reveal.kill();
      };
    },
    { dependencies: [capabilities.items.length, locale], scope: gridRef },
  );

  return (
    <Section id="capabilities" labelledBy="capabilities-title">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-system-primary">
          {capabilities.eyebrow}
        </p>
        <h2
          className="mt-4 text-4xl font-semibold leading-tight text-system-text-primary sm:text-5xl"
          id="capabilities-title"
        >
          {capabilities.title}
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-system-text-secondary">
          {capabilities.description}
        </p>
      </div>

      <div
        className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:items-start"
        data-motion-no-global
        ref={gridRef}
      >
        {capabilities.items.map((item, index) => (
          <Card
            className={`group relative min-h-[21rem] overflow-hidden rounded-[26px] p-7 shadow-[0_18px_44px_rgba(31,107,255,0.07)] transition-[border-color,box-shadow,background-color] duration-300 ${capabilityCardStyles[index]}`}
            data-capability-card
            data-motion-no-global
            key={item.title}
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/70 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div
                className={`flex h-13 w-13 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-[1.04] ${capabilityIconStyles[index]}`}
              >
                <LineIcon className="h-6 w-6" name={capabilityIcons[index]} />
              </div>
              <p className="text-sm font-semibold tabular-nums text-system-primary/50">
                {String(index + 1).padStart(2, "0")}
              </p>
            </div>

            <h3 className="relative mt-10 text-2xl font-semibold leading-tight tracking-[-0.01em] text-system-text-primary">
              {item.title}
            </h3>
            <p className="relative mt-5 text-[15px] leading-7 text-system-text-secondary">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
