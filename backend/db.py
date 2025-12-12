from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path

# For local dev use a path relative to this file so DB is consistent regardless of CWD.
backend_dir = Path(__file__).resolve().parent
default_db_path = backend_dir / 'dev.db'
DATABASE_URL = os.getenv('DATABASE_URL', f'sqlite:///{default_db_path.as_posix()}')

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith('sqlite') else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
