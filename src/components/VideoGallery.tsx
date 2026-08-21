import React, { useState } from 'react';
import { videoGalleryData as fallbackVideoData } from '../data/newsData';
import { VideoSlide } from '../types';
import { CategoryHeader } from './CategoryHeader';

interface VideoGalleryProps {
  videos?: VideoSlide[];
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoList = videos && videos.length > 0 ? videos : fallbackVideoData;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videoList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videoList.length - 1 ? 0 : prev + 1));
  };

  const currentVideo = videoList[currentIndex] || videoList[0];

  if (!currentVideo) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded shadow-xs mb-4">
      <CategoryHeader title="ভিডিও গ্যালারী" icon="fa-video-camera" />

      {/* Video Player */}
      <div className="relative rounded overflow-hidden bg-black aspect-video flex items-center justify-center">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideo.videoId}`}
          title={currentVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        ></iframe>

        {/* Previous / Next Controls */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 bottom-3 bg-black/70 hover:bg-[#004F8A] text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
          title="পূর্ববর্তী ভিডিও"
        >
          <i className="fa fa-chevron-left text-xs"></i>
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 bottom-3 bg-black/70 hover:bg-[#004F8A] text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
          title="পরবর্তী ভিডিও"
        >
          <i className="fa fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* Video Playlist Selectors */}
      <div className="grid grid-cols-4 gap-1.5 mt-2.5">
        {videoList.slice(0, 4).map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`text-left p-1 rounded border text-xs font-semibold transition-all ${
              index === currentIndex
                ? 'bg-[#1F4565] text-white border-[#004F8A]'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-1">
              <i className="fa fa-play-circle text-red-500"></i>
              <span className="truncate">ভিডিও {index + 1}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
