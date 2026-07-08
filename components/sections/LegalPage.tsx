"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageEnterMotion } from "@/components/sections/PageEnterMotion";
import { MotionProvider } from "@/components/system/MotionProvider";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type LegalPageKey = "privacyPolicy" | "cookiePolicy" | "termsOfUse";

type LegalPageProps = {
  pageKey: LegalPageKey;
};

export function LegalPage({ pageKey }: LegalPageProps) {
  const { dictionary, locale } = useLanguage();
  const page = dictionary.legal[pageKey];

  return (
    <MotionProvider>
      <PageEnterMotion motionKey={`legal-${pageKey}-${locale}`}>
        <section
          aria-labelledby="legal-page-title"
          className="relative isolate overflow-hidden py-14 sm:py-20"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_24%_12%,rgba(56,189,248,0.24),transparent_24rem),radial-gradient(circle_at_78%_0%,rgba(124,77,255,0.18),transparent_26rem)]"
          />
          <Container>
            <div className="mx-auto max-w-4xl" data-page-enter-item>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-system-border-subtle bg-white/82 px-5 py-2.5 text-sm font-semibold text-system-text-primary shadow-[0_12px_32px_rgba(31,107,255,0.08)] transition hover:border-system-border-strong hover:bg-white hover:text-system-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                data-motion-button
                href="/"
              >
                {dictionary.legal.backHome}
              </Link>

              <div className="mt-10 rounded-[32px] border border-system-border-subtle bg-white/84 p-7 shadow-system-panel backdrop-blur-xl sm:p-10 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-system-primary sm:text-sm">
                  {page.eyebrow}
                </p>
                <h1
                  className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-system-text-primary sm:text-5xl"
                  id="legal-page-title"
                >
                  {page.title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-system-text-secondary">
                  {page.intro}
                </p>
                <p className="mt-6 inline-flex rounded-full border border-system-border-subtle bg-system-muted/70 px-4 py-2 text-sm font-semibold text-system-text-muted">
                  {page.lastUpdated}
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 grid max-w-4xl gap-4" data-page-enter-item>
              {page.sections.map((section, index) => (
                <article
                  className="rounded-[26px] border border-system-border-subtle bg-white/78 p-6 shadow-[0_18px_55px_rgba(31,107,255,0.08)] backdrop-blur-xl sm:p-8"
                  key={section.title}
                >
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(31,107,255,0.15),rgba(124,77,255,0.13))] text-sm font-semibold text-system-primary"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold leading-7 text-system-text-primary">
                        {section.title}
                      </h2>
                      <p className="mt-3 text-base leading-8 text-system-text-secondary">
                        {section.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mx-auto mt-8 flex max-w-4xl justify-center" data-page-enter-item>
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-system-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(31,107,255,0.26)] transition hover:bg-system-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-system-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                data-motion-button
                href="/"
              >
                {dictionary.legal.backHome}
              </Link>
            </div>
          </Container>
        </section>
      </PageEnterMotion>
    </MotionProvider>
  );
}
