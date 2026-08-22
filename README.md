# SudhaarAI - Citizen Grievance Classification & Routing Platform 🏛️⚡

> **SudhaarAI** is a full-stack, mobile-responsive web platform designed to streamline municipal governance. It enables citizens to quickly report civic issues (such as potholes, water main leaks, uncollected garbage, or damaged power lines) and leverages an **automated NLP AI Pipeline** to classify, calculate urgency scores, and route complaints directly to the responsible government department dashboard.

---

## 🌟 Key Features

### 👤 1. Citizen Portal
- **Hero & Search Overview (`/`)**: Discover platform capabilities, search ticket status using unique ticket IDs (`SUD-XXXXX`), and view a live public feed of resolved community issues.
- **Multi-Step Grievance Form (`/report`)**:
  - **Step 1 (Details)**: Interactive text area with real-time AI signal preview & live department prediction pills.
  - **Step 2 (Photo Proof)**: Drag-and-drop file uploader with mock photo selection support.
  - **Step 3 (Location)**: Address picker with quick ward/landmark location presets.
- **Real-Time Ticket Tracker (`/track/[id]`)**:
  - Transparent 4-step vertical progress timeline (`Submitted` ➔ `Classified` ➔ `In Progress` ➔ `Resolved`).
  - Full AI diagnostic breakdown displaying category confidence score, matching keyword signals, assigned department, and photo evidence.

### 🤖 2. Backend & AI Classification Pipeline
- **Direct AI Semantic Triage Engine**: Uses LLM (Google Gemini) and deep zero-shot natural language context understanding to evaluate citizen complaints directly without relying on static manual keyword lists.
- **Situational Urgency Analysis**: Evaluates hazard severity, structural damage, live risks, and public safety impact to assign `High`, `Medium`, or `Low` priority automatically.
- **Automated Department Routing**: Directs complaints to specialized agencies:
  - 🛠️ **Roads**: *Public Works Department (PWD)*
  - 💧 **Water**: *Water Supply & Sewerage Board*
  - 🧹 **Sanitation**: *Department of Municipal Sanitation*
  - ⚡ **Electricity**: *State Electricity Distribution Corp*
  - 🚨 **Public Safety**: *Disaster Response & Urban Safety*

### 👔 3. Official Admin Dashboard (`/admin`)
- **Prioritized Inbox (`/admin/inbox`)**: Data table listing all submitted grievances, automatically sorted by **Urgency** (High priority first) with category-colored badges.
- **Live Filtering**: Filter grievances by Category, Urgency level, Status, or Keyword Search.
- **Ticket Detail Modal**: Inspect full citizen reports, view visual evidence, examine AI confidence scores, and update ticket status (`In Progress`, `Resolved`, `Rejected`).
- **Analytics & SLA Console (`/admin/analytics`)**: Graphical breakdown of total grievance volume, department workloads, urgency ratios, and resolution velocity rates.
- **AI Settings (`/admin/settings`)**: Configure confidence threshold sliders and direct AI hazard sensitivity rules.

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 (React 19), Tailwind CSS v4, Lucide React (Icons), TypeScript
- **Backend**: Python 3.14, FastAPI, Uvicorn (ASGI Server), Pydantic v2
- **Database & ORM**: SQLite, SQLAlchemy 2.0
- **Version Control**: Git & GitHub

---

## 📐 Project Architecture

```
                                  ┌──────────────────────────┐
                                  │   Citizen Portal UI      │
                                  │ (Next.js 16 + Tailwind)  │
                                  └────────────┬─────────────┘
                                               │ REST API
                                               ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                            FastAPI Backend Server                         │
│                                                                           │
│  ┌───────────────────────┐  ┌────────────────────┐  ┌──────────────────┐  │
│  │  Grievance Endpoints  │─►│   AI NLP Engine    │─►│ SQLite /         │  │
│  │ (CRUD + Status Patch) │  │(Keywords+Urgency)  │  │ SQLAlchemy ORM   │  │
│  └───────────────────────┘  └────────────────────┘  └──────────────────┘  │
└──────────────────────────────────────▲────────────────────────────────────┘
                                       │ REST API
                                  ┌────┴─────────────────────┐
                                  │   Admin Dashboard UI     │
                                  │  (Next.js /admin views)  │
                                  └──────────────────────────┘
```

---

## 📁 Repository Structure

```
SudhaarAI/
├── backend/
│   ├── ai_engine.py      # Keyword NLP classifier & urgency scorer
│   ├── database.py       # SQLAlchemy SQLite connection engine
│   ├── main.py           # FastAPI REST API application & endpoints
│   ├── models.py         # SQLAlchemy database models
│   ├── requirements.txt  # Python backend dependencies
│   ├── schemas.py        # Pydantic request/response validation schemas
│   └── seed.py           # Initial demo dataset seeder
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router pages (/, /report, /track, /admin)
│   │   └── components/   # Shared UI components (Navbar, Footer, Badges)
│   ├── package.json      # Node.js dependencies
│   └── tailwind.config.ts# Tailwind styling setup
├── .gitignore
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

Follow these step-by-step instructions to run SudhaarAI locally.

### Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **Python**: v3.10 or higher

---

### 1️⃣ Setting Up & Running the Backend (FastAPI)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI development server:
   ```bash
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

   - **Backend API**: `http://127.0.0.1:8000`
   - **Interactive API Documentation (Swagger)**: `http://127.0.0.1:8000/docs`

> *Note: On initial startup, the backend automatically seeds realistic sample grievances into `sudhaar.db` for demonstration purposes.*

---

### 2️⃣ Setting Up & Running the Frontend (Next.js)

1. Open a second terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/grievances` | Submit a new grievance; runs AI classifier & returns created ticket |
| `GET` | `/api/grievances` | Fetch all grievances (supports sorting by urgency and filtering by category/status/search) |
| `GET` | `/api/grievances/{id}` | Fetch detailed ticket data by unique ID (e.g., `SUD-94821`) |
| `PATCH` | `/api/grievances/{id}` | Update ticket status (`Classified` ➔ `In Progress` ➔ `Resolved` ➔ `Rejected`) |
| `GET` | `/api/analytics` | Retrieve analytical breakdown metrics for admin dashboard |

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more details.

Developed with ❤️ for Civic Technology & Intelligent Governance.
