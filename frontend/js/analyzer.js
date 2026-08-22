/**
 * NyayMitra Legal Document Simplifier, Risk Analyzer & Mobile Camera Scanner
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
    this.cameraInput = document.getElementById('analyzer-camera-input');
    this.cameraBtn = document.getElementById('analyzer-camera-btn');
    this.mobileScannerCard = document.getElementById('mobile-camera-scanner-card');
    this.scannerModal = document.getElementById('analyzer-scanner-modal');
    this.scannerCloseBtn = document.getElementById('analyzer-scanner-close');
    this.scannerPreviewImg = document.getElementById('analyzer-scanner-preview');
    
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
    this.pdfBtn = document.getElementById('analyzer-pdf-btn');
  }

  bindEvents() {
    // Desktop / Regular Dropzone
    if (this.dropZone) {
      this.dropZone.addEventListener('click', () => {
        if (this.fileInput) this.fileInput.click();
      });
      
      this.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropZone.classList.add('border-primary', 'bg-primary/5');
      });

      this.dropZone.addEventListener('dragleave', () => {
        this.dropZone.classList.remove('border-primary', 'bg-primary/5');
      });

      this.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropZone.classList.remove('border-primary', 'bg-primary/5');
        if (e.dataTransfer.files.length > 0) {
          this.handleFileSelected(e.dataTransfer.files[0]);
        }
      });
    }

    // File Input
    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileSelected(e.target.files[0]);
        }
      });
    }

    // Mobile Camera Input & Triggers
    if (this.cameraInput) {
      this.cameraInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
          this.handleCameraCapture(file);
        }
      });
    }

    if (this.cameraBtn) {
      this.cameraBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.cameraInput) this.cameraInput.click();
      });
    }

    if (this.mobileScannerCard) {
      this.mobileScannerCard.addEventListener('click', () => {
        if (this.cameraInput) this.cameraInput.click();
      });
    }

    if (this.scannerCloseBtn && this.scannerModal) {
      this.scannerCloseBtn.addEventListener('click', () => {
        this.scannerModal.classList.add('hidden');
      });
    }

    // Remove File
    if (this.removeFileBtn) {
      this.removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearSelectedFile();
      });
    }

    // Sample Document
    if (this.sampleDocBtn) {
      this.sampleDocBtn.addEventListener('click', () => this.loadSampleDocument());
    }

    // Analyze Submit
    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
    }

    // Copy Report
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => {
        if (this.currentAnalysis) {
          navigator.clipboard.writeText(this.currentAnalysis);
          this.showToast("Analysis report copied to clipboard!");
        }
      });
    }

    // Download PDF of Audit Report
    if (this.pdfBtn) {
      this.pdfBtn.addEventListener('click', () => {
        if (!this.currentAnalysis) return;
        const html = this.resultsContent ? this.resultsContent.innerHTML : marked.parse(this.currentAnalysis);
        if (window.downloadCleanLegalPdf) {
          window.downloadCleanLegalPdf({
            title: "LEGAL DOCUMENT RISK AUDIT REPORT",
            subtitle: "Automated Statutory Risk, Clause Loophole & Trap Breakdown",
            refNo: `AUDIT-${Date.now().toString().slice(-6)}`,
            applicantName: "Citizen Reviewer",
            authorityName: "Document Assessment Record",
            contentHtml: html,
            filename: `NyayMitra_Document_Audit_${Date.now()}`
          });
        } else {
          window.print();
        }
      });
    }
  }

  handleFileSelected(file) {
    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB limit. Please upload a smaller document.");
      return;
    }

    this.selectedFile = file;
    if (this.fileNameDisplay) {
      this.fileNameDisplay.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }
    if (this.fileStatus) this.fileStatus.classList.remove('hidden');
    if (this.textInput) this.textInput.placeholder = "File attached! Add optional questions or click 'Audit Legal Document'...";
    this.showToast(`Selected: ${file.name}`);
  }

  handleCameraCapture(file) {
    this.handleFileSelected(file);

    // Show scanner modal animation
    if (this.scannerModal) {
      this.scannerModal.classList.remove('hidden');
      if (this.scannerPreviewImg) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.scannerPreviewImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      // Automatically launch analysis after 1.2s scanner animation
      setTimeout(() => {
        if (this.scannerModal) this.scannerModal.classList.add('hidden');
        this.handleAnalyze();
      }, 1200);
    } else {
      this.handleAnalyze();
    }
  }

  clearSelectedFile() {
    this.selectedFile = null;
    if (this.fileInput) this.fileInput.value = '';
    if (this.cameraInput) this.cameraInput.value = '';
    if (this.fileStatus) this.fileStatus.classList.add('hidden');
    if (this.textInput) this.textInput.placeholder = "Or paste clauses, tenancy terms, terms of service, employment clauses, or notice text here...";
  }

  loadSampleDocument() {
    const sample = `TENANCY & SECURITY DEPOSIT AGREEMENT (SAMPLE CLAUSES)

Clause 4.1 (Deposit Forfeiture): The Landlord shall hold a non-interest-bearing security deposit of ₹75,000. In case of any early exit before 36 months, the entire security deposit shall be unconditionally forfeited with no right of refund.

Clause 7.3 (Unilateral Rent Hike): The Landlord reserves the absolute right to increase the monthly rent by 25% at any time upon 3 days written WhatsApp notice.

Clause 11.2 (Dispute Resolution): All disputes shall be resolved exclusively in the private jurisdiction of the Landlord's choice without right of appeal to Consumer Forum or Civil Court.`;

    if (this.textInput) {
      this.textInput.value = sample;
      this.clearSelectedFile();
      this.showToast("Sample tenancy agreement loaded.");
    }
  }

  async handleAnalyze() {
    const text = this.textInput ? this.textInput.value.trim() : '';
    
    if (!text && !this.selectedFile) {
      alert("Please upload a legal document, take a photo with your camera, or paste contract text.");
      return;
    }

    this.analyzeBtn.disabled = true;
    this.analyzeBtn.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span> Auditing Document...`;

    if (this.resultsPlaceholder) this.resultsPlaceholder.classList.add('hidden');
    if (this.resultsBox) this.resultsBox.classList.remove('hidden');
    if (this.resultsContent) {
      this.resultsContent.innerHTML = `
        <div class="p-8 text-center space-y-4">
          <div class="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <div class="font-bold text-sm text-slate-800 dark:text-slate-200">Analyzing Document Clauses &amp; Detecting Hidden Traps...</div>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">Cross-checking against Model Tenancy Act, BNS 2023, Consumer Protection Act, and Indian Contract Act 1872.</p>
        </div>
      `;
    }

    try {
      let result;
      if (this.selectedFile) {
        result = await window.NyayMitraAPI.analyzeFile(this.selectedFile);
      } else {
        result = await window.NyayMitraAPI.analyzeText(text, "Citizen Pasted Document");
      }

      this.currentAnalysis = result.analysis;
      if (this.resultsContent) {
        this.resultsContent.innerHTML = marked.parse(this.currentAnalysis);
      }
      this.showToast("Audit complete! Risk breakdown ready.");
      
      // Scroll to results on mobile
      if (window.innerWidth < 1024 && this.resultsBox) {
        this.resultsBox.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Document analysis error:", err);
      if (this.resultsContent) {
        this.resultsContent.innerHTML = `
          <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <strong>Analysis Error:</strong> ${err.message}
          </div>
        `;
      }
    } finally {
      this.analyzeBtn.disabled = false;
      this.analyzeBtn.innerHTML = `<i data-lucide="shield-search" class="w-4 h-4"></i> <span>Audit Legal Document</span>`;
      if (window.lucide) window.lucide.createIcons();
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

window.LegalAnalyzerController = LegalAnalyzerController;
