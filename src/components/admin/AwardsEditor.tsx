import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { AwardItem } from '../../types';
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AwardsEditor: React.FC = () => {
  const { data, updateData, translateWithAI } = usePortfolio();
  const [awardsList, setAwardsList] = useState<AwardItem[]>(data.awards || []);
  const [editingItem, setEditingItem] = useState<AwardItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    let updatedList: AwardItem[];
    if (isNew) {
      updatedList = [editingItem, ...awardsList];
    } else {
      updatedList = awardsList.map(item => item.id === editingItem.id ? editingItem : item);
    }

    setAwardsList(updatedList);
    await updateData({ awards: updatedList });
    setSaving(false);
    setEditingItem(null);
    setIsNew(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('আপনি কি এই পুরস্কার/সম্মাননা রেকর্ডটি ডিলিট করতে চান?')) return;
    const updated = awardsList.filter(item => item.id !== id);
    setAwardsList(updated);
    await updateData({ awards: updated });
  };

  const handleCreateNew = () => {
    const newItem: AwardItem = {
      id: `award-${Date.now()}`,
      title: { bn: '', en: '', ar: '' },
      position: { bn: '১ম স্থান / চ্যাম্পিয়ন', en: '1st Place / Champion', ar: 'المركز الأول' },
      competition: { bn: '', en: '', ar: '' },
      organizer: { bn: '', en: '', ar: '' },
      organization: { bn: '', en: '', ar: '' },
      year: '২০২৪',
      description: { bn: '', en: '', ar: '' },
      iconType: 'trophy',
      translationStatus: { bn: 'approved', en: 'draft', ar: 'draft' },
    };
    setEditingItem(newItem);
    setIsNew(true);
  };

  const handleAITranslate = async () => {
    if (!editingItem || !editingItem.title.bn) return;
    try {
      const titleRes = await translateWithAI(editingItem.title.bn, 'Competition award title');
      const orgRes = editingItem.organization.bn ? await translateWithAI(editingItem.organization.bn, 'Award organizing committee') : { en: '', ar: '' };
      setEditingItem(prev => prev ? ({
        ...prev,
        title: { ...prev.title, en: titleRes.en, ar: titleRes.ar },
        organization: { ...prev.organization, en: orgRes.en, ar: orgRes.ar }
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
            <Award className="w-5 h-5 text-[#C6A15B]" />
            <span>পুরস্কার ও অর্জনসমূহ (Awards & Honors)</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            জাতীয় আরবি বিতর্ক প্রতিযোগিতা, সম্মাননা ও অন্যান্য স্বীকৃতি এডিট ও যোগ করুন।
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পুরস্কার যোগ করুন</span>
        </button>
      </div>

      {/* Edit Form */}
      {editingItem && (
        <form onSubmit={handleSaveItem} className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border-2 border-[#C6A15B]/50 shadow-xl space-y-5 animate-scaleUp">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#C6A15B]" />
              <span>{isNew ? 'নতুন পুরস্কার যোগ' : 'পুরস্কার তথ্য এডিট'}</span>
            </h4>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAITranslate}
                className="text-[11px] font-semibold text-[#C6A15B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>অটো অনুবাদ</span>
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">পুরস্কারের শিরোনাম (বাংলা)</label>
              <input
                type="text"
                required
                value={editingItem.title.bn}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, title: { ...prev.title, bn: e.target.value } }) : null)}
                placeholder="যেমন: জাতীয় আরবি বিতর্ক প্রতিযোগিতা"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Title (English)</label>
              <input
                type="text"
                value={editingItem.title.en}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, title: { ...prev.title, en: e.target.value } }) : null)}
                placeholder="National Arabic Debate Championship"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">عنوان الجائزة (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={editingItem.title.ar}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, title: { ...prev.title, ar: e.target.value } }) : null)}
                placeholder="البطولة الوطنية للمناظرة باللغة العربية"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">সংগঠক / কর্তৃপক্ষ (বাংলা)</label>
              <input
                type="text"
                required
                value={editingItem.organization.bn}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, organization: { ...prev.organization, bn: e.target.value } }) : null)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Organization (English)</label>
              <input
                type="text"
                value={editingItem.organization.en}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, organization: { ...prev.organization, en: e.target.value } }) : null)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">الجهة المنظمة (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={editingItem.organization.ar}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, organization: { ...prev.organization, ar: e.target.value } }) : null)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">বছর (Year)</label>
              <input
                type="text"
                value={editingItem.year}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, year: e.target.value }) : null)}
                placeholder="২০২৪"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">অবস্থান / পদক (Position / Rank)</label>
              <input
                type="text"
                value={typeof editingItem.position === 'string' ? editingItem.position : (editingItem.position?.bn || '')}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditingItem(prev => prev ? ({
                    ...prev,
                    position: typeof prev.position === 'object' 
                      ? { ...prev.position, bn: val }
                      : { bn: val, en: val, ar: val }
                  }) : null);
                }}
                placeholder="চ্যাম্পিয়ন / রানারআপ"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {awardsList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C6A15B]/15 text-[#C6A15B]">
                  {typeof item.position === 'string' ? item.position : (item.position?.bn || item.position?.en || 'অর্জন')}
                </span>
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.year}</span>
                </span>
              </div>

              <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white">
                {item.title.bn || item.title.en}
              </h4>
              <p className="text-xs text-[#3E7180] dark:text-[#C6A15B] font-medium mt-0.5">
                {item.organization.bn || item.organization.en}
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
