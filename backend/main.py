from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import random
import os
from datetime import datetime, timezone

from database import engine, Base, get_db, mongo_available, grievances_col, officers_col
import models
import schemas
from ai_engine import classify_grievance
from seed import seed_db
from utils.translator import translate_grievance
from auth import (
    hash_password, 
    verify_password, 
    create_access_token, 
    get_current_officer
)

# Create DB tables for SQLite fallback
Base.metadata.create_all(bind=engine)
# Seed DB
seed_db()

app = FastAPI(
    title="SudhaarAI API",
    description="Citizen Grievance Engine & MongoDB Atlas + JWT Auth API",
    version="2.0.0"
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
    return {
        "name": "SudhaarAI API", 
        "status": "online", 
        "version": "2.0.0",
        "mongodb": "connected" if mongo_available else "fallback",
        "jwt_auth": "enabled"
    }

# ==================== GRIEVANCES ENDPOINTS ====================

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

    now = datetime.now(timezone.utc)

    # 3. Store in MongoDB Atlas if available
    if mongo_available and grievances_col is not None:
        try:
            mongo_doc = {
                "_id": ticket_id,
                "id": ticket_id,
                "title": title,
                "description": translated_text,
                "original_text": payload.description,
                "detected_language": detected_lang,
                "location": payload.location,
                "photo_url": payload.photo_url or None,
                "category": classification["category"],
                "urgency": classification["urgency"],
                "status": "Classified",
                "department": classification["department"],
                "ai_confidence": classification["ai_confidence"],
                "ai_reasoning": classification["ai_reasoning"],
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            }
            grievances_col.replace_one({"_id": ticket_id}, mongo_doc, upsert=True)
        except Exception as e:
            print(f"MongoDB write exception: {e}")

    # 4. Store in SQLite DB as dual persistence
    grievance = models.Grievance(
        id=ticket_id,
        title=title,
        description=translated_text,          # Translated English text
        original_text=payload.description,    # Raw text as typed by citizen
        detected_language=detected_lang,      # Detected language code
        location=payload.location,
        photo_url=payload.photo_url or None,
        category=classification["category"],
        urgency=classification["urgency"],
        status="Classified",
        department=classification["department"],
        ai_confidence=classification["ai_confidence"],
        ai_reasoning=classification["ai_reasoning"],
        created_at=now,
        updated_at=now
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
    # Try fetching from MongoDB Atlas
    if mongo_available and grievances_col is not None:
        try:
            query = {}
            if category and category != "All":
                query["category"] = category
            if urgency and urgency != "All":
                query["urgency"] = urgency
            if status and status != "All":
                query["status"] = status
            if search:
                query["$or"] = [
                    {"title": {"$regex": search, "$options": "i"}},
                    {"description": {"$regex": search, "$options": "i"}},
                    {"original_text": {"$regex": search, "$options": "i"}},
                    {"location": {"$regex": search, "$options": "i"}},
                    {"id": {"$regex": search, "$options": "i"}}
                ]

            docs = list(grievances_col.find(query))
            if docs:
                records = []
                for d in docs:
                    d["id"] = d.get("id", str(d.get("_id")))
                    # Parse datetime
                    if isinstance(d.get("created_at"), str):
                        d["created_at"] = datetime.fromisoformat(d["created_at"])
                    if isinstance(d.get("updated_at"), str):
                        d["updated_at"] = datetime.fromisoformat(d["updated_at"])
                    records.append(d)
                
                urgency_order = {"High": 0, "Medium": 1, "Low": 2}
                records.sort(key=lambda x: (urgency_order.get(x.get("urgency", "Medium"), 3), -x.get("created_at", now).timestamp() if hasattr(x.get("created_at"), "timestamp") else 0))
                return records
        except Exception as e:
            print(f"MongoDB read error: {e}. Falling back to SQL.")

    # SQL Fallback
    sql_query = db.query(models.Grievance)
    if category and category != "All":
        sql_query = sql_query.filter(models.Grievance.category == category)
    if urgency and urgency != "All":
        sql_query = sql_query.filter(models.Grievance.urgency == urgency)
    if status and status != "All":
        sql_query = sql_query.filter(models.Grievance.status == status)
    if search:
        search_fmt = f"%{search}%"
        sql_query = sql_query.filter(
            (models.Grievance.title.ilike(search_fmt)) |
            (models.Grievance.description.ilike(search_fmt)) |
            (models.Grievance.original_text.ilike(search_fmt)) |
            (models.Grievance.location.ilike(search_fmt)) |
            (models.Grievance.id.ilike(search_fmt))
        )
    
    records = sql_query.all()
    urgency_order = {"High": 0, "Medium": 1, "Low": 2}
    records.sort(key=lambda x: (urgency_order.get(x.urgency, 3), -x.created_at.timestamp()))
    return records

@app.get("/api/grievances/{id}", response_model=schemas.GrievanceResponse)
def get_grievance_by_id(id: str, db: Session = Depends(get_db)):
    ticket_id = id.upper()
    if mongo_available and grievances_col is not None:
        try:
            doc = grievances_col.find_one({"_id": ticket_id})
            if doc:
                doc["id"] = doc.get("id", str(doc.get("_id")))
                if isinstance(doc.get("created_at"), str):
                    doc["created_at"] = datetime.fromisoformat(doc["created_at"])
                if isinstance(doc.get("updated_at"), str):
                    doc["updated_at"] = datetime.fromisoformat(doc["updated_at"])
                return doc
        except Exception as e:
            print(f"MongoDB ticket lookup error: {e}")

    grievance = db.query(models.Grievance).filter(models.Grievance.id == ticket_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")
    return grievance

@app.patch("/api/grievances/{id}", response_model=schemas.GrievanceResponse)
def update_grievance(id: str, payload: schemas.GrievanceUpdate, db: Session = Depends(get_db)):
    ticket_id = id.upper()
    now = datetime.now(timezone.utc)

    # Update in MongoDB Atlas
    if mongo_available and grievances_col is not None:
        try:
            update_data = {"updated_at": now.isoformat()}
            if payload.status: update_data["status"] = payload.status
            if payload.department: update_data["department"] = payload.department
            if payload.urgency: update_data["urgency"] = payload.urgency
            if payload.category: update_data["category"] = payload.category

            grievances_col.update_one({"_id": ticket_id}, {"$set": update_data})
        except Exception as e:
            print(f"MongoDB update error: {e}")

    # Update in SQL
    grievance = db.query(models.Grievance).filter(models.Grievance.id == ticket_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")
        
    if payload.status: grievance.status = payload.status
    if payload.department: grievance.department = payload.department
    if payload.urgency: grievance.urgency = payload.urgency
    if payload.category: grievance.category = payload.category
        
    grievance.updated_at = now
    db.commit()
    db.refresh(grievance)
    return grievance

@app.delete("/api/grievances/{id}")
def delete_grievance(id: str, db: Session = Depends(get_db)):
    ticket_id = id.upper()
    if mongo_available and grievances_col is not None:
        try:
            grievances_col.delete_one({"_id": ticket_id})
        except Exception as e:
            print(f"MongoDB delete error: {e}")

    grievance = db.query(models.Grievance).filter(models.Grievance.id == ticket_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance ticket not found")
    
    db.delete(grievance)
    db.commit()
    return {"status": "success", "message": f"Grievance {id} permanently closed and removed from portal"}

@app.get("/api/analytics")
def get_analytics(db: Session = Depends(get_db)):
    grievances = []
    if mongo_available and grievances_col is not None:
        try:
            grievances = list(grievances_col.find())
        except Exception:
            pass

    if not grievances:
        sql_records = db.query(models.Grievance).all()
        grievances = [{"category": g.category, "urgency": g.urgency, "status": g.status} for g in sql_records]

    total = len(grievances)
    by_category = {}
    by_urgency = {}
    by_status = {}
    
    for g in grievances:
        cat = g.get("category", "General") if isinstance(g, dict) else g.category
        urg = g.get("urgency", "Medium") if isinstance(g, dict) else g.urgency
        stat = g.get("status", "Submitted") if isinstance(g, dict) else g.status
        
        by_category[cat] = by_category.get(cat, 0) + 1
        by_urgency[urg] = by_urgency.get(urg, 0) + 1
        by_status[stat] = by_status.get(stat, 0) + 1
        
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

# ==================== OFFICER JWT & MONGODB AUTH ENDPOINTS ====================

@app.post("/api/officers/register", response_model=schemas.OfficerAuthResponse)
def register_officer(payload: schemas.OfficerCreate, db: Session = Depends(get_db)):
    officer_id = payload.officer_id.upper() if payload.officer_id and payload.officer_id.strip() else f"OFF-{random.randint(10000, 99999)}"
    now = datetime.now(timezone.utc)
    hashed_pwd = hash_password(payload.password)

    # 1. Check existing officer email in MongoDB
    if mongo_available and officers_col is not None:
        existing = officers_col.find_one({"email": payload.email.lower()})
        if existing:
            raise HTTPException(status_code=400, detail="An officer account with this email already exists in MongoDB.")

    # 2. Check existing officer in SQL
    existing_sql = db.query(models.Officer).filter(models.Officer.email == payload.email.lower()).first()
    if existing_sql:
        raise HTTPException(status_code=400, detail="An officer account with this email already exists.")

    officer_doc = {
        "_id": officer_id,
        "id": officer_id,
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "department": payload.department,
        "category": payload.category,
        "ward_zone": payload.ward_zone or "Central Zone",
        "password": hashed_pwd,
        "created_at": now.isoformat()
    }

    # Store in MongoDB Atlas
    if mongo_available and officers_col is not None:
        try:
            officers_col.replace_one({"_id": officer_id}, officer_doc, upsert=True)
        except Exception as e:
            print(f"MongoDB officer registration error: {e}")

    # Store in SQL fallback
    officer_sql = models.Officer(
        id=officer_id,
        name=payload.name,
        email=payload.email.lower(),
        phone=payload.phone,
        department=payload.department,
        category=payload.category,
        ward_zone=payload.ward_zone or "Central Zone",
        password=hashed_pwd,
        created_at=now
    )
    db.add(officer_sql)
    db.commit()

    # Generate JWT Token
    jwt_token = create_access_token(data={
        "sub": officer_id,
        "email": payload.email.lower(),
        "role": "officer",
        "department": payload.department,
        "category": payload.category
    })

    return {
        "id": officer_id,
        "name": payload.name,
        "email": payload.email.lower(),
        "phone": payload.phone,
        "department": payload.department,
        "category": payload.category,
        "ward_zone": payload.ward_zone or "Central Zone",
        "access_token": jwt_token,
        "token_type": "bearer"
    }

@app.post("/api/officers/login", response_model=schemas.OfficerAuthResponse)
def login_officer(payload: schemas.OfficerLogin, db: Session = Depends(get_db)):
    officer_id = payload.officer_id.upper()
    found_officer = None

    # Search in MongoDB Atlas
    if mongo_available and officers_col is not None:
        try:
            found_officer = officers_col.find_one({"_id": officer_id})
        except Exception as e:
            print(f"MongoDB officer login lookup error: {e}")

    # Search in SQL if not found in MongoDB
    if not found_officer:
        sql_officer = db.query(models.Officer).filter(models.Officer.id == officer_id).first()
        if sql_officer:
            found_officer = {
                "id": sql_officer.id,
                "name": sql_officer.name,
                "email": sql_officer.email,
                "phone": sql_officer.phone,
                "department": sql_officer.department,
                "category": sql_officer.category,
                "ward_zone": sql_officer.ward_zone,
                "password": sql_officer.password
            }

    # Demo Officer Credentials Fallback
    if not found_officer and officer_id.startswith("OFF-"):
        found_officer = {
            "id": officer_id,
            "name": "Nodal Officer",
            "email": "officer@sudhaar.gov.in",
            "phone": "+91 98765 43210",
            "department": "Public Works Department (PWD)",
            "category": "Roads",
            "ward_zone": "Ward 12",
            "password": hash_password(payload.password) # Allow demo logins
        }

    if not found_officer or not verify_password(payload.password, found_officer["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid Officer ID or Password"
        )

    # Generate JWT Token
    jwt_token = create_access_token(data={
        "sub": found_officer["id"],
        "email": found_officer.get("email", ""),
        "role": "officer",
        "department": found_officer.get("department", ""),
        "category": found_officer.get("category", "")
    })

    return {
        "id": found_officer["id"],
        "name": found_officer.get("name", "Department Officer"),
        "email": found_officer.get("email", ""),
        "phone": found_officer.get("phone", ""),
        "department": found_officer.get("department", "Public Works Department"),
        "category": found_officer.get("category", "Roads"),
        "ward_zone": found_officer.get("ward_zone", "Central Zone"),
        "access_token": jwt_token,
        "token_type": "bearer"
    }

@app.get("/api/officers/me")
def get_current_officer_profile(current_user: dict = Depends(get_current_officer)):
    """Protected endpoint requiring JWT Bearer token"""
    return {
        "status": "authenticated",
        "user": current_user
    }
