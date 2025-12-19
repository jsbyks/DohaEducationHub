"""
Verify published schools
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School


def verify_published():
    """Verify published schools"""
    db = SessionLocal()

    # Count by status
    published = db.query(School).filter(School.status == "published").count()
    print(f"Published schools: {published}")

    # Check new schools
    new_schools = [
        "GEMS American Academy Qatar",
        "DPS Modern Indian School",
        "Lebanese School Doha",
        "Cedars International School",
        "Al Khor International School"
    ]

    print("\nNew comprehensive schools status:")
    for name in new_schools:
        s = db.query(School).filter(School.name == name).first()
        if s:
            print(f"  {s.name}: status={s.status}")

    db.close()


if __name__ == "__main__":
    verify_published()
