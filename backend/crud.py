from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional, List
import models
import schemas


def get_school(db: Session, school_id: int):
    return db.query(models.School).filter(models.School.id == school_id).first()


def list_schools(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    curriculum: Optional[str] = None,
    school_type: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    location: Optional[str] = None,
):
    """
    List schools with optional filtering.

    Args:
        db: Database session
        skip: Offset for pagination
        limit: Max results to return
        curriculum: Filter by curriculum
        school_type: Filter by school type
        status: Filter by publication status (default: published)
        search: Search in school name
        location: Search in address

    Returns:
        Tuple of (total_count, results)
    """
    query = db.query(models.School)

    # Default to published schools only
    if status is None:
        query = query.filter(models.School.status == "published")
    elif status:
        query = query.filter(models.School.status == status)

    # Apply filters
    if curriculum:
        query = query.filter(models.School.curriculum.ilike(f"%{curriculum}%"))

    if school_type:
        query = query.filter(models.School.type.ilike(f"%{school_type}%"))

    if search:
        query = query.filter(models.School.name.ilike(f"%{search}%"))

    if location:
        query = query.filter(models.School.address.ilike(f"%{location}%"))

    # Get total count before pagination
    total = query.count()

    # Apply pagination and ordering
    results = query.order_by(models.School.name).offset(skip).limit(limit).all()

    return total, results


def create_school(db: Session, school: schemas.SchoolCreate):
    db_obj = models.School(**school.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_school(db: Session, school_id: int, school_update: schemas.SchoolUpdate):
    """
    Update a school record.

    Args:
        db: Database session
        school_id: ID of school to update
        school_update: Fields to update

    Returns:
        Updated school object or None if not found
    """
    db_school = get_school(db, school_id)
    if not db_school:
        return None

    # Update only provided fields
    update_data = school_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_school, field, value)

    db.commit()
    db.refresh(db_school)
    return db_school


def delete_school(db: Session, school_id: int):
    """
    Delete a school record.

    Args:
        db: Database session
        school_id: ID of school to delete

    Returns:
        True if deleted, False if not found
    """
    db_school = get_school(db, school_id)
    if not db_school:
        return False

    db.delete(db_school)
    db.commit()
    return True


def list_staging(db: Session, skip: int = 0, limit: int = 200):
    return db.query(models.StagingSchool).offset(skip).limit(limit).all()


def get_staging(db: Session, staging_id: int):
    return (
        db.query(models.StagingSchool)
        .filter(models.StagingSchool.id == staging_id)
        .first()
    )


def delete_staging(db: Session, staging_id: int):
    obj = get_staging(db, staging_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


def accept_staging(db: Session, staging_id: int):
    """Create a School from a StagingSchool and remove the staging row."""
    s = get_staging(db, staging_id)
    if not s:
        return None
    # map fields from staging to main School
    data = {
        "name": s.name,
        "type": s.type,
        "curriculum": s.curriculum,
        "address": s.address,
        "latitude": s.latitude,
        "longitude": s.longitude,
        "contact": s.contact,
        "website": s.website,
        "fee_structure": s.fee_structure,
        "facilities": s.facilities,
        "photos": s.photos,
        "status": "published",
    }
    db_obj = models.School(**data)
    db.add(db_obj)
    # remove staging after adding main record
    db.delete(s)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# ==================== REVIEW CRUD ====================


def create_review(db: Session, review: schemas.ReviewCreate, user_id: int):
    """Create a new review for a school."""
    db_obj = models.Review(**review.model_dump(), user_id=user_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_reviews_for_school(db: Session, school_id: int, status: str = "approved"):
    """Get all reviews for a school by status."""
    return (
        db.query(models.Review)
        .filter(models.Review.school_id == school_id, models.Review.status == status)
        .order_by(models.Review.created_at.desc())
        .all()
    )


def get_reviews_by_user(db: Session, user_id: int):
    """Get all reviews submitted by a user."""
    return (
        db.query(models.Review)
        .filter(models.Review.user_id == user_id)
        .order_by(models.Review.created_at.desc())
        .all()
    )


def list_pending_reviews(db: Session, skip: int = 0, limit: int = 50):
    """List all pending reviews for admin moderation."""
    query = db.query(models.Review).filter(models.Review.status == "pending")
    total = query.count()
    results = (
        query.order_by(models.Review.created_at.desc()).offset(skip).limit(limit).all()
    )
    return total, results


def update_review_status(db: Session, review_id: int, status: str):
    """Update review status (approve/reject)."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        return None
    review.status = status
    db.commit()
    db.refresh(review)
    return review


def delete_review(db: Session, review_id: int):
    """Delete a review."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        return False
    db.delete(review)
    db.commit()
    return True


# ==================== FAVORITE CRUD ====================


def create_favorite(db: Session, user_id: int, school_id: int):
    """Add a school to user's favorites (idempotent)."""
    # Check if already exists
    existing = (
        db.query(models.Favorite)
        .filter(
            models.Favorite.user_id == user_id, models.Favorite.school_id == school_id
        )
        .first()
    )

    if existing:
        return existing

    db_obj = models.Favorite(user_id=user_id, school_id=school_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete_favorite(db: Session, user_id: int, school_id: int):
    """Remove a school from user's favorites."""
    obj = (
        db.query(models.Favorite)
        .filter(
            models.Favorite.user_id == user_id, models.Favorite.school_id == school_id
        )
        .first()
    )

    if not obj:
        return False

    db.delete(obj)
    db.commit()
    return True


def get_user_favorites(db: Session, user_id: int):
    """Get all favorite schools for a user."""
    return db.query(models.Favorite).filter(models.Favorite.user_id == user_id).all()


def is_school_favorited(db: Session, user_id: int, school_id: int):
    """Check if a school is in user's favorites."""
    return (
        db.query(models.Favorite)
        .filter(
            models.Favorite.user_id == user_id, models.Favorite.school_id == school_id
        )
        .first()
        is not None
    )


# ==================== POST CRUD ====================


def create_post(db: Session, post: schemas.PostCreate, author_id: int):
    """Create a new blog post with auto-generated slug."""
    import re
    from sqlalchemy.sql import func

    # Generate slug from title
    slug = re.sub(r"[^a-z0-9]+", "-", post.title.lower()).strip("-")

    # Ensure slug uniqueness
    base_slug = slug
    counter = 1
    while db.query(models.Post).filter(models.Post.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    post_data = post.model_dump()
    db_obj = models.Post(**post_data, author_id=author_id, slug=slug)

    # Set published_at if status is published
    if post.status == "published":
        db_obj.published_at = func.now()

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update_post(db: Session, post_id: int, post_update: schemas.PostUpdate):
    """Update a blog post."""
    import re
    from sqlalchemy.sql import func

    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        return None

    update_data = post_update.model_dump(exclude_unset=True)

    # Regenerate slug if title changed
    if "title" in update_data:
        slug = re.sub(r"[^a-z0-9]+", "-", update_data["title"].lower()).strip("-")
        base_slug = slug
        counter = 1
        while (
            db.query(models.Post)
            .filter(models.Post.slug == slug, models.Post.id != post_id)
            .first()
        ):
            slug = f"{base_slug}-{counter}"
            counter += 1
        update_data["slug"] = slug

    # Set published_at when first published
    if (
        "status" in update_data
        and update_data["status"] == "published"
        and not post.published_at
    ):
        update_data["published_at"] = func.now()

    for field, value in update_data.items():
        setattr(post, field, value)

    db.commit()
    db.refresh(post)
    return post


def get_post_by_id(db: Session, post_id: int):
    """Get a single post by ID."""
    return db.query(models.Post).filter(models.Post.id == post_id).first()


def get_post_by_slug(db: Session, slug: str):
    """Get a single post by slug."""
    return db.query(models.Post).filter(models.Post.slug == slug).first()


def list_posts(
    db: Session, skip: int = 0, limit: int = 20, status: Optional[str] = "published"
):
    """List blog posts with pagination and status filter."""
    query = db.query(models.Post)

    if status:
        query = query.filter(models.Post.status == status)

    total = query.count()
    results = (
        query.order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    )
    return total, results


def delete_post(db: Session, post_id: int):
    """Delete a blog post."""
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        return False

    db.delete(post)
    db.commit()
    return True


# Teacher CRUD functions
def create_teacher(db: Session, teacher_data, user_id: int):
    """Create a new teacher profile."""
    db_teacher = models.Teacher(**teacher_data.dict(), user_id=user_id)
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


def get_teacher_by_id(db: Session, teacher_id: int):
    """Get teacher by ID."""
    return db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()


def get_teacher_by_user_id(db: Session, user_id: int):
    """Get teacher profile for a user."""
    return db.query(models.Teacher).filter(models.Teacher.user_id == user_id).first()


def update_teacher(db: Session, teacher_id: int, teacher_data):
    """Update teacher profile."""
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if teacher:
        for key, value in teacher_data.dict(exclude_unset=True).items():
            setattr(teacher, key, value)
        teacher.updated_at = None  # This will trigger the onupdate
        db.commit()
        db.refresh(teacher)
    return teacher


def update_teacher_verification(db: Session, teacher_id: int, is_verified: bool, background_check_status: str = None):
    """Update teacher verification status (admin only)."""
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if teacher:
        teacher.is_verified = is_verified
        if background_check_status:
            teacher.background_check_status = background_check_status
        teacher.updated_at = None
        db.commit()
        db.refresh(teacher)
    return teacher


def update_teacher_featured(db: Session, teacher_id: int, is_featured: bool):
    """Update teacher featured status (admin only)."""
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if teacher:
        teacher.is_featured = is_featured
        teacher.updated_at = None
        db.commit()
        db.refresh(teacher)
    return teacher


def update_teacher_stripe_account(db: Session, teacher_id: int, stripe_account_id: str):
    """Set or update a teacher's Stripe connected account id."""
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if teacher:
        teacher.stripe_account_id = stripe_account_id
        teacher.updated_at = None
        db.commit()
        db.refresh(teacher)
    return teacher


def create_teacher_payout(db: Session, teacher_id: int, amount: float, currency: str = "QAR"):
    """Create a new payout request record."""
    payout = models.TeacherPayout(teacher_id=teacher_id, amount=amount, currency=currency)
    db.add(payout)
    db.commit()
    db.refresh(payout)
    return payout


def list_teacher_payouts(db: Session, teacher_id: int):
    return db.query(models.TeacherPayout).filter(models.TeacherPayout.teacher_id == teacher_id).order_by(models.TeacherPayout.created_at.desc()).all()


def mark_payout_processed(db: Session, payout_id: int, status: str, stripe_transfer_id: str = None):
    payout = db.query(models.TeacherPayout).filter(models.TeacherPayout.id == payout_id).first()
    if not payout:
        return None
    payout.status = status
    if stripe_transfer_id:
        payout.stripe_transfer_id = stripe_transfer_id
    payout.processed_at = None
    db.commit()
    db.refresh(payout)
    return payout


def search_teachers(db: Session, filters, sort_by: str = "average_rating", sort_order: str = "desc",
                   page: int = 1, page_size: int = 20):
    """Search and filter teachers with pagination."""
    query = db.query(models.Teacher).filter(models.Teacher.is_active == True)

    # Apply filters
    if filters.subject:
        # Check if subject is in specializations JSON array
        query = query.filter(models.Teacher.specializations.contains([filters.subject]))

    if filters.grade_level:
        query = query.filter(models.Teacher.grade_levels.contains([filters.grade_level]))

    if filters.curriculum:
        query = query.filter(models.Teacher.curricula_expertise.contains([filters.curriculum]))

    if filters.city:
        query = query.filter(models.Teacher.city == filters.city)

    if filters.teaches_online is not None:
        query = query.filter(models.Teacher.teaches_online == filters.teaches_online)

    if filters.teaches_in_person is not None:
        query = query.filter(models.Teacher.teaches_in_person == filters.teaches_in_person)

    if filters.min_rating:
        query = query.filter(models.Teacher.average_rating >= filters.min_rating)

    if filters.max_hourly_rate:
        # Check both online and in-person rates
        query = query.filter(
            or_(
                and_(models.Teacher.hourly_rate_qatari <= filters.max_hourly_rate),
                and_(models.Teacher.hourly_rate_online <= filters.max_hourly_rate)
            )
        )

    if filters.language:
        query = query.filter(models.Teacher.languages.contains([filters.language]))

    if filters.is_verified is not None:
        query = query.filter(models.Teacher.is_verified == filters.is_verified)

    # Apply sorting
    sort_column = getattr(models.Teacher, sort_by, models.Teacher.average_rating)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # Apply pagination
    offset = (page - 1) * page_size
    return query.offset(offset).limit(page_size).all()


def list_all_teachers(db: Session):
    """Return all teacher records (admin use)."""
    return db.query(models.Teacher).order_by(models.Teacher.created_at.desc()).all()


def is_slot_available(db: Session, teacher_id: int, scheduled_date, start_time: str, duration_hours: float) -> bool:
    """Check if a requested time slot fits within teacher availability and does not overlap existing bookings.

    This is a conservative check (simple, clear rules) and should be replaced by a more advanced calendar
    calculation if needed.
    """
    from datetime import datetime, timedelta

    # Convert requested times to minutes since midnight
    def time_to_minutes(t: str) -> int:
        dt = datetime.strptime(t, "%H:%M")
        return dt.hour * 60 + dt.minute

    req_start = time_to_minutes(start_time)
    req_end = req_start + int(duration_hours * 60)

    # Get availability blocks for that teacher on the date
    availability = get_teacher_availability(db, teacher_id, scheduled_date)
    if not availability:
        return False

    # Verify requested slot fits inside at least one availability block
    fits_availability = False
    for slot in availability:
        avail_start = time_to_minutes(slot.start_time)
        avail_end = time_to_minutes(slot.end_time)
        if req_start >= avail_start and req_end <= avail_end:
            fits_availability = True
            break

    if not fits_availability:
        return False

    # Check overlapping bookings (pending/confirmed)
    existing = db.query(models.Booking).filter(
        models.Booking.teacher_id == teacher_id,
        models.Booking.scheduled_date == scheduled_date,
        models.Booking.status.in_(["pending", "confirmed"])
    ).all()

    for b in existing:
        b_start = time_to_minutes(b.start_time)
        b_end = time_to_minutes(b.end_time)
        # Overlap check
        if not (req_end <= b_start or req_start >= b_end):
            return False

    return True


def get_teacher_availability(db: Session, teacher_id: int, specific_date=None):
    """Get teacher availability schedule."""
    query = db.query(models.TeacherAvailability).filter(
        models.TeacherAvailability.teacher_id == teacher_id
    )

    if specific_date:
        # For specific dates, check recurring and one-time slots
        query = query.filter(
            or_(
                and_(
                    models.TeacherAvailability.is_recurring == True,
                    models.TeacherAvailability.day_of_week == specific_date.weekday()
                ),
                and_(
                    models.TeacherAvailability.is_recurring == False,
                    models.TeacherAvailability.specific_date == specific_date
                )
            )
        )
    else:
        # Return all recurring availability
        query = query.filter(models.TeacherAvailability.is_recurring == True)

    return query.all()


def get_teacher_reviews(db: Session, teacher_id: int, page: int = 1, page_size: int = 10):
    """Get paginated reviews for a teacher."""
    offset = (page - 1) * page_size
    return db.query(models.TeacherReview).filter(
        models.TeacherReview.teacher_id == teacher_id,
        models.TeacherReview.status == "published"
    ).order_by(models.TeacherReview.created_at.desc()).offset(offset).limit(page_size).all()


def create_teacher_review(db: Session, review_data, teacher_id: int, parent_id: int):
    """Create a new teacher review."""
    db_review = models.TeacherReview(
        **review_data.dict(),
        teacher_id=teacher_id,
        parent_id=parent_id
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    # Update teacher's average rating and review count
    update_teacher_rating_stats(db, teacher_id)

    return db_review


def update_teacher_rating_stats(db: Session, teacher_id: int):
    """Update teacher's average rating and total reviews after a new review."""
    reviews = db.query(models.TeacherReview).filter(
        models.TeacherReview.teacher_id == teacher_id,
        models.TeacherReview.status == "published"
    ).all()

    if reviews:
        total_rating = sum(review.rating for review in reviews)
        average_rating = total_rating / len(reviews)
        total_reviews = len(reviews)
    else:
        average_rating = 0.0
        total_reviews = 0

    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if teacher:
        teacher.average_rating = average_rating
        teacher.total_reviews = total_reviews
        teacher.updated_at = None
        db.commit()


def get_teacher_subjects(db: Session, teacher_id: int):
    """Get all subjects taught by a teacher."""
    return db.query(models.TeacherSubject).filter(
        models.TeacherSubject.teacher_id == teacher_id
    ).all()


def add_teacher_subject(db: Session, teacher_id: int, subject_name: str, grade_level: str, proficiency_level: str = "expert"):
    """Add a subject for a teacher."""
    db_subject = models.TeacherSubject(
        teacher_id=teacher_id,
        subject_name=subject_name,
        grade_level=grade_level,
        proficiency_level=proficiency_level
    )
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject


# Booking CRUD functions
def create_booking(db: Session, booking_data):
    """Create a new booking."""
    db_booking = models.Booking(**booking_data)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def get_booking_by_id(db: Session, booking_id: int):
    """Get booking by ID with teacher relationship."""
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()


def get_user_bookings(db: Session, user_id: int, status_filter: str = None, page: int = 1, page_size: int = 20):
    """Get bookings for a user (as parent or teacher)."""
    query = db.query(models.Booking).join(models.Teacher).filter(
        or_(
            models.Booking.parent_id == user_id,
            models.Teacher.user_id == user_id
        )
    )

    if status_filter:
        query = query.filter(models.Booking.status == status_filter)

    offset = (page - 1) * page_size
    return query.order_by(models.Booking.created_at.desc()).offset(offset).limit(page_size).all()


def update_booking(db: Session, booking_id: int, booking_data):
    """Update booking details."""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking:
        for key, value in booking_data.dict(exclude_unset=True).items():
            setattr(booking, key, value)

        # Update timestamps based on status
        if booking_data.status:
            if booking_data.status == "confirmed" and not booking.confirmed_at:
                booking.confirmed_at = None  # Will be set by SQLAlchemy
            elif booking_data.status == "completed" and not booking.completed_at:
                booking.completed_at = None
            elif booking_data.status == "cancelled" and not booking.cancelled_at:
                booking.cancelled_at = None

        db.commit()
        db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking_id: int, cancellation_reason: str = None):
    """Cancel a booking."""
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking and booking.status in ["pending", "confirmed"]:
        booking.status = "cancelled"
        booking.cancelled_at = None
        if cancellation_reason:
            booking.teacher_notes = f"Cancellation reason: {cancellation_reason}"
        db.commit()
        return True
    return False


def get_teacher_bookings(db: Session, teacher_id: int, status_filter: str = None, date_filter=None):
    """Get all bookings for a specific teacher."""
    query = db.query(models.Booking).filter(models.Booking.teacher_id == teacher_id)

    if status_filter:
        query = query.filter(models.Booking.status == status_filter)

    if date_filter:
        query = query.filter(models.Booking.scheduled_date >= date_filter)

    return query.order_by(models.Booking.scheduled_date.asc()).all()


def get_available_slots(db: Session, teacher_id: int, date):
    """Get available time slots for a teacher on a specific date."""
    # Get teacher's availability for that day
    availability = crud.get_teacher_availability(db, teacher_id, date)

    # Get existing bookings for that date
    existing_bookings = db.query(models.Booking).filter(
        models.Booking.teacher_id == teacher_id,
        models.Booking.scheduled_date == date,
        models.Booking.status.in_(["pending", "confirmed"])
    ).all()

    # Calculate available slots (this is a simplified version)
    # TODO: Implement proper availability calculation
    return availability