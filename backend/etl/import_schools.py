import argparse
import csv
import os
import sys

# Ensure backend package imports work when running script directly
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from db import SessionLocal, Base, engine
import crud, schemas, models
from rapidfuzz import process, fuzz


CSV_PATH = os.path.join(os.path.dirname(__file__), 'sample_schools.csv')


def import_from_csv(path: str, dry_run: bool = False, staging: bool = False):
    session = SessionLocal()
    created = 0
    skipped = 0
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            school_in = schemas.SchoolCreate(
                name=row.get('name') or 'Unnamed',
                type=row.get('type'),
                curriculum=row.get('curriculum'),
                address=row.get('address'),
                latitude=float(row['latitude']) if row.get('latitude') else None,
                longitude=float(row['longitude']) if row.get('longitude') else None,
                contact=row.get('contact'),
                website=row.get('website')
            )

            # basic geocoding validation (Qatar bounding box fallback)
            lat = school_in.latitude
            lon = school_in.longitude
            if lat is not None or lon is not None:
                # require both coordinates and check plausible Doha/Qatar bounds
                if lat is None or lon is None or not (24.0 <= lat <= 27.0 and 49.0 <= lon <= 53.0):
                    msg = f'Invalid geocode for {school_in.name}: lat={lat} lon={lon}'
                    if dry_run:
                        print('DRY RUN -', msg)
                        skipped += 1
                        continue
                    if staging:
                        try:
                            st = models.StagingSchool(**school_in.model_dump())
                            st.status = 'invalid_geocode'
                            session.add(st)
                            session.commit()
                            created += 1
                        except Exception as e:
                            print('Failed to insert to staging', row.get('name'), e)
                        continue
                    else:
                        print(msg + ' - skipping')
                        skipped += 1
                        continue

            # fuzzy deduplication check by name against main and staging
            def fuzzy_best_match(session, target_name):
                main_names = [n[0] for n in session.query(models.School.name).all()]
                staging_names = [n[0] for n in session.query(models.StagingSchool.name).all()]
                choices = {}
                for n in main_names:
                    choices[n] = 'main'
                for n in staging_names:
                    if n not in choices:
                        choices[n] = 'staging'
                if not choices:
                    return None, None, 0
                best = process.extractOne(target_name, list(choices.keys()), scorer=fuzz.token_sort_ratio)
                if not best:
                    return None, None, 0
                best_name, score, _ = best
                return best_name, choices.get(best_name), score

            BEST_NAME, BEST_SOURCE, BEST_SCORE = fuzzy_best_match(session, school_in.name)
            THRESHOLD = 85
            if BEST_SCORE >= THRESHOLD:
                if staging:
                    if BEST_SOURCE == 'staging':
                        print('Duplicate in staging (fuzzy), skipping:', school_in.name, '->', BEST_NAME, BEST_SCORE)
                        skipped += 1
                        continue
                    if BEST_SOURCE == 'main':
                        print('Found similar in main, inserting to staging as possible_duplicate:', school_in.name, '->', BEST_NAME, BEST_SCORE)
                        try:
                            st = models.StagingSchool(**school_in.model_dump())
                            st.status = 'possible_duplicate'
                            session.add(st)
                            session.commit()
                            created += 1
                        except Exception as e:
                            print('Failed to insert to staging', row.get('name'), e)
                        continue
                else:
                    print('Duplicate found (fuzzy), skipping:', school_in.name, '->', BEST_NAME, BEST_SCORE)
                    skipped += 1
                    continue

            if dry_run:
                print('DRY RUN - would insert:', school_in.name)
                created += 1
                continue

            try:
                if staging:
                    st = models.StagingSchool(**school_in.model_dump())
                    session.add(st)
                    session.commit()
                    created += 1
                else:
                    crud.create_school(session, school_in)
                    created += 1
            except Exception as e:
                print('Failed to insert', row.get('name'), e)
    session.close()
    print(f'Imported {created} schools from {path} (skipped {skipped})')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Import schools from CSV')
    parser.add_argument('--path', '-p', default=CSV_PATH, help='Path to CSV file')
    parser.add_argument('--dry-run', action='store_true', help='Validate but do not write to DB')
    parser.add_argument('--staging', action='store_true', help='Write rows to staging table instead of main schools table')
    args = parser.parse_args()

    # ensure tables exist (includes staging table added to models)
    Base.metadata.create_all(bind=engine)
    import_from_csv(args.path, dry_run=args.dry_run, staging=args.staging)
