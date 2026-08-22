"""
NyayMitra Gemini AI Service
Integrates with Google GenAI SDK (gemini-3.7-flash / gemini-2.5-flash)
Provides high-fidelity legal consultation, automated court-standard drafting,
and comprehensive clause risk assessment with local knowledge-infused fallback.
"""

import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

from config import settings
from legal_knowledge import STATUTES_DATABASE, EMERGENCY_HELPLINES, CITIZEN_RIGHTS_GUIDES, DRAFT_TEMPLATES

# Initialize Google GenAI client if valid API key is present
def get_genai_client():
    api_key = (settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")).strip()
    # Check if empty or not an AI Studio key (AI Studio keys start with AIza)
    if not api_key or api_key.startswith("AQ."):
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"GenAI Client initialization error: {e}")
        return None

SYSTEM_PROMPT_LEGAL_ADVISOR = """
You are "NyayaSetu (न्यायसेतु) Legal & Civic Guide" — a specialized, citizen-first AI Assistant for India.

STRICT DOMAIN SCOPE & GUARDRAIL:
You are EXCLUSIVELY permitted to answer questions that fall strictly within these 4 domains:
1. Right to Information (RTI Act, 2005) & Government Service Grievance Escalation.
2. Tenancy & Rental Disputes (Security deposit refund, illegal eviction, lease terms).
3. Consumer Protection (Defective goods, deficiency of service, Consumer Protection Act 2019).
4. Indian Government Welfare Scheme Eligibility & Application Procedures (PMAY, Ayushman Bharat, PM-SVANidhi, PM-KMY, pensions).

MANDATORY OUT-OF-SCOPE REFUSAL RULE:
If the user's query is outside these 4 specific domains (e.g. criminal trial strategy, matrimonial/divorce litigation, commercial corporate law, tax evasion, or unrelated topics):
- You MUST politely decline to answer the substantive legal question.
- Respond with: "I am specialized specifically in (1) RTI & government grievances, (2) tenant rights, (3) consumer protection, and (4) government welfare schemes. For matters outside this scope, please consult a qualified advocate or contact NALSA Free Legal Aid toll-free at 15100 / visit your nearest District Legal Services Authority (DLSA)."
- Do NOT attempt to guess, hypothesize, or advise on out-of-scope legal topics.

IN-SCOPE RESPONSE FORMAT:
- 📌 **Key Assessment & Citizen Rights**
- ⚖️ **Applicable Statute / Rules**
- 🛠️ **Actionable Step-by-Step Remedies**
- 📑 **Evidence to Preserve**
- 🚨 **Helpline / Legal Aid (NALSA 15100)**
- ⚠️ **Disclaimer:** General guidance only; not formal advocate representation.
"""

SYSTEM_PROMPT_DRAFTER = """
You are "NyayMitra Legal Drafting Specialist".
Your task is to generate formal, highly professional, court-standard legal notices, petitions, applications, and deeds.
Adhere strictly to standard Indian legal conventions:
- Use formal legal numbering, standard recitals ("WHEREAS...", "NOW THIS DEED WITNESSETH...", "TAKE NOTICE THAT...").
- Include statutory timelines (e.g. 15-day notice period under Sec 138 NI Act, 30 days under RTI Sec 6(1)).
- Add standard Verification, Jurisdiction, and Declaration clauses.
- Ensure all party details, addresses, financial figures, dates, and causes of action provided by the user are properly woven into the text.
- Output clean, ready-to-print Markdown with clear headings.
"""

SYSTEM_PROMPT_ANALYZER = """
You are "NyayMitra Senior Legal Document & Risk Auditor".
Your task is to audit and dissect legal agreements, contracts, notices, terms of service, and police complaints.
You must return a structured evaluation with:
1. **Executive Plain-Language Summary** (What does this agreement actually mean for the citizen in simple terms?)
2. **Key Parties & Financial / Operational Obligations**
3. **Clause-by-Clause Risk Assessment**:
   - Classify clauses into:
     - 🟢 **SAFE (Standard Clause)**
     - 🟡 **CAUTION (Unbalanced or Ambiguous)**
     - 🔴 **HIGH RISK / RED FLAG (Onerous, One-sided, Heavy Penalty, or Rights-Waiving)**
   - For each risk item, quote the exact problematic phrase and explain WHY it is risky.
4. **Missing Protective Clauses** (What crucial protections are absent?)
5. **Actionable Counter-Proposals & Negotiation Strategy** (Specific draft clauses to propose instead).
"""

SYSTEM_PROMPT_NYAYASETU = """
You are "NyayaSetu (न्यायसेतु)" — an expert AI Civic Rights & RTI Navigator for India.
Your role is to convert everyday citizen grievances (pending ration cards, road construction delays, unreturned security deposits, vendor licence harassment, welfare denial) into actionable, verified civic action plans and discoverable-records RTI applications.

CRITICAL RTI DRAFTING RULE:
- NEVER draft RTI questions asking "Why did you not do this?" or asking for explanations/opinions.
- ALWAYS convert the citizen's concern into requests for SPECIFIC DISCOVERABLE EXISTING RECORDS (e.g. certified copies of sanctioned estimates, work orders, measurement books, inspection logs, file movement registers, defect liability clauses, and recorded reasons for delay).
"""

def consult_legal_advisor(message: str, conversation_history: Optional[List[Dict[str, str]]] = None, language: str = "English") -> Dict[str, Any]:
    """Provides AI-powered legal guidance with Gemini or knowledge fallback."""
    client = get_genai_client()
    
    if client:
        try:
            # Build conversation contents
            contents = []
            
            # Format system prompt and context
            context_prompt = f"{SYSTEM_PROMPT_LEGAL_ADVISOR}\nTarget Response Language: {language}\n"
            
            # Relevant statute context injection
            statute_hits = search_statutes_locally(message)
            if statute_hits:
                context_prompt += f"\nRelevant Indian Legal Statutes for Reference:\n{json.dumps(statute_hits[:3], indent=2)}"
            
            if conversation_history:
                for turn in conversation_history[-6:]:
                    role = "user" if turn.get("role") == "user" else "model"
                    contents.append(f"[{role}]: {turn.get('content', '')}")
            
            contents.append(f"User Query: {message}")
            full_prompt = context_prompt + "\n" + "\n".join(contents)
            
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=full_prompt
            )
            
            return {
                "success": True,
                "reply": response.text,
                "model_used": settings.DEFAULT_MODEL,
                "statute_references": statute_hits[:3] if statute_hits else []
            }
        except Exception as e:
            print(f"Gemini API call failed, using intelligent fallback: {e}")
            # Fall through to fallback
            
    # Fallback local reasoning engine
    return local_legal_advisor_fallback(message, language)

def generate_legal_draft(template_id: str, form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generates a court-ready legal draft using Gemini or heuristic legal templating."""
    client = get_genai_client()
    template_info = DRAFT_TEMPLATES.get(template_id, {})
    
    if client:
        try:
            prompt = f"""
{SYSTEM_PROMPT_DRAFTER}

Template Type: {template_info.get('title', template_id)}
Governing Legislation: {template_info.get('act', 'Indian Law')}
Today's Date: {datetime.now().strftime('%d %B, %Y')}

User Provided Case Details:
{json.dumps(form_data, indent=2)}

Please generate a complete, court-ready, legally enforceable draft. Include full standard headings, legal recitals, timeline stipulations, demand notice clauses, and signature blocks.
"""
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt
            )
            return {
                "success": True,
                "draft": response.text,
                "title": template_info.get("title", "Legal Document"),
                "model_used": settings.DEFAULT_MODEL
            }
        except Exception as e:
            print(f"Gemini drafting call failed: {e}")
            
    # Heuristic fallback generator
    return local_draft_fallback(template_id, form_data)

def analyze_legal_document(document_text: str, document_name: str = "Uploaded Document") -> Dict[str, Any]:
    """Audits legal document for risk flags, clauses, and loopholes."""
    client = get_genai_client()
    
    # Truncate to reasonable token limit if document is massive
    safe_text = document_text[:25000]
    
    if client:
        try:
            prompt = f"""
{SYSTEM_PROMPT_ANALYZER}

Document Name: {document_name}
Document Content:
\"\"\"
{safe_text}
\"\"\"

Provide your comprehensive analysis in well-structured Markdown format with clear emojis, tables, and risk callout sections.
"""
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=prompt
            )
            return {
                "success": True,
                "analysis": response.text,
                "document_name": document_name,
                "model_used": settings.DEFAULT_MODEL,
                "char_count": len(document_text)
            }
        except Exception as e:
            print(f"Gemini document analysis call failed: {e}")
            
    # Heuristic analyzer fallback
    return local_analyzer_fallback(safe_text, document_name)

def analyze_image_document(image_bytes: bytes, filename: str = "camera_capture.jpg", mime_type: str = "image/jpeg") -> Dict[str, Any]:
    """Audits photographed legal documents or notices captured from mobile camera."""
    client = get_genai_client()
    if client:
        try:
            from google.genai import types
            image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            prompt = f"""
{SYSTEM_PROMPT_ANALYZER}

You are analyzing a photographed legal notice/agreement/document captured by a citizen via mobile camera.
Filename: {filename}

Instructions:
1. Extract and transcribe all text, dates, parties, claim amounts, and legal references clearly.
2. Provide a structured Plain-Language Risk Audit:
   - 📋 **Document Classification & Summary** (e.g. Legal Notice under Sec 138 NI Act, Tenancy Eviction Notice, FIR Copy, Police Challan).
   - ⚠️ **Key Risk Flags & Traps** (Deadlines to respond, penalty clauses, dispute clauses).
   - 🛡️ **Citizen Rights & Protections** under relevant Indian Law (BNS/CrPC/Consumer Act).
   - 📝 **Immediate Action Step Checklist** (How citizen should reply or preserve evidence).
"""
            response = client.models.generate_content(
                model=settings.DEFAULT_MODEL,
                contents=[prompt, image_part]
            )
            return {
                "success": True,
                "analysis": response.text,
                "document_name": filename,
                "model_used": settings.DEFAULT_MODEL,
                "char_count": len(response.text)
            }
        except Exception as e:
            print(f"Gemini photo document analysis failed: {e}")

    # Fallback response for camera uploads
    return {
        "success": True,
        "analysis": f"""### 📷 Document Photo Received: `{filename}`

**Immediate Assessment:**
The uploaded photo has been safely recorded in your local docket session.

#### 📋 Next Steps for Citizen:
1. **Ensure Legibility:** Make sure lighting is clear and all four corners of the notice/paper are visible.
2. **Review Key Dates:** Check if this is a 15-day statutory notice (e.g., Section 138 Cheque bounce or Section 106 Transfer of Property Act).
3. **Legal Consultation:** Use the **Legal Advisor Chat** tab to describe specific clauses or questions from this document.
4. **Draft Reply Notice:** Head to the **Notice & Drafting** tab to generate a formal reply without lawyer fees.

⚠️ *Disclaimer: NyayMitra provides information and automated templates. Consult a qualified advocate for active court proceedings.*""",
        "document_name": filename,
        "model_used": "offline-fallback",
        "char_count": 500
    }

# Search statutes in local knowledge base
def search_statutes_locally(query: str) -> List[Dict[str, Any]]:
    query_lower = query.lower().strip()
    if not query_lower:
        return STATUTES_DATABASE
        
    results = []
    for item in STATUTES_DATABASE:
        score = 0
        if query_lower in item["title"].lower():
            score += 10
        if query_lower in item["bns_section"].lower():
            score += 15
        if query_lower in item["ipc_section"].lower():
            score += 15
        if query_lower in item["category"].lower():
            score += 5
        if query_lower in item["summary"].lower():
            score += 4
        if query_lower in item["key_changes"].lower():
            score += 3
        
        # Check individual words
        words = query_lower.split()
        for w in words:
            if len(w) > 2:
                if w in item["title"].lower():
                    score += 3
                if w in item["summary"].lower():
                    score += 2
                    
        if score > 0:
            results.append((score, item))
            
    results.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in results]

# Local Knowledge-Infused Fallbacks (Ensures 100% reliability offline or before API key setup)
def local_legal_advisor_fallback(message: str, language: str = "English") -> Dict[str, Any]:
    msg_lower = message.lower()
    matched_statutes = search_statutes_locally(message)
    is_hindi = language in ["Hindi", "हिन्दी"]
    is_hinglish = language == "Hinglish"
    
    # 1. Cheque Bounce (Sec 138 NI Act)
    if "cheque" in msg_lower or "bounce" in msg_lower or "138" in msg_lower:
        if is_hindi:
            reply = f"""### ⚖️ कानूनी विश्लेषण: चेक अनादर / चेक बाउंस (धारा 138 एनआई एक्ट)

**1. तत्काल कानूनी स्थिति:**
**परक्राम्य लिखत अधिनियम (NI Act), 1881 की धारा 138** के तहत, किसी कानूनी कर्ज या देनदारी के भुगतान के लिए जारी किए गए चेक का बाउंस होना एक **आपराधिक अपराध** है, जिसमें **2 वर्ष तक का कारावास** या **चेक राशि का दोगुना जुर्माना** या दोनों हो सकते हैं।

**2. अनिवार्य कानूनी समय-सीमा (सख्ती से लागू):**
1. **चेक प्रस्तुति:** चेक अपनी वैधता अवधि (जारी होने की तारीख से 3 माह) के भीतर बैंक में प्रस्तुत होना चाहिए।
2. **बैंक रिटर्न मेमो:** बैंक से कारण (*"Funds Insufficient"*, *"Account Closed"*) सहित आधिकारिक अनादर पर्ची प्राप्त करें।
3. **वैधानिक लीगल नोटिस:** बैंक मेमो मिलने के **30 दिनों के भीतर** देनदार को लिखित में औपचारिक कानूनी नोटिस भेजना **अनिवार्य** है।
4. **15 दिन का भुगतान समय:** नोटिस मिलने की तारीख से देनदार को भुगतान हेतु 15 दिन का समय मिलता है।
5. **अदालत में परिवाद:** यदि 15 दिनों में भुगतान नहीं होता है, तो 15 दिन पूरे होने के बाद **अगले 30 दिनों के भीतर** न्यायिक मजिस्ट्रेट के समक्ष आपराधिक परिवाद दाखिल करना होगा।

**3. नागरिक कार्रवाई के चरण:**
- न्यायमित्र के **ड्राफ्टिंग स्टूडियो** से तुरंत *धारा 138 वैधानिक लीगल नोटिस* तैयार करें।
- मूल चेक, बैंक मेमो और स्पीड पोस्ट रसीद सुरक्षित रखें।
- मुफ्त वकील हेतु **नालसा लीगल हेल्पलाइन 15100** पर संपर्क करें।"""
        else:
            reply = f"""### ⚖️ Legal Assessment: Dishonour of Cheque (Sec 138 NI Act)

**1. Immediate Legal Standing:**
Under **Section 138 of the Negotiable Instruments Act, 1881**, dishonour of a cheque issued for discharge of a legally enforceable debt or liability is a **criminal offence** punishable with up to **2 years imprisonment** or a fine up to **double the cheque amount**, or both.

**2. Mandatory Statutory Timelines (Strictly Enforced):**
1. **Presentment:** Cheque must have been presented to the bank within its validity period (3 months from the date of issue).
2. **Bank Return Memo:** Obtain official dishonour slip stating reasons like *"Funds Insufficient"* or *"Account Closed"*.
3. **Statutory Legal Notice:** You **MUST** dispatch a formal legal notice in writing to the drawer within **30 days** of receiving the bank memo.
4. **15-Day Cure Period:** The drawer has 15 days from the date of receipt to pay the full cheque amount.
5. **Filing Complaint:** If payment is not made within 15 days, file a criminal complaint before Judicial Magistrate within **30 days** from the expiry of the 15-day notice period.

**3. Actionable Next Steps:**
- Use NyayMitra's **Drafting Studio** to generate your *Section 138 Statutory Legal Notice* immediately.
- Preserve original cheque, bank return memo, and postal speed post receipts with delivery tracking.
- Consult **NALSA Free Legal Aid Helpline at 15100** for free advocate assignment if eligible.

*Disclaimer: This information is for legal literacy. Court proceedings require drafting by an enrolled advocate.*"""

    # 2. FIR & Police / Arrest Rights
    elif "fir" in msg_lower or "police" in msg_lower or "arrest" in msg_lower:
        if is_hindi:
            reply = f"""### ⚖️ कानूनी मार्गदर्शन: पुलिस शिकायत, एफआईआर एवं नागरिक अधिकार

**1. लागू कानून:**
- **एफआईआर दर्ज करना:** **भारतीय नागरिक सुरक्षा संहिता (BNSS 2023) की धारा 173** (पूर्व में धारा 154 CrPC)।
- **संज्ञेय अपराध** (चोरी, मारपीट, धोखाधड़ी, साइबर अपराध) में सुप्रीम कोर्ट के ऐतिहासिक *ललिता कुमारी बनाम यूपी सरकार* निर्णय के तहत पुलिस एफआईआर दर्ज करने के लिए **बाध्य** है।

**2. यदि थाना एफआईआर दर्ज करने से मना करे:**
1. **जीरो एफआईआर (Zero FIR):** किसी भी थाने में जीरो एफआईआर दर्ज कराई जा सकती है।
2. **पुलिस अधीक्षक (SP / DCP):** **धारा 173(4) BNSS** के तहत जिले के पुलिस अधीक्षक को पंजीकृत डाक से लिखित शिकायत भेजें।
3. **मजिस्ट्रेट के समक्ष आवेदन:** **धारा 175(3) BNSS** (पूर्व धारा 156(3) CrPC) के तहत न्यायिक मजिस्ट्रेट को एफआईआर दर्ज कराने का निर्देश देने हेतु आवेदन करें।

**3. गिरफ्तारी के समय मौलिक अधिकार (डी.के. बसु दिशानिर्देश):**
- गिरफ्तारी का लिखित कारण जानने का अधिकार (संविधान का अनुच्छेद 22(1))।
- पुलिस द्वारा समय व गवाह के हस्ताक्षर सहित अरेस्ट मेमो तैयार करना अनिवार्य है।
- अपने रिश्तेदार/वकील को तुरंत सूचित करने का अधिकार।
- 24 घंटे के भीतर नजदीकी मजिस्ट्रेट के समक्ष पेश किया जाना अनिवार्य।

*आपातकालीन सहायता: पुलिस SOS 112 | साइबर हेल्पलाइन 1930 | मुफ्त कानूनी सहायता 15100.*"""
        else:
            reply = f"""### ⚖️ Legal Guidance: Police Complaint, FIR & Citizen Rights

**1. Applicable Law:**
- **Registration of FIR:** Governed by **Section 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)** / **Section 154 CrPC**.
- For **Cognizable Offences**, Station House Officer is **mandatorily obligated** to register an FIR under Supreme Court ruling in *Lalita Kumari vs. Govt. of UP (2014)*.

**2. If the Police Station Refuses to Register Your FIR:**
1. **Zero FIR:** File a Zero FIR at any convenient police station regardless of jurisdiction.
2. **Superintendent of Police (SP / DCP):** Send written complaint by registered post under **Section 173(4) BNSS / Section 154(3) CrPC** to District SP.
3. **Judicial Magistrate Application:** File application under **Section 175(3) BNSS / Section 156(3) CrPC** directing police investigation.

**3. Key Fundamental Rights (D.K. Basu Guidelines):**
- Right to know specific grounds of arrest (Article 22(1) Constitution).
- Police must prepare a formal Arrest Memo with date, time, and witness signature.
- Right to inform relative/friend immediately and consult an enrolled advocate.
- Mandatory presentation before Magistrate within 24 hours.

*Emergency Help: Police SOS 112 | Cybercrime 1930 | Free Legal Aid 15100.*"""

    # 3. Cyber Fraud & UPI SOP
    elif "cyber" in msg_lower or "fraud" in msg_lower or "upi" in msg_lower or "scam" in msg_lower:
        if is_hindi:
            reply = f"""### ⚖️ त्वरित एक्शन प्लान: साइबर व ऑनलाइन वित्तीय धोखाधड़ी

**1. पहला घंटा (गोल्डन ऑवर प्रोटोकॉल):**
- **तुरंत 1930 डायल करें:** राष्ट्रीय साइबर हेल्पलाइन (1930) तुरंत बैंकों के साथ मिलकर जालसाज के खाते को फ्रीज करती है।
- **ऑनलाइन शिकायत दर्ज करें:** [cybercrime.gov.in](https://cybercrime.gov.in) पर ट्रांजेक्शन आईडी, बैंक स्टेटमेंट और स्क्रीनशॉट के साथ शिकायत दर्ज करें।

**2. बैंक को सूचना एवं शून्य देनदारी (RBI नियम):**
- आरबीआई के 2017 परिपत्र के तहत:
  - यदि धोखाधड़ी की सूचना बैंक को **3 कार्य दिवसों के भीतर** दी जाती है, तो ग्राहक की देनदारी **शून्य (ZERO)** होती है।

**3. कानूनी धाराएं:**
- धोखाधड़ी हेतु **भारतीय न्याय संहिता (BNS) की धारा 318(4)** (पूर्व धारा 420 IPC)।
- आईटी एक्ट, 2000 की धारा 66C एवं 66D (पहचान की चोरी एवं कंप्यूटर संसाधनों द्वारा छल)।"""
        else:
            reply = f"""### ⚖️ Urgent Action Plan: Cyber & Financial Fraud Incident

**1. Crucial First Hour (Golden Hour Protocol):**
- **Dial 1930 Immediately:** National Cyber Crime helpline works directly with banks to freeze recipient mule accounts before funds are withdrawn.
- **Log Complaint Online:** Visit [cybercrime.gov.in](https://cybercrime.gov.in) and register complaint with transaction UTR IDs, screenshots, and bank statements.

**2. Bank Notification & Zero Liability (RBI Directive):**
- Under RBI Circular on *Limiting Liability of Customers in Unauthorized Electronic Banking Transactions (2017)*:
  - If notified to the bank within **3 working days**, customer has **ZERO liability** for third-party security breach.

**3. Criminal Provisions:**
- **Section 318(4) BNS** (Replaces Section 420 IPC) for Cheating & Fraud.
- **Section 66C & 66D of Information Technology Act, 2000** for Identity Theft and Online Impersonation."""

    # LIVE DEMO OFFLINE SAFETY FALLBACK (TASK 7)
    # Check domain guardrail for offline responses:
    is_in_scope = any(k in msg_lower for k in [
        "rti", "information", "ration", "road", "pothole", "officer", "appeal", "authority", "grievance",
        "rent", "tenant", "landlord", "deposit", "eviction", "lease",
        "consumer", "defective", "refund", "warranty", "cheque", "bounce", "138",
        "scheme", "yojana", "pmay", "svanidhi", "ayushman", "pension", "kisan"
    ])

    if not is_in_scope and any(out_k in msg_lower for out_k in ["divorce", "murder", "custody", "bail", "tax", "crypto", "m&a", "rape", "dowry", "corporate"]):
        if is_hindi:
            reply = """### ℹ️ कार्यक्षेत्र सूचना (Scope Notice)

मैं विशेष रूप से इन 4 क्षेत्रों में सहायता के लिए अधिकृत हूँ:
1. **सूचना का अधिकार (RTI Act 2005) एवं प्रशासनिक शिकायतें**
2. **किरायेदार एवं मकान-मालिक विवाद (सुरक्षा जमा / निष्कासन)**
3. **उपभोक्ता संरक्षण अधिनियम (दोषपूर्ण उत्पाद / सेवा में कमी)**
4. **सरकारी कल्याणकारी योजनाएं (PMAY, आयुष्मान भारत, पीएम स्वनिधि, पेंशन)**

*इस विषय पर व्यक्तिगत विधिक सलाह हेतु कृपया किसी योग्य अधिवक्ता अथवा राष्ट्रीय विधिक सेवा प्राधिकरण (**नालसा हेल्पलाइन: 15100**) से निःशुल्क परामर्श प्राप्त करें।*"""
        else:
            reply = """### ℹ️ Domain Scope Notice

I am specialized specifically in assisting with:
1. **Right to Information (RTI Act, 2005) & Government Grievance Escalation**
2. **Tenant & Rental Disputes (Security Deposit Refund / Eviction)**
3. **Consumer Protection Act (Defective Goods & Service Deficiency)**
4. **Indian Government Welfare Scheme Eligibility (PMAY, Ayushman, PM-SVANidhi, Pensions)**

*For matters outside this scope (e.g. criminal defense, matrimonial litigation, tax law), please consult a qualified advocate or contact NALSA Free Legal Aid toll-free at **15100** / visit your District Legal Services Authority (DLSA).*"""
    else:
        statute_text = ""
        if matched_statutes:
            top = matched_statutes[0]
            statute_text = f"\n\n**Relevant Statute in Indian Law:**\n- **{top['title']}**\n- **New Law:** {top['bns_section']} ({top['act_name']})\n- **Old IPC Reference:** {top['ipc_reference']}\n- **Nature:** {top['bailable']} | {top['cognizable']} | Court: {top['court']}\n- **Punishment:** {top['punishment']}"

        if is_hindi:
            reply = f"""### ⚖️ न्यायमित्र कानूनी परामर्श

आपके कानूनी प्रश्न: *"{message}"* के संबंध में विधिक मार्गदर्शन:{statute_text}

**1. मौलिक कानूनी ढांचा:**
भारत में नागरिक अधिकार व शिकायतें भारत के संविधान, नई **भारतीय न्याय संहिता (BNS 2023)**, **भारतीय नागरिक सुरक्षा संहिता (BNSS 2023)**, उपभोक्ता संरक्षण अधिनियम 2019, और आरटीआई अधिनियम 2005 द्वारा शासित हैं।

**2. अनुशंसित कदम:**
1. **साक्ष्य व रिकॉर्ड सुरक्षित रखें:** सभी अनुबंध, रसीदें, बैंक विवरण और पत्राचार की प्रमाणित प्रतियां सुरक्षित रखें।
2. **औपचारिक कानूनी नोटिस:** अधिकांश नागरिक, उपभोक्ता और मकान-मालिक विवादों में एक संरचित लीगल नोटिस भेजने से बिना मुकदमे के समाधान हो जाता है।
3. **निःशुल्क कानूनी सहायता:** महिलाएं, बच्चे, एससी/एसटी वर्ग एवं कम आय वाले नागरिक **नालसा हेल्पलाइन 15100** द्वारा 100% मुफ्त सरकारी वकील प्राप्त करने के पात्र हैं।"""
        else:
            reply = f"""### ⚖️ Legal Insight from NyayMitra

Thank you for your legal query regarding: *"{message}"*{statute_text}

**1. Fundamental Legal Framework:**
In India, citizen grievances are governed under civil and criminal frameworks comprising the Constitution of India, the new Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Consumer Protection Act 2019, and specialized statutes.

**2. Recommended Course of Action:**
1. **Preserve Documentary Evidence:** Keep all agreements, invoices, WhatsApp/email communications, and bank statements organized.
2. **Issue Formal Notice:** In most civil, consumer, and tenancy disputes, serving a structured legal notice establishes your cause of action and resolves matters swiftly.
3. **Free Legal Assistance:** Marginalized citizens, women, children, and persons with annual income within statutory limits are entitled to **100% Free Legal Aid** through the **National Legal Services Authority (NALSA) - Helpline 15100**."""

    return {
        "success": True,
        "reply": reply,
        "model_used": "NyayMitra Local Knowledge Engine",
        "statute_references": matched_statutes[:3] if matched_statutes else []
    }

# =========================================================================
# LIVE DEMO OFFLINE SAFETY FALLBACK (TASK 7)
# Heuristic statutory template generator ensuring instant, court-standard
# legal drafts for Cheque Bounce, RTI, Rental Agreements, Consumer Notices,
# and Security Deposit Recovery even if the live LLM API is unavailable.
# =========================================================================
def local_draft_fallback(template_id: str, form_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generates standard legal drafts using heuristic statutory templates."""
    today_str = datetime.now().strftime("%d-%m-%Y")
    
    if template_id == "cheque_bounce_notice":
        draft_content = f"""# STATUTORY LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

**REGISTERED A.D. / SPEED POST / LEGAL COMMUNICATION**

**Date:** {today_str}

**TO,**
**{form_data.get('recipient_name', '[Drawer Name]')}**
{form_data.get('recipient_address', '[Drawer Address]')}

**FROM (SENDER / PAYEE):**
**{form_data.get('sender_name', '[Payee Name]')}**
{form_data.get('sender_address', '[Payee Address]')}

---

### SUBJECT: LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 (AS AMENDED UPTO DATE) FOR DISHONOUR OF CHEQUE NO. {form_data.get('cheque_number', '_______')} DATED {form_data.get('cheque_date', '_______')} FOR INR {form_data.get('cheque_amount', '_______')}/-

Sir / Madam,

Under instructions and on behalf of my client / the undersigned, **{form_data.get('sender_name', '[Payee Name]') if form_data.get('sender_name') else 'the Complainant'}**, I hereby serve upon you this Statutory Legal Notice:

1. **LEGAL LIABILITY & DEBT:** That in discharge of a legally enforceable debt and outstanding liability arising out of *{form_data.get('transaction_context', 'business transactions and mutual obligations')}*, you the Noticee issued in favor of my client the following Cheque:
   - **Cheque No.:** {form_data.get('cheque_number', '[Cheque Number]')}
   - **Dated:** {form_data.get('cheque_date', '[Date]')}
   - **Amount:** INR {form_data.get('cheque_amount', '[Amount]')}/- (Rupees only)
   - **Drawn On:** {form_data.get('bank_name', '[Bank Name]')}

2. **PRESENTMENT & DISHONOUR:** That my client presented the said Cheque for encashment through their bankers. However, to the utter shock of my client, the said Cheque was returned dishonoured and unpaid with the Bank Return Memo dated **{form_data.get('return_memo_date', '[Memo Date]')}** citing reason: **"{form_data.get('return_reason', 'Funds Insufficient')}"**.

3. **STATUTORY 15-DAY DEMAND:** That by this Statutory Notice, my client hereby calls upon you to make the full payment of the cheque amount of **INR {form_data.get('cheque_amount', '[Amount]')}/-** within **15 (FIFTEEN) DAYS** from the date of receipt of this notice.

4. **CONSEQUENCES OF DEFAULT:** Please take note that if you fail to make the aforesaid payment within the statutory period of 15 days, my client shall be constrained to initiate criminal proceedings against you under **Section 138 and Section 142 of the Negotiable Instruments Act, 1881**, and **Section 318(4) of Bharatiya Nyaya Sanhita, 2023 (Section 420 IPC)** before the competent Judicial Magistrate / Metropolitan Magistrate at your sole risk, cost, and consequence.

A copy of this notice is retained for production before the Court of Law as statutory evidence.

Yours faithfully,

_____________________________
**{form_data.get('sender_name', '[Payee / Authorized Signatory]')}**
Date: {today_str}
"""
    elif template_id == "rti_application":
        default_questions = "1. Please provide certified copies of relevant files and decisions.\n2. Please provide inspection reports and dates."
        specific_questions = form_data.get('specific_questions') or default_questions
        draft_content = f"""# APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

**To,**
The Public Information Officer (PIO) / {form_data.get('pio_designation', 'Authorized Officer')},
{form_data.get('public_authority', '[Public Authority / Department]')},
{form_data.get('pio_office_address', '[Office Address]')}

**Date:** {today_str}

---

### 1. APPLICANT DETAILS:
- **Full Name:** {form_data.get('applicant_name', '[Applicant Name]')}
- **Gender / Nationality:** Indian Citizen
- **Complete Postal Address:** {form_data.get('applicant_address', '[Applicant Address]')}

### 2. PARTICULARS OF INFORMATION SOUGHT:
- **Subject Matter:** {form_data.get('subject_matter', '[Subject Matter]')}
- **Period to which information pertains:** {form_data.get('time_period', 'Recent')}
- **Specific Certified Information / Questions Requested:**
{specific_questions}

### 3. FORMAT OF INFORMATION:
The applicant requests the certified copies of the aforesaid records by **Registered / Speed Post** to the address mentioned above.

### 4. APPLICATION FEE:
- Fee Status: {form_data.get('bpl_status', 'Statutory fee of Rs 10/- enclosed via Postal Order / Court Fee Stamp / Online Receipt.')}

### 5. DECLARATION:
I hereby declare that I am a citizen of India and the information sought is within the purview of Section 2(f) and Section 6(1) of the RTI Act, 2005 and does not attract any exemption under Section 8 or 9.

Yours faithfully,

_____________________________
**Signature of Applicant**
**Name:** {form_data.get('applicant_name', '[Applicant Name]')}
**Date:** {today_str}
"""
    elif template_id == "rental_agreement":
        draft_content = f"""# RESIDENTIAL LEASE / RENTAL AGREEMENT

This Residential Lease Agreement is executed on this **{today_str}** at [City/State] between:

**THE LESSOR (LANDLORD):**
**{form_data.get('landlord_name', '[Landlord Name]')}**, residing at {form_data.get('landlord_address', '[Landlord Address]')}, hereinafter referred to as the **"LESSOR"** (which expression shall unless repugnant to context include heirs, successors, and assigns) of the **FIRST PART**.

**AND**

**THE LESSEE (TENANT):**
**{form_data.get('tenant_name', '[Tenant Name]')}**, having permanent address at {form_data.get('tenant_permanent_address', '[Tenant Address]')}, hereinafter referred to as the **"LESSEE"** of the **SECOND PART**.

---

### WHEREAS:
1. The Lessor is the absolute lawful owner of the residential property situated at:
   **{form_data.get('property_address', '[Premises Address]')}** (hereinafter referred to as the "Demised Premises").
2. The Lessee has approached the Lessor to take the Demised Premises on lease for residential purposes only.

### NOW THIS AGREEMENT WITNESSETH AND IT IS MUTUALLY AGREED AS FOLLOWS:
1. **DURATION:** The lease shall be for a period of **{form_data.get('lease_duration_months', '11')} Months**, commencing from **{form_data.get('lease_start_date', today_str)}**.
2. **MONTHLY RENT:** The Lessee agrees to pay a monthly rent of **INR {form_data.get('monthly_rent', '_______')}/-** (Rupees only), payable on or before the **{form_data.get('rent_due_day', '5')}th** day of each English calendar month.
3. **SECURITY DEPOSIT:** The Lessee has paid an interest-free refundable Security Deposit of **INR {form_data.get('security_deposit', '_______')}/-** to the Lessor. The same shall be refunded upon peaceful handover of vacant possession minus unpaid dues/damages.
4. **MAINTENANCE & UTILITIES:** Electricity, water, and society maintenance charges shall be paid directly by the Lessee according to meter bills.
5. **TERMINATION & NOTICE:** Either party may terminate this agreement by giving **{form_data.get('notice_period_days', '30')} Days** prior written notice to the other party.
6. **PROHIBITED ACTIVITIES:** The Demised Premises shall be used exclusively for peaceful residential living. No illegal, commercial, or nuisance-causing activities shall be permitted.

IN WITNESS WHEREOF, the parties hereto have set their hands on the day, month, and year first above written.

**LESSOR (LANDLORD):** _________________________

**LESSEE (TENANT):** _________________________

**WITNESS 1:** _________________________
**WITNESS 2:** _________________________
"""
    elif template_id == "consumer_complaint_notice":
        draft_content = f"""# LEGAL NOTICE FOR DEFICIENT SERVICE & UNFAIR TRADE PRACTICE
### Under the Consumer Protection Act, 2019

**Date:** {today_str}

**TO,**
**{form_data.get('company_name', '[Company / Seller Name]')}**
{form_data.get('company_address', '[Company Address]')}

**FROM (CONSUMER / CLAIMANT):**
**{form_data.get('complainant_name', '[Consumer Name]')}**
{form_data.get('complainant_address', '[Consumer Address]')}

---

### SUBJECT: NOTICE UNDER CONSUMER PROTECTION ACT, 2019 FOR DEFICIENCY IN SERVICE AND REPLACEMENT / REFUND REGARDING INVOICE NO. {form_data.get('invoice_number', '_______')}

Sir / Madam,

Under instructions and on behalf of my client / undersigned **{form_data.get('complainant_name', 'the Consumer')}**, I hereby issue this Legal Notice:

1. **PURCHASE DETAILS:** That on **{form_data.get('purchase_date', '[Date]')}**, the Consumer purchased **{form_data.get('product_service', '[Product/Service]')}** from you vide Invoice No. **{form_data.get('invoice_number', '[Invoice]')}** for a total consideration of **INR {form_data.get('amount_paid', '_______')}/-**.

2. **DEFICIENCY & DEFECT:** That shortly after purchase, the said product/service failed to perform satisfactorily:
   *{form_data.get('defect_description', 'Severe defect and failure of after-sales warranty support.')}*

3. **UNFAIR TRADE PRACTICE:** Despite multiple reminders, your company failed to redress the genuine consumer grievance, amounting to Gross Deficiency in Service and Unfair Trade Practice under Section 2(11) and 2(47) of the Consumer Protection Act, 2019.

4. **FINAL DEMAND:** You are hereby called upon to grant the following reliefs within **15 (FIFTEEN) DAYS** of receipt of this notice:
   *{form_data.get('compensation_demanded', 'Full refund of the amount paid with interest and litigation costs.')}*

5. **NOTICE OF LITIGATION:** Take note that failing compliance within 15 days, appropriate consumer proceedings will be instituted before the **District Consumer Disputes Redressal Commission (DCDRC)** under Section 35 of the Consumer Protection Act, 2019 at your cost.

Yours faithfully,

_____________________________
**{form_data.get('complainant_name', '[Consumer Signature]')}**
Date: {today_str}
"""
    else: # Police Complaint / General
        draft_content = f"""# FORMAL POLICE COMPLAINT / REQUEST FOR REGISTRATION OF FIR
### Under Section 154 CrPC / Section 173 Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023)

**To,**
The Station House Officer (SHO),
{form_data.get('police_station', '[Police Station Name & District]')}

**Date:** {today_str}

---

### 1. COMPLAINANT DETAILS:
- **Name:** {form_data.get('complainant_name', '[Complainant Name]')}
- **Contact & Address:** {form_data.get('complainant_contact', '[Contact Details]')}

### 2. INCIDENT PARTICULARS:
- **Date & Time of Incident:** {form_data.get('incident_date_time', '[Date/Time]')}
- **Place of Occurrence:** {form_data.get('incident_location', '[Exact Location]')}
- **Accused / Suspects:** {form_data.get('accused_details', '[Suspect Details]')}

### 3. CHRONOLOGICAL STATEMENT OF FACTS:
{form_data.get('incident_narration', 'State the facts chronologically detailing the offence committed.')}

### 4. EVIDENCE & WITNESSES:
{form_data.get('witnesses_evidence', 'Details of CCTV, medical reports, witnesses, or digital evidence.')}

### 5. PRAYER / RELIEF SOUGHT:
In light of the cognizable offence disclosed above, it is respectfully requested that:
1. An FIR be registered forthwith against the named / unknown accused persons under relevant sections of the Bharatiya Nyaya Sanhita, 2023 (BNS).
2. Prompt investigation be conducted and necessary legal action be taken in accordance with law.

Yours faithfully,

_____________________________
**{form_data.get('complainant_name', '[Complainant Signature]')}**
Date: {today_str}
"""

    return {
        "success": True,
        "draft": draft_content,
        "title": DRAFT_TEMPLATES.get(template_id, {}).get("title", "Legal Document Draft"),
        "model_used": "NyayMitra Standard Legal Drafting Engine"
    }

def local_analyzer_fallback(document_text: str, document_name: str) -> Dict[str, Any]:
    """Heuristic clause risk scanner and plain-language summarizer."""
    text_lower = document_text.lower()
    
    # Identify high risk terms
    risk_findings = []
    
    if "arbitration" in text_lower or "sole arbitrator" in text_lower:
        risk_findings.append({
            "level": "CAUTION",
            "badge": "🟡 Caution",
            "title": "Unilateral Arbitration & Dispute Clause",
            "description": "The agreement includes an arbitration clause. Ensure that the appointment of the sole arbitrator is mutual and not solely appointed by one party, which violates the Supreme Court ruling in Perkins Eastman (2019)."
        })
        
    if "non-refundable" in text_lower or "no refund" in text_lower:
        risk_findings.append({
            "level": "HIGH_RISK",
            "badge": "🔴 High Risk / Red Flag",
            "title": "Absolute No-Refund / Forfeiture Clause",
            "description": "One-sided forfeiture of advance payments or deposits without breach of contract by the citizen is considered an unfair trade contract under Section 2(46) of the Consumer Protection Act, 2019."
        })
        
    if "indemnify" in text_lower or "hold harmless" in text_lower:
        risk_findings.append({
            "level": "HIGH_RISK",
            "badge": "🔴 High Risk / Red Flag",
            "title": "Broad Indemnification Clause",
            "description": "You may be held liable for indirect, consequential damages or third-party claims. It is advisable to cap indemnity to the total fees/value of the transaction."
        })
        
    if "lock-in" in text_lower:
        risk_findings.append({
            "level": "CAUTION",
            "badge": "🟡 Caution",
            "title": "Lock-In Period & Early Exit Penalty",
            "description": "Verify if early termination within the lock-in period incurs severe financial damages or forfeiture of entire security deposit."
        })
        
    if "jurisdiction" in text_lower:
        risk_findings.append({
            "level": "SAFE",
            "badge": "🟢 Standard",
            "title": "Exclusive Territorial Jurisdiction",
            "description": "Standard court jurisdiction clause determining where disputes can be litigated."
        })

    # Summary generator
    analysis_md = f"""# 📋 Comprehensive Legal Document Audit: {document_name}

### 1. 🔍 Executive Plain-Language Summary
This document appears to be a binding legal agreement/notice containing **{len(document_text.split())} words**. It defines commercial, tenancy, or contractual obligations, termination rules, liability allocations, and dispute resolution mechanisms between the contracting parties.

---

### 2. ⚠️ Clause Risk Assessment & Flags

| Risk Level | Clause Focus | Legal Observation & Advice |
| :--- | :--- | :--- |
"""
    if not risk_findings:
        analysis_md += "| 🟢 Standard | General Terms | Standard contract terms without severe aggressive one-sided clauses detected. |\n"
    else:
        for f in risk_findings:
            analysis_md += f"| {f['badge']} | **{f['title']}** | {f['description']} |\n"

    analysis_md += f"""
---

### 3. 🛡️ Crucial Protective Safeguards & Missing Clauses
1. **Force Majeure (Act of God / Epidemic / Regulatory ban):** Ensure clear suspension of obligations during uncontrollable emergencies.
2. **Termination for Cause with Grace Period:** Ensure a mandatory 15 to 30 day written notice with opportunity to cure before harsh termination or penalty is imposed.
3. **Limitation of Liability:** Ensure liability is reciprocal and capped at the actual transaction value.

### 4. 💡 Actionable Negotiation Recommendations
- Request modification of any absolute "No-Refund" or "Unilateral Indemnity" language.
- Ensure jurisdiction is set to a convenient mutual district rather than a remote single location.

*Disclaimer: Automated risk scan based on standard Indian contract law heuristics. For high-stakes contracts, engage an advocate for exhaustive due diligence.*
"""

    return {
        "success": True,
        "analysis": analysis_md,
        "document_name": document_name,
        "model_used": "NyayMitra Heuristic Document Auditor",
        "char_count": len(document_text)
    }
