import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Calendar, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Star,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EducationItem } from '../types';

// Decorative 8-pointed Islamic Star (Rub el Hizb inspired) SVG Component
const IslamicEightStar: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-6 h-6 text-[#C6A15B]", 
  size = 24 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* First square */}
    <rect 
      x="9" 
      y="9" 
      width="30" 
      height="30" 
      rx="2" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinejoin="round" 
    />
    {/* Second square rotated 45 deg */}
    <rect 
      x="9" 
      y="9" 
      width="30" 
      height="30" 
      rx="2" 
      transform="rotate(45 24 24)" 
      stroke="currentColor" 
      strokeWidth="1.75" 
      strokeLinejoin="round" 
    />
    {/* Center inner circle / jewel */}
    <circle cx="24" cy="24" r="4.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="1.5" fill="currentColor" />
  </svg>
);

// Decorative Corner Ornament SVG for card corners
const CornerFlourish: React.FC<{ className?: string }> = ({ className = "text-[#C6A15B]" }) => (
  <svg 
    width="42" 
    height="42" 
    viewBox="0 0 42 42" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path 
      d="M2 40V12C2 6.47715 6.47715 2 12 2H40" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeOpacity="0.4"
    />
    <path 
      d="M8 34V14C8 10.6863 10.6863 8 14 8H34" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeDasharray="2 3"
      strokeOpacity="0.6"
    />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.6" />
    <circle cx="2" cy="40" r="1.5" fill="currentColor" fillOpacity="0.4" />
    <circle cx="40" cy="2" r="1.5" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

// Decorative Arch Silhouette Outline SVG
const MihrabArchPattern: React.FC<{ className?: string }> = ({ className = "text-[#C6A15B]" }) => (
  <svg 
    width="160" 
    height="220" 
    viewBox="0 0 160 220" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path 
      d="M10 215V90C10 51.3401 41.3401 20 80 10C118.66 20 150 51.3401 150 90V215" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeDasharray="4 4"
      strokeOpacity="0.25"
    />
    <path 
      d="M25 215V96C25 64.5 50 38 80 30C110 38 135 64.5 135 96V215" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeOpacity="0.15"
    />
    <circle cx="80" cy="20" r="4" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

export const AcademicTimeline: React.FC = () => {
  const { data, language, strings, t, direction } = usePortfolio();
  const rawEducation = data.education || [];
  const education = [...rawEducation].sort((a, b) => (a.order || 0) - (b.order || 0));
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const initialItems = education.slice(0, 2);
  const remainingItems = education.slice(2);

  // Helper to map index to localized numerals
  const getLocalizedIndex = (index: number) => {
    const num = index + 1;
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return num < 10 ? `০${bnDigits[num]}` : `${num}`.split('').map(d => bnDigits[parseInt(d)]).join('');
    }
    if (language === 'ar') {
      const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return num < 10 ? `٠${arDigits[num]}` : `${num}`.split('').map(d => arDigits[parseInt(d)]).join('');
    }
    return num < 10 ? `0${num}` : `${num}`;
  };

  // Specific thematic labels according to degree level
  const getDegreeTierBadge = (item: EducationItem) => {
    const id = item.id.toLowerCase();
    if (id.includes('masters')) {
      return {
        badge: language === 'ar' ? 'الدراسات العليا التخصصية' : language === 'bn' ? 'স্নাতকোত্তর পর্যায়' : 'Postgraduate Tier',
        color: 'from-[#C6A15B]/20 to-[#C6A15B]/5 text-[#C6A15B] border-[#C6A15B]/40',
        icon: Star
      };
    }
    if (id.includes('kamil')) {
      return {
        badge: language === 'ar' ? 'العالمية العالية (حديث)' : language === 'bn' ? 'উচ্চতর হাদিস গবেষণা' : 'Advanced Hadith Research',
        color: 'from-[#3E7180]/20 to-[#3E7180]/5 text-[#3E7180] dark:text-[#C6A15B] border-[#3E7180]/30 dark:border-[#C6A15B]/40',
        icon: BookOpen
      };
    }
    if (id.includes('1') || id.includes('honors')) {
      return {
        badge: language === 'ar' ? 'المرحلة الجامعية (شرف)' : language === 'bn' ? 'স্নাতক সম্মান' : 'Undergraduate Honors',
        color: 'from-[#C6A15B]/20 to-[#C6A15B]/5 text-[#C6A15B] border-[#C6A15B]/40',
        icon: GraduationCap
      };
    }
    if (id.includes('fazil')) {
      return {
        badge: language === 'ar' ? 'المرحلة العالية' : language === 'bn' ? 'স্নাতক সমমান' : 'Undergraduate Tier',
        color: 'from-[#3E7180]/15 to-[#3E7180]/5 text-[#3E7180] dark:text-[#C6A15B] border-[#3E7180]/30',
        icon: Award
      };
    }
    if (id.includes('2') || id.includes('alim')) {
      return {
        badge: language === 'ar' ? 'المرحلة الثانوية' : language === 'bn' ? 'উচ্চ মাধ্যমিক সমমান' : 'Higher Secondary',
        color: 'from-[#C6A15B]/15 to-transparent text-[#C6A15B] border-[#C6A15B]/30',
        icon: BookOpen
      };
    }
    return {
      badge: language === 'ar' ? 'المرحلة الإعدادية' : language === 'bn' ? 'মাধ্যমিক সমমান' : 'Secondary Education',
      color: 'from-gray-500/15 to-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
      icon: CheckCircle2
    };
  };

  const renderEducationCard = (item: EducationItem, index: number) => {
    const isTopHonors = item.isHonors || item.featured;
    const tier = getDegreeTierBadge(item);
    const TierIcon = tier.icon;
    const stepLabel = getLocalizedIndex(index);

    return (
      <div
        key={item.id}
        id={`education-card-${item.id}`}
        className="group relative flex items-start gap-4 sm:gap-6"
      >
        {/* Decorative Timeline Node Column (Spine & Floating Emblem) */}
        <div className="flex flex-col items-center shrink-0 self-stretch relative z-10 pt-1">
          {/* Ornate Jewel Diamond Node */}
          <div className="relative flex items-center justify-center">
            {/* Outer Shimmer Halo */}
            <div 
              className={`absolute -inset-1 rounded-xl rotate-45 transition-all duration-300 ${
                isTopHonors 
                  ? 'bg-gradient-to-tr from-[#C6A15B]/50 via-[#3E7180]/30 to-[#C6A15B]/50 blur-xs group-hover:scale-110' 
                  : 'bg-[#C6A15B]/20 group-hover:bg-[#C6A15B]/40 blur-xs'
              }`} 
            />
            {/* Diamond Body */}
            <div 
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl rotate-45 flex items-center justify-center transition-all duration-300 shadow-sm ${
                isTopHonors
                  ? 'bg-gradient-to-br from-[#C6A15B] via-[#b59149] to-[#0B1F33] text-white border border-[#F8F6F0]/40 dark:border-[#C6A15B]'
                  : 'bg-white dark:bg-[#142B3D] text-[#C6A15B] border border-[#C6A15B]/50 group-hover:border-[#C6A15B]'
              }`}
            >
              {/* Un-rotated icon container */}
              <div className="-rotate-45 flex items-center justify-center">
                <TierIcon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isTopHonors ? 'text-white' : 'text-[#C6A15B]'}`} />
              </div>
            </div>
          </div>

          {/* Vertical Connecting Track Guide */}
          <div className="w-[2px] flex-1 bg-gradient-to-b from-[#C6A15B]/40 via-[#C6A15B]/20 to-transparent mt-2 rounded-full" />
        </div>

        {/* The Card Container */}
        <div 
          className={`flex-1 relative rounded-2xl p-4 sm:p-5 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
            isTopHonors
              ? 'bg-gradient-to-br from-white via-white to-[#FDFCF9] dark:from-[#142B3D] dark:via-[#142B3D] dark:to-[#0C1F30] border-2 border-[#C6A15B]/90 hover:border-[#C6A15B]'
              : 'bg-white dark:bg-[#142B3D]/80 border border-[#E9E2D2] dark:border-[#1E3A52] hover:border-[#C6A15B]/60'
          }`}
        >
          {/* Subtle Top Metallic Gold Foil Accent Bar */}
          <div 
            className={`absolute top-0 inset-x-0 h-[3px] transition-all duration-300 ${
              isTopHonors 
                ? 'bg-gradient-to-r from-[#C6A15B] via-[#E9E2D2] to-[#C6A15B]' 
                : 'bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent group-hover:via-[#C6A15B]'
            }`} 
          />

          {/* Decorative Corner Flourish in the card's upper corner */}
          <div className="absolute top-1 right-1 rtl:right-auto rtl:left-1 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
            <CornerFlourish className="text-[#C6A15B] w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          {/* Watermark Eight-Pointed Star in Background of Card */}
          <div className="absolute -bottom-6 -right-6 rtl:-right-auto rtl:-left-6 pointer-events-none opacity-5 dark:opacity-10 text-[#C6A15B] group-hover:opacity-15 transition-opacity">
            <IslamicEightStar size={110} />
          </div>

          {/* Header Row: Step Number, Tier Pill, Year Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 relative z-10">
            <div className="flex items-center gap-2">
              {/* Sequential Step Pill */}
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#0B1F33]/5 dark:bg-[#0B1F33] text-[11px] font-mono font-bold text-[#3E7180] dark:text-[#C6A15B] border border-[#E9E2D2] dark:border-[#1E3A52]">
                {stepLabel}
              </span>

              {/* Tier / Category Badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r ${tier.color} border shadow-2xs`}>
                <Sparkles className="w-3 h-3 text-[#C6A15B]" />
                <span>{tier.badge}</span>
              </span>
            </div>

            {/* Academic Period / Year Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#C6A15B]/15 dark:bg-[#C6A15B]/20 text-[#0B1F33] dark:text-[#F8F6F0] border border-[#C6A15B]/30 text-xs font-mono font-bold">
              <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>{item.period}</span>
            </div>
          </div>

          {/* Degree Title with High Distinction */}
          <div className="relative z-10">
            <h3 className={`font-extrabold text-[#0B1F33] dark:text-[#FFFFFF] leading-snug tracking-tight group-hover:text-[#C6A15B] dark:group-hover:text-[#C6A15B] transition-colors ${
              isTopHonors ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg md:text-xl'
            }`}>
              {t(item.degree)}
            </h3>

            {/* Institution Line with Golden Arch Indicator */}
            <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm font-semibold text-[#3E7180] dark:text-[#C6A15B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shrink-0" />
              <span>{t(item.institution)}</span>
            </div>

            {/* Location Pill & Extra Info */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
              <div className="inline-flex items-center gap-1 bg-[#F8F6F0] dark:bg-[#0B1F33]/70 px-2 py-0.5 rounded-md border border-[#E9E2D2] dark:border-[#1E3A52]">
                <MapPin className="w-3 h-3 text-[#C6A15B]" />
                <span>{t(item.location)}</span>
              </div>

              {isTopHonors && (
                <div className="inline-flex items-center gap-1 text-[#C6A15B] font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ar' ? 'برتبة شرف أكاديمية' : language === 'bn' ? 'সম্মানজনক ফলাফল ও কৃতিত্ব' : 'Academic Distinction'}
                  </span>
                </div>
              )}
            </div>

            {/* Optional Description */}
            {t(item.description) && (
              <p className="text-xs text-[#0B1F33]/80 dark:text-[#F8F6F0]/80 leading-relaxed pt-2 border-t border-[#E9E2D2]/60 dark:border-[#1E3A52]/60 mt-2.5">
                {t(item.description)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section 
      id="education" 
      className="relative py-10 md:py-14 bg-[#F8F6F0]/60 dark:bg-[#0B1F33] border-y border-[#E9E2D2] dark:border-[#142B3D] transition-colors duration-300 overflow-hidden"
    >
      {/* Surrounding Artistic & Geometric Shapes in Background */}
      
      {/* 1. Ambient Warm Golden & Emerald Light Pools */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#C6A15B]/10 dark:bg-[#C6A15B]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-[#3E7180]/10 dark:bg-[#3E7180]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-[#C6A15B]/10 blur-3xl pointer-events-none" />

      {/* 2. Floating Ornamental Eight-Pointed Stars (Islamic Geometry) */}
      <div className="absolute top-8 right-6 lg:right-16 pointer-events-none opacity-20 dark:opacity-25 text-[#C6A15B] animate-pulse">
        <IslamicEightStar size={84} />
      </div>
      <div className="absolute bottom-12 left-4 lg:left-12 pointer-events-none opacity-15 dark:opacity-20 text-[#3E7180] dark:text-[#C6A15B]">
        <IslamicEightStar size={64} />
      </div>

      {/* 3. Subtle Arch Silhouettes on Left & Right Flanks (Desktop Only) */}
      <div className="hidden xl:block absolute top-16 left-0 pointer-events-none">
        <MihrabArchPattern className="text-[#C6A15B]/30 dark:text-[#C6A15B]/20" />
      </div>
      <div className="hidden xl:block absolute bottom-10 right-0 pointer-events-none scale-x-[-1]">
        <MihrabArchPattern className="text-[#3E7180]/30 dark:text-[#C6A15B]/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Refined Shape & Crest Accent */}
        <div className="max-w-3xl mb-6 sm:mb-8 text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#C6A15B]/20 via-[#C6A15B]/15 to-[#3E7180]/20 border border-[#C6A15B]/40 text-[#0B1F33] dark:text-[#F8F6F0] text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
            <IslamicEightStar size={14} className="text-[#C6A15B]" />
            <span className="text-[#C6A15B] font-extrabold">{strings.timeline}</span>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="text-[#0B1F33] dark:text-[#F8F6F0]">
              {language === 'ar' ? 'المسار العلمي' : language === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Academic Credentials'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8F6F0] tracking-tight">
            {strings.academicExcellence}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#0B1F33]/70 dark:text-[#F8F6F0]/75 leading-relaxed">
            {language === 'ar'
              ? 'سجل أكاديمي موثق بامتياز مستمر في علوم الشريعة واللسانيات واللغة العربية وآدابها'
              : language === 'bn'
              ? 'মাদরাসা স্তর থেকে বিশ্ববিদ্যালয় পর্যায় পর্যন্ত অবিচল মেধা ও প্রাতিষ্ঠানিক উৎকর্ষের ধারাবাহিক ধারা'
              : 'A verified academic journey with sustained honors across leading Islamic and tertiary linguistic institutions.'}
          </p>
        </div>

        {/* Timeline Stream with Spine & Nodes */}
        <div className="space-y-4 relative">
          {/* First 2 items (shown by default) */}
          {initialItems.map((item, idx) => renderEducationCard(item, idx))}

          {/* Remaining items (revealed on See More) */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="remaining-education"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="space-y-4 pt-2 overflow-hidden"
              >
                {remainingItems.map((item, idx) => renderEducationCard(item, initialItems.length + idx))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* See More / Show Less Toggle Button with Gold Crest */}
          {remainingItems.length > 0 && (
            <div className="pt-3 flex justify-center relative z-20">
              <button
                type="button"
                id="education-see-more-toggle-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#142B3D] border-2 border-[#C6A15B]/50 hover:border-[#C6A15B] text-[#0B1F33] dark:text-[#F8F6F0] hover:text-[#C6A15B] dark:hover:text-[#C6A15B] font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <IslamicEightStar size={14} className="text-[#C6A15B] group-hover:rotate-45 transition-transform duration-300" />
                <span>
                  {isExpanded
                    ? language === 'ar'
                      ? 'عرض أقل'
                      : language === 'bn'
                      ? 'সংক্ষিপ্ত করুন'
                      : 'Show Less'
                    : language === 'ar'
                      ? `عرض المزيد (${remainingItems.length}+)`
                      : language === 'bn'
                      ? `আরও দেখুন (${remainingItems.length}টি ডিগ্রি)`
                      : `See More (${remainingItems.length} more)`}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#C6A15B] transition-transform duration-300 group-hover:-translate-y-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#C6A15B] transition-transform duration-300 group-hover:translate-y-0.5" />
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

