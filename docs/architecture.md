# Architecture

## Overview

MINDORA is a corporate website built with Next.js App Router. The public pages are static-first. The only dynamic application path is the contact form API route, which stores submissions through Supabase REST.

```text
Browser
  -> Apache reverse proxy
  -> Next.js server on localhost:3000
  -> App Router pages and API routes
  -> Supabase REST API for contact submissions
```

## Runtime Components

### Next.js App Router

Routes live under `app/`.

- `/` renders the primary system-style homepage through `SystemPageContent`.
- `/system` renders the same primary product/system page.
- `/about`, `/solutions`, `/use-cases`, and `/advantages` render content pages from shared content structures.
- `/privacy-policy`, `/cookie-policy`, and `/terms-of-use` render legal content pages.
- `/api/contact` accepts contact form submissions.

### Components

- `components/layout/` contains site frame components: header, footer, container, skip link, language switcher.
- `components/system/` contains homepage/system page sections, CTA, contact drawer, motion provider, and cards.
- `components/sections/` contains reusable secondary page shells.
- `components/ui/` contains small shared UI primitives.

### Motion

Motion logic is centralized in `lib/motion/gsapMotionSystem.ts` and applied by React components. GSAP is used for page-level and component-level animation. Motion changes should preserve accessibility and avoid layout-shifting animation properties.

### Internationalization

Language state and dictionaries live in `lib/i18n/`.

The current language provider is client-side and controls rendered copy for supported locales. When adding copy, update every supported locale together.

### Contact Form

The contact form posts to `app/api/contact/route.ts`.

Validation is handled in `lib/contact/validation.ts`.

Supabase persistence is handled in `lib/contact/supabase.ts` with:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Production Infrastructure

```text
GitHub repository
  -> guarded GitHub Actions workflow
  -> SSH to EC2
  -> /home/admin/mindora-website
  -> npm run build
  -> sudo systemctl restart mindora-website
  -> Apache proxies public HTTP to 127.0.0.1:3000
```

## Build and Runtime

- Build command: `npm run build`
- Runtime command: `npm run start`
- Expected runtime port: `3000`
- Process manager: systemd
- Reverse proxy: Apache

## Design Constraints

- Do not introduce CMS, database migrations, or complex backend logic without an architecture update.
- Do not store secrets in Git.
- Keep visual/business changes separate from infrastructure changes.
- Keep animation centralized and avoid multiple competing scroll listeners.
