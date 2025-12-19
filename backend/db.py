from sqlalchemy import create_engine, event, pool
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import sqlite3

# Use simple relative path for SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev_new.db")

# Simplified engine creation
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
