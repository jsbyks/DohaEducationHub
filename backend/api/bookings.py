"""
Bookings API endpoints for teacher marketplace.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime

import crud
from db import get_db
from models import User
from auth import get_current_user

router = APIRouter()


from pydantic import BaseModel

# Pydantic schemas for bookings
class BookingCreate(BaseModel):
    teacher_id: int
    subject: str
    grade_level: Optional[str] = None
    session_type: str  # "online" or "in_person"
    duration_hours: float = 1.0
    scheduled_date: date
    start_time: str  # "HH:MM" format
    location: Optional[str] = None  # For in-person sessions
    special_requests: Optional[str] = None


class BookingUpdate(BaseModel):
    status: Optional[str] = None
    special_requests: Optional[str] = None
    teacher_notes: Optional[str] = None


class Booking(BaseModel):
    id: int
    teacher_id: int
    parent_id: int
    subject: str
    grade_level: Optional[str]
    session_type: str
    duration_hours: float
    scheduled_date: date
    start_time: str
    end_time: str
    location: Optional[str]
    meeting_link: Optional[str]
    status: str
    payment_status: str
    hourly_rate: float
    total_amount: float
    commission_amount: float
    teacher_amount: float
    special_requests: Optional[str]
    teacher_notes: Optional[str]
    created_at: datetime
    confirmed_at: Optional[datetime]
    completed_at: Optional[datetime]
    cancelled_at: Optional[datetime]

    class Config:
        from_attributes = True


@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new booking for a teacher session.
    """
    # Validate teacher exists and is active
    teacher = crud.get_teacher_by_id(db, booking.teacher_id)
    if not teacher or not teacher.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found or unavailable"
        )

    # Validate the booking time is available
    if not crud.is_slot_available(db, booking.teacher_id, booking.scheduled_date, booking.start_time, booking.duration_hours):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Requested time slot is not available"
        )

    # Calculate pricing
    if booking.session_type == "online" and teacher.hourly_rate_online:
        hourly_rate = teacher.hourly_rate_online
    elif booking.session_type == "in_person" and teacher.hourly_rate_qatari:
        hourly_rate = teacher.hourly_rate_qatari
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Teacher does not offer this session type or pricing not set"
        )

    total_amount = hourly_rate * booking.duration_hours
    commission_rate = 0.15  # 15% platform commission
    commission_amount = total_amount * commission_rate
    teacher_amount = total_amount - commission_amount

    booking_data = {
        **booking.dict(),
        "parent_id": current_user.id,
        "hourly_rate": hourly_rate,
        "total_amount": total_amount,
        "commission_amount": commission_amount,
        "teacher_amount": teacher_amount,
        "end_time": calculate_end_time(booking.start_time, booking.duration_hours)
    }

    return crud.create_booking(db, booking_data)


@router.get("/", response_model=List[Booking])
def get_my_bookings(
    status_filter: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get current user's bookings (as parent or teacher).
    """
    return crud.get_user_bookings(db, current_user.id, status_filter, page, page_size)


@router.get("/teacher/", response_model=List[Booking])
def get_teacher_bookings(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get bookings for the authenticated teacher.
    """
    # Get teacher's profile
    teacher = crud.get_teacher_by_user_id(db, current_user.id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found"
        )

    return crud.get_teacher_bookings(db, teacher.id, status)


@router.put("/teacher/{booking_id}", response_model=Booking)
def update_teacher_booking(
    booking_id: int,
    updates: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a booking as a teacher (confirm, complete, add notes).
    """
    # Get teacher's profile
    teacher = crud.get_teacher_by_user_id(db, current_user.id)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher profile not found"
        )

    # Get booking and verify it belongs to this teacher
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking.teacher_id != teacher.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own bookings"
        )

    # Validate status transition
    if updates.status and not validate_status_transition(
        booking.status, updates.status, False, True
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot change booking status from {booking.status} to {updates.status}"
        )

    # Update timestamps based on status
    update_data = updates.dict(exclude_unset=True)
    if updates.status == "confirmed":
        update_data["confirmed_at"] = datetime.utcnow()
    elif updates.status == "completed":
        update_data["completed_at"] = datetime.utcnow()
    elif updates.status == "cancelled":
        update_data["cancelled_at"] = datetime.utcnow()

    return crud.update_booking(db, booking_id, update_data)


@router.get("/{booking_id}", response_model=Booking)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific booking by ID.
    """
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Check if user is authorized to view this booking
    if booking.parent_id != current_user.id and booking.teacher.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )

    return booking


@router.put("/{booking_id}", response_model=Booking)
def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a booking (status, notes, etc.).
    """
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Check permissions based on user role and booking status
    is_parent = booking.parent_id == current_user.id
    is_teacher = booking.teacher.user_id == current_user.id
    is_admin = current_user.is_admin

    if not (is_parent or is_teacher or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this booking"
        )

    # Validate status transitions
    if booking_update.status:
        if not validate_status_transition(booking.status, booking_update.status, is_parent, is_teacher):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status transition from {booking.status} to {booking_update.status}"
            )

    return crud.update_booking(db, booking_id, booking_update)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(
    booking_id: int,
    cancellation_reason: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cancel a booking.
    """
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Only parent or admin can cancel
    if booking.parent_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the parent or admin can cancel this booking"
        )

    # Check if cancellation is allowed (not too close to session time)
    if not can_cancel_booking(booking):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel booking less than 24 hours before session"
        )

    crud.cancel_booking(db, booking_id, cancellation_reason)


# Helper functions
def calculate_end_time(start_time: str, duration_hours: float) -> str:
    """Calculate end time from start time and duration."""
    from datetime import datetime, timedelta

    start = datetime.strptime(start_time, "%H:%M")
    end = start + timedelta(hours=duration_hours)
    return end.strftime("%H:%M")


def validate_status_transition(current_status: str, new_status: str, is_parent: bool, is_teacher: bool) -> bool:
    """Validate if a status transition is allowed."""
    valid_transitions = {
        "pending": ["confirmed", "cancelled"],
        "confirmed": ["completed", "cancelled"],
        "completed": [],  # Cannot change completed bookings
        "cancelled": []   # Cannot change cancelled bookings
    }

    if new_status not in valid_transitions.get(current_status, []):
        return False

    # Additional business logic
    if new_status == "confirmed" and not is_teacher:
        return False  # Only teacher can confirm

    if new_status == "completed" and not is_teacher:
        return False  # Only teacher can mark as completed

    return True


def can_cancel_booking(booking) -> bool:
    """Check if booking can be cancelled (24+ hours before session)."""
    from datetime import datetime, timedelta

    # Combine date and time for comparison
    session_datetime = datetime.combine(
        booking.scheduled_date,
        datetime.strptime(booking.start_time, "%H:%M").time()
    )

    # Must be at least 24 hours before session
    return datetime.now() < (session_datetime - timedelta(hours=24))

