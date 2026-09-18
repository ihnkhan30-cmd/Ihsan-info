import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { SupportedLanguage } from '../types';
import { NafisLogo } from './NafisLogo';
import { 
  Globe, 
  Sun, 
  Moon, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  BookOpen, 
  Award, 
  User, 
  Briefcase, 
  Mail, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    direction, 
    theme, 
    toggleTheme, 
    strings, 
    setCurrentView, 
    currentView, 
    setIsSearchOpen,
    isAdmin,
    adminUser,
    setIsAuthModalOpen,
    data 
  } = usePortfolio();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages: { code: SupportedLanguage; label: string; sub: string }[] = [
    { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
    { code: 'en', label: 'English', sub: 'English' },
    { code: 'ar', label: 'العربية', sub: 'Arabic (RTL)' },
  ];

  const navLinks = [
    { id: 'about', label: strings.about },
    { id: 'education', label: strings.education },
    { id: 'experience', label: strings.experience },
    { id: 'awards', label: strings.awards },
    { id: 'articles', label: strings.articles },
    { id: 'media', label: strings.mediaGallery },
    { id: 'contact', label: strings.contact },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (currentView === 'admin') {
      setCurrentView('site');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F8F6F0]/90 dark:bg-[#0B1F33]/90 border-b border-[#E9E2D2] dark:border-[#142B3D] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Identity / Logo */}
        <div className="flex items-center gap-3 text-start">
          {/* Round Logo Button - Triggers Admin Auth Modal */}
          <button
            id="navbar-brand-logo-btn"
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="relative group cursor-pointer focus:outline-none rounded-full"
            title={isAdmin ? `অ্যাডমিন পোর্টাল সক্রিয় (${adminUser || 'ihsanul1334@gmail.com'}) - ক্লিক করে কন্ট্রোল সেন্টার খুলুন` : "অ্যাডমিন লগইন (ihsanul1334@gmail.com) - ক্লিক করুন"}
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#0B1F33] via-[#102a3d] to-[#142B3D] dark:from-[#142B3D] dark:via-[#0E2536] dark:to-[#0B1F33] border border-[#C6A15B]/50 flex items-center justify-center p-1.5 shadow-md group-hover:border-[#C6A15B] group-hover:shadow-[0_0_20px_rgba(198,161,91,0.5)] group-hover:scale-105 transition-all shrink-0">
              <NafisLogo size={32} animated={true} />

              {/* Status Indicator */}
              {isAdmin ? (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B1F33] flex items-center justify-center text-white shadow-xs" title="অ্যাডমিন সক্রিয়">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </span>
              ) : (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#C6A15B] border-2 border-white dark:border-[#0B1F33] shadow-xs group-hover:scale-110 transition-transform" title="ক্লিক করে অ্যাডমিন লগইন করুন"></span>
              )}
            </div>
          </button>

          {/* Name & Title Button - Navigates Site Home */}
          <button
            id="navbar-brand-name-btn"
            type="button"
            onClick={() => {
              setCurrentView('site');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col text-start group cursor-pointer focus:outline-none"
          >
            <span className={`${language === 'ar' ? 'font-arabic-heading' : language === 'bn' ? 'font-bengali font-bold' : 'font-english font-bold'} text-lg sm:text-xl tracking-wide text-[#0B1F33] dark:text-[#F8F6F0] leading-tight group-hover:text-[#C6A15B] transition-colors`}>
              {data.profile.name[language] || (language === 'bn' ? 'এহসানুল হক খান নাফিস' : language === 'ar' ? 'إحسان الحق خان نفيس' : 'Ehsanul Haque Khan Nafis')}
            </span>
            <span className="text-xs tracking-widest text-[#3E7180] dark:text-[#C6A15B] uppercase font-semibold">
              {language === 'ar' ? 'اللغة العربية وآدابها' : language === 'bn' ? 'আরবি ভাষা ও সাহিত্য' : 'Arabic Language & Literature'}
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`nav-link-${link.id}`}
              onClick={() => handleNavClick(link.id)}
              className="px-3 py-2 text-sm font-medium text-[#0B1F33]/80 dark:text-[#F8F6F0]/80 hover:text-[#C6A15B] dark:hover:text-[#C6A15B] rounded-lg transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Controls (Search, Language, Theme, Admin) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Button */}
          <button
            id="nav-search-button"
            onClick={() => setIsSearchOpen(true)}
            aria-label={strings.search}
            className="p-2.5 rounded-lg text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:bg-[#E9E2D2]/50 dark:hover:bg-[#142B3D] hover:text-[#0B1F33] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title={strings.search}
          >
            <Search className="w-4 h-4 text-[#C6A15B]" />
            <span className="hidden md:inline text-xs opacity-60 font-mono">⌘K</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="language-switcher-button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="px-3 py-2 rounded-lg border border-[#C6A15B]/30 hover:border-[#C6A15B] bg-white/50 dark:bg-[#142B3D]/60 flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0B1F33] dark:text-[#F8F6F0] transition-all cursor-pointer shadow-xs"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4 text-[#C6A15B]" />
              <span className="font-semibold">
                {language === 'bn' ? 'বাংলা' : language === 'ar' ? 'العربية' : 'English'}
              </span>
            </button>

            {isLangOpen && (
              <div 
                className={`absolute top-full mt-2 w-44 rounded-xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 ${direction === 'rtl' ? 'left-0' : 'right-0'}`}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    id={`lang-select-${lang.code}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-start flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer ${
                      language === lang.code
                        ? 'bg-[#C6A15B]/15 text-[#C6A15B] font-bold'
                        : 'text-[#0B1F33] dark:text-[#F8F6F0] hover:bg-[#F8F6F0] dark:hover:bg-[#0B1F33]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-mono">{lang.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            id="theme-toggle-button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-lg text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:bg-[#E9E2D2]/50 dark:hover:bg-[#142B3D] hover:text-[#C6A15B] transition-colors cursor-pointer"
            title={theme === 'dark' ? strings.lightTheme : strings.darkTheme}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#C6A15B]" />
            ) : (
              <Moon className="w-4 h-4 text-[#0B1F33]" />
            )}
          </button>

          {/* Admin CMS Access Button */}
          <button
            id="admin-portal-button"
            onClick={() => setCurrentView(currentView === 'admin' ? 'site' : 'admin')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-[#C6A15B] text-[#0B1F33] shadow-md'
                : 'bg-[#0B1F33] text-[#F8F6F0] dark:bg-[#C6A15B]/20 dark:text-[#C6A15B] dark:border dark:border-[#C6A15B]/30 hover:bg-[#142B3D]'
            }`}
            title={strings.adminPortal}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {currentView === 'admin' ? strings.backToSite : 'CMS'}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#0B1F33] dark:text-[#F8F6F0] hover:bg-[#E9E2D2]/50 dark:hover:bg-[#142B3D] cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E9E2D2] dark:border-[#142B3D] bg-[#F8F6F0] dark:bg-[#0B1F33] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-3">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className="px-4 py-3 rounded-lg bg-white/70 dark:bg-[#142B3D]/70 text-start text-sm font-medium text-[#0B1F33] dark:text-[#F8F6F0] hover:border-[#C6A15B] border border-transparent transition-all cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E9E2D2] dark:border-[#142B3D] flex items-center justify-between">
            <span className="text-xs text-gray-500">{strings.languages}:</span>
            <div className="flex gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  id={`mobile-lang-${l.code}`}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-md font-semibold cursor-pointer ${
                    language === l.code
                      ? 'bg-[#C6A15B] text-[#0B1F33]'
                      : 'bg-white dark:bg-[#142B3D] text-[#0B1F33] dark:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
