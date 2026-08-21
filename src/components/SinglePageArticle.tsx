import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
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

interface SinglePageArticleProps {
  article: NewsArticle;
  onClose: () => void;
  onSelectArticle: (idOrTitle: string | number) => void;
}

interface CommentItem {
  id: string;
  name: string;
  email: string;
  comment: string;
  date: string;
}

export const SinglePageArticle: React.FC<SinglePageArticleProps> = ({
  article,
  onClose,
  onSelectArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: '1',
      name: 'মোঃ রফিকুল ইসলাম',
      email: 'rafiq@example.com',
      comment: 'খুবই সময়োপযোগী ও বস্তুনিষ্ঠ প্রতিবেদন। ধন্যবাদ প্রফেশনাল নিউজ টিমকে।',
      date: 'আজ, ১০:১৫ পূর্বাহ্ন',
    },
  ]);

  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorWebsite, setAuthorWebsite] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Handle comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    const newComment: CommentItem = {
      id: String(Date.now()),
      name: authorName.trim(),
      email: authorEmail.trim(),
      comment: commentText.trim(),
      date: 'এইমাত্র',
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  // 6 Related Articles for the bottom grid
  const relatedArticles: NewsArticle[] = [
    sideLeadNews[0] || leadStory,
    sideLeadNews[1] || leadStory,
    sideLeadNews[2] || leadStory,
    sideLeadNews[3] || leadStory,
    gridSectionTwoCards[0] || leadStory,
    gridSectionTwoCards[1] || leadStory,
  ];

  // Latest 10 tab items
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

  // Popular tab items
  const popularTabArticles = [
    leadStory,
    ...sideLeadNews,
    ...gridSectionTwoCards.slice(0, 3),
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article.title;

  return (
    <section className="singlepage-section my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols in 12-grid) */}
        <div className="lg:col-span-8">
          {/* Top Advertisement Banner */}
          <div className="biggapon mb-4">
            <div className="widget_area">
              <a
                href="https://themesbazar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-[#004F8A] to-[#1F4565] text-white p-3 sm:p-4 text-center rounded border border-[#004F8A] shadow-xs hover:opacity-95 transition-opacity"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider bg-red-600 px-2 py-0.5 rounded font-bold text-white">
                      বিজ্ঞাপন
                    </span>
                    <h4 className="font-bold text-base sm:text-lg text-white mt-1">ThemesBazar.Com</h4>
                    <p className="text-xs text-blue-100">প্রফেশনাল ওয়ার্ডপ্রেস নিউজ থিম ও ডেভেলপমেন্ট সার্ভিস</p>
                  </div>
                  <span className="bg-white text-[#004F8A] font-bold text-xs px-4 py-2 rounded shadow-xs hover:bg-gray-100 transition-colors">
                    ভিজিট করুন
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="single-cat-info flex items-center gap-3 text-sm pb-2 mb-3 border-b border-gray-200">
            <div className="single-cat-home">
              <button
                onClick={onClose}
                className="text-[#004F8A] hover:text-[#9A1515] font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa fa-home" aria-hidden="true"></i> প্রচ্ছদ
              </button>
            </div>
            <span className="text-gray-400">/</span>
            <div className="single-cat-cate text-[#004F8A] font-semibold flex items-center gap-1.5">
              <i className="fa fa-bars" aria-hidden="true"></i>
              <span>{article.category || 'লিড নিউজ'}</span>
            </div>
          </div>

          {/* Single Title */}
          <div className="single-title mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#111] leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Reporter & Update Metadata Section */}
          <div className="view-section border-y border-gray-200 py-3 my-3 bg-[#FCFCFC] px-2 sm:px-3 rounded">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-300 bg-white p-0.5">
                <img
                  src="https://newssitedesign.com/professionalnews/wp-content/themes/ProfessionalNews/images/noimagee.gif"
                  alt="Reporter Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="reportar-sec flex-1">
                <div className="reportar-title text-base font-bold text-[#004F8A]">
                  {article.author || 'রিপোর্টারের নাম'}
                </div>
                <div className="sgl-page-views-count mt-1">
                  <ul className="flex flex-wrap items-center gap-4 text-xs sm:text-[13px] text-gray-600">
                    <li className="flex items-center gap-1.5">
                      <i className="fa fa-clock-o text-[#004F8A]"></i>
                      <span>আপডেট টাইম : {article.date || 'শুক্রবার, ২১ অগাস্ট ২০২৬'}</span>
                    </li>
                    <li className="active flex items-center gap-1.5 bg-red-50 text-[#9A1515] px-2 py-0.5 rounded font-semibold border border-red-100">
                      <i className="fa fa-eye"></i>
                      <span>
                        {typeof article.views === 'number'
                          ? String(article.views)
                              .replace(/0/g, '০')
                              .replace(/1/g, '১')
                              .replace(/2/g, '২')
                              .replace(/3/g, '৩')
                              .replace(/4/g, '৪')
                              .replace(/5/g, '৫')
                              .replace(/6/g, '৬')
                              .replace(/7/g, '৭')
                              .replace(/8/g, '৮')
                              .replace(/9/g, '৯')
                          : article.views || '৮৫০'}
                      </span>
                      <span>বার</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image with Caption */}
          <div className="single-img my-4 bg-gray-100 rounded overflow-hidden border border-gray-200">
            <div className="w-full aspect-video bg-gray-200">
              <ImageWithFallback
                src={article.image}
                fallbackSrc={article.fallbackImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="caption bg-[#F0F0F0] px-3 py-2 text-xs sm:text-sm text-gray-700 border-l-4 border-[#004F8A] font-medium flex items-center justify-between">
              <span>ফাইল ছবি</span>
              <span className="text-[11px] text-gray-500">{article.category}</span>
            </div>
          </div>

          {/* Article Excerpt Highlight (if present) */}
          {article.excerpt && (
            <div className="bg-[#F4F8FC] border-l-4 border-[#004F8A] p-3 sm:p-4 my-4 text-gray-800 font-semibold text-base sm:text-lg leading-relaxed rounded-r shadow-2xs">
              {article.excerpt}
            </div>
          )}

          {/* Article Full Details */}
          <div className="single-dtls text-gray-800 text-base sm:text-lg leading-[1.8] space-y-4 my-5 text-justify">
            {article.content ? (
              article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="indent-4 sm:indent-6">
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="indent-4 sm:indent-6">
                  {article.excerpt ||
                    'ভারতের অন্যতম রাজনৈতিক দল জাতীয় কংগ্রেসের সভাপতি পদে রাহুল গান্ধীকে বসানোর প্রস্তাব পাস করেছে দলটির ওয়ার্কিং কমিটি।'}
                </p>
                <p className="indent-4 sm:indent-6">
                  সোমবার নয়াদিল্লিতে কংগ্রেস সভানেত্রী সোনিয়া গান্ধীর ১০ জনপথের বাড়িতে বৈঠক বসে কংগ্রেস ওয়ার্কিং কমিটির। ওই বৈঠকেই রাহুল গান্ধীকে সভাপতি পদে বসাতে প্রস্তাব পাস হয়।
                </p>
                <p className="indent-4 sm:indent-6">
                  কংগ্রেসের বর্তমান সভানেত্রী সোনিয়া গান্ধী বলেন, ‘রাহুল সভাপতি হলে দল আরও শক্তিশালী হবে। কংগ্রেসের পক্ষ থেকে জানানো হয়েছে, সাংগঠনিক নির্বাচনের বিজ্ঞপ্তি জারি করা হবে এবং নির্ধারিত সময়ের মধ্যেই পূর্ণাঙ্গ নেতৃত্ব দায়িত্ব নেবে।’
                </p>
                <p className="indent-4 sm:indent-6">
                  এদিন কংগ্রেসের ওয়ার্কিং কমিটির বৈঠকে উপস্থিত ছিলেন ভারতের প্রাক্তন প্রধানমন্ত্রী মনমোহন সিং, মল্লিকার্জুন খাড়গে, আহমেদ পটেলসহ কংগ্রেসের প্রথম সারির জাতীয় নেতৃবৃন্দ।
                </p>
              </>
            )}
          </div>

          {/* Middle Advertisement */}
          <div className="add my-6">
            <div className="widget_area">
              <a
                href="https://themesbazar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-[#8B0708] to-[#9A1515] text-white p-3.5 text-center rounded border border-red-700 shadow-xs hover:opacity-95 transition-opacity"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider bg-yellow-400 text-black px-2 py-0.5 rounded font-bold">
                      বিজ্ঞাপন
                    </span>
                    <p className="font-bold text-sm sm:text-base mt-1">
                      অনলাইন নিউজ পোর্টাল তৈরিতে বিশ্বস্ত প্রতিষ্ঠান — ThemesBazar
                    </p>
                  </div>
                  <span className="bg-white text-[#8B0708] font-bold text-xs px-3.5 py-1.5 rounded shadow-xs">
                    বিস্তারিত জানুন
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Social Share Section */}
          <div className="sgl-page-social-wrapper my-6 pt-4 border-t border-gray-200">
            <div className="sgl-page-social-title mb-3">
              <h4 className="text-lg font-bold text-[#222] border-b-2 border-[#004F8A] pb-1.5 inline-block">
                নিউজটি শেয়ার করুন..
              </h4>
            </div>

            <div className="sgl-page-social">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a
                    href={`http://www.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ffacebook bg-[#3B5998] hover:bg-[#2d4373] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <i className="fa fa-facebook"></i> Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={`https://twitter.com/share?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ttwitter bg-[#1DA1F2] hover:bg-[#0c85d0] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <i className="fa fa-twitter"></i> Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={`http://digg.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="digg bg-[#005BE2] hover:bg-[#0047b3] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <i className="fa fa-digg"></i> Digg
                  </a>
                </li>
                <li>
                  <a
                    href={`http://www.linkedin.com/shareArticle?mini=true&title=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin bg-[#0077B5] hover:bg-[#005a8c] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <i className="fa fa-linkedin"></i> Linkedin
                  </a>
                </li>
                <li>
                  <a
                    href={`http://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reddit bg-[#FF4500] hover:bg-[#cc3700] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <i className="fa fa-reddit"></i> Reddit
                  </a>
                </li>
                <li>
                  <a
                    href={`https://plus.google.com/share?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-plus bg-[#DB4437] hover:bg-[#c23321] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <i className="fa fa-google-plus"></i> Google Plus
                  </a>
                </li>
                <li>
                  <a
                    href={`http://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(article.image || '')}&description=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pinterest bg-[#BD081C] hover:bg-[#960616] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <i className="fa fa-pinterest"></i> Pinterest
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => window.print()}
                    className="print bg-[#555555] hover:bg-[#333333] text-white text-xs sm:text-sm px-3 py-1.5 rounded flex items-center gap-1.5 font-medium cursor-pointer transition-colors"
                  >
                    <i className="fa fa-print"></i> Print
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Comments Section */}
          <div id="respond" className="comment-respond bg-[#F9F9F9] p-4 sm:p-5 rounded border border-gray-200 my-6">
            <h3 id="reply-title" className="comment-reply-title text-xl font-bold text-gray-800 mb-1 border-b border-gray-300 pb-2">
              মন্তব্য করুন (Leave a Reply)
            </h3>
            <p className="comment-notes text-xs text-gray-500 mb-4 mt-2">
              আপনার ইমেইল ঠিকানা প্রকাশ করা হবে না। চিহ্নিত ক্ষেত্রগুলো পূরণ আবশ্যক <span className="text-red-600 font-bold">*</span>
            </p>

            {commentSubmitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm mb-4">
                ধন্যবাদ! আপনার মন্তব্যটি সফলভাবে যুক্ত হয়েছে।
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="comment-form space-y-3">
              <div className="comment-form-comment">
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-1">
                  মন্তব্য (Comment) <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  cols={45}
                  rows={4}
                  required
                  placeholder="আপনার সুচিন্তিত মতামত লিখুন..."
                  className="w-full p-2.5 text-sm bg-white border border-gray-300 rounded focus:border-[#004F8A] focus:outline-hidden"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="comment-form-author">
                  <label htmlFor="author" className="block text-xs font-semibold text-gray-700 mb-1">
                    নাম (Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="author"
                    name="author"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    placeholder="আপনার নাম"
                    className="w-full p-2 text-xs bg-white border border-gray-300 rounded focus:border-[#004F8A] focus:outline-hidden"
                  />
                </div>

                <div className="comment-form-email">
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                    ইমেইল (Email) <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    required
                    placeholder="example@mail.com"
                    className="w-full p-2 text-xs bg-white border border-gray-300 rounded focus:border-[#004F8A] focus:outline-hidden"
                  />
                </div>

                <div className="comment-form-url">
                  <label htmlFor="url" className="block text-xs font-semibold text-gray-700 mb-1">
                    ওয়েবসাইট (Website)
                  </label>
                  <input
                    id="url"
                    name="url"
                    type="text"
                    value={authorWebsite}
                    onChange={(e) => setAuthorWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full p-2 text-xs bg-white border border-gray-300 rounded focus:border-[#004F8A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="form-submit pt-2">
                <button
                  type="submit"
                  id="submit"
                  className="bg-[#004F8A] hover:bg-[#1F4565] text-white font-bold text-sm px-5 py-2 rounded cursor-pointer transition-colors shadow-xs"
                >
                  Post Comment (মন্তব্য পাঠান)
                </button>
              </div>
            </form>

            {/* Displayed User Comments */}
            {comments.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-700 mb-3">পূর্ববর্তী মন্তব্যসমূহ ({comments.length})</h4>
                <div className="space-y-3">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-white p-3 rounded border border-gray-200 text-xs sm:text-sm">
                      <div className="flex items-center justify-between text-gray-600 mb-1">
                        <span className="font-bold text-[#004F8A]">{c.name}</span>
                        <span className="text-[11px] text-gray-400">{c.date}</span>
                      </div>
                      <p className="text-gray-800">{c.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related News Section "এ জাতীয় আরো খবর.." */}
          <div className="related-news-section my-6">
            <div className="sgl-cat-tittle bg-[#F7F7F7] p-2.5 text-[#222] font-bold text-lg border-l-4 border-[#F90202] mb-4">
              এ জাতীয় আরো খবর..
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedArticles.map((relItem) => (
                <div
                  key={relItem.id}
                  onClick={() => onSelectArticle(relItem.id)}
                  className="Name-again box-shadow bg-white border border-gray-200 p-2 rounded shadow-2xs hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between"
                >
                  <div className="image-again">
                    <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-2">
                      <ImageWithFallback
                        src={relItem.image}
                        fallbackSrc={relItem.fallbackImage}
                        alt={relItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="sgl-hadding font-bold text-sm sm:text-[14.5px] text-[#222] group-hover:text-[#9A1515] transition-colors leading-snug line-clamp-2">
                      {relItem.title}
                    </h4>
                  </div>
                  <div className="mt-2 pt-1 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span className="text-[#004F8A] font-semibold">{relItem.category}</span>
                    <span>{relItem.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Advertisement Banner */}
          <div className="add my-6">
            <div className="widget_area">
              <a
                href="https://themesbazar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-[#1F4565] to-[#004F8A] text-white p-3 sm:p-4 text-center rounded border border-[#1F4565] shadow-xs hover:opacity-95 transition-opacity"
              >
                <p className="font-bold text-sm sm:text-base">
                  আপনার অনলাইন নিউজ পোর্টালকে আরও আকর্ষণীয় ও আধুনিক রূপ দিতে আজই যোগাযোগ করুন
                </p>
                <span className="inline-block mt-1 text-xs bg-yellow-400 text-black font-bold px-3 py-1 rounded">
                  ThemesBazar.Com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column / Sidebar (4 cols in 12-grid) */}
        <div className="lg:col-span-4">
          <div className="tab-header bg-white border border-gray-200 rounded p-3 shadow-xs">
            {/* Tab Navigation */}
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

            {/* Tab Panes - 4 items visible, scroll for remaining */}
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

          {/* Social Box Widget in Sidebar */}
          <div className="social-widget mt-4 bg-white border border-gray-200 rounded p-3 shadow-xs">
            <div className="facebook_title bg-[#F7F7F7] p-2 text-sm font-bold text-gray-800 border-l-4 border-[#F90202] mb-3">
              ফেইসবুকে আমরা
            </div>
            <div className="bg-[#1877F2] text-white p-3 rounded text-center">
              <i className="fa fa-facebook-square text-3xl mb-1"></i>
              <p className="font-bold text-sm">Professional News Portal</p>
              <p className="text-[11px] text-blue-100 mb-2">৫২,৪০০ লাইক • ফেসবুক পেজ ফলো করুন</p>
              <a
                href="https://facebook.com/themesbazar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#1877F2] text-xs font-bold px-3 py-1.5 rounded shadow-xs hover:bg-gray-100 transition-colors"
              >
                লাইক পেজ
              </a>
            </div>
          </div>

          {/* Additional Sidebar Ad */}
          <div className="sidebar-ad mt-4">
            <a
              href="https://themesbazar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#1F4565] text-white p-4 rounded text-center border border-blue-900 shadow-xs hover:opacity-95 transition-opacity"
            >
              <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold uppercase">
                বিজ্ঞাপন
              </span>
              <h5 className="font-bold text-sm mt-1.5">অনলাইন পত্রিকা থিম</h5>
              <p className="text-xs text-blue-200 mt-0.5">ThemesBazar.Com</p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
