# ⚖️ NyayMitra AI (न्यायमित्र AI)

### Multilingual AI Civic-Rights Navigator, Legal Assistant & RTI Action Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![Google GenAI](https://img.shields.io/badge/Google%20GenAI-Gemini%203.7%20Flash-orange.svg)](https://ai.google.dev/)
[![Tests](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen.svg)]()
[![Deployment](https://img.shields.io/badge/Deployment-Render-success.svg)](https://render.com)
[![Status](https://img.shields.io/badge/Status-Live-success.svg)]()

**NyayMitra AI (न्यायमित्र AI)** is a citizen-first, multilingual civic-tech and legal assistance platform that empowers Indian citizens to understand their statutory rights, identify responsible government authorities, draft discoverable-records RTI applications, check welfare scheme eligibility, and generate court-standard legal notices.

Instead of generic chatbot responses, NyayMitra converts everyday citizen complaints into actionable, verified **Action Packs** complete with statutory deadlines, evidence checklists, and official PDF documents.

> **Disclaimer:** This tool provides general guidance based on publicly available law and is not a substitute for professional legal advice. For complex matters, consult a lawyer or NALSA (15100).

---

## 🌐 Live Demo & API Documentation

* 🚀 **Live Production Application:**  
  **[https://nyaymitra-ftpx.onrender.com](https://nyaymitra-ftpx.onrender.com)**

* 📚 **Interactive FastAPI OpenAPI Documentation:**  
  **[https://nyaymitra-ftpx.onrender.com/docs](https://nyaymitra-ftpx.onrender.com/docs)**

---

## ⚡ Try It In 60 Seconds (Judge Walkthrough)

Experience the complete end-to-end workflow on the live deployment in under a minute:

1. **Open the Live Portal:** Navigate to **[https://nyaymitra-ftpx.onrender.com](https://nyaymitra-ftpx.onrender.com)**.
2. **Select or Type a Problem:** Click the quick scenario pill or type:  
   *`"My landlord is refusing to refund my ₹50,000 security deposit after 2 months of vacating the flat."`*
3. **Answer Guided Follow-up:** Click **Continue to Guided Analysis** and confirm the deposit amount and city.
4. **View Statutory Rights & Authority:** See the verified Rent Authority jurisdiction under the Model Tenancy Act with the 🟢 **Confirmed from Official Source** confidence badge.
5. **Generate Ready-to-Print Action Pack:** Click **Generate Ready-to-Print Action Pack** to instantly receive:
   * Formal 15-Day Demand Notice to Landlord claiming deposit + 18% statutory interest.
   * Section 6(1) RTI Application seeking local Rent Authority inspection logs.
   * 1-Click clean **PDF Download** with official letterhead and stamp styling.

---

# 🧭 The Citizen Journey

```text
┌──────────────────────────────┐
│  1. Describe Problem         │  (Natural language or Voice in 8 Indian Languages)
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ 2. Guided Targeted Questions │  (Collects essential facts with statutory rationale)
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ 3. Rights & Authority Audit  │  (🟢 Confirmed 🟡 Likely 🔴 Needs Verification)
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ 4. Generate Action Pack      │  (Records-Based RTI + Legal Notice + Timeline)
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ 5. Track Docket & Appeal     │  (30-Day Clock & 1-Click Sec 19(1) First Appeal)
└──────────────────────────────┘
```

---

# 🌟 Core Feature Modules

### 🎯 Primary Hackathon Pillars

| Module | Citizen Problem | AI & Statutory Solution |
|---|---|---|
| 🧭 **Civic Rights & RTI Navigator (NyayaSetu)** | *"My road is broken / ration card stuck / municipality unresponsive."* | Maps grievance to nodal authority, calculates statutory 30-day RTI deadlines, and drafts court-standard records-based RTI requests. |
| 📋 **Conversational RTI Form-Filler** | *"I need to file an official RTI but don't know the format."* | 6-question guided wizard auto-populating official statutory **Form 'A' (Section 6(1) RTI Act)** with 1-click clean PDF export. |
| 🏛️ **Welfare Schemes Eligibility Engine** | *"Which government subsidies or pensions do I qualify for?"* | Real-time multi-criteria matcher against **16 verified welfare schemes** (PMAY, Ayushman Bharat, PM-SVANidhi, PM-KMY) with step-by-step application SOPs. |
| 📝 **Court-Standard Legal Notice Drafter** | *"I need to serve a legal notice to recover my money / rent deposit."* | Generates 15-Day Demand Notices (Sec 138 NI Act Cheque Bounce, Tenancy Eviction, Consumer Disputes) in stamped court paper format. |

### 🛠️ Additional Supporting Tools

* 💬 **AI Legal Advisor:** Scoped conversational assistant with domain-level guardrails for RTI, tenant rights, consumer protection, and welfare schemes.
* 📄 **Document Clause Risk Auditor:** Live mobile camera OCR & PDF uploader auditing contracts for one-sided penalties and rights-waiving traps.
* 📚 **BNS 2023 vs. IPC Crosswalk:** Searchable comparative database mapping the new Bharatiya Nyaya Sanhita criminal provisions to legacy IPC sections.
* 🚨 **Citizen Rights & Emergency SOS Directory:** One-touch speed-dial helplines (112, 1091, 1930, 15100 NALSA) and constitutional arrest/FIR pocket SOPs.
* 📊 **Citizen Docket Tracker:** Local persistent case tracker with remaining response days countdown and 1-click Section 19(1) First Appeal generation.

---

# 🟢 Confidence Indicator System

NyayMitra uses a transparent, evidence-grounded confidence evaluation system:

* 🟢 **Confirmed from Official Source:** High statutory confidence verified against indexed ministry gazettes, municipal acts, and statutory rules.
* 🟡 **Likely Jurisdiction:** Inferred authority requiring confirmation of local ward/tehsil boundaries.
* 🔴 **Needs Human Verification:** Ambiguous or out-of-scope complaints requiring consultation with a qualified advocate or NALSA Free Legal Aid (**15100**).

---

# 🚀 Quick Start (Local Setup)

## 1. Clone Repository

```bash
git clone https://github.com/shivam-1919/Nyaymitra.git
cd Nyaymitra
```

## 2. Create & Activate Virtual Environment

### Windows (PowerShell)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Linux / macOS
```bash
python3 -m venv .venv
source .venv/bin/activate
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
HOST=127.0.0.1
PORT=8000
```

*(Note: If no API key is provided, NyayMitra automatically switches to the built-in offline knowledge database and demo safety fallback engine.)*

## 5. Start the Application

Run using the runner script:

```bash
python run.py
```

Or run via Uvicorn directly:

```bash
uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

## 6. Access in Browser

* **Web Application:** `http://127.0.0.1:8000`
* **Swagger API Docs:** `http://127.0.0.1:8000/docs`

---

# 🧪 Automated Test Suite

NyayMitra includes an automated end-to-end verification suite testing all API endpoints, JavaScript controllers, scheme metadata, and document generators:

```bash
python test_suite.py
python test_system.py
```

**Test Status:** 100% of endpoints, controllers, and welfare schemes validated successfully.

---

# ☁️ Deployment on Render

NyayMitra is pre-configured for zero-downtime deployment on Render via `render.yaml`:

* **Runtime:** Python 3.11.9
* **Build Command:** `pip install -r requirements.txt`
* **Start Command:** `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
* **Environment Variable:** `GEMINI_API_KEY` configured in Render Dashboard.

---

# 🛡️ Privacy & Safety Architecture

1. **No Sensitive PII Retention:** Form generation occurs client-side and in ephemeral session memory.
2. **Server-Side Key Isolation:** API credentials are strictly managed through environment variables; client keys are never accepted or exposed in the UI.
3. **Static Verified Data:** Welfare scheme eligibility criteria are loaded from versioned static configurations (`backend/data/verified_welfare_schemes.json`) preventing LLM hallucination on financial numbers.

---

# 👨‍💻 Project Information

* **Repository:** [https://github.com/shivam-1919/Nyaymitra](https://github.com/shivam-1919/Nyaymitra)
* **Live App:** [https://nyaymitra-ftpx.onrender.com](https://nyaymitra-ftpx.onrender.com)
* **Built for:** Civic-Tech & Legal AI Access Hackathon
