"""
Seed script to populate the database with initial data.
- Inserts 50 schools from CSV file
- Creates admin and test users
"""
import sys
import csv
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
from models import School, User
from auth import hash_password


def seed_schools(db: Session):
    """
    Seed schools from the CSV file.

    Args:
        db: Database session
    """
    csv_file = Path(__file__).parent.parent / "etl" / "seed_schools_50.csv"

    if not csv_file.exists():
        print(f"[ERROR] CSV file not found: {csv_file}")
        return

    print(f"[INFO] Reading schools from {csv_file}")

    # Check if schools already exist
    existing_count = db.query(School).count()
    if existing_count > 0:
        print(f"[WARN] Database already has {existing_count} schools. Skipping school seed.")
        return

    schools_added = 0
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            school = School(
                name=row.get('name', ''),
                type=row.get('type'),
                curriculum=row.get('curriculum'),
                address=row.get('address'),
                latitude=float(row['latitude']) if row.get('latitude') else None,
                longitude=float(row['longitude']) if row.get('longitude') else None,
                contact=row.get('contact'),
                website=row.get('website'),
                status='published'  # All seed schools are published
            )
            db.add(school)
            schools_added += 1

    db.commit()
    print(f"[SUCCESS] Added {schools_added} schools to database")


def seed_users(db: Session):
    """
    Create default admin and test users.

    Args:
        db: Database session
    """
    # Check if admin already exists
    existing_admin = db.query(User).filter(User.email == "admin@dohaedu.com").first()
    if existing_admin:
        print("[WARN] Admin user already exists. Skipping user seed.")
        return

    print("[INFO] Creating default users...")

    # Create admin user
    admin_user = User(
        email="admin@dohaedu.com",
        hashed_password=hash_password("admin123"),
        full_name="Admin User",
        is_active=True,
        is_admin=True
    )
    db.add(admin_user)

    # Create test user
    test_user = User(
        email="test@example.com",
        hashed_password=hash_password("test123"),
        full_name="Test User",
        is_active=True,
        is_admin=False
    )
    db.add(test_user)

    db.commit()
    print("[SUCCESS] Created admin user (admin@dohaedu.com / admin123)")
    print("[SUCCESS] Created test user (test@example.com / test123)")


def main():
    """Main seed function."""
    print("[INFO] Starting database seed...\n")

    # Create tables if they don't exist
    print("[INFO] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("[SUCCESS] Tables created\n")

    # Create database session
    db = SessionLocal()

    try:
        # Seed schools
        seed_schools(db)
        print()

        # Seed users
        seed_users(db)
        print()

        # Summary
        school_count = db.query(School).count()
        user_count = db.query(User).count()

        print("=" * 50)
        print("[SUCCESS] Database seed complete!")
        print(f"[INFO] Total schools: {school_count}")
        print(f"[INFO] Total users: {user_count}")
        print("=" * 50)

    except Exception as e:
        print(f"\n[ERROR] Error during seed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
