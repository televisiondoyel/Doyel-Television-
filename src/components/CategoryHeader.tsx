import React from 'react';

interface CategoryHeaderProps {
  title: string;
  icon?: string;
  onCategoryClick?: () => void;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  icon = 'fa-newspaper-o',
  onCategoryClick,
}) => {
  return (
    <div className="cat_title">
      {onCategoryClick ? (
        <button
          onClick={onCategoryClick}
          className="badge-title text-left hover:bg-[#174384] transition-colors"
        >
          <i className={`fa ${icon}`} aria-hidden="true"></i>
          <span>{title}</span>
        </button>
      ) : (
        <span className="badge-title">
          <i className={`fa ${icon}`} aria-hidden="true"></i>
          <span>{title}</span>
        </span>
      )}
    </div>
  );
};
