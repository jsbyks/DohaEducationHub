#!/usr/bin/env bash
set -euo pipefail

# Deploy frontend using the Vercel CLI. Requires VERCEL_TOKEN env var and `vercel` installed.
# Example: VERCEL_TOKEN=xxx vercel --prod --confirm

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "Please set VERCEL_TOKEN"
  exit 1
fi

echo "Running vercel deploy (preview)..."
VERCEL_ORG_ID=${VERCEL_ORG_ID:-}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID:-}

if [ -z "$VERCEL_ORG_ID" ] || [ -z "$VERCEL_PROJECT_ID" ]; then
  echo "VERCEL_ORG_ID and VERCEL_PROJECT_ID not set; running simple vercel deploy"
  vercel --token "$VERCEL_TOKEN" --confirm
else
  vercel --token "$VERCEL_TOKEN" --org "$VERCEL_ORG_ID" --scope "$VERCEL_PROJECT_ID" --confirm
fi
