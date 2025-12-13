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

Requires `aiohttp` in the environment.
"""

from __future__ import annotations
import csv
import asyncio
import urllib.parse
import sys
from typing import Optional
from pathlib import Path

import aiohttp

# Ensure the `backend` package path is available whether the script is run
# from the workspace root or from inside the `backend` directory.
HERE = Path(__file__).resolve()
BACKEND_DIR = HERE.parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from db import SessionLocal
import models

EXPORT_PATH = BACKEND_DIR / "exports" / "schools_export_verified.csv"
REQUEST_TIMEOUT = 6
CONCURRENT_REQUESTS = 10  # Number of concurrent requests


async def is_reachable(url: str, session: aiohttp.ClientSession) -> bool:
    """Check if a URL is reachable using async requests."""
    if not url:
        return False

    try:
        # Try HEAD request first
        async with session.head(
            url,
            allow_redirects=True,
            timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
        ) as r:
            if 200 <= r.status < 400:
                return True
            # Some servers reject HEAD; try GET for those
            if r.status in (403, 405) or r.status >= 400:
                async with session.get(
                    url,
                    allow_redirects=True,
                    timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
                ) as r2:
                    return 200 <= r2.status < 400
            return False
    except Exception:
        # try a GET as last resort
        try:
            async with session.get(
                url,
                allow_redirects=True,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            ) as r:
                return 200 <= r.status < 400
        except Exception:
            return False


def make_search_fallback(name: str, city: Optional[str]) -> str:
    q = name
    if city:
        q = f"{name} {city} qatar"
    return "https://www.google.com/search?q=" + urllib.parse.quote_plus(q)


def normalize_scheme(url: str) -> str:
    if not url:
        return url
    if url.startswith("http://") or url.startswith("https://"):
        return url
    return "http://" + url


async def verify_school_website(
    school: models.School, session: aiohttp.ClientSession
) -> tuple[bool, Optional[str]]:
    """
    Verify and fix a school's website URL.

    Returns:
        (changed, new_website_url)
    """
    orig = school.website or ""
    candidate = orig.strip()

    # If no website or a search/placeholder pattern, we'll attempt to resolve
    is_placeholder = any(
        p in candidate.lower()
        for p in [
            "google.com/search",
            "bing.com/search",
            "park",
            "parking",
            "domainparking",
        ]
    )

    if candidate and not is_placeholder:
        # Try raw URL
        if await is_reachable(candidate, session):
            return False, None  # No change needed

        # Try normalizing scheme (add http://)
        normalized = normalize_scheme(candidate)
        if normalized != candidate and await is_reachable(normalized, session):
            return True, normalized

    # fallback to search
    fallback = make_search_fallback(school.name or "", None)
    if fallback != (school.website or ""):
        return True, fallback

    return False, None


async def process_schools_batch(
    schools: list[models.School], db_session
) -> tuple[int, int, int]:
    """
    Process a batch of schools concurrently.

    Returns:
        (valid, fixed, unchanged)
    """
    valid = 0
    fixed = 0
    unchanged = 0

    # Create async HTTP session
    connector = aiohttp.TCPConnector(limit=CONCURRENT_REQUESTS)
    timeout = aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        # Create tasks for all schools
        tasks = [verify_school_website(school, session) for school in schools]

        # Process concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Update schools based on results
        for school, result in zip(schools, results):
            if isinstance(result, Exception):
                print(f"Error processing {school.name}: {result}")
                unchanged += 1
                continue

            changed, new_website = result

            if changed and new_website:
                school.website = new_website
                fixed += 1
            elif not changed:
                unchanged += 1
                valid += 1

    return valid, fixed, unchanged


async def async_main() -> None:
    """Async main function."""
    db_session = SessionLocal()

    try:
        schools = db_session.query(models.School).order_by(models.School.id).all()
        total = len(schools)

        print(f"Processing {total} schools with async requests...")
        print(f"Concurrent requests: {CONCURRENT_REQUESTS}")
        print("=" * 60)

        # Process all schools
        valid, fixed, unchanged = await process_schools_batch(schools, db_session)

        # Commit changes to database
        db_session.commit()

        # ensure export directory exists and write export CSV
        EXPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(EXPORT_PATH, "w", newline="", encoding="utf-8") as fh:
            writer = csv.writer(fh)
            writer.writerow(
                [
                    "id",
                    "name",
                    "address",
                    "latitude",
                    "longitude",
                    "contact",
                    "website",
                    "status",
                    "completeness_score",
                ]
            )
            for s in db_session.query(models.School).order_by(models.School.id):
                writer.writerow(
                    [
                        s.id,
                        s.name,
                        s.address or "",
                        s.latitude or "",
                        s.longitude or "",
                        s.contact or "",
                        s.website or "",
                        s.status or "",
                        s.completeness_score or 0,
                    ]
                )

        print("=" * 60)
        print(f"Processed {total} schools.")
        print(f"  Valid (unchanged): {valid}")
        print(f"  Fixed/Updated: {fixed}")
        print(f"  Errors: {unchanged - valid}")
        print(f"\nExport written to: {EXPORT_PATH}")

    finally:
        db_session.close()


def main() -> None:
    """Main entry point."""
    asyncio.run(async_main())


if __name__ == "__main__":
    main()
