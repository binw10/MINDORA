"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { initializeMotionSystem, registerMotionPlugins } from "@/lib/motion/gsapMotionSystem";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

registerMotionPlugins();

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  const { locale } = useLanguage();
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current) {
      return undefined;
    }

    return initializeMotionSystem(scope.current);
  }, [locale]);

  return <div ref={scope}>{children}</div>;
}
