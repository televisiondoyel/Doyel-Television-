import React, { useState } from 'react';
import { SiteSettings } from '../../types';

export type AdminTab = 
  | 'dashboard' 
  | 'posts' 
  | 'new-post' 
  | 'edit-post' 
  | 'categories' 
  | 'ticker' 
  | 'media-photos' 
  | 'media-videos' 
  | 'family'
  | 'settings' 
  | 'users';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
  siteSettings: SiteSettings;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedText?: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  siteSettings,
  autoSaveStatus,
  lastSavedText,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleTabSelect = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileDrawerOpen(false);
  };

  const navItems = (
    <nav className="py-2 text-[14px] space-y-0.5">
      {/* Dashboard */}
      <button
        onClick={() => handleTabSelect('dashboard')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
          currentTab === 'dashboard'
            ? 'bg-[#2271b1] text-white font-semibold'
            : 'hover:bg-[#131619] hover:text-[#72aee6]'
        }`}
      >
        <i className="fa fa-tachometer w-4 text-center text-[15px]"></i>
        {(sidebarOpen || mobileDrawerOpen) && <span>ড্যাশবোর্ড</span>}
        {currentTab === 'dashboard' && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#F0F0F1]"></span>}
      </button>

      {/* Posts / সংবাদ */}
      <div className="group">
        <button
          onClick={() => handleTabSelect('posts')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
            ['posts', 'new-post', 'edit-post'].includes(currentTab)
              ? 'bg-[#2271b1] text-white font-semibold'
              : 'hover:bg-[#131619] hover:text-[#72aee6]'
          }`}
        >
          <i className="fa fa-thumb-tack w-4 text-center text-[15px]"></i>
          {(sidebarOpen || mobileDrawerOpen) && <span>সংবাদ / পোস্ট</span>}
        </button>

        {(sidebarOpen || mobileDrawerOpen) && (
          <div className="bg-[#131619] text-[13px] py-1 border-l-2 border-[#2271b1]">
            <button
              onClick={() => handleTabSelect('posts')}
              className={`w-full text-left px-8 py-1.5 hover:text-[#72aee6] ${
                currentTab === 'posts' ? 'text-[#72aee6] font-semibold' : 'text-[#a7aaad]'
              }`}
            >
              • সকল সংবাদ
            </button>
            <button
              onClick={() => handleTabSelect('new-post')}
              className={`w-full text-left px-8 py-1.5 hover:text-[#72aee6] ${
                currentTab === 'new-post' ? 'text-[#72aee6] font-semibold' : 'text-[#a7aaad]'
              }`}
            >
              • নতুন সংবাদ যোগ
            </button>
            <button
              onClick={() => handleTabSelect('categories')}
              className={`w-full text-left px-8 py-1.5 hover:text-[#72aee6] ${
                currentTab === 'categories' ? 'text-[#72aee6] font-semibold' : 'text-[#a7aaad]'
              }`}
            >
              • ক্যাটাগরি ব্যবস্থাপনা
            </button>
          </div>
        )}
      </div>

      {/* Breaking Ticker */}
      <button
        onClick={() => handleTabSelect('ticker')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
          currentTab === 'ticker'
            ? 'bg-[#2271b1] text-white font-semibold'
            : 'hover:bg-[#131619] hover:text-[#72aee6]'
        }`}
      >
        <i className="fa fa-bolt w-4 text-center text-[15px] text-yellow-400"></i>
        {(sidebarOpen || mobileDrawerOpen) && <span>স্ক্রোলিং শিরোনাম</span>}
      </button>

      {/* Photo Gallery */}
      <button
        onClick={() => handleTabSelect('media-photos')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
          currentTab === 'media-photos'
            ? 'bg-[#2271b1] text-white font-semibold'
            : 'hover:bg-[#131619] hover:text-[#72aee6]'
        }`}
      >
        <i className="fa fa-picture-o w-4 text-center text-[15px]"></i>
        {(sidebarOpen || mobileDrawerOpen) && <span>ফটো গ্যালারি</span>}
      </button>

      {/* Video Gallery */}
      <button
        onClick={() => handleTabSelect('media-videos')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
          currentTab === 'media-videos'
            ? 'bg-[#2271b1] text-white font-semibold'
            : 'hover:bg-[#131619] hover:text-[#72aee6]'
        }`}
      >
        <i className="fa fa-video-camera w-4 text-center text-[15px]"></i>
        {(sidebarOpen || mobileDrawerOpen) && <span>ভিডিও গ্যালারি</span>}
      </button>

      {/* Categories */}
      <button
        onClick={() => handleTabSelect('categories')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
          currentTab === 'categories'
            ? 'bg-[#2271b1] text-white font-semibold'
            : 'hover:bg-[#131619] hover:text-[#72aee6]'
        }`}
      >
        <i className="fa fa-tags w-4 text-center text-[15px]"></i>
        {(sidebarOpen || mobileDrawerOpen) && <span>ক্যাটাগরি ও মেনু</span>}
      </button>

      {/* Our Family / Editorial Board */}
      <button
        onClick={() => handleTabSelect('family')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
          currentTab === 'family'
            ? 'bg-[#2271b1] text-white font-semibold'
            : 'hover:bg-[#131619] hover:text-[#72aee6]'
        }`}
      >
        <i className="fa fa-users w-4 text-center text-[15px]"></i>
        {(sidebarOpen || mobileDrawerOpen) && <span>আমাদের পরিবার</span>}
      </button>

      {/* Settings */}
      <button
        onClick={() => handleTabSelect('settings')}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors relative ${
          currentTab === 'settings'
            ? 'bg-[#2271b1] text-white font-semibold'
            : 'hover:bg-[#131619] hover:text-[#72aee6]'
        }`}
      >
        <i className="fa fa-cogs w-4 text-center text-[15px]"></i>
        {(sidebarOpen || mobileDrawerOpen) && <span>পোর্টাল সেটিংস</span>}
      </button>

      {/* Back to site in mobile menu */}
      <div className="pt-3 border-t border-[#2c3338] px-3 md:hidden">
        <button
          onClick={onExitAdmin}
          className="w-full flex items-center justify-center gap-2 bg-[#2271b1] text-white py-2 rounded text-xs font-semibold"
        >
          <i className="fa fa-external-link"></i> মূল ওয়েবসাইটে ফিরুন
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F0F0F1] text-[#3c434a] antialiased flex flex-col selection:bg-[#2271b1] selection:text-white">
      {/* 1. WordPress Top Bar */}
      <header className="h-9 sm:h-8 bg-[#1d2327] text-[#c3c4c7] flex items-center justify-between px-3 text-[13px] z-50 sticky top-0 border-b border-[#2c3338]">
        {/* Left items */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Drawer Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden text-white p-1 hover:text-[#72aee6] text-base cursor-pointer"
            title="মেনু খুলুন"
          >
            <i className={`fa ${mobileDrawerOpen ? 'fa-times text-red-400' : 'fa-bars'}`}></i>
          </button>

          {/* WP Logo */}
          <div className="flex items-center gap-1.5 text-white font-bold tracking-wider cursor-pointer hover:text-[#72aee6] transition-colors" title="WordPress">
            <span className="w-5 h-5 rounded-full bg-[#2271b1] flex items-center justify-center text-[11px] font-black text-white">
              W
            </span>
          </div>

          {/* Site Name and View Site */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onExitAdmin} title="ওয়েবসাইট দেখুন">
            <i className="fa fa-home text-[14px] text-[#a7aaad] group-hover:text-[#72aee6]"></i>
            <span className="text-white font-medium text-[13px] group-hover:text-[#72aee6] transition-colors truncate max-w-[130px] sm:max-w-none">
              {siteSettings.siteTitle.split('-')[0].trim()}
            </span>
            <span className="hidden sm:inline-flex text-[11px] bg-[#2c3338] hover:bg-[#2271b1] text-[#72aee6] hover:text-white px-2 py-0.5 rounded transition-all">
              <i className="fa fa-external-link mr-1 text-[9px]"></i>ওয়েবসাইট দেখুন
            </span>
          </div>

          {/* Quick Add New Post */}
          <button
            onClick={() => handleTabSelect('new-post')}
            className="hidden sm:flex items-center gap-1.5 text-[#c3c4c7] hover:text-[#72aee6] hover:bg-[#131619] px-2 py-1 rounded transition-colors text-[12.5px]"
          >
            <i className="fa fa-plus text-[#72aee6] text-[10px]"></i>
            <span>নতুন সংবাদ</span>
          </button>
        </div>

        {/* Right items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Auto-Save Realtime Status Badge */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] bg-[#131619] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#2c3338]">
            {autoSaveStatus === 'saving' && (
              <span className="flex items-center gap-1 text-yellow-400">
                <i className="fa fa-circle-o-notch fa-spin text-[11px]"></i>
                <span className="hidden sm:inline">ডাটাবেজে সেভ হচ্ছে...</span>
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-green-400">
                <i className="fa fa-check-circle text-[11px]"></i>
                <span className="hidden sm:inline">স্বয়ংক্রিয় সেভ হয়েছে</span>
              </span>
            )}
            {autoSaveStatus === 'error' && (
              <span className="flex items-center gap-1 text-red-400">
                <i className="fa fa-exclamation-triangle text-[11px]"></i>
                <span>সেভ ত্রুটি</span>
              </span>
            )}
            {autoSaveStatus === 'idle' && (
              <span className="flex items-center gap-1 text-gray-400">
                <i className="fa fa-cloud text-[11px] text-blue-400"></i>
                <span className="hidden sm:inline">{lastSavedText || 'ক্লাউড সিঙ্ক সক্রিয়'}</span>
              </span>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 hover:text-[#72aee6] cursor-pointer"
            >
              <span className="hidden sm:inline">শুভেচ্ছা, <strong>অ্যাডমিন</strong></span>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Admin"
                className="w-5 h-5 rounded-full border border-gray-600 object-cover"
              />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-[#1d2327] border border-[#2c3338] shadow-xl rounded py-1 z-50 text-[#c3c4c7]">
                <div className="px-3 py-2 border-b border-[#2c3338] text-[12px]">
                  <p className="font-bold text-white">প্রধান সম্পাদক</p>
                  <p className="text-[11px] text-gray-400">admin@professionalnews.com</p>
                </div>
                <button
                  onClick={() => {
                    handleTabSelect('settings');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#2271b1] hover:text-white text-[12px] flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa fa-user"></i> প্রোফাইল ও সেটিংস
                </button>
                <button
                  onClick={onExitAdmin}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#d63638] hover:text-white text-[12px] flex items-center gap-2 text-red-300 cursor-pointer"
                >
                  <i className="fa fa-sign-out"></i> লগআউট / সাইটে ফিরুন
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`fixed top-9 bottom-0 left-0 w-64 bg-[#1d2327] text-[#c3c4c7] z-50 transform transition-transform duration-300 md:hidden overflow-y-auto border-r border-[#2c3338] ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 border-b border-[#2c3338] flex items-center justify-between">
          <span className="text-white font-bold text-sm">অ্যাডমিন মেনু</span>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="text-gray-400 hover:text-white text-lg p-1 cursor-pointer"
          >
            &times;
          </button>
        </div>
        {navItems}
      </aside>

      {/* 2. Main Admin Workspace (Desktop Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar */}
        <aside
          className={`hidden md:flex ${
            sidebarOpen ? 'w-56' : 'w-14'
          } bg-[#1d2327] text-[#c3c4c7] transition-all duration-200 shrink-0 select-none flex-col justify-between z-30 border-r border-[#2c3338]`}
        >
          {navItems}

          {/* Sidebar Footer Collapse Toggle */}
          <div className="p-2 border-t border-[#2c3338] bg-[#131619] flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#a7aaad] hover:text-white p-1.5 rounded flex items-center gap-2 text-[12px] w-full justify-center cursor-pointer"
              title="মেনু সংকুচিত/প্রসারিত করুন"
            >
              <i className={`fa ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
              {sidebarOpen && <span>মেনু ছোট করুন</span>}
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 bg-[#F0F0F1]">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
