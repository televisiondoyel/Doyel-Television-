import React, { useState, useMemo } from 'react';
import { NewsArticle, SiteSettings } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { AdBanner } from './AdBanner';

interface CategoryArchivePageProps {
  category: string;
  articles: NewsArticle[];
  allArticles?: NewsArticle[];
  onSelectArticle: (idOrTitle: string | number) => void;
  onClose: () => void;
  onSelectCategory?: (cat: string) => void;
  siteSettings?: SiteSettings;
}

export const CategoryArchivePage: React.FC<CategoryArchivePageProps> = ({
  category,
  articles,
  allArticles = [],
  onSelectArticle,
  onClose,
  onSelectCategory,
  siteSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const divisionList = [
    'ঢাকা বিভাগ',
    'চট্রগ্রাম বিভাগ',
    'খুলনা বিভাগ',
    'রাজশাহী বিভাগ',
    'বরিশাল বিভাগ',
    'সিলেট বিভাগ',
    'রংপুর বিভাগ',
    'ময়মনসিংহ বিভাগ',
  ];

  const isDivisionContext =
    category === 'সারাদেশে' ||
    category === 'সারাদেশ' ||
    divisionList.includes(category) ||
    category.includes('বিভাগ');

  // Sidebar tab news derived dynamically
  const latestTabArticles = useMemo(() => {
    const pool = allArticles.length > 0 ? allArticles : articles;
    return [...pool].slice(0, 10);
  }, [allArticles, articles]);

  const popularTabArticles = useMemo(() => {
    const pool = allArticles.length > 0 ? allArticles : articles;
    return [...pool].reverse().slice(0, 10);
  }, [allArticles, articles]);

  // Pagination for category articles
  const totalPages = Math.ceil(articles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return articles.slice(start, start + itemsPerPage);
  }, [articles, currentPage]);

  const leadItem = paginatedArticles[0];
  const sideItem1 = paginatedArticles[1];
  const sideItem2 = paginatedArticles[2];
  const gridItems = paginatedArticles.slice(3, 6);
  const listItems = paginatedArticles.slice(6);

  return (
    <section className="archive-page-section my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8">
          {/* Category Info Header / Breadcrumb */}
          <div className="category_info flex items-center gap-2 bg-gray-100 px-3 py-2 border-b-2 border-[#9A1515] text-sm font-semibold mb-4 rounded-t">
            <button
              onClick={onClose}
              className="text-[#004f8a] hover:text-[#c90000] cursor-pointer flex items-center"
              title="প্রচ্ছদ"
            >
              <i className="fa fa-home text-base" aria-hidden="true"></i>
            </button>
            <i className="fa fa-chevron-right text-xs text-gray-400"></i>
            <span className="text-gray-800 font-bold">{category}</span>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-12 text-center text-gray-500 shadow-xs">
              <i className="fa fa-newspaper-o text-5xl text-gray-300 mb-3 block"></i>
              <p className="text-lg font-bold text-gray-700">এই বিভাগে কোনো সংবাদ পাওয়া যায়নি</p>
              <p className="text-xs text-gray-400 mt-1">অন্য কোনো বিভাগ নির্বাচন করুন অথবা প্রচ্ছদে ফিরে যান।</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#9A1515] text-white text-xs font-semibold rounded hover:bg-[#7d1111] transition-colors cursor-pointer"
              >
                প্রচ্ছদে ফিরে যান
              </button>
            </div>
          ) : (
            <>
              {/* Row 1: 1 Big Featured Article (Left 8 cols) + Stacked Items (Right 4 cols) */}
              <div className="archive_page grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-gray-200">
                {/* Left Big Post (8 cols) */}
                {leadItem && (
                  <div
                    className={sideItem1 ? "md:col-span-8 cursor-pointer group" : "md:col-span-12 cursor-pointer group"}
                    onClick={() => onSelectArticle(leadItem.id)}
                  >
                    <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-2">
                      <ImageWithFallback
                        src={leadItem.image}
                        fallbackSrc={leadItem.fallbackImage}
                        alt={leadItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="archive_title01 text-xl font-bold group-hover:text-[#c90000] transition-colors mb-2">
                      {leadItem.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {leadItem.excerpt || leadItem.content?.slice(0, 200)}
                      <span className="inline-block ml-1 font-bold text-[#004f8a] group-hover:text-[#c90000]">
                        বিস্তারিত...
                      </span>
                    </p>
                  </div>
                )}

                {/* Right Stacked 2 Posts (4 cols) */}
                {(sideItem1 || sideItem2) && (
                  <div className="md:col-span-4 space-y-4">
                    {sideItem1 && (
                      <div className="cursor-pointer group" onClick={() => onSelectArticle(sideItem1.id)}>
                        <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-1.5">
                          <ImageWithFallback
                            src={sideItem1.image}
                            fallbackSrc={sideItem1.fallbackImage}
                            alt={sideItem1.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h3 className="archive_title02 text-sm font-semibold group-hover:text-[#c90000] transition-colors leading-snug line-clamp-2">
                          {sideItem1.title}
                        </h3>
                      </div>
                    )}

                    {sideItem2 && (
                      <div className="cursor-pointer group pt-2 border-t border-gray-100" onClick={() => onSelectArticle(sideItem2.id)}>
                        <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-1.5">
                          <ImageWithFallback
                            src={sideItem2.image}
                            fallbackSrc={sideItem2.fallbackImage}
                            alt={sideItem2.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h3 className="archive_title02 text-sm font-semibold group-hover:text-[#c90000] transition-colors leading-snug line-clamp-2">
                          {sideItem2.title}
                        </h3>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Row 2: 3-column Grid */}
              {gridItems.length > 0 && (
                <div className="archive_page grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 pb-4 border-b border-gray-200">
                  {gridItems.map((item) => (
                    <div key={item.id} className="cursor-pointer group" onClick={() => onSelectArticle(item.id)}>
                      <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-2">
                        <ImageWithFallback
                          src={item.image}
                          fallbackSrc={item.fallbackImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="archive_title02 text-sm font-semibold group-hover:text-[#c90000] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  ))}
                </div>
              )}

              {/* Row 3: List Items (Horizontal cards) */}
              {listItems.length > 0 && (
                <div className="space-y-4 my-4">
                  {listItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectArticle(item.id)}
                      className="archive_page archive_back grid grid-cols-1 sm:grid-cols-12 gap-4 cursor-pointer group hover:bg-[#F2F7FB] p-2 rounded transition-colors"
                    >
                      <div className="sm:col-span-4">
                        <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden">
                          <ImageWithFallback
                            src={item.image}
                            fallbackSrc={item.fallbackImage}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-8 flex flex-col justify-center">
                        <h3 className="archive_title01 text-base font-bold group-hover:text-[#c90000] transition-colors mt-0 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-2">
                          {item.excerpt || item.content?.slice(0, 180)}
                        </p>
                        <h4 className="archvie_more font-bold text-[#c90000] text-xs sm:text-sm group-hover:underline">
                          বিস্তারিত...
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Component if multiple pages */}
              {totalPages > 1 && (
                <div className="post-nav my-4">
                  <ul className="pager flex items-center justify-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <li key={pageNum} className={currentPage === pageNum ? 'active' : ''}>
                        <button
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 text-xs font-bold rounded cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-[#9A1515] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum < 10 ? `0${pageNum}` : pageNum}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar Area (4 cols) */}
        <div className="lg:col-span-4">
          <div className="tab-header bg-white border border-gray-200 rounded p-3 shadow-xs">
            {/* Nav tabs */}
            <div className="flex border-b border-gray-200 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('latest')}
                className={`flex-1 py-2 text-center text-sm font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'latest'
                    ? 'border-[#9A1515] text-[#9A1515] bg-red-50/50'
                    : 'border-transparent text-gray-600 hover:text-[#004F8A]'
                }`}
              >
                সর্বশেষ সংবাদ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('popular')}
                className={`flex-1 py-2 text-center text-sm font-bold transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'popular'
                    ? 'border-[#9A1515] text-[#9A1515] bg-red-50/50'
                    : 'border-transparent text-gray-600 hover:text-[#004F8A]'
                }`}
              >
                জনপ্রিয় সংবাদ
              </button>
            </div>

            {/* Tab panes */}
            <div className="tab-content">
              {activeTab === 'latest' ? (
                <div className="news-titletab space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {latestTabArticles.length > 0 ? (
                    latestTabArticles.map((tabItem) => (
                      <div
                        key={tabItem.id}
                        onClick={() => onSelectArticle(tabItem.id)}
                        className="small-img tab-border flex items-start gap-2.5 pb-2 border-b border-dashed border-gray-200 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors"
                      >
                        <div className="w-20 h-14 shrink-0 rounded overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={tabItem.image}
                            fallbackSrc={tabItem.fallbackImage}
                            alt={tabItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="hadding_02 text-xs sm:text-[13.5px] font-semibold text-[#222] group-hover:text-[#9A1515] transition-colors leading-snug line-clamp-2">
                          {tabItem.title}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">কোনো সংবাদ পাওয়া যায়নি</p>
                  )}
                </div>
              ) : (
                <div className="news-titletab space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {popularTabArticles.length > 0 ? (
                    popularTabArticles.map((popItem) => (
                      <div
                        key={popItem.id}
                        onClick={() => onSelectArticle(popItem.id)}
                        className="small-img tab-border flex items-start gap-2.5 pb-2 border-b border-dashed border-gray-200 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors"
                      >
                        <div className="w-20 h-14 shrink-0 rounded overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={popItem.image}
                            fallbackSrc={popItem.fallbackImage}
                            alt={popItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <h4 className="hadding_02 text-xs sm:text-[13.5px] font-semibold text-[#222] group-hover:text-[#9A1515] transition-colors leading-snug line-clamp-2">
                          {popItem.title}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">কোনো সংবাদ পাওয়া যায়নি</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="add mt-4">
            <AdBanner
              image={siteSettings?.sidebarAdImage}
              url={siteSettings?.sidebarAdUrl}
              sizeLabel="৩০০ x ২৫০"
              heightClass="h-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
