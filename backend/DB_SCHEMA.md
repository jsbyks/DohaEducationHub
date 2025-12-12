# Database Schema Documentation

## Overview
This document defines the database schema for the Doha Education Hub MVP. The schema supports school directory listings, user management, content management, and data import workflows.

**Database**: SQLite (dev), PostgreSQL (production)
**ORM**: SQLAlchemy

---

## Tables

### 1. schools
Main table for published school records visible to end users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PRIMARY KEY | Unique identifier |
| name | String(255) | NOT NULL, INDEXED | School name |
| type | String(100) | | School type (e.g., "Primary", "Secondary", "International") |
| curriculum | String(100) | | Curriculum offered (e.g., "British", "American", "IB") |
| address | Text | | Full address |
| latitude | Float | | GPS latitude for mapping |
| longitude | Float | | GPS longitude for mapping |
| contact | String(200) | | Contact information (phone/email) |
| website | String(300) | | School website URL |
| fee_structure | JSON | | Fee information as structured data |
| facilities | JSON | | Array of facilities (e.g., ["Lab", "Pool", "Library"]) |
| photos | JSON | | Array of photo URLs |
| status | String(50) | DEFAULT 'pending' | Publication status: 'pending', 'published', 'archived' |
| created_at | DateTime | AUTO | Record creation timestamp |
| updated_at | DateTime | AUTO | Last update timestamp |

**Indexes**: id, name

---

### 2. users
User accounts for authentication and authorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PRIMARY KEY | Unique identifier |
| email | String(255) | UNIQUE, NOT NULL, INDEXED | User email (login credential) |
| hashed_password | String(255) | NOT NULL | Bcrypt hashed password |
| full_name | String(255) | | User's full name |
| is_active | Boolean | DEFAULT TRUE | Account active status |
| is_admin | Boolean | DEFAULT FALSE | Admin role flag |
| created_at | DateTime | AUTO | Account creation timestamp |

**Indexes**: id, email

**Roles**:
- Regular user: Can browse, favorite schools, submit reviews
- Admin (is_admin=true): Can manage schools, approve reviews, publish content

---

### 3. staging_schools
Temporary holding table for imported school data before review and publication.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PRIMARY KEY | Unique identifier |
| name | String(255) | NOT NULL, INDEXED | School name |
| type | String(100) | | School type |
| curriculum | String(100) | | Curriculum offered |
| address | Text | | Full address |
| latitude | Float | | GPS latitude |
| longitude | Float | | GPS longitude |
| contact | String(200) | | Contact information |
| website | String(300) | | School website URL |
| fee_structure | JSON | | Fee information |
| facilities | JSON | | Facilities array |
| photos | JSON | | Photo URLs array |
| status | String(50) | DEFAULT 'staging' | Import status: 'staging', 'approved', 'rejected' |
| created_at | DateTime | AUTO | Import timestamp |
| updated_at | DateTime | AUTO | Last update timestamp |

**Usage**: ETL pipeline imports data here. Admin reviews and promotes records to `schools` table.

---

### 4. posts (Planned - Week 5)
Blog posts and educational content.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PRIMARY KEY | Unique identifier |
| title | String(300) | NOT NULL | Post title |
| slug | String(300) | UNIQUE, NOT NULL, INDEXED | URL-friendly slug |
| content | Text | NOT NULL | Post body (markdown or HTML) |
| excerpt | String(500) | | Short summary |
| author_id | Integer | FOREIGN KEY → users.id | Author (admin user) |
| status | String(50) | DEFAULT 'draft' | 'draft', 'published', 'archived' |
| published_at | DateTime | | Publication timestamp |
| created_at | DateTime | AUTO | Creation timestamp |
| updated_at | DateTime | AUTO | Last update timestamp |

---

### 5. reviews (Planned - Week 5)
User reviews for schools.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PRIMARY KEY | Unique identifier |
| school_id | Integer | FOREIGN KEY → schools.id | School being reviewed |
| user_id | Integer | FOREIGN KEY → users.id | Reviewer |
| rating | Integer | CHECK 1-5 | Star rating (1-5) |
| review_text | Text | | Review content |
| is_verified | Boolean | DEFAULT FALSE | Verified parent/teacher flag |
| status | String(50) | DEFAULT 'pending' | 'pending', 'approved', 'rejected' |
| created_at | DateTime | AUTO | Submission timestamp |
| updated_at | DateTime | AUTO | Last update timestamp |

---

### 6. favorites (Planned - Week 5)
User saved/favorite schools.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PRIMARY KEY | Unique identifier |
| user_id | Integer | FOREIGN KEY → users.id | User who favorited |
| school_id | Integer | FOREIGN KEY → schools.id | Favorited school |
| created_at | DateTime | AUTO | Timestamp |

**Composite Index**: (user_id, school_id) for uniqueness

---

## Relationships

```
users (1) ──→ (N) posts
users (1) ──→ (N) reviews
users (1) ──→ (N) favorites

schools (1) ──→ (N) reviews
schools (1) ──→ (N) favorites
```

---

## Data Validation

### Enums
- `schools.status`: 'pending', 'published', 'archived'
- `staging_schools.status`: 'staging', 'approved', 'rejected'
- `posts.status`: 'draft', 'published', 'archived'
- `reviews.status`: 'pending', 'approved', 'rejected'

### Business Rules
1. Email must be valid format
2. Passwords must be hashed using bcrypt
3. Reviews require rating 1-5
4. Only is_admin=true users can publish posts
5. Staging schools must be approved before moving to schools table

---

## Migration Strategy
- SQLAlchemy models → Auto-generate migrations (Alembic)
- Week 2: Implement User + School models ✅
- Week 5: Add Posts, Reviews, Favorites models
- Week 6: Ensure staging_schools supports ETL pipeline

---

## Sample Queries

### Get published schools by curriculum
```sql
SELECT * FROM schools
WHERE status = 'published'
  AND curriculum = 'British'
ORDER BY name;
```

### Get admin users
```sql
SELECT * FROM users
WHERE is_admin = TRUE
  AND is_active = TRUE;
```

### Promote staging school to published
```sql
INSERT INTO schools (name, type, curriculum, ...)
SELECT name, type, curriculum, ...
FROM staging_schools
WHERE id = ? AND status = 'approved';
```

---

**Last Updated**: Week 1 - Dec 2025
