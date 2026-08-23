/**
 * NyayaSetu Conversational Government Form-Filler
 * Minimal, hackathon-ready guided interview flow that auto-populates a standard
 * Form 'A' RTI Application (Section 6(1) RTI Act 2005) with 1-click legal PDF export.
 */

const FORM_FILLER_I18N = {
  English: {
    step_label: "Step",
    of_label: "of",
    btn_next: "Next Question",
    btn_finish: "Generate Official Form 'A'",
    toast_generated: "Official Form 'A' RTI Application successfully generated!",
    questions: [
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
    ]
  },
  Hindi: {
    step_label: "चरण",
    of_label: "का",
    btn_next: "अगला प्रश्न",
    btn_finish: "आधिकारिक फॉर्म 'A' तैयार करें",
    toast_generated: "आधिकारिक फॉर्म 'A' आरटीआई आवेदन सफलतापूर्वक तैयार हुआ!",
    questions: [
      {
        id: 'applicant_name',
        title: 'प्रश्न 1 / 6: आपका पूरा कानूनी नाम क्या है?',
        desc: 'जैसा कि आपके आधार कार्ड या वोटर आईडी कार्ड पर दर्ज है।',
        placeholder: 'उदा. राजेश कुमार शर्मा',
        type: 'text',
        sample: 'राजेश कुमार शर्मा'
      },
      {
        id: 'applicant_address',
        title: 'प्रश्न 2 / 6: डाक द्वारा डिलीवरी हेतु आपका पूरा पता क्या है?',
        desc: 'जहाँ लोक सूचना अधिकारी (PIO) स्पीड पोस्ट द्वारा प्रमाणित प्रतियां भेजेंगे।',
        placeholder: 'उदा. फ्लैट 402, शांति विहार, एम.जी. रोड, वार्ड 12, पुणे - 411001',
        type: 'textarea',
        sample: 'फ्लैट 402, शांति विहार, एम.जी. रोड, वार्ड 12, पुणे - 411001\nफोन: +91 98765 43210'
      },
      {
        id: 'authority_name',
        title: 'प्रश्न 3 / 6: आप किस सरकारी विभाग या प्राधिकरण से जानकारी चाहते हैं?',
        desc: 'संबंधित नगर निगम, राज्य या केंद्र सरकार का विभाग जिसके पास फाइलें हैं।',
        placeholder: 'उदा. पुणे नगर निगम (सड़क निर्माण एवं लोक निर्माण विभाग)',
        type: 'text',
        sample: 'पुणे नगर निगम (सड़क एवं नागरिक अवसंरचना विभाग)'
      },
      {
        id: 'pio_designation',
        title: 'प्रश्न 4 / 6: जन सूचना अधिकारी (PIO) का पदनाम लिखें:',
        desc: 'संबंधित नोडल अधिकारी का आधिकारिक पदनाम (डिफ़ॉल्ट: जन सूचना अधिकारी)।',
        placeholder: 'उदा. जन सूचना अधिकारी एवं अधिशासी अभियंता (सड़क निर्माण)',
        type: 'text',
        sample: 'जन सूचना अधिकारी एवं अधिशासी अभियंता (लोक निर्माण)'
      },
      {
        id: 'subject',
        title: 'प्रश्न 5 / 6: आपके आरटीआई आवेदन का मुख्य विषय क्या है?',
        desc: 'मामले का संक्षिप्त 1-पंक्ति का सार।',
        placeholder: 'उदा. वार्ड 12 की सड़क मरम्मत के स्वीकृत वर्क ऑर्डर की प्रमाणित प्रति हेतु',
        type: 'text',
        sample: 'वार्ड 12 मुख्य सड़क मरम्मत कार्य के स्वीकृत वर्क ऑर्डर एवं निरीक्षण रिकॉर्ड की प्रमाणित प्रति हेतु'
      },
      {
        id: 'information_sought',
        title: 'प्रश्न 6 / 6: मांगी गई विशिष्ट जानकारी या प्रमाणित रिकॉर्ड के बिंदु:',
        desc: 'फाइल की प्रमाणित प्रतियां, माप पुस्तिका (MB), टेंडर दस्तावेज या देरी के कारण लिखें।',
        placeholder: '1. स्वीकृत कार्य आदेश (Work Order) की प्रमाणित प्रति...\n2. माप पुस्तिका (Measurement Book) निरीक्षण प्रविष्टियों की प्रमाणित प्रति...\n3. जिम्मेदार कनिष्ठ अभियंता का नाम व पदनाम...',
        type: 'textarea',
        sample: '1. वार्ड 12 सड़क निर्माण हेतु स्वीकृत कार्य आदेश (Work Order) एवं अनुमानित बजट की प्रमाणित प्रति।\n2. ठेकेदार द्वारा प्रस्तुत दैनिक माप पुस्तिका (MB) प्रविष्टियों और गुणवत्ता निरीक्षण रिपोर्ट की प्रमाणित प्रति।\n3. ठेकेदार पर जुर्माना क्लॉज और 60 दिन से अधिक की देरी के दर्ज कारणों की प्रमाणित प्रति।\n4. अंतिम साइट निरीक्षण हेतु जिम्मेदार कनिष्ठ अभियंता (JE) का नाम एवं पदनाम।'
      }
    ]
  }
};

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

    this.initElements();
    this.bindEvents();
    this.renderCurrentQuestion();

    if (window.i18n) {
      window.i18n.onLanguageChange(() => {
        this.renderCurrentQuestion();
        this.updatePreview();
      });
    }
  }

  getQuestions() {
    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    return (FORM_FILLER_I18N[lang] && FORM_FILLER_I18N[lang].questions) || FORM_FILLER_I18N['English'].questions;
  }

  getI18nTexts() {
    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    return FORM_FILLER_I18N[lang] || FORM_FILLER_I18N['English'];
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

    const questions = this.getQuestions();
    const texts = this.getI18nTexts();
    const q = questions[this.currentStep];
    
    if (!q) {
      this.updatePreview();
      return;
    }

    if (this.stepCounter) {
      this.stepCounter.textContent = `${texts.step_label} ${this.currentStep + 1} ${texts.of_label} ${questions.length}`;
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
      const isLast = (this.currentStep === questions.length - 1);
      const btnLabel = isLast ? texts.btn_finish : texts.btn_next;
      const icon = isLast ? 'check' : 'arrow-right';
      this.nextBtn.innerHTML = `<span>${btnLabel}</span><i data-lucide="${icon}" class="w-4 h-4 ml-1"></i>`;
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
    const questions = this.getQuestions();
    const texts = this.getI18nTexts();
    const q = questions[this.currentStep];
    
    if (q && input) {
      const val = input.value.trim();
      if (!val && this.currentStep !== 1) { // allow optional details
        alert("Please provide an answer before continuing.");
        input.focus();
        return;
      }
      this.formData[q.id] = val || q.sample;
    }

    if (this.currentStep < questions.length - 1) {
      this.currentStep++;
      this.renderCurrentQuestion();
    } else {
      this.currentStep = questions.length;
      this.updatePreview();
      const toast = document.getElementById('global-toast');
      if (toast) {
        toast.textContent = texts.toast_generated;
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

  fillKnownGoodSample() {
    const questions = this.getQuestions();
    questions.forEach(q => {
      this.formData[q.id] = q.sample;
    });
    this.formData.fee_mode = 'Indian Postal Order (IPO) No. 45G-889124 of ₹10';
    this.currentStep = questions.length - 1;
    this.renderCurrentQuestion();
    this.updatePreview();
  }

  generateFormHtml() {
    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');
    const today = new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const name = this.formData.applicant_name || (isHindi ? '[आवेदक का पूरा नाम]' : '[Applicant Name]');
    const address = (this.formData.applicant_address || (isHindi ? '[आवेदक का पत्राचार पता]' : '[Applicant Postal Address]')).replace(/\n/g, '<br/>');
    const authority = this.formData.authority_name || (isHindi ? '[संबंधित सार्वजनिक प्राधिकरण / विभाग]' : '[Target Public Authority]');
    const pio = this.formData.pio_designation || (isHindi ? 'लोक सूचना अधिकारी (PIO)' : 'The Public Information Officer (PIO)');
    const subject = this.formData.subject || (isHindi ? '[आरटीआई आवेदन का विषय]' : '[Subject of RTI Application]');
    const infoPoints = (this.formData.information_sought || (isHindi ? '1. स्वीकृत कार्य आदेश की प्रमाणित प्रति...\n2. निरीक्षण अभिलेख...' : '1. Certified copy of work order...\n2. Measurement records...')).replace(/\n/g, '<br/>');
    const fee = this.formData.fee_mode || (isHindi ? '₹10 का भारतीय पोस्टल आर्डर (IPO) संलग्न' : 'Indian Postal Order (IPO) of ₹10 attached');

    if (isHindi) {
      return `
        <div class="court-paper p-6 sm:p-8 bg-white text-slate-950 font-serif leading-relaxed text-xs sm:text-sm border border-slate-300 rounded-lg shadow-sm space-y-4">
          <div class="text-center border-b-2 border-slate-900 pb-3">
            <p class="font-bold text-xs uppercase tracking-widest text-slate-600 font-mono">मानक विधिक प्रारूप</p>
            <h2 class="text-base sm:text-lg font-bold uppercase tracking-tight text-slate-950 mt-0.5">
              फॉर्म 'A' — सूचना प्राप्ति हेतु आवेदन पत्र
            </h2>
            <p class="text-xs italic text-slate-700">सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत</p>
          </div>

          <div class="space-y-1 text-xs sm:text-sm">
            <p><strong>सेवा में,</strong></p>
            <p class="ml-4">${pio},</p>
            <p class="ml-4">${authority},</p>
            <p class="ml-4">सार्वजनिक प्राधिकरण का कार्यालय।</p>
          </div>

          <div class="pt-2">
            <p><strong>1. आवेदक का पूरा नाम:</strong> ${name}</p>
            <p class="mt-1"><strong>2. पत्राचार हेतु पूरा डाक पता:</strong></p>
            <p class="ml-4 mt-0.5">${address}</p>
          </div>

          <div class="pt-2">
            <p><strong>3. मांगी गई सूचना का विवरण:</strong></p>
            <div class="ml-4 mt-1.5 space-y-2">
              <p><strong>(क) सूचना का मुख्य विषय:</strong> ${subject}</p>
              <p><strong>(ख) संबंधित अवधि:</strong> चालू वित्तीय वर्ष / संबंधित सरकारी अभिलेख</p>
              <p><strong>(ग) वांछित सूचना एवं प्रमाणित रिकॉर्ड का विशिष्ट विवरण:</strong></p>
              <div class="ml-4 p-3 bg-slate-50 border border-slate-200 rounded font-sans text-xs sm:text-sm text-slate-900 leading-relaxed">
                ${infoPoints}
              </div>
              <p class="text-xs italic text-slate-600">*(नोट: कृपया आरटीआई अधिनियम 2005 की धारा 2(j)(ii) एवं धारा 7(6) के तहत प्रमाणित सत्य प्रतियां प्रदान करें)*</p>
            </div>
          </div>

          <div class="pt-2">
            <p><strong>4. अनिवार्य आवेदन शुल्क का विवरण:</strong></p>
            <p class="ml-4 mt-0.5">₹10 का निर्धारित शुल्क <strong>${fee}</strong> के माध्यम से सक्षम प्राधिकारी के पक्ष में संलग्न है।</p>
          </div>

          <div class="pt-2">
            <p><strong>5. नागरिकता घोषणा:</strong></p>
            <p class="ml-4 mt-0.5">मैं एतद्द्वारा घोषित करता/करती हूँ कि मैं सूचना का अधिकार अधिनियम, 2005 की धारा 3 के अंतर्गत भारत का नागरिक हूँ।</p>
          </div>

          <div class="pt-6 flex justify-between items-end text-xs sm:text-sm border-t border-slate-300">
            <div>
              <p><strong>स्थान:</strong> भारत</p>
              <p><strong>दिनांक:</strong> ${today}</p>
            </div>
            <div class="text-right">
              <p class="mb-6">_____________________________</p>
              <p><strong>आवेदक के हस्ताक्षर</strong></p>
              <p class="text-xs text-slate-600">(${name})</p>
            </div>
          </div>
        </div>
      `;
    }

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
    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');
    let rawText = '';
    
    if (isHindi) {
      rawText = `फॉर्म 'A' — सूचना का अधिकार अधिनियम 2005 की धारा 6(1) के अंतर्गत आवेदन\nसेवा में,\n${this.formData.pio_designation || 'लोक सूचना अधिकारी'},\n${this.formData.authority_name || 'सार्वजनिक प्राधिकरण'}\n\n1. आवेदक का नाम: ${this.formData.applicant_name}\n2. डाक पता: ${this.formData.applicant_address}\n3. विषय: ${this.formData.subject}\n4. मांगी गई सूचना:\n${this.formData.information_sought}\n5. आवेदन शुल्क: ${this.formData.fee_mode}\n\nघोषणा: मैं आरटीआई अधिनियम 2005 की धारा 3 के तहत भारत का नागरिक हूँ।\n\nहस्ताक्षर: ${this.formData.applicant_name}\nदिनांक: ${new Date().toLocaleDateString('hi-IN')}`;
    } else {
      rawText = `FORM 'A' — APPLICATION UNDER SECTION 6(1) RTI ACT 2005\nTo,\n${this.formData.pio_designation || 'The Public Information Officer'},\n${this.formData.authority_name || 'Public Authority'}\n\n1. Full Name of Applicant: ${this.formData.applicant_name}\n2. Postal Address: ${this.formData.applicant_address}\n3. Subject: ${this.formData.subject}\n4. Information Sought:\n${this.formData.information_sought}\n5. Application Fee: ${this.formData.fee_mode}\n\nDeclaration: I am a Citizen of India under Section 3 of RTI Act, 2005.\n\nSignature of Applicant: ${this.formData.applicant_name}\nDate: ${new Date().toLocaleDateString('en-IN')}`;
    }

    navigator.clipboard.writeText(rawText);
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = isHindi ? "फॉर्म 'A' आरटीआई आवेदन टेक्स्ट क्लिपबोर्ड पर कॉपी किया गया!" : "Form 'A' RTI application text copied to clipboard!";
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(() => toast.classList.remove('translate-y-0', 'opacity-100'), 3000);
    }
  }

  exportFormPdf() {
    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');
    const toast = document.getElementById('global-toast');
    if (toast) {
      toast.textContent = isHindi ? "आधिकारिक आरटीआई फॉर्म 'A' PDF तैयार हो रहा है..." : "Generating Official RTI Form 'A' PDF...";
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
      setTimeout(() => toast.classList.remove('translate-y-0', 'opacity-100'), 2500);
    }

    const html = this.generateFormHtml();
    if (window.downloadCleanLegalPdf) {
      window.downloadCleanLegalPdf({
        title: isHindi ? "फॉर्म 'A' आरटीआई आवेदन" : "FORM 'A' RTI APPLICATION",
        subtitle: isHindi ? "सूचना का अधिकार अधिनियम 2005 की धारा 6(1) के अंतर्गत आवेदन" : "Application for Information under Section 6(1) of the Right to Information Act, 2005",
        refNo: `RTI-FORMA-${Date.now().toString().slice(-6)}`,
        applicantName: this.formData.applicant_name || (isHindi ? 'नागरिक आवेदक' : 'Citizen Applicant'),
        authorityName: this.formData.authority_name || (isHindi ? 'लोक सूचना अधिकारी' : 'Public Information Officer'),
        contentHtml: html,
        checklist: isHindi ? [
          "निर्धारित ₹10 आवेदन शुल्क (IPO / कोर्ट फीस स्टाम्प)",
          "स्व-सत्यापित नागरिक निवास प्रमाण प्रति",
          "स्पीड पोस्ट प्रेषण पावती रसीद"
        ] : [
          "Prescribed ₹10 Application Fee (IPO / Court Fee Stamp)",
          "Self-attested Citizen Address Proof copy",
          "Speed Post dispatch acknowledgment receipt"
        ],
        timeline: isHindi ? [
          { day: "1", label: "पंजीकृत स्पीड पोस्ट द्वारा फॉर्म 'A' प्रेषित करें" },
          { day: "30", label: "लोक सूचना अधिकारी (PIO) की वैधानिक उत्तर समय-सीमा (धारा 7(1))" },
          { day: "31-60", label: "उत्तर न मिलने पर धारा 19(1) प्रथम अपील दायर करें" }
        ] : [
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
