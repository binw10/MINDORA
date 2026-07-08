# MINDORA Website Maintainer Guide

## Source of Truth

GitHub is the single source of truth for the MINDORA website codebase.

Repository:

```text
https://github.com/binw10/MINDORA
```

Future code changes should always be committed to GitHub first. The EC2 server should only pull reviewed code from GitHub and run the production build from that checked-out version.

## Production Server

Current production directory:

```text
/home/admin/mindora-website
```

Current runtime process manager:

```text
systemd service: mindora-website
```

Current reverse proxy:

```text
Apache reverse proxy -> http://127.0.0.1:3000
```

## Recommended Development Workflow

1. Make code changes locally or in a development environment.
2. Run checks before publishing:

```bash
npm run lint
npm run build
```

3. Commit changes to Git.
4. Push changes to GitHub.
5. Deploy to EC2 by pulling from GitHub on the server.
6. Install dependencies only from `package-lock.json`:

```bash
npm ci
```

7. Build the production application:

```bash
npm run build
```

8. Restart the systemd service:

```bash
sudo systemctl restart mindora-website
```

9. Verify the public website and key routes.

## Server Change Policy

Avoid making manual code changes directly on the EC2 server. Direct server edits make GitHub drift from production and make future deployments risky.

Manual server edits are only acceptable for emergency hotfixes. If an emergency hotfix is made directly on the server, commit and push that change back to GitHub as soon as possible.

## Secrets and Environment Variables

Do not commit secrets to GitHub.

Production secrets are managed outside the repository through systemd environment configuration. The Supabase service role key must remain outside Git and should never be placed in `.env`, source files, documentation, or commits.

Safe files to commit include `.env.example` because it documents required variables without containing secret values.

## Deployment Notes

The application uses:

```bash
npm run build
npm run start
```

The production service runs from:

```text
/home/admin/mindora-website
```

The expected runtime port is:

```text
3000
```

Apache handles public HTTP traffic and proxies requests to the local Next.js process.
