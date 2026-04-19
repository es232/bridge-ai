import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Search } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bridge-ai-5vrk.onrender.com";

interface Opportunity {
  id: number;
  type: string;
  title: { en: string; ta: string };
  match_score: number;
  value_amount: string;
  tags: string[];
  description_en: string;
  requirements: string[];
  apply_link: string;
}

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search

  const userRole = localStorage.getItem('user_role') || "Senior Citizen";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Construct the URL with both category and search
        const params = new URLSearchParams();
        params.append('category', userRole);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(`${API_BASE_URL}/opportunities?${params.toString()}`);
        
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        setOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };

    // Use a small timeout (debounce) so it doesn't call the API on every single letter typed
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [userRole, searchTerm]); // Trigger fetch when role OR search changes

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Recommended for You</h2>
        <p className="text-slate-500 mt-2">Personalized opportunities for a <strong>{userRole}</strong></p>
      </div>

      {/* --- SEARCH OPTION UI --- */}
      <div className="relative max-w-lg mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search for schemes (e.g., pension, medical)..."
          className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium">Searching matches...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center p-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 italic">No matches found for your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <motion.div 
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  opp.type === 'scholarship' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {opp.type}
                </span>
                <div className="flex items-center text-emerald-600 font-bold">
                  <Award size={16} className="mr-1" />
                  {opp.match_score}% Match
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">{opp.title.en}</h3>
              <p className="text-slate-500 text-sm mb-4 italic">{opp.title.ta}</p>
              
              <div className="text-2xl font-black text-indigo-600 mb-4">{opp.value_amount}</div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-2">{opp.description_en}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {opp.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              <a 
                href={opp.apply_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Apply Now <ExternalLink size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Opportunities;