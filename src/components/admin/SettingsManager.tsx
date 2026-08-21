import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../../types';

interface SettingsManagerProps {
  settings: SiteSettings;
  onSaveSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onSaveSettings,
  autoSaveStatus,
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'contact' | 'social' | 'ads' | 'footer'>('general');
  const [manualSaving, setManualSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Debounced auto-save on change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsDirty(true);
    const timer = setTimeout(async () => {
      try {
        await onSaveSettings(formData);
        setIsDirty(false);
      } catch (err) {
        console.error('Settings auto save error:', err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualSaving(true);
    try {
      await onSaveSettings(formData);
      setIsDirty(false);
      alert('সেটিংস সফলভাবে ডেটাবেজে সংরক্ষিত হয়েছে!');
    } finally {
      setManualSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">পোর্টাল সেটিংস (Site Settings)</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            ওয়েবসাইটের নাম, লোগো, বিজ্ঞাপন ব্যানার, সোশ্যাল লিঙ্ক ও যোগাযোগ তথ্য নিয়ন্ত্রণ করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            {autoSaveStatus === 'saving' || isDirty ? (
              <span className="text-yellow-600 flex items-center gap-1 font-medium">
                <i className="fa fa-circle-o-notch fa-spin"></i> ডাটাবেজে অটো-সেভ হচ্ছে...
              </span>
            ) : (
              <span className="text-green-600 flex items-center gap-1 font-medium">
                <i className="fa fa-check-circle"></i> ক্লাউডে সংরক্ষিত
              </span>
            )}
          </div>
          <button
            onClick={handleManualSave}
            disabled={manualSaving}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-4 py-2 rounded shadow-xs transition-colors"
          >
            {manualSaving ? 'সংরক্ষিত হচ্ছে...' : 'সব পরিবর্তন সেভ করুন'}
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#c3c4c7] bg-white rounded-t overflow-x-auto text-[13px] select-none shadow-2xs">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'general'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/40'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-globe mr-1.5"></i> সাধারণ পরিচিতি ও লোগো
        </button>
        <button
          onClick={() => setActiveSubTab('ads')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'ads'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/40'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-bullhorn mr-1.5"></i> বিজ্ঞাপন ব্যানার (Ads)
        </button>
        <button
          onClick={() => setActiveSubTab('contact')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'contact'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/40'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-address-card mr-1.5"></i> যোগাযোগ ও ঠিকানা
        </button>
        <button
          onClick={() => setActiveSubTab('social')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'social'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/40'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-share-alt mr-1.5"></i> সোশ্যাল মিডিয়া
        </button>
        <button
          onClick={() => setActiveSubTab('footer')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap ${
            activeSubTab === 'footer'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/40'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-file-text-o mr-1.5"></i> ফুটার ও কপিরাইট
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white border border-[#c3c4c7] p-6 rounded-b shadow-2xs">
        {/* 1. General Tab */}
        {activeSubTab === 'general' && (
          <div className="space-y-4 max-w-3xl text-xs text-gray-700">
            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                ওয়েবসাইটের নাম (Site Title):
              </label>
              <input
                type="text"
                value={formData.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                ট্যাগলাইন / স্লোগান (Tagline):
              </label>
              <input
                type="text"
                value={formData.siteTagline}
                onChange={(e) => handleChange('siteTagline', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                লোগো লিঙ্ক (Logo Image URL):
              </label>
              <input
                type="url"
                value={formData.siteLogo || ''}
                onChange={(e) => handleChange('siteLogo', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
              {formData.siteLogo && (
                <div className="mt-2 p-3 bg-gray-100 rounded inline-block border">
                  <img src={formData.siteLogo} alt="Logo" className="max-h-12 object-contain" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-gray-900 mb-1">
                  প্রধান সম্পাদক ও প্রকাশক:
                </label>
                <input
                  type="text"
                  value={formData.editorName}
                  onChange={(e) => handleChange('editorName', e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-900 mb-1">
                  প্রকাশনা সংস্থা:
                </label>
                <input
                  type="text"
                  value={formData.publisherName}
                  onChange={(e) => handleChange('publisherName', e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block font-semibold text-gray-900 mb-1">
                স্ক্রোলিং বার শিরোনাম লেবেল (Ticker Prefix):
              </label>
              <input
                type="text"
                value={formData.tickerTitle}
                onChange={(e) => handleChange('tickerTitle', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>
        )}

        {/* 2. Ads Tab */}
        {activeSubTab === 'ads' && (
          <div className="space-y-6 max-w-3xl text-xs text-gray-700">
            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                হেডার বিজ্ঞাপন ব্যানার (Header Top Banner 728x90):
              </label>
              <input
                type="url"
                value={formData.headerAdImage || ''}
                onChange={(e) => handleChange('headerAdImage', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
              {formData.headerAdImage && (
                <div className="mt-2 border rounded p-1 bg-gray-50 max-w-lg">
                  <img src={formData.headerAdImage} alt="Header Ad" className="w-full h-auto" />
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                সাইডবার বিজ্ঞাপন ব্যানার (Sidebar Ad 300x250):
              </label>
              <input
                type="url"
                value={formData.sidebarAdImage || ''}
                onChange={(e) => handleChange('sidebarAdImage', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
              {formData.sidebarAdImage && (
                <div className="mt-2 border rounded p-1 bg-gray-50 max-w-[300px]">
                  <img src={formData.sidebarAdImage} alt="Sidebar Ad" className="w-full h-auto" />
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                হোমপেজ বডি বিজ্ঞাপন (Middle Full Banner):
              </label>
              <input
                type="url"
                value={formData.bodyAdImage || ''}
                onChange={(e) => handleChange('bodyAdImage', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>
        )}

        {/* 3. Contact Tab */}
        {activeSubTab === 'contact' && (
          <div className="space-y-4 max-w-3xl text-xs text-gray-700">
            <div>
              <label className="block font-semibold text-gray-900 mb-1">অফিসের ঠিকানা:</label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">ফোন / মোবাইল নাম্বার:</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">ইমেইল ঠিকানা:</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>
        )}

        {/* 4. Social Tab */}
        {activeSubTab === 'social' && (
          <div className="space-y-4 max-w-3xl text-xs text-gray-700">
            <div>
              <label className="block font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                <i className="fa fa-facebook-square text-blue-600 text-sm"></i> Facebook Page URL:
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                <i className="fa fa-twitter-square text-sky-500 text-sm"></i> Twitter / X Profile URL:
              </label>
              <input
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                <i className="fa fa-youtube-play text-red-600 text-sm"></i> YouTube Channel URL:
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>
        )}

        {/* 5. Footer Tab */}
        {activeSubTab === 'footer' && (
          <div className="space-y-4 max-w-3xl text-xs text-gray-700">
            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                ফুটার কপিরাইট বার্তা ও ঘোষণা:
              </label>
              <textarea
                value={formData.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                rows={4}
                className="w-full text-sm border border-gray-300 rounded p-3 outline-none focus:border-[#2271b1]"
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
