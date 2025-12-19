"""Quick script to check extraction progress"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import SessionLocal
from models import School

db = SessionLocal()

schools_with_contact = db.query(School).filter(School.contact.isnot(None), School.contact != '').count()
schools_with_website = db.query(School).filter(School.website.isnot(None), School.website != '').count()
schools_with_coords = db.query(School).filter(School.latitude.isnot(None)).count()
schools_with_fb = db.query(School).filter(School.facebook_url.isnot(None)).count()

print(f"Schools with contact info: {schools_with_contact}")
print(f"Schools with website: {schools_with_website}")
print(f"Schools with coordinates: {schools_with_coords}")
print(f"Schools with Facebook URL: {schools_with_fb}")

db.close()
