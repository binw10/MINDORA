"use client";

import { Section } from "@/components/system/Section";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function SystemOverview() {
  const { dictionary } = useLanguage();
  const { overview } = dictionary.system;

  return (
    <Section id="overview" labelledBy="system-overview-title">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-system-primary">
          {overview.eyebrow}
        </p>
        <h2
          className="mt-4 text-4xl font-semibold leading-tight text-system-text-primary sm:text-5xl"
          id="system-overview-title"
        >
          {overview.title}
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-system-text-secondary">
          {overview.description}
        </p>
      </div>
    </Section>
  );
}
