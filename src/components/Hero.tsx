import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Award, 
  ArrowRight, 
  Mail, 
  FileText, 
  Compass, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  Languages, 
  Download,
  CheckCircle2,
  X,
  Camera,
  Upload,
  UploadCloud,
  RotateCcw,
  Check,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, updateData, language, direction, strings, t, uploadFile } = usePortfolio();
  const profile = data.profile;
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active name strictly corresponding to selected language
  const activeName =
    language === 'ar'
      ? (profile.name.ar || 'إحসান الحق خان نفيس')
      : language === 'bn'
        ? (profile.name.bn || 'এহসানুল হক খান নাফিস')
        : (profile.name.en || 'Ehsanul Haque Khan Nafis');

  const nameFontClass =
    language === 'ar'
      ? 'font-arabic-heading'
      : language === 'bn'
        ? 'font-bengali'
        : 'font-english';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const processAndSaveImage = async (dataUrl: string) => {
    setIsUploading(true);
    try {
      let finalAvatarUrl = dataUrl;
      try {
        const res = await fetch('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.avatarUrl) {
            finalAvatarUrl = json.avatarUrl;
          }
        }
      } catch (e) {
        console.warn('Backend upload skipped, using direct dataUrl:', e);
      }

      await updateData({
        profile: {
          ...profile,
          avatarUrl: finalAvatarUrl,
        },
      });

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
      setIsPhotoModalOpen(false);
    } catch (err) {
      console.error('Failed to update avatar:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      // 1. Upload to Firebase Firestore
      const savedFile = await uploadFile(file, 'avatar', 'Profile Photo / প্রোফাইল ছবি');

      // 2. Update profile with persistent Firebase dataUrl
      await updateData({
        profile: {
          ...profile,
          avatarUrl: savedFile.dataUrl,
        },
      });

      // 3. Inform server API for optional local caching
      try {
        fetch('/api/upload-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: savedFile.dataUrl, fileName: file.name }),
        }).catch(() => {});
      } catch {
        // Ignored
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3500);
      setIsPhotoModalOpen(false);
    } catch (err) {
      console.error('Firebase avatar upload error, falling back to local reader:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          processAndSaveImage(result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <section 
      id="hero-section"
      className="relative overflow-hidden pt-8 pb-10 sm:pt-10 sm:pb-14 md:pt-12 md:pb-16 bg-islamic-pattern border-b border-[#E9E2D2]/60 dark:border-[#142B3D]/80"
    >
      {/* Decorative Gold & Teal Ambient Orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C6A15B]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-[#3E7180]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Main Typography Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-start space-y-4">
            
            {/* Top Badge: Always Animated Roles / Spotlight */}
            <motion.div 
              id="hero-honors-pill"
              className="relative overflow-hidden inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#C6A15B]/15 via-[#C6A15B]/25 to-[#3E7180]/15 border border-[#C6A15B]/60 text-[#0B1F33] dark:text-[#E9E2D2] text-xs sm:text-sm font-medium shadow-sm select-none backdrop-blur-xs"
              animate={{
                y: [0, -3, 0],
                scale: [1, 1.015, 1],
                borderColor: [
                  'rgba(198, 161, 91, 0.45)',
                  'rgba(198, 161, 91, 0.95)',
                  'rgba(198, 161, 91, 0.45)',
                ],
                boxShadow: [
                  '0 2px 10px rgba(198, 161, 91, 0.1)',
                  '0 4px 18px rgba(198, 161, 91, 0.3)',
                  '0 2px 10px rgba(198, 161, 91, 0.1)',
                ],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Continuous Light Shimmer / Sweep Effect */}
              <motion.div
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 dark:via-[#C6A15B]/30 to-transparent -skew-x-20 pointer-events-none"
                animate={{
                  x: ['-200%', '350%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  ease: 'easeInOut',
                  repeatDelay: 0.7,
                }}
              />

              {/* Pulsing Animated Sparkle Indicator */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  ease: 'easeInOut',
                }}
                className="flex items-center justify-center text-[#C6A15B]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              </motion.div>

              {/* Roles Content */}
              <span className="font-bold tracking-wide text-[#0B1F33] dark:text-[#F8F6F0] font-bengali text-xs sm:text-sm">
                {profile.rolesBadge ? t(profile.rolesBadge) : (
                  language === 'ar' 
                    ? 'معلم • مترجم • ناشط' 
                    : language === 'bn' 
                      ? 'শিক্ষক • অনুবাদক • অ্যাক্টিভিস্ট' 
                      : 'Educator • Translator • Activist'
                )}
              </span>

              {/* Live Glowing Dot */}
              <span className="relative flex h-2 w-2 ml-1 rtl:ml-0 rtl:mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A15B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A15B]" />
              </span>
            </motion.div>

            {/* Primary Headline: Name in Selected Language (One Single Line) */}
            <div className="space-y-1.5 w-full">
              <h1 
                id="hero-headline-name"
                className={`${nameFontClass} text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#0B1F33] dark:text-[#FFFFFF] leading-tight transition-all duration-200`}
              >
                {activeName}
              </h1>

              {/* Dynamic Translated Identity Subtitle */}
              <div>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-[#3E7180] dark:text-[#C6A15B] tracking-wide border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#C6A15B] pl-3 rtl:pl-0 rtl:pr-3">
                  {t(profile.headline)}
                </p>
              </div>
            </div>

            {/* Short Bio Statement */}
            <p className="text-sm sm:text-base text-[#0B1F33]/85 dark:text-[#F8F6F0]/85 leading-relaxed max-w-2xl font-normal">
              {t(profile.shortBio)}
            </p>

            {/* Quick Micro Credentials Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-xl pt-1">
              <div className="p-2.5 rounded-xl bg-white/60 dark:bg-[#142B3D]/60 border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#3E7180] dark:text-[#C6A15B]">
                  <GraduationCap className="w-3.5 h-3.5 shrink-0 text-[#C6A15B]" />
                  <span className="truncate">
                    {profile.degreeLabel ? t(profile.degreeLabel) : (
                      language === 'ar' ? 'ماجستير في اللغة العربية' : language === 'bn' ? 'মাস্টার্স ইন এরাবিক' : "Master's in Arabic"
                    )}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#0B1F33] dark:text-[#FFFFFF] mt-0.5 leading-snug line-clamp-1">
                  {t(profile.currentInstitution)}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/60 dark:bg-[#142B3D]/60 border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#3E7180] dark:text-[#C6A15B]">
                  <Languages className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'اللغات' : language === 'bn' ? 'ভাষা দক্ষতা' : 'Languages'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#0B1F33] dark:text-[#FFFFFF] mt-0.5">
                  বাংলা • العربية • English
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/60 dark:bg-[#142B3D]/60 border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#3E7180] dark:text-[#C6A15B]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{strings.locationLabel}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#0B1F33] dark:text-[#FFFFFF] mt-0.5 truncate">
                  {t(profile.location)}
                </div>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-profile-cta"
                onClick={() => scrollTo('about')}
                className="px-5 py-2.5 rounded-xl bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] font-semibold text-xs sm:text-sm hover:bg-[#142B3D] dark:hover:bg-[#b38e47] shadow-sm transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>{strings.viewProfile}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${direction === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>

              <button
                id="hero-contact-cta"
                onClick={() => scrollTo('contact')}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#142B3D] text-[#0B1F33] dark:text-[#F8F6F0] font-semibold text-xs sm:text-sm border border-[#C6A15B]/40 hover:border-[#C6A15B] shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>{strings.contactMe}</span>
              </button>

              <button
                id="hero-cv-cta"
                onClick={() => setIsCvModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-[#0B1F33] dark:text-[#F8F6F0] font-semibold text-xs sm:text-sm hover:bg-[#E9E2D2]/50 dark:hover:bg-[#142B3D] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#3E7180] dark:text-[#C6A15B]" />
                <span>{strings.viewCv}</span>
              </button>
            </div>

          </div>

          {/* Portrait & Visual Feature Column (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Subtle Gold Geometric Accent Border */}
              <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-[#C6A15B]/40 via-[#3E7180]/20 to-[#C6A15B]/30 blur-sm -z-10" />
              
              {/* Outer Card Container */}
              <div 
                className={`relative rounded-2xl overflow-hidden bg-white dark:bg-[#142B3D] border-2 ${
                  isDragging ? 'border-dashed border-[#C6A15B] scale-[1.01]' : 'border-[#C6A15B]/40'
                } shadow-2xl p-3 transition-all duration-200`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                
                {/* Hidden File Input */}
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }} 
                />

                {/* Image Element with High-Quality Styling */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-gradient-to-b from-[#0B1F33]/20 to-[#0B1F33]/90 group">
                  <img
                    src={profile.avatarUrl}
                    alt={t(profile.name)}
                    className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33] via-transparent to-transparent opacity-80" />

                  {/* Change Photo Floating Button */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="px-3 py-1.5 rounded-full bg-[#0B1F33]/85 hover:bg-[#0B1F33] text-[#C6A15B] hover:text-white border border-[#C6A15B]/60 backdrop-blur-md text-xs font-semibold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      title={language === 'ar' ? 'تغيير الصورة' : language === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Photo'}
                    >
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C6A15B]" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {language === 'ar' ? 'تغيير الصورة' : language === 'bn' ? 'ছবি পরিবর্তন' : 'Change Photo'}
                      </span>
                    </button>
                  </div>

                  {/* Drag Over Overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 z-30 bg-[#0B1F33]/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-[#C6A15B]">
                      <Upload className="w-10 h-10 text-[#C6A15B] animate-bounce mb-2" />
                      <p className="text-white font-bold text-sm font-bengali">
                        {language === 'ar' ? 'أفلت الصورة هنا' : language === 'bn' ? 'ছবিটি এখানে ড্রপ করুন' : 'Drop Image Here'}
                      </p>
                    </div>
                  )}

                  {/* Uploading Status Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 z-30 bg-[#0B1F33]/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                      <Loader2 className="w-8 h-8 text-[#C6A15B] animate-spin mb-2" />
                      <p className="text-white text-xs font-medium">
                        {language === 'ar' ? 'جارٍ تحديث الصورة...' : language === 'bn' ? 'ছবি আপডেট হচ্ছে...' : 'Updating photo...'}
                      </p>
                    </div>
                  )}

                  {/* Success Toast Banner */}
                  {uploadSuccess && (
                    <div className="absolute top-3 left-3 right-3 z-30 p-2 rounded-lg bg-emerald-700/90 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg animate-in fade-in">
                      <Check className="w-4 h-4 text-white" />
                      <span>
                        {language === 'ar' ? 'تم تحديث الصورة بنجاح' : language === 'bn' ? 'ছবি সফলভাবে সংরক্ষিত হয়েছে!' : 'Photo updated successfully!'}
                      </span>
                    </div>
                  )}

                  {/* Overlaid Signature Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-center p-3 rounded-xl backdrop-blur-md bg-[#0B1F33]/85 border border-[#C6A15B]/40 text-white">
                    <p className={`${nameFontClass} text-xl font-bold text-[#C6A15B]`}>
                      {activeName}
                    </p>
                    <p className="text-xs text-[#E9E2D2] tracking-wider mt-0.5">
                      {t(profile.headline)}
                    </p>
                  </div>
                </div>

                {/* Verified Identity Watermark */}
                <div className="flex items-center justify-between px-3 pt-3 text-[11px] text-[#3E7180] dark:text-[#C6A15B] font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{strings.verifiedInfo}</span>
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">
                    ID: IH-KHAN-2026
                  </span>
                </div>

              </div>

              {/* Floating Badge: Academic Credentials */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 p-3.5 rounded-xl bg-white dark:bg-[#0B1F33] border border-[#C6A15B]/50 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C6A15B]/15 flex items-center justify-center text-[#C6A15B] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B1F33] dark:text-[#FFFFFF]">
                    {language === 'ar' ? 'ماجستير (اللغة العربية وآدابها)' : language === 'bn' ? 'স্নাতকোত্তর (আরবি ভাষা ও সাহিত্য)' : "Master's (Arabic Language & Literature)"}
                  </div>
                  <div className="text-[11px] text-[#3E7180] dark:text-[#C6A15B] font-medium">
                    {language === 'ar' ? 'الجامعة الإسلامية، كوشتيا' : language === 'bn' ? 'ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া' : 'Islamic University, Kushtia'}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* CV Modal */}
      {isCvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-[#142B3D] rounded-2xl border border-[#C6A15B]/40 shadow-2xl p-6 sm:p-8 relative">
            <button
              id="close-cv-modal"
              onClick={() => setIsCvModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1F33] dark:text-white">
                  {activeName} — Curriculum Vitae
                </h3>
                <p className="text-xs text-[#3E7180] dark:text-[#C6A15B]">
                  {t(profile.headline)}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#0B1F33] dark:text-[#F8F6F0] max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-4 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33]">
                <h4 className="font-bold text-[#C6A15B] uppercase text-xs tracking-wider mb-2">
                  Academic Milestones
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>• <strong>BA & MA in Arabic Language & Literature:</strong> Islamic University, Kushtia</li>
                  <li>• <strong>Alim:</strong> Tamirul Millat Kamil Madrasa, Tongi, Gazipur (2018–2021)</li>
                  <li>• <strong>Dakhil:</strong> Mandari Islamia Alim Madrasa, Lakshmipur (2015–2018)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33]">
                <h4 className="font-bold text-[#C6A15B] uppercase text-xs tracking-wider mb-2">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>Email: <a href="mailto:ihsanul1334@gmail.com" className="text-[#3E7180] dark:text-[#C6A15B] font-semibold underline">ihsanul1334@gmail.com</a></div>
                  <div>Phone/WhatsApp: <a href="tel:+8801856741334" className="text-[#3E7180] dark:text-[#C6A15B] font-semibold">+8801856741334</a></div>
                  <div>Facebook: <a href="https://www.facebook.com/ihsan1334" target="_blank" rel="noreferrer" className="text-[#3E7180] dark:text-[#C6A15B] font-semibold underline">facebook.com/ihsan1334</a></div>
                  <div>Location: Lakshmipur, Bangladesh</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] text-sm font-semibold hover:opacity-90 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ar' ? 'طباعة وحفظ السيرة' : language === 'bn' ? 'সিভি প্রিন্ট / ডাউনলোড' : 'Print / Save CV'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Upload & Change Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#142B3D] rounded-2xl border border-[#C6A15B]/40 shadow-2xl p-6 sm:p-7 relative">
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0B1F33] dark:text-white">
                  {language === 'ar' ? 'تحديث الصورة الشخصية' : language === 'bn' ? 'প্রোফাইল ছবি পরিবর্তন ও আপলোড' : 'Update Profile Photo'}
                </h3>
                <p className="text-xs text-[#3E7180] dark:text-[#C6A15B]">
                  {language === 'ar' ? 'اختر صورة من جهازك أو اسحبها هنا' : language === 'bn' ? 'আপনার কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন বা ড্রপ করুন' : 'Choose a photo from your device or drag & drop'}
                </p>
              </div>
            </div>

            {/* Drag & Drop / Click Upload Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#C6A15B]/60 hover:border-[#C6A15B] rounded-2xl p-6 text-center cursor-pointer bg-[#F8F6F0]/60 dark:bg-[#0B1F33]/40 hover:bg-[#F8F6F0] dark:hover:bg-[#0B1F33] transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#C6A15B]/15 flex items-center justify-center text-[#C6A15B] group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#0B1F33] dark:text-white mb-1">
                {language === 'ar' ? 'انقر لاختيار الصورة أو اسحبها هنا' : language === 'bn' ? 'ছবি নির্বাচন করতে ক্লিক করুন অথবা এখানে টেনে আনুন' : 'Click to select photo or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'يدعم PNG, JPG, WEBP حتى 15 ميجابايت' : language === 'bn' ? 'PNG, JPG, WEBP ফাইল সমর্থিত (সর্বোচ্চ ১৫MB)' : 'Supports PNG, JPG, WEBP up to 15MB'}
              </p>
            </div>

            {/* Firebase Storage Indicator */}
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>
                {language === 'ar' 
                  ? 'يتم حفظ معلومات وملفات الرفع مباشرة في قاعدة بيانات Firebase Firestore' 
                  : language === 'bn' 
                    ? '✓ আপলোডকৃত ছবি ও ফাইল সরাসরি ফায়ারবেস (Firebase Firestore)-এ ক্লাউডে স্থায়ীভাবে সংরক্ষিত থাকে।' 
                    : '✓ Uploaded images and metadata are stored directly in Firebase Firestore.'}
              </span>
            </div>

            {/* Direct URL Input Alternative */}
            <div className="mt-5 space-y-2">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300">
                {language === 'ar' ? 'أو أدخل رابط الصورة المباشر:' : language === 'bn' ? 'অথবা সরাসরি ছবির লিংক দিন:' : 'Or enter direct image URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-300 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-hidden focus:border-[#C6A15B]"
                />
                <button
                  type="button"
                  disabled={!customUrlInput.trim() || isUploading}
                  onClick={async () => {
                    if (customUrlInput.trim()) {
                      await processAndSaveImage(customUrlInput.trim());
                      setCustomUrlInput('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-semibold hover:opacity-90 disabled:opacity-40 cursor-pointer"
                >
                  {language === 'ar' ? 'تطبيق' : language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Current Photo Preview */}
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatarUrl}
                  alt="Current Preview"
                  className="w-10 h-12 object-cover rounded-lg border border-[#C6A15B]/50"
                />
                <div className="text-xs">
                  <div className="font-semibold text-[#0B1F33] dark:text-white">
                    {language === 'ar' ? 'الصورة الحالية' : language === 'bn' ? 'বর্তমান ছবি' : 'Current Photo'}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {uploadSuccess ? 'আপডেট সম্পন্ন!' : 'সক্রিয়'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  processAndSaveImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop');
                }}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset to default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'ar' ? 'استعادة الافتراضية' : language === 'bn' ? 'ডিফল্ট ছবি' : 'Reset'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
