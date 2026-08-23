# ⚖️ NyayMitra AI (न्यायमित्र AI)

### 🇮🇳 India's First Multilingual AI Civic-Rights Navigator, Statutory RTI Action Engine & Legal Justice Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Google GenAI](https://img.shields.io/badge/Google%20GenAI-Gemini%203.7%20Flash-orange.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Multilingual](https://img.shields.io/badge/Languages-8%20Indian%20Languages-green.svg)](https://github.com/shivam-1919/Nyaymitra)
[![Tests](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen.svg)](https://github.com/shivam-1919/Nyaymitra)
[![Deployment](https://img.shields.io/badge/Deployment-Render-success.svg?logo=render&logoColor=white)](https://render.com)
[![Mobile Ready](https://img.shields.io/badge/Mobile-Responsive%20PWA-blueviolet.svg)]()
[![Status](https://img.shields.io/badge/Status-Live%20Production-success.svg)]()

---

> **🏆 Hackathon Submission Statement:**  
> **NyayMitra AI** is a citizen-first civic-tech and legal assistance platform that bridges the gap between everyday Indian citizens and the justice system. It empowers citizens to understand their statutory rights, identify responsible public authorities, generate legally binding records-based RTI applications, check welfare scheme eligibility, draft court-standard demand notices, and track 30-day statutory response deadlines with 1-click **Section 19(1) First Appeals** — completely free of lawyer fees and fully available in **8 Indian languages**.

---

## 🌐 Live Production Application & API Docs

| Service | Direct URL | Description |
| :--- | :--- | :--- |
| 🚀 **Live Production App** | **[https://nyaymitra-ftpx.onrender.com](https://nyaymitra-ftpx.onrender.com)** | Full-featured responsive web application |
| 📚 **Interactive API Docs** | **[https://nyaymitra-ftpx.onrender.com/docs](https://nyaymitra-ftpx.onrender.com/docs)** | OpenAPI Swagger interactive API test bench |
| 📁 **GitHub Repository** | **[https://github.com/shivam-1919/Nyaymitra](https://github.com/shivam-1919/Nyaymitra)** | Source code, test suites & documentation |

---

## ⚡ 60-Second Judge Evaluation Walkthrough

Experience the complete end-to-end workflow on the live deployment in under a minute:

1. **Open the Portal:** Navigate to **[https://nyaymitra-ftpx.onrender.com](https://nyaymitra-ftpx.onrender.com)**.
2. **Switch Language (Optional):** Use the top-right header selector to switch between **English**, **हिन्दी (Hindi)**, **Hinglish**, **मराठी (Marathi)**, **বাংলা (Bengali)**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, or **ગુજરાતી (Gujarati)** — observe full-page reactive translation.
3. **Select or Describe a Grievance:**
   * In **NyayaSetu (Step 1)**, click one of the interactive grievance pills (e.g., *"Road Repair Delay"*, *"Ration Card Stuck"*, *"Rent Deposit Held"* or *"Police FIR Refused"*).
   * Notice the **Supported Civic Grievances Note** clearly separating civic matters from general legal queries.
4. **Answer Guided Questionnaire (Step 2):**
   * Click **Continue to Guided Analysis**.
   * Notice that all questions, hints, and dropdowns (e.g. BPL Fee Exemption, Location, Date) are fully translated into the active language while retaining your typed input.
5. **View Authority & Confidence Badge (Step 3):**
   * See the identified Public Authority with statutory confidence (**🟢 Confirmed from Official Source** / **🟡 Likely Jurisdiction**).
6. **Generate Ready-to-Print Action Pack (Step 4):**
   * Click **Generate Ready-to-Print Action Pack** to receive the official Section 6(1) RTI Application, Evidence Checklist, and Statutory Timeline.
7. **Personalize & Download Clean PDF:**
   * Click **Download PDF** ➔ The **Personalize Official Document Modal** allows live editing of citizen name, postal address, authority, and filing date.
   * Download the generated vector PDF — formatted with official ASCII letterhead, alignment grids, and stamp styling.
8. **Track Case & Trigger First Appeal (Step 5):**
   * Click **Track Case** to save in persistent storage. If 30 days elapse without a PIO response, generate a **1-Click Section 19(1) Statutory First Appeal**.

---

## 🧭 The Citizen Journey Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. CITIZEN PROBLEM INPUT                                                    │
│    • Plain Text or Voice Input in 8 Indian Languages                       │
│    • Supported Civic Scope: Municipal, Ration, Police, Rent, Utilities, TVC │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. TARGETED DYNAMIC QUESTIONNAIRE                                           │
│    • Fact Gathering (Application Dates, Receipt / Acknowledgment No.)       │
│    • Multilingual Translation + Reactive Input Preservation                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. STATUTORY JURISDICTION & AUTHORITY AUDIT                                 │
│    • Authority Resolution & Gazette Mapping                                 │
│    • Transparent Confidence Scoring (🟢 Confirmed  🟡 Likely  🔴 Verified)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. FORM-READY ACTION PACK & NOTICE GENERATOR                                │
│    • Section 6(1) Discoverable-Records RTI Draft                            │
│    • Mandatory Evidence & Annexure Checklist                                │
│    • Pre-PDF Personal Details Customizer Modal + Clean Vector PDF Engine    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. DOCKET TRACKER & STATUTORY FIRST APPEAL                                  │
│    • Local Storage Persistent Docket Management                             │
│    • 30-Day Response Clock + 1-Click Section 19(1) First Appeal Generator   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Comprehensive Feature Breakdown

### 🎯 1. NyayaSetu (न्यायसेतु) Action Engine
- **Civic Grievance to Legal Records:** Converts complaints about broken roads, delayed ration cards, street vendor harassment, and utility failures into statutory RTI petitions seeking discoverable government records (sanction orders, muster rolls, logbooks).
- **Supported Grievances Matrix:** 9 interactive categories with 1-click autofill:
  - 🛣️ *Municipal & Road Works*
  - 🍚 *Ration Card & Food Security (NFSA 2013)*
  - 👮 *Police FIR Inaction (BNSS Section 173)*
  - 🏠 *Rent & Security Deposit (Model Tenancy)*
  - ⚡ *Electricity & Water Supply*
  - 🛒 *Street Vendor Rights (Street Vendors Act 2014)*
  - 📜 *Caste, Income & Domicile Certificates*
  - 👴 *Pensions & Welfare Schemes*
  - 🏥 *Consumer Disputes & Healthcare*

### 📋 2. Conversational RTI Form-Filler (Form 'A')
- Step-by-step 6-question wizard designed for first-time filers.
- Auto-populates standard **Form 'A' under Section 6(1) of the RTI Act, 2005**.
- Supports BPL (Below Poverty Line) fee exemption declarations.

### 🏛️ 3. Welfare Schemes Eligibility Engine
- Multi-parameter eligibility matcher covering **16 verified national schemes**:
  - *PM-SVANidhi, Ayushman Bharat (PM-JAY), PMAY Urban/Gramin, PM-KMY, Atal Pension Yojana, Sukanya Samriddhi Yojana, National Social Assistance Programme (NSAP), etc.*
- Provides step-by-step **Online / Offline application SOPs**, direct portal links, and required document checklists.

### 📝 4. Court-Standard Legal Notice Drafter
- Automated 15-Day Demand Notice generator with statutory interest claims:
  - *Section 138 Negotiable Instruments Act (Cheque Bounce)*
  - *Tenant Security Deposit Refund with 18% Interest*
  - *Unlawful Eviction Notice & Consumer Deficiency Notice*

### 📄 5. Document Clause Risk Auditor & Camera OCR
- Live mobile camera capture & file upload (PDF, JPG, PNG, TXT).
- Powered by Gemini Multimodal Vision to flag high-risk clauses, one-sided penalties, and rights-waiving traps in rental agreements and contracts.

### 📚 6. Bharatiya Nyaya Sanhita (BNS 2023) vs. IPC Crosswalk
- Searchable comparative database mapping the new 2024 criminal law provisions (BNS, BNSS, BSA) to legacy IPC sections.

### 🚨 7. Citizen Rights & 24x7 SOS Directory
- Speed-dial emergency directory: **112** (All-in-One), **1091** (Women Helpline), **1930** (Cyber Fraud), **15100** (NALSA Free Legal Aid).
- Pocket SOPs for citizen arrest rights, FIR filing protocols, and police search guidelines.

---

## 📱 Mobile-First UX & Accessibility

NyayMitra was engineered specifically for accessibility on budget mobile devices used by everyday Indian citizens:

- **Pinned 5-Item Mobile Bottom Bar:** Touch-friendly navigation (`Action`, `RTI Form`, `Advisor`, `Schemes`, `Tools`).
- **Responsive Bottom-Sheet Menu:** Smooth modal drawer for secondary tools on mobile screens.
- **Touch Momentum Scrolling:** Smooth, overflow-contained horizontal navigation tabs.
- **Voice-to-Text Input:** Integrated Web Speech API for voice-driven grievance description.
- **Day / Night Mode Toggle:** Eye-friendly contrast modes for low-light conditions.

---

## 📄 Vector PDF Engine & Pre-PDF Customizer

To prevent blank pages, character misalignment, or unformatted exports:
- **Client-Side Vector jsPDF Engine:** Generates lightweight, printable, vectorized PDF dockets directly in the browser.
- **Pre-PDF Personal Details Customizer Modal:** Citizens can review and live-edit applicant full name, postal address, authority addressee, filing city, and docket reference before downloading.
- **Sanitized ASCII Letterheads:** Crisp typography formatted with clean ASCII dividers, reference blocks, and verification signature areas.

---

## 🌐 Complete Multilingual Support (8 Indian Languages)

NyayMitra features deep reactive internationalization (`frontend/js/i18n.js`):
- **Languages Supported:**
  1. 🇬🇧 English
  2. 🇮🇳 हिन्दी (Hindi)
  3. 🗣️ Hinglish
  4. 🚩 मराठी (Marathi)
  5. 🌾 বাংলা (Bengali)
  6. 🛕 தமிழ் (Tamil)
  7. 🏛️ తెలుగు (Telugu)
  8. 🌊 ગુજરાતી (Gujarati)
- **186+ UI Keys & Dynamic Questionnaire Fields:** 100% dictionary coverage across all pages, forms, placeholders, options, and error messages.
- **Reactive Input Retention:** Switching language preserves user-entered text without resetting forms.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **AI & LLM** | Google Gemini 3.7 Flash (`google-genai` SDK), Gemini Multimodal Vision OCR |
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, Modern CSS3, Tailwind CSS (CDN) |
| **Icons & UI** | Lucide Icons, Glassmorphism design tokens |
| **PDF Generation** | jsPDF Vector Engine (Client-Side) |
| **Deployment** | Render Web Services (Production Linux Container) |
| **Testing** | Pytest, FastAPI TestClient, Custom Automated E2E Test Suites |

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/shivam-1919/Nyaymitra.git
cd Nyaymitra
```

### 2. Create & Activate Virtual Environment
**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux / macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
HOST=127.0.0.1
PORT=8000
```
*(Note: If no Gemini API key is supplied, NyayMitra automatically operates with its rich offline statutory database and heuristic engine.)*

### 5. Launch the Application
```bash
python run.py
```
Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your browser.

---

## 🧪 Comprehensive Automated Test Suites

The codebase includes automated test suites covering all system layers:

```bash
# Run full system & endpoint integration test
python test_suite.py

# Verify 100% HTML i18n dictionary coverage across all 8 languages
python test_full_page_i18n.py

# Verify dynamic questionnaire localization & Hindi translations
python test_questionnaire_i18n.py

# Verify PDF customizer modal and vector export engine
python test_customizer_and_i18n.py
```

**Test Results:** **100% PASS** across all modules and verification benchmarks.

---

## 🛡️ Privacy, Safety & Ethical AI Design

1. **Zero PII Retention:** No personal identification data or phone numbers are permanently stored on the server; document rendering occurs client-side.
2. **Server-Side Credential Isolation:** Gemini API keys are strictly loaded through secure environment variables and never exposed to the client browser.
3. **Anti-Hallucination Grounding:** Welfare scheme amounts and eligibility rules are verified against versioned static legal databases (`backend/data/verified_welfare_schemes.json`).
4. **Clear Scope Enforcement:** Transparently disclaims that the system provides statutory guidance and connects users to NALSA (**15100**) for complex litigation.

---

## 👥 Contributors & Hackathon Team

* **Lead Development:** Shivam ([@shivam-1919](https://github.com/shivam-1919))
* **Project Name:** NyayMitra AI (न्यायमित्र AI)
* **License:** MIT License
* **Target Track:** AI for Social Good / Civic-Tech & Legal Access
