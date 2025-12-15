from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    JSON,
    DateTime,
    Date,
    Float,
    UniqueConstraint,
    Index,
)
from sqlalchemy.sql import func
from db import Base


class School(Base):
    __tablename__ = "schools"

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
    status = Column(String(50), default="pending")
    completeness_score = Column(Integer, default=0)  # 0-100 data quality score
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StagingSchool(Base):
    __tablename__ = "staging_schools"

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
    status = Column(String(50), default="staging")
    completeness_score = Column(Integer, default=0)  # 0-100 data quality score
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    status = Column(
        String(50), default="pending", index=True
    )  # pending/approved/rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    school_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "school_id", name="unique_user_school_favorite"),
    )


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(300), unique=True, nullable=False, index=True)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    status = Column(String(50), default="draft", index=True)  # draft/published
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)  # Link to user account
    full_name = Column(String(255), nullable=False)
    bio = Column(Text, nullable=True)
    profile_image = Column(String(500), nullable=True)
    years_experience = Column(Integer, nullable=True)
    languages = Column(JSON, nullable=True)  # ["English", "Arabic", "French"]

    # Contact & Location
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    areas_served = Column(JSON, nullable=True)  # ["Doha", "Al Wakrah", "Lusail"]

    # Professional Info
    qualifications = Column(JSON, nullable=True)  # List of degrees/certifications
    specializations = Column(JSON, nullable=True)  # ["Mathematics", "English", "Science"]
    grade_levels = Column(JSON, nullable=True)  # ["KG", "Primary", "Secondary"]
    curricula_expertise = Column(JSON, nullable=True)  # ["British", "American", "IB"]

    # Teaching Mode
    teaches_online = Column(Boolean, default=True)
    teaches_in_person = Column(Boolean, default=True)

    # Verification & Status
    is_verified = Column(Boolean, default=False)
    verification_documents = Column(JSON, nullable=True)  # URLs to uploaded docs
    background_check_status = Column(String(50), default="pending")  # pending/approved/rejected

    # Ratings & Reviews
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_sessions = Column(Integer, default=0)

    # Pricing
    hourly_rate_qatari = Column(Float, nullable=True)  # Qatari Riyals
    hourly_rate_online = Column(Float, nullable=True)  # Different rate for online
    currency = Column(String(10), default="QAR")

    # Stripe Connect
    stripe_account_id = Column(String(255), nullable=True)  # Connected account id for payouts

    # Availability
    availability_schedule = Column(JSON, nullable=True)  # Weekly schedule
    timezone = Column(String(50), default="Asia/Qatar")

    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)  # Premium placement

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class TeacherAvailability(Base):
    __tablename__ = "teacher_availability"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, nullable=False, index=True)

    # Time slots
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(String(10), nullable=False)  # "09:00"
    end_time = Column(String(10), nullable=False)   # "17:00"

    # Recurring or one-time
    is_recurring = Column(Boolean, default=True)
    specific_date = Column(Date, nullable=True)  # For one-time slots

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TeacherReview(Base):
    __tablename__ = "teacher_reviews"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, nullable=False, index=True)
    parent_id = Column(Integer, nullable=False, index=True)  # User who wrote review

    # Review Content
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    session_type = Column(String(20), nullable=True)  # "online", "in_person"

    # Optional ratings
    subject_knowledge_rating = Column(Integer, nullable=True)
    communication_rating = Column(Integer, nullable=True)
    punctuality_rating = Column(Integer, nullable=True)
    engagement_rating = Column(Integer, nullable=True)

    # Metadata
    session_date = Column(Date, nullable=True)
    is_verified = Column(Boolean, default=False)  # Verified purchase
    status = Column(String(20), default="published")  # published/hidden

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, nullable=False, index=True)
    parent_id = Column(Integer, nullable=False, index=True)

    # Session Details
    subject = Column(String(100), nullable=False)
    grade_level = Column(String(50), nullable=True)
    session_type = Column(String(20), nullable=False)  # "online", "in_person"
    duration_hours = Column(Float, default=1.0)  # 1 hour default

    # Scheduling
    scheduled_date = Column(Date, nullable=False)
    start_time = Column(String(10), nullable=False)  # "14:00"
    end_time = Column(String(10), nullable=False)    # "15:00"

    # Location (for in-person)
    location = Column(String(255), nullable=True)
    meeting_link = Column(String(500), nullable=True)  # For online sessions

    # Pricing & Payment
    hourly_rate = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="QAR")
    commission_amount = Column(Float, nullable=False)  # Platform fee
    teacher_amount = Column(Float, nullable=False)     # Amount teacher receives

    # Status
    status = Column(String(30), default="pending")  # pending/confirmed/completed/cancelled/refunded
    payment_status = Column(String(20), default="pending")  # pending/paid/refunded

    # Communication
    special_requests = Column(Text, nullable=True)
    teacher_notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships for efficient queries
    __table_args__ = (
        Index('idx_booking_teacher_date', 'teacher_id', 'scheduled_date'),
        Index('idx_booking_parent_status', 'parent_id', 'status'),
        Index('idx_booking_status_date', 'status', 'scheduled_date'),
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, nullable=True, index=True)  # Optional link to booking
    sender_id = Column(Integer, nullable=False, index=True)  # User ID
    recipient_id = Column(Integer, nullable=False, index=True)  # User ID

    # Message Content
    subject = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)

    # Metadata
    message_type = Column(String(20), default="general")  # general/booking/session
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TeacherSubject(Base):
    __tablename__ = "teacher_subjects"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, nullable=False, index=True)
    subject_name = Column(String(100), nullable=False)
    grade_level = Column(String(50), nullable=False)  # KG, Primary, Secondary

    proficiency_level = Column(String(20), default="expert")  # beginner/intermediate/expert

    __table_args__ = (
        UniqueConstraint('teacher_id', 'subject_name', 'grade_level', name='unique_teacher_subject_grade'),
    )


class TeacherPayout(Base):
    __tablename__ = "teacher_payouts"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="QAR")
    status = Column(String(30), default="pending")  # pending/processing/paid/failed
    stripe_transfer_id = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)