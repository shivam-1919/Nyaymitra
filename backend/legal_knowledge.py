"""
NyayMitra Legal Knowledge Base
Contains Indian Penal Code (IPC) <-> Bharatiya Nyaya Sanhita (BNS 2023) mappings,
citizen rights handbook, emergency legal directories, and standard legal drafting structures.
"""

from typing import List, Dict, Any, Optional

# BNS (Bharatiya Nyaya Sanhita) vs IPC Comprehensive Mapping
STATUTES_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "bns_318",
        "ipc_section": "420",
        "bns_section": "318(4)",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Cheating and dishonestly inducing delivery of property",
        "category": "Property & Financial Crimes",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Magistrate of First Class",
        "punishment": "Imprisonment up to 7 years and fine",
        "ipc_reference": "Replaces Section 420 IPC",
        "summary": "Covers cheating, deceiving any person to deliver property, or inducing someone to alter/destroy valuable security.",
        "key_changes": "Modernized definition including digital fraud and electronic deceit mechanisms."
    },
    {
        "id": "bns_103",
        "ipc_section": "302",
        "bns_section": "103(1)",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Punishment for Murder",
        "category": "Offences Against Human Body",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Court of Session",
        "punishment": "Death or imprisonment for life, and fine",
        "ipc_reference": "Replaces Section 302 IPC",
        "summary": "Prescribes punishment for intentionally causing death of a human being.",
        "key_changes": "Section 103(2) explicitly introduces severe penalties for murder committed by a group of five or more on grounds of race, caste, sex, place of birth, or religion (mob lynching)."
    },
    {
        "id": "bns_106",
        "ipc_section": "304A",
        "bns_section": "106",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Causing death by negligence (Hit and Run / Rash Driving)",
        "category": "Offences Against Human Body",
        "bailable": "Bailable (106(1)) / Non-Bailable (106(2))",
        "cognizable": "Cognizable",
        "court": "Magistrate of First Class",
        "punishment": "Up to 5 years (106(1)) or up to 10 years + fine if offender escapes without reporting (106(2))",
        "ipc_reference": "Replaces Section 304A IPC",
        "summary": "Causing death by rash or negligent act not amounting to culpable homicide, including vehicular hit-and-run.",
        "key_changes": "Stringent provisions for drivers who flee without reporting to police or medical officer."
    },
    {
        "id": "bns_303",
        "ipc_section": "379",
        "bns_section": "303(2)",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Punishment for Theft",
        "category": "Property Crimes",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Any Magistrate",
        "punishment": "Imprisonment up to 3 years, or fine, or both (Community service for petty theft under Rs 5,000 upon first conviction)",
        "ipc_reference": "Replaces Section 379 IPC",
        "summary": "Dishonest taking of movable property out of possession of any person without consent.",
        "key_changes": "Introduces Community Service as an alternative punishment for petty theft under Rs 5,000 for first-time offenders."
    },
    {
        "id": "bns_356",
        "ipc_section": "499 / 500",
        "bns_section": "356",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Defamation",
        "category": "Offences Against Reputation",
        "bailable": "Bailable",
        "cognizable": "Non-Cognizable",
        "court": "Court of Session / Magistrate",
        "punishment": "Simple imprisonment up to 2 years, or fine, or both, or Community Service",
        "ipc_reference": "Replaces Sections 499 & 500 IPC",
        "summary": "Making or publishing defamatory imputations concerning any person intending to harm reputation.",
        "key_changes": "Expressly recognizes Community Service as a viable penalty option."
    },
    {
        "id": "bns_63",
        "ipc_section": "376",
        "bns_section": "63 / 64",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Rape and aggravated sexual assault",
        "category": "Offences Against Women",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Court of Session",
        "punishment": "Rigorous imprisonment not less than 10 years, up to life imprisonment & fine",
        "ipc_reference": "Replaces Section 375 & 376 IPC",
        "summary": "Sexual offences against women, with enhanced provisions for minors and custodial abuse.",
        "key_changes": "Consolidated and reorganized women protection clauses with stringent minimum sentences."
    },
    {
        "id": "bns_152",
        "ipc_section": "124A",
        "bns_section": "152",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Act endangering sovereignty, unity and integrity of India",
        "category": "Offences Against the State",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Court of Session",
        "punishment": "Imprisonment for life or up to 7 years, and fine",
        "ipc_reference": "Replaces colonial Sedition (Section 124A IPC)",
        "summary": "Purposely excites secession, armed rebellion, subversive activities, or endangers sovereignty.",
        "key_changes": "Colonial 'Sedition' concept discarded in favor of acts directly threatening national integrity and sovereignty."
    },
    {
        "id": "bns_115",
        "ipc_section": "323",
        "bns_section": "115(2)",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Voluntarily causing hurt",
        "category": "Offences Against Human Body",
        "bailable": "Bailable",
        "cognizable": "Non-Cognizable",
        "court": "Any Magistrate",
        "punishment": "Imprisonment up to 1 year, or fine up to Rs 10,000, or both",
        "ipc_reference": "Replaces Section 323 IPC",
        "summary": "Causing bodily pain, disease, or infirmity to any person intentionally.",
        "key_changes": "Updated fine limits and streamlined dispute settlement."
    },
    {
        "id": "bns_316",
        "ipc_section": "406",
        "bns_section": "316",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Criminal breach of trust",
        "category": "Property Crimes",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Magistrate of First Class",
        "punishment": "Imprisonment up to 5 years, or fine, or both",
        "ipc_reference": "Replaces Section 406 IPC",
        "summary": "Dishonest misappropriation or conversion of property entrusted to a person.",
        "key_changes": "Enhanced standard penalty from 3 years to up to 5 years."
    },
    {
        "id": "bns_351",
        "ipc_section": "506",
        "bns_section": "351(2)",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Criminal Intimidation",
        "category": "Offences Against Public Peace",
        "bailable": "Bailable",
        "cognizable": "Non-Cognizable",
        "court": "Any Magistrate",
        "punishment": "Imprisonment up to 2 years, or fine, or both (Up to 7 years if threat is to cause death or grievous hurt)",
        "ipc_reference": "Replaces Section 506 IPC",
        "summary": "Threatening another person with injury to person, reputation, or property.",
        "key_changes": "Clarified cyber-harassment and electronic intimidation scopes."
    },
    {
        "id": "bns_111",
        "ipc_section": "New Provision",
        "bns_section": "111",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Organised Crime",
        "category": "Organised Crime & Syndicate",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Special Court / Court of Session",
        "punishment": "Death or life imprisonment + fine not less than Rs 10 Lakhs (if death caused), or 5 years to life imprisonment",
        "ipc_reference": "Newly codified in central law (akin to MCOCA/organized crime laws)",
        "summary": "Continuing unlawful activity including extortion, contract killing, land grabbing, cybercrimes done as member of a crime syndicate.",
        "key_changes": "First time central penal code comprehensively defines and punishes Organized Crime Syndicates."
    },
    {
        "id": "bns_113",
        "ipc_section": "New Provision",
        "bns_section": "113",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Terrorist Act",
        "category": "National Security",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Court of Session",
        "punishment": "Death or imprisonment for life and fine",
        "ipc_reference": "Integrated directly into general criminal code",
        "summary": "Acts threatening unity, integrity, security of India or striking terror in people.",
        "key_changes": "Incorporated into central general penal code alongside specialized UAPA."
    },
    {
        "id": "bns_85",
        "ipc_section": "498A",
        "bns_section": "85 / 86",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Husband or relative of husband subjecting woman to cruelty",
        "category": "Offences Against Women",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Magistrate of First Class",
        "punishment": "Imprisonment up to 3 years and fine",
        "ipc_reference": "Replaces Section 498A IPC",
        "summary": "Subjecting a married woman to physical or mental cruelty or unlawful dowry harassment.",
        "key_changes": "Section 86 provides clear statutory definition of cruelty (physical and mental harm)."
    },
    {
        "id": "bns_308",
        "ipc_section": "384",
        "bns_section": "308(2)",
        "act_name": "Bharatiya Nyaya Sanhita, 2023",
        "title": "Extortion (Blackmail / Demand under Fear)",
        "category": "Property Crimes",
        "bailable": "Non-Bailable",
        "cognizable": "Cognizable",
        "court": "Magistrate of First Class",
        "punishment": "Imprisonment up to 7 years, or fine, or both",
        "ipc_reference": "Replaces Section 384 IPC",
        "summary": "Intentionally putting any person in fear of injury and inducing them to deliver property or valuable security.",
        "key_changes": "Higher penalties for extortion committed through digital channels or organized networks."
    }
]

# Verified Emergency Legal Helplines in India
EMERGENCY_HELPLINES: List[Dict[str, Any]] = [
    {
        "service": "NALSA Free Legal Aid",
        "number": "15100",
        "hours": "24x7 Toll Free",
        "description": "National Legal Services Authority - Free legal assistance for marginalized citizens, women, SC/ST, custody undertrials.",
        "authority": "Supreme Court of India / NALSA",
        "category": "Free Legal Aid"
    },
    {
        "service": "National Cyber Crime Helpline",
        "number": "1930",
        "hours": "24x7 Helpline",
        "description": "Report financial cyber frauds within the 'Golden Hour' to freeze fraudulent bank transfers immediately.",
        "authority": "Indian Cyber Crime Coordination Centre (I4C), MHA",
        "category": "Cyber Crime"
    },
    {
        "service": "National Commission for Women (NCW)",
        "number": "7827170170",
        "hours": "24x7 Helpline & WhatsApp",
        "description": "Immediate legal help, shelter, and police assistance for women facing violence or harassment.",
        "authority": "NCW, Govt. of India",
        "category": "Women Safety"
    },
    {
        "service": "National Consumer Helpline (NCH)",
        "number": "1915",
        "hours": "8:00 AM to 8:00 PM (Mon-Sat)",
        "description": "Lodge complaints against e-commerce sellers, fraudulent products, warranty denial, or unfair trade practices.",
        "authority": "Ministry of Consumer Affairs",
        "category": "Consumer Rights"
    },
    {
        "service": "National Emergency Number",
        "number": "112",
        "hours": "24x7 Pan-India",
        "description": "Unified emergency response for Police, Fire, Ambulance, and Disaster management.",
        "authority": "Govt. of India",
        "category": "Emergency"
    },
    {
        "service": "Childline India",
        "number": "1098",
        "hours": "24x7 Toll Free",
        "description": "Emergency care and protection for children in distress or facing abuse.",
        "authority": "Ministry of Women & Child Development",
        "category": "Child Protection"
    },
    {
        "service": "Senior Citizen National Helpline (Elderline)",
        "number": "14567",
        "hours": "8:00 AM to 8:00 PM",
        "description": "Legal advice, pension assistance, rescue, and emotional support for senior citizens.",
        "authority": "Ministry of Social Justice and Empowerment",
        "category": "Elder Care"
    }
]

# Citizen Legal Rights Knowledge Base
CITIZEN_RIGHTS_GUIDES: List[Dict[str, Any]] = [
    {
        "id": "arrest_rights",
        "title": "Your Fundamental Rights Upon Arrest (D.K. Basu Guidelines)",
        "icon": "shield-alert",
        "category": "Criminal Law & Liberty",
        "points": [
            "Right to know the exact grounds of arrest and whether the offence is bailable (Sec 50 CrPC / Sec 47 BNSS).",
            "Arrest Memo: Police must prepare a written arrest memo counter-signed by a respectable family member or witness.",
            "Right to inform a family member, friend, or relative immediately within 8-12 hours.",
            "Right to consult and be defended by a legal practitioner of your choice (Article 22(1) Constitution of India).",
            "Right to medical examination every 48 hours in custody by an authorized medical officer.",
            "Mandatory presentation before the nearest Judicial Magistrate within 24 hours of arrest (excluding travel time)."
        ],
        "tips": "Women cannot be arrested between sunset and sunrise except under exceptional circumstances with prior judicial magistrate permission and presence of female police officers."
    },
    {
        "id": "traffic_police",
        "title": "Your Rights During Traffic Police Vehicle Checks",
        "icon": "car",
        "category": "Public Interactions",
        "points": [
            "A police officer must be in uniform wearing a visible name tag / buckle number.",
            "Only an officer of the rank of Sub-Inspector (SI) or above is authorized to issue spot fines exceeding standard limits.",
            "Police cannot confiscate vehicle keys from the ignition forcefully.",
            "DigiLocker and mParivahan digital copies of DL, RC, Insurance, and PUC are legally valid under IT Act and Motor Vehicles Rules.",
            "Women cannot be compelled to alight from vehicle after dark for minor traffic violations."
        ],
        "tips": "Always insist on a proper E-Challan receipt or printed government challan slip for any compounding fine paid."
    },
    {
        "id": "consumer_refunds",
        "title": "Consumer Protection Rights (Defective Goods & E-Commerce)",
        "icon": "shopping-bag",
        "category": "Consumer Law",
        "points": [
            "Right to replacement, repair, or full refund for defective goods under Consumer Protection Act 2019.",
            "E-commerce platforms cannot unilaterally cancel orders after confirmation without valid cause or impose unreasonable cancellation fees.",
            "Unfair contract terms (e.g. 'No refund under any circumstance') are void under Section 2(46) of the Consumer Protection Act.",
            "You can file an E-Daakhil consumer complaint online without needing a lawyer for claims up to Rs 50 Lakhs in District Consumer Commission."
        ],
        "tips": "Always preserve order invoices, unboxing videos, customer support chat logs, and delivery receipts as admissible digital evidence."
    },
    {
        "id": "tenancy_rights",
        "title": "Tenant & Landlord Dispute Protections",
        "icon": "home",
        "category": "Civil & Property",
        "points": [
            "Landlord cannot arbitrarily cut off essential utility services (electricity, water) to force eviction.",
            "Landlord must give at least 24 to 48 hours prior notice before visiting the rented premises, respecting tenant privacy.",
            "Eviction requires a legal notice followed by due legal process through Rent Court / Civil Court.",
            "Security deposit must be refunded upon handover of vacant possession minus mutually agreed reasonable repairs."
        ],
        "tips": "Always register rent agreements exceeding 11 months under Registration Act, 1908 to ensure statutory legal protection."
    },
    {
        "id": "cyber_fraud",
        "title": "Instant Action SOP for Cyber & UPI Financial Frauds",
        "icon": "lock",
        "category": "Cyber & Banking",
        "points": [
            "Call 1930 immediately within the first 1-2 hours (Golden Hour) so the cyber cell can trigger bank account lien freeze.",
            "File an online formal cyber complaint at cybercrime.gov.in with transaction IDs, bank statements, and scammer numbers.",
            "Notify your bank branch within 3 days: Under RBI guidelines on Unauthorized Electronic Banking Transactions (2017), zero liability applies if fraud reported within 3 days without customer negligence.",
            "Block your compromised ATM card, UPI PIN, and internet banking credentials immediately."
        ],
        "tips": "Never share OTP, PIN, remote desktop apps (AnyDesk, TeamViewer) with anyone posing as bank or KYC customer support."
    }
]

# Legal Document Templates Definition
DRAFT_TEMPLATES: Dict[str, Dict[str, Any]] = {
    "cheque_bounce_notice": {
        "title": "Statutory Legal Notice for Cheque Dishonour (Sec 138 NI Act)",
        "act": "Section 138 of the Negotiable Instruments Act, 1881",
        "description": "Mandatory 15-day statutory notice sent to the drawer of a bounced cheque before filing a criminal complaint.",
        "fields": [
            {"id": "sender_name", "label": "Payee / Complainant Full Name", "type": "text", "required": True, "placeholder": "e.g. Ramesh Kumar"},
            {"id": "sender_address", "label": "Payee Full Address & Contact", "type": "textarea", "required": True, "placeholder": "e.g. Flat 302, Green Enclave, Sector 14, Gurugram, Haryana - 122001"},
            {"id": "recipient_name", "label": "Drawer / Accused Full Name / Company", "type": "text", "required": True, "placeholder": "e.g. Suresh Sharma, Director ABC Pvt Ltd"},
            {"id": "recipient_address", "label": "Drawer Full Address", "type": "textarea", "required": True, "placeholder": "e.g. 45 Commercial Street, Connaught Place, New Delhi - 110001"},
            {"id": "cheque_number", "label": "Cheque Number", "type": "text", "required": True, "placeholder": "e.g. 048291"},
            {"id": "cheque_date", "label": "Cheque Date", "type": "date", "required": True},
            {"id": "cheque_amount", "label": "Cheque Amount (in INR)", "type": "number", "required": True, "placeholder": "e.g. 250000"},
            {"id": "bank_name", "label": "Drawee Bank Name & Branch", "type": "text", "required": True, "placeholder": "e.g. HDFC Bank, K.G. Marg Branch, New Delhi"},
            {"id": "return_memo_date", "label": "Bank Return Memo Date", "type": "date", "required": True},
            {"id": "return_reason", "label": "Reason for Dishonour (As per Memo)", "type": "select", "options": ["Funds Insufficient", "Account Closed", "Payment Stopped by Drawer", "Signatures Differ", "Exceeds Arrangement"], "required": True},
            {"id": "transaction_context", "label": "Underlying Transaction / Legally Enforceable Debt", "type": "textarea", "required": True, "placeholder": "e.g. Friendly loan advanced on 10th Jan 2024 / Supply of construction materials under Invoice #104"}
        ]
    },
    "rti_application": {
        "title": "RTI Application under Section 6(1) of RTI Act 2005",
        "act": "Right to Information Act, 2005",
        "description": "Standard citizen application seeking public information from Public Information Officers (PIO).",
        "fields": [
            {"id": "applicant_name", "label": "Applicant Full Name", "type": "text", "required": True, "placeholder": "e.g. Priya Sundaram"},
            {"id": "applicant_address", "label": "Applicant Postal Address & Phone", "type": "textarea", "required": True, "placeholder": "e.g. 12B Lake View Road, Indiranagar, Bengaluru - 560038"},
            {"id": "public_authority", "label": "Public Authority / Department", "type": "text", "required": True, "placeholder": "e.g. Bruhat Bengaluru Mahanagara Palike (BBMP) / Municipal Corporation"},
            {"id": "pio_designation", "label": "Designation of PIO", "type": "text", "required": True, "placeholder": "e.g. Public Information Officer (PIO) & Executive Engineer (Roads)"},
            {"id": "pio_office_address", "label": "Office Address of PIO", "type": "textarea", "required": True, "placeholder": "e.g. BBMP Head Office, Corporation Circle, Bengaluru - 560002"},
            {"id": "subject_matter", "label": "Subject Matter of Information", "type": "text", "required": True, "placeholder": "e.g. Road repair tenders and budget expenditure for 100ft Road during FY 2023-24"},
            {"id": "specific_questions", "label": "Specific Questions / Data Requested (Numbered)", "type": "textarea", "required": True, "placeholder": "1. Provide certified copy of work order.\n2. Date of completion and contractor name.\n3. Inspection reports by quality assurance officers."},
            {"id": "time_period", "label": "Period to which information relates", "type": "text", "required": True, "placeholder": "e.g. 01 April 2023 to 31 March 2024"},
            {"id": "bpl_status", "label": "Belong to Below Poverty Line (BPL)?", "type": "select", "options": ["No (Rs 10 application fee attached)", "Yes (BPL Card Attached - Fee Exempted)"], "required": True}
        ]
    },
    "consumer_complaint_notice": {
        "title": "Legal Notice for Deficient Service & Consumer Grievance",
        "act": "Consumer Protection Act, 2019",
        "description": "Formal pre-litigation legal notice served to manufacturer, dealer, or service provider before approaching Consumer Disputes Redressal Commission.",
        "fields": [
            {"id": "complainant_name", "label": "Consumer / Claimant Name", "type": "text", "required": True, "placeholder": "e.g. Ananya Roy"},
            {"id": "complainant_address", "label": "Consumer Address & Email", "type": "textarea", "required": True, "placeholder": "e.g. Tower 4, Flat 1204, Riverdale Apts, Kolkata - 700029"},
            {"id": "company_name", "label": "Opposite Party (Company / Seller)", "type": "text", "required": True, "placeholder": "e.g. QuickElectro India Pvt. Ltd. & Authorized Dealer"},
            {"id": "company_address", "label": "Company Registered Address", "type": "textarea", "required": True, "placeholder": "e.g. Cyber Park, Building 8, Sector 44, Gurugram - 122003"},
            {"id": "product_service", "label": "Product / Service Purchased", "type": "text", "required": True, "placeholder": "e.g. Smart 4K OLED TV Model X900"},
            {"id": "purchase_date", "label": "Date of Purchase / Booking", "type": "date", "required": True},
            {"id": "invoice_number", "label": "Invoice / Order Number", "type": "text", "required": True, "placeholder": "e.g. INV-2024-88492"},
            {"id": "amount_paid", "label": "Amount Paid (in INR)", "type": "number", "required": True, "placeholder": "e.g. 74999"},
            {"id": "defect_description", "label": "Details of Defect / Deficiency in Service", "type": "textarea", "required": True, "placeholder": "Display screen stopped functioning within 15 days; technician refused replacement citing frivolous warranty exclusion."},
            {"id": "compensation_demanded", "label": "Relief Demanded (Refund / Replacement / Damages)", "type": "textarea", "required": True, "placeholder": "Full refund of Rs 74,999 with 18% interest + Rs 25,000 for mental agony and litigation expenses."}
        ]
    },
    "rental_agreement": {
        "title": "Residential Tenancy / Lease Agreement",
        "act": "Model Tenancy Act & State Rent Control Legislations",
        "description": "Comprehensive residential lease deed with standard security deposit, lock-in period, and maintenance clauses.",
        "fields": [
            {"id": "landlord_name", "label": "Lessor (Landlord) Name", "type": "text", "required": True, "placeholder": "e.g. Vikramaditya Sen"},
            {"id": "landlord_address", "label": "Landlord Permanent Address", "type": "textarea", "required": True, "placeholder": "e.g. 88 Park Street, Kolkata - 700016"},
            {"id": "tenant_name", "label": "Lessee (Tenant) Name", "type": "text", "required": True, "placeholder": "e.g. Rohit Verma"},
            {"id": "tenant_permanent_address", "label": "Tenant Permanent Address", "type": "textarea", "required": True, "placeholder": "e.g. 14 Subhash Nagar, Dehradun, Uttarakhand - 248001"},
            {"id": "property_address", "label": "Rented Premises Complete Address", "type": "textarea", "required": True, "placeholder": "e.g. Flat No. 402, 4th Floor, Skyline Heights, Hinjewadi Phase 1, Pune - 411057"},
            {"id": "lease_start_date", "label": "Tenancy Commencement Date", "type": "date", "required": True},
            {"id": "lease_duration_months", "label": "Tenancy Duration (in Months)", "type": "number", "required": True, "placeholder": "11"},
            {"id": "monthly_rent", "label": "Monthly Rent Amount (INR)", "type": "number", "required": True, "placeholder": "e.g. 28000"},
            {"id": "security_deposit", "label": "Refundable Security Deposit (INR)", "type": "number", "required": True, "placeholder": "e.g. 75000"},
            {"id": "notice_period_days", "label": "Notice Period for Termination (Days)", "type": "number", "required": True, "placeholder": "30"},
            {"id": "rent_due_day", "label": "Rent Due Day of Each Month", "type": "number", "required": True, "placeholder": "5"}
        ]
    },
    "police_complaint_fir": {
        "title": "Police Complaint / Request for Registration of FIR",
        "act": "Section 154 CrPC / Section 173 Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)",
        "description": "Formal written complaint addressed to Station House Officer (SHO) describing cognizable offence.",
        "fields": [
            {"id": "complainant_name", "label": "Complainant Full Name", "type": "text", "required": True, "placeholder": "e.g. Deepak Joshi"},
            {"id": "complainant_contact", "label": "Contact Number & Address", "type": "textarea", "required": True, "placeholder": "e.g. Phone: +91-9876543210, H.No 44, Civil Lines, Jaipur - 302006"},
            {"id": "police_station", "label": "Police Station Name & District", "type": "text", "required": True, "placeholder": "e.g. Police Station Sadar, District Jaipur"},
            {"id": "incident_date_time", "label": "Date and Time of Incident", "type": "text", "required": True, "placeholder": "e.g. 14 August 2024 at approximately 9:30 PM"},
            {"id": "incident_location", "label": "Exact Place of Occurrence", "type": "text", "required": True, "placeholder": "e.g. Near Metro Pillar 142, Main Commercial Market, Jaipur"},
            {"id": "accused_details", "label": "Details of Accused / Suspects (If known)", "type": "text", "required": True, "placeholder": "e.g. Known person Anil Kumar and two unknown associates / Unknown persons"},
            {"id": "incident_narration", "label": "Detailed Chronological Facts of Incident", "type": "textarea", "required": True, "placeholder": "Describe what happened sequentially, weapons/threats used, stolen articles or physical harm caused."},
            {"id": "witnesses_evidence", "label": "Witnesses / CCTV / Medical Evidence Available", "type": "textarea", "required": True, "placeholder": "e.g. CCTV footage from shop across street; medical MLC report from District Civil Hospital."}
        ]
    }
}
