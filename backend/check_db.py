import sqlite3
from pathlib import Path

db_path = Path(__file__).resolve().parent / "dev.db"
print("Checking DB at", db_path)
conn = sqlite3.connect(str(db_path))
cur = conn.cursor()
try:
    cur.execute("select count(*) from schools")
    print("schools count ->", cur.fetchone()[0])
except Exception as e:
    print("ERROR querying DB:", e)
finally:
    conn.close()
