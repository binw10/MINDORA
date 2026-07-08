# Disaster Recovery Guide

## Priorities

1. Restore safe public availability.
2. Preserve evidence needed to understand the failure.
3. Avoid exposing secrets during recovery.
4. Reconcile any emergency changes back into GitHub.

## Quick Triage

SSH to the server and run:

```bash
cd /home/admin/mindora-website
npm run audit:production
journalctl -u mindora-website -n 100 --no-pager
sudo apache2ctl configtest
curl -I http://127.0.0.1/
```

## If Next.js Is Down

```bash
sudo systemctl status mindora-website --no-pager
journalctl -u mindora-website -n 100 --no-pager
cd /home/admin/mindora-website
npm run build
sudo systemctl restart mindora-website
npm run healthcheck
```

If the latest commit is bad, roll back:

```bash
git log --oneline -10
git reset --hard <known-good-sha>
npm ci
npm run build
sudo systemctl restart mindora-website
npm run healthcheck
```

## If Apache Proxy Is Down

```bash
sudo apache2ctl configtest
sudo systemctl status apache2 --no-pager
sudo tail -n 100 /var/log/apache2/mindora-error.log
```

If a recent vhost change caused the issue, restore the most recent backup from `/home/admin/backups` and reload Apache:

```bash
sudo cp /home/admin/backups/<apache-backup-file> /etc/apache2/sites-available/000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## If Contact Form Submissions Fail

Check server logs without printing secrets:

```bash
journalctl -u mindora-website -n 100 --no-pager | grep -i contact
```

Confirm environment variables are configured by name only. Do not print secret values into shared logs or chats.

## Restore From Source Backup

Backups created by `scripts/backup-production.sh` exclude secrets, build output, `node_modules`, and `.git`.

Restore source files to a temporary directory first:

```bash
mkdir -p /home/admin/restore-test
tar -xzf /home/admin/backups/<backup>.tar.gz -C /home/admin/restore-test
```

Inspect before replacing production files.

## Post-incident Follow-up

- Commit or revert any emergency server changes.
- Update this document if the recovery process changed.
- Rotate exposed credentials immediately if any secret was displayed or copied into an unsafe place.
