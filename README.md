# Doha Education Hub

> A comprehensive platform for discovering and comparing schools in Doha, Qatar.

[![CI Pipeline](https://img.shields.io/badge/CI-GitHub%20Actions-blue)](https://github.com)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-000000)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

Doha Education Hub is an 8-week MVP project to create a searchable school directory platform for Doha, Qatar. The platform helps parents discover schools, read reviews, compare curricula, and make informed decisions about their children's education.

### Key Features (MVP)
- ✅ **School Directory**: Browse 50+ schools with detailed profiles
- ✅ **Advanced Search**: Filter by curriculum, location, fees, and school type
- 🔄 **User Accounts**: Save favorites and submit verified reviews
- 🔄 **Content Hub**: Educational blog posts and school selection guides
- 🔄 **Admin Dashboard**: Manage schools, approve reviews, publish content
- 🔄 **Data Pipeline**: Automated school data import from public sources

## Project Structure

```
DohaEducationHub/
├── backend/              # FastAPI backend (Python 3.11+)
│   ├── api/             # API route handlers
│   ├── etl/             # Data import scripts
│   ├── scripts/         # Utility scripts
│   ├── tests/           # Pytest test suite
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic validation schemas
│   ├── crud.py          # Database operations
│   └── main.py          # FastAPI app entry point
│
├── frontend/            # Next.js frontend (TypeScript)
│   ├── pages/           # Next.js pages and routing
│   ├── components/      # React components (TBD)
│   ├── styles/          # CSS/Tailwind styles (TBD)
│   └── public/          # Static assets (TBD)
│
├── sprints/             # 8-week sprint documentation
│   ├── week-01/         # Foundations & wireframes
│   ├── week-02/         # Backend + DB
│   ├── week-03/         # School API
│   ├── week-04/         # Frontend MVP
│   └── ...
│
├── .github/workflows/   # CI/CD configuration
├── DB_SCHEMA.md         # Database schema documentation
├── WIREFRAMES.md        # UI/UX wireframes
└── SPRINT_BACKLOG_MVP.md # 8-week implementation plan
```

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL (production), SQLite (development)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Auth**: JWT (planned Week 5)
- **Testing**: Pytest

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (planned Week 4)
- **State**: React Context / Zustand (TBD)
- **Testing**: Jest + React Testing Library (planned Week 7)

### DevOps
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (frontend), Railway/Render (backend)
- **Version Control**: Git

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   ```

3. **Activate virtual environment**
   - Windows: `.venv\Scripts\activate`
   - Unix/Mac: `source .venv/bin/activate`

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Initialize database**
   ```bash
   # Database is auto-created via SQLAlchemy
   python -c "from db import engine, Base; from models import *; Base.metadata.create_all(engine)"
   ```

6. **Seed sample data (optional)**
   ```bash
   python etl/import_schools.py
   ```

7. **Run development server**
   ```bash
   uvicorn main:app --reload
   ```
   API will be available at: http://localhost:8000
   API docs (Swagger): http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   App will be available at: http://localhost:3000

### Running Tests

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

### Linting & Formatting

**Backend:**
```bash
# Linting
flake8 .

# Formatting
black .

# Type checking
mypy .
```

**Frontend:**
```bash
# Linting
npm run lint

# Formatting
npm run format

# Format check only
npm run format:check
```

## Development Workflow

### Sprint Timeline (8 Weeks)

| Week | Dates | Focus | Status |
|------|-------|-------|--------|
| 1 | Dec 15-21, 2025 | Kickoff & Foundations | ✅ In Progress |
| 2 | Dec 22-28, 2025 | Backend & Data Model | 🔄 Partially Done |
| 3 | Dec 29 - Jan 4, 2026 | School API + Admin CRUD | 🔄 Partially Done |
| 4 | Jan 5-11, 2026 | Frontend MVP | 📅 Planned |
| 5 | Jan 12-18, 2026 | User Accounts & Reviews | 📅 Planned |
| 6 | Jan 19-25, 2026 | Data Pipeline | 📅 Planned |
| 7 | Jan 26 - Feb 1, 2026 | SEO & QA | 📅 Planned |
| 8 | Feb 2-8, 2026 | Beta Launch | 📅 Planned |

See [SPRINT_BACKLOG_MVP.md](SPRINT_BACKLOG_MVP.md) for detailed sprint planning.

### Git Workflow

1. Create feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

3. Push and create Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Convention
We use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code formatting
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## API Documentation

### Base URL
- Development: `http://localhost:8000`
- Production: TBD

### Key Endpoints (Current)
- `GET /api/schools` - List all schools
- `GET /api/schools/{id}` - Get school details
- `POST /api/schools` - Create school (admin)
- `PUT /api/schools/{id}` - Update school (admin)
- `DELETE /api/schools/{id}` - Delete school (admin)

See full API docs at: http://localhost:8000/docs

## Database Schema

See [backend/DB_SCHEMA.md](backend/DB_SCHEMA.md) for complete schema documentation.

### Core Tables
- `schools` - Published school records
- `users` - User accounts
- `staging_schools` - Import staging area
- `posts` - Blog content (planned Week 5)
- `reviews` - School reviews (planned Week 5)
- `favorites` - User saved schools (planned Week 5)

## UI/UX Design

See [WIREFRAMES.md](WIREFRAMES.md) for detailed wireframes covering:
- Home page
- Search/listing page
- School detail page
- Authentication pages
- Admin dashboard

## Contributing

This is currently a private MVP project. Contributing guidelines will be added post-launch.

## Week 1 Acceptance Criteria

- [x] Git repository initialized
- [x] Project structure scaffolded
- [x] Database schema documented
- [x] Wireframes created
- [x] CI/CD pipeline configured
- [ ] README and documentation complete
- [ ] Week 1 retrospective completed

## Resources

- [Sprint Planning](SPRINT_BACKLOG_MVP.md)
- [Master Plan](MASTER%20DOHA%20SCHOOL%20HUB.md)
- [Database Schema](backend/DB_SCHEMA.md)
- [Wireframes](WIREFRAMES.md)

## License

MIT License - See LICENSE file for details

## Contact

For questions or feedback, contact the project maintainer.

---

**Last Updated**: Week 1, December 2025
**Next Milestone**: Week 2 - Backend Boilerplate (Dec 22-28)
