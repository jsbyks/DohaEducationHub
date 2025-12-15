"""
Payment processing API endpoints using Stripe.
"""

import os
try:
    import stripe
except Exception:
    stripe = None

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

import crud
from db import get_db
from models import User, Booking
from auth import get_current_user

router = APIRouter()

# Initialize Stripe with secret key if library is available
if stripe is not None:
    stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')

@router.post("/create-payment-intent")
def create_payment_intent(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a Stripe PaymentIntent for a booking.
    """
    # Get the booking
    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Verify user owns this booking
    if booking.parent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only pay for your own bookings"
        )

    # Check if payment already exists
    if booking.payment_status == "paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment already completed"
        )

    if stripe is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe library not configured on server")

    try:
        # Create PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=int(booking.total_amount * 100),  # Convert to cents
            currency=booking.currency.lower(),
            metadata={
                'booking_id': booking_id,
                'teacher_id': booking.teacher_id,
                'parent_id': booking.parent_id,
            },
            description=f"Booking with {booking.teacher.full_name} - {booking.subject}",
            automatic_payment_methods={
                'enabled': True,
            },
        )

        return {
            'clientSecret': intent.client_secret,
            'paymentIntentId': intent.id,
            'amount': booking.total_amount,
            'currency': booking.currency,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment creation failed: {str(e)}"
        )


@router.post("/confirm-payment/{payment_intent_id}")
def confirm_payment(
    payment_intent_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Confirm payment completion and update booking status.
    """
    try:
        # Retrieve the PaymentIntent
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        # Extract booking ID from metadata
        booking_id = intent.metadata.get('booking_id')
        if not booking_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment intent"
            )

        # Get and update the booking
        booking = crud.get_booking_by_id(db, int(booking_id))
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )

        # Verify user owns this booking
        if booking.parent_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized"
            )

        # Update booking status based on payment status
        if intent.status == 'succeeded':
            booking.payment_status = 'paid'
            booking.status = 'confirmed'
            # Could trigger email notifications here

        elif intent.status == 'requires_payment_method':
            booking.payment_status = 'failed'

        db.commit()

        return {
            'status': intent.status,
            'booking_status': booking.status,
            'payment_status': booking.payment_status,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment confirmation failed: {str(e)}"
        )


@router.post("/payout/{booking_id}")
def create_payout(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a payout to the teacher (admin only).
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    booking = crud.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Check if booking is completed and payment received
    if booking.status != 'completed' or booking.payment_status != 'paid':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking must be completed and paid before payout"
        )

    try:
        # In a real implementation, you'd need the teacher's Stripe account ID
        # For now, we'll simulate the payout
        # payout = stripe.Payout.create(
        #     amount=int(booking.teacher_amount * 100),
        #     currency=booking.currency.lower(),
        #     destination=teacher.stripe_account_id,
        # )

        # Mark payout as completed
        booking.payout_status = 'completed'
        db.commit()

        return {
            'status': 'success',
            'message': f'Payout of {booking.teacher_amount} {booking.currency} processed to teacher',
            'amount': booking.teacher_amount,
            'currency': booking.currency,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payout failed: {str(e)}"
        )


from fastapi import Request, Header, Depends

# Webhook endpoint for Stripe events with optional signature verification
@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None), db: Session = Depends(get_db)):
    """
    Handle Stripe webhook events. If `STRIPE_WEBHOOK_SECRET` is set, verify signature; otherwise accept
    and attempt to parse the payload (useful for local testing).
    """
    payload = await request.body()
    endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        if endpoint_secret and stripe_signature and stripe is not None:
            # Validate signature
            event = stripe.Webhook.construct_event(payload, stripe_signature, endpoint_secret)
        else:
            # Fallback: parse payload without verification (not recommended for production)
            import json
            event = json.loads(payload)

        evt_type = event.get('type')
        data = event.get('data', {}).get('object', {})

        # Handle relevant PaymentIntent events
        if evt_type == 'payment_intent.succeeded':
            booking_id = data.get('metadata', {}).get('booking_id')
            if booking_id:
                booking = crud.get_booking_by_id(db, int(booking_id))
                if booking:
                    booking.payment_status = 'paid'
                    booking.status = 'confirmed'
                    db.commit()
        elif evt_type == 'payment_intent.payment_failed':
            booking_id = data.get('metadata', {}).get('booking_id')
            if booking_id:
                booking = crud.get_booking_by_id(db, int(booking_id))
                if booking:
                    booking.payment_status = 'failed'
                    db.commit()

        return {"status": "received"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook processing failed: {str(e)}"
        )

