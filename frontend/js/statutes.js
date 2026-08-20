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
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20' 
              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
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
        <div class="col-span-full text-center py-12 glass-panel">
          <i data-lucide="search-x" class="w-12 h-12 text-slate-500 mx-auto mb-3"></i>
          <h3 class="text-base font-semibold text-slate-300">No matching statutes found</h3>
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
        <div class="glass-panel-interactive p-5 flex flex-col justify-between">
          <div>
            <!-- Header section badge & IPC mapping -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                BNS Sec ${s.bns_section}
              </span>
              <span class="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                ${s.ipc_reference}
              </span>
            </div>

            <!-- Title & Category -->
            <h3 class="text-base font-bold text-slate-100 mb-1 leading-snug">${s.title}</h3>
            <p class="text-xs text-amber-500/80 font-medium mb-3">${s.category}</p>

            <!-- Legal summary -->
            <p class="text-xs text-slate-300 mb-4 leading-relaxed">${s.summary}</p>

            <!-- Legal Tags Matrix -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-4">
              <div class="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                <span class="text-[10px] text-slate-500 block uppercase tracking-wider">Bail Status</span>
                <span class="font-semibold ${isNonBailable ? 'text-rose-400' : 'text-emerald-400'}">
                  ${s.bailable}
                </span>
              </div>
              <div class="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                <span class="text-[10px] text-slate-500 block uppercase tracking-wider">Cognizance</span>
                <span class="font-semibold ${isCognizable ? 'text-amber-400' : 'text-cyan-400'}">
                  ${s.cognizable}
                </span>
              </div>
            </div>

            <!-- Punishment & Court -->
            <div class="space-y-1.5 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/50 mb-3">
              <div class="flex items-start gap-1.5">
                <i data-lucide="gavel" class="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5"></i>
                <div><strong class="text-slate-200">Punishment:</strong> ${s.punishment}</div>
              </div>
              <div class="flex items-start gap-1.5">
                <i data-lucide="landmark" class="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5"></i>
                <div><strong class="text-slate-200">Trial Court:</strong> ${s.court}</div>
              </div>
            </div>
          </div>

          <!-- Key changes banner -->
          <div class="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <strong class="text-amber-400/90 font-semibold">Key Reform:</strong> ${s.key_changes}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.StatutesController = StatutesController;
