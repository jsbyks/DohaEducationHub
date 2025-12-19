# Database Migration Note

## Important: PostgreSQL vs SQLite

The enhanced school migrations (`add_enhanced_school_fields.py` and `create_school_reviews_table.py`) are designed for **PostgreSQL** production database and use PostgreSQL-specific types:

- `ARRAY` (for lists/arrays)
- `JSONB` (for JSON objects)

**SQLite (Development Database) does not support these types.**

## Current Status

For now, we'll use the existing schema which supports:
- Basic school information
- Text fields
- Numeric fields
- Simple data types

The comprehensive seed script has been created but will work best when deployed to PostgreSQL production.

## For Local Development

Use the basic CSV seed for now:
```bash
python scripts/seed_database.py
```

## For Production (PostgreSQL)

When deploying to production with PostgreSQL:

1. Apply migrations:
```bash
alembic upgrade head
```

2. Seed comprehensive schools:
```bash
python scripts/seed_comprehensive_schools.py
```

## Workaround for SQLite

We can still seed schools with rich data - it will just be stored as JSON text in existing fields rather than in dedicated columns.

Created: December 16, 2025
