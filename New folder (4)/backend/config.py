import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'skilltrack.db'}")

# Security & DPDP Compliance
SECRET_KEY = os.getenv("SECRET_KEY", "skilltrack-dpdp-aes256-super-secure-key-2026-sankalp")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# AES-256 Key for field-level encryption (32 bytes urlsafe base64)
# In production this is loaded from AWS KMS / Azure Key Vault / HSM
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "t-hU3k2lKx5a1L-oM0_8mXz-2w9n1j8b6k8v2q9m1wA=")

# System Defaults
SYSTEM_NAME = "SkillTrack - Longitudinal Skilling Outcomes & Impact Measurement System"
GOVT_AGENCY = "Ministry of Skill Development & Entrepreneurship (MSDE) / NSDC"
PORT = int(os.getenv("PORT", 8000))
