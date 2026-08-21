/**
 * NyayMitra Comprehensive Multilingual (i18n) Engine
 * Supports 8 Indian Languages: English, Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, Gujarati.
 */

const I18N_TRANSLATIONS = {
  English: {
    // Brand & Header
    "brand.name": "NyayaSetu",
    "brand.tagline": "AI Civic-Rights Navigator & Evidence Action Packs",
    "nav.nyayasetu": "NyayaSetu Navigator",
    "nav.chat": "AI Legal Advisor",
    "nav.drafter": "Drafting Studio",
    "nav.schemes": "Welfare Schemes",
    "nav.analyzer": "Document Scanner",
    "nav.statutes": "BNS / IPC Statutes",
    "nav.rights": "Rights & SOS",
    "btn.sos": "SOS 1930 / 15100",
    "theme.day": "Switch to Day Mode",
    "theme.night": "Switch to Night Mode",

    // NyayaSetu Navigator
    "nyayasetu.badge": "Evidence-Backed Civic Action System",
    "nyayasetu.title": "NyayaSetu (न्यायसेतु) Civic Rights Navigator",
    "nyayasetu.subtitle": "Convert everyday citizen grievances into verified, records-based RTI applications, official grievance representations, and statutory first appeals — grounded in official rules without replacing lawyers.",
    "nyayasetu.step1": "Describe Problem",
    "nyayasetu.step2": "Questionnaire",
    "nyayasetu.step3": "Rights & Authority",
    "nyayasetu.step4": "Action Pack",
    "nyayasetu.step5": "Case Tracker",
    "nyayasetu.step1.heading": "Step 1: Describe your civic grievance or problem in plain language",
    "nyayasetu.step1.subheading": "Explain what happened, what department or service is delayed, or click one of the verified demo scenarios below.",
    "nyayasetu.step1.placeholder": "e.g. 'Why has my street not been repaired even though the councillor promised it?' or 'My ration-card application has been pending for three months without any update'...",
    "nyayasetu.step1.demos": "⚡ Try High-Impact Demo Scenarios:",
    "nyayasetu.demo.road": "🚧 Road Repair & Work Order Delay",
    "nyayasetu.demo.ration": "🍚 Ration Card (NFSA) 3-Month Delay",
    "nyayasetu.demo.vendor": "🛒 Street Vendor Licence 60-Day Delay",
    "nyayasetu.demo.rent": "🏠 Withheld Rent Security Deposit",
    "nyayasetu.btn.start": "Start Guided Action Plan",
    "nyayasetu.btn.back": "← Back",
    "nyayasetu.btn.next_rights": "View Rights & Authority Summary",
    "nyayasetu.btn.gen_action_pack": "Generate Complete Action Pack",
    "nyayasetu.ap.title": "Action Pack & Records-Based RTI Application",
    "nyayasetu.ap.subtitle": "Form-ready discoverable records drafts, attachment checklists, and statutory follow-up timeline.",
    "nyayasetu.btn.copy_rti": "Copy RTI",
    "nyayasetu.btn.download_pdf": "Download Action Pack PDF",
    "nyayasetu.btn.track_case": "Track This Case",

    // AI Legal Advisor (Chat)
    "chat.title": "Citizen AI Legal Advisor",
    "chat.subtitle": "Empathetic legal advisory grounded in Indian laws (Bharatiya Nyaya Sanhita, Consumer Protection, DK Basu arrest rights, RTI, and NI Act).",
    "chat.btn.new": "New Consultation",
    "chat.scenarios": "Scenarios:",
    "chat.chip.cheque": "💸 Cheque Dishonour (Sec 138)",
    "chat.chip.arrest": "🛡️ Arrest & Police Rights",
    "chat.chip.cyber": "🚨 Cyber UPI Fraud SOP",
    "chat.chip.rent": "🏠 Rent Security Deposit Dispute",
    "chat.chip.consumer": "📦 Defective Product Warranty",
    "chat.welcome.heading": "Namaste! I am NyayMitra (न्यायमित्र) ⚖️",
    "chat.welcome.text1": "I am your AI Legal Assistant, trained on Indian jurisprudence, the new Bharatiya Nyaya Sanhita (BNS 2023), Consumer Protection Act, RTI, and citizen rights.",
    "chat.welcome.text2": "You can ask questions in English, हिन्दी (Hindi), Marathi, Bengali, Tamil, Telugu, Gujarati, or Hinglish.",
    "chat.input.placeholder": "Ask any Indian legal question, dispute situation, or statute query...",
    "chat.btn.send": "Send",

    // Welfare Schemes
    "schemes.title": "Welfare Scheme Eligibility Reader",
    "schemes.subtitle": "Personalized profile matcher discovering Central & State government welfare benefits (PM SVANidhi, PM-KISAN, NFSA Ration, PMAY, Ayushman Bharat, e-Shram, NALSA Free Legal Aid, Sukanya Samriddhi).",
    "schemes.search.placeholder": "Search schemes by name, keyword (e.g. 'Awas', 'Health', 'Pension', 'Loan', 'Vendor')...",
    "schemes.tab.all": "All Schemes",
    "schemes.tab.bookmarked": "⭐ Bookmarked Schemes",
    "schemes.label.occupation": "Occupation / Trade",
    "schemes.label.category": "Social Category",
    "schemes.label.income": "Annual Household Income",
    "schemes.label.age": "Age",
    "schemes.label.gender": "Gender",
    "schemes.label.housing": "Housing Status",
    "schemes.opt.all_occ": "All Occupations",
    "schemes.opt.vendor": "🛒 Street Vendor / Hawker (Rehri/Thela)",
    "schemes.opt.unorganized": "🔨 Unorganized / Construction Worker",
    "schemes.opt.farmer": "🌾 Farmer / Agricultural Labour",
    "schemes.opt.student": "🎓 Student / Youth",
    "schemes.opt.artisan": "🪚 Artisan / Craftsman (Vishwakarma)",
    "schemes.opt.homemaker": "👩 Homemaker / Single Mother",
    "schemes.opt.senior": "👴 Senior Citizen (60+)",
    "schemes.opt.gen": "General Category",
    "schemes.opt.bpl": "BPL / EWS Priority Household",
    "schemes.opt.sc_st": "SC / ST Category",
    "schemes.opt.obc": "OBC Category",
    "schemes.opt.woman": "Woman / Single Mother",
    "schemes.opt.all_gender": "All Genders",
    "schemes.opt.female": "Female",
    "schemes.opt.male": "Male",
    "schemes.opt.any_housing": "Any Housing",
    "schemes.opt.no_pucca": "No Pucca House (Kutcha / Rented)",
    "schemes.opt.has_pucca": "Owns Pucca House",
    "schemes.btn.find": "Find Eligible Schemes",
    "schemes.btn.apply": "Apply on Official Portal",
    "schemes.benefit.title": "💰 Direct Citizen Benefit:",
    "schemes.docs.title": "Mandatory Verification Documents:",
    "schemes.qualify.title": "Why You Qualify:",

    // Legal Drafter
    "drafter.title": "Automated Legal Drafting Studio",
    "drafter.subtitle": "Generate court-standard legal notices, RTI applications, consumer petitions, and tenancy deeds in minutes.",
    "drafter.btn.sample": "Fill Sample Case Data",
    "drafter.template.label": "Select Legal Template",
    "drafter.btn.generate": "Generate Court Draft",
    "drafter.preview.title": "Court Document Preview",
    "drafter.btn.raw": "Edit Raw",
    "drafter.btn.copy": "Copy",
    "drafter.btn.pdf": "Download PDF",

    // Document Scanner
    "analyzer.title": "Legal Document & Clause Risk Scanner",
    "analyzer.subtitle": "Upload agreements, FIR copies, or legal notices to extract plain summaries and detect one-sided high-risk clauses.",
    "analyzer.btn.sample": "Load High-Risk Sample Agreement",
    "analyzer.dropzone.title": "Click or drag & drop document",
    "analyzer.dropzone.sub": "Supports PDF, TXT, MD, DOC (Max 10MB)",
    "analyzer.input.placeholder": "Or paste contract clauses, tenancy terms, terms of service, employment clauses, or police notice here...",
    "analyzer.btn.audit": "Audit Legal Document",
    "analyzer.results.title": "Risk Audit & Executive Breakdown",

    // BNS / IPC Statutes
    "statutes.title": "Bharatiya Nyaya Sanhita (BNS) & IPC Navigator",
    "statutes.subtitle": "Side-by-side comparative mapping between the new 2024 criminal laws (BNS, BNSS, BSA) and the legacy Indian Penal Code (IPC).",
    "statutes.search.placeholder": "Search by section (e.g. '420', '302', '376', '138') or keyword ('Theft', 'Cheating', 'Defamation', 'Mob Lynching')...",

    // Citizen Rights & SOS
    "rights.helplines.title": "Verified Emergency & Legal SOS Numbers (India)",
    "rights.helplines.sub": "24x7 Government Helplines",
    "rights.guides.title": "Citizen Legal Rights & SOP Pocket Handbook",
    "rights.guides.sub": "Constitutional & Statutory Protections",

    // Settings Modal
    "settings.title": "Gemini AI Configuration",
    "settings.subtitle": "Manage LLM models, API credentials, and live connectivity",
    "settings.btn.test": "Test Connection",
    "settings.btn.save": "Save Configuration"
  },

  Hindi: {
    // Brand & Header
    "brand.name": "न्यायसेतु",
    "brand.tagline": "एआई नागरिक अधिकार नेविगेटर एवं साक्ष्य एक्शन पैक",
    "nav.nyayasetu": "न्यायसेतु नेविगेटर",
    "nav.chat": "एआई कानूनी सलाहकार",
    "nav.drafter": "दस्तावेज़ प्रारूपक",
    "nav.schemes": "कल्याणकारी योजनाएं",
    "nav.analyzer": "दस्तावेज़ विश्लेषक",
    "nav.statutes": "बीएनएस / आईपीसी धाराएं",
    "nav.rights": "अधिकार एवं आपातकालीन SOS",
    "btn.sos": "आपातकालीन SOS 1930 / 15100",
    "theme.day": "दिन (लाइट) मोड",
    "theme.night": "रात (डार्क) मोड",

    // NyayaSetu Navigator
    "nyayasetu.badge": "साक्ष्य-आधारित नागरिक अधिकार प्रणाली",
    "nyayasetu.title": "न्यायसेतु (NyayaSetu) नागरिक अधिकार नेविगेटर",
    "nyayasetu.subtitle": "नागरिक समस्याओं को आधिकारिक आरटीआई (RTI) आवेदनों, औपचारिक शिकायत पत्रों और वैधानिक प्रथम अपीलों में बदलें — बिना वकील बदले सटीक कानूनी नियमों के साथ।",
    "nyayasetu.step1": "समस्या बताएं",
    "nyayasetu.step2": "प्रश्नावली",
    "nyayasetu.step3": "अधिकार एवं विभाग",
    "nyayasetu.step4": "एक्शन पैक",
    "nyayasetu.step5": "केस ट्रैकर",
    "nyayasetu.step1.heading": "चरण 1: अपनी नागरिक समस्या या शिकायत सरल भाषा में बताएं",
    "nyayasetu.step1.subheading": "बताएं कि क्या हुआ, किस विभाग में कार्य अटका है, या नीचे दिए गए उदाहरणों में से किसी एक पर क्लिक करें।",
    "nyayasetu.step1.placeholder": "उदा. 'पार्षद के वादे के बाद भी हमारी सड़क 6 महीने से क्यों नहीं बनी?' या 'मेरा राशन कार्ड 3 महीने से अटका हुआ है'...",
    "nyayasetu.step1.demos": "⚡ प्रमुख सत्यापित उदाहरण आज़माएँ:",
    "nyayasetu.demo.road": "🚧 सड़क निर्माण व वर्क आर्डर में देरी",
    "nyayasetu.demo.ration": "🍚 राशन कार्ड (NFSA) 3 महीने से लंबित",
    "nyayasetu.demo.vendor": "🛒 स्ट्रीट वेंडर लाइसेंस व TVC देरी",
    "nyayasetu.demo.rent": "🏠 रोकी गई मकान किराया सिक्योरिटी",
    "nyayasetu.btn.start": "मार्गदर्शित एक्शन प्लान शुरू करें",
    "nyayasetu.btn.back": "← वापस जाएं",
    "nyayasetu.btn.next_rights": "अधिकार एवं विभाग का विवरण देखें",
    "nyayasetu.btn.gen_action_pack": "सम्पूर्ण एक्शन पैक जनरेट करें",
    "nyayasetu.ap.title": "एक्शन पैक एवं रिकॉर्ड-आधारित RTI आवेदन",
    "nyayasetu.ap.subtitle": "तैयार आरटीआई प्रारूप, संलग्नक चेकलिस्ट और वैधानिक समय-सीमा।",
    "nyayasetu.btn.copy_rti": "RTI कॉपी करें",
    "nyayasetu.btn.download_pdf": "एक्शन पैक PDF डाउनलोड करें",
    "nyayasetu.btn.track_case": "यह केस ट्रैक करें",

    // AI Legal Advisor (Chat)
    "chat.title": "नागरिक एआई कानूनी सलाहकार (न्यायमित्र)",
    "chat.subtitle": "भारतीय कानूनों (भारतीय न्याय संहिता 2023, उपभोक्ता संरक्षण, डीके बसु गिरफ्तारी अधिकार, RTI और चेक बाउंस) पर आधारित कानूनी सलाह।",
    "chat.btn.new": "नया परामर्श",
    "chat.scenarios": "कानूनी स्थितियाँ:",
    "chat.chip.cheque": "💸 चेक बाउंस (धारा 138 NI Act)",
    "chat.chip.arrest": "🛡️ गिरफ्तारी व पुलिस अधिकार",
    "chat.chip.cyber": "🚨 साइबर UPI फ्रॉड SOP",
    "chat.chip.rent": "🏠 मकान किराया सिक्योरिटी विवाद",
    "chat.chip.consumer": "📦 ख़राब उत्पाद एवं वारंटी दावा",
    "chat.welcome.heading": "नमस्ते! मैं न्यायमित्र (NyayMitra) हूँ ⚖️",
    "chat.welcome.text1": "मैं आपका एआई कानूनी सहायक हूँ, जिसे भारतीय कानून, नई भारतीय न्याय संहिता (BNS 2023), उपभोक्ता संरक्षण और नागरिक अधिकारों पर प्रशिक्षित किया गया है।",
    "chat.welcome.text2": "आप मुझसे हिन्दी, English या अपनी पसंदीदा भारतीय भाषा में प्रश्न पूछ सकते हैं।",
    "chat.input.placeholder": "कोई भी भारतीय कानूनी सवाल, विवाद या धारा के बारे में पूछें...",
    "chat.btn.send": "भेजें",

    // Welfare Schemes
    "schemes.title": "कल्याणकारी योजना पात्रता परीक्षक",
    "schemes.subtitle": "केंद्र और राज्य सरकार की कल्याणकारी योजनाओं (पीएम स्वनिधि, पीएम-किसान, राशन योजना, पीएम आवास, आयुष्मान भारत, ई-श्रम, मुफ्त कानूनी सहायता) की खोज करें।",
    "schemes.search.placeholder": "योजना का नाम या कीवर्ड खोजें (उदा. 'आवास', 'स्वास्थ्य', 'पेंशन', 'लोन', 'वेंडर')...",
    "schemes.tab.all": "सभी योजनाएं",
    "schemes.tab.bookmarked": "⭐ सहेजी गई योजनाएं",
    "schemes.label.occupation": "व्यवसाय / पेशा",
    "schemes.label.category": "सामाजिक श्रेणी",
    "schemes.label.income": "वार्षिक पारिवारिक आय",
    "schemes.label.age": "आयु",
    "schemes.label.gender": "लिंग",
    "schemes.label.housing": "आवास की स्थिति",
    "schemes.opt.all_occ": "सभी व्यवसाय",
    "schemes.opt.vendor": "🛒 रेहड़ी-पटरी / स्ट्रीट वेंडर",
    "schemes.opt.unorganized": "🔨 असंगठित / निर्माण श्रमिक",
    "schemes.opt.farmer": "🌾 किसान / कृषि मजदूर",
    "schemes.opt.student": "🎓 छात्र / युवा",
    "schemes.opt.artisan": "🪚 कारीगर / शिल्पकार (विश्वकर्मा)",
    "schemes.opt.homemaker": "👩 गृहिणी / एकल माता",
    "schemes.opt.senior": "👴 वरिष्ठ नागरिक (60+)",
    "schemes.opt.gen": "सामान्य वर्ग (General)",
    "schemes.opt.bpl": "बीपीएल / ईडब्ल्यूएस (BPL / EWS)",
    "schemes.opt.sc_st": "अनुसूचित जाति / जनजाति (SC / ST)",
    "schemes.opt.obc": "अन्य पिछड़ा वर्ग (OBC)",
    "schemes.opt.woman": "महिला / एकल माता",
    "schemes.opt.all_gender": "सभी लिंग",
    "schemes.opt.female": "महिला",
    "schemes.opt.male": "पुरुष",
    "schemes.opt.any_housing": "कोई भी",
    "schemes.opt.no_pucca": "पक्का मकान नहीं है (कच्चा/किराया)",
    "schemes.opt.has_pucca": "पक्का मकान उपलब्ध है",
    "schemes.btn.find": "पात्र योजनाएं खोजें",
    "schemes.btn.apply": "आधिकारिक पोर्टल पर आवेदन करें",
    "schemes.benefit.title": "💰 सीधा नागरिक लाभ:",
    "schemes.docs.title": "अनिवार्य दस्तावेज़ सूची:",
    "schemes.qualify.title": "आप क्यों पात्र हैं:",

    // Legal Drafter
    "drafter.title": "स्वचालित कानूनी दस्तावेज़ प्रारूपक",
    "drafter.subtitle": "कोर्ट-मानक लीगल नोटिस, आरटीआई आवेदन, उपभोक्ता शिकायत और अनुबंध मिनटों में तैयार करें।",
    "drafter.btn.sample": "नमूना केस डेटा भरें",
    "drafter.template.label": "कानूनी प्रारूप चुनें",
    "drafter.btn.generate": "कोर्ट ड्राफ्ट तैयार करें",
    "drafter.preview.title": "कोर्ट दस्तावेज़ पूर्वावलोकन",
    "drafter.btn.raw": "संपादित करें",
    "drafter.btn.copy": "कॉपी करें",
    "drafter.btn.pdf": "PDF डाउनलोड करें",

    // Document Scanner
    "analyzer.title": "कानूनी दस्तावेज़ एवं जोखिम विश्लेषक",
    "analyzer.subtitle": "अनुबंध, एफआईआर या नोटिस अपलोड करें और एकतरफा जोखिम भरे क्लॉज़ का विश्लेषण प्राप्त करें।",
    "analyzer.btn.sample": "नमूना उच्च-जोखिम अनुबंध लोड करें",
    "analyzer.dropzone.title": "दस्तावेज़ यहाँ क्लिक या ड्रैग करें",
    "analyzer.dropzone.sub": "PDF, TXT, MD, DOC समर्थित (अधिकतम 10MB)",
    "analyzer.input.placeholder": "या अनुबंध की शर्तें, किराया नियम, रोजगार अनुबंध यहाँ पेस्ट करें...",
    "analyzer.btn.audit": "दस्तावेज़ का ऑडिट करें",
    "analyzer.results.title": "जोखिम ऑडिट एवं सारांश",

    // BNS / IPC Statutes
    "statutes.title": "भारतीय न्याय संहिता (BNS) एवं IPC नेविगेटर",
    "statutes.subtitle": "नए 2024 के आपराधिक कानूनों (BNS, BNSS, BSA) और पुराने IPC के बीच तुलनात्मक विवरण।",
    "statutes.search.placeholder": "धारा (उदा. '420', '302', '376', '138') या कीवर्ड ('चोरी', 'धोखाधड़ी', 'मानहानि') खोजें...",

    // Citizen Rights & SOS
    "rights.helplines.title": "सत्यापित आपातकालीन व कानूनी सहायता नंबर (भारत)",
    "rights.helplines.sub": "24x7 सरकारी हेल्पलाइन",
    "rights.guides.title": "नागरिक कानूनी अधिकार एवं एसओपी पॉकेट गाइड",
    "rights.guides.sub": "संवैधानिक एवं वैधानिक सुरक्षा",

    // Settings Modal
    "settings.title": "Gemini AI कॉन्फ़िगरेशन",
    "settings.subtitle": "एलएलएम मॉडल, एपीआई क्रेडेंशियल्स और लाइव कनेक्टिविटी प्रबंधित करें",
    "settings.btn.test": "कनेक्शन टेस्ट करें",
    "settings.btn.save": "सेटिंग्स सहेजें"
  },

  Hinglish: {
    // Brand & Header
    "brand.name": "NyayaSetu",
    "brand.tagline": "AI Civic-Rights Navigator & Evidence Action Packs",
    "nav.nyayasetu": "NyayaSetu Navigator",
    "nav.chat": "AI Legal Advisor",
    "nav.drafter": "Drafting Studio",
    "nav.schemes": "Welfare Schemes",
    "nav.analyzer": "Document Scanner",
    "nav.statutes": "BNS / IPC Statutes",
    "nav.rights": "Rights & SOS",
    "btn.sos": "Emergency SOS 1930 / 15100",
    "theme.day": "Day (Light) Mode",
    "theme.night": "Night (Dark) Mode",

    // NyayaSetu
    "nyayasetu.badge": "Evidence-Backed Civic Action System",
    "nyayasetu.title": "NyayaSetu (न्यायसेतु) Civic Rights Navigator",
    "nyayasetu.subtitle": "Apni citizen problems ko verified RTI applications, grievance letters aur statutory appeals mein convert karein.",
    "nyayasetu.step1": "Problem Batayein",
    "nyayasetu.step2": "Questionnaire",
    "nyayasetu.step3": "Rights & Dept",
    "nyayasetu.step4": "Action Pack",
    "nyayasetu.step5": "Case Tracker",
    "nyayasetu.step1.heading": "Step 1: Apni grievance ya problem simple language mein describe karein",
    "nyayasetu.step1.subheading": "Batayein kya hua, kaunsa department delay kar raha hai, ya neeche diye demo scenario par click karein.",
    "nyayasetu.step1.placeholder": "e.g. 'Hamari road repair kyun nahi hui?' ya 'Mera ration card 3 months se pending hai'...",
    "nyayasetu.step1.demos": "⚡ High-Impact Demo Scenarios Try Karein:",
    "nyayasetu.demo.road": "🚧 Road Repair & Work Order Delay",
    "nyayasetu.demo.ration": "🍚 Ration Card (NFSA) 3-Month Delay",
    "nyayasetu.demo.vendor": "🛒 Street Vendor Licence 60-Day Delay",
    "nyayasetu.demo.rent": "🏠 Withheld Rent Security Deposit",
    "nyayasetu.btn.start": "Guided Action Plan Start Karein",
    "nyayasetu.btn.back": "← Back",
    "nyayasetu.btn.next_rights": "Rights & Authority Summary Dekhein",
    "nyayasetu.btn.gen_action_pack": "Complete Action Pack Generate Karein",
    "nyayasetu.ap.title": "Action Pack & Records-Based RTI Application",
    "nyayasetu.ap.subtitle": "Form-ready RTI draft, attachment checklist aur follow-up timeline.",
    "nyayasetu.btn.copy_rti": "RTI Copy Karein",
    "nyayasetu.btn.download_pdf": "Action Pack PDF Download",
    "nyayasetu.btn.track_case": "Yeh Case Track Karein",

    // Chat
    "chat.title": "Citizen AI Legal Advisor (NyayMitra)",
    "chat.subtitle": "Indian laws (BNS, Consumer Protection, DK Basu arrest rights, RTI, Sec 138 NI Act) par based instant legal guidance.",
    "chat.btn.new": "New Consultation",
    "chat.scenarios": "Common Scenarios:",
    "chat.chip.cheque": "💸 Cheque Bounce (Sec 138)",
    "chat.chip.arrest": "🛡️ Arrest & Police Rights",
    "chat.chip.cyber": "🚨 Cyber UPI Fraud SOP",
    "chat.chip.rent": "🏠 Rent Security Dispute",
    "chat.chip.consumer": "📦 Defective Product Warranty",
    "chat.welcome.heading": "Namaste! Main NyayMitra hoon ⚖️",
    "chat.welcome.text1": "Main aapka AI Legal Assistant hoon, trained on Indian jurisprudence aur naye Bharatiya Nyaya Sanhita (BNS 2023).",
    "chat.welcome.text2": "Aap Hinglish, Hindi, English ya kisi bhi Indian language mein legal query pooch sakte hain.",
    "chat.input.placeholder": "Koi bhi Indian legal question ya problem yahan poochein...",
    "chat.btn.send": "Send",

    // Schemes
    "schemes.title": "Welfare Scheme Eligibility Reader",
    "schemes.subtitle": "Central & State schemes (PM SVANidhi, PM-KISAN, NFSA Ration, PMAY, Ayushman Bharat, e-Shram, Free Legal Aid) eligibility check karein.",
    "schemes.search.placeholder": "Search scheme name ya keyword (e.g. 'Awas', 'Health', 'Pension', 'Loan')...",
    "schemes.tab.all": "All Schemes",
    "schemes.tab.bookmarked": "⭐ Bookmarked Schemes",
    "schemes.label.occupation": "Occupation / Kaam",
    "schemes.label.category": "Social Category",
    "schemes.label.income": "Annual Family Income",
    "schemes.label.age": "Age",
    "schemes.label.gender": "Gender",
    "schemes.label.housing": "Housing Status",
    "schemes.btn.find": "Eligible Schemes Check Karein",
    "schemes.btn.apply": "Official Portal Par Apply Karein",
    "schemes.benefit.title": "💰 Direct Citizen Benefit:",
    "schemes.docs.title": "Required Documents:",
    "schemes.qualify.title": "Kyun Eligible Hain:"
  },

  Marathi: {
    // Brand & Header
    "brand.name": "न्यायसेतु",
    "brand.tagline": "नागरिक हक्क नेव्हिगेटर आणि अ‍ॅक्शन पॅक",
    "nav.nyayasetu": "न्यायसेतु नेव्हिगेटर",
    "nav.chat": "कायदेशीर सल्लागार",
    "nav.drafter": "दस्तऐवज प्रारूपक",
    "nav.schemes": "कल्याणकारी योजना",
    "nav.analyzer": "दस्तऐवज विश्लेषक",
    "nav.statutes": "BNS / IPC कायदे",
    "nav.rights": "हक्क आणि SOS",
    "btn.sos": "आपत्कालीन SOS 1930 / 15100",
    "theme.day": "दिवस मोड",
    "theme.night": "रात्र मोड",

    // NyayaSetu
    "nyayasetu.badge": "पुरावा-आधारित नागरी कृती प्रणाली",
    "nyayasetu.title": "न्यायसेतु (NyayaSetu) नागरी हक्क नेव्हिगेटर",
    "nyayasetu.subtitle": "नागरी तक्रारींचे अधिकृत माहिती अधिकार (RTI) अर्ज आणि तक्रार निवारण पत्रांमध्ये रूपांतर करा.",
    "nyayasetu.step1": "समस्या सांगा",
    "nyayasetu.step2": "प्रश्नावली",
    "nyayasetu.step3": "हक्क आणि प्राधिकरण",
    "nyayasetu.step4": "अ‍ॅक्शन पॅक",
    "nyayasetu.step5": "केस ट्रॅकर",
    "nyayasetu.step1.heading": "टप्पा १: आपली नागरी तक्रार किंवा समस्या साध्या भाषेत सांगा",
    "nyayasetu.step1.subheading": "काय घडले आणि कोणत्या विभागात विलंब होत आहे ते सांगा.",
    "nyayasetu.step1.placeholder": "उदा. 'रस्त्याचे काम का रखडले आहे?' किंवा 'माझे रेशन कार्ड ३ महिन्यांपासून प्रलंबित आहे'...",
    "nyayasetu.btn.start": "मार्गदर्शित कृती योजना सुरू करा",
    "nyayasetu.btn.back": "← मागे जा",
    "nyayasetu.btn.next_rights": "हक्क आणि प्राधिकरण तपशील पहा",
    "nyayasetu.btn.gen_action_pack": "संपूर्ण अ‍ॅक्शन पॅक तयार करा",
    "nyayasetu.btn.copy_rti": "RTI कॉपी करा",
    "nyayasetu.btn.download_pdf": "PDF डाउनलोड करा",
    "nyayasetu.btn.track_case": "केस ट्रॅक करा",

    // Chat
    "chat.title": "नागरिक AI कायदेशीर सल्लागार (न्यायमित्र)",
    "chat.subtitle": "भारतीय कायद्यांवर (BNS, ग्राहक संरक्षण, डी.के. बासू अटक हक्क, RTI) आधारित कायदेशीर मार्गदर्शन.",
    "chat.btn.new": "नवीन सल्लामसलत",
    "chat.input.placeholder": "कोणताही कायदेशीर प्रश्न किंवा तक्रार येथे विचारा...",
    "chat.btn.send": "पाठवा",

    // Schemes
    "schemes.title": "कल्याणकारी योजना पात्रता तपासक",
    "schemes.subtitle": "केंद्र आणि राज्य शासनाच्या कल्याणकारी योजना (पीएम स्वनिधी, पीएम-किसान, रेशन, पीएम आवास, आयुष्यमान भारत, ई-श्रम, मोफत कायदेशीर मदत) शोधा.",
    "schemes.search.placeholder": "योजनेचे नाव किंवा कीवर्ड शोधा...",
    "schemes.tab.all": "सर्व योजना",
    "schemes.tab.bookmarked": "⭐ जतन केलेल्या योजना",
    "schemes.btn.find": "पात्र योजना शोधा",
    "schemes.btn.apply": "अधिकृत पोर्टलवर अर्ज करा",
    "schemes.benefit.title": "💰 थेट नागरिक लाभ:",
    "schemes.docs.title": "आवश्यक कागदपत्रे:",
    "schemes.qualify.title": "पात्रतेचे कारण:"
  },

  Bengali: {
    // Brand & Header
    "brand.name": "ন্যায়সেতু",
    "brand.tagline": "নাগরিক অধিকার নেভিগেটর ও অ্যাকশন প্যাক",
    "nav.nyayasetu": "ন্যায়সেতু নেভিগেটর",
    "nav.chat": "আইনি উপদেষ্টা",
    "nav.drafter": "খসড়া স্টুডিও",
    "nav.schemes": "কল্যাণমূলক প্রকল্প",
    "nav.analyzer": "নথি স্ক্যানার",
    "nav.statutes": "BNS / IPC ধারা",
    "nav.rights": "অধিকার ও SOS",
    "btn.sos": "জরুরি SOS 1930 / 15100",
    "theme.day": "ডে মোড",
    "theme.night": "নাইট মোড",

    // NyayaSetu
    "nyayasetu.badge": "প্রমাণ-ভিত্তিক নাগরিক অধিকার ব্যবস্থা",
    "nyayasetu.title": "ন্যায়সেতু (NyayaSetu) নাগরিক অধিকার নেভিগেটর",
    "nyayasetu.subtitle": "নাগরিক অভিযোগকে যাচাইকৃত RTI আবেদন এবং সরকারি অভিযোগ পত্রে রূপান্তর করুন।",
    "nyayasetu.step1": "সমস্যা বর্ণনা করুন",
    "nyayasetu.step2": "প্রশ্নোত্তর",
    "nyayasetu.step3": "অধিকার ও কর্তৃপক্ষ",
    "nyayasetu.step4": "অ্যাকশন প্যাক",
    "nyayasetu.step5": "কেস ট্র্যাকার",
    "nyayasetu.step1.heading": "ধাপ ১: আপনার অভিযোগ সহজ ভাষায় লিখুন",
    "nyayasetu.btn.start": "অ্যাকশন প্ল্যান শুরু করুন",
    "nyayasetu.btn.back": "← পেছনে যান",
    "nyayasetu.btn.next_rights": "অধিকারের বিবরণ দেখুন",
    "nyayasetu.btn.gen_action_pack": "সম্পূর্ণ অ্যাকশন প্যাক তৈরি করুন",
    "nyayasetu.btn.copy_rti": "RTI কপি করুন",
    "nyayasetu.btn.download_pdf": "PDF ডাউনলোড করুন",

    // Chat
    "chat.title": "নাগরিক AI আইনি উপদেষ্টা (ন্যায়মিত্র)",
    "chat.subtitle": "ভারতীয় আইন (BNS 2023, ক্রেতা সুরক্ষা, গ্রেফতার অধিকার, RTI) ভিত্তিক আইনি সহায়তা।",
    "chat.btn.new": "নতুন পরামর্শ",
    "chat.input.placeholder": "যেকোনো আইনি প্রশ্ন বা সমস্যা এখানে লিখুন...",
    "chat.btn.send": "পাঠান",

    // Schemes
    "schemes.title": "সরকারি প্রকল্পের যোগ্যতা যাচাই",
    "schemes.subtitle": "কেন্দ্রীয় ও রাজ্য সরকারি প্রকল্প (পিএম স্বনিধি, রেশন, পিএম আবাস, আয়ুষ্মান ভারত, বিনামূল্যে আইনি সহায়তা) খুঁজুন।",
    "schemes.search.placeholder": "প্রকল্পের নাম দিয়ে অনুসন্ধান করুন...",
    "schemes.tab.all": "সকল প্রকল্প",
    "schemes.tab.bookmarked": "⭐ সংরক্ষিত প্রকল্প",
    "schemes.btn.find": "যোগ্য প্রকল্প খুঁজুন",
    "schemes.btn.apply": "অফিসিয়াল পোর্টালে আবেদন করুন"
  },

  Tamil: {
    // Brand & Header
    "brand.name": "நியாயசேது",
    "brand.tagline": "குடிமக்கள் உரிமைகள் வழிகாட்டி",
    "nav.nyayasetu": "நியாயசேது வழிகாட்டி",
    "nav.chat": "சட்ட ஆலோசகர்",
    "nav.drafter": "வரைவு அரங்கம்",
    "nav.schemes": "நலத்திட்டங்கள்",
    "nav.analyzer": "ஆவண ஆய்வாளர்",
    "nav.statutes": "BNS / IPC சட்டங்கள்",
    "nav.rights": "உரிமைகள் & SOS",
    "btn.sos": "அவசர SOS 1930 / 15100",
    "theme.day": "பகல் பயன்முறை",
    "theme.night": "இரவு பயன்முறை",

    // NyayaSetu
    "nyayasetu.badge": "ஆதார அடிப்படையிலான குடிமக்கள் உரிமை அமைப்பு",
    "nyayasetu.title": "நியாயசேது (NyayaSetu) குடிமக்கள் உரிமைகள் வழிகாட்டி",
    "nyayasetu.subtitle": "உங்கள் குறைகளை சரிபார்க்கப்பட்ட தகவல் அறியும் உரிமை (RTI) விண்ணப்பங்களாக மாற்றவும்.",
    "nyayasetu.step1": "சிக்கலை விவரிக்கவும்",
    "nyayasetu.step2": "கேள்வித்தாள்",
    "nyayasetu.step3": "உரிமைகள் & துறை",
    "nyayasetu.step4": "செயல் திட்டம்",
    "nyayasetu.step5": "வழக்கு கண்காணிப்பாளர்",
    "nyayasetu.btn.start": "வழிகாட்டப்பட்ட திட்டத்தைத் தொடங்குங்கள்",
    "nyayasetu.btn.back": "← பின்செல்",
    "nyayasetu.btn.next_rights": "உரிமைகள் விவரங்களைப் பார்க்கவும்",
    "nyayasetu.btn.gen_action_pack": "முழுமையான செயல் தொகுப்பை உருவாக்குங்கள்",

    // Chat
    "chat.title": "குடிமக்கள் AI சட்ட ஆலோசகர் (நியாயமித்ரா)",
    "chat.subtitle": "இந்திய சட்டங்கள் (BNS 2023, நுகர்வோர் பாதுகாப்பு, RTI) அடிப்படையிலான சட்ட வழிகாட்டுதல்.",
    "chat.btn.new": "புதிய ஆலோசனை",
    "chat.input.placeholder": "உங்கள் சட்ட கேள்விகளை இங்கே கேளுங்கள்...",
    "chat.btn.send": "அனுப்பு",

    // Schemes
    "schemes.title": "அரசு நலத்திட்ட தகுதி சரிபார்ப்பு",
    "schemes.subtitle": "மத்திய மற்றும் மாநில அரசு நலத்திட்டங்களை (பிஎம் ஸ்வாநிதி, ரேஷன், ஆயுஷ்மான் பாரத், இலவச சட்ட உதவி) கண்டறியவும்.",
    "schemes.search.placeholder": "திட்டத்தின் பெயரைத் தேடுங்கள்...",
    "schemes.tab.all": "அனைத்து திட்டங்கள்",
    "schemes.tab.bookmarked": "⭐ சேமிக்கப்பட்ட திட்டங்கள்",
    "schemes.btn.find": "தகுதியான திட்டங்களைக் கண்டறியவும்",
    "schemes.btn.apply": "விண்ணப்பிக்கவும்"
  },

  Telugu: {
    // Brand & Header
    "brand.name": "న్యాయసేతు",
    "brand.tagline": "పౌర హక్కుల నావిగేటర్ & యాక్షన్ ప్యాక్",
    "nav.nyayasetu": "న్యాయసేతు నావిగేటర్",
    "nav.chat": "చట్టపరమైన సలహాదారు",
    "nav.drafter": "డ్రాఫ్టింగ్ స్టూడియో",
    "nav.schemes": "సంక్షేమ పథకాలు",
    "nav.analyzer": "పత్రాల స్కానర్",
    "nav.statutes": "BNS / IPC చట్టాలు",
    "nav.rights": "హక్కులు & SOS",
    "btn.sos": "అత్యవసర SOS 1930 / 15100",
    "theme.day": "డే మోడ్",
    "theme.night": "నైట్ మోడ్",

    // NyayaSetu
    "nyayasetu.badge": "ఆధారాల ఆధారిత పౌర హక్కుల వ్యవస్థ",
    "nyayasetu.title": "న్యాయసేతు (NyayaSetu) పౌర హక్కుల నావిగేటర్",
    "nyayasetu.subtitle": "మీ ఫిర్యాదులను ధృవీకరించబడిన RTI దరఖాస్తులుగా మరియు అధికారిక వినతిపత్రాలుగా మార్చండి.",
    "nyayasetu.step1": "సమస్యను వివరించండి",
    "nyayasetu.step2": "ప్రశ్నావళి",
    "nyayasetu.step3": "హక్కులు & శాఖ",
    "nyayasetu.step4": "యాక్షన్ ప్యాక్",
    "nyayasetu.step5": "కేసు ట్రాకర్",
    "nyayasetu.btn.start": "యాక్షన్ ప్లాన్ ప్రారంభించండి",
    "nyayasetu.btn.back": "← వెనక్కి",
    "nyayasetu.btn.next_rights": "హక్కుల వివరాలు చూడండి",
    "nyayasetu.btn.gen_action_pack": "యాక్షన్ ప్యాక్ రూపొందించండి",

    // Chat
    "chat.title": "పౌర AI చట్టపరమైన సలహాదారు (న్యాయమిత్ర)",
    "chat.subtitle": "భారతీయ చట్టాల (BNS 2023, వినియోగదారుల రక్షణ, RTI) ఆధారిత మార్గదర్శకత్వం.",
    "chat.btn.new": "కొత్త సంప్రదింపులు",
    "chat.input.placeholder": "మీ చట్టపరమైన ప్రశ్నను ఇక్కడ అడగండి...",
    "chat.btn.send": "పంపు",

    // Schemes
    "schemes.title": "సంక్షేమ పథకాల అర్హత పరిశీలన",
    "schemes.subtitle": "కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ సంక్షేమ పథకాలను (పీఎం స్వనిధి, రేషన్, ఆవాస్, ఆయుష్మాన్ భారత్, ఉచిత న్యాయ సహాయం) కనుగొనండి.",
    "schemes.search.placeholder": "పథకం పేరుతో శోధించండి...",
    "schemes.tab.all": "అన్ని పథకాలు",
    "schemes.tab.bookmarked": "⭐ సేవ్ చేసిన పథకాలు",
    "schemes.btn.find": "అర్హతగల పథకాలను కనుగొనండి",
    "schemes.btn.apply": "దరఖాస్తు చేసుకోండి"
  },

  Gujarati: {
    // Brand & Header
    "brand.name": "ન્યાયસેતુ",
    "brand.tagline": "નાગરિક અધિકાર નેવિગેટર અને એક્શન પેક",
    "nav.nyayasetu": "ન્યાયસેતુ નેવિગેટર",
    "nav.chat": "કાનૂની સલાહકાર",
    "nav.drafter": "દસ્તાવેજ પ્રારૂપક",
    "nav.schemes": "કલ્યાણકારી યોજનાઓ",
    "nav.analyzer": "દસ્તાવેજ સ્કેનર",
    "nav.statutes": "BNS / IPC કલમો",
    "nav.rights": "અધિકાર અને SOS",
    "btn.sos": "કટોકટી SOS 1930 / 15100",
    "theme.day": "દિવસ મોડ",
    "theme.night": "રાત્રિ મોડ",

    // NyayaSetu
    "nyayasetu.badge": "પુરાવા-આધારિત નાગરિક અધિકાર વ્યવસ્થા",
    "nyayasetu.title": "ન્યાયસેતુ (NyayaSetu) નાગરિક અધિકાર નેવિગેટર",
    "nyayasetu.subtitle": "નાગરિક ફરિયાદોને અધિકૃત RTI અરજીઓ અને ફરિયાદ પત્રોમાં રૂપાંતરિત કરો.",
    "nyayasetu.step1": "સમસ્યા જણાવો",
    "nyayasetu.step2": "પ્રશ્નાવલી",
    "nyayasetu.step3": "અધિકાર અને સત્તામંડળ",
    "nyayasetu.step4": "એક્શન પેક",
    "nyayasetu.step5": "કેસ ટ્રેકર",
    "nyayasetu.btn.start": "એક્શન પ્લાન શરૂ કરો",
    "nyayasetu.btn.back": "← પાછા જાઓ",
    "nyayasetu.btn.next_rights": "અધિકારોની વિગતો જુઓ",
    "nyayasetu.btn.gen_action_pack": "સંપૂર્ણ એક્શન પેક બનાવો",

    // Chat
    "chat.title": "નાગરિક AI કાનૂની સલાહકાર (ન્યાયમિત્ર)",
    "chat.subtitle": "ભારતીય કાયદાઓ (BNS 2023, ગ્રાહક સુરક્ષા, ધરપકડ અધિકાર, RTI) આધારિત કાનૂની માર્ગદર્શન.",
    "chat.btn.new": "નવી સલાહ",
    "chat.input.placeholder": "કોઈપણ કાનૂની પ્રશ્ન અહીં પૂછો...",
    "chat.btn.send": "મોકલો",

    // Schemes
    "schemes.title": "સરકારી યોજના પાત્રતા ચકાસણી",
    "schemes.subtitle": "કેન્દ્ર અને રાજ્ય સરકારની કલ્યાણકારી યોજનાઓ (પીએમ સ્વનિધિ, રેશન, પીએમ આવાસ, આયુષ્માન ભારત, મફત કાનૂની સહાય) શોધો.",
    "schemes.search.placeholder": "યોજનાનું નામ શોધો...",
    "schemes.tab.all": "તમામ યોજનાઓ",
    "schemes.tab.bookmarked": "⭐ સાચવેલી યોજનાઓ",
    "schemes.btn.find": "પાત્ર યોજનાઓ શોધો",
    "schemes.btn.apply": "અરજી કરો"
  }
};

class I18nManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('nyaymitra_language') || 'English';
    this.translations = I18N_TRANSLATIONS;
    this.listeners = [];
  }

  getLanguage() {
    return this.currentLanguage;
  }

  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} not found, falling back to English`);
      lang = 'English';
    }
    this.currentLanguage = lang;
    localStorage.setItem('nyaymitra_language', lang);
    this.translateDOM();
    this.notifyListeners(lang);
  }

  onLanguageChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(lang) {
    this.listeners.forEach(cb => {
      try {
        cb(lang);
      } catch (err) {
        console.error('Error in language change listener:', err);
      }
    });
  }

  t(key, fallback = '') {
    const langDict = this.translations[this.currentLanguage] || this.translations['English'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary if key missing in current language
    const enDict = this.translations['English'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  }

  translateDOM(root = document) {
    // Translate textContent with data-i18n
    const elements = root.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Translate placeholders with data-i18n-placeholder
    const placeholders = root.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.placeholder = translation;
      }
    });

    // Translate titles / tooltips with data-i18n-title
    const titles = root.querySelectorAll('[data-i18n-title]');
    titles.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation) {
        el.title = translation;
      }
    });

    // Update document title
    if (this.currentLanguage === 'Hindi') {
      document.title = "न्यायसेतु (NyayaSetu) • एआई नागरिक अधिकार एवं एक्शन पैक नेविगेटर | न्यायमित्र";
    } else {
      document.title = "NyayaSetu (न्यायसेतु) • AI Civic Rights & Action Pack Navigator | NyayMitra";
    }

    if (window.lucide) window.lucide.createIcons();
  }

  getSpeechLangCode() {
    const langMap = {
      'English': 'en-IN',
      'Hindi': 'hi-IN',
      'Hinglish': 'hi-IN',
      'Bengali': 'bn-IN',
      'Marathi': 'mr-IN',
      'Tamil': 'ta-IN',
      'Telugu': 'te-IN',
      'Gujarati': 'gu-IN'
    };
    return langMap[this.currentLanguage] || 'en-IN';
  }
}

// Global instance
window.i18n = new I18nManager();
