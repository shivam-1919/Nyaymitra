"""
Comprehensive Automated Test Suite for NyayMitra & NyayaSetu Platform
Validates API endpoints, legal reasoning engine, drafting schemas, NyayaSetu civic action engine,
welfare scheme discovery, and First Appeals.
"""

import sys
import json
import urllib.request
import urllib.error

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name: str, path: str, method: str = "GET", data: dict = None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            status = response.status
            body = response.read().decode("utf-8")
            print(f"[PASS] [{status}] {name} ({method} {path})")
            return status, body
    except urllib.error.HTTPError as e:
        print(f"[FAIL] [HTTP {e.code}] {name} ({method} {path}): {e.read().decode('utf-8')}")
        return e.code, None
    except Exception as e:
        print(f"[FAIL] [ERROR] {name} ({method} {path}): {e}")
        return None, None

def run_tests():
    print("=" * 65)
    print("Running NyayMitra & NyayaSetu System Validation Tests")
    print("=" * 65)

    # 1. Health check
    status, body = test_endpoint("Health Check", "/api/health")
    assert status == 200, "Health check failed"
    health_data = json.loads(body)
    print(f"   -> App: {health_data.get('app')}, Statutes: {health_data.get('statutes_indexed')}")

    # 2. NyayaSetu Problem Analysis (Civic Road Repair)
    problem_payload = {
        "problem_text": "Why has my street not been repaired even though the councillor promised it 6 months ago? There are huge potholes."
    }
    status, body = test_endpoint("NyayaSetu Civic Problem Analysis", "/api/nyayasetu/analyze-problem", method="POST", data=problem_payload)
    assert status == 200, "Problem analysis failed"
    analysis_resp = json.loads(body)
    assert "questionnaire" in analysis_resp and len(analysis_resp["questionnaire"]) >= 4, "Questionnaire generation failed"
    print(f"   -> Matched Authority: {analysis_resp.get('matched_authority', {}).get('authority_name')}")
    print(f"   -> Questions Generated: {len(analysis_resp.get('questionnaire', []))}")

    # 3. NyayaSetu Action Pack Generation (Records-Based RTI Draft)
    action_pack_payload = {
        "problem_text": "Road construction delay on 100ft Ring Road",
        "answers": {
            "jurisdiction_state_city": "Karnataka, Bengaluru, Ward 150",
            "incident_or_application_date": "January 2024",
            "exact_location_details": "100ft Ring Road between Metro Pillar 140 and 155",
            "reference_or_receipt_number": "WORK-ORD-8891",
            "available_documents": "Pothole photos and local resident association signatures",
            "bpl_or_category": "BPL / EWS (RTI Fee Exempted)"
        },
        "authority": analysis_resp.get("matched_authority")
    }
    status, body = test_endpoint("NyayaSetu Action Pack Generator", "/api/nyayasetu/generate-action-pack", method="POST", data=action_pack_payload)
    assert status == 200, "Action pack generation failed"
    ap_resp = json.loads(body)
    assert "rti_draft" in ap_resp and "sanctioned budget" in ap_resp["rti_draft"], "Records-based RTI draft missing key discoverable items"
    assert "grievance_draft" in ap_resp and len(ap_resp["timeline"]) >= 3, "Timeline / Grievance missing"
    print(f"   -> Action Pack ID: {ap_resp.get('action_pack_id')}")
    print(f"   -> Generated RTI Length: {len(ap_resp.get('rti_draft', ''))} chars")

    # 4. NyayaSetu First Appeal Generator
    appeal_payload = {
        "applicant_name": "Priya Sundaram",
        "applicant_address": "Flat 402, Green Woods, Bengaluru - 560038",
        "authority_name": "Bruhat Bengaluru Mahanagara Palike (BBMP)",
        "appellate_authority": "Superintending Engineer (Works)",
        "original_application_date": "15-05-2024",
        "rti_ref_no": "SPEED_POST_EK94829104IN"
    }
    status, body = test_endpoint("NyayaSetu First Appeal (Sec 19(1))", "/api/nyayasetu/generate-first-appeal", method="POST", data=appeal_payload)
    assert status == 200, "First Appeal generation failed"
    appeal_resp = json.loads(body)
    assert "appeal_draft" in appeal_resp and "DEEMED REFUSAL UNDER SECTION 7(2)" in appeal_resp["appeal_draft"], "Appeal draft missing statutory grounds"
    print(f"   -> Appeal Title: {appeal_resp.get('title')}")

    # 5. Welfare Schemes List & Profile Matcher (Street Vendor)
    status, body = test_endpoint("Welfare Schemes List", "/api/nyayasetu/schemes/list")
    assert status == 200, "Schemes list failed"
    schemes_list = json.loads(body)
    print(f"   -> Total Schemes Available: {schemes_list.get('count')}")

    vendor_profile = {
        "occupation": "Street Vendor / Hawker",
        "category": "BPL / EWS",
        "annual_income": 120000,
        "age": 35,
        "has_pucca_house": False
    }
    status, body = test_endpoint("Welfare Scheme Eligibility Matcher", "/api/nyayasetu/schemes/check", method="POST", data=vendor_profile)
    assert status == 200, "Scheme eligibility check failed"
    matched_schemes = json.loads(body)
    assert any(s["id"] == "pm_svanidhi" for s in matched_schemes.get("schemes", [])), "PM SVANidhi should match street vendor profile"
    print(f"   -> Matched Schemes for Street Vendor: {len(matched_schemes.get('schemes', []))}")

    # 6. Legal Drafting Studio (Cheque Bounce)
    draft_payload = {
        "template_id": "cheque_bounce_notice",
        "form_data": {
            "sender_name": "Ramesh Kumar",
            "sender_address": "45 Civil Lines, Delhi",
            "recipient_name": "Suresh Sharma",
            "recipient_address": "12 Connaught Place, Delhi",
            "cheque_number": "001234",
            "cheque_date": "2024-05-10",
            "cheque_amount": "150000",
            "bank_name": "State Bank of India",
            "return_memo_date": "2024-05-20",
            "return_reason": "Funds Insufficient",
            "transaction_context": "Friendly loan repayment"
        }
    }
    status, body = test_endpoint("Legal Notice Drafting", "/api/draft", method="POST", data=draft_payload)
    assert status == 200, "Drafting failed"

    # 7. Statutes Search (BNS / IPC)
    status, body = test_endpoint("Statutes Search (IPC 420 -> BNS 318)", "/api/statutes?query=420")
    assert status == 200, "Statutes failed"

    # 8. Citizen Rights & Emergency SOS
    status, body = test_endpoint("Citizen Rights & Emergency SOS", "/api/rights")
    assert status == 200, "Rights failed"

    # 9. Frontend Delivery
    status, body = test_endpoint("Frontend SPA Delivery", "/")
    assert status == 200, "Frontend failed"
    assert "NyayaSetu" in body, "Frontend does not contain NyayaSetu elements"

    print("=" * 65)
    print("ALL 9 TESTS PASSED! NyayaSetu & NyayMitra are 100% Operational.")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
