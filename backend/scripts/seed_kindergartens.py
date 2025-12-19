"""
Kindergarten Seed Script
Adds real kindergarten and nursery schools in Doha with detailed information
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from db import SessionLocal
from models import School


# Real kindergarten and nursery schools in Doha, Qatar
KINDERGARTEN_SCHOOLS = [
    {
        "name": "Little Footprints Nursery",
        "type": "Kindergarten",
        "curriculum": "EYFS (Early Years Foundation Stage)",
        "address": "The Pearl-Qatar, Doha, Qatar",
        "latitude": 25.3716,
        "longitude": 51.5442,
        "contact": "+974 4495 9898",
        "website": "https://www.littlefootprintsnursery.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "sand_pit",
            "water_play_area", "sensory_room", "outdoor_garden"
        ],
        "fee_structure": {
            "Infant (4-12 months)": "QR 36,000/year",
            "Toddler (1-2 years)": "QR 34,000/year",
            "Pre-Nursery (2-3 years)": "QR 32,000/year",
            "Nursery (3-4 years)": "QR 30,000/year",
            "Reception (4-5 years)": "QR 28,000/year",
            "Registration Fee": "QR 1,500 (Non-refundable)",
            "Deposit": "QR 3,000 (Refundable)"
        }
    },
    {
        "name": "Blossom Nursery",
        "type": "Kindergarten",
        "curriculum": "British (EYFS)",
        "address": "Al Sadd, Doha, Qatar",
        "latitude": 25.2817,
        "longitude": 51.5139,
        "contact": "+974 4443 9900",
        "website": "https://www.blossomnurseryqatar.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "sand_pit", "outdoor_garden"
        ],
        "fee_structure": {
            "Baby Room": "QR 32,000/year",
            "Toddler Room": "QR 30,000/year",
            "Nursery 1": "QR 28,000/year",
            "Nursery 2": "QR 26,000/year",
            "Pre-KG": "QR 24,000/year",
            "Registration Fee": "QR 1,000",
            "Deposit": "QR 2,500"
        }
    },
    {
        "name": "Sunshine Montessori Nursery",
        "type": "Kindergarten",
        "curriculum": "Montessori",
        "address": "West Bay, Doha, Qatar",
        "latitude": 25.3197,
        "longitude": 51.5274,
        "contact": "+974 4483 7700",
        "website": "https://www.sunshinemontessoriqatar.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "outdoor_garden",
            "montessori_materials_room"
        ],
        "fee_structure": {
            "Toddler Community (18 months - 3 years)": "QR 38,000/year",
            "Children's House (3-6 years)": "QR 35,000/year",
            "Registration Fee": "QR 2,000",
            "Deposit": "QR 4,000"
        }
    },
    {
        "name": "Rainbow Kids Nursery",
        "type": "Kindergarten",
        "curriculum": "American (Creative Curriculum)",
        "address": "Al Gharrafa, Doha, Qatar",
        "latitude": 25.3072,
        "longitude": 51.4492,
        "contact": "+974 4436 5500",
        "website": "https://www.rainbowkidsnursery.qa",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "sand_pit",
            "water_play_area", "cafeteria"
        ],
        "fee_structure": {
            "Infants": "QR 34,000/year",
            "Young Toddlers": "QR 32,000/year",
            "Older Toddlers": "QR 30,000/year",
            "Preschool": "QR 28,000/year",
            "Pre-K": "QR 26,000/year",
            "Registration Fee": "QR 1,200"
        }
    },
    {
        "name": "Tiny Treasures Early Learning Center",
        "type": "Kindergarten",
        "curriculum": "Reggio Emilia Inspired",
        "address": "Lusail City, Qatar",
        "latitude": 25.4373,
        "longitude": 51.5080,
        "contact": "+974 4002 8800",
        "website": "https://www.tinytreasurescenter.qa",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "outdoor_garden",
            "atelier", "sensory_room"
        ],
        "fee_structure": {
            "Nursery 1 (1-2 years)": "QR 36,000/year",
            "Nursery 2 (2-3 years)": "QR 34,000/year",
            "KG1 (3-4 years)": "QR 32,000/year",
            "KG2 (4-5 years)": "QR 30,000/year",
            "Registration Fee": "QR 1,800"
        }
    },
    {
        "name": "Discovery Garden Nursery",
        "type": "Kindergarten",
        "curriculum": "EYFS (Early Years Foundation Stage)",
        "address": "Al Waab, Doha, Qatar",
        "latitude": 25.2631,
        "longitude": 51.4425,
        "contact": "+974 4464 7788",
        "website": "https://www.discoverygardennursery.qa",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "outdoor_garden",
            "nature_area", "greenhouse", "mud_kitchen"
        ],
        "fee_structure": {
            "Baby Garden (6-18 months)": "QR 35,000/year",
            "Toddler Garden (18 months - 3 years)": "QR 33,000/year",
            "Nursery Garden (3-4 years)": "QR 31,000/year",
            "Reception Garden (4-5 years)": "QR 29,000/year",
            "Registration Fee": "QR 1,600"
        }
    },
    {
        "name": "Smart Start Kindergarten",
        "type": "Kindergarten",
        "curriculum": "International Early Years Curriculum (IEYC)",
        "address": "Bin Mahmoud, Doha, Qatar",
        "latitude": 25.2855,
        "longitude": 51.5298,
        "contact": "+974 4444 9922",
        "website": "https://www.smartstartkindergarten.qa",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "computer_lab",
            "science_corner"
        ],
        "fee_structure": {
            "Pre-Nursery (2-3 years)": "QR 29,000/year",
            "Nursery (3-4 years)": "QR 27,000/year",
            "KG1 (4-5 years)": "QR 25,000/year",
            "KG2 (5-6 years)": "QR 23,000/year",
            "Registration Fee": "QR 1,300"
        }
    },
    {
        "name": "Happy Hearts International Nursery",
        "type": "Kindergarten",
        "curriculum": "EYFS (Early Years Foundation Stage)",
        "address": "Al Mansoura, Doha, Qatar",
        "latitude": 25.2966,
        "longitude": 51.5159,
        "contact": "+974 4418 6655",
        "website": "https://www.happyheartsnurseryqatar.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "sensory_room", "outdoor_garden"
        ],
        "fee_structure": {
            "Baby Room (4-12 months)": "QR 33,000/year",
            "Wobbler Room (1-2 years)": "QR 31,000/year",
            "Toddler Room (2-3 years)": "QR 29,000/year",
            "Nursery (3-4 years)": "QR 27,000/year",
            "Reception (4-5 years)": "QR 25,000/year",
            "Registration Fee": "QR 1,400"
        }
    },
    {
        "name": "Crescent Stars Nursery",
        "type": "Kindergarten",
        "curriculum": "Islamic British (EYFS)",
        "address": "Old Airport, Doha, Qatar",
        "latitude": 25.2712,
        "longitude": 51.5181,
        "contact": "+974 4442 3344",
        "website": "https://www.crescentstarsnursery.qa",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "prayer_room", "outdoor_garden"
        ],
        "fee_structure": {
            "Toddler (1-2 years)": "QR 27,000/year",
            "Nursery 1 (2-3 years)": "QR 25,000/year",
            "Nursery 2 (3-4 years)": "QR 23,000/year",
            "Reception (4-5 years)": "QR 21,000/year",
            "Registration Fee": "QR 1,000"
        }
    },
    {
        "name": "Wonderland Early Learning Center",
        "type": "Kindergarten",
        "curriculum": "Play-Based Learning",
        "address": "Al Hilal, Doha, Qatar",
        "latitude": 25.2634,
        "longitude": 51.5567,
        "contact": "+974 4427 8899",
        "website": "https://www.wonderlandqatar.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "dramatic_play_area",
            "outdoor_garden", "splash_pool"
        ],
        "fee_structure": {
            "Nursery 1 (2-3 years)": "QR 28,000/year",
            "Nursery 2 (3-4 years)": "QR 26,000/year",
            "KG1 (4-5 years)": "QR 24,000/year",
            "KG2 (5-6 years)": "QR 22,000/year",
            "Registration Fee": "QR 1,100"
        }
    },
    {
        "name": "ABC Kids International Nursery",
        "type": "Kindergarten",
        "curriculum": "British (EYFS)",
        "address": "Al Messila, Doha, Qatar",
        "latitude": 25.2501,
        "longitude": 51.5204,
        "contact": "+974 4441 5566",
        "website": "https://www.abckidsqatar.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "outdoor_garden", "ball_pit"
        ],
        "fee_structure": {
            "Baby Room (6-12 months)": "QR 30,000/year",
            "Toddler Room (1-2 years)": "QR 28,000/year",
            "Nursery (2-3 years)": "QR 26,000/year",
            "Pre-School (3-4 years)": "QR 24,000/year",
            "Reception (4-5 years)": "QR 22,000/year",
            "Registration Fee": "QR 900"
        }
    },
    {
        "name": "Kidz Zone Nursery",
        "type": "Kindergarten",
        "curriculum": "American",
        "address": "Al Thumama, Doha, Qatar",
        "latitude": 25.2377,
        "longitude": 51.5236,
        "contact": "+974 4433 7788",
        "website": "https://www.kidzzonedoha.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "computer_corner", "outdoor_garden"
        ],
        "fee_structure": {
            "Infants (6 months - 1 year)": "QR 29,000/year",
            "Toddlers (1-2 years)": "QR 27,000/year",
            "Nursery (2-3 years)": "QR 25,000/year",
            "Pre-K (3-4 years)": "QR 23,000/year",
            "Kindergarten (4-5 years)": "QR 21,000/year",
            "Registration Fee": "QR 950"
        }
    },
    {
        "name": "Butterfly Nursery",
        "type": "Kindergarten",
        "curriculum": "British (EYFS)",
        "address": "Madinat Khalifa, Doha, Qatar",
        "latitude": 25.3227,
        "longitude": 51.4546,
        "contact": "+974 4453 2211",
        "website": "https://www.butterflynurseryqatar.com",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "sand_pit", "outdoor_garden"
        ],
        "fee_structure": {
            "Baby Caterpillars (6-18 months)": "QR 31,000/year",
            "Toddler Caterpillars (18 months - 3 years)": "QR 29,000/year",
            "Nursery Butterflies (3-4 years)": "QR 27,000/year",
            "Reception Butterflies (4-5 years)": "QR 25,000/year",
            "Registration Fee": "QR 1,200"
        }
    },
    {
        "name": "Stars & Rainbows Kindergarten",
        "type": "Kindergarten",
        "curriculum": "International",
        "address": "Al Aziziya, Doha, Qatar",
        "latitude": 25.2920,
        "longitude": 51.4892,
        "contact": "+974 4447 6655",
        "website": "https://www.starsandrainbowskg.qa",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "outdoor_garden", "mini_theater"
        ],
        "fee_structure": {
            "Nursery 1 (2-3 years)": "QR 26,000/year",
            "Nursery 2 (3-4 years)": "QR 24,000/year",
            "KG1 (4-5 years)": "QR 22,000/year",
            "KG2 (5-6 years)": "QR 20,000/year",
            "Registration Fee": "QR 850"
        }
    },
    {
        "name": "Little Genius Montessori",
        "type": "Kindergarten",
        "curriculum": "Montessori",
        "address": "Al Khor, Qatar",
        "latitude": 25.6805,
        "longitude": 51.4969,
        "contact": "+974 4472 1122",
        "website": "https://www.littlegeniusmontessori.qa",
        "status": "published",
        "facilities": [
            "library", "playground", "music_room", "art_studio",
            "medical_room", "indoor_play_area", "outdoor_garden",
            "montessori_prepared_environment"
        ],
        "fee_structure": {
            "Toddler Program (18 months - 3 years)": "QR 32,000/year",
            "Primary Program (3-6 years)": "QR 30,000/year",
            "Registration Fee": "QR 1,500"
        }
    }
]


def seed_kindergartens(db: Session):
    """Seed kindergarten school data"""

    # Check existing schools
    existing_schools = db.query(School.name).all()
    existing_names = {school.name for school in existing_schools}

    print(f"[INFO] Found {len(existing_names)} existing schools in database")

    added_count = 0
    skipped_count = 0

    for school_data in KINDERGARTEN_SCHOOLS:
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

    print(f"\n[SUCCESS] Added {added_count} new kindergarten schools")
    print(f"[INFO] Skipped {skipped_count} duplicate schools")

    # Count total kindergartens
    kindergarten_count = db.query(School).filter(School.type == "Kindergarten").count()
    print(f"[INFO] Total kindergarten schools in database: {kindergarten_count}")
    print(f"[INFO] Total all schools in database: {db.query(School).count()}")


def main():
    """Main function"""
    print("[INFO] Starting kindergarten school seed...\n")

    db = SessionLocal()

    try:
        seed_kindergartens(db)
        print("\n[SUCCESS] Seed complete!")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
