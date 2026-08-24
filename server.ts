import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import firebaseConfig from './firebase-applet-config.json';
import {
  leadStory,
  sideLeadNews,
  gridSectionTwoCards,
  nationalNewsMain,
  nationalNewsList,
  internationalNews,
  economyNews,
  lawNews,
  entertainmentNews,
  mediaNewsGrid,
  sportsList,
  techNews,
  educationNews,
  opinionNews,
  tickerNews,
} from './src/data/newsData';

const PORT = 3000;
const DEFAULT_SITE_TITLE = 'Doyel Television | দোয়েল টেলিভিশন';
const DEFAULT_DESCRIPTION = 'স্বাধীন ও নিরপেক্ষ বাংলা অনলাইন নিউজ পোর্টাল - দেশ ও বিদেশের সর্বশেষ তাজা খবর ও বিশ্লেষণ।';
const DEFAULT_LOGO = 'https://i.postimg.cc/y6nK7ZK6/20260818-233206.png';

interface ArticleMeta {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  fallbackImage?: string;
  category?: string;
  author?: string;
  date?: string;
}

// Memory cache for articles to ensure sub-millisecond response for social scrapers
const articleCache = new Map<string, { data: ArticleMeta; expires: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncateText(text: string, maxLength: number = 180): string {
  if (!text) return '';
  const clean = text.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength).trim() + '...';
}

// Look up static/default fallback articles by id or title
function findLocalArticle(idOrTitle: string): ArticleMeta | null {
  const norm = decodeURIComponent(idOrTitle).trim();
  const allDefaultArticles: ArticleMeta[] = [
    leadStory,
    ...sideLeadNews,
    ...gridSectionTwoCards,
    nationalNewsMain,
    ...nationalNewsList,
    ...internationalNews,
    economyNews.featured,
    ...economyNews.list,
    lawNews.featured,
    ...lawNews.list,
    entertainmentNews.featured,
    ...entertainmentNews.list,
    ...mediaNewsGrid,
    ...sportsList,
    techNews.featured,
    ...techNews.list,
    educationNews.featured,
    ...educationNews.list,
    opinionNews.featured,
    ...opinionNews.list,
  ];

  const found = allDefaultArticles.find(
    (a) => String(a.id) === norm || a.title === norm
  );
  if (found) return found;

  const ticker = tickerNews.find((t) => String(t.id) === norm || t.title === norm);
  if (ticker) {
    return {
      id: ticker.id,
      title: ticker.title,
      excerpt: `${ticker.title} - দোয়েল টেলিভিশন ব্রেকিং নিউজ`,
      content: `${ticker.title} - দোয়েল টেলিভিশন পোর্টাল।`,
      category: 'সর্বশেষ',
      image: DEFAULT_LOGO,
    };
  }

  return null;
}

// Fetch article directly from Firestore REST API
async function fetchArticleFromFirestore(idOrTitle: string): Promise<ArticleMeta | null> {
  const norm = decodeURIComponent(idOrTitle).trim();

  // Check cache first
  const cached = articleCache.get(norm);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  // 1. Try local fallback first if standard ID
  const local = findLocalArticle(norm);

  try {
    const projectId = firebaseConfig.projectId;
    const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
    const apiKey = firebaseConfig.apiKey;

    // Try fetching document directly by ID
    const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/articles/${encodeURIComponent(norm)}?key=${apiKey}`;
    const docRes = await fetch(docUrl, { headers: { 'Accept': 'application/json' } });

    if (docRes.ok) {
      const json: any = await docRes.json();
      if (json && json.fields) {
        const fields = json.fields;
        const article: ArticleMeta = {
          id: norm,
          title: fields.title?.stringValue || norm,
          excerpt: fields.excerpt?.stringValue || '',
          content: fields.content?.stringValue || '',
          image: fields.image?.stringValue || '',
          fallbackImage: fields.fallbackImage?.stringValue || '',
          category: fields.category?.stringValue || 'জাতীয়',
          author: fields.author?.stringValue || 'অনলাইন ডেস্ক',
          date: fields.date?.stringValue || '',
        };
        articleCache.set(norm, { data: article, expires: Date.now() + CACHE_TTL_MS });
        return article;
      }
    }

    // If direct doc lookup didn't match, query the articles collection
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:runQuery?key=${apiKey}`;
    const queryBody = {
      structuredQuery: {
        from: [{ collectionId: 'articles' }],
        limit: 100,
      },
    };

    const queryRes = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody),
    });

    if (queryRes.ok) {
      const results: any[] = await queryRes.json();
      for (const item of results) {
        if (item.document && item.document.fields) {
          const f = item.document.fields;
          const docId = item.document.name.split('/').pop() || '';
          const docTitle = f.title?.stringValue || '';

          const match =
            docId === norm ||
            docTitle === norm ||
            docId.toLowerCase() === norm.toLowerCase() ||
            encodeURIComponent(docId) === encodeURIComponent(norm);

          if (match) {
            const article: ArticleMeta = {
              id: docId,
              title: docTitle,
              excerpt: f.excerpt?.stringValue || '',
              content: f.content?.stringValue || '',
              image: f.image?.stringValue || '',
              fallbackImage: f.fallbackImage?.stringValue || '',
              category: f.category?.stringValue || 'জাতীয়',
              author: f.author?.stringValue || 'অনলাইন ডেস্ক',
              date: f.date?.stringValue || '',
            };
            articleCache.set(norm, { data: article, expires: Date.now() + CACHE_TTL_MS });
            return article;
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching article from Firestore in server:', err);
  }

  // Fallback to local default article
  if (local) {
    articleCache.set(norm, { data: local, expires: Date.now() + CACHE_TTL_MS });
    return local;
  }

  return null;
}

// Generate the complete HTML meta block for Open Graph & Twitter Cards
function generateMetaTagsHtml(params: {
  article: ArticleMeta | null;
  category?: string;
  fullUrl: string;
}): string {
  const { article, category, fullUrl } = params;

  let pageTitle = DEFAULT_SITE_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let imageUrl = DEFAULT_LOGO;
  let ogType = 'website';
  let author = 'দোয়েল টেলিভিশন';
  let section = '';

  if (article) {
    pageTitle = `${article.title} | দোয়েল টেলিভিশন`;
    description = truncateText(article.excerpt || article.content || DEFAULT_DESCRIPTION, 200);
    imageUrl = article.image || article.fallbackImage || DEFAULT_LOGO;
    ogType = 'article';
    author = article.author || 'অনলাইন ডেস্ক';
    section = article.category || 'সংবাদ';
  } else if (category && category !== 'প্রচ্ছদ') {
    pageTitle = `${category} - সর্বশেষ সংবাদ | দোয়েল টেলিভিশন`;
    description = `${category} বিভাগের দেশ-বিদেশের ব্রেকিং ও তাজা খবর পড়ুন দোয়েল টেলিভিশন পোর্টালে।`;
  }

  // Ensure image URL is absolute
  if (imageUrl.startsWith('/')) {
    const urlObj = new URL(fullUrl);
    imageUrl = `${urlObj.origin}${imageUrl}`;
  }

  return `
    <!-- Primary Meta Tags -->
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="title" content="${escapeHtml(pageTitle)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${escapeHtml(author)}" />
    <link rel="canonical" href="${escapeHtml(fullUrl)}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${escapeHtml(ogType)}" />
    <meta property="og:url" content="${escapeHtml(fullUrl)}" />
    <meta property="og:site_name" content="Doyel Television | দোয়েল টেলিভিশন" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(pageTitle)}" />
    <meta property="og:locale" content="bn_BD" />
    ${
      article
        ? `
    <meta property="article:published_time" content="${new Date().toISOString()}" />
    <meta property="article:author" content="${escapeHtml(author)}" />
    <meta property="article:section" content="${escapeHtml(section)}" />`
        : ''
    }

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(fullUrl)}" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(pageTitle)}" />
  `;
}

// Injects dynamic meta tags into the template HTML head
function injectMetaTags(html: string, metaSnippet: string): string {
  // Remove existing title, description, and og/twitter meta tags to prevent duplicates
  let cleaned = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name=["'](description|title|author|twitter:[^"']+)["'][^>]*>/gi, '')
    .replace(/<meta\s+property=["'](og:[^"']+|article:[^"']+)["'][^>]*>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');

  // Inject right after <head>
  return cleaned.replace('<head>', `<head>\n${metaSnippet}`);
}

async function startServer() {
  const app = express();

  // Basic API routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Diagnostic API to verify Open Graph meta tags for any article or URL
  app.get('/api/og-preview', async (req: Request, res: Response) => {
    const id = (req.query.id as string) || '';
    if (!id) {
      return res.status(400).json({ error: 'Article ID or query parameter "id" is required' });
    }

    const article = await fetchArticleFromFirestore(id);
    const origin = `${req.protocol}://${req.get('host') || 'localhost:3000'}`;
    const fullUrl = `${origin}/news/${encodeURIComponent(id)}`;
    const metaSnippet = generateMetaTagsHtml({ article, fullUrl });

    res.json({
      success: true,
      articleFound: !!article,
      article,
      fullUrl,
      metaTagsHtml: metaSnippet,
    });
  });

  let vite: any;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
  }

  // Handle all HTML page requests and dynamically render Open Graph meta tags
  app.get('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    // Skip static assets or API requests
    if (
      url.startsWith('/api/') ||
      url.match(/\.(js|ts|tsx|jsx|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|json|map)$/i)
    ) {
      return next();
    }

    try {
      const origin = `${req.protocol}://${req.get('host') || 'localhost:3000'}`;
      const fullUrl = `${origin}${url}`;

      let article: ArticleMeta | null = null;
      let category = '';

      // Check if URL matches /news/:id or /article/:id or query ?article=
      const decodedPath = decodeURIComponent(url.split('?')[0]);
      const newsMatch = decodedPath.match(/^\/(?:news|article)\/([^/]+)/);

      if (newsMatch && newsMatch[1]) {
        const rawId = newsMatch[1].trim();
        article = await fetchArticleFromFirestore(rawId);
      } else if (req.query.article) {
        const rawId = String(req.query.article).trim();
        article = await fetchArticleFromFirestore(rawId);
      } else {
        // Check if category route (e.g. /জাতীয়, /রাজনীতি)
        const catSlug = decodedPath.replace(/^\/+/, '').trim();
        if (catSlug && catSlug !== 'admin' && catSlug !== 'wp-admin') {
          category = catSlug;
        }
      }

      const metaSnippet = generateMetaTagsHtml({
        article,
        category,
        fullUrl,
      });

      let templateHtml = '';
      if (!isProd && vite) {
        const indexPath = path.join(process.cwd(), 'index.html');
        const rawHtml = fs.readFileSync(indexPath, 'utf-8');
        templateHtml = await vite.transformIndexHtml(url, rawHtml);
      } else {
        const indexPath = path.join(process.cwd(), 'dist', 'index.html');
        if (fs.existsSync(indexPath)) {
          templateHtml = fs.readFileSync(indexPath, 'utf-8');
        } else {
          templateHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        }
      }

      const finalHtml = injectMetaTags(templateHtml, metaSnippet);
      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(finalHtml);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error('Server HTML render error:', e);
      next(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server with dynamic Open Graph rendering active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
