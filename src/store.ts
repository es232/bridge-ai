import { create } from 'zustand';

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  age: string;
  qualification: string;
  state: string;
  domain?: string;
  expectations?: string;
  saved_ids?: number[];
}

interface AppState {
  authToken: string | null;
  userProfile: UserProfile;
  language: 'en' | 'ta' | 'hi';
  setAuthToken: (token: string | null) => void;
  setLanguage: (lang: 'en' | 'ta' | 'hi') => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  clearUserProfile: () => void;
}

// Read initial token and profile from localStorage if exists
const initialToken = localStorage.getItem('bridgeai_token');
const initialProfile = localStorage.getItem('bridgeai_profile') 
    ? JSON.parse(localStorage.getItem('bridgeai_profile') as string) 
    : { name: '', email: '', age: '', qualification: 'UG', state: '' };

export const useStore = create<AppState>((set) => ({
  authToken: initialToken,
  userProfile: initialProfile,
  language: 'en',
  setAuthToken: (token) => {
    if (token) localStorage.setItem('bridgeai_token', token);
    else localStorage.removeItem('bridgeai_token');
    set({ authToken: token });
  },
  setLanguage: (lang) => set({ language: lang }),
  updateUserProfile: (profile) => 
    set((state) => {
      const updatedProfile = { ...state.userProfile, ...profile };
      localStorage.setItem('bridgeai_profile', JSON.stringify(updatedProfile));
      return { userProfile: updatedProfile };
    }),
  clearUserProfile: () => 
    set(() => {
      localStorage.removeItem('bridgeai_token');
      localStorage.removeItem('bridgeai_profile');
      return {
        authToken: null,
        userProfile: { name: '', age: '', qualification: 'UG', state: '' }
      };
    })
}));
