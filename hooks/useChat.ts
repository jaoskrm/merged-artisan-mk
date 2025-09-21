import { useState, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your multilingual AI assistant for the Artisans Marketplace. I can help you with:

🎨 Marketing your artwork and crafts
📝 Creating compelling product descriptions  
📸 Photography tips for better product images
💰 Pricing strategies for handmade items
📱 Digital marketing and social media advice
🛍️ Platform navigation and features
📦 Business tips from packaging to customer service

How can I help you grow your artisan business today?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('🚀 Sending message to API:', content);
      console.log('📍 API URL:', '/api/chat');
      console.log('🌐 Base URL:', window.location.origin);

      // Enhanced fetch with better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      let data;
      try {
        data = await response.json();
        console.log('✅ Response data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      // Handle the response - support multiple formats
      let assistantContent = 'Sorry, I could not process your request.';
      
      if (data.response) {
        // New format: response field
        assistantContent = data.response;
      } else if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        // OpenAI format: choices array
        assistantContent = data.choices[0].message.content;
      } else if (data.message) {
        // Simple message format
        assistantContent = data.message;
      } else if (data.error) {
        // Error response
        assistantContent = `Error: ${data.error}`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('💥 Chat error details:', error);
      
      let errorMessage = `I'm experiencing technical difficulties. `;
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage += 'The request timed out. Please try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage += `Connection failed. Please check:

🔧 **Troubleshooting:**
• Is your development server running? (\`npm run dev\`)
• Is the API endpoint /api/chat accessible?
• Check your network connection
• Try refreshing the page

**Technical Error:** ${error.message}`;
        } else if (error.message.includes('API Error:')) {
          errorMessage += `Server error: ${error.message}`;
        } else {
          errorMessage += `Unexpected error: ${error.message}`;
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your multilingual AI assistant for the Artisans Marketplace. How can I help you today?`,
      timestamp: new Date(),
    }]);
  }, []);

  // Enhanced dictateToChat with better error handling
  const dictateToChat = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    try {
      console.log('🎤 Voice input received:', text);
      await sendMessage(text);
    } catch (error) {
      console.error('🎤 Dictation error:', error);
      
      // Add error message for voice input failures
      const voiceErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I couldn't process your voice input: "${text}". Please try typing your message instead or check your internet connection.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, voiceErrorMessage]);
    }
  }, [sendMessage, setMessages]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    dictateToChat,
  };
};
