from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import crud
import schemas
from db import get_db
from models import User
from auth import get_current_user

router = APIRouter()


@router.post(
    "/", response_model=schemas.FavoriteOut, status_code=status.HTTP_201_CREATED
)
def add_favorite(
    favorite_data: schemas.FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a school to favorites."""
    return crud.create_favorite(db, current_user.id, favorite_data.school_id)


@router.delete("/{school_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    school_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a school from favorites."""
    success = crud.delete_favorite(db, current_user.id, school_id)
    if not success:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return None


@router.get("/", response_model=List[schemas.FavoriteOut])
def get_my_favorites(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user's favorite schools."""
    return crud.get_user_favorites(db, current_user.id)


@router.get("/check/{school_id}", response_model=dict)
def check_favorite(
    school_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check if a school is favorited by current user."""
    is_favorited = crud.is_school_favorited(db, current_user.id, school_id)
    return {"is_favorited": is_favorited}
