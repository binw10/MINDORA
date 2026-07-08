"use client";

import Image from "next/image";
import { HeroActions } from "@/components/system/HeroActions";
import { HeroCodeInput } from "@/components/system/HeroCodeInput";
import { SystemDiagram } from "@/components/system/SystemDiagram";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function HeroSection() {
  const { dictionary } = useLanguage();
  const { hero } = dictionary.system;

  return (
    <section
      aria-labelledby="system-hero-title"
      className="relative isolate w-full overflow-hidden rounded-b-[40px] bg-background"
    >
      <div
        className="relative min-h-[620px] overflow-hidden bg-[#070817] px-5 py-20 sm:px-6 lg:min-h-[720px] lg:px-8 lg:py-28"
        data-motion-hero
      >
        <Image
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          data-motion-bg-drift
          fill={false}
          height={1080}
          priority
          src="/images/mindora-ai-office-efficiency-hero-v1.png"
          width={1920}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,17,0.46)_0%,rgba(4,7,17,0.52)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(31,107,255,0.06),transparent_32rem),radial-gradient(circle_at_78%_28%,rgba(124,77,255,0.16),transparent_30rem)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-full w-[38rem] -translate-x-1/2 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] opacity-70"
          data-motion-light-drift
        />

        <div
          className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col items-center justify-center text-center lg:min-h-[500px]"
          data-motion-hero-content
        >
          <p className="inline-flex rounded-full border border-white/28 bg-white/14 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/82 shadow-sm">
            {hero.eyebrow}
          </p>
          <h1
            className="mx-auto mt-7 max-w-5xl text-5xl font-black leading-[1.02] tracking-[0.01em] text-[#f7fbff] drop-shadow-[0_14px_42px_rgba(0,0,0,0.42)] sm:text-6xl lg:text-8xl"
            data-motion-hero-title
            id="system-hero-title"
            style={{
              fontFamily:
                '"Alibaba PuHuiTi 3.0", "HarmonyOS Sans SC", MiSans, "PingFang SC", "Microsoft YaHei", sans-serif',
            }}
          >
            {hero.titlePrefix}
            <span className="block bg-[linear-gradient(92deg,#7dd3fc_0%,#a78bfa_46%,#ffffff_100%)] bg-clip-text text-transparent drop-shadow-[0_0_34px_rgba(124,77,255,0.28)]">
              {hero.titleAccent}
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-8 text-white/80 drop-shadow-[0_8px_28px_rgba(0,0,0,0.32)] sm:text-xl"
            data-motion-hero-subtitle
          >
            {hero.description}
          </p>
          <HeroCodeInput />
          <div className="mt-9">
            <HeroActions />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
        <div className="mx-auto w-full max-w-6xl">
          <SystemDiagram />
        </div>
      </div>
    </section>
  );
}
