#!/usr/bin/env bash
set -euo pipefail

# Trigger a manual deploy for a Render service using the Deploys API.
# Requires: RENDER_API_KEY, RENDER_SERVICE_ID environment variables.

if [ -z "${RENDER_API_KEY:-}" ] || [ -z "${RENDER_SERVICE_ID:-}" ]; then
  echo "Please set RENDER_API_KEY and RENDER_SERVICE_ID"
  exit 1
fi

echo "Triggering deploy for Render service: $RENDER_SERVICE_ID"
curl -s -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"clearCache":false}'

echo "Triggered deploy. Check Render dashboard for status."
