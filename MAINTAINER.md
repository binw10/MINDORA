# MINDORA Website Maintainer Guide

## Source of Truth

GitHub is the single source of truth for the MINDORA website.

Repository:

```text
https://github.com/binw10/MINDORA
```

Future code changes should be committed to GitHub first. The EC2 server should only pull reviewed code from GitHub and run the production build from that checked-out version.

## Production Server Model

```text
GitHub
  -> GitHub Actions over SSH
  -> AWS EC2
  -> /home/admin/mindora-website
  -> systemd service: mindora-website
  -> Apache reverse proxy
  -> Next.js on localhost:3000
```

## Maintainer Responsibilities

- Keep `main` deployable.
- Keep `.env.example` and `docs/environment.md` current.
- Keep deployment and recovery docs current after infrastructure changes.
- Rotate or remove secrets immediately if they are exposed.
- Do not edit production code directly on EC2 except emergency hotfixes.

## Standard Change Workflow

```bash
git checkout main
git pull origin main
npm ci
npm run check
git checkout -b <short-change-name>
# make changes
npm run check
git add <files>
git commit -m "Describe the change"
git push origin <branch>
```

Deploy only after review. See [`docs/release-guide.md`](docs/release-guide.md).

## Emergency Hotfix Workflow

Use only when production is broken and normal GitHub flow is too slow.

1. SSH into the server.
2. Record current state:

```bash
cd /home/admin/mindora-website
git status -sb
git rev-parse HEAD
```

3. Make the smallest possible fix.
4. Run validation:

```bash
npm run build
npm run healthcheck
```

5. Commit and push the hotfix back to GitHub immediately.
6. Open a follow-up maintenance issue or note describing what happened.

## Operational Commands

```bash
npm run healthcheck
npm run audit:production
npm run backup:production
```

See [`docs/operations.md`](docs/operations.md) for details.

## Secrets

Do not commit secrets. Production Supabase credentials are provided through server-side environment configuration. GitHub Actions deployment credentials are stored in GitHub Secrets.

Safe to commit:

- `.env.example`
- documentation naming required variables

Never commit:

- `.env` or `.env.*`
- SSH private keys
- Supabase service role keys
- AWS keys
