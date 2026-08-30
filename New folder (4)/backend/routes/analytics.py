import io
import csv
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.models import Trainee, OutcomeLog, ConsentRecord, AuditLog
from backend.security import get_current_user
from backend.ai_model import analyze_feedback_nlp

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Impact Measurement"])

@router.get("/dashboard")
def get_dashboard_analytics(
    course: Optional[str] = Query(None),
    provider: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    query = db.query(Trainee)
    
    # Provider-level scoping
    if current_user.get("role") == "Training Provider":
        org = current_user.get("organization")
        if org:
            query = query.filter(Trainee.training_provider == org)
            
    if course:
        query = query.filter(Trainee.course == course)
    if provider and current_user.get("role") != "Training Provider":
        query = query.filter(Trainee.training_provider == provider)
    if district:
        query = query.filter(Trainee.district == district)
    if gender:
        query = query.filter(Trainee.gender == gender)
    if status:
        query = query.filter(Trainee.current_status == status)
        
    trainees = query.all()
    total_count = len(trainees)
    
    if total_count == 0:
        return {
            "kpis": {
                "total_trainees": 0,
                "placement_rate": 0,
                "self_employment_rate": 0,
                "unemployment_rate": 0,
                "retention_rate_12m": 0,
                "avg_baseline_wage": 0,
                "avg_current_wage": 0,
                "avg_wage_growth_pct": 0,
                "remedial_count": 0
            },
            "placement_by_course": [],
            "wage_progression": [],
            "status_distribution": [],
            "district_heatmap": [],
            "attrition_breakdown": [],
            "provider_scorecard": [],
            "gender_distribution": []
        }
        
    # Calculate KPIs
    placed_count = sum(1 for t in trainees if t.current_status == "Placed")
    self_emp_count = sum(1 for t in trainees if t.current_status == "Self-Employed")
    unemployed_count = sum(1 for t in trainees if t.current_status == "Unemployed")
    retained_count = sum(1 for t in trainees if t.is_retained and t.current_status in ["Placed", "Self-Employed"])
    remedial_count = sum(1 for t in trainees if t.remedial_action_flag)
    
    employed_trainees = [t for t in trainees if t.current_status in ["Placed", "Self-Employed"]]
    avg_base_wage = sum(t.baseline_wage for t in employed_trainees) / len(employed_trainees) if employed_trainees else 0
    avg_curr_wage = sum(t.current_wage for t in employed_trainees) / len(employed_trainees) if employed_trainees else 0
    wage_growth_pct = ((avg_curr_wage - avg_base_wage) / avg_base_wage * 100) if avg_base_wage > 0 else 0
    
    # 1. Placement by Course
    courses_dict = {}
    for t in trainees:
        c = t.course
        if c not in courses_dict:
            courses_dict[c] = {"course": c, "total": 0, "placed": 0, "self_employed": 0, "unemployed": 0, "total_wage": 0}
        courses_dict[c]["total"] += 1
        if t.current_status == "Placed":
            courses_dict[c]["placed"] += 1
            courses_dict[c]["total_wage"] += t.current_wage
        elif t.current_status == "Self-Employed":
            courses_dict[c]["self_employed"] += 1
            courses_dict[c]["total_wage"] += t.current_wage
        else:
            courses_dict[c]["unemployed"] += 1
            
    placement_by_course = []
    for c, data in courses_dict.items():
        emp_in_c = data["placed"] + data["self_employed"]
        rate = round((emp_in_c / data["total"]) * 100, 1)
        avg_w = round(data["total_wage"] / emp_in_c, 0) if emp_in_c > 0 else 0
        placement_by_course.append({
            "course": c,
            "total_enrolled": data["total"],
            "placed": data["placed"],
            "self_employed": data["self_employed"],
            "unemployed": data["unemployed"],
            "placement_rate_pct": rate,
            "avg_wage": avg_w,
            "target_benchmark_pct": 70.0
        })
        
    # 2. Longitudinal Wage Progression (M0, M3, M6, M12)
    # Aggregate from OutcomeLogs for the filtered trainees
    trainee_ids = [t.id for t in trainees]
    outcomes = db.query(OutcomeLog).filter(OutcomeLog.trainee_id.in_(trainee_ids)).all()
    
    progression_milestones = {"Month 0": [], "Month 3": [], "Month 6": [], "Month 12": []}
    course_progression = {}
    
    for o in outcomes:
        if o.monthly_wage > 0 and o.milestone in progression_milestones:
            progression_milestones[o.milestone].append(o.monthly_wage)
            t_obj = next((t for t in trainees if t.id == o.trainee_id), None)
            if t_obj:
                c = t_obj.course
                if c not in course_progression:
                    course_progression[c] = {"Month 0": [], "Month 3": [], "Month 6": [], "Month 12": []}
                course_progression[c][o.milestone].append(o.monthly_wage)

    wage_progression_series = []
    milestone_order = ["Month 0", "Month 3", "Month 6", "Month 12"]
    for m in milestone_order:
        w_list = progression_milestones[m]
        avg_m = round(sum(w_list) / len(w_list), 0) if w_list else 0
        
        entry = {
            "milestone": m,
            "overall_avg": avg_m
        }
        for c in courses_dict.keys():
            c_w = course_progression.get(c, {}).get(m, [])
            entry[c] = round(sum(c_w) / len(c_w), 0) if c_w else 0
        wage_progression_series.append(entry)

    # 3. Status Distribution
    status_distribution = [
        {"name": "Placed (Wage Employment)", "value": placed_count, "color": "#2563EB", "pct": round(placed_count / total_count * 100, 1)},
        {"name": "Self-Employed (Micro Enterprise)", "value": self_emp_count, "color": "#10B981", "pct": round(self_emp_count / total_count * 100, 1)},
        {"name": "Unemployed / Attrition", "value": unemployed_count, "color": "#EF4444", "pct": round(unemployed_count / total_count * 100, 1)},
    ]

    # 4. District Performance Heatmap
    district_dict = {}
    for t in trainees:
        d = t.district
        if d not in district_dict:
            district_dict[d] = {"district": d, "total": 0, "placed": 0, "self_employed": 0, "unemployed": 0, "wages": []}
        district_dict[d]["total"] += 1
        if t.current_status == "Placed":
            district_dict[d]["placed"] += 1
            district_dict[d]["wages"].append(t.current_wage)
        elif t.current_status == "Self-Employed":
            district_dict[d]["self_employed"] += 1
            district_dict[d]["wages"].append(t.current_wage)
        else:
            district_dict[d]["unemployed"] += 1

    district_heatmap = []
    for d, val in district_dict.items():
        emp = val["placed"] + val["self_employed"]
        rate = round((emp / val["total"]) * 100, 1)
        avg_w = round(sum(val["wages"]) / len(val["wages"]), 0) if val["wages"] else 0
        district_heatmap.append({
            "district": d,
            "total_trainees": val["total"],
            "placed_count": val["placed"],
            "self_employed_count": val["self_employed"],
            "unemployed_count": val["unemployed"],
            "placement_rate_pct": rate,
            "avg_wage": avg_w,
            "intensity_score": min(100, int(rate * 0.7 + (avg_w / 35000) * 30))
        })
    district_heatmap.sort(key=lambda x: x["placement_rate_pct"], reverse=True)

    # 5. Attrition Breakdown & NLP Insights
    attrition_dict = {}
    unemployed_trainees = [t for t in trainees if t.current_status == "Unemployed"]
    for t in unemployed_trainees:
        reason = t.attrition_reason or "Unspecified"
        attrition_dict[reason] = attrition_dict.get(reason, 0) + 1

    attrition_breakdown = []
    for reason, count in attrition_dict.items():
        nlp_res = analyze_feedback_nlp(reason)
        attrition_breakdown.append({
            "reason": reason,
            "count": count,
            "percentage": round((count / max(1, len(unemployed_trainees))) * 100, 1),
            "nlp_category": nlp_res["primary_topic"],
            "sentiment": nlp_res["sentiment"]
        })
    attrition_breakdown.sort(key=lambda x: x["count"], reverse=True)

    # 6. Training Provider Scorecard
    provider_dict = {}
    for t in trainees:
        p = t.training_provider
        if p not in provider_dict:
            provider_dict[p] = {"provider": p, "total": 0, "placed": 0, "self": 0, "unemployed": 0, "wages": []}
        provider_dict[p]["total"] += 1
        if t.current_status == "Placed":
            provider_dict[p]["placed"] += 1
            provider_dict[p]["wages"].append(t.current_wage)
        elif t.current_status == "Self-Employed":
            provider_dict[p]["self"] += 1
            provider_dict[p]["wages"].append(t.current_wage)
        else:
            provider_dict[p]["unemployed"] += 1

    provider_scorecard = []
    for p, val in provider_dict.items():
        emp = val["placed"] + val["self"]
        rate = round((emp / val["total"]) * 100, 1)
        avg_w = round(sum(val["wages"]) / len(val["wages"]), 0) if val["wages"] else 0
        provider_scorecard.append({
            "provider": p,
            "total_enrolled": val["total"],
            "employed_count": emp,
            "placement_rate_pct": rate,
            "avg_wage": avg_w,
            "grade": "A+" if rate >= 85 and avg_w >= 20000 else "A" if rate >= 75 else "B" if rate >= 65 else "C"
        })
    provider_scorecard.sort(key=lambda x: x["placement_rate_pct"], reverse=True)

    # 7. Gender Breakdown
    gender_dict = {}
    for t in trainees:
        g = t.gender
        if g not in gender_dict:
            gender_dict[g] = {"gender": g, "total": 0, "placed": 0, "self": 0}
        gender_dict[g]["total"] += 1
        if t.current_status == "Placed":
            gender_dict[g]["placed"] += 1
        elif t.current_status == "Self-Employed":
            gender_dict[g]["self"] += 1
            
    gender_distribution = []
    for g, val in gender_dict.items():
        emp = val["placed"] + val["self"]
        gender_distribution.append({
            "gender": g,
            "total": val["total"],
            "employed": emp,
            "placement_rate_pct": round((emp / val["total"]) * 100, 1) if val["total"] > 0 else 0
        })

    return {
        "kpis": {
            "total_trainees": total_count,
            "placed_count": placed_count,
            "self_employed_count": self_emp_count,
            "unemployed_count": unemployed_count,
            "placement_rate": round(((placed_count + self_emp_count) / total_count) * 100, 1),
            "wage_employment_rate": round((placed_count / total_count) * 100, 1),
            "self_employment_rate": round((self_emp_count / total_count) * 100, 1),
            "unemployment_rate": round((unemployed_count / total_count) * 100, 1),
            "retention_rate_12m": round((retained_count / total_count) * 100, 1),
            "avg_baseline_wage": round(avg_base_wage, 0),
            "avg_current_wage": round(avg_curr_wage, 0),
            "avg_wage_growth_pct": round(wage_growth_pct, 1),
            "remedial_count": remedial_count
        },
        "placement_by_course": placement_by_course,
        "wage_progression": wage_progression_series,
        "status_distribution": status_distribution,
        "district_heatmap": district_heatmap,
        "attrition_breakdown": attrition_breakdown,
        "provider_scorecard": provider_scorecard,
        "gender_distribution": gender_distribution
    }

@router.get("/export/csv")
def export_trainees_csv(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Export longitudinal trainee outcome dataset to CSV."""
    trainees = db.query(Trainee).order_by(Trainee.id).all()
    
    # Audit log
    audit = AuditLog(
        user_id=current_user.get("sub", "ADMIN"),
        user_name=current_user.get("name", "Admin"),
        user_role=current_user.get("role", "Admin"),
        action="EXPORT_CSV_DATASET",
        resource_type="Dataset",
        resource_id="TRAINEE_LONGITUDINAL_ALL",
        details=f"Exported {len(trainees)} longitudinal trainee outcome records to CSV"
    )
    db.add(audit)
    db.commit()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Trainee ID",
        "Trainee Name",
        "Masked Aadhaar",
        "Masked Mobile",
        "Course",
        "Training Provider",
        "District",
        "Gender",
        "Age",
        "Category",
        "Cohort Batch",
        "Baseline Wage (M0)",
        "Month 3 Wage",
        "Month 6 Wage",
        "Month 12 Wage / Revenue",
        "Current Status",
        "Current Employer / Enterprise",
        "Current Role",
        "12M Retained",
        "Attrition Reason",
        "Remedial Action Flag",
        "AI Attrition Risk",
        "AI Risk Category",
        "DPDP Consent Status"
    ])
    
    for t in trainees:
        # Extract wages across milestones
        m_wages = {0: t.baseline_wage, 3: 0.0, 6: 0.0, 12: t.current_wage}
        for o in t.outcomes:
            m_wages[o.milestone_month] = o.monthly_wage
            
        writer.writerow([
            t.id,
            t.name,
            t.masked_aadhaar,
            t.masked_mobile,
            t.course,
            t.training_provider,
            t.district,
            t.gender,
            t.age,
            t.socio_economic_category,
            t.cohort_batch,
            m_wages.get(0, 0),
            m_wages.get(3, 0),
            m_wages.get(6, 0),
            m_wages.get(12, 0),
            t.current_status,
            t.current_employer or "N/A",
            t.current_job_role or "N/A",
            "YES" if t.is_retained else "NO",
            t.attrition_reason or "None",
            "FLAGGED" if t.remedial_action_flag else "RESOLVED / NORMAL",
            f"{t.ai_attrition_risk:.2f}",
            t.ai_risk_category,
            "ACTIVE (DPDP Sec 6)" if (t.consents and t.consents[0].status == 'ACTIVE') else "REVOKED"
        ])
        
    output.seek(0)
    filename = f"SkillTrack_Longitudinal_Outcomes_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/report/summary")
def get_cohort_summary_report(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Provides structured cohort impact report data for PDF generation & print."""
    trainees = db.query(Trainee).all()
    total = len(trainees)
    placed = sum(1 for t in trainees if t.current_status == "Placed")
    self_emp = sum(1 for t in trainees if t.current_status == "Self-Employed")
    unemployed = sum(1 for t in trainees if t.current_status == "Unemployed")
    
    employed = [t for t in trainees if t.current_status in ["Placed", "Self-Employed"]]
    avg_base = sum(t.baseline_wage for t in employed) / len(employed) if employed else 0
    avg_curr = sum(t.current_wage for t in employed) / len(employed) if employed else 0
    growth = ((avg_curr - avg_base) / avg_base * 100) if avg_base > 0 else 0
    
    # Audit log
    audit = AuditLog(
        user_id=current_user.get("sub", "ADMIN"),
        user_name=current_user.get("name", "Admin"),
        user_role=current_user.get("role", "Admin"),
        action="GENERATE_PDF_REPORT",
        resource_type="Report",
        resource_id="COHORT_SUMMARY_2025_2026",
        details="Generated Cohort Longitudinal Outcome Impact Summary Report"
    )
    db.add(audit)
    db.commit()
    
    return {
        "report_metadata": {
            "title": "National Skilling Longitudinal Outcome & Impact Measurement Report",
            "issuing_authority": "Ministry of Skill Development & Entrepreneurship (MSDE) / NITI Aayog",
            "cohort_batch": "Annual Batch 2025-2026 Longitudinal Cycle",
            "generated_at": datetime.utcnow().strftime("%d %B %Y, %H:%M UTC"),
            "compliance_standard": "Digital Personal Data Protection (DPDP) Act 2023 Compliant"
        },
        "executive_summary": {
            "total_certified_trainees": total,
            "overall_employment_rate": f"{round(((placed + self_emp) / total) * 100, 1)}%",
            "wage_employment_placed": f"{placed} ({round((placed / total) * 100, 1)}%)",
            "self_employment_enterprises": f"{self_emp} ({round((self_emp / total) * 100, 1)}%)",
            "unemployment_attrition": f"{unemployed} ({round((unemployed / total) * 100, 1)}%)",
            "average_baseline_wage": f"INR {int(avg_base):,}/month",
            "average_12m_wage": f"INR {int(avg_curr):,}/month",
            "wage_progression_growth": f"+{round(growth, 1)}%",
            "twelve_month_job_retention": f"{round((sum(1 for t in trainees if t.is_retained and t.current_status != 'Unemployed') / total) * 100, 1)}%"
        },
        "strategic_recommendations": [
            "Scale up 'Healthcare Assistant' and 'Electrician' cohorts due to high 12-month retention (>88%) and positive wage delta (>45%).",
            "Establish industry partnership bridge courses in 'Retail Associate' to reduce post-placement attrition caused by shift timing constraints.",
            "Deploy district-level entrepreneurial capital subsidies in Warangal and Guntur for self-employed Welder and Electrician graduates.",
            "Maintain proactive WhatsApp bot quarterly check-ins to flag wage drops within 14 days of job transition."
        ]
    }
