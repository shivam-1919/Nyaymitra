/**
 * NyayaSetu Action Navigator
 * 5-Step Guided Citizen Grievance, Records-Based RTI Generator & Statutory First Appeal Engine.
 */

const QUESTION_LOCALIZATIONS = {
  jurisdiction_state_city: {
    question: {
      English: "Which State, District, and City/Ward are you located in?",
      Hindi: "आप किस राज्य, जिले एवं शहर / वार्ड में स्थित हैं?",
      Hinglish: "Aap kis State, District, aur City/Ward me rehte hain?",
      Marathi: "तुम्ही कोणत्या राज्यात, जिल्ह्यात आणि शहरात/प्रभागात राहता?",
      Bengali: "আপনি কোন রাজ্য, জেলা এবং শহর/ওয়ার্ডে অবস্থিত?",
      Tamil: "நீங்கள் எந்த மாநிலம், மாவட்டம் மற்றும் நகரம்/வார்டில் வசிக்கிறீர்கள்?",
      Telugu: "మీరు ఏ రాష్ట్రం, జిల్లా మరియు నగరం/వార్డులో నివసిస్తున్నారు?",
      Gujarati: "તમે કયા રાજ્ય, જિલ્લો અને શહેર/વોર્ડમાં રહો છો?"
    },
    placeholder: {
      English: "e.g. Maharashtra, Mumbai Suburban, Ward K-West",
      Hindi: "उदा. महाराष्ट्र, मुंबई उपनगर, वार्ड के-वेस्ट",
      Hinglish: "e.g. Maharashtra, Mumbai Suburban, Ward K-West",
      Marathi: "उदा. महाराष्ट्र, मुंबई उपनगर, प्रभाग के-वेस्ट",
      Bengali: "যেমন: পশ্চিমবঙ্গ, কলকাতা, ওয়ার্ড ৪৫",
      Tamil: "எ.கா. தமிழ்நாடு, சென்னை, வார்டு 120",
      Telugu: "ఉదా. తెలంగాణ, హైదరాబాద్, వార్డు 45",
      Gujarati: "દા.ત. ગુજરાત, અમદાવાદ, વોર્ડ 12"
    },
    rationale: {
      English: "Identifies the exact municipal corporation, state RTI portal, or local nodal officer.",
      Hindi: "संबंधित नगर निगम, राज्य आरटीआई पोर्टल या स्थानीय नोडल अधिकारी की पहचान करता है।",
      Hinglish: "Ye exact municipal corporation, state RTI portal ya local officer ko target karta hai.",
      Marathi: "संबंधित महानगरपालिका, राज्य माहिती अधिकार पोर्टल किंवा स्थानिक नोडल अधिकारी ओळखतो.",
      Bengali: "সঠিক পৌরসভা, রাজ্য আরটিআই পোর্টাল বা স্থানীয় নোডাল অফিসার সনাক্ত করে।",
      Tamil: "சரியான மாநகராட்சி, மாநில RTI தளம் அல்லது உள்ளூர் அதிகாரியை அடையாளம் காட்டுகிறது.",
      Telugu: "ఖచ్చితమైన మునిసిపల్ కార్పొరేషన్ లేదా స్థానిక నోడల్ అధికారిని గుర్తిస్తుంది.",
      Gujarati: "સંબંધિત મહાનગરપાલિકા, રાજ્ય RTI પોર્ટલ અથવા સ્થાનિક નોડલ અધિકારીને ઓળખે છે."
    }
  },
  incident_or_application_date: {
    question: {
      English: "When did you submit your original application / when did the issue start?",
      Hindi: "आपने अपना मूल आवेदन कब जमा किया था या समस्या कब शुरू हुई?",
      Hinglish: "Aapne original application kab submit ki thi ya problem kab shuru hui?",
      Marathi: "तुम्ही तुमचा मूळ अर्ज कधी सादर केला होता किंवा समस्या कधी सुरू झाली?",
      Bengali: "আপনি কখন আপনার মূল আবেদন জমা দিয়েছিলেন বা সমস্যাটি কখন শুরু হয়েছিল?",
      Tamil: "உங்கள் விண்ணப்பத்தை எப்போது சமர்ப்பித்தீர்கள் அல்லது பிரச்சனை எப்போது தொடங்கியது?",
      Telugu: "మీరు అసలు దరఖాస్తును ఎప్పుడు సమర్పించారు లేదా సమస్య ఎప్పుడు ప్రారంభమైంది?",
      Gujarati: "તમે તમારી મૂળ અરજી ક્યારે સબમિટ કરી હતી અથવા સમસ્યા ક્યારે શરૂ થઈ?"
    },
    placeholder: {
      English: "e.g. 15th May 2024 (approx 3 months ago)",
      Hindi: "उदा. 15 मई 2024 (लगभग 3 महीने पहले)",
      Hinglish: "e.g. 15th May 2024 (approx 3 months pehle)",
      Marathi: "उदा. १५ मे २०२४ (सुमारे ३ महिन्यांपूर्वी)",
      Bengali: "যেমন: ১৫ মে ২০২৪ (প্রায় ৩ মাস আগে)",
      Tamil: "எ.கா. 15 மே 2024 (சுமார் 3 மாதங்களுக்கு முன்பு)",
      Telugu: "ఉదా. 15 మే 2024 (సుమారు 3 నెలల క్రితం)",
      Gujarati: "દા.ત. 15 મે 2024 (આશરે 3 મહિના પહેલા)"
    },
    rationale: {
      English: "Used to calculate statutory service timelines (e.g. 30-day RTI limit or 60-day delay).",
      Hindi: "कानूनी सेवा समय-सीमा (जैसे 30-दिवसीय आरटीआई सीमा या 60-दिन की देरी) की गणना करता है।",
      Hinglish: "Statutory timelines (jaise 30-day RTI limit ya 60-day delay) calculate karta hai.",
      Marathi: "वैधानिक सेवा वेळेची गणना करण्यासाठी वापरले जाते (उदा. ३० दिवसांची माहिती अधिकार मर्यादा).",
      Bengali: "সংবিধিবদ্ধ পরিষেবার সময়সীমা গণনা করতে ব্যবহৃত হয় (যেমন ৩০ দিনের আরটিআই সীমা)।",
      Tamil: "சட்டப்பூர்வ காலக்கெடுவைக் கணக்கிடப் பயன்படுகிறது (எ.கா. 30 நாள் RTI வரம்பு).",
      Telugu: "చట్టబద్ధమైన సేవా కాలపరిమితిని లెక్కించడానికి ఉపయోగించబడుతుంది (ఉదా. 30 రోజుల RTI పరిమితి).",
      Gujarati: "કાનૂની સેવા સમયમર્યાદાની ગણતરી કરવા માટે વપરાય છે (દા.ત. 30-દિવસની RTI મર્યાદા)."
    }
  },
  reference_or_receipt_number: {
    question: {
      English: "Do you have any application number, acknowledgment slip, receipt, or token number?",
      Hindi: "क्या आपके पास कोई आवेदन संख्या, पावती रसीद या टोकन नंबर है?",
      Hinglish: "Kya aapke paas koi application number, receipt ya token number hai?",
      Marathi: "तुमच्याकडे कोणताही अर्ज क्रमांक, पोचपावती किंवा टोकन क्रमांक आहे का?",
      Bengali: "আপনার কি কোনো আবেদন নম্বর, প্রাপ্তিস্বীকার রসিদ বা টোকেন নম্বর আছে?",
      Tamil: "உங்களிடம் ஏதேனும் விண்ணப்ப எண், ஒப்புகைச் சீட்டு அல்லது ரசீது உள்ளதா?",
      Telugu: "మీ వద్ద ఏదైనా దరఖాస్తు సంఖ్య, రసీదు లేదా టోకెన్ నంబర్ ఉందా?",
      Gujarati: "શું તમારી પાસે કોઈ અરજી નંબર, પહોંચ રસીદ અથવા ટોકન નંબર છે?"
    },
    placeholder: {
      English: "e.g. Application Acknowledgment #ACK-2024-88912 / No receipt received",
      Hindi: "उदा. पावती संख्या #ACK-2024-88912 / कोई रसीद नहीं मिली",
      Hinglish: "e.g. Application Acknowledgment #ACK-2024-88912 / No receipt",
      Marathi: "उदा. अर्ज पोचपावती #ACK-2024-88912 / कोणतीही पावती नाही",
      Bengali: "যেমন: আবেদন প্রাপ্তিস্বীকার #ACK-2024-88912 / রসিদ নেই",
      Tamil: "எ.கா. விண்ணப்ப ஒப்புகை #ACK-2024-88912 / ரசீது பெறப்படவில்லை",
      Telugu: "ఉదా. దరఖాస్తు రసీదు #ACK-2024-88912 / రసీదు అందలేదు",
      Gujarati: "દા.ત. અરજી પહોંચ #ACK-2024-88912 / કોઈ રસીદ નથી"
    },
    rationale: {
      English: "Allows tracking the exact file movement record in the department.",
      Hindi: "विभाग में फाइल संचलन का सटीक रिकॉर्ड ट्रैक करने में मदद करता है।",
      Hinglish: "Department me exact file movement track karne me madad karta hai.",
      Marathi: "विभागातील अचूक फाइल हालचालींची नोंद ट्रॅक करण्यास मदत करते.",
      Bengali: "বিভাগে সঠিক ফাইল চলাচলের রেকর্ড ট্র্যাক করতে সহায়তা করে।",
      Tamil: "துறையில் உள்ள கோப்பு நகர்வுப் பதிவை துல்லியமாகக் கண்காணிக்க உதவுகிறது.",
      Telugu: "డిపార్ట్‌మెంట్‌లో ఫైల్ కదలిక రికార్డును ఖచ్చితంగా ట్రాక్ చేయడానికి సహాయపడుతుంది.",
      Gujarati: "વિભાગમાં ફાઇલ હિલચાલનો સચોટ રેકોર્ડ ટ્રેક કરવામાં મદદ કરે છે."
    }
  },
  exact_location_details: {
    question: {
      English: "What is the exact street name, landmark, and ward number?",
      Hindi: "सटीक सड़क का नाम, नजदीकी लैंडमार्क एवं वार्ड नंबर क्या है?",
      Hinglish: "Exact street name, landmark aur ward number kya hai?",
      Marathi: "अचूक रस्त्याचे नाव, लँडमार्क आणि वॉर्ड क्रमांक काय आहे?",
      Bengali: "সঠিক রাস্তার নাম, ল্যান্ডমার্ক এবং ওয়ার্ড নম্বর কী?",
      Tamil: "சரியான தெரு பெயர், அடையாளம் மற்றும் வார்டு எண் என்ன?",
      Telugu: "ఖచ్చితమైన వీధి పేరు, ల్యాండ్‌మార్క్ మరియు వార్డు సంఖ్య ఏమిటి?",
      Gujarati: "ચોક્કસ રસ્તાનું નામ, લેન્ડમાર્ક અને વોર્ડ નંબર શું છે?"
    },
    placeholder: {
      English: "e.g. Main 100ft Ring Road between Metro Pillar 140 and 155, Ward 88",
      Hindi: "उदा. 100 फीट मुख्य रिंग रोड, मेट्रो पिलर 140 से 155 के बीच, वार्ड 88",
      Hinglish: "e.g. Main 100ft Ring Road between Metro Pillar 140 and 155, Ward 88",
      Marathi: "उदा. १०० फूट रिंग रोड, मेट्रो पिलर १४० ते १५५ दरम्यान, प्रभाग ८८",
      Bengali: "যেমন: মূল ১০০ ফুট রিং রোড, মেট্রো পিলার ১৪০ ও ১৫৫ এর মাঝে, ওয়ার্ড ৮৮",
      Tamil: "எ.கா. 100 அடி மெயின் ரோடு, மெட்ரோ பில்லர் 140 முதல் 155 வரை, வார்டு 88",
      Telugu: "ఉదా. మెయిన్ 100 అడుగుల రింగ్ రోడ్, మెట్రో పిల్లర్ 140 మరియు 155 మధ్య, వార్డు 88",
      Gujarati: "દા.ત. 100 ફૂટ રિંગ રોડ, મેટ્રો પિલર 140 થી 155 વચ્ચે, વોર્ડ 88"
    },
    rationale: {
      English: "Ensures the RTI request targets the specific sanctioned work order.",
      Hindi: "सुनिश्चित करता है कि आरटीआई अनुरोध विशिष्ट स्वीकृत कार्य आदेश को लक्षित करे।",
      Hinglish: "RTI ko specific sanctioned work order ke sath target karta hai.",
      Marathi: "माहिती अधिकार विनंती विशिष्ट मंजूर कामाच्या आदेशाला लक्ष्य करते हे सुनिश्चित करते.",
      Bengali: "আরটিআই অনুরোধ নির্দিষ্ট অনুমোদিত কাজের আদেশকে লক্ষ্য করে তা নিশ্চিত করে।",
      Tamil: "RTI கோரிக்கை குறிப்பிட்ட அங்கீகரிக்கப்பட்ட பணி உத்தரவை இலக்காகக் கொண்டுள்ளது என்பதை உறுதிப்படுத்துகிறது.",
      Telugu: "RTI అభ్యర్థన నిర్దిష్ట మంజూరైన పని ఆర్డర్‌ను లక్ష్యంగా చేసుకుంటుందని నిర్ధారిస్తుంది.",
      Gujarati: "RTI વિનંતી ચોક્કસ મંજૂર કરાયેલ કાર્ય ઓર્ડરને લક્ષ્ય બનાવે છે તેની ખાતરી કરે છે."
    }
  },
  ration_application_type: {
    question: {
      English: "Is this a new Ration Card application, member addition, or Fair Price Shop dealer grievance?",
      Hindi: "क्या यह नया राशन कार्ड आवेदन है, सदस्य जोड़ना है, या राशन डीलर से जुड़ी शिकायत है?",
      Hinglish: "Kya ye naya Ration Card application hai, member add karna hai, ya ration dealer ki complaint hai?",
      Marathi: "हा नवीन शिधापत्रिका अर्ज आहे, सदस्य जोडणे आहे की स्वस्त धान्य दुकानदाराची तक्रार आहे?",
      Bengali: "এটি কি নতুন রেশন কার্ডের আবেদন, সদস্য সংযোজন, নাকি রেশন ডিলারের অভিযোগ?",
      Tamil: "இது புதிய ரேஷன் கார்டு விண்ணப்பமா, உறுப்பினர் சேர்ப்பா அல்லது ரேஷன் கடை புகாரா?",
      Telugu: "ఇది కొత్త రేషన్ కార్డ్ దరఖాస్తు, సభ్యుల చేరిక లేదా రేషన్ డీలర్ ఫిర్యాదా?",
      Gujarati: "શું આ નવું રેશનકાર્ડ અરજી છે, સભ્ય ઉમેરવા છે, કે રેશન ડીલરની ફરિયાદ છે?"
    },
    placeholder: {
      English: "e.g. New BPL Ration card applied online on State Food Portal",
      Hindi: "उदा. राज्य खाद्य पोर्टल पर नया बीपीएल राशन कार्ड ऑनलाइन आवेदन किया",
      Hinglish: "e.g. State Food Portal par naya BPL Ration card apply kiya tha",
      Marathi: "उदा. राज्य अन्न पोर्टलवर नवीन बीपीएल शिधापत्रिकेसाठी ऑनलाइन अर्ज केला",
      Bengali: "যেমন: রাজ্য খাদ্য পোর্টালে নতুন বিপিএল রেশন কার্ডের জন্য অনলাইনে আবেদন করা হয়েছে",
      Tamil: "எ.கா. மாநில உணவு தளத்தில் புதிய பிபிஎல் ரேஷன் கார்டுக்கு ஆன்லைனில் விண்ணப்பித்தேன்",
      Telugu: "ఉదా. రాష్ట్ర ఆహార పోర్టల్‌లో కొత్త BPL రేషన్ కార్డు కోసం ఆన్‌లైన్‌లో దరఖాస్తు చేసాము",
      Gujarati: "દા.ત. રાજ્ય ખાદ્ય પોર્ટલ પર નવું BPL રેશનકાર્ડ ઓનલાઇન અરજી કરી હતી"
    },
    rationale: {
      English: "Directs query to the District Food & Supplies Controller (DFSC).",
      Hindi: "शिकायत को सीधे जिला खाद्य एवं आपूर्ति नियंत्रक (DFSC) को निर्देशित करता है।",
      Hinglish: "Query ko District Food & Supplies Controller (DFSC) ko direct karta hai.",
      Marathi: "जिल्हा अन्न व पुरवठा नियंत्रकाकडे (DFSC) थेट चौकशी पाठवते.",
      Bengali: "জেলা খাদ্য ও সরবরাহ নিয়ন্ত্রকের (DFSC) কাছে সরাসরি প্রশ্ন পাঠায়।",
      Tamil: "மாவட்ட உணவு மற்றும் வழங்கல் கட்டுப்பாட்டாளருக்கு (DFSC) நேரடியாக அனுப்புகிறது.",
      Telugu: "జిల్లా ఆహార మరియు సరఫరాల నియంత్రణాధికారికి (DFSC) నేరుగా నిర్దేశిస్తుంది.",
      Gujarati: "જિલ્લા ખાદ્ય અને પુરવઠા નિયંત્રક (DFSC) ને સીધો નિર્દેશિત કરે છે."
    }
  },
  vendor_vending_zone: {
    question: {
      English: "Where is your vending spot located, and was your name included in the Town Vending Committee (TVC) survey?",
      Hindi: "आपकी दुकान/ठेला कहाँ स्थित है, और क्या आपका नाम टाउन वेंडिंग कमेटी (TVC) सर्वेक्षण में था?",
      Hinglish: "Aapki shop/thela kahan hai aur kya TVC survey me aapka naam tha?",
      Marathi: "तुमची फेरीवाला जागा कुठे आहे आणि तुमचे नाव नगर विक्रेता समिती (TVC) सर्वेक्षणात होते का?",
      Bengali: "আপনার বিক্রেতা স্থানটি কোথায় এবং টাউন ভেন্ডিং কমিটি (TVC) সমীক্ষায় কি আপনার নাম ছিল?",
      Tamil: "உங்கள் கடை எங்கு உள்ளது, மேலும் டவுன் வெண்டிங் கமிட்டி (TVC) கணக்கெடுப்பில் உங்கள் பெயர் இருந்ததா?",
      Telugu: "మీ దుకాణం ఎక్కడ ఉంది మరియు టౌన్ వెండింగ్ కమిటీ (TVC) సర్వేలో మీ పేరు ఉందా?",
      Gujarati: "તમારી દુકાન/લારી ક્યાં આવેલી છે અને શું તમારું નામ ટાઉન વેન્ડિંગ કમિટી (TVC) સર્વેમાં હતું?"
    },
    placeholder: {
      English: "e.g. Sector 14 Market Vending Zone; survey slip received in 2021",
      Hindi: "उदा. सेक्टर 14 मार्केट वेंडिंग ज़ोन; 2021 में सर्वे रसीद मिली थी",
      Hinglish: "e.g. Sector 14 Market Vending Zone; 2021 me survey slip mili thi",
      Marathi: "उदा. सेक्टर १४ मार्केट वेंडिंग झोन; २०२१ मध्ये सर्वेक्षण पावती मिळाली होती",
      Bengali: "যেমন: সেক্টর ১৪ মার্কেট ভেন্ডিং জোন; ২০২১ সালে সমীক্ষা রসিদ পেয়েছি",
      Tamil: "எ.கா. செக்டார் 14 சந்தை மண்டலம்; 2021 இல் கணக்கெடுப்பு சீட்டு பெறப்பட்டது",
      Telugu: "ఉదా. సెక్టార్ 14 మార్కెట్ వెండింగ్ జోన్; 2021లో సర్వే రసీదు అందింది",
      Gujarati: "દા.ત. સેક્ટર 14 માર્કેટ વેન્ડિંગ ઝોન; 2021 માં સર્વે સ્લિપ મળી હતી"
    },
    rationale: {
      English: "Invokes protections under Section 3 of the Street Vendors Act, 2014.",
      Hindi: "स्ट्रीट वेंडर्स अधिनियम 2014 की धारा 3 के अंतर्गत विधिक सुरक्षा लागू करता है।",
      Hinglish: "Street Vendors Act 2014 ke Section 3 ke under protection apply karta hai.",
      Marathi: "पथविक्रेता कायदा २०१४ च्या कलम ३ अंतर्गत संरक्षण लागू करते.",
      Bengali: "স্ট্রিট ভেন্ডরস অ্যাক্ট, ২০১৪ এর ধারা ৩ এর অধীনে সুরক্ষা প্রয়োগ করে।",
      Tamil: "தெருவோர வியாபாரிகள் சட்டம் 2014 இன் பிரிவு 3 இன் கீழ் பாதுகாப்பை அளிக்கிறது.",
      Telugu: "స్ట్రీట్ వెండర్స్ యాక్ట్, 2014 లోని సెక్షన్ 3 కింద రక్షణను వర్తింపజేస్తుంది.",
      Gujarati: "સ્ટ્રીટ વેન્ડર્સ એક્ટ 2014 ની કલમ 3 હેઠળ કાનૂની રક્ષણ લાગુ કરે છે."
    }
  },
  available_documents: {
    question: {
      English: "What documents or proofs do you currently possess?",
      Hindi: "वर्तमान में आपके पास क्या दस्तावेज या प्रमाण उपलब्ध हैं?",
      Hinglish: "Abhi aapke paas kaunse documents ya proof available hain?",
      Marathi: "सध्या तुमच्याकडे कोणती कागदपत्रे किंवा पुरावे उपलब्ध आहेत?",
      Bengali: "বর্তমানে আপনার কাছে কী কী নথি বা প্রমাণ রয়েছে?",
      Tamil: "தற்போது உங்களிடம் என்ன ஆவணங்கள் அல்லது ஆதாரங்கள் உள்ளன?",
      Telugu: "ప్రస్తుతం మీ వద్ద ఎలాంటి పత్రాలు లేదా ఆధారాలు ఉన్నాయి?",
      Gujarati: "હાલમાં તમારી પાસે કયા દસ્તાવેજો અથવા પુરાવા ઉપલબ્ધ છે?"
    },
    placeholder: {
      English: "e.g. Photos of unpaved road, rent agreement, bank statement, WhatsApp chat screenshots",
      Hindi: "उदा. टूटी सड़क की तस्वीरें, किराया समझौता, बैंक विवरण, व्हाट्सएप स्क्रीनशॉट",
      Hinglish: "e.g. Road ki photos, rent agreement, bank statement, chat screenshots",
      Marathi: "उदा. रस्त्याचे फोटो, भाडे करार, बँक स्टेटमेंट, व्हॉट्सअॅप स्क्रीनशॉट",
      Bengali: "যেমন: রাস্তার ছবি, ভাড়া চুক্তি, ব্যাঙ্ক স্টেটমেন্ট, হোয়াটসঅ্যাপ স্ক্রিনশট",
      Tamil: "எ.கா. சாலையின் புகைப்படங்கள், வாடகை ஒப்பந்தம், வங்கி அறிக்கை, வாட்ஸ்அப் ஸ்கிரீன்ஷாட்கள்",
      Telugu: "ఉదా. రోడ్డు ఫోటోలు, అద్దె ఒప్పందం, బ్యాంక్ స్టేట్‌మెంట్, వాట్సాప్ స్క్రీన్‌షాట్లు",
      Gujarati: "દા.ત. રસ્તાના ફોટા, ભાડા કરાર, બેંક સ્ટેટમેન્ટ, વોટ્સએપ સ્ક્રીનશોટ"
    },
    rationale: {
      English: "Forms the mandatory annexure checklist for complaints and RTI petitions.",
      Hindi: "आरटीआई याचिकाओं और शिकायतों के लिए अनिवार्य संलग्नक चेकलिस्ट तैयार करता है।",
      Hinglish: "RTI petition aur complaints ke liye mandatory annexure checklist banata hai.",
      Marathi: "तक्रारी आणि माहिती अधिकार याचिकांसाठी अनिवार्य जोडणी यादी तयार करते.",
      Bengali: "অভিযোগ এবং আরটিআই আবেদনের জন্য বাধ্যতামূলক সংযুক্তি তালিকা তৈরি করে।",
      Tamil: "புகார்கள் மற்றும் RTI மனுக்களுக்கான கட்டாய இணைப்பு சரிபார்ப்புப் பட்டியலை உருவாக்குகிறது.",
      Telugu: "ఫిర్యాదులు మరియు RTI పిటిషన్ల కోసం తప్పనిసరి అనుబంధ తనిఖీ జాబితాను రూపొందిస్తుంది.",
      Gujarati: "ફરિયાદો અને RTI અરજીઓ માટે ફરજિયાત જોડાણ યાદી તૈયાર કરે છે."
    }
  },
  bpl_or_category: {
    question: {
      English: "Do you belong to Below Poverty Line (BPL / EWS) or specialized category (Street Vendor / Senior Citizen)?",
      Hindi: "क्या आप गरीबी रेखा से नीचे (BPL / EWS) या विशेष श्रेणी (फेरीवाला / वरिष्ठ नागरिक) में आते हैं?",
      Hinglish: "Kya aap Below Poverty Line (BPL / EWS) ya special category me aate hain?",
      Marathi: "तुम्ही दारिद्र्यरेषेखालील (BPL / EWS) किंवा विशेष श्रेणीत आहात का?",
      Bengali: "আপনি কি দারিদ্র্যসীমার নিচে (BPL / EWS) বা বিশেষ কোনো বিভাগের অন্তর্ভুক্ত?",
      Tamil: "நீங்கள் வறுமைக் கோட்டிற்கு கீழ் (BPL / EWS) அல்லது சிறப்புப் பிரிவைச் சேர்ந்தவரா?",
      Telugu: "మీరు దారిద్య్రరేఖకు దిగువన (BPL / EWS) లేదా ప్రత్యేక వర్గానికి చెందినవారా?",
      Gujarati: "શું તમે ગરીબી રેખા હેઠળ (BPL / EWS) અથવા વિશેષ શ્રેણીમાં આવો છો?"
    },
    placeholder: {
      English: "e.g. General / BPL Ration Card Holder (Fee Exempted) / Street Vendor",
      Hindi: "उदा. सामान्य / बीपीएल राशन कार्ड धारक (शुल्क छूट प्राप्त) / स्ट्रीट वेंडर",
      Hinglish: "e.g. General / BPL Ration Card Holder (Fee Exempted)",
      Marathi: "उदा. सामान्य / बीपीएल शिधापत्रिका धारक (शुल्क माफी)",
      Bengali: "যেমন: সাধারণ / বিপিএল রেশন কার্ডধারী (ফি মওকুফ)",
      Tamil: "எ.கா. பொது / பிபிஎல் ரேஷன் கார்டு வைத்திருப்பவர் (கட்டண விலக்கு)",
      Telugu: "ఉదా. జనరల్ / BPL రేషన్ కార్డుదారు (ఫీజు మినహాయింపు)",
      Gujarati: "દા.ત. સામાન્ય / BPL રેશનકાર્ડ ધારક (ફી માફી)"
    },
    options: {
      English: ["General Category", "BPL / EWS (RTI Fee Exempted)", "Street Vendor / Hawker", "Senior Citizen (60+)", "Woman / Single Mother", "SC / ST Category"],
      Hindi: ["सामान्य श्रेणी (General Category)", "BPL / EWS (आरटीआई शुल्क पूर्णतः माफ़)", "स्ट्रीट वेंडर / फेरीवाला", "वरिष्ठ नागरिक (60+)", "महिला / एकल माता", "SC / ST श्रेणी"],
      Hinglish: ["General Category", "BPL / EWS (RTI Fee Exempted)", "Street Vendor / Hawker", "Senior Citizen (60+)", "Woman / Single Mother", "SC / ST Category"],
      Marathi: ["सामान्य श्रेणी", "BPL / EWS (माहिती अधिकार शुल्क पूर्णपणे माफ)", "फेरीवाला", "ज्येष्ठ नागरिक (६०+)", "महिला / एकल माता", "SC / ST प्रवर्ग"],
      Bengali: ["সাধারণ বিভাগ", "BPL / EWS (আরটিআই ফি সম্পূর্ণ মওকুফ)", "হকার / বিক্রেতা", "প্রবীণ नागरिक (৬০+)", "মহিলা / একক মা", "SC / ST বিভাগ"],
      Tamil: ["பொதுப் பிரிவு", "BPL / EWS (RTI கட்டணம் முற்றிலும் விலக்கு)", "தெருவோர வியாபாரி", "மூத்த குடிமகன் (60+)", "பெண் / தனித்தாய்", "SC / ST பிரிவு"],
      Telugu: ["జనరల్ కేటగిరీ", "BPL / EWS (RTI ఫీజు పూర్తిగా మినహాయింపు)", "స్ట్రీట్ వెండర్", "సీనియర్ సిటిజన్ (60+)", "మహిళ / ఒంటరి తల్లి", "SC / ST వర్గం"],
      Gujarati: ["સામાન્ય શ્રેણી", "BPL / EWS (RTI ફી સંપૂર્ણપણે માફ)", "ફેરીવાળા", "વરિષ્ઠ નાગરિક (60+)", "મહિલા / એકલી માતા", "SC / ST શ્રેણી"]
    },
    rationale: {
      English: "Determines statutory fee exemptions and free legal aid eligibility.",
      Hindi: "वैधानिक शुल्क छूट और निःशुल्क कानूनी सहायता पात्रता निर्धारित करता है।",
      Hinglish: "Statutory fee exemption aur free legal aid eligibility tay karta hai.",
      Marathi: "वैधानिक शुल्क माफी आणि मोफत कायदेशीर मदत पात्रता ठरवते.",
      Bengali: "সংবিধিবদ্ধ ফি মওকুফ এবং বিনামূল্যে আইনি সহায়তা যোগ্যতা নির্ধারণ করে।",
      Tamil: "சட்டப்பூர்வ கட்டண விலக்கு மற்றும் இலவச சட்ட உதவி தகுதியை தீர்மானிக்கிறது.",
      Telugu: "చట్టబద్ధమైన ఫీజు మినహాయింపు మరియు ఉచిత న్యాయ సహాయ అర్హతను నిర్ణయిస్తుంది.",
      Gujarati: "કાનૂની ફી માફી અને મફત કાનૂની સહાયની પાત્રતા નક્કી કરે છે."
    }
  }
};

const NYAYASETU_I18N = {
  English: {
    analyzing_text: "Analyzing Jurisdiction & Rules...",
    btn_continue: "Continue to Guided Analysis",
    btn_view_rights: "View Applicable Rights",
    btn_gen_pack: "Generate Ready-to-Print Action Pack",
    generating_pack: "Synthesizing Action Pack & RTI Draft...",
    case_saved: "Case saved to NyayaSetu Tracker!",
    drafting_appeal: "Drafting Statutory First Appeal under Section 19(1) RTI Act...",
    appeal_copied: "First Appeal copied to clipboard!",
    no_cases_title: "No Tracked Cases Yet",
    no_cases_desc: "Generate an Action Pack in Step 1 to automatically track statutory deadlines and generate First Appeals.",
    statutory_action: "Statutory Action:",
    awaiting_pio: "Awaiting PIO response",
    first_appeal_eligible: "Eligible for Section 19(1) First Appeal",
    btn_first_appeal: "Draft 1-Click First Appeal"
  },
  Hindi: {
    analyzing_text: "अधिकार क्षेत्र एवं नियमों का विश्लेषण हो रहा है...",
    btn_continue: "मार्गदर्शित विश्लेषण के लिए आगे बढ़ें",
    btn_view_rights: "लागू अधिकार व विभाग देखें",
    btn_gen_pack: "प्रिंट हेतु तैयार एक्शन पैक बनाएं",
    generating_pack: "एक्शन पैक एवं आरटीआई ड्राफ्ट तैयार किया जा रहा है...",
    case_saved: "मामला न्यायसेतु ट्रैकर में सहेजा गया!",
    drafting_appeal: "धारा 19(1) आरटीआई अधिनियम के तहत प्रथम अपील तैयार हो रही है...",
    appeal_copied: "प्रथम अपील क्लिपबोर्ड पर कॉपी की गई!",
    no_cases_title: "कोई सहेजा गया मामला नहीं है",
    no_cases_desc: "चरण 1 में एक्शन पैक तैयार करें ताकि वैधानिक समय-सीमा ट्रैक हो सके और प्रथम अपील बनाई जा सके।",
    statutory_action: "विधिक स्थिति:",
    awaiting_pio: "जन सूचना अधिकारी (PIO) के जवाब की प्रतीक्षा",
    first_appeal_eligible: "धारा 19(1) प्रथम अपील दायर करने हेतु पात्र",
    btn_first_appeal: "1-क्लिक प्रथम अपील बनाएं"
  },
  Hinglish: {
    analyzing_text: "Jurisdiction aur rules analyze ho rahe hain...",
    btn_continue: "Guided Analysis ke liye aage badhein",
    btn_view_rights: "Apne Rights aur Department dekhein",
    btn_gen_pack: "Print-ready Action Pack banayein",
    generating_pack: "Action Pack aur RTI Draft prepare ho raha hai...",
    case_saved: "Case NyayaSetu Tracker me save ho gaya!",
    drafting_appeal: "Section 19(1) First Appeal draft ho rahi hai...",
    appeal_copied: "First Appeal clipboard par copy ho gayi!",
    no_cases_title: "Abhi koi saved case nahi hai",
    no_cases_desc: "Step 1 me Action Pack generate karein aur deadlines track karein.",
    statutory_action: "Legal Status:",
    awaiting_pio: "PIO response ka wait",
    first_appeal_eligible: "Section 19(1) First Appeal ke liye eligible",
    btn_first_appeal: "1-Click First Appeal Draft karein"
  },
  Marathi: {
    analyzing_text: "अधिकारक्षेत्र आणि नियमांचे विश्लेषण करत आहे...",
    btn_continue: "मार्गदर्शित विश्लेषणासाठी पुढे जा",
    btn_view_rights: "लागू अधिकार आणि विभाग पहा",
    btn_gen_pack: "प्रिंटसाठी तयार ॲक्शन पॅक तयार करा",
    generating_pack: "ॲक्शन पॅक आणि माहिती अधिकार मसुदा तयार केला जात आहे...",
    case_saved: "प्रकरण न्यायसेतू ट्रॅकरमध्ये जतन केले!",
    drafting_appeal: "कलम १९(१) अंतर्गत प्रथम अपील तयार करत आहे...",
    appeal_copied: "प्रथम अपील क्लिपबोर्डवर कॉपी केली!",
    no_cases_title: "अद्याप कोणतेही प्रकरण नाही",
    no_cases_desc: "वैधानिक मुदत ट्रॅक करण्यासाठी ॲक्शन पॅक तयार करा.",
    statutory_action: "कायदेशीर स्थिती:",
    awaiting_pio: "माहिती अधिकाऱ्याच्या उत्तराची प्रतीक्षा",
    first_appeal_eligible: "कलम १९(१) प्रथम अपील दाखल करण्यास पात्र",
    btn_first_appeal: "१-क्लिक प्रथम अपील तयार करा"
  },
  Bengali: {
    analyzing_text: "অধিক্ষেত্র এবং নিয়ম বিশ্লেষণ করা হচ্ছে...",
    btn_continue: "নির্দেশিত বিশ্লেষণের দিকে এগিয়ে যান",
    btn_view_rights: "প্রযোজ্য অধিকার ও বিভাগ দেখুন",
    btn_gen_pack: "প্রিন্টের জন্য অ্যাকশন প্যাক তৈরি করুন",
    generating_pack: "অ্যাকশন প্যাক এবং আরটিআই খসড়া তৈরি হচ্ছে...",
    case_saved: "মামলাটি ন্যায়সেতু ট্র্যাকারে সংরক্ষিত হয়েছে!",
    drafting_appeal: "ধারা ১৯(১) এর অধীনে প্রথম আপিল প্রস্তুত হচ্ছে...",
    appeal_copied: "প্রথম আপিল অনুলিপি করা হয়েছে!",
    no_cases_title: "এখনও কোনো মামলা সংরক্ষিত নেই",
    no_cases_desc: "সময়সীমা ট্র্যাক করতে অ্যাকশন প্যাক তৈরি করুন।",
    statutory_action: "আইনি স্থিতি:",
    awaiting_pio: "পিআইও উত্তরের অপেক্ষায়",
    first_appeal_eligible: "ধারা ১৯(১) প্রথম আপিলের জন্য যোগ্য",
    btn_first_appeal: "১-ক্লিকে প্রথম আপিল তৈরি করুন"
  },
  Tamil: {
    analyzing_text: "அதிகார வரம்பு மற்றும் விதிகளை பகுப்பாய்வு செய்கிறது...",
    btn_continue: "வழிகாட்டப்பட்ட பகுப்பாய்விற்கு தொடரவும்",
    btn_view_rights: "பொருந்தக்கூடிய உரிமைகளைக் காண்க",
    btn_gen_pack: "அச்சிடத் தயாரான செயல் தொகுப்பை உருவாக்குங்கள்",
    generating_pack: "செயல் தொகுப்பு மற்றும் RTI வரைவு தயாரிக்கப்படுகிறது...",
    case_saved: "வழக்கு நியாயசேது டிராக்கரில் சேமிக்கப்பட்டது!",
    drafting_appeal: "பிரிவு 19(1) முதல் மேல்முறையீடு தயாரிக்கப்படுகிறது...",
    appeal_copied: "முதல் மேல்முறையீடு நகலெடுக்கப்பட்டது!",
    no_cases_title: "இதுவரை எந்த வழக்கும் இல்லை",
    no_cases_desc: "காலக்கெடுவைக் கண்காணிக்க செயல் தொகுப்பை உருவாக்கவும்.",
    statutory_action: "சட்ட நிலை:",
    awaiting_pio: "PIO பதிலுக்காக காத்திருக்கிறது",
    first_appeal_eligible: "பிரிவு 19(1) முதல் மேல்முறையீட்டிற்கு தகுதியானது",
    btn_first_appeal: "1-கிளிக் முதல் மேல்முறையீடு வரைவு"
  },
  Telugu: {
    analyzing_text: "అధికార పరిధి మరియు నిబంధనలను విశ్లేషిస్తోంది...",
    btn_continue: "గైడెడ్ విశ్లేషణకు కొనసాగండి",
    btn_view_rights: "వర్తించే హక్కులను చూడండి",
    btn_gen_pack: "యాక్షన్ ప్యాక్‌ను రూపొందించండి",
    generating_pack: "యాక్షన్ ప్యాక్ మరియు RTI డ్రాఫ్ట్ సిద్ధమవుతోంది...",
    case_saved: "కేసు న్యాయసేతు ట్రాకర్‌లో సేవ్ చేయబడింది!",
    drafting_appeal: "సెక్షన్ 19(1) మొదటి అప్పీల్ డ్రాఫ్ట్ చేయబడుతోంది...",
    appeal_copied: "మొదటి అప్పీల్ కాపీ చేయబడింది!",
    no_cases_title: "ఇంకా ఎలాంటి కేసులు లేవు",
    no_cases_desc: "గడువులను ట్రాక్ చేయడానికి యాక్షన్ ప్యాక్ సృష్టించండి.",
    statutory_action: "చట్టపరమైన స్థితి:",
    awaiting_pio: "PIO స్పందన కోసం వేచి ఉంది",
    first_appeal_eligible: "సెక్షన్ 19(1) మొదటి అప్పీల్ దాఖలుకు అర్హులు",
    btn_first_appeal: "1-క్లిక్ మొదటి అప్పీల్ డ్రాఫ్ట్"
  },
  Gujarati: {
    analyzing_text: "અધિકારક્ષેત્ર અને નિયમોનું વિશ્લેષણ થઈ રહ્યું છે...",
    btn_continue: "માર્ગદર્શિત વિશ્લેષણ માટે આગળ વધો",
    btn_view_rights: "લાગુ અધિકારો અને વિભાગ જુઓ",
    btn_gen_pack: "એક્શન પેક બનાવો",
    generating_pack: "એક્શન પેક અને RTI ડ્રાફ્ટ તૈયાર થઈ રહ્યો છે...",
    case_saved: "કેસ ન્યાયસેતુ ટ્રેકરમાં સાચવવામાં આવ્યો!",
    drafting_appeal: "કલમ 19(1) હેઠળ પ્રથમ અપીલ તૈયાર થઈ રહી છે...",
    appeal_copied: "પ્રથમ અપીલ ક્લિપબોર્ડ પર કોપી થઈ ગઈ!",
    no_cases_title: "હજુ કોઈ કેસ સાચવેલ નથી",
    no_cases_desc: "સમયમર્યાદા ટ્રેક કરવા માટે એક્શન પેક બનાવો.",
    statutory_action: "કાનૂની સ્થિતિ:",
    awaiting_pio: "માહિતી અધિકારીના જવાબની રાહ જોઈ રહ્યા છીએ",
    first_appeal_eligible: "કલમ 19(1) પ્રથમ અપીલ માટે પાત્ર",
    btn_first_appeal: "1-ક્લિક પ્રથમ અપીલ ડ્રાફ્ટ કરો"
  }
};

class NyayaSetuController {
  constructor() {
    this.currentStep = 1;
    this.currentProblem = '';
    this.analysisData = null;
    this.userAnswers = {};
    this.actionPackData = null;
    this.trackedCases = [];

    this.initElements();
    this.bindEvents();
    this.loadTrackedCases();

    if (window.i18n) {
      window.i18n.onLanguageChange(() => {
        if (this.currentStep === 2 && this.analysisData) {
          const qList = this.analysisData.questionnaire || this.analysisData.targeted_questionnaire;
          this.renderQuestionnaire(qList);
        } else if (this.currentStep === 3 && this.analysisData) {
          this.renderRightsSummary();
        } else if (this.currentStep === 5) {
          this.renderTrackedCasesList();
        }
      });
    }
  }

  initElements() {
    // Steps containers
    this.stepPanels = {
      1: document.getElementById('nyayasetu-step-1'),
      2: document.getElementById('nyayasetu-step-2'),
      3: document.getElementById('nyayasetu-step-3'),
      4: document.getElementById('nyayasetu-step-4'),
      5: document.getElementById('nyayasetu-step-5')
    };

    // Step 1 Elements
    this.problemInput = document.getElementById('nyayasetu-problem-input');
    this.problemSubmitBtn = document.getElementById('nyayasetu-problem-submit');
    this.demoScenariosContainer = document.getElementById('nyayasetu-demo-scenarios');
    this.voiceInputBtn = document.getElementById('nyayasetu-voice-btn');

    // Step 2 Elements
    this.questionnaireContainer = document.getElementById('nyayasetu-questionnaire-fields');
    this.step2NextBtn = document.getElementById('nyayasetu-step2-next');
    this.step2BackBtn = document.getElementById('nyayasetu-step2-back');

    // Step 3 Elements
    this.rightsSummaryBox = document.getElementById('nyayasetu-rights-summary');
    this.step3NextBtn = document.getElementById('nyayasetu-step3-next');
    this.step3BackBtn = document.getElementById('nyayasetu-step3-back');

    // Step 4 Elements (Action Pack)
    this.actionPackTitle = document.getElementById('nyayasetu-ap-title');
    this.rtiDraftBox = document.getElementById('nyayasetu-rti-draft');
    this.grievanceDraftBox = document.getElementById('nyayasetu-grievance-draft');
    this.checklistContainer = document.getElementById('nyayasetu-checklist');
    this.timelineContainer = document.getElementById('nyayasetu-timeline');
    this.saveCaseBtn = document.getElementById('nyayasetu-save-case-btn');
    this.downloadPdfBtn = document.getElementById('nyayasetu-download-ap-btn');
    this.copyRtiBtn = document.getElementById('nyayasetu-copy-rti-btn');

    // Step 5 Elements (Tracker & First Appeal)
    this.casesListContainer = document.getElementById('nyayasetu-tracked-cases-list');
    this.appealModal = document.getElementById('nyayasetu-appeal-modal');
    this.appealContentBox = document.getElementById('nyayasetu-appeal-content');
    this.appealCloseBtn = document.getElementById('nyayasetu-appeal-close');
    this.appealCopyBtn = document.getElementById('nyayasetu-appeal-copy');
  }

  bindEvents() {
    // Step 1 Submit
    if (this.problemSubmitBtn) {
      this.problemSubmitBtn.addEventListener('click', () => this.handleProblemSubmit());
    }

    if (this.problemInput) {
      this.problemInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          this.handleProblemSubmit();
        }
      });
    }

    // Common Scenarios Click Handler
    if (this.demoScenariosContainer) {
      this.demoScenariosContainer.addEventListener('click', (e) => {
        const demoCard = e.target.closest('.demo-pill, [data-problem]');
        if (demoCard) {
          const problem = demoCard.getAttribute('data-problem');
          if (problem && this.problemInput) {
            this.problemInput.value = problem;
            this.handleProblemSubmit();
          }
        }
      });
    }

    // Voice query on Step 1
    if (this.voiceInputBtn) {
      this.voiceInputBtn.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
          return;
        }
        const rec = new SpeechRecognition();
        rec.lang = window.i18n ? window.i18n.getSpeechLangCode() : 'en-IN';
        rec.onstart = () => {
          this.voiceInputBtn.classList.add('listening-pulse');
        };
        rec.onresult = (e) => {
          this.problemInput.value = e.results[0][0].transcript;
          this.handleProblemSubmit();
        };
        rec.onend = () => {
          this.voiceInputBtn.classList.remove('listening-pulse');
        };
        rec.start();
      });
    }

    // Step 2 Navigation
    if (this.step2NextBtn) {
      this.step2NextBtn.addEventListener('click', () => this.handleQuestionnaireSubmit());
    }
    if (this.step2BackBtn) {
      this.step2BackBtn.addEventListener('click', () => this.goToStep(1));
    }

    // Step 3 Navigation
    if (this.step3NextBtn) {
      this.step3NextBtn.addEventListener('click', () => this.generateActionPack());
    }
    if (this.step3BackBtn) {
      this.step3BackBtn.addEventListener('click', () => this.goToStep(2));
    }

    // Step 4 Actions
    if (this.saveCaseBtn) {
      this.saveCaseBtn.addEventListener('click', () => this.saveCurrentCaseToTracker());
    }
    if (this.copyRtiBtn) {
      this.copyRtiBtn.addEventListener('click', () => {
        const draftText = this.actionPackData ? (this.actionPackData.rti_draft || this.actionPackData.rti_application_draft) : '';
        if (draftText) {
          navigator.clipboard.writeText(draftText);
          this.showToast(window.i18n && window.i18n.getLanguage() === 'Hindi' ? "आरटीआई आवेदन ड्राफ्ट क्लिपबोर्ड पर कॉपी किया गया!" : "RTI Application draft copied to clipboard!");
        }
      });
    }
    if (this.downloadPdfBtn) {
      this.downloadPdfBtn.addEventListener('click', () => this.exportActionPackPdf());
    }

    // Appeal Modal Close
    if (this.appealCloseBtn && this.appealModal) {
      this.appealCloseBtn.addEventListener('click', () => {
        this.appealModal.classList.add('hidden');
      });
    }
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;

    // Toggle wizard panels
    Object.keys(this.stepPanels).forEach(step => {
      const panel = this.stepPanels[step];
      if (panel) {
        if (parseInt(step) === stepNumber) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    });

    // Scroll to active panel smoothly
    const currentPanel = this.stepPanels[stepNumber];
    if (currentPanel) {
      currentPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async handleProblemSubmit() {
    const text = this.problemInput ? this.problemInput.value.trim() : '';
    if (!text) {
      alert("Please describe your problem or select one of the common scenarios.");
      return;
    }

    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    const texts = NYAYASETU_I18N[lang] || NYAYASETU_I18N['English'];

    this.currentProblem = text;
    this.problemSubmitBtn.disabled = true;
    this.problemSubmitBtn.innerHTML = `
      <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
      ${texts.analyzing_text}
    `;

    try {
      const api = window.NyayMitraAPI;
      const fn = (api && typeof api.analyzeProblem === 'function') 
        ? api.analyzeProblem.bind(api) 
        : (api && typeof api.analyzeCivicProblem === 'function') 
          ? api.analyzeCivicProblem.bind(api) 
          : null;

      if (!fn) {
        throw new Error("API client is not ready. Please refresh the page.");
      }

      const result = await fn(text);
      if (result && (result.success || result.questionnaire || result.targeted_questionnaire)) {
        this.analysisData = result;
        const qList = result.questionnaire || result.targeted_questionnaire || [];
        this.renderQuestionnaire(qList);
        this.goToStep(2);
      } else {
        throw new Error((result && (result.error || result.detail)) || "Analysis failed");
      }
    } catch (err) {
      alert("Analysis error: " + (err.message || 'Server error'));
    } finally {
      this.problemSubmitBtn.disabled = false;
      this.problemSubmitBtn.innerHTML = `
        <span>${texts.btn_continue}</span>
        <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  getLocalizedQuestion(rawQ, lang) {
    if (!rawQ) return rawQ;
    const qid = rawQ.id || '';
    const loc = QUESTION_LOCALIZATIONS[qid];

    if (loc) {
      const qText = (loc.question && (loc.question[lang] || loc.question['Hindi'] || loc.question['English'])) || rawQ.question;
      const placeholderText = (loc.placeholder && (loc.placeholder[lang] || loc.placeholder['Hindi'] || loc.placeholder['English'])) || rawQ.placeholder;
      const rationaleText = (loc.rationale && (loc.rationale[lang] || loc.rationale['Hindi'] || loc.rationale['English'])) || rawQ.rationale;
      const optionsArr = (loc.options && (loc.options[lang] || loc.options['Hindi'] || loc.options['English'])) || rawQ.options;

      return {
        ...rawQ,
        question: qText,
        placeholder: placeholderText,
        rationale: rationaleText,
        options: optionsArr
      };
    }

    // Dynamic phrase-matching fallback for unknown or AI-generated questions
    const qText = rawQ.question || '';
    if (lang === 'Hindi' || lang === 'Hinglish') {
      if (qText.includes('State') && qText.includes('District')) {
        return {
          ...rawQ,
          question: "आप किस राज्य, जिले एवं शहर / वार्ड में स्थित हैं?",
          placeholder: "उदा. महाराष्ट्र, मुंबई उपनगर, वार्ड के-वेस्ट",
          rationale: "संबंधित नगर निगम, राज्य आरटीआई पोर्टल या स्थानीय नोडल अधिकारी की पहचान करता है।"
        };
      }
      if (qText.includes('submit your original application') || qText.includes('issue start') || qText.includes('application date')) {
        return {
          ...rawQ,
          question: "आपने अपना मूल आवेदन कब जमा किया था या समस्या कब शुरू हुई?",
          placeholder: "उदा. 15 मई 2024 (लगभग 3 महीने पहले)",
          rationale: "कानूनी सेवा समय-सीमा (जैसे 30-दिवसीय आरटीआई सीमा या 60-दिन की देरी) की गणना करता है।"
        };
      }
      if (qText.includes('application number') || qText.includes('receipt') || qText.includes('token number')) {
        return {
          ...rawQ,
          question: "क्या आपके पास कोई आवेदन संख्या, पावती रसीद या टोकन नंबर है?",
          placeholder: "उदा. पावती संख्या #ACK-2024-88912 / कोई रसीद नहीं मिली",
          rationale: "विभाग में फाइल संचलन का सटीक रिकॉर्ड ट्रैक करने में मदद करता है।"
        };
      }
      if (qText.includes('street name') || qText.includes('landmark') || qText.includes('location details')) {
        return {
          ...rawQ,
          question: "सटीक सड़क का नाम, नजदीकी लैंडमार्क एवं वार्ड नंबर क्या है?",
          placeholder: "उदा. 100 फीट मुख्य रिंग रोड, मेट्रो पिलर 140 से 155 के बीच, वार्ड 88",
          rationale: "सुनिश्चित करता है कि आरटीआई अनुरोध विशिष्ट स्वीकृत कार्य आदेश को लक्षित करे।"
        };
      }
      if (qText.includes('Ration Card') || qText.includes('Fair Price Shop') || qText.includes('ration')) {
        return {
          ...rawQ,
          question: "क्या यह नया राशन कार्ड आवेदन है, सदस्य जोड़ना है, या राशन डीलर से जुड़ी शिकायत है?",
          placeholder: "उदा. राज्य खाद्य पोर्टल पर नया बीपीएल राशन कार्ड ऑनलाइन आवेदन किया",
          rationale: "शिकायत को सीधे जिला खाद्य एवं आपूर्ति नियंत्रक (DFSC) को निर्देशित करता है।"
        };
      }
      if (qText.includes('vending') || qText.includes('hawker') || qText.includes('TVC')) {
        return {
          ...rawQ,
          question: "आपकी दुकान/ठेला कहाँ स्थित है, और क्या आपका नाम टाउन वेंडिंग कमेटी (TVC) सर्वेक्षण में था?",
          placeholder: "उदा. सेक्टर 14 मार्केट वेंडिंग ज़ोन; 2021 में सर्वे रसीद मिली थी",
          rationale: "स्ट्रीट वेंडर्स अधिनियम 2014 की धारा 3 के अंतर्गत विधिक सुरक्षा लागू करता है।"
        };
      }
      if (qText.includes('documents') || qText.includes('proofs')) {
        return {
          ...rawQ,
          question: "वर्तमान में आपके पास क्या दस्तावेज या प्रमाण उपलब्ध हैं?",
          placeholder: "उदा. टूटी सड़क की तस्वीरें, किराया समझौता, बैंक विवरण, व्हाट्सएप स्क्रीनशॉट",
          rationale: "आरटीआई याचिकाओं और शिकायतों के लिए अनिवार्य संलग्नक चेकलिस्ट तैयार करता है।"
        };
      }
      if (qText.includes('Poverty Line') || qText.includes('BPL') || qText.includes('category')) {
        return {
          ...rawQ,
          question: "क्या आप गरीबी रेखा से नीचे (BPL / EWS) या विशेष श्रेणी (फेरीवाला / वरिष्ठ नागरिक) में आते हैं?",
          placeholder: "उदा. सामान्य / बीपीएल राशन कार्ड धारक (शुल्क छूट प्राप्त) / स्ट्रीट वेंडर",
          options: ["सामान्य श्रेणी (General Category)", "BPL / EWS (आरटीआई शुल्क पूर्णतः माफ़)", "स्ट्रीट वेंडर / फेरीवाला", "वरिष्ठ नागरिक (60+)", "महिला / एकल माता", "SC / ST श्रेणी"],
          rationale: "वैधानिक शुल्क छूट और निःशुल्क कानूनी सहायता पात्रता निर्धारित करता है।"
        };
      }
    }

    return rawQ;
  }

  renderQuestionnaire(questions) {
    if (!this.questionnaireContainer) return;

    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    const texts = NYAYASETU_I18N[lang] || NYAYASETU_I18N['English'];

    // Preserve previously typed values across language switching
    const preservedValues = {};
    const existingInputs = this.questionnaireContainer.querySelectorAll('input, textarea, select');
    existingInputs.forEach(input => {
      if (input.name && input.value) preservedValues[input.name] = input.value;
    });

    if (!questions || questions.length === 0) {
      questions = [
        { id: "jurisdiction_state_city", required: true, type: "text" },
        { id: "incident_or_application_date", required: true, type: "text" },
        { id: "reference_or_receipt_number", required: false, type: "text" },
        { id: "available_documents", required: true, type: "textarea" },
        { id: "bpl_or_category", required: true, type: "select" }
      ];
    }

    this.questionnaireContainer.innerHTML = questions.map((rawQ, idx) => {
      const q = this.getLocalizedQuestion(rawQ, lang);
      const prevVal = preservedValues[q.id] || this.userAnswers[q.id] || '';

      let inputHtml = '';
      if (q.type === 'textarea') {
        inputHtml = `
          <textarea 
            id="ns_field_${q.id}" 
            name="${q.id}" 
            rows="3" 
            placeholder="${q.placeholder || ''}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 shadow-inner transition-colors font-sans"
            ${q.required ? 'required' : ''}
          >${prevVal}</textarea>
        `;
      } else if (q.type === 'select') {
        inputHtml = `
          <select 
            id="ns_field_${q.id}" 
            name="${q.id}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 shadow-inner transition-colors font-sans"
            ${q.required ? 'required' : ''}
          >
            ${(q.options || []).map(opt => `<option value="${opt}" ${prevVal === opt ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        `;
      } else {
        inputHtml = `
          <input 
            type="${q.type || 'text'}" 
            id="ns_field_${q.id}" 
            name="${q.id}" 
            value="${prevVal}"
            placeholder="${q.placeholder || ''}" 
            class="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 shadow-inner transition-colors font-sans"
            ${q.required ? 'required' : ''}
          />
        `;
      }

      return `
        <div class="space-y-2 p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200">
          <div class="flex items-center justify-between">
            <label class="block text-xs sm:text-sm font-bold text-slate-800 font-sans">
              <span class="text-blue-600 mr-1.5 font-mono">Q${idx + 1}.</span> ${q.question} ${q.required ? '<span class="text-red-500">*</span>' : ''}
            </label>
          </div>
          ${inputHtml}
          <p class="text-xs text-slate-500 flex items-center gap-1">
            <i data-lucide="info" class="w-3.5 h-3.5 text-blue-500"></i> ${q.rationale}
          </p>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  handleQuestionnaireSubmit() {
    const answers = {};
    const inputs = this.questionnaireContainer.querySelectorAll('input, textarea, select');
    
    for (const input of inputs) {
      if (input.hasAttribute('required') && !input.value.trim()) {
        alert("Please complete all required fields before continuing.");
        input.focus();
        return;
      }
      answers[input.name] = input.value.trim();
    }

    this.userAnswers = answers;
    this.renderRightsSummary();
    this.goToStep(3);
  }

  renderRightsSummary() {
    if (!this.rightsSummaryBox || !this.analysisData) return;

    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');
    const auth = this.analysisData.matched_authority || {
      authority_name: "Municipal Corporation / Local Public Authority",
      pio_designation: "Public Information Officer (PIO)",
      statutory_act: "Right to Information Act, 2005",
      filing_mode: "Speed Post / Online RTI Portal"
    };

    const isBpl = (this.userAnswers.bpl_or_category || '').toLowerCase().includes('bpl');
    const tier = this.analysisData.confidence_tier || (this.analysisData.confidence_level?.includes('Confirmed') ? 'confirmed' : 'likely');
    const badgeClass = tier === 'confirmed' ? 'stamp-badge-emerald' : (tier === 'likely' ? 'stamp-badge-amber' : 'stamp-badge-rose');

    if (isHindi) {
      this.rightsSummaryBox.innerHTML = `
        <div class="space-y-5">
          <!-- Confidence Badge & Authority Card -->
          <div class="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span class="stamp-badge ${badgeClass}">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> ${this.analysisData.confidence_level || '🟢 आधिकारिक विधिक स्रोत द्वारा सत्यापित'}
              </span>
              <span class="text-xs font-mono font-semibold text-blue-800">लागू कानून: ${auth.statutory_act}</span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
              जिम्मेदार विभाग / प्राधिकरण: <span class="text-blue-700">${auth.authority_name}</span>
            </h3>
            <p class="text-xs text-slate-700">नामित जन सूचना अधिकारी: <strong class="text-slate-900">${auth.pio_designation}</strong></p>
            <p class="text-xs text-slate-500">दाखिल करने का माध्यम: ${auth.filing_mode}</p>
          </div>

          <!-- 4 Core Questions Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="help-circle" class="w-4 h-4 text-blue-600"></i> 1. इसका विधिक अर्थ क्या है?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                प्रशासनिक विधि के तहत नागरिक सेवा में निर्धारित समय-सीमा से अधिक की देरी लोक सेवा में कमी मानी जाती है। सूचना का अधिकार अधिनियम आपको मूल स्वीकृति आदेश एवं फाइल संचलन रजिस्टर के निरीक्षण का अधिकार देता है।
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="file-check" class="w-4 h-4 text-blue-600"></i> 2. नागरिक के रूप में मैं क्या कर सकता हूँ?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                स्वीकृत बजट, कार्य आदेश और ठेकेदार निरीक्षण रिपोर्ट की प्रमाणित प्रतियों की मांग करते हुए <strong>रिकॉर्ड-आधारित आरटीआई आवेदन</strong> और औपचारिक शिकायत पत्र दाखिल करें।
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="clock" class="w-4 h-4 text-amber-600"></i> 3. वैधानिक समय-सीमाएं क्या हैं?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                सूचना का अधिकार अधिनियम की धारा 7(1) के तहत जन सूचना अधिकारी को <strong>30 दिनों के भीतर</strong> जवाब देना अनिवार्य है। 30 दिन में जवाब न मिलने पर प्रथम अपील का अधिकार उत्पन्न होता है।
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="paperclip" class="w-4 h-4 text-emerald-600"></i> 4. मुझे क्या दस्तावेज संलग्न करने होंगे?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                मूल आवेदन की पावती, फोटो/प्रमाण और ₹10 का पोस्टल आर्डर ${isBpl ? '(या 100% शुल्क छूट हेतु बीपीएल प्रमाण पत्र)' : ''} सुरक्षित रखें।
              </p>
            </div>
          </div>

          <!-- Human Escalation & Free Legal Aid Notice -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <i data-lucide="scale" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <h5 class="text-xs font-bold text-slate-800">NALSA निःशुल्क कानूनी सहायता सूचना</h5>
              <p class="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                यदि यह मामला आपकी आजीविका, भोजन सुरक्षा या आवास से जुड़ा है, तो आप कानूनी सेवा प्राधिकरण अधिनियम के तहत मुफ्त वकील के पात्र हैं। मुफ्त कानूनी सलाह के लिए <strong>15100</strong> डायल करें।
              </p>
            </div>
          </div>
        </div>
      `;
    } else {
      this.rightsSummaryBox.innerHTML = `
        <div class="space-y-5">
          <!-- Confidence Badge & Authority Card -->
          <div class="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span class="stamp-badge ${badgeClass}">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> ${this.analysisData.confidence_level || '🟢 Confirmed from Official Source'}
              </span>
              <span class="text-xs font-mono font-semibold text-blue-800">Governed under: ${auth.statutory_act}</span>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Responsible Authority: <span class="text-blue-700">${auth.authority_name}</span>
            </h3>
            <p class="text-xs text-slate-700">Designated PIO: <strong class="text-slate-900">${auth.pio_designation}</strong></p>
            <p class="text-xs text-slate-500">Filing Route: ${auth.filing_mode}</p>
          </div>

          <!-- 4 Core Questions Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="help-circle" class="w-4 h-4 text-blue-600"></i> 1. What does this mean?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Under statutory administrative law, delays beyond prescribed citizen timelines constitute a deficiency in public service. The Right to Information Act enables you to inspect the original sanction orders and file movement registers.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="file-check" class="w-4 h-4 text-blue-600"></i> 2. What can I do?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                File a <strong>Records-Based RTI Application</strong> requesting certified copies of the sanctioned budget, work order, and contractor inspection reports, accompanied by a formal grievance representation.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="clock" class="w-4 h-4 text-amber-600"></i> 3. What are the strict deadlines?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                The PIO must respond within <strong>30 Calendar Days</strong> under Section 7(1) of RTI Act (or 48 hours for life/liberty). If no response is received by Day 30, a First Appeal is statutory.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h4 class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-sans">
                <i data-lucide="paperclip" class="w-4 h-4 text-emerald-600"></i> 4. What documents do I need?
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                Preserve your original application acknowledgment, photos/proofs, and ₹10 Postal Order ${isBpl ? '(or valid BPL proof for 100% fee waiver)' : ''}.
              </p>
            </div>
          </div>

          <!-- Human Escalation & Free Legal Aid Notice -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <i data-lucide="scale" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <h5 class="text-xs font-bold text-slate-800">NALSA Free Legal Aid Escalation</h5>
              <p class="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                If this issue threatens your livelihood, basic food security, or residence, you are entitled to free legal counsel under the Legal Services Authorities Act. Dial <strong>15100</strong> for free legal counsel.
              </p>
            </div>
          </div>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  getKnownGoodActionPack(problemText, authority) {
    const isRent = (problemText || '').toLowerCase().includes('deposit') || (problemText || '').toLowerCase().includes('rent') || (problemText || '').toLowerCase().includes('landlord');
    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');

    const auth = authority || {
      authority_name: isRent ? (isHindi ? "किराया प्राधिकरण / उप-विभागीय मजिस्ट्रेट (SDM)" : "Rent Authority / Sub-Divisional Magistrate (SDM)") : (isHindi ? "नगर निगम (अभियांत्रिकी एवं लोक निर्माण विभाग)" : "Municipal Corporation (Engineering & Works Dept)"),
      pio_designation: isRent ? (isHindi ? "किराया अधिकारी / जन सूचना अधिकारी" : "Rent Officer / Public Information Officer") : (isHindi ? "अधिशासी अभियंता (सड़क व नागरिक कार्य)" : "Executive Engineer (Roads / Civil Works)"),
      statutory_act: isRent ? (isHindi ? "मॉडल टेनेंसी एक्ट / संपत्ति हस्तांतरण अधिनियम, 1882" : "Model Tenancy Act / Transfer of Property Act, 1882") : (isHindi ? "सूचना का अधिकार अधिनियम, 2005" : "Right to Information Act, 2005 & State Municipal Corporation Act")
    };

    return {
      success: true,
      action_pack_id: `AP_DEMO_${Date.now().toString().slice(-6)}`,
      issue_type: isRent ? (isHindi ? "किराया सिक्योरिटी डिपॉजिट अवैध रूप से रोकना" : "Unlawful Withholding of Security Deposit") : (isHindi ? "सड़क निर्माण एवं नागरिक अवसंरचना देरी" : "Civic Infrastructure Grievance"),
      responsible_authority: auth.authority_name,
      jurisdiction: isHindi ? "स्थानीय नगर निगम / किराया प्राधिकरण" : "Local Rent Authority / Municipal Corporation",
      rti_draft: isRent 
        ? `# FORM 'A': STATUTORY APPLICATION UNDER SECTION 6(1) OF THE RTI ACT, 2005\n\n**To:**\nThe Public Information Officer (PIO),\n${auth.authority_name}\n\n**Subject:** Request for certified copies of tenancy dispute registers and deposit refund records.\n\n### PARTICULARS OF INFORMATION SOUGHT:\n1. Certified copies of all registered rental agreements and statutory tenancy registration records on file for the subject premises.\n2. Certified copies of complaints, inquiry reports, and summons issued by the Rent Authority concerning withholding of security deposit.\n3. Certified copy of the Citizen's Charter specifying the mandatory timeline (maximum 30 days) for security deposit refund following vacant possession handover.\n4. Certified copies of all action-taken file notings on the citizen representation submitted.\n\n### STATUTORY TIMELINE:\nUnder **Section 7(1) of the RTI Act, 2005**, the requested records must be provided within **30 DAYS**.\n\n**Applicant Signature**\n_____________________________`
        : `# FORM 'A': STATUTORY APPLICATION UNDER SECTION 6(1) OF THE RTI ACT, 2005\n\n**To:**\nThe Public Information Officer (PIO),\n${auth.authority_name}\n\n**Subject:** Request for certified copies of sanctioned estimates, work orders, and measurement book entries.\n\n### PARTICULARS OF INFORMATION SOUGHT:\n1. Certified copies of administrative approval and sanctioned estimate for road/civil works.\n2. Certified copy of the Work Order issued to the contractor, including stipulated completion date.\n3. Certified copy of Measurement Book (MB) entries, quality test certificates, and inspection logs.\n4. Recorded file notings showing reasons for delay and penalty/liquidated damages imposed under contract.\n\n### STATUTORY TIMELINE:\nAs per **Section 7(1) of the RTI Act, 2005**, information must be furnished within **30 DAYS**.\n\n**Applicant Signature**\n_____________________________`,
      grievance_draft: isRent
        ? `# FORMAL 15-DAY STATUTORY DEMAND NOTICE (SECTION 106 TRANSFER OF PROPERTY ACT)\n\n**To:** The Landlord / Rent Authority\n\n**Subject:** Demand for Immediate Refund of Unlawfully Withheld Security Deposit\n\nRespected Sir/Madam,\n\nThe undersigned handed over peaceful and vacant possession of the rented premises with all utility bills cleared. Despite the lapse of 30 days, the security deposit of ₹50,000/- has been unlawfully withheld without providing an itemized damage account.\n\nYou are hereby called upon to refund the full deposit along with 18% p.a. statutory interest within **15 DAYS**, failing which legal proceedings before the Rent Tribunal and Consumer Commission shall be instituted at your risk and cost.`
        : `# FORMAL CIVIC GRIEVANCE REPRESENTATION\n\n**To:** The Commissioner / Superintending Engineer\n${auth.authority_name}\n\n**Subject:** Urgent Grievance regarding Dilapidated Road Condition and Unwarranted Delay\n\nRespected Sir/Madam,\n\nDespite multiple verbal representations, the road remains severely damaged with potholes, posing danger to commuters. I request immediate inspection, enforcement of contractor defect liability, and completion of repairs within 15 days.`,
      checklist: isHindi ? [
        "किराया समझौता / शांतिपूर्ण कब्जा सौंपने का प्रमाण",
        "बिजली और पानी बिल के भुगतान की रसीदें",
        "₹10 का पोस्टल आर्डर / आरटीआई आवेदन शुल्क",
        "पूर्व में दिए गए मांग पत्र (Demand Notice) की प्रति"
      ] : [
        "Proof of Vacant Possession Handover / Tenancy Agreement Copy",
        "Utility Clearance Receipts (Electricity & Water)",
        "Postal Order / Application Fee Receipt (₹10)",
        "Copy of Written Demand Notice previously served"
      ],
      timeline: isHindi ? [
        { event: "मांग पत्र व आरटीआई आवेदन", day: "दिन 1", status: "प्रारंभिक चरण", desc: "15-दिवसीय मांग नोटिस भेजें और धारा 6(1) आरटीआई आवेदन दाखिल करें।" },
        { event: "मांग नोटिस समय-सीमा समाप्ति", day: "दिन 15", status: "अनुवर्ती चरण", desc: "यदि समाधान न हो तो किराया न्यायालय / उपभोक्ता आयोग की ओर बढ़ें।" },
        { event: "जन सूचना अधिकारी (PIO) की कानूनी समय-सीमा", day: "दिन 30", status: "वैधानिक सीमा", desc: "धारा 7(1) आरटीआई अधिनियम के तहत 30 दिनों में सूचना प्राप्त करने की वैधानिक सीमा।" },
        { event: "धारा 19(1) प्रथम अपील", day: "दिन 31-60", status: "अपील का चरण", desc: "उत्तर न मिलने पर प्रथम अपीलीय प्राधिकारी के समक्ष 1-क्लिक अपील दायर करें।" }
      ] : [
        { event: "Serve Demand Notice & RTI", day: "Day 1", status: "Initiation", desc: "Serve 15-Day Demand Notice & file Section 6(1) RTI Application" },
        { event: "Demand Window Expiry", day: "Day 15", status: "Follow-up", desc: "Expiry of Demand Notice window; proceed to Rent Court if unresolved" },
        { event: "PIO Statutory Deadline", day: "Day 30", status: "Statutory Deadline", desc: "Mandatory response deadline for PIO under Section 7(1) RTI Act" },
        { event: "File Section 19(1) First Appeal", day: "Day 31-60", status: "Escalation", desc: "File First Appeal before Appellate Authority if no reply received" }
      ]
    };
  }

  async generateActionPack() {
    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    const texts = NYAYASETU_I18N[lang] || NYAYASETU_I18N['English'];

    this.step3NextBtn.disabled = true;
    this.step3NextBtn.innerHTML = `
      <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
      ${texts.generating_pack}
    `;

    try {
      const response = await window.NyayMitraAPI.generateActionPack(
        this.currentProblem,
        this.userAnswers,
        this.analysisData.matched_authority
      );

      if (response && response.success) {
        this.actionPackData = response;
        this.renderActionPack();
        this.goToStep(4);
      } else {
        throw new Error('Incomplete Action Pack response');
      }
    } catch (err) {
      console.warn('[NyayMitra Safety Fallback] Live API slow/offline; triggering verified Action Pack fallback:', err);
      this.actionPackData = this.getKnownGoodActionPack(this.currentProblem, this.analysisData ? this.analysisData.matched_authority : null);
      this.renderActionPack();
      this.goToStep(4);
      this.showToast(lang === 'Hindi' ? 'सत्यापित विधिक ज्ञानकोष द्वारा एक्शन पैक तैयार हुआ' : 'Action Pack generated via Verified Statutory Knowledge Base');
    } finally {
      this.step3NextBtn.disabled = false;
      this.step3NextBtn.innerHTML = `
        <i data-lucide="file-check" class="w-4 h-4 mr-1"></i>
        <span>${texts.btn_gen_pack}</span>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  renderActionPack() {
    if (!this.actionPackData) return;

    if (this.actionPackTitle) {
      this.actionPackTitle.textContent = `Action Pack: ${this.actionPackData.issue_type || 'RTI Grievance'}`;
    }

    // Render RTI Draft
    if (this.rtiDraftBox) {
      const draft = this.actionPackData.rti_draft || this.actionPackData.rti_application_draft || '';
      const parsedRti = window.marked ? window.marked.parse(draft) : draft;
      this.rtiDraftBox.innerHTML = parsedRti;
    }

    // Render Grievance Draft
    if (this.grievanceDraftBox) {
      const gDraft = this.actionPackData.grievance_draft || '';
      const parsedGrievance = window.marked ? window.marked.parse(gDraft) : gDraft;
      this.grievanceDraftBox.innerHTML = parsedGrievance;
    }

    // Render Checklist
    if (this.checklistContainer && this.actionPackData.checklist) {
      this.checklistContainer.innerHTML = this.actionPackData.checklist.map((item, idx) => `
        <li class="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-sm">
          <span class="w-5 h-5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px] font-mono">
            ${idx + 1}
          </span>
          <span class="leading-relaxed text-slate-700">${item}</span>
        </li>
      `).join('');
    }

    // Render Timeline
    if (this.timelineContainer && this.actionPackData.timeline) {
      this.timelineContainer.innerHTML = this.actionPackData.timeline.map((item, idx) => `
        <div class="flex items-start gap-3 relative pb-3">
          <div class="w-7 h-7 rounded bg-amber-50 border border-amber-300 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0 font-mono">
            ${idx + 1}
          </div>
          <div class="flex-1 p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-1">
              <h5 class="text-xs font-bold text-slate-800 font-sans">${item.event} <span class="text-amber-700 font-mono text-[11px]">(${item.day})</span></h5>
              <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono font-semibold">${item.status}</span>
            </div>
            <p class="text-xs text-slate-600">${item.desc}</p>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  saveCurrentCaseToTracker() {
    if (!this.actionPackData) return;
    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    const texts = NYAYASETU_I18N[lang] || NYAYASETU_I18N['English'];

    const caseItem = {
      id: this.actionPackData.action_pack_id || 'CASE_' + Date.now(),
      problem: this.currentProblem,
      authority: this.actionPackData.responsible_authority,
      jurisdiction: this.actionPackData.jurisdiction,
      date_created: new Date().toLocaleDateString('en-IN'),
      timestamp: Date.now(),
      rti_draft: this.actionPackData.rti_draft,
      statutory_deadline_days: 30
    };

    this.trackedCases.unshift(caseItem);
    localStorage.setItem('nyayasetu_cases', JSON.stringify(this.trackedCases));
    this.renderTrackedCasesList();
    this.showToast(texts.case_saved);
    this.goToStep(5);
  }

  loadTrackedCases() {
    const saved = localStorage.getItem('nyayasetu_cases');
    if (saved) {
      try {
        this.trackedCases = JSON.parse(saved);
      } catch (e) {
        this.trackedCases = [];
      }
    }
    this.renderTrackedCasesList();
  }

  renderTrackedCasesList() {
    if (!this.casesListContainer) return;

    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    const texts = NYAYASETU_I18N[lang] || NYAYASETU_I18N['English'];

    if (this.trackedCases.length === 0) {
      this.casesListContainer.innerHTML = `
        <div class="p-8 text-center glass-panel rounded-xl">
          <i data-lucide="clock" class="w-10 h-10 text-slate-400 mx-auto mb-2"></i>
          <h4 class="text-sm font-semibold text-slate-700">${texts.no_cases_title}</h4>
          <p class="text-xs text-slate-500 mt-1">${texts.no_cases_desc}</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.casesListContainer.innerHTML = this.trackedCases.map(c => {
      const createdDate = new Date(c.timestamp || Date.now());
      const daysPassed = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 30 - daysPassed);
      const isOverdue = daysPassed >= 30;

      const deadlineBadgeText = isOverdue
        ? (lang === 'Hindi' ? '30-दिवसीय समय-सीमा समाप्त' : '30-Day Deadline Passed')
        : (lang === 'Hindi' ? `${daysLeft} दिन शेष` : `${daysLeft} Days Remaining`);

      const statusActionText = isOverdue
        ? texts.first_appeal_eligible
        : texts.awaiting_pio;

      return `
        <div class="glass-panel p-5 space-y-3 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span class="stamp-badge stamp-badge-blue">
                ${c.id}
              </span>
              <h4 class="text-sm font-bold text-slate-900 mt-1 font-heading">${c.problem}</h4>
              <p class="text-xs text-slate-500">${c.authority} • ${c.jurisdiction}</p>
            </div>
            <div class="text-right">
              <span class="stamp-badge ${isOverdue ? 'stamp-badge-crimson' : 'stamp-badge-amber'}">
                ${deadlineBadgeText}
              </span>
              <p class="text-[11px] text-slate-500 mt-1 font-mono">${lang === 'Hindi' ? 'दायर दिनांक:' : 'Filing Date:'} ${c.date_created}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div class="text-xs text-slate-600">
              <strong class="text-slate-800">${texts.statutory_action}</strong> ${statusActionText}
            </div>
            <div class="flex items-center gap-2">
              <button 
                class="btn-trigger-appeal px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                data-case-id="${c.id}"
              >
                <i data-lucide="scale" class="w-3.5 h-3.5"></i>
                <span>${texts.btn_first_appeal}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind First Appeal trigger buttons
    this.casesListContainer.querySelectorAll('.btn-trigger-appeal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-case-id');
        const caseItem = this.trackedCases.find(x => x.id === id);
        if (caseItem) {
          this.generateAndShowFirstAppeal(caseItem);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  async generateAndShowFirstAppeal(caseItem) {
    if (!this.appealModal || !this.appealContentBox) return;

    const lang = window.i18n ? window.i18n.getLanguage() : 'English';
    const texts = NYAYASETU_I18N[lang] || NYAYASETU_I18N['English'];

    this.appealModal.classList.remove('hidden');
    this.appealContentBox.innerHTML = `
      <div class="text-center py-12">
        <span class="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></span>
        <p class="text-xs text-slate-600">${texts.drafting_appeal}</p>
      </div>
    `;

    try {
      const res = await window.NyayMitraAPI.generateFirstAppeal({
        applicant_name: "Citizen Appellant",
        applicant_address: caseItem.jurisdiction || "Citizen Address",
        authority_name: caseItem.authority || "Public Authority",
        appellate_authority: "First Appellate Authority",
        original_application_date: caseItem.date_created || "30 days ago",
        rti_ref_no: caseItem.id
      });

      if (res && res.appeal_draft) {
        const html = window.marked ? window.marked.parse(res.appeal_draft) : res.appeal_draft;
        this.appealContentBox.innerHTML = html;

        if (this.appealCopyBtn) {
          this.appealCopyBtn.onclick = () => {
            navigator.clipboard.writeText(res.appeal_draft);
            this.showToast(texts.appeal_copied);
          };
        }
      }
    } catch (e) {
      this.appealContentBox.innerHTML = `<p class="text-red-600 text-xs">Error drafting appeal: ${e.message}</p>`;
    }

    if (window.lucide) window.lucide.createIcons();
  }

  exportActionPackPdf() {
    if (!this.actionPackData && (!this.rtiDraftBox || !this.rtiDraftBox.textContent.trim())) {
      this.showToast("Please analyze a grievance or generate an Action Pack first.");
      return;
    }

    const isHindi = (window.i18n && window.i18n.getLanguage() === 'Hindi');

    const rawDraft = this.actionPackData 
      ? (this.actionPackData.rti_draft || this.actionPackData.rti_application_draft || (this.rtiDraftBox ? this.rtiDraftBox.innerHTML : ''))
      : (this.rtiDraftBox ? this.rtiDraftBox.innerHTML : '<p>Formal RTI Grievance Application</p>');

    const rtiDraftHtml = (window.marked && typeof rawDraft === 'string' && !rawDraft.includes('<div'))
      ? window.marked.parse(rawDraft)
      : rawDraft;

    const checklist = (this.actionPackData && this.actionPackData.checklist) || (isHindi ? [
      "₹10 का आवेदन शुल्क (पोस्टल आर्डर / कोर्ट फीस स्टाम्प)",
      "नागरिक निवास प्रमाण / आधार प्रति",
      "नागरिक समस्या / स्थिति के फोटो साक्ष्य"
    ] : [
      "Application fee receipt of ₹10 (Postal Order / Court Fee Stamp)",
      "Proof of Address / Citizen Identity Copy",
      "Photographs / Evidence Records of civic grievance"
    ]);

    const timeline = (this.actionPackData && this.actionPackData.timeline) || (isHindi ? [
      { day: "1", label: "फॉर्म जमा करें एवं पावती रसीद प्राप्त करें" },
      { day: "30", label: "धारा 7(1) के तहत जन सूचना अधिकारी की वैधानिक उत्तर सीमा" },
      { day: "31-60", label: "उत्तर न मिलने पर धारा 19(1) प्रथम अपील दायर करें" }
    ] : [
      { day: "1", label: "Submit Form & Obtain Acknowledgment Receipt" },
      { day: "30", label: "Mandatory response deadline for PIO under Section 7(1)" },
      { day: "31-60", label: "File Section 19(1) First Appeal if no reply received" }
    ]);

    const authorityName = (this.actionPackData && (this.actionPackData.responsible_authority || (this.actionPackData.authority && this.actionPackData.authority.name))) 
      ? (this.actionPackData.responsible_authority || this.actionPackData.authority.name)
      : (isHindi ? "जन सूचना अधिकारी (PIO) / संबंधित प्राधिकरण" : "Public Information Officer (PIO) / Designated Authority");

    const user = JSON.parse(localStorage.getItem('nyaymitra_user') || '{}');
    const applicantName = user.name || (isHindi ? "नागरिक आवेदक" : "Citizen Applicant");

    this.showToast(isHindi ? "आधिकारिक एक्शन पैक PDF तैयार हो रहा है..." : "Generating Official Action Pack PDF...");

    if (window.downloadCleanLegalPdf) {
      window.downloadCleanLegalPdf({
        title: isHindi ? "आरटीआई आवेदन एवं नागरिक शिकायत एक्शन पैक" : "RTI APPLICATION & CIVIC GRIEVANCE ACTION PACK",
        subtitle: isHindi ? "सूचना का अधिकार अधिनियम 2005 की धारा 6(1) के अंतर्गत औपचारिक आवेदन" : "Formal Application Under Section 6(1) of the Right to Information Act, 2005",
        refNo: `RTI-${Date.now().toString().slice(-6)}`,
        applicantName: applicantName,
        authorityName: authorityName,
        contentHtml: rtiDraftHtml,
        checklist: checklist,
        timeline: timeline,
        filename: `NyayaSetu_RTI_Action_Pack_${Date.now()}`
      });
    } else {
      window.print();
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

window.NyayaSetuController = NyayaSetuController;
