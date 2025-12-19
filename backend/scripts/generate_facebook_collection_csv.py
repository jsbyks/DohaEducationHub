"""
Generate a CSV file for manual Facebook data collection
"""

import sys
import os
import csv
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School


def generate_csv():
    """Generate CSV file for Facebook data collection"""
    db = SessionLocal()

    schools = db.query(School).order_by(School.name).all()

    output_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        'schools_facebook_collection.csv'
    )

    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)

        # Write header
        writer.writerow([
            'ID',
            'School Name',
            'Type',
            'Curriculum',
            'Current Address',
            'Current Contact',
            'Current Website',
            'Status',
            'Facebook URL',
            'Facebook Phone',
            'Facebook Email',
            'Facebook Address',
            'Facebook About/Description',
            'Facebook Verified (Yes/No)',
            'Facebook Followers',
            'Notes',
            'Completed (Yes/No)'
        ])

        # Write school rows
        for school in schools:
            writer.writerow([
                school.id,
                school.name,
                school.type or '',
                school.curriculum or '',
                school.address or '',
                school.contact or '',
                school.website or '',
                school.status,
                '',  # Facebook URL
                '',  # Facebook Phone
                '',  # Facebook Email
                '',  # Facebook Address
                '',  # Facebook About/Description
                '',  # Facebook Verified
                '',  # Facebook Followers
                '',  # Notes
                ''   # Completed
            ])

    print(f"Generated CSV file: {output_path}")
    print(f"Total schools: {len(schools)}")
    print(f"\nYou can now:")
    print(f"1. Open the CSV in Excel or Google Sheets")
    print(f"2. Search for each school on Facebook")
    print(f"3. Fill in the Facebook information columns")
    print(f"4. Mark 'Completed' column as 'Yes' when done")
    print(f"5. Save the file when finished")
    print(f"\nAfter filling in the data, we'll create an import script to update the database.")

    db.close()


if __name__ == "__main__":
    generate_csv()
