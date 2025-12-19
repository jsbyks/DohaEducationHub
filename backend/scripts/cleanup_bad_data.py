"""
Clean up incorrect data from failed web scraping
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School

def cleanup_bad_data():
    """Remove incorrect phone numbers and websites"""
    db = SessionLocal()

    print("=" * 70)
    print("CLEANING UP BAD DATA FROM WEB SCRAPING")
    print("=" * 70)

    # Find schools with bad data
    bad_phone_schools = db.query(School).filter(School.contact == '20251209').all()
    bad_website_schools = db.query(School).filter(School.website == 'https://www.schema.org').all()

    print(f"\nFound {len(bad_phone_schools)} schools with incorrect phone number (20251209)")
    print(f"Found {len(bad_website_schools)} schools with incorrect website (schema.org)")

    # Clean up bad phone numbers
    for school in bad_phone_schools:
        school.contact = None
        print(f"Cleared phone for: {school.name}")

    # Clean up bad websites
    for school in bad_website_schools:
        school.website = None
        print(f"Cleared website for: {school.name}")

    # Commit changes
    db.commit()

    print("\n" + "=" * 70)
    print("CLEANUP COMPLETE")
    print("=" * 70)
    print(f"Cleared {len(bad_phone_schools)} incorrect phone numbers")
    print(f"Cleared {len(bad_website_schools)} incorrect websites")
    print("\nThe web scraping method didn't work reliably.")
    print("RECOMMENDATION: Use Google Places API method instead for accurate data.")
    print("=" * 70)

    db.close()

if __name__ == "__main__":
    cleanup_bad_data()
