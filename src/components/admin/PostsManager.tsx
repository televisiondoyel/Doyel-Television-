import React, { useState, useMemo } from 'react';
import { NewsArticle, CategoryItem } from '../../types';
import { AdminTab } from './AdminLayout';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface PostsManagerProps {
  articles: NewsArticle[];
  categories: CategoryItem[];
  onNavigate: (tab: AdminTab, articleId?: string) => void;
  onDeleteArticle: (id: string) => Promise<void>;
  onToggleLead: (article: NewsArticle) => Promise<void>;
  onToggleTicker: (article: NewsArticle) => Promise<void>;
}

export const PostsManager: React.FC<PostsManagerProps> = ({
  articles,
  categories,
  onNavigate,
  onDeleteArticle,
  onToggleLead,
  onToggleTicker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null);
  const itemsPerPage = 12;

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchSearch =
        searchTerm === '' ||
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || art.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [articles, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    const id = articleToDelete.id;
    setDeletingId(id);
    try {
      await onDeleteArticle(id);
      setArticleToDelete(null);
    } catch (err) {
      console.error('Error deleting article:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">সকল সংবাদ (All Posts)</h1>
          <button
            onClick={() => onNavigate('new-post')}
            className="bg-white hover:bg-gray-50 text-[#2271b1] border border-[#2271b1] hover:border-[#135e96] text-[13px] font-medium px-3 py-1 rounded transition-colors"
          >
            + নতুন সংবাদ যোগ করুন
          </button>
        </div>
        <span className="text-xs text-gray-500">
          মোট সংবাদ: <strong>{articles.length}</strong> টি
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#c3c4c7] p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">ক্যাটাগরি:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="text-[13px] border border-gray-300 rounded px-2.5 py-1.5 bg-white outline-none focus:border-[#2271b1]"
          >
            <option value="all">সকল ক্যাটাগরি ({articles.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="সংবাদের শিরোনাম বা রিপোর্টারের নাম দিয়ে খুঁজুন..."
            className="w-full text-[13px] border border-gray-300 rounded pl-8 pr-3 py-1.5 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
          />
          <i className="fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* WordPress Classic Posts Table */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-gray-700 font-semibold select-none">
                <th className="py-2.5 px-3 w-16 text-center">ছবি</th>
                <th className="py-2.5 px-3">শিরোনাম (Title)</th>
                <th className="py-2.5 px-3 w-28">ক্যাটাগরি</th>
                <th className="py-2.5 px-3 w-28">রিপোর্টার</th>
                <th className="py-2.5 px-3 w-24 text-center">প্রধান খবর?</th>
                <th className="py-2.5 px-3 w-24 text-center">স্ক্রোলিং?</th>
                <th className="py-2.5 px-3 w-24">তারিখ</th>
                <th className="py-2.5 px-3 w-28 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedArticles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    কোনো সংবাদ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                paginatedArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-blue-50/40 transition-colors group">
                    {/* Thumbnail */}
                    <td className="py-2 px-3 text-center">
                      <img
                        src={art.image}
                        alt=""
                        className="w-12 h-9 object-cover rounded border border-gray-200 mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            art.fallbackImage ||
                            'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200';
                        }}
                      />
                    </td>

                    {/* Title & Quick Actions */}
                    <td className="py-2.5 px-3">
                      <span
                        onClick={() => onNavigate('edit-post', art.id)}
                        className="font-medium text-[#2271b1] hover:text-[#135e96] cursor-pointer hover:underline block leading-snug"
                      >
                        {art.title}
                      </span>
                      {/* WP Row Action Links on Hover */}
                      <div className="flex items-center gap-2.5 text-[11.5px] mt-1 text-gray-500">
                        <button
                          onClick={() => onNavigate('edit-post', art.id)}
                          className="text-[#2271b1] hover:underline"
                        >
                          এডিট
                        </button>
                        <span>|</span>
                        <button
                          onClick={() => setArticleToDelete({ id: art.id, title: art.title })}
                          disabled={deletingId === art.id}
                          className="text-[#d63638] hover:underline cursor-pointer"
                        >
                          {deletingId === art.id ? 'মুছে ফেলা হচ্ছে...' : 'ট্র্যাশ / ডিলিট'}
                        </button>
                        <span>|</span>
                        <span className="text-gray-400">ভিউ: {art.views || 0}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                        {art.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-2.5 px-3 text-gray-600 text-xs truncate max-w-[120px]">
                      {art.author || 'অনলাইন ডেস্ক'}
                    </td>

                    {/* Lead Story Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onToggleLead(art)}
                        className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${
                          art.lead
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="ক্লিক করে প্রধান সংবাদের মর্যাদা পরিবর্তন করুন"
                      >
                        {art.lead ? '★ প্রধান' : 'সাধারণ'}
                      </button>
                    </td>

                    {/* Ticker Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onToggleTicker(art)}
                        className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${
                          art.isTicker
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="ক্লিক করে স্ক্রোলিং শিরোনামে যুক্ত/বাদ দিন"
                      >
                        {art.isTicker ? '⚡ যুক্ত' : 'না'}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">
                      {art.date}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onNavigate('edit-post', art.id)}
                          className="p-1 text-[#2271b1] hover:bg-blue-50 rounded cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button
                          onClick={() => setArticleToDelete({ id: art.id, title: art.title })}
                          className="p-1 text-[#d63638] hover:bg-red-50 rounded cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] px-4 py-2.5 flex items-center justify-between text-xs text-gray-600">
          <div>
            পৃষ্ঠা {currentPage} এর {totalPages} (মোট {filteredArticles.length} টি সংবাদ)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              ‹ পূর্ববর্তী
            </button>
            <span className="px-2 py-1 bg-white border border-gray-300 rounded font-bold text-[#2271b1]">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
            >
              পরবর্তী ›
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!articleToDelete}
        title="সংবাদ মুছে ফেলার নিশ্চয়তা"
        itemName={articleToDelete?.title}
        description="আপনি কি নিশ্চিত যে এই সংবাদটি স্থায়ীভাবে ডাটাবেজ থেকে মুছে ফেলতে চান?"
        isDeleting={!!deletingId}
        onConfirm={confirmDelete}
        onClose={() => setArticleToDelete(null)}
      />
    </div>
  );
};
