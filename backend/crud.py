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
        query = query.filter(models.School.status == 'published')
    elif status:
        query = query.filter(models.School.status == status)

    # Apply filters
    if curriculum:
        query = query.filter(models.School.curriculum.ilike(f'%{curriculum}%'))

    if school_type:
        query = query.filter(models.School.type.ilike(f'%{school_type}%'))

    if search:
        query = query.filter(models.School.name.ilike(f'%{search}%'))

    if location:
        query = query.filter(models.School.address.ilike(f'%{location}%'))

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
    return db.query(models.StagingSchool).filter(models.StagingSchool.id == staging_id).first()


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
        'name': s.name,
        'type': s.type,
        'curriculum': s.curriculum,
        'address': s.address,
        'latitude': s.latitude,
        'longitude': s.longitude,
        'contact': s.contact,
        'website': s.website,
        'fee_structure': s.fee_structure,
        'facilities': s.facilities,
        'photos': s.photos,
        'status': 'published'
    }
    db_obj = models.School(**data)
    db.add(db_obj)
    # remove staging after adding main record
    db.delete(s)
    db.commit()
    db.refresh(db_obj)
    return db_obj
