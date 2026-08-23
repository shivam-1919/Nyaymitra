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
        this.loadFallbackData();
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
    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');

    if (isHindi) {
      this.helplines = [
        {
          "service": "अखिल भारतीय आपातकालीन हेल्पलाइन (पुलिस / अग्निशमन / एम्बुलेंस)",
          "number": "112",
          "category": "आपातकालीन सेवा",
          "hours": "24x7 सार्वभौमिक हेल्पलाइन",
          "description": "पुलिस, अग्निशमन और चिकित्सा आपात स्थिति में त्वरित सहायता हेतु एकीकृत राष्ट्रीय आपातकालीन प्रणाली।"
        },
        {
          "service": "राष्ट्रीय साइबर अपराध एवं वित्तीय धोखाधड़ी रिपोर्टिंग (गोल्डन ऑवर)",
          "number": "1930",
          "category": "साइबर एवं UPI फ्रॉड",
          "hours": "24x7 नागरिक साइबर हेल्पलाइन",
          "description": "अनधिकृत UPI, नेट बैंकिंग और कार्ड फ्रॉड की स्थिति में तुरंत राशि रोकने और खाता फ्रीज करने हेतु।"
        },
        {
          "service": "राष्ट्रीय कानूनी सेवा प्राधिकरण (NALSA) 100% निःशुल्क कानूनी सहायता",
          "number": "15100",
          "category": "निःशुल्क वकील व विधिक सहायता",
          "hours": "24x7 टोल-फ्री न्याय सेवा",
          "description": "महिलाओं, बच्चों, अनुसूचित जाति/जनजाति और कम आय वाले नागरिकों के लिए मुफ्त सरकारी वकील आवंटन।"
        },
        {
          "service": "राष्ट्रीय उपभोक्ता हेल्पलाइन (NCH - उपभोक्ता निवारण)",
          "number": "1915",
          "category": "उपभोक्ता शिकायत",
          "hours": "सुबह 08:00 - रात 08:00 (सोम-शनि)",
          "description": "ई-कॉमर्स, वारंटी विवाद, दोषपूर्ण सामान और सेवा में कमी के खिलाफ सीधी शिकायत दर्ज करें।"
        },
        {
          "service": "संकटग्रस्त महिलाओं हेतु आपातकालीन हेल्पलाइन एवं घरेलू हिंसा निवारण",
          "number": "181",
          "category": "महिला सुरक्षा",
          "hours": "24x7 टोल-फ्री",
          "description": "उत्पीड़न या हिंसा का सामना कर रही महिलाओं के लिए आपातकालीन पुलिस सुरक्षा, परामर्श और आश्रय।"
        },
        {
          "service": "चाइल्डलाइन इंडिया (महिला एवं बाल विकास मंत्रालय)",
          "number": "1098",
          "category": "बाल संरक्षण",
          "hours": "24x7 टोल-फ्री",
          "description": "बच्चों की सुरक्षा, बाल श्रम से बचाव, दुर्व्यवहार रोकथाम एवं विधिक देखभाल हेतु समर्पित हेल्पलाइन।"
        }
      ];

      this.guides = [
        {
          "title": "गिरफ्तारी, हिरासत एवं पुलिस दिशानिर्देश (डी.के. बसु ऐतिहासिक निर्णय)",
          "category": "आपराधिक कानून एवं संवैधानिक अधिकार",
          "points": [
            "लिखित में गिरफ्तारी के विशिष्ट और स्पष्ट कारणों को जानने का मौलिक अधिकार (अनुच्छेद 22(1))।",
            "पुलिस द्वारा औपचारिक अरेस्ट मेमो तैयार करना अनिवार्य है, जिस पर परिवार या सम्मानित गवाह के हस्ताक्षर हों।",
            "गिरफ्तारी के 8-12 घंटे के भीतर परिवार के किसी सदस्य या मित्र को सूचित करने का अधिकार।",
            "पूछताछ के दौरान अपने पंजीकृत वकील से मिलने और परामर्श करने का अधिकार।",
            "हिरासत के दौरान हर 48 घंटे में प्रशिक्षित डॉक्टर द्वारा अनिवार्य स्वास्थ्य परीक्षण।",
            "पुलिस द्वारा गिरफ्तार व्यक्ति को 24 घंटे के भीतर (यात्रा समय छोड़कर) मजिस्ट्रेट के समक्ष पेश करना अनिवार्य।"
          ],
          "tips": "हमेशा गिरफ्तार करने वाले अधिकारी का नाम और पदनाम नोट करें। BNSS धारा 46(4) के तहत महिला को सूर्यास्त के बाद और सूर्योदय से पहले असाधारण परिस्थितियों के बिना गिरफ्तार नहीं किया जा सकता।"
        },
        {
          "title": "उपभोक्ता संरक्षण अधिकार (उपभोक्ता संरक्षण अधिनियम, 2019)",
          "category": "उपभोक्ता अधिकार एवं ई-कॉमर्स",
          "points": [
            "अनुचित व्यापार व्यवहार और भ्रामक विज्ञापनों से सुरक्षा का कानूनी अधिकार।",
            "दोषपूर्ण सामान या सेवा में कमी के लिए सामान बदलने, पूर्ण वापसी या मुआवजे की मांग का अधिकार।",
            "ई-कॉमर्स कंपनियों पर अनुचित कैंसिलेशन शुल्क लगाना प्रतिबंधित है और 48 घंटे में शिकायत निवारण अनिवार्य है।",
            "शारीरिक उपस्थिति के बिना ई-दाखिल (E-Daakhil) पोर्टल के माध्यम से ऑनलाइन शिकायत दर्ज करें।"
          ],
          "tips": "जिला उपभोक्ता आयोग में वाद दायर करने से पहले 15 दिन का कानूनी मांग नोटिस (Pre-litigation Notice) भेजें। इससे 80% से अधिक मामले बिना कोर्ट फीस के सुलझ जाते हैं।"
        }
      ];
    } else {
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

    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');
    const noteLabel = isHindi ? "नागरिक प्रक्रिया निर्देश:" : "Citizen Procedure Note:";

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
            <strong class="text-blue-700 font-bold block mb-0.5 font-sans text-[11px] uppercase tracking-wider">${noteLabel}</strong> ${g.tips}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.CitizenRightsController = CitizenRightsController;
