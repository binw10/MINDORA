"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

gsap.registerPlugin(useGSAP);

const apiEndpoint = "http://api.mindora.online";

export function HeroCodeInput() {
  const { locale } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLSpanElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const output = outputRef.current;
      const scan = scanRef.current;

      if (!output) {
        return undefined;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        output.textContent = apiEndpoint;
        return undefined;
      }

      const cursor = { value: 0 };
      const setOutput = () => {
        output.textContent = apiEndpoint.slice(0, Math.floor(cursor.value));
      };

      output.textContent = "";

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.2,
      });

      timeline
        .to(cursor, {
          duration: 2.35,
          ease: "none",
          onUpdate: setOutput,
          value: apiEndpoint.length,
        })
        .to(output, {
          duration: 0.16,
          opacity: 0.55,
          repeat: 2,
          yoyo: true,
        })
        .to(cursor, {
          duration: 0.36,
          ease: "power2.in",
          onUpdate: setOutput,
          value: 0,
        });

      if (scan) {
        timeline.fromTo(
          scan,
          { xPercent: -140, opacity: 0 },
          {
            duration: 2.35,
            ease: "power2.inOut",
            opacity: 1,
            xPercent: 260,
          },
          0,
        );
      }

      return () => {
        timeline.kill();
      };
    },
    { dependencies: [locale], scope: rootRef },
  );

  return (
    <div
      aria-label={`API endpoint ${apiEndpoint}`}
      className="mx-auto mt-7 w-full max-w-xl"
      data-motion-hero-support
      ref={rootRef}
      role="textbox"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/24 bg-slate-950/38 px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_42px_rgba(0,0,0,0.18)]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,transparent,rgba(125,211,252,0.22),transparent)] opacity-0"
          ref={scanRef}
        />
        <div className="relative flex min-h-7 items-center gap-3 font-mono text-sm font-semibold text-cyan-100 sm:text-base">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(125,211,252,0.7)]" />
          <span className="text-white/42">$</span>
          <span className="relative min-w-0 flex-1">
            <span className="select-none opacity-0">{apiEndpoint}</span>
            <span className="absolute inset-0 whitespace-nowrap" ref={outputRef} />
          </span>
          <span
            aria-hidden="true"
            className="h-5 w-2 animate-pulse rounded-sm bg-cyan-200/80 shadow-[0_0_16px_rgba(125,211,252,0.52)]"
          />
        </div>
      </div>
    </div>
  );
}
