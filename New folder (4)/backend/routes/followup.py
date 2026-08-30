import re
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Trainee, OutcomeLog, FollowUpMessage, AuditLog
from backend.schemas import FollowUpSimulateRequest
from backend.security import get_current_user
from backend.ai_model import calculate_attrition_risk, analyze_feedback_nlp

router = APIRouter(prefix="/api/followup", tags=["Automated Follow-Up Bot"])

@router.get("/messages")
def get_followup_messages(
    trainee_id: Optional[str] = Query(None),
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(FollowUpMessage)
    if trainee_id:
        query = query.filter(FollowUpMessage.trainee_id == trainee_id)
    messages = query.order_by(FollowUpMessage.sent_at.desc()).limit(limit).all()
    
    return [
        {
            "id": m.id,
            "trainee_id": m.trainee_id,
            "milestone": m.milestone,
            "channel": m.channel,
            "direction": m.direction,
            "message_text": m.message_text,
            "status": m.status,
            "response_value": m.response_value,
            "sent_at": m.sent_at.isoformat() if m.sent_at else None
        } for m in messages
    ]

@router.post("/send-batch")
def send_batch_followup(
    milestone: str = Query("Month 6", pattern="^(Month 3|Month 6|Month 12)$"),
    channel: str = Query("WhatsApp", pattern="^(WhatsApp|SMS)$"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Simulates triggering an automated WhatsApp/SMS follow-up broadcast
    to active cohort trainees for 3, 6, or 12-month post-training audit.
    """
    trainees = db.query(Trainee).all()
    count_sent = 0
    now = datetime.utcnow()
    
    for t in trainees:
        msg_text = (
            f"Namaste {t.name}! This is SkillTrack (Govt. of India MSDE). "
            f"Checking in for your {milestone} post-certification milestone: "
            f"Are you currently employed in {t.course}? "
            f"Reply 'Y' for Yes (with salary e.g. Y 18000) or 'N' for No (with reason)."
        )
        
        msg = FollowUpMessage(
            trainee_id=t.id,
            milestone=milestone,
            channel=channel,
            direction="OUTBOUND",
            message_text=msg_text,
            status="DELIVERED",
            sent_at=now
        )
        db.add(msg)
        count_sent += 1
        
    audit = AuditLog(
        user_id=current_user.get("sub", "SYSTEM"),
        user_name=current_user.get("name", "System Follow-Up Bot"),
        user_role="System",
        action="BATCH_FOLLOWUP_DISPATCHED",
        resource_type="FollowUpMessage",
        resource_id=milestone,
        details=f"Dispatched {count_sent} automated {channel} follow-up surveys for milestone {milestone}"
    )
    db.add(audit)
    db.commit()
    
    return {
        "status": "DISPATCHED",
        "milestone": milestone,
        "channel": channel,
        "dispatched_count": count_sent,
        "sample_message": f"Namaste [Name]! This is SkillTrack... Are you currently employed? Reply Y / N."
    }

@router.post("/simulate-response")
def simulate_trainee_response(req: FollowUpSimulateRequest, db: Session = Depends(get_db)):
    """
    Simulates a trainee replying to a WhatsApp or SMS bot survey.
    Parses response, updates longitudinal OutcomeLog, flags for remedial action if needed,
    and recalculates AI attrition risk.
    """
    trainee = db.query(Trainee).filter(Trainee.id == req.trainee_id).first()
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found")
        
    now = datetime.utcnow()
    month_num = 12 if "12" in req.milestone else 6 if "6" in req.milestone else 3
    
    # 1. Parse text or structured flags
    raw_text = req.raw_reply_text or (
        f"Y, working at {req.employer_name or trainee.current_employer or 'Local Firm'} with monthly salary INR {int(req.current_wage or 15000)}"
        if req.is_employed else
        f"N, not working currently. Reason: {req.attrition_reason or 'Looking for opportunities'}"
    )
    
    is_emp = req.is_employed
    salary = req.current_wage if is_emp else 0.0
    attrition = req.attrition_reason if not is_emp else None
    
    if req.raw_reply_text:
        upper = req.raw_reply_text.strip().upper()
        if upper.startswith("Y"):
            is_emp = True
            # Extract numbers for salary
            nums = re.findall(r"\d+", req.raw_reply_text)
            if nums:
                salary = float(nums[0]) if len(nums[0]) >= 4 else 15000.0
        elif upper.startswith("N"):
            is_emp = False
            salary = 0.0
            attrition = req.raw_reply_text.replace("N,", "").replace("N -", "").replace("N", "").strip() or "Low salary / Inadequate compensation"

    # 2. Check for remedial triggers (wage drop or job loss)
    wage_dropped = (trainee.current_wage > 0 and salary < trainee.current_wage * 0.85)
    remedial_needed = (not is_emp) or wage_dropped
    
    # 3. Update Trainee record
    prev_wage = trainee.current_wage
    trainee.current_status = "Placed" if is_emp else "Unemployed"
    trainee.current_wage = salary
    if is_emp and req.employer_name:
        trainee.current_employer = req.employer_name
    if not is_emp:
        trainee.attrition_reason = attrition or "Unspecified"
        trainee.is_retained = False
    else:
        trainee.attrition_reason = None
        trainee.is_retained = True
        
    if remedial_needed:
        trainee.remedial_action_flag = True
        if not is_emp:
            trainee.remedial_notes = f"Bot Alert ({req.milestone}): Trainee reported unemployment ({attrition}). Recommend immediate placement re-attempt."
        else:
            trainee.remedial_notes = f"Bot Alert ({req.milestone}): Wage reduction detected from ₹{int(prev_wage)} to ₹{int(salary)}. Upskilling consultation recommended."
            
    # 4. Re-calculate AI Risk
    ai_risk = calculate_attrition_risk(
        course=trainee.course,
        district=trainee.district,
        baseline_wage=trainee.baseline_wage,
        current_wage=salary,
        current_status=trainee.current_status,
        age=trainee.age,
        gender=trainee.gender
    )
    trainee.ai_attrition_risk = ai_risk["risk_score"]
    trainee.ai_risk_category = ai_risk["risk_category"]
    
    # 5. Record Outcome Log
    out_log = OutcomeLog(
        trainee_id=trainee.id,
        milestone=req.milestone,
        milestone_month=month_num,
        status=trainee.current_status,
        monthly_wage=salary,
        employer_name=trainee.current_employer if is_emp else None,
        job_role=trainee.current_job_role if is_emp else None,
        location=trainee.district,
        verification_status="Self-Reported (WhatsApp Bot)",
        data_source=f"{req.channel} Interactive Bot",
        logged_at=now,
        notes=f"Automated follow-up outcome verified via {req.channel}."
    )
    db.add(out_log)
    
    # 6. Save Chat Message
    inbound_msg = FollowUpMessage(
        trainee_id=trainee.id,
        milestone=req.milestone,
        channel=req.channel,
        direction="INBOUND",
        message_text=raw_text,
        status="DELIVERED",
        response_value="Y" if is_emp else "N",
        sent_at=now
    )
    db.add(inbound_msg)
    
    # 7. Bot automated acknowledgment reply
    ack_text = (
        f"Thank you {trainee.name}! Your {req.milestone} outcome has been logged securely in SkillTrack. Keep growing!"
        if is_emp else
        f"Thank you {trainee.name}. We have noted your status. A career counselor from {trainee.training_provider} will contact you for bridge opportunities."
    )
    bot_ack = FollowUpMessage(
        trainee_id=trainee.id,
        milestone=req.milestone,
        channel=req.channel,
        direction="OUTBOUND",
        message_text=ack_text,
        status="DELIVERED",
        sent_at=now
    )
    db.add(bot_ack)
    
    db.commit()
    db.refresh(trainee)
    
    return {
        "status": "SUCCESS",
        "trainee_id": trainee.id,
        "is_employed": is_emp,
        "updated_wage": salary,
        "remedial_flag": trainee.remedial_action_flag,
        "remedial_notes": trainee.remedial_notes,
        "ai_risk": ai_risk,
        "bot_acknowledgment": ack_text
    }

@router.get("/remedial-queue")
def get_remedial_queue(db: Session = Depends(get_db)):
    """List of all trainees flagged for remedial action."""
    flagged = db.query(Trainee).filter(Trainee.remedial_action_flag == True).order_by(Trainee.ai_attrition_risk.desc()).all()
    
    return [
        {
            "id": t.id,
            "name": t.name,
            "course": t.course,
            "provider": t.training_provider,
            "district": t.district,
            "current_status": t.current_status,
            "current_wage": t.current_wage,
            "attrition_reason": t.attrition_reason,
            "remedial_notes": t.remedial_notes,
            "ai_risk_score": t.ai_attrition_risk,
            "ai_risk_category": t.ai_risk_category,
            "masked_mobile": t.masked_mobile
        } for t in flagged
    ]
