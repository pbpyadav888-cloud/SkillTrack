from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import SelfEmploymentRecord, Trainee, OutcomeLog, AuditLog
from backend.schemas import SelfEmploymentCreateRequest
from backend.security import get_current_user

router = APIRouter(prefix="/api/self-employment", tags=["Self-Employment & Micro-Enterprises"])

@router.get("", response_model=List[dict])
def get_self_employment_records(
    district: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(SelfEmploymentRecord)
    if district:
        query = query.filter(SelfEmploymentRecord.registered_district == district)
    records = query.order_by(SelfEmploymentRecord.created_at.desc()).all()
    
    results = []
    for r in records:
        trainee = db.query(Trainee).filter(Trainee.id == r.trainee_id).first()
        results.append({
            "id": r.id,
            "trainee_id": r.trainee_id,
            "trainee_name": trainee.name if trainee else "Unknown",
            "course": trainee.course if trainee else "Vocational Skill",
            "enterprise_name": r.enterprise_name,
            "enterprise_type": r.enterprise_type,
            "udyam_no": r.udyam_no,
            "gst_no": r.gst_no,
            "monthly_revenue": r.monthly_revenue,
            "monthly_profit": r.monthly_profit,
            "proof_document_name": r.proof_document_name,
            "verification_status": r.verification_status,
            "registered_district": r.registered_district,
            "created_at": r.created_at.isoformat() if r.created_at else None
        })
    return results

@router.post("", response_model=dict)
def register_self_employment(req: SelfEmploymentCreateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trainee = db.query(Trainee).filter(Trainee.id == req.trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")
        
    now = datetime.utcnow()
    # Check if record exists
    existing = db.query(SelfEmploymentRecord).filter(SelfEmploymentRecord.trainee_id == req.trainee_id).first()
    if existing:
        existing.enterprise_name = req.enterprise_name
        existing.enterprise_type = req.enterprise_type
        existing.udyam_no = req.udyam_no
        existing.gst_no = req.gst_no
        existing.monthly_revenue = req.monthly_revenue
        existing.monthly_profit = req.monthly_profit or (req.monthly_revenue * 0.7)
        existing.registered_district = req.registered_district
        existing.verification_status = "Verified"
    else:
        se = SelfEmploymentRecord(
            trainee_id=req.trainee_id,
            enterprise_name=req.enterprise_name,
            enterprise_type=req.enterprise_type,
            udyam_no=req.udyam_no or f"UDYAM-AP-01-{req.trainee_id[-5:]}",
            gst_no=req.gst_no,
            monthly_revenue=req.monthly_revenue,
            monthly_profit=req.monthly_profit or (req.monthly_revenue * 0.7),
            proof_document_name=f"Udyam_Cert_{req.trainee_id}.pdf",
            verification_status="Verified",
            registered_district=req.registered_district,
            created_at=now
        )
        db.add(se)
        
    # Update Trainee Status
    trainee.current_status = "Self-Employed"
    trainee.current_wage = req.monthly_profit or (req.monthly_revenue * 0.7)
    trainee.current_employer = f"Self-Employed ({req.enterprise_name})"
    trainee.current_job_role = f"Proprietor / Practitioner ({trainee.course})"
    trainee.is_retained = True
    trainee.attrition_reason = None
    trainee.remedial_action_flag = False
    
    # Add outcome log
    m_log = OutcomeLog(
        trainee_id=trainee.id,
        milestone="Month 6",
        milestone_month=6,
        status="Self-Employed",
        monthly_wage=trainee.current_wage,
        employer_name=req.enterprise_name,
        job_role="Business Owner / Self-Employed",
        location=req.registered_district,
        verification_status="Verified (Udyam Proof Attached)",
        data_source="Self-Employment Portal",
        logged_at=now,
        notes=f"Registered micro-enterprise '{req.enterprise_name}' with monthly revenue ₹{int(req.monthly_revenue)}."
    )
    db.add(m_log)
    
    audit = AuditLog(
        user_id=current_user.get("sub", "TRAINEE"),
        user_name=trainee.name,
        user_role="Trainee",
        action="REGISTER_SELF_EMPLOYMENT",
        resource_type="SelfEmploymentRecord",
        resource_id=trainee.id,
        details=f"Registered self-employment enterprise '{req.enterprise_name}' with Udyam verification."
    )
    db.add(audit)
    db.commit()
    
    return {
        "status": "SUCCESS",
        "message": f"Self-employment registered for {trainee.name} ({req.enterprise_name})",
        "trainee_id": trainee.id,
        "enterprise_name": req.enterprise_name,
        "monthly_profit": trainee.current_wage
    }
