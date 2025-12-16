from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import os
import uuid
from typing import List
import shutil
from pathlib import Path

from db import get_db
import models
from api.auth import get_current_user

router = APIRouter(prefix="/uploads", tags=["uploads"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


def validate_image(file: UploadFile) -> None:
    """Validate uploaded image file"""
    # Check file extension
    file_ext = Path(file.filename).suffix.lower() if file.filename else ""
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Check content type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )


async def save_upload_file(upload_file: UploadFile, folder: str) -> str:
    """Save uploaded file and return the URL path"""
    validate_image(upload_file)

    # Generate unique filename
    file_ext = Path(upload_file.filename).suffix.lower() if upload_file.filename else ".jpg"
    filename = f"{uuid.uuid4()}{file_ext}"

    # Create folder if it doesn't exist
    folder_path = UPLOAD_DIR / folder
    folder_path.mkdir(exist_ok=True)

    # Save file
    file_path = folder_path / filename

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()

    # Return URL path (relative to uploads directory)
    return f"/uploads/{folder}/{filename}"


@router.post("/school/{school_id}/photo")
async def upload_school_photo(
    school_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a photo for a school (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Check if school exists
    school = db.query(models.School).filter(models.School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    # Save the file
    photo_url = await save_upload_file(file, f"schools/{school_id}")

    # Add photo URL to school's photos array
    if school.photos is None:
        school.photos = []

    if isinstance(school.photos, list):
        school.photos.append(photo_url)
    else:
        school.photos = [photo_url]

    db.commit()
    db.refresh(school)

    return {"photo_url": photo_url, "total_photos": len(school.photos)}


@router.delete("/school/{school_id}/photo")
async def delete_school_photo(
    school_id: int,
    photo_url: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a school photo (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Check if school exists
    school = db.query(models.School).filter(models.School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    # Remove photo URL from array
    if school.photos and isinstance(school.photos, list) and photo_url in school.photos:
        school.photos.remove(photo_url)
        db.commit()

        # Try to delete the physical file
        try:
            file_path = Path(photo_url.lstrip("/"))
            if file_path.exists():
                file_path.unlink()
        except Exception as e:
            print(f"Failed to delete file {photo_url}: {e}")

        return {"message": "Photo deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Photo not found")


@router.post("/teacher/{teacher_id}/profile-image")
async def upload_teacher_profile_image(
    teacher_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload profile image for a teacher"""
    # Check if teacher exists
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Only teacher owner or admin can upload
    if teacher.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access denied")

    # Delete old profile image file if it exists
    if teacher.profile_image:
        try:
            old_file_path = Path(teacher.profile_image.lstrip("/"))
            if old_file_path.exists():
                old_file_path.unlink()
        except Exception as e:
            print(f"Failed to delete old profile image: {e}")

    # Save the new file
    image_url = await save_upload_file(file, f"teachers/{teacher_id}")

    # Update teacher profile image
    teacher.profile_image = image_url
    db.commit()
    db.refresh(teacher)

    return {"profile_image": image_url}


@router.delete("/teacher/{teacher_id}/profile-image")
async def delete_teacher_profile_image(
    teacher_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete teacher profile image"""
    # Check if teacher exists
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # Only teacher owner or admin can delete
    if teacher.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Access denied")

    if not teacher.profile_image:
        raise HTTPException(status_code=404, detail="No profile image to delete")

    # Try to delete the physical file
    try:
        file_path = Path(teacher.profile_image.lstrip("/"))
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        print(f"Failed to delete file: {e}")

    # Remove from database
    teacher.profile_image = None
    db.commit()

    return {"message": "Profile image deleted successfully"}
