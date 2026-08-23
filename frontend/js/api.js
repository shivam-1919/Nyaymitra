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
 * Text sanitization helper to eliminate Unicode font corruptions in jsPDF standard fonts.
 * Converts symbols and strips non-ASCII bytes so output is crisp and never shows ( ( M / > / . ? $ M 0).
 */
function sanitizeForPdf(text) {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, "-")
    .replace(/₹/g, "Rs. ")
    .replace(/[•\u2022]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters that break standard jsPDF fonts
    .replace(/ +/g, " ")
    .trim();
}

/**
 * Universal Pre-PDF Citizen Details Modal
 * Allows citizens to view and edit their Name, Postal Address, Authority, Place, and Date
 * immediately before generating their official court-standard PDF.
 */
window.openPdfCustomizerModal = function(options) {
  const user = JSON.parse(localStorage.getItem('nyaymitra_user') || '{}');
  const applicantName = options.applicantName || user.name || 'Citizen Applicant';
  const applicantAddress = options.applicantAddress || user.address || '';
  const authorityName = options.authorityName || 'Public Information Officer / Designated Authority';
  const filingPlace = options.filingPlace || user.city || 'India';
  const filingDate = options.filingDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const refNo = options.refNo || `NM-${Date.now().toString().slice(-6)}`;

  const modal = document.getElementById('pdf-customizer-modal');
  if (!modal) {
    // If modal DOM element is not yet in document, proceed with direct download
    return window.generateDirectLegalPdf({ ...options, skipModal: true });
  }

  const nameInput = document.getElementById('pdf-cust-name');
  const addressInput = document.getElementById('pdf-cust-address');
  const authorityInput = document.getElementById('pdf-cust-authority');
  const placeInput = document.getElementById('pdf-cust-place');
  const dateInput = document.getElementById('pdf-cust-date');
  const refInput = document.getElementById('pdf-cust-ref');

  if (nameInput) nameInput.value = applicantName;
  if (addressInput) addressInput.value = applicantAddress;
  if (authorityInput) authorityInput.value = authorityName;
  if (placeInput) placeInput.value = filingPlace;
  if (dateInput) dateInput.value = filingDate;
  if (refInput) refInput.value = refNo;

  modal.classList.remove('hidden');

  // Wire close & cancel buttons
  const closeBtn = document.getElementById('pdf-modal-close-btn');
  const cancelBtn = document.getElementById('pdf-modal-cancel-btn');
  const confirmBtn = document.getElementById('pdf-modal-confirm-btn');

  const closeModal = () => {
    modal.classList.add('hidden');
  };

  if (closeBtn) closeBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      const updatedName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : applicantName;
      const updatedAddress = addressInput ? addressInput.value.trim() : applicantAddress;
      const updatedAuth = (authorityInput && authorityInput.value.trim()) ? authorityInput.value.trim() : authorityName;
      const updatedPlace = (placeInput && placeInput.value.trim()) ? placeInput.value.trim() : filingPlace;
      const updatedDate = (dateInput && dateInput.value.trim()) ? dateInput.value.trim() : filingDate;
      const updatedRef = (refInput && refInput.value.trim()) ? refInput.value.trim() : refNo;

      // Save user profile for persistence
      user.name = updatedName;
      if (updatedAddress) user.address = updatedAddress;
      if (updatedPlace) user.city = updatedPlace;
      localStorage.setItem('nyaymitra_user', JSON.stringify(user));

      // Update header user pill if present
      const headerUserPill = document.getElementById('header-user-name');
      if (headerUserPill) headerUserPill.textContent = updatedName;

      closeModal();

      // Trigger direct PDF generation
      window.generateDirectLegalPdf({
        ...options,
        applicantName: updatedName,
        applicantAddress: updatedAddress,
        authorityName: updatedAuth,
        filingPlace: updatedPlace,
        filingDate: updatedDate,
        refNo: updatedRef,
        skipModal: true
      });
    };
  }
};

/**
 * Robust, Court-Standard Clean Legal PDF Exporter
 * Generates official high-contrast, crystal-clear vector legal PDFs directly with jsPDF.
 * Intercepts download with the Citizen Details Customizer unless skipModal is true.
 */
window.downloadCleanLegalPdf = function(options) {
  if (options && options.skipModal) {
    return window.generateDirectLegalPdf(options);
  }
  return window.openPdfCustomizerModal(options);
};

window.generateDirectLegalPdf = function(options) {
  const {
    title = 'FORMAL LEGAL NOTICE & STATUTORY APPLICATION',
    subtitle = 'Under the Right to Information Act, 2005 / Bharatiya Nyaya Sanhita, 2023',
    refNo = `NM-${Date.now().toString().slice(-6)}`,
    applicantName = 'Citizen Applicant',
    applicantAddress = '',
    authorityName = 'Public Information Officer / Designated Authority',
    filingPlace = 'India',
    filingDate = '',
    contentHtml = '',
    checklist = [],
    timeline = [],
    filename = `NyayMitra_Document_${Date.now()}`
  } = options;

  const currentDate = filingDate || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const cleanFilename = (filename || 'NyayMitra_Legal_Document').replace(/[^a-zA-Z0-9_-]/g, '_');
  const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

  if (jsPDFClass) {
    try {
      const doc = new jsPDFClass({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 18;
      const contentWidth = pageWidth - (margin * 2); // 174 mm
      let currentY = margin;

      // Page break check helper
      const checkPageBreak = (neededHeight) => {
        if (currentY + neededHeight > pageHeight - 22) {
          doc.addPage();
          currentY = margin + 2;
          // Running top header on continuation pages
          doc.setFont('times', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text(`NyayaMitra Official Action Document • Ref: ${sanitizeForPdf(refNo)} (Contd.)`, margin, currentY - 5);
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.3);
          doc.line(margin, currentY - 3, pageWidth - margin, currentY - 3);
          doc.setTextColor(15, 23, 42);
          return true;
        }
        return false;
      };

      // 1. Official Header (Pure Clean Latin/ASCII text - No garbled symbols)
      doc.setFont('times', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text("NYAYAMITRA • CITIZEN LEGAL RIGHTS & STATUTORY ACTION", pageWidth / 2, currentY, { align: 'center' });
      currentY += 5.5;

      doc.setFont('times', 'bold');
      doc.setFontSize(13.5);
      doc.setTextColor(0, 0, 0);
      const cleanTitle = sanitizeForPdf(title).toUpperCase();
      const splitTitle = doc.splitTextToSize(cleanTitle, contentWidth);
      doc.text(splitTitle, pageWidth / 2, currentY, { align: 'center' });
      currentY += (splitTitle.length * 5.5) + 1.5;

      if (subtitle) {
        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const cleanSub = sanitizeForPdf(subtitle);
        const splitSub = doc.splitTextToSize(cleanSub, contentWidth);
        doc.text(splitSub, pageWidth / 2, currentY, { align: 'center' });
        currentY += (splitSub.length * 4.2) + 2.5;
      }

      // Header separator line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.6);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 1.2;
      doc.setLineWidth(0.2);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5;

      // 2. Metadata Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.35);
      doc.roundedRect(margin, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

      doc.setFont('times', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text("Docket / Ref No:", margin + 3.5, currentY + 5.5);
      doc.setFont('times', 'normal');
      doc.text(` ${sanitizeForPdf(refNo)}`, margin + 28, currentY + 5.5);

      doc.setFont('times', 'bold');
      doc.text("Authority:", margin + 3.5, currentY + 12);
      doc.setFont('times', 'normal');
      const authLines = doc.splitTextToSize(sanitizeForPdf(authorityName), (contentWidth / 2) - 22);
      doc.text(authLines[0] || sanitizeForPdf(authorityName), margin + 20, currentY + 12);

      doc.setFont('times', 'bold');
      doc.text("Date of Issue:", (pageWidth / 2) + 5, currentY + 5.5);
      doc.setFont('times', 'normal');
      doc.text(` ${sanitizeForPdf(currentDate)}`, (pageWidth / 2) + 26, currentY + 5.5);

      doc.setFont('times', 'bold');
      doc.text("Applicant / Sender:", (pageWidth / 2) + 5, currentY + 12);
      doc.setFont('times', 'normal');
      const appLines = doc.splitTextToSize(sanitizeForPdf(applicantName), (contentWidth / 2) - 34);
      doc.text(appLines[0] || sanitizeForPdf(applicantName), (pageWidth / 2) + 33, currentY + 12);

      currentY += 23;

      // 3. Document Content Parser
      const parseContent = (raw) => {
        if (!raw) return [];
        const items = [];
        
        // If content is an HTML string, clean and extract blocks
        if (typeof raw === 'string' && raw.includes('<')) {
          const parser = new DOMParser();
          const parsed = parser.parseFromString(raw, 'text/html');
          
          const traverse = (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tag = node.tagName.toLowerCase();
              if (tag === 'h1' || tag === 'h2') {
                const t = sanitizeForPdf(node.textContent);
                if (t) items.push({ type: 'h2', text: t });
              } else if (tag === 'h3' || tag === 'h4') {
                const t = sanitizeForPdf(node.textContent);
                if (t) items.push({ type: 'h3', text: t });
              } else if (tag === 'p') {
                const t = sanitizeForPdf(node.textContent);
                if (t) items.push({ type: 'p', text: t });
              } else if (tag === 'li') {
                const t = sanitizeForPdf(node.textContent);
                if (t) items.push({ type: 'li', text: t });
              } else if (tag === 'blockquote') {
                const t = sanitizeForPdf(node.textContent);
                if (t) items.push({ type: 'quote', text: t });
              } else if (tag === 'table') {
                const rows = [];
                node.querySelectorAll('tr').forEach(tr => {
                  const cells = [];
                  tr.querySelectorAll('th, td').forEach(c => cells.push(sanitizeForPdf(c.textContent)));
                  if (cells.length > 0) rows.push(cells);
                });
                if (rows.length > 0) items.push({ type: 'table', rows });
              } else if (tag === 'hr') {
                items.push({ type: 'hr' });
              } else if (tag === 'div' || tag === 'section') {
                if (node.children.length === 0) {
                  const t = sanitizeForPdf(node.textContent);
                  if (t) items.push({ type: 'p', text: t });
                } else {
                  Array.from(node.childNodes).forEach(traverse);
                }
              } else {
                Array.from(node.childNodes).forEach(traverse);
              }
            }
          };
          traverse(parsed.body);
        } else {
          // Plain text / Markdown parsing
          const lines = String(raw).split('\n');
          lines.forEach(l => {
            const tr = sanitizeForPdf(l);
            if (!tr) return;
            if (tr.startsWith('# ')) items.push({ type: 'h2', text: tr.slice(2).trim() });
            else if (tr.startsWith('## ')) items.push({ type: 'h2', text: tr.slice(3).trim() });
            else if (tr.startsWith('### ')) items.push({ type: 'h3', text: tr.slice(4).trim() });
            else if (tr.startsWith('- ') || tr.startsWith('* ')) items.push({ type: 'li', text: tr.slice(2).trim() });
            else if (/^\d+\.\s/.test(tr)) items.push({ type: 'li', text: tr });
            else if (tr.startsWith('>')) items.push({ type: 'quote', text: tr.slice(1).trim() });
            else if (tr === '---' || tr === '***') items.push({ type: 'hr' });
            else items.push({ type: 'p', text: tr.replace(/\*\*(.*?)\*\*/g, '$1') });
          });
        }
        return items;
      };

      const contentNodes = parseContent(contentHtml);

      if (contentNodes.length === 0) {
        contentNodes.push({ type: 'p', text: 'This document represents a formal legal record submitted under statutory provisions.' });
      }

      contentNodes.forEach(item => {
        if (item.type === 'h2') {
          checkPageBreak(12);
          doc.setFont('times', 'bold');
          doc.setFontSize(11.5);
          doc.setTextColor(0, 0, 0);
          const lines = doc.splitTextToSize(item.text, contentWidth);
          doc.text(lines, margin, currentY);
          currentY += (lines.length * 5) + 2.5;
        } else if (item.type === 'h3') {
          checkPageBreak(10);
          doc.setFont('times', 'bold');
          doc.setFontSize(10.5);
          doc.setTextColor(30, 41, 59);
          const lines = doc.splitTextToSize(item.text, contentWidth);
          doc.text(lines, margin, currentY);
          currentY += (lines.length * 4.8) + 2;
        } else if (item.type === 'p') {
          doc.setFont('times', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          const lines = doc.splitTextToSize(item.text, contentWidth);
          const needed = (lines.length * 4.8) + 3;
          checkPageBreak(Math.min(needed, 18));
          doc.text(lines, margin, currentY);
          currentY += needed;
        } else if (item.type === 'li') {
          doc.setFont('times', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(30, 41, 59);
          const lines = doc.splitTextToSize(item.text, contentWidth - 7);
          checkPageBreak((lines.length * 4.5) + 2);
          doc.text("-", margin + 1.5, currentY);
          doc.text(lines, margin + 6, currentY);
          currentY += (lines.length * 4.5) + 2;
        } else if (item.type === 'quote') {
          doc.setFont('times', 'italic');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          const lines = doc.splitTextToSize(item.text, contentWidth - 10);
          const needed = (lines.length * 4.5) + 4;
          checkPageBreak(needed);
          doc.setDrawColor(30, 58, 138);
          doc.setLineWidth(0.8);
          doc.line(margin + 2, currentY - 1, margin + 2, currentY + needed - 3);
          doc.text(lines, margin + 8, currentY);
          currentY += needed + 2;
        } else if (item.type === 'hr') {
          checkPageBreak(5);
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.3);
          doc.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 5;
        } else if (item.type === 'table') {
          const colCount = Math.max(...item.rows.map(r => r.length));
          if (colCount > 0) {
            const colWidth = contentWidth / colCount;
            item.rows.forEach((row, rIdx) => {
              checkPageBreak(7);
              const isH = rIdx === 0;
              doc.setFont('times', isH ? 'bold' : 'normal');
              doc.setFontSize(8.5);
              doc.setTextColor(0, 0, 0);
              if (isH) {
                doc.setFillColor(241, 245, 249);
                doc.rect(margin, currentY - 3.8, contentWidth, 6.5, 'F');
              }
              doc.setDrawColor(203, 213, 225);
              doc.setLineWidth(0.25);
              doc.rect(margin, currentY - 3.8, contentWidth, 6.5, 'D');
              row.forEach((cell, cIdx) => {
                const cText = doc.splitTextToSize(cell, colWidth - 3)[0] || cell;
                doc.text(cText, margin + (cIdx * colWidth) + 1.5, currentY);
              });
              currentY += 6.5;
            });
            currentY += 3;
          }
        }
      });

      // 4. Checklist Box (if provided)
      if (checklist && checklist.length > 0) {
        const itemLines = checklist.map(it => doc.splitTextToSize(sanitizeForPdf(it), contentWidth - 14));
        const boxH = 11 + itemLines.reduce((s, l) => s + (l.length * 4.5) + 2, 0);
        checkPageBreak(boxH);

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(51, 65, 85);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin, currentY, contentWidth, boxH, 1.2, 1.2, 'FD');

        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text("MANDATORY STATUTORY ATTACHMENT CHECKLIST:", margin + 4, currentY + 6.5);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.line(margin + 4, currentY + 8.5, pageWidth - margin - 4, currentY + 8.5);

        let cy = currentY + 13.5;
        checklist.forEach((it, idx) => {
          const l = itemLines[idx];
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          doc.setDrawColor(71, 85, 105);
          doc.rect(margin + 4, cy - 3, 3.2, 3.2);
          doc.text(l, margin + 10, cy);
          cy += (l.length * 4.5) + 2;
        });
        currentY += boxH + 6;
      }

      // 5. Timeline Box (if provided)
      if (timeline && timeline.length > 0) {
        const tLines = timeline.map(t => {
          const label = `Day ${t.day || t.step || '-'}: ${t.label || t.action || t.text}`;
          return doc.splitTextToSize(sanitizeForPdf(label), contentWidth - 10);
        });
        const boxH = 10 + tLines.reduce((s, l) => s + (l.length * 4.5) + 2, 0);
        checkPageBreak(boxH);

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(71, 85, 105);
        doc.setLineWidth(0.35);
        doc.roundedRect(margin, currentY, contentWidth, boxH, 1.2, 1.2, 'D');

        doc.setFont('times', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text("STATUTORY FOLLOW-UP & COMPLIANCE TIMELINE:", margin + 4, currentY + 6.5);

        let cy = currentY + 12.5;
        tLines.forEach(l => {
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          doc.text(l, margin + 5, cy);
          cy += (l.length * 4.5) + 2;
        });
        currentY += boxH + 6;
      }

      // 6. Signature Block
      checkPageBreak(36);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.4);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5.5;

      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`Place: ${sanitizeForPdf(filingPlace)}`, margin, currentY);
      doc.text(`Date:  ${sanitizeForPdf(currentDate)}`, margin, currentY + 5.5);
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Verification: Verified under statutory provisions of Indian Law.", margin, currentY + 11);

      // Signature on right
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
      doc.text("Signature of Applicant / Citizen:", pageWidth - margin - 65, currentY);
      doc.setFont('times', 'normal');
      doc.text(`(${sanitizeForPdf(applicantName)})`, pageWidth - margin - 65, currentY + 15);

      // 7. Page Footers across all pages
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('times', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
        doc.text("Generated via NyayaMitra Citizen Legal Justice Portal • Under RTI Act, 2005 & Applicable Laws of India", margin, pageHeight - 7.5);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 7.5, { align: 'right' });
      }

      // Save directly to user device
      doc.save(`${cleanFilename}.pdf`);
      return;
    } catch (pdfErr) {
      console.error("Direct jsPDF error, attempting printable iframe fallback:", pdfErr);
    }
  }

  // Fallback: Standalone Printable Iframe
  try {
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${sanitizeForPdf(title)} - ${sanitizeForPdf(refNo)}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: "Times New Roman", Times, Georgia, serif; color: #000000; margin: 0; padding: 20px; line-height: 1.6; }
            h1 { font-size: 16pt; text-align: center; text-transform: uppercase; margin-bottom: 4px; }
            h2 { font-size: 13pt; margin-top: 14px; margin-bottom: 6px; }
            .meta { display: flex; justify-content: space-between; border-bottom: 1px solid #999; padding-bottom: 8px; margin-bottom: 16px; font-size: 10pt; }
            .content { font-size: 11pt; text-align: justify; }
            .sig { margin-top: 30px; display: flex; justify-content: space-between; border-top: 1px solid #000; padding-top: 12px; font-size: 10pt; }
          </style>
        </head>
        <body>
          <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 14px;">
            <div style="font-size: 9pt; font-weight: bold; color: #555; text-transform: uppercase;">NyayaMitra • Citizen Legal Rights &amp; Statutory Action</div>
            <h1>${sanitizeForPdf(title)}</h1>
            <div style="font-size: 10pt; font-style: italic; color: #555;">${sanitizeForPdf(subtitle)}</div>
          </div>
          <div class="meta">
            <div><strong>Docket / Ref:</strong> ${sanitizeForPdf(refNo)}<br/><strong>Authority:</strong> ${sanitizeForPdf(authorityName)}</div>
            <div style="text-align: right;"><strong>Date:</strong> ${sanitizeForPdf(currentDate)}<br/><strong>Applicant:</strong> ${sanitizeForPdf(applicantName)}</div>
          </div>
          <div class="content">${contentHtml}</div>
          <div class="sig">
            <div>Place: ${sanitizeForPdf(filingPlace)}<br/>Date: ${sanitizeForPdf(currentDate)}</div>
            <div style="text-align: right;">Signature of Applicant:<br/><br/><strong>(${sanitizeForPdf(applicantName)})</strong></div>
          </div>
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) document.body.removeChild(printFrame);
      }, 1000);
    }, 300);
  } catch (err) {
    console.error("Print fallback error:", err);
    window.print();
  }
};

window.NyayMitraAPI = API;
