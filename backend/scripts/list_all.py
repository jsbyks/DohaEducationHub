from db import SessionLocal
from crud import list_staging, list_schools


def print_staging(s):
    rows = list_staging(s, skip=0, limit=10000)
    print('STAGING ROWS:', len(rows))
    for r in rows:
        print(f"[STAGING {r.id}] {r.name} | status={r.status} | website={r.website} | address={r.address} | lat={r.latitude} lon={r.longitude}")


def print_schools(s):
    rows = list_schools(s, skip=0, limit=100000)
    print('\nSCHOOLS TOTAL:', len(rows))
    for r in rows:
        print(f"[SCHOOL {r.id}] {r.name} | status={r.status} | website={r.website} | address={r.address} | lat={r.latitude} lon={r.longitude}")


def main():
    s = SessionLocal()
    print('Staging API endpoints:')
    print('  GET /api/schools/staging')
    print('  GET /api/schools/staging/{id}')
    print('  POST /api/schools/staging/{id}/accept')
    print('  POST /api/schools/staging/{id}/reject')
    print('\nConnecting to DB...')
    print_staging(s)
    print_schools(s)


if __name__ == '__main__':
    main()
