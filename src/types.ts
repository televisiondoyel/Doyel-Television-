export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  image: string;
  fallbackImage?: string;
  excerpt: string;
  content: string;
  date: string;
  author?: string;
  imageCaption?: string;
  views?: number;
  featured?: boolean;
  lead?: boolean;
  isTicker?: boolean;
  status?: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface PhotoSlide {
  id: string;
  title: string;
  image: string;
  caption: string;
  date?: string;
}

export interface VideoSlide {
  id: string;
  title: string;
  videoId: string;
  thumbnail?: string;
  date?: string;
}

export interface TickerItem {
  id: string;
  title: string;
  articleId?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  order: number;
  visible: boolean;
  description?: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteTagline: string;
  siteLogo?: string;
  editorName: string;
  publisherName: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  headerNotice: string;
  tickerTitle: string;
  footerText: string;
  headerAdImage?: string;
  headerAdUrl?: string;
  sidebarAdImage?: string;
  sidebarAdUrl?: string;
  bodyAdImage?: string;
  bodyAdUrl?: string;
  adminName?: string;
  adminEmail?: string;
  adminAvatar?: string;
  adminBio?: string;
  adminPhone?: string;
  adminDesignation?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  designation: string;
  image: string;
  phone?: string;
  email?: string;
  bio?: string;
  order?: number;
}

