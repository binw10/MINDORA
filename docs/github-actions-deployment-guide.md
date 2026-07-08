# GitHub Actions Deployment Guide

This guide explains the production deployment workflow for the MINDORA website.

## Status

The workflow file is located at `.github/workflows/deploy.yml`.

It is intentionally not enabled for automatic push deployments. It can only run from GitHub's **Actions** tab through manual `workflow_dispatch`, and it will refuse to deploy unless the GitHub Secret `DEPLOY_ENABLED` is set to `true`.

## Required GitHub Secrets

Open the GitHub repository, then go to:

`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Create these secrets:

| Secret | Required | Example | Description |
| --- | --- | --- | --- |
| `DEPLOY_ENABLED` | Yes | `true` | Safety switch. Any value other than `true` disables deployment. |
| `EC2_HOST` | Yes | `<EC2_PUBLIC_IP>` | Public IP or hostname of the EC2 server. |
| `EC2_USER` | Yes | `admin` | SSH username on the server. |
| `EC2_SSH_KEY` | Yes | contents of the private key | Private SSH key that can log in to the EC2 server. Do not include a passphrase unless the workflow is adjusted for it. |
| `EC2_PORT` | No | `22` | SSH port. Defaults to `22` if omitted. |
| `APP_DIR` | No | `/home/admin/mindora-website` | Server project directory. Defaults to `/home/admin/mindora-website`. |
| `SERVICE_NAME` | No | `mindora-website` | systemd service name. Defaults to `mindora-website`. |
| `HEALTHCHECK_URL` | No | `http://127.0.0.1/` | URL checked after restart. Defaults to local Apache HTTP. |

## How Deployment Works

1. A maintainer manually starts the workflow from the GitHub Actions tab.
2. GitHub checks out the selected ref and resolves its commit SHA.
3. The workflow connects to the EC2 server over SSH.
4. On the server, the script records the currently running Git commit.
5. The script fetches `origin/main` and resets the server working tree to the selected commit.
6. Dependencies are installed only when needed:
   - `node_modules` is missing, or
   - `package-lock.json` changed, or
   - the manual `skip_build_cache` input is set to `true`.
7. The app is built with `npm run build`.
8. The `mindora-website` systemd service is restarted.
9. The workflow verifies the service is active and the healthcheck URL returns HTTP 200.

## Rollback Behavior

If any deployment step fails after the previous commit has been recorded, the script automatically attempts rollback:

1. Reset the server repository to the previous commit.
2. Reinstall production dependencies.
3. Rebuild the application.
4. Restart the systemd service.
5. Verify the service is active and the healthcheck URL returns HTTP 200.

If rollback also fails, manual server intervention is required. Use the existing EC2 SSH access and inspect:

```bash
systemctl status mindora-website --no-pager
journalctl -u mindora-website -n 100 --no-pager
curl -I http://127.0.0.1/
```

## How to Disable Deployment

Use either option:

1. Recommended: set the repository secret `DEPLOY_ENABLED` to any value other than `true`, for example `false`.
2. Stronger lock: rename or delete `.github/workflows/deploy.yml` in a commit.

Because the workflow only uses manual `workflow_dispatch`, pushes to `main` do not automatically deploy.

## Operational Notes

- Keep GitHub as the source of truth.
- Do not make manual code edits on the EC2 server except emergency hotfixes.
- Commit changes to GitHub first, then deploy through this workflow after review.
- Do not store Supabase keys or SSH keys in source code. Use GitHub Secrets and server-side environment files only.
