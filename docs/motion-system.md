# MINDORA Motion System

## Principles

- Motion is information-driven and should clarify page hierarchy.
- Use only opacity and transform-based movement.
- Avoid decorative animation, parallax, 3D transforms, infinite loops, and scale effects.
- Respect `prefers-reduced-motion`.

## Tokens

- Page load duration: `0.6s`
- Scroll reveal duration: `0.6s`
- Hover duration: `0.2s`
- Hero reveal distance: `12px`
- Section reveal distance: `16px`
- Card hover distance: `-2px`
- Ease: `power2.out`
- Hover ease: `power1.out`
- Grid stagger: `0.09s`
- Scroll trigger start: `top 80%`

## Rules

- Hero title fades in and moves from `y: 12` to `0`.
- Hero subtitle starts at `100ms`.
- Hero actions start at `200ms`.
- Sections reveal once when entering the viewport at the 80% threshold.
- Structured grids reveal upward with a small stagger.
- Cards use only subtle vertical hover movement; shadow changes remain CSS-driven.
