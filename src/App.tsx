import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { BreakingTicker } from './components/BreakingTicker';
import { CategoryHeader } from './components/CategoryHeader';
import { ImageWithFallback } from './components/ImageWithFallback';
import { PhotoGallery } from './components/PhotoGallery';
import { VideoGallery } from './components/VideoGallery';
import { SidebarWidgets } from './components/SidebarWidgets';
import { SinglePageArticle } from './components/SinglePageArticle';
import { CategoryArchivePage } from './components/CategoryArchivePage';
import { OurFamilyPage } from './components/OurFamilyPage';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WordPressAuth } from './components/admin/WordPressAuth';
import {
  leadStory as defaultLead,
  sideLeadNews as defaultSideLead,
  gridSectionTwoCards as defaultGridTwo,
  nationalNewsMain as defaultNationalMain,
  nationalNewsList as defaultNationalList,
  politicsFeatured as defaultPoliticsFeatured,
  politicsList as defaultPoliticsList,
  internationalNews as defaultInternational,
  economyNews as defaultEconomy,
  lawNews as defaultLaw,
  entertainmentNews as defaultEntertainment,
  mediaNewsGrid as defaultMedia,
  sportsList as defaultSports,
  techNews as defaultTech,
  educationNews as defaultEducation,
  opinionNews as defaultOpinion,
  findArticle,
  tickerNews as defaultTicker,
  photoGalleryData as defaultPhotos,
  videoGalleryData as defaultVideos,
  defaultFamilyMembers
} from './data/newsData';
import { NewsArticle, CategoryItem, TickerItem, PhotoSlide, VideoSlide, SiteSettings, FamilyMember } from './types';
import {
  seedFirestoreIfEmpty,
  subscribeToArticles,
  subscribeToSiteSettings,
  subscribeToCategories,
  subscribeToTicker,
  subscribeToPhotos,
  subscribeToVideos,
  subscribeToFamilyMembers,
  defaultSettings,
  defaultCategories
} from './lib/firestoreService';

export default function App() {
  // Navigation & View States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('wp_logged_in_user');
    } catch {
      return false;
    }
  });
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [currentFilterCategory, setCurrentFilterCategory] = useState<string>('প্রচ্ছদ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Live Firestore State
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [photos, setPhotos] = useState<PhotoSlide[]>([]);
  const [videos, setVideos] = useState<VideoSlide[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // Track if Firestore subscriptions have loaded
  const [hasLoadedArticles, setHasLoadedArticles] = useState<boolean>(false);
  const [hasLoadedFamily, setHasLoadedFamily] = useState<boolean>(false);
  const [hasLoadedPhotos, setHasLoadedPhotos] = useState<boolean>(false);
  const [hasLoadedVideos, setHasLoadedVideos] = useState<boolean>(false);
  const [hasLoadedTicker, setHasLoadedTicker] = useState<boolean>(false);
  const [hasLoadedCategories, setHasLoadedCategories] = useState<boolean>(false);

  // ----------------------------------------------------
  // Dynamic URL Router & Browser History (xyz.com/রাজনীতি etc.)
  // ----------------------------------------------------
  const handleOpenArticle = (idOrTitle: string | number, updateUrl = true) => {
    const stringId = String(idOrTitle);
    let targetArticle: NewsArticle | null = null;

    const inDb = articles.find((a) => String(a.id) === stringId || a.title === stringId);
    if (inDb) {
      targetArticle = inDb;
    } else {
      const article = findArticle(stringId);
      if (article) {
        targetArticle = article;
      } else {
        const fallbackItem = tickerItems.find((t) => String(t.id) === stringId);
        targetArticle = {
          id: stringId,
          title: fallbackItem ? fallbackItem.title : stringId,
          category: 'জাতীয়',
          image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
          excerpt: 'এই সংবাদটি সম্পর্কে বিস্তারিত বিবরণ শীঘ্রই প্রকাশিত হবে।',
          content: `দেশ ও বিদেশের সর্বশেষ নির্ভরযোগ্য সংবাদ পেতে চোখ রাখুন দোয়েল টেলিভিশন পোর্টালে। সত্য ও বস্তুনিষ্ঠ সাংবাদিকতায় আমরা সদা অঙ্গীকারবদ্ধ।`,
          date: '২১ অগাস্ট ২০২৬',
          author: 'অনলাইন ডেস্ক',
        };
      }
    }

    setSelectedArticle(targetArticle);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateUrl && targetArticle) {
      try {
        window.history.pushState({ type: 'article', id: stringId }, '', `/news/${encodeURIComponent(stringId)}`);
      } catch {
        // ignore iframe history restrictions if any
      }
    }
  };

  const handleCategorySelect = (cat: string, updateUrl = true) => {
    setSelectedArticle(null);
    setSearchQuery('');
    setDateFilter('');
    setCurrentFilterCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateUrl) {
      try {
        if (cat === 'প্রচ্ছদ') {
          window.history.pushState({ type: 'category', category: 'প্রচ্ছদ' }, '', '/');
        } else {
          window.history.pushState({ type: 'category', category: cat }, '', `/${cat}`);
        }
      } catch {
        // ignore iframe history restrictions if any
      }
    }
  };

  const handleOpenAdmin = (updateUrl = true) => {
    setIsAdminOpen(true);
    if (updateUrl) {
      try {
        window.history.pushState({ type: 'admin' }, '', '/admin');
      } catch {
        // ignore
      }
    }
  };

  const handleExitAdmin = (updateUrl = true) => {
    setIsAdminOpen(false);
    if (updateUrl) {
      try {
        if (currentFilterCategory && currentFilterCategory !== 'প্রচ্ছদ') {
          window.history.pushState({ type: 'category', category: currentFilterCategory }, '', `/${currentFilterCategory}`);
        } else {
          window.history.pushState({ type: 'category', category: 'প্রচ্ছদ' }, '', '/');
        }
      } catch {
        // ignore
      }
    }
  };

  // Sync state on Initial Load and Browser Back/Forward navigation
  const syncRouteFromPath = useCallback(() => {
    try {
      const rawPath = window.location.pathname;
      const decodedPath = decodeURIComponent(rawPath).trim();

      if (decodedPath === '/admin' || decodedPath === '/wp-admin') {
        setIsAdminOpen(true);
        setSelectedArticle(null);
        return;
      }

      if (decodedPath.startsWith('/news/')) {
        const articleId = decodedPath.replace('/news/', '').trim();
        if (articleId) {
          setIsAdminOpen(false);
          handleOpenArticle(articleId, false);
          return;
        }
      }

      const catSlug = decodedPath.replace(/^\/+/, '').trim();
      if (catSlug && catSlug !== 'index.html' && catSlug !== 'home') {
        setIsAdminOpen(false);
        setSelectedArticle(null);
        if (catSlug === 'আমাদের পরিবার' || catSlug === 'আমাদের-পরিবার') {
          setCurrentFilterCategory('আমাদের পরিবার');
        } else {
          setCurrentFilterCategory(catSlug);
        }
      } else {
        setIsAdminOpen(false);
        setSelectedArticle(null);
        setCurrentFilterCategory('প্রচ্ছদ');
      }
    } catch (e) {
      console.error('Route parsing error:', e);
    }
  }, [articles]);

  useEffect(() => {
    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, [syncRouteFromPath]);

  // Seed and Subscribe to Real-time Database on Mount
  useEffect(() => {
    // 1. Seed if empty
    seedFirestoreIfEmpty().then(() => {
      console.log('Database check complete.');
    });

    // 2. Real-time Subscriptions with complete state synchronization (including deletion to empty)
    const unsubArticles = subscribeToArticles((data) => {
      setArticles(data || []);
      setHasLoadedArticles(true);
    });

    const unsubSettings = subscribeToSiteSettings((data) => {
      if (data) setSiteSettings(data);
    });

    const unsubCategories = subscribeToCategories((data) => {
      setCategories(data || []);
      setHasLoadedCategories(true);
    });

    const unsubTicker = subscribeToTicker((data) => {
      setTickerItems(data || []);
      setHasLoadedTicker(true);
    });

    const unsubPhotos = subscribeToPhotos((data) => {
      setPhotos(data || []);
      setHasLoadedPhotos(true);
    });

    const unsubVideos = subscribeToVideos((data) => {
      setVideos(data || []);
      setHasLoadedVideos(true);
    });

    const unsubFamily = subscribeToFamilyMembers((data) => {
      setFamilyMembers(data || []);
      setHasLoadedFamily(true);
    });

    return () => {
      unsubArticles();
      unsubSettings();
      unsubCategories();
      unsubTicker();
      unsubPhotos();
      unsubVideos();
      unsubFamily();
    };
  }, []);

  // Dynamically synchronize favicon with site logo
  useEffect(() => {
    if (siteSettings?.siteLogo) {
      const faviconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (faviconLinks.length > 0) {
        faviconLinks.forEach((link) => {
          link.href = siteSettings.siteLogo!;
        });
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = siteSettings.siteLogo;
        document.head.appendChild(newLink);
      }
    }
  }, [siteSettings?.siteLogo]);

  // Compute all articles (using real firestore articles, or initial defaults before first load only)
  const allArticles = useMemo(() => {
    if (hasLoadedArticles) {
      return articles;
    }
    if (articles.length > 0) {
      return articles;
    }
    return [
      defaultLead,
      ...defaultSideLead,
      ...defaultGridTwo,
      defaultNationalMain,
      ...defaultNationalList,
      ...defaultInternational,
      defaultEconomy.featured,
      defaultLaw.featured,
      defaultEntertainment.featured,
      ...defaultMedia,
      ...defaultSports,
      defaultTech.featured,
      defaultEducation.featured,
      defaultOpinion.featured,
    ];
  }, [hasLoadedArticles, articles]);

  // Lead Story Dynamic Computation
  const leadStoryItem = useMemo(() => {
    if (allArticles.length === 0) return null;
    const customLead = allArticles.find((a) => a.lead);
    if (customLead) return customLead;
    return allArticles[0];
  }, [allArticles]);

  // Side Leads (up to 4 articles excluding leadStoryItem)
  const sideLeadNewsItems = useMemo(() => {
    if (!leadStoryItem) return [];
    const items = allArticles.filter((a) => String(a.id) !== String(leadStoryItem.id));
    return items.slice(0, 4);
  }, [allArticles, leadStoryItem]);

  // Grid Section Two (up to 4 articles excluding lead and side leads)
  const gridSectionTwoItems = useMemo(() => {
    if (!leadStoryItem) return [];
    const sideLeadIds = new Set(sideLeadNewsItems.map((s) => String(s.id)));
    const items = allArticles.filter(
      (a) => String(a.id) !== String(leadStoryItem.id) && !sideLeadIds.has(String(a.id))
    );
    return items.slice(0, 4);
  }, [allArticles, leadStoryItem, sideLeadNewsItems]);

  // Category specific slices from active real articles
  const getCategoryArticles = (catName: string, count: number = 6) => {
    const filtered = allArticles.filter((a) => a.category === catName || a.subcategory === catName);
    return filtered.slice(0, count);
  };

  const nationalItems = getCategoryArticles('জাতীয়', 5);
  const nationalMain = nationalItems[0] || null;
  const nationalList = nationalItems.length > 1 ? nationalItems.slice(1) : [];

  const internationalList = getCategoryArticles('আন্তর্জাতিক', 6);

  const economyItems = getCategoryArticles('অর্থনীতি', 5);
  const economyFeatured = economyItems[0] || null;
  const economyList = economyItems.length > 1 ? economyItems.slice(1) : [];

  const lawItems = getCategoryArticles('আইন-আদালত', 5);
  const lawFeatured = lawItems[0] || null;
  const lawList = lawItems.length > 1 ? lawItems.slice(1) : [];

  const entertainmentItems = getCategoryArticles('বিনোদন', 5);
  const entertainmentFeatured = entertainmentItems[0] || null;
  const entertainmentList = entertainmentItems.length > 1 ? entertainmentItems.slice(1) : [];

  const mediaList = getCategoryArticles('গণমাধ্যম', 6);

  const sportsList = getCategoryArticles('খেলাধুলা', 5);

  const techItems = getCategoryArticles('তথ্যপ্রযুক্তি', 5);
  const techFeatured = techItems[0] || null;
  const techList = techItems.length > 1 ? techItems.slice(1) : [];

  const educationItems = getCategoryArticles('শিক্ষা', 5);
  const educationFeatured = educationItems[0] || null;
  const educationList = educationItems.length > 1 ? educationItems.slice(1) : [];

  const opinionItems = getCategoryArticles('মতামত', 5);
  const opinionFeatured = opinionItems[0] || null;
  const opinionList = opinionItems.length > 1 ? opinionItems.slice(1) : [];

  // Filtered articles when search or category is active (if not 'প্রচ্ছদ')
  const filteredArticles = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q)
      );
    }

    if (currentFilterCategory && currentFilterCategory !== 'প্রচ্ছদ' && currentFilterCategory !== 'আমাদের পরিবার') {
      const targetCat = currentFilterCategory.trim();

      // If viewing all "সারাদেশে" / "সারাদেশ"
      if (targetCat === 'সারাদেশে' || targetCat === 'সারাদেশ') {
        const divisionNames = [
          'সারাদেশে',
          'সারাদেশ',
          'ঢাকা-বিভাগ',
          'ঢাকা বিভাগ',
          'চট্রগ্রাম-বিভাগ',
          'চট্টগ্রাম-বিভাগ',
          'চট্রগ্রাম বিভাগ',
          'চট্টগ্রাম বিভাগ',
          'খুলনা-বিভাগ',
          'খুলনা বিভাগ',
          'রাজশাহী-বিভাগ',
          'রাজশাহী বিভাগ',
          'বরিশাল-বিভাগ',
          'বরিশাল বিভাগ',
          'সিলেট-বিভাগ',
          'সিলেট বিভাগ',
          'রংপুর-বিভাগ',
          'রংপুর বিভাগ',
          'ময়মনসিংহ-বিভাগ',
          'ময়মনসিংহ বিভাগ',
        ];
        return allArticles.filter((a) => {
          const aCat = (a.category || '').trim();
          const aSub = (a.subcategory || '').trim();
          return (
            divisionNames.includes(aCat) ||
            divisionNames.includes(aSub) ||
            aCat.includes('বিভাগ') ||
            aSub.includes('বিভাগ') ||
            aCat === 'সারাদেশে' ||
            aSub === 'সারাদেশে'
          );
        });
      }

      // If viewing a specific division or category
      const normalizedTarget = targetCat
        .replace(/\s+/g, '-')
        .replace('চট্টগ্রাম', 'চট্রগ্রাম')
        .replace(/-বিভাগ$/, '')
        .replace(/বিভাগ$/, '');

      return allArticles.filter((a) => {
        const aCat = (a.category || '').trim();
        const aSub = (a.subcategory || '').trim();

        if (aCat === targetCat || aSub === targetCat) return true;

        const normCat = aCat.replace(/\s+/g, '-').replace('চট্টগ্রাম', 'চট্রগ্রাম');
        const normSub = aSub.replace(/\s+/g, '-').replace('চট্টগ্রাম', 'চট্রগ্রাম');

        if (normCat === normalizedTarget || normSub === normalizedTarget) return true;
        if (normCat.includes(normalizedTarget) || normSub.includes(normalizedTarget)) return true;

        return false;
      });
    }

    return null;
  }, [allArticles, searchQuery, currentFilterCategory]);

  const handleSearch = (q: string) => {
    setSelectedArticle(null);
    setSearchQuery(q);
    setCurrentFilterCategory('অনুসন্ধান');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateFilter = (dateStr: string) => {
    setSelectedArticle(null);
    setDateFilter(dateStr);
    setCurrentFilterCategory(`আর্কাইভ: ${dateStr}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reusable Ad Banner Row
  const renderAdBannerRow = (key: string) => (
    <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <AdBanner
        image={siteSettings?.bodyAdImage}
        url={siteSettings?.bodyAdUrl}
        sizeLabel="৩৬০ x ৯০"
        heightClass="h-24"
      />
      <AdBanner
        image={siteSettings?.bodyAdImage}
        url={siteSettings?.bodyAdUrl}
        sizeLabel="৩৬০ x ৯০"
        heightClass="h-24"
      />
    </div>
  );

  // ----------------------------------------------------
  // FULL PAGE ADMIN DASHBOARD VIEW (WITH WORDPRESS AUTH)
  // ----------------------------------------------------
  if (isAdminOpen) {
    if (!isAuthenticated) {
      return (
        <WordPressAuth
          siteSettings={siteSettings}
          onLoginSuccess={() => setIsAuthenticated(true)}
          onBackToSite={() => handleExitAdmin(true)}
        />
      );
    }

    return (
      <AdminDashboard
        articles={allArticles}
        categories={hasLoadedCategories ? categories : defaultCategories}
        tickerItems={hasLoadedTicker ? tickerItems : (tickerItems.length > 0 ? tickerItems : defaultTicker)}
        photos={hasLoadedPhotos ? photos : (photos.length > 0 ? photos : defaultPhotos)}
        videos={hasLoadedVideos ? videos : (videos.length > 0 ? videos : defaultVideos)}
        siteSettings={siteSettings}
        familyMembers={hasLoadedFamily ? familyMembers : (familyMembers.length > 0 ? familyMembers : defaultFamilyMembers)}
        onExitAdmin={() => handleExitAdmin(true)}
        onLogout={() => {
          try {
            localStorage.removeItem('wp_logged_in_user');
          } catch (e) {
            console.error(e);
          }
          setIsAuthenticated(false);
          handleExitAdmin(true);
        }}
      />
    );
  }

  // ----------------------------------------------------
  // PUBLIC NEWS PORTAL FRONTEND VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="container mx-auto max-w-7xl px-2 sm:px-4">
        <div className="main_wbsite bg-white p-3 sm:p-5 rounded shadow-sm">
          {/* Top Header with Site Settings & Admin Shortcut */}
          <Header
            onSearch={handleSearch}
            siteSettings={siteSettings}
            onOpenAdmin={() => handleOpenAdmin(true)}
          />

          {/* Main Navigation Bar */}
          <Navbar
            activeCategory={currentFilterCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Breaking News Marquee */}
          <BreakingTicker
            onSelectArticle={handleOpenArticle}
            tickerItems={tickerItems}
            tickerTitle={siteSettings.tickerTitle}
          />

          {/* Single Article Page View or Category Archive Page or Normal Homepage */}
          {selectedArticle !== null ? (
            <SinglePageArticle
              article={selectedArticle}
              onClose={() => setSelectedArticle(null)}
              onSelectArticle={handleOpenArticle}
              siteSettings={siteSettings}
              allArticles={allArticles}
            />
          ) : filteredArticles !== null ? (
            <CategoryArchivePage
              category={currentFilterCategory}
              articles={filteredArticles}
              allArticles={allArticles}
              onSelectArticle={handleOpenArticle}
              onClose={() => handleCategorySelect('প্রচ্ছদ')}
              onSelectCategory={handleCategorySelect}
              siteSettings={siteSettings}
            />
          ) : currentFilterCategory === 'আমাদের পরিবার' ? (
            /* Our Family / Editorial Board View */
            <OurFamilyPage
              members={hasLoadedFamily ? familyMembers : (familyMembers.length > 0 ? familyMembers : defaultFamilyMembers)}
              onHome={() => handleCategorySelect('প্রচ্ছদ')}
            />
          ) : (
            /* Complete Multi-Section Homepage */
            <>
              {/* ====================================================
                  SECTION ONE: Lead Story, Side Leads, Exclusive 2x3, National, Sidebar
                  ==================================================== */}
              <div className="section_one my-3">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column (9 Cols) */}
                  <div className="lg:col-span-9 space-y-6">
                    {leadStoryItem ? (
                      <>
                        {/* 1. Category One: Main Lead & Side Leads */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* Big Lead News */}
                          <div className={sideLeadNewsItems.length > 0 ? "md:col-span-7" : "md:col-span-12"}>
                            <div
                              onClick={() => handleOpenArticle(leadStoryItem.id)}
                              className="bg-white border border-gray-200 rounded p-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
                            >
                              <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-3">
                                <ImageWithFallback
                                  src={leadStoryItem.image}
                                  fallbackSrc={leadStoryItem.fallbackImage}
                                  alt={leadStoryItem.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <h2 className="hadding_01 text-xl sm:text-2xl font-bold group-hover:text-[#9A1515] transition-colors leading-tight">
                                {leadStoryItem.title}
                              </h2>
                              <p className="content-dtls text-gray-600 text-sm mt-2 leading-relaxed">
                                {leadStoryItem.excerpt}
                                <span className="text-[#004F8A] font-semibold ml-1.5 hover:underline">
                                  বিস্তারিত...
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* 4 Small Side Leads (5 Cols) */}
                          {sideLeadNewsItems.length > 0 && (
                            <div className="md:col-span-5">
                              <div className="bg-white border border-gray-200 rounded p-3 shadow-xs space-y-2.5">
                                {sideLeadNewsItems.map((item) => (
                                  <div
                                    key={item.id}
                                    onClick={() => handleOpenArticle(item.id)}
                                    className="tab-border flex items-start gap-2.5 cursor-pointer group py-1"
                                  >
                                    <div className="w-20 h-14 shrink-0 rounded overflow-hidden bg-gray-100">
                                      <ImageWithFallback
                                        src={item.image}
                                        fallbackSrc={item.fallbackImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                    </div>
                                    <h4 className="hadding_02 text-sm font-semibold text-gray-800 group-hover:text-[#9A1515] leading-snug line-clamp-2 transition-colors">
                                      {item.title}
                                    </h4>
                                  </div>
                                ))}

                                {/* More News Button */}
                                <div className="pt-2 text-right">
                                  <button
                                    onClick={() => handleCategorySelect('লিড নিউজ')}
                                    className="more_news"
                                  >
                                    <span>আরো খবর..</span>
                                    <i className="fa fa-angle-double-right text-xs"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. Category Two: 2x3 Grid Exclusive News */}
                        {gridSectionTwoItems.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gridSectionTwoItems.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleOpenArticle(item.id)}
                                className="bg-white border border-gray-200 rounded p-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
                              >
                                <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                                  <ImageWithFallback
                                    src={item.image}
                                    fallbackSrc={item.fallbackImage}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <h4 className="hadding_02 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                                  {item.title}
                                </h4>
                                <p className="content-dtls text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2">
                                  {item.excerpt}
                                  <span className="text-[#004F8A] font-semibold ml-1 hover:underline">
                                    বিস্তারিত...
                                  </span>
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 3. Category Three: জাতীয় (National) News */}
                        {nationalMain && (
                          <div className="bg-white p-3 border border-gray-200 rounded shadow-xs">
                            <CategoryHeader
                              title="জাতীয়"
                              icon="fa-newspaper-o"
                              onCategoryClick={() => handleCategorySelect('জাতীয়')}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
                              {/* National Left Highlight */}
                              <div className={nationalList.length > 0 ? "md:col-span-5" : "md:col-span-12"}>
                                <div
                                  onClick={() => handleOpenArticle(nationalMain.id)}
                                  className="cursor-pointer group"
                                >
                                  <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                                    <ImageWithFallback
                                      src={nationalMain.image}
                                      fallbackSrc={nationalMain.fallbackImage}
                                      alt={nationalMain.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                  </div>
                                  <h4 className="hadding_02 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                                    {nationalMain.title}
                                  </h4>
                                  <p className="content-dtls text-xs sm:text-sm text-gray-600 mt-1.5 line-clamp-2">
                                    {nationalMain.excerpt}
                                    <span className="text-[#004F8A] font-semibold ml-1 hover:underline">
                                      বিস্তারিত...
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* National Right 2x2 Grid */}
                              {nationalList.length > 0 && (
                                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {nationalList.map((item) => (
                                    <div
                                      key={item.id}
                                      onClick={() => handleOpenArticle(item.id)}
                                      className="cursor-pointer group bg-gray-50/70 p-2 rounded border border-gray-200/70 hover:border-gray-300"
                                    >
                                      <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-1.5">
                                        <ImageWithFallback
                                          src={item.image}
                                          fallbackSrc={item.fallbackImage}
                                          alt={item.title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                      </div>
                                      <h5 className="hadding_03 text-[13.5px] font-semibold text-gray-800 group-hover:text-[#9A1515] leading-snug line-clamp-2 transition-colors">
                                        {item.title}
                                      </h5>
                                      <p className="content-dtls text-[11.5px] text-gray-500 line-clamp-1 mt-0.5">
                                        {item.excerpt}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded p-8 text-center text-gray-500 shadow-xs">
                        <i className="fa fa-newspaper-o text-4xl text-gray-300 mb-3 block"></i>
                        <p className="text-base font-semibold">কোনো সংবাদ প্রকাশিত হয়নি</p>
                        <p className="text-xs text-gray-400 mt-1">নতুন সংবাদ যুক্ত করতে অ্যাডমিন প্যানেলে লগইন করুন।</p>
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar Column (3 Cols) */}
                  <div className="lg:col-span-3">
                    <SidebarWidgets
                      onSelectArticle={handleOpenArticle}
                      onSelectCategory={handleCategorySelect}
                      onFilterByDate={handleDateFilter}
                      siteSettings={siteSettings}
                      articles={allArticles}
                    />
                  </div>
                </div>
              </div>

              {/* Advertisement Row 1 */}
              {renderAdBannerRow('ad-row-1')}

              {/* ====================================================
                  SECTION TWO: আন্তর্জাতিক (International) 3x3 Grid
                  ==================================================== */}
              {internationalList.length > 0 && (
                <>
                  <div className="section_two my-6 bg-white p-3 border border-gray-200 rounded shadow-xs">
                    <CategoryHeader
                      title="আন্তর্জাতিক"
                      icon="fa-globe"
                      onCategoryClick={() => handleCategorySelect('আন্তর্জাতিক')}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                      {internationalList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleOpenArticle(item.id)}
                          className="cursor-pointer group p-2 rounded bg-gray-50/70 border border-gray-200/80 hover:shadow-xs transition-all"
                        >
                          <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                            <ImageWithFallback
                              src={item.image}
                              fallbackSrc={item.fallbackImage}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <h4 className="hadding_02 text-[14.5px] font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advertisement Row 2 */}
                  {renderAdBannerRow('ad-row-2')}
                </>
              )}

              {/* ====================================================
                  SECTION THREE: অর্থনীতি, আইন-আদালত, বিনোদন (3 Columns)
                  ==================================================== */}
              {(economyFeatured || lawFeatured || entertainmentFeatured) && (
                <>
                  <div className="section_three my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: অর্থনীতি (Economy) */}
                    {economyFeatured && (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between">
                        <div>
                          <CategoryHeader
                            title="অর্থনীতি"
                            icon="fa-line-chart"
                            onCategoryClick={() => handleCategorySelect('অর্থনীতি')}
                          />

                          {/* Featured Item */}
                          <div
                            onClick={() => handleOpenArticle(economyFeatured.id)}
                            className="cursor-pointer group mb-3"
                          >
                            <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                              <ImageWithFallback
                                src={economyFeatured.image}
                                fallbackSrc={economyFeatured.fallbackImage}
                                alt={economyFeatured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="hadding_01 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                              {economyFeatured.title}
                            </h4>
                          </div>

                          {/* Arrow Bullet List */}
                          {economyList.length > 0 && (
                            <ul className="divide-y divide-gray-100">
                              {economyList.map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => handleOpenArticle(item.id)}
                                  className="py-1.5 flex items-start gap-2 cursor-pointer group text-xs sm:text-sm font-medium text-gray-800 hover:text-[#9A1515] transition-colors"
                                >
                                  <i className="fa fa-arrow-circle-right text-red-600 mt-1 shrink-0 text-xs"></i>
                                  <span className="line-clamp-1">{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                          <button
                            onClick={() => handleCategorySelect('অর্থনীতি')}
                            className="more_news"
                          >
                            <span>আরো খবর..</span>
                            <i className="fa fa-angle-double-right text-xs"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Column 2: আইন-আদালত (Law & Court) */}
                    {lawFeatured && (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between">
                        <div>
                          <CategoryHeader
                            title="আইন-আদালত"
                            icon="fa-gavel"
                            onCategoryClick={() => handleCategorySelect('আইন-আদালত')}
                          />

                          {/* Featured Item */}
                          <div
                            onClick={() => handleOpenArticle(lawFeatured.id)}
                            className="cursor-pointer group mb-3"
                          >
                            <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                              <ImageWithFallback
                                src={lawFeatured.image}
                                fallbackSrc={lawFeatured.fallbackImage}
                                alt={lawFeatured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="hadding_01 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                              {lawFeatured.title}
                            </h4>
                          </div>

                          {/* Arrow Bullet List */}
                          {lawList.length > 0 && (
                            <ul className="divide-y divide-gray-100">
                              {lawList.map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => handleOpenArticle(item.id)}
                                  className="py-1.5 flex items-start gap-2 cursor-pointer group text-xs sm:text-sm font-medium text-gray-800 hover:text-[#9A1515] transition-colors"
                                >
                                  <i className="fa fa-arrow-circle-right text-red-600 mt-1 shrink-0 text-xs"></i>
                                  <span className="line-clamp-1">{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                          <button
                            onClick={() => handleCategorySelect('আইন-আদালত')}
                            className="more_news"
                          >
                            <span>আরো খবর..</span>
                            <i className="fa fa-angle-double-right text-xs"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Column 3: বিনোদন (Entertainment) */}
                    {entertainmentFeatured && (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between">
                        <div>
                          <CategoryHeader
                            title="বিনোদন"
                            icon="fa-film"
                            onCategoryClick={() => handleCategorySelect('বিনোদন')}
                          />

                          {/* Featured Item */}
                          <div
                            onClick={() => handleOpenArticle(entertainmentFeatured.id)}
                            className="cursor-pointer group mb-3"
                          >
                            <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                              <ImageWithFallback
                                src={entertainmentFeatured.image}
                                fallbackSrc={entertainmentFeatured.fallbackImage}
                                alt={entertainmentFeatured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="hadding_01 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                              {entertainmentFeatured.title}
                            </h4>
                          </div>

                          {/* Arrow Bullet List */}
                          {entertainmentList.length > 0 && (
                            <ul className="divide-y divide-gray-100">
                              {entertainmentList.map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => handleOpenArticle(item.id)}
                                  className="py-1.5 flex items-start gap-2 cursor-pointer group text-xs sm:text-sm font-medium text-gray-800 hover:text-[#9A1515] transition-colors"
                                >
                                  <i className="fa fa-arrow-circle-right text-red-600 mt-1 shrink-0 text-xs"></i>
                                  <span className="line-clamp-1">{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                          <button
                            onClick={() => handleCategorySelect('বিনোদন')}
                            className="more_news"
                          >
                            <span>আরো খবর..</span>
                            <i className="fa fa-angle-double-right text-xs"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Advertisement Row 3 */}
                  {renderAdBannerRow('ad-row-3')}
                </>
              )}

              {/* ====================================================
                  SECTION FOUR: গণমাধ্যম (8 Cols) & খেলাধুলা (4 Cols)
                  ==================================================== */}
              {(mediaList.length > 0 || sportsList.length > 0) && (
                <>
                  <div className="section_four my-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* গণমাধ্যম (Media - 8 Cols) */}
                    {mediaList.length > 0 && (
                      <div className={sportsList.length > 0 ? "lg:col-span-8 bg-white p-3 border border-gray-200 rounded shadow-xs" : "lg:col-span-12 bg-white p-3 border border-gray-200 rounded shadow-xs"}>
                        <CategoryHeader
                          title="গণমাধ্যম"
                          icon="fa-television"
                          onCategoryClick={() => handleCategorySelect('গণমাধ্যম')}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-2">
                          {mediaList.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleOpenArticle(item.id)}
                              className="cursor-pointer group p-2 rounded bg-gray-50/70 border border-gray-200/80 hover:shadow-xs transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                                  <ImageWithFallback
                                    src={item.image}
                                    fallbackSrc={item.fallbackImage}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <h4 className="hadding_02 text-[13.5px] font-bold text-gray-900 group-hover:text-[#9A1515] leading-snug line-clamp-2 transition-colors">
                                  {item.title}
                                </h4>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* খেলাধুলা (Sports - 4 Cols) */}
                    {sportsList.length > 0 && (
                      <div className={mediaList.length > 0 ? "lg:col-span-4 bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between" : "lg:col-span-12 bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between"}>
                        <div>
                          <CategoryHeader
                            title="খেলাধুলা"
                            icon="fa-futbol-o"
                            onCategoryClick={() => handleCategorySelect('খেলাধুলা')}
                          />

                          <div className="divide-y divide-gray-100 mt-2">
                            {sportsList.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleOpenArticle(item.id)}
                                className="py-2.5 flex items-start gap-2.5 cursor-pointer group"
                              >
                                <div className="w-20 h-14 shrink-0 rounded overflow-hidden bg-gray-100">
                                  <ImageWithFallback
                                    src={item.image}
                                    fallbackSrc={item.fallbackImage}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <h4 className="hadding_02 text-[13.5px] font-semibold text-gray-800 group-hover:text-[#9A1515] leading-snug line-clamp-2 transition-colors">
                                  {item.title}
                                </h4>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                          <button
                            onClick={() => handleCategorySelect('খেলাধুলা')}
                            className="more_news"
                          >
                            <span>আরো খবর..</span>
                            <i className="fa fa-angle-double-right text-xs"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Advertisement Row 4 */}
                  {renderAdBannerRow('ad-row-4')}
                </>
              )}

              {/* ====================================================
                  SECTION FIVE: তথ্যপ্রযুক্তি, শিক্ষা, মতামত (3 Columns)
                  ==================================================== */}
              {(techFeatured || educationFeatured || opinionFeatured) && (
                <>
                  <div className="section_five my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: তথ্যপ্রযুক্তি (Tech) */}
                    {techFeatured && (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between">
                        <div>
                          <CategoryHeader
                            title="তথ্যপ্রযুক্তি"
                            icon="fa-laptop"
                            onCategoryClick={() => handleCategorySelect('তথ্যপ্রযুক্তি')}
                          />

                          {/* Featured Item */}
                          <div
                            onClick={() => handleOpenArticle(techFeatured.id)}
                            className="cursor-pointer group mb-3"
                          >
                            <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                              <ImageWithFallback
                                src={techFeatured.image}
                                fallbackSrc={techFeatured.fallbackImage}
                                alt={techFeatured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="hadding_01 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                              {techFeatured.title}
                            </h4>
                          </div>

                          {/* Arrow Bullet List */}
                          {techList.length > 0 && (
                            <ul className="divide-y divide-gray-100">
                              {techList.map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => handleOpenArticle(item.id)}
                                  className="py-1.5 flex items-start gap-2 cursor-pointer group text-xs sm:text-sm font-medium text-gray-800 hover:text-[#9A1515] transition-colors"
                                >
                                  <i className="fa fa-arrow-circle-right text-red-600 mt-1 shrink-0 text-xs"></i>
                                  <span className="line-clamp-1">{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                          <button
                            onClick={() => handleCategorySelect('তথ্যপ্রযুক্তি')}
                            className="more_news"
                          >
                            <span>আরো খবর..</span>
                            <i className="fa fa-angle-double-right text-xs"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Column 2: শিক্ষা (Education) */}
                    {educationFeatured && (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between">
                        <div>
                          <CategoryHeader
                            title="শিক্ষা"
                            icon="fa-graduation-cap"
                            onCategoryClick={() => handleCategorySelect('শিক্ষা')}
                          />

                          {/* Featured Item */}
                          <div
                            onClick={() => handleOpenArticle(educationFeatured.id)}
                            className="cursor-pointer group mb-3"
                          >
                            <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                              <ImageWithFallback
                                src={educationFeatured.image}
                                fallbackSrc={educationFeatured.fallbackImage}
                                alt={educationFeatured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="hadding_01 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                              {educationFeatured.title}
                            </h4>
                          </div>

                          {/* Arrow Bullet List */}
                          {educationList.length > 0 && (
                            <ul className="divide-y divide-gray-100">
                              {educationList.map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => handleOpenArticle(item.id)}
                                  className="py-1.5 flex items-start gap-2 cursor-pointer group text-xs sm:text-sm font-medium text-gray-800 hover:text-[#9A1515] transition-colors"
                                >
                                  <i className="fa fa-arrow-circle-right text-red-600 mt-1 shrink-0 text-xs"></i>
                                  <span className="line-clamp-1">{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                          <button
                            onClick={() => handleCategorySelect('শিক্ষা')}
                            className="more_news"
                          >
                            <span>আরো খবর..</span>
                            <i className="fa fa-angle-double-right text-xs"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Column 3: মতামত (Opinion) */}
                    {opinionFeatured && (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-xs flex flex-col justify-between">
                        <div>
                          <CategoryHeader
                            title="মতামত"
                            icon="fa-commenting-o"
                            onCategoryClick={() => handleCategorySelect('মতামত')}
                          />

                          {/* Featured Item */}
                          <div
                            onClick={() => handleOpenArticle(opinionFeatured.id)}
                            className="cursor-pointer group mb-3"
                          >
                            <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                              <ImageWithFallback
                                src={opinionFeatured.image}
                                fallbackSrc={opinionFeatured.fallbackImage}
                                alt={opinionFeatured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <h4 className="hadding_01 text-base font-bold text-gray-900 group-hover:text-[#9A1515] transition-colors leading-snug">
                              {opinionFeatured.title}
                            </h4>
                          </div>

                          {/* Arrow Bullet List */}
                          {opinionList.length > 0 && (
                            <ul className="divide-y divide-gray-100">
                              {opinionList.map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => handleOpenArticle(item.id)}
                                  className="py-1.5 flex items-start gap-2 cursor-pointer group text-xs sm:text-sm font-medium text-gray-800 hover:text-[#9A1515] transition-colors"
                                >
                                  <i className="fa fa-arrow-circle-right text-red-600 mt-1 shrink-0 text-xs"></i>
                                  <span className="line-clamp-1">{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 text-right">
                          <button
                            onClick={() => handleCategorySelect('মতামত')}
                            className="more_news"
                          >
                            <span>আরো খবর..</span>
                            <i className="fa fa-angle-double-right text-xs"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Advertisement Row 5 */}
                  {renderAdBannerRow('ad-row-5')}
                </>
              )}

              {/* ====================================================
                  GALLERY SECTION: ফটো গ্যালারী & ভিডিও গ্যালারী
                  ==================================================== */}
              <div className="gallery_section my-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Photo Gallery Carousel */}
                <PhotoGallery
                  photos={photos}
                  onSelectPhoto={(caption) => {
                    setSelectedArticle({
                      id: 'photo-gallery',
                      title: caption,
                      category: 'ফটো গ্যালারী',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
                      excerpt: caption,
                      content: `ফটো ফিচার ও বিশেষ চিত্র প্রতিবেদন: ${caption}`,
                      date: '২১ অগাস্ট ২০২৬',
                      author: 'আলোকচিত্র সাংবাদিক',
                    });
                  }}
                />

                {/* Video Gallery Carousel */}
                <VideoGallery videos={videos} />
              </div>

              {/* Advertisement Row 6 */}
              {renderAdBannerRow('ad-row-6')}
            </>
          )}

          {/* Bottom Footer */}
          <Footer
            settings={siteSettings}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        </div>
      </div>
    </div>
  );
}
