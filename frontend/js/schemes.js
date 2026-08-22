/**
 * NyayMitra Welfare Schemes Controller & myScheme Matcher
 * Features 16+ Verified Government Welfare Schemes, Live Search, Category Filters,
 * Profile Matcher, Bookmarking (LocalStorage), and Comprehensive "How to Apply" Steps.
 */

class WelfareSchemesController {
  constructor() {
    this.schemes = [];
    this.allSchemesCache = [];
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.activeTab = 'all'; // 'all' or 'bookmarked'
    this.expandedApplyId = null; // ID of scheme currently showing How to Apply
    this.bookmarkedIds = JSON.parse(localStorage.getItem('nyaymitra_bookmarked_schemes') || '[]');

    this.initElements();
    this.bindEvents();
    this.loadAllSchemes();

    // Hook i18n
    if (window.i18n) {
      window.i18n.onLanguageChange(() => this.renderSchemes(this.getFilteredSchemes()));
    }
  }

  initElements() {
    this.searchInput = document.getElementById('scheme-search-input');
    this.categoryTabsContainer = document.getElementById('schemes-category-tabs');
    this.occSelect = document.getElementById('scheme-occ-select');
    this.catSelect = document.getElementById('scheme-cat-select');
    this.incomeInput = document.getElementById('scheme-income-input');
    this.incomeDisplay = document.getElementById('scheme-income-display');
    this.ageInput = document.getElementById('scheme-age-input');
    this.genderSelect = document.getElementById('scheme-gender-select');
    this.housingSelect = document.getElementById('scheme-housing-select');
    this.findBtn = document.getElementById('scheme-find-btn');
    this.resetBtn = document.getElementById('scheme-reset-btn');

    this.schemesGrid = document.getElementById('schemes-results-grid');
    this.matchCountBadge = document.getElementById('schemes-match-count');
    this.viewAllTabBtn = document.getElementById('schemes-tab-all-btn');
    this.viewBookmarkedTabBtn = document.getElementById('schemes-tab-bookmarked-btn');
  }

  bindEvents() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderSchemes(this.getFilteredSchemes());
      });
    }

    // Income slider
    if (this.incomeInput && this.incomeDisplay) {
      this.incomeInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.incomeDisplay.textContent = `₹ ${val.toLocaleString('en-IN')}`;
      });
    }

    // Find schemes button
    if (this.findBtn) {
      this.findBtn.addEventListener('click', () => this.handleCheckEligibility());
    }

    // Reset filters button
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetFilters());
    }

    // Tab buttons
    if (this.viewAllTabBtn) {
      this.viewAllTabBtn.addEventListener('click', () => {
        this.activeTab = 'all';
        this.updateTabButtons();
        this.renderSchemes(this.getFilteredSchemes());
      });
    }

    if (this.viewBookmarkedTabBtn) {
      this.viewBookmarkedTabBtn.addEventListener('click', () => {
        this.activeTab = 'bookmarked';
        this.updateTabButtons();
        this.renderSchemes(this.getFilteredSchemes());
      });
    }

    // Grid interaction delegates (bookmark, copy benefit, toggle apply)
    if (this.schemesGrid) {
      this.schemesGrid.addEventListener('click', (e) => {
        const bookmarkBtn = e.target.closest('.scheme-bookmark-btn');
        if (bookmarkBtn) {
          const schemeId = bookmarkBtn.getAttribute('data-id');
          this.toggleBookmark(schemeId);
          return;
        }

        const copyBenefitBtn = e.target.closest('.scheme-copy-benefit-btn');
        if (copyBenefitBtn) {
          const text = copyBenefitBtn.getAttribute('data-benefit');
          if (text) {
            navigator.clipboard.writeText(text);
            window.nyayMitra?.showToast("Benefit details copied to clipboard!");
          }
          return;
        }

        const toggleApplyBtn = e.target.closest('.scheme-toggle-apply-btn');
        if (toggleApplyBtn) {
          const schemeId = toggleApplyBtn.getAttribute('data-id');
          this.toggleHowToApply(schemeId);
          return;
        }
      });
    }
  }

  updateTabButtons() {
    if (this.viewAllTabBtn && this.viewBookmarkedTabBtn) {
      if (this.activeTab === 'all') {
        this.viewAllTabBtn.className = 'px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all';
        this.viewBookmarkedTabBtn.className = 'px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all';
      } else {
        this.viewBookmarkedTabBtn.className = 'px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all';
        this.viewAllTabBtn.className = 'px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all';
      }
    }
  }

  toggleBookmark(schemeId) {
    if (this.bookmarkedIds.includes(schemeId)) {
      this.bookmarkedIds = this.bookmarkedIds.filter(id => id !== schemeId);
      window.nyayMitra?.showToast("Scheme removed from saved list");
    } else {
      this.bookmarkedIds.push(schemeId);
      window.nyayMitra?.showToast("Scheme saved to your offline list");
    }
    localStorage.setItem('nyaymitra_bookmarked_schemes', JSON.stringify(this.bookmarkedIds));
    this.renderSchemes(this.getFilteredSchemes());
  }

  toggleHowToApply(schemeId) {
    if (this.expandedApplyId === schemeId) {
      this.expandedApplyId = null;
    } else {
      this.expandedApplyId = schemeId;
    }
    this.renderSchemes(this.getFilteredSchemes());
  }

  resetFilters() {
    if (this.searchInput) this.searchInput.value = '';
    this.searchQuery = '';
    if (this.occSelect) this.occSelect.value = 'Any';
    if (this.catSelect) this.catSelect.value = 'General';
    if (this.incomeInput) this.incomeInput.value = 200000;
    if (this.incomeDisplay) this.incomeDisplay.textContent = '₹ 2,00,000';
    if (this.ageInput) this.ageInput.value = 30;
    if (this.genderSelect) this.genderSelect.value = 'All';
    if (this.housingSelect) this.housingSelect.value = 'Any';
    this.currentCategory = 'All';
    this.activeTab = 'all';
    this.expandedApplyId = null;
    this.updateTabButtons();
    this.renderCategoryChips();
    this.schemes = [...this.allSchemesCache];
    this.renderSchemes(this.schemes);
    window.nyayMitra?.showToast("Filters reset to default");
  }

  async loadAllSchemes() {
    try {
      const data = await window.NyayMitraAPI.getSchemesList();
      if (data && data.schemes && data.schemes.length > 0) {
        this.allSchemesCache = this.mergeSchemeData(data.schemes);
        this.schemes = [...this.allSchemesCache];
      } else {
        this.allSchemesCache = this.getFallbackSchemes();
        this.schemes = [...this.allSchemesCache];
      }
    } catch (e) {
      console.warn('Backend scheme fetch failed, loading local scheme catalog:', e);
      this.allSchemesCache = this.getFallbackSchemes();
      this.schemes = [...this.allSchemesCache];
    }
    this.renderCategoryChips();
    this.renderSchemes(this.getFilteredSchemes());
  }

  mergeSchemeData(apiSchemes) {
    const fallbackMap = {};
    this.getFallbackSchemes().forEach(s => { fallbackMap[s.id] = s; });
    return apiSchemes.map(s => {
      const fallback = fallbackMap[s.id] || {};
      return {
        ...fallback,
        ...s,
        how_to_apply: s.how_to_apply || fallback.how_to_apply || null
      };
    });
  }

  renderCategoryChips() {
    if (!this.categoryTabsContainer) return;
    const categories = [
      'All',
      'Healthcare & Insurance',
      'Food & Ration',
      'Housing & Shelter',
      'Farmers & Agriculture',
      'Women & Children',
      'Labour & Vendors',
      'Youth & Students',
      'Senior Citizens & Pension',
      'Financial & Legal Aid'
    ];

    this.categoryTabsContainer.innerHTML = categories.map(cat => {
      const isActive = cat === this.currentCategory;
      return `
        <button 
          class="scheme-cat-pill px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            isActive 
              ? 'bg-emerald-600 text-white font-bold shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }"
          data-category="${cat}"
        >
          ${cat === 'All' ? 'All Schemes' : cat}
        </button>
      `;
    }).join('');

    this.categoryTabsContainer.querySelectorAll('.scheme-cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.getAttribute('data-category');
        this.renderCategoryChips();
        this.renderSchemes(this.getFilteredSchemes());
      });
    });
  }

  getFilteredSchemes() {
    let list = this.activeTab === 'bookmarked'
      ? this.allSchemesCache.filter(s => this.bookmarkedIds.includes(s.id))
      : this.schemes;

    // Filter by Category
    if (this.currentCategory !== 'All') {
      list = list.filter(s => s.category === this.currentCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery;
      list = list.filter(s => {
        const name = (s.name || '').toLowerCase();
        const nameHi = (s.name_hi || '').toLowerCase();
        const ministry = (s.ministry || '').toLowerCase();
        const category = (s.category || '').toLowerCase();
        const benefit = (s.benefit || '').toLowerCase();
        const audience = (s.target_audience || '').toLowerCase();
        return name.includes(q) || nameHi.includes(q) || ministry.includes(q) || category.includes(q) || benefit.includes(q) || audience.includes(q);
      });
    }

    return list;
  }

  async handleCheckEligibility() {
    const profile = {
      occupation: this.occSelect ? this.occSelect.value : 'Any',
      category: this.catSelect ? this.catSelect.value : 'General',
      annual_income: this.incomeInput ? parseInt(this.incomeInput.value) : 200000,
      age: this.ageInput ? parseInt(this.ageInput.value) : 30,
      gender: this.genderSelect ? this.genderSelect.value : 'All',
      has_pucca_house: this.housingSelect ? (this.housingSelect.value === 'has_pucca') : false
    };

    if (this.findBtn) {
      this.findBtn.disabled = true;
      this.findBtn.innerHTML = `
        <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></span>
        Evaluating Official Criteria...
      `;
    }

    try {
      const res = await window.NyayMitraAPI.checkSchemes(profile);
      if (res && res.schemes) {
        this.schemes = this.mergeSchemeData(res.schemes);
        this.renderSchemes(this.getFilteredSchemes(), true);
        window.nyayMitra?.showToast(`Found ${res.schemes.length} matching government schemes`);
      }
    } catch (err) {
      console.warn("API check failed, evaluating locally:", err);
      this.evaluateSchemesLocally(profile);
    } finally {
      if (this.findBtn) {
        this.findBtn.disabled = false;
        this.findBtn.innerHTML = `<i data-lucide="search" class="w-4 h-4 mr-1"></i> Check Eligible Schemes`;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  evaluateSchemesLocally(profile) {
    const occ = (profile.occupation || 'Any').toLowerCase();
    const inc = profile.annual_income || 200000;
    const isBpl = inc <= 100000;
    const hasPucca = profile.has_pucca_house || false;

    const evaluated = this.allSchemesCache.map(s => {
      let score = 50;
      const reasons = [];
      const sid = s.id;

      if (occ.includes('vendor') && sid === 'pm_svanidhi') {
        score += 45;
        reasons.push("Direct match for Urban/Semi-Urban Street Vendors");
      }
      if (occ.includes('farmer') && sid === 'pm_kisan') {
        score += 45;
        reasons.push("Targeted for Agricultural Cultivators");
      }
      if (isBpl && (sid === 'nfsa_ration' || sid === 'ayushman_bharat')) {
        score += 35;
        reasons.push("Low-income / BPL category qualification");
      }
      if (!hasPucca && sid === 'pmay_urban') {
        score += 40;
        reasons.push("No pucca house owned");
      }

      return {
        ...s,
        match_score: Math.min(98, score),
        eligibility_reason: reasons.join(' • ') || "General citizen welfare criteria met."
      };
    });

    evaluated.sort((a, b) => (b.match_score || 50) - (a.match_score || 50));
    this.schemes = evaluated;
    this.renderSchemes(this.getFilteredSchemes(), true);
  }

  renderSchemes(items, isFiltered = false) {
    if (!this.schemesGrid) return;

    if (this.matchCountBadge) {
      this.matchCountBadge.textContent = `${items.length} Schemes Available`;
    }

    if (items.length === 0) {
      this.schemesGrid.innerHTML = `
        <div class="col-span-full p-10 text-center glass-panel space-y-3 bg-white border border-slate-200 rounded-2xl">
          <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto">
            <i data-lucide="search-x" class="w-6 h-6"></i>
          </div>
          <h4 class="text-base font-bold text-slate-800">${this.activeTab === 'bookmarked' ? 'No Saved Schemes' : 'No matching schemes found'}</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            ${this.activeTab === 'bookmarked' 
              ? 'Click the bookmark icon on any scheme card to save it here for offline viewing and quick reference.' 
              : 'Try clearing your search query or selecting "All Occupations" to view general citizen schemes.'}
          </p>
          <button onclick="window.nyayMitra?.schemesCtrl?.resetFilters()" class="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-sm">
            Reset Filters
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const currentLang = window.i18n ? window.i18n.getLanguage() : 'English';
    const isHindi = currentLang === 'Hindi';

    this.schemesGrid.innerHTML = items.map(s => {
      const isBookmarked = this.bookmarkedIds.includes(s.id);
      const isApplyExpanded = this.expandedApplyId === s.id;
      const title = (isHindi && s.name_hi) ? s.name_hi : s.name;
      const benefitText = (isHindi && s.benefit_hi) ? s.benefit_hi : s.benefit;
      const matchScore = s.match_score || 85;
      const applyData = s.how_to_apply || null;

      return `
        <div class="glass-panel-interactive p-5 flex flex-col justify-between space-y-4 relative group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
          
          <!-- Top Tag Bar -->
          <div>
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                ${s.category}
              </span>
              
              <div class="flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  matchScore >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }">
                  ${matchScore}% Match
                </span>
                <button 
                  class="scheme-bookmark-btn p-1.5 rounded-lg border text-xs transition-all ${
                    isBookmarked 
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm' 
                      : 'bg-white border-slate-300 text-slate-500 hover:text-emerald-700 hover:border-emerald-400'
                  }"
                  data-id="${s.id}"
                  title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark this scheme'}"
                >
                  <i data-lucide="${isBookmarked ? 'bookmark-check' : 'bookmark'}" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

            <!-- Title & Ministry -->
            <h4 class="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-emerald-700 transition-colors font-heading">
              ${title}
            </h4>
            <p class="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5">
              <i data-lucide="building-2" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0"></i>
              <span class="truncate">${s.ministry}</span>
            </p>

            <!-- Direct Benefit Card -->
            <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 mb-3.5 relative shadow-inner">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-emerald-800 font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <i data-lucide="badge-percent" class="w-3.5 h-3.5"></i> Direct Benefit:
                </span>
                <button 
                  class="scheme-copy-benefit-btn text-[10px] text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-2 py-0.5 rounded transition-all flex items-center gap-1 border border-slate-200 shadow-sm"
                  data-benefit="${this.escapeHtml(benefitText)}"
                  title="Copy Benefit Details"
                >
                  <i data-lucide="copy" class="w-3 h-3"></i> Copy
                </button>
              </div>
              <p class="leading-relaxed text-[12px] text-slate-700">${benefitText}</p>
            </div>

            <!-- Eligibility Qualification Rationale -->
            ${s.eligibility_reason ? `
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 mb-3">
                <span class="text-emerald-700 font-semibold block mb-0.5">Why You Qualify:</span>
                <span class="text-slate-600">${s.eligibility_reason}</span>
              </div>
            ` : ''}

            <!-- Required Documents Checklist -->
            <div class="space-y-1.5 text-xs text-slate-700 pt-1">
              <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <i data-lucide="file-check-2" class="w-3.5 h-3.5 text-emerald-600"></i> Required Documents:
              </span>
              <ul class="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                ${(s.required_documents || []).map(doc => `
                  <li class="flex items-start gap-1.5">
                    <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5"></i>
                    <span>${doc}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- HOW TO APPLY ACCORDION SECTION -->
            ${applyData ? `
              <div class="mt-3.5 pt-3 border-t border-slate-200">
                <button 
                  class="scheme-toggle-apply-btn w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isApplyExpanded 
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' 
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-800'
                  }"
                  data-id="${s.id}"
                >
                  <span class="flex items-center gap-1.5">
                    <i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-600"></i>
                    <span>${isApplyExpanded ? 'Hide Step-by-Step Guide' : 'How to Apply (Step-by-Step)'}</span>
                  </span>
                  <i data-lucide="${isApplyExpanded ? 'chevron-up' : 'chevron-down'}" class="w-4 h-4"></i>
                </button>

                ${isApplyExpanded ? `
                  <div class="mt-3 p-3.5 rounded-xl bg-slate-50 border border-emerald-200 space-y-3.5 text-xs text-slate-700 animate-fade-in">
                    
                    <!-- Quick Meta Pills -->
                    <div class="grid grid-cols-2 gap-2 text-[11px]">
                      <div class="p-2 rounded-lg bg-white border border-slate-200">
                        <span class="text-slate-500 block text-[10px]">Application Fee:</span>
                        <strong class="text-emerald-700 font-semibold">${applyData.application_fee || '₹0 Free'}</strong>
                      </div>
                      <div class="p-2 rounded-lg bg-white border border-slate-200">
                        <span class="text-slate-500 block text-[10px]">Processing Time:</span>
                        <strong class="text-slate-800 font-semibold">${applyData.processing_time || '15-30 Days'}</strong>
                      </div>
                    </div>

                    <!-- Online Route -->
                    <div>
                      <h5 class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <i data-lucide="globe" class="w-3.5 h-3.5"></i> Track A: Apply Online
                      </h5>
                      <ol class="space-y-1.5 text-[11px] text-slate-700 list-decimal list-inside pl-1 bg-white p-2.5 rounded-lg border border-slate-200">
                        ${(applyData.online_steps || []).map(step => `
                          <li class="leading-relaxed"><span class="text-slate-800">${step}</span></li>
                        `).join('')}
                      </ol>
                    </div>

                    <!-- Offline Route -->
                    <div>
                      <h5 class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                        <i data-lucide="building" class="w-3.5 h-3.5"></i> Track B: Apply at CSC / Office
                      </h5>
                      <p class="text-[11px] text-slate-600 mb-1.5 font-medium">
                        Location: <span class="text-slate-800">${applyData.offline_route || 'Nearest Common Service Centre (CSC) or Ward Office'}</span>
                      </p>
                      <ol class="space-y-1.5 text-[11px] text-slate-700 list-decimal list-inside pl-1 bg-white p-2.5 rounded-lg border border-slate-200">
                        ${(applyData.offline_steps || []).map(step => `
                          <li class="leading-relaxed"><span class="text-slate-800">${step}</span></li>
                        `).join('')}
                      </ol>
                    </div>

                    <!-- Official Helpline -->
                    ${applyData.helpline ? `
                      <div class="p-2.5 rounded-lg bg-emerald-100/50 border border-emerald-200 flex items-center justify-between text-[11px]">
                        <span class="text-emerald-900 font-medium flex items-center gap-1.5">
                          <i data-lucide="phone-call" class="w-3.5 h-3.5"></i> Official Scheme Helpline:
                        </span>
                        <a href="tel:${applyData.helpline}" class="font-mono font-bold text-emerald-800 hover:underline">${applyData.helpline}</a>
                      </div>
                    ` : ''}

                    <!-- Official Portal Link -->
                    ${applyData.official_portal ? `
                      <a 
                        href="${applyData.official_portal}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                        <span>Visit Official Application Portal</span>
                      </a>
                    ` : ''}

                  </div>
                ` : ''}
              </div>
            ` : ''}

          </div>

          <!-- Bottom Action Controls -->
          <div class="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <span class="text-[11px] text-slate-500 font-mono">ID: ${s.id}</span>
            <button 
              onclick="window.nyayMitra?.switchTab('chat')" 
              class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
            >
              <i data-lucide="help-circle" class="w-3.5 h-3.5 text-slate-500"></i>
              <span>Ask Advisor</span>
            </button>
          </div>

        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  escapeHtml(str) {
    return (str || '')
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  getFallbackSchemes() {
    return [
      {
        id: "pm_svanidhi",
        name: "PM SVANidhi (Pradhan Mantri Street Vendor's AtmaNirbhar Nidhi)",
        name_hi: "पीएम स्वनिधि (रेहड़ी-पटरी विक्रेता आत्मनिर्भर निधि)",
        ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
        category: "Labour & Vendors",
        benefit: "Collateral-free working capital loan of Rs 10,000 (1st tranche), Rs 20,000 (2nd tranche), up to Rs 50,000 (3rd tranche) with 7% interest subsidy and cashback on digital transactions.",
        benefit_hi: "बिना किसी गारंटी के ₹10,000 से ₹50,000 तक का कार्यशील ऋण, 7% ब्याज सब्सिडी और डिजिटल कैशबैक।",
        required_documents: ["Aadhaar Card (linked to Mobile)", "Vending Certificate / ULB ID Card / LoR", "Active Bank Account with IFSC"],
        how_to_apply: {
          online_portal: "PM SVANidhi Official Portal (pmsvanidhi.mohua.gov.in)",
          online_steps: [
            "Visit pmsvanidhi.mohua.gov.in and click 'Apply for Loan'.",
            "Enter Aadhaar-linked mobile number and verify with OTP.",
            "Select Vending Category (ID Card holder or LoR applicant).",
            "Fill in personal, banking & lending bank details.",
            "Submit and download digital Application Reference Slip."
          ],
          offline_route: "Nearest Common Service Centre (CSC) or Municipal Corporation Urban Livelihood Cell",
          offline_steps: [
            "Visit your Municipal Corporation or Nagar Palika office.",
            "Request Form 'Letter of Recommendation (LoR)' if you don't have a vending card.",
            "Submit Aadhaar copy, bank passbook, and photo.",
            "Collect the physical acknowledgement receipt."
          ],
          application_fee: "₹0 (100% Free / Zero Processing Fee)",
          processing_time: "10 to 15 Working Days",
          helpline: "1800-11-1979 (MoHUA Toll-Free)"
        },
        official_url: "https://pmsvanidhi.mohua.gov.in"
      },
      {
        id: "pm_kisan",
        name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        name_hi: "पीएम किसान सम्मान निधि (PM-KISAN)",
        ministry: "Ministry of Agriculture and Farmers Welfare",
        category: "Farmers & Agriculture",
        benefit: "Direct income support of Rs 6,000 per year paid in three equal installments of Rs 2,000 directly transferred via DBT.",
        benefit_hi: "सभी पात्र किसान परिवारों को ₹6,000 प्रति वर्ष की प्रत्यक्ष आर्थिक सहायता (₹2,000 की 3 किश्तों में)।",
        required_documents: ["Aadhaar Card (e-KYC verified)", "Land Ownership Records (Khasra-Khatauni)", "Aadhaar-seeded Bank Account"],
        how_to_apply: {
          online_portal: "PM-KISAN Portal (pmkisan.gov.in)",
          online_steps: [
            "Go to pmkisan.gov.in -> 'Farmers Corner' -> click 'New Farmer Registration'.",
            "Select Rural or Urban Farmer and enter Aadhaar with OTP.",
            "Fill in Land Details (Survey/Khasra No, Khata No, Land Area in Hectares).",
            "Upload scanned Land Khatauni document and submit."
          ],
          offline_route: "Nearest Village Patwari / Lekhpal / Krishi Vigyan Kendra / CSC",
          offline_steps: [
            "Visit your Local Agriculture Office or Gram Panchayat.",
            "Fill the PM-KISAN Physical Registration Form.",
            "Attach certified copies of Land Records, Aadhaar, and Bank Passbook.",
            "Get verification stamp from Village Patwari."
          ],
          application_fee: "₹0 (Free on portal; max ₹15 at CSC center)",
          processing_time: "15 to 30 Days (Credited in next DBT cycle)",
          helpline: "155261 / 011-24300606 (National Helpline)"
        },
        official_url: "https://pmkisan.gov.in"
      },
      {
        id: "ayushman_bharat",
        name: "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY & Vay Vandana 70+)",
        name_hi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना एवं वय वंदना (70+ वर्ष)",
        ministry: "National Health Authority (NHA)",
        category: "Healthcare & Insurance",
        benefit: "100% Cashless medical treatment cover up to Rs 5,00,000 per family per year across 29,000+ empaneled hospitals. Universal for 70+ citizens.",
        benefit_hi: "प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा, 29,000+ अस्पतालों में मुफ्त इलाज।",
        required_documents: ["Aadhaar Card", "Ration Card / PMJAY Family ID", "Mobile Number"],
        how_to_apply: {
          online_portal: "NHA Beneficiary Portal (beneficiary.nha.gov.in) & Ayushman App",
          online_steps: [
            "Visit beneficiary.nha.gov.in and log in with mobile OTP.",
            "Select State, Scheme (PMJAY), District, and Search by Aadhaar/Ration Card.",
            "Click 'e-KYC' -> Complete Face Auth or Aadhaar OTP.",
            "Download your Ayushman PVC / Digital Card instantly."
          ],
          offline_route: "Nearest Government Hospital (Ayushman Mitra Desk) or CSC Seva Kendra",
          offline_steps: [
            "Visit any Government or Empaneled Private Hospital reception.",
            "Approach the dedicated 'Ayushman Mitra' desk.",
            "Show your Aadhaar card and Ration Card for instant biometric check.",
            "Ayushman Mitra prints your card on the spot in 10 minutes."
          ],
          application_fee: "₹0 (100% Free at Government Hospitals)",
          processing_time: "Instant (Card issued within 10 minutes)",
          helpline: "14555 / 1800-111-565 (24x7 Toll-Free)"
        },
        official_url: "https://beneficiary.nha.gov.in"
      },
      {
        id: "nfsa_ration",
        name: "National Food Security Act (NFSA) Subsidized Food Grain Scheme",
        name_hi: "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) सब्सिडीयुक्त खाद्यान्न योजना",
        ministry: "Department of Food and Public Distribution",
        category: "Food & Ration",
        benefit: "5 kg free food grains per person per month (35 kg per family for Antyodaya households) under PMGKAY with nationwide portability.",
        benefit_hi: "प्रति व्यक्ति 5 किलो मुफ्त खाद्यान्न प्रति माह (अंत्योदय परिवारों को 35 किलो खाद्यान्न)।",
        required_documents: ["Aadhaar Card of all members", "Income Certificate / BPL Card", "Address Proof", "Photo of Head of Family"],
        how_to_apply: {
          online_portal: "State Food Portal (via nfsa.gov.in/portal/state_food_portals)",
          online_steps: [
            "Open your State Food Portal (e.g. fcs.up.gov.in, food.wb.gov.in).",
            "Click 'Apply for New Ration Card (NFSA PHH / AAY)'.",
            "Enter Head of Family (Female 18+) Aadhaar and generate OTP.",
            "Add household members and upload Income & Address documents."
          ],
          offline_route: "District Food & Supplies Controller (DFSC) Office or Tehsil Food Desk",
          offline_steps: [
            "Collect Form 'A' from Tehsil/Block Food Office.",
            "Fill family member details and attach joint photo.",
            "Submit self-attested Aadhaar copies to Food Inspector.",
            "Receive numbered receipt for 30-day field verification."
          ],
          application_fee: "₹0 to ₹10 (Statutory fee varies slightly by state)",
          processing_time: "30 Statutory Days",
          helpline: "1967 / 1800-180-2087 (National PDS Helpline)"
        },
        official_url: "https://nfsa.gov.in"
      },
      {
        id: "pmay_urban",
        name: "Pradhan Mantri Awas Yojana (PMAY-U / PMAY-G)",
        name_hi: "प्रधानमंत्री आवास योजना (PMAY ग्रामीण एवं शहरी)",
        ministry: "Ministry of Housing and Urban Affairs",
        category: "Housing & Shelter",
        benefit: "Financial assistance of Rs 1.20 Lakh to Rs 2.67 Lakhs upfront subsidy on home construction or interest subsidy.",
        benefit_hi: "पक्का मकान निर्माण अथवा ब्याज सब्सिडी हेतु ₹1.20 लाख से ₹2.67 लाख तक की सरकारी सहायता।",
        required_documents: ["Aadhaar Card", "Income Proof from Revenue Officer", "Land Title / Passbook", "No Pucca House Affidavit"],
        how_to_apply: {
          online_portal: "PMAY-U MIS Portal (pmaymis.gov.in)",
          online_steps: [
            "Visit pmaymis.gov.in -> 'Citizen Assessment' -> Choose scheme component.",
            "Verify Aadhaar number and name as per Aadhaar.",
            "Fill in Ward number, family income, and bank account details.",
            "Save and note down your Assessment Application ID."
          ],
          offline_route: "Nearest Municipal Corporation / Nagar Palika Urban Housing Desk or CSC",
          offline_steps: [
            "Visit Municipal Housing Desk or Gram Panchayat Secretary.",
            "Fill the PMAY Physical Assessment Form.",
            "Attach Land title/Kutcha house photo and Aadhaar copies.",
            "Municipal field team inspects site for geo-tagging."
          ],
          application_fee: "₹0 Free (₹25 + GST if filled at CSC)",
          processing_time: "30 to 60 Days",
          helpline: "011-23063285 (PMAY Central Helpline)"
        },
        official_url: "https://pmaymis.gov.in"
      },
      {
        id: "e_shram",
        name: "e-Shram Universal Unorganized Workers Social Security Card",
        name_hi: "ई-श्रम असंगठित कर्मकार राष्ट्रीय डेटाबेस एवं सुरक्षा कार्ड",
        ministry: "Ministry of Labour and Employment",
        category: "Labour & Vendors",
        benefit: "12-digit Universal Account Number (UAN), Rs 2 Lakh accidental insurance cover (PMSBY), and direct disaster relief aid integration.",
        benefit_hi: "12 अंकों का यूनिवर्सल अकाउंट नंबर (UAN) एवं ₹2 लाख का दुर्घटना बीमा कवर।",
        required_documents: ["Aadhaar Card", "Aadhaar-linked Mobile Number", "Bank Account with IFSC"],
        how_to_apply: {
          online_portal: "e-Shram Portal (eshram.gov.in)",
          online_steps: [
            "Visit eshram.gov.in and click 'REGISTER on e-Shram'.",
            "Enter Aadhaar linked mobile and verify OTP.",
            "Confirm demographic details and enter primary occupation.",
            "Submit to instantly download your 12-digit UAN Card."
          ],
          offline_route: "Nearest Common Service Centre (CSC) or State Labour Office",
          offline_steps: [
            "Visit any nearby CSC center with Aadhaar and Bank passbook.",
            "CSC operator does biometric authentication.",
            "Receive your printed laminated e-Shram Card on the spot."
          ],
          application_fee: "₹0 (100% Free Registration)",
          processing_time: "Instant (5 Minutes)",
          helpline: "14434 (Ministry of Labour Toll-Free)"
        },
        official_url: "https://eshram.gov.in"
      },
      {
        id: "nalsa_free_legal_aid",
        name: "NALSA Free Legal Aid & Assigned Advocate Service",
        name_hi: "नालसा (NALSA) 100% निःशुल्क कानूनी सहायता एवं सरकारी अधिवक्ता",
        ministry: "National Legal Services Authority (Supreme Court of India)",
        category: "Financial & Legal Aid",
        benefit: "100% Free legal advice, drafting of petitions, court fees, and enrolled advocate assigned at zero cost across all courts.",
        benefit_hi: "100% मुफ्त कानूनी सलाह, नोटिस व याचिकाओं का प्रारूपण और मुफ्त सरकारी वकील की नियुक्ति।",
        required_documents: ["Aadhaar / ID Proof", "Income Certificate / BPL Card (Exempt for women & SC/ST)", "Case Documents"],
        how_to_apply: {
          online_portal: "NALSA Legal Services Portal (nalsa.gov.in/lsms/)",
          online_steps: [
            "Visit nalsa.gov.in -> Click 'Apply for Legal Aid'.",
            "Choose Nature of Legal Aid (Court representation, Advice, Drafting).",
            "Upload ID proof and case documents (summons, FIR, notice).",
            "Submit and get Unique Case Reference Tracking Number."
          ],
          offline_route: "District Legal Services Authority (DLSA) Front Office in any District Court",
          offline_steps: [
            "Walk into the DLSA office inside any District Court complex.",
            "Meet the Legal Aid Retainer Lawyer on duty.",
            "Fill the 1-page Free Legal Aid Form.",
            "A Panel Advocate is assigned to your case within 48 to 72 hours."
          ],
          application_fee: "₹0 (100% Free - Advocate fees paid by Government)",
          processing_time: "2 to 3 Working Days",
          helpline: "15100 (NALSA 24x7 National Legal Aid Helpline)"
        },
        official_url: "https://nalsa.gov.in"
      },
      {
        id: "pm_vishwakarma",
        name: "PM Vishwakarma Kaushal Samman Yojana",
        name_hi: "पीएम विश्वकर्मा कौशल सम्मान योजना (कारीगर व शिल्पकार)",
        ministry: "Ministry of Micro, Small and Medium Enterprises (MSME)",
        category: "Labour & Vendors",
        benefit: "PM Vishwakarma Certificate & ID, skill training with Rs 500/day stipend, toolkit grant of Rs 15,000, and collateral-free loan up to Rs 3 Lakhs at 5% interest.",
        benefit_hi: "विश्वकर्मा प्रमाण पत्र, ₹500/दिन वजीफे के साथ निःशुल्क कौशल प्रशिक्षण, ₹15,000 टूलकिट अनुदान, तथा ₹3 लाख तक का रियायती ऋण।",
        required_documents: ["Aadhaar Card", "Mobile Number linked to Aadhaar", "Bank Account Details", "Ration Card"],
        how_to_apply: {
          online_portal: "PM Vishwakarma Portal (pmvishwakarma.gov.in)",
          online_steps: [
            "Visit pmvishwakarma.gov.in and click 'How to Register'.",
            "Verify Mobile and Aadhaar via biometric/OTP authentication.",
            "Select your Artisan Trade (out of 18 eligible crafts).",
            "Choose preferred training center and submit."
          ],
          offline_route: "Nearest CSC Digital Seva Kendra or Gram Panchayat Desk",
          offline_steps: [
            "Visit your nearest CSC center with Aadhaar and Bank passbook.",
            "CSC operator registers your trade with biometric authentication.",
            "Gram Panchayat Committee verifies credentials in Stage 1."
          ],
          application_fee: "₹0 (100% Free of cost)",
          processing_time: "15 to 25 Days",
          helpline: "1800-267-7777 / 17923 (MSME Helpdesk)"
        },
        official_url: "https://pmvishwakarma.gov.in"
      },
      {
        id: "sukanya_samriddhi",
        name: "Sukanya Samriddhi Yojana (Beti Bachao Beti Padhao)",
        name_hi: "सुकन्या समृद्धि योजना (बालिका समृद्धि एवं उच्च शिक्षा बचत)",
        ministry: "Ministry of Finance & MWCD",
        category: "Women & Children",
        benefit: "Government-backed 8.2% p.a. interest rate, triple tax exemption (EEE), maturity at age 21 with 50% partial withdrawal for higher education at age 18.",
        benefit_hi: "8.2% सुरक्षित सरकारी ब्याज दर, 80C कर छूट, तथा बालिका के 18 वर्ष का होने पर उच्च शिक्षा हेतु 50% निकासी।",
        required_documents: ["Birth Certificate of Girl Child", "Aadhaar / ID Proof of Guardian", "Address Proof", "Photographs"],
        how_to_apply: {
          online_portal: "NetBanking of authorized banks (SBI, PNB, IPPB, HDFC, ICICI)",
          online_steps: [
            "Log in to NetBanking/Mobile Banking app (SBI YONO, IPPB, etc.).",
            "Go to 'Government Schemes' -> 'Sukanya Samriddhi Account'.",
            "Enter child birth details and guardian KYC.",
            "Fund minimum ₹250 deposit and download e-Passbook."
          ],
          offline_route: "Any Post Office (India Post) or Authorized Commercial Bank Branch",
          offline_steps: [
            "Visit nearest Post Office or Bank Branch.",
            "Obtain Form-1 for Sukanya Samriddhi Account.",
            "Attach child birth certificate and guardian KYC copies.",
            "Deposit initial ₹250 and collect physical Passbook."
          ],
          application_fee: "₹0 (Initial minimum deposit ₹250 credited to account)",
          processing_time: "Same day opening",
          helpline: "1800-266-6868 (India Post Customer Care)"
        },
        official_url: "https://www.indiapost.gov.in"
      },
      {
        id: "atal_pension",
        name: "Atal Pension Yojana (APY - Guaranteed Social Security Pension)",
        name_hi: "अटल पेंशन योजना (APY - आजीवन गारंटीकृत मासिक पेंशन)",
        ministry: "PFRDA, Ministry of Finance",
        category: "Senior Citizens & Pension",
        benefit: "Guaranteed lifetime monthly pension of Rs 1,000 to Rs 5,000 after 60 years of age, continuing to spouse upon demise with corpus return to nominee.",
        benefit_hi: "60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह की आजीवन गारंटीकृत सरकारी पेंशन।",
        required_documents: ["Aadhaar Card", "Active Savings Bank Account with auto-debit consent", "Mobile Number"],
        how_to_apply: {
          online_portal: "Bank NetBanking or Protean e-NPS APY (npscra.nsdl.co.in)",
          online_steps: [
            "Log in to your Bank NetBanking portal.",
            "Navigate to 'Social Security Schemes' -> 'Atal Pension Yojana'.",
            "Choose monthly pension amount (₹1,000 to ₹5,000) and nominee.",
            "Authorize auto-debit and download PRAN confirmation."
          ],
          offline_route: "Your Home Bank Branch or Post Office where savings account is maintained",
          offline_steps: [
            "Visit your bank branch and ask for the APY Registration Form.",
            "Fill Account Number, Aadhaar, Nominee details.",
            "Sign auto-debit authorization and collect APY PRAN acknowledgement."
          ],
          application_fee: "₹0 (Only monthly age-linked contribution auto-debited)",
          processing_time: "Instant (PRAN generated in 24 hours)",
          helpline: "1800-110-069 (PFRDA Toll-Free)"
        },
        official_url: "https://www.npscra.nsdl.co.in"
      },
      {
        id: "pm_mudra",
        name: "Pradhan Mantri Mudra Yojana (PMMY - Micro Business Loans)",
        name_hi: "प्रधानमंत्री मुद्रा योजना (PMMY - सूक्ष्म उद्यम ऋण)",
        ministry: "Department of Financial Services, Ministry of Finance",
        category: "Financial & Legal Aid",
        benefit: "Collateral-free business loans: Shishu (Up to Rs 50,000), Kishore (Rs 50,000 to Rs 5 Lakhs), and Tarun (Rs 5 Lakhs to Rs 20 Lakhs).",
        benefit_hi: "व्यापार हेतु बिना गारंटी ऋण: शिशु (₹50,000 तक), किशोर (₹5 लाख तक) तथा तरुण (₹20 लाख तक)।",
        required_documents: ["Aadhaar / Voter ID / PAN Card", "Business Address Proof / Udyam Registration", "6 Months Bank Statement", "Quotation of items"],
        how_to_apply: {
          online_portal: "JanSamarth Portal (jansamarth.in) & Udyamimitra Portal (udyamimitra.in)",
          online_steps: [
            "Visit jansamarth.in -> 'Business Activity Loan' -> 'Check Eligibility'.",
            "Enter business category, required amount, and past revenue.",
            "Choose preferred lender bank and upload digital KYC.",
            "Get In-Principle Digital Approval Letter within 15 minutes."
          ],
          offline_route: "Any Commercial Bank, Regional Rural Bank (RRB), or Small Finance Bank Branch",
          offline_steps: [
            "Visit nearest commercial bank with business proposal.",
            "Fill out standard PMMY Loan Application Form (Shishu/Kishore/Tarun).",
            "Submit quotation of equipment/goods and 6-month bank statement.",
            "Bank officer inspects premises and sanctions loan within 7-14 days."
          ],
          application_fee: "₹0 for Shishu loans; nominal fee for Kishore/Tarun as per bank rules",
          processing_time: "7 to 15 Working Days",
          helpline: "1800-180-1111 / 1800-11-0001 (National Mudra Helpline)"
        },
        official_url: "https://www.mudra.org.in"
      },
      {
        id: "pmmvy",
        name: "Pradhan Mantri Matru Vandana Yojana (PMMVY - Maternity Benefit)",
        name_hi: "प्रधानमंत्री मातृ वंदना योजना (मातृत्व पोषण एवं आर्थिक सहायता)",
        ministry: "Ministry of Women and Child Development",
        category: "Women & Children",
        benefit: "Direct cash incentive of Rs 5,000 for 1st child and Rs 6,000 for 2nd girl child transferred directly to mother's bank account for nutrition support.",
        benefit_hi: "प्रथम प्रसव पर ₹5,000 तथा दूसरी बालिका के जन्म पर ₹6,000 की प्रत्यक्ष नकद सहायता माता के बैंक खाते में।",
        required_documents: ["Mother and Father Aadhaar Card", "MCP Card / RCH ID", "Aadhaar-seeded Bank Passbook", "Child Birth Certificate"],
        how_to_apply: {
          online_portal: "PMMVY Citizen Login Portal (pmmvy.wcd.gov.in)",
          online_steps: [
            "Visit pmmvy.wcd.gov.in and click 'Citizen Login'.",
            "Enter mobile number and verify via OTP.",
            "Fill Mother profile, LMP date, and ANC details from MCP card.",
            "Enter Aadhaar-seeded Bank Account and upload MCP card scan."
          ],
          offline_route: "Nearest Anganwadi Centre (AWC) or Primary Health Centre (PHC)",
          offline_steps: [
            "Visit your local Anganwadi Worker (AWW) or ASHA worker.",
            "Fill Form 1A upon pregnancy registration.",
            "Submit copies of MCP Card, Aadhaar, and Bank Passbook.",
            "Anganwadi worker logs application into the Poshan Tracker system."
          ],
          application_fee: "₹0 (100% Free Government Maternity Benefit)",
          processing_time: "15 to 30 Days (Direct DBT)",
          helpline: "011-23382393 / 181 (Women Helpline)"
        },
        official_url: "https://pmmvy.wcd.gov.in"
      },
      {
        id: "nsap_pension",
        name: "National Social Assistance Programme (NSAP - IGNOAPS / IGNWPS / IGNDPS)",
        name_hi: "राष्ट्रीय सामाजिक सहायता कार्यक्रम (वृद्धावस्था, विधवा एवं दिव्यांग पेंशन)",
        ministry: "Ministry of Rural Development",
        category: "Senior Citizens & Pension",
        benefit: "Monthly direct pension of Rs 1,000 to Rs 3,000 deposited directly into bank/post office accounts for BPL seniors, widows, and persons with disabilities.",
        benefit_hi: "बीपीएल परिवारों के 60+ वृद्धजनों, विधवाओं एवं 80%+ दिव्यांग नागरिकों को ₹1,000 से ₹3,000 प्रति माह की सीधी पेंशन।",
        required_documents: ["Aadhaar Card", "BPL Ration Card", "Age / Death / Disability Certificate", "Bank Passbook"],
        how_to_apply: {
          online_portal: "NSAP Portal (nsap.nic.in) or State e-District Portal",
          online_steps: [
            "Visit nsap.nic.in -> 'Apply Online' or your State e-District portal.",
            "Choose scheme (Old Age / Widow / Disability Pension).",
            "Enter BPL number, Aadhaar, and upload verification certificates.",
            "Submit and note down Application Tracking ID."
          ],
          offline_route: "BDO Office (Rural) or SDM / Municipal Social Welfare Office (Urban)",
          offline_steps: [
            "Collect Pension Form from Gram Panchayat or SDM office.",
            "Attach verified BPL copy, age proof, and bank passbook.",
            "Submit to Social Welfare Officer for field verification.",
            "Approval order issued and pension disbursed via monthly DBT."
          ],
          application_fee: "₹0 (100% Free of Cost)",
          processing_time: "30 to 45 Working Days",
          helpline: "1800-180-1551 (Social Welfare Helpline)"
        },
        official_url: "https://nsap.nic.in"
      },
      {
        id: "post_matric_scholarship",
        name: "Post-Matric Scholarship Scheme for SC / ST / OBC Students",
        name_hi: "पोस्ट-मैट्रिक छात्रवृत्ति योजना (एससी / एसटी / ओबीसी / अल्पसंख्यक छात्र)",
        ministry: "Ministry of Social Justice and Empowerment / Tribal Affairs",
        category: "Youth & Students",
        benefit: "100% Non-refundable tuition fee reimbursement plus monthly maintenance allowance credited directly via DBT.",
        benefit_hi: "11वीं, 12वीं, आईटीआई, डिप्लोमा, स्नातक एवं स्नातकोत्तर के छात्रों हेतु 100% शिक्षण शुल्क प्रतिपूर्ति एवं निर्वाह भत्ता।",
        required_documents: ["Aadhaar Card", "Caste Certificate", "Income Certificate (< Rs 2.5 Lakh)", "Marksheets", "Fee Receipt", "Bank Passbook"],
        how_to_apply: {
          online_portal: "National Scholarship Portal (NSP - scholarships.gov.in)",
          online_steps: [
            "Visit scholarships.gov.in and click 'New Registration' with OTR.",
            "Complete Face/Aadhaar authentication to generate your NSP OTR.",
            "Select Post-Matric Scholarship and enter Course/College code.",
            "Upload Caste, Income, and Fee Receipt documents and submit."
          ],
          offline_route: "Your College / University Nodal Scholarship Desk",
          offline_steps: [
            "Submit physical printout of online NSP application to College Scholarship Cell.",
            "Attach self-attested copies of Marksheet, Fee Receipt, and Caste Certificate.",
            "College Nodal Officer verifies enrollment in the portal.",
            "Funds disburse directly to student account via PFMS DBT."
          ],
          application_fee: "₹0 (100% Free)",
          processing_time: "30 to 45 Days from academic session verification",
          helpline: "0120-6619540 (NSP Helpdesk 24x7)"
        },
        official_url: "https://scholarships.gov.in"
      },
      {
        id: "janani_suraksha",
        name: "Janani Suraksha Yojana (JSY - Safe Motherhood Intervention)",
        name_hi: "जननी सुरक्षा योजना (सुरक्षित प्रसव एवं संस्थागत वित्तीय सहायता)",
        ministry: "Ministry of Health and Family Welfare (NHM)",
        category: "Women & Children",
        benefit: "Cash assistance of Rs 1,400 (Rural) or Rs 1,000 (Urban) for institutional delivery in government hospitals plus free diagnostics and medicines under JSSK.",
        benefit_hi: "शासकीय अस्पताल में सुरक्षित प्रसव कराने पर ₹1,400 (ग्रामीण) अथवा ₹1,000 (शहरी) की सीधी नकद सहायता।",
        required_documents: ["Aadhaar Card", "MCP Card / ANC Registration", "BPL / SC / ST Certificate", "Bank Passbook"],
        how_to_apply: {
          online_portal: "RCH Portal (nhm.gov.in)",
          online_steps: [
            "Automatically registered by ANM/ASHA during early ANC checkups.",
            "Track status on State Health Dashboard using RCH Mother ID."
          ],
          offline_route: "Primary Health Centre (PHC), Community Health Centre (CHC), or Civil Hospital",
          offline_steps: [
            "Register for Antenatal Care (ANC) at local Anganwadi/PHC.",
            "Admit at Government Hospital for institutional delivery.",
            "Submit Aadhaar, MCP Card, and Bank passbook at discharge desk.",
            "Cash incentive is credited before discharge or within 7 days."
          ],
          application_fee: "₹0 (100% Free + Free Medicines & Food)",
          processing_time: "At time of hospital discharge or within 7 Days",
          helpline: "104 (National Health Helpline) / 108 (Ambulance)"
        },
        official_url: "https://nhm.gov.in"
      },
      {
        id: "pm_suraksha_bima",
        name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY - Rs 20/year Accidental Cover)",
        name_hi: "प्रधानमंत्री सुरक्षा बीमा योजना (मात्र ₹20/वर्ष में ₹2 लाख दुर्घटना बीमा)",
        ministry: "Department of Financial Services, Ministry of Finance",
        category: "Healthcare & Insurance",
        benefit: "Accidental death cover of Rs 2,00,000 and disability cover of Rs 2,00,000 at an annual premium of just Rs 20 auto-debited once a year.",
        benefit_hi: "मात्र ₹20 प्रति वर्ष के प्रीमियम पर आकस्मिक मृत्यु अथवा दिव्यांगता होने पर ₹2 लाख का सरकारी दुर्घटना बीमा।",
        required_documents: ["Aadhaar Card", "Savings Bank Account Passbook", "Auto-debit Consent Form"],
        how_to_apply: {
          online_portal: "Bank Mobile Banking / NetBanking (SBI YONO, PNB One, BoB World, etc.)",
          online_steps: [
            "Open your Bank App or NetBanking.",
            "Select 'Insurance / Social Security Schemes' -> 'PMSBY'.",
            "Select Account Number, verify Aadhaar, and enter Nominee details.",
            "Authorize ₹20 auto-debit to get instant Certificate of Insurance."
          ],
          offline_route: "Any Bank Branch or Post Office where you have a Savings Account",
          offline_steps: [
            "Visit your bank branch or Business Correspondent (Bank Mitra).",
            "Fill the 1-page PMSBY Enrollment Form.",
            "Sign the auto-debit mandate and receive stamped receipt."
          ],
          application_fee: "₹20 / year (Auto-debited from savings account in May)",
          processing_time: "Instant (Active immediately upon deduction)",
          helpline: "1800-180-1111 / 1800-110-001 (Jan Suraksha Toll-Free)"
        },
        official_url: "https://www.jansuraksha.gov.in"
      }
    ];
  }
}

window.WelfareSchemesController = WelfareSchemesController;
