"use client";

import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const legalLinks = [
  { href: "/privacy-policy", key: "privacyPolicy" },
  { href: "/cookie-policy", key: "cookiePolicy" },
  { href: "/terms-of-use", key: "termsOfUse" },
] as const;

export function Footer() {
  const { dictionary } = useLanguage();

  return (
    <footer className="mt-12 bg-[linear-gradient(135deg,#030712,#061225_58%,#0b1f4d)] text-white">
      <Container className="grid gap-10 py-12 text-sm text-white/62 lg:grid-cols-[1.1fr_0.9fr_auto] lg:items-start">
        <div>
          <p className="text-lg font-semibold text-white">MINDORA SDN. BHD.</p>
          <p className="mt-3 max-w-xl leading-7">
            {dictionary.footer.description}
          </p>
          <p className="mt-8 text-white/45">{dictionary.footer.label}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/78">
            {dictionary.footer.companyInfoTitle}
          </p>
          <ul className="mt-4 grid gap-2 leading-6 text-white/56">
            {dictionary.footer.companyInfo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <nav aria-label={dictionary.footer.complianceTitle}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/78">
            {dictionary.footer.complianceTitle}
          </p>
          <ul className="mt-4 grid gap-2">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  className="inline-flex rounded-full py-1 text-white/58 transition hover:text-system-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-system-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]"
                  href={item.href}
                >
                  {dictionary.footer.legalLinks[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
