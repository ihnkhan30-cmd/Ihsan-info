import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ShieldCheck, Heart, ArrowUp, Globe, Sparkles, Linkedin, Twitter, MessageCircle, Facebook } from 'lucide-react';
import { NafisLogo } from './NafisLogo';

export const Footer: React.FC = () => {
  const { data, language, strings, setCurrentView, t } = usePortfolio();
  const profile = data.profile;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = (profile.whatsapp || '+8801856741334').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#0B1F33] text-[#F8F6F0] border-t border-[#142B3D] pt-8 pb-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-[#142B3D]">
          
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5 space-y-2.5 text-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#142B3D] border border-[#C6A15B]/50 flex items-center justify-center p-1 shadow-md shrink-0">
                <NafisLogo size={26} animated={true} />
              </div>
              <div>
                <div className={`${language === 'ar' ? 'font-arabic-heading' : language === 'bn' ? 'font-bengali font-bold' : 'font-english font-bold'} text-lg sm:text-xl text-white`}>
                  {profile.name[language] || (language === 'bn' ? 'এহসানুল হক খান নাফিস' : language === 'ar' ? 'إحسان الحق خان نفিস' : 'Ehsanul Haque Khan Nafis')}
                </div>
                <div className="text-xs text-[#C6A15B] tracking-widest uppercase font-semibold">
                  {language === 'ar' ? 'اللغة العربية وآدابها' : language === 'bn' ? 'আরবি ভাষা ও সাহিত্য' : 'Arabic Language & Literature'}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              {t(profile.headline)}
            </p>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#142B3D] border border-[#C6A15B]/20 text-xs text-[#E9E2D2]">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>{t(profile.currentInstitution)}</span>
            </div>

            {/* Distinct Professional Social Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={profile.linkedin || 'https://www.linkedin.com/in/ihsan1334'}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                className="w-8 h-8 rounded-lg bg-[#142B3D] hover:bg-[#0A66C2] text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={profile.twitter || 'https://twitter.com/ihsan1334'}
                target="_blank"
                rel="noreferrer"
                title="Twitter (X)"
                className="w-8 h-8 rounded-lg bg-[#142B3D] hover:bg-[#1DA1F2] text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
                className="w-8 h-8 rounded-lg bg-[#142B3D] hover:bg-[#25D366] text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={profile.facebook || 'https://www.facebook.com/ihsan1334'}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="w-8 h-8 rounded-lg bg-[#142B3D] hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links (4 Cols) */}
          <div className="md:col-span-4 text-start">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A15B] mb-2.5">
              {strings.timeline} & {strings.about}
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
              <li>
                <a href="#about" className="hover:text-[#C6A15B] transition-colors">
                  {strings.about}
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-[#C6A15B] transition-colors">
                  {strings.education}
                </a>
              </li>
              <li>
                <a href="#awards" className="hover:text-[#C6A15B] transition-colors">
                  {strings.awards}
                </a>
              </li>
              <li>
                <a href="#articles" className="hover:text-[#C6A15B] transition-colors">
                  {strings.articles}
                </a>
              </li>
              <li>
                <a href="#media" className="hover:text-[#C6A15B] transition-colors">
                  {strings.mediaGallery}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Admin (3 Cols) */}
          <div className="md:col-span-3 flex flex-col justify-between text-start">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C6A15B] mb-2.5">
                {strings.contact}
              </h4>
              <p className="text-xs text-gray-400 mb-0.5">{profile.email}</p>
              <p className="text-xs text-gray-400 mb-0.5">{profile.phone}</p>
              <p className="text-xs text-gray-400">{t(profile.location)}</p>
            </div>

            <div className="pt-3">
              <button
                id="footer-admin-login-btn"
                onClick={() => {
                  setCurrentView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#142B3D] hover:bg-[#C6A15B] text-gray-300 hover:text-[#0B1F33] text-xs font-semibold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#C6A15B] group-hover:text-[#0B1F33]" />
                <span>{strings.adminPortal}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} {profile.name[language] || (language === 'bn' ? 'এহসানুল হক খান নাফিস' : language === 'ar' ? 'إحسان الحق خان نفিস' : 'Ehsanul Haque Khan Nafis')}. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span>Trilingual Knowledge Platform</span>
            </span>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="hover:text-[#C6A15B] flex items-center gap-1 cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
