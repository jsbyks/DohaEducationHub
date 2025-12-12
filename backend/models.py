from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, DateTime, Float
from sqlalchemy.sql import func
from db import Base


class School(Base):
    __tablename__ = 'schools'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(100), nullable=True)
    curriculum = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    contact = Column(String(200), nullable=True)
    website = Column(String(300), nullable=True)
    fee_structure = Column(JSON, nullable=True)
    facilities = Column(JSON, nullable=True)
    photos = Column(JSON, nullable=True)
    status = Column(String(50), default='pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StagingSchool(Base):
    __tablename__ = 'staging_schools'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(100), nullable=True)
    curriculum = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    contact = Column(String(200), nullable=True)
    website = Column(String(300), nullable=True)
    fee_structure = Column(JSON, nullable=True)
    facilities = Column(JSON, nullable=True)
    photos = Column(JSON, nullable=True)
    status = Column(String(50), default='staging')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
