
"""
Comprehensive School Seed Script
Adds real Doha schools with detailed information using the enhanced schema
"""

import sys
from pathlib import Path
from datetime import date, datetime

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from db import SessionLocal
from models import School


# Real comprehensive school data for Doha, Qatar
COMPREHENSIVE_SCHOOLS = [
    {
        # 1. GEMS American Academy Qatar (GAAQ)
        "name": "GEMS American Academy Qatar",
        "slug": "gems-american-academy-qatar",
        "type": "International",
        "curriculum": "American",
        "description": "A premier American curriculum school offering education from KG to Grade 12, part of the prestigious GEMS Education network.",
        "address": "Al Wakra, Qatar",
        "area": "Al Wakra",
        "latitude": 25.1750,
        "longitude": 51.6028,
        "contact": "+974 4034 9999",
        "email": "info@gaaq.edu.qa",
        "website": "https://www.gemseducation.com/school/gems-american-academy-qatar",
        "school_timings": "7:30 AM - 2:30 PM",
        "established_year": 2014,
        "status": "published",

        # Academic Information
        "language_of_instruction": ["English"],
        "grade_levels_offered": {
            "KG1": True, "KG2": True, "Year 1": True, "Year 2": True,
            "Year 3": True, "Year 4": True, "Year 5": True, "Year 6": True,
            "Year 7": True, "Year 8": True, "Year 9": True, "Year 10": True,
            "Year 11": True, "Year 12": True
        },
        "ministry_approval_status": "Fully Approved",
        "accreditation_bodies": [
            "Ministry of Education and Higher Education (MOEHE) Qatar",
            "New England Association of Schools and Colleges (NEASC)",
            "Council of International Schools (CIS)"
        ],
        "religious_affiliation": "Islamic Studies Required",

        # Financial Details
        "tuition_fees_by_grade": {
            "KG1": 38000, "KG2": 38000,
            "Year 1": 42000, "Year 2": 42000, "Year 3": 44000,
            "Year 4": 44000, "Year 5": 46000, "Year 6": 46000,
            "Year 7": 48000, "Year 8": 48000, "Year 9": 50000,
            "Year 10": 52000, "Year 11": 52000, "Year 12": 52000
        },
        "registration_fee": 2500.00,
        "registration_fee_refundable": False,
        "deposit_required": 5000.00,
        "deposit_refundable": True,
        "additional_costs": {
            "uniform": 600,
            "books": 1000,
            "technology_fee": 500,
            "activities": 800
        },
        "payment_terms": ["Annual (One Payment)", "Termly (Three Payments)"],
        "accepts_educational_voucher": True,
        "educational_voucher_amount": 28000,
        "corporate_discounts_available": True,
        "sibling_discount_percentage": 10,

        # Facilities
        "facilities": {
            "library": True, "science_lab": True, "computer_lab": True,
            "sports_hall": True, "swimming_pool": True, "football_field": True,
            "basketball_court": True, "playground": True, "cafeteria": True,
            "auditorium": True, "music_room": True, "art_studio": True,
            "prayer_room": True, "medical_room": True
        },
        "technology_integration": {
            "smart_boards": True, "ipads_tablets": True, "student_portal": True,
            "parent_app": True, "digital_library": True, "wifi": True
        },
        "extracurricular_activities": [
            "Football/Soccer", "Basketball", "Swimming", "Athletics/Track & Field",
            "Drama/Theater", "Music (Instrumental)", "Art & Crafts", "Robotics Club",
            "Science Club", "Debate Club"
        ],

        # Special Programs
        "afterschool_care": True,
        "afterschool_care_fee": 1500,
        "afterschool_care_timings": "2:30 PM - 5:00 PM",
        "sen_support": True,
        "sen_programs": {
            "learning_support": True,
            "eal_support": True,
            "dyslexia": True
        },
        "gifted_programs": True,
        "counseling_services": True,

        # Transportation
        "bus_service_available": True,
        "transportation_fee": 1376,
        "transportation_fee_period": "per term",
        "bus_routes": ["Al Wakra", "Mesaieed", "Al Wukair", "Doha"],
        "transportation_safety_features": [
            "Seat Belts in All Buses", "GPS Tracking", "Bus Monitors/Supervisors",
            "CCTV Cameras", "Parent Tracking App"
        ],

        # Admission
        "entry_requirements": "Age-appropriate assessment in English and Mathematics required for all applicants.",
        "application_deadline": date(2026, 3, 31),
        "assessment_procedures": "Written assessment in English and Math, followed by parent interview.",
        "required_documents": [
            "Birth Certificate (Original + Copy)", "Passport Copy (Student)",
            "Qatar ID Copy (Student)", "Previous School Report/Transcript",
            "Immunization Records", "Passport Photos"
        ],
        "age_requirements": {
            "KG1": {"minimum_age": 3, "cutoff_date": "March 31"},
            "KG2": {"minimum_age": 4, "cutoff_date": "March 31"}
        },

        # Performance
        "student_teacher_ratio": "12:1",
        "average_class_size": 20,
        "ministry_inspection_rating": "Very Good",
        "total_students": 2200,
        "total_staff": 185,

        # Status
        "accepting_new_students": True,
        "has_waiting_list": False,
        "application_status": "Accepting Applications"
    },

    {
        # 2. DPS Modern Indian School
        "name": "DPS Modern Indian School",
        "slug": "dps-modern-indian-school",
        "type": "International",
        "curriculum": "Indian (CBSE)",
        "description": "A leading CBSE curriculum school offering quality education to Indian and international students in Qatar.",
        "address": "Street 37, Zone 61, Abu Hamour, Doha, Qatar",
        "area": "Abu Hamour",
        "latitude": 25.2889,
        "longitude": 51.5201,
        "contact": "+974 4466 9090",
        "email": "info@dpsdoha.com",
        "website": "https://www.dpsdoha.com",
        "school_timings": "7:00 AM - 2:00 PM",
        "established_year": 2003,
        "status": "published",

        # Academic Information
        "language_of_instruction": ["English", "Hindi"],
        "grade_levels_offered": {
            "KG1": True, "KG2": True, "Year 1": True, "Year 2": True,
            "Year 3": True, "Year 4": True, "Year 5": True, "Year 6": True,
            "Year 7": True, "Year 8": True, "Year 9": True, "Year 10": True,
            "Year 11": True, "Year 12": True
        },
        "ministry_approval_status": "Fully Approved",
        "accreditation_bodies": [
            "Ministry of Education and Higher Education (MOEHE) Qatar",
            "Central Board of Secondary Education (CBSE) India"
        ],
        "religious_affiliation": "Multi-faith",

        # Financial Details
        "tuition_fees_by_grade": {
            "KG1": 12500, "KG2": 12500,
            "Year 1": 14000, "Year 2": 14000, "Year 3": 15000,
            "Year 4": 15000, "Year 5": 16000, "Year 6": 16000,
            "Year 7": 17000, "Year 8": 17000, "Year 9": 18000,
            "Year 10": 19000, "Year 11": 20000, "Year 12": 20000
        },
        "registration_fee": 1500.00,
        "registration_fee_refundable": False,
        "deposit_required": 3000.00,
        "deposit_refundable": True,
        "additional_costs": {
            "uniform": 400,
            "books": 600,
            "exams": 500,
            "activities": 400
        },
        "payment_terms": ["Annual (One Payment)", "Termly (Three Payments)"],
        "accepts_educational_voucher": True,
        "educational_voucher_amount": 28000,
        "sibling_discount_percentage": 5,

        # Facilities
        "facilities": {
            "library": True, "science_lab": True, "computer_lab": True,
            "sports_hall": True, "football_field": True, "basketball_court": True,
            "playground": True, "cafeteria": True, "auditorium": True,
            "music_room": True, "art_studio": True, "prayer_room": True,
            "medical_room": True
        },
        "technology_integration": {
            "smart_boards": True, "computer_lab": True, "student_portal": True,
            "wifi": True
        },
        "extracurricular_activities": [
            "Cricket", "Football/Soccer", "Basketball", "Dance",
            "Music (Instrumental)", "Art & Crafts", "Science Club",
            "Language Clubs", "Yoga"
        ],

        # Special Programs
        "sen_support": True,
        "sen_programs": {
            "learning_support": True
        },
        "counseling_services": True,

        # Transportation
        "bus_service_available": True,
        "transportation_fee": 1200,
        "transportation_fee_period": "per term",
        "bus_routes": ["Abu Hamour", "Al Sadd", "Najma", "Bin Mahmoud"],

        # Performance
        "student_teacher_ratio": "18:1",
        "average_class_size": 28,
        "ministry_inspection_rating": "Good",
        "total_students": 3500,
        "total_staff": 195,

        # Status
        "accepting_new_students": True,
        "has_waiting_list": True,
        "application_status": "Limited Spaces"
    },

    {
        # 3. Lebanese School Doha
        "name": "Lebanese School Doha",
        "slug": "lebanese-school-doha",
        "type": "International",
        "curriculum": "French",
        "description": "A French curriculum school serving the Lebanese and international community in Qatar.",
        "address": "Al Hilal, Doha, Qatar",
        "area": "Al Hilal",
        "latitude": 25.2722,
        "longitude": 51.5288,
        "contact": "+974 4466 7441",
        "email": "info@lsd.edu.qa",
        "website": "https://www.lsd.edu.qa",
        "school_timings": "7:30 AM - 2:30 PM",
        "established_year": 1976,
        "status": "published",

        # Academic Information
        "language_of_instruction": ["French", "Arabic", "English"],
        "grade_levels_offered": {
            "KG1": True, "KG2": True, "Year 1": True, "Year 2": True,
            "Year 3": True, "Year 4": True, "Year 5": True, "Year 6": True,
            "Year 7": True, "Year 8": True, "Year 9": True, "Year 10": True,
            "Year 11": True, "Year 12": True
        },
        "ministry_approval_status": "Fully Approved",
        "accreditation_bodies": [
            "Ministry of Education and Higher Education (MOEHE) Qatar",
            "French Ministry of Education"
        ],
        "religious_affiliation": "Multi-faith",

        # Financial Details
        "tuition_fees_by_grade": {
            "KG1": 18000, "KG2": 18000,
            "Year 1": 20000, "Year 2": 20000, "Year 3": 22000,
            "Year 4": 22000, "Year 5": 24000, "Year 6": 24000,
            "Year 7": 26000, "Year 8": 26000, "Year 9": 28000,
            "Year 10": 30000, "Year 11": 30000, "Year 12": 30000
        },
        "registration_fee": 2000.00,
        "registration_fee_refundable": False,
        "deposit_required": 4000.00,
        "deposit_refundable": True,
        "payment_terms": ["Annual (One Payment)", "Termly (Three Payments)"],
        "accepts_educational_voucher": True,
        "educational_voucher_amount": 28000,
        "sibling_discount_percentage": 8,

        # Facilities
        "facilities": {
            "library": True, "science_lab": True, "computer_lab": True,
            "sports_hall": True, "football_field": True, "playground": True,
            "cafeteria": True, "auditorium": True, "art_studio": True,
            "prayer_room": True, "medical_room": True
        },
        "technology_integration": {
            "smart_boards": True, "wifi": True
        },
        "extracurricular_activities": [
            "Football/Soccer", "Basketball", "Drama/Theater",
            "Music (Instrumental)", "Art & Crafts", "French Club"
        ],

        # Performance
        "student_teacher_ratio": "15:1",
        "average_class_size": 24,
        "ministry_inspection_rating": "Good",
        "total_students": 1800,
        "total_staff": 120,

        # Status
        "accepting_new_students": True,
        "has_waiting_list": False,
        "application_status": "Accepting Applications"
    },

    {
        # 4. Cedars International School
        "name": "Cedars International School",
        "slug": "cedars-international-school",
        "type": "International",
        "curriculum": "IB (PYP)",
        "description": "An IB World School offering the Primary Years Programme in a nurturing, multicultural environment.",
        "address": "Al Sadd, Doha, Qatar",
        "area": "Al Sadd",
        "latitude": 25.2840,
        "longitude": 51.5159,
        "contact": "+974 4443 1777",
        "email": "admissions@cedars.qa",
        "website": "https://www.cedars.qa",
        "school_timings": "7:30 AM - 2:30 PM",
        "established_year": 2009,
        "status": "published",

        # Academic Information
        "language_of_instruction": ["English"],
        "grade_levels_offered": {
            "KG1": True, "KG2": True, "Year 1": True, "Year 2": True,
            "Year 3": True, "Year 4": True, "Year 5": True, "Year 6": True
        },
        "ministry_approval_status": "Fully Approved",
        "accreditation_bodies": [
            "Ministry of Education and Higher Education (MOEHE) Qatar",
            "International Baccalaureate Organization (IBO)",
            "Council of International Schools (CIS)"
        ],
        "religious_affiliation": "Islamic Studies Optional",

        # Financial Details
        "tuition_fees_by_grade": {
            "KG1": 42000, "KG2": 42000,
            "Year 1": 46000, "Year 2": 46000, "Year 3": 48000,
            "Year 4": 48000, "Year 5": 50000, "Year 6": 50000
        },
        "registration_fee": 3000.00,
        "registration_fee_refundable": False,
        "deposit_required": 6000.00,
        "deposit_refundable": True,
        "additional_costs": {
            "uniform": 700,
            "books": 900,
            "technology_fee": 600,
            "activities": 1000
        },
        "payment_terms": ["Annual (One Payment)", "Termly (Three Payments)"],
        "accepts_educational_voucher": True,
        "educational_voucher_amount": 28000,
        "corporate_discounts_available": True,
        "sibling_discount_percentage": 10,

        # Facilities
        "facilities": {
            "library": True, "science_lab": True, "computer_lab": True,
            "sports_hall": True, "swimming_pool": True, "playground": True,
            "cafeteria": True, "music_room": True, "art_studio": True,
            "prayer_room": True, "medical_room": True
        },
        "technology_integration": {
            "smart_boards": True, "ipads_tablets": True, "student_portal": True,
            "parent_app": True, "wifi": True
        },
        "extracurricular_activities": [
            "Swimming", "Football/Soccer", "Basketball", "Dance",
            "Music (Instrumental)", "Drama/Theater", "Art & Crafts",
            "Robotics Club", "Chess Club"
        ],

        # Special Programs
        "afterschool_care": True,
        "afterschool_care_fee": 1800,
        "sen_support": True,
        "sen_programs": {
            "learning_support": True,
            "eal_support": True
        },
        "counseling_services": True,

        # Transportation
        "bus_service_available": True,
        "transportation_fee": 1376,
        "transportation_fee_period": "per term",

        # Performance
        "student_teacher_ratio": "10:1",
        "average_class_size": 18,
        "ministry_inspection_rating": "Outstanding",
        "total_students": 450,
        "total_staff": 55,

        # Status
        "accepting_new_students": True,
        "has_waiting_list": True,
        "application_status": "Limited Spaces"
    },

    {
        # 5. Al Khor International School
        "name": "Al Khor International School",
        "slug": "al-khor-international-school",
        "type": "International",
        "curriculum": "British",
        "description": "A British curriculum school serving families in the Al Khor region with quality education from Foundation Stage to Year 13.",
        "address": "Al Khor, Qatar",
        "area": "Al Khor",
        "latitude": 25.6803,
        "longitude": 51.4967,
        "contact": "+974 4472 1444",
        "email": "info@akischool.com",
        "website": "https://www.akischool.com",
        "school_timings": "7:30 AM - 2:30 PM",
        "established_year": 2008,
        "status": "published",

        # Academic Information
        "language_of_instruction": ["English"],
        "grade_levels_offered": {
            "KG1": True, "KG2": True, "Year 1": True, "Year 2": True,
            "Year 3": True, "Year 4": True, "Year 5": True, "Year 6": True,
            "Year 7": True, "Year 8": True, "Year 9": True, "Year 10": True,
            "Year 11": True, "Year 12": True, "Year 13": True
        },
        "ministry_approval_status": "Fully Approved",
        "accreditation_bodies": [
            "Ministry of Education and Higher Education (MOEHE) Qatar",
            "Cambridge International Examinations (CIE)"
        ],
        "religious_affiliation": "Islamic Studies Required",

        # Financial Details
        "tuition_fees_by_grade": {
            "KG1": 28000, "KG2": 28000,
            "Year 1": 32000, "Year 2": 32000, "Year 3": 34000,
            "Year 4": 34000, "Year 5": 36000, "Year 6": 36000,
            "Year 7": 38000, "Year 8": 38000, "Year 9": 40000,
            "Year 10": 42000, "Year 11": 42000, "Year 12": 44000
        },
        "registration_fee": 2000.00,
        "registration_fee_refundable": False,
        "deposit_required": 4500.00,
        "deposit_refundable": True,
        "payment_terms": ["Annual (One Payment)", "Termly (Three Payments)"],
        "accepts_educational_voucher": True,
        "educational_voucher_amount": 28000,
        "sibling_discount_percentage": 10,

        # Facilities
        "facilities": {
            "library": True, "science_lab": True, "computer_lab": True,
            "sports_hall": True, "football_field": True, "basketball_court": True,
            "playground": True, "cafeteria": True, "auditorium": True,
            "medical_room": True
        },
        "technology_integration": {
            "smart_boards": True, "wifi": True
        },
        "extracurricular_activities": [
            "Football/Soccer", "Basketball", "Cricket", "Athletics/Track & Field",
            "Drama/Theater", "Art & Crafts"
        ],

        # Special Programs
        "sen_support": True,
        "counseling_services": True,

        # Transportation
        "bus_service_available": True,
        "transportation_fee": 1500,
        "transportation_fee_period": "per term",
        "bus_routes": ["Al Khor", "Ras Laffan", "Simaisma"],

        # Performance
        "student_teacher_ratio": "14:1",
        "average_class_size": 22,
        "ministry_inspection_rating": "Very Good",
        "total_students": 900,
        "total_staff": 75,

        # Status
        "accepting_new_students": True,
        "has_waiting_list": False,
        "application_status": "Accepting Applications"
    }
]


def seed_comprehensive_schools(db: Session):
    """Seed comprehensive school data"""

    # Check existing schools
    existing_schools = db.query(School.name).all()
    existing_names = {school.name for school in existing_schools}

    print(f"[INFO] Found {len(existing_names)} existing schools in database")

    added_count = 0
    skipped_count = 0

    for school_data in COMPREHENSIVE_SCHOOLS:
        if school_data["name"] in existing_names:
            print(f"[SKIP] {school_data['name']} already exists")
            skipped_count += 1
            continue

        # Create school instance
        school = School(**school_data)
        db.add(school)
        added_count += 1
        print(f"[ADD] {school_data['name']}")

    db.commit()

    print(f"\n[SUCCESS] Added {added_count} new schools")
    print(f"[INFO] Skipped {skipped_count} duplicate schools")
    print(f"[INFO] Total schools in database: {db.query(School).count()}")


def main():
    """Main function"""
    print("[INFO] Starting comprehensive school seed...\n")

    db = SessionLocal()

    try:
        seed_comprehensive_schools(db)
        print("\n[SUCCESS] Seed complete!")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
