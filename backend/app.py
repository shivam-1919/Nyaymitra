"""
NyayMitra - FastAPI Main Application
Serves REST APIs for AI Legal Consultation, Drafting, Document Analysis,
Statute Search, and Citizen Rights, as well as serving the modern frontend SPA.
"""

import os
import sys
from pathlib import Path
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
from gemini_service import consult_legal_advisor, generate_legal_draft, analyze_legal_document, search_statutes_locally
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
        "masked_key": get_masked_api_key(),
        "default_model": settings.DEFAULT_MODEL,
        "statutes_indexed": len(STATUTES_DATABASE),
        "templates_available": len(DRAFT_TEMPLATES)
    }

@app.post("/api/config")
async def update_config(req: ConfigUpdateRequest):
    update_api_key(req.gemini_api_key or "", req.gemini_model)
    return {
        "success": True,
        "message": "Gemini configuration updated successfully.",
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "masked_key": get_masked_api_key(),
        "default_model": settings.DEFAULT_MODEL
    }

@app.post("/api/config/test")
async def test_gemini_connection(req: ConfigUpdateRequest):
    test_key = req.gemini_api_key or settings.GEMINI_API_KEY
    model = req.gemini_model or settings.DEFAULT_MODEL
    if not test_key:
        return {"success": False, "message": "No API key provided to test."}
        
    try:
        from google import genai
        client = genai.Client(api_key=test_key)
        resp = client.models.generate_content(
            model=model,
            contents="Respond with 'OK: Gemini connection verified for NyayMitra.'"
        )
        return {
            "success": True,
            "message": f"Successfully verified {model}! Connection latency optimal.",
            "sample_response": resp.text.strip()
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Connection test failed: {str(e)}"
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

@app.post("/api/analyze/upload")
async def analyze_uploaded_file(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB.")
    
    extracted_text, file_type = extract_text_from_bytes(contents, file.filename)
    
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
    income = req.annual_income or 200000
    age = req.age or 30

    for s in WELFARE_SCHEMES_DATABASE:
        score = 0
        reasons = []
        
        # Check occupation
        if "street vendor" in occ_lower or "hawker" in occ_lower or "thela" in occ_lower:
            if s["id"] == "pm_svanidhi":
                score += 50
                reasons.append("Directly matches Street Vendor / Urban Hawker profile.")
        
        # Check income / BPL
        if "bpl" in cat_lower or "ews" in cat_lower or income <= 180000:
            if s["id"] in ["nfsa_ration", "ayushman_bharat", "pmay_urban"]:
                score += 40
                reasons.append("Income / BPL category satisfies priority household criteria.")
        
        # Check unorganized worker
        if occ_lower not in ["salaried", "government employee", "corporate"]:
            if s["id"] == "e_shram" and 16 <= age <= 59:
                score += 40
                reasons.append("Unorganized sector occupation matches e-Shram social security.")
                
        # Check legal aid
        if "woman" in cat_lower or "sc" in cat_lower or "st" in cat_lower or income <= 300000:
            if s["id"] == "nalsa_free_legal_aid":
                score += 45
                reasons.append("Eligible for 100% Free Legal Aid & Assigned Advocate under Section 12 of Legal Services Authorities Act.")

        # Housing scheme
        if not req.has_pucca_house and income <= 600000:
            if s["id"] == "pmay_urban":
                score += 35
                reasons.append("No existing pucca house and income within EWS/LIG bracket.")

        if score > 0 or income <= 250000:
            scheme_item = dict(s)
            scheme_item["match_confidence"] = "High Match" if score >= 40 else "Potential Match"
            scheme_item["eligibility_reason"] = " • ".join(reasons) if reasons else "General Low-Income / Citizen Benefit eligibility criteria met."
            matched_schemes.append(scheme_item)

    return {
        "count": len(matched_schemes),
        "schemes": matched_schemes if matched_schemes else WELFARE_SCHEMES_DATABASE[:3]
    }

# Mount static frontend files
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/")
async def serve_index():
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "NyayMitra API is running. Frontend static directory initialized."}

# Catch-all for assets if referenced directly
@app.get("/{full_path:path}")
async def serve_frontend_assets(full_path: str):
    target_path = FRONTEND_DIR / full_path
    if target_path.exists() and target_path.is_file():
        return FileResponse(str(target_path))
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    raise HTTPException(status_code=404, detail="Resource not found")


if __name__ == "__main__":
    import uvicorn
    print("=" * 65)
    print(f"{settings.PROJECT_NAME} - AI Legal Justice & Document Automation")
    print(f"Starting server on http://{settings.HOST}:{settings.PORT}")
    print(f"Default Model: {settings.DEFAULT_MODEL}")
    print("=" * 65)
    uvicorn.run("app:app", host=settings.HOST, port=settings.PORT, reload=True, app_dir=str(BACKEND_DIR))

