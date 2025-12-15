"""
Teachers API endpoints for the teacher marketplace.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime

import crud
import schemas
from db import get_db
from models import User
from auth import get_current_user

router = APIRouter()


from pydantic import BaseModel

# Pydantic schemas for teachers
class TeacherBase(BaseModel):
    full_name: str
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    years_experience: Optional[int] = None
    languages: Optional[List[str]] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    city: Optional[str] = None
    areas_served: Optional[List[str]] = None
    qualifications: Optional[List[str]] = None
    specializations: Optional[List[str]] = None
    grade_levels: Optional[List[str]] = None
    curricula_expertise: Optional[List[str]] = None
    teaches_online: bool = True
    teaches_in_person: bool = True
    hourly_rate_qatari: Optional[float] = None
    hourly_rate_online: Optional[float] = None
    currency: str = "QAR"
    availability_schedule: Optional[dict] = None
    timezone: str = "Asia/Qatar"


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(TeacherBase):
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class Teacher(TeacherBase):
    id: int
    user_id: int
    is_verified: bool
    background_check_status: str
    average_rating: float
    total_reviews: int
    total_sessions: int
    is_active: bool
    is_featured: bool
    stripe_account_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TeacherSearchFilters(BaseModel):
    subject: Optional[str] = None
    grade_level: Optional[str] = None
    curriculum: Optional[str] = None
    city: Optional[str] = None
    teaches_online: Optional[bool] = None
    teaches_in_person: Optional[bool] = None
    min_rating: Optional[float] = None
    max_hourly_rate: Optional[float] = None
    language: Optional[str] = None
    is_verified: Optional[bool] = None
    available_today: Optional[bool] = None


@router.post("/", response_model=Teacher, status_code=status.HTTP_201_CREATED)
def create_teacher(
    teacher: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new teacher profile for the current user.
    """
    # Check if user already has a teacher profile
    existing_teacher = crud.get_teacher_by_user_id(db, current_user.id)
    if existing_teacher:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a teacher profile"
        )

    return crud.create_teacher(db, teacher, current_user.id)


@router.get("/me", response_model=Teacher)
def get_my_teacher_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get the current user's teacher profile.
    """
    teacher = crud.get_teacher_by_user_id(db, current_user.id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found"
        )
    return teacher


@router.put("/me", response_model=Teacher)
def update_my_teacher_profile(
    teacher_update: TeacherUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update the current user's teacher profile.
    """
    teacher = crud.get_teacher_by_user_id(db, current_user.id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found"
        )

    return crud.update_teacher(db, teacher.id, teacher_update)


@router.get("/all", response_model=List[Teacher])
def list_all_teachers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin-only: return all teachers."""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return crud.list_all_teachers(db)


@router.get("/", response_model=List[Teacher])
def search_teachers(
    subject: Optional[str] = Query(None, description="Filter by subject specialization"),
    grade_level: Optional[str] = Query(None, description="Filter by grade level"),
    curriculum: Optional[str] = Query(None, description="Filter by curriculum expertise"),
    city: Optional[str] = Query(None, description="Filter by city"),
    teaches_online: Optional[bool] = Query(None, description="Filter by online teaching capability"),
    teaches_in_person: Optional[bool] = Query(None, description="Filter by in-person teaching capability"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum average rating"),
    max_hourly_rate: Optional[float] = Query(None, ge=0, description="Maximum hourly rate"),
    language: Optional[str] = Query(None, description="Filter by teaching language"),
    is_verified: Optional[bool] = Query(None, description="Filter by verification status"),
    sort_by: str = Query("average_rating", description="Sort by: average_rating, hourly_rate_qatari, total_reviews"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Results per page"),
    db: Session = Depends(get_db)
):
    """
    Search and filter teachers with pagination.
    """
    filters = TeacherSearchFilters(
        subject=subject,
        grade_level=grade_level,
        curriculum=curriculum,
        city=city,
        teaches_online=teaches_online,
        teaches_in_person=teaches_in_person,
        min_rating=min_rating,
        max_hourly_rate=max_hourly_rate,
        language=language,
        is_verified=is_verified
    )

    return crud.search_teachers(
        db, filters, sort_by, sort_order, page, page_size
    )


@router.get("/{teacher_id}", response_model=Teacher)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)):
    """
    Get a specific teacher profile by ID.
    """
    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    return teacher


@router.get("/{teacher_id}/availability")
def get_teacher_availability(
    teacher_id: int,
    date: Optional[date] = Query(None, description="Specific date to check availability"),
    db: Session = Depends(get_db)
):
    """
    Get a teacher's availability schedule.
    """
    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )

    return crud.get_teacher_availability(db, teacher_id, date)


@router.get("/{teacher_id}/reviews")
def get_teacher_reviews(
    teacher_id: int,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Get reviews for a specific teacher.
    """
    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )

    return crud.get_teacher_reviews(db, teacher_id, page, page_size)


# Admin-only endpoints
@router.put("/{teacher_id}/verification", response_model=Teacher)
def update_teacher_verification(
    teacher_id: int,
    is_verified: bool,
    background_check_status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin endpoint to update teacher verification status.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )

    return crud.update_teacher_verification(
        db, teacher_id, is_verified, background_check_status
    )


@router.put("/{teacher_id}/featured", response_model=Teacher)
def toggle_teacher_featured(
    teacher_id: int,
    is_featured: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Admin endpoint to toggle teacher featured status.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )

    return crud.update_teacher_featured(db, teacher_id, is_featured)


@router.put("/{teacher_id}/stripe-account", response_model=Teacher)
def set_teacher_stripe_account(
    teacher_id: int,
    stripe_account_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Set/update a teacher's Stripe Connect account id. Teacher or admin can perform."""
    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")

    # allow teacher owner or admin
    if not (current_user.is_admin or teacher.user_id == current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return crud.update_teacher_stripe_account(db, teacher_id, stripe_account_id)


class PayoutRequest(BaseModel):
    amount: float
    currency: Optional[str] = "QAR"


@router.post("/{teacher_id}/payouts", status_code=status.HTTP_201_CREATED)
def request_payout(
    teacher_id: int,
    payout: PayoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Request a payout for a teacher's earnings. Teacher or admin can request."""
    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")

    if not (current_user.is_admin or teacher.user_id == current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    if not teacher.stripe_account_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Teacher does not have a connected Stripe account")

    payout_record = crud.create_teacher_payout(db, teacher_id, payout.amount, payout.currency)
    return payout_record


@router.get("/{teacher_id}/payouts")
def list_payouts(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    teacher = crud.get_teacher_by_id(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")

    if not (current_user.is_admin or teacher.user_id == current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return crud.list_teacher_payouts(db, teacher_id)

