# CI and Deployment

## Current State

This repository has a guarded deployment workflow at `.github/workflows/deploy.yml`.

The workflow is manual-only and requires `DEPLOY_ENABLED=true` in GitHub Secrets before it will deploy.

## Local Equivalent

Before deploying, run:

```bash
npm run check
```

This performs:

- ESLint
- TypeScript type checking
- Production build

## Deployment Workflow

See [`github-actions-deployment-guide.md`](github-actions-deployment-guide.md) for GitHub Secrets, deployment behavior, rollback behavior, and disabling deployment.

## Future CI Recommendation

A separate pull-request CI workflow can be added later to run `npm ci` and `npm run check` on pull requests. Keep it separate from production deployment so validation does not imply release.
