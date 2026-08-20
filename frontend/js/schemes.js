/**
 * NyayaSetu Welfare Scheme Eligibility Reader (myScheme Profile Matcher)
 */

class WelfareSchemesController {
  constructor() {
    this.schemes = [];
    this.initElements();
    this.bindEvents();
    this.loadAllSchemes();
  }

  initElements() {
    this.occSelect = document.getElementById('scheme-occ-select');
    this.catSelect = document.getElementById('scheme-cat-select');
    this.incomeInput = document.getElementById('scheme-income-input');
    this.incomeDisplay = document.getElementById('scheme-income-display');
    this.ageInput = document.getElementById('scheme-age-input');
    this.puccaHouseCheckbox = document.getElementById('scheme-pucca-house');
    this.findBtn = document.getElementById('scheme-find-btn');
    
    this.schemesGrid = document.getElementById('schemes-results-grid');
    this.matchCountBadge = document.getElementById('schemes-match-count');
  }

  bindEvents() {
    if (this.incomeInput && this.incomeDisplay) {
      this.incomeInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.incomeDisplay.textContent = `₹ ${val.toLocaleString('en-IN')}`;
      });
    }

    if (this.findBtn) {
      this.findBtn.addEventListener('click', () => this.handleCheckEligibility());
    }
  }

  async loadAllSchemes() {
    try {
      const data = await window.NyayMitraAPI.getSchemesList();
      if (data && data.schemes) {
        this.schemes = data.schemes;
        this.renderSchemes(this.schemes);
      }
    } catch (e) {
      console.error('Failed to load schemes:', e);
    }
  }

  async handleCheckEligibility() {
    const profile = {
      occupation: this.occSelect ? this.occSelect.value : 'Any',
      category: this.catSelect ? this.catSelect.value : 'General',
      annual_income: this.incomeInput ? parseInt(this.incomeInput.value) : 200000,
      age: this.ageInput ? parseInt(this.ageInput.value) : 30,
      has_pucca_house: this.puccaHouseCheckbox ? this.puccaHouseCheckbox.checked : false
    };

    if (this.findBtn) {
      this.findBtn.disabled = true;
      this.findBtn.innerHTML = `
        <span class="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-2"></span>
        Evaluating Official Scheme Rules...
      `;
    }

    try {
      const res = await window.NyayMitraAPI.checkSchemes(profile);
      if (res && res.schemes) {
        this.renderSchemes(res.schemes, true);
        if (this.matchCountBadge) {
          this.matchCountBadge.textContent = `${res.schemes.length} Schemes Matched`;
        }
      }
    } catch (err) {
      alert("Eligibility check failed: " + err.message);
    } finally {
      if (this.findBtn) {
        this.findBtn.disabled = false;
        this.findBtn.innerHTML = `
          <i data-lucide="sparkles" class="w-4 h-4 mr-1.5"></i>
          Find Eligible Schemes
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  renderSchemes(items, isFiltered = false) {
    if (!this.schemesGrid) return;

    if (items.length === 0) {
      this.schemesGrid.innerHTML = `
        <div class="col-span-full p-8 text-center glass-panel">
          <i data-lucide="search-x" class="w-10 h-10 text-slate-500 mx-auto mb-2"></i>
          <h4 class="text-sm font-semibold text-slate-300">No matching schemes found</h4>
          <p class="text-xs text-slate-500 mt-1">Try adjusting income limits or category filters.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.schemesGrid.innerHTML = items.map(s => {
      return `
        <div class="glass-panel-interactive p-5 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                ${s.category}
              </span>
              <span class="text-[10px] text-slate-400 font-mono">${s.confidence || 'Official Scheme'}</span>
            </div>

            <h4 class="text-base font-bold text-white mb-1">${s.name}</h4>
            <p class="text-xs text-amber-400/80 font-medium mb-3">${s.ministry}</p>

            <!-- Benefit Box -->
            <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 mb-3">
              <strong class="text-emerald-300 font-bold block mb-0.5">💰 Direct Citizen Benefit:</strong>
              ${s.benefit}
            </div>

            ${s.eligibility_reason ? `
              <div class="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 mb-3">
                <strong class="text-amber-400 font-semibold">Why You Qualify:</strong> ${s.eligibility_reason}
              </div>
            ` : ''}

            <!-- Required Documents Checklist -->
            <div class="space-y-1.5 text-xs text-slate-300">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mandatory Verification Documents:</span>
              <ul class="space-y-1 text-[11px] text-slate-300">
                ${s.required_documents.map(doc => `
                  <li class="flex items-start gap-1.5">
                    <i data-lucide="check" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5"></i>
                    <span>${doc}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span class="text-[11px] text-slate-500 font-mono">Official Portal Verified</span>
            <a 
              href="${s.official_url}" 
              target="_blank" 
              class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>Apply on Official Portal</span>
              <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.WelfareSchemesController = WelfareSchemesController;
