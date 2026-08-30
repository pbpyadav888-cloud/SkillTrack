# SkillTrack - Longitudinal Skilling Outcomes & Impact Measurement System

[![DPDP Act 2023](https://img.shields.io/badge/DPDP%20Act%202023-Section%206%20Compliant-emerald.svg)](https://www.meity.gov.in/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110-blue.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TailwindCSS-indigo.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-ready prototype for a **Consent-Based Longitudinal Trainee Outcome Tracking and Impact Measurement Platform**, aligned with the **Ministry of Skill Development & Entrepreneurship (MSDE)**, **National Skill Development Corporation (NSDC)**, **NITI Aayog**, and the **Digital Personal Data Protection (DPDP) Act, 2023**.

---

## 🎯 Key Capabilities & Features

1. **Trainee Onboarding & DPDP Consent Vault**:
   - Aadhaar (masked `XXXX-XXXX-1234`) and mobile number enrollment with **AES-256 field encryption** at rest.
   - UIDAI e-KYC sandbox simulation with automated OTP generation and verification.
   - DPDP Act Section 6 explicit consent capture with **immutable SHA-256 cryptographic timestamps** and digital audit receipts.
   - Automatic unique ID generation (`SKILL-2026-XXXXX`).

2. **Longitudinal Outcome Tracking Dashboard**:
   - Pre-seeded with **100 realistic synthetic trainees** across Andhra Pradesh & Telangana districts (*Hyderabad, Visakhapatnam, Vijayawada, Guntur, Warangal*).
   - Exact outcome distribution: **60% Placed, 20% Self-Employed, 20% Unemployed / Attrited**.
   - Dynamic interactive charts powered by Chart.js / Recharts:
     - Placement Rate by Course vs NSDC Benchmark (70% Target).
     - Longitudinal Wage Progression over Month 0, 3, 6, 12.
     - Employment Status Distribution Donut Chart.
     - District Performance & Regional Heatmap.
   - Multi-dimensional filters (Course, Training Provider, District, Gender, Retention Status, Remedial Queue).

3. **Automated WhatsApp / SMS Follow-up Bot & Simulator**:
   - Interactive smartphone simulator for conversational check-ins at 3, 6, and 12-month post-certification milestones.
   - Automatic NLP parsing of salary updates, employer confirmations, or dropout reasons.
   - Real-time database update with instant **Remedial Action Flagging** when a trainee reports wage reduction or job loss.
   - Batch broadcast dispatch trigger simulation for active cohort cycles.

4. **Employer & Self-Employment Validation Module**:
   - Employer portal with live **GSTIN & Udyam Registration Sandbox Verifier**.
   - Placement proof verification workflow for appointment letters, designations, and audited wage rates.
   - Self-employment micro-enterprise directory tracking monthly revenue and Udyam certification.

5. **AI Attrition Prediction & NLP Feedback Insights**:
   - Real-time Scikit-Learn trained ML model scoring attrition probability (Low, Medium, High).
   - Prescriptive recommendations engine for mentor check-ins, skill bridge courses, and district job matching.
   - NLP sentiment and root-cause classifier on open-ended trainee exit comments.
   - **MSDE / NSDC Skill-Gap Matrix** linking attrition drivers directly to strategic curriculum fixes.

6. **Reporting & DPDP Compliance Vault**:
   - One-click **CSV Dataset Export** of complete longitudinal outcome logs.
   - Printable & downloadable **Cohort Outcome Summary PDF Report**.
   - Immutable security and access audit log tracking all data views, modifications, exports, and DPDP Section 6(4) consent revocations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Lucide Icons, Chart.js, JetBrains Mono |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy ORM, Uvicorn |
| **Database** | SQLite (Zero-Config, Embedded) / PostgreSQL Ready |
| **Security & Privacy** | AES-256 (Fernet Cipher Envelope), SHA-256 Hashing, JWT Bearer RBAC |
| **AI / ML** | Scikit-Learn (Logistic Regression & Heuristics), Regular Expression NLP |
| **Export & Reporting** | CSV Streaming, HTML5 Print Engine, ReportLab |

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Python 3.10, 3.11, or 3.12+ installed.

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-org/skilltrack.git
cd skilltrack

# Create and activate virtual environment
python -m venv .venv

# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1

# On Linux / macOS:
source .venv/bin/activate

# Install all required dependencies
pip install -r requirements.txt
```

### 3. Seed 100 Synthetic Trainees
```bash
python -m backend.seed
```

### 4. Run the Application
```bash
python run.py
```
Open your browser and navigate to:
- 🌐 **Web Dashboard**: `http://localhost:8000`
- 📚 **Swagger OpenAPI Docs**: `http://localhost:8000/docs`
- 📖 **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 🔑 Demo Credentials

| Role | Username | Password | Organization |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | MSDE / NITI Aayog Mission Directorate |
| **Training Provider** | `provider` | `provider123` | Apex Skills Academy |
| **Employer** | `employer` | `employer123` | TechVolt Electricals & Power Ltd |
| **Trainee Portal** | Direct OTP / Role Toggle in Header | - | Registered Cohort Graduate |

*(You can also use the Role Switcher at the top right of the dashboard to instantly toggle views).*

---

## 🐳 Docker Deployment

To build and run as a self-contained container:
```bash
# Build Docker image
docker build -t skilltrack:latest .

# Run container on port 8000
docker run -d -p 8000:8000 --name skilltrack-app skilltrack:latest
```

---

## 📊 Evaluation & Government Standards Alignment

- **MSDE Sankalp / Pradhan Mantri Kaushal Vikas Yojana (PMKVY)**: Meets 12-month post-training wage tracking and third-party outcome audit requirements.
- **NITI Aayog Aspirational Districts Program**: District-wise performance intensity heatmaps across backward and industrial districts.
- **Digital Personal Data Protection (DPDP) Act 2023**: Section 6 Notice & Purpose specification, field-level encryption, tamper-proof SHA-256 audit logs, and Section 6(4) right to withdraw consent.

---

## 📄 License
Released under the MIT License. Developed for the Government of India Skill Development & Outcome Measurement Mission.
