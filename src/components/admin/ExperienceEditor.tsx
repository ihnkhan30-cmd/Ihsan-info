import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ExperienceItem } from '../../types';
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';

export const ExperienceEditor: React.FC = () => {
  const { data, updateData, translateWithAI } = usePortfolio();
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(data.experience || []);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    let updatedList: ExperienceItem[];
    if (isNew) {
      updatedList = [editingItem, ...experienceList];
    } else {
      updatedList = experienceList.map(item => item.id === editingItem.id ? editingItem : item);
    }

    setExperienceList(updatedList);
    await updateData({ experience: updatedList });
    setSaving(false);
    setEditingItem(null);
    setIsNew(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('আপনি কি এই অভিজ্ঞতা রেকর্ডটি ডিলিট করতে চান?')) return;
    const updated = experienceList.filter(item => item.id !== id);
    setExperienceList(updated);
    await updateData({ experience: updated });
  };

  const handleCreateNew = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: { bn: '', en: '', ar: '' },
      organization: { bn: '', en: '', ar: '' },
      period: '২০২৪–বর্তমান',
      location: { bn: 'কুষ্টিয়া, বাংলাদেশ', en: 'Kushtia, Bangladesh', ar: 'كوشتيا، بنغلاديش' },
      type: 'leadership',
      description: { bn: '', en: '', ar: '' },
      translationStatus: { bn: 'approved', en: 'draft', ar: 'draft' },
      order: experienceList.length + 1,
    };
    setEditingItem(newItem);
    setIsNew(true);
  };

  const handleAITranslate = async () => {
    if (!editingItem || !editingItem.role.bn) return;
    try {
      const roleRes = await translateWithAI(editingItem.role.bn, 'Job role or voluntary title');
      const orgRes = editingItem.organization.bn ? await translateWithAI(editingItem.organization.bn, 'Organization name') : { en: '', ar: '' };
      setEditingItem(prev => prev ? ({
        ...prev,
        role: { ...prev.role, en: roleRes.en, ar: roleRes.ar },
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
            <Briefcase className="w-5 h-5 text-[#C6A15B]" />
            <span>অভিজ্ঞতা ও সামাজিক কর্মকাণ্ড (Experience & Activities)</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            সংগঠন, বিতর্ক ক্লাব, রক্তদান, সমাজসেবা ও পেশাগত দায়িত্ব এডিট করুন।
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অভিজ্ঞতা যোগ করুন</span>
        </button>
      </div>

      {/* Edit Form */}
      {editingItem && (
        <form onSubmit={handleSaveItem} className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border-2 border-[#C6A15B]/50 shadow-xl space-y-5 animate-scaleUp">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#C6A15B]" />
              <span>{isNew ? 'নতুন অভিজ্ঞতা যোগ' : 'অভিজ্ঞতা তথ্য এডিট'}</span>
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">পদবি / দায়িত্ব (বাংলা)</label>
              <input
                type="text"
                required
                value={editingItem.role.bn}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, role: { ...prev.role, bn: e.target.value } }) : null)}
                placeholder="যেমন: সাংগঠনিক সম্পাদক"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Role (English)</label>
              <input
                type="text"
                value={editingItem.role.en}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, role: { ...prev.role, en: e.target.value } }) : null)}
                placeholder="Organizational Secretary"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">المنصب (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={editingItem.role.ar}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, role: { ...prev.role, ar: e.target.value } }) : null)}
                placeholder="أمين التنظيم"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">সংগঠন / প্রতিষ্ঠান (বাংলা)</label>
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
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">المنظمة (العربية)</label>
              <input
                type="text"
                dir="rtl"
                value={editingItem.organization.ar}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, organization: { ...prev.organization, ar: e.target.value } }) : null)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">সময়কাল (Period)</label>
              <input
                type="text"
                value={editingItem.period}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, period: e.target.value }) : null)}
                placeholder="২০২২–বর্তমান"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ধরণ (Type)</label>
              <select
                value={editingItem.type}
                onChange={(e) => setEditingItem(prev => prev ? ({ ...prev, type: e.target.value as any }) : null)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="leadership">Leadership & Debate</option>
                <option value="voluntary">Social & Voluntary</option>
                <option value="professional">Professional & Teaching</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">অবস্থান (Location)</label>
              <input
                type="text"
                value={editingItem.location?.bn || ''}
                onChange={(e) => setEditingItem(prev => prev ? ({
                  ...prev,
                  location: { ...prev.location, bn: e.target.value }
                }) : null)}
                placeholder="কুষ্টিয়া, বাংলাদেশ"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">কাজের বিবরণ (বাংলা)</label>
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
        {experienceList.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C6A15B]/15 text-[#C6A15B] uppercase">
                  {item.type}
                </span>
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.period}</span>
                </span>
              </div>

              <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white">
                {item.role.bn || item.role.en}
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
