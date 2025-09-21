import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Using Grok 4 Fast (free) model
const GROK_MODEL = 'x-ai/grok-4-fast:free';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

function buildSystemPrompt(): string {
  return `You are an AI assistant for "Artisans Marketplace" - a platform empowering local craftsmen and connecting them with customers worldwide.

**Your Role & Personality:**
- Enthusiastic supporter of traditional crafts and artisans
- Knowledgeable about digital marketplace strategies
- Helpful, encouraging, and practical
- Passionate about preserving traditional arts while embracing modern technology

**Platform Knowledge:**
🎨 **Features:**
- AI-powered product description generation
- Smart pricing recommendations
- Professional listing optimization
- Events system (workshops, exhibitions, craft fairs)
- Artist dashboard and analytics
- Community support and networking

🛍️ **Categories:**
- Pottery & Ceramics
- Handmade Jewelry
- Textile Arts (weaving, embroidery, knitting)
- Woodworking & Carpentry
- Paintings & Visual Arts
- Mixed Media & Sculptures
- Traditional Crafts & Heritage Arts

👨‍🎨 **User Types:**
- **Artists/Artisans:** Need help with listings, pricing, marketing, photography
- **Customers:** Seeking unique handcrafted items, gift ideas, custom orders
- **Event Organizers:** Planning workshops, exhibitions, craft fairs

**Help Users With:**
• Creating compelling product listings with AI assistance
• Photography tips for showcasing handcrafted items
• Pricing strategies for handmade goods
• Digital marketing and social media growth
• Event discovery and participation
• Business scaling and customer service
• Platform navigation and troubleshooting

**Communication Style:**
- Be warm, supportive, and encouraging
- Provide specific, actionable advice
- Share relevant examples when helpful
- Keep responses conversational but informative
- Always focus on empowering artisans to succeed

Remember: You're helping preserve traditional crafts while embracing digital innovation!`;
}

function getHeaders() {
  return {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Artisans Marketplace Assistant',
  };
}

async function callGrokChat(messages: ChatMessage[]) {
  const resp = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      model: GROK_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1500, // Grok can handle longer responses
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
      stream: false
    }),
  });

  if (!resp.ok) {
    let errJson: any;
    try {
      errJson = await resp.json();
    } catch {
      // ignore
    }
    const msg = errJson?.error?.message || `OpenRouter API error: ${resp.status} ${resp.statusText}`;
    throw new Error(msg);
  }

  return resp.json();
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    
    // Support both legacy format (message + history) and new format (messages array)
    let conversationMessages: ChatMessage[] = [];
    
    if (body.messages && Array.isArray(body.messages)) {
      // New format: array of messages
      conversationMessages = body.messages.filter((msg: any) => 
        msg.role && msg.content && ['user', 'assistant'].includes(msg.role)
      );
    } else if (body.message && typeof body.message === 'string') {
      // Legacy format: single message + history
      const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
      conversationMessages = [
        ...history.filter((msg: any) => 
          msg.role && msg.content && ['user', 'assistant'].includes(msg.role)
        ),
        { role: 'user', content: body.message }
      ];
    }

    if (conversationMessages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages provided. Please send a message.' },
        { status: 400 }
      );
    }

    // Build the full conversation with system prompt
    const systemMessage: ChatMessage = {
      role: 'system',
      content: buildSystemPrompt()
    };

    const fullConversation: ChatMessage[] = [
      systemMessage,
      ...conversationMessages
    ];

    console.log(`📤 Sending ${conversationMessages.length} messages to Grok 4 Fast...`);

    // Call Grok via OpenRouter
    const data = await callGrokChat(fullConversation);

    // Extract the response
    const assistantMessage = data?.choices?.[0]?.message?.content;
    if (!assistantMessage) {
      throw new Error('No response received from Grok model');
    }

    console.log('✅ Received response from Grok 4 Fast');

    return NextResponse.json({
      response: assistantMessage.trim(),
      model: GROK_MODEL,
      timestamp: new Date().toISOString(),
      usage: data.usage || null
    });

  } catch (error) {
    console.error('❌ Grok Chat API error:', error);
    
    // Enhanced fallback message with more context
    const fallbackMessage = `I'm experiencing some technical difficulties connecting to the AI service. 

**In the meantime, here are some quick tips:**
• **For Artists:** Visit the "For Artists" section to use our AI-powered product creation tools
• **Browse Products:** Check out our marketplace with categories like pottery, jewelry, and textiles  
• **Upcoming Events:** Explore workshops and exhibitions in the Events section
• **Need Help:** Visit our Help Center or contact our support team

I'll be back online shortly to provide personalized assistance!`;
    
    return NextResponse.json(
      { 
        response: fallbackMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true,
        model: GROK_MODEL
      }, 
      { status: 200 } // Return 200 so the frontend shows the fallback
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Test Grok connectivity
    const testResponse = await callGrokChat([
      {
        role: 'system',
        content: 'You are a test assistant. Respond with "OK" if you can receive this message.'
      },
      {
        role: 'user', 
        content: 'Test connection'
      }
    ]);

    return NextResponse.json({ 
      message: 'Grok Chat API is working',
      model: GROK_MODEL,
      hasApiKey: !!OPENROUTER_API_KEY,
      testResponse: testResponse?.choices?.[0]?.message?.content || 'No response',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Grok Chat API connection failed',
      model: GROK_MODEL,
      hasApiKey: !!OPENROUTER_API_KEY,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
