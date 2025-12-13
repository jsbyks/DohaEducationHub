from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List

import crud
import schemas
from db import get_db
from models import User
from auth import get_current_user, get_current_admin_user

router = APIRouter()


@router.post("/", response_model=schemas.ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    review_data: schemas.ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a review for a school (authenticated users only)."""
    review = crud.create_review(db, review_data, current_user.id)
    return review


@router.get("/school/{school_id}", response_model=List[schemas.ReviewOut])
def get_school_reviews(school_id: int, db: Session = Depends(get_db)):
    """Get approved reviews for a school (public endpoint)."""
    return crud.get_reviews_for_school(db, school_id, status="approved")


@router.get("/my-reviews", response_model=List[schemas.ReviewOut])
def get_my_reviews(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user's reviews."""
    return crud.get_reviews_by_user(db, current_user.id)


@router.get("/pending", response_model=List[schemas.ReviewOut])
def list_pending_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """List pending reviews for moderation (admin only)."""
    total, results = crud.list_pending_reviews(db, skip, limit)
    return results


@router.patch("/{review_id}/status", response_model=schemas.ReviewOut)
def update_review_status(
    review_id: int,
    review_update: schemas.ReviewUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Approve or reject a review (admin only)."""
    review = crud.update_review_status(db, review_id, review_update.status)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    """Delete a review (admin only)."""
    success = crud.delete_review(db, review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")
    return None
