"""
Batch Staging Operations - Bulk accept, reject, and manage staging schools.

This script provides utilities for processing multiple staging schools at once.
"""

import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
import models
import crud
from db import SessionLocal


def batch_accept_staging(db: Session, min_score: int = 70):
    """
    Accept all staging schools with completeness score >= min_score.

    Args:
        db: Database session
        min_score: Minimum completeness score required (default 70)

    Returns:
        dict with statistics about the operation
    """
    staging_schools = (
        db.query(models.StagingSchool)
        .filter(
            models.StagingSchool.completeness_score >= min_score,
            models.StagingSchool.status == "staging",
        )
        .all()
    )

    stats = {
        "total_candidates": len(staging_schools),
        "accepted": 0,
        "failed": 0,
        "errors": [],
    }

    for staging in staging_schools:
        try:
            # Use the existing accept_staging function from crud
            accepted_school = crud.accept_staging(db, staging.id)
            if accepted_school:
                stats["accepted"] += 1
            else:
                stats["failed"] += 1
                stats["errors"].append(
                    f"Failed to accept staging ID {staging.id}: Not found"
                )
        except Exception as e:
            stats["failed"] += 1
            stats["errors"].append(
                f"Failed to accept staging ID {staging.id}: {str(e)}"
            )
            db.rollback()  # Rollback this transaction but continue

    return stats


def batch_reject_duplicates(db: Session):
    """
    Reject (delete) all staging schools marked as 'possible_duplicate'.

    Returns:
        dict with statistics about the operation
    """
    duplicate_schools = (
        db.query(models.StagingSchool)
        .filter(models.StagingSchool.status == "possible_duplicate")
        .all()
    )

    stats = {
        "total_duplicates": len(duplicate_schools),
        "rejected": 0,
        "failed": 0,
        "errors": [],
    }

    for staging in duplicate_schools:
        try:
            success = crud.delete_staging(db, staging.id)
            if success:
                stats["rejected"] += 1
            else:
                stats["failed"] += 1
                stats["errors"].append(
                    f"Failed to reject staging ID {staging.id}: Not found"
                )
        except Exception as e:
            stats["failed"] += 1
            stats["errors"].append(
                f"Failed to reject staging ID {staging.id}: {str(e)}"
            )
            db.rollback()

    return stats


def batch_reject_invalid_geocode(db: Session):
    """
    Reject (delete) all staging schools marked as 'invalid_geocode'.

    Returns:
        dict with statistics about the operation
    """
    invalid_schools = (
        db.query(models.StagingSchool)
        .filter(models.StagingSchool.status == "invalid_geocode")
        .all()
    )

    stats = {
        "total_invalid": len(invalid_schools),
        "rejected": 0,
        "failed": 0,
        "errors": [],
    }

    for staging in invalid_schools:
        try:
            success = crud.delete_staging(db, staging.id)
            if success:
                stats["rejected"] += 1
            else:
                stats["failed"] += 1
                stats["errors"].append(
                    f"Failed to reject staging ID {staging.id}: Not found"
                )
        except Exception as e:
            stats["failed"] += 1
            stats["errors"].append(
                f"Failed to reject staging ID {staging.id}: {str(e)}"
            )
            db.rollback()

    return stats


def auto_verify_websites(db: Session):
    """
    Verify website URLs for all staging schools.
    Updates the website field with verified/corrected URLs.

    Note: This is a placeholder. Full implementation would require
    the verify_websites.py script functionality.

    Returns:
        dict with statistics about the operation
    """
    staging_schools = (
        db.query(models.StagingSchool)
        .filter(models.StagingSchool.website.isnot(None))
        .all()
    )

    stats = {
        "total": len(staging_schools),
        "verified": 0,
        "unreachable": 0,
        "updated": 0,
    }

    # Placeholder - would integrate with verify_websites.py
    print("  Note: Website verification requires integration with verify_websites.py")
    print("  This is a placeholder for future implementation.")

    return stats


def list_staging_by_score(db: Session, min_score: int = 0, max_score: int = 100):
    """
    List staging schools within a score range.

    Args:
        db: Database session
        min_score: Minimum score (inclusive)
        max_score: Maximum score (inclusive)

    Returns:
        List of staging schools
    """
    schools = (
        db.query(models.StagingSchool)
        .filter(
            models.StagingSchool.completeness_score >= min_score,
            models.StagingSchool.completeness_score <= max_score,
        )
        .order_by(models.StagingSchool.completeness_score.desc())
        .all()
    )

    return schools


def main():
    """Interactive menu for batch staging operations."""
    db = SessionLocal()

    try:
        print("=" * 60)
        print("BATCH STAGING OPERATIONS - Doha Education Hub")
        print("=" * 60)

        print("\nAvailable Operations:")
        print("  1. Auto-accept high-quality schools (score >= 70)")
        print("  2. Reject all duplicates")
        print("  3. Reject all invalid geocodes")
        print("  4. List staging schools by score range")
        print("  5. Show staging statistics")
        print("  0. Exit")

        choice = input("\nSelect operation (0-5): ").strip()

        if choice == "1":
            min_score = input("Minimum score for auto-accept (default 70): ").strip()
            min_score = int(min_score) if min_score else 70

            print(f"\nAccepting staging schools with score >= {min_score}...")
            stats = batch_accept_staging(db, min_score)

            print(f"\nResults:")
            print(f"  Candidates found: {stats['total_candidates']}")
            print(f"  Successfully accepted: {stats['accepted']}")
            print(f"  Failed: {stats['failed']}")

            if stats["errors"]:
                print(f"\n  Errors:")
                for error in stats["errors"][:5]:  # Show first 5 errors
                    print(f"    - {error}")

        elif choice == "2":
            print("\nRejecting all duplicate staging schools...")
            stats = batch_reject_duplicates(db)

            print(f"\nResults:")
            print(f"  Duplicates found: {stats['total_duplicates']}")
            print(f"  Successfully rejected: {stats['rejected']}")
            print(f"  Failed: {stats['failed']}")

        elif choice == "3":
            print("\nRejecting all invalid geocode staging schools...")
            stats = batch_reject_invalid_geocode(db)

            print(f"\nResults:")
            print(f"  Invalid records found: {stats['total_invalid']}")
            print(f"  Successfully rejected: {stats['rejected']}")
            print(f"  Failed: {stats['failed']}")

        elif choice == "4":
            min_score = input("Minimum score (0-100): ").strip()
            max_score = input("Maximum score (0-100): ").strip()

            min_score = int(min_score) if min_score else 0
            max_score = int(max_score) if max_score else 100

            schools = list_staging_by_score(db, min_score, max_score)

            print(f"\nStaging schools with score {min_score}-{max_score}:")
            print(f"  Total: {len(schools)}")

            for school in schools[:10]:  # Show first 10
                print(
                    f"    [{school.completeness_score}] {school.name} - {school.status}"
                )

        elif choice == "5":
            total = db.query(models.StagingSchool).count()
            by_status = {}

            statuses = ["staging", "possible_duplicate", "invalid_geocode"]
            for status in statuses:
                count = (
                    db.query(models.StagingSchool)
                    .filter(models.StagingSchool.status == status)
                    .count()
                )
                by_status[status] = count

            print(f"\nStaging Statistics:")
            print(f"  Total staging schools: {total}")
            print(f"\n  By status:")
            for status, count in by_status.items():
                print(f"    {status}: {count}")

        elif choice == "0":
            print("\nExiting...")
        else:
            print("\nInvalid choice.")

        print("\n" + "=" * 60)

    except Exception as e:
        print(f"\nError: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
