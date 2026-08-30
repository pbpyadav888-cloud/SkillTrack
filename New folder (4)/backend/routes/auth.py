from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User, Trainee, AuditLog
from backend.schemas import LoginRequest, TokenResponse, AadhaarKycRequest
from backend.security import verify_password, create_access_token, mask_aadhaar, mask_mobile, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication & DPDP Access"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    token_data = {
        "sub": user.id,
        "username": user.username,
        "role": user.role,
        "name": user.full_name,
        "organization": user.organization
    }
    token = create_access_token(token_data, expires_delta=timedelta(hours=24))
    
    # Audit log
    audit = AuditLog(
        user_id=user.id,
        user_name=user.full_name,
        user_role=user.role,
        action="USER_LOGIN",
        resource_type="Auth",
        resource_id=user.id,
        details=f"Successful authentication as {user.role}."
    )
    db.add(audit)
    db.commit()
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": token_data
    }

@router.get("/me")
def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/mock-aadhaar-otp")
def generate_aadhaar_otp(req: AadhaarKycRequest):
    """Simulates UIDAI Aadhaar e-KYC OTP generation."""
    clean = "".join(c for c in req.aadhaar_number if c.isdigit())
    if len(clean) != 12:
        raise HTTPException(status_code=400, detail="Aadhaar number must be exactly 12 digits")
    
    return {
        "status": "SUCCESS",
        "message": f"OTP successfully dispatched to UIDAI registered mobile ending in ****{clean[-4:]}",
        "masked_aadhaar": mask_aadhaar(clean),
        "simulated_otp": "789123",
        "expires_in_seconds": 300
    }

@router.post("/mock-aadhaar-verify")
def verify_aadhaar_otp(req: AadhaarKycRequest):
    """Simulates UIDAI Aadhaar e-KYC demographic verification."""
    clean = "".join(c for c in req.aadhaar_number if c.isdigit())
    if len(clean) != 12:
        raise HTTPException(status_code=400, detail="Aadhaar number must be 12 digits")
    if req.otp != "789123" and req.otp != "123456" and req.otp != "999999":
        # Allow demo OTPs
        raise HTTPException(status_code=400, detail="Invalid e-KYC OTP entered. Please use 789123 for sandbox.")
        
    return {
        "status": "VERIFIED",
        "e_kyc_status": "SUCCESS",
        "masked_aadhaar": mask_aadhaar(clean),
        "kyc_ref_code": f"UIDAI-KYC-2026-{clean[-4:]}-X9",
        "demographic_data": {
            "state": "Andhra Pradesh",
            "country": "India",
            "aadhaar_auth_agency": "UIDAI Central Identities Data Repository"
        }
    }
