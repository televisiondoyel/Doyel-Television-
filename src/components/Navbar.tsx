import React, { useState } from 'react';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeCategory, onSelectCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saradeshOpen, setSaradeshOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);

  const divisionList = [
    'ঢাকা-বিভাগ',
    'চট্রগ্রাম-বিভাগ',
    'খুলনা-বিভাগ',
    'রাজশাহী-বিভাগ',
    'বরিশাল-বিভাগ',
    'সিলেট-বিভাগ',
    'রংপুর-বিভাগ',
    'ময়মনসিংহ-বিভাগ',
  ];

  const otherList = [
    'তথ্যপ্রযুক্তি',
    'ক্যাম্পাস',
    'এক্সক্লুসিভ',
    'আইন-আদালত',
    'গণমাধ্যম',
    'চাকরী',
    'ধর্ম',
    'প্রবাস',
    'ফিচার',
    'ভ্রমণ',
    'মতামত',
    'মুক্তমত',
    'লাইফস্টাইল',
    'লিড নিউজ',
    'সম্পাদকীয়',
    'সাহিত্য',
    'স্বাস্থ্য',
  ];

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    setSaradeshOpen(false);
    setOtherOpen(false);
  };

  return (
    <nav className="menu_bottom relative z-30 my-2">
      <div className="flex items-center justify-between lg:hidden px-3 py-2 text-white">
        <span className="font-semibold text-sm">মেনু নির্বাচন করুন</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded bg-[#174384] text-white hover:bg-[#004F8A] transition-colors focus:outline-none"
          aria-label="Toggle navigation"
        >
          <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
        </button>
      </div>

      {/* Desktop & Collapsible Mobile Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
        <ul className="flex flex-col lg:flex-row flex-wrap lg:items-center text-[15px] font-medium text-white">
          {/* Home */}
          <li>
            <button
              onClick={() => handleCategoryClick('প্রচ্ছদ')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'প্রচ্ছদ'
                  ? 'bg-[#9A1515] font-bold'
                  : 'hover:bg-[#004F8A]'
              }`}
            >
              <i className="fa fa-home mr-1"></i> প্রচ্ছদ
            </button>
          </li>

          {/* National */}
          <li>
            <button
              onClick={() => handleCategoryClick('জাতীয়')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'জাতীয়' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              জাতীয়
            </button>
          </li>

          {/* Saradeshe with Dropdown */}
          <li
            className="relative group"
            onMouseEnter={() => setSaradeshOpen(true)}
            onMouseLeave={() => setSaradeshOpen(false)}
          >
            <button
              onClick={() => handleCategoryClick('সারাদেশে')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 flex items-center justify-between lg:justify-start gap-1 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'সারাদেশে' || divisionList.includes(activeCategory)
                  ? 'bg-[#9A1515] font-bold text-white'
                  : 'hover:bg-[#004F8A]'
              }`}
            >
              <span>সারাদেশে</span>
              <i className="fa fa-caret-down text-xs"></i>
            </button>

            {/* Dropdown Menu */}
            <ul
              className={`${
                saradeshOpen ? 'block' : 'hidden'
              } lg:absolute top-full left-0 w-full lg:w-52 bg-[#1F4565] border-t border-[#004F8A] shadow-xl z-50`}
            >
              <li>
                <button
                  onClick={() => handleCategoryClick('সারাদেশে')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors border-b border-[#174384] ${
                    activeCategory === 'সারাদেশে'
                      ? 'bg-[#9A1515] text-white'
                      : 'text-yellow-300 hover:bg-[#004F8A] hover:text-white'
                  }`}
                >
                  <i className="fa fa-map-marker mr-1.5 text-xs"></i>
                  সারাদেশ (সকল বিভাগ)
                </button>
              </li>
              {divisionList.map((div) => (
                <li key={div}>
                  <button
                    onClick={() => handleCategoryClick(div)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors border-b border-[#174384] ${
                      activeCategory === div
                        ? 'bg-[#9A1515] text-white font-bold'
                        : 'text-gray-100 hover:bg-[#9A1515] hover:text-white'
                    }`}
                  >
                    <i className="fa fa-angle-right mr-1.5 text-xs text-blue-300"></i>
                    {div}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          {/* International */}
          <li>
            <button
              onClick={() => handleCategoryClick('আন্তর্জাতিক')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'আন্তর্জাতিক' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              আন্তর্জাতিক
            </button>
          </li>

          {/* Politics */}
          <li>
            <button
              onClick={() => handleCategoryClick('রাজনীতি')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'রাজনীতি' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              রাজনীতি
            </button>
          </li>

          {/* Economy */}
          <li>
            <button
              onClick={() => handleCategoryClick('অর্থনীতি')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'অর্থনীতি' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              অর্থনীতি
            </button>
          </li>

          {/* Sports */}
          <li>
            <button
              onClick={() => handleCategoryClick('খেলাধুলা')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'খেলাধুলা' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              খেলাধুলা
            </button>
          </li>

          {/* Entertainment */}
          <li>
            <button
              onClick={() => handleCategoryClick('বিনোদন')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'বিনোদন' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              বিনোদন
            </button>
          </li>

          {/* Education */}
          <li>
            <button
              onClick={() => handleCategoryClick('শিক্ষা')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] ${
                activeCategory === 'শিক্ষা' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              শিক্ষা
            </button>
          </li>

          {/* Others with Multi-column Dropdown */}
          <li
            className="relative group"
            onMouseEnter={() => setOtherOpen(true)}
            onMouseLeave={() => setOtherOpen(false)}
          >
            <button
              onClick={() => setOtherOpen(!otherOpen)}
              className="w-full text-left lg:w-auto px-4 py-2.5 flex items-center justify-between lg:justify-start gap-1 transition-colors border-b lg:border-b-0 lg:border-r border-[#174384] hover:bg-[#004F8A]"
            >
              <span>অন্যান্য</span>
              <i className="fa fa-caret-down text-xs"></i>
            </button>

            {/* Dropdown Menu */}
            <ul
              className={`${
                otherOpen ? 'block' : 'hidden'
              } lg:absolute top-full left-0 w-full lg:w-56 max-h-96 overflow-y-auto bg-[#1F4565] border-t border-[#004F8A] shadow-2xl z-50`}
            >
              {otherList.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleCategoryClick(item)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-[#9A1515] hover:text-white transition-colors border-b border-[#174384]"
                  >
                    <i className="fa fa-angle-right mr-1.5 text-xs text-blue-300"></i>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          {/* Our Family */}
          <li>
            <button
              onClick={() => handleCategoryClick('আমাদের পরিবার')}
              className={`w-full text-left lg:w-auto px-4 py-2.5 transition-colors ${
                activeCategory === 'আমাদের পরিবার' ? 'bg-[#9A1515] font-bold' : 'hover:bg-[#004F8A]'
              }`}
            >
              আমাদের পরিবার
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
