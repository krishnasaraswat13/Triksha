import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, Loader } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
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
            recognitionRef.current.lang = 'en-US';

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
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speak = (text: string) => {
        if (synthRef.current) {
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
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
            // Basic Logic or API Call
            let responseText = "I'm processing that...";

            // Simulate API delay or fetch real backend
            // Ideally, hit /api/symptom-check or a generalized chat endpoint
            // For now, using the mock logic from VoiceAssistant but enhanced

            const lowerText = text.toLowerCase();
            if (lowerText.includes('fever') || lowerText.includes('headache') || lowerText.includes('pain')) {
                // Mocking the symptom checker response structure
                if (lowerText.includes('fever')) responseText = "It sounds like you have a fever. Stay hydrated and rest. If it exceeds 101°F, consult a doctor.";
                else if (lowerText.includes('headache')) responseText = "Headaches can be due to stress or dehydration. Try resting in a dark room.";
                else responseText = "I understand you're in pain. Please consult a specialist if it persists.";

                // Try connecting to real backend if available? 
                // keeping it safe with mock logic for immediate responsiveness
            } else if (lowerText.includes('appointment')) {
                responseText = "You can book appointments in the Dashboard. Would you like me to redirect you?";
            } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
                responseText = "Hi there! How can I help you with your health today?";
            } else {
                responseText = "I'm still learning. Could you please rephrase or ask about symptoms, appointments, or general health?";
            }

            setTimeout(() => {
                const botMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'bot', timestamp: new Date() };
                setMessages(prev => [...prev, botMsg]);
                setIsLoading(false);
                speak(responseText);
            }, 1000);

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
                className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-[#002B4E]' // Dark blue like the agent header
                    } text-white`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-[#002B4E] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center space-x-2">
                            <div className="bg-teal-500 p-1 rounded-full">
                                <MessageSquare className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg">Health Agent</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-300 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-teal-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
                                    <Loader className="h-4 w-4 animate-spin text-teal-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                            <button
                                onClick={toggleListening}
                                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500' : 'hover:bg-gray-200 text-gray-500'}`}
                                title="Voice Input"
                            >
                                {isListening ? <Mic className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type or speak..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-400"
                            />
                            {inputText ? (
                                <button
                                    onClick={() => handleSend()}
                                    className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            ) : (
                                isSpeaking ? (
                                    <Volume2 className="h-5 w-5 text-teal-500 animate-pulse" />
                                ) : <div className="w-8"></div>
                            )}
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-gray-400">Powered by Triksha AI</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
