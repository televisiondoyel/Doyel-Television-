import React, { useState } from 'react';
import { NewsArticle, SiteSettings } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { AdBanner } from './AdBanner';
import {
  leadStory,
  sideLeadNews,
  gridSectionTwoCards,
  nationalNewsMain,
  nationalNewsList,
  internationalNews,
  sportsList,
  mediaNewsGrid,
} from '../data/newsData';

interface CategoryArchivePageProps {
  category: string;
  articles: NewsArticle[];
  onSelectArticle: (idOrTitle: string | number) => void;
  onClose: () => void;
  siteSettings?: SiteSettings;
}

export const CategoryArchivePage: React.FC<CategoryArchivePageProps> = ({
  category,
  articles,
  onSelectArticle,
  onClose,
  siteSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Pool of category articles (fallback to national/lead if empty)
  const allCategoryPool: NewsArticle[] =
    articles.length >= 10
      ? articles
      : [
          ...articles,
          nationalNewsMain,
          ...nationalNewsList,
          ...sideLeadNews,
          ...internationalNews,
          ...sportsList,
        ];

  // Pick specific items for layout
  const leadItem = allCategoryPool[0] || nationalNewsMain;
  const sideItem1 = allCategoryPool[1] || nationalNewsList[0];
  const sideItem2 = allCategoryPool[2] || nationalNewsList[1];
  const gridItem1 = allCategoryPool[3] || nationalNewsList[2];
  const gridItem2 = allCategoryPool[4] || sideLeadNews[0];
  const gridItem3 = allCategoryPool[5] || sideLeadNews[1];
  const listItem1 = allCategoryPool[6] || sideLeadNews[2];
  const listItem2 = allCategoryPool[7] || sideLeadNews[3];
  const listItem3 = allCategoryPool[8] || gridSectionTwoCards[0];
  const listItem4 = allCategoryPool[9] || gridSectionTwoCards[1];

  // Latest 10 Tab Items exactly matching the template HTML
  const latestTabArticles = [
    {
      id: '1039',
      title: 'রুদ্র মুহম্মদ শহিদুল্লাহর জন্মদিন আজ',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/rudro-20171016120759.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1036',
      title: 'কবি শামসুর রাহমানের ৮৯তম জন্মদিন আজ',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/shamsur-rahman-20171023093303-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1033',
      title: 'বিল নিয়ে খেদ হাসপাতালে ভর্তি তসলিমার',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/taslima-20171018180245-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1030',
      title: '১৬ নভেম্বর ঢাকা লিট ফেস্ট শুরু',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/lit-fest-logo-20171104143720-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1027',
      title: 'প্রলয়',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/proloy-20171106175843-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1024',
      title: '৭ মার্চের ভাষণের ওপর বইয়ের মোড়ক উন্মোচন',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/polok-20171113161446-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1021',
      title: 'আরব সভ্যতা টিকবে না : আদোনিস',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/adonis-20171116173809-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1016',
      title: 'কবিতার খোঁজে সম্মাননা পেলেন ১০ তরুণ কবি',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/kobi-20171118162239-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1013',
      title: 'জীবনে প্রথম সামনাসামনি আবৃত্তি শোনা',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/ajadul-20171119180726-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: '1010',
      title: 'সুফিয়া কামালের মৃত্যুবার্ষিকী আজ',
      image: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/sufia-20171120093305-600x337.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const popularTabArticles = [
    leadStory,
    ...sideLeadNews,
    ...gridSectionTwoCards.slice(0, 3),
  ];

  return (
    <section className="archive-page-section my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 cols) */}
        <div className="lg:col-span-8">
          {/* Category Info Header / Breadcrumb */}
          <div className="category_info">
            <button
              onClick={onClose}
              className="text-[#004f8a] hover:text-[#c90000] cursor-pointer"
              title="প্রচ্ছদ"
            >
              <i className="fa fa-home" aria-hidden="true"></i>
            </button>
            <i className="fa fa-chevron-right text-xs text-gray-400"></i>
            <span>{category}</span>
          </div>

          {/* Row 1: 1 Big Featured Article (Left 8 cols) + 2 Stacked Items (Right 4 cols) */}
          <div className="archive_page grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-gray-200">
            {/* Left Big Post (8 cols) */}
            <div className="md:col-span-8 cursor-pointer group" onClick={() => onSelectArticle(leadItem.id)}>
              <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-2">
                <ImageWithFallback
                  src={leadItem.image}
                  fallbackSrc={leadItem.fallbackImage}
                  alt={leadItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="archive_title01 group-hover:text-[#c90000] transition-colors">
                {leadItem.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {leadItem.excerpt ||
                  leadItem.content?.slice(0, 200) ||
                  'নানা কর্মসূচির মধ্য দিয়ে দিবসটি পালন করা হবে। সকাল থেকেই বিভিন্ন সংগঠনের নেতৃবৃন্দ ও সাধারণ মানুষ অংশগ্রহণ করবেন...'}
                <span className="inline-block ml-1 font-bold text-[#004f8a] group-hover:text-[#c90000]">
                  বিস্তারিত...
                </span>
              </p>
            </div>

            {/* Right Stacked 2 Posts (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div className="cursor-pointer group" onClick={() => onSelectArticle(sideItem1.id)}>
                <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-1.5">
                  <ImageWithFallback
                    src={sideItem1.image}
                    fallbackSrc={sideItem1.fallbackImage}
                    alt={sideItem1.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="archive_title02 group-hover:text-[#c90000] transition-colors">
                  {sideItem1.title}
                </h3>
              </div>

              <div className="cursor-pointer group pt-2 border-t border-gray-100" onClick={() => onSelectArticle(sideItem2.id)}>
                <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-1.5">
                  <ImageWithFallback
                    src={sideItem2.image}
                    fallbackSrc={sideItem2.fallbackImage}
                    alt={sideItem2.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="archive_title02 group-hover:text-[#c90000] transition-colors">
                  {sideItem2.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Row 2: 3-column Grid (col-md-4 each) */}
          <div className="archive_page grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4 pb-4 border-b border-gray-200">
            <div className="cursor-pointer group" onClick={() => onSelectArticle(gridItem1.id)}>
              <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-2">
                <ImageWithFallback
                  src={gridItem1.image}
                  fallbackSrc={gridItem1.fallbackImage}
                  alt={gridItem1.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="archive_title02 group-hover:text-[#c90000] transition-colors">
                {gridItem1.title}
              </h3>
            </div>

            <div className="cursor-pointer group" onClick={() => onSelectArticle(gridItem2.id)}>
              <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-2">
                <ImageWithFallback
                  src={gridItem2.image}
                  fallbackSrc={gridItem2.fallbackImage}
                  alt={gridItem2.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="archive_title02 group-hover:text-[#c90000] transition-colors">
                {gridItem2.title}
              </h3>
            </div>

            <div className="cursor-pointer group" onClick={() => onSelectArticle(gridItem3.id)}>
              <div className="w-full aspect-[480/250] bg-gray-100 rounded overflow-hidden mb-2">
                <ImageWithFallback
                  src={gridItem3.image}
                  fallbackSrc={gridItem3.fallbackImage}
                  alt={gridItem3.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="archive_title02 group-hover:text-[#c90000] transition-colors">
                {gridItem3.title}
              </h3>
            </div>
          </div>

          {/* Row 3 to 6: Archive Back Rows (Horizontal cards: 4 cols image + 8 cols text) */}
          <div className="space-y-4 my-4">
            {[listItem1, listItem2, listItem3, listItem4].map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => onSelectArticle(item.id)}
                className="archive_page archive_back grid grid-cols-1 sm:grid-cols-12 gap-4 cursor-pointer group hover:bg-[#F2F7FB] transition-colors"
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
                  <h3 className="archive_title01 group-hover:text-[#c90000] transition-colors mt-0 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-2">
                    {item.excerpt ||
                      item.content?.slice(0, 180) ||
                      'বিস্তারিত খবরের জন্য ক্লিক করুন। দেশ ও বিদেশের সর্বশেষ তাজা খবর নিয়ে আমরা আছি আপনাদের সাথে প্রতিদিন প্রতি মুহূর্তে...'}
                  </p>
                  <h4 className="archvie_more font-bold text-[#c90000] text-sm group-hover:underline">
                    বিস্তারিত...
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          <div className="post-nav">
            <ul className="pager">
              <li className={currentPage === 1 ? 'active' : ''}>
                <span onClick={() => setCurrentPage(1)}>01</span>
              </li>
              <li className={currentPage === 2 ? 'active' : ''}>
                <a onClick={() => setCurrentPage(2)}>02</a>
              </li>
              <li>
                <a onClick={() => setCurrentPage(currentPage === 1 ? 2 : 1)} title="next">
                  <i className="fa fa-forward" aria-hidden="true"></i>
                </a>
              </li>
              <li className="next">
                <a onClick={() => setCurrentPage(2)} title="last">
                  <i className="fa fa-fast-forward" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
          </div>
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

            {/* Tab panes - 4 items visible, scroll for remaining */}
            <div className="tab-content">
              {activeTab === 'latest' ? (
                <div className="news-titletab space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {latestTabArticles.map((tabItem) => (
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
                  ))}
                </div>
              ) : (
                <div className="news-titletab space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {popularTabArticles.map((popItem) => (
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
                  ))}
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
