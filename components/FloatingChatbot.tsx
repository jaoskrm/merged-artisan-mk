'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { useButtonHighlight } from '../hooks/useButtonHighlight';

// Enhanced TS helpers for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: {
      new (): SpeechRecognition;
    };
    SpeechRecognition?: {
      new (): SpeechRecognition;
    };
  }
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage, clearChat, dictateToChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { highlightButton, highlightMultipleButtons, startInteractiveGuide } = useButtonHighlight();

  // Voice recognition states
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [recLang, setRecLang] = useState('en-IN');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Enhanced voice support detection
  useEffect(() => {
    const checkVoiceSupport = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsVoiceSupported(!!SpeechRecognition);
    };
    
    checkVoiceSupport();
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Process AI response for button highlighting
// Process AI response for button highlighting
const processAIResponse = useCallback((content: string) => {
  // Check if the response contains button highlighting instructions
  const buttonHighlightRegex = /\[HIGHLIGHT_BUTTON:([^\]]+)\]/g;
  const multiHighlightRegex = /\[HIGHLIGHT_SEQUENCE:([^\]]+)\]/g;
  const interactiveGuideRegex = /\[INTERACTIVE_GUIDE:([^\]]+)\]/g;
  
  let processedContent = content;
  let hasInteractiveGuide = false;
  
  // Process interactive guides first (highest priority)
  let match;
  while ((match = interactiveGuideRegex.exec(content)) !== null) {
    const [fullMatch, instruction] = match;
    hasInteractiveGuide = true;
    
    const steps = instruction.split(';').map(step => {
      const [selector, message, delay] = step.split('|');
      return {
        selector: selector.trim(),
        message: message?.trim() || 'Click here',
        delay: parseInt(delay?.trim()) || 1000
      };
    });
    
    // Start interactive guide
    setTimeout(() => {
      startInteractiveGuide(steps);
    }, 1000);
    
    // Remove the instruction from the content
    processedContent = processedContent.replace(fullMatch, '');
  }
  
  // Only process other highlighting if no interactive guide is present
  if (!hasInteractiveGuide) {
    // Process single button highlights
    while ((match = buttonHighlightRegex.exec(content)) !== null) {
      const [fullMatch, instruction] = match;
      const [selector, message] = instruction.split('|');
      
      // Trigger highlight after a short delay
      setTimeout(() => {
        highlightButton(selector.trim(), { message: message?.trim() || 'Click here' });
      }, 1000);
      
      // Remove the instruction from the content
      processedContent = processedContent.replace(fullMatch, '');
    }
    
    // Process multiple button highlight sequences
    while ((match = multiHighlightRegex.exec(content)) !== null) {
      const [fullMatch, instruction] = match;
      const buttons = instruction.split(';').map(btn => {
        const [selector, message, delay] = btn.split('|');
        return {
          selector: selector.trim(),
          message: message?.trim() || 'Click here',
          delay: parseInt(delay?.trim()) || 0
        };
      });
      
      // Trigger highlight sequence after a short delay
      setTimeout(() => {
        highlightMultipleButtons(buttons);
      }, 1000);
      
      // Remove the instruction from the content
      processedContent = processedContent.replace(fullMatch, '');
    }
  }
  
  return processedContent;
}, [highlightButton, highlightMultipleButtons, startInteractiveGuide]);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    
    // Send message and process response for highlighting
    const response = await sendMessage(message);
    if (response) {
      processAIResponse(response);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  // Enhanced permission checking
  const requestMicPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Mic permission denied:', error);
      setHasPermission(false);
      return false;
    }
  };

  // Get language display info
  const getLanguageInfo = (langCode: string) => {
    const langMap: { [key: string]: { name: string; flag: string; region: string } } = {
      'en-IN': { name: 'English (India)', flag: '🇮🇳', region: 'India' },
      'en-US': { name: 'English (US)', flag: '🇺🇸', region: 'USA' },
      'hi-IN': { name: 'हिंदी', flag: '🇮🇳', region: 'India' },
      'ta-IN': { name: 'தமிழ்', flag: '🇮🇳', region: 'India' },
      'bn-IN': { name: 'বাংলা', flag: '🇮🇳', region: 'India' },
      'te-IN': { name: 'తెలుগు', flag: '🇮🇳', region: 'India' },
      'mr-IN': { name: 'मराठी', flag: '🇮🇳', region: 'India' },
      'gu-IN': { name: 'ગુજરાતી', flag: '🇮🇳', region: 'India' },
      'kn-IN': { name: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'India' },
      'ml-IN': { name: 'മലയാളം', flag: '🇮🇳', region: 'India' },
      'pa-IN': { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'India' },
      'ur-IN': { name: 'اردو', flag: '🇮🇳', region: 'India' },
      'fr-FR': { name: 'Français', flag: '🇫🇷', region: 'France' },
      'de-DE': { name: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
      'es-ES': { name: 'Español', flag: '🇪🇸', region: 'Spain' },
      'pt-PT': { name: 'Português', flag: '🇵🇹', region: 'Portugal' },
      'it-IT': { name: 'Italiano', flag: '🇮🇹', region: 'Italy' }
    };
    return langMap[langCode] || { name: langCode, flag: '🌐', region: 'Global' };
  };

  // Voice recognition setup
  const startVoiceRecognition = async () => {
    if (!isVoiceSupported) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    if (hasPermission === null) {
      const granted = await requestMicPermission();
      if (!granted) return;
    }

    if (hasPermission === false) {
      alert('Microphone permission is required for voice input.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = recLang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log(`🎤 Voice recognition started (${recLang})`);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      console.log(`🎤 Voice input: "${transcript}" (confidence: ${confidence})`);
      setInputValue(transcript);
      
      // Auto-detect language from speech result
      if (confidence > 0.7) {
        setDetectedLanguage(recLang);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('🎤 Voice recognition error:', event.error);
      setIsRecording(false);
      
      let errorMessage = 'Voice recognition failed: ';
      switch (event.error) {
        case 'no-speech':
          errorMessage += 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage += 'Audio capture failed. Check your microphone.';
          break;
        case 'not-allowed':
          errorMessage += 'Microphone permission denied.';
          setHasPermission(false);
          break;
        default:
          errorMessage += event.error;
      }
      alert(errorMessage);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log('🎤 Voice recognition ended');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const toggleVoiceRecognition = () => {
    if (isRecording) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  // Available voice recognition languages
  const getVoiceRecognitionLanguages = () => [
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
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
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 ease-in-out
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600 transform rotate-45' 
              : 'bg-primary hover:bg-primary/90 transform rotate-0'
            }
            flex items-center justify-center text-white font-bold text-xl
            hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/30
          `}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
          
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[560px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-neutral-800 z-40 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm">🌐 Multilingual AI Assistant</h3>
                <p className="text-xs opacity-90">16+ Languages • Artisans Marketplace</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Clear chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Close chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-2 break-words
                    ${message.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-stone-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-md'
                    }
                  `}
                >
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                  <div className={`text-xs mt-1 opacity-70 ${message.role === 'user' ? 'text-white/70' : 'text-neutral-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 dark:bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Section */}
          <div className="border-t border-stone-200 dark:border-neutral-800 p-4">
            {/* Voice Recognition Language Selector */}
            {isVoiceSupported && (
              <div className="mb-3">
                <select
                  value={recLang}
                  onChange={(e) => setRecLang(e.target.value)}
                  className="text-xs bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-lg px-2 py-1 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {getVoiceRecognitionLanguages().map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                {detectedLanguage && (
                  <span className="ml-2 text-xs text-primary">
                    🎯 {getLanguageInfo(detectedLanguage).name}
                  </span>
                )}
              </div>
            )}

            <form onSubmit={handleSend} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything in any language..."
                  className="w-full px-4 py-3 pr-12 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100"
                  disabled={isLoading}
                />
                
                {/* Voice Input Button */}
                {isVoiceSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    disabled={isLoading}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-stone-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-primary hover:text-white'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="2"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-2xl transition-all duration-200 flex items-center justify-center"
                title="Send message"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
