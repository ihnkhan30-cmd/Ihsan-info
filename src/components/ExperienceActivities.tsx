import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Briefcase, 
  HeartHandshake, 
  MapPin, 
  Calendar, 
  Users, 
  Mic2,
  CheckCircle2
} from 'lucide-react';

export const ExperienceActivities: React.FC = () => {
  const { data, language, strings, t } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'all' | 'experience' | 'volunteer'>('all');

  const experience = data.experience || [];
  const activities = data.activities || [];

  return (
    <section 
      id="experience" 
      className="py-10 md:py-14 bg-[#F8F6F0] dark:bg-[#0B1F33] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="max-w-2xl text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E7180]/15 text-[#3E7180] dark:text-[#C6A15B] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>
                {language === 'ar' ? 'الخبرة والعمل الميداني' : language === 'bn' ? 'অভিজ্ঞতা ও সামাজিক সম্পৃক্ততা' : 'Experience & Engagement'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8F6F0] tracking-tight">
              {language === 'ar' 
                ? 'الريادة اللغوية والخدمة المجتمعية' 
                : language === 'bn' 
                ? 'ভাষাতাত্ত্বিক দিকনির্দেশনা ও সমাজকল্যাণ' 
                : 'Linguistic Mentorship & Civic Leadership'}
            </h2>
          </div>

          {/* Tab Filter */}
          <div className="flex rounded-xl bg-white dark:bg-[#142B3D] p-1 border border-[#E9E2D2] dark:border-[#0B1F33] self-start">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33]'
                  : 'text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:text-[#0B1F33]'
              }`}
            >
              {strings.allCategories}
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33]'
                  : 'text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:text-[#0B1F33]'
              }`}
            >
              {strings.experience}
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'volunteer'
                  ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33]'
                  : 'text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:text-[#0B1F33]'
              }`}
            >
              {strings.activities}
            </button>
          </div>
        </div>

        {/* Content Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          
          {/* Professional / Mentorship Stream */}
          {(activeTab === 'all' || activeTab === 'experience') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E9E2D2] dark:border-[#142B3D]">
                <Briefcase className="w-4 h-4 text-[#C6A15B]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#3E7180] dark:text-[#C6A15B]">
                  {strings.experience}
                </h3>
              </div>

              {experience.map((exp) => (
                <div
                  key={exp.id}
                  id={`exp-card-${exp.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] hover:border-[#C6A15B]/50 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#0B1F33]/5 dark:bg-[#0B1F33] text-[#3E7180] dark:text-[#C6A15B]">
                      {exp.period}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C6A15B]" />
                      {t(exp.location)}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-[#0B1F33] dark:text-white">
                    {t(exp.role)}
                  </h4>
                  <div className="text-xs sm:text-sm font-semibold text-[#3E7180] dark:text-[#C6A15B] mt-0.5 mb-2">
                    {t(exp.organization)}
                  </div>
                  <p className="text-xs sm:text-sm text-[#0B1F33]/80 dark:text-[#F8F6F0]/80 leading-relaxed">
                    {t(exp.description)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Volunteer & Outreach Stream */}
          {(activeTab === 'all' || activeTab === 'volunteer') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E9E2D2] dark:border-[#142B3D]">
                <HeartHandshake className="w-4 h-4 text-[#C6A15B]" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#3E7180] dark:text-[#C6A15B]">
                  {strings.activities}
                </h3>
              </div>

              {activities.map((act) => (
                <div
                  key={act.id}
                  id={`act-card-${act.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] hover:border-[#C6A15B]/50 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#3E7180]/10 text-[#3E7180] dark:text-[#C6A15B]">
                      {act.period}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C6A15B]/15 text-[#C6A15B]">
                      {act.category === 'volunteering' 
                        ? (language === 'ar' ? 'تطوع وإغاثة' : language === 'bn' ? 'স্বেচ্ছাসেবা' : 'Volunteer') 
                        : (language === 'ar' ? 'خطابة وتوعية' : language === 'bn' ? 'বক্তব্য' : 'Speaking')}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-[#0B1F33] dark:text-white">
                    {t(act.title)}
                  </h4>
                  <div className="text-xs sm:text-sm font-semibold text-[#3E7180] dark:text-[#C6A15B] mt-0.5 mb-2">
                    {t(act.role)} • {t(act.organization)}
                  </div>
                  <p className="text-xs sm:text-sm text-[#0B1F33]/80 dark:text-[#F8F6F0]/80 leading-relaxed">
                    {t(act.description)}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
