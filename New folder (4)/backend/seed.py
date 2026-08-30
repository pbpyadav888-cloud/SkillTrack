import random
from datetime import datetime, timedelta
from backend.database import SessionLocal, engine, Base
from backend.models import User, Trainee, OutcomeLog, ConsentRecord, Employer, SelfEmploymentRecord, FollowUpMessage, AuditLog
from backend.security import hash_password, encrypt_field, mask_aadhaar, mask_mobile, generate_consent_hash
from backend.ai_model import calculate_attrition_risk

COURSES = [
    "Electrician",
    "Welder",
    "Data Entry Operator",
    "Retail Associate",
    "Healthcare Assistant"
]

PROVIDERS = [
    "Apex Skills Academy",
    "SkillCraft National Institute",
    "TechVikas Foundation",
    "Andhra MedSkills Training Hub",
    "Bharat Industrial Institute"
]

DISTRICTS = [
    "Hyderabad",
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Warangal"
]

FIRST_NAMES = [
    "Aarav", "Priya", "Rahul", "Sai", "Ananya", "Rohan", "Sneha", "Karthik", "Pooja", "Vikram",
    "Deepika", "Naveen", "Divya", "Suresh", "Lakshmi", "Manoj", "Bhavya", "Harish", "Kavya", "Venkatesh",
    "Meera", "Ajay", "Swathi", "Ramesh", "Sandhya", "Prasad", "Lavanya", "Tarun", "Sireesha", "Ravi",
    "Geeta", "Sunil", "Manasa", "Santosh", "Swetha", "Nikhil", "Radhika", "Gopal", "Tejaswini", "Rajesh",
    "Harika", "Vamsi", "Keerthi", "Dinesh", "Sravani", "Naresh", "Pavani", "Mahesh", "Padma", "Ganesh"
]

LAST_NAMES = [
    "Reddy", "Sharma", "Rao", "Yadav", "Patel", "Verma", "Kumar", "Chowdary", "Naidu", "Varma",
    "Goud", "Gupta", "Singh", "Joshi", "Babu", "Murthy", "Raju", "Mishra", "Nair", "Iyer"
]

EMPLOYERS_DATA = [
    {
        "company_name": "TechVolt Electricals & Power Ltd",
        "gstin": "36AABCT1234F1Z8",
        "udyam_no": "UDYAM-TS-02-0012345",
        "sector": "Electrical & Energy",
        "contact_person": "Venkatesh Rao",
        "contact_email": "careers@techvolt.in",
        "contact_mobile": "9848011223",
        "district": "Hyderabad",
        "verification_status": "Verified",
    },
    {
        "company_name": "Apollo MedTech & Diagnostics",
        "gstin": "37AAPCM5678G2Z1",
        "udyam_no": "UDYAM-AP-03-0098765",
        "sector": "Healthcare Services",
        "contact_person": "Dr. Sunitha Reddy",
        "contact_email": "hr@apollomedtech.org",
        "contact_mobile": "9849022334",
        "district": "Visakhapatnam",
        "verification_status": "Verified",
    },
    {
        "company_name": "MegaRetail Supermarkets India Pvt Ltd",
        "gstin": "36AACCR9012H1Z5",
        "udyam_no": "UDYAM-TS-05-0045678",
        "sector": "Retail & Logistics",
        "contact_person": "Kiran Kumar",
        "contact_email": "talent@megaretail.co.in",
        "contact_mobile": "9848533445",
        "district": "Vijayawada",
        "verification_status": "Verified",
    },
    {
        "company_name": "Vizag Heavy Fabrication Works",
        "gstin": "37AAECV3456J2Z9",
        "udyam_no": "UDYAM-AP-01-0023456",
        "sector": "Welding & Heavy Engineering",
        "contact_person": "Prakash Varma",
        "contact_email": "ops@vizagfabricators.com",
        "contact_mobile": "9849544556",
        "district": "Visakhapatnam",
        "verification_status": "Verified",
    },
    {
        "company_name": "CyberData Global BPO Solutions",
        "gstin": "36AACCB7890K1Z3",
        "udyam_no": "UDYAM-TS-01-0089123",
        "sector": "IT & Business Services",
        "contact_person": "Anand Mishra",
        "contact_email": "hr@cyberdatabpo.com",
        "contact_mobile": "9848055667",
        "district": "Hyderabad",
        "verification_status": "Verified",
    }
]

ATTRITION_REASONS = [
    "Low salary / Inadequate compensation",
    "Poor job fit / Dissatisfied with shift hours",
    "Health and personal family obligations",
    "Relocation constraint / Commute distance",
    "Skills mismatch on floor equipment",
    "No local job opportunities in district",
    "Pursuing Higher Education / Competitive Exams"
]

SELF_EMPLOYMENT_NAMES = [
    "Sri Lakshmi Electrical Works & Repairs",
    "Sai Ram Welding & Metal Fabricators",
    "Vikas Digital Services & Internet Cafe",
    "Ananya Healthcare & Home Nursing Care",
    "Balaji Retail Store & Kirana Mart",
    "Siva Sakthi Appliance Repair Center",
    "Surya Precision Welding & Fabrication",
    "Naveen DTP & Common Service Center"
]


def seed_database():
    print("Initializing Database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. Seed Users (Demo Roles)
    print("Creating Demo Users...")
    users = [
        User(
            id="USR-ADMIN-01",
            username="admin",
            password_hash=hash_password("admin123"),
            role="Admin",
            full_name="Dr. Rajeshwari Sharma",
            organization="MSDE / NITI Aayog Mission Directorate"
        ),
        User(
            id="USR-PROV-01",
            username="provider",
            password_hash=hash_password("provider123"),
            role="Training Provider",
            full_name="K. Ramanathan",
            organization="Apex Skills Academy"
        ),
        User(
            id="USR-EMP-01",
            username="employer",
            password_hash=hash_password("employer123"),
            role="Employer",
            full_name="Venkatesh Rao",
            organization="TechVolt Electricals & Power Ltd"
        )
    ]
    db.add_all(users)
    
    # 2. Seed Employers
    print("Seeding Registered Employers...")
    employer_objs = []
    for emp in EMPLOYERS_DATA:
        e = Employer(**emp)
        db.add(e)
        employer_objs.append(e)
    db.commit()

    # 3. Seed 100 Synthetic Trainees
    print("Generating 100 Synthetic Trainees (60% Placed, 20% Self-Employed, 20% Unemployed)...")
    
    # Pre-plan exact distribution
    statuses = ["Placed"] * 60 + ["Self-Employed"] * 20 + ["Unemployed"] * 20
    random.seed(42)  # Deterministic seed for reproducible evaluation
    random.shuffle(statuses)
    
    trainees = []
    start_date = datetime(2025, 1, 15)
    
    for i in range(100):
        t_id = f"SKILL-2026-{10001 + i}"
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        full_name = f"{first} {last}"
        
        # Raw Aadhaar & Mobile for masking/encryption
        raw_aadhaar = f"{random.randint(2000, 9999)}{random.randint(1000, 9999)}{random.randint(1000, 9999)}"
        raw_mobile = f"98{random.randint(10000000, 99999999)}"
        
        masked_adh = mask_aadhaar(raw_aadhaar)
        enc_adh = encrypt_field(raw_aadhaar)
        masked_mob = mask_mobile(raw_mobile)
        enc_mob = encrypt_field(raw_mobile)
        
        course = COURSES[i % len(COURSES)]
        provider = PROVIDERS[i % len(PROVIDERS)]
        district = DISTRICTS[i % len(DISTRICTS)]
        gender = "Female" if (i % 3 == 0) else "Male"
        age = random.randint(19, 29)
        socio = random.choice(["OBC", "SC", "ST", "General", "EWS"])
        cohort = "Batch 2025-Q1" if i < 50 else "Batch 2025-Q2"
        
        target_status = statuses[i]
        
        # Determine baseline and longitudinal wage progressions
        if target_status == "Placed":
            base_wage = float(random.choice([10000, 11000, 12000, 13000, 14000]))
            w0 = base_wage
            w3 = w0 + random.choice([1000, 1500, 2000, 2500])
            w6 = w3 + random.choice([1500, 2000, 3000, 4000])
            w12 = w6 + random.choice([2000, 3500, 5000, 7000])
            cur_wage = w12
            cur_emp = random.choice(EMPLOYERS_DATA)["company_name"]
            cur_role = f"Junior {course.replace('Healthcare Assistant', 'Nurse Associate').replace('Data Entry Operator', 'Associate')}"
            is_ret = True
            att_reason = None
            remedial_flag = False
            remedial_notes = None
        elif target_status == "Self-Employed":
            base_wage = float(random.choice([9000, 10000, 11000]))
            w0 = base_wage
            w3 = w0 + random.choice([2000, 3000, 4000])
            w6 = w3 + random.choice([3000, 5000, 7000])
            w12 = w6 + random.choice([4000, 6000, 10000])
            cur_wage = w12
            cur_emp = f"Self-Employed ({full_name}'s Enterprise)"
            cur_role = f"Independent {course} Practitioner / Owner"
            is_ret = True
            att_reason = None
            remedial_flag = False
            remedial_notes = None
        else:  # Unemployed / Attrition
            base_wage = float(random.choice([9000, 10000, 11000]))
            w0 = base_wage
            w3 = base_wage if i % 2 == 0 else 0.0
            w6 = 0.0
            w12 = 0.0
            cur_wage = 0.0
            cur_emp = None
            cur_role = None
            is_ret = False
            att_reason = random.choice(ATTRITION_REASONS)
            remedial_flag = True
            remedial_notes = f"Flagged for remedial intervention: Attrited due to '{att_reason}'. Recommend District Job Fair & Bridge Skilling."

        # Compute AI Risk
        ai_res = calculate_attrition_risk(
            course=course,
            district=district,
            baseline_wage=base_wage,
            current_wage=cur_wage,
            current_status=target_status,
            age=age,
            gender=gender
        )
        
        trainee = Trainee(
            id=t_id,
            name=full_name,
            masked_aadhaar=masked_adh,
            encrypted_aadhaar=enc_adh,
            masked_mobile=masked_mob,
            encrypted_mobile=enc_mob,
            course=course,
            training_provider=provider,
            district=district,
            gender=gender,
            age=age,
            socio_economic_category=socio,
            cohort_batch=cohort,
            completion_date="2025-03-31",
            baseline_wage=base_wage,
            current_status=target_status,
            current_wage=cur_wage,
            current_employer=cur_emp,
            current_job_role=cur_role,
            is_retained=is_ret,
            attrition_reason=att_reason,
            remedial_action_flag=remedial_flag,
            remedial_notes=remedial_notes,
            ai_attrition_risk=ai_res["risk_score"],
            ai_risk_category=ai_res["risk_category"],
            created_at=start_date + timedelta(days=i)
        )
        db.add(trainee)
        
        # 4. Add DPDP Consent Record
        consent_text = "I explicitly consent to my Aadhaar-linked training records being tracked longitudinally for 12 months post-certification for employment validation and impact measurement under the Digital Personal Data Protection Act, 2023."
        c_hash = generate_consent_hash(t_id, consent_text, "2025-01-15T09:00:00Z")
        consent_rec = ConsentRecord(
            trainee_id=t_id,
            consent_type="12-Month Longitudinal Employment & Wage Tracking",
            consent_text=consent_text,
            dpdp_purpose="DPDP Act 2023 Section 6 - Vocational Training Outcome Audit and Remedial Skilling",
            is_given=True,
            status="ACTIVE",
            timestamp=start_date + timedelta(days=i),
            ip_address=f"103.117.20.{random.randint(10, 250)}",
            verification_hash=c_hash
        )
        db.add(consent_rec)
        
        # 5. Add Longitudinal Outcome Milestones (Month 0, 3, 6, 12)
        milestones = [
            ("Month 0", 0, base_wage if target_status != "Unemployed" else 0.0, target_status if target_status != "Unemployed" else "Unemployed"),
            ("Month 3", 3, w3, "Placed" if w3 > 0 else target_status),
            ("Month 6", 6, w6, "Placed" if w6 > 0 else target_status),
            ("Month 12", 12, w12, target_status)
        ]
        
        for m_name, m_month, m_wage, m_status in milestones:
            out_log = OutcomeLog(
                trainee_id=t_id,
                milestone=m_name,
                milestone_month=m_month,
                status=m_status,
                monthly_wage=float(m_wage),
                employer_name=cur_emp if m_wage > 0 else None,
                job_role=cur_role if m_wage > 0 else None,
                location=district,
                verification_status="Verified" if m_wage > 0 else "Self-Reported",
                data_source="WhatsApp Bot" if m_month > 0 else "Provider Onboarding",
                logged_at=start_date + timedelta(days=i + (m_month * 30)),
                notes=f"Outcome recorded at {m_name} follow-up cycle."
            )
            db.add(out_log)

        # 6. Add Self-Employment Proof if Self-Employed
        if target_status == "Self-Employed":
            biz_name = random.choice(SELF_EMPLOYMENT_NAMES)
            se_rec = SelfEmploymentRecord(
                trainee_id=t_id,
                enterprise_name=biz_name,
                enterprise_type="Sole Proprietorship",
                udyam_no=f"UDYAM-AP-{random.randint(10, 99)}-00{random.randint(10000, 99999)}",
                gst_no=f"37AAAPS{random.randint(1000, 9999)}K1Z{random.randint(1, 9)}",
                monthly_revenue=float(cur_wage * 1.3),
                monthly_profit=float(cur_wage),
                proof_document_name=f"Udyam_Reg_{t_id}.pdf",
                verification_status="Verified",
                registered_district=district,
                created_at=start_date + timedelta(days=i + 90)
            )
            db.add(se_rec)

        # 7. Add Follow-Up Bot History
        bot_msg_out = FollowUpMessage(
            trainee_id=t_id,
            milestone="Month 12",
            channel="WhatsApp",
            direction="OUTBOUND",
            message_text=f"Hi {first}, this is SkillTrack (Govt. of India). Are you currently employed in {course}? Reply Y for Yes, N for No.",
            status="REPLIED",
            sent_at=start_date + timedelta(days=i + 360)
        )
        db.add(bot_msg_out)
        
        reply_txt = f"Y, working at {cur_emp or 'Self'} with ₹{int(cur_wage)}/mo" if target_status in ["Placed", "Self-Employed"] else f"N, not working due to {att_reason}"
        bot_msg_in = FollowUpMessage(
            trainee_id=t_id,
            milestone="Month 12",
            channel="WhatsApp",
            direction="INBOUND",
            message_text=reply_txt,
            status="DELIVERED",
            response_value="Y" if target_status != "Unemployed" else "N",
            sent_at=start_date + timedelta(days=i + 360, minutes=15)
        )
        db.add(bot_msg_in)
        
    # 8. Seed Initial Audit Logs
    print("Seeding DPDP Compliance Audit Trail...")
    audit_samples = [
        AuditLog(
            user_id="USR-ADMIN-01",
            user_name="Dr. Rajeshwari Sharma",
            user_role="Admin",
            action="SYSTEM_INITIALIZATION",
            resource_type="Database",
            resource_id="ALL",
            details="SkillTrack Longitudinal Outcome System initialized with 100 cohort records.",
            ip_address="10.0.4.1"
        ),
        AuditLog(
            user_id="USR-ADMIN-01",
            user_name="Dr. Rajeshwari Sharma",
            user_role="Admin",
            action="DPDP_AUDIT_CHECK",
            resource_type="ConsentRecord",
            resource_id="100-BATCH",
            details="Verified DPDP Section 6 compliance and SHA-256 cryptographic signatures for 100 trainees.",
            ip_address="10.0.4.1"
        )
    ]
    db.add_all(audit_samples)
    
    db.commit()
    db.close()
    print("Database seeding completed successfully! 100 trainees generated.")

if __name__ == "__main__":
    seed_database()
