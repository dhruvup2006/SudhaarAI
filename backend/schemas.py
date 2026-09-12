from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GrievanceCreate(BaseModel):
    title: Optional[str] = "Civic Grievance"
    description: str
    location: str
    photo_url: Optional[str] = None

class GrievanceUpdate(BaseModel):
    status: Optional[str] = None
    department: Optional[str] = None
    urgency: Optional[str] = None
    category: Optional[str] = None

class GrievanceResponse(BaseModel):
    id: str
    title: str
    description: str
    original_text: Optional[str] = None
    detected_language: Optional[str] = "en"
    location: str
    photo_url: Optional[str] = None
    category: str
    urgency: str
    status: str
    department: str
    ai_confidence: float
    ai_reasoning: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OfficerCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    department: str
    category: str
    ward_zone: Optional[str] = "Central Zone"
    password: str
    officer_id: Optional[str] = None

class OfficerResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    department: str
    category: str
    ward_zone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class OfficerLogin(BaseModel):
    officer_id: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class OfficerAuthResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    department: str
    category: str
    ward_zone: Optional[str] = None
    access_token: str
    token_type: str = "bearer"
