import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // Simple AI response logic (replace with actual AI service)
    const responses = {
      greeting: [
        "Hello! I'm here to help you explore our artisan marketplace. What would you like to know?",
        "Hi there! I can help you find amazing handcrafted items or assist artists with their listings. How can I help?",
        "Welcome! I'm your AI assistant for the Artisans Marketplace. What are you looking for today?"
      ],
      products: [
        "Our marketplace features thousands of unique handcrafted items from talented artisans worldwide. You can browse by category like pottery, jewelry, textiles, and more!",
        "Looking for something specific? Try searching by category, material, or price range. Each product is carefully crafted by skilled artisans.",
        "We have amazing collections of pottery, jewelry, woodwork, textiles, and more. Would you like me to help you find something specific?"
      ],
      artists: [
        "Our platform supports over 10,000 artists globally! If you're an artist, you can create professional listings with our AI-powered tools.",
        "Artists can use our AI listing creator to generate professional product descriptions, or browse our resources for selling tips and pricing guides.",
        "We help artists succeed with tools for creating listings, managing orders, and connecting with customers worldwide."
      ],
      default: [
        "That's a great question! I can help you with product searches, artist information, account settings, or general marketplace questions.",
        "I'm here to help! You can ask me about our products, how to sell as an artist, or any marketplace features.",
        "Let me help you with that! I can assist with browsing products, artist tools, or marketplace navigation."
      ]
    };

    // Simple keyword matching
    const lowerMessage = message.toLowerCase();
    let responseType = 'default';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      responseType = 'greeting';
    } else if (lowerMessage.includes('product') || lowerMessage.includes('buy') || lowerMessage.includes('shop')) {
      responseType = 'products';
    } else if (lowerMessage.includes('artist') || lowerMessage.includes('sell') || lowerMessage.includes('create')) {
      responseType = 'artists';
    }

    const responseArray = responses[responseType as keyof typeof responses];
    const response = responseArray[Math.floor(Math.random() * responseArray.length)];

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' }, 
      { status: 500 }
    );
  }
}
