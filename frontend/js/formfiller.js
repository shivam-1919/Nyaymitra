/**
 * NyayaSetu Conversational Government Form-Filler
 * Minimal, hackathon-ready guided interview flow that auto-populates a standard
 * Form 'A' RTI Application (Section 6(1) RTI Act 2005) with 1-click legal PDF export.
 */

class RTIFormFillerController {
  constructor() {
    this.currentStep = 0;
    this.formData = {
      applicant_name: '',
      applicant_address: '',
      applicant_phone: '',
      authority_name: '',
      pio_designation: '',
      subject: '',
      period: 'Past 12 Months',
      information_sought: '',
      fee_mode: 'Indian Postal Order (IPO) of ₹10',
      bpl_status: 'No (Standard ₹10 Fee Attached)'
    };

    this.questions = [
      {
        id: 'applicant_name',
        title: 'Question 1 of 6: What is your full legal name?',
        desc: 'As registered on your Aadhaar / Voter ID card.',
        placeholder: 'e.g. Rajesh Kumar Sharma',
        type: 'text',
        sample: 'Rajesh Kumar Sharma'
      },
      {
        id: 'applicant_address',
        title: 'Question 2 of 6: What is your postal address for delivery?',
        desc: 'Where the PIO will dispatch certified copies via Speed Post.',
        placeholder: 'e.g. Flat 402, Shanti Vihar, MG Road, Ward 12, Pune - 411001',
        type: 'textarea',
        sample: 'Flat 402, Shanti Vihar, MG Road, Ward 12, Pune - 411001\nPhone: +91 98765 43210'
      },
      {
        id: 'authority_name',
        title: 'Question 3 of 6: Which Department or Public Authority are you targeting?',
        desc: 'The specific municipal, state, or central department holding the files.',
        placeholder: 'e.g. Pune Municipal Corporation (Engineering & Road Works Department)',
        type: 'text',
        sample: 'Pune Municipal Corporation (Roads & Civil Infrastructure Dept)'
      },
      {
        id: 'pio_designation',
        title: 'Question 4 of 6: Designate the Public Information Officer (PIO):',
        desc: 'Official title of the nodal officer (defaults to Public Information Officer).',
        placeholder: 'e.g. The Public Information Officer & Executive Engineer (Roads)',
        type: 'text',
        sample: 'The Public Information Officer & Executive Engineer (Civil Works)'
      },
      {
        id: 'subject',
        title: 'Question 5 of 6: What is the subject line of your RTI enquiry?',
        desc: 'A concise 1-line summary of the matter.',
        placeholder: 'e.g. Seeking certified copies of sanctioned road repair work order #PMC-2024-88',
        type: 'text',
        sample: 'Seeking certified inspection records & work order for Ward 12 Main Road repair'
      },
      {
        id: 'information_sought',
        title: 'Question 6 of 6: Specific points of information or certified records requested:',
        desc: 'List the exact file copies, measurement books, tender bids, or reasons recorded on file.',
        placeholder: '1. Certified copy of Work Order sanctioned...\n2. Certified copy of Measurement Book inspection entries...\n3. Name and designation of the inspecting engineer...',
        type: 'textarea',
        sample: '1. Certified copy of the sanctioned work order and estimated budget for Ward 12 road resurfacing.\n2. Certified copies of the daily measurement book (MB) entries and quality inspection reports submitted by the contractor.\n3. Certified copy of the contractor penalty clause and recorded reasons for delay beyond the 60-day deadline.\n4. Name and designation of the Junior Engineer responsible for final site clearance.'
      }
    ];

    this.initElements();
    this.bindEvents();
    this.renderCurrentQuestion();
  }

  initElements() {
    this.container = document.getElementById('view-formfiller');
    this.stepCounter = document.getElementById('ff-step-counter');
    this.questionTitle = document.getElementById('ff-question-title');
    this.questionDesc = document.getElementById('ff-question-desc');
    this.inputContainer = document.getElementById('ff-input-container');
    this.prevBtn = document.getElementById('ff-prev-btn');
    this.nextBtn = document.getElementById('ff-next-btn');
    this.sampleBtn = document.getElementById('ff-sample-btn');
    this.previewBox = document.getElementById('ff-preview-document');
    this.copyBtn = document.getElementById('ff-copy-btn');
    this.downloadPdfBtn = document.getElementById('ff-pdf-btn');
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPrevQuestion());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.handleNextQuestion());
    }
    if (this.sampleBtn) {
      this.sampleBtn.addEventListener('click', () => this.fillKnownGoodSample());
    }
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyFormText());
    }
    if (this.downloadPdfBtn) {
      this.downloadPdfBtn.addEventListener('click', () => this.exportFormPdf());
    }
  }

  renderCurrentQuestion() {
    if (!this.inputContainer) return;

    const q = this.questions[this.currentStep];
    if (!q) {
      this.renderCompletedForm();
      return;
    }

    if (this.stepCounter) {
      this.stepCounter.textContent = `Step ${this.currentStep + 1} of ${this.questions.length}`;
    }
    if (this.questionTitle) {
      this.questionTitle.textContent = q.title;
    }
    if (this.questionDesc) {
      this.questionDesc.textContent = q.desc;
    }

    const val = this.formData[q.id] || '';

    if (q.type === 'textarea') {
      this.inputContainer.innerHTML = `
        <textarea 
          id="ff_current_input" 
          rows="4" 
          placeholder="${q.placeholder}"
          class="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 shadow-inner font-sans leading-relaxed"
        >${val}</textarea>
      `;
    } else {
      this.inputContainer.innerHTML = `
        <input 
          type="text" 
          id="ff_current_input" 
          value="${val}" 
          placeholder="${q.placeholder}"
          class="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 shadow-inner font-sans"
        />
      `;
    }

    // Update prev/next buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentStep === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.innerHTML = (this.currentStep === this.questions.length - 1)
        ? `<span>Generate Official Form 'A'</span><i data-lucide="check" class="w-4 h-4 ml-1"></i>`
        : `<span>Next Question</span><i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>`;
    }

    // Real-time draft preview update
    this.updatePreview();
    if (window.lucide) window.lucide.createIcons();

    // Auto-focus input
    const input = document.getElementById('ff_current_input');
    if (input) input.focus();
  }

  handleNextQuestion() {
    const input = document.getElementById('ff_current_input');
    const q = this.questions[this.currentStep];
    if (q && input) {
      const val = input.value.trim();
      if (!val && this.currentStep !== 1) { // allow optional details
        alert("Please provide an answer before continuing.");
        input.focus();
        return;
      }
      this.formData[q.id] = val || q.sample;
    }

    if (this.currentStep < this.questions.length - 1) {
      this.currentStep++;
      this.renderCurrentQuestion();
    } else {
      this.currentStep = this.questions.length;
      this.updatePreview();
      const toast = document.getElementById('global-toast');
      if (toast) {
        toast.textContent = "Official Form 'A' RTI Application successfully generated!";
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        setTimeout(() => toast.classList.remove('translate-y-0', 'opacity-100'), 3000);
      }
    }
  }

  goToPrevQuestion() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderCurrentQuestion();
    }
  }

  /* LIVE DEMO OFFLINE SAFETY FALLBACK: Instant 1-Click Known Good RTI Form Fill */
  fillKnownGoodSample() {
    this.questions.forEach(q => {
      this.formData[q.id] = q.sample;
    });
    this.formData.fee_mode = 'Indian Postal Order (IPO) No. 45G-889124 of ₹10';
    this.currentStep = this.questions.length - 1;
    this.renderCurrentQuestion();
    this.updatePreview();
  }

  generateFormHtml() {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const name = this.formData.applicant_name || '[Applicant Name]';
    const address = (this.formData.applicant_address || '[Applicant Postal Address]').replace(/\n/g, '<br/>');
    const authority = this.formData.authority_name || '[Target Public Authority]';
    const pio = this.formData.pio_designation || 'The Public Information Officer (PIO)';
    const subject = this.formData.subject || '[Subject of RTI Application]';
    const infoPoints = (this.formData.information_sought || '1. Certified copy of work order...\n2. Measurement records...').replace(/\n/g, '<br/>');
    const fee = this.formData.fee_mode || 'Indian Postal Order (IPO) of ₹10 attached';

    return `
      <div class="court-paper p-6 sm:p-8 bg-white text-slate-950 font-serif leading-relaxed text-xs sm:text-sm border border-slate-300 rounded-lg shadow-sm space-y-4">
        
        <div class="text-center border-b-2 border-slate-900 pb-3">
          <p class="font-bold text-xs uppercase tracking-widest text-slate-600 font-mono">STANDARD STATUTORY TEMPLATE</p>
          <h2 class="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">
            FORM 'A' — APPLICATION FOR INFORMATION
          </h2>
          <p class="text-xs italic text-slate-700">Under Section 6(1) of the Right to Information Act, 2005</p>
        </div>

        <div class="space-y-1 text-xs sm:text-sm">
          <p><strong>To,</strong></p>
          <p class="ml-4">${pio},</p>
          <p class="ml-4">${authority},</p>
          <p class="ml-4">Office of the Public Authority.</p>
        </div>

        <div class="pt-2">
          <p><strong>1. Full Name of the Applicant:</strong> ${name}</p>
          <p class="mt-1"><strong>2. Complete Postal Address for Correspondence:</strong></p>
          <p class="ml-4 mt-0.5">${address}</p>
        </div>

        <div class="pt-2">
          <p><strong>3. Particulars of Information Required:</strong></p>
          <div class="ml-4 mt-1.5 space-y-2">
            <p><strong>(a) Subject matter of Information:</strong> ${subject}</p>
            <p><strong>(b) Period to which the information relates:</strong> Current Financial Year / Relevant File Records</p>
            <p><strong>(c) Specific Description of Information & Certified Records Sought:</strong></p>
            <div class="ml-4 p-3 bg-slate-50 border border-slate-200 rounded font-sans text-xs sm:text-sm text-slate-900 leading-relaxed">
              ${infoPoints}
            </div>
            <p class="text-xs italic text-slate-600">*(Note: Please provide certified true copies under Section 2(j)(ii) and Section 7(6) of RTI Act, 2005)*</p>
          </div>
        </div>

        <div class="pt-2">
          <p><strong>4. Mandatory Application Fee Particulars:</strong></p>
          <p class="ml-4 mt-0.5">Prescribed fee of ₹10 is deposited via <strong>${fee}</strong> drawn in favour of the Accounts Officer / Competent Authority.</p>
        </div>

        <div class="pt-2">
          <p><strong>5. Citizenship Declaration:</strong></p>
          <p class="ml-4 mt-0.5">I hereby declare that I am a Citizen of India as defined under Section 3 of the Right to Information Act, 2005.</p>
        </div>

        <div class="pt-6 flex justify-between items-end text-xs sm:text-sm border-t border-slate-300">
          <div>
            <p><strong>Place:</strong> Pune / India</p>
            <p><strong>Date:</strong> ${today}</p>
          </div>
          <div class="text-right">
            <p class="mb-6">_____________________________</p>
            <p><strong>Signature of Applicant</strong></p>
            <p class="text-xs text-slate-600">(${name})</p>
          </div>
        </div>

      </div>
    `;
  }

  updatePreview() {
    if (this.previewBox) {
      this.previewBox.innerHTML = this.generateFormHtml();
    }
  }

  copyFormText() {
    const rawText = `FORM 'A' — APPLICATION UNDER SECTION 6(1) RTI ACT 2005
To,
${this.formData.pio_designation || 'The Public Information Officer'},
${this.formData.authority_name || 'Public Authority'}

1. Full Name of Applicant: ${this.formData.applicant_name}
2. Postal Address: ${this.formData.applicant_address}
3. Subject: ${this.formData.subject}
4. Information Sought:
${this.formData.information_sought}
5. Application Fee: ${this.formData.fee_mode}

Declaration: I am a Citizen of India under Section 3 of RTI Act, 2005.

Signature of Applicant: ${this.formData.applicant_name}
Date: ${new Date().toLocaleDateString('en-IN')}`;

    navigator.clipboard.writeText(rawText);
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = "Form 'A' RTI application text copied to clipboard!";
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(() => toast.classList.remove('translate-y-0', 'opacity-100'), 3000);
    }
  }

  exportFormPdf() {
    const html = this.generateFormHtml();
    if (window.downloadCleanLegalPdf) {
      window.downloadCleanLegalPdf({
        title: "FORM 'A' RTI APPLICATION",
        subtitle: "Application for Information under Section 6(1) of the Right to Information Act, 2005",
        refNo: `RTI-FORMA-${Date.now().toString().slice(-6)}`,
        applicantName: this.formData.applicant_name || 'Citizen Applicant',
        authorityName: this.formData.authority_name || 'Public Information Officer',
        contentHtml: html,
        checklist: [
          "Prescribed ₹10 Application Fee (IPO / Court Fee Stamp)",
          "Self-attested Citizen Address Proof copy",
          "Speed Post dispatch acknowledgment receipt"
        ],
        timeline: [
          { day: "1", label: "Dispatch Form 'A' via Registered Speed Post" },
          { day: "30", label: "Statutory response deadline for PIO (Sec 7(1))" },
          { day: "31-60", label: "File Section 19(1) First Appeal if no response" }
        ],
        filename: `NyayaSetu_RTI_Form_A_${Date.now()}`
      });
    } else {
      window.print();
    }
  }
}

window.RTIFormFillerController = RTIFormFillerController;
