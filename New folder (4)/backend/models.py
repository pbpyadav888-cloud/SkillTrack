from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # Admin, Training Provider, Employer, Trainee
    full_name = Column(String(150), nullable=False)
    organization = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Trainee(Base):
    __tablename__ = "trainees"

    id = Column(String(50), primary_key=True, index=True)  # e.g., SKILL-2026-10001
    name = Column(String(150), nullable=False, index=True)
    masked_aadhaar = Column(String(30), nullable=False)
    encrypted_aadhaar = Column(Text, nullable=False)
    masked_mobile = Column(String(30), nullable=False)
    encrypted_mobile = Column(Text, nullable=False)
    
    course = Column(String(100), nullable=False, index=True)
    training_provider = Column(String(150), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    gender = Column(String(20), nullable=False)
    age = Column(Integer, default=22)
    socio_economic_category = Column(String(50), default="OBC")
    cohort_batch = Column(String(50), default="Batch 2025-Q1")
    completion_date = Column(String(50), default="2025-03-31")
    
    baseline_wage = Column(Float, default=0.0)
    current_status = Column(String(50), default="Placed", index=True)  # Placed, Self-Employed, Unemployed, Apprenticeship
    current_wage = Column(Float, default=0.0)
    current_employer = Column(String(150), nullable=True)
    current_job_role = Column(String(150), nullable=True)
    is_retained = Column(Boolean, default=True)
    
    attrition_reason = Column(String(100), nullable=True)  # Low salary, Poor fit, Health, Relocation, Skills mismatch, etc.
    remedial_action_flag = Column(Boolean, default=False)
    remedial_notes = Column(Text, nullable=True)
    
    ai_attrition_risk = Column(Float, default=0.15)  # 0.0 - 1.0 probability
    ai_risk_category = Column(String(30), default="Low")  # Low, Medium, High
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    outcomes = relationship("OutcomeLog", back_populates="trainee", cascade="all, delete-orphan", order_by="OutcomeLog.milestone_month")
    consents = relationship("ConsentRecord", back_populates="trainee", cascade="all, delete-orphan")
    self_employment = relationship("SelfEmploymentRecord", back_populates="trainee", uselist=False, cascade="all, delete-orphan")
    messages = relationship("FollowUpMessage", back_populates="trainee", cascade="all, delete-orphan")


class OutcomeLog(Base):
    __tablename__ = "outcome_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    trainee_id = Column(String(50), ForeignKey("trainees.id"), index=True, nullable=False)
    milestone = Column(String(50), nullable=False)  # Month 0, Month 3, Month 6, Month 12
    milestone_month = Column(Integer, nullable=False)  # 0, 3, 6, 12
    status = Column(String(50), nullable=False)  # Placed, Self-Employed, Unemployed, Apprenticeship
    monthly_wage = Column(Float, default=0.0)
    employer_name = Column(String(150), nullable=True)
    job_role = Column(String(150), nullable=True)
    location = Column(String(100), nullable=True)
    verification_status = Column(String(50), default="Verified")  # Verified, Pending, Self-Reported
    data_source = Column(String(100), default="WhatsApp Bot")  # WhatsApp Bot, Employer Portal, Field Survey, Direct
    logged_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)

    trainee = relationship("Trainee", back_populates="outcomes")


class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    trainee_id = Column(String(50), ForeignKey("trainees.id"), index=True, nullable=False)
    consent_type = Column(String(150), default="12-Month Longitudinal Employment & Wage Tracking")
    consent_text = Column(Text, nullable=False)
    dpdp_purpose = Column(Text, default="DPDP Act 2023 Section 6 - Vocational Training Outcome Audit and Remedial Skilling")
    is_given = Column(Boolean, default=True)
    status = Column(String(30), default="ACTIVE")  # ACTIVE, REVOKED
    timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(50), default="127.0.0.1")
    verification_hash = Column(String(100), nullable=False)

    trainee = relationship("Trainee", back_populates="consents")


class Employer(Base):
    __tablename__ = "employers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_name = Column(String(200), unique=True, index=True, nullable=False)
    gstin = Column(String(30), nullable=False)
    udyam_no = Column(String(50), nullable=True)
    sector = Column(String(100), default="Electronics & Manufacturing")
    contact_person = Column(String(150), nullable=False)
    contact_email = Column(String(150), nullable=False)
    contact_mobile = Column(String(30), nullable=False)
    district = Column(String(100), default="Hyderabad")
    verification_status = Column(String(50), default="Verified")  # Verified, Pending, Rejected
    gst_valid = Column(Boolean, default=True)
    udyam_valid = Column(Boolean, default=True)
    proof_document_name = Column(String(200), default="GST_Certificate_2025.pdf")
    created_at = Column(DateTime, default=datetime.utcnow)


class SelfEmploymentRecord(Base):
    __tablename__ = "self_employment_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    trainee_id = Column(String(50), ForeignKey("trainees.id"), index=True, nullable=False)
    enterprise_name = Column(String(200), nullable=False)
    enterprise_type = Column(String(100), default="Sole Proprietorship")
    udyam_no = Column(String(50), nullable=True)
    gst_no = Column(String(50), nullable=True)
    monthly_revenue = Column(Float, default=0.0)
    monthly_profit = Column(Float, default=0.0)
    proof_document_name = Column(String(200), default="Udyam_Registration_Cert.pdf")
    verification_status = Column(String(50), default="Verified")  # Verified, Pending, Under Review
    registered_district = Column(String(100), default="Hyderabad")
    created_at = Column(DateTime, default=datetime.utcnow)

    trainee = relationship("Trainee", back_populates="self_employment")


class FollowUpMessage(Base):
    __tablename__ = "follow_up_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    trainee_id = Column(String(50), ForeignKey("trainees.id"), index=True, nullable=False)
    milestone = Column(String(50), nullable=False)  # Month 3, Month 6, Month 12
    channel = Column(String(30), default="WhatsApp")  # WhatsApp, SMS
    direction = Column(String(20), default="OUTBOUND")  # OUTBOUND, INBOUND
    message_text = Column(Text, nullable=False)
    status = Column(String(30), default="DELIVERED")  # DELIVERED, REPLIED, FAILED, PENDING
    sent_at = Column(DateTime, default=datetime.utcnow)
    response_value = Column(String(100), nullable=True)

    trainee = relationship("Trainee", back_populates="messages")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(50), default="SYSTEM")
    user_name = Column(String(150), default="System Engine")
    user_role = Column(String(50), default="Admin")
    action = Column(String(100), nullable=False)  # VIEW_RECORD, ONBOARD_TRAINEE, CONSENT_CAPTURED, etc.
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
