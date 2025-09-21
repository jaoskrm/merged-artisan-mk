import { NextRequest, NextResponse } from 'next/server'

type SupportedLanguage = 
  | 'english' | 'hindi' | 'tamil' | 'bengali' | 'telugu' | 'marathi' 
  | 'gujarati' | 'kannada' | 'malayalam' | 'punjabi' | 'urdu'
  | 'french' | 'german' | 'spanish' | 'portuguese' | 'italian'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface LanguageInfo {
  nativeName: string
  englishName: string
  currency: string
  region: string
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const GROK_MODEL = 'x-ai/grok-4-fast:free' // Updated to the correct free model

function detectLanguage(text: string): SupportedLanguage {
  const cleanText = text.toLowerCase().trim()
  
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
  }

  // Check for script-based languages first
  for (const [lang, pattern] of Object.entries(scriptPatterns)) {
    if (pattern.test(text)) return lang as SupportedLanguage
  }

  // Word-based detection for languages using Latin script
  const wordPatterns = {
    hindi: /\b(kya|kaise|kahan|kab|kyun|namaste|dhanyawad|haan|nahin|main|aap|hai|hoon|mujhe|tumhe|uske|iske)\b/,
    french: /\b(bonjour|salut|merci|comment|pourquoi|quand|ou|avec|pour|dans|une|des|les|vous|nous|cest|je|tu|il|elle|oui|non)\b/,
    german: /\b(hallo|guten|danke|wie|warum|wann|womit|für|in|der|die|das|ich|du|er|sie|es|und|oder|ja|nein)\b/,
    spanish: /\b(hola|gracias|cómo|por qué|cuándo|dónde|con|para|en|el|la|los|las|yo|tú|él|ellas|no|yo)\b/,
    portuguese: /\b(olá|obrigado|como|por quê|quando|onde|com|para|em|o|a|os|as|eu|você|ele|ela|sim|não|e|ou)\b/,
    italian: /\b(ciao|grazie|come|perché|quando|dove|con|per|in|il|la|i|le|io|tu|lui|lei|sì|no|e|o)\b/,
    bengali: /\b(ami|tumi|se|ki|keno|kothay|kobe|ar|kintu|haan|na|bhalo|kharap)\b/,
    telugu: /\b(nenu|meeru|atanu|emi|enduku|ekkada|eppudu|mariyu|kani|avunu|kaadu|manchi|chedu)\b/,
    marathi: /\b(mi|tu|to|kay|ka|kuthe|kevha|ani|pan|ho|nahi|changla|vait)\b/,
    gujarati: /\b(hu|tame|te|shu|kyu|kya|kyare|ane|pan|haan|naa|saras|kharab)\b/,
    kannada: /\b(naanu|neevu|avanu|enu|yaake|elli|yaavaga|mattu|aadare|haudu|illa|chennaagide|kettadu)\b/,
    malayalam: /\b(njaan|ningal|avan|enthu|enthu|kond|evide|eppol|pinne|pakshe|athe|alla|nallath|cheethatha)\b/,
    punjabi: /\b(main|tussi|oh|ki|kiun|kithe|kada|te|par|haan|naa|changa|manda)\b/,
    urdu: /\b(main|aap|woh|kya|kiun|kahan|kab|aur|lekin|haan|nahin|accha|bura)\b/,
  }

  // Check word patterns
  for (const [lang, pattern] of Object.entries(wordPatterns)) {
    if (pattern.test(cleanText)) return lang as SupportedLanguage
  }

  // Default to English
  return 'english'
}

function getLanguageInfo(lang: SupportedLanguage): LanguageInfo {
  const languageMap: Record<SupportedLanguage, LanguageInfo> = {
    english: { nativeName: 'English', englishName: 'English', currency: 'USD/INR', region: 'Global/India' },
    hindi: { nativeName: 'हिंदी', englishName: 'Hindi', currency: 'INR', region: 'India' },
    tamil: { nativeName: 'தமிழ்', englishName: 'Tamil', currency: 'INR', region: 'India' },
    bengali: { nativeName: 'বাংলা', englishName: 'Bengali', currency: 'INR', region: 'India' },
    telugu: { nativeName: 'తెలుగు', englishName: 'Telugu', currency: 'INR', region: 'India' },
    marathi: { nativeName: 'मराठी', englishName: 'Marathi', currency: 'INR', region: 'India' },
    gujarati: { nativeName: 'ગુજરાતી', englishName: 'Gujarati', currency: 'INR', region: 'India' },
    kannada: { nativeName: 'ಕನ್ನಡ', englishName: 'Kannada', currency: 'INR', region: 'India' },
    malayalam: { nativeName: 'മലയാളം', englishName: 'Malayalam', currency: 'INR', region: 'India' },
    punjabi: { nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', currency: 'INR', region: 'India' },
    urdu: { nativeName: 'اردو', englishName: 'Urdu', currency: 'INR', region: 'India' },
    french: { nativeName: 'Français', englishName: 'French', currency: 'EUR', region: 'France' },
    german: { nativeName: 'Deutsch', englishName: 'German', currency: 'EUR', region: 'Germany' },
    spanish: { nativeName: 'Español', englishName: 'Spanish', currency: 'EUR', region: 'Spain' },
    portuguese: { nativeName: 'Português', englishName: 'Portuguese', currency: 'EUR', region: 'Portugal' },
    italian: { nativeName: 'Italiano', englishName: 'Italian', currency: 'EUR', region: 'Italy' }
  }
  
  return languageMap[lang]
}

function getVoiceRecognitionLanguages() {
  return [
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెলుগు', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml-IN', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa-IN', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ur-IN', name: 'اردو', flag: '🇮🇳' },
    { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
    { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
    { code: 'pt-PT', name: 'Português', flag: '🇵🇹' },
    { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' }
  ]
}

function buildMultilingualSystemPrompt(detectedLanguage: SupportedLanguage): string {
  const langInfo = getLanguageInfo(detectedLanguage)
  
  const baseContext = `You are an intelligent AI assistant for Artisans Marketplace - a global platform connecting craftspeople with customers worldwide.

WEBSITE STRUCTURE & NAVIGATION:
- Homepage: Main landing page with featured categories and testimonials
- For Artists page (/pages/for-artists): Contains AI listing creation tool and artist resources
- Marketplace page: Browse and discover artisan products
- About page: Company story and team information
- Profile page: User account management and settings

PRODUCT LISTING CREATION PROCESS:
When users ask "How do I create a product listing in this website?" or similar questions, guide them through this specific process:

1. **Navigate to For Artists Page**: Go to "/pages/for-artists" from the main navigation [HIGHLIGHT_BUTTON:a[href*="for-artists"]|Click here to go to For Artists]
2. **Access AI Listing Creation**: Look for the "ai-listing-creation" section on the for-artists page
3. **Step-by-Step Process**:
   - Step 1: Basic Product Information (name, category, images)
   - Step 2: Product Details (description, specifications, pricing)
   - Step 3: AI Generation - Click "Generate Listing" to create professional content [HIGHLIGHT_BUTTON:button:contains("Generate")|Click to generate listing]
   - Step 4: Review & Edit - Modify AI-generated sections including:
     * Product Title & Subtitle
     * Short Description
     * Key Features
     * Unique Highlights
     * Specifications
     * Search Tags
     * Artisan Story
   - Final Step: Click "Publish Listing" to make it live

INTERACTIVE GUIDANCE SYSTEM:
When providing step-by-step guides, you can highlight specific buttons to help users navigate:

BUTTON HIGHLIGHTING SYNTAX:
- Single button: [HIGHLIGHT_BUTTON:selector|message]
- Multiple buttons sequence: [HIGHLIGHT_SEQUENCE:selector1|message1|delay1;selector2|message2|delay2]
- Interactive guide: [INTERACTIVE_GUIDE:selector1|message1|delay1;selector2|message2|delay2]

INTERACTIVE GUIDANCE SYSTEM:
When providing step-by-step guides, you can highlight specific buttons to help users navigate:

BUTTON HIGHLIGHTING SYNTAX:
- Single button: [HIGHLIGHT_BUTTON:selector|message]
- Multiple buttons sequence: [HIGHLIGHT_SEQUENCE:selector1|message1|delay1;selector2|message2|delay2]
- Interactive guide: [INTERACTIVE_GUIDE:selector1|message1|delay1;selector2|message2|delay2]

INTERACTIVE GUIDE EXAMPLES:

For "How do I create a product listing?":
[INTERACTIVE_GUIDE:a[href*="for-artists"]|Go to For Artists|1000;button:contains("Create Listing")|Click Create Listing|1000;button:contains("Generate")|Generate listing|1000]

For "How do I join an event?":
[INTERACTIVE_GUIDE:a[href*="events"]|Go to Events|1000;button:contains("Join")|Join Event|1000]

For "How do I create an event?": 
[INTERACTIVE_GUIDE:a[href*="for-artists"]|Go to For Artists|1000;button:contains("Create Event")|Create New Event|1000]

IMPORTANT RULES:
1. Use ONLY [INTERACTIVE_GUIDE] for step-by-step processes - DO NOT mix with other highlighting methods
2. For event-related questions:
   - "join event" → Navigate to Events page
   - "create event" → Navigate to For Artists page  
3. Each step should wait for user interaction before proceeding
4. Use clear, short messages (max 15 characters) for arrows
5. Always start with navigation, then specific actions

COMMON SELECTORS:
- Events page: 'a[href*="events"]'
- For Artists page: 'a[href*="for-artists"]'  
- Marketplace page: 'a[href*="marketplace"]'
- Join button: 'button:contains("Join")'
- Create Event: 'button:contains("Create Event")'
- Create Listing: 'button:contains("Create Listing")'

When users ask ambiguous questions like "create/join event", clarify the flow:
- For joining events: Guide to Events page
- For creating events: Guide to For Artists page (where event creation tools are located)




SPECIFIC FEATURES TO MENTION:
- AI-powered listing generation that creates professional product descriptions
- Editable sections for customization after AI generation
- Regenerate buttons for individual sections if needed
- Multiple product categories supported (pottery, textiles, jewelry, etc.)

EXPERTISE AREAS:
CRAFTS: Pottery, jewelry, textiles, woodworking, painting, traditional arts
BUSINESS: Pricing, cost analysis, market research, profit optimization  
PHOTOGRAPHY: Product photography, lighting, composition, editing
MARKETING: Social media, SEO, descriptions, customer engagement
MARKETPLACE: Platform features, listing optimization, customer service
OPERATIONS: Inventory, shipping, packaging, order management
GROWTH: Scaling, partnerships, events, workshops, international sales

REGIONAL CONTEXT: You understand both local ${langInfo.region} markets and global opportunities.
CURRENCY: Use ${langInfo.currency} for pricing when relevant to ${langInfo.region}.`

  // Language-specific instructions with explicit output language requirement
  const languageInstructions = {
    english: `COMMUNICATION: Respond in clear, natural English. Consider global marketplace contexts while being mindful of Indian artisan needs. IMPORTANT: Always respond in English when the user writes in English.`,
    hindi: `संवाद निर्देश: हमेशा हिंदी में उत्तर दें। भारतीय कारीगरों की जरूरतों को समझते हुए स्थानीय और वैश्विक बाज़ार के संदर्भ का उपयोग करें। मुद्रा: INR का उपयोग करें। महत्वपूर्ण: जब उपयोगकर्ता हिंदी में लिखता है तो हमेशा हिंदी में जवाब दें।`,
    tamil: `தொடர்பு வழிமுறைகள்: எப்போதும் தமிழில் பதிலளிக்கவும். இந்திய கைவினைஞர்களின் தேவைகளைக் கருத்தில் கொண்டு உள்ளூர் மற்றும் உலகளாவிய சந்தை சூழலைப் பயன்படுத்தவும். நாணயம்: INR பயன்படுத்தவும். முக்கியம்: பயனர் தமிழில் எழுதும்போது எப்போதும் தமிழில் பதிலளிக்கவும்।`,
    bengali: `যোগাযোগের নির্দেশাবলী: সর্বদা বাংলায় উত্তর দিন। ভারতীয় কারিগরদের প্রয়োজন বিবেচনা করে স্থানীয় এবং বৈশ্বিক বাজারের প্রসঙ্গ ব্যবহার করুন। মুদ্রা: INR ব্যবহার করুন। গুরুত্বপূর্ণ: ব্যবহারকারী বাংলায় লিখলে সর্বদা বাংলায় উত্তর দিন।`,
    telugu: `కమ్యూనికేషన్ సూచనలు: ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి। భారతీయ కళాకారుల అవసరాలను దృష్టిలో ఉంచుకుని స్థానిక మరియు ప్రపంచ మార్కెట్ సందర్భాలను ఉపయోగించండి। కరెన్సీ: INR ఉపయోగించండి। ముఖ్యమైనది: వినియోగదారుడు తెలుగులో రాసినప్పుడు ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి।`,
    marathi: `संवाद सूचना: नेहमी मराठीत उत्तर द्या. भारतीय कारागिरांच्या गरजा लक्षात घेऊन स्थानिक आणि जागतिक बाजारपेठेचा संदर्भ वापरा. चलन: INR वापरा. महत्वाचे: वापरकर्ता मराठीत लिहितो तेव्हा नेहमी मराठीत उत्तर द्या.`,
    gujarati: `સંવાદ સૂચનાઓ: હંમેશા ગુજરાતીમાં જવાબ આપો. ભારતીય કારીગરોની જરૂરિયાતોને ધ્યાનમાં રાખીને સ્થાનિક અને વૈશ્વિક બજારના સંદર્ભનો ઉપયોગ કરો. ચલણ: INR વાપરો. મહત્વપૂર્ણ: જ્યારે વપરાશકર્તા ગુજરાતીમાં લખે ત્યારે હંમેશા ગુજરાતીમાં જવાબ આપો.`,
    kannada: `ಸಂವಹನ ಸೂಚನೆಗಳು: ಯಾವಾಗಲೂ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ. ಭಾರತೀಯ ಕಾರಿಗರರ ಅಗತ್ಯಗಳನ್ನು ಗಣನೆಗೆ ತೆಗೆದುಕೊಂಡು ಸ್ಥಳೀಯ ಮತ್ತು ಜಾಗತಿಕ ಮಾರುಕಟ್ಟೆ ಸಂದರ್ಭಗಳನ್ನು ಬಳಸಿ. ಕರೆನ್ಸಿ: INR ಬಳಸಿ. ಮುಖ್ಯ: ಬಳಕೆದಾರ ಕನ್ನಡದಲ್ಲಿ ಬರೆದಾಗ ಯಾವಾಗಲೂ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.`,
    malayalam: `ആശയവിനിമയ നിർദ്ദേശങ്ങൾ: എപ്പോഴും മലയാളത്തിൽ ഉത്തരം നൽകുക. ഇന്ത്യൻ കരകൗശല വിദഗ്ധരുടെ ആവശ്യങ്ങൾ കണക്കിലെടുത്ത് പ്രാദേശിക-ആഗോള വിപണി സന്ദർഭങ്ങൾ ഉപയോഗിക്കുക. കറൻസി: INR ഉപയോഗിക്കുക. പ്രധാനം: ഉപയോക്താവ് മലയാളത്തിൽ എഴുതുമ്പോൾ എപ്പോഴും മലയാളത്തിൽ ഉത്തരം നൽകുക.`,
    punjabi: `ਸੰਚਾਰ ਨਿਰਦੇਸ਼: ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਭਾਰਤੀ ਕਾਰੀਗਰਾਂ ਦੀਆਂ ਲੋੜਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦੇ ਹੋਏ ਸਥਾਨਕ ਅਤੇ ਵਿਸ਼ਵਵਿਆਪੀ ਬਾਜ਼ਾਰ ਦੇ ਸੰਦਰਭ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਮੁਦਰਾ: INR ਵਰਤੋ। ਮਹੱਤਵਪੂਰਨ: ਜਦੋਂ ਉਪਭੋਗਤਾ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖਦਾ ਹੈ ਤਾਂ ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।`,
    urdu: `رابطے کی ہدایات: ہمیشہ اردو میں جواب دیں۔ ہندوستانی کاریگروں کی ضروریات کو مدنظر رکھتے ہوئے مقامی اور عالمی منڈی کے حوالے استعمال کریں۔ کرنسی: INR استعمال کریں۔ اہم: جب صارف اردو میں لکھے تو ہمیشہ اردو میں جواب دیں۔`,
    french: `INSTRUCTIONS LINGUISTIQUES: Répondez entièrement en français. Utilisez une compréhension du marché artisanal français et européen. Mentionnez les prix en euros quand c'est pertinent. IMPORTANT: Toujours répondre en français quand l'utilisateur écrit en français.`,
    german: `SPRACHANWEISUNGEN: Antworten Sie vollständig auf Deutsch. Nutzen Sie das Verständnis für deutsche und europäische Handwerksmärkte. Erwähnen Sie Preise in Euro , wenn relevant. WICHTIG: Immer auf Deutsch antworten, wenn der Benutzer auf Deutsch schreibt.`,
    spanish: `INSTRUCCIONES DE IDIOMA: Responda completamente en español. Use el entendimiento del mercado artesanal español y europeo. Mencione precios en euros cuando sea relevante. IMPORTANTE: Siempre responder en español cuando el usuario escriba en español.`,
    portuguese: `INSTRUÇÕES DE IDIOMA: Responda completamente em português. Use a compreensão do mercado artesanal português e europeu. Mencione preços em euros quando relevante. IMPORTANTE: Sempre responder em português quando o usuário escrever em português.`,
    italian: `ISTRUZIONI LINGUISTICHE: Rispondi completamente in italiano. Usa la comprensione del mercato artigianale italiano ed europeo. Menziona i prezzi in euro quando rilevante. IMPORTANTE: Rispondi sempre in italiano quando l'utente scrive in italiano.`
  }

  return `${baseContext}

${languageInstructions[detectedLanguage]}

IMPORTANT: You are an expert thinking in real-time, providing personalized advice based on the user's specific situation, not template responses. Always match the language of your response to the language of the user's input.`
}

async function callGrokWithAdvancedMultilingual(messages: ChatMessage[]) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Artisans Marketplace AI Assistant'
      },
      body: JSON.stringify({
        model: GROK_MODEL, // Using the correct free model
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorData,
        model: GROK_MODEL
      })
      
      // More detailed error handling
      if (response.status === 400) {
        throw new Error(`Invalid request: ${errorData}`)
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OPENROUTER_API_KEY.')
      } else if (response.status === 404) {
        throw new Error(`Model not found: ${GROK_MODEL}. Please check the model name.`)
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      } else {
        throw new Error(`API Error ${response.status}: ${errorData}`)
      }
    }

    const data = await response.json()
    console.log('API Response successful:', {
      model: data.model || GROK_MODEL,
      usage: data.usage
    })
    
    return data
  } catch (error) {
    console.error('API Call Error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      console.error('Missing OPENROUTER_API_KEY environment variable')
      return NextResponse.json({
        response: "AI service requires configuration. Please contact administrator.",
        aiGenerated: false,
        error: "missing-api-key"
      }, { status: 500 })
    }

    console.log('Using model:', GROK_MODEL)

    const body = await request.json().catch(() => ({}))
    let conversationMessages: ChatMessage[] = []

    if (body.messages && Array.isArray(body.messages)) {
      conversationMessages = body.messages.filter((msg: any) => 
        msg.role && msg.content && ['user', 'assistant'].includes(msg.role)
      )
    } else if (body.message && typeof body.message === 'string') {
      const history: ChatMessage[] = Array.isArray(body.history) ? body.history : []
      conversationMessages = [
        ...history.filter((msg: any) => 
          msg.role && msg.content && ['user', 'assistant'].includes(msg.role)
        ),
        {
          role: 'user',
          content: body.message
        }
      ]
    }

    if (conversationMessages.length === 0) {
      const welcomeData = await callGrokWithAdvancedMultilingual([
        {
          role: 'system',
          content: `Generate a warm welcome message in English that mentions you can communicate in 16 languages including Hindi, Tamil, Bengali, French, German, Spanish etc. for an artisan marketplace platform with AI-powered listing creation tools.`
        },
        {
          role: 'user',
          content: 'Greet a new user with multilingual capabilities.'
        }
      ])

      return NextResponse.json({
        response: welcomeData?.choices?.[0]?.message?.content || 
                 "Welcome to Artisans Marketplace! I speak 16 languages including Hindi, Tamil, French, German, Spanish and more. I can help you create product listings using our AI-powered tools on the for-artists page!",
        aiGenerated: true,
        supportedLanguages: getVoiceRecognitionLanguages().length,
        model: GROK_MODEL
      })
    }

    // Enhanced language detection - get the most recent user message
    const lastUserMessage = [...conversationMessages].reverse().find(msg => msg.role === 'user')
    const detectedLanguage = lastUserMessage ? detectLanguage(lastUserMessage.content) : 'english'
    const langInfo = getLanguageInfo(detectedLanguage)
    
    console.log(`Language detected: ${detectedLanguage} (${langInfo.nativeName})`)

    // Build multilingual conversation with enhanced system prompt
    const systemMessage: ChatMessage = {
      role: 'system',
      content: buildMultilingualSystemPrompt(detectedLanguage)
    }

    const fullConversation: ChatMessage[] = [
      systemMessage,
      ...conversationMessages
    ]

    console.log(`Processing with ${GROK_MODEL} in ${langInfo.nativeName}...`)
    const data = await callGrokWithAdvancedMultilingual(fullConversation)
    const assistantMessage = data?.choices?.[0]?.message?.content

    if (!assistantMessage) {
      throw new Error('Failed to generate multilingual response - no content received')
    }

    console.log(`AI response generated successfully in ${langInfo.nativeName}`)

    return NextResponse.json({
      response: assistantMessage.trim(),
      aiGenerated: true,
      model: GROK_MODEL,
      detectedLanguage,
      languageInfo: langInfo,
      timestamp: new Date().toISOString(),
      usage: data.usage || null
    })

  } catch (error) {
    console.error('Multilingual AI Error:', error)
    
    let errorMessage = "I'm experiencing technical difficulties. Please try again in a moment."
    let errorDetails = 'Unknown error'
    
    if (error instanceof Error) {
      errorDetails = error.message
      if (error.message.includes('Invalid API key')) {
        errorMessage = "API configuration error. Please contact administrator."
      } else if (error.message.includes('Model not found')) {
        errorMessage = "AI model temporarily unavailable. Please try again later."
      } else if (error.message.includes('Rate limit')) {
        errorMessage = "Too many requests. Please wait a moment and try again."
      }
    }
    
    return NextResponse.json({
      response: errorMessage,
      aiGenerated: false,
      error: errorDetails,
      model: GROK_MODEL
    }, { status: 500 })
  }
}
