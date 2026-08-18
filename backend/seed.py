import random
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
import models
from ai_engine import classify_grievance

Base.metadata.create_all(bind=engine)

SEED_GRIEVANCES = [
    {
        "title": "Severe Pothole on Main Arterial Road",
        "description": "Massive pothole near 5th Avenue and Oak Street intersection causing traffic bottlenecks and vehicle tire damage. Highly dangerous for two-wheelers at night.",
        "location": "5th Avenue & Oak Street, Ward 12",
        "photo_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
        "status": "In Progress"
    },
    {
        "title": "Major Water Main Leak Flooding Street",
        "description": "Clean water pipe burst underground sending huge volumes of drinking water overflowing into residential lanes. Water pressure in surrounding homes has dropped completely.",
        "location": "742 Evergreen Terrace, Sector 4",
        "photo_url": "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop&q=80",
        "status": "Submitted"
    },
    {
        "title": "Uncollected Waste and Overflowing Bins",
        "description": "Municipal waste bins at Market Square haven't been cleared for 4 days. Overflowing garbage is stinking badly and attracting stray animals.",
        "location": "Central Market Square, Block B",
        "photo_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
        "status": "Classified"
    },
    {
        "title": "Fallen Tree Branch Snapped Power Line",
        "description": "Heavy storm last night broke a large oak branch which fell on electric transformer lines. Sparks visible, dangerous live wire hanging near pavement!",
        "location": "Highland Avenue & 14th Street",
        "photo_url": "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
        "status": "In Progress"
    },
    {
        "title": "Broken Streetlight Darkening Alleyway",
        "description": "Streetlight pole #42 is flickering and completely dark. The pathway near the community center is pitch black, making residents feel unsafe.",
        "location": "Community Center Lane, Sector 9",
        "photo_url": "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=80",
        "status": "Resolved"
    },
    {
        "title": "Blocked Storm Drain Causing Stagnant Water",
        "description": "Plastic trash clogging the storm drain entry causing 6 inches of stagnant sewage water accumulation right outside the primary school entrance.",
        "location": "St. Mary School Road, Ward 8",
        "photo_url": "https://images.unsplash.com/photo-1527066579998-dbbae57f4508?w=600&auto=format&fit=crop&q=80",
        "status": "Submitted"
    }
]

def seed_db():
    db: Session = SessionLocal()
    try:
        # Check existing count
        count = db.query(models.Grievance).count()
        if count > 0:
            print(f"Database already contains {count} grievances. Skipping initial seed.")
            return

        print("Seeding initial grievances...")
        now = datetime.now(timezone.utc)
        
        for i, data in enumerate(SEED_GRIEVANCES):
            ticket_id = f"SUD-{random.randint(10000, 99999)}"
            classification = classify_grievance(data["description"], data["location"])
            
            created_time = now - timedelta(hours=i * 5 + random.randint(1, 4))
            
            grievance = models.Grievance(
                id=ticket_id,
                title=data["title"],
                description=data["description"],
                original_text=data["description"],
                detected_language="en",
                location=data["location"],
                photo_url=data["photo_url"],
                category=classification["category"],
                urgency=classification["urgency"],
                status=data["status"],
                department=classification["department"],
                ai_confidence=classification["ai_confidence"],
                ai_reasoning=classification["ai_reasoning"],
                created_at=created_time,
                updated_at=created_time
            )
            db.add(grievance)

        db.commit()
        print("Successfully seeded 6 grievances.")
    except Exception as e:
        print(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
