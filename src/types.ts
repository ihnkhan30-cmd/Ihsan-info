export type SupportedLanguage = 'bn' | 'en' | 'ar';

export interface MultilingualText {
  bn: string;
  en: string;
  ar: string;
}

export type TranslationState = 'draft' | 'ai_generated' | 'translated' | 'reviewed' | 'approved' | 'published';

export interface TranslationStatus {
  bn: 'published' | 'draft' | 'approved';
  en: TranslationState;
  ar: TranslationState;
}

export interface ProfileData {
  name: MultilingualText;
  secondaryName: string;
  arabicCalligraphy: string;
  headline: MultilingualText;
  rolesBadge?: MultilingualText;
  degreeLabel?: MultilingualText;
  shortBio: MultilingualText;
  longBio: MultilingualText;
  currentInstitution: MultilingualText;
  degreeStatus: MultilingualText;
  gpa: string;
  gpaScale: string;
  academicHonors: MultilingualText;
  location: MultilingualText;
  email: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  linkedin?: string;
  twitter?: string;
  avatarUrl: string;
  cvUrl?: string;
  philosophies: {
    stage: MultilingualText;
    title: MultilingualText;
    description: MultilingualText;
  }[];
}

export interface EducationItem {
  id: string;
  degree: MultilingualText;
  institution: MultilingualText;
  location: MultilingualText;
  period: string;
  grade: MultilingualText;
  isHonors?: boolean;
  featured?: boolean;
  current?: boolean;
  description: MultilingualText;
  translationStatus: TranslationStatus;
  order: number;
}

export interface ExperienceItem {
  id: string;
  role: MultilingualText;
  organization: MultilingualText;
  period: string;
  location: MultilingualText;
  description: MultilingualText;
  type?: 'leadership' | 'voluntary' | 'professional' | string;
  translationStatus: TranslationStatus;
  order: number;
}

export interface ActivityItem {
  id: string;
  title: MultilingualText;
  organization: MultilingualText;
  role: MultilingualText;
  period: string;
  description: MultilingualText;
  category: 'volunteering' | 'speaking' | 'leadership';
  translationStatus: TranslationStatus;
  order: number;
}

export interface SkillItem {
  id: string;
  name: MultilingualText;
  category: MultilingualText;
  proficiency: number;
  highlight?: boolean;
  description: MultilingualText;
  translationStatus: TranslationStatus;
}

export interface LanguageSkillItem {
  id: string;
  language: MultilingualText;
  level: MultilingualText;
  percentage: number;
  badge: MultilingualText;
  description: MultilingualText;
  translationStatus: TranslationStatus;
}

export interface AwardItem {
  id: string;
  title: MultilingualText;
  position: MultilingualText;
  competition: MultilingualText;
  organizer: MultilingualText;
  organization?: MultilingualText;
  year: string;
  description: MultilingualText;
  iconType: 'trophy' | 'medal' | 'star';
  translationStatus: TranslationStatus;
  featured?: boolean;
}

export interface ArticleItem {
  id: string;
  title: MultilingualText;
  excerpt: MultilingualText;
  content: MultilingualText;
  category: MultilingualText;
  tags: string[];
  featuredImage: string;
  publishedAt: string;
  slug?: MultilingualText;
  seoTitle?: MultilingualText;
  seoDescription?: MultilingualText;
  imageAlt?: MultilingualText;
  readingTime: string;
  status: 'published' | 'draft';
  translationStatus: TranslationStatus;
}

export interface ProjectItem {
  id: string;
  title: MultilingualText;
  description: MultilingualText;
  category: MultilingualText;
  link?: string;
  tags: string[];
  translationStatus: TranslationStatus;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  title: MultilingualText;
  altText: MultilingualText;
  caption: MultilingualText;
  source?: string;
  size?: string;
  type: 'image' | 'video' | string;
  mediaCategory?: 'video' | 'photo';
  youtubeUrl?: string;
  youtubeId?: string;
  uploadedAt: string;
}

export interface SiteSettings {
  autoTranslateOnSave: boolean;
  autoPublishAITranslations: boolean;
  adminPasscode: string;
  adminEmail?: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactFacebook: string;
  enableBlog: boolean;
  maintenanceMode: boolean;
}

export interface SEOMetadata {
  title: MultilingualText;
  description: MultilingualText;
  keywords: MultilingualText;
  ogTitle: MultilingualText;
  ogDescription: MultilingualText;
  ogImage: string;
}

export interface PortfolioDatabase {
  profile: ProfileData;
  education: EducationItem[];
  experience: ExperienceItem[];
  activities: ActivityItem[];
  skills: SkillItem[];
  languages: LanguageSkillItem[];
  awards: AwardItem[];
  articles: ArticleItem[];
  projects: ProjectItem[];
  media: MediaItem[];
  seo: SEOMetadata;
  settings: SiteSettings;
}

export interface FirebaseUploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  category: 'avatar' | 'media' | 'document' | 'general';
  uploadedAt: string;
  description?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}
