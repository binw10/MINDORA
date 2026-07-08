"use client";

import { Card } from "@/components/system/Card";
import { Section } from "@/components/system/Section";
import { LineIcon, type LineIconName } from "@/components/ui/LineIcon";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const layerIcons: LineIconName[] = ["document", "spark", "route"];
const layerAccents = [
  {
    card: "bg-[linear-gradient(180deg,#FFFFFF_0%,#F4F8FF_100%)] hover:border-system-primary/45",
    icon: "bg-system-primary/10 text-system-primary",
    line: "from-system-primary to-system-primary/20",
  },
  {
    card: "bg-[linear-gradient(180deg,#FFFFFF_0%,#F7F4FF_100%)] hover:border-system-accent-purple/45",
    icon: "bg-system-accent-purple/10 text-system-accent-purple",
    line: "from-system-accent-purple to-system-accent-purple/20",
  },
  {
    card: "bg-[linear-gradient(180deg,#FFFFFF_0%,#EFFBFF_100%)] hover:border-system-accent-cyan/55",
    icon: "bg-system-accent-cyan/12 text-system-accent-cyan",
    line: "from-system-accent-cyan to-system-accent-cyan/20",
  },
];

export function ArchitectureSection() {
  const { dictionary } = useLanguage();
  const { architecture } = dictionary.system;

  return (
    <Section
      className="max-w-none bg-[linear-gradient(180deg,rgba(234,244,255,0.78),rgba(255,255,255,0.72))] px-5 text-system-text-primary sm:px-6 lg:px-8"
      id="architecture"
      labelledBy="architecture-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-system-primary">
            {architecture.eyebrow}
          </p>
          <h2
            className="mt-4 text-balance text-4xl font-semibold leading-tight text-system-text-primary sm:text-5xl"
            id="architecture-title"
          >
            {architecture.title}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-system-text-secondary">
            {architecture.description}
          </p>
        </div>

        <ol className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch" data-motion-grid>
          {architecture.layers.map((layer, index) => (
            <Card
              as="li"
              className={`group relative min-w-0 overflow-hidden rounded-[26px] p-7 shadow-[0_20px_54px_rgba(31,107,255,0.08)] transition duration-300 hover:shadow-[0_30px_82px_rgba(31,107,255,0.14)] ${layerAccents[index].card}`}
              data-motion-grid-item
              key={layer.title}
            >
              <div
                aria-hidden="true"
                className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${layerAccents[index].line}`}
              />
              <div className="flex items-start justify-between gap-5">
                <div className={`flex h-13 w-13 items-center justify-center rounded-2xl ${layerAccents[index].icon}`}>
                  <LineIcon className="h-6 w-6" name={layerIcons[index]} />
                </div>
                <span className="text-sm font-semibold tabular-nums text-system-primary/45">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-8 min-w-0 text-[1.7rem] font-semibold leading-tight tracking-[-0.02em] text-system-text-primary [overflow-wrap:anywhere]">
                {layer.title}
              </h3>
              <div className="mt-7 grid gap-3.5">
                {layer.items.map((item) => (
                  <span
                    className="flex min-w-0 items-center gap-3 rounded-full border border-system-border-subtle bg-white/72 px-4 py-2 text-[15px] font-semibold text-system-text-secondary shadow-[0_10px_24px_rgba(31,107,255,0.05)]"
                    key={item}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-system-primary" />
                    <span className="min-w-0 [overflow-wrap:anywhere]">{item}</span>
                  </span>
                ))}
              </div>

              <p className="mt-7 min-w-0 border-t border-system-border-subtle pt-5 text-[15px] font-medium leading-7 text-system-text-secondary [overflow-wrap:anywhere]">
                {architecture.signals[index]}
              </p>
            </Card>
          ))}
        </ol>
      </div>
    </Section>
  );
}
