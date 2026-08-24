import { NewsArticle, SiteSettings } from '../types';

/**
 * Utility to dynamically update client-side DOM meta tags for Open Graph,
 * Twitter Cards, canonical link, and page title during SPA navigation.
 */
export function updateMetaTags(
  article: NewsArticle | null,
  categoryName?: string,
  settings?: SiteSettings
) {
  if (typeof document === 'undefined') return;

  const defaultSiteName = 'Doyel Television | দোয়েল টেলিভিশন';
  const defaultTagline = settings?.siteTagline || 'স্বাধীন ও নিরপেক্ষ বাংলা অনলাইন নিউজ পোর্টাল';
  const defaultLogo = settings?.siteLogo || 'https://i.postimg.cc/y6nK7ZK6/20260818-233206.png';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  let title = defaultSiteName;
  let description = defaultTagline;
  let imageUrl = defaultLogo;
  let pageUrl = baseUrl;
  let ogType = 'website';
  let author = 'অনলাইন ডেস্ক';
  let category = '';

  if (article) {
    title = `${article.title} - দোয়েল টেলিভিশন`;
    description = article.excerpt || article.content?.slice(0, 160) || defaultTagline;
    imageUrl = article.image || article.fallbackImage || defaultLogo;
    pageUrl = `${baseUrl}/news/${encodeURIComponent(article.id)}`;
    ogType = 'article';
    author = article.author || 'অনলাইন ডেস্ক';
    category = article.category || '';
  } else if (categoryName && categoryName !== 'প্রচ্ছদ') {
    title = `${categoryName} | ${defaultSiteName}`;
    description = `${categoryName} বিভাগের সর্বশেষ সংবাদ ও খবরাখবর পড়ুন দোয়েল টেলিভিশন পোর্টালে।`;
    pageUrl = `${baseUrl}/${encodeURIComponent(categoryName)}`;
  }

  // 1. Update Document Title
  document.title = title;

  // Helper to set or create a meta tag
  const setMetaTag = (attrName: 'name' | 'property', attrValue: string, content: string) => {
    let element = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMetaTag('name', 'description', description);
  setMetaTag('name', 'author', author);

  // Open Graph / Facebook Meta Tags
  setMetaTag('property', 'og:type', ogType);
  setMetaTag('property', 'og:site_name', defaultSiteName);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:image:secure_url', imageUrl);
  setMetaTag('property', 'og:url', pageUrl);
  setMetaTag('property', 'og:locale', 'bn_BD');

  // Article Specific Tags
  if (article) {
    setMetaTag('property', 'article:author', author);
    if (category) setMetaTag('property', 'article:section', category);
  }

  // Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', imageUrl);

  // Canonical Link
  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', pageUrl);
}
