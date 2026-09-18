import { SupportedLanguage } from '../types';

export interface UIStrings {
  siteTitle: string;
  home: string;
  about: string;
  education: string;
  experience: string;
  activities: string;
  skills: string;
  languages: string;
  awards: string;
  articles: string;
  mediaGallery: string;
  projects: string;
  contact: string;
  admin: string;
  search: string;
  searchPlaceholder: string;
  noResults: string;
  allCategories: string;
  viewProfile: string;
  contactMe: string;
  viewCv: string;
  academicExcellence: string;
  timeline: string;
  honorsBadge: string;
  readMore: string;
  shareArticle: string;
  copied: string;
  copyLink: string;
  facebookShare: string;
  whatsappShare: string;
  nativeShare: string;
  contactDirectly: string;
  sendDirectMessage: string;
  yourName: string;
  yourEmail: string;
  yourMessage: string;
  sendMessage: string;
  messageSentSuccess: string;
  verifiedInfo: string;
  locationLabel: string;
  emailLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
  facebookLabel: string;
  linkedinLabel: string;
  twitterLabel: string;
  adminPortal: string;
  passcodePrompt: string;
  unlockAdmin: string;
  logout: string;
  adminTitle: string;
  aiTranslateBtn: string;
  aiTranslating: string;
  saveChanges: string;
  saving: string;
  savedSuccessfully: string;
  draft: string;
  translated: string;
  reviewed: string;
  published: string;
  livePreview: string;
  bengaliMaster: string;
  englishTranslation: string;
  arabicTranslation: string;
  bengaliSourceWarning: string;
  darkTheme: string;
  lightTheme: string;
  close: string;
  backToSite: string;
}

export const uiStrings: Record<SupportedLanguage, UIStrings> = {
  bn: {
    siteTitle: 'এহসানুল হক খান নাফিস',
    home: 'মূলপাতা',
    about: 'পরিচিতি',
    education: 'শিক্ষা ও ডিগ্রি',
    experience: 'অভিজ্ঞতা ও যাত্রা',
    activities: 'স্বেচ্ছাসেবী কার্যক্রম',
    skills: 'দক্ষতা সূচক',
    languages: 'ভাষাগত পারদর্শিতা',
    awards: 'পুরস্কার ও সম্মাননা',
    articles: 'নিবন্ধ ও লেখালেখি',
    mediaGallery: 'মিডিয়া ও গ্যালারি',
    projects: 'উদ্যোগ ও প্রজেক্ট',
    contact: 'যোগাযোগ',
    admin: 'অ্যাডমিন প্যানেল',
    search: 'অনুসন্ধান করুন',
    searchPlaceholder: 'শিক্ষা, দক্ষতা, পুরস্কার বা নিবন্ধ খুঁজুন...',
    noResults: 'কোনো ফলাফল পাওয়া যায়নি',
    allCategories: 'সকল ক্যাটাগরি',
    viewProfile: 'আমার সম্পর্কে',
    contactMe: 'যোগাযোগ করুন',
    viewCv: 'সিভি দেখুন',
    academicExcellence: 'একাডেমিক উৎকর্ষ',
    timeline: 'শিক্ষাজীবনের সময়রেখা',
    honorsBadge: 'সম্মানসহ প্রথম শ্রেণী',
    readMore: 'সম্পূর্ণ পড়ুন',
    shareArticle: 'নিবন্ধটি শেয়ার করুন',
    copied: 'লিংক কপি হয়েছে!',
    copyLink: 'লিংক কপি করুন',
    facebookShare: 'ফেসবুকে শেয়ার',
    whatsappShare: 'হোয়াটসঅ্যাপে পাঠান',
    nativeShare: 'শেয়ার করুন',
    contactDirectly: 'সরাসরি যোগাযোগ মাধ্যম',
    sendDirectMessage: 'একটি বার্তা পাঠান',
    yourName: 'আপনার নাম',
    yourEmail: 'আপনার ইমেইল',
    yourMessage: 'আপনার বার্তা লিখুন...',
    sendMessage: 'বার্তা পাঠান',
    messageSentSuccess: 'ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে।',
    verifiedInfo: 'যাচাইকৃত তথ্য',
    locationLabel: 'অবস্থান',
    emailLabel: 'ইমেইল',
    phoneLabel: 'ফোন',
    whatsappLabel: 'হোয়াটসঅ্যাপ',
    facebookLabel: 'ফেসবুক',
    linkedinLabel: 'লিঙ্কডইন',
    twitterLabel: 'টুইটার (X)',
    adminPortal: 'কনটেন্ট ম্যানেজমেন্ট সিস্টেম',
    passcodePrompt: 'অ্যাডমিন পাসকোড লিখুন (ডিফল্ট: ihsan2026)',
    unlockAdmin: 'প্রবেশ করুন',
    logout: 'লগআউট',
    adminTitle: 'এআই কনটেন্ট কন্ট্রোল সেন্টার',
    aiTranslateBtn: '✨ AI দিয়ে ইংরেজি ও আরবি অনুবাদ করুন',
    aiTranslating: 'এআই অনুবাদ হচ্ছে...',
    saveChanges: 'সংরক্ষণ করুন',
    saving: 'সংরক্ষিত হচ্ছে...',
    savedSuccessfully: 'সফলভাবে সংরক্ষিত হয়েছে!',
    draft: 'খসড়া',
    translated: 'অনূদিত (AI)',
    reviewed: 'পর্যালোচিত',
    published: 'প্রকাশিত',
    livePreview: 'লাইভ ত্রিভাষিক প্রিভিউ',
    bengaliMaster: 'বাংলা (মূল কনটেন্ট)',
    englishTranslation: 'English (ইংরেজি অনুবাদ)',
    arabicTranslation: 'العربية (আরবি অনুবাদ)',
    bengaliSourceWarning: 'বাংলা হলো মাস্টার কনটেন্ট। এআই অনুবাদ কখনো মূল বাংলাকে ওভাররাইট করবে না।',
    darkTheme: 'ডার্ক মোড',
    lightTheme: 'লাইট মোড',
    close: 'বন্ধ করুন',
    backToSite: 'পাবলিক ওয়েবসাইটে ফিরে যান',
  },
  en: {
    siteTitle: 'Ehsanul Haque Khan Nafis',
    home: 'Home',
    about: 'About',
    education: 'Education',
    experience: 'Experience',
    activities: 'Activities',
    skills: 'Skills Matrix',
    languages: 'Languages',
    awards: 'Awards',
    articles: 'Articles',
    mediaGallery: 'Media & Gallery',
    projects: 'Projects',
    contact: 'Contact',
    admin: 'Admin CMS',
    search: 'Search platform',
    searchPlaceholder: 'Search education, skills, awards, or articles...',
    noResults: 'No matching results found',
    allCategories: 'All Categories',
    viewProfile: 'View Profile',
    contactMe: 'Get in Touch',
    viewCv: 'View CV',
    academicExcellence: 'Academic Excellence',
    timeline: 'Academic Timeline',
    honorsBadge: 'First Class with Honors',
    readMore: 'Read Article',
    shareArticle: 'Share Article',
    copied: 'Link copied to clipboard!',
    copyLink: 'Copy Link',
    facebookShare: 'Share on Facebook',
    whatsappShare: 'Send via WhatsApp',
    nativeShare: 'Share',
    contactDirectly: 'Direct Contact Channels',
    sendDirectMessage: 'Send a Message',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    yourMessage: 'Write your message...',
    sendMessage: 'Send Message',
    messageSentSuccess: 'Thank you! Your message has been sent successfully.',
    verifiedInfo: 'Verified Information',
    locationLabel: 'Location',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    whatsappLabel: 'WhatsApp',
    facebookLabel: 'Facebook',
    linkedinLabel: 'LinkedIn',
    twitterLabel: 'Twitter (X)',
    adminPortal: 'Content Management System',
    passcodePrompt: 'Enter Admin Passcode (Default: ihsan2026)',
    unlockAdmin: 'Unlock Admin',
    logout: 'Log Out',
    adminTitle: 'AI Multilingual CMS Dashboard',
    aiTranslateBtn: '✨ AI Translate to English & Arabic',
    aiTranslating: 'Translating with Gemini AI...',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    savedSuccessfully: 'Changes saved successfully!',
    draft: 'Draft',
    translated: 'AI Draft',
    reviewed: 'Reviewed',
    published: 'Published',
    livePreview: 'Live Trilingual Preview',
    bengaliMaster: 'Bengali (Master Source)',
    englishTranslation: 'English (AI Translation)',
    arabicTranslation: 'العربية (Arabic Translation)',
    bengaliSourceWarning: 'Bengali is the master source. AI translations will never overwrite Bengali text.',
    darkTheme: 'Dark Mode',
    lightTheme: 'Light Mode',
    close: 'Close',
    backToSite: 'Back to Website',
  },
  ar: {
    siteTitle: 'إحسان الحق خان نفيس',
    home: 'الرئيسية',
    about: 'نبذة عني',
    education: 'المسيرة العلمية',
    experience: 'الخبرات والأنشطة',
    activities: 'العمل التطوعي',
    skills: 'المهارات والقدرات',
    languages: 'اللغات والبيان',
    awards: 'الجوائز والتكريمات',
    articles: 'المقالات والبحوث',
    mediaGallery: 'الوسائط والمعرض',
    projects: 'المشاريع والمبادرات',
    contact: 'تواصل معي',
    admin: 'لوحة الإدارة',
    search: 'بحث في المنصة',
    searchPlaceholder: 'ابحث في التعليم، المهارات، الجوائز، أو المقالات...',
    noResults: 'لم يتم العثور على نتائج مطابقة',
    allCategories: 'كافة التصنيفات',
    viewProfile: 'نبذة عني',
    contactMe: 'تواصل الآن',
    viewCv: 'عرض السيرة الذاتية',
    academicExcellence: 'التميز الأكاديمي',
    timeline: 'المسار التعليمي',
    honorsBadge: 'امتياز مع مرتبة الشرف الأولى',
    readMore: 'اقرأ المقال',
    shareArticle: 'مشاركة المقال',
    copied: 'تم نسخ الرابط بنجاح!',
    copyLink: 'نسخ الرابط',
    facebookShare: 'فيسبوك',
    whatsappShare: 'واتساب',
    nativeShare: 'مشاركة',
    contactDirectly: 'قنوات الاتصال المباشرة',
    sendDirectMessage: 'إرسال رسالة مباشرة',
    yourName: 'الاسم الكريم',
    yourEmail: 'البريد الإلكتروني',
    yourMessage: 'اكتب رسالتك هنا...',
    sendMessage: 'إرسال الرسالة',
    messageSentSuccess: 'شكراً لك! تم استلام رسالتك بنجاح.',
    verifiedInfo: 'بيانات موثقة',
    locationLabel: 'المقر',
    emailLabel: 'البريد',
    phoneLabel: 'الهاتف',
    whatsappLabel: 'واتساب',
    facebookLabel: 'فيسبوك',
    linkedinLabel: 'لينكد إن',
    twitterLabel: 'تويتر (X)',
    adminPortal: 'نظام إدارة المحتوى الذكي',
    passcodePrompt: 'أدخل رمز المرور الإداري (الافتراضي: ihsan2026)',
    unlockAdmin: 'الدخول للوحة التحكم',
    logout: 'تسجيل الخروج',
    adminTitle: 'منظومة إدارة المحتوى متعددة اللغات',
    aiTranslateBtn: '✨ ترجمة ذكية للإنجليزية والعربية عبر الذكاء الاصطناعي',
    aiTranslating: 'جارٍ توليد الترجمة الأكاديمية...',
    saveChanges: 'حفظ التعديلات',
    saving: 'جارٍ الحفظ...',
    savedSuccessfully: 'تم الحفظ بنجاح!',
    draft: 'مسودة',
    translated: 'مسودة الذكاء الاصطناعي',
    reviewed: 'تمت المراجعة',
    published: 'منشور',
    livePreview: 'معاينة حية بثلاث لغات',
    bengaliMaster: 'البنغالية (النص الأصلي الأم)',
    englishTranslation: 'الإنجليزية (ترجمة الذكاء الاصطناعي)',
    arabicTranslation: 'العربية (ترجمة الذكاء الاصطناعي)',
    bengaliSourceWarning: 'النص البنغالي هو الأصل الدائم ولن يتم تجاوزه أو استبداله بالذكاء الاصطناعي.',
    darkTheme: 'المظهر الداكن',
    lightTheme: 'المظهر الفاتح',
    close: 'إغلاق',
    backToSite: 'العودة للموقع العام',
  },
};
