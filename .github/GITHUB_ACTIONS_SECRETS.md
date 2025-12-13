# GitHub Actions Secrets & Recommended Env Values

This document lists recommended repository secrets and environment variables used by the CI workflow and staging deployments.

How to add secrets:
- Go to your repository -> Settings -> Secrets and variables -> Actions -> New repository secret
- For non-secret public values (client-side), prefer Repository Variables instead of Secrets.

Required / Recommended secrets and variables

- `NEXT_PUBLIC_BASE_URL` (string) — The base URL of the frontend used by CI tests and sitemap validation. Example: `https://staging.example.com`.
  - Used in: `.github/workflows/ci.yml`, `frontend/playwright.config.ts`, sitemap validation.
  - In CI set as a repository secret so workflows can fetch and assert sitemap and run E2E against the correct host.

- `NEXT_PUBLIC_API_URL` (string) — Public API base URL for the frontend (optional). Example: `https://api.example.com`.
  - Used in: `frontend/lib/api.ts` when running against deployed backend.
  - If public, you can set this as a Repository Variable; if it contains sensitive endpoints, set as a Secret.

- `VERCEL_TOKEN` (secret) — Token for Vercel CLI/automation (if using Vercel). Keep this secret.
- `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` (strings) — IDs used by Vercel deployments. These may be stored as repository variables or secrets.

- `DATABASE_URL` (secret) — Connection string for production/staging DB (if workflows run integration tests). Example: `postgres://user:pass@host:5432/dbname`.

- `SECRET_KEY` (secret) — Backend JWT/signing secret used by FastAPI to sign tokens. Keep rotated and secret.

- `SMTP_URL` or `SMTP_USER` / `SMTP_PASSWORD` (secret) — If sending emails from CI or staging, store SMTP creds here.

- `SENTRY_DSN` (secret) — Optional Sentry DSN if error tracking is enabled.

Client-side (non-secret) values
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` — Google Analytics measurement ID; safe to store as a Repository Variable (not secret).
- `NEXT_PUBLIC_ENABLE_ANALYTICS` — `true`/`false` to toggle analytics in staging/production.

Usage in workflows
- Reference secrets in workflow YAML using `${{ secrets.NAME }}`. Example:

  env:
    NEXT_PUBLIC_BASE_URL: ${{ secrets.NEXT_PUBLIC_BASE_URL }}

- For repository variables (non-secret) use `${{ vars.NAME }}` in workflows.

Best practices
- Scope secrets to Environments if you have separate `staging` and `production` environments; this allows protected secrets and manual reviewers for deployment.
- Rotate tokens periodically (e.g., `VERCEL_TOKEN`, `DATABASE_URL` credentials).
- Avoid committing secrets to code; use env injection only via GitHub Actions or the hosting provider's UI.
- Keep public, client-visible keys as `NEXT_PUBLIC_...` variables — these are expected to be exposed in the built assets.

Quick checklist for this repo (minimum for CI E2E):
- Add `NEXT_PUBLIC_BASE_URL` secret pointing to your staging/preview URL.
- Optionally add `NEXT_PUBLIC_API_URL` if the deployed frontend talks to a different API host.
- If you plan automated deploys from CI, add `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`.

If you'd like, I can create a short PR template that documents which secrets to set for `staging` vs `production` and example values.
