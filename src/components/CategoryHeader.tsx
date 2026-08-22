import React from 'react';
import {
  Newspaper,
  Globe,
  TrendingUp,
  Scale,
  Film,
  Tv,
  Trophy,
  Laptop,
  GraduationCap,
  MessageSquareQuote,
  Camera,
  Video,
  Landmark,
  LucideIcon,
} from 'lucide-react';

interface CategoryHeaderProps {
  title: string;
  icon?: string | LucideIcon;
  onCategoryClick?: () => void;
  className?: string;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  icon,
  onCategoryClick,
  className = '',
}) => {
  const renderIcon = () => {
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className="w-4 h-4 shrink-0 text-white" />;
    }

    const iconKey = String(icon || title || '').toLowerCase();

    if (iconKey.includes('newspaper') || iconKey.includes('জাতীয়') || iconKey.includes('জাতীয়')) {
      return <Newspaper className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('globe') || iconKey.includes('আন্তর্জাতিক')) {
      return <Globe className="w-4 h-4 shrink-0 text-white" />;
    }
    if (
      iconKey.includes('chart') ||
      iconKey.includes('trending') ||
      iconKey.includes('line-chart') ||
      iconKey.includes('অর্থনীতি')
    ) {
      return <TrendingUp className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('gavel') || iconKey.includes('scale') || iconKey.includes('আইন')) {
      return <Scale className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('film') || iconKey.includes('clapperboard') || iconKey.includes('বিনোদন')) {
      return <Film className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('tv') || iconKey.includes('television') || iconKey.includes('গণমাধ্যম')) {
      return <Tv className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('trophy') || iconKey.includes('futbol') || iconKey.includes('খেলা')) {
      return <Trophy className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('laptop') || iconKey.includes('তথ্যপ্রযুক্তি')) {
      return <Laptop className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('graduation') || iconKey.includes('শিক্ষা')) {
      return <GraduationCap className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('comment') || iconKey.includes('message') || iconKey.includes('মতামত')) {
      return <MessageSquareQuote className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('camera') || iconKey.includes('ফটো')) {
      return <Camera className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('video') || iconKey.includes('ভিডিও')) {
      return <Video className="w-4 h-4 shrink-0 text-white" />;
    }
    if (iconKey.includes('landmark') || iconKey.includes('রাজনীতি')) {
      return <Landmark className="w-4 h-4 shrink-0 text-white" />;
    }

    return <Newspaper className="w-4 h-4 shrink-0 text-white" />;
  };

  return (
    <div
      className={`cat_ribbon_container relative w-full h-[38px] sm:h-[40px] bg-[#8CB3D0] rounded-xs overflow-hidden flex items-center mb-3 shadow-2xs ${className}`}
    >
      {onCategoryClick ? (
        <button
          type="button"
          onClick={onCategoryClick}
          className="relative h-full inline-flex items-center gap-2 pl-3 sm:pl-3.5 pr-7 sm:pr-8 bg-[#004F8A] hover:bg-[#003E6D] text-white font-bold text-[15px] sm:text-[16px] transition-colors cursor-pointer group select-none"
          style={{
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
          }}
          title={`${title} বিভাগের সকল সংবাদ`}
        >
          {renderIcon()}
          <span className="tracking-normal whitespace-nowrap leading-none drop-shadow-xs">
            {title}
          </span>
        </button>
      ) : (
        <div
          className="relative h-full inline-flex items-center gap-2 pl-3 sm:pl-3.5 pr-7 sm:pr-8 bg-[#004F8A] text-white font-bold text-[15px] sm:text-[16px] select-none"
          style={{
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 15px) 100%, 0 100%)',
          }}
        >
          {renderIcon()}
          <span className="tracking-normal whitespace-nowrap leading-none drop-shadow-xs">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};
