import hashlib
import hmac
import base64
import json
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from cryptography.fernet import Fernet
import jwt
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from backend.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, ENCRYPTION_KEY

# Ensure a deterministic 32-byte urlsafe base64 key for Fernet AES-128-CBC / Fernet authenticated cipher
try:
    cipher = Fernet(ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY)
except Exception:
    # Fallback deterministic key derivation if custom key is not base64 32 bytes
    derived = base64.urlsafe_b64encode(hashlib.sha256(SECRET_KEY.encode()).digest())
    cipher = Fernet(derived)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def encrypt_field(plaintext: str) -> str:
    """Encrypt sensitive PII using AES (Fernet authenticated envelope) for DPDP compliance."""
    if not plaintext:
        return ""
    return cipher.encrypt(plaintext.encode("utf-8")).decode("utf-8")


def decrypt_field(ciphertext: str) -> str:
    """Decrypt sensitive PII."""
    if not ciphertext:
        return ""
    try:
        return cipher.decrypt(ciphertext.encode("utf-8")).decode("utf-8")
    except Exception:
        return ciphertext  # Return as-is if already unencrypted


def mask_aadhaar(aadhaar_raw: str) -> str:
    """Returns masked Aadhaar format: XXXX-XXXX-1234"""
    clean = "".join(ch for ch in str(aadhaar_raw) if ch.isdigit())
    if len(clean) >= 4:
        last4 = clean[-4:]
        return f"XXXX-XXXX-{last4}"
    return "XXXX-XXXX-0000"


def mask_mobile(mobile_raw: str) -> str:
    """Returns masked mobile format: +91 XXXXX 98765"""
    clean = "".join(ch for ch in str(mobile_raw) if ch.isdigit())
    if len(clean) >= 5:
        last5 = clean[-5:]
        return f"+91 XXXXX {last5}"
    return "+91 XXXXX XXXXX"


def hash_password(password: str) -> str:
    """Hash password using PBKDF2 with SHA-256."""
    salt = "skilltrack_dpdp_salt_2026"
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return pwd_hash.hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hmac.compare_digest(hash_password(plain_password), hashed_password)


def generate_consent_hash(trainee_id: str, consent_text: str, timestamp_iso: str) -> str:
    """Generate cryptographic SHA-256 seal for DPDP consent artifact."""
    payload = f"{trainee_id}|{consent_text}|{timestamp_iso}|{SECRET_KEY}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None


def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Dependency to extract authenticated user from Bearer token."""
    if not token:
        # Default mock admin for development/demo ease if token not passed
        return {
            "id": "USR-ADMIN-01",
            "username": "admin",
            "role": "Admin",
            "name": "NITI / MSDE Central Administrator",
            "organization": "MSDE National Directorate"
        }
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload
