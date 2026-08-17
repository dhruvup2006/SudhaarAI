from sqlalchemy import Column, String, Float, DateTime, Text
from datetime import datetime, timezone
from database import Base

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False, default="Civic Grievance")
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    photo_url = Column(String, nullable=True)
    category = Column(String, nullable=False, default="General")
    urgency = Column(String, nullable=False, default="Medium")
    status = Column(String, nullable=False, default="Submitted")
    department = Column(String, nullable=False, default="Municipal Services")
    ai_confidence = Column(Float, nullable=False, default=0.92)
    ai_reasoning = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
