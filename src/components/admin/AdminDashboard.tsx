import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArticleItem, MediaItem, MultilingualText, TranslationStatus } from '../../types';
import { 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Save, 
  RotateCcw, 
  LogOut, 
  Eye, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  FileText, 
  Search, 
  Sliders,
  ExternalLink,
  Code2,
  Lock,
  Video,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  ArrowRight,
  HardDrive,
  UploadCloud
} from 'lucide-react';
import { ProfileEditor } from './ProfileEditor';
import { EducationEditor } from './EducationEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { AwardsEditor } from './AwardsEditor';
import { FileManager } from './FileManager';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdmin, 
    adminEmail,
    adminUser,
    adminActiveTab,
    setAdminActiveTab,
    loginAdmin, 
    logoutAdmin, 
    data, 
    updateData, 
    resetData, 
    translateWithAI, 
    generateSEOWithAI, 
    generateAltTextWithAI,
    setCurrentView,
    strings,
    firebaseConnected,
    uploadFile,
  } = usePortfolio();

  const [inputEmail, setInputEmail] = useState('ihsanul1334@gmail.com');
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(adminActiveTab || 'profile');
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isUploadingMediaPhoto, setIsUploadingMediaPhoto] = useState(false);
  const mediaFileInputRef = React.useRef<HTMLInputElement>(null);

  // New Media Item Form State
  const [newMedia, setNewMedia] = useState<{
    type: 'video' | 'photo';
    titleBn: string;
    titleEn: string;
    titleAr: string;
    youtubeUrl: string;
    imageUrl: string;
    captionBn: string;
    source: string;
  }>({
    type: 'video',
    titleBn: '',
    titleEn: '',
    titleAr: '',
    youtubeUrl: '',
    imageUrl: '',
    captionBn: '',
    source: 'YouTube Archive',
  });

  // Editing Article State
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);

  // Handle Login
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F8F6F0] dark:bg-[#0B1F33]">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-2xl text-start space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0B1F33] dark:text-white">
                {strings.adminPortal}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                সকল কনটেন্ট ও সেকশন পরিচালনা করতে অ্যাডমিন লগইন করুন।
              </p>
            </div>
          </div>

          {/* Designated Admin Card */}
          <div className="p-4 rounded-2xl bg-[#C6A15B]/10 border border-[#C6A15B]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B1F33] dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>প্রধান অ্যাডমিন (Designated Admin)</span>
              </span>
              <span className="text-[10px] font-bold text-[#C6A15B] uppercase">Admin Access</span>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 dark:bg-[#0B1F33]/80 border border-[#C6A15B]/20">
              <Mail className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <div className="text-xs font-bold text-[#0B1F33] dark:text-white truncate">
                ihsanul1334@gmail.com
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const ok = loginAdmin('ihsan2026', 'ihsanul1334@gmail.com');
                if (!ok) setAuthError(true);
              }}
              className="w-full py-2.5 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>১-ক্লিকে অ্যাডমিন হিসেবে প্রবেশ করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 dark:border-gray-800 w-full"></div>
            <span className="bg-white dark:bg-[#142B3D] px-2 text-[10px] text-gray-400 font-semibold uppercase">
              অথবা পাসকোড দিন
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const success = loginAdmin(passcode || 'ihsan2026', inputEmail);
              if (!success) {
                setAuthError(true);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#0B1F33] dark:text-[#F8F6F0] mb-1.5">
                অ্যাডমিন ইমেইল
              </label>
              <input
                type="email"
                required
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                  setAuthError(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0B1F33] dark:text-[#F8F6F0]">
                  সিকিউরিটি পাসকোড
                </label>
                <span className="text-[10px] text-gray-400 font-mono">ডিফল্ট: ihsan2026</span>
              </div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Enter passcode (e.g. ihsan2026)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
              {authError && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>ভুল তথ্য! প্রধান অ্যাডমিন: ihsanul1334@gmail.com</span>
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>লগইন ও আনলক করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('site')}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0B1F33] text-gray-600 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 cursor-pointer"
              >
                সাইটে ফিরুন
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // AI Translation Handler (Bengali is master, English & Arabic translated)
  const handleAITranslateArticle = async () => {
    if (!editingArticle) return;
    const masterTitle = editingArticle.title.bn;
    const masterExcerpt = editingArticle.excerpt.bn;
    const masterContent = editingArticle.content.bn;

    if (!masterTitle && !masterContent) {
      alert('Please provide Bengali master content first.');
      return;
    }

    setIsTranslating(true);

    try {
      // 1. Translate title
      const translatedTitle = await translateWithAI(masterTitle, 'Article Title', 'title');
      // 2. Translate excerpt
      const translatedExcerpt = await translateWithAI(masterExcerpt, 'Article Excerpt', 'excerpt');
      // 3. Translate content
      const translatedContent = await translateWithAI(masterContent, 'Scholarly Article Content', 'content');

      setEditingArticle({
        ...editingArticle,
        title: {
          bn: masterTitle, // untouched
          en: translatedTitle.en,
          ar: translatedTitle.ar,
        },
        excerpt: {
          bn: masterExcerpt,
          en: translatedExcerpt.en,
          ar: translatedExcerpt.ar,
        },
        content: {
          bn: masterContent,
          en: translatedContent.en,
          ar: translatedContent.ar,
        },
        translationStatus: {
          bn: 'approved',
          en: 'ai_generated',
          ar: 'ai_generated',
        },
      });
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Save Article
  const handleSaveArticle = async () => {
    if (!editingArticle) return;
    setSavingStatus('saving');

    const existingArticles = data.articles || [];
    const index = existingArticles.findIndex((a) => a.id === editingArticle.id);

    let updatedArticles: ArticleItem[];
    if (index >= 0) {
      updatedArticles = [...existingArticles];
      updatedArticles[index] = editingArticle;
    } else {
      updatedArticles = [editingArticle, ...existingArticles];
    }

    await updateData({ articles: updatedArticles });
    setSavingStatus('saved');
    setTimeout(() => {
      setSavingStatus('idle');
      setEditingArticle(null);
    }, 1000);
  };

  // Create New Article Template
  const handleCreateNewArticle = () => {
    const newArt: ArticleItem = {
      id: `art-${Date.now()}`,
      title: { bn: '', en: '', ar: '' },
      slug: { bn: '', en: '', ar: '' },
      category: { bn: 'সাধারণ', en: 'General', ar: 'عام' },
      featuredImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      imageAlt: { bn: 'নিবন্ধের চিত্র', en: 'Article illustration', ar: 'صورة المقال' },
      publishedAt: new Date().toISOString().split('T')[0],
      readingTime: '4 min read',
      excerpt: { bn: '', en: '', ar: '' },
      content: { bn: '', en: '', ar: '' },
      status: 'draft',
      translationStatus: { bn: 'approved', en: 'draft', ar: 'draft' },
      tags: ['Arabic', 'Academic'],
    };
    setEditingArticle(newArt);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#0B1F33] py-8 text-start transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Top Navigation Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-md flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C6A15B] text-[#0B1F33] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B1F33] dark:text-white flex flex-wrap items-center gap-2">
                <span>Ehsanul Haque Khan Nafis CMS</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  {adminUser || adminEmail || 'ihsanul1334@gmail.com'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-300 dark:border-orange-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                  <span>{firebaseConnected ? 'Firebase Live' : 'Firestore Synced'}</span>
                </span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                সকল সেকশন ও টেক্সট এডিট কন্ট্রোল প্যানেল (মাস্টার অ্যাক্সেস)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('site')}
              className="px-4 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] text-[#0B1F33] dark:text-white text-xs font-semibold hover:bg-[#E9E2D2] cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[#C6A15B]" />
              <span>{strings.backToSite}</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              title="Log out admin session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CMS Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'profile', label: 'প্রোফাইল ও হিরো (Hero & Bio)', icon: User },
            { id: 'education', label: 'শিক্ষা ও ডিগ্রি (Education)', icon: GraduationCap },
            { id: 'experience', label: 'অভিজ্ঞতা ও কর্মজীবন (Experience)', icon: Briefcase },
            { id: 'awards', label: 'পুরস্কার ও সম্মাননা (Awards)', icon: Award },
            { id: 'articles', label: 'প্রবন্ধ ও কলাম (Articles)', icon: FileText },
            { id: 'media', label: 'ভিডিও ও মিডিয়া (Media)', icon: Video },
            { id: 'files', label: 'ফায়ারবেস ফাইল ও স্টোরেজ (Firebase Files)', icon: HardDrive },
            { id: 'seo', label: 'এসইও ও সেটিংস (SEO & Code)', icon: Code2 },
            { id: 'preview', label: '৩-ভাষা প্রিভিউ (Live Preview)', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setEditingArticle(null);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] shadow-md'
                    : 'bg-white dark:bg-[#142B3D] text-[#0B1F33] dark:text-[#F8F6F0] border border-[#E9E2D2] dark:border-[#0B1F33] hover:border-[#C6A15B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 0: Profile & Hero Texts */}
        {activeTab === 'profile' && <ProfileEditor />}

        {/* Tab 0.1: Education */}
        {activeTab === 'education' && <EducationEditor />}

        {/* Tab 0.2: Experience */}
        {activeTab === 'experience' && <ExperienceEditor />}

        {/* Tab 0.3: Awards */}
        {activeTab === 'awards' && <AwardsEditor />}

        {/* Tab 1: Articles Manager */}
        {activeTab === 'articles' && (
          <div>
            {!editingArticle ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0B1F33] dark:text-white">
                    Published & Draft Articles ({data.articles?.length || 0})
                  </h3>
                  <button
                    onClick={handleCreateNewArticle}
                    className="px-4 py-2.5 rounded-xl bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{strings.addArticle}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(data.articles || []).map((art) => (
                    <div
                      key={art.id}
                      className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            art.status === 'published' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {art.status}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {art.publishedAt}
                          </span>
                        </div>

                        <h4 className="font-bold text-base text-[#0B1F33] dark:text-white line-clamp-2 mb-2">
                          {art.title.bn || art.title.en || 'Untitled Article'}
                        </h4>

                        <div className="flex flex-wrap gap-2 text-[11px] text-gray-500 mb-4">
                          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0B1F33]">
                            EN: {art.translationStatus?.en || 'draft'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0B1F33]">
                            AR: {art.translationStatus?.ar || 'draft'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E9E2D2] dark:border-[#0B1F33] flex items-center justify-between">
                        <button
                          onClick={() => setEditingArticle(art)}
                          className="px-3.5 py-2 rounded-lg bg-[#F8F6F0] dark:bg-[#0B1F33] text-xs font-bold text-[#0B1F33] dark:text-[#C6A15B] hover:bg-[#C6A15B]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit & Translate</span>
                        </button>

                        <button
                          onClick={async () => {
                            if (confirm('Delete this article?')) {
                              const updated = (data.articles || []).filter((a) => a.id !== art.id);
                              await updateData({ articles: updated });
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Article Edit & AI Translation Workflow Form */
              <div className="p-8 rounded-3xl bg-white dark:bg-[#142B3D] border border-[#C6A15B]/40 shadow-xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E9E2D2] dark:border-[#0B1F33]">
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F33] dark:text-white">
                      Multilingual Article Editor
                    </h3>
                    <p className="text-xs text-[#3E7180] dark:text-[#C6A15B] mt-0.5">
                      Rule: Bengali is master source. AI generates English and Arabic without modifying Bengali.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAITranslateArticle}
                      disabled={isTranslating}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A15B] to-[#b38e47] text-[#0B1F33] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isTranslating ? strings.translating : strings.translateWithAi}</span>
                    </button>

                    <button
                      onClick={handleSaveArticle}
                      className="px-5 py-2.5 rounded-xl bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingStatus === 'saving' ? strings.saving : savingStatus === 'saved' ? strings.saved : strings.saveChanges}</span>
                    </button>

                    <button
                      onClick={() => setEditingArticle(null)}
                      className="px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-[#0B1F33] text-gray-500 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Status & Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                    <select
                      value={editingArticle.status}
                      onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-xs text-[#0B1F33] dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={editingArticle.publishedAt}
                      onChange={(e) => setEditingArticle({ ...editingArticle, publishedAt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-xs text-[#0B1F33] dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Reading Time</label>
                    <input
                      type="text"
                      value={editingArticle.readingTime}
                      onChange={(e) => setEditingArticle({ ...editingArticle, readingTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33] text-xs text-[#0B1F33] dark:text-white"
                    />
                  </div>
                </div>

                {/* 3-Column Parallel Translation Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Master: Bengali (bn) */}
                  <div className="p-5 rounded-2xl bg-[#F8F6F0] dark:bg-[#0B1F33]/80 border-2 border-[#3E7180]/40 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D2] dark:border-[#142B3D]">
                      <span className="text-xs font-bold text-[#3E7180] dark:text-[#C6A15B] uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>বাংলা (মাস্টার কনটেন্ট)</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3E7180]/15 text-[#3E7180] dark:text-[#C6A15B]">
                        Master Source
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">শিরোনাম (Title)</label>
                      <input
                        type="text"
                        value={editingArticle.title.bn}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          title: { ...editingArticle.title, bn: e.target.value }
                        })}
                        placeholder="বাংলায় শিরোনাম লিখুন..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#142B3D] border border-gray-300 dark:border-gray-700 text-sm font-bengali"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">সংক্ষেপ (Excerpt)</label>
                      <textarea
                        rows={3}
                        value={editingArticle.excerpt.bn}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          excerpt: { ...editingArticle.excerpt, bn: e.target.value }
                        })}
                        placeholder="সংক্ষিপ্ত সারসংক্ষেপ..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#142B3D] border border-gray-300 dark:border-gray-700 text-xs font-bengali resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">মূল বক্তব্য (Content)</label>
                      <textarea
                        rows={8}
                        value={editingArticle.content.bn}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          content: { ...editingArticle.content, bn: e.target.value }
                        })}
                        placeholder="পূর্ণ নিবন্ধ এখানে লিখুন..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#142B3D] border border-gray-300 dark:border-gray-700 text-xs font-bengali"
                      />
                    </div>
                  </div>

                  {/* Secondary: English (en) */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D2] dark:border-[#0B1F33]">
                      <span className="text-xs font-bold text-[#0B1F33] dark:text-white uppercase">
                        English Translation
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0B1F33] text-gray-500">
                        {editingArticle.translationStatus?.en || 'draft'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={editingArticle.title.en || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          title: { ...editingArticle.title, en: e.target.value }
                        })}
                        placeholder="English Title..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-300 dark:border-gray-700 text-sm font-english"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Excerpt (English)</label>
                      <textarea
                        rows={3}
                        value={editingArticle.excerpt.en || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          excerpt: { ...editingArticle.excerpt, en: e.target.value }
                        })}
                        placeholder="Brief summary..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-300 dark:border-gray-700 text-xs font-english resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Content (English)</label>
                      <textarea
                        rows={8}
                        value={editingArticle.content.en || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          content: { ...editingArticle.content, en: e.target.value }
                        })}
                        placeholder="Article body in English..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-300 dark:border-gray-700 text-xs font-english"
                      />
                    </div>
                  </div>

                  {/* Secondary: Arabic (ar) (RTL) */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E9E2D2] dark:border-[#0B1F33]">
                      <span className="text-xs font-bold text-[#C6A15B] uppercase">
                        الترجمة العربية (Arabic RTL)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-[#0B1F33] text-gray-500">
                        {editingArticle.translationStatus?.ar || 'draft'}
                      </span>
                    </div>

                    <div dir="rtl">
                      <label className="block text-xs font-semibold mb-1 text-right">عنوان المقال (العربية)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={editingArticle.title.ar || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          title: { ...editingArticle.title, ar: e.target.value }
                        })}
                        placeholder="العنوان بالعربية الفصحى..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-300 dark:border-gray-700 text-sm font-arabic text-right"
                      />
                    </div>

                    <div dir="rtl">
                      <label className="block text-xs font-semibold mb-1 text-right">الموجز (العربية)</label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={editingArticle.excerpt.ar || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          excerpt: { ...editingArticle.excerpt, ar: e.target.value }
                        })}
                        placeholder="الموجز التعريفي..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-300 dark:border-gray-700 text-xs font-arabic text-right resize-none"
                      />
                    </div>

                    <div dir="rtl">
                      <label className="block text-xs font-semibold mb-1 text-right">المحتوى الأكاديمي (العربية)</label>
                      <textarea
                        rows={8}
                        dir="rtl"
                        value={editingArticle.content.ar || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          content: { ...editingArticle.content, ar: e.target.value }
                        })}
                        placeholder="نص المقال الكامل باللغة العربية..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-300 dark:border-gray-700 text-xs font-arabic text-right"
                      />
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* Tab: Media & Gallery Manager */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-500" />
                  <span>মিডিয়া ও গ্যালারি ব্যবস্থাপনা (Media & Gallery Manager)</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add or remove YouTube speech video links and event photos for Ehsanul Haque Khan Nafis.
                </p>
              </div>

              <div className="text-xs font-semibold text-[#3E7180] dark:text-[#C6A15B]">
                Total Items: {data.media?.length || 0}
              </div>
            </div>

            {/* Quick Add Form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C6A15B]" />
                <span>নতুন ভিডিও বা ছবি যোগ করুন (Add New Video Speech or Event Photo)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Media Type */}
                <div>
                  <label className="block text-xs font-semibold mb-1">কনটেন্টের ধরন (Media Type)</label>
                  <select
                    value={newMedia.type}
                    onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as 'video' | 'photo' })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs font-semibold"
                  >
                    <option value="video">ইউটিউব ভিডিও বক্তব্য (YouTube Video Speech)</option>
                    <option value="photo">অনুষ্ঠানের ছবি (Event Photograph)</option>
                  </select>
                </div>

                {/* Source / Event Name */}
                <div>
                  <label className="block text-xs font-semibold mb-1">উৎস / ইভেন্ট (Source / Organizer)</label>
                  <input
                    type="text"
                    value={newMedia.source}
                    onChange={(e) => setNewMedia({ ...newMedia, source: e.target.value })}
                    placeholder="যেমন: Islamic University YouTube Archive"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs"
                  />
                </div>

                {/* Title (Bengali) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">শিরোনাম (বাংলা) *</label>
                  <input
                    type="text"
                    value={newMedia.titleBn}
                    onChange={(e) => setNewMedia({ ...newMedia, titleBn: e.target.value })}
                    placeholder="ভিডিও বক্তব্য বা অনুষ্ঠানের সংক্ষিপ্ত শিরোনাম..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs font-semibold"
                  />
                </div>

                {/* Title (English) */}
                <div>
                  <label className="block text-xs font-semibold mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={newMedia.titleEn}
                    onChange={(e) => setNewMedia({ ...newMedia, titleEn: e.target.value })}
                    placeholder="Speech or event title in English..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs"
                  />
                </div>

                {/* Title (Arabic) */}
                <div>
                  <label className="block text-xs font-semibold mb-1">العنوان (العربية)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={newMedia.titleAr}
                    onChange={(e) => setNewMedia({ ...newMedia, titleAr: e.target.value })}
                    placeholder="عنوان الكلمة أو الفعالية بالعربية..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-right font-arabic"
                  />
                </div>

                {/* URL Field conditional */}
                {newMedia.type === 'video' ? (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-rose-500">
                      ইউটিউব ভিডিও লিংক (YouTube URL / Watch Link) *
                    </label>
                    <input
                      type="text"
                      value={newMedia.youtubeUrl}
                      onChange={(e) => setNewMedia({ ...newMedia, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs font-mono"
                    />
                  </div>
                ) : (
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-semibold">
                      ছবির লিংক অথবা সরাসরি ফায়ারবেসে আপলোড (Photo URL or Upload to Firebase) *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMedia.imageUrl}
                        onChange={(e) => setNewMedia({ ...newMedia, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... বা ফায়ারবেসে আপলোড করুন"
                        className="flex-1 px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs font-mono"
                      />
                      <input
                        ref={mediaFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingMediaPhoto(true);
                          try {
                            const saved = await uploadFile(file, 'media', newMedia.titleBn || file.name);
                            setNewMedia(prev => ({ ...prev, imageUrl: saved.dataUrl }));
                          } catch (err) {
                            console.error('Failed to upload media to Firebase:', err);
                          } finally {
                            setIsUploadingMediaPhoto(false);
                          }
                        }}
                      />
                      <button
                        type="button"
                        disabled={isUploadingMediaPhoto}
                        onClick={() => mediaFileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 text-[#0B1F33] dark:text-[#C6A15B] border border-[#C6A15B]/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#C6A15B]" />
                        <span>{isUploadingMediaPhoto ? 'আপলোড হচ্ছে...' : 'ফায়ারবেসে আপলোড'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Caption */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1">বিবরণ / ক্যাপশন (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={newMedia.captionBn}
                    onChange={(e) => setNewMedia({ ...newMedia, captionBn: e.target.value })}
                    placeholder="অনুষ্ঠান বা বক্তব্যের স্থান, প্রেক্ষাপট..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs resize-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={async () => {
                    if (!newMedia.titleBn.trim()) {
                      alert('অনুগ্রহ করে শিরোনাম প্রদান করুন');
                      return;
                    }
                    
                    let ytId = '';
                    if (newMedia.type === 'video' && newMedia.youtubeUrl) {
                      const match = newMedia.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
                      if (match) ytId = match[1];
                    }

                    const defaultCover = newMedia.type === 'video' 
                      ? (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop')
                      : (newMedia.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop');

                    const itemToAdd: MediaItem = {
                      id: `med-${Date.now()}`,
                      url: defaultCover,
                      name: `${newMedia.type}-${Date.now()}.jpg`,
                      type: newMedia.type,
                      mediaCategory: newMedia.type,
                      youtubeUrl: newMedia.youtubeUrl || undefined,
                      youtubeId: ytId || undefined,
                      title: {
                        bn: newMedia.titleBn,
                        en: newMedia.titleEn || newMedia.titleBn,
                        ar: newMedia.titleAr || newMedia.titleBn,
                      },
                      altText: {
                        bn: newMedia.titleBn,
                        en: newMedia.titleEn || newMedia.titleBn,
                        ar: newMedia.titleAr || newMedia.titleBn,
                      },
                      caption: {
                        bn: newMedia.captionBn,
                        en: newMedia.captionBn,
                        ar: newMedia.captionBn,
                      },
                      source: newMedia.source,
                      uploadedAt: new Date().toISOString().split('T')[0],
                    };

                    const current = data.media || [];
                    await updateData({ media: [itemToAdd, ...current] });
                    setNewMedia({
                      type: 'video',
                      titleBn: '',
                      titleEn: '',
                      titleAr: '',
                      youtubeUrl: '',
                      imageUrl: '',
                      captionBn: '',
                      source: 'YouTube Archive',
                    });
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33] text-xs font-bold hover:opacity-90 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>গ্যালারিতে যুক্ত করুন (Save to Gallery)</span>
                </button>
              </div>
            </div>

            {/* Existing Media Items List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#0B1F33] dark:text-white">
                বর্তমান তালিকাভুক্ত কনটেন্ট ({data.media?.length || 0})
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.media || []).map((med) => {
                  const isVideo = med.type === 'video' || med.mediaCategory === 'video';
                  return (
                    <div
                      key={med.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] flex items-center gap-4 justify-between"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-16 h-12 rounded-lg bg-gray-900 overflow-hidden relative shrink-0">
                          <img src={med.url} alt="" className="w-full h-full object-cover" />
                          {isVideo && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-rose-500">
                              <Video className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                            isVideo ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {isVideo ? 'Video Speech' : 'Photo'}
                          </span>
                          <h5 className="text-xs font-bold text-[#0B1F33] dark:text-white truncate">
                            {med.title.bn}
                          </h5>
                          <p className="text-[11px] text-gray-500 truncate">
                            {med.source || med.uploadedAt}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          const updated = (data.media || []).filter((m) => m.id !== med.id);
                          await updateData({ media: updated });
                        }}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                        title="Delete media item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Firebase File & Media Storage Manager */}
        {activeTab === 'files' && <FileManager />}

        {/* Tab 2: 3-Language Live Preview Simultaneously */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0B1F33] dark:text-white">
                  {strings.livePreview} (Simultaneous 3-Language View)
                </h3>
                <p className="text-xs text-gray-500">
                  Inspect the visual balance, typographic rhythm, and RTL/LTR alignment across all 3 supported languages side-by-side.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Bengali Preview */}
              <div className="rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] overflow-hidden p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-sm text-[#0B1F33] dark:text-white">বাংলা (LTR)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Master</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-[#0B1F33] dark:text-white font-bengali">
                    {data.profile.name.bn}
                  </h4>
                  <p className="text-xs text-[#C6A15B] font-semibold">
                    {data.profile.headline.bn}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-bengali">
                    {data.profile.shortBio.bn}
                  </p>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#0B1F33] text-[11px]">
                    <strong>অনার্স:</strong> {data.education[0]?.degree.bn}
                  </div>
                </div>
              </div>

              {/* English Preview */}
              <div className="rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] overflow-hidden p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-sm text-[#0B1F33] dark:text-white">English (LTR)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">Translated</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-[#0B1F33] dark:text-white font-english">
                    {data.profile.name.en}
                  </h4>
                  <p className="text-xs text-[#C6A15B] font-semibold font-english">
                    {data.profile.headline.en}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-english">
                    {data.profile.shortBio.en}
                  </p>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#0B1F33] text-[11px]">
                    <strong>Degree:</strong> {data.education[0]?.degree.en}
                  </div>
                </div>
              </div>

              {/* Arabic Preview (RTL) */}
              <div dir="rtl" className="rounded-2xl bg-white dark:bg-[#142B3D] border-2 border-[#C6A15B]/40 overflow-hidden p-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-sm text-[#C6A15B] font-arabic">العربية (RTL)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800">الفصحى</span>
                </div>
                <div className="space-y-3 text-right">
                  <h4 className="text-2xl font-bold text-[#0B1F33] dark:text-white font-arabic-heading">
                    {data.profile.name.ar}
                  </h4>
                  <p className="text-xs text-[#C6A15B] font-semibold font-arabic">
                    {data.profile.headline.ar}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-arabic">
                    {data.profile.shortBio.ar}
                  </p>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#0B1F33] text-[11px] font-arabic">
                    <strong>الشهادة:</strong> {data.education[0]?.degree.ar}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: SEO & Dynamic JSON-LD Structured Data */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-md space-y-6">
              <h3 className="text-xl font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#C6A15B]" />
                <span>Multilingual SEO Architecture & JSON-LD Validation</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33]">
                  <div className="text-xs font-bold text-[#3E7180] dark:text-[#C6A15B] uppercase mb-1">Dynamic Sitemap</div>
                  <div className="text-xs text-gray-500 mb-3">Serves all 3 languages with hreflang alternate tags.</div>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F33] dark:text-[#C6A15B] underline"
                  >
                    <span>View /sitemap.xml</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33]">
                  <div className="text-xs font-bold text-[#3E7180] dark:text-[#C6A15B] uppercase mb-1">Robots.txt</div>
                  <div className="text-xs text-gray-500 mb-3">Configured for Googlebot, Bingbot, and localized crawlers.</div>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F33] dark:text-[#C6A15B] underline"
                  >
                    <span>View /robots.txt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F6F0] dark:bg-[#0B1F33] border border-[#E9E2D2] dark:border-[#0B1F33]">
                  <div className="text-xs font-bold text-[#3E7180] dark:text-[#C6A15B] uppercase mb-1">Default Admin Code</div>
                  <div className="text-xs text-gray-500 mb-3">Security Passcode for CMS Dashboard.</div>
                  <div className="font-mono text-xs text-[#C6A15B] font-bold">ihsan2026</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#0B1F33] dark:text-white mb-2">
                  Schema.org JSON-LD (Person & EducationalOccupationalCredential)
                </h4>
                <pre className="p-4 rounded-2xl bg-[#0B1F33] text-[#E9E2D2] font-mono text-xs overflow-x-auto">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "إحسان الحق خان نفيس (Ehsanul Haque Khan Nafis)",
  "alternateName": ["Ehsanul Haque Khan Nafis", "এহসানুল হক খান নাফিস", "إحسان الحق خان نفيس"],
  "jobTitle": "Arabic Language & Literature Scholar, Orator & Volunteer",
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "Islamic University, Kushtia",
      "program": "Bachelor of Arts in Arabic Language & Literature"
    },
    {
      "@type": "EducationalOrganization",
      "name": "Tamirul Millat Kamil Madrasa, Tongi"
    }
  ],
  "knowsLanguage": [
    { "@type": "Language", "name": "Arabic" },
    { "@type": "Language", "name": "Bengali" },
    { "@type": "Language", "name": "English" }
  ],
  "email": "ihsanul1334@gmail.com",
  "telephone": "+8801856741334",
  "sameAs": [
    "https://www.facebook.com/ihsan1334"
  ]
}, null, 2)}
                </pre>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
