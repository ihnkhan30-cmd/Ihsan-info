import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { NafisLogo } from './NafisLogo';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  UserCheck, 
  ArrowRight, 
  LogOut, 
  Sparkles,
  AlertCircle,
  FileText,
  Video,
  GraduationCap,
  Briefcase,
  Award,
  User
} from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    isAdmin, 
    adminEmail, 
    adminUser, 
    loginAdmin, 
    loginWithGoogle,
    logoutAdmin, 
    setCurrentView,
    setAdminActiveTab,
    data,
    firebaseConnected,
  } = usePortfolio();

  const [email, setEmail] = useState('ihsanul1334@gmail.com');
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        setIsAuthModalOpen(false);
        setCurrentView('admin');
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setAuthError('গুগল লগইন ব্যর্থ হয়েছে বা পপ-আপ বন্ধ করা হয়েছে। আপনি নিচের কুইক লগইন বা পাসকোড ব্যবহার করতে পারেন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (targetEmail = 'ihsanul1334@gmail.com') => {
    setIsSubmitting(true);
    setAuthError(null);
    setTimeout(() => {
      const success = loginAdmin('ihsan2026', targetEmail);
      setIsSubmitting(false);
      if (success) {
        setIsAuthModalOpen(false);
        setCurrentView('admin');
      } else {
        setAuthError('লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    }, 300);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    setTimeout(() => {
      const codeToUse = passcode || 'ihsan2026';
      const success = loginAdmin(codeToUse, email);
      setIsSubmitting(false);

      if (success) {
        setIsAuthModalOpen(false);
        setCurrentView('admin');
      } else {
        setAuthError('ভুল ইমেইল অথবা পাসকোড! অ্যাডমিন ইমেইল: ihsanul1334@gmail.com (ডিফল্ট পাসকোড: ihsan2026)');
      }
    }, 300);
  };

  const handleNavigateTab = (tabId: string) => {
    setAdminActiveTab(tabId);
    setCurrentView('admin');
    setIsAuthModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E2536] border border-[#C6A15B]/30 shadow-2xl overflow-hidden text-start animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon & Close Button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B1F33] to-[#142B3D] border border-[#C6A15B]/40 flex items-center justify-center p-1.5 shadow-sm">
              <NafisLogo size={30} animated={true} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
                <span>{isAdmin ? 'অ্যাডমিন কন্ট্রোল সেন্টার' : 'অ্যাডমিন পোর্টাল'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] font-semibold border border-[#C6A15B]/30">
                  {isAdmin ? 'অনুমোদিত' : 'নিরাপদ লগইন'}
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isAdmin 
                  ? 'পোর্টফোলিও কনটেন্ট ও সকল সেকশন এডিটর' 
                  : 'সকল টেক্সট ও সেকশন এডিট করতে প্রবেশ করুন'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {isAdmin ? (
            /* Logged in state view */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      সক্রিয় অ্যাডমিন অ্যাকাউন্ট
                    </div>
                    <div className="text-sm font-bold text-[#0B1F33] dark:text-white">
                      {adminUser || adminEmail}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => logoutAdmin()}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Log out session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  যে কোনো সেকশন এডিট করুন (Direct Section Access)
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleNavigateTab('profile')}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#142B3D] hover:bg-[#C6A15B]/10 hover:border-[#C6A15B]/50 border border-gray-200 dark:border-gray-800 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#C6A15B]" />
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-white group-hover:text-[#C6A15B]">
                        প্রোফাইল ও হিরো টেক্সট
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 pl-6">নাম, বায়ো, ছবি ও তথ্য</p>
                  </button>

                  <button
                    onClick={() => handleNavigateTab('education')}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#142B3D] hover:bg-[#C6A15B]/10 hover:border-[#C6A15B]/50 border border-gray-200 dark:border-gray-800 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#C6A15B]" />
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-white group-hover:text-[#C6A15B]">
                        শিক্ষাগত যোগ্যতা
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 pl-6">ডিগ্রি, প্রতিষ্ঠান ও সাল</p>
                  </button>

                  <button
                    onClick={() => handleNavigateTab('experience')}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#142B3D] hover:bg-[#C6A15B]/10 hover:border-[#C6A15B]/50 border border-gray-200 dark:border-gray-800 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="w-4 h-4 text-[#C6A15B]" />
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-white group-hover:text-[#C6A15B]">
                        অভিজ্ঞতা ও কর্মজীবন
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 pl-6">সংগঠন ও সামাজিক কাজ</p>
                  </button>

                  <button
                    onClick={() => handleNavigateTab('awards')}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#142B3D] hover:bg-[#C6A15B]/10 hover:border-[#C6A15B]/50 border border-gray-200 dark:border-gray-800 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-[#C6A15B]" />
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-white group-hover:text-[#C6A15B]">
                        পুরস্কার ও অর্জন
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 pl-6">জাতীয় সম্মাননা ও বিতর্ক</p>
                  </button>

                  <button
                    onClick={() => handleNavigateTab('articles')}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#142B3D] hover:bg-[#C6A15B]/10 hover:border-[#C6A15B]/50 border border-gray-200 dark:border-gray-800 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#C6A15B]" />
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-white group-hover:text-[#C6A15B]">
                        প্রবন্ধ ও প্রকাশনা
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 pl-6">কলাম, গবেষণা ও ড্রাফট</p>
                  </button>

                  <button
                    onClick={() => handleNavigateTab('media')}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-[#142B3D] hover:bg-[#C6A15B]/10 hover:border-[#C6A15B]/50 border border-gray-200 dark:border-gray-800 text-start transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4 text-[#C6A15B]" />
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-white group-hover:text-[#C6A15B]">
                        মিডিয়া ও ভিডিও
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 pl-6">ইউটিউব ও অনুষ্ঠানের ছবি</p>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0B1F33] to-[#142B3D] dark:from-[#C6A15B] dark:to-[#d8b56f] text-white dark:text-[#0B1F33] font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>সম্পূর্ণ অ্যাডমিন ড্যাশবোর্ড খুলুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Login required state view */
            <div className="space-y-5">
              
              {/* Firebase Live Status Ribbon */}
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">Firebase Firestore</span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {firebaseConnected ? 'কানেক্টেড ও লাইভ সিঙ্ক সক্রিয়' : 'ক্লাউড কানেকশন সক্রিয়'}
                </span>
              </div>

              {/* Designated Admin One-Click Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#C6A15B]/10 via-[#C6A15B]/5 to-transparent border border-[#C6A15B]/30 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-[#0B1F33] dark:text-white">
                      নির্ধারিত প্রধান অ্যাডমিন অ্যাকাউন্ট
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/20 px-2 py-0.5 rounded-full">
                    Primary Admin
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-white/70 dark:bg-[#0B1F33]/60 border border-[#C6A15B]/20">
                  <div className="w-9 h-9 rounded-lg bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#0B1F33] dark:text-white truncate">
                      ihsanul1334@gmail.com
                    </div>
                    <div className="text-[11px] text-gray-500">
                      এহসানুল হক খান নাফিস (সকল নিয়ন্ত্রণ ও এডিট অ্যাক্সেস)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ihsanul1334@gmail.com')}
                    disabled={isSubmitting}
                    className="py-2.5 px-3 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A15B] dark:text-[#0B1F33]" />
                    <span>১-ক্লিকে লগইন</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#142B3D] border border-gray-300 dark:border-gray-700 text-[#0B1F33] dark:text-white text-xs font-bold shadow-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google দিয়ে সাইন-ইন</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 dark:border-gray-800 w-full"></div>
                <span className="bg-white dark:bg-[#0E2536] px-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                  অথবা ম্যানুয়ালি তথ্য দিন
                </span>
              </div>

              {/* Manual Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F33] dark:text-[#F8F6F0] mb-1.5">
                    অ্যাডমিন ইমেইল (Admin Email)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setAuthError(null);
                      }}
                      placeholder="ihsanul1334@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#0B1F33] dark:text-[#F8F6F0]">
                      সিকিউরিটি পাসকোড (Security Passcode)
                    </label>
                    <span className="text-[10px] text-gray-400 font-mono">ডিফল্ট: ihsan2026</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setAuthError(null);
                      }}
                      placeholder="Enter passcode (e.g. ihsan2026)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-800 text-xs sm:text-sm text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-sm font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন ও এডিট শুরু করুন'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
