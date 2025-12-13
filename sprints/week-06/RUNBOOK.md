# Week 6 Runbook — ETL → Staging → Review → Accept

This runbook explains how to run the ETL import into the staging table, review imported records in the Admin UI, accept or reject records, and use the batch staging utilities.

Prerequisites
- Python 3.11 (project venv available at `backend/venv`)
- Node.js 18+ for frontend (recommended to run in WSL or CI on Linux)
- Database configured (default is local SQLite dev DB)

1) Prepare environment

- Activate backend virtual environment (PowerShell):

  ```powershell
  & C:/Users/Admin/DohaEducationHub/backend/venv/Scripts/Activate.ps1
  cd C:/Users/Admin/DohaEducationHub/backend
  ```

- Ensure DB tables/migrations are applied (run Alembic or helper script):

  ```powershell
  python scripts/run_migrations.py
  ```

2) Run the ETL importer into staging

- Dry run (validate but don't write):

  ```powershell
  python etl/import_schools.py --path etl/sample_schools.csv --dry-run
  ```

- Import into `staging` table (default CSV is `etl/sample_schools.csv`):

  ```powershell
  python etl/import_schools.py --staging
  ```

- To import a custom CSV file:

  ```powershell
  python etl/import_schools.py --staging --path path/to/file.csv
  ```

Notes:
- The importer validates required fields, phone/email formats, and coordinates. Records with invalid coordinates are inserted with status `invalid_geocode` when `--staging` is used.
- Fuzzy deduplication runs against main and existing staging; similar names are flagged as `possible_duplicate`.

3) Start backend and frontend for admin review

- Start backend (from `backend/`):

  ```powershell
  uvicorn main:app --reload
  ```

- Start frontend (from `frontend/`):

  ```bash
  cd frontend
  npm ci
  npm run dev
  ```

- Open Admin Staging UI: `http://localhost:3000/admin/staging` (login as an admin user first).

4) Review and accept/reject records in the Admin UI

- Use filters at the top to view `staging`, `possible_duplicate`, `invalid_geocode`, or `incomplete` records.
- Select rows (checkbox) and use the `Accept Selected` or `Reject Selected` buttons to perform bulk operations.
- The Accept action calls the backend endpoint which moves the record from `staging` → `schools` and marks it as `published`.

5) Batch operations (CLI)

- Interactive batch utility: run the helper script to auto-accept or bulk-reject:

  ```powershell
  python scripts/batch_staging.py
  ```

- Examples (interactive):
  - Auto-accept high-quality records (score >= 70)
  - Reject all `possible_duplicate` records
  - Reject all `invalid_geocode` records

6) Quality scoring and thresholds

- The importer computes a `completeness_score` per record using `scripts/data_quality.py`.
- Default thresholds used in code: fuzzy dedupe threshold = 85 (name similarity), auto-accept default min score = 70.

7) Rollback / safety

- Rejected staging rows are deleted. If you need to recover, re-run the ETL from the source CSV.
- Accept moves the row to the `schools` table; to undo, delete the corresponding `schools` row and, if desired, re-insert into `staging`.

8) Troubleshooting

- If `uvicorn` is not reachable from the frontend, ensure CORS is permissive in `backend/main.py` for local dev.
- If the admin UI shows no records after import, confirm the import wrote to the same database used by the running backend instance (check `DATABASE_URL` or sqlite file path).

9) Next steps / automation

- You can schedule the ETL on a server or CI runner and pipe output to `--staging` for manual review.
- Consider adding integration to Google Places API or Ministry CSVs as a source; credential handling should use secrets.

If you want, I can add a small example GitHub Action to run the ETL periodically and push results to a staging branch or notify admins.
