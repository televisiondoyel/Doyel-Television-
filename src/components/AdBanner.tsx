import React from 'react';

interface AdBannerProps {
  image?: string;
  url?: string;
  sizeLabel?: string; // e.g. "৭২৮ x ৯০" or "৩০০ x ২৫০"
  className?: string;
  aspectRatio?: string;
  heightClass?: string;
  minHeight?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  image,
  url,
  sizeLabel,
  className = '',
  heightClass,
}) => {
  // Check if a real image is provided (ignore dummy old 404 wordpress demo urls if any)
  const hasValidImage =
    image &&
    image.trim() !== '' &&
    !image.includes('newssitedesign.com/professionalnews');

  if (hasValidImage) {
    const content = (
      <img
        src={image}
        alt="বিজ্ঞাপন"
        className="w-full h-full object-cover rounded"
        loading="lazy"
      />
    );

    return (
      <div className={`relative overflow-hidden rounded ${className}`}>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full hover:opacity-95 transition-opacity"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    );
  }

  // Watermark Placeholder when no ad image is uploaded yet
  return (
    <div
      className={`relative w-full ${heightClass || 'h-24 sm:h-28'} bg-slate-50/90 border border-dashed border-gray-300/80 rounded flex items-center justify-center overflow-hidden select-none group transition-colors ${className}`}
    >
      {/* Background Watermark Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.18] sm:opacity-[0.22] blur-[0.3px]">
        <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-gray-500 uppercase font-sans">
          বিজ্ঞাপন
        </span>
      </div>

      {/* Subtle Minimal Foreground Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-gray-400">
        <span className="text-[11px] font-medium tracking-wider text-gray-400/80 px-2 py-0.5 rounded bg-gray-200/50">
          বিজ্ঞাপন {sizeLabel ? `• ${sizeLabel}` : ''}
        </span>
      </div>
    </div>
  );
};
