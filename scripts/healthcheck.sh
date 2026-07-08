#!/usr/bin/env bash
set -euo pipefail

HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1/}"
APP_URL="${APP_URL:-http://127.0.0.1:3000/}"
SERVICE_NAME="${SERVICE_NAME:-mindora-website}"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-15}"

log() {
  printf '[healthcheck] %s\n' "$*"
}

check_http() {
  local name="$1"
  local url="$2"
  local status

  status="$(curl -fsS -o /dev/null -w '%{http_code}' --max-time "$TIMEOUT_SECONDS" "$url" || true)"
  if [ "$status" != "200" ]; then
    log "$name failed: expected HTTP 200 from $url, got ${status:-curl_error}"
    return 1
  fi

  log "$name ok: $url returned HTTP 200"
}

if command -v systemctl >/dev/null 2>&1; then
  if systemctl list-unit-files "$SERVICE_NAME.service" >/dev/null 2>&1; then
    systemctl is-active --quiet "$SERVICE_NAME"
    log "systemd service active: $SERVICE_NAME"
  else
    log "systemd service not found locally, skipping: $SERVICE_NAME"
  fi
fi

check_http "app" "$APP_URL"
check_http "proxy" "$HEALTHCHECK_URL"
