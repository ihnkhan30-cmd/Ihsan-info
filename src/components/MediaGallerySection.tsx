import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MediaItem } from '../types';
import { 
  Video, 
  Image as ImageIcon, 
  Play, 
  ExternalLink, 
  X, 
  Sparkles, 
  Calendar, 
  Layers,
  Maximize2
} from 'lucide-react';

export const MediaGallerySection: React.FC = () => {
  const { data, language, strings, t } = usePortfolio();
  const mediaList: MediaItem[] = data.media || [];

  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'photo'>('all');
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  if (mediaList.length === 0) return null;

  const filteredMedia = mediaList.filter((item) => {
    const isVideo = item.type === 'video' || item.mediaCategory === 'video' || !!item.youtubeUrl || !!item.youtubeId;
    if (activeFilter === 'video') return isVideo;
    if (activeFilter === 'photo') return !isVideo;
    return true;
  });

  const getYoutubeEmbedUrl = (item: MediaItem) => {
    let id = item.youtubeId;
    if (!id && item.youtubeUrl) {
      const match = item.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) id = match[1];
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : '';
  };

  return (
    <section 
      id="media" 
      className="py-10 md:py-14 bg-white dark:bg-[#0E2232] border-y border-[#E9E2D2] dark:border-[#1A344A] transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 text-start">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{strings.mediaGallery}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8F6F0] tracking-tight">
              {language === 'ar' 
                ? 'الوسائط والمعرض المرئي' 
                : language === 'bn' 
                ? 'মিডিয়া ও গ্যালারি' 
                : 'Media & Gallery'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#0B1F33]/75 dark:text-[#F8F6F0]/75 leading-relaxed">
              {language === 'ar'
                ? 'تسجيلات مرئية للخطب والمحاضرات الأكاديمية وصور تذكارية من المؤتمرات والفعاليات والندوات العلمية.'
                : language === 'bn'
                ? 'ইউটিউব থেকে সংযুক্ত গুরুত্বপূর্ণ ভিডিও বক্তব্য, আলোচনা এবং বিভিন্ন সাহিত্য সম্মেলন ও অ্যাকাডেমিক অনুষ্ঠানের স্থিরচিত্র সংকলন।'
                : 'Selected video lectures and speeches via YouTube alongside photographic archives of literary symposiums and academic gatherings.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F8F6F0] dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#1A344A] self-start md:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] shadow-xs'
                  : 'text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:text-[#0B1F33] dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الكل' : language === 'bn' ? 'সকল কনটেন্ট' : 'All Media'}</span>
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'video'
                  ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] shadow-xs'
                  : 'text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:text-[#0B1F33] dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'المرئيات' : language === 'bn' ? 'ভিডিও বক্তব্য' : 'Videos'}</span>
            </button>
            <button
              onClick={() => setActiveFilter('photo')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'photo'
                  ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] shadow-xs'
                  : 'text-[#0B1F33]/70 dark:text-[#F8F6F0]/70 hover:text-[#0B1F33] dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الصور' : language === 'bn' ? 'অনুষ্ঠানের ছবি' : 'Photos'}</span>
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredMedia.map((item) => {
            const isVideo = item.type === 'video' || item.mediaCategory === 'video' || !!item.youtubeUrl || !!item.youtubeId;

            return (
              <div
                key={item.id}
                id={`media-card-${item.id}`}
                className="group rounded-2xl bg-[#F8F6F0]/60 dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#1E3A52] overflow-hidden hover:border-[#C6A15B]/70 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-900">
                    <img
                      src={item.url}
                      alt={t(item.altText) || t(item.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${
                        isVideo 
                          ? 'bg-rose-600 text-white' 
                          : 'bg-[#0B1F33]/85 dark:bg-[#C6A15B] text-white dark:text-[#0B1F33]'
                      }`}>
                        {isVideo ? (
                          <>
                            <Video className="w-3 h-3" />
                            <span>YouTube Video</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3" />
                            <span>{language === 'ar' ? 'صورة' : language === 'bn' ? 'ফটোগ্রাফ' : 'Photograph'}</span>
                          </>
                        )}
                      </span>

                      {item.source && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-black/60 text-white/90 backdrop-blur-xs">
                          {item.source}
                        </span>
                      )}
                    </div>

                    {/* Center Action Overlay (Play Button or View Photo) */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      {isVideo ? (
                        <button
                          onClick={() => setSelectedVideo(item)}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-rose-600 transition-all duration-300 cursor-pointer"
                          aria-label="Play video"
                        >
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedImage(item)}
                          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                          aria-label="View large photo"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 sm:p-4 text-start">
                    <h3 className="text-sm sm:text-base font-bold text-[#0B1F33] dark:text-[#FFFFFF] group-hover:text-[#C6A15B] transition-colors leading-snug line-clamp-2">
                      {t(item.title)}
                    </h3>
                    
                    {item.caption && (
                      <p className="mt-1 text-xs text-[#0B1F33]/75 dark:text-[#F8F6F0]/75 leading-relaxed line-clamp-2">
                        {t(item.caption)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-3.5 sm:px-4 pb-3 pt-2 border-t border-[#E9E2D2]/60 dark:border-[#1E3A52]/60 flex items-center justify-between text-[11px] text-[#3E7180] dark:text-[#C6A15B]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.uploadedAt}</span>
                  </div>

                  {isVideo ? (
                    <button
                      onClick={() => setSelectedVideo(item)}
                      className="font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'ar' ? 'تشغيل الفيديو' : language === 'bn' ? 'বক্তব্য শুনুন' : 'Watch Speech'}</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'ar' ? 'عرض الصورة' : language === 'bn' ? 'ছবি দেখুন' : 'View Image'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal (Embedded YouTube Player) */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl rounded-2xl bg-[#0B1F33] border border-[#1E3A52] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#1E3A52] text-white">
              <div className="min-w-0 pr-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B] flex items-center gap-1.5 mb-0.5">
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>{selectedVideo.source || 'YouTube Archive'}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white truncate">
                  {t(selectedVideo.title)}
                </h4>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Iframe Container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={getYoutubeEmbedUrl(selectedVideo)}
                title={t(selectedVideo.title)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            {selectedVideo.caption && (
              <div className="p-4 bg-[#081827] text-xs sm:text-sm text-gray-300 text-start flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p>{t(selectedVideo.caption)}</p>
                {selectedVideo.youtubeUrl && (
                  <a
                    href={selectedVideo.youtubeUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold self-start sm:self-auto shrink-0 transition-colors"
                  >
                    <span>{language === 'ar' ? 'فتح في يوتيوب' : language === 'bn' ? 'ইউটিউবে দেখুন' : 'Open in YouTube'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal (Full Screen Photo Lightbox) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0B1F33] border border-[#1E3A52] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-[#1E3A52] text-white">
              <div className="min-w-0 pr-4 text-start">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C6A15B] mb-0.5">
                  {selectedImage.source || 'Photo Archive'}
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white truncate">
                  {t(selectedImage.title)}
                </h4>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="overflow-auto max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={selectedImage.url}
                alt={t(selectedImage.altText) || t(selectedImage.title)}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Lightbox Footer */}
            {selectedImage.caption && (
              <div className="p-3.5 bg-[#081827] text-xs sm:text-sm text-gray-300 text-start">
                <p>{t(selectedImage.caption)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
