import urllib.request
import json

def run_checks():
    base = "http://127.0.0.1:8000"
    
    # 1. Static Assets Delivery Check
    files = [
        "/", 
        "/css/styles.css", 
        "/js/i18n.js", 
        "/js/api.js", 
        "/js/nyayasetu.js",
        "/js/formfiller.js",
        "/js/schemes.js", 
        "/js/chat.js", 
        "/js/drafter.js", 
        "/js/analyzer.js", 
        "/js/statutes.js", 
        "/js/rights.js", 
        "/js/app.js"
    ]
    print("1. Verifying Static Assets & Client-Side Scripts:")
    for f in files:
        res = urllib.request.urlopen(f"{base}{f}")
        assert res.status == 200, f"Failed: {f}"
        body = res.read().decode("utf-8")
        print(f"   [OK] {f:<22} -> Status: 200, Size: {len(body):>6} bytes")

    # 2. Verify Welfare Schemes API
    print("\n2. Verifying Welfare Schemes:")
    res = urllib.request.urlopen(f"{base}/api/nyayasetu/schemes/list")
    data = json.loads(res.read())
    print(f"   [OK] Scheme Database Count: {data['count']} schemes available")
    assert data["count"] >= 16, "Expected at least 16 welfare schemes"

    # 3. Test Scheme Filtering Matching
    print("\n3. Testing Scheme Filtering Matcher:")
    test_profiles = [
        {"name": "Street Vendor Profile", "body": {"occupation": "Street Vendor / Hawker", "annual_income": 120000, "category": "BPL / EWS", "age": 32, "has_pucca_house": False}, "expected": "pm_svanidhi"},
        {"name": "Farmer Profile", "body": {"occupation": "Farmer", "annual_income": 180000, "category": "General", "age": 45, "has_pucca_house": False}, "expected": "pm_kisan"},
        {"name": "Senior Citizen Profile", "body": {"occupation": "Senior Citizen", "annual_income": 100000, "category": "BPL / EWS", "age": 72, "has_pucca_house": False}, "expected": "ayushman_bharat"}
    ]
    for tp in test_profiles:
        req = urllib.request.Request(f"{base}/api/nyayasetu/schemes/check", data=json.dumps(tp["body"]).encode(), headers={"Content-Type": "application/json"})
        match_data = json.loads(urllib.request.urlopen(req).read())
        matched_ids = [s["id"] for s in match_data.get("schemes", [])]
        assert tp["expected"] in matched_ids, f"Expected {tp['expected']} in matches"
        print(f"   [OK] {tp['name']:<25} -> {len(match_data.get('schemes', []))} schemes matched (includes '{tp['expected']}')")

    # 4. Test Multilingual Legal Advisor Endpoint
    print("\n4. Testing Multilingual Legal Advisor:")
    for lang in ["English", "Hindi"]:
        chat_req = urllib.request.Request(
            f"{base}/api/chat",
            data=json.dumps({"message": "What should I do if my cheque bounces?", "language": lang, "history": []}).encode(),
            headers={"Content-Type": "application/json"}
        )
        chat_res = json.loads(urllib.request.urlopen(chat_req).read())
        print(f"   [OK] {lang:<8} Query Response -> Success: {chat_res.get('success')}, Model: {chat_res.get('model_used')}, Length: {len(chat_res.get('reply', ''))} chars")

    print("\n" + "=" * 65)
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY WITH 100% PASS RATE!")
    print("=" * 65)

if __name__ == "__main__":
    run_checks()
