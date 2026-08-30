from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    username: str
    password: str

class AadhaarKycRequest(BaseModel):
    aadhaar_number: str = Field(..., description="12-digit Aadhaar Number")
    otp: Optional[str] = Field(None, description="6-digit OTP")

class GstUdyamVerifyRequest(BaseModel):
    type: str = Field(..., description="GSTIN or UDYAM")
    number: str

class TraineeCreateRequest(BaseModel):
    name: str
    aadhaar_number: str
    mobile_number: str
    course: str
    training_provider: str
    district: str
    gender: str = "Male"
    age: int = 22
    socio_economic_category: str = "OBC"
    cohort_batch: str = "Batch 2025-Q1"
    baseline_wage: float = 0.0
    initial_status: str = "Placed"  # Placed, Self-Employed, Unemployed, Apprenticeship
    initial_wage: float = 12000.0
    employer_name: Optional[str] = None
    job_role: Optional[str] = None
    consent_given: bool = True
    consent_text: Optional[str] = None

class OutcomeLogResponse(BaseModel):
    id: int
    milestone: str
    milestone_month: int
    status: str
    monthly_wage: float
    employer_name: Optional[str]
    job_role: Optional[str]
    location: Optional[str]
    verification_status: str
    data_source: str
    logged_at: datetime
    notes: Optional[str]

    class Config:
        from_attributes = True

class ConsentRecordResponse(BaseModel):
    id: int
    consent_type: str
    consent_text: str
    dpdp_purpose: str
    is_given: bool
    status: str
    timestamp: datetime
    ip_address: str
    verification_hash: str

    class Config:
        from_attributes = True

class TraineeResponse(BaseModel):
    id: str
    name: str
    masked_aadhaar: str
    masked_mobile: str
    course: str
    training_provider: str
    district: str
    gender: str
    age: int
    socio_economic_category: str
    cohort_batch: str
    completion_date: str
    baseline_wage: float
    current_status: str
    current_wage: float
    current_employer: Optional[str]
    current_job_role: Optional[str]
    is_retained: bool
    attrition_reason: Optional[str]
    remedial_action_flag: bool
    remedial_notes: Optional[str]
    ai_attrition_risk: float
    ai_risk_category: str
    created_at: datetime
    outcomes: List[OutcomeLogResponse] = []
    consents: List[ConsentRecordResponse] = []

    class Config:
        from_attributes = True

class FollowUpSimulateRequest(BaseModel):
    trainee_id: str
    milestone: str = "Month 6"  # Month 3, Month 6, Month 12
    channel: str = "WhatsApp"  # WhatsApp, SMS
    is_employed: bool = True
    current_wage: Optional[float] = 16000.0
    employer_name: Optional[str] = None
    job_role: Optional[str] = None
    attrition_reason: Optional[str] = None  # If not employed
    raw_reply_text: Optional[str] = None

class RemedialActionRequest(BaseModel):
    trainee_id: str
    action_type: str = "Upskilling Referral"  # Placement Re-attempt, Upskilling Referral, Apprenticeship Match, Counseling
    notes: str
    resolved: bool = True

class EmployerCreateRequest(BaseModel):
    company_name: str
    gstin: str
    udyam_no: Optional[str] = None
    sector: str = "Electronics & Manufacturing"
    contact_person: str
    contact_email: str
    contact_mobile: str
    district: str = "Hyderabad"

class SelfEmploymentCreateRequest(BaseModel):
    trainee_id: str
    enterprise_name: str
    enterprise_type: str = "Sole Proprietorship"
    udyam_no: Optional[str] = None
    gst_no: Optional[str] = None
    monthly_revenue: float = 18000.0
    monthly_profit: Optional[float] = 12000.0
    registered_district: str = "Hyderabad"

class AuditLogResponse(BaseModel):
    id: int
    user_id: str
    user_name: str
    user_role: str
    action: str
    resource_type: str
    resource_id: Optional[str]
    details: Optional[str]
    ip_address: str
    timestamp: datetime

    class Config:
        from_attributes = True
