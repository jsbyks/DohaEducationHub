"""
Update the new comprehensive schools to 'published' status
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School


def update_school_status():
    """Update new schools from 'approved' to 'published'"""
    db = SessionLocal()

    new_school_names = [
        "GEMS American Academy Qatar",
        "DPS Modern Indian School",
        "Lebanese School Doha",
        "Cedars International School",
        "Al Khor International School"
    ]

    print("[INFO] Updating school status to 'published'...\n")

    updated_count = 0

    for school_name in new_school_names:
        school = db.query(School).filter(School.name == school_name).first()

        if school:
            old_status = school.status
            school.status = "published"
            db.commit()

            print(f"[UPDATE] {school.name}")
            print(f"   Status: {old_status} -> published")
            updated_count += 1
        else:
            print(f"[NOT FOUND] {school_name}")

    print(f"\n[SUCCESS] Updated {updated_count} schools to 'published' status")
    print("[INFO] These schools will now appear on the schools page")

    db.close()


if __name__ == "__main__":
    update_school_status()
