from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os

import models
import db
import auth

router = APIRouter(prefix="/api/test", tags=["test"])


def _ensure_enabled():
    if os.environ.get("ENABLE_TEST_ENDPOINTS") != "1":
        raise HTTPException(status_code=403, detail="Test endpoints are disabled")


class CreateTeacherReq(BaseModel):
    full_name: str
    user_id: int | None = None
    bio: str = ""


@router.post("/create-teacher")
def create_teacher(payload: CreateTeacherReq, _=Depends(_ensure_enabled), db=Depends(db.get_db)):
    # Use the injected DB session from the dependency
    s = db
    teacher = models.Teacher(
        user_id=payload.user_id or 99999,
        full_name=payload.full_name,
        bio=payload.bio
    )
    s.add(teacher)
    s.commit()
    s.refresh(teacher)
    return {"id": teacher.id}


class SimulatePaymentReq(BaseModel):
    booking_id: int
    event_type: str = "payment_intent.succeeded"


@router.post("/simulate-payment-event")
def simulate_payment_event(payload: SimulatePaymentReq, _=Depends(_ensure_enabled), db=Depends(db.get_db)):
    # Use injected DB session
    s = db
    booking = s.query(models.Booking).filter(models.Booking.id == payload.booking_id).one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="booking not found")

    # mimic webhook handling: set payment_status and status
    if payload.event_type == "payment_intent.succeeded":
        booking.payment_status = "paid"
        booking.status = "confirmed"
    elif payload.event_type == "payment_intent.payment_failed":
        booking.payment_status = "failed"
        booking.status = "failed"
    else:
        raise HTTPException(status_code=400, detail="unsupported event_type")

    s.add(booking)
    s.commit()
    s.refresh(booking)
    return {"booking_id": booking.id, "status": booking.status, "payment_status": booking.payment_status}


class CreatePayoutReq(BaseModel):
    teacher_id: int
    amount: float
    currency: str = "QAR"


class CreateUserReq(BaseModel):
    email: str
    password: str
    full_name: str = "Test User"
    is_admin: bool = False


@router.post("/create-payout")
def create_payout(payload: CreatePayoutReq, _=Depends(_ensure_enabled), db=Depends(db.get_db)):
    s = db
    payout = models.TeacherPayout(teacher_id=payload.teacher_id, amount=payload.amount, currency=payload.currency)
    s.add(payout)
    s.commit()
    s.refresh(payout)
    return {"id": payout.id, "teacher_id": payout.teacher_id, "amount": payout.amount, "status": payout.status}


@router.put("/set-teacher-stripe-account")
def set_teacher_stripe_account(teacher_id: int, stripe_account_id: str, _=Depends(_ensure_enabled), db=Depends(db.get_db)):
    s = db
    teacher = s.query(models.Teacher).filter(models.Teacher.id == teacher_id).one_or_none()
    if not teacher:
        raise HTTPException(status_code=404, detail="teacher not found")
    teacher.stripe_account_id = stripe_account_id
    s.add(teacher)
    s.commit()
    s.refresh(teacher)
    return {"id": teacher.id, "stripe_account_id": teacher.stripe_account_id}


@router.post("/create-user")
def create_user(payload: CreateUserReq, _=Depends(_ensure_enabled), db=Depends(db.get_db)):
    s = db
    hashed = auth.hash_password(payload.password)
    user = models.User(email=payload.email, hashed_password=hashed, full_name=payload.full_name, is_active=True, is_admin=payload.is_admin)
    s.add(user)
    s.commit()
    s.refresh(user)

    # create access token
    token = auth.create_access_token({"sub": user.email})
    return {"id": user.id, "email": user.email, "access_token": token}


@router.get("/payouts/{teacher_id}")
def list_payouts_for_teacher(teacher_id: int, _=Depends(_ensure_enabled), db=Depends(db.get_db)):
    s = db
    payouts = s.query(models.TeacherPayout).filter(models.TeacherPayout.teacher_id == teacher_id).order_by(models.TeacherPayout.created_at.desc()).all()
    return [{"id": p.id, "amount": p.amount, "currency": p.currency, "status": p.status} for p in payouts]
