import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_URL || `${API_BASE_URL}`;

const LANG_MAP = {
  en: 'en-US',
  ta: 'ta-IN',
  hi: 'hi-IN'
};

const QUESTIONS = {
  en: [
    "What is your name?",
    "What is your age?",
    "What is your qualification?",
    "Which state are you from?"
  ],
  ta: [
    "உங்கள் பெயர் என்ன?",
    "உங்கள் வயது என்ன?",
    "உங்கள் கல்வி தகுதி என்ன?",
    "நீங்கள் எந்த மாநிலம் அல்லது ஊரைச் சேர்ந்தவர்?"
  ],
  hi: [
    "आपका नाम क्या है?",
    "आपकी उम्र क्या है?",
    "आपकी योग्यता क्या है?",
    "आप किस राज्य या शहर से हैं?"
  ]
};

const KEYS = ['name', 'age', 'qualification', 'state'];

export default function VoiceAssistant() {
  const navigate = useNavigate();
  const { language, updateUserProfile } = useStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const stepRef = useRef(0);
  const answersRef = useRef<Record<string, string>>({});
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef(window.speechSynthesis);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser does not support Voice Recognition. Please use Chrome.");
      return;
    }
    
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    
    recognitionRef.current.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalResult = event.results[i][0].transcript;
          handleFinalAnswer(finalResult);
        } else {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(currentTranscript);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Begin
    startConversation();
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioRef.current) audioRef.current.pause();
      synthRef.current.cancel();
    };
  }, [language]);

  const startConversation = () => {
    stepRef.current = 0;
    setCurrentStep(0);
    answersRef.current = {};
    
    const intro = {
      en: "Hello! I will help you find the best opportunities. Let's get started.",
      ta: "வணக்கம்! சிறந்த வாய்ப்புகளைக் கண்டறிய நான் உங்களுக்கு உதவுவேன். ஆரம்பிக்கலாம்.",
      hi: "नमस्ते! मैं आपको बेहतरीन अवसर खोजने में मदद करूँगा। चलिए शुरू करते हैं।"
    };
    
    speak(intro[language], () => {
      askQuestion(stepRef.current);
    });
  };

  const askQuestion = (index: number) => {
    if (index >= QUESTIONS[language].length) {
      completeFlow();
      return;
    }
    setCurrentStep(index);
    setTranscript("");
    speak(QUESTIONS[language][index], () => {
      startListening();
    });
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = LANG_MAP[language];
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) { /* Ignore */ }
    }
  };

  const speak = async (text: string, onEnd?: () => void) => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: language })
      });
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => { if (onEnd) onEnd(); };
      await audio.play();
    } catch(e) {
      console.error("TTS fetch failed", e);
      // Fallback
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_MAP[language];
      utterance.onend = () => { if (onEnd) onEnd(); };
      synthRef.current.speak(utterance);
    }
  };

  const handleFinalAnswer = (text: string) => {
    const key = KEYS[stepRef.current];
    answersRef.current[key] = text;
    
    // Move to next
    stepRef.current += 1;
    askQuestion(stepRef.current);
  };

  const completeFlow = () => {
    const outro = {
      en: "Perfect! Just one last thing, please enter your email and password to secure your account.",
      ta: "சரியானது! உங்கள் கணக்கை பாதுகாக்க உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
      hi: "बिल्कुल सही! अपने खाते को सुरक्षित करने के लिए अपना ईमेल और पासवर्ड दर्ज करें।"
    };
    
    updateUserProfile({
      name: answersRef.current.name || "",
      age: answersRef.current.age || "",
      qualification: answersRef.current.qualification || "UG",
      state: answersRef.current.state || ""
    });

    speak(outro[language], () => {
      navigate('/auth');
    });
  };

  if (error) {
    return (
      <div className="flex bg-[#0A0F1C] min-h-screen text-white items-center justify-center p-8">
         <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-3xl max-w-lg text-center font-bold">
            {error}
            <button onClick={() => navigate('/')} className="mt-6 block w-full bg-slate-800 p-4 rounded-xl">Go Back</button>
         </div>
      </div>
    );
  }

  const currentQuestionText = QUESTIONS[language][currentStep] || "Processing...";

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Background Pulsing effects */}
      <motion.div 
        animate={{ scale: isListening ? [1, 1.2, 1] : 1, opacity: isListening ? 0.3 : 0.1 }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-3xl text-center flex flex-col items-center">
        
        <div className="mb-12 flex flex-row items-center gap-4 border border-slate-700/50 bg-slate-800/30 px-6 py-3 rounded-full backdrop-blur-sm">
          <Activity className="text-emerald-400" size={24} />
          <span className="text-xl font-black tracking-wider text-slate-300">
             STEP {Math.min(currentStep + 1, 4)} OF 4
          </span>
        </div>

        <motion.h1 
          key={currentQuestionText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black mb-16 leading-tight"
        >
          {currentQuestionText}
        </motion.h1>

        {isListening ? (
          <div className="flex flex-col items-center">
             <div className="relative w-40 h-40 flex justify-center items-center">
               {/* Waveform representation */}
               <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-32 h-32 bg-indigo-500 rounded-full" />
               <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="absolute w-28 h-28 bg-emerald-500 rounded-full" />
               <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                  <Mic size={40} className="text-white" />
               </div>
             </div>
             <p className="mt-8 text-2xl font-bold text-slate-400 animate-pulse">Listening...</p>
          </div>
        ) : (
          <div className="w-40 h-40 flex justify-center items-center">
             <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center opacity-50">
               <MicOff size={40} className="text-slate-500" />
             </div>
          </div>
        )}

        <div className="mt-16 h-32 w-full">
           <AnimatePresence mode="wait">
             {transcript ? (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                 className="bg-white/10 border border-white/20 p-6 rounded-3xl text-2xl md:text-3xl text-indigo-200 font-medium"
               >
                 "{transcript}"
               </motion.div>
             ) : (
               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-slate-600 font-medium">
                 Speak your answer slowly and clearly.
               </motion.p>
             )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
