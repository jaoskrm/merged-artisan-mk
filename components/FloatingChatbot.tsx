'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MessageCircle, X, Trash2, Globe, Mic, MicOff, 
  Volume2, VolumeX, Send, Loader2
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useButtonHighlight } from '../hooks/useButtonHighlight';

// Type definitions
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: { new (): SpeechRecognition };
    SpeechRecognition?: { new (): SpeechRecognition };
  }
}

// Language configuration
const LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (भारत)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'তমিজ়', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'তেলুগু', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठী', flag: '🇮🇳' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (United States)', flag: '🇺🇸' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' }
];

const FloatingChatbot = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isTTSSupported, setIsTTSSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Hooks
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const { highlightButton, highlightMultipleButtons, startInteractiveGuide } = useButtonHighlight();

  // Utilities
  const getCurrentLanguage = () => LANGUAGES.find(lang => lang.code === selectedLanguage);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const formatMessage = (content: string) => content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  // Cleanup function
  const cleanupVoiceActivities = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    setIsRecording(false);
    setIsSpeaking(false);
  }, []);

  // Mobile detection and menu state monitoring
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    const checkMobileMenuState = () => {
      const isMenuOpen = document.body.style.overflow === 'hidden' || 
                        document.querySelector('[class*="fixed"][class*="inset-0"][class*="bg-white"]') !== null;
      setIsMobileMenuOpen(isMenuOpen);
    };

    checkIfMobile();
    checkMobileMenuState();

    const resizeObserver = new ResizeObserver(checkIfMobile);
    resizeObserver.observe(document.body);

    const observer = new MutationObserver(checkMobileMenuState);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true 
    });

    return () => {
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  // Effects
  useEffect(() => scrollToBottom(), [messages]);
  useEffect(() => {
    if (isOpen && inputRef.current && !showLanguageSelector) inputRef.current.focus();
  }, [isOpen, showLanguageSelector]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsVoiceSupported(!!SpeechRecognition);

    if ('speechSynthesis' in window) {
      setIsTTSSupported(true);
      const loadVoices = () => setVoices(speechSynthesis.getVoices());
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return cleanupVoiceActivities;
  }, [cleanupVoiceActivities]);

  useEffect(() => {
    if (!isOpen) cleanupVoiceActivities();
  }, [isOpen, cleanupVoiceActivities]);

  // TTS functionality
  const speakMessage = useCallback((text: string) => {
    if (!isTTSSupported) return;

    const cleanText = text.replace(/<[^>]*>/g, '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
    
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const currentLang = getCurrentLanguage();
    const preferredVoice = voices.find(voice => {
      if (currentLang?.code.startsWith('en-')) {
        return voice.lang.startsWith('en-') && (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.default);
      }
      return voice.lang === currentLang?.code || voice.lang.startsWith(currentLang?.code.split('-')[0] || '');
    }) || voices.find(voice => voice.default);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isTTSSupported, voices, isSpeaking, getCurrentLanguage]);

  // Process AI responses for button highlighting
  const processAIResponse = useCallback((content: string) => {
    const patterns = {
      button: /\[HIGHLIGHT_BUTTON:([^\]]+)\]/g,
      sequence: /\[HIGHLIGHT_SEQUENCE:([^\]]+)\]/g,
      guide: /\[INTERACTIVE_GUIDE:([^\]]+)\]/g
    };
    
    let processedContent = content;
    let hasInteractiveGuide = false;
    
    let match;
    while ((match = patterns.guide.exec(content)) !== null) {
      hasInteractiveGuide = true;
      const steps = match[1].split(';').map(step => {
        const [selector, message, delay] = step.split('|');
        return {
          selector: selector.trim(),
          message: message?.trim() || 'Click here',
          delay: parseInt(delay?.trim()) || 1000
        };
      });
      setTimeout(() => startInteractiveGuide(steps), 1000);
      processedContent = processedContent.replace(match[0], '');
    }
    
    if (!hasInteractiveGuide) {
      while ((match = patterns.button.exec(content)) !== null) {
        const [selector, message] = match[1].split('|');
        setTimeout(() => {
          highlightButton(selector.trim(), { message: message?.trim() || 'Click here' });
        }, 1000);
        processedContent = processedContent.replace(match[0], '');
      }
      
      while ((match = patterns.sequence.exec(content)) !== null) {
        const buttons = match[1].split(';').map(btn => {
          const [selector, message, delay] = btn.split('|');
          return {
            selector: selector.trim(),
            message: message?.trim() || 'Click here',
            delay: parseInt(delay?.trim()) || 0
          };
        });
        setTimeout(() => highlightMultipleButtons(buttons), 1000);
        processedContent = processedContent.replace(match[0], '');
      }
    }
    
    return processedContent;
  }, [highlightButton, highlightMultipleButtons, startInteractiveGuide]);

  // Voice recognition
  const startVoiceRecognition = useCallback(() => {
    if (!isVoiceSupported || !selectedLanguage) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) setInputValue(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (error) {
      setIsRecording(false);
    }
  }, [isVoiceSupported, selectedLanguage]);

  const stopVoiceRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecording(false);
  }, []);

  // Handlers
  const handleOpenChat = () => {
    setIsOpen(true);
    if (!selectedLanguage) setShowLanguageSelector(true);
  };

  const handleCloseChat = () => {
    cleanupVoiceActivities();
    setIsOpen(false);
  };

  const handleCloseChatOrLanguageSelector = () => {
    if (showLanguageSelector) {
      if (selectedLanguage) {
        setShowLanguageSelector(false);
      } else {
        handleCloseChat();
      }
    } else {
      handleCloseChat();
    }
  };

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageSelector(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    const response = await sendMessage(message);
    if (response) processAIResponse(response);
  };

  // Styles - UPDATED: Only show button on desktop, never on mobile
  const shouldShowFloatingButton = !isOpen && !isMobile;
  const chatWindowClasses = isMobile 
    ? "fixed inset-0 bg-white dark:bg-neutral-900 z-50 flex flex-col"
    : "fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-700 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300";

  const headerClasses = isMobile
    ? "bg-gradient-to-r from-primary to-primary/90 text-white p-5 flex justify-between items-center"
    : "bg-gradient-to-r from-primary to-primary/90 text-white p-5 flex justify-between items-center rounded-t-3xl";

  const inputSectionClasses = isMobile
    ? "border-t border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900"
    : "border-t border-neutral-200 dark:border-neutral-700 p-4 bg-white dark:bg-neutral-900 rounded-b-3xl";

  return (
    <>
      {/* Floating Chat Button - DESKTOP ONLY */}
      {shouldShowFloatingButton && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary rounded-full shadow-2xl z-50 flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Open Artisans AI chat"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">AI</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={chatWindowClasses}>
          {/* Language Selector OR Main Chat */}
          {showLanguageSelector ? (
            <>
              {/* Language Selector Header */}
              <div className={headerClasses}>
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold text-lg">Choose Language</h3>
                    <p className="text-sm opacity-90">Select your preferred language</p>
                  </div>
                </div>
                {/* Always show close button on language selector */}
                <button
                  onClick={handleCloseChatOrLanguageSelector}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  aria-label="Close language selector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Options */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid gap-2">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-all group"
                    >
                      <span className="text-2xl">{language.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-base text-neutral-900 dark:text-neutral-100 group-hover:text-primary">
                          {language.name}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {language.nativeName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : selectedLanguage && (
            <>
              {/* Main Chat Header */}
              <div className={headerClasses}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    <span className="text-lg">{getCurrentLanguage()?.flag}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Artisans AI</h3>
                    <p className="text-sm opacity-90">{getCurrentLanguage()?.name}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setShowLanguageSelector(true)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title="Change language"
                    aria-label="Change language"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title="Clear chat"
                    aria-label="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCloseChat}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    title="Close chat"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{getCurrentLanguage()?.flag}</span>
                    </div>
                    <h4 className="font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Welcome to Artisans AI!
                    </h4>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      I'm ready to help you in {getCurrentLanguage()?.name}. Ask me anything about our marketplace or artisan services.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-br-md shadow-md'
                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-md shadow-md border border-neutral-100 dark:border-neutral-700'
                    }`}>
                      <div className="flex items-start gap-2">
                        <div
                          className="text-sm leading-relaxed flex-1"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        {/* TTS Button for AI messages */}
                        {message.role === 'assistant' && isTTSSupported && (
                          <button
                            onClick={() => speakMessage(message.content)}
                            className={`ml-2 p-1 rounded-lg transition-colors flex-shrink-0 ${
                              isSpeaking 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                            }`}
                            title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                            aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                          >
                            {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                      <div className={`text-xs mt-2 opacity-60 ${message.role === 'user' ? 'text-white/70' : 'text-neutral-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-3 border border-neutral-100 dark:border-neutral-700">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Section */}
              <div className={inputSectionClasses}>
                <form onSubmit={handleSend} className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder={`Type your message in ${getCurrentLanguage()?.name}...`}
                      className="w-full px-4 py-3 pr-12 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                      disabled={isLoading}
                    />
                    
                    {/* Voice Button */}
                    {isVoiceSupported && (
                      <button
                        type="button"
                        onClick={isRecording ? stopVoiceRecognition : startVoiceRecognition}
                        disabled={isLoading}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${
                          isRecording 
                            ? 'bg-red-500 text-white animate-pulse scale-110' 
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-primary hover:text-white hover:scale-105'
                        }`}
                        title={isRecording ? 'Stop recording' : 'Start voice input'}
                        aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary disabled:from-primary/50 disabled:to-primary/50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-2xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
                    title="Send message"
                    aria-label="Send message"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
