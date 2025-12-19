"""Add availability slots for existing teachers."""
import sys
sys.path.insert(0, '.')

from sqlalchemy.orm import Session
from db import SessionLocal, engine
import models

def add_teacher_availability():
    db = SessionLocal()
    try:
        # Get all active teachers
        teachers = db.query(models.Teacher).filter(models.Teacher.is_active == True).all()

        print(f"Found {len(teachers)} active teachers")

        for teacher in teachers:
            # Check if teacher already has availability
            existing_availability = db.query(models.TeacherAvailability).filter(
                models.TeacherAvailability.teacher_id == teacher.id
            ).first()

            if existing_availability:
                print(f"Teacher {teacher.id} ({teacher.full_name}) already has availability")
                continue

            # Add default availability slots (Monday to Friday, 9 AM - 5 PM)
            availability_slots = [
                # Monday
                models.TeacherAvailability(
                    teacher_id=teacher.id,
                    day_of_week=0,  # Monday
                    start_time="09:00",
                    end_time="17:00",
                    is_recurring=True
                ),
                # Tuesday
                models.TeacherAvailability(
                    teacher_id=teacher.id,
                    day_of_week=1,  # Tuesday
                    start_time="09:00",
                    end_time="17:00",
                    is_recurring=True
                ),
                # Wednesday
                models.TeacherAvailability(
                    teacher_id=teacher.id,
                    day_of_week=2,  # Wednesday
                    start_time="09:00",
                    end_time="17:00",
                    is_recurring=True
                ),
                # Thursday
                models.TeacherAvailability(
                    teacher_id=teacher.id,
                    day_of_week=3,  # Thursday
                    start_time="09:00",
                    end_time="17:00",
                    is_recurring=True
                ),
                # Friday
                models.TeacherAvailability(
                    teacher_id=teacher.id,
                    day_of_week=4,  # Friday
                    start_time="09:00",
                    end_time="17:00",
                    is_recurring=True
                ),
            ]

            for slot in availability_slots:
                db.add(slot)

            db.commit()
            print(f"Added availability for teacher {teacher.id} ({teacher.full_name})")

        print(f"\n[SUCCESS] Added availability slots for {len(teachers)} teachers")
        print("Teachers are now available Monday-Friday, 9 AM - 5 PM")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_teacher_availability()