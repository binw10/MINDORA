# Production Hardening Notes

This project is deployed on a Debian EC2 host and served through Apache as a reverse proxy to the local Next.js process.

## Current production chain

- Project directory: `/home/admin/mindora-website`
- Process manager: `systemd`
- Service: `mindora-website`
- Application port: `3000`
- Reverse proxy: Apache
- Domains: `midra.ai`, `www.midra.ai`

## Safe hardening applied

- Apache `sites-enabled` directory permissions should be `755` and owned by `root:root`.
- Sensitive systemd drop-in environment files should be owned by `root:root` with `600` permissions.
- Apache should set conservative security headers:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Apache should cache immutable Next.js static assets under `/_next/static/` for one year.
- Apache should apply moderate cache headers for public static assets.
- Apache should use deflate compression for text, JavaScript, JSON, XML, and SVG responses.
- Next.js should disable the `X-Powered-By` header via `poweredByHeader: false`.

## Verification checklist after infrastructure changes

Run these checks after each safe change:

```bash
systemctl is-active mindora-website
systemctl is-active apache2
apache2ctl configtest
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1/
```

Build verification should be done in an isolated copy to avoid rewriting the live `.next` directory while production is running.

## Rollback notes

Before editing Apache vhosts, copy the original file into `/home/admin/backups/`. To roll back an Apache vhost change:

```bash
sudo cp /home/admin/backups/<backup-file> /etc/apache2/sites-available/000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

For source changes, use Git to inspect and revert deliberately. Do not make untracked emergency edits directly on production unless required to restore service.
