import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { FirebaseUploadedFile } from '../../types';
import { 
  UploadCloud, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  UserCheck, 
  FileText, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  HardDrive, 
  Loader2, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  File,
  Plus
} from 'lucide-react';

export const FileManager: React.FC = () => {
  const { 
    data, 
    updateData, 
    uploadedFiles, 
    uploadFile, 
    deleteUploadedFile,
    firebaseConnected 
  } = usePortfolio();

  const [category, setCategory] = useState<'avatar' | 'media' | 'document' | 'general'>('general');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FirebaseUploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileDropOrSelect = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      await uploadFile(file, category, description.trim() || file.name);
      setDescription('');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to upload file to Firebase:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetAsAvatar = async (file: FirebaseUploadedFile) => {
    try {
      await updateData({
        profile: {
          ...data.profile,
          avatarUrl: file.dataUrl,
        },
      });
      setActionSuccessMsg(`"${file.name}" সফলভাবে প্রোফাইল ছবি হিসেবে নির্ধারিত হয়েছে!`);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Error setting avatar:', err);
    }
  };

  const handleAddToGallery = async (file: FirebaseUploadedFile) => {
    try {
      const newMediaItem = {
        id: `med-${Date.now()}`,
        url: file.dataUrl,
        name: file.name,
        type: 'photo' as const,
        mediaCategory: 'photo' as const,
        title: {
          bn: file.description || file.name,
          en: file.description || file.name,
          ar: file.description || file.name,
        },
        altText: {
          bn: file.name,
          en: file.name,
          ar: file.name,
        },
        caption: {
          bn: file.description || 'Firebase থেকে আপলোডকৃত ফটো',
          en: file.description || 'Photo uploaded from Firebase Storage',
          ar: file.description || 'صورة مرفوعة من فايربيس',
        },
        source: 'Firebase Storage',
        uploadedAt: new Date().toISOString().split('T')[0],
      };

      await updateData({
        media: [newMediaItem, ...(data.media || [])],
      });

      setActionSuccessMsg(`"${file.name}" মিডিয়া গ্যালারিতে যোগ করা হয়েছে!`);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Error adding to gallery:', err);
    }
  };

  const handleCopyDataUrl = (file: FirebaseUploadedFile) => {
    navigator.clipboard.writeText(file.dataUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (file: FirebaseUploadedFile) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${file.name}" ফাইলটি ফায়ারবেস থেকে মুছে ফেলতে চান?`)) {
      await deleteUploadedFile(file.id);
    }
  };

  const filteredFiles = (uploadedFiles || []).filter((file) => {
    const matchesSearch = 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Firebase Status */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0B1F33] to-[#142B3D] text-white border border-[#C6A15B]/30 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/20 border border-[#C6A15B]/40 flex items-center justify-center text-[#C6A15B] shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  ফায়ারবেস ফাইল ও মিডিয়া স্টোরেজ (Firebase Storage)
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{firebaseConnected ? 'Firebase Connected' : 'Firestore Ready'}</span>
                </span>
              </div>
              <p className="text-xs text-[#E9E2D2]/80 mt-1">
                আপনার আপলোডকৃত সমস্ত ছবি, সিভি, ডকুমেন্ট ও মিডিয়ার ফাইল তথ্য সরাসরি ফায়ারবেস ক্লাউড ডেটাবেজে স্থায়ীভাবে সংরক্ষিত থাকে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 shrink-0">
            <div>
              <div className="text-[10px] text-[#C6A15B] font-bold uppercase">মোট ফাইল</div>
              <div className="text-lg font-black text-white">{uploadedFiles?.length || 0}</div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <div className="text-[10px] text-[#C6A15B] font-bold uppercase">ক্লাউড স্থিতি</div>
              <div className="text-xs font-bold text-emerald-400">স্থায়ী ও সক্রিয়</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Success Notification */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-[#0B1F33] dark:text-white flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-[#C6A15B]" />
          <span>নতুন ফাইল আপলোড করুন (Upload Directly to Firebase)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ফাইলের ক্যাটাগরি (Category)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            >
              <option value="avatar">প্রোফাইল ছবি (Avatar)</option>
              <option value="media">গ্যালারি মিডিয়া / ফটো (Media Photo)</option>
              <option value="document">সিভি / সার্টিফিকেট / ডকুমেন্ট (Document/PDF)</option>
              <option value="general">সাধারণ ফাইল (General Asset)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              বর্ণনা বা ক্যাপশন (Description / Alt text)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ফাইলের বিবরণ (যেমন: সনদপত্র, অনুষ্ঠান ছবি ইত্যাদি)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0B1F33] border border-gray-200 dark:border-gray-700 text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
            />
          </div>
        </div>

        {/* Dropzone */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileDropOrSelect(file);
          }}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileDropOrSelect(file);
          }}
          className="border-2 border-dashed border-[#C6A15B]/50 hover:border-[#C6A15B] rounded-2xl p-8 text-center cursor-pointer bg-[#F8F6F0]/60 dark:bg-[#0B1F33]/40 hover:bg-[#F8F6F0] dark:hover:bg-[#0B1F33] transition-all group"
        >
          {isUploading ? (
            <div className="py-4 space-y-3">
              <Loader2 className="w-8 h-8 mx-auto text-[#C6A15B] animate-spin" />
              <p className="text-xs font-bold text-[#0B1F33] dark:text-white">
                ফায়ারবেস ক্লাউডে ফাইলটি নিরাপদে সংরক্ষণ করা হচ্ছে...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#C6A15B]/15 flex items-center justify-center text-[#C6A15B] group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#0B1F33] dark:text-white">
                ফাইল নির্বাচন করতে ক্লিক করুন অথবা এখানে ড্র্যাগ অ্যান্ড ড্রপ করুন
              </p>
              <p className="text-xs text-gray-500">
                ছবি (PNG, JPG, WEBP), পিডিএফ (PDF) ও অন্যান্য ফরম্যাট সমর্থিত।
              </p>
            </div>
          )}
        </div>

        {uploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>ফাইলটি সফলভাবে ফায়ারবেসে আপলোড ও সংরক্ষিত হয়েছে!</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ফাইল খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] text-xs text-[#0B1F33] dark:text-white focus:outline-none focus:border-[#C6A15B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'সকল ফাইল' },
            { id: 'avatar', label: 'প্রোফাইল ছবি' },
            { id: 'media', label: 'মিডিয়া গ্যালারি' },
            { id: 'document', label: 'ডকুমেন্টস' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-[#0B1F33] text-white dark:bg-[#C6A15B] dark:text-[#0B1F33]'
                  : 'bg-white dark:bg-[#142B3D] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* File Grid */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#142B3D] border border-dashed border-[#E9E2D2] dark:border-[#0B1F33] space-y-3">
          <HardDrive className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-semibold text-gray-500">
            {uploadedFiles.length === 0 
              ? 'ফায়ারবেসে এখনও কোনো ফাইল আপলোড করা হয়নি।' 
              : 'অনুসন্ধানের সাথে কোনো ফাইল মিল পাওয়া যায়নি।'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => {
            const isImage = file.type?.startsWith('image/') || file.dataUrl?.startsWith('data:image/');
            return (
              <div
                key={file.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#142B3D] border border-[#E9E2D2] dark:border-[#0B1F33] shadow-xs flex flex-col justify-between space-y-3 hover:border-[#C6A15B] transition-all"
              >
                {/* File Thumbnail or Icon */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-[#0B1F33] aspect-video flex items-center justify-center border border-gray-100 dark:border-gray-800">
                  {isImage ? (
                    <img
                      src={file.dataUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-gray-400">
                      <FileText className="w-10 h-10 text-[#C6A15B]" />
                      <span className="text-[10px] uppercase font-bold">{file.type?.split('/')[1] || 'DOC'}</span>
                    </div>
                  )}

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0B1F33]/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {file.category}
                  </span>

                  <button
                    onClick={() => setPreviewFile(file)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 dark:bg-[#0B1F33]/90 text-[#0B1F33] dark:text-white hover:text-[#C6A15B] shadow-xs cursor-pointer"
                    title="বড় করে দেখুন"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* File Info */}
                <div>
                  <h5 className="text-xs font-bold text-[#0B1F33] dark:text-white truncate" title={file.name}>
                    {file.name}
                  </h5>
                  {file.description && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {file.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{file.uploadedAt?.split('T')[0]}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-1.5">
                  {isImage && (
                    <>
                      <button
                        onClick={() => handleSetAsAvatar(file)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 text-[#0B1F33] dark:text-[#C6A15B] text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="প্রোফাইল ছবি করুন"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>অবতার করুন</span>
                      </button>

                      <button
                        onClick={() => handleAddToGallery(file)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0B1F33]/10 dark:bg-white/10 hover:bg-[#0B1F33]/20 text-[#0B1F33] dark:text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="গ্যালারিতে যোগ করুন"
                      >
                        <Plus className="w-3 h-3" />
                        <span>গ্যালারি</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleCopyDataUrl(file)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-[#0B1F33] cursor-pointer ml-auto"
                    title="ইউআরএল কপি করুন"
                  >
                    {copiedId === file.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(file)}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-500 hover:bg-rose-100 cursor-pointer"
                    title="ফায়ারবেস থেকে মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#142B3D] rounded-2xl max-w-xl w-full p-5 space-y-4 border border-[#C6A15B]/30 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold text-[#0B1F33] dark:text-white truncate">
                {previewFile.name}
              </h4>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto flex items-center justify-center rounded-xl bg-gray-50 dark:bg-[#0B1F33] p-2">
              {previewFile.type?.startsWith('image/') || previewFile.dataUrl?.startsWith('data:image/') ? (
                <img
                  src={previewFile.dataUrl}
                  alt={previewFile.name}
                  className="max-h-[55vh] object-contain rounded-lg"
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <FileText className="w-16 h-16 mx-auto text-[#C6A15B]" />
                  <p className="text-xs font-bold text-[#0B1F33] dark:text-white">{previewFile.name}</p>
                  <p className="text-[11px] text-gray-400">{previewFile.type}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a
                href={previewFile.dataUrl}
                download={previewFile.name}
                className="px-4 py-2 rounded-xl bg-[#0B1F33] dark:bg-[#C6A15B] text-white dark:text-[#0B1F33] text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                ফাইলটি ডাউনলোড করুন
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
