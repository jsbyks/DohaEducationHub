from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Any


class SchoolBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="School name")
    type: Optional[str] = Field(None, max_length=100, description="School type (e.g., Primary, Secondary)")
    curriculum: Optional[str] = Field(None, max_length=100, description="Curriculum (e.g., British, American, IB)")
    address: Optional[str] = Field(None, description="Full address")
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="GPS latitude")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="GPS longitude")
    contact: Optional[str] = Field(None, max_length=200, description="Contact phone/email")
    website: Optional[str] = Field(None, max_length=300, description="School website URL")
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
    model_config = {
        "from_attributes": True
    }


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
    model_config = {
        "from_attributes": True
    }


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
