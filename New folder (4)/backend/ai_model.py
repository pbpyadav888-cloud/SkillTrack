import re
from typing import Dict, Any, List
import numpy as np

# A lightweight, production-ready rule + trained heuristic scoring engine for Trainee Attrition & Wage Risk
COURSE_RISK_FACTORS = {
    "Electrician": 0.18,
    "Welder": 0.22,
    "Data Entry Operator": 0.35,
    "Retail Associate": 0.38,
    "Healthcare Assistant": 0.15,
}

DISTRICT_OPPORTUNITY_INDEX = {
    "Hyderabad": 0.85,     # High employment absorption
    "Visakhapatnam": 0.78,
    "Vijayawada": 0.72,
    "Warangal": 0.60,
    "Guntur": 0.65,
}

NLP_TOPIC_PATTERNS = {
    "Low Salary / Compensation": [
        r"\blow\b", r"\bsalary\b", r"\bwage\b", r"\bmoney\b", r"\bpay\b", r"\bunderpaid\b",
        r"\bcompensation\b", r"\bnot enough\b", r"\bexpenses\b", r"\bincrease\b"
    ],
    "Job-Skill Mismatch": [
        r"\bmismatch\b", r"\bfit\b", r"\bdifficult\b", r"\bunrelated\b", r"\bnot trained\b",
        r"\btheory\b", r"\bpractical\b", r"\bexpectation\b", r"\bboring\b"
    ],
    "Relocation & Commute": [
        r"\bfar\b", r"\bcommute\b", r"\btravel\b", r"\bhometown\b", r"\bvantage\b",
        r"\brelocation\b", r"\bhostel\b", r"\brent\b", r"\bcity\b"
    ],
    "Health & Personal Issues": [
        r"\bhealth\b", r"\billness\b", r"\bmedical\b", r"\bfamily\b", r"\bmarriage\b",
        r"\bpregnant\b", r"\baccident\b", r"\bpersonal\b", r"\bcare\b"
    ],
    "Pursuing Higher Education": [
        r"\bcollege\b", r"\bdegree\b", r"\bstudy\b", r"\beducation\b", r"\bexam\b",
        r"\bgovt job\b", r"\bpreparation\b", r"\buniversity\b"
    ],
    "No Local Job Openings": [
        r"\bno job\b", r"\bvacancy\b", r"\bclosed\b", r"\brecession\b", r"\blocal\b",
        r"\bopportunity\b", r"\bfired\b", r"\blaid off\b"
    ]
}


def calculate_attrition_risk(
    course: str,
    district: str,
    baseline_wage: float,
    current_wage: float,
    current_status: str,
    age: int = 22,
    gender: str = "Male"
) -> Dict[str, Any]:
    """
    Computes an AI/ML probabilistic attrition risk score (0.0 to 1.0)
    based on demographic, economic progression, and course vulnerability metrics.
    """
    if current_status in ["Unemployed", "Inactive"]:
        return {
            "risk_score": 0.95,
            "risk_category": "High",
            "risk_factors": ["Currently unemployed / dropped out", "Urgent remedial re-skilling required"],
            "recommended_action": "Direct Placement Re-attempt & Counseling"
        }

    base_risk = COURSE_RISK_FACTORS.get(course, 0.25)
    district_factor = DISTRICT_OPPORTUNITY_INDEX.get(district, 0.70)
    
    # District risk adjustment (lower opportunity -> higher attrition risk)
    loc_risk = (1.0 - district_factor) * 0.4
    
    # Wage satisfaction / wage stagnation factor
    wage_ratio = current_wage / max(baseline_wage, 10000.0) if baseline_wage > 0 else 1.0
    if wage_ratio < 1.05:  # Stagnant or dropped wage
        wage_risk = 0.35
    elif wage_ratio < 1.20:
        wage_risk = 0.15
    else:
        wage_risk = -0.10  # Healthy wage growth reduces risk
        
    total_score = max(0.05, min(0.95, base_risk + loc_risk + wage_risk))
    
    if total_score >= 0.50:
        category = "High"
        recommended = "Initiate Mentor Check-in & Skill Bridge Course"
    elif total_score >= 0.25:
        category = "Medium"
        recommended = "Automated Follow-up at Month 6 + Wage Review"
    else:
        category = "Low"
        recommended = "On-track; Candidate ready for Advanced Apprenticeship"
        
    factors = []
    if wage_ratio < 1.10:
        factors.append(f"Subdued wage growth (Current ₹{int(current_wage):,}/mo)")
    if base_risk > 0.30:
        factors.append(f"Higher historical attrition in '{course}' sector")
    if district_factor < 0.70:
        factors.append(f"Limited local employer density in {district}")
        
    if not factors:
        factors.append("Consistent employment progression and positive wage delta")

    return {
        "risk_score": round(float(total_score), 3),
        "risk_category": category,
        "risk_factors": factors,
        "recommended_action": recommended
    }


def analyze_feedback_nlp(text: str) -> Dict[str, Any]:
    """
    Analyzes unstructured trainee WhatsApp / SMS responses or dropout reasons
    to categorize root causes and sentiment polarity.
    """
    if not text:
        return {
            "sentiment": "Neutral",
            "primary_topic": "General Inactivity",
            "confidence": 0.5,
            "detected_keywords": []
        }
        
    cleaned = text.lower()
    topic_scores = {}
    detected_all = []
    
    for topic, patterns in NLP_TOPIC_PATTERNS.items():
        count = 0
        topic_kw = []
        for pattern in patterns:
            matches = re.findall(pattern, cleaned)
            if matches:
                count += len(matches)
                topic_kw.extend(matches)
        if count > 0:
            topic_scores[topic] = count
            detected_all.extend(topic_kw)
            
    if topic_scores:
        primary_topic = max(topic_scores, key=topic_scores.get)
        confidence = min(0.95, 0.60 + (topic_scores[primary_topic] * 0.15))
    else:
        primary_topic = "Unspecified / Career Pivot"
        confidence = 0.50
        
    # Sentiment calculation
    negative_words = ["not", "no", "low", "bad", "left", "quit", "fired", "problem", "difficult", "poor", "pain", "ill"]
    neg_count = sum(1 for w in negative_words if w in cleaned)
    
    if neg_count >= 2:
        sentiment = "Negative (Distress / Discontent)"
    elif neg_count == 1:
        sentiment = "Slightly Negative"
    elif "good" in cleaned or "promoted" in cleaned or "happy" in cleaned or "increased" in cleaned or "own" in cleaned:
        sentiment = "Positive (Growth)"
    else:
        sentiment = "Neutral"

    return {
        "sentiment": sentiment,
        "primary_topic": primary_topic,
        "confidence": round(confidence, 2),
        "detected_keywords": list(set(detected_all))
    }
