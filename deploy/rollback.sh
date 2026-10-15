#!/usr/bin/env bash
#
# Roll the VPS frontend container back (or forward) to a specific image tag.
# Run this ON the VPS, as the same user that owns the Quadlet unit.
#
# Usage:
#   ./rollback.sh <sha|tag|full-image-ref> [--no-health-check]
#
# Examples:
#   ./rollback.sh 4459085abc123                     # -> $IMAGE_REPO:4459085abc123
#   ./rollback.sh ghcr.io/owner/repo:v1.2           # explicit reference
#   IMAGE_REPO=ghcr.io/x/y ./rollback.sh latest
#
# Environment overrides:
#   IMAGE_REPO  Image repository      (default: ghcr.io/kmilodenisglez/pulsehavana-frontend-next)
#   UNIT        Quadlet unit name     (default: pulsehavana-frontend)
#   SYSTEMCTL   systemctl invocation  (default: "systemctl --user"; use "sudo systemctl" for rootful)
#   QUADLET_DIR Quadlet unit folder   (default: $HOME/.config/containers/systemd)
set -euo pipefail

IMAGE_REPO="${IMAGE_REPO:-ghcr.io/kmilodenisglez/pulsehavana-frontend-next}"
UNIT="${UNIT:-pulsehavana-frontend}"
SYSTEMCTL="${SYSTEMCTL:-systemctl --user}"
QUADLET_DIR="${QUADLET_DIR:-$HOME/.config/containers/systemd}"

usage() {
  cat <<'USAGE'
Roll the VPS frontend container to a specific image tag.

Usage:
  ./rollback.sh <sha|tag|full-image-ref> [--no-health-check]

Examples:
  ./rollback.sh 4459085abc123            # -> $IMAGE_REPO:4459085abc123
  ./rollback.sh ghcr.io/owner/repo:v1.2  # explicit reference
  IMAGE_REPO=ghcr.io/x/y ./rollback.sh latest

Environment overrides:
  IMAGE_REPO  Image repository      (default: ghcr.io/kmilodenisglez/pulsehavana-frontend-next)
  UNIT        Quadlet unit name     (default: pulsehavana-frontend)
  SYSTEMCTL   systemctl invocation  (default: "systemctl --user"; rootful: "sudo systemctl")
  QUADLET_DIR Quadlet unit folder   (default: $HOME/.config/containers/systemd)
USAGE
  exit "${1:-1}"
}

[[ $# -ge 1 ]] || usage 1

TARGET="$1"
HEALTH=1
[[ "${2:-}" == "--no-health-check" ]] && HEALTH=0

# A bare sha/tag becomes a full reference; anything with "/" or ":" is used as-is.
if [[ "$TARGET" == */* || "$TARGET" == *:* ]]; then
  REF="$TARGET"
else
  REF="$IMAGE_REPO:$TARGET"
fi

# `systemctl --user` over a non-interactive SSH session needs the runtime dir.
if [[ "$SYSTEMCTL" == *"--user"* && -z "${XDG_RUNTIME_DIR:-}" ]]; then
  export XDG_RUNTIME_DIR="/run/user/$(id -u)"
fi

DROPIN_DIR="$QUADLET_DIR/$UNIT.container.d"

echo "==> Rolling '${UNIT}' to ${REF}"
podman pull "$REF"

mkdir -p "$DROPIN_DIR"
printf '[Container]\nImage=%s\n' "$REF" > "$DROPIN_DIR/10-image.conf"

# shellcheck disable=SC2086  # $SYSTEMCTL is intentionally word-split.
$SYSTEMCTL daemon-reload
# shellcheck disable=SC2086
$SYSTEMCTL restart "${UNIT}.service"

echo "==> Restarted ${UNIT}.service with ${REF}"

if [[ "$HEALTH" == 0 ]]; then
  exit 0
fi

echo "==> Waiting for the health check..."
for _ in $(seq 1 15); do
  if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
    echo "==> Healthy: http://127.0.0.1:3000/"
    exit 0
  fi
  sleep 2
done

echo "!! Health check failed. Recent status and logs:" >&2
# shellcheck disable=SC2086
$SYSTEMCTL status "${UNIT}.service" --no-pager || true
podman logs --tail 30 "$UNIT" 2>&1 || true
exit 1
