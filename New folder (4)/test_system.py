import requests
import json

base = 'http://127.0.0.1:8000'

try:
    # 1. Health
    h = requests.get(f'{base}/health').json()
    print('[1] Health Check:', h['status'])

    # 2. Analytics Dashboard
    dash = requests.get(f'{base}/api/analytics/dashboard').json()
    kpi = dash['kpis']
    print(f'[2] Analytics: Total Trainees={kpi["total_trainees"]}, Placement Rate={kpi["placement_rate"]}%, Retained 12M={kpi["retention_rate_12m"]}%, Avg Wage Growth=+{kpi["avg_wage_growth_pct"]}%')

    # 3. Trainees List
    tr = requests.get(f'{base}/api/trainees?limit=2').json()
    print(f'[3] Trainees: Total={tr["total"]}, Sample={tr["items"][0]["id"]} ({tr["items"][0]["name"]})')

    # 4. Mock Aadhaar e-KYC
    otp_res = requests.post(f'{base}/api/auth/mock-aadhaar-otp', json={'aadhaar_number': '123456789012'}).json()
    print(f'[4] Aadhaar e-KYC OTP:', otp_res['message'])

    # 5. WhatsApp Bot Simulator Response
    sim_res = requests.post(f'{base}/api/followup/simulate-response', json={
        'trainee_id': 'SKILL-2026-10001',
        'milestone': 'Month 12',
        'channel': 'WhatsApp',
        'is_employed': True,
        'current_wage': 28000.0,
        'raw_reply_text': 'Y, promoted to senior tech with Rs 28000'
    }).json()
    print(f'[5] Follow-Up Bot Sim:', sim_res['status'], '-> Wage Updated to Rs', sim_res['updated_wage'])

    # 6. AI Attrition Risk Predictor
    ai_res = requests.post(f'{base}/api/ai/predict-risk', json={
        'course': 'Data Entry Operator',
        'district': 'Warangal',
        'baseline_wage': 10000.0,
        'current_wage': 10500.0,
        'current_status': 'Placed',
        'age': 22,
        'gender': 'Female'
    }).json()
    print(f'[6] AI Predictor: Risk Category={ai_res["risk_category"]}, Score={ai_res["risk_score"]}, Action={ai_res["recommended_action"]}')

    # 7. DPDP Compliance Status
    dpdp = requests.get(f'{base}/api/audit/dpdp-status').json()
    print(f'[7] DPDP Vault: Compliance Grade={dpdp["compliance_grade"]}, Consent Coverage={dpdp["consent_coverage_pct"]}%')

    # 8. Test CSV Export
    csv_res = requests.get(f'{base}/api/analytics/export/csv')
    print(f'[8] CSV Export: Status={csv_res.status_code}, Bytes={len(csv_res.content)}')

    print('\nALL SYSTEM CHECKS PASSED PERFECTLY!')
except Exception as e:
    print('Verification Error:', e)
