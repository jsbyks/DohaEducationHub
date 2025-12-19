"""
Fix existing school data to match the correct schema format
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from db import SessionLocal
from models import School


def fix_school_data(db: Session):
    """Fix facilities and photos fields in existing schools"""

    schools = db.query(School).all()

    fixed_count = 0

    for school in schools:
        needs_update = False

        # Fix facilities - convert dict to list if it's a dict
        if isinstance(school.facilities, dict):
            facilities_list = [key for key, value in school.facilities.items() if value is True]
            school.facilities = facilities_list
            needs_update = True

        # Fix photos - set to empty list if it's not a list
        if not isinstance(school.photos, list):
            school.photos = []
            needs_update = True

        if needs_update:
            fixed_count += 1
            print(f"[FIX] {school.name}")

    if fixed_count > 0:
        db.commit()
        print(f"\n[SUCCESS] Fixed {fixed_count} schools")
    else:
        print("[INFO] No schools needed fixing")


def main():
    """Main function"""
    print("[INFO] Starting school data fix...\n")

    db = SessionLocal()

    try:
        fix_school_data(db)
        print("\n[SUCCESS] Fix complete!")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()