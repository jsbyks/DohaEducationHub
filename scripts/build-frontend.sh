#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pushd "$SCRIPT_DIR/../frontend" >/dev/null
echo "Running frontend build in: $(pwd)"
npm install
npm run build
popd >/dev/null
