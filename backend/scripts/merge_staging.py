from db import SessionLocal
from crud import list_staging, accept_staging, list_schools


def main():
    s = SessionLocal()
    rows = list_staging(s)
    print('staging_before=', len(rows))
    ids = [r.id for r in rows]
    merged = 0
    for i in ids:
        created = accept_staging(s, i)
        if created:
            merged += 1
    print('merged=', merged)
    rows_after = list_staging(s)
    print('staging_after=', len(rows_after))
    print('schools_total=', len(list_schools(s, skip=0, limit=100000)))


if __name__ == '__main__':
    main()
