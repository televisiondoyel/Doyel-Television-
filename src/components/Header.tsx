import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../types';
import { AdBanner } from './AdBanner';

interface HeaderProps {
  onSearch: (query: string) => void;
  siteSettings?: SiteSettings;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, siteSettings, onOpenAdmin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bengaliDate, setBengaliDate] = useState('');
  const [imgError, setImgError] = useState(false);

  // 5-click handler on logo to trigger admin dashboard
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (nextCount >= 5) {
      setClickCount(0);
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } else {
      // Reset after 3 seconds of inactivity
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 3000);
    }
  };

  useEffect(() => {
    // Reset img error if logo changes
    setImgError(false);
  }, [siteSettings?.siteLogo]);

  useEffect(() => {
    // Generate Bengali formatted date with natural time period (সকাল, দুপুর, বিকাল, সন্ধ্যা, রাত, ভোর)
    const banglaDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const toBanglaNum = (num: number | string) => {
      const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return String(num).replace(/[0-9]/g, (d) => bn[parseInt(d, 10)]);
    };

    const getBanglaTimePeriod = (h: number) => {
      if (h >= 4 && h < 6) return 'ভোর';
      if (h >= 6 && h < 12) return 'সকাল';
      if (h >= 12 && h < 15) return 'দুপুর';
      if (h >= 15 && h < 18) return 'বিকাল';
      if (h >= 18 && h < 20) return 'সন্ধ্যা';
      return 'রাত';
    };

    const updateDate = () => {
      const now = new Date();
      const dayName = banglaDays[now.getDay()];
      const day = toBanglaNum(now.getDate());
      const month = banglaMonths[now.getMonth()];
      const year = toBanglaNum(now.getFullYear());
      
      const rawHours = now.getHours();
      const period = getBanglaTimePeriod(rawHours);
      let hours12 = rawHours % 12 || 12;
      const minutes = toBanglaNum(String(now.getMinutes()).padStart(2, '0'));
      const hoursBn = toBanglaNum(hours12);

      setBengaliDate(`${dayName}, ${day} ${month} ${year}, ${hoursBn}:${minutes} ${period}`);
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

  const title = siteSettings?.siteTitle ? siteSettings.siteTitle.split('-')[0].trim() : 'Doyel Television';
  const tagline = siteSettings?.siteTagline || 'সত্য ও ন্যায়ের নির্ভীক কণ্ঠস্বর';

  return (
    <header className="pt-2 pb-3 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Logo with 5-click secret admin entrance */}
        <div className="md:col-span-4 flex justify-center md:justify-start">
          <div
            onClick={handleLogoClick}
            className="inline-block cursor-pointer select-none"
            title="৫ বার ক্লিক করে অ্যাডমিন প্যানেল খুলুন"
          >
            <div className="flex items-center gap-2.5">
              {siteSettings?.siteLogo && !imgError ? (
                <img
                  src={siteSettings.siteLogo}
                  alt={title}
                  onError={() => setImgError(true)}
                  className="max-h-14 sm:max-h-16 w-auto max-w-[160px] object-contain shrink-0"
                />
              ) : (
                <div className="bg-[#004F8A] text-white p-2.5 rounded shadow-sm flex items-center justify-center font-bold text-2xl tracking-tighter shrink-0">
                  PN
                </div>
              )}
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-[#004F8A] tracking-tight hover:text-[#9A1515] transition-colors leading-none">
                  {title}
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide mt-0.5">
                  {tagline}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Date and Search Box */}
        <div className="md:col-span-4 flex flex-col justify-center px-1">
          <div className="text-[13.5px] font-medium text-gray-700 mb-2 flex items-center justify-center gap-1.5 bg-gray-50 py-1 px-2.5 rounded border border-gray-200 text-center">
            <i className="fa fa-calendar text-[#004F8A]"></i>
            <span>{bengaliDate || 'শনিবার, ২২ আগস্ট ২০২৬, রাত ৯:৫৮'}</span>
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
              className="bg-[#004F8A] hover:bg-[#1F4565] text-white px-4 py-1.5 text-sm font-semibold rounded-r transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <i className="fa fa-search text-xs"></i>
              <span>খুজুন</span>
            </button>
          </form>
        </div>

        {/* Top Header Ad Banner */}
        <div className="md:col-span-4 flex justify-center md:justify-end">
          <div className="w-full max-w-[468px]">
            <AdBanner
              image={siteSettings?.headerAdImage}
              url={siteSettings?.headerAdUrl}
              sizeLabel="৭২৮ x ৯০"
              heightClass="h-20"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
