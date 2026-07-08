# Operations Guide

## Health Check

Local/server health check:

```bash
npm run healthcheck
```

Defaults:

- App URL: `http://127.0.0.1:3000/`
- Proxy URL: `http://127.0.0.1/`
- Service: `mindora-website`

Override when needed:

```bash
HEALTHCHECK_URL=http://127.0.0.1/ APP_URL=http://127.0.0.1:3000/ npm run healthcheck
```

## Production Audit Snapshot

Run on the server:

```bash
npm run audit:production
```

This prints Git status, recent commits, Node/npm versions, service status, HTTP status, disk usage, and memory usage.

## Backup

Run on the server before risky maintenance:

```bash
npm run backup:production
```

The backup script creates a timestamped archive under `/home/admin/backups` by default and excludes:

- `.git`
- `.next`
- `node_modules`
- `.env`
- `.env.*`

Override paths when needed:

```bash
APP_DIR=/home/admin/mindora-website BACKUP_DIR=/home/admin/backups npm run backup:production
```

## Manual Deployment Helper

Preferred deployment is GitHub Actions. The local deploy helper exists for emergency server-side operation:

```bash
npm run deploy:local
```

It fetches `origin/main`, resets to it, installs dependencies, builds, restarts systemd, and checks HTTP. If a step fails after deployment starts, it attempts to reset to the previous commit and rebuild.

## Logs

```bash
journalctl -u mindora-website -n 100 --no-pager
sudo tail -n 100 /var/log/apache2/mindora-error.log
sudo tail -n 100 /var/log/apache2/mindora-access.log
```

## Service Management

```bash
sudo systemctl status mindora-website --no-pager
sudo systemctl restart mindora-website
sudo systemctl reload apache2
sudo apache2ctl configtest
```

Use Apache reload, not restart, when applying safe vhost changes.
