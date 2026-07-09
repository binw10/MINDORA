# Deployment Guide

This document describes the intended production deployment workflow for the MINDORA website.

The workflow file is generated at `.github/workflows/deploy.yml`, but it must not be treated as enabled until the maintainer explicitly approves deployment use and configures the required GitHub Secrets.

## Architecture

```text
Developer / Maintainer
  -> GitHub repository: binw10/MINDORA
  -> GitHub Actions manual workflow
  -> SSH using GitHub Secrets
  -> AWS EC2 Debian 12
  -> /home/admin/mindora-website
  -> npm build
  -> systemd service: mindora-website
  -> Apache reverse proxy
  -> public website
```

Production runtime:

- OS: Debian 12
- Project directory: `/home/admin/mindora-website`
- Process manager: systemd
- Service name: `mindora-website`
- Runtime command: `npm run start`
- Runtime port: `3000`
- Reverse proxy: Apache
- Health check default: `http://127.0.0.1/`

## Deployment Flow

The workflow is manual-only. It does not deploy on push.

When manually started, it performs these steps:

1. Check the safety switch: `DEPLOY_ENABLED` must equal `true`.
2. Check out the selected Git ref.
3. Set up Node.js from `.nvmrc`.
4. Install dependencies on the GitHub runner with `npm ci`.
5. Run preflight validation with `npm run check`.
6. Resolve the exact commit SHA to deploy.
7. Connect to EC2 over SSH.
8. Acquire a server-side deployment lock with `flock`.
9. Refuse deployment if the server working tree is dirty.
10. Record the current server commit for rollback.
11. Optionally create a pre-deployment source backup.
12. Fetch `origin/main` and verify the target commit exists on the server.
13. Reset the server working tree to the target commit.
14. Install dependencies only when required:
    - `node_modules` is missing, or
    - `package-lock.json` changed, or
    - `clean_install` input is `true`.
15. Build with `npm run build`.
16. Restart `mindora-website` through systemd.
17. Verify the service is active.
18. Verify the health check URL returns HTTP 200.

## Required GitHub Secrets

Create these in GitHub:

`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

| Secret | Required | Example | Purpose |
| --- | --- | --- | --- |
| `DEPLOY_ENABLED` | Yes | `false` before first approved deployment; `true` when deploying | Safety switch. Any value other than `true` blocks deployment before SSH. |
| `EC2_HOST` | Yes | `<server-ip-or-hostname>` | EC2 host for SSH. |
| `EC2_USER` | Yes | `admin` | SSH user. |
| `EC2_SSH_KEY` | Yes | private key contents | Private key allowed to SSH into the server. Never commit this. |
| `EC2_PORT` | No | `22` | SSH port. Defaults to `22`. |
| `APP_DIR` | No | `/home/admin/mindora-website` | Project directory. |
| `BACKUP_DIR` | No | `/home/admin/backups` | Backup directory used before deployment. |
| `SERVICE_NAME` | No | `mindora-website` | systemd service name. |
| `HEALTHCHECK_URL` | No | `http://127.0.0.1/` | URL checked after restart. |

## SSH Security

- Use GitHub Secrets for the private key.
- Do not paste private keys into source files, docs, tickets, or chat.
- Prefer a dedicated deploy key/user if the server is later hardened.
- The workflow refuses deployment if another deployment lock is active.
- The workflow refuses deployment if the server working tree has uncommitted changes.

## Build Strategy

The workflow builds twice in two different roles:

1. GitHub runner preflight: `npm run check` validates lint, typecheck, and production build before SSH.
2. EC2 production build: `npm run build` creates the build artifact on the server where the app runs.

Dependencies on EC2 are installed only when required unless `clean_install` is set to `true`.

## Restart Strategy

The workflow restarts only the application service:

```bash
sudo systemctl restart mindora-website
```

It does not restart Apache or the server.

After restart, it checks:

```bash
sudo systemctl is-active --quiet mindora-website
curl -fsS -o /dev/null -w '%{http_code}' http://127.0.0.1/
```

The health check retries up to five times.

## Rollback Process

If deployment fails after recording the previous commit, the workflow automatically attempts rollback:

1. Reset `/home/admin/mindora-website` to the previous commit.
2. Run `npm ci` or `npm install` if no lockfile exists.
3. Rebuild with `npm run build`.
4. Restart the systemd service.
5. Verify the service is active.
6. Verify the health check URL returns HTTP 200.

Manual rollback, if needed:

```bash
cd /home/admin/mindora-website
git log --oneline -10
git reset --hard <known-good-sha>
npm ci
npm run build
sudo systemctl restart mindora-website
npm run healthcheck
```

Manual rollback is production-impacting and should be approved before execution unless it is part of an active incident response.

## Timeout Settings

- GitHub job timeout: 35 minutes
- SSH command timeout: 28 minutes
- Health check curl timeout: 15 seconds per attempt
- Health check retries: 5 attempts

## Troubleshooting

### Deployment blocked immediately

Check `DEPLOY_ENABLED`. It must be exactly this value before a real deployment:

```text
true
```

### SSH connection fails

Check:

- `EC2_HOST`
- `EC2_USER`
- `EC2_PORT`
- `EC2_SSH_KEY`
- EC2 security group allows SSH from GitHub-hosted runner IP ranges or the chosen runner environment

### Server working tree is dirty

The workflow refuses to deploy over uncommitted production edits.

On the server:

```bash
cd /home/admin/mindora-website
git status -sb
```

Commit or safely revert the manual changes before deploying.

### Build fails on GitHub runner

Run locally:

```bash
npm ci
npm run check
```

Fix lint, typecheck, or build errors before deployment.

### Build fails on EC2

Inspect server logs and environment:

```bash
cd /home/admin/mindora-website
node --version
npm --version
npm run build
```

### Service restart fails

```bash
sudo systemctl status mindora-website --no-pager
journalctl -u mindora-website -n 100 --no-pager
```

### Health check fails

Check Apache and local app endpoints:

```bash
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1/
sudo apache2ctl configtest
sudo systemctl status apache2 --no-pager
```

## What Happens After This Workflow Is Enabled

After approval, if this workflow exists on GitHub and required Secrets are configured:

1. It will appear in the GitHub Actions tab as `Deploy MINDORA Website`.
2. It will not run automatically when code is pushed.
3. A maintainer can manually start it.
4. If `DEPLOY_ENABLED` is not `true`, it exits before SSH.
5. If `DEPLOY_ENABLED=true`, it validates the selected commit, connects to EC2, builds on the server, restarts only the Next.js systemd service, verifies HTTP 200, and reports success.
6. If build, restart, or health check fails, it attempts rollback to the previous server commit.

## Disable Deployment

Use either option:

1. Set `DEPLOY_ENABLED` to `false` or remove the Secret.
2. Remove or rename `.github/workflows/deploy.yml` in a reviewed commit.

Because the workflow is manual-only, disabling the safety switch is usually enough. Keep `DEPLOY_ENABLED=false` whenever production deployment is not actively approved.

## First Deployment Validation

The first production deployment should use a documentation-only commit to verify the full GitHub Actions, SSH, build, restart, health check, and rollback safety path before shipping application changes.

## Warning Cleanup Validation

A follow-up documentation-only deployment validates that the deployment workflow runs without GitHub Actions runtime or unsupported input warnings after action version updates.

## Warning-Free Deployment Validation

A second documentation-only deployment validates the workflow after approving dependency install scripts and upgrading action versions.
