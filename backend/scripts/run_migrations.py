"""Run Alembic migrations programmatically.

Usage:
    python backend/scripts/run_migrations.py

This will apply migrations to the database configured in `backend/alembic.ini`.
"""
from alembic.config import Config
from alembic import command
from pathlib import Path
import os


def run():
    base = Path(__file__).resolve().parent.parent
    ini_path = base / "alembic.ini"
    if not ini_path.exists():
        raise FileNotFoundError(f"alembic.ini not found at {ini_path}")

    cfg = Config(str(ini_path))

    # Ensure working directory is project root so relative paths resolve
    os.chdir(str(base))
    print("Running alembic upgrade head...")
    command.upgrade(cfg, "head")
    print("Migrations applied.")


if __name__ == "__main__":
    run()
