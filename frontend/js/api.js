/**
 * NyayMitra API Client & Clean Legal PDF Exporter
 * Clean interface to FastAPI backend endpoints with built-in robust PDF generation.
 */

const API = {
  baseURL: '',

  async checkHealth() {
    try {
      const res = await fetch(`${this.baseURL}/api/health`);
      return await res.json();
    } catch (err) {
      console.error('Health check failed:', err);
      return { status: 'offline', gemini_configured: false };
    }
  },

  async updateConfig(apiKey, model = null) {
    const res = await fetch(`${this.baseURL}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemini_api_key: apiKey, gemini_model: model })
    });
    return await res.json();
  },

  async testConfig(apiKey = null, model = null) {
    const res = await fetch(`${this.baseURL}/api/config/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gemini_api_key: apiKey, gemini_model: model })
    });
    return await res.json();
  },

  // Citizen Authentication
  async sendOtp(phoneOrEmail, name = 'Citizen') {
    const res = await fetch(`${this.baseURL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_or_email: phoneOrEmail, name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to send OTP');
    }
    return await res.json();
  },

  async verifyOtp(phoneOrEmail, otp, name = 'Citizen') {
    const res = await fetch(`${this.baseURL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_or_email: phoneOrEmail, otp, name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'OTP verification failed');
    }
    return await res.json();
  },

  async getTemplates() {
    const res = await fetch(`${this.baseURL}/api/templates`);
    return await res.json();
  },

  async sendChatMessage(message, history = [], language = 'English') {
    const res = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Chat query failed');
    }
    return await res.json();
  },

  async generateDraft(templateId, formData) {
    const res = await fetch(`${this.baseURL}/api/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: templateId, form_data: formData })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Document drafting failed');
    }
    return await res.json();
  },

  async analyzeText(text, documentName = 'Pasted Text') {
    const res = await fetch(`${this.baseURL}/api/analyze/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, document_name: documentName })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Document text analysis failed');
    }
    return await res.json();
  },

  async analyzeFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${this.baseURL}/api/analyze/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Document upload analysis failed');
    }
    return await res.json();
  },

  async getStatutes(query = '', category = 'All') {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category && category !== 'All') params.append('category', category);
    
    const res = await fetch(`${this.baseURL}/api/statutes?${params.toString()}`);
    return await res.json();
  },

  async getCitizenRights() {
    const res = await fetch(`${this.baseURL}/api/rights`);
    return await res.json();
  },

  // NyayaSetu Civic Engine APIs
  async analyzeCivicProblem(problemText) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/analyze-problem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_text: problemText })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Civic problem analysis failed');
    }
    return await res.json();
  },

  async analyzeProblem(problemText) {
    return this.analyzeCivicProblem(problemText);
  },

  async generateActionPack(problemText, answers, authority) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/generate-action-pack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem_text: problemText, answers, authority })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Action pack generation failed');
    }
    return await res.json();
  },

  async generateFirstAppeal(appealData) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/generate-first-appeal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appealData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'First appeal generation failed');
    }
    return await res.json();
  },

  async checkSchemes(profileData) {
    const res = await fetch(`${this.baseURL}/api/nyayasetu/schemes/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Scheme check failed');
    }
    return await res.json();
  }
};

/**
 * Robust, Clean-Room Legal PDF Exporter
 * Creates an isolated off-screen printable legal document with official letterhead,
 * pure black-and-white high-contrast typography, and explicit page rules.
 * Completely eliminates the blank page bug.
 */
window.downloadCleanLegalPdf = function(options) {
  const {
    title = 'FORMAL LEGAL NOTICE & STATUTORY APPLICATION',
    subtitle = 'Under the Right to Information Act, 2005 / Bharatiya Nyaya Sanhita, 2023',
    refNo = `NM-${Date.now().toString().slice(-6)}`,
    applicantName = 'Citizen Applicant',
    authorityName = 'Public Information Officer / Designated Authority',
    contentHtml = '',
    checklist = [],
    timeline = [],
    filename = `NyayMitra_Document_${Date.now()}`
  } = options;

  // Create isolated container in document body
  const printWrapper = document.createElement('div');
  printWrapper.id = 'clean-legal-pdf-render';
  printWrapper.style.position = 'fixed';
  printWrapper.style.left = '-9999px';
  printWrapper.style.top = '0';
  printWrapper.style.width = '794px'; // Standard A4 width at 96 DPI
  printWrapper.style.backgroundColor = '#ffffff';
  printWrapper.style.color = '#000000';
  printWrapper.style.fontFamily = '"Times New Roman", Times, Georgia, serif';
  printWrapper.style.padding = '40px 45px';
  printWrapper.style.lineHeight = '1.6';
  printWrapper.style.boxSizing = 'border-box';
  printWrapper.style.zIndex = '-999';

  // Build checklist HTML if present
  let checklistHtml = '';
  if (checklist && checklist.length > 0) {
    checklistHtml = `
      <div style="margin-top: 24px; padding: 12px; border: 1px solid #333333; background-color: #f9f9f9; page-break-inside: avoid;">
        <h4 style="margin: 0 0 8px 0; font-size: 11pt; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #cccccc; padding-bottom: 4px;">
          Mandatory Attachment Checklist:
        </h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 10.5pt;">
          ${checklist.map(item => `<li style="margin-bottom: 4px;">[  ] ${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Build timeline HTML if present
  let timelineHtml = '';
  if (timeline && timeline.length > 0) {
    timelineHtml = `
      <div style="margin-top: 20px; padding: 12px; border: 1px dashed #555555; background-color: #ffffff; page-break-inside: avoid;">
        <h4 style="margin: 0 0 8px 0; font-size: 11pt; text-transform: uppercase; letter-spacing: 0.05em;">
          Statutory Follow-Up Timeline:
        </h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 10.5pt;">
          ${timeline.map(t => `<li style="margin-bottom: 4px;"><strong>Day ${t.day || t.step || '•'}:</strong> ${t.label || t.action || t.text}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  printWrapper.innerHTML = `
    <!-- Formal Legal Header -->
    <div style="text-align: center; border-bottom: 2px solid #000000; padding-bottom: 14px; margin-bottom: 22px;">
      <div style="font-size: 10pt; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; color: #444444; margin-bottom: 4px;">
        NyayaMitra (न्यायमित्र) • Citizen Legal Rights &amp; Statutory Action
      </div>
      <h1 style="margin: 0; font-size: 17pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.03em; color: #000000;">
        ${title}
      </h1>
      <div style="font-size: 10pt; font-style: italic; color: #333333; margin-top: 4px;">
        ${subtitle}
      </div>
    </div>

    <!-- Metadata Reference Bar -->
    <div style="display: flex; justify-content: space-between; font-size: 10.5pt; border-bottom: 1px solid #888888; padding-bottom: 10px; margin-bottom: 24px;">
      <div>
        <strong>Docket / Ref No:</strong> ${refNo}<br/>
        <strong>Authority / Addressee:</strong> ${authorityName}
      </div>
      <div style="text-align: right;">
        <strong>Date of Filing:</strong> ${currentDate}<br/>
        <strong>Applicant:</strong> ${applicantName}
      </div>
    </div>

    <!-- Main Legal Content Body -->
    <div style="font-size: 12pt; text-align: justify; color: #000000; line-height: 1.65; margin-bottom: 24px;">
      ${contentHtml}
    </div>

    ${checklistHtml}
    ${timelineHtml}

    <!-- Official Signature & Verification Block -->
    <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #000000; display: flex; justify-content: space-between; font-size: 10.5pt; page-break-inside: avoid;">
      <div>
        <p style="margin: 0;"><strong>Place:</strong> _____________________</p>
        <p style="margin: 4px 0 0 0;"><strong>Date:</strong> ${currentDate}</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0 0 35px 0;"><strong>Signature of Applicant / Citizen:</strong></p>
        <p style="margin: 0; font-weight: bold;">(${applicantName})</p>
      </div>
    </div>

    <div style="margin-top: 25px; font-size: 8.5pt; color: #666666; text-align: center; border-top: 1px dotted #aaaaaa; padding-top: 8px;">
      Generated via NyayaMitra Citizen Action Portal • Under Right to Information Act, 2005 &amp; Applicable Laws of India
    </div>
  `;

  document.body.appendChild(printWrapper);

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollY: 0,
      scrollX: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(printWrapper).save().then(() => {
      if (document.body.contains(printWrapper)) {
        document.body.removeChild(printWrapper);
      }
    }).catch(err => {
      console.error("html2pdf generation error:", err);
      // Clean fallback: window.print()
      if (document.body.contains(printWrapper)) {
        document.body.removeChild(printWrapper);
      }
      window.print();
    });
  } else {
    window.print();
    if (document.body.contains(printWrapper)) {
      document.body.removeChild(printWrapper);
    }
  }
};

window.NyayMitraAPI = API;
