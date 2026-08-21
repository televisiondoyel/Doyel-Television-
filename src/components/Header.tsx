import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  siteSettings?: SiteSettings;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, siteSettings, onOpenAdmin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bengaliDate, setBengaliDate] = useState('');

  useEffect(() => {
    // Generate Bengali formatted date
    const banglaDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'অগাস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const toBanglaNum = (num: number | string) => {
      const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).replace(/[0-9]/g, (d) => bn[parseInt(d, 10)]);
    };

    const updateDate = () => {
      const now = new Date();
      const dayName = banglaDays[now.getDay()];
      const day = toBanglaNum(now.getDate());
      const month = banglaMonths[now.getMonth()];
      const year = toBanglaNum(now.getFullYear());
      
      let hours = now.getHours();
      const minutes = toBanglaNum(String(now.getMinutes()).padStart(2, '0'));
      const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
      hours = hours % 12 || 12;
      const hoursBn = toBanglaNum(hours);

      setBengaliDate(`${dayName}, ${day} ${month} ${year}, ${hoursBn}:${minutes} ${ampm}`);
    };

    updateDate();
    const interval = setInterval(updateDate, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const title = siteSettings?.siteTitle ? siteSettings.siteTitle.split('-')[0].trim() : 'Professional News';
  const tagline = siteSettings?.siteTagline || 'সত্য ও ন্যায়ের নির্ভীক কণ্ঠস্বর';

  return (
    <header className="pt-2 pb-3 border-b border-gray-200">
      {/* Top Admin Bar Shortcut */}
      {onOpenAdmin && (
        <div className="bg-[#1d2327] text-[#c3c4c7] px-3 py-1 mb-2 rounded flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#2271b1] flex items-center justify-center text-[10px] font-black text-white">
              W
            </span>
            <span className="font-medium text-white">WordPress CMS ড্যাশবোর্ড সক্রিয়</span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-2.5 py-0.5 rounded font-medium text-[11.5px] transition-colors flex items-center gap-1.5"
          >
            <i className="fa fa-tachometer"></i>
            <span>এডমিন ড্যাশবোর্ডে যান</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Logo */}
        <div className="md:col-span-4 flex justify-center md:justify-start">
          <a href="#" className="inline-block group">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#004F8A] text-white p-2.5 rounded shadow-sm flex items-center justify-center font-bold text-2xl tracking-tighter shrink-0">
                PN
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-[#004F8A] tracking-tight group-hover:text-[#9A1515] transition-colors leading-none">
                  {title}
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide mt-0.5">
                  {tagline}
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Date and Search Box */}
        <div className="md:col-span-4 flex flex-col justify-center px-1">
          <div className="text-[13.5px] font-medium text-gray-700 mb-2 flex items-center justify-center gap-1.5 bg-gray-50 py-1 px-2.5 rounded border border-gray-200 text-center">
            <i className="fa fa-calendar text-[#004F8A]"></i>
            <span>{bengaliDate || 'শুক্রবার, ২১ অগাস্ট ২০২৬, ৯:৫৮ পূর্বাহ্ন'}</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              maxLength={64}
              placeholder="এখানে লিখুন.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-1.5 text-sm rounded-l focus:outline-none focus:border-[#004F8A]"
            />
            <button
              type="submit"
              className="bg-[#004F8A] hover:bg-[#1F4565] text-white px-4 py-1.5 text-sm font-semibold rounded-r transition-colors flex items-center gap-1 shrink-0"
            >
              <i className="fa fa-search text-xs"></i>
              <span>খুজুন</span>
            </button>
          </form>
        </div>

        {/* Banner Ad */}
        <div className="md:col-span-4 flex justify-center md:justify-end">
          <a
            href="https://www.themesbazar.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-[468px] bg-gradient-to-r from-[#1F4565] to-[#004F8A] text-white rounded p-3 text-center shadow-sm hover:opacity-95 transition-opacity"
          >
            <div className="flex items-center justify-between px-2">
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider bg-red-600 px-1.5 py-0.5 rounded font-bold">
                  বিজ্ঞাপন
                </span>
                <p className="text-sm font-bold mt-0.5">ThemesBazar.Com</p>
                <p className="text-xs text-blue-100">প্রিমিয়াম বাংলা নিউজ পোর্টাল থিম</p>
              </div>
              <div className="bg-white/15 px-3 py-1.5 rounded text-xs font-semibold hover:bg-white hover:text-[#004F8A] transition-colors">
                এখনই কিনুন <i className="fa fa-arrow-right ml-1"></i>
              </div>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};
