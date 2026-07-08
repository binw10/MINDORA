import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const motion = {
  duration: {
    fast: 0.4,
    medium: 0.8,
    slow: 1.2,
  },
  ease: {
    standard: "power3.out",
    soft: "power2.out",
    bounce: "elastic.out(1,0.5)",
  },
  scroll: {
    start: "top 80%",
    end: "top 30%",
    toggleActions: "play none none none",
  },
  stagger: {
    standard: 0.05,
    grid: 0.06,
  },
} as const;

type MotionRoot = Element | Document;

const cardSelector =
  "[data-motion-card]:not([data-stack-card]):not([data-system-card]):not([data-motion-no-global])";

export function registerMotionPlugins() {
  gsap.registerPlugin(ScrollTrigger);
}

function scopedArray<T extends Element>(root: MotionRoot, selector: string) {
  return gsap.utils.toArray<T>(root.querySelectorAll<T>(selector));
}

function setLayerHint(nodes: Element[]) {
  if (!nodes.length) {
    return;
  }

  gsap.set(nodes, { willChange: "transform, opacity" });
}

function clearLayerHint(targets: gsap.TweenTarget) {
  gsap.set(targets, { clearProps: "willChange" });
}

function revealFrom(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      duration: motion.duration.medium,
      ease: motion.ease.standard,
      overwrite: "auto",
      y: 0,
      ...vars,
    },
  );
}

function revealOnScroll(
  targets: HTMLElement[],
  trigger: HTMLElement,
  index: number,
  vars: gsap.TweenVars = {},
) {
  return ScrollTrigger.create({
    trigger,
    start: motion.scroll.start,
    end: motion.scroll.end,
    toggleActions: motion.scroll.toggleActions,
    once: true,
    refreshPriority: index,
    onEnter: () => {
      setLayerHint(targets);
      revealFrom(targets, {
        onComplete: () => clearLayerHint(targets),
        ...vars,
      });
    },
  });
}

export function createHeroAnimation(root: MotionRoot = document) {
  const hero = root.querySelector<HTMLElement>("[data-motion-hero]");

  if (!hero) {
    return undefined;
  }

  const title = gsap.utils.toArray<HTMLElement>(
    hero.querySelectorAll("[data-motion-hero-title]"),
  );
  const subtitle = gsap.utils.toArray<HTMLElement>(
    hero.querySelectorAll("[data-motion-hero-subtitle]"),
  );
  const actions = gsap.utils.toArray<HTMLElement>(
    hero.querySelectorAll("[data-motion-hero-actions]"),
  );
  const support = gsap.utils.toArray<HTMLElement>(
    hero.querySelectorAll("[data-motion-hero-support]"),
  );

  setLayerHint([hero, ...title, ...subtitle, ...actions, ...support]);

  const timeline = gsap.timeline({
    defaults: {
      duration: 0.6,
      ease: motion.ease.standard,
      overwrite: "auto",
    },
    onComplete: () => clearLayerHint([hero, ...title, ...subtitle, ...actions, ...support]),
  });

  timeline
    .from(hero, {
      opacity: 0,
      scale: 1.01,
    })
    .from(title, { opacity: 0, y: 12 }, 0.08)
    .from(subtitle, { opacity: 0, y: 12 }, 0.18)
    .from(actions, { opacity: 0, scale: 0.98 }, 0.28)
    .from(support, { opacity: 0, y: 16 }, 0.34);

  return timeline;
}

export function createHeroBackgroundDrift(root: MotionRoot = document) {
  const image = root.querySelector<HTMLElement>("[data-motion-bg-drift]");
  const light = root.querySelector<HTMLElement>("[data-motion-light-drift]");

  if (!image && !light) {
    return undefined;
  }

  const timeline = gsap.timeline();

  if (image) {
    timeline.fromTo(
      image,
      { scale: 1.005, xPercent: -0.12 },
      {
        scale: 1.012,
        xPercent: 0.14,
        duration: 34,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
      0,
    );
  }

  if (light) {
    timeline.fromTo(
      light,
      { opacity: 0.12, xPercent: -12 },
      {
        opacity: 0.16,
        xPercent: 12,
        duration: 20,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
      0,
    );
  }

  return timeline;
}

export function createHeroTitlePulse(root: MotionRoot = document) {
  const title = root.querySelector<HTMLElement>("[data-motion-hero-title]");

  if (!title) {
    return undefined;
  }

  gsap.set(title, { willChange: "opacity, transform" });

  return gsap.to(title, {
    duration: 3.6,
    ease: "sine.inOut",
    repeat: -1,
    scale: 0.994,
    textShadow: "0 0 34px rgba(125,211,252,0.22)",
    yoyo: true,
  });
}

export function createHeroScrollFade(root: MotionRoot = document) {
  const hero = root.querySelector<HTMLElement>("[data-motion-hero]");
  const content = root.querySelector<HTMLElement>("[data-motion-hero-content]");

  if (!hero || !content) {
    return undefined;
  }

  gsap.set(content, { willChange: "opacity, transform" });

  return gsap.to(content, {
    ease: "none",
    opacity: 0,
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "60% top",
      scrub: 0.65,
    },
    y: -56,
  });
}

export function createScrollReveal(root: MotionRoot = document) {
  const sections = scopedArray<HTMLElement>(
    root,
    "[data-motion-section]:not([data-motion-no-global])",
  ).filter(
    (section) =>
      !section.querySelector("[data-motion-hero]") &&
      !section.querySelector("[data-motion-grid]"),
  );

  return sections.map((section, index) => {
    return revealOnScroll([section], section, index);
  });
}

export function createHeadingReveal(root: MotionRoot = document) {
  const headings = scopedArray<HTMLElement>(
    root,
    "[data-motion-heading], section h1, section h2",
  ).filter(
    (heading) =>
      !heading.matches("[data-motion-hero-title]") &&
      !heading.closest("[data-stack-card]") &&
      !heading.closest("[data-system-card]") &&
      !heading.closest("[data-motion-section]"),
  );

  return headings.map((heading, index) => {
    return revealOnScroll([heading], heading, index, { duration: 0.72 });
  });
}

export function createStaggerGrid(root: MotionRoot = document) {
  const grids = scopedArray<HTMLElement>(
    root,
    "[data-motion-grid]:not([data-motion-no-global])",
  );

  return grids.map((grid, index) => {
    const items = scopedArray<HTMLElement>(
      grid,
      "[data-motion-grid-item]:not([data-stack-card]):not([data-system-card]):not([data-motion-no-global])",
    );

    if (!items.length) {
      return undefined;
    }

    return revealOnScroll(items, grid, index, { stagger: motion.stagger.standard });
  });
}

export function createImageParallax(root: MotionRoot = document) {
  const media = scopedArray<HTMLElement>(
    root,
    "[data-motion-media]:not([data-motion-no-global])",
  );

  return media.map((item) =>
    gsap.set(item, {
      clearProps: "transform,willChange",
      opacity: 1,
    }),
  );
}

export function createCardMotion(root: MotionRoot = document) {
  const cards = scopedArray<HTMLElement>(root, cardSelector);
  const revealCards = cards.filter((card) => !card.matches("[data-motion-grid-item]"));

  const revealTweens = revealCards.map((card, index) => {
    return revealOnScroll([card], card, index, { duration: 0.78 });
  });

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!finePointer) {
    return () => {
      revealTweens.forEach((tween) => tween.kill());
    };
  }

  const cleanups = cards.map((card) => {
    const scaleTo = gsap.quickTo(card, "scale", {
      duration: 0.25,
      ease: motion.ease.soft,
    });
    const yTo = gsap.quickTo(card, "y", {
      duration: 0.25,
      ease: motion.ease.soft,
    });

    const enter = () => {
      gsap.set(card, {
        willChange: "transform",
      });
      scaleTo(1.012);
      yTo(-2);
    };

    const leave = () => {
      gsap.to(card, {
        duration: 0.25,
        ease: motion.ease.standard,
        overwrite: "auto",
        scale: 1,
        y: 0,
        onComplete: () => clearLayerHint(card),
      });
    };

    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusout", leave);

    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusout", leave);
      gsap.killTweensOf(card);
    };
  });

  return () => {
    revealTweens.forEach((tween) => tween.kill());
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function createButtonInteractions(root: MotionRoot = document) {
  const buttons = scopedArray<HTMLElement>(
    root,
    "a[data-motion-button], button[data-motion-button]",
  );

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cleanups = buttons.map((button) => {
    const scaleTo = gsap.quickTo(button, "scale", {
      duration: 0.18,
      ease: motion.ease.soft,
    });

    const enter = () => {
      if (finePointer) {
        gsap.set(button, { willChange: "transform" });
        scaleTo(1.015);
      }
    };
    const leave = () => {
      scaleTo(1);
      clearLayerHint(button);
    };
    const down = () => scaleTo(0.985);
    const up = () => scaleTo(finePointer ? 1.015 : 1);

    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("blur", leave);

    return () => {
      button.removeEventListener("pointerenter", enter);
      button.removeEventListener("pointerleave", leave);
      button.removeEventListener("pointerdown", down);
      button.removeEventListener("pointerup", up);
      button.removeEventListener("blur", leave);
      gsap.killTweensOf(button);
    };
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function initializeMotionSystem(root: MotionRoot = document) {
  registerMotionPlugins();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    gsap.set(
      root.querySelectorAll(
        "[data-motion-section], [data-motion-grid-item], [data-motion-card], [data-motion-media], [data-motion-hero], [data-motion-hero-title], [data-motion-hero-subtitle], [data-motion-hero-actions], [data-motion-hero-support]",
      ),
      {
        opacity: 1,
        clearProps: "transform,opacity,visibility,willChange",
      },
    );
    return () => undefined;
  }

  let cardCleanup: () => void = () => undefined;
  let buttonCleanup: () => void = () => undefined;

  const context = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        if (ctx.conditions?.reduceMotion) {
          return undefined;
        }

        createHeroAnimation(root);
        createHeroBackgroundDrift(root);
        createHeroTitlePulse(root);
        createHeroScrollFade(root);
        createScrollReveal(root);
        createHeadingReveal(root);
        createStaggerGrid(root);
        if (ctx.conditions?.isDesktop) {
          createImageParallax(root);
        }
        cardCleanup = createCardMotion(root);
        buttonCleanup = createButtonInteractions(root);

        return () => {
          cardCleanup();
          buttonCleanup();
        };
      },
    );

    return () => mm.revert();
  }, root);

  return () => {
    cardCleanup();
    buttonCleanup();
    context.revert();
  };
}
