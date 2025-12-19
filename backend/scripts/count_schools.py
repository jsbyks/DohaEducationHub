"""
Count and display school statistics
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School
from sqlalchemy import func


def show_statistics():
    """Show school statistics"""
    db = SessionLocal()

    # Total count
    total = db.query(School).count()
    print(f"=" * 60)
    print(f"TOTAL SCHOOLS IN DATABASE: {total}")
    print(f"=" * 60)

    # New comprehensive schools
    new_schools = [
        'GEMS American Academy Qatar',
        'DPS Modern Indian School',
        'Lebanese School Doha',
        'Cedars International School',
        'Al Khor International School'
    ]

    print("\nRECENTLY ADDED COMPREHENSIVE SCHOOLS:")
    print("-" * 60)
    for name in new_schools:
        s = db.query(School).filter(School.name == name).first()
        if s:
            print(f"\n{s.name}")
            print(f"  Curriculum: {s.curriculum}")
            print(f"  Location: {s.address}")
            print(f"  Completeness: {s.completeness_score}%")
            print(f"  Status: {s.status}")

            # Check data completeness
            has_fees = bool(s.fee_structure and s.fee_structure.get("tuition_by_grade"))
            has_facilities = bool(s.facilities and s.facilities.get("campus"))
            has_academic = bool(s.photos and s.photos.get("academic"))

            print(f"  Enhanced Data: Fees={has_fees}, Facilities={has_facilities}, Academic={has_academic}")

    # Breakdown by curriculum
    print("\n" + "=" * 60)
    print("BREAKDOWN BY CURRICULUM:")
    print("-" * 60)
    curricula = db.query(
        School.curriculum,
        func.count(School.id)
    ).group_by(School.curriculum).order_by(func.count(School.id).desc()).all()

    for curr in curricula:
        curr_name = curr[0] if curr[0] else "Not specified"
        print(f"  {curr_name}: {curr[1]}")

    # Breakdown by status
    print("\n" + "=" * 60)
    print("BREAKDOWN BY STATUS:")
    print("-" * 60)
    statuses = db.query(
        School.status,
        func.count(School.id)
    ).group_by(School.status).all()

    for stat in statuses:
        print(f"  {stat[0]}: {stat[1]}")

    # High completeness schools
    print("\n" + "=" * 60)
    print("SCHOOLS WITH HIGH COMPLETENESS (>80%):")
    print("-" * 60)
    high_completeness = db.query(School).filter(
        School.completeness_score > 80
    ).order_by(School.completeness_score.desc()).limit(10).all()

    for s in high_completeness:
        print(f"  {s.completeness_score}% - {s.name} ({s.curriculum})")

    print("\n" + "=" * 60)

    db.close()


if __name__ == "__main__":
    show_statistics()
