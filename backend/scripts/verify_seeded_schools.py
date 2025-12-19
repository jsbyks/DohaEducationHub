"""
Verify the seeded schools data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School
import json


def verify_schools():
    """Verify seeded schools"""
    db = SessionLocal()

    # Check for the 5 new schools
    new_school_names = [
        "GEMS American Academy Qatar",
        "DPS Modern Indian School",
        "Lebanese School Doha",
        "Cedars International School",
        "Al Khor International School"
    ]

    print("[INFO] Verifying seeded schools...\n")

    for school_name in new_school_names:
        school = db.query(School).filter(School.name == school_name).first()

        if school:
            print(f"[OK] {school.name}")
            print(f"   Curriculum: {school.curriculum}")
            print(f"   Address: {school.address}")
            print(f"   Contact: {school.contact}")
            print(f"   Completeness: {school.completeness_score}%")

            # Check JSON fields
            if school.fee_structure:
                tuition = school.fee_structure.get('tuition_by_grade', {})
                print(f"   Fee Structure: {len(tuition)} grade levels")

            if school.facilities:
                campus = school.facilities.get('campus', {})
                print(f"   Facilities: {sum(1 for v in campus.values() if v)} campus facilities")

            if school.photos:
                academic = school.photos.get('academic', {})
                print(f"   Academic Data: {academic.get('total_students', 'N/A')} students, {academic.get('student_teacher_ratio', 'N/A')} ratio")

            print()
        else:
            print(f"[ERROR] {school_name} - NOT FOUND")
            print()

    # Total count
    total = db.query(School).count()
    print(f"[INFO] Total schools in database: {total}")

    db.close()


if __name__ == "__main__":
    verify_schools()
