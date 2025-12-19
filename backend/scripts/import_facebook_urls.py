"""
Import Facebook URLs from CSV file

If you have a CSV with school names/IDs and Facebook URLs, this script will import them.

Expected CSV format:
ID,School Name,Facebook_URL
125,ABC School,https://www.facebook.com/abcschool
...
"""

import sys
import os
import csv
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School


def import_facebook_urls(csv_filename='schools_facebook_urls_results.csv'):
    """
    Import Facebook URLs from CSV file
    """
    db = SessionLocal()

    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        csv_filename
    )

    if not os.path.exists(csv_path):
        print(f"ERROR: CSV file not found at {csv_path}")
        print(f"\nExpected file: {csv_filename}")
        print("Format should be: ID,School Name,Facebook_URL")
        return

    print("=" * 70)
    print("FACEBOOK URLs IMPORT")
    print("=" * 70)
    print(f"Reading from: {csv_path}\n")

    updated_count = 0
    skipped_count = 0
    error_count = 0

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        # Check if required columns exist
        if 'ID' not in reader.fieldnames:
            print("ERROR: CSV must have 'ID' column")
            return

        # Try different possible column names for Facebook URL
        fb_url_column = None
        for col in ['Facebook URL', 'Facebook_URL', 'facebook_url', 'FB_URL', 'fb_url', 'Facebook Url']:
            if col in reader.fieldnames:
                fb_url_column = col
                break

        if not fb_url_column:
            print("ERROR: Could not find Facebook URL column")
            print(f"Available columns: {', '.join(reader.fieldnames)}")
            return

        print(f"Using column: {fb_url_column}\n")

        for row in reader:
            try:
                school_id = int(row['ID'])
                fb_url = row.get(fb_url_column, '').strip()

                if not fb_url:
                    skipped_count += 1
                    continue

                # Get school from database
                school = db.query(School).filter(School.id == school_id).first()
                if not school:
                    print(f"WARNING: School ID {school_id} not found")
                    error_count += 1
                    continue

                # Update Facebook URL
                if not school.facebook_url:
                    school.facebook_url = fb_url
                    updated_count += 1
                    print(f"Updated: {school.name} - {fb_url}")
                else:
                    skipped_count += 1
                    print(f"Skipped: {school.name} (already has Facebook URL)")

            except Exception as e:
                print(f"Error processing row: {e}")
                error_count += 1
                continue

    # Commit changes
    db.commit()

    print("\n" + "=" * 70)
    print("IMPORT SUMMARY")
    print("=" * 70)
    print(f"Schools updated: {updated_count}")
    print(f"Schools skipped: {skipped_count}")
    print(f"Errors: {error_count}")
    print("=" * 70)

    if updated_count > 0:
        print(f"\nSUCCESS: {updated_count} Facebook URLs imported!")
    else:
        print("\nNo schools were updated.")

    db.close()


if __name__ == "__main__":
    # You can specify a different filename if needed
    import_facebook_urls()
