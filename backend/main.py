from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import random
from datetime import datetime, timezone

from database import engine, Base, get_db
import models
import schemas
from ai_engine import classify_grievance
from seed import seed_db
from utils.translator import translate_grievance

# Create DB tables
Base.metadata.create_all(bind=engine)
# Seed DB
seed_db()

app = FastAPI(
    title="SudhaarAI API",
    description="Citizen Grievance Classification & Routing Engine API",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"name": "SudhaarAI API", "status": "online", "version": "1.0.0"}

@app.post("/api/grievances", response_model=schemas.GrievanceResponse)
async def create_grievance(payload: schemas.GrievanceCreate, db: Session = Depends(get_db)):
    ticket_id = f"SUD-{random.randint(10000, 99999)}"
    
    # 1. Translate incoming raw text to English
    translation = await translate_grievance(payload.description)
    translated_text = translation["translated_text"]
    detected_lang = translation["detected_language"]

    # 2. Run AI engine classification on translated English text
    classification = classify_grievance(translated_text, payload.location)
    
    # Deriving title if default
    title = payload.title
    if not title or title == "Civic Grievance":
        title = f"{classification['category']} Issue - {payload.location.split(',')[0] if ',' in payload.location else payload.location}"

    grievance = models.Grievance(
        id=ticket_id,
        title=title,
        description=translated_text,          # Translated English text
        original_text=payload.description,    # Raw text as typed by citizen
        detected_language=detected_lang,      # Detected language code (e.g. 'hi')
        location=payload.location,
        photo_url=payload.photo_url or None,
        category=classification["category"],
        urgency=classification["urgency"],
        status="Classified",
        department=classification["department"],
        ai_confidence=classification["ai_confidence"],
        ai_reasoning=classification["ai_reasoning"]
    )
    
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return grievance

@app.get("/api/grievances", response_model=List[schemas.GrievanceResponse])
def get_grievances(
    category: Optional[str] = None,
    urgency: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Grievance)
    
    if category and category != "All":
        query = query.filter(models.Grievance.category == category)
    if urgency and urgency != "All":
        query = query.filter(models.Grievance.urgency == urgency)
    if status and status != "All":
        query = query.filter(models.Grievance.status == status)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (models.Grievance.title.ilike(search_fmt)) |
            (models.Grievance.description.ilike(search_fmt)) |
            (models.Grievance.original_text.ilike(search_fmt)) |
            (models.Grievance.location.ilike(search_fmt)) |
            (models.Grievance.id.ilike(search_fmt))
        )
    
    records = query.all()
    
    # Sort automatically by Urgency (High -> Medium -> Low) then by created_at desc
    urgency_order = {"High": 0, "Medium": 1, "Low": 2}
    records.sort(key=lambda x: (urgency_order.get(x.urgency, 3), -x.created_at.timestamp()))
    
    return records

@app.get("/api/grievances/{id}", response_model=schemas.GrievanceResponse)
def get_grievance_by_id(id: str, db: Session = Depends(get_db)):
    grievance = db.query(models.Grievance).filter(models.Grievance.id == id.upper()).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")
    return grievance

@app.patch("/api/grievances/{id}", response_model=schemas.GrievanceResponse)
def update_grievance(id: str, payload: schemas.GrievanceUpdate, db: Session = Depends(get_db)):
    grievance = db.query(models.Grievance).filter(models.Grievance.id == id.upper()).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")
        
    if payload.status:
        grievance.status = payload.status
    if payload.department:
        grievance.department = payload.department
    if payload.urgency:
        grievance.urgency = payload.urgency
    if payload.category:
        grievance.category = payload.category
        
    grievance.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(grievance)
    return grievance

@app.delete("/api/grievances/{id}")
def delete_grievance(id: str, db: Session = Depends(get_db)):
    grievance = db.query(models.Grievance).filter(models.Grievance.id == id.upper()).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")
    
    db.delete(grievance)
    db.commit()
    return {"status": "success", "message": f"Grievance {id} permanently closed and removed from portal"}

@app.get("/api/analytics")
def get_analytics(db: Session = Depends(get_db)):
    grievances = db.query(models.Grievance).all()
    total = len(grievances)
    
    by_category = {}
    by_urgency = {}
    by_status = {}
    
    for g in grievances:
        by_category[g.category] = by_category.get(g.category, 0) + 1
        by_urgency[g.urgency] = by_urgency.get(g.urgency, 0) + 1
        by_status[g.status] = by_status.get(g.status, 0) + 1
        
    resolved_count = by_status.get("Resolved", 0)
    in_progress_count = by_status.get("In Progress", 0)
    pending_count = total - resolved_count
    
    resolution_rate = round((resolved_count / total * 100) if total > 0 else 0, 1)
    
    return {
        "total_grievances": total,
        "resolved_count": resolved_count,
        "in_progress_count": in_progress_count,
        "pending_count": pending_count,
        "resolution_rate_percent": resolution_rate,
        "by_category": by_category,
        "by_urgency": by_urgency,
        "by_status": by_status
    }
