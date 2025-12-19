"""
Extract data from Google Maps using Google Places API
More reliable than web scraping, requires API key

Get free API key: https://console.cloud.google.com/apis/credentials
Free tier: 28,000 requests/month (more than enough for 433 schools)
"""

import sys
import os
import csv
import time
import requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School


# Set your Google Places API key here or in environment variable
GOOGLE_API_KEY = os.getenv('GOOGLE_PLACES_API_KEY', '')


def search_place_by_name(school_name, api_key):
    """
    Search for a place using Google Places Text Search API
    """
    try:
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {
            'query': f"{school_name} Doha Qatar",
            'key': api_key
        }

        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if data['status'] == 'OK' and len(data['results']) > 0:
            return data['results'][0]  # Return first result
        else:
            print(f"  WARNING: No results found - {data.get('status', 'UNKNOWN')}")
            return None

    except Exception as e:
        print(f"  ERROR: {e}")
        return None


def get_place_details(place_id, api_key):
    """
    Get detailed information about a place using Place Details API
    """
    try:
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            'place_id': place_id,
            'fields': 'name,formatted_address,formatted_phone_number,international_phone_number,website,geometry,rating,user_ratings_total',
            'key': api_key
        }

        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if data['status'] == 'OK':
            return data['result']
        else:
            print(f"  WARNING: Could not get details - {data.get('status', 'UNKNOWN')}")
            return None

    except Exception as e:
        print(f"  ERROR: {e}")
        return None


def update_school_from_google_api(db, school_id, school_name, api_key):
    """
    Update a school with data from Google Places API
    """
    try:
        print(f"\nProcessing: {school_name} (ID: {school_id})")
    except UnicodeEncodeError:
        print(f"\nProcessing: [School name with special characters] (ID: {school_id})")

    # Get school from database
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        print(f"  ERROR: School ID {school_id} not found in database")
        return False, "not_found"

    # Search for the place
    print(f"  Searching Google Places...")
    place = search_place_by_name(school_name, api_key)

    if not place:
        return False, "no_results"

    # Get detailed information
    place_id = place.get('place_id')
    try:
        print(f"  Found place: {place.get('name', 'Unknown')}")
    except UnicodeEncodeError:
        print(f"  Found place: [Name with special characters]")
    print(f"  Getting details...")

    details = get_place_details(place_id, api_key)

    if not details:
        return False, "no_details"

    # Update school with extracted data
    updated_fields = []

    # Phone number
    phone = details.get('formatted_phone_number') or details.get('international_phone_number')
    if phone:
        if not school.contact or school.contact == 'Not specified':
            school.contact = phone
            updated_fields.append('phone')
            print(f"  + Phone: {phone}")

    # Website
    website = details.get('website')
    if website:
        if not school.website:
            school.website = website
            updated_fields.append('website')
            print(f"  + Website: {website}")

    # Address
    address = details.get('formatted_address')
    if address:
        if not school.address or school.address == 'Doha, Qatar':
            school.address = address
            updated_fields.append('address')
            try:
                print(f"  + Address: {address}")
            except UnicodeEncodeError:
                print(f"  + Address: [Arabic text - {len(address)} chars]")

    # Coordinates
    geometry = details.get('geometry', {})
    location = geometry.get('location', {})
    if location:
        lat = location.get('lat')
        lng = location.get('lng')
        if lat and lng:
            if not school.latitude:
                school.latitude = lat
                updated_fields.append('latitude')
            if not school.longitude:
                school.longitude = lng
                updated_fields.append('longitude')
            print(f"  + Coordinates: {lat}, {lng}")

    if updated_fields:
        print(f"  SUCCESS: Updated {len(updated_fields)} fields")
        return True, "success"
    else:
        print(f"  SKIPPED: No new data to update")
        return False, "no_updates"


def process_all_schools_with_api(api_key):
    """
    Process all schools from the CSV file using Google Places API
    """
    if not api_key:
        print("ERROR: Google Places API key is required!")
        print("\nTo get an API key:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a new project or select existing")
        print("3. Enable 'Places API'")
        print("4. Create credentials (API Key)")
        print("5. Set environment variable: GOOGLE_PLACES_API_KEY")
        print("\nOr edit this script and set GOOGLE_API_KEY variable")
        return

    db = SessionLocal()

    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        'schools_clickable_google_maps.csv'
    )

    if not os.path.exists(csv_path):
        print(f"ERROR: CSV file not found at {csv_path}")
        return

    print("=" * 70)
    print("GOOGLE PLACES API DATA EXTRACTION")
    print("=" * 70)
    print(f"Reading from: {csv_path}")
    print(f"API Key: {api_key[:10]}...{api_key[-5:]}")
    print()

    stats = {
        'total': 0,
        'success': 0,
        'no_results': 0,
        'no_details': 0,
        'no_updates': 0,
        'not_found': 0
    }

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            stats['total'] += 1
            school_id = int(row['ID'])
            school_name = row['School Name']

            success, status = update_school_from_google_api(db, school_id, school_name, api_key)

            stats[status] = stats.get(status, 0) + 1

            # Commit every 10 schools
            if stats['total'] % 10 == 0:
                db.commit()
                print(f"\n  --- Progress: {stats['total']} schools processed ---\n")

            # Small delay to respect API rate limits
            time.sleep(0.5)

    # Final commit
    db.commit()

    print("\n" + "=" * 70)
    print("EXTRACTION SUMMARY")
    print("=" * 70)
    print(f"Total schools processed: {stats['total']}")
    print(f"Successfully updated: {stats['success']}")
    print(f"Skipped (no updates needed): {stats['no_updates']}")
    print(f"No results found: {stats['no_results']}")
    print(f"Could not get details: {stats['no_details']}")
    print(f"School not in database: {stats['not_found']}")
    print("=" * 70)

    if stats['success'] > 0:
        print(f"\nSUCCESS: {stats['success']} schools updated with Google data!")
    else:
        print("\nWARNING: No schools were updated.")

    db.close()


if __name__ == "__main__":
    print("\nGoogle Places API Extractor")
    print("=" * 70)

    # Check for API key from command line argument, environment variable, or prompt
    if len(sys.argv) > 1:
        api_key = sys.argv[1].strip()
    else:
        api_key = GOOGLE_API_KEY or input("Enter your Google Places API key: ").strip()

    if not api_key:
        print("\nERROR: API key is required to proceed.")
        sys.exit(1)

    print("\nStarting extraction...")
    process_all_schools_with_api(api_key)
