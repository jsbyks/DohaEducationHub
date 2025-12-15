#!/usr/bin/env bash
set -euo pipefail

# Run Playwright E2E tests locally against local dev servers.
# Requirements:
# - Backend running at http://localhost:8000 with ENABLE_TEST_ENDPOINTS=1
# - Frontend dev server running at http://localhost:3000 (or set PLAYWRIGHT_BASE_URL)
# - Node 18+, Playwright installed

BASE_URL=${PLAYWRIGHT_BASE_URL:-http://localhost:3000}
API_BASE=${PLAYWRIGHT_API_BASE:-http://localhost:8000/api}

echo "Using BASE_URL=$BASE_URL API_BASE=$API_BASE"

echo "Installing Playwright browsers and deps..."
npx playwright install --with-deps

echo "Running Playwright tests..."
export PLAYWRIGHT_BASE_URL="$BASE_URL"
export PLAYWRIGHT_API_BASE="$API_BASE"
npx playwright test --project=chromium --reporter=list
