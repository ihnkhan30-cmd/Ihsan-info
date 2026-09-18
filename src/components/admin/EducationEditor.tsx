import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { EducationItem } from '../../types';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  X,
  Calendar,
  Sparkles
} from 'lucide-react';

export const EducationEditor: React.FC = () => {
  const { data, updateData, translateWithAI } = usePortfolio();
  const [educationList, setEducationList] = useState<EducationItem[]>(data.education || []);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    let updatedList: EducationItem[];
    if (isNew) {
      updatedList = [editingItem, ...educationList];
    } else {
      updatedList = educationList.map(item => item.id === editingItem.id ? editingItem : item);
    }

    setEducationList(updatedList);
    const ok = await updateData({ education: updatedList });
    setSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      setEditingItem(null);
      setIsNew(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('আপনি কি এই শিক্ষাগত তথ্যটি ডিলিট করতে চান?')) return;
    const updated = educationList.filter(item => item.id !== id);
    setEducationList(updated);
    await updateData({ education: updated });
  };

  const handleCreateNew = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: { bn: '', en: '', ar: '' },
      institution: { bn: '', en: '', ar: '' },
      location: { bn: 'কুষ্টিয়া, বাংলাদেশ', en: 'Kushtia, Bangladesh', ar: 'كوشتيا، بنغلاديش' },
      period: '২০২২–২০২৬',
      grade: { bn: 'অধ্যয়নরত', en: 'Pursuing', ar: 'قيد الدراسة' },
      description: { bn: '', en: '', ar: '' },
      translationStatus: { bn: 'approved', en: 'draft', ar: 'draft' },
      order: educationList.length + 1,
      current: false,
    };
    setEditingItem(newItem);
    setIsNew(true);
  };

  const handleAITranslate = async () => {
    if (!editingItem || !editingItem.degree.bn) return;
    try {
      const degRes = await translateWithAI(editingItem.degree.bn, 'Academic degree');
      const instRes = editingItem.institution.bn ? await translateWithAI(editingItem.institution.bn, 'University or school') : { en: '', ar: '' };
      setEditingItem(prev => prev ? ({
        ...prev,
        degree: { ...prev.degree, en: degRes.en, ar: degRes.ar },
        institution: { ...prev.institution, en: instRes.en, ar: instRes.ar }
      }) : null);
    } catch (err) {
      console.error('AI translation error:', err);
    }
  };

  return (
    <div className="space-y-6 text-start animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs">
        <div>
          <h3 className="text-xl font-bold text-[#0B1F33] dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#C6A15B]" />
            <span>শিক্ষাগত যোগ্যতা ও সনদ (Academic Timeline & Degrees)</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            মাস্টার্স, স্নাতক, কামিল, আলিম ও দাখিল সকল শিক্ষা রেকর্ড এডিট ও নতুন ডিগ্রি যোগ করুন।
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ডিগ্রি যোগ করুন</span>
        </button>
      </div>

      {/* Edit Form Modal/Drawer */}
      {editingItem && (
        <form onSubmit={handleSaveItem} className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border-2 border-[#C6A15B]/50 shadow-xl space-y-5 animate-scaleUp">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#C6A15B]" />
              <span>{isNew ? 'নতুন শিক্ষাগত রেকর্ড যুক্ত করুন' : 'ডিগ্রি ও প্রাতিষ্ঠানিক তথ্য এডিট'}</span>
            </h4>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAITranslate}
                className="text-[11px] font-semibold text-[#C6A15B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>অটো অনুবাদ (Translate)</span>
              </button>
              <button
                type="button"
                onClick={() => { setEditingItem(null); setIsNew(false); }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ডিগ্রি নাম (বাংলা)</label>
              <input
                type="text"
                required
                value={editingItem.degree.bn}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, degree: { ...prev.degree, bn: e.target.value } }) : null)}
                placeholder="যেমন: স্নাতকোত্তর (আরবি ভাষা ও সাহিত্য)"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Degree Name (English)</label>
              <input
                type="text"
                value={editingItem.degree.en}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, degree: { ...prev.degree, en: e.target.value } }) : null)}
                placeholder="Master's in Arabic"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">اسم الدرجة (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={editingItem.degree.ar}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, degree: { ...prev.degree, ar: e.target.value } }) : null)}
                placeholder="ماجستير في اللغة العربية"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">প্রতিষ্ঠান (বাংলা)</label>
              <input
                type="text"
                required
                value={editingItem.institution.bn}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, institution: { ...prev.institution, bn: e.target.value } }) : null)}
                placeholder="ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Institution (English)</label>
              <input
                type="text"
                value={editingItem.institution.en}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, institution: { ...prev.institution, en: e.target.value } }) : null)}
                placeholder="Islamic University, Kushtia"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">المؤسسة (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={editingItem.institution.ar}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, institution: { ...prev.institution, ar: e.target.value } }) : null)}
                placeholder="الجامعة الإسلامية، كوشتيا"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">সাল / শিক্ষাবর্ষ (Period)</label>
              <input
                type="text"
                value={editingItem.period}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, period: e.target.value }) : null)}
                placeholder="২০২২–২০২৬"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <input
                type="checkbox"
                id="current-edu"
                checked={editingItem.current}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, current: e.target.checked }) : null)}
                className="w-4 h-4 text-[#C6A15B] rounded-sm focus:ring-[#C6A15B]"
              />
              <label htmlFor="current-edu" className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                বর্তমান অধ্যয়নরত ডিগ্রি (Currently Studying)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">বিবরণ / কৃতিত্ব (বাংলা)</label>
            <textarea
              rows={2}
              value={editingItem.description?.bn || ''}
              onChange={(e) => setEditingItem(prev => prev ? ({
                ...prev,
                description: { ...prev.description, bn: e.target.value }
              }) : null)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setEditingItem(null); setIsNew(false); }}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      )}

      {/* List of Education Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {educationList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.current 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                    : 'bg-[#C6A15B]/15 text-[#C6A15B]'
                }`}>
                  {item.current ? 'অধ্যয়নরত' : 'সম্পন্ন'}
                </span>
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.period}</span>
                </span>
              </div>

              <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white">
                {item.degree.bn || item.degree.en}
              </h4>
              <p className="text-xs text-[#3E7180] dark:text-[#C6A15B] font-medium mt-0.5">
                {item.institution.bn || item.institution.en}
              </p>
              {item.description?.bn && (
                <p className="text-[11px] text-gray-500 mt-2 line-clamp-2">
                  {item.description.bn}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => { setEditingItem(item); setIsNew(false); }}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#0B1F33] text-gray-700 dark:text-gray-300 hover:bg-[#C6A15B]/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>এডিট</span>
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
