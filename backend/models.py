from sqlalchemy import Column, Integer, String, Text, Boolean, JSON, DateTime, Float, UniqueConstraint
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


class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    status = Column(String(50), default='pending', index=True)  # pending/approved/rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Favorite(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    school_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint('user_id', 'school_id', name='unique_user_school_favorite'),
    )


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(300), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    status = Column(String(50), default='draft', index=True)  # draft/published
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
