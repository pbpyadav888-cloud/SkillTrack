import uvicorn
from backend.config import PORT
from backend.main import app

if __name__ == "__main__":
    print("=" * 65)
    print("  SkillTrack - Longitudinal Skilling Outcomes & Impact Measurement")
    print("  DPDP Act 2023 Compliant • MSDE / NSDC / NITI Aayog")
    print("=" * 65)
    print(f"  > Web App Dashboard: http://localhost:{PORT}")
    print(f"  > API Documentation: http://localhost:{PORT}/docs")
    print(f"  > ReDoc Guide:       http://localhost:{PORT}/redoc")
    print("=" * 65)
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")
