import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProfileData, MultilingualText } from '../../types';
import { 
  Save, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Image as ImageIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  BookOpen,
  GraduationCap,
  UploadCloud,
  Loader2
} from 'lucide-react';

export const ProfileEditor: React.FC = () => {
  const { data, updateData, translateWithAI, uploadFile } = usePortfolio();
  const [profile, setProfile] = useState<ProfileData>(data.profile);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [translatingField, setTranslatingField] = useState<string | null>(null);
  const [isUploadingToFirebase, setIsUploadingToFirebase] = useState(false);
  const [firebaseUploadSuccess, setFirebaseUploadSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await updateData({ profile });
    setSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleAITranslate = async (fieldName: 'name' | 'headline' | 'shortBio' | 'longBio' | 'location') => {
    const bengaliVal = profile[fieldName]?.bn;
    if (!bengaliVal) return;

    setTranslatingField(fieldName);
    try {
      const res = await translateWithAI(bengaliVal, 'Profile info', fieldName);
      setProfile(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          en: res.en,
          ar: res.ar
        }
      }));
    } catch (err) {
      console.error('AI translation error:', err);
    } finally {
      setTranslatingField(null);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 text-start animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs">
        <div>
          <h3 className="text-xl font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#C6A15B]" />
            <span>প্রোফাইল ও হিরো সেকশন এডিটর (Profile & Hero Texts)</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            নাম, হেডলাইন, পরিচিতি, বায়ো এবং যোগাযোগের সকল টেক্সট পরিবর্তন ও সংরক্ষণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>সংরক্ষিত হয়েছে!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </div>

      {/* 1. Basic Names */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white flex items-center gap-2">
            <span>১. নাম (Full Name in 3 Languages)</span>
          </h4>
          <button
            type="button"
            onClick={() => handleAITranslate('name')}
            disabled={translatingField === 'name'}
            className="text-[11px] font-semibold text-[#C6A15B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{translatingField === 'name' ? 'অনুবাদ হচ্ছে...' : 'বাংলা থেকে অটো-অনুবাদ'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              নাম (বাংলা)
            </label>
            <input
              type="text"
              value={profile.name.bn}
              onChange={(e) => setProfile(prev => ({ ...prev, name: { ...prev.name, bn: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-sm text-[#0B1F33] dark:text-white font-bengali focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Name (English)
            </label>
            <input
              type="text"
              value={profile.name.en}
              onChange={(e) => setProfile(prev => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-sm text-[#0B1F33] dark:text-white font-english focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              الاسم (العربية)
            </label>
            <input
              type="text"
              dir="rtl"
              value={profile.name.ar}
              onChange={(e) => setProfile(prev => ({ ...prev, name: { ...prev.name, ar: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-sm text-[#0B1F33] dark:text-white font-arabic focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>
      </div>

      {/* 2. Headline */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white">
            ২. হেডলাইন / পদবি স্লোগান (Headline / Designation)
          </h4>
          <button
            type="button"
            onClick={() => handleAITranslate('headline')}
            disabled={translatingField === 'headline'}
            className="text-[11px] font-semibold text-[#C6A15B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{translatingField === 'headline' ? 'অনুবাদ হচ্ছে...' : 'বাংলা থেকে অটো-অনুবাদ'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              হেডলাইন (বাংলা)
            </label>
            <textarea
              rows={2}
              value={profile.headline.bn}
              onChange={(e) => setProfile(prev => ({ ...prev, headline: { ...prev.headline, bn: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Headline (English)
            </label>
            <textarea
              rows={2}
              value={profile.headline.en}
              onChange={(e) => setProfile(prev => ({ ...prev, headline: { ...prev.headline, en: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              العنوان الرئيسي (العربية)
            </label>
            <textarea
              rows={2}
              dir="rtl"
              value={profile.headline.ar}
              onChange={(e) => setProfile(prev => ({ ...prev, headline: { ...prev.headline, ar: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white font-arabic focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>
      </div>

      {/* 3. Short Bio */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white">
            ৩. সংক্ষিপ্ত পরিচিতি (Short Bio)
          </h4>
          <button
            type="button"
            onClick={() => handleAITranslate('shortBio')}
            disabled={translatingField === 'shortBio'}
            className="text-[11px] font-semibold text-[#C6A15B] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{translatingField === 'shortBio' ? 'অনুবাদ হচ্ছে...' : 'বাংলা থেকে অটো-অনুবাদ'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">বাংলা</label>
            <textarea
              rows={3}
              value={profile.shortBio.bn}
              onChange={(e) => setProfile(prev => ({ ...prev, shortBio: { ...prev.shortBio, bn: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">English</label>
            <textarea
              rows={3}
              value={profile.shortBio.en}
              onChange={(e) => setProfile(prev => ({ ...prev, shortBio: { ...prev.shortBio, en: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">العربية</label>
            <textarea
              rows={3}
              dir="rtl"
              value={profile.shortBio.ar}
              onChange={(e) => setProfile(prev => ({ ...prev, shortBio: { ...prev.shortBio, ar: e.target.value } }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white font-arabic focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>
      </div>

      {/* 4. Academic Institution & Location */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
          ৪. বর্তমান শিক্ষাপ্রতিষ্ঠান ও অবস্থান (Institution & Location)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              বর্তমান প্রতিষ্ঠান (বাংলা)
            </label>
            <input
              type="text"
              value={profile.currentInstitution?.bn || ''}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                currentInstitution: { ...prev.currentInstitution, bn: e.target.value }
              }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              বর্তমান অবস্থান / ঠিকানা (বাংলা)
            </label>
            <input
              type="text"
              value={profile.location.bn}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                location: { ...prev.location, bn: e.target.value }
              }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>
      </div>

      {/* 5. Contact & Socials */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
          ৫. যোগাযোগের তথ্য (Contact & Social Links)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ইমেইল (Email)
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ফোন নম্বর (Phone)
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              হোয়াটসঅ্যাপ (WhatsApp)
            </label>
            <input
              type="text"
              value={profile.whatsapp}
              onChange={(e) => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ফেসবুক লিংক (Facebook URL)
            </label>
            <input
              type="url"
              value={profile.facebook}
              onChange={(e) => setProfile(prev => ({ ...prev, facebook: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              লিঙ্কডইন লিংক (LinkedIn Profile URL)
            </label>
            <input
              type="url"
              value={profile.linkedin || ''}
              placeholder="https://linkedin.com/in/ihsan1334"
              onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              টুইটার / X লিংক (Twitter / X Profile URL)
            </label>
            <input
              type="url"
              value={profile.twitter || ''}
              placeholder="https://twitter.com/ihsan1334"
              onChange={(e) => setProfile(prev => ({ ...prev, twitter: e.target.value }))}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>
      </div>

      {/* 6. Profile Avatar Image */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white">
            ৬. প্রোফাইল ছবি ও ফায়ারবেস আপলোড (Avatar Photo & Firebase Upload)
          </h4>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Firebase Firestore Storage</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={profile.avatarUrl}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#C6A15B]/50 shadow-md shrink-0"
          />

          <div className="flex-grow space-y-3 w-full">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ছবির পাথ অথবা ওয়েব ইউআরএল (Image Path or URL)
              </label>
              <input
                type="text"
                value={profile.avatarUrl}
                onChange={(e) => setProfile(prev => ({ ...prev, avatarUrl: e.target.value }))}
                placeholder="/assets/uploads/avatar-1789700071658.png"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            {/* Direct Upload to Firebase Button */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploadingToFirebase(true);
                  try {
                    const saved = await uploadFile(file, 'avatar', 'Profile Photo via Admin Editor');
                    setProfile(prev => ({ ...prev, avatarUrl: saved.dataUrl }));
                    setFirebaseUploadSuccess(true);
                    setTimeout(() => setFirebaseUploadSuccess(false), 3000);
                  } catch (err) {
                    console.error('Firebase avatar upload error:', err);
                  } finally {
                    setIsUploadingToFirebase(false);
                  }
                }}
              />

              <button
                type="button"
                disabled={isUploadingToFirebase}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 text-[#0B1F33] dark:text-[#C6A15B] border border-[#C6A15B]/40 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploadingToFirebase ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C6A15B]" />
                    <span>ফায়ারবেসে আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>ফাইল থেকে ছবি নির্বাচন করুন (Upload to Firebase)</span>
                  </>
                )}
              </button>

              {firebaseUploadSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ফায়ারবেসে সফলভাবে সংরক্ষিত হয়েছে!</span>
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              ✓ আপলোডকৃত ছবি ও এর মেটাডাটা সরাসরি ফায়ারবেস ক্লাউড ডেটাবেজে সংরক্ষিত হবে এবং প্রোফাইলে স্থায়ী থাকবে।
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সকল তথ্য সংরক্ষণ করুন'}</span>
        </button>
      </div>
    </form>
  );
};
