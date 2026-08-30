from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Trainee, OutcomeLog
from backend.ai_model import calculate_attrition_risk, analyze_feedback_nlp

router = APIRouter(prefix="/api/ai", tags=["AI Attrition Prediction & NLP Insights"])

@router.get("/high-risk-cohort")
def get_high_risk_cohort(
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Returns trainees categorized by AI ML model as Medium/High Risk of Attrition,
    paired with prescriptive remedial actions.
    """
    trainees = db.query(Trainee).order_by(Trainee.ai_attrition_risk.desc()).limit(limit).all()
    
    results = []
    for t in trainees:
        risk_data = calculate_attrition_risk(
            course=t.course,
            district=t.district,
            baseline_wage=t.baseline_wage,
            current_wage=t.current_wage,
            current_status=t.current_status,
            age=t.age,
            gender=t.gender
        )
        results.append({
            "trainee_id": t.id,
            "name": t.name,
            "course": t.course,
            "district": t.district,
            "current_status": t.current_status,
            "current_wage": t.current_wage,
            "risk_score": t.ai_attrition_risk,
            "risk_category": t.ai_risk_category,
            "risk_factors": risk_data["risk_factors"],
            "recommended_action": risk_data["recommended_action"],
            "remedial_flag": t.remedial_action_flag,
            "remedial_notes": t.remedial_notes
        })
    return results

@router.post("/predict-risk")
def predict_attrition_risk(
    course: str = Body(..., embed=True),
    district: str = Body(..., embed=True),
    baseline_wage: float = Body(12000.0, embed=True),
    current_wage: float = Body(14000.0, embed=True),
    current_status: str = Body("Placed", embed=True),
    age: int = Body(22, embed=True),
    gender: str = Body("Male", embed=True)
):
    """
    Simulates AI Attrition prediction for any hypothetical candidate.
    """
    result = calculate_attrition_risk(
        course=course,
        district=district,
        baseline_wage=baseline_wage,
        current_wage=current_wage,
        current_status=current_status,
        age=age,
        gender=gender
    )
    return result

@router.post("/analyze-feedback")
def analyze_feedback(text: str = Body(..., embed=True)):
    """
    Runs NLP topic categorization and sentiment scoring on free-text dropout reasons.
    """
    return analyze_feedback_nlp(text)

@router.get("/skill-gap-matrix")
def get_skill_gap_matrix(db: Session = Depends(get_db)):
    """
    Cross-tabulation of courses vs attrition drivers to provide MSDE / NSDC
    with targeted curriculum and placement recommendations.
    """
    trainees = db.query(Trainee).all()
    courses = list(set(t.course for t in trainees))
    
    matrix = []
    for c in sorted(courses):
        course_trainees = [t for t in trainees if t.course == c]
        total = len(course_trainees)
        unemployed = [t for t in course_trainees if t.current_status == "Unemployed"]
        
        reasons_count = {}
        for u in unemployed:
            r = u.attrition_reason or "Other"
            reasons_count[r] = reasons_count.get(r, 0) + 1
            
        top_driver = max(reasons_count, key=reasons_count.get) if reasons_count else "High Placement / No major dropouts"
        
        # Recommendations
        if c == "Electrician":
            rec = "Integrate Solar PV & EV Charging module to boost initial wages above ₹18,000"
        elif c == "Welder":
            rec = "Provide certified MIG/TIG automation training to match heavy engineering demand"
        elif c == "Data Entry Operator":
            rec = "Upgrade syllabus to AI Data Annotation & ERP Tools to avoid BPO wage stagnation"
        elif c == "Retail Associate":
            rec = "Introduce E-commerce Logistics & Soft-Skills for shift-work resilience"
        elif c == "Healthcare Assistant":
            rec = "Expand ICU & Geriatric Care specializations for premium hospital placements"
        else:
            rec = "Conduct local industry roundtables for continuous syllabus alignment"
            
        matrix.append({
            "course": c,
            "total_cohort": total,
            "attrition_count": len(unemployed),
            "attrition_rate_pct": round((len(unemployed) / total) * 100, 1) if total > 0 else 0,
            "primary_attrition_driver": top_driver,
            "strategic_curriculum_intervention": rec
        })
        
    return matrix
