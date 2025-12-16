"""
Seed script to populate the database with realistic school data for Doha, Qatar
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db import SessionLocal, engine, Base
import models
import json

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

schools_data = [
    {
        "name": "Doha College",
        "curriculum": "British",
        "type": "All-through",
        "address": "Al Wajba St, Doha, Qatar",
        "contact": "+974 4460 1600",
        "website": "https://www.dohacollege.com",
        "photos": [],
        "facilities": ["Swimming Pool", "Science Labs", "Sports Facilities", "Library", "Theater", "Music Rooms"],
        "fee_structure": {
            "Year 1-2": "45,000 QAR",
            "Year 3-6": "52,000 QAR",
            "Year 7-9": "58,000 QAR",
            "Year 10-11": "62,000 QAR",
            "Year 12-13": "65,000 QAR"
        },
        "status": "published",
        "latitude": 25.2854,
        "longitude": 51.5310
    },
    {
        "name": "American School of Doha",
        "curriculum": "American",
        "type": "All-through",
        "address": "Al Bustan St, Doha, Qatar",
        "contact": "+974 4459 1500",
        "website": "https://www.asd.edu.qa",
        "photos": [],
        "facilities": ["Olympic Pool", "Athletics Track", "Technology Center", "Performing Arts Center", "Cafeteria"],
        "fee_structure": {
            "KG": "48,000 QAR",
            "Elementary": "55,000 QAR",
            "Middle School": "62,000 QAR",
            "High School": "68,000 QAR"
        },
        "status": "published",
        "latitude": 25.3548,
        "longitude": 51.5310
    },
    {
        "name": "Compass International School",
        "curriculum": "IB",
        "type": "All-through",
        "address": "Doha, Qatar",
        "contact": "+974 4034 1444",
        "website": "https://www.compass.edu.qa",
        "photos": [],
        "facilities": ["STEAM Lab", "Design Technology", "Sports Complex", "Swimming Pool", "Art Studios"],
        "fee_structure": {
            "Early Years": "42,000 QAR",
            "Primary": "50,000 QAR",
            "Secondary": "58,000 QAR",
            "Diploma": "64,000 QAR"
        },
        "status": "published",
        "latitude": 25.3200,
        "longitude": 51.4800
    },
    {
        "name": "Qatar Academy Doha",
        "curriculum": "IB",
        "type": "All-through",
        "address": "Luqta St, Doha, Qatar",
        "contact": "+974 4459 1111",
        "website": "https://www.qad.qf.org.qa",
        "photos": [],
        "facilities": ["Olympic Facilities", "Makerspaces", "Innovation Hub", "Libraries", "Auditorium"],
        "fee_structure": {
            "PYP": "FREE (Qatari Citizens)",
            "MYP": "FREE (Qatari Citizens)",
            "DP": "FREE (Qatari Citizens)"
        },
        "status": "published",
        "latitude": 25.3180,
        "longitude": 51.4340
    },
    {
        "name": "Doha English Speaking School",
        "curriculum": "British",
        "type": "All-through",
        "address": "Doha, Qatar",
        "contact": "+974 4460 0567",
        "website": "https://www.dess.edu.qa",
        "photos": [],
        "facilities": ["25m Pool", "Astroturf Pitch", "Science Labs", "ICT Suites", "Music Department"],
        "fee_structure": {
            "Foundation-Year 2": "43,000 QAR",
            "Year 3-6": "48,000 QAR",
            "Year 7-9": "54,000 QAR",
            "Year 10-11": "58,000 QAR",
            "Year 12-13": "61,000 QAR"
        },
        "status": "published",
        "latitude": 25.2600,
        "longitude": 51.5500
    },
    {
        "name": "Birla Public School",
        "curriculum": "Indian",
        "type": "All-through",
        "address": "Al Wakra, Qatar",
        "contact": "+974 4431 5151",
        "website": "https://www.birlaqatar.com",
        "photos": [],
        "facilities": ["Computer Labs", "Science Labs", "Sports Ground", "Library", "Auditorium"],
        "fee_structure": {
            "KG": "8,000 QAR",
            "Primary": "11,000 QAR",
            "Middle": "13,000 QAR",
            "Secondary": "15,000 QAR"
        },
        "status": "published",
        "latitude": 25.1713,
        "longitude": 51.6064
    },
    {
        "name": "Lycée Voltaire",
        "curriculum": "French",
        "type": "All-through",
        "address": "West Bay, Doha, Qatar",
        "contact": "+974 4483 1600",
        "website": "https://www.lycee-voltaire-doha.com",
        "photos": [],
        "facilities": ["Media Center", "Science Labs", "Sports Facilities", "Theater", "Cafeteria"],
        "fee_structure": {
            "Maternelle": "35,000 QAR",
            "Primaire": "38,000 QAR",
            "Collège": "42,000 QAR",
            "Lycée": "45,000 QAR"
        },
        "status": "published",
        "latitude": 25.3200,
        "longitude": 51.5300
    },
    {
        "name": "Qatar International School",
        "curriculum": "IB",
        "type": "All-through",
        "address": "Al Waab St, Doha, Qatar",
        "contact": "+974 4434 0121",
        "website": "https://www.qis.edu.qa",
        "photos": [],
        "facilities": ["Swimming Pool", "Sports Hall", "IT Labs", "Music Rooms", "Science Labs"],
        "fee_structure": {
            "Early Years": "40,000 QAR",
            "Primary": "46,000 QAR",
            "Middle Years": "52,000 QAR",
            "Diploma": "58,000 QAR"
        },
        "status": "published",
        "latitude": 25.2540,
        "longitude": 51.4448
    },
    {
        "name": "Park House English School",
        "curriculum": "British",
        "type": "Primary",
        "address": "Al Dafna, West Bay, Doha",
        "contact": "+974 4459 1234",
        "website": "https://www.parkhouseschool.com",
        "photos": [],
        "facilities": ["Indoor Pool", "Sports Facilities", "ICT Suite", "Library", "Art Room"],
        "fee_structure": {
            "Foundation": "39,000 QAR",
            "Year 1-2": "41,000 QAR",
            "Year 3-6": "44,000 QAR"
        },
        "status": "published",
        "latitude": 25.3200,
        "longitude": 51.5360
    },
    {
        "name": "Newton International School",
        "curriculum": "British",
        "type": "All-through",
        "address": "Al Waab, Doha, Qatar",
        "contact": "+974 4436 4433",
        "website": "https://www.newtonschool.edu.qa",
        "photos": [],
        "facilities": ["Swimming Pool", "Indoor Sports Hall", "Science Labs", "Computer Labs", "Library"],
        "fee_structure": {
            "FS1-FS2": "36,000 QAR",
            "Year 1-2": "38,000 QAR",
            "Year 3-6": "42,000 QAR",
            "Year 7-9": "47,000 QAR",
            "Year 10-11": "51,000 QAR",
            "Year 12-13": "54,000 QAR"
        },
        "status": "published",
        "latitude": 25.2543,
        "longitude": 51.4432
    },
    {
        "name": "SEK International School Qatar",
        "curriculum": "IB",
        "type": "All-through",
        "address": "Al Rayyan, Qatar",
        "contact": "+974 4477 0000",
        "website": "https://www.sek.edu.qa",
        "photos": [],
        "facilities": ["Olympic Pool", "Sports Complex", "Theater", "Science Labs", "Art Studios"],
        "fee_structure": {
            "Infant": "44,000 QAR",
            "Primary": "49,000 QAR",
            "Secondary": "56,000 QAR",
            "Baccalaureate": "62,000 QAR"
        },
        "status": "published",
        "latitude": 25.2867,
        "longitude": 51.4418
    },
    {
        "name": "DeBakey High School for Health Professions",
        "curriculum": "American",
        "type": "Secondary",
        "address": "Education City, Doha",
        "contact": "+974 4454 0400",
        "website": "https://www.deBakey.edu.qa",
        "photos": [],
        "facilities": ["Medical Simulation Labs", "Research Center", "Sports Facilities", "Library", "Cafeteria"],
        "fee_structure": {
            "Grade 9-12": "FREE (Qatari Citizens)"
        },
        "status": "published",
        "latitude": 25.3170,
        "longitude": 51.4370
    },
    {
        "name": "The Cambridge School",
        "curriculum": "British",
        "type": "All-through",
        "address": "Al Wakra, Qatar",
        "contact": "+974 4476 3330",
        "website": "https://www.cambridgeschool.edu.qa",
        "photos": [],
        "facilities": ["Sports Ground", "Computer Labs", "Science Labs", "Library", "Auditorium"],
        "fee_structure": {
            "Foundation": "32,000 QAR",
            "Key Stage 1": "34,000 QAR",
            "Key Stage 2": "37,000 QAR",
            "Key Stage 3": "42,000 QAR",
            "Key Stage 4-5": "46,000 QAR"
        },
        "status": "published",
        "latitude": 25.1700,
        "longitude": 51.6050
    },
    {
        "name": "Ideal Indian School",
        "curriculum": "Indian",
        "type": "All-through",
        "address": "Al Wakra, Qatar",
        "contact": "+974 4464 8555",
        "website": "https://www.idealschoolqatar.com",
        "photos": [],
        "facilities": ["Computer Labs", "Science Labs", "Sports Facilities", "Library", "Auditorium"],
        "fee_structure": {
            "KG": "7,500 QAR",
            "Primary": "10,500 QAR",
            "Middle": "12,000 QAR",
            "Secondary": "14,000 QAR"
        },
        "status": "published",
        "latitude": 25.1680,
        "longitude": 51.6100
    },
    {
        "name": "Gulf English School",
        "curriculum": "British",
        "type": "All-through",
        "address": "Muraikh, Doha, Qatar",
        "contact": "+974 4460 0621",
        "website": "https://www.ges.edu.qa",
        "photos": [],
        "facilities": ["Swimming Pool", "Sports Facilities", "ICT Labs", "Library", "Music Rooms"],
        "fee_structure": {
            "Foundation": "37,000 QAR",
            "Primary": "40,000 QAR",
            "Secondary": "46,000 QAR",
            "Sixth Form": "50,000 QAR"
        },
        "status": "published",
        "latitude": 25.2700,
        "longitude": 51.5200
    }
]

def seed_schools():
    db: Session = SessionLocal()
    try:
        # Check if schools already exist
        existing_count = db.query(models.School).count()
        if existing_count > 0:
            print(f"[SKIP] Database already has {existing_count} schools. Skipping seed.")
            print("To re-seed, delete existing schools first.")
            return

        print("[SEED] Seeding schools...")

        for school_data in schools_data:
            # Convert lists and dicts to JSON strings for storage
            school = models.School(
                name=school_data["name"],
                curriculum=school_data["curriculum"],
                type=school_data["type"],
                address=school_data["address"],
                contact=school_data.get("contact"),
                website=school_data.get("website"),
                photos=school_data.get("photos", []),
                facilities=school_data.get("facilities", []),
                fee_structure=school_data.get("fee_structure", {}),
                status=school_data["status"],
                latitude=school_data.get("latitude"),
                longitude=school_data.get("longitude")
            )
            db.add(school)
            print(f"  [+] Added: {school.name}")

        db.commit()
        print(f"\n[SUCCESS] Successfully seeded {len(schools_data)} schools!")
        print("\nSchools by curriculum:")
        curricula = {}
        for school in schools_data:
            curr = school["curriculum"]
            curricula[curr] = curricula.get(curr, 0) + 1
        for curr, count in curricula.items():
            print(f"  - {curr}: {count} schools")

    except Exception as e:
        print(f"[ERROR] Error seeding schools: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_schools()
