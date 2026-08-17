import re

CATEGORY_KEYWORDS = {
    "Roads": {
        "keywords": ["pothole", "asphalt", "crater", "road", "street", "highway", "sidewalk", "pavement", "manhole", "tar", "bump", "lane", "bridge", "divider"],
        "department": "Public Works Department (PWD)",
        "color": "amber"
    },
    "Water": {
        "keywords": ["leak", "water", "pipe", "sewage", "drain", "overflow", "burst", "main", "drinking water", "contamination", "pressure", "flooding", "tap", "pipeline", "sewer"],
        "department": "Water Supply & Sewerage Board",
        "color": "blue"
    },
    "Sanitation": {
        "keywords": ["garbage", "waste", "trash", "dump", "stinking", "smell", "filth", "litter", "bin", "dustbin", "clean", "debris", "sweep", "hygiene", "dung"],
        "department": "Department of Municipal Sanitation",
        "color": "green"
    },
    "Electricity": {
        "keywords": ["electric", "power", "outage", "wire", "pole", "transformer", "streetlight", "light", "shock", "current", "sparks", "blackout", "feeder", "voltage"],
        "department": "State Electricity Distribution Corp",
        "color": "yellow"
    },
    "Public Safety": {
        "keywords": ["tree", "branch", "fallen", "hazard", "collapse", "stray", "fire", "danger", "encroachment", "security", "signboard"],
        "department": "Disaster Response & Urban Safety",
        "color": "purple"
    }
}

HIGH_URGENCY_KEYWORDS = [
    "massive", "immediate", "now", "urgent", "danger", "hazard", "fire", "live wire",
    "flooding", "burst", "critical", "emergency", "collapse", "blocking", "severe",
    "accident", "risk", "life-threatening", "sparks", "electrocution"
]

MEDIUM_URGENCY_KEYWORDS = [
    "broken", "leaking", "dark", "pothole", "overflowing", "stinking", "uncollected",
    "damaged", "blocked", "deep", "smell", "foul"
]

def classify_grievance(description: str, location: str = "") -> dict:
    text = (description + " " + location).lower()
    
    # Calculate category scores
    category_scores = {}
    matched_words = {}
    
    for cat, info in CATEGORY_KEYWORDS.items():
        score = 0
        matches = []
        for kw in info["keywords"]:
            # Simple boundary matching or substring search
            count = len(re.findall(r'\b' + re.escape(kw) + r'\b', text))
            if count > 0:
                score += count * 2
                matches.append(kw)
            elif kw in text:
                score += 1
                matches.append(kw)
        
        category_scores[cat] = score
        matched_words[cat] = matches
    
    # Sort categories by score
    sorted_cats = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
    best_cat, best_score = sorted_cats[0]
    
    # Fallback to General if no keywords match
    if best_score == 0:
        best_cat = "Roads" if "road" in text or "street" in text else "General"
        department = "General Municipal Admin"
        confidence = 0.78
        reasoning = "General civic complaint based on standard keywords."
    else:
        department = CATEGORY_KEYWORDS[best_cat]["department"]
        confidence = min(0.98, 0.82 + (best_score * 0.04))
        keywords_str = ", ".join(matched_words[best_cat][:3])
        reasoning = f"Matched key signals ({keywords_str}) indicating {best_cat} issue."

    # Urgency analysis
    urgency = "Low"
    urgency_matches = []
    
    for kw in HIGH_URGENCY_KEYWORDS:
        if kw in text:
            urgency = "High"
            urgency_matches.append(kw)
            break
            
    if urgency != "High":
        for kw in MEDIUM_URGENCY_KEYWORDS:
            if kw in text:
                urgency = "Medium"
                urgency_matches.append(kw)
                break

    if urgency == "High":
        reasoning += f" Escalated to High Urgency due to hazard terms ({', '.join(urgency_matches)})."
    
    return {
        "category": best_cat,
        "urgency": urgency,
        "department": department,
        "ai_confidence": round(confidence, 2),
        "ai_reasoning": reasoning
    }
