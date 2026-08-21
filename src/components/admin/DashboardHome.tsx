import React, { useState } from 'react';
import { NewsArticle, SiteSettings } from '../../types';
import { AdminTab } from './AdminLayout';

interface DashboardHomeProps {
  articles: NewsArticle[];
  categoriesCount: number;
  photosCount: number;
  videosCount: number;
  tickerCount: number;
  siteSettings: SiteSettings;
  onNavigate: (tab: AdminTab, articleId?: string) => void;
  onQuickPost: (title: string, content: string) => Promise<void>;
  autoSaveStatus: string;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  articles,
  categoriesCount,
  photosCount,
  videosCount,
  tickerCount,
  siteSettings,
  onNavigate,
  onQuickPost,
  autoSaveStatus,
}) => {
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickSaving, setQuickSaving] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setQuickSaving(true);
    try {
      await onQuickPost(quickTitle, quickContent);
      setQuickTitle('');
      setQuickContent('');
      setQuickSuccess(true);
      setTimeout(() => setQuickSuccess(false), 3000);
    } finally {
      setQuickSaving(false);
    }
  };

  const totalViews = articles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const recentArticles = [...articles].slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">ড্যাশবোর্ড (Dashboard)</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            {siteSettings.siteTitle} এর সার্বিক নিয়ন্ত্রণ ও লাইভ ক্লাউড ফায়ারস্টোর ডাটাবেজ পর্যবেক্ষণ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('new-post')}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-[13px] font-medium px-4 py-2 rounded shadow-xs transition-colors flex items-center gap-1.5"
          >
            <i className="fa fa-plus text-[11px]"></i> নতুন সংবাদ প্রকাশ করুন
          </button>
        </div>
      </div>

      {/* WordPress "Welcome to WordPress" style Hero Panel */}
      <div className="bg-white border border-[#c3c4c7] p-6 shadow-2xs rounded relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-medium text-[#1d2327] mb-2">
              দোয়েল টেলিভিশন অ্যাডমিন প্যানেলে স্বাগতম!
            </h2>
            <p className="text-[14px] text-[#50575e] leading-relaxed">
              এখানে যেকোনো পরিবর্তন রিয়েল-টাইম ফায়ারবেস ক্লাউড ডাটাবেজে তাৎক্ষণিক স্বয়ংক্রিয়ভাবে সংরক্ষিত (Auto-saved) হয়। আপনি সংবাদ যোগ, এডিট, ব্রেকিং স্ক্রোলিং শিরোনাম, ফটো গ্যালারি, ভিডিও ও পোর্টাল সেটিংস নিয়ন্ত্রণ করতে পারেন।
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('profile')}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-[13px] font-medium px-3.5 py-2 rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa fa-user-circle text-white"></i> প্রোফাইল সম্পাদন
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2271b1] border border-[#2271b1] text-[13px] font-medium px-3.5 py-2 rounded transition-colors cursor-pointer"
            >
              <i className="fa fa-sliders mr-1.5"></i> পোর্টাল সেটিংস
            </button>
            <button
              onClick={() => onNavigate('ticker')}
              className="bg-[#f6f7f7] hover:bg-[#f0f0f1] text-[#2271b1] border border-[#2271b1] text-[13px] font-medium px-3.5 py-2 rounded transition-colors cursor-pointer"
            >
              <i className="fa fa-bolt mr-1.5 text-yellow-600"></i> শিরোনাম এডিট
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - At a Glance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Posts */}
        <div 
          onClick={() => onNavigate('posts')}
          className="bg-white border border-[#c3c4c7] p-4.5 rounded shadow-2xs hover:border-[#2271b1] cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">মোট সংবাদ / পোস্ট</p>
            <h3 className="text-3xl font-bold text-[#1d2327] mt-1">{articles.length} টি</h3>
            <span className="text-xs text-[#2271b1] mt-1 inline-block hover:underline">সকল সংবাদ দেখুন →</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#2271b1] rounded-full flex items-center justify-center text-xl">
            <i className="fa fa-newspaper-o"></i>
          </div>
        </div>

        {/* Categories */}
        <div 
          onClick={() => onNavigate('categories')}
          className="bg-white border border-[#c3c4c7] p-4.5 rounded shadow-2xs hover:border-[#2271b1] cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">ক্যাটাগরি</p>
            <h3 className="text-3xl font-bold text-[#1d2327] mt-1">{categoriesCount} টি</h3>
            <span className="text-xs text-[#2271b1] mt-1 inline-block hover:underline">ক্যাটাগরি ম্যানেজ করুন →</span>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
            <i className="fa fa-folder-open-o"></i>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white border border-[#c3c4c7] p-4.5 rounded shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">মোট পাঠক ভিউ</p>
            <h3 className="text-3xl font-bold text-[#1d2327] mt-1">{totalViews.toLocaleString('bn-BD')} বার</h3>
            <span className="text-xs text-gray-500 mt-1 inline-block">লাইভ রিডার এনগেজমেন্ট</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl">
            <i className="fa fa-eye"></i>
          </div>
        </div>

        {/* Media & Ticker */}
        <div 
          onClick={() => onNavigate('ticker')}
          className="bg-white border border-[#c3c4c7] p-4.5 rounded shadow-2xs hover:border-[#2271b1] cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">স্ক্রোলিং শিরোনাম</p>
            <h3 className="text-3xl font-bold text-[#1d2327] mt-1">{tickerCount} টি</h3>
            <span className="text-xs text-[#2271b1] mt-1 inline-block hover:underline">শিরোনাম পরিবর্তন করুন →</span>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl">
            <i className="fa fa-bolt"></i>
          </div>
        </div>
      </div>

      {/* Two Columns Grid: Quick Draft + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Quick Draft Widget (WordPress Quick Draft) */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs flex flex-col">
          <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7] flex items-center justify-between">
            <h3 className="font-semibold text-[14px] text-[#1d2327] flex items-center gap-2">
              <i className="fa fa-pencil text-[#2271b1]"></i> দ্রুত খসড়া প্রকাশ (Quick Draft)
            </h3>
            <span className="text-xs text-gray-500">তাত্ক্ষণিক ডেটাবেজে সেভ হবে</span>
          </div>

          <form onSubmit={handleQuickSubmit} className="p-4 space-y-3.5 flex-1 flex flex-col">
            {quickSuccess && (
              <div className="bg-green-50 border border-green-300 text-green-800 text-xs px-3 py-2 rounded flex items-center gap-2">
                <i className="fa fa-check-circle text-green-600"></i> খবরটি সফলভাবে ক্লাউড ডেটাবেজে প্রকাশিত হয়েছে!
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">সংবাদের শিরোনাম</label>
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="এখানে সংবাদের আকর্ষণীয় শিরোনাম লিখুন..."
                className="w-full text-[13.5px] border border-gray-300 rounded px-3 py-2 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">সংবাদের মূল বিষয়বস্তু</label>
              <textarea
                value={quickContent}
                onChange={(e) => setQuickContent(e.target.value)}
                placeholder="খবরের বিস্তারিত বিবরণ লিখুন..."
                rows={4}
                className="w-full text-[13.5px] border border-gray-300 rounded px-3 py-2 focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => onNavigate('new-post')}
                className="text-xs text-[#2271b1] hover:underline"
              >
                পূর্ণাঙ্গ পোস্ট এডিটরে যান →
              </button>
              <button
                type="submit"
                disabled={quickSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-[13px] font-medium px-4 py-1.5 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {quickSaving ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i> সেভ হচ্ছে...
                  </>
                ) : (
                  <>
                    <i className="fa fa-save"></i> খসড়া সেভ করুন
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Recent Articles Activity */}
        <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs flex flex-col">
          <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7] flex items-center justify-between">
            <h3 className="font-semibold text-[14px] text-[#1d2327] flex items-center gap-2">
              <i className="fa fa-clock-o text-[#2271b1]"></i> সাম্প্রতিক খবর ও অ্যাক্টিভিটি
            </h3>
            <button
              onClick={() => onNavigate('posts')}
              className="text-xs text-[#2271b1] hover:underline"
            >
              সকল সংবাদ ({articles.length})
            </button>
          </div>

          <div className="divide-y divide-gray-100 p-2 overflow-y-auto max-h-[320px]">
            {recentArticles.map((art) => (
              <div key={art.id} className="p-2.5 hover:bg-gray-50 rounded flex items-center justify-between gap-3 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                      {art.category}
                    </span>
                    {art.lead && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded">
                        প্রধান খবর
                      </span>
                    )}
                    <span className="text-[11px] text-gray-500">{art.date}</span>
                  </div>
                  <h4 className="text-[13.5px] font-medium text-gray-900 truncate group-hover:text-[#2271b1] transition-colors">
                    {art.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate('edit-post', art.id)}
                    className="p-1.5 text-gray-500 hover:text-[#2271b1] hover:bg-blue-50 rounded text-xs transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Badges Bar */}
      <div className="bg-white border border-[#c3c4c7] p-4 rounded shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-6">
          <span>
            <strong>ফটো গ্যালারি:</strong> {photosCount} টি ছবি
          </span>
          <span>
            <strong>ভিডিও গ্যালারি:</strong> {videosCount} টি ভিডিও
          </span>
          <span>
            <strong>ডাটাবেজ:</strong> Google Cloud Firestore (Live Realtime)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-green-700 font-semibold">লাইভ অটো-সেভ সক্রিয়</span>
        </div>
      </div>
    </div>
  );
};
