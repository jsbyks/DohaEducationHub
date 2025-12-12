from sqlalchemy.orm import Session
import models
import schemas


def get_school(db: Session, school_id: int):
    return db.query(models.School).filter(models.School.id == school_id).first()


def list_schools(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.School).offset(skip).limit(limit).all()


def create_school(db: Session, school: schemas.SchoolCreate):
    db_obj = models.School(**school.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


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
