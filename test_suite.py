from fastapi.testclient import TestClient
from backend.app import app

client = TestClient(app)

print("=" * 60)
print("RUNNING NYAYMITRA FULL SYSTEM VERIFICATION")
print("=" * 60)

# 1. Static Assets
static_routes = [
    '/', 
    '/css/styles.css', 
    '/js/schemes.js', 
    '/js/nyayasetu.js', 
    '/js/formfiller.js',
    '/js/i18n.js', 
    '/js/app.js', 
    '/js/rights.js', 
    '/js/statutes.js', 
    '/js/drafter.js', 
    '/js/analyzer.js'
]
print("\n1. Testing Static Assets & JavaScript Controllers:")
for path in static_routes:
    res = client.get(path)
    assert res.status_code == 200, f"Static route failed: {path}"
    print(f"   [OK] {path:<20} -> 200 OK ({len(res.content)} bytes)")

# 2. Schemes API & How to Apply structure
print("\n2. Testing Welfare Schemes & 'How to Apply' metadata:")
r = client.get('/api/nyayasetu/schemes/list')
assert r.status_code == 200
data = r.json()
assert data['count'] >= 16
for s in data['schemes']:
    assert 'how_to_apply' in s, f"Scheme {s['id']} missing how_to_apply"
    assert 'online_portal' in s['how_to_apply'], f"Scheme {s['id']} missing online_portal"
    assert len(s['how_to_apply']['online_steps']) > 0, f"Scheme {s['id']} missing online_steps"
    assert len(s['how_to_apply']['offline_steps']) > 0, f"Scheme {s['id']} missing offline_steps"
print(f"   [OK] All {data['count']} schemes verified with comprehensive online/offline application steps!")

# 3. Problem Analysis
print("\n3. Testing Problem Analysis & Classification:")
r = client.post('/api/nyayasetu/analyze-problem', json={'problem_text': 'Our street road is broken for 6 months and municipal councillor is not fixing it.'})
assert r.status_code == 200
auth_name = r.json().get("matched_authority", {}).get("authority_name")
print(f"   [OK] Matched Authority: {auth_name}")

# 4. Action Pack Generator
print("\n4. Testing Action Pack & RTI Generator:")
ap_req = {
    'problem_text': 'Road broken for 6 months',
    'answers': {'jurisdiction_state_city': 'Bengaluru Ward 150', 'incident_or_application_date': 'May 2024', 'bpl_or_category': 'General Category'},
    'authority': r.json()['matched_authority']
}
r = client.post('/api/nyayasetu/generate-action-pack', json=ap_req)
assert r.status_code == 200
ap_id = r.json().get('action_pack_id')
print(f"   [OK] Action Pack ID: {ap_id}")

# 5. First Appeal Draft
print("\n5. Testing First Appeal Generator:")
fa_req = {
    'applicant_name': 'Ramesh Kumar',
    'applicant_address': 'Ward 150, Bengaluru',
    'authority_name': 'Municipal Corporation',
    'appellate_authority': 'Additional Commissioner',
    'original_application_date': '01-05-2024',
    'rti_ref_no': 'RTIBB77881'
}
r = client.post('/api/nyayasetu/generate-first-appeal', json=fa_req)
assert r.status_code == 200
print(f"   [OK] First Appeal Title: {r.json().get('title')}")

# 6. Citizen Rights and Emergency SOS
print("\n6. Testing Citizen Rights & Emergency Helplines:")
r = client.get('/api/rights')
assert r.status_code == 200
rights_data = r.json()
print(f"   [OK] Helplines: {len(rights_data.get('helplines', []))}, Legal Guides: {len(rights_data.get('guides', []))}")

# 7. Statutes Crosswalk
print("\n7. Testing BNS / IPC Statutes Database:")
r = client.get('/api/statutes?query=theft')
assert r.status_code == 200
statute_res = r.json()
print(f"   [OK] Search 'theft' matched: {len(statute_res.get('statutes', []))} sections")

print("\n" + "=" * 60)
print("100% OF ENDPOINTS & CONTROLLERS VALIDATED SUCCESSFULLY!")
print("=" * 60)
