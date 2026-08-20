/**
 * NyayMitra Citizen Rights & Emergency SOS Directory
 */

class CitizenRightsController {
  constructor() {
    this.guides = [];
    this.helplines = [];
    
    this.initElements();
    this.loadData();
  }

  initElements() {
    this.guidesContainer = document.getElementById('rights-guides-grid');
    this.helplinesContainer = document.getElementById('emergency-helplines-grid');
  }

  async loadData() {
    try {
      const data = await window.NyayMitraAPI.getCitizenRights();
      if (data) {
        this.guides = data.guides || [];
        this.helplines = data.helplines || [];
        this.renderHelplines();
        this.renderGuides();
      }
    } catch (err) {
      console.error('Failed to load rights data:', err);
    }
  }

  renderHelplines() {
    if (!this.helplinesContainer) return;

    this.helplinesContainer.innerHTML = this.helplines.map(h => {
      return `
        <div class="glass-panel p-4 flex items-center justify-between gap-3 border-amber-500/20 hover:border-amber-500/50 transition-all">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 uppercase">${h.category}</span>
              <span class="text-xs text-slate-400 font-mono">${h.hours}</span>
            </div>
            <h4 class="font-bold text-sm text-slate-100">${h.service}</h4>
            <p class="text-xs text-slate-400 line-clamp-2">${h.description}</p>
          </div>
          <a 
            href="tel:${h.number.replace(/[^0-9]/g, '')}" 
            class="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <i data-lucide="phone-call" class="w-4 h-4"></i>
            <span>${h.number}</span>
          </a>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  renderGuides() {
    if (!this.guidesContainer) return;

    this.guidesContainer.innerHTML = this.guides.map(g => {
      return `
        <div class="glass-panel p-6 space-y-4">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ${g.category}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-100 flex items-center gap-2">
            <i data-lucide="shield-check" class="w-5 h-5 text-amber-400"></i>
            ${g.title}
          </h3>

          <ul class="space-y-2.5 text-xs text-slate-300">
            ${g.points.map(pt => `
              <li class="flex items-start gap-2">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5"></i>
                <span class="leading-relaxed">${pt}</span>
              </li>
            `).join('')}
          </ul>

          <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <strong class="text-amber-300 font-semibold">Pro Citizen Tip:</strong> ${g.tips}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.CitizenRightsController = CitizenRightsController;
