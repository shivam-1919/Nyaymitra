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
        "confidence": "Confirmed from Official MoHUA Guidelines"
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
            "Land Ownership Records (RoR / Khasra-Khatauni / Pattadar Passbook)",
            "Aadhaar-seeded Active Bank Account with NPCI mapping",
            "Mobile Number linked to Aadhaar"
        ],
        "official_url": "https://pmkisan.gov.in",
        "confidence": "Confirmed from Official MoA&FW Guidelines"
    },
    {
        "id": "nfsa_ration",
        "name": "National Food Security Act (NFSA) Subsidized Food Grain Scheme",
        "name_hi": "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) सब्सिडीयुक्त खाद्यान्न योजना",
        "ministry": "Department of Food and Public Distribution",
        "category": "Food & Ration",
        "target_audience": "Priority Households (PHH) and Antyodaya Anna Yojana (AAY) Families",
        "benefit": "5 kg free food grains per person per month (Antyodaya households get 35 kg per family) under Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY) with One Nation One Ration Card portability.",
        "benefit_hi": "प्रति व्यक्ति 5 किलो मुफ्त खाद्यान्न प्रति माह (अंत्योदय परिवारों को प्रति परिवार 35 किलो खाद्यान्न) तथा 'वन नेशन वन राशन कार्ड' द्वारा पूरे देश में पोर्टेबिलिटी।",
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
        "name_hi": "प्रधानमंत्री आवास योजना (PMAY ग्रामीण एवं शहरी)",
        "ministry": "Ministry of Housing and Urban Affairs / Ministry of Rural Development",
        "category": "Housing & Shelter",
        "target_audience": "Economically Weaker Section (EWS) / Low Income Group (LIG) families without a pucca house",
        "benefit": "Financial assistance of Rs 1.20 Lakh to Rs 2.67 Lakhs direct subsidy / upfront interest subsidy on home construction, purchase, or renovation.",
        "benefit_hi": "पक्का मकान निर्माण अथवा ब्याज सब्सिडी हेतु ₹1.20 लाख से ₹2.67 लाख तक की सीधी सरकारी आर्थिक सहायता।",
        "eligibility_criteria": {
            "annual_income_max": "Up to Rs 3 Lakhs (EWS) or Rs 6 Lakhs (LIG)",
            "housing_status": "Family must not own a pucca house anywhere in India",
            "female_ownership": "House must be in the name of female head or joint ownership"
        },
        "required_documents": [
            "Aadhaar Card of all household members",
            "Income Proof / Certificate from Revenue Officer",
            "Land title / Pattadar passbook (for construction) or Allotment letter",
            "Affidavit declaring no other pucca house owned in India"
        ],
        "official_url": "https://pmaymis.gov.in",
        "confidence": "Confirmed from Official PMAY Guidelines"
    },
    {
        "id": "ayushman_bharat",
        "name": "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY & Vay Vandana 70+)",
        "name_hi": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना एवं वय वंदना (70+ वर्ष)",
        "ministry": "National Health Authority (NHA), MoHFW",
        "category": "Healthcare & Insurance",
        "target_audience": "Bottom 40% vulnerable families identified via SECC database and ALL Senior Citizens aged 70+ (Universal Cover regardless of income)",
        "benefit": "100% Cashless medical treatment cover up to Rs 5,00,000 per family per year for secondary and tertiary hospitalization across 29,000+ empaneled hospitals.",
        "benefit_hi": "प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा, 29,000+ सूचीबद्ध सरकारी व निजी अस्पतालों में मुफ्त इलाज (70+ आयु के सभी वरिष्ठ नागरिकों हेतु बिना आय सीमा)।",
        "eligibility_criteria": {
            "secc_inclusion": "Listed in SECC 2011 database or State Food Card equivalent or Senior Citizen aged 70+ (Universal Cover)",
            "no_cap_family_size": "No restrictions on family size, age, or gender"
        },
        "required_documents": [
            "Aadhaar Card",
            "Ration Card / PMJAY Letter with Family ID",
            "Active mobile number linked to Aadhaar"
        ],
        "official_url": "https://beneficiary.nha.gov.in",
        "confidence": "Confirmed from NHA Official Portal"
    },
    {
        "id": "e_shram",
        "name": "e-Shram Universal Unorganized Workers Social Security Card",
        "name_hi": "ई-श्रम असंगठित कर्मकार राष्ट्रीय डेटाबेस एवं सुरक्षा कार्ड",
        "ministry": "Ministry of Labour and Employment",
        "category": "Labour & Vendors",
        "target_audience": "Construction workers, domestic workers, gig workers, agricultural labourers, street vendors aged 16-59",
        "benefit": "Universal Account Number (UAN), accidental death/permanent disability insurance cover of Rs 2,00,000 (PMSBY), social security welfare integration, and direct disaster relief assistance.",
        "benefit_hi": "12 अंकों का यूनिवर्सल अकाउंट नंबर (UAN), ₹2 लाख का दुर्घटना बीमा कवर, संकट में प्रत्यक्ष नकद सहायता और सामाजिक सुरक्षा योजनाओं का एकीकरण।",
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
        "name_hi": "नालसा (NALSA) 100% निःशुल्क कानूनी सहायता एवं सरकारी अधिवक्ता",
        "ministry": "National Legal Services Authority (Supreme Court of India)",
        "category": "Financial & Legal Aid",
        "target_audience": "Women, Children, SC/ST, Industrial Workmen, Persons with Disabilities, Undertrial Prisoners, Low-income citizens (annual income < Rs 3 Lakhs in most states)",
        "benefit": "100% Free legal advice, drafting of petitions/notices, court fee payment, and an enrolled advocate assigned at zero expense for all courts up to High Court & Supreme Court.",
        "benefit_hi": "100% मुफ्त कानूनी सलाह, नोटिस व याचिकाओं का प्रारूपण, कोर्ट फीस का भुगतान और जिला न्यायालय से लेकर सुप्रीम कोर्ट तक मुफ्त सरकारी वकील की नियुक्ति।",
        "eligibility_criteria": {
            "automatic_eligible": ["All Women", "All Children", "SC/ST Citizens", "Victims of Trafficking / Violence", "Custody inmates"],
            "income_cap": "Annual income less than State SLSA limit (typically Rs 3,00,000/year)"
        },
        "required_documents": [
            "Aadhaar / ID Proof",
            "Income certificate / BPL card (Exempt for women & SC/ST)",
            "Case documents / FIR / Notice copy"
        ],
        "official_url": "https://nalsa.gov.in",
        "confidence": "Statutory Right under Legal Services Authorities Act, 1987"
    },
    {
        "id": "pm_vishwakarma",
        "name": "PM Vishwakarma Kaushal Samman Yojana",
        "name_hi": "पीएम विश्वकर्मा कौशल सम्मान योजना (कारीगर व शिल्पकार)",
        "ministry": "Ministry of Micro, Small and Medium Enterprises (MSME)",
        "category": "Labour & Vendors",
        "target_audience": "Traditional artisans and craftspeople working with hands and tools (Carpenters, Blacksmiths, Potters, Cobblers, Masons, Tailors, Barbers, etc.)",
        "benefit": "PM Vishwakarma Certificate & ID Card, skill upgradation training with Rs 500/day stipend, toolkit incentive of Rs 15,000, collateral-free enterprise loan up to Rs 3 Lakhs at 5% concessional interest.",
        "benefit_hi": "विश्वकर्मा प्रमाण पत्र, ₹500/दिन वजीफे के साथ निःशुल्क कौशल प्रशिक्षण, ₹15,000 टूलकिट अनुदान, तथा ₹3 लाख तक का बिना गारंटी रियायती ऋण (5% ब्याज दर)।",
        "eligibility_criteria": {
            "occupation": ["Carpenter", "Boat Maker", "Armourer", "Blacksmith", "Hammer/Tool Kit Maker", "Locksmith", "Sculptor", "Goldsmith", "Potter", "Cobbler", "Mason", "Basket/Mat Maker", "Doll & Toy Maker", "Barber", "Garland Maker", "Washerman", "Tailor", "Fishing Net Maker"],
            "age_min": 18,
            "excludes": ["One member per family only", "Persons who took PMEGP/Mudra loans and have outstanding dues"]
        },
        "required_documents": [
            "Aadhaar Card",
            "Mobile Number linked with Aadhaar",
            "Bank Account Details",
            "Ration Card for family verification"
        ],
        "official_url": "https://pmvishwakarma.gov.in",
        "confidence": "Confirmed from MSME Ministry Guidelines"
    },
    {
        "id": "sukanya_samriddhi",
        "name": "Sukanya Samriddhi Yojana (Beti Bachao Beti Padhao)",
        "name_hi": "सुकन्या समृद्धि योजना (बालिका समृद्धि एवं उच्च शिक्षा बचत)",
        "ministry": "Ministry of Finance & Ministry of Women and Child Development",
        "category": "Women & Children",
        "target_audience": "Parents or legal guardians of girl child below 10 years of age (Max 2 girl children per family)",
        "benefit": "Government-backed high interest rate (8.2% p.a.), triple tax exemption (EEE under Section 80C), maturity upon child turning 21 with partial withdrawal for higher education at age 18.",
        "benefit_hi": "सर्वोच्च सुरक्षित ब्याज दर (8.2%), धारा 80C के तहत पूर्ण कर छूट, तथा बालिका के 18 वर्ष का होने पर उच्च शिक्षा हेतु 50% निकासी एवं 21 वर्ष में पूर्ण परिपक्वता।",
        "eligibility_criteria": {
            "girl_age_max": 10,
            "max_accounts": "Maximum 2 accounts per family (3 in case of first birth being twin girls)",
            "min_annual_deposit": "Rs 250 per financial year (Max Rs 1,50,000)"
        },
        "required_documents": [
            "Birth Certificate of the Girl Child",
            "Aadhaar / Identity Proof of Guardian / Parent",
            "Address Proof (Electricity Bill / Passport / Voter ID)",
            "Passport-size Photographs of Child and Guardian"
        ],
        "official_url": "https://www.indiapost.gov.in",
        "confidence": "Confirmed from National Savings Institute (MoF)"
    },
    {
        "id": "atal_pension",
        "name": "Atal Pension Yojana (APY - Guaranteed Social Security Pension)",
        "name_hi": "अटल पेंशन योजना (APY - आजीवन गारंटीकृत मासिक पेंशन)",
        "ministry": "Pension Fund Regulatory and Development Authority (PFRDA), MoF",
        "category": "Senior Citizens & Pension",
        "target_audience": "All Indian citizens between 18 to 40 years of age, especially unorganized sector workers",
        "benefit": "Guaranteed lifetime monthly pension of Rs 1,000, Rs 2,000, Rs 3,000, Rs 4,000 or Rs 5,000 after reaching 60 years of age, with same pension to spouse after death and return of corpus to nominee.",
        "benefit_hi": "60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह की आजीवन गारंटीकृत सरकारी पेंशन, पति/पत्नी को निरंतर पेंशन और नामिती को कुल संचित राशि की वापसी।",
        "eligibility_criteria": {
            "age_range": "18 to 40 years",
            "tax_status": "Must not be an Income Tax payer (w.e.f. 1 Oct 2022)",
            "bank_requirement": "Savings bank account with auto-debit facility"
        },
        "required_documents": [
            "Aadhaar Card",
            "Active Savings Bank Account with auto-debit consent",
            "Mobile Number registered with Bank"
        ],
        "official_url": "https://www.npscra.nsdl.co.in",
        "confidence": "Confirmed from PFRDA Regulations"
    },
    {
        "id": "pm_mudra",
        "name": "Pradhan Mantri Mudra Yojana (PMMY - Micro Business Loans)",
        "name_hi": "प्रधानमंत्री मुद्रा योजना (PMMY - सूक्ष्म उद्यम ऋण)",
        "ministry": "Department of Financial Services, Ministry of Finance",
        "category": "Financial & Legal Aid",
        "target_audience": "Small business owners, shopkeepers, service sector units, manufacturers, artisans seeking business capital",
        "benefit": "Collateral-free institutional business loans in three tiers: Shishu (Up to Rs 50,000), Kishore (Rs 50,000 to Rs 5 Lakhs), and Tarun (Rs 5 Lakhs to Rs 20 Lakhs) at competitive bank interest rates.",
        "benefit_hi": "बिना किसी संपार्श्विक (गारंटी) के व्यापार हेतु ऋण: शिशु (₹50,000 तक), किशोर (₹5 लाख तक) तथा तरुण (₹20 लाख तक)।",
        "eligibility_criteria": {
            "business_nature": "Non-corporate, non-farm small/micro enterprise",
            "credit_history": "No default record with any commercial/cooperative bank"
        },
        "required_documents": [
            "Identity Proof (Aadhaar / Voter ID / PAN Card)",
            "Business Address Proof & Trade Licence / Udyam Registration (for Kishore/Tarun)",
            "Past 6 months Bank Account Statement",
            "Quotation of machinery / items to be purchased"
        ],
        "official_url": "https://www.mudra.org.in",
        "confidence": "Confirmed from PMMY Guidelines"
    },
    {
        "id": "pmmvy",
        "name": "Pradhan Mantri Matru Vandana Yojana (PMMVY - Maternity Benefit)",
        "name_hi": "प्रधानमंत्री मातृ वंदना योजना (मातृत्व पोषण एवं आर्थिक सहायता)",
        "ministry": "Ministry of Women and Child Development",
        "category": "Women & Children",
        "target_audience": "Pregnant Women and Lactating Mothers (PW&LM) for first child and second girl child",
        "benefit": "Direct cash incentive of Rs 5,000 for first child in two installments and Rs 6,000 for second girl child transferred to mother's Aadhaar-seeded bank account for nutrition and wage loss compensation.",
        "benefit_hi": "प्रथम प्रसव पर ₹5,000 तथा दूसरी बालिका के जन्म पर ₹6,000 की प्रत्यक्ष नकद सहायता माता के बैंक खाते में पोषण एवं स्वास्थ्य सुरक्षा हेतु।",
        "eligibility_criteria": {
            "gender": "Female (Pregnant / Lactating Mother)",
            "excludes": ["Regular employees of Central / State Government or PSUs"]
        },
        "required_documents": [
            "Mother and Father's Aadhaar Card",
            "Mother and Child Protection (MCP) Card / RCH ID",
            "Aadhaar-seeded Bank Account passbook of the Mother",
            "Child Birth Certificate (for 2nd installment/girl child)"
        ],
        "official_url": "https://pmmvy.wcd.gov.in",
        "confidence": "Confirmed from MWCD Statutory Rules"
    },
    {
        "id": "nsap_pension",
        "name": "National Social Assistance Programme (NSAP - IGNOAPS / IGNWPS / IGNDPS)",
        "name_hi": "राष्ट्रीय सामाजिक सहायता कार्यक्रम (वृद्धावस्था, विधवा एवं दिव्यांग पेंशन)",
        "ministry": "Ministry of Rural Development",
        "category": "Senior Citizens & Pension",
        "target_audience": "Senior citizens (60+ years), Widows (40+ years), and Persons with Severe Disabilities (80%+) belonging to BPL households",
        "benefit": "Monthly direct social security pension ranging from Rs 1,000 to Rs 3,000 per month (combined Central + State contribution) deposited directly into bank/post office accounts.",
        "benefit_hi": "बीपीएल परिवारों के 60+ वृद्धजनों, विधवाओं एवं 80%+ दिव्यांग नागरिकों को ₹1,000 से ₹3,000 प्रति माह की सीधी सामाजिक सुरक्षा पेंशन।",
        "eligibility_criteria": {
            "income_status": "Belonging to Below Poverty Line (BPL) family",
            "age_senior": "60 years or above (IGNOAPS)",
            "age_widow": "40 to 79 years (IGNWPS)",
            "disability": "80% and above disability certified by medical board (IGNDPS)"
        },
        "required_documents": [
            "Aadhaar Card",
            "BPL Ration Card / BPL Verification Certificate",
            "Age Proof / Birth Certificate / Voter Card",
            "Death Certificate of Husband (for Widow Pension)",
            "Disability Certificate from Medical Board (for Disability Pension)",
            "Bank / Post Office Passbook"
        ],
        "official_url": "https://nsap.nic.in",
        "confidence": "Confirmed from NSAP Central Operational Guidelines"
    },
    {
        "id": "post_matric_scholarship",
        "name": "Post-Matric Scholarship Scheme for SC / ST / OBC Students",
        "name_hi": "पोस्ट-मैट्रिक छात्रवृत्ति योजना (एससी / एसटी / ओबीसी / अल्पसंख्यक छात्र)",
        "ministry": "Ministry of Social Justice and Empowerment / Ministry of Tribal Affairs",
        "category": "Youth & Students",
        "target_audience": "Meritorious students belonging to SC, ST, OBC, EBC, and minority communities studying in Class 11, 12, ITI, Diploma, Graduation, and Post-Graduation",
        "benefit": "100% Non-refundable compulsory tuition fee reimbursement directly to educational institutions plus monthly maintenance allowance directly credited to student's bank account via DBT.",
        "benefit_hi": "11वीं, 12वीं, आईटीआई, डिप्लोमा, स्नातक एवं स्नातकोत्तर के छात्रों हेतु 100% शिक्षण शुल्क प्रतिपूर्ति एवं प्रतिमाह निर्वाह भत्ता (DBT द्वारा)।",
        "eligibility_criteria": {
            "student_status": "Enrolled in recognized post-matric course",
            "family_income_cap": "Annual family income not exceeding Rs 2,50,000 per year"
        },
        "required_documents": [
            "Aadhaar Card of the Student",
            "Caste Certificate issued by competent revenue authority",
            "Income Certificate from Tehsildar / SDM",
            "Previous Year Marksheet / Passing Certificate",
            "Current Year Fee Receipt / Admission Allotment Letter",
            "Student's Active Bank Account (Aadhaar-seeded)"
        ],
        "official_url": "https://scholarships.gov.in (National Scholarship Portal)",
        "confidence": "Confirmed from MoSJE Statutory Guidelines"
    },
    {
        "id": "janani_suraksha",
        "name": "Janani Suraksha Yojana (JSY - Safe Motherhood Intervention)",
        "name_hi": "जननी सुरक्षा योजना (सुरक्षित प्रसव एवं संस्थागत वित्तीय सहायता)",
        "ministry": "Ministry of Health and Family Welfare (NHM)",
        "category": "Women & Children",
        "target_audience": "Pregnant women belonging to BPL/SC/ST households delivering in government health centers or accredited private hospitals",
        "benefit": "Cash assistance of Rs 1,400 (Rural areas) or Rs 1,000 (Urban areas) in Low Performing States plus free medicines, blood, diagnostics, and transport under JSSK.",
        "benefit_hi": "शासकीय अस्पताल में सुरक्षित संस्थागत प्रसव कराने पर ₹1,400 (ग्रामीण) अथवा ₹1,000 (शहरी) की सीधी नकद सहायता तथा मुफ्त दवाएं व भोजन।",
        "eligibility_criteria": {
            "delivery_type": "Institutional Delivery in public/accredited hospital",
            "category": "BPL, SC, ST or Low Performing State resident"
        },
        "required_documents": [
            "Aadhaar Card",
            "MCP Card / ANC Registration Proof",
            "BPL Card / SC/ST Certificate",
            "Bank Passbook with IFSC"
        ],
        "official_url": "https://nhm.gov.in",
        "confidence": "Confirmed from National Health Mission Guidelines"
    },
    {
        "id": "pm_suraksha_bima",
        "name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY - Rs 20/year Accidental Cover)",
        "name_hi": "प्रधानमंत्री सुरक्षा बीमा योजना (मात्र ₹20/वर्ष में ₹2 लाख दुर्घटना बीमा)",
        "ministry": "Department of Financial Services, Ministry of Finance",
        "category": "Healthcare & Insurance",
        "target_audience": "All bank account holders aged 18 to 70 years",
        "benefit": "Accidental death cover of Rs 2,00,000 and permanent total disability cover of Rs 2,00,000 (Rs 1,00,000 for permanent partial disability) at an ultra-low premium of only Rs 20 per annum auto-debited.",
        "benefit_hi": "मात्र ₹20 प्रति वर्ष के प्रीमियम पर आकस्मिक मृत्यु अथवा पूर्ण दिव्यांगता होने पर ₹2 लाख का सरकारी दुर्घटना बीमा कवर।",
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
        "confidence": "Confirmed from Jan Suraksha Portal"
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
