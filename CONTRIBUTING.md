# Contributing Guide

This repository is maintained as a production website. Changes should be small, reviewed, and easy to roll back.

## Ground Rules

- Do not commit secrets, private keys, production `.env` files, or server credentials.
- Do not make business copy, design, or behavior changes in infrastructure-only commits.
- Keep GitHub as the source of truth.
- Prefer focused commits with clear messages.
- Run checks before pushing.

## Development Flow

1. Create a branch from `main`.
2. Install dependencies with `npm ci`.
3. Make the smallest safe change.
4. Run:

```bash
npm run check
```

5. Commit with a descriptive message.
6. Open a pull request or push for review according to the current team process.

## Commit Style

Use concise imperative messages:

```text
Add production health check script
Document disaster recovery workflow
Update deployment guide
```

## Pull Request Checklist

Before requesting review, confirm:

- [ ] No secrets or generated build outputs are committed.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] Documentation is updated when operations, deployment, or environment behavior changes.
- [ ] Rollback impact is understood.

## Production Changes

Production deployment should happen through GitHub Actions after review. Manual server deployment is reserved for emergencies and must be reconciled back into GitHub.
