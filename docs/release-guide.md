# Release Guide

## Release Philosophy

Keep releases small, reviewable, and reversible. Separate business/UI changes from infrastructure changes whenever possible.

## Pre-release Checklist

Run locally or in a clean environment:

```bash
npm ci
npm run check
```

Confirm:

- [ ] No secrets are committed.
- [ ] No generated build output is committed.
- [ ] Documentation changed when deployment, environment, or operations changed.
- [ ] Rollback path is clear.

## Standard Release Flow

1. Merge approved changes into `main`.
2. Open GitHub Actions.
3. Select `Deploy MINDORA Website`.
4. Choose the target ref.
5. Run the workflow only after confirming `DEPLOY_ENABLED=true` is intentionally configured.
6. Wait for build, restart, and health check to finish.
7. Verify the public site manually.

## Versioning

This website currently does not publish package versions. Use Git commit SHAs as deployment identifiers.

Useful commands:

```bash
git rev-parse --short HEAD
git log --oneline -5
```

## Rollback

The GitHub Actions workflow attempts automatic rollback to the previous server commit if deployment fails.

For manual rollback on the server:

```bash
cd /home/admin/mindora-website
git log --oneline -10
git reset --hard <known-good-sha>
npm ci
npm run build
sudo systemctl restart mindora-website
npm run healthcheck
```

## After Release

Record any operational notes in the relevant doc:

- Deployment workflow changes: `docs/github-actions-deployment-guide.md`
- Server hardening: `docs/production-hardening.md`
- Recovery changes: `docs/disaster-recovery.md`
- Architecture changes: `docs/architecture.md`
