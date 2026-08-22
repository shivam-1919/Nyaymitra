/**
 * NyayMitra Legal Drafting Studio
 * Dynamic template forms, AI draft generator, Court Paper Preview & PDF Exporter.
 */

class LegalDrafterController {
  constructor() {
    this.templates = [];
    this.selectedTemplateId = 'cheque_bounce_notice';
    this.currentDraftMarkdown = '';
    
    this.initElements();
    this.bindEvents();
    this.loadTemplates();
  }

  initElements() {
    this.templateListContainer = document.getElementById('drafter-template-list');
    this.formContainer = document.getElementById('drafter-dynamic-form');
    this.formTitle = document.getElementById('drafter-form-title');
    this.formDesc = document.getElementById('drafter-form-desc');
    this.generateBtn = document.getElementById('drafter-generate-btn');
    this.fillSampleBtn = document.getElementById('drafter-fill-sample-btn');
    
    this.previewContainer = document.getElementById('court-document-preview');
    this.previewPlaceholder = document.getElementById('drafter-preview-placeholder');
    this.previewContentBox = document.getElementById('drafter-preview-content-box');
    this.rawEditor = document.getElementById('drafter-raw-editor');
    
    this.copyBtn = document.getElementById('drafter-copy-btn');
    this.pdfBtn = document.getElementById('drafter-pdf-btn');
    this.printBtn = document.getElementById('drafter-print-btn');
    this.viewToggleBtn = document.getElementById('drafter-view-toggle');
    
    this.isRawMode = false;
  }

  bindEvents() {
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.handleGenerate());
    }

    if (this.fillSampleBtn) {
      this.fillSampleBtn.addEventListener('click', () => this.fillSampleData());
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    }

    if (this.pdfBtn) {
      this.pdfBtn.addEventListener('click', () => this.exportToPdf());
    }

    if (this.printBtn) {
      this.printBtn.addEventListener('click', () => window.print());
    }

    if (this.viewToggleBtn) {
      this.viewToggleBtn.addEventListener('click', () => this.toggleViewMode());
    }

    if (this.rawEditor) {
      this.rawEditor.addEventListener('input', (e) => {
        this.currentDraftMarkdown = e.target.value;
        this.renderPreview(this.currentDraftMarkdown);
      });
    }
  }

  async loadTemplates() {
    try {
      const data = await window.NyayMitraAPI.getTemplates();
      if (data && data.templates) {
        this.templates = data.templates;
        this.renderTemplateSelector();
        this.renderActiveForm();
      }
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  }

  renderTemplateSelector() {
    if (!this.templateListContainer) return;
    
    this.templateListContainer.innerHTML = this.templates.map(t => {
      const isActive = t.id === this.selectedTemplateId;
      return `
        <button 
          class="template-card w-full text-left p-3.5 rounded-xl border transition-all ${
            isActive 
              ? 'bg-amber-600/15 border-amber-600/50 shadow-sm' 
              : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/90'
          }"
          data-id="${t.id}"
        >
          <div class="flex items-center justify-between mb-1">
            <h4 class="font-semibold text-sm ${isActive ? 'text-amber-400 font-heading' : 'text-stone-200 font-heading'}">${t.title}</h4>
            ${isActive ? '<span class="w-2 h-2 rounded-full bg-amber-500"></span>' : ''}
          </div>
          <p class="text-xs text-stone-400 line-clamp-1 font-mono text-[11px]">${t.act}</p>
        </button>
      `;
    }).join('');

    // Bind selection clicks
    this.templateListContainer.querySelectorAll('.template-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.selectedTemplateId = id;
        this.renderTemplateSelector();
        this.renderActiveForm();
      });
    });
  }

  renderActiveForm() {
    const template = this.templates.find(t => t.id === this.selectedTemplateId);
    if (!template) return;

    if (this.formTitle) this.formTitle.textContent = template.title;
    if (this.formDesc) this.formDesc.textContent = `${template.act} • ${template.description}`;

    if (!this.formContainer) return;

    this.formContainer.innerHTML = template.fields.map(field => {
      let inputHtml = '';
      if (field.type === 'textarea') {
        inputHtml = `
          <textarea 
            id="field_${field.id}" 
            name="${field.id}" 
            rows="3" 
            placeholder="${field.placeholder || ''}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors"
            ${field.required ? 'required' : ''}
          ></textarea>
        `;
      } else if (field.type === 'select') {
        inputHtml = `
          <select 
            id="field_${field.id}" 
            name="${field.id}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors"
            ${field.required ? 'required' : ''}
          >
            ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
        `;
      } else {
        inputHtml = `
          <input 
            type="${field.type}" 
            id="field_${field.id}" 
            name="${field.id}" 
            placeholder="${field.placeholder || ''}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors"
            ${field.required ? 'required' : ''}
          />
        `;
      }

      return `
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-stone-300">
            ${field.label} ${field.required ? '<span class="text-amber-500">*</span>' : ''}
          </label>
          ${inputHtml}
        </div>
      `;
    }).join('');
  }

  fillSampleData() {
    const samples = {
      cheque_bounce_notice: {
        sender_name: "Advocate Rajeshwar V. Rao (on behalf of Shri Manish Verma)",
        sender_address: "Chamber No. 412, District Court Complex, Sector 12, Gurugram, Haryana - 122001",
        recipient_name: "M/s Apex Infrastructure Pvt. Ltd. (Through Director: Mr. Alok Singhania)",
        recipient_address: "Plot No. 89, Udyog Vihar Phase 4, Gurugram, Haryana - 122015",
        cheque_number: "094821",
        cheque_date: "2024-06-15",
        cheque_amount: "450000",
        bank_name: "HDFC Bank, Cyber City Branch, Gurugram",
        return_memo_date: "2024-07-02",
        return_reason: "Funds Insufficient",
        transaction_context: "Supply of architectural consultation and structural engineering services under Work Order #AR-2023-99 for commercial tower project."
      },
      rti_application: {
        applicant_name: "Kavita Narang",
        applicant_address: "Flat 502, Orchid Woods, Bellandur Outer Ring Road, Bengaluru, Karnataka - 560103",
        public_authority: "Bruhat Bengaluru Mahanagara Palike (BBMP) - Stormwater Drains Division",
        pio_designation: "Public Information Officer & Executive Engineer (SWD)",
        pio_office_address: "BBMP Head Office, Corporation Circle, Hudson Circle, Bengaluru - 560002",
        subject_matter: "Desilting tenders, sanction budget, and contractor inspection log for Bellandur Primary Stormwater Drain during FY 2023-24",
        specific_questions: "1. Provide certified copy of Work Order issued for desilting Bellandur main drain.\n2. Date of commencement and contractual date of completion.\n3. Total payment released to contractor till date.\n4. Name and designation of the quality verification officer who certified the work.",
        time_period: "01 April 2023 to 30 June 2024",
        bpl_status: "No (Rs 10 application fee attached)"
      },
      consumer_complaint_notice: {
        complainant_name: "Siddharth Sen",
        complainant_address: "Tower 2, Apt 804, Lodha Splendora, Ghodbunder Road, Thane West, Maharashtra - 400615",
        company_name: "Apex Electronics Retail India Ltd. & Samsung India Electronics Pvt. Ltd.",
        company_address: "Cyber City, DLF Phase 2, Gurugram, Haryana - 122002",
        product_service: "65-inch Neo QLED 4K Smart Television (Model QA65QN90B)",
        purchase_date: "2024-04-10",
        invoice_number: "INV-MUM-2024-7749",
        amount_paid: "145000",
        defect_description: "Within 20 days of delivery, vertical black pixel lines appeared across the entire display screen. Authorized service technician visited, acknowledged hardware display panel failure, but company refuses replacement citing fabricated physical impact clause.",
        compensation_demanded: "Immediate full replacement with a brand new television unit or full refund of INR 1,45,000/- with 18% p.a. interest, plus INR 35,000/- for harassment and litigation cost."
      },
      rental_agreement: {
        landlord_name: "Dr. Harish Chandra Mathur",
        landlord_address: "B-14, Maharani Bagh, New Delhi - 110065",
        tenant_name: "Aakashdeep Banerjee",
        tenant_permanent_address: "18 Lake View Road, Southern Avenue, Kolkata, West Bengal - 700029",
        property_address: "Flat No. C-301, 3rd Floor, Palm Grove Apartments, Sector 54, Golf Course Road, Gurugram, Haryana - 122002",
        lease_start_date: "2024-09-01",
        lease_duration_months: "11",
        monthly_rent: "42000",
        security_deposit: "84000",
        notice_period_days: "30",
        rent_due_day: "5"
      },
      police_complaint_fir: {
        complainant_name: "Amitabh Kashyap",
        complainant_contact: "Mobile: +91-9811223344, Email: amitabh.k@email.com, Address: H.No. 77, Sector 15, Noida, UP",
        police_station: "Sector 20 Police Station, Noida District, Uttar Pradesh",
        incident_date_time: "18th August 2024 at approximately 8:45 PM",
        incident_location: "Near Sector 18 Metro Station Exit Gate 2, Noida",
        accused_details: "Two unidentified males riding a black motorcycle without license plate, wearing dark helmets",
        incident_narration: "While walking towards the parking lot after exiting the metro station, two persons on a black motorcycle deliberately intercepted me. The pillion rider forcibly snatched my gold chain (approx 20 grams) and iPhone 15 Pro, threatening me with an iron rod when I resisted. They sped away towards the DND flyway.",
        witnesses_evidence: "CCTV camera of Metro Station Gate 2 and roadside CCD outlet clearly covers the incident. Eyewitness Mr. Rakesh (Tea stall vendor) present."
      }
    };

    const currentSample = samples[this.selectedTemplateId];
    if (!currentSample) return;

    Object.entries(currentSample).forEach(([key, val]) => {
      const el = document.getElementById(`field_${key}`);
      if (el) {
        el.value = val;
      }
    });

    // Provide subtle notification
    this.showToast("Sample case facts populated!");
  }

  getFormData() {
    const formData = {};
    const inputs = this.formContainer.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      formData[input.name] = input.value;
    });
    return formData;
  }

  async handleGenerate() {
    const formData = this.getFormData();
    
    // Quick validation
    const template = this.templates.find(t => t.id === this.selectedTemplateId);
    if (template) {
      for (const field of template.fields) {
        if (field.required && !formData[field.id]?.trim()) {
          alert(`Please fill in required field: ${field.label}`);
          const el = document.getElementById(`field_${field.id}`);
          if (el) el.focus();
          return;
        }
      }
    }

    // Set loading state
    this.generateBtn.disabled = true;
    this.generateBtn.innerHTML = `
      <span class="inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mr-2"></span>
      Drafting Court Notice...
    `;

    try {
      const response = await window.NyayMitraAPI.generateDraft(this.selectedTemplateId, formData);
      if (response && response.draft) {
        this.currentDraftMarkdown = response.draft;
        this.renderPreview(response.draft);
        this.showToast("Court draft generated successfully!");
      }
    } catch (err) {
      alert(`Draft generation error: ${err.message || 'Server error'}`);
    } finally {
      this.generateBtn.disabled = false;
      this.generateBtn.innerHTML = `
        <i data-lucide="file-signature" class="w-4 h-4 mr-1.5"></i>
        Generate Court Draft
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  renderPreview(markdown) {
    if (!markdown) return;
    
    if (this.previewPlaceholder) this.previewPlaceholder.classList.add('hidden');
    if (this.previewContentBox) this.previewContentBox.classList.remove('hidden');

    const html = window.marked ? window.marked.parse(markdown) : markdown;
    if (this.previewContainer) {
      this.previewContainer.innerHTML = html;
    }

    if (this.rawEditor) {
      this.rawEditor.value = markdown;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  toggleViewMode() {
    this.isRawMode = !this.isRawMode;
    if (this.isRawMode) {
      this.previewContainer.classList.add('hidden');
      this.rawEditor.classList.remove('hidden');
      this.viewToggleBtn.innerHTML = `<i data-lucide="file-text" class="w-4 h-4"></i> Court View`;
    } else {
      this.previewContainer.classList.remove('hidden');
      this.rawEditor.classList.add('hidden');
      this.viewToggleBtn.innerHTML = `<i data-lucide="code" class="w-4 h-4"></i> Edit Markdown`;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  copyToClipboard() {
    if (!this.currentDraftMarkdown) return;
    navigator.clipboard.writeText(this.currentDraftMarkdown);
    this.showToast("Draft copied to clipboard!");
  }

  exportToPdf() {
    if (!this.currentDraftMarkdown || !this.previewContainer) return;
    
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `NyayMitra_${this.selectedTemplateId}_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(this.previewContainer).save();
      this.showToast("Generating PDF download...");
    } else {
      window.print();
    }
  }

  showToast(msg) {
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }, 3000);
    }
  }
}

window.LegalDrafterController = LegalDrafterController;
