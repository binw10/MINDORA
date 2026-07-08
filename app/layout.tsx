import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MINDORA SDN. BHD.",
  description: "Corporate website for MINDORA SDN. BHD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-primary antialiased">
        <LanguageProvider>
          <SkipLink />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main
              className="w-full flex-1 outline-none"
              id="main-content"
              tabIndex={-1}
            >
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
