import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Facebook, 
  Linkedin,
  Twitter,
  MapPin, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data, language, direction, strings, t, sendContactMessage } = usePortfolio();
  const profile = data.profile;

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name: formName.trim(),
        email: formEmail.trim(),
        message: formMessage.trim(),
      });
    } catch (err) {
      console.warn('Message send notice:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setFormName('');
    setFormEmail('');
    setFormMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const cleanPhone = (profile.whatsapp || '+8801856741334').replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    language === 'ar'
      ? 'السلام عليكم ورحمة الله وبركاته، أستاذ إحسان الحق خان نفيس، أود التواصل معك لموضوع أكاديمي/مهني.'
      : language === 'bn'
      ? 'আসসালামু আলাইকুম, মুহতারাম এহসানুল হক খান নাফিস, আপনার সাথে প্রফেশনাল/একাডেমিক বিষয়ে যোগাযোগ করতে আগ্রহী।'
      : 'Assalamu Alaikum / Greetings Ehsanul Haque Khan Nafis, I would like to connect with you regarding academic/professional collaboration.'
  );

  const channels = [
    {
      id: 'linkedin',
      icon: Linkedin,
      label: strings.linkedinLabel,
      value: 'linkedin.com/in/ihsan1334',
      href: profile.linkedin || 'https://www.linkedin.com/in/ihsan1334',
      badge: language === 'ar' ? 'شبكة مهنية وأكاديمية' : language === 'bn' ? 'প্রফেশনাল নেটওয়ার্ক' : 'Professional Network',
      actionText: language === 'ar' ? 'تواصل مهني' : language === 'bn' ? 'কানেক্ট করুন' : 'Connect',
      iconColor: 'text-[#0A66C2] bg-[#0A66C2]/10 group-hover:bg-[#0A66C2] group-hover:text-white dark:bg-[#0A66C2]/20',
      borderHover: 'hover:border-[#0A66C2]/60 hover:shadow-[#0A66C2]/10',
      brandColor: '#0A66C2',
      isExternal: true,
    },
    {
      id: 'twitter',
      icon: Twitter,
      label: strings.twitterLabel,
      value: '@ihsan1334',
      href: profile.twitter || 'https://twitter.com/ihsan1334',
      badge: language === 'ar' ? 'آراء ومقالات موجزة' : language === 'bn' ? 'একাডেমিক ভাবনা ও ডিসকোর্স' : 'Discourse & Updates',
      actionText: language === 'ar' ? 'متابعة' : language === 'bn' ? 'ফলো করুন' : 'Follow',
      iconColor: 'text-[#1DA1F2] bg-[#1DA1F2]/10 group-hover:bg-[#1DA1F2] group-hover:text-white dark:bg-[#1DA1F2]/20',
      borderHover: 'hover:border-[#1DA1F2]/60 hover:shadow-[#1DA1F2]/10',
      brandColor: '#1DA1F2',
      isExternal: true,
    },
    {
      id: 'whatsapp',
      icon: MessageCircle,
      label: language === 'ar' ? 'واتساب المهني الرسمي' : language === 'bn' ? 'প্রফেশনাল হোয়াটসঅ্যাপ' : 'Professional WhatsApp',
      value: profile.whatsapp || '+880 1856-741334',
      href: `https://wa.me/${cleanPhone}?text=${whatsappMessage}`,
      badge: language === 'ar' ? 'رد مباشر وسريع' : language === 'bn' ? 'সরাসরি দ্রুত রেসপন্স' : 'Direct & Fast',
      actionText: language === 'ar' ? 'محادثة مباشرة' : language === 'bn' ? 'সরাসরি চ্যাট' : 'Chat Direct',
      iconColor: 'text-[#25D366] bg-[#25D366]/10 group-hover:bg-[#25D366] group-hover:text-white dark:bg-[#25D366]/20',
      borderHover: 'hover:border-[#25D366]/60 hover:shadow-[#25D366]/10',
      brandColor: '#25D366',
      isExternal: true,
    },
    {
      id: 'email',
      icon: Mail,
      label: strings.emailLabel,
      value: profile.email,
      href: `mailto:${profile.email}`,
      badge: language === 'ar' ? 'المراسلات الرسمية' : language === 'bn' ? 'অফিসিয়াল পত্রালাপ' : 'Official Inquiry',
      actionText: language === 'ar' ? 'إرسال بريد' : language === 'bn' ? 'ইমেইল পাঠান' : 'Send Email',
      iconColor: 'text-[#C6A15B] bg-[#C6A15B]/10 group-hover:bg-[#C6A15B] group-hover:text-[#0B1F33] dark:bg-[#C6A15B]/20',
      borderHover: 'hover:border-[#C6A15B]/60 hover:shadow-[#C6A15B]/10',
      brandColor: '#C6A15B',
      isExternal: false,
    },
    {
      id: 'facebook',
      icon: Facebook,
      label: strings.facebookLabel,
      value: 'facebook.com/ihsan1334',
      href: profile.facebook || 'https://www.facebook.com/ihsan1334',
      badge: language === 'ar' ? 'المجتمع والأنشطة' : language === 'bn' ? 'কমিউনিটি ও সমাজসেবা' : 'Community & Outreach',
      actionText: language === 'ar' ? 'الملف الشخصي' : language === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile',
      iconColor: 'text-[#1877F2] bg-[#1877F2]/10 group-hover:bg-[#1877F2] group-hover:text-white dark:bg-[#1877F2]/20',
      borderHover: 'hover:border-[#1877F2]/60 hover:shadow-[#1877F2]/10',
      brandColor: '#1877F2',
      isExternal: true,
    },
    {
      id: 'phone',
      icon: Phone,
      label: strings.phoneLabel,
      value: profile.phone,
      href: `tel:${profile.phone}`,
      badge: language === 'ar' ? 'اتصال هاتفي مباشر' : language === 'bn' ? 'জরুরি প্রয়োজনে কল' : 'Direct Telephone',
      actionText: language === 'ar' ? 'اتصال مباشر' : language === 'bn' ? 'কল করুন' : 'Call Directly',
      iconColor: 'text-[#3E7180] bg-[#3E7180]/10 group-hover:bg-[#3E7180] group-hover:text-white dark:bg-[#3E7180]/20',
      borderHover: 'hover:border-[#3E7180]/60 hover:shadow-[#3E7180]/10',
      brandColor: '#3E7180',
      isExternal: false,
    },
  ];

  // Quick-access social handles bar
  const quickSocials = [
    {
      name: 'LinkedIn',
      handle: 'in/ihsan1334',
      href: profile.linkedin || 'https://www.linkedin.com/in/ihsan1334',
      icon: Linkedin,
      color: 'hover:bg-[#0A66C2] hover:text-white text-[#0A66C2] border-[#0A66C2]/30',
      bgColor: 'bg-[#0A66C2]/10',
      tooltip: language === 'ar' ? 'لينكد إن الأكاديمي' : language === 'bn' ? 'অ্যাকাডেমিক লিঙ্কডইন' : 'Academic LinkedIn',
    },
    {
      name: 'Twitter (X)',
      handle: '@ihsan1334',
      href: profile.twitter || 'https://twitter.com/ihsan1334',
      icon: Twitter,
      color: 'hover:bg-[#1DA1F2] hover:text-white text-[#1DA1F2] border-[#1DA1F2]/30',
      bgColor: 'bg-[#1DA1F2]/10',
      tooltip: language === 'ar' ? 'تويتر للتدوينات' : language === 'bn' ? 'টুইটার / এক্স হ্যান্ডেল' : 'Twitter / X Handle',
    },
    {
      name: 'WhatsApp',
      handle: '+880 1856-741334',
      href: `https://wa.me/${cleanPhone}?text=${whatsappMessage}`,
      icon: MessageCircle,
      color: 'hover:bg-[#25D366] hover:text-white text-[#25D366] border-[#25D366]/30',
      bgColor: 'bg-[#25D366]/10',
      tooltip: language === 'ar' ? 'واتساب للمراسلة الفورية' : language === 'bn' ? 'প্রফেশনাল হোয়াটসঅ্যাপ' : 'Professional WhatsApp',
    },
    {
      name: 'Facebook',
      handle: 'ihsan1334',
      href: profile.facebook || 'https://www.facebook.com/ihsan1334',
      icon: Facebook,
      color: 'hover:bg-[#1877F2] hover:text-white text-[#1877F2] border-[#1877F2]/30',
      bgColor: 'bg-[#1877F2]/10',
      tooltip: language === 'ar' ? 'فيسبوك الرسمي' : language === 'bn' ? 'ফেসবুক প্রোফাইল' : 'Facebook Profile',
    },
  ];

  return (
    <section 
      id="contact" 
      className="py-10 md:py-14 bg-[#F8F6F0] dark:bg-[#0B1F33] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-6 sm:mb-8 text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A15B]/15 text-[#C6A15B] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{strings.contact}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] dark:text-[#F8F6F0] tracking-tight">
            {language === 'ar' 
              ? 'تواصل معرفي وأكاديمي مباشر' 
              : language === 'bn' 
              ? 'সরাসরি যোগাযোগ ও বার্তা প্রেরণ' 
              : 'Scholarly Dialogue & Direct Inquiries'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#0B1F33]/70 dark:text-[#F8F6F0]/75">
            {language === 'ar'
              ? 'مرحباً بالتواصل للتعاون الأكاديمي، والمناظرات اللغوية، والمبادرات التطوعية المجتمعية.'
              : language === 'bn'
              ? 'আরবি ভাষা বিষয়ক একাডেমি বা সম্মেলন, বিতর্ক সেশন কিংবা সমাজসেবামূলক যেকোনো উদ্যোগে যোগাযোগের সাদর আমন্ত্রণ।'
              : 'Open to academic collaborations, linguistic lecture invitations, debate forums, and humanitarian drives.'}
          </p>

          {/* Quick-Access Distinct Social Media Handles Ribbon */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 pt-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'الحسابات المهنية:' : language === 'bn' ? 'প্রফেশনাল হ্যান্ডেল:' : 'Social Handles:'}
            </span>
            {quickSocials.map((soc) => {
              const SocIcon = soc.icon;
              return (
                <a
                  key={soc.name}
                  id={`quick-social-${soc.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  title={soc.tooltip}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold bg-white dark:bg-[#142B3D] ${soc.color} shadow-2xs hover:shadow-sm transition-all duration-200 group cursor-pointer`}
                >
                  <div className={`w-5 h-5 rounded-full ${soc.bgColor} flex items-center justify-center`}>
                    <SocIcon className="w-3 h-3" />
                  </div>
                  <span>{soc.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Left Column: Verified Channels & Distinct Social Links (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Location Pill Card */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] mb-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {strings.locationLabel}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-[#0B1F33] dark:text-white">
                    {t(profile.location)}
                  </div>
                </div>
              </div>
            </div>

            {/* List of Direct Channels with Distinct Icon Styles */}
            {channels.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.id}
                  id={`contact-channel-${ch.id}`}
                  href={ch.href}
                  target={ch.isExternal ? '_blank' : undefined}
                  rel="noreferrer"
                  className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] ${ch.borderHover} shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer block`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Distinct Icon Container with brand accent transition */}
                    <div className={`w-10 h-10 rounded-xl ${ch.iconColor} flex items-center justify-center transition-colors shrink-0 shadow-2xs`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {ch.label}
                        </span>
                        {ch.badge && (
                          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-sm text-[10px] font-medium bg-gray-100 dark:bg-[#0B1F33] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            {ch.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#0B1F33] dark:text-white tracking-tight truncate">
                        {ch.value}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#3E7180] dark:text-[#C6A15B] flex items-center gap-1 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform shrink-0 ml-2">
                    <span className="hidden xs:inline">{ch.actionText}</span>
                    {ch.isExternal ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Right Column: Direct Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-md">
              
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B1F33] dark:text-white mb-1">
                {strings.sendDirectMessage}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                {language === 'ar' 
                  ? 'يرجى ملء الاستمارة أدناه وسيصل إشعار فوري إلى البريد الرسمي.'
                  : language === 'bn' 
                  ? 'আপনার বার্তাটি নিচে লিখুন, সরাসরি আমার ব্যক্তিগত ইমেইলে বার্তাটি পৌঁছে যাবে।'
                  : 'Fill out this inquiry form and your message will be dispatched directly.'}
              </p>

              {submitted ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{strings.messageSentSuccess}</h4>
                    <p className="text-xs mt-0.5 opacity-90">{profile.email}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] dark:text-[#F8F6F0] mb-1.5">
                        {strings.yourName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Dr. / Prof. / Scholar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-sm text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] dark:text-[#F8F6F0] mb-1.5">
                        {strings.yourEmail} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="contact@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-sm text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F33] dark:text-[#F8F6F0] mb-1.5">
                      {strings.yourMessage} *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder={strings.yourMessage}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-sm text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] font-bold text-sm hover:bg-[#142B3D] dark:hover:bg-[#b38e47] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? strings.saving : strings.sendMessage}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

