#!/usr/bin/env bash
set -euo pipefail

# Run Alembic migrations (assumes virtualenv and env vars configured)
echo "Running Alembic migrations..."
alembic upgrade head
echo "Migrations complete."
