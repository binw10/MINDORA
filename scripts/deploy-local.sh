#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/admin/mindora-website}"
BRANCH="${BRANCH:-main}"
SERVICE_NAME="${SERVICE_NAME:-mindora-website}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1/}"

log() {
  printf '[deploy-local] %s\n' "$*"
}

verify_http() {
  local status
  status="$(curl -fsS -o /dev/null -w '%{http_code}' --max-time 15 "$HEALTHCHECK_URL" || true)"
  if [ "$status" != "200" ]; then
    log "healthcheck failed: expected HTTP 200 from $HEALTHCHECK_URL, got ${status:-curl_error}"
    return 1
  fi
  log "healthcheck passed: $HEALTHCHECK_URL"
}

cd "$APP_DIR"
previous_sha="$(git rev-parse HEAD)"

rollback() {
  local exit_code="$?"
  trap - ERR
  log "deployment failed, rolling back to $previous_sha"
  git reset --hard "$previous_sha"
  npm ci
  npm run build
  sudo systemctl restart "$SERVICE_NAME"
  sleep 3
  sudo systemctl is-active --quiet "$SERVICE_NAME"
  verify_http
  exit "$exit_code"
}

trap rollback ERR

git fetch --prune origin "$BRANCH"
git reset --hard "origin/$BRANCH"
npm ci
npm run build
sudo systemctl restart "$SERVICE_NAME"
sleep 3
sudo systemctl is-active --quiet "$SERVICE_NAME"
verify_http
trap - ERR
log "deployment completed: $(git rev-parse --short HEAD)"
