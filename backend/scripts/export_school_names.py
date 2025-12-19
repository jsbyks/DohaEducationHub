"""Export all school names from database"""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from db import SessionLocal
from models import School

def main():
    db = SessionLocal()
    schools = db.query(School.name).all()
    print(f"Total schools in database: {len(schools)}\n")
    for school in schools:
        print(school.name)
    db.close()

if __name__ == "__main__":
    main()
