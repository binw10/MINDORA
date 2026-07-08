# AGENTS.md

Permanent operating instructions for AI coding agents working on the MINDORA website repository.

This project is a production website. Treat every change as production-impacting unless proven otherwise. Preserve business functionality, protect secrets, keep GitHub as the source of truth, and verify before claiming success.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repository uses a modern Next.js version. APIs, conventions, and file structure may differ from your training data. Before changing framework behavior, check the installed package/docs in the repository and prefer existing patterns over assumptions.
<!-- END:nextjs-agent-rules -->

## 1. Project Overview

MINDORA is the corporate website for MINDORA SDN. BHD.

Production architecture:

```text
GitHub
  -> guarded GitHub Actions deployment over SSH
  -> AWS EC2
  -> /home/admin/mindora-website
  -> systemd service: mindora-website
  -> Apache reverse proxy
  -> Next.js on localhost:3000
  -> Supabase REST API for contact form submissions
```

The site is static-first. The only dynamic application path is the contact form API route.

Primary documentation:

- `README.md` - repository overview and common commands
- `MAINTAINER.md` - maintainer workflow and emergency policy
- `docs/architecture.md` - application and infrastructure architecture
- `docs/directory-structure.md` - directory map
- `docs/environment.md` - environment variables and secret policy
- `docs/operations.md` - operations commands
- `docs/release-guide.md` - release and rollback process
- `docs/disaster-recovery.md` - incident recovery steps
- `docs/github-actions-deployment-guide.md` - deployment workflow setup

## 2. Technology Stack

Use the stack already in the repository. Do not introduce new frameworks, package managers, CMSs, databases, animation libraries, or infrastructure tools without explicit user approval.

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Motion: GSAP
- Runtime: Node.js 24
- Package manager: npm 11
- Deployment: GitHub Actions -> SSH -> EC2 -> systemd -> Apache -> Next.js
- Contact form backend: Supabase REST API

Repository metadata:

- `.nvmrc` and `.node-version` specify Node 24.
- `package.json` specifies npm 11 and engine constraints.
- Use `npm ci` for reproducible installs.

## 3. Directory Map

```text
app/                  Next.js App Router pages and API routes
components/layout/    Header, footer, container, language switcher, skip link
components/system/    Homepage/system page sections, contact drawer, visual system components
components/sections/  Secondary page and legal page shells
components/ui/        Small shared UI primitives
lib/contact/          Contact form validation and Supabase persistence
lib/i18n/             Locale provider, dictionaries, supported locales
lib/motion/           Central GSAP motion helpers
public/images/        Static image assets
scripts/              Health, backup, deploy, audit, preflight helpers
docs/                 Architecture, operations, release, recovery, environment docs
.github/workflows/    Guarded GitHub Actions deployment workflow
```

## 4. Production Safety Rules

These rules are mandatory.

- Never interrupt the running production website unless the user explicitly approves the operation.
- Never restart `mindora-website`, Apache, or the server unless the user explicitly approves, except during an approved deployment or emergency recovery.
- Never run destructive commands such as `rm -rf`, `git reset --hard`, `git clean`, database deletes, schema drops, or force pushes without explicit approval.
- Never overwrite remote history without explicit approval.
- Never expose, print, commit, or summarize secret values.
- Never edit production code directly on EC2 except for an approved emergency hotfix.
- Never change business copy, visual behavior, frontend interactions, or backend behavior during infrastructure-only tasks.
- Never add new external services or dependencies without explicit approval.
- Always verify service health after production-adjacent changes.
- Always explain risk and rollback before making dangerous or production-impacting changes.

If a user asks for a broad change, identify whether it affects production, deployment, secrets, database, or business behavior before acting.

## 5. Operations That Require Explicit Approval First

Ask before performing any of the following:

- Deploying to production
- Restarting or reloading system services
- Changing Apache or systemd configuration
- Changing firewall, SSH, DNS, TLS, or domain configuration
- Running a database migration or modifying Supabase schema/policies
- Deleting records or files
- Rotating or changing secrets
- Installing or removing server packages
- Adding runtime dependencies
- Running `git reset --hard`, `git clean`, force push, or history rewrite
- Changing GitHub Actions deployment behavior from manual to automatic

Approval must be specific to the risky action. A general request to "improve the project" is not approval to deploy, restart, delete, or migrate.

## 6. Git Workflow

GitHub is the source of truth.

Standard workflow:

```bash
git checkout main
git pull origin main
npm ci
git checkout -b <short-change-name>
# make changes
npm run check
git add <files>
git commit -m "Describe the change"
git push origin <branch>
```

For this production repository, keep commits small and logical:

- One commit for repo metadata or scripts
- One commit for docs
- One commit for frontend UI behavior
- One commit for backend/API behavior
- One commit for deployment configuration

Do not mix unrelated visual, backend, infrastructure, and documentation changes in one commit.

## 7. Branch Strategy

- `main` must remain deployable.
- Use short feature branches for normal work.
- Use direct commits to `main` only when the user explicitly asks and risk is low.
- Use emergency hotfixes only when production is broken and normal review is too slow.
- If a hotfix is made on EC2, commit it and push it back to GitHub immediately after stabilization.

Recommended branch names:

```text
docs/agent-guide
infra/healthcheck-script
frontend/contact-drawer-fix
backend/contact-validation
hotfix/production-healthcheck
```

## 8. Commit Rules

Write concise imperative commit messages:

```text
Add production health check script
Document release rollback process
Fix contact form validation error handling
Update homepage card layout
```

Before committing:

- Run the relevant checks.
- Inspect `git diff`.
- Confirm no secrets, generated build output, or local files are included.
- Confirm the commit contains only related changes.

Never commit:

- `.env` or `.env.*`
- SSH keys or certificates
- Supabase service role keys
- `.next/`, `node_modules/`, logs, or local editor files

## 9. Pull Request Rules

When writing a pull request, include:

- Summary of what changed
- Why the change is needed
- Risk level
- Rollback method
- Test evidence with exact commands
- Screenshots only for UI changes
- Deployment notes, if deployment is needed

PR checklist:

```text
- [ ] No secrets committed
- [ ] No generated build output committed
- [ ] npm run lint passes
- [ ] npm run typecheck passes
- [ ] npm run build passes
- [ ] Docs updated if operations, deployment, env vars, or architecture changed
- [ ] Rollback path documented
```

## 10. Coding Conventions

General:

- Follow existing file organization and naming.
- Use TypeScript.
- Prefer small, focused components and helpers.
- Keep code readable; add comments only where they explain non-obvious logic.
- Use ASCII unless the target content already requires another language or character set.
- Do not introduce new abstractions unless they remove real complexity.

React/Next.js:

- Use App Router conventions under `app/`.
- Keep page files as composition entry points when possible.
- Put reusable UI in `components/`.
- Keep server-only logic out of client components.
- Use `next.config.ts` for framework-level configuration only.
- Do not rely on stale framework knowledge. Check the installed package and existing code first.

Styling:

- Use Tailwind CSS and existing design tokens/classes.
- Keep responsive behavior intact.
- Do not introduce a third-party UI library without approval.
- Avoid broad CSS rewrites unless the task explicitly calls for them.

Motion:

- GSAP is the approved motion library.
- Centralize reusable motion behavior in `lib/motion/gsapMotionSystem.ts`.
- Animate transform and opacity where possible.
- Avoid layout-shifting animation properties such as width, height, top, and left.
- Respect reduced-motion and avoid excessive decorative animation.

Internationalization:

- Locale logic lives in `lib/i18n/`.
- When changing user-facing copy, update every supported locale.
- Do not leave one language stale or partially translated.

## 11. How To Modify Frontend

Frontend changes normally touch:

- `app/*/page.tsx`
- `components/layout/*`
- `components/system/*`
- `components/sections/*`
- `components/ui/*`
- `app/globals.css`
- `lib/i18n/*`

Before changing frontend:

1. Identify the exact route and component responsible.
2. Check existing component patterns.
3. Keep the scope narrow.
4. Preserve accessibility, responsive layout, and language switching.
5. Preserve existing motion unless the user explicitly asks to change it.

After changing frontend:

```bash
npm run lint
npm run typecheck
npm run build
```

For visual changes, also inspect the page in a browser at desktop and mobile widths before reporting completion.

## 12. How To Modify Backend

Backend logic is intentionally small.

Current backend surface:

- `app/api/contact/route.ts`
- `lib/contact/validation.ts`
- `lib/contact/supabase.ts`

Rules:

- Keep validation strict and explicit.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Do not move service-role operations into client components.
- Do not log request bodies, secrets, or personally sensitive contact details.
- Return stable JSON responses.
- Update `docs/environment.md` if environment needs change.

After backend changes:

```bash
npm run lint
npm run typecheck
npm run build
```

If behavior changes, add or describe a manual API verification plan.

## 13. How To Modify Database

The contact form stores submissions in Supabase. Database changes are production-sensitive.

Do not modify database schema, RLS policies, tables, indexes, or stored procedures without explicit user approval.

Before any database change:

1. Explain why the change is needed.
2. Provide exact SQL.
3. Explain risk.
4. Explain rollback SQL or recovery path.
5. Confirm whether existing data is affected.
6. Wait for explicit approval.

Documentation to update:

- `docs/supabase-contact-submissions.sql`
- `docs/environment.md`
- `docs/architecture.md`
- `docs/disaster-recovery.md` when recovery steps change

Never run destructive SQL against production unless the user explicitly approves the exact destructive operation.

## 14. Environment Variable Policy

Environment variable reference lives in `docs/environment.md`.

Rules:

- Never commit real secrets.
- Never print secret values in logs, responses, documentation, or screenshots.
- `.env.example` may contain names and placeholder values only.
- Production secrets live outside Git, typically in server-side systemd environment configuration or an approved secret manager.
- GitHub deployment secrets live in GitHub Secrets.

Current application variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PORT`
- `NODE_ENV`

If adding or changing variables:

1. Update `.env.example` with placeholders.
2. Update `docs/environment.md`.
3. Explain production configuration requirements.
4. Do not deploy until production secrets are configured.

## 15. Testing and Verification

Use the smallest verification set that proves the change.

Standard full check:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

Shortcut for already-installed dependencies:

```bash
npm run check
```

Script checks:

```bash
bash -n scripts/*.sh
```

Production health check, only on the server or an environment with the expected local services:

```bash
npm run healthcheck
```

Before claiming success, report the exact commands run and their results. Do not say a change is complete if verification was skipped.

## 16. Deployment Workflow

Preferred deployment path:

```text
GitHub Actions manual workflow
  -> SSH to EC2
  -> fetch/reset selected commit
  -> install dependencies only when required
  -> npm run build
  -> restart systemd service
  -> verify HTTP 200
  -> rollback automatically on failure
```

Deployment workflow file:

- `.github/workflows/deploy.yml`

Deployment guide:

- `docs/github-actions-deployment-guide.md`

Important:

- The workflow is manual-only.
- It must remain guarded by `DEPLOY_ENABLED=true`.
- Do not change it to deploy automatically on push without explicit approval.
- Do not deploy until tests pass and the user approves deployment.

## 17. Safe Deployment Procedure

Before deployment:

1. Confirm GitHub `main` contains the intended commit.
2. Confirm no unrelated files are included.
3. Run:

```bash
npm run check
```

4. Explain deployment risk and rollback path.
5. Confirm GitHub Secrets are configured if this is the first deployment.
6. Ask for explicit approval to deploy.

During deployment:

- Use GitHub Actions unless instructed otherwise.
- Watch the workflow logs.
- Do not interrupt the workflow unless it is clearly unsafe.

After deployment:

- Verify systemd service is active.
- Verify HTTP 200 from the health check URL.
- Manually inspect key public pages if frontend changed.
- Report deployed commit SHA.

## 18. Rollback

Automatic rollback is built into `.github/workflows/deploy.yml`.

Manual rollback on EC2:

```bash
cd /home/admin/mindora-website
git log --oneline -10
git reset --hard <known-good-sha>
npm ci
npm run build
sudo systemctl restart mindora-website
npm run healthcheck
```

Manual rollback is production-impacting. Explain the target commit, risk, and expected result before running it, then ask for approval.

If rollback follows an incident, update `docs/disaster-recovery.md` if the recovery steps changed.

## 19. Production Infrastructure Changes

Infrastructure includes:

- systemd service files
- Apache vhosts and modules
- firewall rules
- SSH configuration
- DNS and TLS
- GitHub Actions deployment logic
- server packages

For infrastructure changes:

1. Inspect current configuration first.
2. Back up the file before editing.
3. Explain why the change is needed.
4. Explain risk and rollback.
5. Validate syntax before reload/restart.
6. Prefer reload over restart when safe.
7. Verify service health after the change.

Do not bundle infrastructure changes with frontend or backend feature work.

## 20. Backup Rules

Before risky server maintenance, create a backup:

```bash
npm run backup:production
```

The backup script excludes secrets, `.git`, `.next`, and `node_modules`.

For Apache or systemd config edits, create a direct timestamped copy of the specific config file before editing.

## 21. Documentation Rules

Update documentation whenever behavior, operations, deployment, environment variables, architecture, or recovery steps change.

Relevant docs:

- `README.md`
- `MAINTAINER.md`
- `CONTRIBUTING.md`
- `docs/architecture.md`
- `docs/directory-structure.md`
- `docs/environment.md`
- `docs/operations.md`
- `docs/release-guide.md`
- `docs/disaster-recovery.md`
- `docs/github-actions-deployment-guide.md`

Keep documentation factual. Do not document planned behavior as if it already exists.

## 22. Rules For Never Breaking Production

- Prefer additive changes over rewrites.
- Keep changes small and reversible.
- Verify locally before production.
- Do not deploy uncommitted work.
- Do not deploy from a dirty Git worktree.
- Do not deploy with failing lint, typecheck, or build.
- Do not change secrets and code in the same unreviewed step.
- Do not change deployment automation and deploy with it in the same risky step unless explicitly approved.
- Do not bypass GitHub as the source of truth except during emergency recovery.
- If uncertain, stop and ask.

## 23. Agent Response Expectations

When working in this repository:

- Start by identifying the task type: frontend, backend, database, infrastructure, documentation, or deployment.
- Read relevant files before editing.
- Explain each production-impacting change before making it.
- Use exact file paths and commands in summaries.
- Report verification evidence.
- Be explicit about anything not tested.
- Keep final summaries concise but complete.

For review tasks, lead with findings and file references. For implementation tasks, make the change, verify it, and summarize the result.

## 24. Quick Command Reference

```bash
nvm use
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run check
npm run healthcheck
npm run audit:production
npm run backup:production
```

Server status commands:

```bash
systemctl status mindora-website --no-pager
journalctl -u mindora-website -n 100 --no-pager
sudo apache2ctl configtest
curl -I http://127.0.0.1/
```

Use these commands carefully. Anything involving `sudo`, service restarts, rollback, deployment, or production configuration requires explicit approval unless the user has already approved that exact action.
