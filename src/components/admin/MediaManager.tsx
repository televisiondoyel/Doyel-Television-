import React, { useState } from 'react';
import { PhotoSlide, VideoSlide } from '../../types';
import { compressImage } from '../../lib/imageCompressor';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface MediaManagerProps {
  type: 'photos' | 'videos';
  photos: PhotoSlide[];
  videos: VideoSlide[];
  onSavePhoto: (photo: Partial<PhotoSlide>) => Promise<string>;
  onDeletePhoto: (id: string) => Promise<void>;
  onSaveVideo: (video: Partial<VideoSlide>) => Promise<string>;
  onDeleteVideo: (id: string) => Promise<void>;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  type,
  photos,
  videos,
  onSavePhoto,
  onDeletePhoto,
  onSaveVideo,
  onDeleteVideo,
}) => {
  // Photo Form
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  // Video Form
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type: 'photo' | 'video' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to extract YouTube video ID
  const extractVideoId = (input: string) => {
    if (!input) return 'FAt1d11UOg8';
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : input.trim();
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl.trim()) return;
    setSaving(true);
    try {
      await onSavePhoto({
        title: photoTitle.trim(),
        caption: photoCaption.trim(),
        image: photoUrl.trim(),
        date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
      });
      setPhotoTitle('');
      setPhotoUrl('');
      setPhotoCaption('');
    } finally {
      setSaving(false);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !youtubeInput.trim()) return;
    setSaving(true);
    try {
      const vId = extractVideoId(youtubeInput);
      await onSaveVideo({
        title: videoTitle.trim(),
        videoId: vId,
        thumbnail: `https://img.youtube.com/vi/${vId}/hqdefault.jpg`,
        date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })
      });
      setVideoTitle('');
      setYoutubeInput('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            {type === 'photos' ? 'ফটো গ্যালারি (Photo Gallery)' : 'ভিডিও গ্যালারি (Video Gallery)'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {type === 'photos'
              ? 'হোমপেজের স্লাইডার ও ফটো আর্কাইভের ছবি ম্যানেজ করুন'
              : 'ইউটিউব ভিডিও লিঙ্ক দিয়ে নিউজ পোর্টালের ভিডিও গ্যালারি আপডেট করুন'}
          </p>
        </div>
      </div>

      {/* 2-Column: Left Add Form, Right Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-4 bg-white border border-[#c3c4c7] p-4.5 rounded shadow-2xs">
          <h2 className="text-base font-semibold text-[#1d2327] mb-3 border-b pb-2">
            {type === 'photos' ? 'নতুন ছবি যোগ করুন' : 'নতুন ভিডিও যোগ করুন'}
          </h2>

          {type === 'photos' ? (
            <form onSubmit={handlePhotoSubmit} className="space-y-3 text-xs text-gray-700">
              <div>
                <label className="block font-semibold mb-1">ছবির মূল শিরোনাম (Title) :</label>
                <input
                  type="text"
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="যেমন: সবুজের মাঝে মনোরম দৃশ্য..."
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ছবির লিঙ্ক (Image URL) অথবা আপলোড:</label>
                <div className="space-y-1.5">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                    required
                  />
                  <label className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 px-3 py-1 rounded text-xs text-gray-700 cursor-pointer">
                    <i className="fa fa-upload text-[#2271b1]"></i>
                    <span>ছবি আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await compressImage(file, 800, 600, 0.75);
                            setPhotoUrl(compressed);
                          } catch (err) {
                            console.error('Error compressing photo:', err);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {photoUrl && (
                <div className="aspect-video rounded overflow-hidden bg-gray-100 border">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">ছবির বিস্তারিত ক্যাপশন / বিবরণ (ঐচ্ছিক) :</label>
                <textarea
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="ছবির বিস্তারিত ঘটনা বা তথ্য..."
                  rows={2}
                  className="w-full text-xs border border-gray-300 rounded p-2 outline-none focus:border-[#2271b1]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold py-2 rounded transition-colors disabled:opacity-50"
              >
                {saving ? 'আপলোড হচ্ছে...' : '+ ফটো গ্যালারিতে যোগ করুন'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVideoSubmit} className="space-y-3 text-xs text-gray-700">
              <div>
                <label className="block font-semibold mb-1">ভিডিওর শিরোনাম:</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="যেমন: বিশেষ প্রতিবেদন ও বিশ্লেষণ..."
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  YouTube ভিডিও লিঙ্ক বা Video ID:
                </label>
                <input
                  type="text"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=FAt1d11UOg8"
                  className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-[#2271b1]"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  যেকোনো ইউটিউব ভিডিওর সাধারণ লিংক সরাসরি পেস্ট করতে পারেন।
                </p>
              </div>

              {youtubeInput && (
                <div className="aspect-video rounded overflow-hidden bg-gray-100 border">
                  <img
                    src={`https://img.youtube.com/vi/${extractVideoId(youtubeInput)}/hqdefault.jpg`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-semibold py-2 rounded transition-colors disabled:opacity-50"
              >
                {saving ? 'যুক্ত হচ্ছে...' : '+ ভিডিও গ্যালারিতে যোগ করুন'}
              </button>
            </form>
          )}
        </div>

        {/* Right Gallery Items Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {type === 'photos' ? (
              photos.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#c3c4c7] rounded overflow-hidden shadow-2xs group flex flex-col justify-between"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-gray-500">{p.date}</p>
                    <div className="mt-3 pt-2 border-t flex justify-end">
                      <button
                        onClick={() => {
                          setItemToDelete({ id: p.id, title: p.title, type: 'photo' });
                        }}
                        className="text-xs text-[#d63638] hover:underline cursor-pointer"
                      >
                        <i className="fa fa-trash mr-1"></i> ডিলিট
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              videos.map((v) => (
                <div
                  key={v.id}
                  className="bg-white border border-[#c3c4c7] rounded overflow-hidden shadow-2xs group flex flex-col justify-between"
                >
                  <div className="aspect-video bg-black relative overflow-hidden flex items-center justify-center">
                    <img
                      src={v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <i className="fa fa-play-circle text-white text-3xl absolute drop-shadow-md"></i>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">
                      {v.title}
                    </h4>
                    <p className="text-[11px] text-gray-500">ID: {v.videoId}</p>
                    <div className="mt-3 pt-2 border-t flex justify-end">
                      <button
                        onClick={() => {
                          setItemToDelete({ id: v.id, title: v.title, type: 'video' });
                        }}
                        className="text-xs text-[#d63638] hover:underline cursor-pointer"
                      >
                        <i className="fa fa-trash mr-1"></i> ডিলিট
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Media Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        title={itemToDelete?.type === 'photo' ? 'ছবি মুছে ফেলার নিশ্চয়তা' : 'ভিডিও মুছে ফেলার নিশ্চয়তা'}
        itemName={itemToDelete?.title}
        description={itemToDelete?.type === 'photo' ? 'আপনি কি নিশ্চিত যে ফটো গ্যালারি থেকে এই ছবিটি স্থায়ীভাবে মুছে ফেলতে চান?' : 'আপনি কি নিশ্চিত যে ভিডিও গ্যালারি থেকে এই ভিডিওটি স্থায়ীভাবে মুছে ফেলতে চান?'}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!itemToDelete) return;
          setIsDeleting(true);
          try {
            if (itemToDelete.type === 'photo') {
              await onDeletePhoto(itemToDelete.id);
            } else {
              await onDeleteVideo(itemToDelete.id);
            }
            setItemToDelete(null);
          } catch (err) {
            console.error('Error deleting media:', err);
          } finally {
            setIsDeleting(false);
          }
        }}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
};
