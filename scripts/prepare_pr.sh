#!/usr/bin/env bash
set -euo pipefail

# Prepare a feature branch with current changes and open a PR using `gh`.
# Requires: git configured, remote set, gh CLI installed and authenticated.

BRANCH=${1:-feature/e2e-playwright-and-payouts}
git checkout -b "$BRANCH"
git add -A
git commit -m "feat: add Playwright E2E, payouts scaffolding, test helpers, CI workflow"
git push -u origin "$BRANCH"

echo "Branch pushed. To open a PR run:"
echo "  gh pr create --fill --base main --head $BRANCH"
