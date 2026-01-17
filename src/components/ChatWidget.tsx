import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, Loader, Maximize2, Minimize2, Globe } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const LANGUAGES = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'te-IN', name: 'Telugu' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' }
];

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm Triksha's Health Agent. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-IN');

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom on new message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = selectedLanguage;

            recognitionRef.current.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                setInputText(text);
                handleSend(text);
            };

            recognitionRef.current.onend = () => setIsListening(false);
            recognitionRef.current.onerror = () => setIsListening(false);
        }

        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }
    }, [selectedLanguage]); // Re-init when language changes

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (recognitionRef.current) {
                recognitionRef.current.lang = selectedLanguage;
                recognitionRef.current.start();
                setIsListening(true);
            }
        }
    };

    const speak = (text: string) => {
        if (synthRef.current) {
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLanguage;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            synthRef.current.speak(utterance);
        }
    };

    const handleSend = async (text: string = inputText) => {
        if (!text.trim()) return;

        // Add User Message
        const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // Basic Logic: Check for greetings locally for speed
            const lowerText = text.toLowerCase();
            if (lowerText.match(/^(hi|hello|hey|greetings|namaste|vanakkam|namaskaram)/i)) {
                const greetings: { [key: string]: string } = {
                    'en-IN': "Hi there! How can I help you with your health today?",
                    'hi-IN': "नमस्ते! मैं आपकी स्वास्थ्य संबंधी सहायता कैसे कर सकता हूँ?",
                    'bn-IN': "হ্যালো! আজ আমি কীভাবে আপনার স্বাস্থ্যের বিষয়ে সাহায্য করতে পারি?",
                    'te-IN': "హలో! ఈ రోజు మీ ఆరోగ్యానికి సంబంధించి నేను మీకు ఎలా సహాయపడగలను?",
                    'ta-IN': "வணக்கம்! இன்று உங்கள் ஆரோக்கியத்திற்கு நான் எவ்வாறு உதவ முடியும்?",
                    'mr-IN': "नमस्कार! आज मी तुम्हाला तुमच्या आरोग्याबाबत कशी मदत करू शकतो?",
                    'gu-IN': "હેલો! આજે હું તમારા સ્વાસ્થ્ય માટે કેવી રીતે મદદ કરી શકું?",
                    'kn-IN': "ಹಲೋ! ಇಂದು ನಿಮ್ಮ ಆರೋಗ್ಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ?",
                    'ml-IN': "ഹലോ! ഇന്ന് നിങ്ങളുടെ ആരോഗ്യകാര്യത്തിൽ എനിക്ക് എങ്ങനെ സഹായിക്കാനാകും?",
                    'ur-IN': "ہیلو! میں آج آپ کی صحت کے حوالے سے کیسے مدد کر سکتا ہوں؟"
                };

                let greeting = greetings[selectedLanguage] || greetings['en-IN'];

                const botMsg: Message = { id: (Date.now() + 1).toString(), text: greeting, sender: 'bot', timestamp: new Date() };
                setMessages(prev => [...prev, botMsg]);
                setIsLoading(false);
                speak(botMsg.text);
                return;
            }

            // Call Backend API
            const token = localStorage.getItem('triksha_token');
            const response = await fetch('/api/chatbot/symptom-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ symptoms: text, language: selectedLanguage })
            });

            let responseText = "I'm having trouble connecting to the server. Please try again later.";
            if (response.ok) {
                const data = await response.json();
                responseText = data.response;
            } else {
                responseText = "I'm sorry, I couldn't process that right now.";
            }

            const botMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'bot', timestamp: new Date() };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);
            speak(responseText);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-[#002B4E]'} text-white`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`${isFullScreen
                        ? 'fixed inset-0 w-full h-full rounded-none'
                        : 'fixed bottom-24 right-6 w-96 h-[500px] max-h-[80vh] rounded-xl'
                        } bg-white shadow-2xl border border-gray-200 z-[9999] flex flex-col overflow-hidden animate-fade-in-up transition-all duration-300 ease-in-out`}
                >
                    {/* AI Animation Background (Visible only in Full Screen) */}
                    {isFullScreen && (
                        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-3xl animate-ping" style={{ animationDuration: '3s' }}></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        </div>
                    )}

                    {/* Header */}
                    <div className={`p-4 flex justify-between items-center z-10 ${isFullScreen ? 'bg-slate-900/90 text-white backdrop-blur-md border-b border-slate-700' : 'bg-[#002B4E] text-white'}`}>
                        <div className="flex items-center space-x-2">
                            <div className={`${isFullScreen ? 'bg-teal-500/20' : 'bg-teal-500'} p-1.5 rounded-full`}>
                                <MessageSquare className={`h-4 w-4 ${isFullScreen ? 'text-teal-400' : 'text-white'}`} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-semibold text-lg tracking-wide leading-none">Health Agent</h3>
                                <span className="text-[10px] opacity-70">AI Powered</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            {/* Language Selector */}
                            <div className="flex items-center bg-white/10 rounded-lg px-2 py-1 mr-1">
                                <Globe className="h-3 w-3 mr-1 opacity-70" />
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="bg-transparent border-none text-xs text-white focus:ring-0 cursor-pointer outline-none option:text-black"
                                    style={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0, paddingTop: 0 }}
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code} className="text-black">{lang.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                title={isFullScreen ? "Minimize" : "Maximize"}
                            >
                                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-red-500/80 hover:text-white rounded-lg transition-colors"
                                title="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 p-4 overflow-y-auto space-y-4 z-10 ${isFullScreen ? 'bg-transparent scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent' : 'bg-gray-50'}`}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed backdrop-blur-sm ${msg.sender === 'user'
                                        ? isFullScreen
                                            ? 'bg-blue-600/80 text-white rounded-br-none shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/30'
                                            : 'bg-teal-600 text-white rounded-br-none'
                                        : isFullScreen
                                            ? 'bg-slate-800/80 text-gray-100 rounded-bl-none border border-slate-700 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
                                            : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div
                                    className={`p-4 rounded-2xl rounded-bl-none ${isFullScreen
                                        ? 'bg-slate-800/80 border border-slate-700'
                                        : 'bg-white border border-gray-200 shadow-sm'
                                        }`}
                                >
                                    <div className="flex space-x-1.5">
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${isFullScreen ? 'bg-teal-400' : 'bg-teal-600'}`} style={{ animationDelay: '0ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${isFullScreen ? 'bg-teal-400' : 'bg-teal-600'}`} style={{ animationDelay: '150ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${isFullScreen ? 'bg-teal-400' : 'bg-teal-600'}`} style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`p-4 z-10 border-t ${isFullScreen ? 'bg-slate-900/90 border-slate-700 backdrop-blur-md' : 'bg-white border-gray-100'}`}>
                        <div className={`flex items-center space-x-2 rounded-full px-4 py-2.5 transition-all ${isFullScreen ? 'bg-slate-800 border border-slate-600 focus-within:border-teal-500/50 focus-within:shadow-[0_0_20px_rgba(20,184,166,0.2)]' : 'bg-gray-100'}`}>
                            <button
                                onClick={toggleListening}
                                className={`p-2 rounded-full transition-colors ${isListening
                                    ? 'bg-red-500/20 text-red-500'
                                    : isFullScreen ? 'hover:bg-slate-700 text-slate-400 hover:text-teal-400' : 'hover:bg-gray-200 text-gray-500'
                                    }`}
                                title="Voice Input"
                            >
                                {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={isListening ? "Listening..." : "Ask anything about your health..."}
                                className={`flex-1 bg-transparent border-none focus:ring-0 text-sm ${isFullScreen ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400'}`}
                            />
                            {inputText ? (
                                <button
                                    onClick={() => handleSend()}
                                    className={`p-2 rounded-full transition-all hover:scale-105 ${isFullScreen ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-500/20' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            ) : (
                                isSpeaking ? (
                                    <button onClick={() => { synthRef.current?.cancel(); setIsSpeaking(false); }}>
                                        <Volume2 className="h-5 w-5 text-teal-500 animate-pulse" />
                                    </button>
                                ) : <div className="w-8"></div>
                            )}
                        </div>
                        {isFullScreen && (
                            <div className="text-center mt-3">
                                <span className="text-[10px] uppercase tracking-widest text-slate-500">Secure Health Intelligence Protocol v1.0</span>
                            </div>
                        )}
                        {!isFullScreen && (
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-gray-400">Powered by Triksha AI</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
