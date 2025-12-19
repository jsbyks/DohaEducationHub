"""
Add Facebook columns to schools and staging_schools tables
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from db import DATABASE_URL


def add_facebook_columns():
    """Add Facebook columns directly to database"""
    engine = create_engine(DATABASE_URL)

    facebook_columns = [
        "ALTER TABLE schools ADD COLUMN facebook_url VARCHAR(500)",
        "ALTER TABLE schools ADD COLUMN facebook_phone VARCHAR(200)",
        "ALTER TABLE schools ADD COLUMN facebook_email VARCHAR(200)",
        "ALTER TABLE schools ADD COLUMN facebook_address TEXT",
        "ALTER TABLE schools ADD COLUMN facebook_about TEXT",
        "ALTER TABLE schools ADD COLUMN facebook_verified BOOLEAN DEFAULT 0",
        "ALTER TABLE schools ADD COLUMN facebook_followers INTEGER",

        "ALTER TABLE staging_schools ADD COLUMN facebook_url VARCHAR(500)",
        "ALTER TABLE staging_schools ADD COLUMN facebook_phone VARCHAR(200)",
        "ALTER TABLE staging_schools ADD COLUMN facebook_email VARCHAR(200)",
        "ALTER TABLE staging_schools ADD COLUMN facebook_address TEXT",
        "ALTER TABLE staging_schools ADD COLUMN facebook_about TEXT",
        "ALTER TABLE staging_schools ADD COLUMN facebook_verified BOOLEAN DEFAULT 0",
        "ALTER TABLE staging_schools ADD COLUMN facebook_followers INTEGER",
    ]

    with engine.connect() as conn:
        for sql in facebook_columns:
            try:
                conn.execute(text(sql))
                print(f"Executed: {sql[:50]}...")
            except Exception as e:
                if "duplicate column name" in str(e).lower():
                    print(f"Column already exists: {sql[28:50]}")
                else:
                    print(f"Error: {sql[:50]}... - {e}")

        conn.commit()

    print("\nFacebook columns added successfully!")
    print("You can now use the CSV import script after filling in Facebook data.")


if __name__ == "__main__":
    add_facebook_columns()
