"""
Extract data from Google Maps URLs and update schools in database

This script reads the CSV with Google Maps URLs and extracts:
- Phone numbers
- Addresses
- Coordinates (latitude/longitude)
- Website URLs
- Business information

Using web scraping approach (no API key needed)
"""

import sys
import os
import csv
import time
import requests
from urllib.parse import quote, unquote
import re
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School


def extract_place_id_from_search(search_url, school_name):
    """
    Extract Google Maps place data from a search URL
    Note: This is a simplified version. Google Maps heavily relies on JavaScript.
    """
    try:
        # Add headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        response = requests.get(search_url, headers=headers, timeout=10)

        if response.status_code != 200:
            return None

        # Extract basic information from the page
        content = response.text

        data = {
            'found': False,
            'phone': None,
            'address': None,
            'website': None,
            'latitude': None,
            'longitude': None,
            'notes': []
        }

        # Try to extract phone number
        phone_patterns = [
            r'\+974[\s-]?\d{4}[\s-]?\d{4}',
            r'\(\+974\)[\s-]?\d{4}[\s-]?\d{4}',
            r'974[\s-]?\d{4}[\s-]?\d{4}',
            r'\d{4}[\s-]?\d{4}'
        ]

        for pattern in phone_patterns:
            matches = re.findall(pattern, content)
            if matches:
                data['phone'] = matches[0]
                data['found'] = True
                break

        # Try to extract coordinates from URL
        coord_match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', content)
        if coord_match:
            data['latitude'] = float(coord_match.group(1))
            data['longitude'] = float(coord_match.group(2))
            data['found'] = True

        # Try to extract website
        website_pattern = r'https?://(?:www\.)?([a-zA-Z0-9-]+\.(?:com|edu|org|net|qa))'
        websites = re.findall(website_pattern, content)
        # Filter out google/youtube/facebook
        for site in websites:
            if not any(x in site.lower() for x in ['google', 'youtube', 'facebook', 'gstatic']):
                data['website'] = 'https://www.' + site
                data['found'] = True
                break

        return data

    except Exception as e:
        print(f"Error extracting data: {e}")
        return None


def update_school_from_maps_data(db, school_id, school_name, maps_url):
    """
    Update a school with data extracted from Google Maps
    """
    print(f"\nProcessing: {school_name} (ID: {school_id})")

    # Get school from database
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        print(f"  ERROR: School ID {school_id} not found in database")
        return False

    # Extract data from Google Maps
    print(f"  Fetching data from Google Maps...")
    data = extract_place_id_from_search(maps_url, school_name)

    if not data or not data['found']:
        print(f"  WARNING: Could not extract data from Google Maps")
        print(f"  URL: {maps_url}")
        return False

    # Update school with extracted data
    updated_fields = []

    if data['phone'] and not school.contact:
        school.contact = data['phone']
        updated_fields.append('phone')

    if data['website'] and not school.website:
        school.website = data['website']
        updated_fields.append('website')

    if data['latitude'] and not school.latitude:
        school.latitude = data['latitude']
        updated_fields.append('latitude')

    if data['longitude'] and not school.longitude:
        school.longitude = data['longitude']
        updated_fields.append('longitude')

    if updated_fields:
        print(f"  UPDATED: {', '.join(updated_fields)}")
        return True
    else:
        print(f"  SKIPPED: No new data to update")
        return False


def process_all_schools():
    """
    Process all schools from the CSV file
    """
    db = SessionLocal()

    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        'schools_clickable_google_maps.csv'
    )

    if not os.path.exists(csv_path):
        print(f"ERROR: CSV file not found at {csv_path}")
        return

    print("=" * 70)
    print("GOOGLE MAPS DATA EXTRACTION")
    print("=" * 70)
    print(f"Reading from: {csv_path}")
    print()

    updated_count = 0
    failed_count = 0
    total_count = 0

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            total_count += 1
            school_id = int(row['ID'])
            school_name = row['School Name']
            maps_url = row['Google_Maps_URL']

            success = update_school_from_maps_data(db, school_id, school_name, maps_url)

            if success:
                updated_count += 1
            else:
                failed_count += 1

            # Be polite to Google's servers - wait between requests
            time.sleep(2)

            # Commit every 10 schools
            if total_count % 10 == 0:
                db.commit()
                print(f"\n  Progress: {total_count} schools processed...")

    # Final commit
    db.commit()

    print("\n" + "=" * 70)
    print("EXTRACTION SUMMARY")
    print("=" * 70)
    print(f"Total schools processed: {total_count}")
    print(f"Successfully updated: {updated_count}")
    print(f"Failed/Skipped: {failed_count}")
    print("=" * 70)

    if updated_count > 0:
        print("\nData has been successfully extracted and imported!")
    else:
        print("\nWARNING: No schools were updated.")
        print("This could be because:")
        print("1. All schools already have the data")
        print("2. Google Maps blocked the requests")
        print("3. The URLs don't contain extractable data")

    db.close()


if __name__ == "__main__":
    print("\nNOTE: Google Maps extraction via web scraping has limitations:")
    print("- May be blocked by Google")
    print("- Results may vary")
    print("- Slower than API")
    print("\nFor best results, consider using Google Places API.")
    print("\nStarting extraction in 3 seconds...")
    time.sleep(3)

    process_all_schools()
