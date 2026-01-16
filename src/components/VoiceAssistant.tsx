import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, MessageSquare } from 'lucide-react';

interface VoiceAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

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
                setTranscript(text);
                handleQuery(text);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                setResponse("Sorry, I didn't catch that. Please try again.");
            };
        }

        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
        }

        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            setResponse('');
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

    const handleQuery = (text: string) => {
        const lowerText = text.toLowerCase();
        let reply = "I'm not sure how to help with that yet.";

        // Basic Mock Logic for Health Assistant
        if (lowerText.includes('appointment') || lowerText.includes('book')) {
            reply = "You can book an appointment in the Consultations tab. Would you like me to take you there?";
        } else if (lowerText.includes('prescription') || lowerText.includes('medicine')) {
            reply = "You can view your prescriptions in the Pharmacy section or find medicines online.";
        } else if (lowerText.includes('emergency') || lowerText.includes('help')) {
            reply = "If this is an emergency, please call 101 immediately. There is an emergency call button on your dashboard.";
        } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
            reply = "Hello! I am your Triksha Health Assistant. How can I help you today?";
        } else if (lowerText.includes('records') || lowerText.includes('report')) {
            reply = "Your health records are safely stored in the Health Records tab.";
        }

        setResponse(reply);
        speak(reply);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-teal-100 z-50 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <h3 className="font-semibold">Voice Assistant</h3>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-slate-50">

                {/* State Display */}
                <div className="mb-6 text-center">
                    {isListening ? (
                        <div className="flex flex-col items-center">
                            <div className="relative flex h-16 w-16 items-center justify-center mb-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <div className="relative inline-flex rounded-full h-12 w-12 bg-teal-500 items-center justify-center">
                                    <Mic className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <p className="text-teal-700 font-medium">Listening...</p>
                        </div>
                    ) : isSpeaking ? (
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <Volume2 className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-blue-700 font-medium">Speaking...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <p className="text-sm mb-4">Tap the microphone to speak</p>
                        </div>
                    )}
                </div>

                {/* Transcript Area */}
                {transcript && (
                    <div className="w-full bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">You said:</p>
                        <p className="text-gray-800 italic">"{transcript}"</p>
                    </div>
                )}

                {/* Response Area */}
                {response && (
                    <div className="w-full bg-teal-50 p-3 rounded-lg border border-teal-100">
                        <p className="text-xs text-teal-600 uppercase font-bold mb-1">Assistant:</p>
                        <p className="text-teal-900">{response}</p>
                    </div>
                )}

            </div>

            {/* Controls */}
            <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
                <button
                    onClick={toggleListening}
                    className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 ${isListening
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-200'
                        }`}
                >
                    {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
            </div>
        </div>
    );
};

export default VoiceAssistant;
