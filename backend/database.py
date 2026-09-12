import os
from dotenv import load_dotenv
from pymongo import MongoClient
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import certifi

load_dotenv()

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://dhruvup2006_db_user:jtOS4GlL1rRqw8ww@sudhaar.cu0xhbz.mongodb.net/?appName=Sudhaar")

try:
    # Primary connection using certifi CA bundle for SSL verification (resolves Render OpenSSL handshake errors)
    mongo_client = MongoClient(
        MONGODB_URI, 
        serverSelectionTimeoutMS=8000,
        tlsCAFile=certifi.where()
    )
    # Test connection
    mongo_client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas database!")
    mongo_db = mongo_client["sudhaar_db"]
    grievances_col = mongo_db["grievances"]
    officers_col = mongo_db["officers"]
    mongo_available = True
except Exception as e:
    print(f"Primary SSL MongoDB connection warning: {e}. Trying fallback TLS options...")
    try:
        mongo_client = MongoClient(
            MONGODB_URI, 
            serverSelectionTimeoutMS=8000,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        mongo_client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas database (TLS fallback mode)!")
        mongo_db = mongo_client["sudhaar_db"]
        grievances_col = mongo_db["grievances"]
        officers_col = mongo_db["officers"]
        mongo_available = True
    except Exception as e2:
        print(f"MongoDB connection warning: {e2}. Operating in SQLite fallback mode.")
        mongo_client = None
        mongo_db = None
        grievances_col = None
        officers_col = None
        mongo_available = False

# SQLite Configuration (Fallback / Parallel Storage)
SQLALCHEMY_DATABASE_URL = "sqlite:///./sudhaar.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
