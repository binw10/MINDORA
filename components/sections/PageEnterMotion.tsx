"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type PageEnterMotionProps = {
  children: ReactNode;
  motionKey: string;
};

export function PageEnterMotion({ children, motionKey }: PageEnterMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return undefined;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const content = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-page-enter-item]"),
      );

      if (reduceMotion) {
        gsap.set([root, ...content], { opacity: 1, clearProps: "transform,willChange" });
        return undefined;
      }

      gsap.set([root, ...content], { willChange: "transform, opacity" });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
          overwrite: "auto",
        },
        onComplete: () => {
          gsap.set([root, ...content], { clearProps: "willChange" });
        },
      });

      timeline
        .fromTo(root, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.52 })
        .fromTo(
          content,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.68, stagger: 0.07 },
          0.12,
        );

      return () => {
        timeline.kill();
      };
    },
    { dependencies: [motionKey], scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
