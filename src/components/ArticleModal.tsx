import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onSelectRelated?: (idOrTitle: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onSelectRelated,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const fontClass =
    fontSize === 'normal'
      ? 'text-base leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg leading-loose'
      : 'text-xl leading-loose';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full my-6 overflow-hidden shadow-2xl relative border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#1F4565] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#9A1515] px-2 py-0.5 rounded text-xs font-bold uppercase">
              {article.category || 'সংবাদ'}
            </span>
            <span className="text-xs text-blue-200">{article.date}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Resize controls */}
            <div className="flex items-center bg-black/20 rounded px-1.5 py-0.5 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'normal' ? 'bg-white/30 font-bold' : ''}`}
                title="সাধারণ ফন্ট"
              >
                অ
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-sm ${fontSize === 'large' ? 'bg-white/30 font-bold' : ''}`}
                title="বড় ফন্ট"
              >
                অ+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1.5 py-0.5 rounded text-base ${fontSize === 'xlarge' ? 'bg-white/30 font-bold' : ''}`}
                title="সর্বোচ্চ বড় ফন্ট"
              >
                অ++
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 w-7 h-7 rounded-full flex items-center justify-center transition-colors text-sm"
              aria-label="Close modal"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {/* Article Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            {article.title}
          </h2>

          {/* Author and Date Meta */}
          <div className="flex flex-wrap items-center justify-between border-y border-gray-200 py-2.5 mb-4 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#004F8A]">
                <i className="fa fa-user mr-1"></i>
                {article.author || 'অনলাইন প্রতিবেদক'}
              </span>
              <span>
                <i className="fa fa-calendar mr-1 text-gray-400"></i>
                {article.date}
              </span>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className="text-gray-500 font-medium">শেয়ার করুন:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <i className="fa fa-facebook text-xs"></i>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <i className="fa fa-twitter text-xs"></i>
              </a>
              <button
                onClick={handleCopyLink}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs flex items-center gap-1 transition-colors"
              >
                <i className="fa fa-link"></i>
                <span>{copied ? 'কপি হয়েছে!' : 'লিংক'}</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video w-full rounded overflow-hidden bg-gray-100 mb-5 shadow-xs">
            <ImageWithFallback
              src={article.image}
              fallbackSrc={article.fallbackImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Excerpt Highlight */}
          {article.excerpt && (
            <div className="bg-blue-50/70 border-l-4 border-[#004F8A] p-3.5 mb-4 text-gray-800 font-medium text-base rounded-r">
              {article.excerpt}
            </div>
          )}

          {/* Full Article Content */}
          <div className={`text-gray-800 space-y-4 ${fontClass}`}>
            {article.content ? (
              article.content.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))
            ) : (
              <p>{article.excerpt}</p>
            )}
          </div>

          {/* Category Tag footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              বিষয়শ্রেণী: <span className="font-semibold text-[#004F8A]">{article.category}</span>
            </span>
            <button
              onClick={onClose}
              className="bg-[#1F4565] hover:bg-[#004F8A] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
