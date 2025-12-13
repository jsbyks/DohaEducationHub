from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Any
from datetime import datetime


class SchoolBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="School name")
    type: Optional[str] = Field(
        None, max_length=100, description="School type (e.g., Primary, Secondary)"
    )
    curriculum: Optional[str] = Field(
        None, max_length=100, description="Curriculum (e.g., British, American, IB)"
    )
    address: Optional[str] = Field(None, description="Full address")
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="GPS latitude")
    longitude: Optional[float] = Field(
        None, ge=-180, le=180, description="GPS longitude"
    )
    contact: Optional[str] = Field(
        None, max_length=200, description="Contact phone/email"
    )
    website: Optional[str] = Field(
        None, max_length=300, description="School website URL"
    )
    fee_structure: Optional[dict] = Field(None, description="Fee information as JSON")
    facilities: Optional[List[str]] = Field(None, description="List of facilities")
    photos: Optional[List[str]] = Field(None, description="List of photo URLs")


class SchoolCreate(SchoolBase):
    status: Optional[str] = Field("pending", description="Publication status")


class SchoolUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[str] = Field(None, max_length=100)
    curriculum: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    contact: Optional[str] = Field(None, max_length=200)
    website: Optional[str] = Field(None, max_length=300)
    fee_structure: Optional[dict] = None
    facilities: Optional[List[str]] = None
    photos: Optional[List[str]] = None
    status: Optional[str] = None


class SchoolOut(SchoolBase):
    id: int
    status: Optional[str]
    model_config = {"from_attributes": True}


class SchoolListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[SchoolOut]


class StagingOut(SchoolOut):
    """Represents a staging school row for API responses."""

    pass


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    is_admin: bool
    model_config = {"from_attributes": True}


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class RefreshToken(BaseModel):
    refresh_token: str


# Review Schemas
class ReviewCreate(BaseModel):
    school_id: int
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    comment: Optional[str] = Field(None, max_length=1000)


class ReviewUpdate(BaseModel):
    status: Optional[str] = Field(None, description="pending/approved/rejected")


class ReviewOut(BaseModel):
    id: int
    school_id: int
    user_id: int
    rating: int
    comment: Optional[str]
    status: str
    created_at: datetime
    updated_at: Optional[datetime]
    model_config = {"from_attributes": True}


class ReviewWithUser(ReviewOut):
    user_email: str
    user_name: Optional[str]


# Favorite Schemas
class FavoriteCreate(BaseModel):
    school_id: int


class FavoriteOut(BaseModel):
    id: int
    user_id: int
    school_id: int
    created_at: datetime
    model_config = {"from_attributes": True}


# Post Schemas
class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    excerpt: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field("draft", description="draft/published")


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = None
    excerpt: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = None


class PostOut(BaseModel):
    id: int
    author_id: int
    title: str
    slug: str
    content: str
    excerpt: Optional[str]
    status: str
    created_at: datetime
    updated_at: Optional[datetime]
    published_at: Optional[datetime]
    model_config = {"from_attributes": True}


class PostListItem(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str]
    created_at: datetime
    published_at: Optional[datetime]
    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[PostListItem]
