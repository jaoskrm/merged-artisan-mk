import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const GROK_MODEL = 'x-ai/grok-4-fast:free';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type SupportedLanguage = 'english' | 'hindi' | 'tamil' | 'bengali' | 'telugu' | 'marathi' | 'gujarati' | 'kannada' | 'malayalam' | 'punjabi' | 'urdu' | 'french' | 'german' | 'spanish' | 'portuguese' | 'italian';

// Enhanced multilingual detection
function detectLanguage(text: string): SupportedLanguage {
  const cleanText = text.toLowerCase().trim();
  
  // Script-based detection (most reliable)
  const scriptPatterns = {
    hindi: /[\u0900-\u097F]/, // Devanagari
    tamil: /[\u0B80-\u0BFF]/, // Tamil
    bengali: /[\u0980-\u09FF]/, // Bengali
    telugu: /[\u0C00-\u0C7F]/, // Telugu
    kannada: /[\u0C80-\u0CFF]/, // Kannada
    malayalam: /[\u0D00-\u0D7F]/, // Malayalam
    gujarati: /[\u0A80-\u0AFF]/, // Gujarati
    punjabi: /[\u0A00-\u0A7F]/, // Gurmukhi (Punjabi)
    urdu: /[\u0600-\u06FF]/, // Arabic script (Urdu)
  };

  // Check for script-based languages first
  for (const [lang, pattern] of Object.entries(scriptPatterns)) {
    if (pattern.test(text)) {
      return lang as SupportedLanguage;
    }
  }

  // Word-based detection for languages using Latin script
  const wordPatterns = {
    hindi: /\b(kya|kaise|kahan|kab|kyun|namaste|dhanyawad|han|nahin|main|aap|hai|hoon|mujhe|tumhe|uske|iske)\b/,
    
    french: /\b(bonjour|salut|merci|comment|pourquoi|quand|où|avec|pour|dans|une|des|les|vous|nous|c'est|je|tu|il|elle|oui|non)\b/,
    
    german: /\b(hallo|guten|danke|wie|warum|wann|wo|mit|für|in|der|die|das|ich|du|er|sie|es|und|oder|ja|nein)\b/,
    
    spanish: /\b(hola|gracias|cómo|por qué|cuándo|dónde|con|para|en|el|la|los|las|yo|tú|él|ella|sí|no|y|o)\b/,
    
    portuguese: /\b(olá|obrigado|como|por que|quando|onde|com|para|em|o|a|os|as|eu|você|ele|ela|sim|não|e|ou)\b/,
    
    italian: /\b(ciao|grazie|come|perché|quando|dove|con|per|in|il|la|i|le|io|tu|lui|lei|sì|no|e|o)\b/,
    
    bengali: /\b(ami|tumi|se|ki|keno|kothay|kobe|ar|kintu|haa|naa|bhalo|kharap)\b/,
    
    telugu: /\b(nenu|meeru|atanu|emaindi|enduku|ekkada|eppudu|mariyu|kani|avunu|kaadu|manchidi|chedu)\b/,
    
    marathi: /\b(mi|tu|to|kay|ka|kuthe|kevha|ani|pan|ho|nahi|changle|vait)\b/,
    
    gujarati: /\b(hu|tame|te|shu|kyu|kya|kyare|ane|pan|ha|na|saras|kharab)\b/,
    
    kannada: /\b(naanu|neevu|avanu|enu|yaake|elli|yaavaga|mattu|aadare|haudu|illa|chennaagide|kettadu)\b/,
    
    malayalam: /\b(njaan|ningal|avan|enthu|enthukond|evide|eppol|pinne|pakshe|athe|alla|nallath|cheethatha)\b/,
    
    punjabi: /\b(main|tussi|oh|ki|kiun|kithe|kado|te|par|haa|naa|changa|manda)\b/,
    
    urdu: /\b(main|aap|woh|kya|kiun|kahan|kab|aur|lekin|haan|nahin|accha|bura)\b/
  };

  // Check word patterns
  for (const [lang, pattern] of Object.entries(wordPatterns)) {
    if (pattern.test(cleanText)) {
      return lang as SupportedLanguage;
    }
  }

  // Default to English
  return 'english';
}

function getLanguageInfo(language: SupportedLanguage) {
  const languageMap = {
    english: { name: 'English', nativeName: 'English', currency: '₹', region: 'Global' },
    hindi: { name: 'Hindi', nativeName: 'हिंदी', currency: '₹', region: 'India' },
    tamil: { name: 'Tamil', nativeName: 'தமிழ்', currency: '₹', region: 'India' },
    bengali: { name: 'Bengali', nativeName: 'বাংলা', currency: '₹', region: 'India/Bangladesh' },
    telugu: { name: 'Telugu', nativeName: 'తెలుగు', currency: '₹', region: 'India' },
    marathi: { name: 'Marathi', nativeName: 'मराठी', currency: '₹', region: 'India' },
    gujarati: { name: 'Gujarati', nativeName: 'ગુજરાતી', currency: '₹', region: 'India' },
    kannada: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', currency: '₹', region: 'India' },
    malayalam: { name: 'Malayalam', nativeName: 'മലയാളം', currency: '₹', region: 'India' },
    punjabi: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', currency: '₹', region: 'India' },
    urdu: { name: 'Urdu', nativeName: 'اردو', currency: '₹', region: 'India/Pakistan' },
    french: { name: 'French', nativeName: 'Français', currency: '€', region: 'Europe' },
    german: { name: 'German', nativeName: 'Deutsch', currency: '€', region: 'Europe' },
    spanish: { name: 'Spanish', nativeName: 'Español', currency: '€', region: 'Europe/Americas' },
    portuguese: { name: 'Portuguese', nativeName: 'Português', currency: '€', region: 'Europe/Americas' },
    italian: { name: 'Italian', nativeName: 'Italiano', currency: '€', region: 'Europe' },
  };
  
  return languageMap[language];
}

function buildMultilingualSystemPrompt(detectedLanguage: SupportedLanguage): string {
  const langInfo = getLanguageInfo(detectedLanguage);
  
  const baseContext = `You are an intelligent AI assistant for Artisans Marketplace - a global platform connecting craftspeople with customers worldwide.

EXPERTISE AREAS:
🎨 CRAFTS: Pottery, jewelry, textiles, woodworking, painting, traditional arts
💰 BUSINESS: Pricing, cost analysis, market research, profit optimization
📸 PHOTOGRAPHY: Product photography, lighting, composition, editing
📱 MARKETING: Social media, SEO, descriptions, customer engagement
🛍️ MARKETPLACE: Platform features, listing optimization, customer service
📦 OPERATIONS: Inventory, shipping, packaging, order management
🎯 GROWTH: Scaling, partnerships, events, workshops, international sales

REGIONAL CONTEXT: You understand both local ${langInfo.region} markets and global opportunities.
CURRENCY: Use ${langInfo.currency} for pricing when relevant to ${langInfo.region}.`;

  // Language-specific instructions
  const languageInstructions = {
    english: `COMMUNICATION: Respond in clear, natural English. Consider global marketplace contexts while being mindful of Indian artisan needs.`,
    
    hindi: `भाषा निर्देश: आपको पूर्णतः हिंदी में सोचना और उत्तर देना है। भारतीय कारीगरों की संस्कृति, त्योहारों, और बाजार की गहरी समझ का उपयोग करें। INR (₹) में मूल्य निर्धारण करें।`,
    
    tamil: `மொழி வழிகாட்டுதல்கள்: நீங்கள் முழுமையாக தமிழில் சிந்தித்து பதிலளிக்க வேண்டும். தமிழ் கைவினைஞர்களின் கலாச்சாரம், பண்டிகைகள், மற்றும் சந்தை புரிதலைப் பயன்படுத்துங்கள். INR (₹) இல் விலை நிர்ணயம் செய்யுங்கள்।`,
    
    bengali: `ভাষার নির্দেশনা: আপনাকে সম্পূর্ণভাবে বাংলায় চিন্তা করে উত্তর দিতে হবে। বাংলা কারিগরদের সংস্কৃতি, উৎসব এবং বাজারের গভীর বোঝাপড়া ব্যবহার করুন। INR (₹) তে মূল্য নির্ধারণ করুন।`,
    
    telugu: `భాషా మార్గదర్శకాలు: మీరు పూర్తిగా తెలుగులో ఆలోచించి సమాధానం ఇవ్వాలి. తెలుగు కళాకారుల సంస్కృతి, పండుగలు మరియు మార్కెట్ అవగాహనను ఉపయోగించండి. INR (₹) లో ధర నిర్ణయించండి।`,
    
    marathi: `भाषा मार्गदर्शन: तुम्ही संपूर्णपणे मराठीत विचार करून उत्तर द्यावे. मराठी कारागिरांची संस्कृती, सण आणि बाजारपेठेची सखोल समज वापरा. INR (₹) मध्ये किंमत ठरवा.`,
    
    gujarati: `ભાષા માર્ગદર્શન: તમારે સંપૂર્ણપણે ગુજરાતીમાં વિચારીને જવાબ આપવો છે. ગુજરાતી કારીગરોની સંસ્કૃતિ, તહેવારો અને બજારની ઊંડી સમજનો ઉપયોગ કરો. INR (₹) માં કિંમત નક્કી કરો.`,
    
    kannada: `ಭಾಷಾ ಮಾರ್ಗದರ್ಶನ: ನೀವು ಸಂಪೂರ್ಣವಾಗಿ ಕನ್ನಡದಲ್ಲಿ ಚಿಂತಿಸಿ ಉತ್ತರಿಸಬೇಕು. ಕನ್ನಡ ಕುಶಲಕರ್ಮಿಗಳ ಸಂಸ್ಕೃತಿ, ಹಬ್ಬಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ತಿಳುವಳಿಕೆಯನ್ನು ಬಳಸಿ. INR (₹) ನಲ್ಲಿ ಬೆಲೆ ನಿರ್ಧರಿಸಿ.`,
    
    malayalam: `ഭാഷാ മാർഗ്ഗനിർദ്ദേശങ്ങൾ: നിങ്ങൾ പൂർണ്ണമായും മലയാളത്തിൽ ചിന്തിച്ച് ഉത്തരം നൽകണം. മലയാളി കരകൗശല വിദഗ്ധരുടെ സംസ്കാരം, ഉത്സവങ്ങൾ, വിപണി ധാരണകൾ എന്നിവ ഉപയോഗിക്കുക. INR (₹) യിൽ വില നിർണ്ണയിക്കുക.`,
    
    punjabi: `ਭਾਸ਼ਾ ਮਾਰਗਦਰਸ਼ਨ: ਤੁਸੀਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪੰਜਾਬੀ ਵਿੱਚ ਸੋਚ ਕੇ ਜਵਾਬ ਦੇਣਾ ਹੈ। ਪੰਜਾਬੀ ਕਾਰੀਗਰਾਂ ਦੀ ਸੱਭਿਆਚਾਰ, ਤਿਉਹਾਰਾਂ ਅਤੇ ਬਾਜ਼ਾਰ ਦੀ ਡੂੰਘੀ ਸਮਝ ਦਾ ਇਸਤੇਮਾਲ ਕਰੋ। INR (₹) ਵਿੱਚ ਕੀਮਤ ਨਿਰਧਾਰਣ ਕਰੋ।`,
    
    urdu: `زبان کی ہدایات: آپ کو مکمل طور پر اردو میں سوچ کر جواب دینا ہے۔ اردو دستکاروں کی ثقافت، تہواروں اور بازار کی گہری سمجھ کا استعمال کریں۔ INR (₹) میں قیمت کا تعین کریں۔`,
    
    french: `INSTRUCTIONS LINGUISTIQUES: Répondez entièrement en français. Utilisez une compréhension du marché artisanal français et européen. Mentionnez les prix en euros (€) quand c'est pertinent.`,
    
    german: `SPRACHANWEISUNGEN: Antworten Sie vollständig auf Deutsch. Nutzen Sie das Verständnis für deutsche und europäische Handwerksmärkte. Erwähnen Sie Preise in Euro (€), wenn relevant.`,
    
    spanish: `INSTRUCCIONES DE IDIOMA: Responda completamente en español. Use el entendimiento del mercado artesanal español y europeo. Mencione precios en euros (€) cuando sea relevante.`,
    
    portuguese: `INSTRUÇÕES DE IDIOMA: Responda completamente em português. Use a compreensão do mercado artesanal português e europeu. Mencione preços em euros (€) quando relevante.`,
    
    italian: `ISTRUZIONI LINGUISTICHE: Rispondi completamente in italiano. Usa la comprensione del mercato artigianale italiano ed europeo. Menziona i prezzi in euro (€) quando rilevante.`
  };

  return `${baseContext}

${languageInstructions[detectedLanguage]}

IMPORTANT: You are an expert thinking in real-time, providing personalized advice based on the user's specific situation, not template responses.`;
}

// Enhanced voice recognition language support
function getVoiceRecognitionLanguages() {
  return [
    { code: 'en-IN', label: 'English (India)', flag: '🇮🇳' },
    { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
    { code: 'hi-IN', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'ta-IN', label: 'Tamil (தமிழ்)', flag: '🇮🇳' },
    { code: 'bn-IN', label: 'Bengali (বাংলা)', flag: '🇮🇳' },
    { code: 'te-IN', label: 'Telugu (తెలుగు)', flag: '🇮🇳' },
    { code: 'mr-IN', label: 'Marathi (मराठी)', flag: '🇮🇳' },
    { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
    { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
    { code: 'ml-IN', label: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
    { code: 'pa-IN', label: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
    { code: 'ur-IN', label: 'Urdu (اردو)', flag: '🇮🇳' },
    { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
    { code: 'pt-PT', label: 'Português', flag: '🇵🇹' },
    { code: 'it-IT', label: 'Italiano', flag: '🇮🇹' }
  ];
}

async function callGrokWithAdvancedMultilingual(messages: ChatMessage[]) {
  console.log('🌐 Sending to Grok AI for advanced multilingual processing...');
  
  const resp = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Multilingual Artisans Marketplace Assistant',
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 2000,
      top_p: 0.9,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
      stream: false,
    }),
  });

  if (!resp.ok) {
    let errJson: any;
    try {
      errJson = await resp.json();
    } catch {}
    throw new Error(errJson?.error?.message || `API Error: ${resp.status}`);
  }

  return resp.json();
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({
        response: "⚠️ AI service requires configuration. Please contact administrator.",
        aiGenerated: false,
        error: "missing_api_key"
      });
    }

    const body = await request.json().catch(() => ({}));
    let conversationMessages: ChatMessage[] = [];
    
    if (body.messages && Array.isArray(body.messages)) {
      conversationMessages = body.messages.filter((msg: any) => 
        msg.role && msg.content && ['user', 'assistant'].includes(msg.role)
      );
    } else if (body.message && typeof body.message === 'string') {
      const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
      conversationMessages = [
        ...history.filter((msg: any) => 
          msg.role && msg.content && ['user', 'assistant'].includes(msg.role)
        ),
        { role: 'user', content: body.message }
      ];
    }

    if (conversationMessages.length === 0) {
      const welcomeData = await callGrokWithAdvancedMultilingual([
        {
          role: 'system',
          content: 'Generate a warm welcome message in English that mentions you can communicate in 16+ languages including Hindi, Tamil, Bengali, French, German, Spanish etc. for an artisan marketplace platform.'
        },
        {
          role: 'user',
          content: 'Greet a new user with multilingual capabilities.'
        }
      ]);

      return NextResponse.json({
        response: welcomeData?.choices?.[0]?.message?.content || "Welcome to Artisans Marketplace! I speak 16+ languages including Hindi, Tamil, French, German, Spanish and more.",
        aiGenerated: true,
        supportedLanguages: getVoiceRecognitionLanguages().length
      });
    }

    // Enhanced language detection
    const lastUserMessage = [...conversationMessages].reverse().find(msg => msg.role === 'user');
    const detectedLanguage = lastUserMessage ? detectLanguage(lastUserMessage.content) : 'english';
    const langInfo = getLanguageInfo(detectedLanguage);
    
    console.log(`🌍 Language detected: ${detectedLanguage} (${langInfo.nativeName})`);

    // Build multilingual conversation
    const systemMessage: ChatMessage = {
      role: 'system',
      content: buildMultilingualSystemPrompt(detectedLanguage)
    };

    const fullConversation: ChatMessage[] = [
      systemMessage,
      ...conversationMessages
    ];

    console.log(`🤖 Processing with Grok AI in ${langInfo.nativeName}...`);
    const data = await callGrokWithAdvancedMultilingual(fullConversation);

    const assistantMessage = data?.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('Failed to generate multilingual response');
    }

    console.log(`✅ AI response generated in ${langInfo.nativeName}`);

    return NextResponse.json({
      response: assistantMessage.trim(),
      aiGenerated: true,
      model: GROK_MODEL,
      detectedLanguage,
      languageInfo: langInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Multilingual AI Error:', error);
    
    return NextResponse.json({
      response: "I'm experiencing technical difficulties. Please try again in a moment. 技術的な問題が発生しています। मुझे तकनीकी समस्या हो रही है। J'ai des difficultés techniques.",
      aiGenerated: false,
      error: error instanceof Error ? error.message : 'Multilingual system error'
    });
  }
}

export async function GET() {
  const supportedLanguages = getVoiceRecognitionLanguages();
  
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({
        status: '❌ NO API KEY',
        aiAvailable: false,
        supportedLanguages: supportedLanguages.map(lang => lang.label)
      });
    }

    return NextResponse.json({
      status: '✅ MULTILINGUAL AI ACTIVE',
      aiAvailable: true,
      model: GROK_MODEL,
      totalLanguages: supportedLanguages.length,
      supportedLanguages: supportedLanguages,
      features: [
        'Real-time language detection',
        'Native script support',
        'Cultural context awareness',
        'Regional market knowledge',
        'Voice recognition support'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      status: '🚫 ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      supportedLanguages: supportedLanguages.map(lang => lang.label)
    });
  }
}
