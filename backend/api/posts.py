from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import crud
import schemas
from db import get_db
from models import User
from auth import get_current_user, get_current_admin_user

router = APIRouter()


@router.get("/", response_model=schemas.PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """List published blog posts (public)."""
    skip = (page - 1) * page_size
    total, results = crud.list_posts(db, skip, page_size, status='published')
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "results": results
    }


@router.get("/all", response_model=schemas.PostListResponse)
def list_all_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """List all posts including drafts (admin only)."""
    skip = (page - 1) * page_size
    total, results = crud.list_posts(db, skip, page_size, status=None)
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "results": results
    }


@router.get("/{slug}", response_model=schemas.PostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    """Get a single blog post by slug."""
    post = crud.get_post_by_slug(db, slug)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    # Only show published posts to non-admins
    if post.status != 'published':
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.get("/id/{post_id}", response_model=schemas.PostOut)
def get_post_by_id(
    post_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get a single blog post by ID (admin only, for editing)."""
    post = crud.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", response_model=schemas.PostOut, status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: schemas.PostCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new blog post (admin only)."""
    return crud.create_post(db, post_data, current_user.id)


@router.put("/{post_id}", response_model=schemas.PostOut)
def update_post(
    post_id: int,
    post_update: schemas.PostUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a blog post (admin only)."""
    post = crud.update_post(db, post_id, post_update)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a blog post (admin only)."""
    success = crud.delete_post(db, post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return None
