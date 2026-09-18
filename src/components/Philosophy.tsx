import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  BookOpen, 
  Languages, 
  Mic2, 
  Award, 
  HeartHandshake, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TypewriterBioProps {
  text: string;
}

const TypewriterBio: React.FC<TypewriterBioProps> = ({ text }) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLParagraphElement>(null);

  // Trigger typing once when scrolled into view
  useEffect(() => {
    if (hasCompleted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasCompleted && !isTyping) {
          setIsTyping(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasCompleted, isTyping]);

  // ChatGPT-style streaming character progression
  useEffect(() => {
    if (!isTyping || hasCompleted) return;

    let currentLength = 0;
    setDisplayedLength(0);

    const interval = setInterval(() => {
      if (currentLength < text.length) {
        // Natural ChatGPT-like cadence: 1 to 2 characters per burst
        const nextChar = text[currentLength];
        const step = nextChar === ' ' ? 2 : 1;
        currentLength = Math.min(currentLength + step, text.length);
        setDisplayedLength(currentLength);
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setHasCompleted(true);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isTyping, text, hasCompleted]);

  return (
    <p 
      ref={containerRef}
      className="mt-2.5 text-sm sm:text-base text-[#0B1F33]/85 dark:text-[#F8F6F0]/85 leading-relaxed font-normal relative select-text"
    >
      {hasCompleted ? (
        <span>{text}</span>
      ) : isTyping ? (
        <>
          <span>{text.slice(0, displayedLength)}</span>
          <span 
            aria-hidden="true" 
            className="inline-block w-2 h-4 sm:h-5 ml-1 rtl:ml-0 rtl:mr-1 bg-[#C6A15B] animate-pulse align-middle rounded-xs" 
          />
        </>
      ) : (
        <span className="opacity-0">{text}</span>
      )}
    </p>
  );
};

export const Philosophy: React.FC = () => {
  const { data, language, t } = usePortfolio();
  const rawPhilosophies = data.profile.philosophies || [];

  // Keep 4 cards: 1, 2, 4, 6 from the original framework
  let targetPhilosophies = rawPhilosophies;
  if (rawPhilosophies.length >= 6) {
    targetPhilosophies = [
      rawPhilosophies[0], // ১: জ্ঞান (Knowledge)
      rawPhilosophies[1], // ২: ভাষা (Language)
      rawPhilosophies[3], // ৪: অর্জন (Achievement)
      rawPhilosophies[5], // ৬: প্রভাব (Impact)
    ];
  }

  // 4 pillars with their respective icons and numbers (01, 02, 04, 06)
  const pillarConfigs = [
    { icon: BookOpen, badge: '01' },
    { icon: Languages, badge: '02' },
    { icon: Award, badge: '04' },
    { icon: Sparkles, badge: '06' },
  ];

  return (
    <section 
      id="about" 
      className="py-10 md:py-14 bg-[#F8F6F0] dark:bg-[#0B1F33] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-6 sm:mb-8 text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'ar' ? 'الرؤية والمنهج' : language === 'bn' ? 'ব্যক্তিগত দর্শন ও মূল্যবোধ' : 'Core Vision & Journey'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8F6F0] tracking-tight">
            {language === 'ar' 
              ? 'رحلة التكامل المعرفي والتأثير الإنساني' 
              : language === 'bn' 
              ? 'জ্ঞান থেকে সামাজিক প্রভাবের রূপরেখা' 
              : 'From Scholarly Pursuit to Human Impact'}
          </h2>
          <TypewriterBio text={t(data.profile.longBio)} />
        </div>

        {/* 4-Pillar Core Framework (1. জ্ঞান, 2. ভাষা, 4. অর্জন, 6. প্রভাব) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {targetPhilosophies.slice(0, 4).map((item, index) => {
            const config = pillarConfigs[index] || { icon: Sparkles, badge: `0${index + 1}` };
            const IconComponent = config.icon;
            return (
              <div
                key={index}
                id={`philosophy-card-${index}`}
                className="group relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-white via-white to-[#FDFCF8] dark:from-[#142B3D] dark:via-[#142B3D] dark:to-[#0F2231] border border-[#E9E2D2] dark:border-[#1E3A52] hover:border-[#C6A15B]/70 shadow-xs hover:shadow-md active:scale-[0.99] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex items-center justify-between"
              >
                {/* Sleek top gold highlight bar */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent group-hover:via-[#C6A15B] transition-all duration-500 opacity-70 group-hover:opacity-100" />

                {/* Left: Icon, Step & Title */}
                <div className="flex items-center gap-2.5 min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#C6A15B]/20 to-[#C6A15B]/5 dark:from-[#C6A15B]/25 dark:to-[#C6A15B]/10 border border-[#C6A15B]/30 text-[#C6A15B] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[10.5px] font-bold text-[#3E7180] dark:text-[#C6A15B] uppercase tracking-wider block leading-tight">
                      {t(item.stage)}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#0B1F33] dark:text-[#FFFFFF] group-hover:text-[#C6A15B] transition-colors leading-snug">
                      {t(item.title)}
                    </h3>
                  </div>
                </div>

                {/* Right: Badge (01, 02, 04, 06) */}
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#C6A15B] tracking-wider px-2 py-0.5 rounded-md bg-[#C6A15B]/10 border border-[#C6A15B]/20 shrink-0">
                  {config.badge}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
