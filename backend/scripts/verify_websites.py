"""
Verify and tidy website URLs for schools in the DB.

Behavior:
- For each School, attempt an HTTP HEAD (then GET) to determine whether the existing `website` is reachable.
- If the site is reachable (2xx/3xx), leave it alone (or normalize scheme).
- If unreachable or missing, try adding `http://` (if missing) and test again.
- If still unreachable, set a fallback Google Search URL for the school's name and city.
- Commit updates and write an updated CSV export at `exports/schools_export_verified.csv`.

Run from the `backend` directory as:
    python -m scripts.verify_websites

Requires `requests` in the environment.
"""
from __future__ import annotations
import csv
import time
import urllib.parse
import sys
from typing import Optional
from pathlib import Path

import requests

# Ensure the `backend` package path is available whether the script is run
# from the workspace root or from inside the `backend` directory.
HERE = Path(__file__).resolve()
BACKEND_DIR = HERE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from db import SessionLocal
import models

EXPORT_PATH = BACKEND_DIR / 'exports' / 'schools_export_verified.csv'
REQUEST_TIMEOUT = 6
SLEEP_BETWEEN = 0.05


def is_reachable(url: str) -> bool:
    if not url:
        return False
    try:
        r = requests.head(url, allow_redirects=True, timeout=REQUEST_TIMEOUT)
        if 200 <= r.status_code < 400:
            return True
        # Some servers reject HEAD; try GET for those
        if r.status_code in (403, 405) or r.status_code >= 400:
            r2 = requests.get(url, allow_redirects=True, timeout=REQUEST_TIMEOUT)
            return 200 <= r2.status_code < 400
        return False
    except Exception:
        # try a GET as last resort
        try:
            r = requests.get(url, allow_redirects=True, timeout=REQUEST_TIMEOUT)
            return 200 <= r.status_code < 400
        except Exception:
            return False


def make_search_fallback(name: str, city: Optional[str]) -> str:
    q = name
    if city:
        q = f"{name} {city} qatar"
    return 'https://www.google.com/search?q=' + urllib.parse.quote_plus(q)


def normalize_scheme(url: str) -> str:
    if not url:
        return url
    if url.startswith('http://') or url.startswith('https://'):
        return url
    return 'http://' + url


def main() -> None:
    session = SessionLocal()
    try:
        schools = session.query(models.School).order_by(models.School.id).all()
        total = len(schools)
        valid = 0
        fixed = 0
        unchanged = 0
        for s in schools:
            orig = s.website or ''
            candidate = orig.strip()
            changed = False

            # If no website or a search/placeholder pattern, we'll attempt to resolve
            is_placeholder = any(p in candidate.lower() for p in ['google.com/search', 'bing.com/search', 'park', 'parking', 'domainparking'])

            if candidate:
                # Try raw URL
                if is_reachable(candidate):
                    valid += 1
                    unchanged += 1
                    continue
                # Try normalizing scheme (add http://)
                normalized = normalize_scheme(candidate)
                if normalized != candidate and is_reachable(normalized):
                    s.website = normalized
                    fixed += 1
                    changed = True
                else:
                    # not reachable
                    pass

            if not candidate or is_placeholder or not changed:
                # fallback to search
                fallback = make_search_fallback(s.name or '', None)
                if fallback != (s.website or ''):
                    s.website = fallback
                    fixed += 1
                    changed = True

            if not changed:
                unchanged += 1

            # avoid hammering
            time.sleep(SLEEP_BETWEEN)

        session.commit()

        # ensure export directory exists and write export CSV
        EXPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(EXPORT_PATH, 'w', newline='', encoding='utf-8') as fh:
            writer = csv.writer(fh)
            writer.writerow(['id', 'name', 'address', 'latitude', 'longitude', 'contact', 'website', 'status'])
            for s in session.query(models.School).order_by(models.School.id):
                writer.writerow([
                    s.id,
                    s.name,
                    s.address or '',
                    s.latitude or '',
                    s.longitude or '',
                    s.contact or '',
                    s.website or '',
                    s.status or ''
                ])

        print(f"Processed {total} schools. Updated websites for {fixed} records. Left {unchanged} unchanged.")
        print(f"Export written to: {EXPORT_PATH}")

    finally:
        session.close()


if __name__ == '__main__':
    main()

