"""
Data Quality Script - Calculate and update completeness scores for schools.

Completeness score is calculated based on the presence and quality of various fields.
Score ranges from 0-100, with higher scores indicating more complete data.
"""

import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
import models
from db import SessionLocal


def calculate_completeness_score(school) -> int:
    """
    Calculate data completeness score for a school (0-100).

    Field weights:
    - Critical fields (15 points each): name, address, latitude, longitude
    - Important fields (10 points each): contact, website, curriculum, type
    - Optional fields (5 points each): fee_structure, facilities

    Total possible: 100 points
    """
    score = 0

    # Critical fields - 15 points each (60 points total)
    critical_fields = {
        "name": 15,
        "address": 15,
        "latitude": 15,
        "longitude": 15,
    }

    for field, weight in critical_fields.items():
        value = getattr(school, field, None)
        if value:
            score += weight

    # Important fields - 10 points each (40 points total)
    important_fields = {
        "contact": 10,
        "website": 10,
        "curriculum": 10,
        "type": 10,
    }

    for field, weight in important_fields.items():
        value = getattr(school, field, None)
        if value:
            score += weight

    # Optional fields - 5 points each (10 points total - could expand)
    # Fee structure
    if school.fee_structure:
        score += 5

    # Facilities (if it's a non-empty list or dict)
    if school.facilities:
        if isinstance(school.facilities, list) and len(school.facilities) > 0:
            score += 5
        elif isinstance(school.facilities, dict) and len(school.facilities) > 0:
            score += 5

    return min(score, 100)  # Cap at 100


def update_all_scores(db: Session, table="schools"):
    """
    Update completeness scores for all schools in the specified table.

    Args:
        db: Database session
        table: 'schools' or 'staging_schools'

    Returns:
        dict with statistics about the update
    """
    if table == "schools":
        model = models.School
    elif table == "staging_schools":
        model = models.StagingSchool
    else:
        raise ValueError(
            f"Invalid table: {table}. Must be 'schools' or 'staging_schools'"
        )

    schools = db.query(model).all()

    stats = {
        "total": len(schools),
        "updated": 0,
        "average_score": 0,
        "min_score": 100,
        "max_score": 0,
        "distribution": {
            "0-20": 0,
            "21-40": 0,
            "41-60": 0,
            "61-80": 0,
            "81-100": 0,
        },
    }

    total_score = 0

    for school in schools:
        old_score = school.completeness_score or 0
        new_score = calculate_completeness_score(school)

        if old_score != new_score:
            school.completeness_score = new_score
            stats["updated"] += 1

        total_score += new_score
        stats["min_score"] = min(stats["min_score"], new_score)
        stats["max_score"] = max(stats["max_score"], new_score)

        # Update distribution
        if new_score <= 20:
            stats["distribution"]["0-20"] += 1
        elif new_score <= 40:
            stats["distribution"]["21-40"] += 1
        elif new_score <= 60:
            stats["distribution"]["41-60"] += 1
        elif new_score <= 80:
            stats["distribution"]["61-80"] += 1
        else:
            stats["distribution"]["81-100"] += 1

    if stats["total"] > 0:
        stats["average_score"] = total_score / stats["total"]

    db.commit()

    return stats


def get_incomplete_schools(db: Session, min_score: int = 70):
    """
    Get schools with completeness score below the threshold.

    Args:
        db: Database session
        min_score: Minimum acceptable score (default 70)

    Returns:
        List of schools with score < min_score
    """
    schools = (
        db.query(models.School)
        .filter(models.School.completeness_score < min_score)
        .order_by(models.School.completeness_score)
        .all()
    )

    return schools


def get_missing_fields_report(db: Session):
    """
    Generate a report of missing fields across all schools.

    Returns:
        dict with field names and count of schools missing each field
    """
    schools = db.query(models.School).all()

    report = {
        "total_schools": len(schools),
        "missing_fields": {
            "name": 0,
            "address": 0,
            "latitude": 0,
            "longitude": 0,
            "contact": 0,
            "website": 0,
            "curriculum": 0,
            "type": 0,
            "fee_structure": 0,
            "facilities": 0,
        },
    }

    for school in schools:
        for field in report["missing_fields"].keys():
            value = getattr(school, field, None)
            if not value:
                report["missing_fields"][field] += 1

    return report


def main():
    """Main execution function."""
    db = SessionLocal()

    try:
        print("=" * 60)
        print("DATA QUALITY ANALYSIS - Doha Education Hub")
        print("=" * 60)

        # Update scores for main schools table
        print("\n[1/3] Updating completeness scores for schools...")
        schools_stats = update_all_scores(db, "schools")

        print(f"\nSchools Table:")
        print(f"  Total schools: {schools_stats['total']}")
        print(f"  Updated: {schools_stats['updated']}")
        print(f"  Average score: {schools_stats['average_score']:.1f}/100")
        print(f"  Min score: {schools_stats['min_score']}")
        print(f"  Max score: {schools_stats['max_score']}")
        print(f"\n  Distribution:")
        for range_name, count in schools_stats["distribution"].items():
            percentage = (
                (count / schools_stats["total"] * 100)
                if schools_stats["total"] > 0
                else 0
            )
            print(f"    {range_name}: {count} ({percentage:.1f}%)")

        # Update scores for staging table
        print("\n[2/3] Updating completeness scores for staging schools...")
        staging_stats = update_all_scores(db, "staging_schools")

        print(f"\nStaging Table:")
        print(f"  Total schools: {staging_stats['total']}")
        print(f"  Updated: {staging_stats['updated']}")
        if staging_stats["total"] > 0:
            print(f"  Average score: {staging_stats['average_score']:.1f}/100")

        # Generate missing fields report
        print("\n[3/3] Generating missing fields report...")
        report = get_missing_fields_report(db)

        print(f"\nMissing Fields Report:")
        print(f"  Total schools analyzed: {report['total_schools']}")
        print(f"\n  Fields missing:")
        for field, count in sorted(
            report["missing_fields"].items(), key=lambda x: x[1], reverse=True
        ):
            if count > 0:
                percentage = (
                    (count / report["total_schools"] * 100)
                    if report["total_schools"] > 0
                    else 0
                )
                print(f"    {field}: {count} ({percentage:.1f}%)")

        print("\n" + "=" * 60)
        print("COMPLETE - Scores updated successfully!")
        print("=" * 60)

    except Exception as e:
        print(f"\nError: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
