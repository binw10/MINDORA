#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/admin/mindora-website}"
BACKUP_DIR="${BACKUP_DIR:-/home/admin/backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
ARCHIVE_NAME="mindora-website-${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"

log() {
  printf '[backup] %s\n' "$*"
}

if [ ! -d "$APP_DIR" ]; then
  log "application directory does not exist: $APP_DIR"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

tar \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='.env.*' \
  -czf "$ARCHIVE_PATH" \
  -C "$(dirname "$APP_DIR")" \
  "$(basename "$APP_DIR")"

log "created backup: $ARCHIVE_PATH"
ls -lh "$ARCHIVE_PATH"
