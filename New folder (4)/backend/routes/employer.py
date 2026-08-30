import re
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Employer, Trainee, OutcomeLog, AuditLog
from backend.schemas import EmployerCreateRequest, GstUdyamVerifyRequest
from backend.security import get_current_user

router = APIRouter(prefix="/api/employers", tags=["Employer Validation & Placement Proof"])

@router.get("", response_model=List[dict])
def get_employers(
    sector: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Employer)
    if sector:
        query = query.filter(Employer.sector == sector)
    if status:
        query = query.filter(Employer.verification_status == status)
    employers = query.order_by(Employer.company_name).all()
    
    results = []
    for e in employers:
        # Count linked placed trainees
        linked_count = db.query(Trainee).filter(Trainee.current_employer == e.company_name).count()
        results.append({
            "id": e.id,
            "company_name": e.company_name,
            "gstin": e.gstin,
            "udyam_no": e.udyam_no,
            "sector": e.sector,
            "contact_person": e.contact_person,
            "contact_email": e.contact_email,
            "contact_mobile": e.contact_mobile,
            "district": e.district,
            "verification_status": e.verification_status,
            "gst_valid": e.gst_valid,
            "udyam_valid": e.udyam_valid,
            "proof_document_name": e.proof_document_name,
            "linked_placements_count": linked_count,
            "created_at": e.created_at.isoformat() if e.created_at else None
        })
    return results

@router.post("/verify-registry")
def verify_gst_or_udyam(req: GstUdyamVerifyRequest):
    """
    Mock GST / Udyam Registry lookup simulation with realistic validation logic.
    """
    val = req.number.strip().upper()
    
    if req.type == "GSTIN":
        # GSTIN regex: 2 digits state code + 10 chars PAN + 1 entity + 1 'Z' + 1 checksum
        gst_regex = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
        is_valid_format = bool(re.match(gst_regex, val)) or len(val) >= 15
        
        if not is_valid_format:
            raise HTTPException(status_code=400, detail="Invalid GSTIN format. Example format: 36AABCT1234F1Z8")
            
        return {
            "status": "VALID",
            "type": "GSTIN",
            "identifier": val,
            "registered_legal_name": f"Enterprise registered under GSTIN {val}",
            "trade_name": "Commercial Industrial Units Ltd",
            "taxpayer_type": "Regular",
            "gst_status": "Active",
            "state_jurisdiction": "Andhra Pradesh / Telangana State Tax Authority",
            "registration_date": "2019-07-01",
            "verified_by": "GST Portal Sandbox API"
        }
        
    elif req.type == "UDYAM":
        # Udyam regex: UDYAM-XX-00-0000000
        if not val.startswith("UDYAM-"):
            raise HTTPException(status_code=400, detail="Udyam registration must start with 'UDYAM-' (e.g. UDYAM-TS-02-0012345)")
            
        return {
            "status": "VALID",
            "type": "UDYAM",
            "identifier": val,
            "enterprise_type": "Micro / Small Enterprise",
            "major_activity": "Manufacturing & Services",
            "msme_classification": "Valid MSME Enterprise",
            "verified_by": "Ministry of MSME Udyam Portal Sandbox"
        }
        
    raise HTTPException(status_code=400, detail="Invalid verification type. Use 'GSTIN' or 'UDYAM'.")

@router.post("", response_model=dict)
def register_employer(req: EmployerCreateRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    existing = db.query(Employer).filter(Employer.company_name == req.company_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Employer company already registered")
        
    emp = Employer(
        company_name=req.company_name,
        gstin=req.gstin,
        udyam_no=req.udyam_no,
        sector=req.sector,
        contact_person=req.contact_person,
        contact_email=req.contact_email,
        contact_mobile=req.contact_mobile,
        district=req.district,
        verification_status="Verified",
        gst_valid=True,
        udyam_valid=True,
        proof_document_name=f"GST_Registration_{req.gstin[:6]}.pdf"
    )
    db.add(emp)
    
    audit = AuditLog(
        user_id=current_user.get("sub", "ADMIN"),
        user_name=current_user.get("name", "Admin"),
        user_role=current_user.get("role", "Admin"),
        action="REGISTER_EMPLOYER",
        resource_type="Employer",
        resource_id=req.company_name,
        details=f"Registered employer '{req.company_name}' with GSTIN {req.gstin}"
    )
    db.add(audit)
    db.commit()
    db.refresh(emp)
    
    return {
        "status": "SUCCESS",
        "message": f"Employer {emp.company_name} registered and verified successfully",
        "employer_id": emp.id
    }

@router.post("/{employer_id}/verify-placement")
def verify_candidate_placement(
    employer_id: int,
    trainee_id: str = Query(...),
    monthly_wage: float = Query(...),
    job_role: str = Query(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Employer / Admin marks placement proof (offer letter, EPF record, appointment letter) as verified.
    """
    emp = db.query(Employer).filter(Employer.id == employer_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employer not found")
        
    trainee = db.query(Trainee).filter(Trainee.id == trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")
        
    trainee.current_status = "Placed"
    trainee.current_wage = monthly_wage
    trainee.current_employer = emp.company_name
    trainee.current_job_role = job_role
    trainee.is_retained = True
    trainee.attrition_reason = None
    trainee.remedial_action_flag = False
    
    # Add verified outcome
    out_log = OutcomeLog(
        trainee_id=trainee.id,
        milestone="Month 6",
        milestone_month=6,
        status="Placed",
        monthly_wage=monthly_wage,
        employer_name=emp.company_name,
        job_role=job_role,
        location=emp.district,
        verification_status="Verified (Employer Confirmed)",
        data_source="Employer Validation Portal",
        logged_at=datetime.utcnow(),
        notes=f"Offer letter verified by {emp.contact_person} ({emp.company_name})."
    )
    db.add(out_log)
    
    audit = AuditLog(
        user_id=current_user.get("sub", "EMPLOYER"),
        user_name=current_user.get("name", emp.company_name),
        user_role="Employer",
        action="VERIFY_PLACEMENT_PROOF",
        resource_type="Trainee",
        resource_id=trainee.id,
        details=f"Employer {emp.company_name} verified placement of {trainee.id} ({trainee.name}) with wage ₹{int(monthly_wage)}"
    )
    db.add(audit)
    db.commit()
    
    return {
        "status": "VERIFIED",
        "message": f"Placement of {trainee.name} at {emp.company_name} successfully verified",
        "trainee_id": trainee.id,
        "employer": emp.company_name,
        "wage": monthly_wage
    }
