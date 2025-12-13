import argparse
import csv
import os
import sys
import re

# Ensure backend package imports work when running script directly
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from db import SessionLocal, Base, engine
import crud, schemas, models
from rapidfuzz import process, fuzz
from scripts.data_quality import calculate_completeness_score


CSV_PATH = os.path.join(os.path.dirname(__file__), "sample_schools.csv")


# Validation regex patterns
EMAIL_PATTERN = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
QATAR_PHONE_PATTERN = re.compile(r"^(\+974|00974|974)?[\s-]?[3456]\d{3}[\s-]?\d{4}$")


def validate_email(email: str) -> bool:
    """Validate email format using regex."""
    if not email:
        return True  # Email is optional
    return bool(EMAIL_PATTERN.match(email.strip()))


def validate_qatar_phone(phone: str) -> bool:
    """Validate Qatar phone number format."""
    if not phone:
        return True  # Phone is optional
    return bool(QATAR_PHONE_PATTERN.match(phone.strip()))


def validate_required_fields(name: str, address: str) -> tuple[bool, str]:
    """
    Validate required fields are present and non-empty.

    Returns:
        (is_valid, error_message)
    """
    if not name or name.strip() == "":
        return False, "Name is required"
    if not address or address.strip() == "":
        return False, "Address is required"
    return True, ""


def validate_coordinates(lat: float, lon: float) -> tuple[bool, str]:
    """
    Validate GPS coordinates are within Qatar bounds.

    Qatar bounds: 24.0 <= lat <= 27.0, 49.0 <= lon <= 53.0

    Returns:
        (is_valid, error_message)
    """
    if lat is None or lon is None:
        return True, ""  # Coordinates are optional

    if not (24.0 <= lat <= 27.0 and 49.0 <= lon <= 53.0):
        return False, f"Coordinates out of Qatar bounds: lat={lat}, lon={lon}"

    return True, ""


def import_from_csv(path: str, dry_run: bool = False, staging: bool = False):
    session = SessionLocal()
    created = 0
    skipped = 0
    validation_errors = {
        "required_fields": 0,
        "invalid_email": 0,
        "invalid_phone": 0,
        "invalid_geocode": 0,
        "low_quality": 0,
    }

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Extract fields from CSV
            name = row.get("name", "").strip() or "Unnamed"
            address = row.get("address", "").strip()
            contact = row.get("contact", "").strip()
            website = row.get("website", "").strip()

            # Validate required fields
            required_valid, required_error = validate_required_fields(name, address)
            if not required_valid:
                print(f"Validation error: {required_error} for row: {row}")
                validation_errors["required_fields"] += 1
                skipped += 1
                continue

            # Validate email in contact field
            if contact and "@" in contact:
                if not validate_email(contact):
                    print(
                        f"Invalid email format in contact: {contact} for school: {name}"
                    )
                    validation_errors["invalid_email"] += 1
                    if not staging:
                        skipped += 1
                        continue

            # Validate phone number in contact field
            if contact and not "@" in contact:
                if not validate_qatar_phone(contact):
                    print(f"Invalid Qatar phone format: {contact} for school: {name}")
                    validation_errors["invalid_phone"] += 1
                    if not staging:
                        skipped += 1
                        continue

            # Parse coordinates
            try:
                latitude = float(row["latitude"]) if row.get("latitude") else None
                longitude = float(row["longitude"]) if row.get("longitude") else None
            except ValueError:
                print(f"Invalid coordinate format for {name}")
                latitude = None
                longitude = None

            # Validate coordinates
            coords_valid, coords_error = validate_coordinates(latitude, longitude)
            if not coords_valid:
                print(coords_error)
                validation_errors["invalid_geocode"] += 1
                if staging:
                    # Create staging school with invalid_geocode status
                    try:
                        st = models.StagingSchool(
                            name=name,
                            type=row.get("type"),
                            curriculum=row.get("curriculum"),
                            address=address,
                            latitude=latitude,
                            longitude=longitude,
                            contact=contact,
                            website=website,
                            status="invalid_geocode",
                        )
                        # Calculate completeness score
                        st.completeness_score = calculate_completeness_score(st)
                        session.add(st)
                        session.commit()
                        created += 1
                    except Exception as e:
                        print(f"Failed to insert to staging: {name} - {e}")
                    continue
                else:
                    skipped += 1
                    continue

            # Create school object
            school_in = schemas.SchoolCreate(
                name=name,
                type=row.get("type"),
                curriculum=row.get("curriculum"),
                address=address,
                latitude=latitude,
                longitude=longitude,
                contact=contact,
                website=website,
            )

            # fuzzy deduplication check by name against main and staging
            def fuzzy_best_match(session, target_name):
                main_names = [n[0] for n in session.query(models.School.name).all()]
                staging_names = [
                    n[0] for n in session.query(models.StagingSchool.name).all()
                ]
                choices = {}
                for n in main_names:
                    choices[n] = "main"
                for n in staging_names:
                    if n not in choices:
                        choices[n] = "staging"
                if not choices:
                    return None, None, 0
                best = process.extractOne(
                    target_name, list(choices.keys()), scorer=fuzz.token_sort_ratio
                )
                if not best:
                    return None, None, 0
                best_name, score, _ = best
                return best_name, choices.get(best_name), score

            BEST_NAME, BEST_SOURCE, BEST_SCORE = fuzzy_best_match(
                session, school_in.name
            )
            THRESHOLD = 85
            if BEST_SCORE >= THRESHOLD:
                if staging:
                    if BEST_SOURCE == "staging":
                        print(
                            "Duplicate in staging (fuzzy), skipping:",
                            school_in.name,
                            "->",
                            BEST_NAME,
                            BEST_SCORE,
                        )
                        skipped += 1
                        continue
                    if BEST_SOURCE == "main":
                        print(
                            "Found similar in main, inserting to staging as possible_duplicate:",
                            school_in.name,
                            "->",
                            BEST_NAME,
                            BEST_SCORE,
                        )
                        try:
                            st = models.StagingSchool(**school_in.model_dump())
                            st.status = "possible_duplicate"
                            session.add(st)
                            session.commit()
                            created += 1
                        except Exception as e:
                            print("Failed to insert to staging", row.get("name"), e)
                        continue
                else:
                    print(
                        "Duplicate found (fuzzy), skipping:",
                        school_in.name,
                        "->",
                        BEST_NAME,
                        BEST_SCORE,
                    )
                    skipped += 1
                    continue

            if dry_run:
                print("DRY RUN - would insert:", school_in.name)
                created += 1
                continue

            try:
                if staging:
                    # Create staging school
                    st = models.StagingSchool(**school_in.model_dump())

                    # Calculate completeness score
                    completeness_score = calculate_completeness_score(st)
                    st.completeness_score = completeness_score

                    # Flag low-quality records (score < 50) as incomplete
                    if completeness_score < 50:
                        st.status = "incomplete"
                        validation_errors["low_quality"] += 1
                        print(
                            f"Low quality data (score {completeness_score}): {st.name}"
                        )

                    session.add(st)
                    session.commit()
                    created += 1
                else:
                    # Create school in main table
                    school = crud.create_school(session, school_in)

                    # Calculate and update completeness score
                    if school:
                        school.completeness_score = calculate_completeness_score(school)
                        session.commit()

                    created += 1
            except Exception as e:
                print("Failed to insert", row.get("name"), e)

    session.close()

    # Print summary statistics
    print(f'\n{"=" * 60}')
    print(f"IMPORT SUMMARY")
    print(f'{"=" * 60}')
    print(f"Source: {path}")
    print(f"Imported: {created} schools")
    print(f"Skipped: {skipped} schools")

    if any(validation_errors.values()):
        print(f"\nValidation Errors:")
        if validation_errors["required_fields"] > 0:
            print(f'  Required fields missing: {validation_errors["required_fields"]}')
        if validation_errors["invalid_email"] > 0:
            print(f'  Invalid email format: {validation_errors["invalid_email"]}')
        if validation_errors["invalid_phone"] > 0:
            print(f'  Invalid phone format: {validation_errors["invalid_phone"]}')
        if validation_errors["invalid_geocode"] > 0:
            print(f'  Invalid coordinates: {validation_errors["invalid_geocode"]}')
        if validation_errors["low_quality"] > 0:
            print(f'  Low quality (score < 50): {validation_errors["low_quality"]}')

    print(f'{"=" * 60}\n')


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import schools from CSV")
    parser.add_argument("--path", "-p", default=CSV_PATH, help="Path to CSV file")
    parser.add_argument(
        "--dry-run", action="store_true", help="Validate but do not write to DB"
    )
    parser.add_argument(
        "--staging",
        action="store_true",
        help="Write rows to staging table instead of main schools table",
    )
    args = parser.parse_args()

    # ensure tables exist (includes staging table added to models)
    Base.metadata.create_all(bind=engine)
    import_from_csv(args.path, dry_run=args.dry_run, staging=args.staging)
