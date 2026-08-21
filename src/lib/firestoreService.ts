import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { NewsArticle, PhotoSlide, VideoSlide, TickerItem, CategoryItem, SiteSettings, FamilyMember } from '../types';
import {
  leadStory,
  sideLeadNews,
  gridSectionTwoCards,
  nationalNewsMain,
  nationalNewsList,
  politicsFeatured,
  politicsList,
  internationalNews,
  economyNews,
  lawNews,
  entertainmentNews,
  mediaNewsGrid,
  sportsList,
  techNews,
  educationNews,
  opinionNews,
  latestNewsTab,
  popularNewsTab,
  photoGalleryData,
  videoGalleryData,
  tickerNews,
  defaultFamilyMembers
} from '../data/newsData';

export const defaultSettings: SiteSettings = {
  siteTitle: 'Professional News - সত্যের সন্ধানে নির্ভীক',
  siteTagline: 'স্বাধীন ও নিরপেক্ষ বাংলা অনলাইন নিউজ পোর্টাল',
  siteLogo: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/logo.png',
  editorName: 'সম্পাদক ও প্রকাশক : এম. এ. রহমান',
  publisherName: 'দৈনিক প্রফেশনাল নিউজ লিমিটেড',
  contactAddress: '৫৮/১ পুরানা পল্টন, ঢাকা-১০০০, বাংলাদেশ',
  contactPhone: '+৮৮০ ২ ৯৫৫xxxx, +৮৮০ ১৭xxxxxxxx',
  contactEmail: 'editor@professionalnews.com',
  facebookUrl: 'https://facebook.com',
  twitterUrl: 'https://twitter.com',
  youtubeUrl: 'https://youtube.com',
  instagramUrl: 'https://instagram.com',
  headerNotice: 'স্বাগতম প্রফেশনাল নিউজ পোর্টালে - বস্তুনিষ্ঠ ও সত্য সংবাদে অবিচল',
  tickerTitle: 'শিরোনাম :',
  footerText: 'স্বত্ব © ২০২৬ প্রফেশনাল নিউজ। সর্বস্বত্ব সংরক্ষিত। অনুমতি ছাড়া যেকোনো বিষয়বস্তু পুনঃপ্রকাশ সম্পূর্ণ নিষিদ্ধ।',
  headerAdImage: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/add-728x90.jpg',
  sidebarAdImage: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/ad-300x250.jpg',
  bodyAdImage: 'https://newssitedesign.com/professionalnews/wp-content/uploads/2017/11/ad-728x90-middle.jpg',
  adminName: 'প্রধান সম্পাদক',
  adminEmail: 'admin@professionalnews.com',
  adminAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  adminBio: 'প্রফেশনাল নিউজ পোর্টালের প্রধান নির্বাহী ও বার্তা সম্পাদক।',
  adminPhone: '+৮৮০ ১৭xxxxxxxx',
  adminDesignation: 'প্রধান সম্পাদক ও প্রশাসক'
};

export const defaultCategories: CategoryItem[] = [
  { id: 'cat-1', name: 'প্রচ্ছদ', slug: 'home', order: 1, visible: true },
  { id: 'cat-2', name: 'জাতীয়', slug: 'national', order: 2, visible: true },
  { id: 'cat-3', name: 'রাজনীতি', slug: 'politics', order: 3, visible: true },
  { id: 'cat-4', name: 'আন্তর্জাতিক', slug: 'international', order: 4, visible: true },
  { id: 'cat-5', name: 'অর্থনীতি', slug: 'economy', order: 5, visible: true },
  { id: 'cat-6', name: 'খেলাধুলা', slug: 'sports', order: 6, visible: true },
  { id: 'cat-7', name: 'বিনোদন', slug: 'entertainment', order: 7, visible: true },
  { id: 'cat-8', name: 'তথ্যপ্রযুক্তি', slug: 'technology', order: 8, visible: true },
  { id: 'cat-9', name: 'শিক্ষা', slug: 'education', order: 9, visible: true },
  { id: 'cat-10', name: 'আইন-আদালত', slug: 'law', order: 10, visible: true },
  { id: 'cat-11', name: 'মতামত', slug: 'opinion', order: 11, visible: true },
  { id: 'cat-12', name: 'গণমাধ্যম', slug: 'media', order: 12, visible: true },
  { id: 'cat-13', name: 'ছবি', slug: 'photos', order: 13, visible: true },
  { id: 'cat-14', name: 'ভিডিও', slug: 'videos', order: 14, visible: true },
];

// Helper to gather all initial articles
export function getAllInitialArticles(): NewsArticle[] {
  const map = new Map<string, NewsArticle>();

  const list: any[] = [
    leadStory,
    ...sideLeadNews,
    ...gridSectionTwoCards,
    nationalNewsMain,
    ...nationalNewsList,
    politicsFeatured,
    ...politicsList,
    ...internationalNews,
    economyNews.featured,
    ...economyNews.list.map((l, i) => ({
      id: String(l.id),
      title: l.title,
      category: 'অর্থনীতি',
      image: economyNews.featured.image,
      excerpt: l.title,
      content: l.title + ' সম্পর্কিত বিস্তারিত প্রতিবেদন তৈরি হচ্ছে। দেশীয় অর্থনীতি, বাণিজ্য ও আর্থিক খাতের গতিশীলতায় এই অগ্রগতি গুরুত্বপূর্ণ ভূমিকা রাখবে।',
      date: '২১ অগাস্ট ২০২৬',
      author: 'অর্থনীতি ব্যুরো',
      views: 120 + i * 45
    })),
    lawNews.featured,
    ...lawNews.list.map((l, i) => ({
      id: String(l.id),
      title: l.title,
      category: 'আইন-আদালত',
      image: lawNews.featured.image,
      excerpt: l.title,
      content: l.title + ' সম্পর্কিত আইনি প্রতিবেদন ও আদালতের বিচারিক প্রক্রিয়ার সর্বশেষ তথ্য।',
      date: '২১ অগাস্ট ২০২৬',
      author: 'আদালত প্রতিবেদক',
      views: 190 + i * 30
    })),
    entertainmentNews.featured,
    ...entertainmentNews.list.map((l, i) => ({
      id: String(l.id),
      title: l.title,
      category: 'বিনোদন',
      image: entertainmentNews.featured.image,
      excerpt: l.title,
      content: l.title + ' বিষয়ক সাংস্কৃতিক ও বিনোদন জগতের বিশেষ খবর।',
      date: '২১ অগাস্ট ২০২৬',
      author: 'বিনোদন প্রতিবেদক',
      views: 310 + i * 50
    })),
    ...mediaNewsGrid,
    ...sportsList,
    techNews.featured,
    ...techNews.list.map((l, i) => ({
      id: String(l.id),
      title: l.title,
      category: 'তথ্যপ্রযুক্তি',
      image: techNews.featured.image,
      excerpt: l.title,
      content: l.title + ' নিয়ে প্রযুক্তি বিশ্বের সর্বশেষ অগ্রগতি ও বিশ্লেষণ।',
      date: '২১ অগাস্ট ২০২৬',
      author: 'তথ্যপ্রযুক্তি ডেস্ক',
      views: 450 + i * 60
    })),
    educationNews.featured,
    ...educationNews.list.map((l, i) => ({
      id: String(l.id),
      title: l.title,
      category: 'শিক্ষা',
      image: educationNews.featured.image,
      excerpt: l.title,
      content: l.title + ' সম্পর্কিত তথ্য ও শিক্ষা মন্ত্রণালয়ের সাম্প্রতিক বিজ্ঞপ্তি।',
      date: '২১ অগাস্ট ২০২৬',
      author: 'শিক্ষা প্রতিবেদক',
      views: 280 + i * 40
    })),
    opinionNews.featured,
    ...opinionNews.list.map((l, i) => ({
      id: String(l.id),
      title: l.title,
      category: 'মতামত',
      image: opinionNews.featured.image,
      excerpt: l.title,
      content: l.title + ' - বিশিষ্ট কলামিস্ট ও বিশ্লেষকের বিশেষ মতামত ও সম্পাদকীয় কলাম।',
      date: '২১ অগাস্ট ২০২৬',
      author: 'মতামত বিভাগ',
      views: 520 + i * 70
    })),
    ...latestNewsTab,
    ...popularNewsTab
  ];

  list.forEach((art) => {
    if (art && art.id) {
      const stringId = String(art.id);
      if (!map.has(stringId)) {
        map.set(stringId, {
          ...art,
          id: stringId,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  });

  return Array.from(map.values());
}

// Check and seed initial data into Firestore if empty
export async function seedFirestoreIfEmpty(): Promise<boolean> {
  try {
    const articlesCol = collection(db, 'articles');
    const snap = await getDocs(articlesCol);
    
    if (!snap.empty) {
      return false; // Already has data
    }

    console.log('Seeding initial news portal data to Firestore...');
    const batch = writeBatch(db);

    // 1. Seed Site Settings
    const settingsDoc = doc(db, 'site_settings', 'main');
    batch.set(settingsDoc, defaultSettings);

    // 2. Seed Categories
    defaultCategories.forEach((cat) => {
      const catDoc = doc(db, 'categories', cat.id);
      batch.set(catDoc, cat);
    });

    // 3. Seed Ticker items
    tickerNews.forEach((tick) => {
      const tickDoc = doc(db, 'ticker', String(tick.id));
      batch.set(tickDoc, {
        id: String(tick.id),
        title: tick.title,
        articleId: String(tick.id)
      });
    });

    // 4. Seed Photos
    photoGalleryData.forEach((p) => {
      const pDoc = doc(db, 'photos', String(p.id));
      batch.set(pDoc, {
        ...p,
        id: String(p.id)
      });
    });

    // 5. Seed Videos
    videoGalleryData.forEach((v) => {
      const vDoc = doc(db, 'videos', String(v.id));
      batch.set(vDoc, {
        ...v,
        id: String(v.id)
      });
    });

    // 6. Seed Family Members (আমাদের পরিবার)
    defaultFamilyMembers.forEach((member) => {
      const memberDoc = doc(db, 'family_members', member.id);
      batch.set(memberDoc, member);
    });

    // 7. Seed Articles (batch limit is 500)
    const initialArticles = getAllInitialArticles();
    initialArticles.slice(0, 430).forEach((art) => {
      const artDoc = doc(db, 'articles', art.id);
      batch.set(artDoc, art);
    });

    await batch.commit();
    console.log('Initial seeding completed successfully!');
    return true;
  } catch (err) {
    console.error('Error seeding Firestore:', err);
    return false;
  }
}

// ----------------------------------------------------
// REALTIME SUBSCRIPTIONS
// ----------------------------------------------------

export function subscribeToArticles(callback: (articles: NewsArticle[]) => void) {
  const q = query(collection(db, 'articles'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: NewsArticle[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as NewsArticle), id: docSnap.id });
      });
      callback(list);
    },
    (err) => {
      console.error('Articles subscription error:', err);
    }
  );
}

export function subscribeToSiteSettings(callback: (settings: SiteSettings) => void) {
  const docRef = doc(db, 'site_settings', 'main');
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ ...defaultSettings, ...(snapshot.data() as SiteSettings) });
      } else {
        callback(defaultSettings);
      }
    },
    (err) => {
      console.error('Site settings subscription error:', err);
    }
  );
}

export function subscribeToCategories(callback: (categories: CategoryItem[]) => void) {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: CategoryItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as CategoryItem), id: docSnap.id });
      });
      callback(list);
    },
    (err) => {
      console.error('Categories subscription error:', err);
    }
  );
}

export function subscribeToTicker(callback: (ticker: TickerItem[]) => void) {
  const q = query(collection(db, 'ticker'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: TickerItem[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as TickerItem), id: docSnap.id });
      });
      callback(list);
    },
    (err) => {
      console.error('Ticker subscription error:', err);
    }
  );
}

export function subscribeToPhotos(callback: (photos: PhotoSlide[]) => void) {
  const q = query(collection(db, 'photos'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: PhotoSlide[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as PhotoSlide), id: docSnap.id });
      });
      callback(list);
    },
    (err) => {
      console.error('Photos subscription error:', err);
    }
  );
}

export function subscribeToVideos(callback: (videos: VideoSlide[]) => void) {
  const q = query(collection(db, 'videos'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: VideoSlide[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as VideoSlide), id: docSnap.id });
      });
      callback(list);
    },
    (err) => {
      console.error('Videos subscription error:', err);
    }
  );
}

// ----------------------------------------------------
// AUTO-SAVE / CRUD OPERATIONS
// ----------------------------------------------------

export async function saveArticleToDb(article: Partial<NewsArticle> & { title: string }): Promise<string> {
  const id = article.id || 'news-' + Date.now();
  const artRef = doc(db, 'articles', id);
  const now = new Date().toISOString();

  const dataToSave: NewsArticle = {
    id,
    title: article.title || '',
    category: article.category || 'জাতীয়',
    subcategory: article.subcategory || '',
    image: article.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    fallbackImage: article.fallbackImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    excerpt: article.excerpt || article.content?.slice(0, 150) || '',
    content: article.content || '',
    date: article.date || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: article.author || 'অনলাইন ডেস্ক',
    views: typeof article.views === 'number' ? article.views : Math.floor(Math.random() * 200) + 10,
    featured: Boolean(article.featured),
    lead: Boolean(article.lead),
    isTicker: Boolean(article.isTicker),
    status: article.status || 'published',
    createdAt: article.createdAt || now,
    updatedAt: now,
  };

  await setDoc(artRef, dataToSave, { merge: true });

  // If lead is selected, we can also ensure uniqueness if needed
  // If isTicker is selected, also update ticker collection
  if (dataToSave.isTicker) {
    const tickRef = doc(db, 'ticker', id);
    await setDoc(tickRef, { id, title: dataToSave.title, articleId: id }, { merge: true });
  }

  return id;
}

export async function deleteArticleFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, 'articles', id));
  try {
    await deleteDoc(doc(db, 'ticker', id));
  } catch (e) {
    // Ignore if not in ticker
  }
}

export async function saveSiteSettingsToDb(settings: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, 'site_settings', 'main');
  await setDoc(docRef, settings, { merge: true });
}

export async function saveCategoryToDb(category: CategoryItem): Promise<void> {
  const docRef = doc(db, 'categories', category.id);
  await setDoc(docRef, category, { merge: true });
}

export async function deleteCategoryFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id));
}

export async function savePhotoToDb(photo: Partial<PhotoSlide>): Promise<string> {
  const id = photo.id || 'photo-' + Date.now();
  const docRef = doc(db, 'photos', id);
  const data: PhotoSlide = {
    id,
    title: photo.title || 'ছবির শিরোনাম',
    caption: photo.caption || photo.title || '',
    image: photo.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    date: photo.date || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
  };
  await setDoc(docRef, data, { merge: true });
  return id;
}

export async function deletePhotoFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, 'photos', id));
}

export async function saveVideoToDb(video: Partial<VideoSlide>): Promise<string> {
  const id = video.id || 'video-' + Date.now();
  const docRef = doc(db, 'videos', id);
  const data: VideoSlide = {
    id,
    title: video.title || 'ভিডিওর শিরোনাম',
    videoId: video.videoId || 'FAt1d11UOg8',
    thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
    date: video.date || new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
  };
  await setDoc(docRef, data, { merge: true });
  return id;
}

export async function deleteVideoFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, 'videos', id));
}

export async function saveTickerItemToDb(item: Partial<TickerItem>): Promise<string> {
  const id = item.id || 'ticker-' + Date.now();
  const docRef = doc(db, 'ticker', id);
  await setDoc(docRef, { id, title: item.title, articleId: item.articleId || id }, { merge: true });
  return id;
}

export async function deleteTickerItemFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, 'ticker', id));
}

export function subscribeToFamilyMembers(callback: (members: FamilyMember[]) => void) {
  const q = query(collection(db, 'family_members'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: FamilyMember[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as FamilyMember), id: docSnap.id });
      });
      callback(list);
    },
    (err) => {
      console.error('Family members subscription error:', err);
    }
  );
}

export async function saveFamilyMemberToDb(member: Partial<FamilyMember>): Promise<string> {
  const id = member.id || 'fam-' + Date.now();
  const docRef = doc(db, 'family_members', id);
  const data: FamilyMember = {
    id,
    name: member.name || 'সদস্যের নাম',
    designation: member.designation || 'বার্তা ইনচার্জ',
    image: member.image || 'https://newssitedesign.com/professionalnews/wp-content/uploads/2018/01/Blank-Image-1.png',
    phone: member.phone || '',
    email: member.email || '',
    bio: member.bio || '',
    order: typeof member.order === 'number' ? member.order : Date.now(),
  };
  await setDoc(docRef, data, { merge: true });
  return id;
}

export async function deleteFamilyMemberFromDb(id: string): Promise<void> {
  await deleteDoc(doc(db, 'family_members', id));
}
