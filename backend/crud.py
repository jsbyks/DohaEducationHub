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
