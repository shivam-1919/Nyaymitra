/**
 * NyayMitra Legal Document Simplifier & Risk Analyzer
 */

class LegalAnalyzerController {
  constructor() {
    this.currentAnalysis = '';
    this.selectedFile = null;
    
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.dropZone = document.getElementById('analyzer-dropzone');
    this.fileInput = document.getElementById('analyzer-file-input');
    this.fileStatus = document.getElementById('analyzer-file-status');
    this.fileNameDisplay = document.getElementById('analyzer-filename');
    this.removeFileBtn = document.getElementById('analyzer-remove-file');
    this.textInput = document.getElementById('analyzer-text-input');
    this.analyzeBtn = document.getElementById('analyzer-submit-btn');
    this.sampleDocBtn = document.getElementById('analyzer-sample-doc-btn');
    
    this.resultsPlaceholder = document.getElementById('analyzer-results-placeholder');
    this.resultsBox = document.getElementById('analyzer-results-box');
    this.resultsContent = document.getElementById('analyzer-results-content');
    this.copyBtn = document.getElementById('analyzer-copy-btn');
  }

  bindEvents() {
    if (this.dropZone) {
      this.dropZone.addEventListener('click', () => this.fileInput.click());
      
      this.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropZone.classList.add('border-amber-500', 'bg-amber-500/5');
      });

      this.dropZone.addEventListener('dragleave', () => {
        this.dropZone.classList.remove('border-amber-500', 'bg-amber-500/5');
      });

      this.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropZone.classList.remove('border-amber-500', 'bg-amber-500/5');
        if (e.dataTransfer.files.length > 0) {
          this.handleFileSelected(e.dataTransfer.files[0]);
        }
      });
    }

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileSelected(e.target.files[0]);
        }
      });
    }

    if (this.removeFileBtn) {
      this.removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearSelectedFile();
      });
    }

    if (this.sampleDocBtn) {
      this.sampleDocBtn.addEventListener('click', () => this.loadSampleDocument());
    }

    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => {
        if (this.currentAnalysis) {
          navigator.clipboard.writeText(this.currentAnalysis);
          this.showToast("Analysis report copied to clipboard!");
        }
      });
    }
  }

  handleFileSelected(file) {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please upload a smaller file or paste the text directly.");
      return;
    }

    this.selectedFile = file;
    if (this.fileNameDisplay) this.fileNameDisplay.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    if (this.fileStatus) this.fileStatus.classList.remove('hidden');
    if (this.textInput) this.textInput.placeholder = "File attached. You can optionally add specific focus questions here...";
  }

  clearSelectedFile() {
    this.selectedFile = null;
    if (this.fileInput) this.fileInput.value = '';
    if (this.fileStatus) this.fileStatus.classList.add('hidden');
    if (this.textInput) this.textInput.placeholder = "Or paste raw agreement clauses, contract text, terms of service, or notice here...";
  }

  loadSampleDocument() {
    const sampleContract = `SERVICE AND VENDOR AGREEMENT (SAMPLE FOR RISK AUDIT)

1. APPOINTMENT & TERM: The Service Provider agrees to deliver software maintenance services for a fixed lock-in term of 36 months.
2. PAYMENT & NON-REFUNDABLE ADVANCE: The Client shall pay an advance security deposit of INR 3,00,000/-. Under no circumstances whatsoever shall this amount be refundable, even if the agreement is cancelled before service commencement.
3. INDEMNITY & UNLIMITED DAMAGES: The Client agrees to indemnify, defend, and hold harmless the Service Provider from any and all third-party claims, losses, or legal liabilities arising from performance, with no monetary liability cap.
4. UNILATERAL TERMINATION: The Service Provider may terminate this contract at any time with 24 hours notice. The Client has no right of early termination during the 36-month lock-in period.
5. DISPUTE RESOLUTION & ARBITRATION: All disputes shall be referred to a Sole Arbitrator nominated solely and exclusively by the Service Provider. The venue of arbitration shall be London, UK, and governed under foreign arbitration laws.`;

    this.clearSelectedFile();
    if (this.textInput) {
      this.textInput.value = sampleContract;
      this.showToast("Sample high-risk agreement loaded!");
    }
  }

  async handleAnalyze() {
    const textContent = this.textInput ? this.textInput.value.trim() : '';
    
    if (!this.selectedFile && !textContent) {
      alert("Please upload a PDF/text document or paste legal text to audit.");
      return;
    }

    this.analyzeBtn.disabled = true;
    this.analyzeBtn.innerHTML = `
      <span class="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2"></span>
      Auditing Clauses & Scanning Risks...
    `;

    try {
      let response;
      if (this.selectedFile) {
        response = await window.NyayMitraAPI.analyzeFile(this.selectedFile);
      } else {
        response = await window.NyayMitraAPI.analyzeText(textContent, "Direct Pasted Text");
      }

      if (response && response.analysis) {
        this.currentAnalysis = response.analysis;
        this.renderResults(response.analysis, response.document_name, response.model_used);
        this.showToast("Legal risk audit completed!");
      }
    } catch (err) {
      alert(`Audit failed: ${err.message || 'Server error'}`);
    } finally {
      this.analyzeBtn.disabled = false;
      this.analyzeBtn.innerHTML = `
        <i data-lucide="shield-search" class="w-4 h-4 mr-1.5"></i>
        Audit Legal Document
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  renderResults(markdown, docName, modelUsed) {
    if (this.resultsPlaceholder) this.resultsPlaceholder.classList.add('hidden');
    if (this.resultsBox) this.resultsBox.classList.remove('hidden');

    const html = window.marked ? window.marked.parse(markdown) : markdown;
    if (this.resultsContent) {
      this.resultsContent.innerHTML = html;
    }

    if (window.lucide) window.lucide.createIcons();
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

window.LegalAnalyzerController = LegalAnalyzerController;
