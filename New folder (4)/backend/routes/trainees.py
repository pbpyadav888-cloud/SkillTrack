from datetime import datetime
import random
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from backend.database import get_db
from backend.models import Trainee, OutcomeLog, ConsentRecord, AuditLog, SelfEmploymentRecord
from backend.schemas import TraineeCreateRequest, TraineeResponse, RemedialActionRequest
from backend.security import encrypt_field, mask_aadhaar, mask_mobile, generate_consent_hash, get_current_user
from backend.ai_model import calculate_attrition_risk

router = APIRouter(prefix="/api/trainees", tags=["Trainee Onboarding & Tracking"])

@router.get("", response_model=dict)
def get_trainees(
    course: Optional[str] = Query(None),
    provider: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    is_retained: Optional[bool] = Query(None),
    remedial_only: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    query = db.query(Trainee)
    
    # RBAC: Training Provider can only see their own trainees
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
    if is_retained is not None:
        query = query.filter(Trainee.is_retained == is_retained)
    if remedial_only:
        query = query.filter(Trainee.remedial_action_flag == True)
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                Trainee.name.ilike(s),
                Trainee.id.ilike(s),
                Trainee.district.ilike(s),
                Trainee.current_employer.ilike(s)
            )
        )
        
    total = query.count()
    offset = (page - 1) * limit
    trainees = query.order_by(Trainee.id).offset(offset).limit(limit).all()
    
    # Format list response with parsed relations
    results = []
    for t in trainees:
        outcomes_data = [
            {
                "id": o.id,
                "milestone": o.milestone,
                "milestone_month": o.milestone_month,
                "status": o.status,
                "monthly_wage": o.monthly_wage,
                "employer_name": o.employer_name,
                "job_role": o.job_role,
                "location": o.location,
                "verification_status": o.verification_status,
                "data_source": o.data_source,
                "logged_at": o.logged_at.isoformat() if o.logged_at else None,
                "notes": o.notes
            } for o in t.outcomes
        ]
        
        results.append({
            "id": t.id,
            "name": t.name,
            "masked_aadhaar": t.masked_aadhaar,
            "masked_mobile": t.masked_mobile,
            "course": t.course,
            "training_provider": t.training_provider,
            "district": t.district,
            "gender": t.gender,
            "age": t.age,
            "socio_economic_category": t.socio_economic_category,
            "cohort_batch": t.cohort_batch,
            "completion_date": t.completion_date,
            "baseline_wage": t.baseline_wage,
            "current_status": t.current_status,
            "current_wage": t.current_wage,
            "current_employer": t.current_employer,
            "current_job_role": t.current_job_role,
            "is_retained": t.is_retained,
            "attrition_reason": t.attrition_reason,
            "remedial_action_flag": t.remedial_action_flag,
            "remedial_notes": t.remedial_notes,
            "ai_attrition_risk": t.ai_attrition_risk,
            "ai_risk_category": t.ai_risk_category,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "outcomes": outcomes_data
        })
        
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "items": results
    }

@router.get("/{trainee_id}")
def get_trainee_detail(trainee_id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")
        
    # Log access for DPDP compliance
    audit = AuditLog(
        user_id=current_user.get("sub", "GUEST"),
        user_name=current_user.get("name", "User"),
        user_role=current_user.get("role", "Auditor"),
        action="VIEW_TRAINEE_RECORD",
        resource_type="Trainee",
        resource_id=trainee.id,
        details=f"Viewed full longitudinal record of {trainee.id} ({trainee.name})"
    )
    db.add(audit)
    db.commit()
    
    outcomes = [
        {
            "id": o.id,
            "milestone": o.milestone,
            "milestone_month": o.milestone_month,
            "status": o.status,
            "monthly_wage": o.monthly_wage,
            "employer_name": o.employer_name,
            "job_role": o.job_role,
            "location": o.location,
            "verification_status": o.verification_status,
            "data_source": o.data_source,
            "logged_at": o.logged_at.isoformat() if o.logged_at else None,
            "notes": o.notes
        } for o in trainee.outcomes
    ]
    
    consents = [
        {
            "id": c.id,
            "consent_type": c.consent_type,
            "consent_text": c.consent_text,
            "dpdp_purpose": c.dpdp_purpose,
            "is_given": c.is_given,
            "status": c.status,
            "timestamp": c.timestamp.isoformat() if c.timestamp else None,
            "ip_address": c.ip_address,
            "verification_hash": c.verification_hash
        } for c in trainee.consents
    ]
    
    self_emp = None
    if trainee.self_employment:
        se = trainee.self_employment
        self_emp = {
            "id": se.id,
            "enterprise_name": se.enterprise_name,
            "enterprise_type": se.enterprise_type,
            "udyam_no": se.udyam_no,
            "gst_no": se.gst_no,
            "monthly_revenue": se.monthly_revenue,
            "monthly_profit": se.monthly_profit,
            "proof_document_name": se.proof_document_name,
            "verification_status": se.verification_status,
            "registered_district": se.registered_district
        }
        
    messages = [
        {
            "id": m.id,
            "milestone": m.milestone,
            "channel": m.channel,
            "direction": m.direction,
            "message_text": m.message_text,
            "status": m.status,
            "response_value": m.response_value,
            "sent_at": m.sent_at.isoformat() if m.sent_at else None
        } for m in trainee.messages
    ]

    return {
        "id": trainee.id,
        "name": trainee.name,
        "masked_aadhaar": trainee.masked_aadhaar,
        "masked_mobile": trainee.masked_mobile,
        "course": trainee.course,
        "training_provider": trainee.training_provider,
        "district": trainee.district,
        "gender": trainee.gender,
        "age": trainee.age,
        "socio_economic_category": trainee.socio_economic_category,
        "cohort_batch": trainee.cohort_batch,
        "completion_date": trainee.completion_date,
        "baseline_wage": trainee.baseline_wage,
        "current_status": trainee.current_status,
        "current_wage": trainee.current_wage,
        "current_employer": trainee.current_employer,
        "current_job_role": trainee.current_job_role,
        "is_retained": trainee.is_retained,
        "attrition_reason": trainee.attrition_reason,
        "remedial_action_flag": trainee.remedial_action_flag,
        "remedial_notes": trainee.remedial_notes,
        "ai_attrition_risk": trainee.ai_attrition_risk,
        "ai_risk_category": trainee.ai_risk_category,
        "created_at": trainee.created_at.isoformat() if trainee.created_at else None,
        "outcomes": outcomes,
        "consents": consents,
        "self_employment": self_emp,
        "messages": messages
    }

@router.post("", response_model=dict)
def onboard_trainee(req: TraineeCreateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """
    Onboard a trainee with Aadhaar/Mobile encryption, DPDP consent hashing,
    and automatic unique ID generation (SKILL-2026-XXXXX).
    """
    # Count current trainees to generate sequential ID
    total_count = db.query(Trainee).count()
    new_id = f"SKILL-2026-{10001 + total_count + random.randint(1, 9)}"
    
    masked_adh = mask_aadhaar(req.aadhaar_number)
    enc_adh = encrypt_field(req.aadhaar_number)
    masked_mob = mask_mobile(req.mobile_number)
    enc_mob = encrypt_field(req.mobile_number)
    
    # Calculate AI risk
    ai_risk = calculate_attrition_risk(
        course=req.course,
        district=req.district,
        baseline_wage=req.baseline_wage,
        current_wage=req.initial_wage if req.initial_status in ["Placed", "Self-Employed"] else 0.0,
        current_status=req.initial_status,
        age=req.age,
        gender=req.gender
    )
    
    now = datetime.utcnow()
    trainee = Trainee(
        id=new_id,
        name=req.name,
        masked_aadhaar=masked_adh,
        encrypted_aadhaar=enc_adh,
        masked_mobile=masked_mob,
        encrypted_mobile=enc_mob,
        course=req.course,
        training_provider=req.training_provider,
        district=req.district,
        gender=req.gender,
        age=req.age,
        socio_economic_category=req.socio_economic_category,
        cohort_batch=req.cohort_batch,
        completion_date=now.strftime("%Y-%m-%d"),
        baseline_wage=req.baseline_wage,
        current_status=req.initial_status,
        current_wage=req.initial_wage if req.initial_status in ["Placed", "Self-Employed"] else 0.0,
        current_employer=req.employer_name,
        current_job_role=req.job_role or f"Trainee {req.course}",
        is_retained=True if req.initial_status != "Unemployed" else False,
        attrition_reason=None if req.initial_status != "Unemployed" else "Initial non-placement",
        remedial_action_flag=True if req.initial_status == "Unemployed" else False,
        remedial_notes="New onboarding: Remedial placement support scheduled" if req.initial_status == "Unemployed" else None,
        ai_attrition_risk=ai_risk["risk_score"],
        ai_risk_category=ai_risk["risk_category"],
        created_at=now
    )
    db.add(trainee)
    
    # DPDP Consent record
    consent_text = req.consent_text or "I explicitly consent to my Aadhaar-linked training records being tracked longitudinally for 12 months post-certification for employment validation and impact measurement under the Digital Personal Data Protection Act, 2023."
    c_hash = generate_consent_hash(new_id, consent_text, now.isoformat())
    
    consent_rec = ConsentRecord(
        trainee_id=new_id,
        consent_type="12-Month Longitudinal Employment & Wage Tracking",
        consent_text=consent_text,
        dpdp_purpose="DPDP Act 2023 Section 6 - Vocational Training Outcome Audit and Remedial Skilling",
        is_given=req.consent_given,
        status="ACTIVE" if req.consent_given else "DECLINED",
        timestamp=now,
        ip_address="127.0.0.1",
        verification_hash=c_hash
    )
    db.add(consent_rec)
    
    # Milestone 0 outcome
    m0 = OutcomeLog(
        trainee_id=new_id,
        milestone="Month 0",
        milestone_month=0,
        status=req.initial_status,
        monthly_wage=req.initial_wage if req.initial_status in ["Placed", "Self-Employed"] else 0.0,
        employer_name=req.employer_name,
        job_role=req.job_role,
        location=req.district,
        verification_status="Verified",
        data_source="Onboarding e-KYC Verification",
        logged_at=now,
        notes="Initial baseline outcome recorded upon batch completion."
    )
    db.add(m0)
    
    # Audit log
    audit = AuditLog(
        user_id=current_user.get("sub", "ONBOARD_BOT"),
        user_name=current_user.get("name", "Training Provider Admin"),
        user_role=current_user.get("role", "Training Provider"),
        action="ONBOARD_TRAINEE",
        resource_type="Trainee",
        resource_id=new_id,
        details=f"Onboarded trainee {req.name} ({new_id}) with DPDP consent seal {c_hash[:12]}..."
    )
    db.add(audit)
    
    db.commit()
    db.refresh(trainee)
    
    return {
        "status": "SUCCESS",
        "message": f"Trainee {req.name} successfully registered with ID {new_id}",
        "trainee_id": new_id,
        "masked_aadhaar": masked_adh,
        "masked_mobile": masked_mob,
        "dpdp_consent_seal": c_hash
    }

@router.post("/{trainee_id}/remedial")
def record_remedial_action(trainee_id: str, req: RemedialActionRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")
        
    trainee.remedial_notes = f"[{datetime.utcnow().strftime('%Y-%m-%d')}] {req.action_type}: {req.notes}"
    if req.resolved:
        trainee.remedial_action_flag = False
        trainee.ai_risk_category = "Medium"
        trainee.ai_attrition_risk = max(0.20, trainee.ai_attrition_risk - 0.30)
        
    audit = AuditLog(
        user_id=current_user.get("sub", "ADMIN"),
        user_name=current_user.get("name", "Admin"),
        user_role=current_user.get("role", "Admin"),
        action="REMEDIAL_ACTION_APPLIED",
        resource_type="Trainee",
        resource_id=trainee_id,
        details=f"Applied remedial action '{req.action_type}' to {trainee_id}. Notes: {req.notes}"
    )
    db.add(audit)
    db.commit()
    
    return {
        "status": "SUCCESS",
        "message": f"Remedial action recorded for trainee {trainee_id}",
        "remedial_notes": trainee.remedial_notes,
        "remedial_flag": trainee.remedial_action_flag
    }

@router.post("/{trainee_id}/revoke-consent")
def revoke_consent(trainee_id: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """DPDP Act Right to Withdraw Consent."""
    consent = db.query(ConsentRecord).filter(ConsentRecord.trainee_id == trainee_id, ConsentRecord.status == "ACTIVE").first()
    if not consent:
        raise HTTPException(status_code=404, detail="Active consent record not found")
        
    consent.status = "REVOKED"
    consent.is_given = False
    
    audit = AuditLog(
        user_id=current_user.get("sub", "TRAINEE"),
        user_name=current_user.get("name", "Trainee"),
        user_role="Trainee",
        action="CONSENT_REVOKED",
        resource_type="ConsentRecord",
        resource_id=trainee_id,
        details=f"DPDP Section 6(4): Consent revoked for longitudinal tracking by data principal {trainee_id}"
    )
    db.add(audit)
    db.commit()
    
    return {
        "status": "REVOKED",
        "message": f"Consent for trainee {trainee_id} has been revoked as per DPDP Act 2023. Automated tracking suspended."
    }
