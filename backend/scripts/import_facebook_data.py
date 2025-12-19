"""
Import Facebook data from CSV file and update schools in database
"""

import sys
import os
import csv
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School


def import_facebook_data():
    """Import Facebook data from CSV"""
    db = SessionLocal()

    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        'schools_facebook_collection.csv'
    )

    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        print("Please ensure the file exists and try again.")
        return

    updated_count = 0
    skipped_count = 0
    error_count = 0

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            try:
                school_id = int(row['ID'])
                completed = row.get('Completed (Yes/No)', '').strip().lower()

                # Skip if not marked as completed
                if completed != 'yes':
                    skipped_count += 1
                    continue

                # Get school from database
                school = db.query(School).filter(School.id == school_id).first()
                if not school:
                    print(f"Warning: School ID {school_id} not found in database")
                    error_count += 1
                    continue

                # Update Facebook fields if they have values
                updated = False

                if row.get('Facebook URL', '').strip():
                    school.facebook_url = row['Facebook URL'].strip()
                    updated = True

                if row.get('Facebook Phone', '').strip():
                    school.facebook_phone = row['Facebook Phone'].strip()
                    updated = True

                if row.get('Facebook Email', '').strip():
                    school.facebook_email = row['Facebook Email'].strip()
                    updated = True

                if row.get('Facebook Address', '').strip():
                    school.facebook_address = row['Facebook Address'].strip()
                    updated = True

                if row.get('Facebook About/Description', '').strip():
                    school.facebook_about = row['Facebook About/Description'].strip()
                    updated = True

                verified = row.get('Facebook Verified (Yes/No)', '').strip().lower()
                if verified in ['yes', 'no']:
                    school.facebook_verified = (verified == 'yes')
                    updated = True

                followers = row.get('Facebook Followers', '').strip()
                if followers and followers.isdigit():
                    school.facebook_followers = int(followers)
                    updated = True

                if updated:
                    updated_count += 1
                    print(f"Updated: {school.name} (ID: {school_id})")

            except Exception as e:
                print(f"Error processing row: {e}")
                error_count += 1
                continue

    # Commit all changes
    db.commit()

    print("\n" + "=" * 60)
    print("IMPORT SUMMARY")
    print("=" * 60)
    print(f"Schools updated: {updated_count}")
    print(f"Schools skipped (not completed): {skipped_count}")
    print(f"Errors: {error_count}")
    print("=" * 60)

    if updated_count > 0:
        print("\nFacebook data has been imported successfully!")
        print("You can now view the updated school information in the application.")
    else:
        print("\nNo schools were updated. Make sure to:")
        print("1. Fill in Facebook data in the CSV")
        print("2. Mark schools as 'Yes' in the 'Completed' column")

    db.close()


if __name__ == "__main__":
    import_facebook_data()
