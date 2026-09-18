import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArticleItem } from '../types';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Tag, 
  ArrowRight, 
  Share2, 
  Facebook, 
  MessageCircle, 
  Copy, 
  Check, 
  X,
  ExternalLink
} from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const { data, language, direction, strings, t, selectedArticle, setSelectedArticle } = usePortfolio();
  const articles = (data.articles || []).filter((a) => a.status === 'published');

  const [copied, setCopied] = useState(false);

  if (articles.length === 0) return null;

  const handleShare = async (article: ArticleItem, channel: 'copy' | 'facebook' | 'whatsapp' | 'native') => {
    const slug = article.slug ? article.slug[language] || article.id : article.id;
    const url = `${window.location.origin}/${language}/articles/${encodeURIComponent(slug)}`;
    const title = t(article.title);

    if (channel === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        console.error('Copy failed:', e);
      }
    } else if (channel === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (channel === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    } else if (channel === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch (err) {
          // user cancelled
        }
      } else {
        handleShare(article, 'copy');
      }
    }
  };

  return (
    <section 
      id="articles" 
      className="py-10 md:py-14 bg-[#F8F6F0]/40 dark:bg-[#142B3D]/20 border-y border-[#E9E2D2] dark:border-[#142B3D] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-6 sm:mb-8 text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E7180]/15 text-[#3E7180] dark:text-[#C6A15B] text-xs font-bold uppercase tracking-wider mb-2.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{strings.articles}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8F6F0] tracking-tight">
            {language === 'ar' 
              ? 'المقالات والبحوث والخواطر اللغوية' 
              : language === 'bn' 
              ? 'গবেষণা নিবন্ধ ও জ্ঞানচর্চা' 
              : 'Scholarly Articles & Insights'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#0B1F33]/70 dark:text-[#F8F6F0]/75">
            {language === 'ar'
              ? 'كتابات متخصصة في فلسفة اللغة العربية، ومهارات الخطابة، وآفاق البحث الأكاديمي.'
              : language === 'bn'
              ? 'আরবি ভাষা বিজ্ঞানের প্রাসঙ্গিকতা, ধ্রুপদী সাহিত্য এবং পাবলিক স্পিকিং কলাকৌশল নিয়ে বিশ্লেষণাত্মক রচনা।'
              : 'Analytical explorations in Arabic linguistics, rhetorical eloquence, and contemporary language pedagogy.'}
          </p>
        </div>

        {/* Articles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {articles.map((art) => (
            <article
              key={art.id}
              id={`article-card-${art.id}`}
              className="group rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Featured Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={art.featuredImage}
                    alt={t(art.title)}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0B1F33]/85 backdrop-blur-xs text-[#C6A15B] border border-[#C6A15B]/30">
                      {t(art.category)}
                    </span>
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" />
                      {art.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#3E7180] dark:text-[#C6A15B]" />
                      {art.readingTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#0B1F33] dark:text-white group-hover:text-[#C6A15B] transition-colors mb-2 leading-snug">
                    {t(art.title)}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#0B1F33]/75 dark:text-[#F8F6F0]/75 leading-relaxed line-clamp-3 mb-3">
                    {t(art.excerpt)}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 sm:px-5 pb-4 pt-2 flex items-center justify-between border-t border-[#E9E2D2]/60 dark:border-[#0B1F33]">
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B1F33] dark:text-[#C6A15B] hover:text-[#C6A15B] cursor-pointer"
                >
                  <span>{strings.readMore}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${direction === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleShare(art, 'native')}
                    aria-label={strings.shareArticle}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#C6A15B] hover:bg-[#F8F6F0] dark:hover:bg-[#0B1F33] cursor-pointer"
                    title={strings.shareArticle}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white dark:bg-[#142B3D] rounded-3xl border border-[#C6A15B]/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative">
            
            {/* Modal Header Bar */}
            <div className="p-5 border-b border-[#E9E2D2] dark:border-[#0B1F33] flex items-center justify-between bg-[#F8F6F0] dark:bg-[#0B1F33]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3E7180] dark:text-[#C6A15B]">
                <BookOpen className="w-4 h-4" />
                <span>{t(selectedArticle.category)}</span>
                <span>•</span>
                <span>{selectedArticle.publishedAt}</span>
              </div>
              <button
                id="close-article-reader"
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-white leading-tight">
                {t(selectedArticle.title)}
              </h2>

              <div className="p-4 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C6A15B] text-sm text-[#0B1F33]/85 dark:text-[#F8F6F0]/85 italic leading-relaxed">
                {t(selectedArticle.excerpt)}
              </div>

              {selectedArticle.featuredImage && (
                <div className="rounded-2xl overflow-hidden aspect-[16/9]">
                  <img
                    src={selectedArticle.featuredImage}
                    alt={t(selectedArticle.title)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="text-base sm:text-lg text-[#0B1F33]/90 dark:text-[#F8F6F0]/90 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {t(selectedArticle.content)}
              </div>

              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {selectedArticle.tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md bg-[#0B1F33]/5 dark:bg-[#0B1F33] text-xs font-mono text-[#3E7180] dark:text-[#C6A15B]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Ribbon */}
              <div className="mt-8 pt-6 border-t border-[#E9E2D2] dark:border-[#0B1F33] flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E7180] dark:text-[#C6A15B]">
                  {strings.shareArticle}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(selectedArticle, 'facebook')}
                    className="p-2.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="hidden sm:inline">Facebook</span>
                  </button>

                  <button
                    onClick={() => handleShare(selectedArticle, 'whatsapp')}
                    className="p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleShare(selectedArticle, 'copy')}
                    className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#0B1F33] text-[#0B1F33] dark:text-white hover:bg-gray-300 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? strings.copied : strings.copyLink}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
