import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings?: SiteSettings;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = settings?.siteTitle ? settings.siteTitle.split('-')[0].trim() : 'Doyel Television';
  const tagline = settings?.siteTagline || 'অনলাইন বাংলা সংবাদপত্র';
  const address = settings?.contactAddress || 'বাণিজ্যিক ভবন, পুরানা পল্টন, ঢাকা-১০০০';
  const phone = settings?.contactPhone || '০১৭০০-০০০০০০';
  const email = settings?.contactEmail || 'editor@doyeltelevision.com';
  const footerText = settings?.footerText || 'স্বত্ব © ২০২৬ দোয়েল টেলিভিশন। সর্বস্বত্ব সংরক্ষিত।';

  return (
    <footer className="mt-6">
      {/* Top Footer Section */}
      <div className="footer_section p-6 rounded-t bg-[#52595f] text-[#ededed]">
        <div className="border-b border-gray-600 pb-5 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Footer Logo */}
            <div className="md:col-span-4 flex items-center justify-center md:justify-start">
              <div className="flex items-center gap-2.5">
                {settings?.siteLogo ? (
                  <img
                    src={settings.siteLogo}
                    alt={title}
                    className="max-h-12 w-auto max-w-[140px] object-contain shrink-0 bg-white/10 p-1 rounded"
                  />
                ) : (
                  <div className="bg-[#004F8A] text-white p-2 rounded font-bold text-xl shrink-0">
                    PN
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white leading-none">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="md:col-span-8 flex justify-center md:justify-end">
              <ul className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <li>
                  <a
                    href={settings?.facebookUrl || 'https://www.facebook.com/share/19cpbxC35r/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] text-white px-2.5 py-1 rounded inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <i className="fa fa-facebook"></i> ফেইসবুক
                  </a>
                </li>
                <li>
                  <a
                    href={settings?.twitterUrl || 'https://twitter.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1DA1F2] text-white px-2.5 py-1 rounded inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <i className="fa fa-twitter"></i> টুইটার
                  </a>
                </li>
                <li>
                  <a
                    href={settings?.youtubeUrl || 'https://youtube.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#CD201F] text-white px-2.5 py-1 rounded inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <i className="fa fa-youtube"></i> ইউটিউব
                  </a>
                </li>
                <li>
                  <a
                    href={settings?.instagramUrl || 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#E4405F] text-white px-2.5 py-1 rounded inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <i className="fa fa-instagram"></i> ইনস্টাগ্রাম
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Office Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-300 text-center md:text-left">
          <div className="editorial-text md:text-left">
            <i className="fa fa-building-o mr-1.5 text-blue-300"></i>
            যোগাযোগ : {phone} | ইমেইল: {email}
          </div>
          <div className="address-text md:text-right">
            <i className="fa fa-map-marker mr-1.5 text-red-400"></i>
            ঠিকানা: {address}
          </div>
        </div>
      </div>

      {/* Bottom Copyright Root Bar */}
      <div className="root p-3 bg-[#282828] text-xs text-[#B8B8B8]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <div>{footerText}</div>
        </div>
      </div>

      {/* Floating Scroll To Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="scrollToTop"
          title="উপরে যান"
          aria-label="Scroll to top"
        >
          <i className="fa fa-angle-up text-xl font-bold"></i>
        </button>
      )}
    </footer>
  );
};
