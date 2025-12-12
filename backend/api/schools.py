from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

import crud
import schemas
from db import get_db

router = APIRouter()


@router.get("/", response_model=List[schemas.SchoolOut])
def read_schools(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.list_schools(db, skip=skip, limit=limit)


@router.post("/", response_model=schemas.SchoolOut)
def create_school(school_in: schemas.SchoolCreate, db: Session = Depends(get_db)):
    school = crud.create_school(db, school_in)
    return school


@router.get("/{school_id}", response_model=schemas.SchoolOut)
def get_school(school_id: int, db: Session = Depends(get_db)):
    school = crud.get_school(db, school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school


# Staging review endpoints


@router.get("/staging", response_model=List[schemas.StagingOut])
def list_staging(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    return crud.list_staging(db, skip=skip, limit=limit)


@router.get("/staging/{staging_id}", response_model=schemas.StagingOut)
def get_staging(staging_id: int, db: Session = Depends(get_db)):
    s = crud.get_staging(db, staging_id)
    if not s:
        raise HTTPException(status_code=404, detail="Staging row not found")
    return s


@router.post("/staging/{staging_id}/accept", response_model=schemas.SchoolOut)
def accept_staging(staging_id: int, db: Session = Depends(get_db)):
    school = crud.accept_staging(db, staging_id)
    if not school:
        raise HTTPException(status_code=404, detail="Staging row not found")
    return school


@router.post("/staging/{staging_id}/reject")
def reject_staging(staging_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_staging(db, staging_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Staging row not found")
    return {"deleted": True}
