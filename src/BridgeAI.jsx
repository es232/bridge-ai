import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from './store';
import { 
  User, Lock, Mail, LayoutDashboard, Search, Bell, 
  Settings, LogOut, GraduationCap, Briefcase, Landmark, 
  ChevronRight, Star, Filter, ArrowRight, CheckCircle2,
  Sun, Moon, X, Info, Heart, ClipboardList, Languages,
  TrendingUp, Zap, MessageSquare, Microscope, Layers, Send, 
  Mic, MicOff, Volume2, VolumeX, Phone, Globe, MessageCircle, ScanFace
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bridge-ai-5vrk.onrender.com";

const TRANSLATIONS = {
  en: {
    logo: "BridgeAI", tagline: "Bridging People to Possibilities", dashboard: "Dashboard",
    discover: "Discover", saved: "Saved", notifications: "Notifications",
    scholarships: "Scholarships", schemes: "Govt Schemes", internships: "Internships",
    all: "ALL", grants: "Grants", international: "International",
    welcome: "Welcome back", matchScore: "Match Score", value: "Potential Value",
    browse: "Browse More", requirements: "Requirements", apply: "Apply Now",
    signOut: "Sign Out", theme: "Light Mode", dark: "Dark Mode",
    regHeader: "Create Your Profile", next: "Continue",
    topMatches: "Your Top Matches", totalValue: "Total Available Value",
    searchPlaceholder: "Search scholarships or keywords..."
  },
  ta: {
    logo: "BridgeAI", tagline: "மக்களையும் வாய்ப்புகளையும் இணைக்கிறது", dashboard: "முகப்பு",
    discover: "கண்டறியுங்கள்", saved: "சேமிக்கப்பட்டது", notifications: "அறிவிப்புகள்",
    scholarships: "புலமைப்பரிசில்", schemes: "அரசு திட்டங்கள்", internships: "பயிற்சி",
    all: "அனைத்தும்", grants: "நிதி உதவி", international: "சர்வதேச",
    welcome: "நல்வரவு", matchScore: "பொருத்தம்", value: "மதிப்பு",
    browse: "மேலும் பார்க்க", requirements: "ஆவணங்கள்", apply: "விண்ணப்பிக்க",
    signOut: "வெளியேறு", theme: "பகல் பயன்முறை", dark: "இரவு பயன்முறை",
    regHeader: "சுயவிவரத்தை உருவாக்கவும்", next: "தொடரவும்",
    topMatches: "உங்களுக்கான சிறந்த தேர்வுகள்", totalValue: "மொத்த மதிப்பு",
    searchPlaceholder: "தேடுங்கள்..."
  },
  hi: {
    logo: "BridgeAI", tagline: "संभावनाओं से जुड़ें", dashboard: "डैशबोर्ड",
    discover: "खोजें", saved: "सहेजा गया", notifications: "सूचनाएं",
    scholarships: "छात्रवृत्तियां", schemes: "सरकारी योजनाएं", internships: "इंटर्नशिप",
    all: "सभी", grants: "अनुदान", international: "अंतरराष्ट्रीय",
    welcome: "वापसी पर स्वागत है", matchScore: "मिलान स्कोर", value: "संभावित मूल्य",
    browse: "अधिक ब्राउज़ करें", requirements: "आवश्यकताएं", apply: "अभी आवेदन करें",
    signOut: "साइन आउट", theme: "लाइट मोड", dark: "डार्क मोड",
    regHeader: "अपनी प्रोफ़ाइल बनाएं", next: "जारी रखें",
    topMatches: "आपके शीर्ष मैच", totalValue: "कुल उपलब्ध मूल्य",
    searchPlaceholder: "छात्रवृत्ति खोजें..."
  }
};

const EditProfileModal = ({ isDarkMode, onClose, userProfile, onSaveProfile }) => {
  const [formData, setFormData] = useState({ ...userProfile });
  const [saving, setSaving] = useState(false);
  
  const handleSave = async () => {
    setSaving(true);
    await onSaveProfile(formData);
    setSaving(false);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className={`w-full max-w-md h-full p-8 border-l relative flex flex-col ${isDarkMode ? 'bg-slate-900/90 border-white/10 text-white shadow-2xl backdrop-blur-xl' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'}`}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800/20"><X size={24}/></button>
        <h2 className="text-3xl font-black mb-8">Edit Profile</h2>
        <div className="space-y-5 flex-1 overflow-y-auto pr-2">
          <div><label className="text-xs font-black tracking-widest text-indigo-500 uppercase">Name</label><input type="text" value={formData.name || ''} onChange={e=>setFormData({...formData, name:e.target.value})} className={`w-full p-4 rounded-xl border outline-none mt-2 transition-all focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
          <div><label className="text-xs font-black tracking-widest text-indigo-500 uppercase">Age</label><input type="text" value={formData.age || ''} onChange={e=>setFormData({...formData, age:e.target.value})} className={`w-full p-4 rounded-xl border outline-none mt-2 transition-all focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
          <div><label className="text-xs font-black tracking-widest text-indigo-500 uppercase">State/Locality</label><input type="text" value={formData.state || ''} onChange={e=>setFormData({...formData, state:e.target.value})} className={`w-full p-4 rounded-xl border outline-none mt-2 transition-all focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
          <div><label className="text-xs font-black tracking-widest text-indigo-500 uppercase">Qualification</label><input type="text" value={formData.qualification || ''} onChange={e=>setFormData({...formData, qualification:e.target.value})} className={`w-full p-4 rounded-xl border outline-none mt-2 transition-all focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
          <div><label className="text-xs font-black tracking-widest text-indigo-500 uppercase">Domain</label><input type="text" value={formData.domain || ''} onChange={e=>setFormData({...formData, domain:e.target.value})} className={`w-full p-4 rounded-xl border outline-none mt-2 transition-all focus:border-indigo-500 ${isDarkMode ? 'bg-slate-800/50 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} /></div>
        </div>
        <button onClick={handleSave} className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black text-white hover:opacity-90 transition-all shadow-lg active:scale-95">{saving ? 'Updating...' : 'Save & Recalculate Dashboard'}</button>
      </motion.div>
    </motion.div>
  );
};

const DetailModal = ({ item, isDarkMode, onClose, t, lang, onSave, isSaved }) => {
  const [showCopilot, setShowCopilot] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={`w-full max-w-xl p-8 rounded-[2.5rem] border relative backdrop-blur-2xl ${isDarkMode ? 'bg-slate-900/60 border-white/10 text-white shadow-[0_0_50px_rgba(79,70,229,0.15)]' : 'bg-white/80 border-slate-200 text-slate-900 shadow-2xl'}`}>
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800/20 transition-colors">
          <X size={24} className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}/>
        </button>
        
        {!showCopilot ? (
          <>
            <div className="flex items-center gap-4 mb-4">
               <div className="px-4 py-1 bg-indigo-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest">{item.type}</div>
               <div className="text-emerald-500 font-bold text-sm">{item.match_score}% Match</div>
            </div>

            <h2 className="text-3xl font-black mb-4 leading-tight">{item.title[lang] || item.title.en}</h2>
            <p className={`text-sm mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.description_en || "Explore this opportunity to advance your career and education."}</p>
            
            <div className={`p-6 rounded-3xl mb-8 ${isDarkMode ? 'bg-slate-800/50 backdrop-blur-md' : 'bg-slate-50'}`}>
              <h4 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4">{t.requirements}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {(item.requirements || ['Aadhar Card', 'Income Certificate', 'College ID']).map(req => (
                  <div key={req} className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 size={16} className="text-indigo-500 shrink-0" /> 
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{req}</span>
                  </div>
                ))}
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-4">Steps to Apply</h4>
              <div className="space-y-3">
                 <div className="flex gap-3 text-sm font-medium"><div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">1</div><span className={isDarkMode ? 'text-slate-300':'text-slate-700'}>Register on the official portal with basic details.</span></div>
                 <div className="flex gap-3 text-sm font-medium"><div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">2</div><span className={isDarkMode ? 'text-slate-300':'text-slate-700'}>Verify OTP sent to your registered mobile number.</span></div>
                 <div className="flex gap-3 text-sm font-medium"><div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">3</div><span className={isDarkMode ? 'text-slate-300':'text-slate-700'}>Upload exact documents listed above.</span></div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
               <button onClick={() => onSave(item.id)} className={`p-4 rounded-2xl border transition-all ${isSaved ? 'bg-amber-500 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'border-white/10 text-slate-400 hover:border-slate-500'}`}>
                  <Star size={24} fill={isSaved ? "currentColor" : "none"} />
               </button>
               <button onClick={() => setShowCopilot(true)} className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/30">
                 Assistant Auto-Apply <Zap size={18}/>
               </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Zap className="text-indigo-500 absolute animate-ping opacity-50" size={32}/>
              <Zap className="text-indigo-400 relative z-10" size={32}/>
            </div>
            <h2 className="text-2xl font-black mb-2">BridgeAI Application Copilot</h2>
            <p className="text-slate-400 text-sm mb-8 px-4">We are fetching the chaotic external form and structuring it for you. We will auto-fill your saved details when you launch the safe portal.</p>
            <div className={`p-6 rounded-2xl text-left border mb-8 ${isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
               <div className="flex justify-between items-center mb-4">
                 <span className="font-bold text-sm">Your Matched Profile Data</span>
                 <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">Ready to Inject</span>
               </div>
               <div className="space-y-2 opacity-80 pointer-events-none">
                 <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-xs text-slate-300 font-mono">Name: [Auto-Filled]</div>
                 <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-xs text-slate-300 font-mono">Qualification: [Auto-Filled]</div>
                 <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-xs text-slate-300 font-mono">State: [Auto-Filled]</div>
               </div>
            </div>
            <button 
               onClick={() => window.open(item.apply_link || '#', '_blank')}
               className="w-full py-4 bg-emerald-600 rounded-2xl font-black text-white hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
            >
               Launch Portal Injected {'>'}
            </button>
            <button onClick={() => setShowCopilot(false)} className="mt-4 text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors">Cancel / Back</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const BridgeAI = ({ initialView = 'dashboard' }) => {
  const navigate = useNavigate();
  const { language: lang, setLanguage: setLang, userProfile } = useStore();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regStep, setRegStep] = useState(1);
  const [isLoginView, setIsLoginView] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [useSmartSignup, setUseSmartSignup] = useState(true); // Toggle for Conversational Onboarding
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const handleUpdateProfile = async (newProfile) => {
     try {
       const token = useStore.getState().authToken;
       if(token) {
         await fetch(`${API_BASE_URL}/update-profile`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({ name: newProfile.name, age: newProfile.age, state: newProfile.state, qualification: newProfile.qualification, domain: newProfile.domain })
         });
       }
       useStore.getState().updateUserProfile(newProfile);
     } catch(e) {}
  };
  
  // Persisted Saved IDs dynamically pulled from Store
  const [savedIds, setSavedIds] = useState(userProfile?.saved_ids || []);
  
  // Chatbot State
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Voice Chat States
  const [isChatListening, setIsChatListening] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const chatAudioRef = useRef(null);
  const chatRecognitionRef = useRef(null);

  // Conversational Auth States
  const [authChatHistory, setAuthChatHistory] = useState([{ role: 'bot', text: 'Hello! I am BridgeAI. I can help you sign up natively. What is your full name?' }]);
  const [authChatInput, setAuthChatInput] = useState("");
  const authChatEndRef = useRef(null);

  const [formData, setFormData] = useState({
    username: userProfile.name || '', email: '', phone: userProfile.phone || '', password: '', qualification: userProfile.qualification || 'UG', domain: '', locality: userProfile.state || '', expectations: ''
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/opportunities`);
        const data = await response.json();
        setOpportunities(data);
      } catch (error) {
        console.error(error);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [chatMessages]);

  const scrollAuthToBottom = () => authChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollAuthToBottom, [authChatHistory]);

  const toggleSave = async (id) => {
    let newSaved;
    if (savedIds.includes(id)) newSaved = savedIds.filter(i => i !== id);
    else newSaved = [...savedIds, id];
    setSavedIds(newSaved);

    // Sync to backend persistent JSON logic
    try {
      const token = useStore.getState().authToken;
      if (token) {
        await fetch(`${API_BASE_URL}/sync-saved`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ saved_ids: newSaved })
        });
        useStore.getState().updateUserProfile({ ...userProfile, saved_ids: newSaved });
      }
    } catch(e) { console.error('Failed to sync saved items'); }
  };

  const playChatbotVoice = async (text) => {
    if (!autoRead) return;
    if (chatAudioRef.current) chatAudioRef.current.pause();
    
    setIsTyping(true); // Visually indicate the AI is "synthesizing" or typing while generating voice
    try {
      const response = await fetch(`${API_BASE_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang: lang })
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      chatAudioRef.current = audio;
      await audio.play();
    } catch(e) { console.error("TTS fetch failed", e); }
    finally { setIsTyping(false); }
  };

  const startChatbotListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support Voice. Use Chrome.");
    
    if (!chatRecognitionRef.current) {
      chatRecognitionRef.current = new SpeechRecognition();
      chatRecognitionRef.current.continuous = false;
      chatRecognitionRef.current.interimResults = false;
      chatRecognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setChatInput(text);
      };
      chatRecognitionRef.current.onend = () => setIsChatListening(false);
    }
    
    chatRecognitionRef.current.lang = lang === 'en' ? 'en-US' : lang === 'ta' ? 'ta-IN' : 'hi-IN';
    chatRecognitionRef.current.start();
    setIsChatListening(true);
  };

  const handleVisionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsTyping(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/extract-vision`, { method: 'POST', body: form });
      const data = await res.json();
      if(data.name && !data.name.includes("Error")) {
         setFormData(prev => ({ ...prev, username: data.name, locality: data.state || prev.locality }));
         useStore.getState().updateUserProfile({ ...userProfile, age: data.age || "20", qualification: data.qualification || "UG" });
         alert("✨ Magic Auto-Fill Success! Detected Name: " + data.name);
      } else {
         alert("Could not extract details clearly.");
      }
    } catch (e) {
      console.error(e);
      alert("Vision Extraction Failed");
    } finally { setIsTyping(false); }
  };

  const handleAuthSendMessage = async () => {
    if (!authChatInput.trim()) return;
    const userMsg = { role: 'user', text: authChatInput };
    setAuthChatHistory(prev => [...prev, userMsg]);
    setAuthChatInput("");
    setIsTyping(true);

    try {
      // 1. Give history to Gemini to parse into JSON
      const fullHistoryStr = [...authChatHistory, userMsg].map(m => m.role + ": " + m.text).join('\n');
      const res = await fetch(`${API_BASE_URL}/parse-registration`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ chat_history: fullHistoryStr })
      });
      const parsedData = await res.json();
      
      // Update our form data quietly
      setFormData(prev => ({ ...prev, ...parsedData, username: parsedData.name || prev.username, locality: parsedData.state || prev.locality }));

      // 2. Decide next bot message based on what is missing
      let nextQuestion = "";
      if (!parsedData.email) nextQuestion = "I caught your name! What is your email address?";
      else if (!parsedData.password) nextQuestion = "Got it! Please provide a secure password you would like to use.";
      else if (!parsedData.phone) nextQuestion = "Thanks! Lastly, what is your phone number?";
      else nextQuestion = "Amazing! I have all your details. You can now click the 'Continue' button to proceed!";

      setAuthChatHistory(prev => [...prev, { role: 'bot', text: nextQuestion }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, user_profile: userProfile })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'bot', text: data.response }]);
      playChatbotVoice(data.response);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'bot', text: "Network error occurred." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAuth = async (isLoginReq) => {
    try {
      const endpoint = isLoginReq ? '/login' : '/register';
      const payload = isLoginReq 
        ? { email: formData.email, password: formData.password }
        : { name: formData.username, email: formData.email, phone: formData.phone, password: formData.password, age: userProfile.age || "20", qualification: formData.qualification, state: formData.locality, domain: formData.domain, expectations: formData.expectations };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "Authentication failed");
        return;
      }
      
      useStore.getState().setAuthToken(data.access_token);
      useStore.getState().updateUserProfile(data.user);
      setSavedIds(data.user.saved_ids || []);
      navigate('/dashboard');
    } catch (err) {
      alert("Network Error");
    }
  };

  const filteredResults = useMemo(() => {
    let base = opportunities;
    if (activeTab === 'Saved') base = base.filter(item => savedIds.includes(item.id));
    else if (activeTab === 'Scholarships') base = base.filter(item => item.type === 'scholarship');
    else if (activeTab === 'Govt Schemes') base = base.filter(item => item.type === 'scheme');
    else if (activeTab === 'Grants') base = base.filter(item => item.type === 'grant');
    else if (activeTab === 'Internships') base = base.filter(item => item.type === 'internship');
    else if (activeTab === 'International') base = base.filter(item => item.tags && item.tags.join('').includes("International")); // Filter global tags

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      base = base.filter(i => (i.title.en && i.title.en.toLowerCase().includes(s)) || (i.title[lang] && i.title[lang].toLowerCase().includes(s)));
    }
    return base;
  }, [opportunities, activeTab, savedIds, searchTerm, lang]);

  const SIDEBAR_NAV = [
    { id: 'Dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'ALL', icon: Layers, label: t.all },
    { id: 'Scholarships', icon: GraduationCap, label: t.scholarships },
    { id: 'Govt Schemes', icon: Landmark, label: t.schemes },
    { id: 'International', icon: Globe, label: t.international }, // 3. Added International Nav
    { id: 'Grants', icon: Microscope, label: t.grants },
    { id: 'Internships', icon: Briefcase, label: t.internships },
    { id: 'Saved', icon: Star, label: t.saved },
  ];

  if (initialView === 'auth') {
    return (
      <div className={`min-h-screen w-full flex items-center justify-center p-6 ${isDarkMode ? 'bg-[#0A0F1C]' : 'bg-slate-50'}`}>
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[80px]" />
           <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`backdrop-blur-xl relative z-10 p-10 rounded-[3.5rem] border w-full max-w-lg ${isDarkMode ? 'bg-slate-900/50 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-white' : 'bg-white/80 border-slate-200 shadow-2xl text-slate-900'}`}>
          <div className="flex justify-between items-center mb-6">
             <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30">
               <Landmark className="text-white" size={32} />
             </div>
             <button onClick={() => navigate('/voice')} className="flex items-center gap-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-indigo-500/20">
               <Mic size={16}/> Use Voice Setup
             </button>
          </div>

          {!isLoginView && regStep === 1 ? (
            <div className="text-center">
              <h2 className="text-3xl font-black mb-2">{t.regHeader}</h2>
              <p className="text-slate-400 mb-6 font-medium">Join BridgeAI to unlock your potential</p>
              
              {/* SMART ONBOARDING TOGGLES */}
              <div className="flex bg-slate-800/50 p-1 rounded-2xl mb-6 border border-white/5">
                 <button onClick={() => setUseSmartSignup(true)} className={`flex-1 py-3 text-sm font-bold transition-all rounded-xl ${useSmartSignup ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Smart AI Mode</button>
                 <button onClick={() => setUseSmartSignup(false)} className={`flex-1 py-3 text-sm font-bold transition-all rounded-xl ${!useSmartSignup ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Manual Form</button>
              </div>

              {/* Vision AI Section */}
              <div className="mb-6 text-center border-2 border-dashed border-indigo-500/30 p-4 rounded-xl relative hover:bg-indigo-600/10 hover:border-indigo-500/50 transition-all overflow-hidden group">
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleVisionUpload} />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ScanFace className="text-indigo-400" size={20} />
                  </div>
                  <p className="text-sm font-bold text-indigo-300 pointer-events-none">✨ Fast Track: Upload Document</p>
                  <p className="text-xs text-slate-400 pointer-events-none">Our AI reads your ID to auto-fill details</p>
                  {isTyping && <div className="text-xs text-emerald-400 font-bold animate-pulse mt-2 py-1 bg-slate-900/80 rounded-md px-4 absolute bottom-0 w-full z-20">Analyzing Document...</div>}
                </div>
              </div>

              {useSmartSignup ? (
                 <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 h-64 flex flex-col relative text-left">
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                      {authChatHistory.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 max-w-[85%] rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-800 border border-white/10 text-slate-300 rounded-bl-sm'}`}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {isTyping && <div className="text-xs text-indigo-400 font-bold ml-2">BridgeAI is typing...</div>}
                      <div ref={authChatEndRef} />
                    </div>
                    <div className="mt-3 flex gap-2">
                       <input type="text" value={authChatInput} onChange={e => setAuthChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAuthSendMessage()} placeholder="Type your answer naturally..." className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-indigo-500 transition-all font-medium" />
                       <button onClick={handleAuthSendMessage} className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500"><Send size={18}/></button>
                    </div>
                 </div>
              ) : (
                 <div className="space-y-4">
                  <div className="relative"><User className="absolute left-4 top-4 text-slate-500" size={20}/><input type="text" placeholder="Username" value={formData.username} className="w-full p-4 pl-12 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, username: e.target.value})} /></div>
                  <div className="relative"><Mail className="absolute left-4 top-4 text-slate-500" size={20}/><input type="email" placeholder="Email" value={formData.email} className="w-full p-4 pl-12 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                  <div className="relative"><Phone className="absolute left-4 top-4 text-slate-500" size={20}/><input type="tel" placeholder="Phone Number" value={formData.phone} className="w-full p-4 pl-12 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                  <div className="relative"><Lock className="absolute left-4 top-4 text-slate-500" size={20}/><input type="password" placeholder="Password" value={formData.password} className="w-full p-4 pl-12 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
                 </div>
              )}
              
              <button onClick={() => setRegStep(2)} className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95">{t.next}</button>
              <p className="mt-6 text-slate-400 font-medium text-sm">Already have an account? <span onClick={() => setIsLoginView(true)} className="text-indigo-400 cursor-pointer hover:text-indigo-300 font-bold transition-colors">Login</span></p>
            </div>
          ) : !isLoginView && regStep === 2 ? (
            <div>
              <h2 className="text-3xl font-black mb-6 text-center">Tell us more, {formData.username}</h2>
              <div className="space-y-4">
                <input type="text" placeholder="State/Locality" value={formData.locality} className="w-full p-4 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, locality: e.target.value})} />
                <input type="text" placeholder="Domain / Interest (e.g., Computer Science)" value={formData.domain} className="w-full p-4 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, domain: e.target.value})} />
                <textarea placeholder="Expectations? Need laptop? Tuition?" value={formData.expectations} className="w-full p-4 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 h-32 transition-all resize-none" onChange={(e) => setFormData({...formData, expectations: e.target.value})} />
              </div>
              <div className="flex gap-4 mt-8">
                 <button onClick={() => setRegStep(1)} className="flex-1 border border-white/10 text-white font-black py-4 rounded-2xl hover:bg-slate-800/50 transition-all active:scale-95">Back</button>
                 <button onClick={() => handleAuth(false)} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95">Complete Setup</button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-black mb-2">{t.welcome}</h2>
              <p className="text-slate-400 mb-8 font-medium">Log in to view your matched schemes</p>
              <div className="space-y-4">
                <div className="relative"><Mail className="absolute left-4 top-4 text-slate-500" size={20}/><input type="email" placeholder="Email" value={formData.email} className="w-full p-4 pl-12 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                <div className="relative"><Lock className="absolute left-4 top-4 text-slate-500" size={20}/><input type="password" placeholder="Password" value={formData.password} className="w-full p-4 pl-12 rounded-2xl bg-slate-800/50 border border-white/10 text-white outline-none focus:border-indigo-500 transition-all" onChange={(e) => setFormData({...formData, password: e.target.value})} /></div>
              </div>
              <button onClick={() => handleAuth(true)} className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg active:scale-95">Log In</button>
               <p className="mt-6 text-slate-400 font-medium text-sm">Need an account? <span onClick={() => {setIsLoginView(false); setRegStep(1);}} className="text-indigo-400 cursor-pointer hover:text-indigo-300 font-bold transition-colors">Sign Up</span></p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD RENDER ---
  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0F1C] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Dynamic Background */}
      {isDarkMode && (
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]" />
           <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
         </div>
      )}

      {/* Sidebar Glassmorphic Updates */}
      <aside className={`w-20 md:w-72 h-screen flex flex-col justify-between p-4 md:p-6 transition-all z-10 sticky top-0 ${isDarkMode ? 'bg-slate-900/60 backdrop-blur-2xl border-r border-white/5' : 'bg-white border-r border-slate-200'}`}>
        <div>
          <div className="flex md:items-center gap-3 mb-10 pl-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20"><Landmark className="text-white" size={20}/></div>
            <span className="hidden md:block text-xl font-black tracking-tighter">{t.logo}</span>
          </div>
          <nav className="space-y-2">
            {SIDEBAR_NAV.map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold ${isActive ? 'bg-indigo-600 text-white shadow-md' : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')}`}>
                  <Icon size={20} className={isActive ? "text-indigo-200" : ""} />
                  <span className="hidden md:block">{nav.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
           {/* Multi-Lingual Widget */}
           <div className={`hidden md:flex flex-col p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 backdrop-blur-md border-white/5' : 'bg-slate-100 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-widest"><Languages size={14}/> Language</div>
              <div className="flex gap-2">
                 {['en', 'hi', 'ta'].map(l => (
                    <button key={l} onClick={() => setLang(l)} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${lang === l ? 'bg-indigo-600 text-white shadow-md' : (isDarkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-slate-200')}`}>{l}</button>
                 ))}
              </div>
           </div>

          <div className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/80 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
            <div className="flex items-center gap-3 overflow-hidden text-left pl-2">
              <div className="w-10 h-10 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center shrink-0"><User size={18}/></div>
              <div className="hidden md:block truncate">
                <p className="text-sm font-black truncate">{userProfile.name}</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} truncate`}>{userProfile.qualification} • {userProfile.state}</p>
              </div>
            </div>
            <button onClick={() => { useStore.getState().logout(); navigate('/auth'); }} className={`hidden md:block p-2 rounded-xl hover:text-red-400 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}><LogOut size={16}/></button>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <main className="flex-1 p-6 md:p-10 z-10 relative w-full overflow-hidden">
         <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
            <div><h1 className="text-4xl font-black mb-2">{t.dashboard}</h1><p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.discover} - {activeTab}</p></div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className={`relative px-4 py-3 rounded-2xl border flex items-center min-w-[200px] shadow-sm ${isDarkMode ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 text-white' : 'bg-white border-slate-200'}`}>
                <Search size={18} className="text-slate-400 shrink-0"/>
                <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-transparent ml-3 outline-none flex-1 font-medium text-sm w-full placeholder:text-slate-500"/>
              </div>
              <div className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border ${isDarkMode ? 'bg-slate-900/60 backdrop-blur-md border-white/10' : 'bg-white border-slate-200'}`}>
                 {['en', 'hi', 'ta'].map(l => (
                    <button key={l} onClick={() => setLang(l)} className={`px-3 py-2 rounded-xl text-xs font-black uppercase transition-all ${lang === l ? 'bg-indigo-600 text-white shadow-md' : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-600')}`}>{l}</button>
                 ))}
              </div>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-4 rounded-2xl border transition-colors shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-slate-900/60 backdrop-blur-md border-white/10 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>{isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
              <div className={`flex items-center p-2 pr-4 rounded-2xl border cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-sm ${isDarkMode ? 'bg-slate-900/60 backdrop-blur-md border-white/10' : 'bg-white border-slate-200'}`} onClick={() => setShowProfileEditor(true)}>
                 <div className="w-10 h-10 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center shrink-0 mr-3"><User size={18}/></div>
                 <div className="hidden lg:block text-left mr-2">
                   <p className="text-sm font-black truncate w-24">{userProfile.name}</p>
                 </div>
              </div>
              <button onClick={() => { useStore.getState().clearUserProfile(); navigate('/auth'); }} className={`p-4 rounded-2xl border hover:border-red-500 hover:text-red-500 transition-colors shadow-sm ${isDarkMode ? 'bg-slate-900/60 backdrop-blur-md border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}><LogOut size={20}/></button>
            </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {loading ? (
                 <div className="col-span-full pt-20 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>
              ) : filteredResults.length > 0 ? (
                 filteredResults.map((item, idx) => {
                   const isSaved = savedIds.includes(item.id);
                   return (
                     <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.05 }} className={`p-6 rounded-[2rem] border relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer shadow-sm ${isDarkMode ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 hover:shadow-indigo-500/10' : 'bg-white border-slate-200 hover:shadow-xl'}`} onClick={() => setSelectedItem(item)}>
                        <div className="absolute top-0 right-0 p-4 z-10">
                           <button onClick={(e) => { e.stopPropagation(); toggleSave(item.id); }} className="hover:scale-110 active:scale-90 transition-transform"><Star size={22} className={isSaved ? "text-amber-400 fill-amber-400" : "text-slate-400 stroke-[1.5]"} /></button>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest mb-6 ${item.type === 'scholarship' ? 'bg-indigo-600/20 text-indigo-400' : item.type === 'scheme' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-purple-500/20 text-purple-400'}`}>
                           {item.type === 'scholarship' ? <GraduationCap size={14}/> : <Landmark size={14}/>} {item.type}
                        </div>
                        <h3 className="text-xl font-black mb-3 pr-8 leading-snug group-hover:text-indigo-400 transition-colors line-clamp-2">{item.title[lang] || item.title.en}</h3>
                        <p className={`text-sm mb-6 line-clamp-2 font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.description_en || "Click to learn more about application procedures and requirements."}</p>
                        <div className="flex items-center justify-between mt-auto">
                           <div><div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">{t.value}</div><div className={`font-black ${isDarkMode?'text-white':'text-slate-900'}`}>{item.value_amount}</div></div>
                           <div className="text-right"><div className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">{t.matchScore}</div><div className="font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg inline-block">{item.match_score}%</div></div>
                        </div>
                     </motion.div>
                   )
                 })
              ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full pt-10 text-center"><ClipboardList className="mx-auto mt-10 mb-4 text-slate-600 opacity-50" size={48} /><p className="text-lg font-bold text-slate-500">No opportunities found for this view.</p></motion.div>
              )}
            </AnimatePresence>
         </div>
      </main>

      {/* Floating Chat Interface */}
      <AnimatePresence>
        {(!showChat) && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => setShowChat(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-transform z-50">
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className={`fixed bottom-6 right-6 w-full max-w-[380px] h-[600px] flex flex-col rounded-[2.5rem] shadow-2xl z-50 overflow-hidden border backdrop-blur-3xl ${isDarkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="p-5 flex justify-between items-center border-b border-white/5 bg-indigo-600 justify-between shrink-0">
               <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 shadow-inner"><img src="https://api.dicebear.com/7.x/bottts/svg?seed=BridgeAI&backgroundColor=transparent" className="w-7 h-7" alt="bot"/></div><div><h3 className="font-black text-white text-lg leading-tight">BridgeAI Swarm</h3><p className="text-xs text-indigo-200 font-bold">Agents Active • Responding directly</p></div></div>
               <div className="flex gap-2">
                 <button onClick={() => setAutoRead(!autoRead)} className="p-2 text-white/80 hover:bg-white/20 rounded-full transition-colors">{autoRead ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
                 <button onClick={() => setShowChat(false)} className="p-2 text-white/80 hover:bg-white/20 rounded-full transition-colors"><X size={20}/></button>
               </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-6 scrollbar-hide bg-transparent flex flex-col relative">
               <div className="flex justify-start"><div className={`p-4 max-w-[85%] rounded-3xl text-sm leading-relaxed shadow-sm font-medium ${isDarkMode ? 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>Hello {userProfile.name}! Ask me about matching scholarships, rules, or anything related to education!</div></div>
               {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`p-4 max-w-[85%] rounded-3xl text-sm leading-relaxed shadow-sm font-medium ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : (isDarkMode ? 'bg-slate-800 text-slate-200 border border-white/5 rounded-bl-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm')}`}>
                       {msg.text}
                     </div>
                  </div>
               ))}
               {isTyping && <div className="text-xs font-bold text-indigo-400 pl-4 py-2 animate-pulse flex items-center gap-2">Agent Swarm Synthesizing...</div>}
               <div ref={chatEndRef}/>
            </div>

            <div className={`p-4 border-t shrink-0 ${isDarkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}`}>
               <div className={`flex items-center gap-2 p-2 rounded-2xl ${isDarkMode ? 'bg-slate-800 border border-white/5' : 'bg-slate-100 border border-slate-200'}`}>
                 <button onClick={startChatbotListening} className={`p-3 rounded-xl transition-all shadow-sm ${isChatListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-400 hover:text-indigo-400'}`}>{isChatListening ? <MicOff size={20}/> : <Mic size={20}/>}</button>
                 <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Ask the swarm..." disabled={isChatListening} className={`flex-1 bg-transparent border-none outline-none text-sm font-medium px-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}/>
                 <button onClick={handleSendMessage} disabled={!chatInput.trim() || isChatListening} className="p-3 bg-indigo-600 text-white rounded-xl shadow-md disabled:opacity-50 hover:bg-indigo-500 transition-colors"><Send size={18}/></button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && <DetailModal item={selectedItem} isDarkMode={isDarkMode} onClose={() => setSelectedItem(null)} t={t} lang={lang} isSaved={savedIds.includes(selectedItem.id)} onSave={toggleSave} />}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileEditor && <EditProfileModal isDarkMode={isDarkMode} onClose={() => setShowProfileEditor(false)} userProfile={userProfile} onSaveProfile={handleUpdateProfile} />}
      </AnimatePresence>
    </div>
  );
};

export default BridgeAI;