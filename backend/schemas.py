from pydantic import BaseModel, Field
from typing import Optional, List, Any


class SchoolBase(BaseModel):
    name: str
    type: Optional[str] = None
    curriculum: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact: Optional[str] = None
    website: Optional[str] = None


class SchoolCreate(SchoolBase):
    pass


class SchoolOut(SchoolBase):
    id: int
    status: Optional[str]
    model_config = {
        "from_attributes": True
    }


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
