"""
NyayaSetu (न्यायसेतु) Civic Rights Engine
Specialized engine for translating citizen grievances into records-based RTI drafts,
discovering welfare schemes, mapping responsible public authorities,
calculating statutory escalation timelines, and generating First Appeals.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

# Load static verified welfare schemes from versioned config
VERIFIED_SCHEMES_PATH = Path(__file__).parent / "data" / "verified_welfare_schemes.json"
STATIC_VERIFIED_SCHEMES = []
if VERIFIED_SCHEMES_PATH.exists():
    try:
        with open(VERIFIED_SCHEMES_PATH, "r", encoding="utf-8") as f:
            _config = json.load(f)
            STATIC_VERIFIED_SCHEMES = _config.get("schemes", [])
    except Exception as _e:
        print(f"Warning: Could not load verified schemes config: {_e}")

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

# Curated Welfare Schemes Database (myScheme Profile Matcher - 16+ Schemes)
WELFARE_SCHEMES_DATABASE = [
    {
        "id": "pm_svanidhi",
        "name": "PM SVANidhi (Pradhan Mantri Street Vendor's AtmaNirbhar Nidhi)",
        "name_hi": "पीएम स्वनिधि (रेहड़ी-पटरी विक्रेता आत्मनिर्भर निधि)",
        "ministry": "Ministry of Housing and Urban Affairs (MoHUA)",
        "category": "Labour & Vendors",
        "target_audience": "Street Vendors, Hawkers, Mobile Vendors in Urban/Peri-Urban areas",
        "benefit": "Collateral-free working capital loan of Rs 10,000 (1st tranche), Rs 20,000 (2nd tranche), up to Rs 50,000 (3rd tranche) with 7% interest subsidy and cashback on digital transactions.",
        "benefit_hi": "बिना किसी गारंटी के ₹10,000 (पहला चरण), ₹20,000 (दूसरा चरण) और ₹50,000 (तीसरा चरण) तक का कार्यशील ऋण, 7% ब्याज सब्सिडी और डिजिटल लेनदेन पर कैशबैक।",
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
        "confidence": "Confirmed from Official MoHUA Guidelines",
        "how_to_apply": {
            "online_portal": "https://pmsvanidhi.mohua.gov.in",
            "online_steps": [
                "Visit the official PMSVANidhi portal (pmsvanidhi.mohua.gov.in) or download the PMSVANidhi mobile app.",
                "Click on 'Apply for Loan' and enter your Aadhaar-linked mobile number to receive OTP.",
                "Enter your Urban Local Body (ULB) Vending Certificate number or Town Vending Committee (TVC) Letter of Recommendation (LoR) ID.",
                "Select your preferred Lending Institution (Public Sector Bank, Regional Rural Bank, or MFI).",
                "Submit the application and download the digital application receipt for branch follow-up."
            ],
            "offline_steps": [
                "Visit your nearest Common Service Centre (CSC) or Urban Local Body (ULB / Nagar Nigam) office.",
                "Request PMSVANidhi Application Form No. 1.",
                "Attach self-attested photocopies of Aadhaar, Bank Passbook, and Vending ID / LoR.",
                "The CSC operator or ULB nodal officer will upload the form on the portal free of charge."
            ],
            "fee": "Nil (Zero application fee; free under government guidelines)",
            "processing_time": "7 to 15 working days from ULB verification to bank sanction",
            "helpline": "1800-11-1979 (Toll-Free MoHUA Helpdesk)"
        }
    },
    {
        "id": "pm_kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "name_hi": "पीएम किसान सम्मान निधि (PM-KISAN)",
        "ministry": "Ministry of Agriculture and Farmers Welfare",
        "category": "Farmers & Agriculture",
        "target_audience": "All landholding farmer families with cultivable landholding in their names",
        "benefit": "Direct income support of Rs 6,000 per year paid in three equal installments of Rs 2,000 directly transferred to bank accounts via DBT.",
        "benefit_hi": "सभी पात्र भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष की प्रत्यक्ष आर्थिक सहायता (₹2,000 की 3 समान किश्तों में DBT द्वारा बैंक खाते में)।",
        "eligibility_criteria": {
            "occupation": ["Farmer", "Agricultural Landholder"],
            "excludes": ["Institutional landholders", "Former/present constitutional post holders", "Serving/retired govt employees", "Income tax payees"]
        },
        "required_documents": [
            "Aadhaar Card with e-KYC verification",
            "Land ownership record (Khasra/Khatauni / RoR / 7/12 extract)",
            "Aadhaar-seeded Bank Account (DBT-enabled NPCI mapping)"
        ],
        "official_url": "https://pmkisan.gov.in",
        "confidence": "Confirmed from PM-KISAN Portal Rules",
        "how_to_apply": {
            "online_portal": "https://pmkisan.gov.in",
            "online_steps": [
                "Go to pmkisan.gov.in and click on 'Farmers Corner' -> 'New Farmer Registration'.",
                "Select 'Rural Farmer Registration' or 'Urban Farmer Registration' and enter your Aadhaar number and State.",
                "Authenticate with the OTP received on your Aadhaar-linked mobile.",
                "Enter State, District, Sub-District, Block, Village, Land Survey/Khasra/Khatauni number, and land ownership date.",
                "Upload a PDF copy of your land revenue record (RoR / 7/12 / Khasra) and submit.",
                "Complete mandatory biometric or OTP-based e-KYC under 'e-KYC' tab."
            ],
            "offline_steps": [
                "Visit your village Panchayat office, Block Agriculture Office (BAO), or local CSC centre.",
                "Fill the PM-KISAN physical registration form with land details.",
                "Submit copies of Land Passbook (Khatauni), Aadhaar, and Bank Passbook to the Agriculture Nodal Officer for verification."
            ],
            "fee": "Free on portal; CSC nominal service fee Rs 15-20",
            "processing_time": "15 to 30 days following State revenue department verification",
            "helpline": "155261 / 011-24300606 (PM-KISAN National Helpline)"
        }
    },
    {
        "id": "ayushman_bharat",
        "name": "Ayushman Bharat (PM-JAY & Vay Vandana 70+ Healthcare)",
        "name_hi": "आयुष्मान भारत (PM-JAY एवं वय वंदना 70+ योजना)",
        "ministry": "National Health Authority (NHA) & MoHFW",
        "category": "Health & Senior Citizens",
        "target_audience": "BPL/SECC families & All citizens aged 70+ regardless of income",
        "benefit": "Cashless secondary and tertiary hospitalisation coverage up to Rs 5 Lakh per year per family across 29,000+ empaneled public and private hospitals across India.",
        "benefit_hi": "प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस अस्पताल भर्ती व उपचार कवरेज (29,000+ सूचीबद्ध सरकारी व निजी अस्पतालों में)। 70 वर्ष से अधिक आयु के सभी नागरिकों के लिए वय वंदना कार्ड भी उपलब्ध।",
        "eligibility_criteria": {
            "category": ["BPL", "EWS", "SECC Listed", "Senior Citizen 70+"],
            "age": "Any age for SECC families; All seniors aged 70+ eligible under PM-JAY Vay Vandana"
        },
        "required_documents": [
            "Aadhaar Card (Mandatory)",
            "Ration Card / PM-JAY Family ID",
            "Age proof for 70+ applicants (Aadhaar Date of Birth)"
        ],
        "official_url": "https://beneficiary.nha.gov.in",
        "confidence": "Confirmed from Official NHA Guidelines",
        "how_to_apply": {
            "online_portal": "https://beneficiary.nha.gov.in",
            "online_steps": [
                "Visit beneficiary.nha.gov.in or download the 'Ayushman App'.",
                "Log in as 'Beneficiary' using your mobile number and OTP.",
                "Search your family using State, Scheme (PMJAY), and Aadhaar / Ration Card / Family ID.",
                "For Senior Citizens (70+): Click 'Apply for Ayushman Vay Vandana Card' under the 70+ Senior Citizen banner.",
                "Complete Aadhaar e-KYC using Face Authentication or OTP.",
                "Once approved instantly, download the digital golden PVC Ayushman Card on your phone."
            ],
            "offline_steps": [
                "Visit the 'Ayushman Mitra' desk at any nearby Government District Hospital or empaneled private hospital.",
                "Carry your original Aadhaar Card and Ration Card.",
                "The Ayushman Mitra will perform biometric fingerprint verification and print your Ayushman Card on the spot."
            ],
            "fee": "100% Free of Cost at all government centres and hospitals",
            "processing_time": "Instant to 24 hours for e-KYC verification",
            "helpline": "14555 (24x7 National Health Helpline)"
        }
    },
    {
        "id": "nfsa_ration",
        "name": "NFSA (National Food Security Act) Subsidized Food Grain",
        "name_hi": "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) राशन योजना",
        "ministry": "Ministry of Consumer Affairs, Food and Public Distribution",
        "category": "Food Security & BPL",
        "target_audience": "Priority Households (PHH) and Antyodaya Anna Yojana (AAY) low-income families",
        "benefit": "Free foodgrains (Rice at Rs 3/kg, Wheat at Rs 2/kg, coarse grains at Rs 1/kg, or 100% free under PMGKAY) - 5 kg per person/month for PHH and 35 kg per family/month for Antyodaya households.",
        "benefit_hi": "प्राथमिकता परिवारों (PHH) को प्रति व्यक्ति 5 किलोग्राम तथा अंत्योदय परिवारों को प्रति परिवार 35 किलोग्राम मुफ्त/अत्यधिक रियायती खाद्यान्न (चावल, गेहूं)।",
        "eligibility_criteria": {
            "category": ["BPL", "EWS", "Priority Household", "Antyodaya"],
            "income_max": 200000
        },
        "required_documents": [
            "Aadhaar Cards of all family members",
            "Income Certificate / BPL Survey Slip",
            "Address proof (Electricity bill/Voter ID)",
            "Bank passbook of female head of family"
        ],
        "official_url": "https://nfsa.gov.in",
        "confidence": "Confirmed from Department of Food & Public Distribution",
        "how_to_apply": {
            "online_portal": "https://nfsa.gov.in / State Food & Civil Supplies Portal",
            "online_steps": [
                "Navigate to your respective State Food & Civil Supplies portal (e.g. fcs.up.gov.in, rcms.mahafood.gov.in, ahara.kar.nic.in, or via nfsa.gov.in).",
                "Select 'Apply for New Ration Card (NFSA)'.",
                "Enter Head of Family details (mandatory female head if 18+ as per NFSA Section 12).",
                "Add Aadhaar numbers and relationships of all family members.",
                "Upload income proof, gas connection declaration, and electricity/address proof.",
                "Save the generated Form Ack Number for tracking."
            ],
            "offline_steps": [
                "Collect NFSA Form 'A' from the local Tahsildar / Taluk Supply Office / Food & Civil Supplies office or Gram Panchayat.",
                "Fill applicant and family details, attach passport photos of family members, Aadhaar photocopies, and income certificate.",
                "Submit to the Food Inspector / Gram Sevak and receive a dated acknowledgment slip."
            ],
            "fee": "Rs 5 to Rs 20 depending on State stamp rules; free under PMGKAY",
            "processing_time": "30 calendar days as per NFSA Citizen's Charter",
            "helpline": "1967 / 1800-180-2087 (National PDS Helpline)"
        }
    },
    {
        "id": "pmay_urban_gramin",
        "name": "PMAY (Pradhan Mantri Awas Yojana - Urban & Gramin)",
        "name_hi": "प्रधानमंत्री आवास योजना (PMAY - शहरी एवं ग्रामीण)",
        "ministry": "Ministry of Housing and Urban Affairs / Ministry of Rural Development",
        "category": "Housing & BPL",
        "target_audience": "Homeless, kutcha house dwellers, low-income EWS/LIG families without a pucca house in India",
        "benefit": "Financial grant of Rs 1.20 Lakh to Rs 1.30 Lakh for rural house construction, or interest subsidy up to Rs 2.67 Lakh / direct grant up to Rs 2.50 Lakh under PMAY-U 2.0.",
        "benefit_hi": "ग्रामीण क्षेत्रों में पक्के मकान निर्माण हेतु ₹1.20 लाख से ₹1.30 लाख की सीधी सहायता, अथवा शहरी क्षेत्रों में PMAY-U के तहत होम लोन पर ब्याज सब्सिडी व अनुदान।",
        "eligibility_criteria": {
            "housing": ["No Pucca House", "Kutcha House", "Homeless"],
            "income_max": 300000
        },
        "required_documents": [
            "Aadhaar Card",
            "Job Card / SECC 2011 Registration details (Gramin)",
            "Bank Account Passbook (Aadhaar linked)",
            "Land ownership paper or affidavit of no pucca house anywhere in India"
        ],
        "official_url": "https://pmaymis.gov.in",
        "confidence": "Confirmed from MoHUA / MoRD Guidelines",
        "how_to_apply": {
            "online_portal": "https://pmaymis.gov.in (Urban) / https://pmayg.nic.in (Gramin)",
            "online_steps": [
                "For Urban: Visit pmaymis.gov.in -> 'Citizen Assessment' -> 'Apply Online'.",
                "Enter your 12-digit Aadhaar number and verify name.",
                "Fill in income group (EWS: up to 3 Lakh), family head details, current address, and bank details.",
                "Declare that no family member owns a pucca house anywhere in India and submit."
            ],
            "offline_steps": [
                "For Gramin: Contact your Gram Panchayat / Gram Rozgar Sahayak to check inclusion in Awaas+ 2024 list.",
                "For Urban: Visit the Slum Clearance Board / Urban Local Body housing desk or nearest CSC Centre with Aadhaar and income proof."
            ],
            "fee": "Nil on portal; CSC fee Rs 25",
            "processing_time": "45 to 90 days including geo-tagging physical inspection",
            "helpline": "011-23063285 / 1800-11-6163 (PMAY Urban Helpdesk)"
        }
    },
    {
        "id": "eshram_card",
        "name": "e-Shram National Database of Unorganized Workers",
        "name_hi": "ई-श्रम कार्ड (असंगठित कर्मकार राष्ट्रीय डेटाबेस)",
        "ministry": "Ministry of Labour and Employment",
        "category": "Labour & Unorganized Workers",
        "target_audience": "Unorganized workers, construction labourers, domestic helpers, gig workers, auto drivers aged 16-59",
        "benefit": "Universal Universal Account Number (UAN) card for seamless delivery of social security benefits, accident insurance cover of Rs 2 Lakh (PMSBY linkage), and priority in welfare schemes.",
        "benefit_hi": "12 अंकों का यूनिवर्सल यूएएन (UAN) कार्ड, ₹2 लाख का दुर्घटना बीमा कवर तथा सरकारी कल्याणकारी योजनाओं और आपदा राहत में सीधी प्राथमिकता।",
        "eligibility_criteria": {
            "occupation": ["Construction Worker", "Domestic Worker", "Gig Worker", "Driver", "Agricultural Labour", "Tailor", "Carpenter"],
            "age_range": "16 to 59 years",
            "excludes": ["EPFO / ESIC members", "Income tax payees"]
        },
        "required_documents": [
            "Aadhaar Card (linked to Mobile)",
            "Active Savings Bank Account Number with IFSC",
            "Occupation / Skill details"
        ],
        "official_url": "https://eshram.gov.in",
        "confidence": "Confirmed from Ministry of Labour Portal",
        "how_to_apply": {
            "online_portal": "https://eshram.gov.in",
            "online_steps": [
                "Go to eshram.gov.in and click on 'Register on e-Shram'.",
                "Enter your Aadhaar-linked mobile number and captcha, then enter the OTP.",
                "Verify Aadhaar details via biometric/OTP; personal details will auto-populate.",
                "Fill in address, educational qualification, primary occupation/trade (as per NCO code list), and bank account details.",
                "Preview the self-declaration and submit to generate your 12-digit UAN e-Shram Card instantly.",
                "Download and print the UAN card."
            ],
            "offline_steps": [
                "Visit any nearby Common Service Centre (CSC) or State Seva Kendra.",
                "Provide Aadhaar number and perform biometric thumb scan.",
                "State your trade and bank account number to the operator; collect printed laminated card."
            ],
            "fee": "100% Free self-registration; CSC registration is paid by Govt",
            "processing_time": "Instant (5 minutes)",
            "helpline": "14434 (Toll-Free Ministry of Labour Helpline)"
        }
    },
    {
        "id": "nalsa_legal_aid",
        "name": "NALSA 100% Free Legal Aid & Advocate Assignment",
        "name_hi": "नालसा (NALSA) 100% मुफ्त कानूनी सहायता एवं सरकारी वकील",
        "ministry": "National Legal Services Authority (Ministry of Law and Justice)",
        "category": "Justice & Legal Aid",
        "target_audience": "All women, children, SC/ST citizens, custody undertrials, disaster victims, and citizens with annual income < Rs 3 Lakh",
        "benefit": "100% free legal assistance, free court lawyer representation in High Court / District Court / Supreme Court, free drafting of petitions, and exemption from all court fees.",
        "benefit_hi": "पूरी तरह से मुफ्त सरकारी वकील, कोर्ट केस की निशुल्क पैरवी, कानूनी नोटिस व याचिका का मुफ्त ड्राफ्ट तथा कोर्ट फीस से पूर्ण छूट।",
        "eligibility_criteria": {
            "category": ["Woman", "Child", "SC", "ST", "Undertrial Prisoner", "Disability", "BPL"],
            "income_max": 300000
        },
        "required_documents": [
            "Aadhaar Card or Photo ID",
            "Case summary / Police notice / Court summons copy",
            "Income certificate / BPL Card (Income proof NOT required for Women, Children, SC/ST, and Undertrials)"
        ],
        "official_url": "https://nalsa.gov.in",
        "confidence": "Confirmed from Legal Services Authorities Act, 1987 Section 12",
        "how_to_apply": {
            "online_portal": "https://nalsa.gov.in / https://legalaid.gov.in",
            "online_steps": [
                "Visit nalsa.gov.in or legalaid.gov.in and click on 'Apply for Legal Aid Online'.",
                "Select your State Legal Services Authority (SLSA) or District Legal Services Authority (DLSA).",
                "Enter your name, address, gender, category (e.g. Woman, SC/ST, or Low Income).",
                "Briefly describe your legal dispute (Civil, Criminal, Matrimonial, Property, Labour, Consumer).",
                "Upload photo ID and court summons/FIR copy if available.",
                "Submit; an acknowledgment tracking number is generated."
            ],
            "offline_steps": [
                "Walk into the 'Front Office' of the District Legal Services Authority (DLSA) situated inside your District Court Complex, or Taluka Legal Services Committee in Sub-Divisional Court.",
                "Meet the Legal Aid Retainer Advocate on duty.",
                "State your case and fill the single-page Free Legal Aid Application Form.",
                "A dedicated panel lawyer will be assigned to your case free of cost within 3-7 days."
            ],
            "fee": "100% Free (Covered under Legal Services Authorities Act, 1987)",
            "processing_time": "3 to 7 working days for advocate assignment",
            "helpline": "15100 (24x7 Toll-Free National Legal Aid Helpline)"
        }
    },
    {
        "id": "pm_vishwakarma",
        "name": "PM Vishwakarma Scheme (Traditional Artisans & Craftspeople)",
        "name_hi": "पीएम विश्वकर्मा योजना (पारंपरिक कारीगर एवं शिल्पकार)",
        "ministry": "Ministry of Micro, Small and Medium Enterprises (MSME)",
        "category": "Artisans & Skill Development",
        "target_audience": "Traditional artisans in 18 recognized trades (Carpenters, Blacksmiths, Potters, Cobblers, Tailors, Weavers, etc.)",
        "benefit": "PM Vishwakarma Certificate & ID, 5-7 days basic skill training with Rs 500/day stipend, Rs 15,000 tool-kit incentive, and collateral-free enterprise loan up to Rs 3 Lakh (Rs 1 Lakh in 1st tranche, Rs 2 Lakh in 2nd tranche at concessional 5% interest).",
        "benefit_hi": "विश्वकर्मा प्रमाण पत्र, 5-7 दिवसीय प्रशिक्षण (₹500/दिन वजीफा), ₹15,000 का टूलकिट वाउचर, और 5% रियायती ब्याज दर पर ₹3 लाख तक का बिना गारंटी ऋण।",
        "eligibility_criteria": {
            "occupation": ["Artisan", "Craftsman", "Carpenter", "Blacksmith", "Sculptor", "Cobbler", "Mason", "Barber", "Garland maker", "Washerman", "Tailor", "Fishing Net Maker"],
            "age_min": 18,
            "excludes": ["Existing beneficiaries of PMEGP, PM SVANidhi or Mudra loans in same family"]
        },
        "required_documents": [
            "Aadhaar Card (linked with Mobile)",
            "Bank Account Details",
            "Ration Card (for family verification)",
            "Trade/Craft declaration"
        ],
        "official_url": "https://pmvishwakarma.gov.in",
        "confidence": "Confirmed from MSME Ministry Guidelines",
        "how_to_apply": {
            "online_portal": "https://pmvishwakarma.gov.in",
            "online_steps": [
                "Visit pmvishwakarma.gov.in (registration is done via CSC with biometric authentication).",
                "Authenticate Aadhaar and mobile number.",
                "Fill in Family details using Ration Card.",
                "Select your specific trade among the 18 eligible traditional craft categories.",
                "Submit bank details for toolkit grant and stipend disbursement.",
                "The application is routed to Gram Panchayat / ULB for Level-1 stage verification."
            ],
            "offline_steps": [
                "Visit your local CSC Centre or MSME Development Institute.",
                "Provide Aadhaar and bank details for biometric registration.",
                "The Gram Pradhan / Ward Nodal Officer will verify your craftsmanship during ground verification."
            ],
            "fee": "100% Free registration funded by Central Govt",
            "processing_time": "15 to 30 days across 3-tier verification (Gram Panchayat -> District Committee -> Screening Committee)",
            "helpline": "1800-267-7777 / 011-23061500 (MSME Helpdesk)"
        }
    },
    {
        "id": "sukanya_samriddhi",
        "name": "Sukanya Samriddhi Yojana (SSY - Girl Child Savings)",
        "name_hi": "सुकन्या समृद्धि योजना (SSY - बेटी बचाओ, बेटी पढ़ाओ)",
        "ministry": "Ministry of Finance (Department of Economic Affairs)",
        "category": "Women & Children",
        "target_audience": "Parents/guardians of girl child aged below 10 years (Max 2 daughters per family)",
        "benefit": "Government-backed small savings scheme with high sovereign interest rate (currently ~8.2% p.a. compounded yearly), triple tax exemption under Section 80C (EEE status), and maturity corpus upon girl turning 21.",
        "benefit_hi": "बालिकाओं के लिए 8.2% का उच्च सरकारी ब्याज, 80C के तहत पूर्ण आयकर छूट (EEE), और 21 वर्ष की आयु पर पढ़ाई व विवाह हेतु सुरक्षित बड़ा फंड।",
        "eligibility_criteria": {
            "gender": "Female",
            "age_max": 10
        },
        "required_documents": [
            "Birth Certificate of Girl Child (Mandatory)",
            "Aadhaar & PAN Card of Parent/Guardian",
            "Address proof (Electricity bill/Voter ID)",
            "Photographs of child and guardian"
        ],
        "official_url": "https://www.indiapost.gov.in",
        "confidence": "Confirmed from India Post & RBI Guidelines",
        "how_to_apply": {
            "online_portal": "https://www.indiapost.gov.in / Authorized Public & Private Banks (SBI, PNB, IPPB)",
            "online_steps": [
                "Download the official SSY Account Opening Form (Form-1) from indiapost.gov.in or your net-banking portal.",
                "Fill in parent/guardian and girl child details.",
                "Submit online request if supported by your bank (SBI/IPPB/HDFC net banking) or visit branch."
            ],
            "offline_steps": [
                "Visit any nearby India Post Office or commercial bank branch (SBI, PNB, BoB, Canara, etc.).",
                "Fill Form-1 for Sukanya Samriddhi Account.",
                "Attach original birth certificate of the girl child, Aadhaar & PAN of parent.",
                "Deposit minimum initial opening amount of Rs 250 (cash or cheque).",
                "Collect the dedicated physical SSY Passbook on the same day."
            ],
            "fee": "Rs 250 minimum initial deposit (No processing charges)",
            "processing_time": "Same day opening at Post Office / Bank branch",
            "helpline": "1800-266-6868 (India Post Helpline)"
        }
    },
    {
        "id": "atal_pension",
        "name": "Atal Pension Yojana (APY - Guaranteed Citizen Pension)",
        "name_hi": "अटल पेंशन योजना (APY - वृद्धावस्था गारंटीड पेंशन)",
        "ministry": "PFRDA & Ministry of Finance",
        "category": "Social Security & Pension",
        "target_audience": "All Indian citizens aged 18 to 40 years holding a savings bank account",
        "benefit": "Guaranteed monthly pension of Rs 1,000, Rs 2,000, Rs 3,000, Rs 4,000 or Rs 5,000 per month starting at age 60 for lifetime, continuing to spouse upon demise, with return of pension corpus to nominees.",
        "benefit_hi": "60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह की आजीवन गारंटीड सरकारी पेंशन। मृत्यु उपरांत जीवनसाथी को समान पेंशन एवं नॉमिनी को संपूर्ण फंड वापसी।",
        "eligibility_criteria": {
            "age_range": "18 to 40 years",
            "bank_account": "Active Savings Bank Account",
            "excludes": ["Income tax payees"]
        },
        "required_documents": [
            "Aadhaar Card",
            "Savings Bank Account Passbook",
            "Nominee details"
        ],
        "official_url": "https://www.npscra.nsdl.co.in",
        "confidence": "Confirmed from PFRDA Regulations",
        "how_to_apply": {
            "online_portal": "https://enps.nsdl.co.in / Bank Internet Banking",
            "online_steps": [
                "Log into your Bank's Internet Banking or Mobile App (SBI YONO, PNB One, iMobile, etc.).",
                "Go to 'Services' -> 'Social Security Schemes' -> 'Atal Pension Yojana'.",
                "Select desired monthly pension amount (e.g. Rs 1,000 to Rs 5,000/month).",
                "Set auto-debit frequency (monthly/quarterly) and enter nominee Aadhaar details.",
                "Submit; your Permanent Retirement Account Number (PRAN) is generated immediately."
            ],
            "offline_steps": [
                "Visit the bank branch where you hold your savings account.",
                "Fill out the one-page APY Registration Form.",
                "Provide auto-debit consent from your savings account.",
                "Collect APY acknowledgment slip with PRAN number."
            ],
            "fee": "Nil; monthly contribution debited automatically (starts from Rs 42/month depending on age)",
            "processing_time": "Instant digital enrollment; 24-48 hours via branch",
            "helpline": "1800-110-069 (PFRDA APY Toll-Free)"
        }
    },
    {
        "id": "pm_mudra",
        "name": "Pradhan Mantri Mudra Yojana (PMMY Enterprise Loans)",
        "name_hi": "प्रधानमंत्री मुद्रा योजना (PMMY व्यापार व व्यवसाय लोन)",
        "ministry": "Ministry of Finance & SIDBI",
        "category": "Business & Self-Employment",
        "target_audience": "Micro/small business entrepreneurs, shopkeepers, service units, manufacturing units",
        "benefit": "Collateral-free business loans in 3 categories: Shishu (up to Rs 50,000), Kishore (Rs 50,000 to Rs 5 Lakh), and Tarun (Rs 5 Lakh up to Rs 20 Lakh under enhanced 2024 limits) with nil processing fees for Shishu.",
        "benefit_hi": "बिना किसी गारंटी के ₹50,000 (शिशु), ₹5 लाख (किशोर) और ₹20 लाख (तरुण) तक का व्यापारिक ऋण कम ब्याज दरों पर।",
        "eligibility_criteria": {
            "age_min": 18,
            "target": "Non-corporate, non-farm small/micro enterprises"
        },
        "required_documents": [
            "Aadhaar Card & PAN Card",
            "Business address and proof of establishment (Udyam Registration/Trade Licence)",
            "Last 6 months bank statement",
            "Quotation / Machinery invoice for asset loans"
        ],
        "official_url": "https://www.mudra.org.in / https://www.udyamimitra.in",
        "confidence": "Confirmed from MUDRA & SIDBI Official Portals",
        "how_to_apply": {
            "online_portal": "https://www.udyamimitra.in / https://www.psbloansin59minutes.com",
            "online_steps": [
                "Visit udyamimitra.in and click on 'Apply for Mudra Loan'.",
                "Register with name, email, and mobile OTP.",
                "Select Loan Category: Shishu (up to 50k), Kishore (50k-5L), or Tarun (5L-20L).",
                "Fill in business details, Udyam Registration Number, and required loan amount.",
                "Choose your preferred bank branch from the listed lending institutions and submit application."
            ],
            "offline_steps": [
                "Visit your commercial bank, Regional Rural Bank (RRB), or Small Finance Bank branch.",
                "Request the standard PMMY Application Form.",
                "Attach quotation of items/machinery to be purchased, KYC documents, and 6 months bank statement.",
                "The bank will process and disburse the amount to a Mudra Debit Card account."
            ],
            "fee": "Nil processing fee for Shishu loans (up to Rs 50,000)",
            "processing_time": "7 to 15 working days",
            "helpline": "1800-180-1111 / 1800-11-0001 (National Mudra Toll-Free)"
        }
    },
    {
        "id": "pmmvy_maternity",
        "name": "PMMVY (Pradhan Mantri Matru Vandana Yojana - Maternity Benefit)",
        "name_hi": "प्रधानमंत्री मातृ वंदना योजना (PMMVY मातृत्व लाभ)",
        "ministry": "Ministry of Women and Child Development",
        "category": "Women & Maternity",
        "target_audience": "Pregnant Women and Lactating Mothers (PW&LM) for first and second child (if girl child)",
        "benefit": "Direct cash transfer of Rs 5,000 for first child (in two installments) and Rs 6,000 for second child if girl child, compensation for wage loss and nutritional support directly via DBT.",
        "benefit_hi": "गर्भवती व स्तनपान कराने वाली माताओं को पहले बच्चे पर ₹5,000 तथा दूसरी संतान बालिका होने पर ₹6,000 की सीधी आर्थिक सहायता (DBT द्वारा)।",
        "eligibility_criteria": {
            "gender": "Female",
            "target": "Pregnant and Lactating Mothers (Excludes formal govt employees)"
        },
        "required_documents": [
            "Mother's Mother-Child Protection (MCP) Card registered at Anganwadi",
            "Aadhaar of Mother and Husband",
            "Aadhaar-seeded Bank Account passbook of Mother"
        ],
        "official_url": "https://pmmvy.wcd.gov.in",
        "confidence": "Confirmed from MWCD Scheme Guidelines",
        "how_to_apply": {
            "online_portal": "https://pmmvy.wcd.gov.in",
            "online_steps": [
                "Visit pmmvy.wcd.gov.in and click on 'Citizen Login'.",
                "Log in with mobile OTP.",
                "Enter Mother Child Protection (MCP) Card details, Last Menstrual Period (LMP) date, and Ante-Natal Check-up (ANC) date.",
                "Upload photo ID and bank passbook with IFSC.",
                "Submit for Anganwadi Worker (AWW) / ASHA verification."
            ],
            "offline_steps": [
                "Visit your nearest Anganwadi Centre (AWC) or Primary Health Centre (PHC).",
                "Fill Form 1A / 1B with the help of the local Anganwadi Worker (AWW) or ASHA worker.",
                "Submit copies of MCP Card, Aadhaar, and bank passbook; collect signed acknowledgment slip."
            ],
            "fee": "100% Free of Cost",
            "processing_time": "15 to 30 days from ANC registration verification",
            "helpline": "011-23382393 / 1098 (Women & Child Helpline)"
        }
    },
    {
        "id": "nsap_pension",
        "name": "NSAP National Social Assistance (Old Age, Widow & Disability Pension)",
        "name_hi": "राष्ट्रीय सामाजिक सहायता कार्यक्रम (NSAP - वृद्धावस्था, विधवा एवं दिव्यांग पेंशन)",
        "ministry": "Ministry of Rural Development",
        "category": "Social Security & Pension",
        "target_audience": "Elderly citizens (60+), Widows (40-79), and Persons with Severe Disabilities (80%+) belonging to BPL households",
        "benefit": "Monthly direct DBT pension ranging from Rs 1,000 to Rs 3,000 per month (combined Central + State assistance) credited directly to beneficiary bank/post office account.",
        "benefit_hi": "गरीबी रेखा (BPL) के बुजुर्गों (60+), विधवा महिलाओं और दिव्यांगजनों को ₹1,000 से ₹3,000 प्रति माह की नियमित मासिक पेंशन सहायता।",
        "eligibility_criteria": {
            "category": ["BPL", "Senior Citizen 60+", "Widow", "Differently Abled (Divyang)"],
            "income_max": 150000
        },
        "required_documents": [
            "Aadhaar Card",
            "BPL Ration Card / BPL Survey Number",
            "Age Certificate / Death certificate of husband (for Widow Pension)",
            "Disability Certificate from Medical Board (for Disability Pension)"
        ],
        "official_url": "https://nsap.nic.in",
        "confidence": "Confirmed from NSAP Portal & State Social Welfare Rules",
        "how_to_apply": {
            "online_portal": "https://nsap.nic.in / State Social Security Portal (e.g. SSPY / Seva Sindhu)",
            "online_steps": [
                "Visit nsap.nic.in or your State Social Welfare pension portal.",
                "Select 'Apply Online for Pension' (IGNOAPS for Old Age, IGNWPS for Widow, IGNDPS for Disability).",
                "Enter State, District, Sub-District, Gram Panchayat/Ward, and BPL Family ID.",
                "Upload Aadhaar, age proof, and bank passbook.",
                "Submit and print acknowledgment receipt."
            ],
            "offline_steps": [
                "Collect Pension Application Form from the Office of the Block Development Officer (BDO) in rural areas or Sub-Divisional Magistrate (SDM) / Municipality in urban areas.",
                "Attach BPL proof, Aadhaar, Age/Disability certificate.",
                "Submit to Social Welfare Nodal Officer for physical verification."
            ],
            "fee": "100% Free",
            "processing_time": "30 to 45 days after Gram Sabha / Municipal verification",
            "helpline": "1800-180-5117 (State Social Welfare Helpline)"
        }
    },
    {
        "id": "post_matric_scholarship",
        "name": "Post-Matric Scholarship for SC / ST / OBC & Minority Students",
        "name_hi": "पोस्ट-मैट्रिक छात्रवृत्ति योजना (SC / ST / OBC एवं अल्पसंख्यक विद्यार्थी)",
        "ministry": "Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs",
        "category": "Education & Students",
        "target_audience": "SC, ST, OBC, EBC and minority students enrolled in Class 11, 12, ITI, Diploma, Degree, or Post-Graduate courses",
        "benefit": "100% reimbursement of non-refundable tuition fees plus annual maintenance allowance up to Rs 13,500/year credited directly to student's bank account via DBT.",
        "benefit_hi": "कक्षा 11वीं से लेकर उच्च शिक्षा (डिप्लोमा, स्नातक, स्नातकोत्तर) तक की पूरी ट्यूशन फीस प्रतिपूर्ति और ₹13,500/वर्ष तक का मासिक रख-रखाव भत्ता।",
        "eligibility_criteria": {
            "category": ["SC", "ST", "OBC", "EBC", "Minority"],
            "income_max": 250000,
            "target": "Students studying in recognized colleges / universities"
        },
        "required_documents": [
            "Aadhaar Card (linked with Mobile and NPCI bank account)",
            "Caste Certificate (digital verification)",
            "Income Certificate issued by Revenue Authority (within validity)",
            "Previous Year Marksheet & College Fee Receipt / Admission Letter"
        ],
        "official_url": "https://scholarships.gov.in (National Scholarship Portal - NSP)",
        "confidence": "Confirmed from NSP Portal Guidelines",
        "how_to_apply": {
            "online_portal": "https://scholarships.gov.in (NSP) / State Scholarship Portal",
            "online_steps": [
                "Visit scholarships.gov.in (NSP) and register with One-Time Registration (OTR) via Face Auth or Aadhaar OTP.",
                "Log in using your OTR ID and password.",
                "Fill in academic details, college AISHE/DISE code, course name, and caste certificate registration number.",
                "Upload fee receipt, marksheet, and income certificate.",
                "Submit online; application automatically forwards to your College Nodal Officer for Level-1 institute verification."
            ],
            "offline_steps": [
                "Submit a printed copy of the NSP Application Form along with physical photocopies of caste, income, fee receipts, and marksheet to the Scholarship Desk of your School/College."
            ],
            "fee": "100% Free on NSP Portal",
            "processing_time": "Disbursed in academic cycles following State verification",
            "helpline": "0120-6619540 (NSP Helpdesk)"
        }
    },
    {
        "id": "janani_suraksha",
        "name": "Janani Suraksha Yojana (JSY - Institutional Delivery Assistance)",
        "name_hi": "जननी सुरक्षा योजना (JSY - सुरक्षित मातृत्व एवं संस्थागत प्रसव)",
        "ministry": "Ministry of Health and Family Welfare (MoHFW)",
        "category": "Health & Maternity",
        "target_audience": "Pregnant women belonging to BPL/SC/ST households delivering in government health centres or accredited private hospitals",
        "benefit": "Direct cash assistance of Rs 1,400 (Rural) and Rs 1,000 (Urban) in Low Performing States (LPS), plus ASHA incentive of Rs 600, with 100% free delivery, medicines, diagnostic tests, and food during stay.",
        "benefit_hi": "सरकारी अस्पताल में प्रसव कराने पर ₹1,400 (ग्रामीण) व ₹1,000 (शहरी) की सीधी नकद सहायता, मुफ्त प्रसव, दवाएं, भोजन और एंबुलेंस सुविधा।",
        "eligibility_criteria": {
            "category": ["BPL", "SC", "ST", "All rural women in LPS States"],
            "age_min": 19
        },
        "required_documents": [
            "Mother-Child Protection (MCP) Card",
            "BPL Card or SC/ST Certificate",
            "Aadhaar Card",
            "Bank Account Passbook"
        ],
        "official_url": "https://nhm.gov.in",
        "confidence": "Confirmed from National Health Mission (NHM) Rules",
        "how_to_apply": {
            "online_portal": "https://nhm.gov.in / Via District Health Office",
            "online_steps": [
                "Registration is automatically managed when registering pregnancy on the ANMOL / RCH portal through the local ANM."
            ],
            "offline_steps": [
                "Register pregnancy at your local Sub-Centre, Primary Health Centre (PHC), or Community Health Centre (CHC).",
                "Obtain the Mother and Child Protection (MCP) Card.",
                "Deliver your baby in a Government Health facility or accredited private hospital.",
                "The Medical Officer In-Charge / Staff Nurse will disburse the JSY bearer cheque or initiate DBT transfer before discharge from the hospital."
            ],
            "fee": "100% Free (All hospital stay, food, delivery and medicines are free)",
            "processing_time": "Disbursed before discharge from hospital / within 7 days",
            "helpline": "104 (National Health Toll-Free) / 108 (Free Emergency Ambulance)"
        }
    },
    {
        "id": "pmsby_insurance",
        "name": "PMSBY (Pradhan Mantri Suraksha Bima Yojana - Rs 20/year Accident Cover)",
        "name_hi": "प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY - मात्र ₹20/वर्ष में दुर्घटना बीमा)",
        "ministry": "Ministry of Finance (Department of Financial Services)",
        "category": "Insurance & Social Security",
        "target_audience": "All Indian bank savings account holders aged 18 to 70 years",
        "benefit": "Accidental death and full disability risk cover of Rs 2,00,000 (Rs 2 Lakh), and partial disability cover of Rs 1,00,000 (Rs 1 Lakh) for an annual premium of only Rs 20 per year.",
        "benefit_hi": "मात्र ₹20 प्रति वर्ष के प्रीमियम पर ₹2 लाख का दुर्घटना मृत्यु एवं पूर्ण दिव्यांगता बीमा कवर (₹1 लाख आंशिक दिव्यांगता हेतु)।",
        "eligibility_criteria": {
            "age_range": "18 to 70 years",
            "bank_account": "Active savings bank account with auto-debit consent"
        },
        "required_documents": [
            "Aadhaar Card",
            "Savings Bank Account Passbook",
            "Auto-debit Consent Form (signed or digital)"
        ],
        "official_url": "https://www.jansuraksha.gov.in",
        "confidence": "Confirmed from Jan Suraksha Portal",
        "how_to_apply": {
            "online_portal": "https://www.jansuraksha.gov.in / Bank Mobile & Internet Banking",
            "online_steps": [
                "Log into your Bank's Mobile App or Net Banking (SBI, PNB, Canara, BoB, HDFC, ICICI, etc.).",
                "Navigate to 'Insurance' -> 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)'.",
                "Select your savings account, verify nominee details, and click 'Confirm Auto-Debit'.",
                "The premium of Rs 20 is debited and the digital Certificate of Insurance (COI) is generated immediately."
            ],
            "offline_steps": [
                "Visit your bank branch or Post Office (IPPB).",
                "Ask for the 1-page PMSBY Enrollment Form.",
                "Fill in nominee details and sign the auto-debit consent.",
                "The bank clerk will link the insurance cover to your savings account instantly."
            ],
            "fee": "Rs 20 per annum auto-debited in the month of May/June each year",
            "processing_time": "Instant activation upon auto-debit consent",
            "helpline": "1800-180-1111 / 1800-110-001 (Jan Suraksha National Toll-Free)"
        }
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
        "targeted_questionnaire": questionnaire,
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
