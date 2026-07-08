# Environment Variables

Never commit real environment values. Use `.env.example` only for names and safe placeholder values.

## Application Variables

| Variable | Required | Scope | Description |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Yes for contact submissions | Server only | Supabase project URL. The app accepts either `https://project.supabase.co` or a REST URL and normalizes it. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes for contact submissions | Server only | Supabase service role key used by the server API route to insert contact submissions. Must never be exposed to the browser. |
| `PORT` | Production | Server process | Port used by `next start`. Production currently uses `3000`. |
| `NODE_ENV` | Production | Server process | Should be `production` under systemd. |

## GitHub Actions Secrets

See [`github-actions-deployment-guide.md`](github-actions-deployment-guide.md).

Required deployment secrets:

- `DEPLOY_ENABLED`
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`

Optional deployment secrets:

- `EC2_PORT`
- `APP_DIR`
- `SERVICE_NAME`
- `HEALTHCHECK_URL`

## Local Development

Create a local `.env.local` only when testing the contact form against Supabase. Do not commit it.

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Production Storage

Production secrets should be stored outside Git, typically in a root-owned systemd drop-in file or another approved secret manager.

Check production configuration without printing secret values:

```bash
systemctl show mindora-website --property=Environment
```

Do not paste secret values into tickets, chat, documentation, or commits.
