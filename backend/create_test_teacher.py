"""Create a test teacher account for development."""
import sys
sys.path.insert(0, '.')

from sqlalchemy.orm import Session
from db import SessionLocal, engine
import models
import auth

def create_test_teacher():
    db = SessionLocal()
    try:
        # Check if user exists
        existing_user = db.query(models.User).filter(models.User.email == "teacher@test.com").first()

        if existing_user:
            print(f"User already exists with ID: {existing_user.id}")
            user = existing_user
        else:
            # Create test user
            user = models.User(
                email="teacher@test.com",
                hashed_password=auth.hash_password("teacher123"),
                full_name="Test Teacher",
                is_active=True,
                is_admin=False
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created user with ID: {user.id}")

        # Check if teacher profile exists
        existing_teacher = db.query(models.Teacher).filter(models.Teacher.user_id == user.id).first()

        if existing_teacher:
            print(f"Teacher profile already exists with ID: {existing_teacher.id}")
        else:
            # Create teacher profile
            teacher = models.Teacher(
                user_id=user.id,
                full_name="Test Teacher",
                bio="Experienced educator with 10+ years teaching experience in Qatar",
                years_experience=10,
                languages=["English", "Arabic"],
                phone="+974-1234-5678",
                email="teacher@test.com",
                city="Doha",
                areas_served=["Doha", "West Bay", "The Pearl"],
                qualifications=["Bachelor in Education", "TEFL Certified", "Masters in Mathematics"],
                specializations=["Mathematics", "English", "Science"],
                grade_levels=["Primary", "Secondary"],
                curricula_expertise=["British", "American"],
                teaches_online=True,
                teaches_in_person=True,
                is_verified=True,
                background_check_status="approved",
                average_rating=4.8,
                total_reviews=25,
                total_sessions=150,
                hourly_rate_qatari=200.0,
                hourly_rate_online=150.0,
                currency="QAR",
                timezone="Asia/Qatar",
                is_active=True,
                is_featured=True
            )
            db.add(teacher)
            db.commit()
            db.refresh(teacher)
            print(f"Created teacher profile with ID: {teacher.id}")

        print("\n" + "="*50)
        print("TEST TEACHER ACCOUNT CREATED")
        print("="*50)
        print("Email:    teacher@test.com")
        print("Password: teacher123")
        print("="*50)

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_teacher()
