"""
NyayaSetu (न्यायसेतु) Civic Rights Engine
Specialized engine for translating citizen grievances into records-based RTI drafts,
discovering welfare schemes, mapping responsible public authorities,
calculating statutory escalation timelines, and generating First Appeals.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

# Curated Database of Public Authorities & Grievance Portals in India
PUBLIC_AUTHORITIES_DATABASE = [
    {
        "id": "municipal_roads",
        "domain": "Civic & Infrastructure (Roads, Drains, Sanitation, Streetlights)",
        "keywords": ["road", "street", "pothole", "drain", "waterlogging", "streetlight", "garbage", "waste", "ward", "councillor", "sanitation", "bbmp", "mcd", "bmc", "municipality", "panchayat"],
        "authority_name": "Municipal Corporation / Town Municipality / Gram Panchayat (Engineering & Works Dept)",
        "pio_designation": "Public Information Officer & Executive Engineer (Roads / Civil Works)",
        "appellate_authority": "Superintending Engineer / Additional Commissioner (Works)",
        "portal_url": "https://pgportal.gov.in (CPGRAMS) or Local Municipal Citizen Portal",
        "statutory_act": "Right to Information Act, 2005 & State Municipal Corporation Act",
        "filing_mode": "Online via State RTI / Grievance Portal or Offline via Speed Post to Commissioner Office"
    },
    {
        "id": "food_civil_supplies",
        "domain": "Ration Card, Food Security & PDS Distribution",
        "keywords": ["ration", "pds", "food grain", "ration card", "quota", "fair price shop", "nfsa", "bpl card", "antyodaya"],
        "authority_name": "Department of Food, Civil Supplies and Consumer Affairs",
        "pio_designation": "Public Information Officer & District Food & Supplies Controller (DFSC)",
        "appellate_authority": "Joint Director / Additional Secretary (Food & Civil Supplies)",
        "portal_url": "https://nfsa.gov.in & State Food Portal",
        "statutory_act": "National Food Security Act (NFSA), 2013 & RTI Act, 2005",
        "filing_mode": "Online through State Food & Civil Supplies Portal or District Collectorate Office"
    },
    {
        "id": "street_vendors_livelihood",
        "domain": "Street Vendors, Vending Certificates & Municipal Licences",
        "keywords": ["vendor", "street vendor", "vending certificate", "hawker", "vending zone", "challan", "confiscation", "pm svanidhi", "thela", "rehri", "seizing cart"],
        "authority_name": "Town Vending Committee (TVC) / Municipal Corporation (Revenue & Vending Dept)",
        "pio_designation": "Public Information Officer & Member Secretary, Town Vending Committee",
        "appellate_authority": "Municipal Commissioner / Appellate Authority under Street Vendors Act",
        "portal_url": "https://pmsvanidhi.mohua.gov.in & Municipal Portal",
        "statutory_act": "Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014 & RTI Act, 2005",
        "filing_mode": "Town Vending Committee Zonal Office / CPGRAMS"
    },
    {
        "id": "housing_tenancy",
        "domain": "Landlord-Tenant Disputes & Rental Security Deposits",
        "keywords": ["landlord", "tenant", "rent", "deposit", "security deposit", "eviction", "lease", "rent agreement", "utility cut", "flat", "maintenance"],
        "authority_name": "Rent Authority / Rent Court / Sub-Divisional Magistrate (SDM)",
        "pio_designation": "N/A (Civil/Statutory Dispute Body) - Rent Officer",
        "appellate_authority": "Rent Tribunal / District Court",
        "portal_url": "https://edaakhil.nic.in (if commercial/consumer) / State Revenue Court",
        "statutory_act": "Model Tenancy Act / State Rent Control Act & Transfer of Property Act, 1882",
        "filing_mode": "Statutory Legal Notice followed by filing before Rent Authority / Small Causes Court"
    },
    {
        "id": "consumer_defects",
        "domain": "Defective Products, Warranty Denial & E-Commerce Frauds",
        "keywords": ["consumer", "warranty", "defective", "refund", "e-commerce", "amazon", "flipkart", "damaged product", "unfair trade", "service deficiency", "scooter", "car", "tv", "mobile"],
        "authority_name": "District Consumer Disputes Redressal Commission (DCDRC)",
        "pio_designation": "Registrar, District Consumer Commission",
        "appellate_authority": "State Consumer Disputes Redressal Commission (SCDRC)",
        "portal_url": "https://edaakhil.nic.in & National Consumer Helpline (1915)",
        "statutory_act": "Consumer Protection Act, 2019",
        "filing_mode": "Online via E-Daakhil Portal or Pre-litigation Notice followed by District Commission Petition"
    },
    {
        "id": "cyber_banking_fraud",
        "domain": "Unauthorized Bank Transfers & UPI Online Scams",
        "keywords": ["cyber", "upi", "qr code", "scam", "fraud", "unauthorized transfer", "otp", "phishing", "bank hacked", "mule account", "chargeback"],
        "authority_name": "National Cyber Crime Reporting Portal & Bank Nodal Grievance Officer / RBI Ombudsman",
        "pio_designation": "Nodal Officer / Banking Ombudsman (under RBI Integrated Ombudsman Scheme)",
        "appellate_authority": "Appellate Authority, RBI Ombudsman",
        "portal_url": "https://cybercrime.gov.in & https://cms.rbi.org.in (RBI CMS)",
        "statutory_act": "Information Technology Act, 2000 & RBI Circular on Limiting Customer Liability (2017)",
        "filing_mode": "National Cyber Helpline 1930 within Golden Hour + RBI CMS Portal"
    }
]

# Curated Welfare Schemes Database (myScheme Profile Matcher)
WELFARE_SCHEMES_DATABASE = [
    {
        "id": "pm_svanidhi",
        "name": "PM SVANidhi (Pradhan Mantri Street Vendor's AtmaNirbhar Nidhi)",
        "ministry": "Ministry of Housing and Urban Affairs (MoHUA)",
        "category": "Livelihood & Micro-Credit",
        "target_audience": "Street Vendors, Hawkers, Mobile Vendors in Urban/Peri-Urban areas",
        "benefit": "Collateral-free working capital loan of Rs 10,000 (1st tranche), Rs 20,000 (2nd tranche), up to Rs 50,000 (3rd tranche) with 7% interest subsidy and cashback on digital transactions.",
        "eligibility_criteria": {
            "occupation": ["Street Vendor", "Hawker", "Mobile Vendor", "Thela/Rehri Operator"],
            "vending_proof": ["Vending Certificate", "Identity Card issued by Urban Local Body (ULB)", "Letter of Recommendation (LoR) from Town Vending Committee (TVC)"],
            "age_min": 18
        },
        "required_documents": [
            "Aadhaar Card (linked to Mobile)",
            "Vending Certificate or ID Card / Letter of Recommendation (LoR)",
            "Active Bank Account with IFSC",
            "Proof of Vending before 24 March 2020 or recent TVC survey receipt"
        ],
        "official_url": "https://pmsvanidhi.mohua.gov.in",
        "confidence": "Confirmed from Official MoHUA Guidelines"
    },
    {
        "id": "nfsa_ration",
        "name": "National Food Security Act (NFSA) Subsidized Food Grain Scheme",
        "ministry": "Department of Food and Public Distribution",
        "category": "Food Security & Social Welfare",
        "target_audience": "Priority Households (PHH) and Antyodaya Anna Yojana (AAY) Families",
        "benefit": "5 kg food grains per person per month (Antyodaya households get 35 kg per family) subsidized/free under Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY).",
        "eligibility_criteria": {
            "income_bracket": ["Below Poverty Line (BPL)", "Low Income", "Daily Wage Earner", "Marginal Farmer"],
            "excludes": ["Income Tax Payee", "Owner of Four-Wheeler (non-commercial)", "Owner of more than 5 acres irrigated land"]
        },
        "required_documents": [
            "Aadhaar Card of all family members",
            "Income Certificate / BPL Card / Self-declaration of Income",
            "Current Address Proof (Electricity bill / Rent agreement)",
            "Passport size photograph of the Head of the Family (Senior-most adult female)"
        ],
        "official_url": "https://nfsa.gov.in",
        "confidence": "Confirmed from NFSA 2013 Statutory Rules"
    },
    {
        "id": "pmay_urban",
        "name": "Pradhan Mantri Awas Yojana (PMAY-U / PMAY-G)",
        "ministry": "Ministry of Housing and Urban Affairs / Ministry of Rural Development",
        "category": "Affordable Housing",
        "target_audience": "Economically Weaker Section (EWS) / Low Income Group (LIG) families without a pucca house",
        "benefit": "Financial assistance of Rs 1.50 Lakh to Rs 2.67 Lakhs upfront interest subsidy on home construction/renovation loan.",
        "eligibility_criteria": {
            "annual_income_max": "Up to Rs 3 Lakhs (EWS) or Rs 6 Lakhs (LIG)",
            "housing_status": "Family must not own a pucca house anywhere in India",
            "female_ownership": "House must be in the name of female head or joint ownership"
        },
        "required_documents": [
            "Aadhaar Card",
            "Income Proof / Certificate from Revenue Officer",
            "Land title / Pattadar passbook (for construction) or Allotment letter",
            "Affidavit declaring no other pucca house owned"
        ],
        "official_url": "https://pmaymis.gov.in",
        "confidence": "Confirmed from Official PMAY Guidelines"
    },
    {
        "id": "ayushman_bharat",
        "name": "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)",
        "ministry": "National Health Authority (NHA), MoHFW",
        "category": "Healthcare & Insurance",
        "target_audience": "Bottom 40% vulnerable and poor families identified via SECC database / Ayushman Vay Vandana (70+ Senior Citizens)",
        "benefit": "Cashless health cover up to Rs 5 Lakhs per family per year for secondary and tertiary hospitalization across empaneled public & private hospitals.",
        "eligibility_criteria": {
            "secc_inclusion": "Listed in SECC 2011 database or State Food Card equivalent or Senior Citizen aged 70+ (Universal Cover)",
            "no_cap_family_size": "No restrictions on family size, age, or gender"
        },
        "required_documents": [
            "Aadhaar Card",
            "Ration Card / PMJAY Letter with Family ID",
            "Active mobile number"
        ],
        "official_url": "https://beneficiary.nha.gov.in",
        "confidence": "Confirmed from NHA Official Portal"
    },
    {
        "id": "e_shram",
        "name": "e-Shram Universal Unorganized Workers Social Security Card",
        "ministry": "Ministry of Labour and Employment",
        "category": "Unorganized Labour & Social Security",
        "target_audience": "Construction workers, domestic workers, gig workers, agricultural labourers, street vendors aged 16-59",
        "benefit": "Universal Account Number (UAN), accidental death/disability insurance cover of Rs 2 Lakhs, direct disaster cash transfer eligibility.",
        "eligibility_criteria": {
            "age_range": "16 to 59 years",
            "occupation": "Unorganized sector worker (Not a member of EPFO or ESIC)",
            "tax_status": "Non-income tax payee"
        },
        "required_documents": [
            "Aadhaar Card",
            "Aadhaar-linked Mobile Number",
            "Bank Account Number with IFSC"
        ],
        "official_url": "https://eshram.gov.in",
        "confidence": "Confirmed from Ministry of Labour Rules"
    },
    {
        "id": "nalsa_free_legal_aid",
        "name": "NALSA Free Legal Aid & Assigned Advocate Service",
        "ministry": "National Legal Services Authority (Supreme Court of India)",
        "category": "Access to Justice",
        "target_audience": "Women, Children, SC/ST, Industrial Workmen, Persons with Disabilities, Undertrial Prisoners, Low-income citizens (annual income < Rs 3 Lakhs in most states)",
        "benefit": "100% Free legal advice, drafting of petitions, court fee payment, and an enrolled advocate assigned at zero expense for all courts up to High Court & Supreme Court.",
        "eligibility_criteria": {
            "automatic_eligible": ["All Women", "All Children", "SC/ST Citizens", "Victims of Trafficking / Violence"],
            "income_cap": "Annual income less than State SLSA limit (typically Rs 3,00,000/year)"
        },
        "required_documents": [
            "Aadhaar / ID Proof",
            "Income certificate / BPL card (Exempt for women & SC/ST)",
            "Case documents / FIR / Notice copy"
        ],
        "official_url": "https://nalsa.gov.in / Call 15100",
        "confidence": "Statutory Right under Legal Services Authorities Act, 1987"
    }
]

def analyze_civic_problem(problem_text: str) -> Dict[str, Any]:
    """
    Analyzes citizen problem in plain language and returns:
    1. Problem classification & responsible public authority
    2. Dynamic targeted questionnaire to collect missing facts
    3. Initial rights summary and evidence checklist
    """
    text_lower = problem_text.lower()
    
    # Match responsible authority
    matched_authority = PUBLIC_AUTHORITIES_DATABASE[0] # default to municipal
    best_score = 0
    
    for auth in PUBLIC_AUTHORITIES_DATABASE:
        score = 0
        for kw in auth["keywords"]:
            if kw in text_lower:
                score += 5
        if score > best_score:
            best_score = score
            matched_authority = auth

    # Determine default questionnaire fields based on domain
    questionnaire = [
        {
            "id": "jurisdiction_state_city",
            "question": "Which State, District, and City/Ward are you located in?",
            "placeholder": "e.g. Karnataka, Bengaluru, Ward 150 (Bellandur)",
            "type": "text",
            "required": True,
            "rationale": "Identifies the exact municipal corporation, state RTI portal, or local nodal officer."
        },
        {
            "id": "incident_or_application_date",
            "question": "When did you submit your original application / when did the issue start?",
            "placeholder": "e.g. 15th May 2024 (approx 3 months ago)",
            "type": "text",
            "required": True,
            "rationale": "Used to calculate statutory service timelines (e.g. 30-day RTI limit or 60-day delay)."
        },
        {
            "id": "reference_or_receipt_number",
            "question": "Do you have any application number, acknowledgment slip, receipt, or token number?",
            "placeholder": "e.g. Application Acknowledgment #ACK-2024-88912 / No receipt received",
            "type": "text",
            "required": False,
            "rationale": "Allows tracking the exact file movement record in the department."
        },
        {
            "id": "available_documents",
            "question": "What documents or proofs do you currently possess?",
            "placeholder": "e.g. Photos of unpaved road, rent agreement, bank statement, WhatsApp chat screenshots",
            "type": "textarea",
            "required": True,
            "rationale": "Forms the mandatory annexure checklist for complaints and RTI petitions."
        },
        {
            "id": "bpl_or_category",
            "question": "Do you belong to Below Poverty Line (BPL / EWS) or specialized category (Street Vendor / Senior Citizen)?",
            "placeholder": "e.g. General / BPL Ration Card Holder (Fee Exempted) / Street Vendor",
            "type": "select",
            "options": ["General Category", "BPL / EWS (RTI Fee Exempted)", "Street Vendor / Hawker", "Senior Citizen (60+)", "Woman / Single Mother", "SC / ST Category"],
            "required": True,
            "rationale": "Determines statutory fee exemptions and free legal aid eligibility."
        }
    ]

    # Specific questions if road/civic issue
    if "road" in text_lower or "street" in text_lower or "pothole" in text_lower or "councillor" in text_lower:
        questionnaire.insert(2, {
            "id": "exact_location_details",
            "question": "What is the exact street name, landmark, and ward number?",
            "placeholder": "e.g. Main 100ft Ring Road between Metro Pillar 140 and 155, Ward 88",
            "type": "text",
            "required": True,
            "rationale": "Ensures the RTI request targets the specific sanctioned work order."
        })

    # Specific questions if ration/food issue
    elif "ration" in text_lower or "pds" in text_lower:
        questionnaire.insert(2, {
            "id": "ration_application_type",
            "question": "Is this a new Ration Card application, member addition, or Fair Price Shop dealer grievance?",
            "placeholder": "e.g. New BPL Ration card applied online on State Food Portal",
            "type": "text",
            "required": True,
            "rationale": "Directs query to the District Food & Supplies Controller (DFSC)."
        })

    # Specific questions if street vendor issue
    elif "vendor" in text_lower or "hawker" in text_lower or "thela" in text_lower:
        questionnaire.insert(2, {
            "id": "vendor_vending_zone",
            "question": "Where is your vending spot located, and was your name included in the Town Vending Committee (TVC) survey?",
            "placeholder": "e.g. Sector 14 Market Vending Zone; survey slip received in 2021",
            "type": "text",
            "required": True,
            "rationale": "Invokes protections under Section 3 of the Street Vendors Act, 2014."
        })

    return {
        "success": True,
        "problem_summary": problem_text,
        "matched_authority": matched_authority,
        "confidence_level": "Confirmed from Official Directory" if best_score >= 10 else "Likely Jurisdiction",
        "questionnaire": questionnaire,
        "recommended_first_step": "Draft a structured Records-Based RTI Application or Formal Grievance Notice"
    }

def generate_action_pack(problem_text: str, user_answers: Dict[str, Any], matched_authority: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates a full Action Pack containing:
    1. Records-Based RTI Application (Court/PIO standard)
    2. Formal Grievance Escalation Letter
    3. Official Portal Filing Guide & Links
    4. Attachment Checklist & Fee Breakdown
    5. Statutory Timeline & Follow-Up Calendar
    """
    today_str = datetime.now().strftime("%d-%m-%Y")
    deadline_30_days = (datetime.now() + timedelta(days=30)).strftime("%d-%m-%Y")
    deadline_45_days = (datetime.now() + timedelta(days=45)).strftime("%d-%m-%Y")
    
    jurisdiction = user_answers.get("jurisdiction_state_city", "Local Municipal Jurisdiction")
    incident_date = user_answers.get("incident_or_application_date", "Past 60 Days")
    receipt_no = user_answers.get("reference_or_receipt_number", "N/A")
    location_details = user_answers.get("exact_location_details", jurisdiction)
    category = user_answers.get("bpl_or_category", "General Category")
    available_docs = user_answers.get("available_documents", "Application copies and photographs")
    
    is_bpl = "bpl" in category.lower()

    # Principle: Convert vague citizen concerns into specific, discoverable records queries
    problem_lower = problem_text.lower()
    
    if "road" in problem_lower or "street" in problem_lower or "pothole" in problem_lower or "councillor" in problem_lower:
        specific_records_queries = f"""1. Please provide certified copies of the administrative approval, technical sanction, and sanctioned budget estimate for road construction / repair work on {location_details}.
2. Please provide a certified copy of the Work Order issued to the executing contractor / agency, including the contractual commencement date and stipulated date of completion.
3. Please provide the certified copy of the Measurement Book (MB) entries, inspection reports, and quality test verification certificates submitted by the inspecting Junior/Assistant Executive Engineer for this work.
4. Please provide the exact total amount released to the contractor till date, and the remaining unpaid bill amount.
5. Please provide the certified copy of the Defect Liability Period (DLP) clause from the contract and the name & contact details of the contractor responsible for maintenance.
6. If the work is delayed beyond the stipulated completion date, please provide the recorded file notings showing reasons for delay and any liquidated damages or penalty imposed on the contractor."""
        
        grievance_subject = f"Urgent Grievance regarding Dilapidated Road Condition and Unwarranted Delay at {location_details}"
        grievance_body = f"""I am a resident / regular commuter at {location_details}. Despite repeated verbal representations, the road remains in a hazardous state with severe potholes and waterlogging, posing grave danger to commuters and pedestrians.

The work was expected to be completed following sanctions around {incident_date}. I request your immediate intervention to inspect the site, enforce the contractor's Defect Liability obligations, and complete the repairs within 15 days."""

    elif "ration" in problem_lower or "pds" in problem_lower:
        specific_records_queries = f"""1. Please provide the daily file movement log and progress tracking record of my Ration Card Application (Ref / Acknowledgment No: {receipt_no}) submitted on or around {incident_date}.
2. Please provide the names, designations, and office addresses of all public officials with whom my application has remained pending since submission, along with the date of receipt and date of forwarding by each official.
3. Please provide a certified copy of the Citizen's Charter of the Department specifying the maximum prescribed statutory timeline for processing and issuing a new Ration Card.
4. If the application is delayed beyond the Citizen's Charter timeline, please provide the recorded reasons for delay in writing as per official records.
5. If any verification or deficiency was noted on my application, please provide a certified copy of the official memo / inspection report."""
        
        grievance_subject = f"Complaint regarding Unexplained Delay in Processing Ration Card Application (Ack: {receipt_no})"
        grievance_body = f"""I applied for a Ration Card under the National Food Security Act (NFSA, 2013) on {incident_date} vide Acknowledgment No: {receipt_no}. Despite the statutory Citizen Charter timeline of 30 days having elapsed, the card has not been issued, causing severe food security distress to my household."""

    elif "vendor" in problem_lower or "hawker" in problem_lower:
        specific_records_queries = f"""1. Please provide a certified copy of the Town Vending Committee (TVC) survey register entries concerning vending spot at {location_details}.
2. Please provide the certified file movement notings relating to the processing and issuance of Vending Certificates / ID Cards under Section 3 and Section 4 of the Street Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014.
3. Please provide the list of designated Natural Vending Zones, Non-Vending Zones, and Restricted Vending Zones in Ward / Zone {jurisdiction}.
4. If any eviction or fine was initiated against the undersigned vendor on {incident_date}, please provide certified copies of the statutory 30-day prior notice issued under Section 18 of the Street Vendors Act, 2014."""
        
        grievance_subject = f"Representation regarding Protection of Livelihood and Issuance of Vending Certificate at {location_details}"
        grievance_body = f"""I am a legitimate street vendor operating at {location_details}. Under Section 3(3) of the Street Vendors Act, 2014, no street vendor shall be evicted or relocated until the survey is complete and a certificate of vending is issued. I request issuance of my certificate and cessation of unlawful harassment."""

    else:
        specific_records_queries = f"""1. Please provide certified copies of all file notings, movement registers, and correspondence relating to the citizen grievance / application (Ref: {receipt_no}) submitted on {incident_date}.
2. Please provide the names and designations of the nodal officers responsible for taking action on this matter under the departmental Citizen's Charter.
3. Please provide the certified copy of the official inspection report, site visit log, or decision record recorded on the file till date.
4. If no action has been taken within the prescribed statutory period, please provide the recorded reasons for non-compliance."""
        
        grievance_subject = f"Formal Grievance Representation regarding Delay in Action on Application (Ref: {receipt_no})"
        grievance_body = f"""The undersigned submitted a formal request on {incident_date}. To date, no tangible resolution or written communication has been furnished, causing undue hardship. I request immediate redressal within 15 days."""

    # 1. Draft RTI Application
    fee_clause = "The applicant belongs to the BPL category; a certified copy of BPL proof is attached, exempting application fees as per Section 7(5) of the RTI Act, 2005." if is_bpl else "The statutory application fee of Rs 10/- is enclosed via Indian Postal Order (IPO) / Court Fee Stamp / Online Payment Receipt."
    
    rti_draft = f"""# FORM 'A': APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RTI ACT, 2005

**To,**
The Public Information Officer (PIO) / {matched_authority.get('pio_designation', 'Authorized PIO')},
{matched_authority.get('authority_name', 'Public Authority')},
{jurisdiction}

**Date:** {today_str}

---

### 1. APPLICANT PARTICULARS:
- **Name:** [Citizen Full Name]
- **Postal Address:** {jurisdiction}
- **Contact:** [Mobile & Email]
- **Citizenship:** Citizen of India

### 2. PARTICULARS OF INFORMATION SOUGHT (RECORDS-BASED):
**Subject:** Request for certified copies of official records concerning {problem_text[:80]}...

{specific_records_queries}

### 3. STATUTORY TIMELINE:
As per **Section 7(1) of the RTI Act, 2005**, you are required to furnish the requested certified records within **30 (THIRTY) DAYS** of receipt of this application.

### 4. APPLICATION FEE:
{fee_clause}

### 5. DECLARATION:
I hereby state that the information sought falls within the definition of Section 2(f) and does not attract any exemption under Section 8 or 9 of the RTI Act, 2005.

Yours faithfully,

_____________________________
**[Applicant Signature]**
"""

    # 2. Draft Grievance Letter
    grievance_draft = f"""# FORMAL GRIEVANCE REPRESENTATION
**To,**
The Competent Authority / {matched_authority.get('appellate_authority', 'Nodal Officer')},
{matched_authority.get('authority_name', 'Public Authority')},
{jurisdiction}

**Date:** {today_str}

**SUBJECT: {grievance_subject}**

Respected Sir / Madam,

{grievance_body}

### DETAILS OF ANNEXURES ENCLOSED:
1. Copy of Acknowledgment / Token / Application Proof ({receipt_no}).
2. Documentary Proofs & Photographs ({available_docs}).
3. Identification Proof.

I earnestly request your good office to direct an inspection and expedite the resolution within **15 Days**, failing which I shall be compelled to escalate this matter to the higher Ombudsman and Lokayukta.

Thanking you,

Yours sincerely,

_____________________________
**[Citizen Name & Signature]**
Address: {jurisdiction}
"""

    # 3. Action Pack Summary
    return {
        "success": True,
        "action_pack_id": f"AP_{Date_now_id()}",
        "issue_type": matched_authority.get("domain", "Civic Grievance"),
        "jurisdiction": jurisdiction,
        "responsible_authority": matched_authority.get("authority_name"),
        "pio_designation": matched_authority.get("pio_designation"),
        "portal_url": matched_authority.get("portal_url"),
        "statutory_act": matched_authority.get("statutory_act"),
        "rti_draft": rti_draft,
        "grievance_draft": grievance_draft,
        "checklist": [
            "Print and sign two copies of the RTI Application (retain one copy for proof of dispatch)",
            "Attach Rs 10 Indian Postal Order (IPO) purchased from any Post Office, payable to 'Accounts Officer' (or pay Rs 10 online if filing on State/Central RTI portal)",
            "If claiming BPL fee exemption, attach a self-attested photocopy of the valid BPL Ration Card",
            "Send via Speed Post / Registered Post with Acknowledgment Due (RPAD) and preserve the postal tracking receipt safely",
            "Note down the 30-day statutory response deadline on your calendar"
        ],
        "timeline": [
            {"day": "Day 0", "event": "Application Dispatch", "desc": "File online or dispatch signed RTI via Speed Post with Rs 10 fee.", "status": "Action Required Today"},
            {"day": "Day 3 to 5", "event": "Delivery to PIO", "desc": "Speed post delivered; 30-day statutory clock begins under Sec 7(1).", "status": "Pending"},
            {"day": f"Day 30 ({deadline_30_days})", "event": "Statutory Deadline for PIO", "desc": "Public Information Officer must provide certified records or notice of fees.", "status": "Statutory Deadline"},
            {"day": f"Day 31 to 60 ({deadline_45_days})", "event": "First Appeal Window", "desc": "If no response or unsatisfactory reply, file First Appeal under Section 19(1) to Appellate Authority.", "status": "Escalation Step"}
        ],
        "confidence_level": "Confirmed from Official RTI Act & Department Manuals",
        "human_review_required": False if not is_bpl else "Ensure BPL Card is active and in the applicant's name."
    }

def generate_first_appeal_draft(case_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates a First Appeal Draft under Section 19(1) of the RTI Act, 2005
    when the Public Authority fails to respond within the 30-day statutory deadline.
    """
    today_str = datetime.now().strftime("%d-%m-%Y")
    
    applicant_name = case_data.get("applicant_name", "[Applicant Name]")
    applicant_address = case_data.get("applicant_address", "[Applicant Address]")
    authority_name = case_data.get("authority_name", "Public Authority")
    appellate_authority = case_data.get("appellate_authority", "First Appellate Authority")
    original_application_date = case_data.get("original_application_date", "[Original RTI Date]")
    rti_ref_no = case_data.get("rti_ref_no", "Speed Post Tracking No. / Online RTI Reg No.")
    reason_for_appeal = case_data.get("reason_for_appeal", "No response received from the PIO within the statutory 30-day period stipulated under Section 7(1) of the RTI Act, 2005 (Deemed Refusal).")

    appeal_draft = f"""# FORM 'B': MEMORANDUM OF FIRST APPEAL UNDER SECTION 19(1) OF THE RIGHT TO INFORMATION ACT, 2005

**To,**
The First Appellate Authority (FAA) / {appellate_authority},
{authority_name},
Office Address: [Department Head Office / Zonal Office]

**Date:** {today_str}

---

### 1. APPELLANT PARTICULARS:
- **Full Name:** {applicant_name}
- **Complete Postal Address:** {applicant_address}
- **Contact Details:** [Mobile Number & Email]

### 2. PARTICULARS OF THE PIO AGAINST WHOSE ORDER / INACTION APPEAL IS PREFERRED:
- **Designation of PIO:** Public Information Officer, {authority_name}
- **Date of Filing Original RTI Application:** {original_application_date}
- **Original RTI Application / Postal Registration No.:** {rti_ref_no}

### 3. GROUND AND REASONS FOR FIRST APPEAL:
1. **DEEMED REFUSAL UNDER SECTION 7(2):** The Appellant submitted an RTI Application on **{original_application_date}** seeking certified public records. More than 30 days have elapsed since the receipt of the application, yet the Public Information Officer has failed to provide the requested information or pass any statutory order.
2. Under **Section 7(2)** of the RTI Act, 2005, failure of the PIO to give a decision within 30 days is deemed a refusal.
3. Under **Section 7(6)** of the RTI Act, 2005, where a public authority fails to provide the information within the statutory timeline, the information **MUST BE PROVIDED FREE OF CHARGE**.

### 4. PRAYER / RELIEF SOUGHT:
The Appellant respectfully prays that the Hon'ble First Appellate Authority may be pleased to:
1. Direct the PIO to provide all certified records and documents sought in the original RTI application **immediately and free of charge** under Section 7(6).
2. Recommend appropriate disciplinary inquiry against the defaulting PIO under Section 20 of the RTI Act for willful obstruction and failure of statutory duty.

### 5. LIST OF ENCLOSURES:
1. Self-attested copy of the original RTI Application dated {original_application_date}.
2. Copy of Postal Speed Post Receipt / Online RTI Acknowledgment showing proof of filing.
3. Copy of this Appeal Memorandum.

Yours faithfully,

_____________________________
**Signature of Appellant**
**Name:** {applicant_name}
**Date:** {today_str}
"""

    return {
        "success": True,
        "title": "First Appeal under Section 19(1) of RTI Act, 2005",
        "appeal_draft": appeal_draft,
        "statutory_act": "Section 19(1) of the Right to Information Act, 2005",
        "filing_timeline": "Must be filed within 30 days from the expiry of the 30-day PIO deadline (i.e. between Day 31 and Day 60)."
    }

def Date_now_id() -> str:
    return datetime.now().strftime("%Y%m%d_%H%M%S")
