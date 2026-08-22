import React, { useState, useEffect, useRef } from 'react';
import { SiteSettings } from '../../types';
import { compressImage } from '../../lib/imageCompressor';

interface SettingsManagerProps {
  settings: SiteSettings;
  onSaveSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  initialSubTab?: 'profile' | 'general' | 'contact' | 'social' | 'ads' | 'footer';
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onSaveSettings,
  autoSaveStatus,
  initialSubTab = 'profile',
}) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'general' | 'contact' | 'social' | 'ads' | 'footer'>(initialSubTab);
  const [manualSaving, setManualSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [compressingField, setCompressingField] = useState<string | null>(null);

  // Sync initialSubTab when prop changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Sync settings when updated from Firestore, unless user is actively typing
  useEffect(() => {
    if (!isDirty) {
      setFormData(settings);
    }
  }, [settings, isDirty]);

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

  const handleFileUpload = async (field: keyof SiteSettings, file: File, maxDim: number = 600) => {
    try {
      setCompressingField(field);
      const compressed = await compressImage(file, maxDim, maxDim, 0.75);
      handleChange(field, compressed);
    } catch (err) {
      console.error('Failed to compress image:', err);
    } finally {
      setCompressingField(null);
    }
  };

  const handleManualSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setManualSaving(true);
    try {
      await onSaveSettings(formData);
      setIsDirty(false);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3500);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('সংরক্ষণ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setManualSaving(false);
    }
  };

  const sampleAvatars = [
    { name: 'সম্পাদক ১', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'সম্পাদক ২', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'সম্পাদক ৩', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'সম্পাদক ৪', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">প্রোফাইল ও পোর্টাল সেটিংস</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            অ্যাডমিন প্রোফাইল তথ্য, ওয়েবসাইটের নাম, লোগো, বিজ্ঞাপন ব্যানার, সোশ্যাল লিঙ্ক ও যোগাযোগ নিয়ন্ত্রণ করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            {autoSaveStatus === 'saving' || isDirty ? (
              <span className="text-yellow-600 flex items-center gap-1 font-medium bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                <i className="fa fa-circle-o-notch fa-spin"></i> ডাটাবেজে অটো-সেভ হচ্ছে...
              </span>
            ) : saveSuccessMsg ? (
              <span className="text-green-700 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded border border-green-200">
                <i className="fa fa-check-circle"></i> সফলভাবে সংরক্ষিত হয়েছে!
              </span>
            ) : (
              <span className="text-green-600 flex items-center gap-1 font-medium">
                <i className="fa fa-check-circle"></i> ক্লাউডে সংরক্ষিত
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleManualSave()}
            disabled={manualSaving}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-4 py-2 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <i className={`fa ${manualSaving ? 'fa-spinner fa-spin' : 'fa-floppy-o'}`}></i>
            <span>{manualSaving ? 'সংরক্ষিত হচ্ছে...' : 'সব পরিবর্তন সেভ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#c3c4c7] bg-white rounded-t overflow-x-auto text-[13px] select-none shadow-2xs">
        {/* Admin Profile Tab */}
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'profile'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-user-circle mr-1.5 text-[#2271b1]"></i> অ্যাডমিন প্রোফাইল
        </button>

        {/* General Tab */}
        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'general'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-globe mr-1.5"></i> সাধারণ পরিচিতি ও লোগো
        </button>

        {/* Ads Tab */}
        <button
          type="button"
          onClick={() => setActiveSubTab('ads')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'ads'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-bullhorn mr-1.5"></i> বিজ্ঞাপন ব্যানার
        </button>

        {/* Contact Tab */}
        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'contact'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-address-card mr-1.5"></i> যোগাযোগ ও ঠিকানা
        </button>

        {/* Social Tab */}
        <button
          type="button"
          onClick={() => setActiveSubTab('social')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'social'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-share-alt mr-1.5"></i> সোশ্যাল মিডিয়া
        </button>

        {/* Footer Tab */}
        <button
          type="button"
          onClick={() => setActiveSubTab('footer')}
          className={`py-3 px-5 border-b-2 font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeSubTab === 'footer'
              ? 'border-[#2271b1] text-[#2271b1] font-bold bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-[#2271b1]'
          }`}
        >
          <i className="fa fa-file-text-o mr-1.5"></i> ফুটার ও কপিরাইট
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white border border-[#c3c4c7] p-6 rounded-b shadow-2xs">
        {/* 0. Admin Profile Tab */}
        {activeSubTab === 'profile' && (
          <div className="space-y-5 max-w-3xl text-xs text-gray-700">
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded mb-4 flex items-start gap-3">
              <i className="fa fa-info-circle text-blue-600 text-lg mt-0.5"></i>
              <div>
                <h3 className="font-bold text-blue-950 text-sm">অ্যাডমিন প্রোফাইল তথ্য সম্পাদনা</h3>
                <p className="text-blue-800 text-xs mt-0.5 leading-relaxed">
                  এখানে আপনার নাম, পদবী, ইমেইল, মোবাইল নম্বর এবং প্রোফাইল ছবি পরিবর্তন ও আপডেট করতে পারবেন। যেকোনো পরিবর্তনে সাথে সাথে ক্লাউড ডেটাবেজে সংরক্ষিত হবে।
                </p>
              </div>
            </div>

            {/* Profile Avatar and Preview */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded border border-gray-200">
              <div className="relative shrink-0">
                <img
                  src={formData.adminAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="Admin Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2271b1] shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold text-gray-900">{formData.adminName || 'প্রধান সম্পাদক'}</h4>
                <p className="text-xs text-gray-500">{formData.adminDesignation || 'প্রধান সম্পাদক ও প্রকাশক'}</p>
                <p className="text-xs text-blue-600">{formData.adminEmail || 'admin@doyeltelevision.com'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-900 mb-1">
                  অ্যাডমিনের নাম (Full Name):
                </label>
                <input
                  type="text"
                  value={formData.adminName || ''}
                  onChange={(e) => handleChange('adminName', e.target.value)}
                  placeholder="যেমন: এম. এ. রহমান"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-1">
                  পদবী (Designation):
                </label>
                <input
                  type="text"
                  value={formData.adminDesignation || ''}
                  onChange={(e) => handleChange('adminDesignation', e.target.value)}
                  placeholder="যেমন: প্রধান সম্পাদক ও প্রকাশক"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-900 mb-1">
                  ইমেইল ঠিকানা (Email Address):
                </label>
                <input
                  type="email"
                  value={formData.adminEmail || ''}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  placeholder="admin@doyeltelevision.com"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-900 mb-1">
                  মোবাইল / ফোন নম্বর (Phone Number):
                </label>
                <input
                  type="text"
                  value={formData.adminPhone || ''}
                  onChange={(e) => handleChange('adminPhone', e.target.value)}
                  placeholder="+৮৮০ ১৭xxxxxxxx"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                প্রোফাইল ছবি (Avatar Image):
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.adminAvatar || ''}
                  onChange={(e) => handleChange('adminAvatar', e.target.value)}
                  placeholder="https://... অথবা নিচের স্যাম্পল থেকে বেছে নিন বা ছবি আপলোড করুন"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                />
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-gray-500 font-medium">স্যাম্পল ছবি নির্বাচন:</span>
                  {sampleAvatars.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChange('adminAvatar', av.url)}
                      className="flex items-center gap-1 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-2 py-1 rounded text-[11px] text-gray-700 cursor-pointer"
                    >
                      <img src={av.url} alt={av.name} className="w-4 h-4 rounded-full object-cover" />
                      <span>{av.name}</span>
                    </button>
                  ))}
                  <label className="flex items-center gap-1 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-2.5 py-1 rounded text-[11px] text-gray-700 cursor-pointer">
                    <i className={compressingField === 'adminAvatar' ? "fa fa-spinner fa-spin text-[#2271b1]" : "fa fa-upload text-[#2271b1]"}></i>
                    <span>{compressingField === 'adminAvatar' ? 'প্রসেসিং হচ্ছে...' : 'ছবি আপলোড'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload('adminAvatar', file, 400);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-1">
                সংক্ষিপ্ত জীবনবৃত্তান্ত (Bio):
              </label>
              <textarea
                value={formData.adminBio || ''}
                onChange={(e) => handleChange('adminBio', e.target.value)}
                rows={3}
                placeholder="সাংবাদিকতায় দীর্ঘ অভিজ্ঞতা ও দায়িত্বশীলতার বিবরণ..."
                className="w-full text-sm border border-gray-300 rounded p-3 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => handleManualSave()}
                disabled={manualSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa fa-check"></i>
                <span>প্রোফাইল পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        )}

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
                লোগো লিঙ্ক ও আপলোড (Logo Image):
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.siteLogo || ''}
                  onChange={(e) => handleChange('siteLogo', e.target.value)}
                  placeholder="https://... অথবা সরাসরি ছবি আপলোড করুন"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1]"
                />
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-3 py-1.5 rounded text-xs text-gray-700 cursor-pointer">
                    <i className={compressingField === 'siteLogo' ? "fa fa-spinner fa-spin text-[#2271b1]" : "fa fa-upload text-[#2271b1]"}></i>
                    <span>{compressingField === 'siteLogo' ? 'প্রসেসিং হচ্ছে...' : 'লোগো ফাইল আপলোড'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload('siteLogo', file, 500);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
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

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => handleManualSave()}
                disabled={manualSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa fa-check"></i>
                <span>সাধারণ সেটিংস সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Ads Tab */}
        {activeSubTab === 'ads' && (
          <div className="space-y-6 max-w-3xl text-xs text-gray-700">
            <div className="bg-blue-50/70 border border-blue-200 rounded p-3 text-blue-900 leading-relaxed">
              <p className="font-semibold mb-1 flex items-center gap-1.5 text-sm">
                <i className="fa fa-info-circle text-blue-600"></i> বিজ্ঞাপন ব্যানার ব্যবস্থাপনা
              </p>
              <p className="text-xs text-blue-800">
                বিজ্ঞাপন ব্যানার খালি থাকলে ওয়েবসাইটে ঝাপসা ওয়াটারমার্ক সহ <strong>‘বিজ্ঞাপন’</strong> লেখা প্রদর্শিত হবে। নির্দিষ্ট সাইজ অনুযায়ী ছবি আপলোড করলে বা লিংক বসালে স্বয়ংক্রিয়ভাবে আসল বিজ্ঞাপনটি দৃশ্যমান হবে।
              </p>
            </div>

            {/* Header Ad Slot */}
            <div className="bg-white p-4 border border-gray-200 rounded shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">হেডার বিজ্ঞাপন ব্যানার (Header Ad)</h4>
                  <span className="text-[11px] text-gray-500 font-medium">প্রস্তাবিত সাইজ: ৭২৮ x ৯০ পিক্সেল</span>
                </div>
                {formData.headerAdImage && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('headerAdImage', '');
                      handleChange('headerAdUrl', '');
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <i className="fa fa-trash"></i> ব্যানার মুছুন
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">বিজ্ঞাপন ছবির লিংক / ফাইল:</label>
                  <input
                    type="url"
                    value={formData.headerAdImage || ''}
                    onChange={(e) => handleChange('headerAdImage', e.target.value)}
                    placeholder="https://... অথবা আপলোড করুন"
                    className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">বিজ্ঞাপনে ক্লিক করলে যে লিংকে যাবে (URL):</label>
                  <input
                    type="url"
                    value={formData.headerAdUrl || ''}
                    onChange={(e) => handleChange('headerAdUrl', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-3 py-1.5 rounded text-xs text-gray-700 cursor-pointer">
                  <i className={compressingField === 'headerAdImage' ? "fa fa-spinner fa-spin text-[#2271b1]" : "fa fa-upload text-[#2271b1]"}></i>
                  <span>{compressingField === 'headerAdImage' ? 'প্রসেসিং হচ্ছে...' : 'ছবি আপলোড করুন (৭২৮x৯০)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('headerAdImage', file, 728);
                    }}
                  />
                </label>
                {formData.headerAdImage && (
                  <span className="text-emerald-600 text-xs flex items-center gap-1 font-medium">
                    <i className="fa fa-check-circle"></i> বিজ্ঞাপন সক্রিয়
                  </span>
                )}
              </div>

              {formData.headerAdImage && (
                <div className="mt-2 border rounded p-1.5 bg-gray-50 max-w-lg">
                  <p className="text-[11px] text-gray-500 mb-1">প্রিভিউ:</p>
                  <img src={formData.headerAdImage} alt="Header Ad Preview" className="w-full h-auto max-h-20 object-contain rounded" />
                </div>
              )}
            </div>

            {/* Sidebar Ad Slot */}
            <div className="bg-white p-4 border border-gray-200 rounded shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">সাইডবার বিজ্ঞাপন ব্যানার (Sidebar Ad)</h4>
                  <span className="text-[11px] text-gray-500 font-medium">প্রস্তাবিত সাইজ: ৩০০ x ২৫০ পিক্সেল</span>
                </div>
                {formData.sidebarAdImage && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('sidebarAdImage', '');
                      handleChange('sidebarAdUrl', '');
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <i className="fa fa-trash"></i> ব্যানার মুছুন
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">বিজ্ঞাপন ছবির লিংক / ফাইল:</label>
                  <input
                    type="url"
                    value={formData.sidebarAdImage || ''}
                    onChange={(e) => handleChange('sidebarAdImage', e.target.value)}
                    placeholder="https://... অথবা আপলোড করুন"
                    className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">বিজ্ঞাপনে ক্লিক করলে যে লিংকে যাবে (URL):</label>
                  <input
                    type="url"
                    value={formData.sidebarAdUrl || ''}
                    onChange={(e) => handleChange('sidebarAdUrl', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-3 py-1.5 rounded text-xs text-gray-700 cursor-pointer">
                  <i className={compressingField === 'sidebarAdImage' ? "fa fa-spinner fa-spin text-[#2271b1]" : "fa fa-upload text-[#2271b1]"}></i>
                  <span>{compressingField === 'sidebarAdImage' ? 'প্রসেসিং হচ্ছে...' : 'ছবি আপলোড করুন (৩০০x২৫০)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('sidebarAdImage', file, 400);
                    }}
                  />
                </label>
                {formData.sidebarAdImage && (
                  <span className="text-emerald-600 text-xs flex items-center gap-1 font-medium">
                    <i className="fa fa-check-circle"></i> বিজ্ঞাপন সক্রিয়
                  </span>
                )}
              </div>

              {formData.sidebarAdImage && (
                <div className="mt-2 border rounded p-1.5 bg-gray-50 max-w-[280px]">
                  <p className="text-[11px] text-gray-500 mb-1">প্রিভিউ:</p>
                  <img src={formData.sidebarAdImage} alt="Sidebar Ad Preview" className="w-full h-auto max-h-48 object-contain rounded" />
                </div>
              )}
            </div>

            {/* Body / Article Middle Ad Slot */}
            <div className="bg-white p-4 border border-gray-200 rounded shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">হোমপেজ ও নিউজ বডি বিজ্ঞাপন (Body / Content Ad)</h4>
                  <span className="text-[11px] text-gray-500 font-medium">প্রস্তাবিত সাইজ: ৭২৮ x ৯০ অথবা ৩৬০ x ৯০ পিক্সেল</span>
                </div>
                {formData.bodyAdImage && (
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('bodyAdImage', '');
                      handleChange('bodyAdUrl', '');
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <i className="fa fa-trash"></i> ব্যানার মুছুন
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">বিজ্ঞাপন ছবির লিংক / ফাইল:</label>
                  <input
                    type="url"
                    value={formData.bodyAdImage || ''}
                    onChange={(e) => handleChange('bodyAdImage', e.target.value)}
                    placeholder="https://... অথবা আপলোড করুন"
                    className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">বিজ্ঞাপনে ক্লিক করলে যে লিংকে যাবে (URL):</label>
                  <input
                    type="url"
                    value={formData.bodyAdUrl || ''}
                    onChange={(e) => handleChange('bodyAdUrl', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-3 py-1.5 rounded text-xs text-gray-700 cursor-pointer">
                  <i className={compressingField === 'bodyAdImage' ? "fa fa-spinner fa-spin text-[#2271b1]" : "fa fa-upload text-[#2271b1]"}></i>
                  <span>{compressingField === 'bodyAdImage' ? 'প্রসেসিং হচ্ছে...' : 'ছবি আপলোড করুন (৭২৮x৯০)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('bodyAdImage', file, 728);
                    }}
                  />
                </label>
                {formData.bodyAdImage && (
                  <span className="text-emerald-600 text-xs flex items-center gap-1 font-medium">
                    <i className="fa fa-check-circle"></i> বিজ্ঞাপন সক্রিয়
                  </span>
                )}
              </div>

              {formData.bodyAdImage && (
                <div className="mt-2 border rounded p-1.5 bg-gray-50 max-w-lg">
                  <p className="text-[11px] text-gray-500 mb-1">প্রিভিউ:</p>
                  <img src={formData.bodyAdImage} alt="Body Ad Preview" className="w-full h-auto max-h-20 object-contain rounded" />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => handleManualSave()}
                disabled={manualSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa fa-check"></i>
                <span>বিজ্ঞাপন সেটিংস সংরক্ষণ করুন</span>
              </button>
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

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => handleManualSave()}
                disabled={manualSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa fa-check"></i>
                <span>যোগাযোগ তথ্য সংরক্ষণ করুন</span>
              </button>
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

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => handleManualSave()}
                disabled={manualSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa fa-check"></i>
                <span>সোশ্যাল মিডিয়া সেটিংস সংরক্ষণ করুন</span>
              </button>
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

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => handleManualSave()}
                disabled={manualSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold px-5 py-2.5 rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa fa-check"></i>
                <span>ফুটার টেক্সট সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
