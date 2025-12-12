# Backend (FastAPI)

## Setup
- Python 3.11+
- Recommended: create a virtual environment

## Install dependencies
```bash
pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary alembic python-jose[cryptography] passlib[bcrypt] pydantic
```

## Run the server
```bash
uvicorn main:app --reload
```

## Project structure (to be created):
- `main.py` — FastAPI entrypoint
- `models/` — SQLAlchemy models
- `schemas/` — Pydantic schemas
- `api/` — API routes
- `db/` — DB session and migrations
- `seed/` — Data seed scripts
