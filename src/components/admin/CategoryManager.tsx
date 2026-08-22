import React, { useState } from 'react';
import { CategoryItem, NewsArticle } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface CategoryManagerProps {
  categories: CategoryItem[];
  articles: NewsArticle[];
  onSaveCategory: (category: CategoryItem) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  articles,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Generate slug automatically from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\u0980-\u09FF-]+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const itemToSave: CategoryItem = {
        id: editingId || 'cat-' + Date.now(),
        name: name.trim(),
        slug: slug.trim() || name.trim().toLowerCase(),
        order: editingId
          ? categories.find((c) => c.id === editingId)?.order || categories.length + 1
          : categories.length + 1,
        visible: true,
      };

      await onSaveCategory(itemToSave);
      setName('');
      setSlug('');
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">ক্যাটাগরি ও মেনু (Categories)</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            ওয়েবসাইটের প্রধান নেভিগেশন বার এবং সংবাদের বিভাগগুলো নিয়ন্ত্রণ করুন
          </p>
        </div>
      </div>

      {/* WordPress 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Add/Edit Category Form */}
        <div className="lg:col-span-4 bg-white border border-[#c3c4c7] p-4.5 rounded shadow-2xs">
          <h2 className="text-base font-semibold text-[#1d2327] mb-3 border-b pb-2">
            {editingId ? 'ক্যাটাগরি সম্পাদনা করুন' : 'নতুন ক্যাটাগরি যোগ করুন'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs text-gray-700">
            <div>
              <label className="block font-semibold mb-1">ক্যাটাগরির নাম (Name):</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="যেমন: খেলাধুলা, রাজনীতি..."
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                required
              />
              <p className="text-[11px] text-gray-400 mt-0.5">
                সাইটের মেনু ও শিরোনামে এই নামটি দেখা যাবে।
              </p>
            </div>

            <div>
              <label className="block font-semibold mb-1">স্লাগ (Slug / URL):</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="যেমন: sports, politics..."
                className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
              />
              <p className="text-[11px] text-gray-400 mt-0.5">
                ওয়েব ব্রাউজারের লিঙ্কে এই নাম ব্যবহৃত হবে।
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50"
              >
                {saving ? 'সংরক্ষিত হচ্ছে...' : editingId ? 'পরিবর্তন সেভ করুন' : 'নতুন ক্যাটাগরি যুক্ত করুন'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Categories Table */}
        <div className="lg:col-span-8 bg-white border border-[#c3c4c7] rounded shadow-2xs overflow-hidden">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-gray-700 font-semibold">
                <th className="py-2.5 px-3.5">নাম (Name)</th>
                <th className="py-2.5 px-3">স্লাগ (Slug)</th>
                <th className="py-2.5 px-3 text-center">পোস্ট সংখ্যা</th>
                <th className="py-2.5 px-3 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => {
                const count = articles.filter((a) => a.category === cat.name).length;
                return (
                  <tr key={cat.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {count}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-[#2271b1] hover:underline text-xs cursor-pointer"
                        >
                          এডিট
                        </button>
                        <span>|</span>
                        <button
                          onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                          className="text-[#d63638] hover:underline text-xs cursor-pointer"
                        >
                          ডিলিট
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!categoryToDelete}
        title="ক্যাটাগরি মুছে ফেলার নিশ্চয়তা"
        itemName={categoryToDelete?.name}
        description="আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি মুছে ফেলতে চান? এটি মেনু ও সাইটের তালিকা থেকে বাদ পড়বে।"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setCategoryToDelete(null)}
      />
    </div>
  );
};
