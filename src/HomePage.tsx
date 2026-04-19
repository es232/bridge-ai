import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from './store';
import { Mic, ArrowRight, Landmark, Microscope, Globe, Blocks, ScanFace } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    headline: "Bridging People to Possibilities",
    subtext: "Discover government schemes, elite international scholarships, and grants that you are mathematically guaranteed to be eligible for. Simply upload a document or speak to our AI.",
    talkBtn: "Talk to BridgeAI",
    manualBtn: "Sign Up / Dashboard",
    missionTitle: "Our Mission & Goals",
    missionText: "We believe that zip codes and language barriers should not dictate human potential. BridgeAI is built to instantly empower rural and urban students alike with state-of-the-art AI infrastructure.",
    feat1: "Vision AI Extraction",
    feat1desc: "Simply snap a picture of your Aadhar or Marksheet. Our multi-modal AI extracts and auto-fills your profile securely.",
    feat2: "Multi-Agent Swarm",
    feat2desc: "It's not just a chat. It's a swarm. An Eligibility Agent does math on your profile while a Researcher Agent scours the web.",
    feat3: "Global Reach",
    feat3desc: "Don't stop at local schemes. We match high-achieving students with Oxford, Fulbright, and Chevening global scholarships.",
    feat4: "Total Inclusivity",
    feat4desc: "Designed from the ground up for Tamil, Hindi, and English. Speak your language natively.",
    footer: "Ready to unlock your future?"
  },
  ta: {
    headline: "மக்களையும் வாய்ப்புகளையும் இணைக்கிறோம்",
    subtext: "உங்களுக்கு ஏற்ற அரசு திட்டங்கள் மற்றும் கல்வி உதவித்தொகைகளை எளிதில் கண்டறிய நாங்கள் உதவுகிறோம். இப்போதே எங்கள் AI உடன் பேசுங்கள்.",
    talkBtn: "BridgeAI உடன் பேசுங்கள்",
    manualBtn: "பதிவு செய்யவும்",
    missionTitle: "எங்கள் நோக்கம்",
    missionText: "நீங்கள் எங்கிருந்து வருகிறீர்கள் என்பது உங்கள் திறனை தீர்மானிக்கக் கூடாது. எங்களின் மேம்பட்ட AI தொழில்நுட்பம் இந்திய மாணவர்களுக்கு உதவும் நோக்கம் கொண்டது.",
    feat1: "விஷன் AI (Vision AI)",
    feat1desc: "ஆதார் அட்டையை பதிவேற்றம் செய்யவும். எங்கள் AI தானாக தகவல்களை நிரப்பும்.",
    feat2: "Multi-Agent Swarm",
    feat2desc: "உங்கள் மதிப்பெண்களுக்கு ஏற்ப சிறந்த வாய்ப்புகளை AI தேர்வு செய்யும்.",
    feat3: "உலகளாவிய வாய்ப்புகள்",
    feat3desc: "Oxford, Fulbright போன்ற சர்வதேச கல்வி உதவித்தொகைகளை கண்டறியும்.",
    feat4: "முழுமையான உள்ளடக்கம்",
    feat4desc: "தமிழ், ஆங்கிலம் மற்றும் இந்தி மொழிகளில் பேசும்.",
    footer: "உங்கள் எதிர்காலத்தை உருவாக்க தயாரா?"
  },
  hi: {
    headline: "संभावनाओं से जुड़ें",
    subtext: "हम आपको उन सरकारी योजनाओं और छात्रवृत्तियों को खोजने में मदद करते हैं जिनके आप पात्र हैं। शुरू करने के लिए बस हमारे AI से बात करें।",
    talkBtn: "BridgeAI से बात करें",
    manualBtn: "साइन अप करें",
    missionTitle: "हमारा लक्ष्य",
    missionText: "हमारा मानना है कि भाषा कभी भी रुकावट नहीं बननी चाहिए। हमारी उच्च-स्तरीय AI तकनीक से हर छात्र अपने सपनों को साकार कर सकता है।",
    feat1: "विज़न AI (Vision AI)",
    feat1desc: "अपना आधार कार्ड अपलोड करें। हमारा AI स्वचालित रूप से आपका फॉर्म भर देगा।",
    feat2: "मल्टी-एजेंट एआई",
    feat2desc: "हमारा उन्नत सिस्टम आपके लिए सटीक छात्रवृत्तियाँ खोजता है।",
    feat3: "वैश्विक पहुँच",
    feat3desc: "Oxford और Fulbright जैसी अंतरराष्ट्रीय छात्रवृत्तियां।",
    feat4: "पूर्ण समावेश",
    feat4desc: "हिंदी, तमिल और अंग्रेजी में बात करें।",
    footer: "क्या आप तैयार हैं?"
  }
};

export default function HomePage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useStore();
  const t = TRANSLATIONS[language];
  const scrollRef = useRef(null);

  return (
    <div ref={scrollRef} className="h-screen bg-[#0A0F1C] text-white font-sans overflow-x-hidden overflow-y-auto w-full pb-32">
      {/* Navbar */}
      <header className="w-full p-6 md:p-8 flex justify-between items-center z-50 fixed top-0 bg-slate-900/50 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Landmark size={24} className="text-white"/>
          </div>
          <span className="text-2xl font-black tracking-tighter">BridgeAI</span>
        </div>
        
        <div className="flex bg-slate-800/80 rounded-2xl p-1.5 border border-slate-700">
          <button onClick={() => setLanguage('en')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>EN</button>
          <button onClick={() => setLanguage('hi')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${language === 'hi' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>HI</button>
          <button onClick={() => setLanguage('ta')} className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${language === 'ta' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>TA</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative pt-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen" />
           <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-indigo-500/30 text-indigo-300 font-black text-sm mb-8">
            <ScanFace size={16} /> Now with Google Gemini 2.5 Multi-Modal AI
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-tight mb-8 tracking-tight">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">{t.headline}</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium mb-16 leading-relaxed max-w-3xl mx-auto">
             {t.subtext}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button onClick={() => navigate('/voice')} className="group flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xl font-black rounded-3xl px-10 py-6 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] active:scale-95 w-full md:w-auto justify-center">
              <Mic size={28} className="group-hover:animate-bounce" /> {t.talkBtn}
            </button>
            <button onClick={() => navigate('/auth')} className="group bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-white text-xl font-bold rounded-3xl px-10 py-6 transition-all active:scale-95 flex items-center gap-4 w-full md:w-auto justify-center">
               {t.manualBtn} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 md:px-20 border-y border-slate-800/50 bg-slate-900/30 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-white">{t.missionTitle}</h2>
          <p className="text-2xl text-slate-400 leading-relaxed max-w-4xl mx-auto font-medium">
            "{t.missionText}"
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-slate-700 hover:border-indigo-500/50 transition-all">
            <Microscope className="text-indigo-400 mb-6" size={48} />
            <h3 className="text-2xl font-black mb-4">{t.feat1}</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{t.feat1desc}</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-emerald-500/20 hover:border-emerald-500/50 transition-all">
            <Blocks className="text-emerald-400 mb-6" size={48} />
            <h3 className="text-2xl font-black mb-4">{t.feat2}</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{t.feat2desc}</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-purple-500/20 hover:border-purple-500/50 transition-all">
            <Globe className="text-purple-400 mb-6" size={48} />
            <h3 className="text-2xl font-black mb-4">{t.feat3}</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{t.feat3desc}</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/40 p-10 rounded-[2.5rem] border border-blue-500/20 hover:border-blue-500/50 transition-all">
            <Mic className="text-blue-400 mb-6" size={48} />
            <h3 className="text-2xl font-black mb-4">{t.feat4}</h3>
            <p className="text-slate-400 text-lg leading-relaxed">{t.feat4desc}</p>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-20">
        <h2 className="text-4xl font-black mb-8">{t.footer}</h2>
        <button onClick={() => navigate('/auth')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-black rounded-full px-12 py-6 transition-all shadow-xl active:scale-95">
          {t.manualBtn}
        </button>
      </section>
    </div>
  );
}
