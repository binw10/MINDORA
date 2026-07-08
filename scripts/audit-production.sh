#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-mindora-website}"
APP_DIR="${APP_DIR:-/home/admin/mindora-website}"
PROXY_URL="${PROXY_URL:-http://127.0.0.1/}"
APP_URL="${APP_URL:-http://127.0.0.1:3000/}"

section() {
  printf '\n== %s ==\n' "$1"
}

section "Git"
git -C "$APP_DIR" status -sb
git -C "$APP_DIR" log --oneline -3

section "Node"
node --version
npm --version

section "systemd"
systemctl is-active "$SERVICE_NAME"
systemctl status "$SERVICE_NAME" --no-pager -n 5 || true

section "HTTP"
curl -s -o /dev/null -w "app:%{http_code}\n" "$APP_URL"
curl -s -o /dev/null -w "proxy:%{http_code}\n" "$PROXY_URL"

section "Disk"
df -h /
du -sh "$APP_DIR" 2>/dev/null || true

section "Memory"
free -h
