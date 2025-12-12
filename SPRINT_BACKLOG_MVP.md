## Doha Education Hub — MVP Sprint Backlog (8 Weeks

Purpose: Convert the master plan into an actionable, week-by-week sprint backlog for the MVP (school directory + basic blog + auth). Each week contains objectives, tasks, deliverables, and acceptance criteria.

---

### Overview
- Sprint length: 1 week (8 sprints / 8 weeks)
- Team: Founder/PM (you), 1 Full‑stack dev, 1 Designer (contract), 1 Content writer (part-time)
- Goal: Launch an MVP with a searchable school directory (50+ schools), school detail pages, basic search/filters, user accounts, and a small blog (10 posts).

---

### Week 1 — Kickoff & Foundations (2025-12-15 12 2025-12-21)
Objectives:
- Finalize MVP scope and wireframes.

Tasks:
- Sprint kickoff, clarify acceptance criteria.
- Create lightweight wireframes for home, search, school page, auth, admin.
- Define minimal DB schema for schools, users, and posts.
- Initialize repo and CI scaffold.

Deliverables:
- Wireframes (PDF / Figma links).
- Repo scaffold with README and basic CI (lint/test placeholders).

Acceptance Criteria:
- Wireframes approved by PM.
- Repo created and pushable to remote.

---

### Week 2 — Data Model, Backend Boilerplate (2025-12-22 12 2025-12-28)
Objectives:
- Implement backend skeleton and DB schema.

Tasks:
- Create FastAPI project skeleton.
- Define PostgreSQL schema and migrations (schools, users, posts).
- Implement basic auth (JWT) and user model.
- Seed script for 50 sample school records (CSV import template).

Deliverables:
- FastAPI running with migrations and seed script.
- Auth endpoints: register, login, refresh.

Acceptance Criteria:
- Migrations run locally and seed inserts 50 sample rows.
- Auth endpoints pass basic integration tests.

---

### Week 3 — School Directory API + Admin CRUD (2025-12-29 12 2026-01-04)
Objectives:
- Build core API for schools and admin CRUD.

Tasks:
- Schools CRUD endpoints: list, detail, create, update, delete.
- Implement filtering: location (city/district), curriculum, fee range, school type.
- Admin-only routes protected by role checks.
- Add basic validation (Pydantic schemas).

Deliverables:
- API docs (OpenAPI) with schools endpoints.
- Admin CRUD working via API client (Postman collection).

Acceptance Criteria:
- API responses match schema and filters work.
- Admin can create/update a school and changes persist.

---

### Week 4 — Frontend MVP: Search & School Pages (2026-01-05 12 2026-01-11)
Objectives:
- Build the user-facing search, listing, and school detail pages.

Tasks:
- Initialize Next.js + TypeScript frontend.
- Implement search page with filters and list results (server-side or ISR as appropriate).
- Implement school detail page with media placeholders.
- Integrate with backend API for data.

Deliverables:
- Functional search UI and school detail pages.
- Responsive mobile-first layout for core pages.

Acceptance Criteria:
- Search returns correct results for filters.
- School page displays fields from the API and is mobile-friendly.

---

### Week 5 — User Accounts, Reviews & Basic CMS (2026-01-12 12 2026-01-18)
Objectives:
- Allow users to register, save favorites, and post verified reviews (minimal flow).

Tasks:
- Frontend auth flows (signup/login/logout) with session handling.
- Favorites (save school) feature for logged-in users.
- Reviews API & frontend: allow review submission only if verified flag (manual seed) or after admin approval flow.
- Simple CMS for blog posts (create, edit, publish) via admin API.

Deliverables:
- User account flows working end-to-end.
- Review submission pipeline with admin moderation flag.
- CMS endpoints for blog posts.

Acceptance Criteria:
- A user can register, login, favorite a school, and submit a review that appears as 'pending' for admin.
- Admin can publish blog posts via API.

---

### Week 6 — Data Collection Pipeline Prototype (2026-01-19 12 2026-01-25)
Objectives:
- Prototype scraping/import pipeline for Ministry/Google Places data.

Tasks:
- Build a small Python ETL script to pull Google Places (or parse sample CSV) into staging tables.
- Implement basic deduplication and geocoding validation.
- Admin UI/API to review and accept imported records.

Deliverables:
- ETL script, staging DB, and import review endpoints.

Acceptance Criteria:
- ETL imports sample dataset into staging and admin can accept -> published schools.

---

### Week 7 — SEO, Content, Performance & QA (2026-01-26 12 2026-02-01)
Objectives:
- Prepare site for launch: SEO, initial content, tests, and performance tuning.

Tasks:
- Add meta tags, sitemap, robots, JSON-LD for school pages.
- Publish initial 10 blog posts via CMS.
- Run basic e2e tests (Playwright) for critical flows (search, auth, publish review).
- Performance checks and image placeholders via Next/Image.

Deliverables:
- SEO checklist completed and content published.
- Test suite with passing smoke tests.

Acceptance Criteria:
- Pages render with schema markup and blog posts indexed in sitemap.
- Smoke tests pass in CI.

---

### Week 8 — Beta Launch, Feedback & Retrospective (2026-02-02 12 2026-02-08)
Objectives:
- Soft launch to pilot users, collect feedback, and plan immediate follow-ups.

Tasks:
- Deploy frontend (Vercel) and backend (Railway/Render). Point domain to staging.
- Invite 20-50 beta users (parents/teachers) for testing.
- Collect bug reports and usage metrics; triage issues.
- Sprint retrospective and roadmap update for next phase (teacher marketplace).

Deliverables:
- Publicly accessible MVP (soft launch) and feedback log.
- Post-launch backlog and prioritized fixes.

Acceptance Criteria:
- MVP accessible, accepts new user signups, search and school pages work for beta users.
- At least 10 pieces of actionable feedback collected.

---

### Ongoing / Cross-cutting Tasks (run each week)
- Daily bug triage and short standup.
- Weekly demo to stakeholders.
- Security & backups: basic env secrets and daily DB backups.
- Analytics: basic GA/analytics setup and tracking events for search and profile views.

---

### Notes & Next Steps
- After Week 8, prioritize teacher marketplace, booking, payments, and advanced AI components (semantic search, content automation).
- If you want, I can scaffold the repo and create starter templates for Weeks 1–4 next.
