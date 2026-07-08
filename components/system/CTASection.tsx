"use client";

import { Button } from "@/components/system/Button";
import { ContactDrawer } from "@/components/system/ContactDrawer";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useState } from "react";

const ctaPanelStyle = {
  backgroundColor: "#050505",
  backgroundImage:
    "radial-gradient(circle at 76% 20%, rgba(16, 185, 129, 0.24), transparent 24rem), linear-gradient(135deg, #050505, #101828)",
} satisfies React.CSSProperties;

export function CTASection() {
  const { dictionary } = useLanguage();
  const { cta } = dictionary.system;
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28" data-motion-section>
      <div
        className="relative overflow-hidden rounded-[28px] px-6 py-14 text-system-text-inverse shadow-[0_28px_90px_rgba(3,7,18,0.28)] sm:px-10 lg:px-12"
        style={ctaPanelStyle}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:36px_36px]"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
              {cta.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-system-text-inverse/75">
              {cta.description}
            </p>
          </div>
          <Button
            className="cursor-pointer bg-white text-system-text-primary hover:bg-system-page"
            href="#contact"
            onClick={(event) => {
              event.preventDefault();
              setIsContactOpen(true);
            }}
          >
            {cta.action}
          </Button>
        </div>
      </div>
      <ContactDrawer
        copy={cta.contactDrawer}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </section>
  );
}
