"""
NyayMitra - FastAPI Main Application
Serves REST APIs for AI Legal Consultation, Drafting, Document Analysis,
Statute Search, and Citizen Rights, as well as serving the modern frontend SPA.
"""

import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure backend directory is in sys.path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from config import settings, update_api_key, get_masked_api_key, FRONTEND_DIR
from legal_knowledge import STATUTES_DATABASE, EMERGENCY_HELPLINES, CITIZEN_RIGHTS_GUIDES, DRAFT_TEMPLATES
from gemini_service import consult_legal_advisor, generate_legal_draft, analyze_legal_document, analyze_image_document, search_statutes_locally
from document_parser import extract_text_from_bytes
from nyayasetu_engine import analyze_civic_problem, generate_action_pack, generate_first_appeal_draft, WELFARE_SCHEMES_DATABASE, PUBLIC_AUTHORITIES_DATABASE

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION
)

# CORS middleware for local development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request / Response Schemas
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    language: Optional[str] = "English"

class DraftRequest(BaseModel):
    template_id: str
    form_data: Dict[str, Any]

class AnalyzeTextRequest(BaseModel):
    text: str
    document_name: Optional[str] = "Pasted Legal Text"

class ConfigUpdateRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    gemini_model: Optional[str] = None

# NyayaSetu Schemas
class CivicProblemRequest(BaseModel):
    problem_text: str

class ActionPackRequest(BaseModel):
    problem_text: str
    answers: Dict[str, Any]
    authority: Optional[Dict[str, Any]] = None

class FirstAppealRequest(BaseModel):
    applicant_name: str
    applicant_address: str
    authority_name: str
    appellate_authority: Optional[str] = "First Appellate Authority"
    original_application_date: str
    rti_ref_no: str
    reason_for_appeal: Optional[str] = None

class SchemeCheckRequest(BaseModel):
    occupation: Optional[str] = "Any"
    category: Optional[str] = "General"
    annual_income: Optional[int] = 200000
    age: Optional[int] = 30
    gender: Optional[str] = "All"
    has_pucca_house: Optional[bool] = False


# API Routes
@app.get("/api/health")
async def health_check():
    has_api_key = bool(settings.GEMINI_API_KEY)
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "gemini_configured": has_api_key,
        "default_model": settings.DEFAULT_MODEL,
        "statutes_indexed": len(STATUTES_DATABASE),
        "templates_available": len(DRAFT_TEMPLATES)
    }


@app.get("/api/templates")
async def get_templates():
    return {
        "templates": [
            {
                "id": k,
                "title": v["title"],
                "act": v["act"],
                "description": v["description"],
                "fields": v["fields"]
            }
            for k, v in DRAFT_TEMPLATES.items()
        ]
    }

@app.post("/api/chat")
async def chat_with_advisor(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")
    result = consult_legal_advisor(
        message=req.message,
        conversation_history=req.history,
        language=req.language
    )
    return result

@app.post("/api/draft")
async def create_draft(req: DraftRequest):
    if req.template_id not in DRAFT_TEMPLATES:
        raise HTTPException(status_code=400, detail=f"Unknown template ID: {req.template_id}")
    result = generate_legal_draft(
        template_id=req.template_id,
        form_data=req.form_data
    )
    return result

@app.post("/api/analyze/text")
async def analyze_text(req: AnalyzeTextRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Document text cannot be empty.")
    result = analyze_legal_document(
        document_text=req.text,
        document_name=req.document_name
    )
    return result

class SendOtpRequest(BaseModel):
    phone_or_email: str
    name: Optional[str] = "Citizen"

class VerifyOtpRequest(BaseModel):
    phone_or_email: str
    otp: str
    name: Optional[str] = "Citizen"

@app.post("/api/auth/send-otp")
async def send_otp(req: SendOtpRequest):
    identifier = req.phone_or_email.strip()
    if not identifier:
        raise HTTPException(status_code=400, detail="Phone or email is required.")
    # Simulated quick OTP (123456 or auto-verified in demo)
    return {
        "success": True,
        "message": f"One-Time Password (OTP) sent to {identifier}. Use demo OTP: 123456",
        "demo_otp": "123456"
    }

@app.post("/api/auth/verify-otp")
async def verify_otp(req: VerifyOtpRequest):
    identifier = req.phone_or_email.strip()
    otp = req.otp.strip()
    if otp not in ["123456", "9999", "0000"] and len(otp) != 6:
        raise HTTPException(status_code=400, detail="Invalid OTP entered. Please use 123456.")
    
    return {
        "success": True,
        "token": f"citizen_token_{int(datetime.now().timestamp())}",
        "user": {
            "name": req.name or "Citizen User",
            "phone_or_email": identifier,
            "role": "Citizen",
            "authenticated": True,
            "dockets_count": 3
        }
    }

@app.post("/api/analyze/upload")
async def analyze_uploaded_file(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB.")
    
    extracted_text, file_type = extract_text_from_bytes(contents, file.filename)
    
    if file_type == "image":
        mime_type = file.content_type or "image/jpeg"
        result = analyze_image_document(
            image_bytes=contents,
            filename=file.filename,
            mime_type=mime_type
        )
        result["extracted_preview"] = "📷 Document photo scanned with Gemini Multimodal Vision."
        return result
        
    if file_type == "error" or file_type == "unsupported" or file_type == "pdf_empty":
        raise HTTPException(status_code=400, detail=extracted_text)
        
    result = analyze_legal_document(
        document_text=extracted_text,
        document_name=file.filename
    )
    result["extracted_preview"] = extracted_text[:500] + ("..." if len(extracted_text) > 500 else "")
    return result

@app.get("/api/statutes")
async def get_statutes(query: Optional[str] = None, category: Optional[str] = None):
    results = search_statutes_locally(query or "")
    if category and category != "All":
        results = [s for s in results if s.get("category") == category]
    
    categories = sorted(list(set(s["category"] for s in STATUTES_DATABASE)))
    return {
        "count": len(results),
        "categories": ["All"] + categories,
        "statutes": results
    }

@app.get("/api/rights")
async def get_citizen_rights():
    return {
        "guides": CITIZEN_RIGHTS_GUIDES,
        "helplines": EMERGENCY_HELPLINES
    }

# ==========================================
# NYAYASETU (न्यायसेतु) CIVIC RIGHTS ENDPOINTS
# ==========================================
@app.post("/api/nyayasetu/analyze-problem")
async def analyze_problem_endpoint(req: CivicProblemRequest):
    if not req.problem_text.strip():
        raise HTTPException(status_code=400, detail="Problem description cannot be empty.")
    result = analyze_civic_problem(req.problem_text)
    return result

@app.post("/api/nyayasetu/generate-action-pack")
async def generate_action_pack_endpoint(req: ActionPackRequest):
    authority = req.authority
    if not authority:
        analysis = analyze_civic_problem(req.problem_text)
        authority = analysis.get("matched_authority", PUBLIC_AUTHORITIES_DATABASE[0])
    
    result = generate_action_pack(
        problem_text=req.problem_text,
        user_answers=req.answers,
        matched_authority=authority
    )
    return result

@app.post("/api/nyayasetu/generate-first-appeal")
async def generate_first_appeal_endpoint(req: FirstAppealRequest):
    case_data = {
        "applicant_name": req.applicant_name,
        "applicant_address": req.applicant_address,
        "authority_name": req.authority_name,
        "appellate_authority": req.appellate_authority,
        "original_application_date": req.original_application_date,
        "rti_ref_no": req.rti_ref_no,
        "reason_for_appeal": req.reason_for_appeal or "Statutory 30-day period elapsed without PIO response (Deemed Refusal under Section 7(2))."
    }
    result = generate_first_appeal_draft(case_data)
    return result

@app.get("/api/nyayasetu/schemes/list")
async def get_schemes_list():
    return {
        "count": len(WELFARE_SCHEMES_DATABASE),
        "schemes": WELFARE_SCHEMES_DATABASE
    }

@app.post("/api/nyayasetu/schemes/check")
async def check_scheme_eligibility(req: SchemeCheckRequest):
    matched_schemes = []
    occ_lower = (req.occupation or "").lower()
    cat_lower = (req.category or "").lower()
    gender_lower = (req.gender or "all").lower()
    income = req.annual_income or 200000
    age = req.age or 30
    has_pucca = req.has_pucca_house or False

    for s in WELFARE_SCHEMES_DATABASE:
        score = 0
        reasons = []
        sid = s["id"]
        
        # 1. Street Vendors
        if ("street vendor" in occ_lower or "hawker" in occ_lower or "thela" in occ_lower or "vendor" in occ_lower):
            if sid == "pm_svanidhi":
                score += 60
                reasons.append("Directly matches Street Vendor / Urban Hawker profile.")
        
        # 2. Farmers
        if "farmer" in occ_lower or "agriculture" in occ_lower or "kisan" in occ_lower:
            if sid == "pm_kisan":
                score += 60
                reasons.append("Directly matches Agricultural Landholder / Farmer family profile.")
        
        # 3. Artisans & Craftsmen
        if "artisan" in occ_lower or "craftsman" in occ_lower or "carpenter" in occ_lower or "mason" in occ_lower or "tailor" in occ_lower or "blacksmith" in occ_lower:
            if sid == "pm_vishwakarma":
                score += 60
                reasons.append("Matches Traditional Artisan / Tradesperson criteria under PM Vishwakarma.")

        # 4. Students & Youth
        if "student" in occ_lower or "youth" in occ_lower or age <= 25:
            if sid == "post_matric_scholarship":
                if ("sc" in cat_lower or "st" in cat_lower or "obc" in cat_lower or "bpl" in cat_lower or income <= 250000):
                    score += 55
                    reasons.append("Student profile with qualifying social category / income bracket (< Rs 2.5L).")
            if sid == "atal_pension" and 18 <= age <= 40:
                score += 35
                reasons.append("Within ideal 18-40 age bracket for guaranteed pension corpus accumulation.")

        # 5. Women & Maternity & Girl Child
        if "woman" in cat_lower or "homemaker" in occ_lower or gender_lower in ["female", "woman"]:
            if sid == "sukanya_samriddhi":
                score += 45
                reasons.append("Family with girl child eligible for high-interest tax-exempt savings.")
            if sid == "pmmvy":
                score += 45
                reasons.append("Eligible for Direct Benefit Transfer (DBT) maternity nutrition assistance.")
            if sid == "janani_suraksha":
                score += 40
                reasons.append("Eligible for safe institutional delivery financial assistance.")
            if sid == "nalsa_free_legal_aid":
                score += 50
                reasons.append("Women are automatically eligible for 100% Free Legal Aid under Sec 12(c) Legal Services Authorities Act.")

        # 6. Senior Citizens & Pension
        if "senior" in occ_lower or age >= 60:
            if sid == "ayushman_bharat":
                score += 60
                reasons.append("Universal health cover under Ayushman Vay Vandana for citizens aged 70+ / senior families.")
            if sid == "nsap_pension" and ("bpl" in cat_lower or income <= 180000):
                score += 55
                reasons.append("Eligible for monthly Old Age / National Social Assistance Pension.")

        # 7. Unorganized Workers & Social Security
        if occ_lower not in ["salaried", "government employee", "corporate"]:
            if sid == "e_shram" and 16 <= age <= 59:
                score += 45
                reasons.append("Unorganized sector occupation matches e-Shram social security.")
            if sid == "pm_suraksha_bima" and 18 <= age <= 70:
                score += 40
                reasons.append("Eligible for Rs 2 Lakh accidental insurance cover at Rs 20/year.")
            if sid == "pm_mudra":
                score += 35
                reasons.append("Eligible for collateral-free Shishu/Kishore micro-enterprise business loans.")

        # 8. Food & Ration Security (BPL / Low Income)
        if "bpl" in cat_lower or "ews" in cat_lower or income <= 200000:
            if sid == "nfsa_ration":
                score += 50
                reasons.append("Household income qualifies for Priority Household (PHH) free food grains.")
            if sid == "ayushman_bharat":
                score += 45
                reasons.append("Qualifies for Rs 5 Lakhs annual cashless family health insurance.")

        # 9. Housing Scheme
        if not has_pucca and income <= 600000:
            if sid == "pmay_urban":
                score += 50
                reasons.append("Absence of pucca house and income within EWS/LIG/MIG subsidy bracket.")

        # 10. Legal Aid & Representation
        if "sc" in cat_lower or "st" in cat_lower or "woman" in cat_lower or income <= 300000:
            if sid == "nalsa_free_legal_aid":
                score += 45
                reasons.append("Qualifies for Free Legal Aid & Assigned Government Advocate under NALSA.")

        # If general fallback criteria met
        if score > 0 or income <= 300000 or occ_lower == "any":
            scheme_item = dict(s)
            scheme_item["match_score"] = min(98, max(45, score + 30))
            scheme_item["match_confidence"] = "Top Match (90%+)" if score >= 50 else ("Eligible Match (75%)" if score >= 30 else "Potential Citizen Benefit")
            scheme_item["eligibility_reason"] = " • ".join(reasons) if reasons else "General citizen welfare benefit and income threshold criteria met."
            matched_schemes.append(scheme_item)

    # Sort matched schemes by match_score descending
    matched_schemes.sort(key=lambda x: x.get("match_score", 50), reverse=True)

    return {
        "count": len(matched_schemes),
        "schemes": matched_schemes if matched_schemes else WELFARE_SCHEMES_DATABASE
    }

# Mount static frontend files
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/")
async def serve_index():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(
            str(index_file),
            headers={"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0"}
        )
    return {"message": "NyayMitra API is running. Frontend static directory initialized."}

# Catch-all for assets if referenced directly
@app.get("/{full_path:path}")
async def serve_frontend_assets(full_path: str):
    target_path = FRONTEND_DIR / full_path
    if target_path.exists() and target_path.is_file():
        return FileResponse(
            str(target_path),
            headers={"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0"}
        )
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(
            str(index_file),
            headers={"Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache", "Expires": "0"}
        )
    raise HTTPException(status_code=404, detail="Resource not found")


if __name__ == "__main__":
    import uvicorn
    print("=" * 65)
    print(f"{settings.PROJECT_NAME} - AI Legal Justice & Document Automation")
    print(f"Starting server on http://{settings.HOST}:{settings.PORT}")
    print(f"Default Model: {settings.DEFAULT_MODEL}")
    print("=" * 65)
    uvicorn.run("app:app", host=settings.HOST, port=settings.PORT, reload=True, app_dir=str(BACKEND_DIR))

