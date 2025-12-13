import sys
from datetime import timedelta
from sqlalchemy.orm import Session
from db import SessionLocal
from models import User
from auth import create_access_token

def get_admin_user(db: Session):
    return db.query(User).filter(User.is_admin == True).first()

def main():
    db = SessionLocal()
    admin = get_admin_user(db)
    if not admin:
        print("No admin user found. Please create one in the database.")
        sys.exit(1)
    token = create_access_token({"sub": admin.email, "user_id": admin.id, "is_admin": True}, expires_delta=timedelta(days=7))
    print(token)

if __name__ == "__main__":
    main()
