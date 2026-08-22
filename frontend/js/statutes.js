/**
 * NyayMitra Bharatiya Nyaya Sanhita (BNS) & IPC Statute Explorer
 */

class StatutesController {
  constructor() {
    this.statutes = [];
    this.currentCategory = 'All';
    this.searchQuery = '';
    
    this.initElements();
    this.bindEvents();
    this.loadStatutes();
  }

  initElements() {
    this.searchInput = document.getElementById('statutes-search-input');
    this.categoryFilterContainer = document.getElementById('statutes-category-filters');
    this.gridContainer = document.getElementById('statutes-grid');
    this.countDisplay = document.getElementById('statutes-count-badge');
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.filterAndRender();
      });
    }
  }

  async loadStatutes() {
    try {
      const data = await window.NyayMitraAPI.getStatutes();
      if (data && data.statutes) {
        this.statutes = data.statutes;
        this.renderCategoryFilters(data.categories || ['All']);
        this.filterAndRender();
      }
    } catch (err) {
      console.error('Failed to load statutes:', err);
    }
  }

  renderCategoryFilters(categories) {
    if (!this.categoryFilterContainer) return;
    
    this.categoryFilterContainer.innerHTML = categories.map(cat => {
      const isActive = cat === this.currentCategory;
      return `
        <button 
          class="statute-cat-btn px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
            isActive 
              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }"
          data-category="${cat}"
        >
          ${cat}
        </button>
      `;
    }).join('');

    this.categoryFilterContainer.querySelectorAll('.statute-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.getAttribute('data-category');
        this.renderCategoryFilters(categories);
        this.filterAndRender();
      });
    });
  }

  filterAndRender() {
    const q = this.searchQuery.toLowerCase().trim();
    let filtered = this.statutes;

    if (this.currentCategory !== 'All') {
      filtered = filtered.filter(s => s.category === this.currentCategory);
    }

    if (q) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.bns_section.toLowerCase().includes(q) ||
        s.ipc_section.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    if (this.countDisplay) {
      this.countDisplay.textContent = `${filtered.length} Sections Indexed`;
    }

    this.renderGrid(filtered);
  }

  renderGrid(items) {
    if (!this.gridContainer) return;

    if (items.length === 0) {
      this.gridContainer.innerHTML = `
        <div class="col-span-full text-center py-12 glass-panel bg-white border border-slate-200 rounded-2xl">
          <i data-lucide="search-x" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
          <h3 class="text-base font-semibold text-slate-800">No matching statutes found</h3>
          <p class="text-xs text-slate-500 mt-1">Try searching by Section number (e.g. "420", "302") or offences like "Theft", "Cheating", "Hit and Run".</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.gridContainer.innerHTML = items.map(s => {
      const isNonBailable = s.bailable.toLowerCase().includes('non-bailable');
      const isCognizable = s.cognizable.toLowerCase().includes('cognizable') && !s.cognizable.toLowerCase().includes('non-cognizable');

      return `
        <div class="glass-panel-interactive p-5 flex flex-col justify-between rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
          <div>
            <!-- Header section badge & IPC mapping -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                BNS Sec ${s.bns_section}
              </span>
              <span class="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ${s.ipc_reference}
              </span>
            </div>

            <!-- Title & Category -->
            <h3 class="text-base font-bold text-slate-900 mb-1 leading-snug font-heading">${s.title}</h3>
            <p class="text-xs text-blue-700 font-semibold mb-2.5">${s.category}</p>

            <!-- Legal summary -->
            <p class="text-xs text-slate-600 mb-4 leading-relaxed">${s.summary}</p>

            <!-- Legal Tags Matrix -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-3.5">
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span class="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Bail Status</span>
                <span class="font-bold text-xs ${isNonBailable ? 'text-rose-600' : 'text-emerald-600'}">
                  ${s.bailable}
                </span>
              </div>
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span class="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Cognizance</span>
                <span class="font-bold text-xs ${isCognizable ? 'text-amber-700' : 'text-blue-700'}">
                  ${s.cognizable}
                </span>
              </div>
            </div>

            <!-- Punishment & Court -->
            <div class="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
              <div class="flex items-start gap-1.5">
                <i data-lucide="gavel" class="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5"></i>
                <div><strong class="text-slate-900">Punishment:</strong> ${s.punishment}</div>
              </div>
              <div class="flex items-start gap-1.5">
                <i data-lucide="landmark" class="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5"></i>
                <div><strong class="text-slate-900">Trial Court:</strong> ${s.court}</div>
              </div>
            </div>
          </div>

          <!-- Key changes banner -->
          <div class="pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            <strong class="text-blue-700 font-semibold">Key Reform:</strong> ${s.key_changes}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.StatutesController = StatutesController;
