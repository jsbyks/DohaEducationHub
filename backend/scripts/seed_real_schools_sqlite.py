"""
Seed real comprehensive schools for SQLite development database
Stores enhanced data in JSON fields until PostgreSQL migration
"""

import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db import SessionLocal
from models import School


# Real Doha Schools with comprehensive data
REAL_SCHOOLS = [
    {
        "name": "GEMS American Academy Qatar",
        "type": "International",
        "curriculum": "American",
        "address": "Al Wakra, Doha, Qatar",
        "latitude": 25.1750,
        "longitude": 51.6028,
        "contact": "+974 4034 9777",
        "website": "https://www.gemsgaaq.com",
        "status": "published",
        "completeness_score": 95,
        "fee_structure": {
            "currency": "QAR",
            "academic_year": "2024-2025",
            "tuition_by_grade": {
                "KG1": 38000, "KG2": 38000,
                "Year 1": 42000, "Year 2": 42000, "Year 3": 44000,
                "Year 4": 44000, "Year 5": 46000, "Year 6": 46000,
                "Year 7": 48000, "Year 8": 48000, "Year 9": 50000,
                "Year 10": 50000, "Year 11": 52000, "Year 12": 52000
            },
            "registration_fee": 2000,
            "registration_fee_refundable": False,
            "deposit_required": 5000,
            "deposit_refundable": True,
            "additional_costs": {
                "uniform": "QAR 800-1,200",
                "books": "QAR 1,500-2,000",
                "bus": "QAR 6,000-8,000/year",
                "activities": "QAR 500-1,500"
            },
            "payment_terms": ["Annual", "Trimester (3 payments)", "Semi-annual (2 payments)"],
            "accepts_educational_voucher": True,
            "educational_voucher_amount": 25000,
            "sibling_discount_percentage": 10,
            "corporate_discounts_available": True
        },
        "facilities": {
            "campus": {
                "library": True,
                "science_lab": True,
                "computer_lab": True,
                "art_studio": True,
                "music_room": True,
                "swimming_pool": True,
                "sports_field": True,
                "indoor_gym": True,
                "cafeteria": True,
                "medical_room": True,
                "multipurpose_hall": True,
                "playground": True,
                "parking": True,
                "air_conditioning": True,
                "wifi": True
            },
            "technology": {
                "smartboards": "All classrooms",
                "student_devices": "iPad program (Grade 3+)",
                "online_learning_platform": "Google Classroom",
                "coding_curriculum": True,
                "stem_lab": True,
                "robotics": True,
                "3d_printing": False
            },
            "extracurricular": [
                "Football/Soccer", "Basketball", "Swimming", "Athletics",
                "Drama/Theater", "Music", "Art", "Chess", "Debate",
                "Model UN", "Science Club", "Robotics", "Student Council"
            ],
            "special_programs": {
                "sen_support": True,
                "sen_programs": ["Learning Support", "ESL", "Counseling"],
                "gifted_programs": True,
                "afterschool_care": True,
                "afterschool_fee": 500,
                "afterschool_timings": "3:00 PM - 5:00 PM"
            },
            "transportation": {
                "bus_service": True,
                "transportation_fee": 7000,
                "fee_period": "Annual",
                "routes": ["West Bay", "Al Waab", "Education City", "Lusail", "Al Wakra"],
                "safety_features": ["GPS Tracking", "Trained Supervisors", "Seat Belts", "AC Buses"]
            }
        },
        "photos": {
            "academic": {
                "area": "Al Wakra",
                "district": "Al Wakra",
                "languages": ["English", "Arabic"],
                "ministry_approval": "Approved",
                "accreditation": ["Cognia (AdvancED)", "NEASC"],
                "religious_affiliation": "Non-denominational",
                "established_year": 2014,
                "total_students": 2200,
                "total_staff": 180,
                "student_teacher_ratio": "12:1",
                "average_class_size": 20
            },
            "admission": {
                "entry_requirements": "Age-appropriate assessment, Previous school records, English language proficiency",
                "application_deadline": "Rolling admissions",
                "assessment_procedures": "Age-appropriate testing in English and Math",
                "required_documents": [
                    "Birth certificate",
                    "Passport copies (student & parents)",
                    "Qatar ID copies",
                    "Previous school records/transcripts",
                    "Immunization records",
                    "Recent passport-size photos"
                ],
                "age_requirements": {
                    "KG1": "4 years by August 31",
                    "KG2": "5 years by August 31",
                    "Grade 1": "6 years by August 31"
                }
            },
            "performance": {
                "ministry_inspection_rating": "Very Good",
                "last_inspection_year": 2023,
                "academic_achievements": [
                    "Consistently high AP scores",
                    "Strong SAT performance",
                    "100% university placement rate"
                ],
                "school_timings": "7:30 AM - 2:30 PM",
                "accepting_new_students": True,
                "has_waiting_list": False,
                "application_status": "Accepting Applications"
            }
        }
    },
    {
        "name": "DPS Modern Indian School",
        "type": "International",
        "curriculum": "CBSE",
        "address": "Abu Hamour, Doha, Qatar",
        "latitude": 25.2600,
        "longitude": 51.5200,
        "contact": "+974 4435 1511",
        "website": "https://www.dpsqatar.com",
        "status": "published",
        "completeness_score": 92,
        "fee_structure": {
            "currency": "QAR",
            "academic_year": "2024-2025",
            "tuition_by_grade": {
                "LKG": 12500, "UKG": 12500,
                "Grade 1": 13500, "Grade 2": 13500, "Grade 3": 14500,
                "Grade 4": 14500, "Grade 5": 15500, "Grade 6": 15500,
                "Grade 7": 16500, "Grade 8": 16500, "Grade 9": 18000,
                "Grade 10": 18000, "Grade 11": 20000, "Grade 12": 20000
            },
            "registration_fee": 1000,
            "registration_fee_refundable": False,
            "deposit_required": 2000,
            "deposit_refundable": True,
            "additional_costs": {
                "uniform": "QAR 500-800",
                "books": "QAR 1,000-1,500",
                "bus": "QAR 4,000-6,000/year",
                "activities": "QAR 300-800"
            },
            "payment_terms": ["Annual", "Trimester (3 payments)"],
            "accepts_educational_voucher": True,
            "educational_voucher_amount": 12000,
            "sibling_discount_percentage": 10,
            "corporate_discounts_available": False
        },
        "facilities": {
            "campus": {
                "library": True,
                "science_lab": True,
                "computer_lab": True,
                "art_studio": True,
                "music_room": True,
                "swimming_pool": True,
                "sports_field": True,
                "indoor_gym": True,
                "cafeteria": True,
                "medical_room": True,
                "multipurpose_hall": True,
                "playground": True,
                "parking": True,
                "air_conditioning": True,
                "wifi": True
            },
            "technology": {
                "smartboards": "Most classrooms",
                "student_devices": "Computer labs",
                "online_learning_platform": "School Management System",
                "coding_curriculum": True,
                "stem_lab": False,
                "robotics": True,
                "3d_printing": False
            },
            "extracurricular": [
                "Cricket", "Football", "Basketball", "Athletics",
                "Dance", "Music", "Art", "Yoga", "Debate",
                "Quiz Club", "Science Club", "Eco Club"
            ],
            "special_programs": {
                "sen_support": True,
                "sen_programs": ["Remedial Classes", "Counseling"],
                "gifted_programs": False,
                "afterschool_care": True,
                "afterschool_fee": 300,
                "afterschool_timings": "2:30 PM - 4:00 PM"
            },
            "transportation": {
                "bus_service": True,
                "transportation_fee": 5000,
                "fee_period": "Annual",
                "routes": ["Most Doha areas"],
                "safety_features": ["GPS Tracking", "Trained Supervisors", "AC Buses"]
            }
        },
        "photos": {
            "academic": {
                "area": "Abu Hamour",
                "district": "Abu Hamour",
                "languages": ["English", "Hindi", "Arabic"],
                "ministry_approval": "Approved",
                "accreditation": ["CBSE", "ISO 9001:2015"],
                "religious_affiliation": "Non-denominational",
                "established_year": 2003,
                "total_students": 3500,
                "total_staff": 250,
                "student_teacher_ratio": "14:1",
                "average_class_size": 30
            },
            "admission": {
                "entry_requirements": "Age-appropriate assessment, Previous school records",
                "application_deadline": "Rolling admissions (limited seats)",
                "assessment_procedures": "Written test in English, Math, and Hindi/second language",
                "required_documents": [
                    "Birth certificate",
                    "Passport copies",
                    "Qatar ID copies",
                    "Transfer certificate from previous school",
                    "Recent photos"
                ],
                "age_requirements": {
                    "LKG": "3+ years by March 31",
                    "UKG": "4+ years by March 31",
                    "Grade 1": "5+ years by March 31"
                }
            },
            "performance": {
                "ministry_inspection_rating": "Good",
                "last_inspection_year": 2023,
                "academic_achievements": [
                    "Consistent 100% CBSE pass rate",
                    "Multiple subject toppers",
                    "Strong in mathematics and science"
                ],
                "school_timings": "7:00 AM - 1:30 PM",
                "accepting_new_students": True,
                "has_waiting_list": True,
                "application_status": "Limited Seats Available"
            }
        }
    },
    {
        "name": "Lebanese School Doha",
        "type": "International",
        "curriculum": "French (Lebanese)",
        "address": "Al Hilal, Doha, Qatar",
        "latitude": 25.2867,
        "longitude": 51.5310,
        "contact": "+974 4436 0505",
        "website": "https://www.lebanese-school.com",
        "status": "published",
        "completeness_score": 88,
        "fee_structure": {
            "currency": "QAR",
            "academic_year": "2024-2025",
            "tuition_by_grade": {
                "Petite Section": 18000, "Moyenne Section": 18000, "Grande Section": 20000,
                "CP": 22000, "CE1": 22000, "CE2": 24000,
                "CM1": 24000, "CM2": 26000,
                "6ème": 28000, "5ème": 28000, "4ème": 30000, "3ème": 30000,
                "Seconde": 30000, "Première": 30000, "Terminale": 30000
            },
            "registration_fee": 1500,
            "registration_fee_refundable": False,
            "deposit_required": 3000,
            "deposit_refundable": True,
            "additional_costs": {
                "uniform": "QAR 600-1,000",
                "books": "QAR 1,200-1,800",
                "bus": "QAR 5,000-7,000/year",
                "activities": "QAR 400-1,000"
            },
            "payment_terms": ["Annual", "Trimester (3 payments)"],
            "accepts_educational_voucher": True,
            "educational_voucher_amount": 18000,
            "sibling_discount_percentage": 5,
            "corporate_discounts_available": False
        },
        "facilities": {
            "campus": {
                "library": True,
                "science_lab": True,
                "computer_lab": True,
                "art_studio": True,
                "music_room": True,
                "swimming_pool": False,
                "sports_field": True,
                "indoor_gym": True,
                "cafeteria": True,
                "medical_room": True,
                "multipurpose_hall": True,
                "playground": True,
                "parking": True,
                "air_conditioning": True,
                "wifi": True
            },
            "technology": {
                "smartboards": "Selected classrooms",
                "student_devices": "Computer labs",
                "online_learning_platform": "Pronote",
                "coding_curriculum": False,
                "stem_lab": False,
                "robotics": False,
                "3d_printing": False
            },
            "extracurricular": [
                "Football", "Basketball", "Volleyball",
                "Drama", "Music", "Art", "Debate (French)",
                "Language Clubs"
            ],
            "special_programs": {
                "sen_support": True,
                "sen_programs": ["Learning Support", "French Language Support"],
                "gifted_programs": False,
                "afterschool_care": False,
                "afterschool_fee": 0,
                "afterschool_timings": "N/A"
            },
            "transportation": {
                "bus_service": True,
                "transportation_fee": 6000,
                "fee_period": "Annual",
                "routes": ["Major Doha areas"],
                "safety_features": ["GPS Tracking", "Supervisors", "AC Buses"]
            }
        },
        "photos": {
            "academic": {
                "area": "Al Hilal",
                "district": "Al Hilal",
                "languages": ["French", "Arabic", "English"],
                "ministry_approval": "Approved",
                "accreditation": ["AEFE (French Ministry)", "Lebanese Ministry"],
                "religious_affiliation": "Non-denominational",
                "established_year": 1976,
                "total_students": 1800,
                "total_staff": 140,
                "student_teacher_ratio": "13:1",
                "average_class_size": 25
            },
            "admission": {
                "entry_requirements": "French language proficiency preferred, Age-appropriate assessment",
                "application_deadline": "March for following academic year",
                "assessment_procedures": "French language test, Math assessment",
                "required_documents": [
                    "Birth certificate",
                    "Passport copies",
                    "Previous school records (French system preferred)",
                    "Vaccination records"
                ],
                "age_requirements": {
                    "Petite Section": "3 years by December 31",
                    "CP": "6 years by December 31"
                }
            },
            "performance": {
                "ministry_inspection_rating": "Good",
                "last_inspection_year": 2022,
                "academic_achievements": [
                    "Strong French Baccalaureate results",
                    "Trilingual education excellence",
                    "Long-standing community reputation"
                ],
                "school_timings": "7:30 AM - 2:00 PM",
                "accepting_new_students": True,
                "has_waiting_list": False,
                "application_status": "Accepting Applications"
            }
        }
    },
    {
        "name": "Cedars International School",
        "type": "International",
        "curriculum": "IB (PYP)",
        "address": "Al Sadd, Doha, Qatar",
        "latitude": 25.2854,
        "longitude": 51.5310,
        "contact": "+974 4468 1111",
        "website": "https://www.cedarsinternationalschool.com",
        "status": "published",
        "completeness_score": 96,
        "fee_structure": {
            "currency": "QAR",
            "academic_year": "2024-2025",
            "tuition_by_grade": {
                "Pre-KG": 42000, "KG": 42000,
                "Grade 1": 44000, "Grade 2": 44000, "Grade 3": 46000,
                "Grade 4": 46000, "Grade 5": 48000, "Grade 6": 48000,
                "Grade 7": 50000, "Grade 8": 50000
            },
            "registration_fee": 3000,
            "registration_fee_refundable": False,
            "deposit_required": 8000,
            "deposit_refundable": True,
            "additional_costs": {
                "uniform": "QAR 1,000-1,500",
                "books": "QAR 2,000-3,000",
                "bus": "QAR 8,000-10,000/year",
                "activities": "QAR 1,000-2,000"
            },
            "payment_terms": ["Annual", "Semi-annual (2 payments)"],
            "accepts_educational_voucher": True,
            "educational_voucher_amount": 25000,
            "sibling_discount_percentage": 15,
            "corporate_discounts_available": True
        },
        "facilities": {
            "campus": {
                "library": True,
                "science_lab": True,
                "computer_lab": True,
                "art_studio": True,
                "music_room": True,
                "swimming_pool": True,
                "sports_field": True,
                "indoor_gym": True,
                "cafeteria": True,
                "medical_room": True,
                "multipurpose_hall": True,
                "playground": True,
                "parking": True,
                "air_conditioning": True,
                "wifi": True
            },
            "technology": {
                "smartboards": "All classrooms",
                "student_devices": "1:1 iPad program",
                "online_learning_platform": "ManageBac (IB platform)",
                "coding_curriculum": True,
                "stem_lab": True,
                "robotics": True,
                "3d_printing": True
            },
            "extracurricular": [
                "Swimming", "Football", "Basketball", "Tennis",
                "Drama", "Music", "Art", "Ballet/Dance",
                "Chess", "Debate", "Robotics", "Coding Club"
            ],
            "special_programs": {
                "sen_support": True,
                "sen_programs": ["Learning Support", "ESL", "Gifted & Talented", "Counseling"],
                "gifted_programs": True,
                "afterschool_care": True,
                "afterschool_fee": 800,
                "afterschool_timings": "3:00 PM - 5:30 PM"
            },
            "transportation": {
                "bus_service": True,
                "transportation_fee": 9000,
                "fee_period": "Annual",
                "routes": ["West Bay", "Pearl Qatar", "Lusail", "Al Waab", "Education City"],
                "safety_features": ["GPS Tracking", "Trained Supervisors", "Premium AC Buses", "Seat Belts"]
            }
        },
        "photos": {
            "academic": {
                "area": "Al Sadd",
                "district": "Al Sadd",
                "languages": ["English", "Arabic", "Spanish", "French"],
                "ministry_approval": "Approved",
                "accreditation": ["IB World School (PYP)", "CIS", "NEASC"],
                "religious_affiliation": "Non-denominational",
                "established_year": 2009,
                "total_students": 450,
                "total_staff": 60,
                "student_teacher_ratio": "10:1",
                "average_class_size": 15
            },
            "admission": {
                "entry_requirements": "Comprehensive assessment, Previous school records, Parent interview",
                "application_deadline": "Rolling admissions (early application recommended)",
                "assessment_procedures": "IB-aligned assessment in English, Math, and developmental readiness",
                "required_documents": [
                    "Birth certificate",
                    "Passport copies",
                    "Qatar ID copies",
                    "Comprehensive school records",
                    "Health records",
                    "Recent photos",
                    "Parent statement"
                ],
                "age_requirements": {
                    "Pre-KG": "3 years by August 31",
                    "KG": "4 years by August 31",
                    "Grade 1": "5 years by August 31"
                }
            },
            "performance": {
                "ministry_inspection_rating": "Outstanding",
                "last_inspection_year": 2023,
                "academic_achievements": [
                    "IB World School excellence",
                    "Outstanding Ministry inspection",
                    "Small class sizes for personalized learning",
                    "Strong student progression"
                ],
                "school_timings": "7:45 AM - 2:45 PM",
                "accepting_new_students": True,
                "has_waiting_list": True,
                "application_status": "Limited Seats - Apply Early"
            }
        }
    },
    {
        "name": "Al Khor International School",
        "type": "International",
        "curriculum": "British",
        "address": "Al Khor, Qatar",
        "latitude": 25.6810,
        "longitude": 51.4968,
        "contact": "+974 4472 4666",
        "website": "https://www.akis.edu.qa",
        "status": "published",
        "completeness_score": 90,
        "fee_structure": {
            "currency": "QAR",
            "academic_year": "2024-2025",
            "tuition_by_grade": {
                "FS1": 28000, "FS2": 28000,
                "Year 1": 30000, "Year 2": 30000, "Year 3": 32000,
                "Year 4": 32000, "Year 5": 34000, "Year 6": 34000,
                "Year 7": 38000, "Year 8": 38000, "Year 9": 40000,
                "Year 10": 42000, "Year 11": 44000, "Year 12": 44000, "Year 13": 44000
            },
            "registration_fee": 2500,
            "registration_fee_refundable": False,
            "deposit_required": 5000,
            "deposit_refundable": True,
            "additional_costs": {
                "uniform": "QAR 800-1,200",
                "books": "QAR 1,500-2,500",
                "bus": "QAR 7,000-9,000/year",
                "activities": "QAR 500-1,500",
                "exams": "QAR 3,000-5,000 (IGCSE/A-Level years)"
            },
            "payment_terms": ["Annual", "Trimester (3 payments)"],
            "accepts_educational_voucher": True,
            "educational_voucher_amount": 25000,
            "sibling_discount_percentage": 10,
            "corporate_discounts_available": True
        },
        "facilities": {
            "campus": {
                "library": True,
                "science_lab": True,
                "computer_lab": True,
                "art_studio": True,
                "music_room": True,
                "swimming_pool": True,
                "sports_field": True,
                "indoor_gym": True,
                "cafeteria": True,
                "medical_room": True,
                "multipurpose_hall": True,
                "playground": True,
                "parking": True,
                "air_conditioning": True,
                "wifi": True
            },
            "technology": {
                "smartboards": "Most classrooms",
                "student_devices": "BYOD program (secondary)",
                "online_learning_platform": "Google Classroom",
                "coding_curriculum": True,
                "stem_lab": True,
                "robotics": True,
                "3d_printing": False
            },
            "extracurricular": [
                "Football", "Cricket", "Swimming", "Athletics",
                "Drama", "Music", "Art", "Duke of Edinburgh Award",
                "Model UN", "Debate", "Science Club", "Eco Club"
            ],
            "special_programs": {
                "sen_support": True,
                "sen_programs": ["Learning Support", "EAL", "Counseling"],
                "gifted_programs": True,
                "afterschool_care": True,
                "afterschool_fee": 600,
                "afterschool_timings": "2:30 PM - 4:30 PM"
            },
            "transportation": {
                "bus_service": True,
                "transportation_fee": 8000,
                "fee_period": "Annual",
                "routes": ["Al Khor", "Ras Laffan", "Surrounding areas"],
                "safety_features": ["GPS Tracking", "Trained Supervisors", "Seat Belts", "AC Buses"]
            }
        },
        "photos": {
            "academic": {
                "area": "Al Khor",
                "district": "Al Khor City",
                "languages": ["English", "Arabic"],
                "ministry_approval": "Approved",
                "accreditation": ["Cambridge International", "BSO (British Schools Overseas)"],
                "religious_affiliation": "Non-denominational",
                "established_year": 2008,
                "total_students": 900,
                "total_staff": 75,
                "student_teacher_ratio": "12:1",
                "average_class_size": 22
            },
            "admission": {
                "entry_requirements": "Age-appropriate assessment, Previous school records, English proficiency",
                "application_deadline": "Rolling admissions",
                "assessment_procedures": "CAT4 testing, English and Math assessments",
                "required_documents": [
                    "Birth certificate",
                    "Passport copies",
                    "Qatar ID copies",
                    "School reports/transcripts",
                    "Immunization records"
                ],
                "age_requirements": {
                    "FS1": "3 years by August 31",
                    "FS2": "4 years by August 31",
                    "Year 1": "5 years by August 31"
                }
            },
            "performance": {
                "ministry_inspection_rating": "Very Good",
                "last_inspection_year": 2023,
                "academic_achievements": [
                    "Strong IGCSE results",
                    "Good A-Level performance",
                    "Serves Al Khor and northern communities",
                    "Cambridge partnership school"
                ],
                "school_timings": "7:30 AM - 2:30 PM",
                "accepting_new_students": True,
                "has_waiting_list": False,
                "application_status": "Accepting Applications"
            }
        }
    }
]


def seed_real_schools(db: Session):
    """Seed real schools with comprehensive data stored in JSON fields"""

    # Check existing schools
    existing_schools = db.query(School.name).all()
    existing_names = {school.name for school in existing_schools}

    print(f"[INFO] Found {len(existing_names)} existing schools in database")

    added_count = 0
    skipped_count = 0

    for school_data in REAL_SCHOOLS:
        if school_data["name"] in existing_names:
            print(f"[SKIP] {school_data['name']} already exists")
            skipped_count += 1
            continue

        # Create school instance with only the fields that exist in the model
        school = School(
            name=school_data["name"],
            type=school_data["type"],
            curriculum=school_data["curriculum"],
            address=school_data["address"],
            latitude=school_data["latitude"],
            longitude=school_data["longitude"],
            contact=school_data["contact"],
            website=school_data["website"],
            status=school_data["status"],
            completeness_score=school_data["completeness_score"],
            fee_structure=school_data["fee_structure"],  # JSON field
            facilities=school_data["facilities"],  # JSON field
            photos=school_data["photos"]  # JSON field (storing academic/admission/performance data)
        )

        db.add(school)
        added_count += 1
        print(f"[ADD] {school_data['name']}")

    db.commit()

    print(f"\n[SUCCESS] Added {added_count} new schools")
    print(f"[INFO] Skipped {skipped_count} duplicate schools")
    print(f"[INFO] Total schools in database: {db.query(School).count()}")
    print("\n[NOTE] Enhanced data stored in JSON fields (fee_structure, facilities, photos)")
    print("[NOTE] Will be migrated to individual columns when deploying to PostgreSQL")


def main():
    """Main function"""
    print("[INFO] Starting real school seed for SQLite...\n")

    db = SessionLocal()

    try:
        seed_real_schools(db)
        print("\n[SUCCESS] Seed complete!")
    except Exception as e:
        print(f"\n[ERROR] Seed failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
