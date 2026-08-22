import React, { useState, useMemo } from 'react';
import { latestNewsTab, popularNewsTab, politicsFeatured, politicsList } from '../data/newsData';
import { ImageWithFallback } from './ImageWithFallback';
import { CategoryHeader } from './CategoryHeader';
import { NewsArticle, SiteSettings } from '../types';

interface SidebarWidgetsProps {
  onSelectArticle: (idOrTitle: string) => void;
  onSelectCategory: (cat: string) => void;
  onFilterByDate: (dateStr: string) => void;
  siteSettings?: SiteSettings;
  articles?: NewsArticle[];
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  onSelectArticle,
  onSelectCategory,
  onFilterByDate,
  siteSettings,
  articles = [],
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const [archiveDate, setArchiveDate] = useState('2026-08-21');

  const fbUrl = siteSettings?.facebookUrl || 'https://www.facebook.com/share/19cpbxC35r/';
  const siteName = siteSettings?.siteName || 'Doyel Television';

  const handleArchiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (archiveDate) {
      onFilterByDate(archiveDate);
    }
  };

  // Derive latest and popular from real dynamic articles if available
  const latestList = useMemo(() => {
    if (articles.length > 0) {
      return [...articles].slice(0, 8);
    }
    return latestNewsTab;
  }, [articles]);

  const popularList = useMemo(() => {
    if (articles.length > 0) {
      return [...articles]
        .sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0))
        .slice(0, 8);
    }
    return popularNewsTab;
  }, [articles]);

  // Politics news
  const politicsArticles = useMemo(() => {
    if (articles.length > 0) {
      const filtered = articles.filter(
        (a) => a.category === 'রাজনীতি' || a.subcategory === 'রাজনীতি'
      );
      return filtered;
    }
    return [politicsFeatured, ...politicsList];
  }, [articles]);

  const polFeatured = politicsArticles[0];
  const polList = politicsArticles.slice(1, 5);

  return (
    <div className="space-y-4">
      {/* 1. Facebook Page Widget */}
      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs">
        <div className="facebook_title">ফেসবুকে আমরা...</div>
        <div className="bg-[#f0f2f5] p-3 rounded border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#1877F2] text-white font-bold text-lg rounded-full flex items-center justify-center">
              <i className="fa fa-facebook"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="font-bold text-sm text-gray-900 leading-tight truncate">{siteName}</h5>
              <p className="text-xs text-gray-500">২.৪ হাজার লাইক • সংবাদ ও মিডিয়া ওয়েবসাইট</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#1877F2] text-white text-xs font-semibold py-1.5 px-3 rounded text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
            >
              <i className="fa fa-thumbs-up"></i> পেজ লাইক করুন
            </a>
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 text-gray-800 text-xs font-semibold py-1.5 px-3 rounded hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <i className="fa fa-share"></i> পেজ দেখুন
            </a>
          </div>
        </div>
      </div>

      {/* 2. Old News Archive Calendar */}
      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs archive_calender_sec">
        <div className="archive_title">পুরাতন খবর</div>
        <form onSubmit={handleArchiveSubmit} className="flex items-center">
          <input
            type="date"
            value={archiveDate}
            onChange={(e) => setArchiveDate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-1.5 text-sm rounded-l focus:outline-none focus:border-[#004F8A]"
            required
          />
          <button
            type="submit"
            className="bg-[#004F8A] hover:bg-[#1F4565] text-white px-4 py-1.5 text-sm font-semibold rounded-r transition-colors shrink-0"
          >
            খুজুন
          </button>
        </form>
      </div>

      {/* 3. Latest News & Popular News Tabs */}
      <div className="bg-white border border-gray-200 rounded shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="grid grid-cols-2 text-center border-b border-gray-200">
          <button
            onClick={() => setActiveTab('latest')}
            className={`py-2.5 px-2 text-sm font-bold transition-all ${
              activeTab === 'latest'
                ? 'bg-[#004F8A] text-white shadow-inner'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fa fa-clock-o mr-1"></i> সর্বশেষ সংবাদ
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`py-2.5 px-2 text-sm font-bold transition-all ${
              activeTab === 'popular'
                ? 'bg-[#004F8A] text-white shadow-inner'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <i className="fa fa-fire mr-1"></i> জনপ্রিয় সংবাদ
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-3 max-h-[295px] overflow-y-auto divide-y divide-gray-100 scrollbar-thin">
          {(activeTab === 'latest' ? latestList : popularList).length > 0 ? (
            (activeTab === 'latest' ? latestList : popularList).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(String(item.id))}
                className="py-2 flex items-start gap-2.5 cursor-pointer group hover:bg-gray-50/80 px-1 rounded transition-colors"
              >
                <div className="w-16 h-12 shrink-0 rounded overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={item.image}
                    fallbackSrc={item.fallbackImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13.5px] font-semibold text-gray-900 group-hover:text-[#9A1515] leading-snug line-clamp-2 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                    <span>{item.date}</span>
                    {item.views && (
                      <span className="text-[#004F8A]">
                        <i className="fa fa-eye mr-0.5"></i> {item.views}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-gray-400">কোনো সংবাদ পাওয়া যায়নি</div>
          )}
        </div>
      </div>

      {/* 4. Politics Category Box (Only if politics news exists) */}
      {polFeatured && (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-xs">
          <CategoryHeader
            title="রাজনীতি"
            icon="fa-newspaper-o"
            onCategoryClick={() => onSelectCategory('রাজনীতি')}
          />

          {/* Featured Politics News */}
          <div
            onClick={() => onSelectArticle(String(polFeatured.id))}
            className="cursor-pointer group mb-3"
          >
            <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
              <ImageWithFallback
                src={polFeatured.image}
                fallbackSrc={polFeatured.fallbackImage}
                alt={polFeatured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h4 className="text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
              {polFeatured.title}
            </h4>
          </div>

          {/* Politics List */}
          {polList.length > 0 && (
            <div className="divide-y divide-gray-100">
              {polList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(String(item.id))}
                  className="py-2 flex items-start gap-2.5 cursor-pointer group"
                >
                  <div className="w-16 h-12 shrink-0 rounded overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={item.image}
                      fallbackSrc={item.fallbackImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-gray-800 group-hover:text-[#9A1515] leading-snug line-clamp-2 transition-colors">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          )}

          {/* More News Button */}
          <div className="mt-3 pt-2 border-t border-gray-100 text-right">
            <button
              onClick={() => onSelectCategory('রাজনীতি')}
              className="more_news"
            >
              <span>আরো খবর..</span>
              <i className="fa fa-angle-double-right text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
