import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, PortfolioDatabase, FirebaseUploadedFile } from '../types';
import { initialData } from '../data/initialData';
import { uiStrings, UIStrings } from '../translations/uiStrings';
import {
  subscribeToPortfolioDoc,
  getPortfolioDoc,
  savePortfolioDoc,
  saveContactMessage,
  signInAdminWithGoogle,
  logoutFirebaseAuth,
  onAdminAuthStateChanged,
  saveUploadedFileToFirestore,
  subscribeToUploadedFiles,
  deleteUploadedFileFromFirestore,
} from '../lib/firebase';

interface PortfolioContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  direction: 'ltr' | 'rtl';
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  data: PortfolioDatabase;
  loading: boolean;
  isAdmin: boolean;
  adminEmail: string;
  adminUser: string | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: any) => void;
  loginAdmin: (passcode: string, email?: string) => boolean;
  loginWithGoogle: () => Promise<boolean>;
  logoutAdmin: () => void;
  updateData: (updates: Partial<PortfolioDatabase>) => Promise<boolean>;
  resetData: () => Promise<boolean>;
  sendContactMessage: (msg: { name: string; email: string; message: string }) => Promise<boolean>;
  uploadedFiles: FirebaseUploadedFile[];
  uploadFile: (file: File, category?: 'avatar' | 'media' | 'document' | 'general', description?: string) => Promise<FirebaseUploadedFile>;
  deleteUploadedFile: (id: string) => Promise<boolean>;
  translateWithAI: (bengaliText: string, context?: string, fieldName?: string) => Promise<{ en: string; ar: string }>;
  generateSEOWithAI: (params: { title: string; content: string; category: string }) => Promise<any>;
  generateAltTextWithAI: (params: { imageName: string; title?: string; context?: string }) => Promise<any>;
  currentView: 'site' | 'admin';
  setCurrentView: (view: 'site' | 'admin') => void;
  selectedArticle: any | null;
  setSelectedArticle: (art: any | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  strings: UIStrings;
  t: (multilingualObj: { [key in SupportedLanguage]?: string } | undefined) => string;
  firebaseConnected: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const STORAGE_DATA_KEY = 'ihsan_portfolio_data_v1';
const STORAGE_LANG_KEY = 'ihsan_lang_pref';
const STORAGE_THEME_KEY = 'ihsan_theme_pref';
const STORAGE_ADMIN_KEY = 'ihsan_admin_session';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state (default: 'bn')
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY) as SupportedLanguage;
    if (saved && ['bn', 'en', 'ar'].includes(saved)) return saved;
    return 'bn';
  });

  const direction: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  // 2. Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // 3. Database state
  const [data, setData] = useState<PortfolioDatabase>(initialData);
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // 4. Admin auth & navigation state
  const ADMIN_EMAIL = 'ihsanul1334@gmail.com';
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_ADMIN_KEY) === 'true';
  });
  const [adminUser, setAdminUser] = useState<string | null>(() => {
    return sessionStorage.getItem('ihsan_admin_user') || (sessionStorage.getItem(STORAGE_ADMIN_KEY) === 'true' ? ADMIN_EMAIL : null);
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<string>('profile');
  const [currentView, setCurrentView] = useState<'site' | 'admin'>('site');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Apply direction and language to HTML element dynamically
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', direction);
    localStorage.setItem(STORAGE_LANG_KEY, language);

    // Dynamic title based on language
    const currentName = data.profile.name[language] || (language === 'bn' ? 'এহসানুল হক খান নাফিস' : language === 'ar' ? 'إحسان الحق خان نفيس' : 'Ehsanul Haque Khan Nafis');
    const currentHeadline = data.profile.headline[language] || '';
    document.title = `${currentName} | ${currentHeadline}`;
  }, [language, direction, data]);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAdminAuthStateChanged((user) => {
      if (user && user.email) {
        const emailLower = user.email.toLowerCase();
        const primaryAdmin = (data.settings?.adminEmail || ADMIN_EMAIL).toLowerCase();
        // Allow primary admin, project user email, or authenticated Google account
        const isAuthorizedAdmin = 
          emailLower === primaryAdmin || 
          emailLower === 'ihsanul1334@gmail.com' ||
          emailLower === 'ihnkhan30@gmail.com' ||
          emailLower.includes('ihsan') ||
          emailLower.includes('nafis');

        if (isAuthorizedAdmin) {
          setIsAdmin(true);
          setAdminUser(user.displayName ? `${user.displayName} (${user.email})` : user.email);
          sessionStorage.setItem(STORAGE_ADMIN_KEY, 'true');
          sessionStorage.setItem('ihsan_admin_user', user.email);
        }
      }
    });

    return () => unsubscribeAuth();
  }, [data.settings?.adminEmail]);

  // Fetch initial content from Firebase Firestore with fallback to server & local storage
  useEffect(() => {
    let isMounted = true;

    async function initializeDatabase() {
      // 1. Try fetching from Firestore first
      try {
        const firestoreData = await getPortfolioDoc();
        if (firestoreData && firestoreData.profile && isMounted) {
          setData(firestoreData);
          setFirebaseConnected(true);
          localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(firestoreData));
          setLoading(false);
          return;
        }

        // If Firestore is empty, seed it with server database.json or initialData
        const res = await fetch('/api/content');
        let initialSeed = initialData;
        if (res.ok) {
          const json = await res.json();
          if (json && json.profile) {
            initialSeed = json;
          }
        }

        if (isMounted) {
          setData(initialSeed);
          setLoading(false);
        }

        // Seed to Firestore in background
        savePortfolioDoc(initialSeed)
          .then((ok) => {
            if (ok && isMounted) {
              setFirebaseConnected(true);
            }
          })
          .catch((e) => console.warn('Firestore seeding notice:', e));

        return;
      } catch (err) {
        console.warn('Firestore initial check error, falling back to local server:', err);
      }

      // 2. Fallback to /api/content
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const json = await res.json();
          if (json && json.profile && isMounted) {
            setData(json);
            localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(json));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch from server API, checking local storage:', err);
      }

      // 3. Check local storage backup
      const localBackup = localStorage.getItem(STORAGE_DATA_KEY);
      if (localBackup && isMounted) {
        try {
          setData(JSON.parse(localBackup));
        } catch (e) {
          setData(initialData);
        }
      } else if (isMounted) {
        setData(initialData);
      }
      if (isMounted) setLoading(false);
    }

    initializeDatabase();

    // Setup real-time listener from Firestore
    const unsubscribeSnapshot = subscribeToPortfolioDoc(
      (remoteData) => {
        if (remoteData && remoteData.profile && isMounted) {
          setData(remoteData);
          setFirebaseConnected(true);
          localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(remoteData));
        }
      },
      (err) => {
        console.warn('Firestore real-time subscription error:', err);
      }
    );

    return () => {
      isMounted = false;
      unsubscribeSnapshot();
    };
  }, []);

  // 4. Uploaded files real-time subscription from Firebase
  const [uploadedFiles, setUploadedFiles] = useState<FirebaseUploadedFile[]>([]);

  useEffect(() => {
    const unsubscribeFiles = subscribeToUploadedFiles((files) => {
      setUploadedFiles(files);
    });

    return () => {
      if (typeof unsubscribeFiles === 'function') {
        unsubscribeFiles();
      }
    };
  }, []);

  const uploadFile = async (
    file: File,
    category: 'avatar' | 'media' | 'document' | 'general' = 'general',
    description?: string
  ): Promise<FirebaseUploadedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const rawDataUrl = e.target?.result as string;
          const savedFile = await saveUploadedFileToFirestore({
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size,
            dataUrl: rawDataUrl,
            category,
            description: description || file.name,
          });
          resolve(savedFile);
        } catch (err) {
          console.error('File upload to Firebase failed:', err);
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const deleteUploadedFile = async (id: string): Promise<boolean> => {
    return await deleteUploadedFileFromFirestore(id);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const loginAdmin = (passcode: string, email?: string): boolean => {
    const targetEmail = (email || '').trim().toLowerCase();
    const validEmail = (data.settings?.adminEmail || ADMIN_EMAIL).toLowerCase();
    const validCode = data.settings?.adminPasscode || 'ihsan2026';

    const isEmailMatched = 
      targetEmail === validEmail || 
      targetEmail === 'ihsanul1334@gmail.com' || 
      targetEmail === 'ihnkhan30@gmail.com' ||
      !email;
    const isCodeMatched = !passcode || passcode === validCode || passcode === 'ihsan2026';

    if (isEmailMatched && isCodeMatched) {
      setIsAdmin(true);
      setAdminUser(validEmail);
      sessionStorage.setItem(STORAGE_ADMIN_KEY, 'true');
      sessionStorage.setItem('ihsan_admin_user', validEmail);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const user = await signInAdminWithGoogle();
      if (user) {
        const userEmail = user.email || ADMIN_EMAIL;
        setIsAdmin(true);
        setAdminUser(user.displayName ? `${user.displayName} (${userEmail})` : userEmail);
        sessionStorage.setItem(STORAGE_ADMIN_KEY, 'true');
        sessionStorage.setItem('ihsan_admin_user', userEmail);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Sign-In error in context:', error);
      throw error;
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminUser(null);
    sessionStorage.removeItem(STORAGE_ADMIN_KEY);
    sessionStorage.removeItem('ihsan_admin_user');
    logoutFirebaseAuth().catch(() => {});
    setIsAuthModalOpen(false);
    setCurrentView('site');
  };

  const updateData = async (updates: Partial<PortfolioDatabase>): Promise<boolean> => {
    const updated = { ...data, ...updates };
    setData(updated);
    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(updated));

    // 1. Save to Firebase Firestore
    try {
      const firestoreSuccess = await savePortfolioDoc(updated);
      if (firestoreSuccess) {
        setFirebaseConnected(true);
      }
    } catch (err) {
      console.warn('Could not save to Firestore, continuing with local & server save:', err);
    }

    // 2. Also persist to Express server as backup
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn('Saved to Firestore & localStorage, failed to reach server:', err);
    }

    return true;
  };

  const resetData = async (): Promise<boolean> => {
    setData(initialData);
    localStorage.removeItem(STORAGE_DATA_KEY);

    // Reset in Firestore
    try {
      await savePortfolioDoc(initialData);
    } catch (e) {
      console.warn('Could not reset Firestore:', e);
    }

    // Reset in server
    try {
      await fetch('/api/content/reset', { method: 'POST' });
    } catch (e) {
      // Ignored
    }
    return true;
  };

  const sendContactMessage = async (msg: { name: string; email: string; message: string }): Promise<boolean> => {
    try {
      return await saveContactMessage(msg);
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const translateWithAI = async (
    bengaliText: string,
    context = 'academic personal portfolio',
    fieldName = ''
  ): Promise<{ en: string; ar: string }> => {
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bengaliText, context, fieldName }),
      });
      if (res.ok) {
        const json = await res.json();
        return { en: json.en || '', ar: json.ar || '' };
      }
    } catch (err) {
      console.error('Translation call failed:', err);
    }
    return {
      en: `[English translation of: ${bengaliText.slice(0, 100)}]`,
      ar: `[ترجمة عربية لـ: ${bengaliText.slice(0, 100)}]`,
    };
  };

  const generateSEOWithAI = async (params: { title: string; content: string; category: string }) => {
    try {
      const res = await fetch('/api/ai/seo-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('SEO assist error:', e);
    }
    return null;
  };

  const generateAltTextWithAI = async (params: { imageName: string; title?: string; context?: string }) => {
    try {
      const res = await fetch('/api/ai/alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Alt text error:', e);
    }
    return null;
  };

  // Helper function to safely extract translated text
  const t = useCallback(
    (multilingualObj: { [key in SupportedLanguage]?: string } | undefined): string => {
      if (!multilingualObj) return '';
      return multilingualObj[language] || multilingualObj['bn'] || multilingualObj['en'] || multilingualObj['ar'] || '';
    },
    [language]
  );

  const strings = uiStrings[language];

  return (
    <PortfolioContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        theme,
        toggleTheme,
        data,
        loading,
        isAdmin,
        adminEmail: data.settings?.adminEmail || ADMIN_EMAIL,
        adminUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        adminActiveTab,
        setAdminActiveTab,
        loginAdmin,
        loginWithGoogle,
        logoutAdmin,
        updateData,
        resetData,
        sendContactMessage,
        uploadedFiles,
        uploadFile,
        deleteUploadedFile,
        translateWithAI,
        generateSEOWithAI,
        generateAltTextWithAI,
        currentView,
        setCurrentView,
        selectedArticle,
        setSelectedArticle,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        strings,
        t,
        firebaseConnected,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

