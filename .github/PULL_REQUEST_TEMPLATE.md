# Pull Request Checklist

Use this template when opening PRs that change CI, deployments, or environment-sensitive code.

- [ ] Describe the change and why it's needed.
- [ ] List any new repository secrets or variables required.
- [ ] Confirm you added secrets to the repository (Settings → Secrets and variables → Actions).
- [ ] If the change affects staging/production, list the environment values for each environment.
- [ ] Ensure CI passes including Playwright E2E (if applicable).

Required secrets (add to repository secrets):

- `NEXT_PUBLIC_BASE_URL` — base URL used by sitemap validation and Playwright (e.g., https://staging.example.com)
- `NEXT_PUBLIC_API_URL` — API host used by the deployed frontend (optional)
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for automated Vercel deployments (optional)
- `DATABASE_URL` — DB connection for staging/CI integrations (optional)
- `SECRET_KEY` — backend JWT/signing secret (optional)

Notes:
- Public, client-exposed keys should use `NEXT_PUBLIC_` prefix and may be stored as Repository Variables if not secret.
- Keep secrets out of code and rotate tokens periodically.
