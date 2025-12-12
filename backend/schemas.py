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
    full_name: Optional[str]
