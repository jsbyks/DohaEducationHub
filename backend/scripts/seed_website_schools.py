"""
Seed schools from schoolsinqatar.net website
This script adds schools that exist on the website but not in our database
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from db import SessionLocal
from models import School

# Complete list of 325 schools from schoolsinqatar.net
WEBSITE_SCHOOLS = [
    "Academyati School",
    "Knowledge Icon KG",
    "Tunisian Kindergarten of Doha",
    "A.B.C 123 Private Kindergarten",
    "ACS Doha International School – Al Gharrafa",
    "Ajyal Kindergarten Qatar",
    "Al Aasria Kindergarten",
    "Vantage International Kindergarten",
    "Spectra Global School",
    "Al Forsan International School",
    "Turkish School",
    "Al Jazeera Academy",
    "Al Joud International Kindergarten",
    "Al khazamaa Private kindergarten",
    "Al Khor International Kindergarten",
    "Al Khor International-British Stream (Qatar Gas)",
    "Al Khor International School-Indian Stream (Qatar Gas)",
    "Al Maha Academy for Boys",
    "Al Manar International School -Al Thameed",
    "Al Nebras International Preschool – The Montessori Way",
    "Al Noor Language KG – Nuaija",
    "Al Oud Al Akhdar International Kindergarten",
    "Al Oud Al Akhdar International School and Kindergarten",
    "Al Rayyan Al Jadeed Secondary Girls School",
    "Al Redwan Kindergarten",
    "AL ROYAL CROWN SCHOOL",
    "Al Tamakon Comprehensive School",
    "Al Watan – Kindergarten Primary – Mixed",
    "Al Andalus Private Kindergarten",
    "Al-Andalus – Prep Sec – Boys",
    "Al Andalus Primary Boys School",
    "Al Andalus Private Girls School",
    "Al Arqam Academy for Girls- Abu Hamour",
    "Young Achievers Montessori Kindergarten",
    "Young Achievers International School",
    "Alashbal International School – Ain Khaled",
    "Alashbal Preparatory international school",
    "Al Bashaer Private Kindergarten",
    "Al Bateel International School",
    "Al Bustan Private Kindergarten",
    "Aldiaa International Kindergarten",
    "Aleabqarii Alsaghir International Kindergarten",
    "Al Faisal Kindergarten",
    "Al Faisel Private Kindergarten",
    "New Dawn KG",
    "Al Fallah Private Boys School",
    "AlFatat AlMuslima Prep-Girls",
    "Al Fatat AlMuslima Girls School",
    "Al-Furqan Private Prep – Boys",
    "Al Furqan Private Boys School",
    "Al Furqan Private Secondary School",
    "AlHammad International Developed Kindergarten",
    "Al Hammad Int'l Developed School",
    "Al Hayat Universal School",
    "AlJeel AlJadeed – KG – Mixed",
    "The Next Generation School – Al Wakra",
    "The Next Generation School – Al Wukair",
    "Aljeel Alqadem Private school- Rawdat Alhamama",
    "Aljeel Alqadem Private School- Al Wakra",
    "Aljeelalqadem Private kindergarten – almashaf",
    "Aljeelalqadem Private School-Ain khaled",
    "AlKhulud Language – KG – Mixed",
    "Alkoon academy International / ALMasrouhiya Branch",
    "Pearl School – West Bay",
    "Al Madina International School- Al Wakra",
    "Al Maha Academy for Girls",
    "Al Mahd International School",
    "Al Manar International School – Al Maamoura",
    "Al Manar International School – Al Dafna",
    "Al Manar International School – Al Sadd",
    "Al-Mujtama – Prep Sec – Girls",
    "Al Noor Language School – Al Waab",
    "Al Noor Language Schools Kindergarten Al Waab",
    "Al Numan Private Kindergarten",
    "Alpha Cambridge School",
    "Alresalah Private Kindergarten",
    "Alreyada International Kindergarten",
    "Al Salam Private Kindergarten",
    "ALSanafer Kindergarten",
    "Alshoumoukh Academy lilemtiyaz Alduwaliya",
    "Al Talayea Kindergarten",
    "Altamayoz kindergarten",
    "Altefil Alaneeq Kindergarten",
    "Al Thuraya Kindergarten",
    "AWIS – Al Wataniya International School",
    "Jasmine Private Kindergarten",
    "Alyasameen private Kindergarten – Al Kheesa",
    "Al Zahra Private Kindergarten",
    "Alzitoon International Primary Preparatory Secondary-Althumama",
    "Alzitoon International School – Umm Salal Branch",
    "Alzitoon private kindergarten",
    "Alzitoon private school",
    "American Academy School – Old Airport",
    "American Academy School – Al Thumama",
    "American Academy Kindergarten – Al Maamoura",
    "Amjad International Academy",
    "Arab International Academy",
    "Atfal Alghad Primary School",
    "Awfaz Global School – Al Dafna",
    "Awfaz Global School – Al Duhail",
    "Awfaz Global School – Izghawa",
    "Awsaj Academy",
    "Bangladesh MHM School & College",
    "Baraim Al Aqsa Kindergarten",
    "Baraim Al-Khur – KG – Mixed",
    "BELGRAVIA HIGH SCHOOL",
    "Beta Cambridge School",
    "Beverly Hills International School",
    "Bhavan's Public School-New Salata",
    "Bhavan's Public School-Airport",
    "Bhavan's Public School-Al Wakra",
    "Birla Public Primary School – Nuaija",
    "Birla Public School – Mesaimeer",
    "Birla Public School Kindergarten",
    "BIRMINGHAM INTERNATIONAL KINDERGARTEN",
    "Blyth Academy",
    "Bright Future Int'l School- British Stream",
    "Bright Horizon International Kindergarten",
    "Brighton International Academy",
    "British Modern International School",
    "Cairo Private School – Boys",
    "Cairo Kindergarten and Primary private School",
    "Cairo Preparatory Private School – Al-Wakra Branch",
    "Cairo Private Kindergarten",
    "Cairo Private Kindergarten – Muaither Branch",
    "Cairo Private School – Girls",
    "Cambridge International School",
    "Cardiff International Kindergarten",
    "Cardiff International Primary School",
    "Compass International School-Madinat Khalifa",
    "Compass International School Doha – Rayyan Campus",
    "Compass Int'l School-Gharaffa",
    "COMPASS INTERNATIONAL SCHOOL- THEMAID",
    "Creative International Kindergarten",
    "Dafna International Kindergarten",
    "Danat Al Shamal Kindergarten",
    "Michael E. DeBakey High School",
    "Doha Academy Salwa",
    "Doha British School – Ain Khaled Campus",
    "Doha British School – Al Wakra",
    "Doha College – Al Wajba",
    "Doha English Speaking School – DESS",
    "Doha International School",
    "Doha International Academy – Alwaab",
    "Doha International Private School – Kindergarten Primary",
    "Doha Modern Indian School",
    "DPS Modern Indian School",
    "Dukhan English School (Qatar Petroleum)",
    "Durham School for Girls Doha",
    "Eadad International Academy",
    "EBLA INTERNATIONAL PRIMARY SCHOOL",
    "Ebla International School – Luqta",
    "Ebla International School – Adults",
    "Ebla International School – Al Luqta Branch",
    "Edison International Academy – Dahl Alhamam",
    "Edison Int'l Academy – Markheya",
    "Edison International Academy-Muaither",
    "Educare International Academy",
    "Egyptian Language School",
    "Elite International School",
    "English Modern Kindergarten",
    "The English Kindergarten (TEK) – Qatar",
    "ETHIOPIAN COMMUNITY INTERNATIONAL SCHOOL – DOHA",
    "Eyalna Kindergarten",
    "Eyalna Private Kindergarten – Almuaither Branch",
    "Finger Prints Kindergarten",
    "French Qatarian School (Lycee Voltaire) West Bay",
    "Galileo International School",
    "GEMS American Academy",
    "German School Doha",
    "Gheras International School",
    "Global Academy International",
    "Glorious International Kindergarten",
    "Gulf English School prep",
    "Hamilton International School",
    "Haql Al Rabee Kindergarten – Al Matar",
    "Haql Al Rabee Kindergarten – Al Wakra",
    "Haql Al Rabee Primary School",
    "Hilltop Kindergarten",
    "Ideal Indian School",
    "International Pakistani School",
    "International Pakistani School -KG Pri Prep Sec-Mixed-Adults",
    "Iqra English Preschool – KG – Mixed",
    "Iqra English Boys School",
    "Iqra English Girls",
    "Iqra English Preschool – Al Nuaija",
    "Iranian School – Prep Sec – Adults",
    "Iranian School for Boys",
    "Iranian School for Girls",
    "Iranian School – Primary, Preparatory and Secondary – Girls",
    "Iranian School Kindergarten Primary-Adults",
    "Itqan International Academy",
    "Jil Almustaqbal Kindergarten",
    "Jordanian School – KG Pri Prep Sec – Adults",
    "Jordanian School",
    "Key of Education School",
    "Kid'n Around Kindergarten",
    "King's College Doha",
    "Kingdom -Kindrgarten – Mixed",
    "Knowledge Bridge International Kindergarten",
    "Leaders International School",
    "leaders international kindergarten",
    "Lebanese School",
    "Lebanese School AlHitmi AlQadeem Branch",
    "Little Flower Kindergarten – Qatar",
    "Little Panda's Kindergarten – Doha",
    "London International PrivateSchool-KinPriPreSecMix",
    "Lotus Private Kindergarten",
    "Loydence Academy – Al Aziziyah",
    "Loyola International School",
    "Loyola international School – Al Wukair Branch",
    "Lycee Bonaparte School-Al Dafna",
    "Lycee Franco- Qatarien Voltaire -salwa",
    "Lycee Franco-Qatarien Voltaire",
    "M.E.S Indian School",
    "Maghreb international kindergarten",
    "Maghreb International School – Ecole Charlemange",
    "Medad Kindergarten",
    "Mesaieed International School – Primary",
    "Mesaieed International School Private-KG-Mix",
    "Mesaieed International School (Qatar Petroleum)",
    "Middle East International School",
    "Military Secondary School",
    "Doha Minaret English Kindergarten",
    "Monarch International School",
    "Mueidhar Al Hadeetha Private Kindergarten",
    "My Little World Kindegrten",
    "Naiseb Private Kindergarten",
    "Newton British School – Rawdat Bu Dabah",
    "Newton British Academy – Al Mashaf",
    "Newton British Academy- Al Dafna",
    "Newton British kindergarten – Oryx",
    "Newton British kindergarten – Pearl",
    "Newton British School – Muraikh",
    "Newton International School- Al Hilal",
    "Newton International Academy",
    "Newton International Kindergarten",
    "Newton International Kindergarten-1-Oryx",
    "Newton International Kindergarten-2-Pearl",
    "Newton International School – West Bay",
    "Newton International School – Alqitifia",
    "Noble Indian Kindergarten",
    "Noble International School preparatory",
    "Noble International School-Alwaker",
    "Noble International School",
    "NooN International Kindergarten",
    "Noor Al Khaleej International Kindergarten",
    "Noor Al Khaleej International School",
    "Noor Al Khaleej International KG- Duhail",
    "Nord Anglia International School- Al Khor",
    "Nort Star International Kindergarten",
    "Olive International Kindergarten -Khartyat Branch",
    "Oryx International School (Qatar Airways)",
    "Oscar English Kindergarten",
    "Oscar Academy",
    "Oscar Private Kindergarten – Abu Hamour Branch",
    "Oxford English School",
    "Pak Shama School and College",
    "Pak Shama Kindergarten – almashaf Branch",
    "Pak Shama Kindergarten – Al-Wakra",
    "Pakshama Private school-almashaf",
    "Palestinian Schools – Boys Girls -Adults",
    "Palestinian School – Boys",
    "Park House English School",
    "Pearl School – Al Thumama",
    "Pearling Season International School",
    "Perfection International Kindergarten",
    "Philippine International School",
    "Philippine School of Doha – Evening",
    "Philippine School of Doha",
    "Pioneers International Kindergarten",
    "Premier Schools International Qatar",
    "Qatar Academy – Alkhor",
    "Qatar Academy Al Wakra",
    "Qatar Academy for Science & Technology-QAST",
    "Qatar Academy Mushaireb",
    "Qatar Academy Private-KG Pri Prep Sec-Mixed",
    "Qatar Academy Sidra",
    "Qatar Al-Hadeetha – KG – Mixed",
    "Qatar Finland International School",
    "Qatar International School",
    "Qatar Leadership Academy",
    "Qurtoba Kindergarten",
    "Qurtoba International Kindergarten – Al Wajbah Branch",
    "Rajagiri Public School in Doha",
    "Renad Academy",
    "Richmond International School Doha",
    "Rising Stars kindergarten",
    "Robin Kindergarten",
    "Royal Grammar School",
    "Royal International School",
    "Ruad Almustaqbal International Kindergarten",
    "The Scholars International School",
    "Spanish School Qatar",
    "Shakespeare Academy international",
    "ShantiNiketan Indian School",
    "Sherborne School – Al Rayyan",
    "Step One School",
    "Sudanese Community Schools – Girls",
    "Summit Academy Kindergarten",
    "Summit Academy",
    "Swiss International School",
    "Tariq Bin Ziyad Boys School",
    "American School of Doha",
    "The Cambridge School",
    "English Modern School Al Khor",
    "English Modern School-Al Wakra",
    "English Modern School-Doha",
    "The First Assalam School",
    "The First Assalam School-Adults",
    "The Gulf English School",
    "The Gulf English School – Freij Bin Omran Branch",
    "The International School of Choueifat",
    "The Japan School of Doha",
    "Tunisian kindegarten izghwa branch",
    "Tunisian Primary School – Abu Hamour",
    "Tunisian Secondary School – Al Luqta",
    "Unique Kindergarten",
    "Versailles International Kindergarten",
    "Victory International Kindergarten",
    "Vila Kinder Welt Kindergarten",
    "Vision International school",
    "Zenith Heights kindergarten",
    "Zenith Heights Academy",
]


def normalize_name(name: str) -> str:
    """Normalize school name for comparison"""
    return name.lower().strip().replace("-", " ").replace("–", " ").replace("  ", " ")


def seed_website_schools(db: Session):
    """Seed schools from website that don't exist in database"""

    # Get existing school names
    existing_schools = db.query(School.name).all()
    existing_names_normalized = {normalize_name(school.name) for school in existing_schools}

    print(f"[INFO] Found {len(existing_names_normalized)} existing schools in database")
    print(f"[INFO] Website has {len(WEBSITE_SCHOOLS)} schools")

    added_count = 0
    skipped_count = 0

    for school_name in WEBSITE_SCHOOLS:
        normalized = normalize_name(school_name)

        if normalized in existing_names_normalized:
            skipped_count += 1
            continue

        # Determine school type based on name
        name_lower = school_name.lower()
        if "kindergarten" in name_lower or "kg" in name_lower or "preschool" in name_lower:
            school_type = "Kindergarten"
        elif "primary" in name_lower:
            school_type = "Primary"
        elif "secondary" in name_lower or "prep" in name_lower:
            school_type = "Secondary"
        else:
            school_type = "All-through"

        # Create basic school entry
        school = School(
            name=school_name,
            type=school_type,
            status="published",
            address="Doha, Qatar"  # Default address
        )

        db.add(school)
        added_count += 1
        print(f"[ADD] {school_name} ({school_type})")

    db.commit()

    print(f"\n[SUCCESS] Added {added_count} new schools from website")
    print(f"[INFO] Skipped {skipped_count} existing schools")
    print(f"[INFO] Total schools in database: {len(existing_names_normalized) + added_count}")


def main():
    """Main function"""
    print("[INFO] Starting website schools seed...\n")

    db = SessionLocal()

    try:
        seed_website_schools(db)
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
