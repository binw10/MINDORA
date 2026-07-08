# MINDORA Website

Production repository for the MINDORA SDN. BHD. corporate website.

The site is a static-first Next.js App Router application with a small server-side contact form endpoint backed by Supabase. Production runs on AWS EC2 behind Apache and systemd.

## Stack

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Motion: GSAP
- Runtime: Node.js 24, npm 11
- Deployment: GitHub -> EC2 -> systemd -> Apache reverse proxy -> Next.js
- Contact form storage: Supabase REST API

## Repository Layout

```text
app/                  Next.js App Router pages and API routes
components/           React UI, layout, section, and system components
lib/                  Contact form, i18n, and motion support code
public/               Static assets served by Next.js
scripts/              Maintenance, backup, health check, and deploy helpers
docs/                 Architecture, deployment, release, recovery, and operations docs
styles/               Styling notes and future style organization
.github/workflows/    GitHub Actions workflows
```

See [`docs/directory-structure.md`](docs/directory-structure.md) for more detail.

## Local Development

Use Node.js 24 and npm 11.

```bash
nvm use
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

The contact form requires Supabase credentials in environments that need real submissions.

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

See [`docs/environment.md`](docs/environment.md). Never commit real secrets.

## Common Commands

```bash
npm run dev              # Start local development server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checks
npm run build            # Build production app
npm run check            # Lint, typecheck, and build
npm run healthcheck      # Check local app and reverse proxy endpoints
npm run preflight        # CI-style local validation
```

Production-only helper scripts are documented in [`docs/operations.md`](docs/operations.md).

## Deployment

Production deployments are managed through GitHub Actions and SSH. The workflow is intentionally guarded:

- It only runs manually from GitHub Actions.
- It does not deploy unless `DEPLOY_ENABLED=true` is configured in GitHub Secrets.
- It records the previous server commit and attempts rollback if build, restart, or health checks fail.

Read [`docs/github-actions-deployment-guide.md`](docs/github-actions-deployment-guide.md) before enabling or running deployment.

## Maintenance Model

GitHub is the source of truth. Avoid manual code edits directly on EC2 except emergency hotfixes, and reconcile any emergency change back into Git immediately.

Key documents:

- [`MAINTAINER.md`](MAINTAINER.md)
- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`docs/release-guide.md`](docs/release-guide.md)
- [`docs/disaster-recovery.md`](docs/disaster-recovery.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/operations.md`](docs/operations.md)
