"""
Schools API endpoints for listing, searching, and managing schools.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
import schemas
from db import get_db
from models import User
from auth import get_current_admin_user

router = APIRouter()


@router.get("/", response_model=schemas.SchoolListResponse)
def list_schools(
    page: int = Query(1, ge=1, description="Page number (starts at 1)"),
    page_size: int = Query(20, ge=1, le=500, description="Results per page"),
    curriculum: Optional[str] = Query(
        None, description="Filter by curriculum (e.g., British, American, IB)"
    ),
    type: Optional[str] = Query(
        None, description="Filter by school type (e.g., Primary, Secondary)"
    ),
    search: Optional[str] = Query(None, description="Search in school name"),
    location: Optional[str] = Query(None, description="Search in address"),
    status: Optional[str] = Query(
        None, description="Filter by status (default: published)"
    ),
    db: Session = Depends(get_db),
):
    """
    List schools with filtering and pagination.

    Filters:
    - curriculum: Filter by curriculum type
    - type: Filter by school type
    - search: Search school names
    - location: Search in addresses
    - status: Filter by publication status (default: published only)

    Pagination:
    - page: Page number (starts at 1)
    - page_size: Results per page (max 500, for map view to show all schools)
    """
    # Calculate skip
    skip = (page - 1) * page_size

    # Get filtered and paginated results
    total, results = crud.list_schools(
        db=db,
        skip=skip,
        limit=page_size,
        curriculum=curriculum,
        school_type=type,
        status=status,
        search=search,
        location=location,
    )

    return {"total": total, "page": page, "page_size": page_size, "results": results}


@router.get("/{school_id}", response_model=schemas.SchoolOut)
def get_school(school_id: int, db: Session = Depends(get_db)):
    """
    Get a single school by ID.

    Args:
        school_id: School ID

    Returns:
        School details

    Raises:
        404: School not found
    """
    school = crud.get_school(db, school_id)
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )
    return school


@router.post("/", response_model=schemas.SchoolOut, status_code=status.HTTP_201_CREATED)
def create_school(
    school_in: schemas.SchoolCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Create a new school (admin only).

    Args:
        school_in: School data
        current_user: Current admin user (from auth token)

    Returns:
        Created school

    Requires:
        Admin authentication
    """
    school = crud.create_school(db, school_in)
    return school


@router.put("/{school_id}", response_model=schemas.SchoolOut)
def update_school(
    school_id: int,
    school_update: schemas.SchoolUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Update a school (admin only).

    Args:
        school_id: School ID to update
        school_update: Fields to update
        current_user: Current admin user (from auth token)

    Returns:
        Updated school

    Raises:
        404: School not found

    Requires:
        Admin authentication
    """
    school = crud.update_school(db, school_id, school_update)
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )
    return school


@router.delete("/{school_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_school(
    school_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Delete a school (admin only).

    Args:
        school_id: School ID to delete
        current_user: Current admin user (from auth token)

    Raises:
        404: School not found

    Requires:
        Admin authentication
    """
    success = crud.delete_school(db, school_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )
    return None


# ===== Staging School Endpoints (Admin Only) =====


@router.get("/staging/list", response_model=List[schemas.StagingOut])
def list_staging(
    skip: int = Query(0, ge=0),
    limit: int = Query(200, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    List staging schools awaiting review (admin only).

    Args:
        skip: Number of records to skip
        limit: Max records to return
        current_user: Current admin user

    Returns:
        List of staging schools

    Requires:
        Admin authentication
    """
    return crud.list_staging(db, skip=skip, limit=limit)


@router.get("/staging/{staging_id}", response_model=schemas.StagingOut)
def get_staging(
    staging_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Get a single staging school by ID (admin only).

    Args:
        staging_id: Staging school ID
        current_user: Current admin user

    Returns:
        Staging school details

    Raises:
        404: Staging school not found

    Requires:
        Admin authentication
    """
    s = crud.get_staging(db, staging_id)
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Staging school not found"
        )
    return s


@router.post("/staging/{staging_id}/accept", response_model=schemas.SchoolOut)
def accept_staging(
    staging_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Accept a staging school and publish it (admin only).

    Moves the staging school to the main schools table with 'published' status.

    Args:
        staging_id: Staging school ID to accept
        current_user: Current admin user

    Returns:
        Newly created published school

    Raises:
        404: Staging school not found

    Requires:
        Admin authentication
    """
    school = crud.accept_staging(db, staging_id)
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Staging school not found"
        )
    return school


@router.delete("/staging/{staging_id}", status_code=status.HTTP_204_NO_CONTENT)
def reject_staging(
    staging_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
):
    """
    Reject and delete a staging school (admin only).

    Args:
        staging_id: Staging school ID to reject
        current_user: Current admin user

    Raises:
        404: Staging school not found

    Requires:
        Admin authentication
    """
    ok = crud.delete_staging(db, staging_id)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Staging school not found"
        )
    return None
