import React, { useState, useEffect, useRef } from 'react';
import { NewsArticle, CategoryItem } from '../../types';
import { AdminTab } from './AdminLayout';
import { compressImage } from '../../lib/imageCompressor';

interface PostEditorProps {
  initialArticle?: NewsArticle | null;
  categories: CategoryItem[];
  onSaveArticle: (article: Partial<NewsArticle> & { title: string }) => Promise<string>;
  onNavigate: (tab: AdminTab) => void;
  onAddCategory: (name: string) => Promise<void>;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export const PostEditor: React.FC<PostEditorProps> = ({
  initialArticle,
  categories,
  onSaveArticle,
  onNavigate,
  onAddCategory,
  autoSaveStatus,
}) => {
  const [id, setId] = useState<string>(initialArticle?.id || '');
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [category, setCategory] = useState(initialArticle?.category || 'জাতীয়');
  const [author, setAuthor] = useState(initialArticle?.author || 'অনলাইন ডেস্ক');
  const [image, setImage] = useState(
    initialArticle?.image ||
      'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/456575124-600x337.jpg'
  );
  const [lead, setLead] = useState(Boolean(initialArticle?.lead));
  const [isTicker, setIsTicker] = useState(Boolean(initialArticle?.isTicker));
  const [newCatName, setNewCatName] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [manualSaving, setManualSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Suggested preset images for quick selection
  const presetImages = [
    { label: 'রাজনীতি/জাতীয়', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/456575124-600x337.jpg' },
    { label: 'আন্তর্জাতিক', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/rahul-20171119151811-600x337.jpg' },
    { label: 'খেলাধুলা', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/06859746-527x337.jpg' },
    { label: 'অর্থনীতি', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/faika-20171118215621-600x337.jpg' },
    { label: 'আইন-আদালত', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/0.35246415-600x337.jpg' },
    { label: 'তথ্যপ্রযুক্তি', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/google-20171114112504.jpg' },
    { label: 'শিক্ষা', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/c0716fdd04f91b8311bfd0d41545777f-5813355680bee-600x337.jpg' },
    { label: 'বিনোদন', url: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/helen-20171118142634-600x337.jpg' },
  ];

  // Auto-Save Effect (Debounce 1.5 seconds when typing)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!title.trim()) return;

    setIsDirty(true);
    const timer = setTimeout(async () => {
      try {
        const savedId = await onSaveArticle({
          id: id || undefined,
          title,
          content,
          excerpt: excerpt || content.slice(0, 160),
          category,
          author,
          image,
          lead,
          isTicker,
        });
        if (!id && savedId) {
          setId(savedId);
        }
        setIsDirty(false);
      } catch (err) {
        console.error('Auto save error:', err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, content, excerpt, category, author, image, lead, isTicker]);

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('দয়া করে সংবাদের শিরোনাম লিখুন');
      return;
    }
    setManualSaving(true);
    try {
      const savedId = await onSaveArticle({
        id: id || undefined,
        title,
        content,
        excerpt: excerpt || content.slice(0, 160),
        category,
        author,
        image,
        lead,
        isTicker,
      });
      if (savedId) setId(savedId);
      setIsDirty(false);
      alert('সংবাদটি সফলভাবে প্রকাশ ও সংরক্ষণ করা হয়েছে!');
    } finally {
      setManualSaving(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCatName.trim()) return;
    await onAddCategory(newCatName.trim());
    setCategory(newCatName.trim());
    setNewCatName('');
    setShowNewCatInput(false);
  };

  // Image Upload handler for local file with auto compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 600, 0.75);
        setImage(compressed);
      } catch (err) {
        console.error('Error compressing image:', err);
      }
    }
  };

  return (
    <form onSubmit={handleManualSave} className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('posts')}
            className="text-[#2271b1] hover:underline text-sm flex items-center gap-1"
          >
            ← সকল সংবাদ
          </button>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            {initialArticle ? 'সংবাদ সম্পাদনা (Edit Post)' : 'নতুন সংবাদ যোগ করুন (Add New Post)'}
          </h1>
        </div>

        {/* Auto-Save & Publish Actions */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            {autoSaveStatus === 'saving' || isDirty ? (
              <span className="text-yellow-600 flex items-center gap-1 font-medium">
                <i className="fa fa-circle-o-notch fa-spin"></i> অটো-সেভ হচ্ছে...
              </span>
            ) : (
              <span className="text-green-600 flex items-center gap-1 font-medium">
                <i className="fa fa-check-circle"></i> ক্লাউডে সংরক্ষিত
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={manualSaving}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-[13.5px] font-semibold px-5 py-1.5 rounded shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i className="fa fa-upload"></i>
            <span>{manualSaving ? 'প্রকাশ হচ্ছে...' : initialArticle ? 'আপডেট করুন' : 'প্রকাশ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor (70%) + Right Sidebar (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Title + Content + Excerpt */}
        <div className="lg:col-span-8 space-y-4">
          {/* Post Title Input */}
          <div className="bg-white border border-[#c3c4c7] p-3 rounded shadow-2xs">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="এখানে সংবাদের পূর্ণাঙ্গ শিরোনাম লিখুন..."
              className="w-full text-xl sm:text-2xl font-bold text-gray-900 border-none outline-none placeholder:text-gray-400"
              required
            />
          </div>

          {/* WordPress Classic Editor Style Toolbar & Textarea */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs overflow-hidden">
            {/* Formatting Toolbar */}
            <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] p-2 flex flex-wrap items-center gap-1 text-gray-700 select-none">
              <button
                type="button"
                onClick={() => setContent((c) => c + '\n\n**গুরুত্বপূর্ণ তথ্য** ')}
                className="p-1.5 hover:bg-gray-200 rounded text-xs font-bold"
                title="বোল্ড"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => setContent((c) => c + '\n\n*উদ্ধৃতি* ')}
                className="p-1.5 hover:bg-gray-200 rounded text-xs italic"
                title="ইটালিক"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => setContent((c) => c + '\n\n## নতুন উপ-শিরোনাম\n')}
                className="p-1.5 hover:bg-gray-200 rounded text-xs font-semibold"
                title="শিরোনাম ২"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => setContent((c) => c + '\n\n### ছোট শিরোনাম\n')}
                className="p-1.5 hover:bg-gray-200 rounded text-xs font-semibold"
                title="শিরোনাম ৩"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => setContent((c) => c + '\n\n- পয়েন্ট ১\n- পয়েন্ট ২\n')}
                className="p-1.5 hover:bg-gray-200 rounded text-xs"
                title="বুলেট লিস্ট"
              >
                <i className="fa fa-list-ul"></i>
              </button>
              <button
                type="button"
                onClick={() => setContent((c) => c + '\n\n> "উদ্ধৃত বক্তব্য..."\n')}
                className="p-1.5 hover:bg-gray-200 rounded text-xs"
                title="কোট বা উক্তি"
              >
                <i className="fa fa-quote-left"></i>
              </button>
              <span className="h-4 w-px bg-gray-300 mx-1"></span>
              <span className="text-[11px] text-gray-500">
                শব্দ সংখ্যা: {content.trim() ? content.trim().split(/\s+/).length : 0}
              </span>
            </div>

            {/* Content Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="খবরের মূল বিস্তারিত বিবরণ, অনুচ্ছেদ এবং সাক্ষাৎকার এখানে লিখুন..."
              rows={14}
              className="w-full p-4 text-[15px] leading-relaxed text-gray-800 border-none outline-none resize-y"
            ></textarea>
          </div>

          {/* Excerpt Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              খবরের সংক্ষিপ্ত সারাংশ (Excerpt)
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              হোমপেজের কার্ড ও সোশ্যাল শেয়ারিংয়ে এই সংক্ষিপ্ত অংশটি প্রদর্শিত হবে।
            </p>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="সংবাদের আকর্ষণীয় এক বা দুই লাইনের সারসংক্ষেপ..."
              rows={2}
              className="w-full p-2.5 text-xs border border-gray-300 rounded outline-none focus:border-[#2271b1]"
            ></textarea>
          </div>
        </div>

        {/* Right Column: Publish Box + Categories + Featured Image + Attributes */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Publish Status Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] bg-[#f6f7f7] font-semibold text-[13px] text-gray-800 flex items-center justify-between">
              <span>প্রকাশনা সেটিংস (Publish)</span>
              <i className="fa fa-paper-plane text-blue-600"></i>
            </div>
            <div className="p-4 space-y-3 text-xs text-gray-700">
              <div className="flex items-center justify-between">
                <span>স্ট্যাটাস:</span>
                <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  প্রকাশিত (Published)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>দৃশ্যমানতা:</span>
                <span className="font-semibold text-gray-800">পাবলিক (সবার জন্য)</span>
              </div>
              <div>
                <label className="block font-semibold mb-1">প্রতিবেদক / লেখকের নাম:</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="যেমন: নিজস্ব প্রতিবেদক"
                  className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lead}
                    onChange={(e) => setLead(e.target.checked)}
                    className="rounded text-[#2271b1] focus:ring-[#2271b1] h-4 w-4"
                  />
                  <span className="font-medium text-gray-800">
                    ★ প্রচ্ছদের প্রধান খবর (Lead Story) হিসেবে দেখান
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isTicker}
                    onChange={(e) => setIsTicker(e.target.checked)}
                    className="rounded text-[#2271b1] focus:ring-[#2271b1] h-4 w-4"
                  />
                  <span className="font-medium text-gray-800">
                    ⚡ স্ক্রোলিং শিরোনামে (Breaking Ticker) অন্তর্ভুক্ত করুন
                  </span>
                </label>
              </div>
            </div>
            <div className="px-4 py-2.5 bg-[#f6f7f7] border-t border-[#c3c4c7] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('posts')}
                className="text-xs text-[#d63638] hover:underline"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                disabled={manualSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
              >
                {initialArticle ? 'আপডেট করুন' : 'প্রকাশ করুন'}
              </button>
            </div>
          </div>

          {/* 2. Category Selector Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] bg-[#f6f7f7] font-semibold text-[13px] text-gray-800 flex items-center justify-between">
              <span>ক্যাটাগরি (Categories)</span>
              <i className="fa fa-folder-open text-[#2271b1]"></i>
            </div>
            <div className="p-4 space-y-2">
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="radio"
                      name="postCategory"
                      value={cat.name}
                      checked={category === cat.name}
                      onChange={(e) => setCategory(e.target.value)}
                      className="text-[#2271b1] focus:ring-[#2271b1]"
                    />
                    <span className={category === cat.name ? 'font-bold text-[#2271b1]' : 'text-gray-700'}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>

              {/* Add New Category Quick Toggle */}
              <div className="pt-2 border-t border-gray-100">
                {!showNewCatInput ? (
                  <button
                    type="button"
                    onClick={() => setShowNewCatInput(true)}
                    className="text-xs text-[#2271b1] hover:underline flex items-center gap-1"
                  >
                    + নতুন ক্যাটাগরি যোগ করুন
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="নতুন ক্যাটাগরির নাম..."
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#2271b1]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="bg-[#2271b1] text-white text-xs px-2.5 py-1 rounded font-medium"
                      >
                        যোগ করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewCatInput(false)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Featured Image Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] bg-[#f6f7f7] font-semibold text-[13px] text-gray-800 flex items-center justify-between">
              <span>ফিচার্ড ছবি (Featured Image)</span>
              <i className="fa fa-image text-gray-600"></i>
            </div>
            <div className="p-4 space-y-3">
              {/* Image Preview */}
              <div className="relative aspect-video rounded overflow-hidden bg-gray-100 border border-gray-300">
                <img
                  src={image}
                  alt="Featured Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400';
                  }}
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ছবির অনলাইন লিঙ্ক (URL):
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Upload Local Image */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ডিভাইস থেকে ছবি আপলোড করুন:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2271b1] hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* Preset Quick Images */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  বা নমুনা ছবি থেকে নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {presetImages.map((p, idx) => (
                    <img
                      key={idx}
                      src={p.url}
                      alt={p.label}
                      title={p.label}
                      onClick={() => setImage(p.url)}
                      className={`h-10 w-full object-cover rounded cursor-pointer border transition-all ${
                        image === p.url ? 'border-2 border-[#2271b1] ring-1 ring-[#2271b1]' : 'border-gray-200 hover:opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
