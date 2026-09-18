import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Trophy, 
  Medal, 
  Star, 
  Award, 
  Calendar, 
  Building2, 
  Sparkles 
} from 'lucide-react';

export const AwardsSection: React.FC = () => {
  const { data, language, strings, t } = usePortfolio();
  const awards = data.awards || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'medal':
        return Medal;
      case 'star':
        return Star;
      case 'trophy':
      default:
        return Trophy;
    }
  };

  return (
    <section 
      id="awards" 
      className="py-10 md:py-14 bg-[#F8F6F0] dark:bg-[#0B1F33] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-6 sm:mb-8 text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>{strings.awards}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8F6F0] tracking-tight">
            {language === 'ar' 
              ? 'الجوائز والتكريمات الأكاديمية' 
              : language === 'bn' 
              ? 'অর্জিত সম্মাননা ও পুরস্কার' 
              : 'Honors & Oratory Accolades'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#0B1F33]/70 dark:text-[#F8F6F0]/75">
            {language === 'ar'
              ? 'تكريمات مرموقة في الخطابة، والمناظرات الوطنية، والتفوق الدراسي، والريادة في العمل التطوعي.'
              : language === 'bn'
              ? 'জাতীয় আরবি বিতর্ক প্রতিযোগিতা, প্রাতিষ্ঠানিক মেধা মূল্যায়ন এবং সমাজসেবায় অর্জিত বিশেষ স্বীকৃতি।'
              : 'Recognized for distinguished Arabic debate championships, sustained merit honors, and leadership.'}
          </p>
        </div>

        {/* Awards Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {awards.map((award, index) => {
            const IconComponent = getIcon(award.iconType);
            const isChampion = index === 0;

            return (
              <div
                key={award.id}
                id={`award-card-${award.id}`}
                className={`relative rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ${
                  isChampion
                    ? 'bg-gradient-to-br from-white to-[#F8F6F0] dark:from-[#142B3D] dark:to-[#0B1F33] border-2 border-[#C6A15B] shadow-md'
                    : 'bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isChampion 
                        ? 'bg-[#C6A15B] text-[#0B1F33] shadow-sm' 
                        : 'bg-[#0B1F33]/5 dark:bg-[#0B1F33] text-[#C6A15B]'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#0B1F33]/5 dark:bg-[#0B1F33] text-[#3E7180] dark:text-[#C6A15B]">
                        {award.year}
                      </span>
                    </div>
                  </div>

                  {/* Position Badge */}
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#C6A15B]/15 text-[#C6A15B] mb-1.5">
                    {t(award.position)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B1F33] dark:text-white mb-1.5 leading-snug">
                    {t(award.title)}
                  </h3>

                  {/* Competition & Organizer */}
                  <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400 mb-2.5">
                    <div className="font-medium text-[#0B1F33]/90 dark:text-gray-200">
                      {t(award.competition)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#3E7180] dark:text-[#C6A15B]">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{t(award.organizer)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t(award.description)}
                  </p>
                </div>

                {/* Bottom Verified Status */}
                <div className="mt-6 pt-4 border-t border-[#E9E2D2] dark:border-[#0B1F33] flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>{strings.verifiedInfo}</span>
                  </span>
                  <span className="font-mono text-gray-400">
                    {award.year}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
