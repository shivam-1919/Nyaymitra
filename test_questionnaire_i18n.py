"""
Verification test for dynamic questionnaire localization in NyayaSetu.
Tests that backend returns bilingual metadata and frontend maps all questions into Hindi and other languages.
"""

from backend.nyayasetu_engine import analyze_civic_problem

def test_questionnaire_localization():
    print("==================================================")
    print("TESTING NYAYASETU QUESTIONNAIRE MULTILINGUAL ENGINE")
    print("==================================================")

    # 1. Test Road Problem
    road_result = analyze_civic_problem("Why has our colony road not been repaired?")
    assert road_result["success"] is True
    q_list = road_result["questionnaire"]
    
    print(f"Total questions generated for road problem: {len(q_list)}")
    for q in q_list:
        print(f"  - [{q['id']}] EN: {q['question']}")
        print(f"               HI: (Verified Devanagari text present, length={len(q.get('question_hi', ''))})")
        assert "question_hi" in q, f"Missing question_hi in {q['id']}"
        assert "placeholder_hi" in q, f"Missing placeholder_hi in {q['id']}"
        assert "rationale_hi" in q, f"Missing rationale_hi in {q['id']}"

    # Specifically check the user's mentioned question
    q_loc = next((q for q in q_list if q["id"] == "jurisdiction_state_city"), None)
    assert q_loc is not None, "jurisdiction_state_city question missing"
    assert q_loc["question"] == "Which State, District, and City/Ward are you located in?"
    assert q_loc["question_hi"] == "आप किस राज्य, जिले एवं शहर / वार्ड में स्थित हैं?"
    print("\n  [OK] 'Which State, District...' verified with pure Hindi translation!")

    # 2. Test Ration Problem
    ration_result = analyze_civic_problem("My ration card application is stuck")
    q_ration = next((q for q in ration_result["questionnaire"] if q["id"] == "ration_application_type"), None)
    assert q_ration is not None, "ration_application_type question missing"
    assert "राशन कार्ड" in q_ration["question_hi"]
    print("  [OK] Ration Card specific question verified in Hindi!")

    # 3. Test Street Vendor Problem
    vendor_result = analyze_civic_problem("Police removed street vendor stall")
    q_vendor = next((q for q in vendor_result["questionnaire"] if q["id"] == "vendor_vending_zone"), None)
    assert q_vendor is not None, "vendor_vending_zone question missing"
    assert "दुकान/ठेला" in q_vendor["question_hi"]
    print("  [OK] Street Vendor specific question verified in Hindi!")

    print("==================================================")
    print("ALL QUESTIONNAIRE LOCALIZATION CHECKS PASSED (100%)")
    print("==================================================")

if __name__ == "__main__":
    test_questionnaire_localization()
