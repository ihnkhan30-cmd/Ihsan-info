import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Search, 
  X, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Briefcase, 
  HeartHandshake, 
  Sparkles,
  ArrowRight,
  Video
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    data, 
    language, 
    strings, 
    t, 
    setSelectedArticle, 
    setCurrentView 
  } = usePortfolio();
  
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd/Ctrl + K and Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search results grouping
  const educationResults = q
    ? (data.education || []).filter((item) => {
        const text = (t(item.degree) + ' ' + t(item.institution) + ' ' + t(item.description)).toLowerCase();
        return text.includes(q);
      })
    : [];

  const awardResults = q
    ? (data.awards || []).filter((item) => {
        const text = (t(item.title) + ' ' + t(item.competition) + ' ' + t(item.organizer)).toLowerCase();
        return text.includes(q);
      })
    : [];

  const articleResults = q
    ? (data.articles || []).filter((item) => {
        const text = (t(item.title) + ' ' + t(item.excerpt) + ' ' + t(item.category)).toLowerCase();
        return text.includes(q);
      })
    : [];

  const activityResults = q
    ? (data.activities || []).filter((item) => {
        const text = (t(item.title) + ' ' + t(item.organization) + ' ' + t(item.description)).toLowerCase();
        return text.includes(q);
      })
    : [];

  const mediaResults = q
    ? (data.media || []).filter((item) => {
        const text = (t(item.title) + ' ' + t(item.caption) + ' ' + (item.source || '')).toLowerCase();
        return text.includes(q);
      })
    : [];

  const totalResults = educationResults.length + awardResults.length + articleResults.length + activityResults.length + mediaResults.length;

  const navigateTo = (sectionId: string, articleItem?: any) => {
    setIsSearchOpen(false);
    setCurrentView('site');
    if (articleItem) {
      setSelectedArticle(articleItem);
      return;
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#142B3D] rounded-2xl border border-[#C6A15B]/40 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E9E2D2] dark:border-[#0B1F33] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C6A15B]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={strings.searchPlaceholder}
            className="flex-1 bg-transparent text-[#0B1F33] dark:text-white placeholder-gray-400 text-base focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="py-12 text-center text-gray-400 text-sm space-y-2">
              <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
              <p>{strings.searchPlaceholder}</p>
              <p className="text-xs text-[#C6A15B]">Try: "Arabic", "Honors", "Tamirul Millat", "Debate"</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              {strings.noResults} for "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Education Matches */}
              {educationResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B] mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{strings.education}</span>
                  </div>
                  <div className="space-y-1.5">
                    {educationResults.map((edu) => (
                      <button
                        key={edu.id}
                        onClick={() => navigateTo('education')}
                        className="w-full p-3 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] hover:bg-[#E9E2D2]/50 dark:hover:bg-[#0B1F33]/80 text-start flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#0B1F33] dark:text-white">
                            {t(edu.degree)}
                          </div>
                          <div className="text-xs text-[#3E7180] dark:text-[#C6A15B]">
                            {t(edu.institution)} • {edu.period}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C6A15B] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Award Matches */}
              {awardResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B] mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>{strings.awards}</span>
                  </div>
                  <div className="space-y-1.5">
                    {awardResults.map((awd) => (
                      <button
                        key={awd.id}
                        onClick={() => navigateTo('awards')}
                        className="w-full p-3 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] hover:bg-[#E9E2D2]/50 dark:hover:bg-[#0B1F33]/80 text-start flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#0B1F33] dark:text-white">
                            {t(awd.title)}
                          </div>
                          <div className="text-xs text-[#3E7180] dark:text-[#C6A15B]">
                            {t(awd.position)} • {awd.year}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C6A15B] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Matches */}
              {articleResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B] mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{strings.articles}</span>
                  </div>
                  <div className="space-y-1.5">
                    {articleResults.map((art) => (
                      <button
                        key={art.id}
                        onClick={() => navigateTo('articles', art)}
                        className="w-full p-3 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] hover:bg-[#E9E2D2]/50 dark:hover:bg-[#0B1F33]/80 text-start flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#0B1F33] dark:text-white">
                            {t(art.title)}
                          </div>
                          <div className="text-xs text-[#3E7180] dark:text-[#C6A15B]">
                            {t(art.category)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C6A15B] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Matches */}
              {activityResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B] mb-2 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>{strings.activities}</span>
                  </div>
                  <div className="space-y-1.5">
                    {activityResults.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => navigateTo('experience')}
                        className="w-full p-3 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] hover:bg-[#E9E2D2]/50 dark:hover:bg-[#0B1F33]/80 text-start flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#0B1F33] dark:text-white">
                            {t(act.title)}
                          </div>
                          <div className="text-xs text-[#3E7180] dark:text-[#C6A15B]">
                            {t(act.organization)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C6A15B] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Matches */}
              {mediaResults.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B] mb-2 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>{strings.mediaGallery}</span>
                  </div>
                  <div className="space-y-1.5">
                    {mediaResults.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => navigateTo('media')}
                        className="w-full p-3 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] hover:bg-[#E9E2D2]/50 dark:hover:bg-[#0B1F33]/80 text-start flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#0B1F33] dark:text-white">
                            {t(med.title)}
                          </div>
                          <div className="text-xs text-[#3E7180] dark:text-[#C6A15B] flex items-center gap-2">
                            <span>{med.type === 'video' ? 'YouTube Video' : 'Photo'}</span>
                            {med.source && <span>• {med.source}</span>}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#C6A15B] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="p-3 bg-[#F8F6F0] dark:bg-[#0B1F33] border-t border-[#E9E2D2] dark:border-[#0B1F33] text-[11px] text-gray-400 flex items-center justify-between">
          <span>Search in {language === 'bn' ? 'বাংলা' : language === 'ar' ? 'العربية' : 'English'}</span>
          <span className="font-mono">ESC to exit</span>
        </div>

      </div>
    </div>
  );
};
