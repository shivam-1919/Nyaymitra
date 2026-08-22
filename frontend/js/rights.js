/**
 * NyayMitra Citizen Rights & Emergency SOS Directory
 */

class CitizenRightsController {
  constructor() {
    this.guides = [];
    this.helplines = [];
    
    this.initElements();
    this.loadData();

    if (window.i18n) {
      window.i18n.onLanguageChange(() => {
        this.renderHelplines();
        this.renderGuides();
      });
    }
  }

  initElements() {
    this.guidesContainer = document.getElementById('rights-guides-grid');
    this.helplinesContainer = document.getElementById('emergency-helplines-grid');
  }

  async loadData() {
    try {
      const data = await window.NyayMitraAPI.getCitizenRights();
      if (data && (data.helplines || data.guides)) {
        this.guides = data.guides || [];
        this.helplines = data.helplines || [];
      } else {
        this.loadFallbackData();
      }
    } catch (err) {
      console.warn('Failed to load rights data from backend, using offline catalog:', err);
      this.loadFallbackData();
    }
    this.renderHelplines();
    this.renderGuides();
  }

  loadFallbackData() {
    this.helplines = [
      {
        "service": "Pan-India Emergency SOS (Police / Fire / Ambulance)",
        "number": "112",
        "category": "Police & Emergency",
        "hours": "24x7 Universal Helpline",
        "description": "Integrated National Emergency Response Support System (ERSS) for immediate police, fire, and medical emergency assistance."
      },
      {
        "service": "National Cyber Crime Reporting & Financial Fraud (Golden Hour)",
        "number": "1930",
        "category": "Cyber & UPI Fraud",
        "hours": "24x7 Citizen Cyber Helpline",
        "description": "Immediate helpline to freeze recipient mule bank accounts and report unauthorized UPI, net banking, OTP, and debit card frauds."
      },
      {
        "service": "National Legal Services Authority (NALSA) 100% Free Legal Aid",
        "number": "15100",
        "category": "Free Advocate & Legal Aid",
        "hours": "24x7 Toll-Free Access to Justice",
        "description": "Statutory legal aid for all women, children, SC/ST, custody undertrials, and low-income citizens with free government lawyer assignment."
      },
      {
        "service": "National Consumer Helpline (NCH - Consumer Redressal)",
        "number": "1915",
        "category": "Consumer Complaints",
        "hours": "08:00 AM - 08:00 PM (Mon-Sat)",
        "description": "Direct grievance registration against e-commerce sellers, warranty denials, defective goods, and telecom/banking deficiencies."
      },
      {
        "service": "Women in Distress & Domestic Violence Emergency",
        "number": "181",
        "category": "Women Safety",
        "hours": "24x7 Toll-Free",
        "description": "Emergency response, counseling, police protection, and shelter home linkage for women facing violence or harassment."
      },
      {
        "service": "Childline India (Ministry of Women and Child Development)",
        "number": "1098",
        "category": "Child Protection",
        "hours": "24x7 Toll-Free",
        "description": "Emergency helpline for child protection, rescue from child labour, abuse prevention, and legal care."
      }
    ];

    this.guides = [
      {
        "title": "Arrest, Detention & Police Guidelines (D.K. Basu Judgment)",
        "category": "Criminal Law & Constitutional Rights",
        "points": [
          "Right to know the specific and clear grounds of arrest in writing (Article 22(1)).",
          "Police must prepare a formal Arrest Memo countersigned by a family member or respected community witness.",
          "Right to inform one family member or friend within 8-12 hours of arrest.",
          "Right to meet and consult an enrolled advocate during interrogation.",
          "Mandatory medical examination by trained doctor every 48 hours in custody.",
          "Police MUST present the arrested person before a Judicial Magistrate within 24 hours (excluding transit time)."
        ],
        "tips": "Always note down the name badge and designation of the arresting officer. Under Section 46(4) CrPC / BNSS, women cannot be arrested after sunset and before sunrise except in extraordinary circumstances with a female officer."
      },
      {
        "title": "Consumer Protection Rights (Consumer Protection Act, 2019)",
        "category": "Consumer Rights & E-Commerce",
        "points": [
          "Right to be protected against unfair trade practices and misleading advertisements.",
          "Right to seek replacement, full refund, or compensation for defective goods or deficient services.",
          "E-commerce platforms are legally prohibited from unfair cancellation charges and must provide transparent grievance redressal within 48 hours.",
          "File complaints online via E-Daakhil portal without mandatory physical presence."
        ],
        "tips": "Send a formal 15-day statutory pre-litigation notice before filing a case in District Consumer Commission. This resolves 80%+ disputes without court fees."
      }
    ];
  }

  renderHelplines() {
    if (!this.helplinesContainer) return;

    this.helplinesContainer.innerHTML = this.helplines.map(h => {
      return `
        <div class="glass-panel-interactive p-4 flex items-center justify-between gap-3 rounded-xl bg-white border border-slate-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-red-50 text-red-700 border border-red-200 uppercase font-mono">${h.category}</span>
              <span class="text-[11px] text-slate-500 font-mono">${h.hours}</span>
            </div>
            <h4 class="font-bold text-sm text-slate-900 font-heading">${h.service}</h4>
            <p class="text-xs text-slate-600 line-clamp-2">${h.description}</p>
          </div>
          <a 
            href="tel:${h.number.replace(/[^0-9]/g, '')}" 
            class="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-sm"
          >
            <i data-lucide="phone-call" class="w-4 h-4"></i>
            <span class="font-mono font-bold">${h.number}</span>
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
        <div class="glass-panel p-6 space-y-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="stamp-badge stamp-badge-blue">
              ${g.category}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
            <i data-lucide="shield-check" class="w-5 h-5 text-blue-600"></i>
            ${g.title}
          </h3>

          <ul class="space-y-2.5 text-xs text-slate-700">
            ${g.points.map(pt => `
              <li class="flex items-start gap-2">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5"></i>
                <span class="leading-relaxed text-slate-600">${pt}</span>
              </li>
            `).join('')}
          </ul>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong class="text-blue-700 font-bold block mb-0.5 font-sans text-[11px] uppercase tracking-wider">Citizen Procedure Note:</strong> ${g.tips}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.CitizenRightsController = CitizenRightsController;
