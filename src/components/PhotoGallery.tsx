import React, { useState, useEffect } from 'react';
import { photoGalleryData as fallbackPhotosData } from '../data/newsData';
import { PhotoSlide } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { CategoryHeader } from './CategoryHeader';

interface PhotoGalleryProps {
  photos?: PhotoSlide[];
  onSelectPhoto?: (caption: string) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onSelectPhoto }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const photoList = photos && photos.length > 0 ? photos : fallbackPhotosData;

  const fallbackPhotos = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photoList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photoList.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused || photoList.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, photoList.length]);

  const currentPhoto = photoList[currentIndex] || photoList[0];

  if (!currentPhoto) return null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded shadow-xs mb-4">
      <CategoryHeader title="ফটো গ্যালারী" icon="fa-camera" />

      <div
        className="relative overflow-hidden group rounded bg-black aspect-video flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => onSelectPhoto?.(currentPhoto.caption || currentPhoto.title)}
      >
        <ImageWithFallback
          src={currentPhoto.image}
          fallbackSrc={fallbackPhotos[currentIndex % fallbackPhotos.length]}
          alt={currentPhoto.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Caption overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white">
          <h4 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-md">
            {currentPhoto.caption || currentPhoto.title}
          </h4>
          <span className="text-xs text-gray-300 font-medium">
            ছবি {currentIndex + 1} / {photoList.length}
          </span>
        </div>

        {/* Left / Right Controls */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#004F8A] text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Previous photo"
        >
          <i className="fa fa-chevron-left text-sm"></i>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#004F8A] text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Next photo"
        >
          <i className="fa fa-chevron-right text-sm"></i>
        </button>
      </div>

      {/* Thumbnails list */}
      <div className="grid grid-cols-6 gap-1.5 mt-2.5">
        {photoList.slice(0, 6).map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`aspect-video rounded overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? 'border-[#004F8A] scale-105'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <ImageWithFallback
              src={item.image}
              fallbackSrc={fallbackPhotos[index % fallbackPhotos.length]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
