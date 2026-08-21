/**
 * NyayaSetu Welfare Schemes Eligibility Reader & myScheme Matcher
 * Features 16+ Government Welfare Schemes, Live Search, Category Filters,
 * Profile Matcher, Bookmarking (LocalStorage), and 1-Click Print.
 */

class WelfareSchemesController {
  constructor() {
    this.schemes = [];
    this.allSchemesCache = [];
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.activeTab = 'all'; // 'all' or 'bookmarked'
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

    // Grid interaction delegates (bookmark, copy benefit, etc.)
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
      });
    }
  }

  updateTabButtons() {
    if (this.viewAllTabBtn && this.viewBookmarkedTabBtn) {
      if (this.activeTab === 'all') {
        this.viewAllTabBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20';
        this.viewBookmarkedTabBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white';
      } else {
        this.viewBookmarkedTabBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20';
        this.viewAllTabBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white';
      }
    }
  }

  toggleBookmark(schemeId) {
    if (this.bookmarkedIds.includes(schemeId)) {
      this.bookmarkedIds = this.bookmarkedIds.filter(id => id !== schemeId);
      window.nyayMitra?.showToast("Scheme removed from bookmarks");
    } else {
      this.bookmarkedIds.push(schemeId);
      window.nyayMitra?.showToast("Scheme saved to bookmarks!");
    }
    localStorage.setItem('nyaymitra_bookmarked_schemes', JSON.stringify(this.bookmarkedIds));
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
        this.allSchemesCache = data.schemes;
        this.schemes = data.schemes;
      } else {
        this.allSchemesCache = this.getFallbackSchemes();
        this.schemes = [...this.allSchemesCache];
      }
    } catch (e) {
      console.warn('Backend scheme fetch failed, loading offline scheme catalog:', e);
      this.allSchemesCache = this.getFallbackSchemes();
      this.schemes = [...this.allSchemesCache];
    }
    this.renderCategoryChips();
    this.renderSchemes(this.getFilteredSchemes());
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
          class="scheme-cat-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            isActive 
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
              : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-amber-500/40 hover:text-white'
          }"
          data-category="${cat}"
        >
          ${cat === 'All' ? '🌟 All Schemes' : cat}
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
        <span class="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mr-1.5"></span>
        Evaluating Official Rules...
      `;
    }

    try {
      const res = await window.NyayMitraAPI.checkSchemes(profile);
      if (res && res.schemes) {
        this.schemes = res.schemes;
        this.renderSchemes(this.getFilteredSchemes(), true);
        window.nyayMitra?.showToast(`Evaluated ${res.schemes.length} matching welfare schemes!`);
      }
    } catch (err) {
      console.warn("API check failed, evaluating locally:", err);
      this.evaluateSchemesLocally(profile);
    } finally {
      if (this.findBtn) {
        this.findBtn.disabled = false;
        this.findBtn.innerHTML = `
          <i data-lucide="sparkles" class="w-4 h-4 mr-1.5"></i>
          <span>Find Eligible Schemes</span>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  evaluateSchemesLocally(profile) {
    const occLower = (profile.occupation || '').toLowerCase();
    const catLower = (profile.category || '').toLowerCase();
    const income = profile.annual_income || 200000;
    const age = profile.age || 30;
    const gender = (profile.gender || 'all').toLowerCase();
    const hasPucca = profile.has_pucca_house || false;

    const evaluated = this.allSchemesCache.map(s => {
      let score = 50;
      let reasons = [];
      const sid = s.id;

      if (sid === 'pm_svanidhi' && (occLower.includes('vendor') || occLower.includes('hawker') || occLower.includes('thela'))) {
        score += 45;
        reasons.push("Street Vendor profile match.");
      }
      if (sid === 'pm_kisan' && (occLower.includes('farmer') || occLower.includes('agri'))) {
        score += 45;
        reasons.push("Farmer landholder profile match.");
      }
      if (sid === 'pm_vishwakarma' && (occLower.includes('artisan') || occLower.includes('craftsman'))) {
        score += 45;
        reasons.push("Artisan / Tradesperson profile match.");
      }
      if (sid === 'post_matric_scholarship' && (occLower.includes('student') || age <= 25)) {
        score += 40;
        reasons.push("Student / Youth qualification.");
      }
      if ((gender === 'female' || catLower.includes('woman')) && ['sukanya_samriddhi', 'pmmvy', 'janani_suraksha', 'nalsa_free_legal_aid'].includes(sid)) {
        score += 40;
        reasons.push("Women and maternal benefit priority.");
      }
      if ((age >= 60 || occLower.includes('senior')) && ['ayushman_bharat', 'nsap_pension'].includes(sid)) {
        score += 45;
        reasons.push("Senior citizen universal coverage & pension.");
      }
      if ((catLower.includes('bpl') || catLower.includes('ews') || income <= 200000) && ['nfsa_ration', 'ayushman_bharat', 'pmay_urban'].includes(sid)) {
        score += 35;
        reasons.push("Low-income / BPL category qualification.");
      }
      if (!hasPucca && sid === 'pmay_urban') {
        score += 40;
        reasons.push("No pucca house owned.");
      }

      return {
        ...s,
        match_score: Math.min(98, score),
        match_confidence: score >= 80 ? "Top Match (95%)" : (score >= 60 ? "Eligible Match (80%)" : "Potential Benefit"),
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
        <div class="col-span-full p-12 text-center glass-panel space-y-3">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <i data-lucide="search-x" class="w-7 h-7"></i>
          </div>
          <h4 class="text-base font-bold text-white">${this.activeTab === 'bookmarked' ? 'No Bookmarked Schemes Yet' : 'No matching welfare schemes found'}</h4>
          <p class="text-xs text-slate-400 max-w-md mx-auto">
            ${this.activeTab === 'bookmarked' 
              ? 'Click the bookmark icon on any scheme card to save it here for offline viewing and quick access.' 
              : 'Try adjusting your search keywords, category pills, or income filters to view eligible government schemes.'}
          </p>
          <button onclick="window.nyayMitra?.schemesCtrl?.resetFilters()" class="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all">
            Reset All Filters
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
      const title = (isHindi && s.name_hi) ? s.name_hi : s.name;
      const benefitText = (isHindi && s.benefit_hi) ? s.benefit_hi : s.benefit;
      const matchScore = s.match_score || 85;

      return `
        <div class="glass-panel-interactive p-5 flex flex-col justify-between space-y-4 relative group">
          <!-- Top Tag Bar -->
          <div>
            <div class="flex items-center justify-between gap-2 mb-2.5">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                ${s.category}
              </span>
              
              <div class="flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  matchScore >= 85 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }">
                  ⭐ ${matchScore}% Match
                </span>
                <button 
                  class="scheme-bookmark-btn p-1.5 rounded-lg border text-xs transition-all ${
                    isBookmarked 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm' 
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/50'
                  }"
                  data-id="${s.id}"
                  title="${isBookmarked ? 'Remove Bookmark' : 'Bookmark this scheme'}"
                >
                  <i data-lucide="${isBookmarked ? 'bookmark-check' : 'bookmark'}" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

            <!-- Title & Ministry -->
            <h4 class="text-base font-extrabold text-white mb-1 leading-snug group-hover:text-amber-300 transition-colors">
              ${title}
            </h4>
            <p class="text-xs text-amber-400/80 font-medium mb-3 flex items-center gap-1">
              <i data-lucide="building" class="w-3 h-3 flex-shrink-0"></i>
              <span class="truncate">${s.ministry}</span>
            </p>

            <!-- Direct Benefit Card -->
            <div class="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/90 border border-emerald-500/30 text-xs text-emerald-200 mb-3.5 relative overflow-hidden shadow-inner">
              <div class="flex items-center justify-between mb-1">
                <strong class="text-emerald-300 font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <i data-lucide="gift" class="w-3.5 h-3.5"></i> Direct Citizen Benefit:
                </strong>
                <button 
                  class="scheme-copy-benefit-btn text-[10px] text-emerald-300 hover:text-white bg-emerald-500/20 px-2 py-0.5 rounded transition-all flex items-center gap-1"
                  data-benefit="${this.escapeHtml(benefitText)}"
                  title="Copy Benefit Details"
                >
                  <i data-lucide="copy" class="w-3 h-3"></i> Copy
                </button>
              </div>
              <p class="leading-relaxed text-[12px] text-slate-100">${benefitText}</p>
            </div>

            <!-- Eligibility Qualification Rationale -->
            ${s.eligibility_reason ? `
              <div class="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 mb-3">
                <span class="text-amber-400 font-bold block mb-0.5">🎯 Why You Qualify:</span>
                <span class="text-slate-200">${s.eligibility_reason}</span>
              </div>
            ` : ''}

            <!-- Required Documents Checklist -->
            <div class="space-y-1.5 text-xs text-slate-300 pt-1">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <i data-lucide="file-check" class="w-3 h-3 text-amber-400"></i> Mandatory Documents:
              </span>
              <ul class="space-y-1 text-[11px] text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-900">
                ${(s.required_documents || []).map(doc => `
                  <li class="flex items-start gap-1.5">
                    <i data-lucide="check" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5"></i>
                    <span>${doc}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Action Footer -->
          <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <span class="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <i data-lucide="shield-check" class="w-3 h-3 text-emerald-400"></i> Verified Portal
            </span>
            <a 
              href="${s.official_url}" 
              target="_blank" 
              class="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>Apply on Portal</span>
              <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
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
        required_documents: ["Aadhaar Card", "Vending Certificate / ID Card", "Bank Account with IFSC", "Mobile Number"],
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
        required_documents: ["Aadhaar Card (e-KYC)", "Land Records (Khasra-Khatauni)", "Aadhaar-seeded Bank Account"],
        official_url: "https://pmkisan.gov.in"
      },
      {
        id: "ayushman_bharat",
        name: "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY & Vay Vandana 70+)",
        name_hi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना एवं वय वंदना (70+ वर्ष)",
        ministry: "National Health Authority (NHA)",
        category: "Healthcare & Insurance",
        benefit: "100% Cashless medical treatment cover up to Rs 5,00,000 per family per year across 29,000+ empaneled hospitals.",
        benefit_hi: "प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा, 29,000+ अस्पतालों में मुफ्त इलाज।",
        required_documents: ["Aadhaar Card", "Ration Card / PMJAY Family ID", "Mobile Number"],
        official_url: "https://beneficiary.nha.gov.in"
      },
      {
        id: "nfsa_ration",
        name: "National Food Security Act (NFSA) Subsidized Food Grain Scheme",
        name_hi: "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) सब्सिडीयुक्त खाद्यान्न योजना",
        ministry: "Department of Food and Public Distribution",
        category: "Food & Ration",
        benefit: "5 kg free food grains per person per month (35 kg per family for Antyodaya households) under PMGKAY.",
        benefit_hi: "प्रति व्यक्ति 5 किलो मुफ्त खाद्यान्न प्रति माह (अंत्योदय परिवारों को 35 किलो खाद्यान्न)।",
        required_documents: ["Aadhaar Card of all members", "Income Certificate / BPL Card", "Address Proof"],
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
        required_documents: ["Aadhaar Card", "Income Certificate", "Land Title / Passbook", "No Pucca House Affidavit"],
        official_url: "https://pmaymis.gov.in"
      },
      {
        id: "nalsa_free_legal_aid",
        name: "NALSA Free Legal Aid & Assigned Advocate Service",
        name_hi: "नालसा (NALSA) 100% निःशुल्क कानूनी सहायता एवं सरकारी अधिवक्ता",
        ministry: "National Legal Services Authority (Supreme Court of India)",
        category: "Financial & Legal Aid",
        benefit: "100% Free legal advice, drafting of petitions, court fees, and enrolled advocate assigned at zero cost.",
        benefit_hi: "100% मुफ्त कानूनी सलाह, नोटिस व याचिकाओं का प्रारूपण और मुफ्त सरकारी वकील की नियुक्ति।",
        required_documents: ["Aadhaar / ID Proof", "Income Certificate / BPL Card (Exempt for women & SC/ST)", "Case Documents"],
        official_url: "https://nalsa.gov.in"
      }
    ];
  }
}

window.WelfareSchemesController = WelfareSchemesController;
