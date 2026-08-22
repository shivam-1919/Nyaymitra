/**
 * NyayaSetu (न्यायसेतु) Civic Rights Action Navigator & Tracker
 * Converts citizen grievances into structured, evidence-backed Action Packs and First Appeals.
 */

class NyayaSetuController {
  constructor() {
    this.currentStep = 1;
    this.currentProblem = '';
    this.analysisData = null;
    this.userAnswers = {};
    this.actionPackData = null;
    this.trackedCases = [];
    
    this.initElements();
    this.bindEvents();
    this.loadTrackedCases();
  }

  initElements() {
    // Steps containers
    this.stepPanels = {
      1: document.getElementById('nyayasetu-step-1'),
      2: document.getElementById('nyayasetu-step-2'),
      3: document.getElementById('nyayasetu-step-3'),
      4: document.getElementById('nyayasetu-step-4'),
      5: document.getElementById('nyayasetu-step-5')
    };

    this.stepIndicators = document.querySelectorAll('.nyayasetu-wizard-step');

    // Step 1 Elements
    this.problemInput = document.getElementById('nyayasetu-problem-input');
    this.problemSubmitBtn = document.getElementById('nyayasetu-problem-submit');
    this.demoScenariosContainer = document.getElementById('nyayasetu-demo-scenarios');
    this.voiceInputBtn = document.getElementById('nyayasetu-voice-btn');

    // Step 2 Elements
    this.questionnaireContainer = document.getElementById('nyayasetu-questionnaire-fields');
    this.step2NextBtn = document.getElementById('nyayasetu-step2-next');
    this.step2BackBtn = document.getElementById('nyayasetu-step2-back');

    // Step 3 Elements
    this.rightsSummaryBox = document.getElementById('nyayasetu-rights-summary');
    this.step3NextBtn = document.getElementById('nyayasetu-step3-next');
    this.step3BackBtn = document.getElementById('nyayasetu-step3-back');

    // Step 4 Elements (Action Pack)
    this.actionPackTitle = document.getElementById('nyayasetu-ap-title');
    this.rtiDraftBox = document.getElementById('nyayasetu-rti-draft');
    this.grievanceDraftBox = document.getElementById('nyayasetu-grievance-draft');
    this.checklistContainer = document.getElementById('nyayasetu-checklist');
    this.timelineContainer = document.getElementById('nyayasetu-timeline');
    this.saveCaseBtn = document.getElementById('nyayasetu-save-case-btn');
    this.downloadPdfBtn = document.getElementById('nyayasetu-download-ap-btn');
    this.copyRtiBtn = document.getElementById('nyayasetu-copy-rti-btn');

    // Step 5 Elements (Tracker & First Appeal)
    this.casesListContainer = document.getElementById('nyayasetu-tracked-cases-list');
    this.appealModal = document.getElementById('nyayasetu-appeal-modal');
    this.appealContentBox = document.getElementById('nyayasetu-appeal-content');
    this.appealCloseBtn = document.getElementById('nyayasetu-appeal-close');
    this.appealCopyBtn = document.getElementById('nyayasetu-appeal-copy');
  }

  bindEvents() {
    // Step 1 Submit
    if (this.problemSubmitBtn) {
      this.problemSubmitBtn.addEventListener('click', () => this.handleProblemSubmit());
    }

    // Demo Scenario Pills
    if (this.demoScenariosContainer) {
      this.demoScenariosContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.demo-pill');
        if (pill) {
          const prompt = pill.getAttribute('data-problem');
          if (prompt && this.problemInput) {
            this.problemInput.value = prompt;
            this.handleProblemSubmit();
          }
        }
      });
    }

    // Voice query on Step 1
    if (this.voiceInputBtn) {
      this.voiceInputBtn.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert("Speech recognition not supported in this browser.");
          return;
        }
        const rec = new SpeechRecognition();
        rec.lang = window.i18n ? window.i18n.getSpeechLangCode() : 'en-IN';
        rec.onstart = () => {
          this.voiceInputBtn.classList.add('listening-pulse');
        };
        rec.onresult = (e) => {
          this.problemInput.value = e.results[0][0].transcript;
          this.handleProblemSubmit();
        };
        rec.onend = () => {
          this.voiceInputBtn.classList.remove('listening-pulse');
        };
        rec.start();
      });
    }

    // Step 2 Navigation
    if (this.step2NextBtn) {
      this.step2NextBtn.addEventListener('click', () => this.handleQuestionnaireSubmit());
    }
    if (this.step2BackBtn) {
      this.step2BackBtn.addEventListener('click', () => this.goToStep(1));
    }

    // Step 3 Navigation
    if (this.step3NextBtn) {
      this.step3NextBtn.addEventListener('click', () => this.generateActionPack());
    }
    if (this.step3BackBtn) {
      this.step3BackBtn.addEventListener('click', () => this.goToStep(2));
    }

    // Step 4 Actions
    if (this.saveCaseBtn) {
      this.saveCaseBtn.addEventListener('click', () => this.saveCurrentCaseToTracker());
    }
    if (this.copyRtiBtn) {
      this.copyRtiBtn.addEventListener('click', () => {
        if (this.actionPackData && this.actionPackData.rti_draft) {
          navigator.clipboard.writeText(this.actionPackData.rti_draft);
          window.nyayMitra?.showToast("RTI Application copied to clipboard!");
        }
      });
    }
    if (this.downloadPdfBtn) {
      this.downloadPdfBtn.addEventListener('click', () => this.exportActionPackPdf());
    }

    // Appeal Modal Close
    if (this.appealCloseBtn && this.appealModal) {
      this.appealCloseBtn.addEventListener('click', () => {
        this.appealModal.classList.add('hidden');
      });
    }
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;

    // Toggle wizard panels
    Object.keys(this.stepPanels).forEach(step => {
      const panel = this.stepPanels[step];
      if (panel) {
        if (parseInt(step) === stepNumber) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    });

    // Update wizard step pills
    const indicators = document.querySelectorAll('.nyayasetu-wizard-step');
    indicators.forEach((ind, index) => {
      const stepIdx = index + 1;
      ind.classList.remove('active', 'completed', 'inactive');
      if (stepIdx === stepNumber) {
        ind.classList.add('active');
      } else if (stepIdx < stepNumber) {
        ind.classList.add('completed');
      } else {
        ind.classList.add('inactive');
      }
    });

    // Scroll to active panel smoothly
    const currentPanel = this.stepPanels[stepNumber];
    if (currentPanel) {
      currentPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async handleProblemSubmit() {
    const text = this.problemInput ? this.problemInput.value.trim() : '';
    if (!text) {
      alert("Please describe your problem or select one of the common scenarios.");
      return;
    }

    this.currentProblem = text;
    this.problemSubmitBtn.disabled = true;
    this.problemSubmitBtn.innerHTML = `
      <span class="inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mr-2"></span>
      Analyzing Jurisdiction & Rules...
    `;

    try {
      const result = await window.NyayMitraAPI.analyzeProblem(text);
      if (result && result.success) {
        this.analysisData = result;
        this.renderQuestionnaire(result.targeted_questionnaire || []);
        this.goToStep(2);
      } else {
        throw new Error(result.error || "Analysis failed");
      }
    } catch (err) {
      alert("Analysis error: " + (err.message || 'Server error'));
    } finally {
      this.problemSubmitBtn.disabled = false;
      this.problemSubmitBtn.innerHTML = `
        <span>Start Guided Action Plan</span>
        <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  renderQuestionnaire(questions) {
    if (!this.questionnaireContainer) return;

    this.questionnaireContainer.innerHTML = questions.map((q, idx) => {
      let inputHtml = '';
      if (q.type === 'textarea') {
        inputHtml = `
          <textarea 
            id="ns_field_${q.id}" 
            name="${q.id}" 
            rows="3" 
            placeholder="${q.placeholder || ''}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors"
            ${q.required ? 'required' : ''}
          ></textarea>
        `;
      } else if (q.type === 'select') {
        inputHtml = `
          <select 
            id="ns_field_${q.id}" 
            name="${q.id}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors"
            ${q.required ? 'required' : ''}
          >
            ${q.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
        `;
      } else {
        inputHtml = `
          <input 
            type="${q.type}" 
            id="ns_field_${q.id}" 
            name="${q.id}" 
            placeholder="${q.placeholder || ''}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-stone-100 text-sm focus:outline-none focus:border-amber-600 transition-colors"
            ${q.required ? 'required' : ''}
          />
        `;
      }

      return `
        <div class="space-y-1.5 p-4 rounded-xl bg-stone-900/60 border border-stone-800/80">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-stone-200 font-sans">
              <span class="text-amber-400 mr-1.5 font-mono">Q${idx + 1}.</span> ${q.question} ${q.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
          </div>
          ${inputHtml}
          <p class="text-[11px] text-stone-400 flex items-center gap-1">
            <i data-lucide="info" class="w-3 h-3 text-amber-500/80"></i> ${q.rationale}
          </p>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  handleQuestionnaireSubmit() {
    const answers = {};
    const inputs = this.questionnaireContainer.querySelectorAll('input, textarea, select');
    
    for (const input of inputs) {
      if (input.hasAttribute('required') && !input.value.trim()) {
        alert("Please complete the required question before continuing.");
        input.focus();
        return;
      }
      answers[input.name] = input.value.trim();
    }

    this.userAnswers = answers;
    this.renderRightsSummary();
    this.goToStep(3);
  }

  renderRightsSummary() {
    if (!this.rightsSummaryBox || !this.analysisData) return;

    const auth = this.analysisData.matched_authority;
    const isBpl = (this.userAnswers.bpl_or_category || '').toLowerCase().includes('bpl');

    this.rightsSummaryBox.innerHTML = `
      <div class="space-y-5">
        <!-- Confidence Badge & Authority Card -->
        <div class="p-5 rounded-xl bg-stone-900/90 border border-amber-600/30 space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span class="stamp-badge stamp-badge-sage">
              <i data-lucide="shield-check" class="w-3 h-3"></i> ${this.analysisData.confidence_level}
            </span>
            <span class="text-xs font-mono text-stone-400">Governed under: ${auth.statutory_act}</span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-stone-100 font-heading">
            Responsible Authority: <span class="text-amber-400">${auth.authority_name}</span>
          </h3>
          <p class="text-xs text-stone-300">Designated PIO: <strong class="text-stone-100">${auth.pio_designation}</strong></p>
          <p class="text-xs text-stone-400">Filing Route: ${auth.filing_mode}</p>
        </div>

        <!-- 4 Core Questions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> 1. What does this mean?
            </h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              Under statutory administrative law and citizen charters, delays beyond prescribed service timelines constitute a deficiency in public service. The Right to Information Act enables you to inspect the original work order and file movement registers.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <i data-lucide="file-check" class="w-3.5 h-3.5"></i> 2. What can I do?
            </h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              File a <strong>Records-Based RTI Application</strong> requesting certified copies of the sanctioned budget, work order, and inspection reports, accompanied by a formal grievance representation to the Head of Department.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i> 3. What are the strict deadlines?
            </h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              The PIO must respond within <strong>30 Calendar Days</strong> under Section 7(1) of RTI Act (or 48 hours if life/liberty is at risk). If no response is received by Day 30, a First Appeal is statutory.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-stone-900/70 border border-stone-800">
            <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <i data-lucide="paperclip" class="w-3.5 h-3.5"></i> 4. What documents do I need?
            </h4>
            <p class="text-xs text-stone-300 leading-relaxed">
              Preserve your original application acknowledgment, photos/proofs, and Rs 10 Postal Order ${isBpl ? '(or valid BPL proof for 100% fee waiver)' : ''}.
            </p>
          </div>
        </div>

        <!-- Human Escalation & Free Legal Aid Notice -->
        <div class="p-4 rounded-xl bg-stone-900/90 border border-stone-800 flex items-start gap-3">
          <i data-lucide="scale" class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"></i>
          <div>
            <h5 class="text-xs font-bold text-stone-200">NALSA Free Legal Aid Escalation</h5>
            <p class="text-[11px] text-stone-400 leading-relaxed mt-0.5">
              If this delay threatens your livelihood, basic food security, or residence, you are entitled to free legal counsel under the Legal Services Authorities Act. Dial <strong>15100</strong> for free advocate assignment.
            </p>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  async generateActionPack() {
    this.step3NextBtn.disabled = true;
    this.step3NextBtn.innerHTML = `
      <span class="inline-block w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mr-2"></span>
      Synthesizing Action Pack & RTI Draft...
    `;

    try {
      const response = await window.NyayMitraAPI.generateActionPack(
        this.currentProblem,
        this.userAnswers,
        this.analysisData.matched_authority
      );

      if (response && response.success) {
        this.actionPackData = response;
        this.renderActionPack();
        this.goToStep(4);
      }
    } catch (err) {
      alert("Action Pack generation error: " + (err.message || 'Server error'));
    } finally {
      this.step3NextBtn.disabled = false;
      this.step3NextBtn.innerHTML = `
        <span>Generate Complete Action Pack</span>
        <i data-lucide="file-check" class="w-4 h-4 ml-1"></i>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  renderActionPack() {
    if (!this.actionPackData) return;

    if (this.actionPackTitle) {
      this.actionPackTitle.textContent = `Action Pack: ${this.actionPackData.issue_type}`;
    }

    // Render RTI Draft
    if (this.rtiDraftBox) {
      const parsedRti = window.marked ? window.marked.parse(this.actionPackData.rti_draft) : this.actionPackData.rti_draft;
      this.rtiDraftBox.innerHTML = parsedRti;
    }

    // Render Grievance Draft
    if (this.grievanceDraftBox) {
      const parsedGrievance = window.marked ? window.marked.parse(this.actionPackData.grievance_draft) : this.actionPackData.grievance_draft;
      this.grievanceDraftBox.innerHTML = parsedGrievance;
    }

    // Render Checklist
    if (this.checklistContainer) {
      this.checklistContainer.innerHTML = this.actionPackData.checklist.map((item, idx) => `
        <li class="flex items-start gap-2.5 p-3 rounded-lg bg-stone-950/80 border border-stone-800 text-xs text-stone-200">
          <span class="w-5 h-5 rounded bg-stone-900 border border-stone-700 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px] font-mono">
            ${idx + 1}
          </span>
          <span class="leading-relaxed text-stone-300">${item}</span>
        </li>
      `).join('');
    }

    // Render Timeline
    if (this.timelineContainer) {
      this.timelineContainer.innerHTML = this.actionPackData.timeline.map((item, idx) => `
        <div class="flex items-start gap-3 relative pb-3">
          <div class="w-7 h-7 rounded bg-stone-950 border border-amber-600 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0 font-mono">
            ${idx + 1}
          </div>
          <div class="flex-1 p-3 rounded-lg bg-stone-950/80 border border-stone-800">
            <div class="flex items-center justify-between mb-1">
              <h5 class="text-xs font-bold text-stone-200 font-heading">${item.event} <span class="text-amber-400 font-mono text-[11px]">(${item.day})</span></h5>
              <span class="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 font-mono">${item.status}</span>
            </div>
            <p class="text-xs text-stone-400">${item.desc}</p>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  saveCurrentCaseToTracker() {
    if (!this.actionPackData) return;

    const caseItem = {
      id: this.actionPackData.action_pack_id || 'CASE_' + Date.now(),
      problem: this.currentProblem,
      authority: this.actionPackData.responsible_authority,
      jurisdiction: this.actionPackData.jurisdiction,
      date_created: new Date().toLocaleDateString('en-IN'),
      timestamp: Date.now(),
      rti_draft: this.actionPackData.rti_draft,
      statutory_deadline_days: 30
    };

    this.trackedCases.unshift(caseItem);
    localStorage.setItem('nyayasetu_cases', JSON.stringify(this.trackedCases));
    this.renderTrackedCasesList();
    this.showToast("Case saved to NyayaSetu Tracker!");
    this.goToStep(5);
  }

  loadTrackedCases() {
    const saved = localStorage.getItem('nyayasetu_cases');
    if (saved) {
      try {
        this.trackedCases = JSON.parse(saved);
      } catch (e) {
        this.trackedCases = [];
      }
    }
    this.renderTrackedCasesList();
  }

  renderTrackedCasesList() {
    if (!this.casesListContainer) return;

    if (this.trackedCases.length === 0) {
      this.casesListContainer.innerHTML = `
        <div class="p-8 text-center glass-panel rounded-xl">
          <i data-lucide="clock" class="w-10 h-10 text-stone-500 mx-auto mb-2"></i>
          <h4 class="text-sm font-semibold text-stone-300">No Tracked Cases Yet</h4>
          <p class="text-xs text-stone-400 mt-1">Generate an Action Pack in Step 1 to automatically track statutory deadlines and generate First Appeals.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.casesListContainer.innerHTML = this.trackedCases.map(c => {
      const createdDate = new Date(c.timestamp || Date.now());
      const daysPassed = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 30 - daysPassed);
      const isOverdue = daysPassed >= 30;

      return `
        <div class="glass-panel p-5 space-y-3 rounded-xl bg-stone-950/70 border border-stone-800">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <span class="stamp-badge stamp-badge-ochre">
                ${c.id}
              </span>
              <h4 class="text-sm font-bold text-stone-100 mt-1 font-heading">${c.problem}</h4>
              <p class="text-xs text-stone-400">${c.authority} • ${c.jurisdiction}</p>
            </div>
            <div class="text-right">
              <span class="stamp-badge ${isOverdue ? 'stamp-badge-crimson' : 'stamp-badge-ochre'}">
                ${isOverdue ? '30-Day Deadline Passed' : `${daysLeft} Days Remaining`}
              </span>
              <p class="text-[11px] text-stone-500 mt-1 font-mono">Filing Date: ${c.date_created}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div class="text-xs text-stone-400">
              <strong class="text-stone-300">Statutory Action:</strong> ${isOverdue ? 'Eligible for Section 19(1) First Appeal' : 'Awaiting PIO response'}
            </div>
            <div class="flex items-center gap-2">
              <button 
                class="btn-trigger-appeal px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                data-case-id="${c.id}"
              >
                <i data-lucide="scale" class="w-3.5 h-3.5"></i>
                <span>Draft 1-Click First Appeal</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind First Appeal trigger buttons
    this.casesListContainer.querySelectorAll('.btn-trigger-appeal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-case-id');
        const caseItem = this.trackedCases.find(x => x.id === id);
        if (caseItem) {
          this.generateAndShowFirstAppeal(caseItem);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  async generateAndShowFirstAppeal(caseItem) {
    if (!this.appealModal || !this.appealContentBox) return;

    this.appealModal.classList.remove('hidden');
    this.appealContentBox.innerHTML = `
      <div class="text-center py-12">
        <span class="inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2"></span>
        <p class="text-xs text-stone-300">Drafting Statutory First Appeal under Section 19(1) RTI Act...</p>
      </div>
    `;

    try {
      const res = await window.NyayMitraAPI.generateFirstAppeal({
        applicant_name: "Citizen Appellant",
        applicant_address: caseItem.jurisdiction || "Citizen Address",
        authority_name: caseItem.authority || "Public Authority",
        appellate_authority: "First Appellate Authority",
        original_application_date: caseItem.date_created || "30 days ago",
        rti_ref_no: caseItem.id
      });

      if (res && res.appeal_draft) {
        const html = window.marked ? window.marked.parse(res.appeal_draft) : res.appeal_draft;
        this.appealContentBox.innerHTML = html;

        if (this.appealCopyBtn) {
          this.appealCopyBtn.onclick = () => {
            navigator.clipboard.writeText(res.appeal_draft);
            this.showToast("First Appeal copied to clipboard!");
          };
        }
      }
    } catch (e) {
      this.appealContentBox.innerHTML = `<p class="text-red-400 text-xs">Error drafting appeal: ${e.message}</p>`;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  exportActionPackPdf() {
    const el = document.getElementById('nyayasetu-action-pack-printable');
    if (!el) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `NyayaSetu_Action_Pack_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(el).save();
      this.showToast("Generating Action Pack PDF...");
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

window.NyayaSetuController = NyayaSetuController;
