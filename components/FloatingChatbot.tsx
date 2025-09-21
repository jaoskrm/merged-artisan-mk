'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '../hooks/useChat';

// Enhanced TS helpers for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage, clearChat, dictateToChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice recognition states
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
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
      'te-IN': { name: 'తెలుగు', flag: '🇮🇳', region: 'India' },
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

  // Enhanced speech recognition with better error handling
  const startDictation = async () => {
    if (!isVoiceSupported) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    // Check permission first
    if (hasPermission === null || hasPermission === false) {
      const granted = await requestMicPermission();
      if (!granted) {
        alert('Microphone permission is required for voice input. Please enable it in your browser settings.');
        return;
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = recLang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';
    let timeoutId: NodeJS.Timeout;

    recognition.onstart = () => {
      setIsRecording(true);
      console.log(`Voice recognition started in ${recLang}`);
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log('Voice recognition ended');
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      console.error('Speech recognition error:', event);
      
      let errorMessage = 'Voice recognition error occurred.';
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error during voice recognition.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable microphone permissions.';
          setHasPermission(false);
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your audio devices.';
          break;
        case 'language-not-supported':
          errorMessage = `Language ${recLang} not supported. Try switching to English.`;
          break;
      }
      
      if (event.error !== 'aborted') {
        alert(errorMessage);
      }
    };

    recognition.onresult = (event: any) => {
      clearTimeout(timeoutId);
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Show interim results in input field without overriding user input
      if (inputRef.current && interimTranscript && !inputValue) {
        inputRef.current.value = interimTranscript;
      }

      // Process final transcript
      if (finalTranscript.trim()) {
        const cleanTranscript = finalTranscript.trim();
        console.log(`Final transcript (${recLang}):`, cleanTranscript);
        
        // Clear the input field and send the message
        if (inputRef.current) {
          inputRef.current.value = '';
        }
        setInputValue('');
        
        // Send through dictateToChat
        dictateToChat(cleanTranscript);
        finalTranscript = '';
      }

      // Auto-stop after 3 seconds of no speech
      timeoutId = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 3000);
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsRecording(false);
    }
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    setIsRecording(false);
  };

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

          {/* Enhanced Input + Controls */}
          <form onSubmit={handleSend} className="p-4 border-t border-stone-200 dark:border-neutral-800">
            {/* Enhanced Voice Controls */}
            {isVoiceSupported && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 min-w-fit">🗣️ Voice:</span>
                  <select
                    value={recLang}
                    onChange={(e) => setRecLang(e.target.value)}
                    className="flex-1 px-2 py-1 border border-stone-300 dark:border-neutral-600 rounded-lg text-xs bg-white dark:bg-neutral-800 min-w-0"
                    disabled={isRecording}
                  >
                    <optgroup label="🇮🇳 Indian Languages">
                      <option value="en-IN">🇮🇳 English (India)</option>
                      <option value="hi-IN">🇮🇳 हिंदी Hindi</option>
                      <option value="ta-IN">🇮🇳 தமிழ் Tamil</option>
                      <option value="bn-IN">🇮🇳 বাংলা Bengali</option>
                      <option value="te-IN">🇮🇳 తెలుగు Telugu</option>
                      <option value="mr-IN">🇮🇳 मराठी Marathi</option>
                      <option value="gu-IN">🇮🇳 ગુજરાતી Gujarati</option>
                      <option value="kn-IN">🇮🇳 ಕನ್ನಡ Kannada</option>
                      <option value="ml-IN">🇮🇳 മലയാളം Malayalam</option>
                      <option value="pa-IN">🇮🇳 ਪੰਜਾਬੀ Punjabi</option>
                      <option value="ur-IN">🇮🇳 اردو Urdu</option>
                    </optgroup>
                    <optgroup label="🌍 International">
                      <option value="en-US">🇺🇸 English (US)</option>
                      <option value="fr-FR">🇫🇷 Français</option>
                      <option value="de-DE">🇩🇪 Deutsch</option>
                      <option value="es-ES">🇪🇸 Español</option>
                      <option value="pt-PT">🇵🇹 Português</option>
                      <option value="it-IT">🇮🇹 Italiano</option>
                    </optgroup>
                  </select>
                </div>
                {isRecording && (
                  <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Listening...</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="🌐 Type in any language or use voice input..."
                className="flex-1 px-3 py-2 border border-stone-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm"
                disabled={isLoading}
              />
              
              {/* Enhanced Voice Button */}
              {isVoiceSupported && (
                <button
                  type="button"
                  onClick={() => (isRecording ? stopDictation() : startDictation())}
                  className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-500 text-white border-red-500 animate-pulse shadow-lg' 
                      : 'border-stone-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 hover:scale-105'
                  }`}
                  title={isRecording ? `Stop recording (${getLanguageInfo(recLang).name})` : `Start voice input (${getLanguageInfo(recLang).name})`}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="2"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 10v1a7 7 0 01-14 0v-1M12 19v4m-4 0h8"/>
                      </svg>
                    </div>
                  )}
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center justify-center min-w-[44px] hover:scale-105"
                title="Send message"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>

            {/* Language Status Indicator */}
            {isVoiceSupported && (
              <div className="flex items-center justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <span>Current voice language:</span>
                  <span className="font-medium text-primary">
                    {getLanguageInfo(recLang).flag} {getLanguageInfo(recLang).name}
                  </span>
                </div>
                <div className="text-xs opacity-70">
                  16+ languages supported
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
