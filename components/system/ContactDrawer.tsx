"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

gsap.registerPlugin(useGSAP);

type ContactDrawerProps = {
  copy: Dictionary["system"]["cta"]["contactDrawer"];
  isOpen: boolean;
  onClose: () => void;
};

export function ContactDrawer({ copy, isOpen, onClose }: ContactDrawerProps) {
  const { locale } = useLanguage();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.setTimeout(() => firstInputRef.current?.focus(), 260);
      return undefined;
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const panel = panelRef.current;

      if (!root || !panel) {
        return;
      }

      if (isOpen) {
        gsap.set(root, { pointerEvents: "auto", visibility: "visible" });
        gsap.fromTo(
          root.querySelector("[data-contact-backdrop]"),
          { opacity: 0 },
          { opacity: 1, duration: 0.24, ease: "power2.out", overwrite: "auto" },
        );
        gsap.fromTo(
          panel,
          { xPercent: 104 },
          { xPercent: 0, duration: 0.58, ease: "power3.out", overwrite: "auto" },
        );
        gsap.fromTo(
          panel.querySelectorAll("[data-contact-reveal]"),
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            ease: "power2.out",
            stagger: 0.07,
            delay: 0.14,
            overwrite: "auto",
          },
        );
        return;
      }

      const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

      timeline
        .to(panel, { xPercent: 104, duration: 0.34, ease: "power2.inOut" }, 0)
        .to(root.querySelector("[data-contact-backdrop]"), { opacity: 0, duration: 0.24, ease: "power2.out" }, 0)
        .set(root, { pointerEvents: "none", visibility: "hidden" });
    },
    { dependencies: [isOpen], scope: rootRef },
  );

  useGSAP(
    () => {
      const toast = toastRef.current;

      if (!successToast || !toast) {
        return undefined;
      }

      const timeline = gsap.timeline({
        onComplete: () => setSuccessToast(""),
      });

      timeline
        .fromTo(
          toast,
          { opacity: 0, scale: 0.94, y: 18 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.38,
            ease: "power3.out",
            overwrite: "auto",
          },
        )
        .to(toast, {
          opacity: 0,
          scale: 0.985,
          y: -8,
          delay: 2.2,
          duration: 0.28,
          ease: "power2.inOut",
        });

      return () => {
        timeline.kill();
      };
    },
    { dependencies: [successToast], scope: toastRef },
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setErrorMessage("");
    setIsSubmitted(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          email: formData.get("email"),
          locale,
          message: formData.get("message"),
          name: formData.get("name"),
          page: window.location.pathname,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || copy.error);
      }

      form.reset();
      setIsSubmitted(true);
      setSuccessToast(copy.success);
      window.setTimeout(onClose, 80);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const drawer = (
    <div
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-hidden={!isOpen}
      aria-modal="true"
      className="pointer-events-none invisible fixed inset-0 z-[100]"
      ref={rootRef}
      role="dialog"
    >
      <button
        aria-label={copy.close}
        className="absolute inset-0 cursor-default bg-slate-950/48 opacity-0"
        data-contact-backdrop
        onClick={onClose}
        type="button"
      />

      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-[#070A12] px-6 py-6 text-white shadow-[-28px_0_90px_rgba(2,6,23,0.38)] will-change-transform sm:px-10 lg:px-12"
        ref={panelRef}
      >
        <div className="flex items-center justify-between gap-6" data-contact-reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
            {copy.eyebrow}
          </span>
          <button
            aria-label={copy.close}
            className="grid size-10 place-items-center rounded-full border border-white/12 text-xl leading-none text-white/72 transition hover:border-white/28 hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            data-motion-button
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mt-16" data-contact-reveal>
          <h2 className="max-w-md text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl" id={titleId}>
            {copy.title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-white/62" id={descriptionId}>
            {copy.description}
          </p>
        </div>

        <form className="mt-12 space-y-8" data-contact-reveal onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-white/70">{copy.name}</span>
            <input
              className="mt-3 w-full border-0 border-b border-white/18 bg-transparent px-0 pb-3 text-base text-white outline-none transition placeholder:text-white/26 focus:border-system-accent-cyan"
              name="name"
              placeholder={copy.namePlaceholder}
              ref={firstInputRef}
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white/70">{copy.email}</span>
            <input
              className="mt-3 w-full border-0 border-b border-white/18 bg-transparent px-0 pb-3 text-base text-white outline-none transition placeholder:text-white/26 focus:border-system-accent-cyan"
              name="email"
              placeholder={copy.emailPlaceholder}
              required
              type="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white/70">{copy.message}</span>
            <textarea
              className="mt-3 min-h-32 w-full resize-none border-0 border-b border-white/18 bg-transparent px-0 pb-3 text-base leading-7 text-white outline-none transition placeholder:text-white/26 focus:border-system-accent-cyan"
              name="message"
              placeholder={copy.messagePlaceholder}
              required
            />
          </label>

          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#070A12] transition hover:bg-system-page disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-system-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#070A12]"
            data-motion-button
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? copy.submitting : copy.submit}
          </button>

          {isSubmitted ? (
            <div
              className="sr-only"
              role="status"
            >
              {copy.success}
            </div>
          ) : null}

          {errorMessage ? (
            <p className="rounded-2xl border border-red-300/28 bg-red-400/10 px-4 py-3 text-sm leading-6 text-white/76">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  const toast = successToast ? (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-[120] grid place-items-center bg-[radial-gradient(circle_at_50%_42%,rgba(31,107,255,0.16),transparent_34%),rgba(248,251,255,0.22)] px-5 backdrop-blur-[2px]"
      role="status"
    >
      <div
        className="pointer-events-auto relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-white/70 bg-[rgba(247,251,255,0.86)] p-7 text-center text-primary shadow-[0_34px_110px_rgba(31,107,255,0.18),0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
        ref={toastRef}
      >
        <span
          aria-hidden="true"
          className="absolute -left-12 -top-16 h-40 w-40 rounded-full bg-system-accent-cyan/18 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-20 -right-12 h-48 w-48 rounded-full bg-system-primary/16 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="relative mx-auto grid size-14 place-items-center rounded-full border border-white/70 bg-[linear-gradient(135deg,#38bdf8_0%,#1f6bff_58%,#7c4dff_100%)] text-2xl font-black text-white shadow-[0_18px_44px_rgba(31,107,255,0.28)]"
        >
          ✓
        </span>
        <h2 className="relative mt-6 text-2xl font-semibold leading-tight tracking-[-0.02em] text-system-text-primary">
          {copy.successTitle}
        </h2>
        <p className="relative mx-auto mt-3 max-w-sm text-sm leading-6 text-system-text-secondary">
          {successToast}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <>
      {createPortal(drawer, document.body)}
      {createPortal(toast, document.body)}
    </>
  );
}
