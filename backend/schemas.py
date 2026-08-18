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
