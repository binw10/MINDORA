#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[preflight] %s\n' "$*"
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    log "missing required command: $1"
    exit 1
  }
}

require_command node
require_command npm
require_command git

log "node $(node --version)"
log "npm $(npm --version)"

if [ -f package-lock.json ]; then
  npm ci --dry-run --ignore-scripts >/dev/null
  log "package-lock.json is compatible with npm ci"
else
  log "package-lock.json is missing"
  exit 1
fi

npm run lint
npm run build
log "lint and build completed"
