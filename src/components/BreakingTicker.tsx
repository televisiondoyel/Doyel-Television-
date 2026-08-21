import React from 'react';
import { tickerNews as fallbackTickerNews } from '../data/newsData';
import { TickerItem } from '../types';

interface BreakingTickerProps {
  onSelectArticle: (idOrTitle: string) => void;
  tickerItems?: TickerItem[];
  tickerTitle?: string;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  onSelectArticle,
  tickerItems,
  tickerTitle = 'শিরোনাম :',
}) => {
  const items = tickerItems && tickerItems.length > 0 ? tickerItems : fallbackTickerNews;

  return (
    <div className="row mb-3">
      <div className="col-md-12 scrool flex flex-col sm:flex-row items-stretch border border-gray-300 bg-white">
        {/* Ticker Title Badge */}
        <div className="scrool_1 bg-[#1F4565] text-white px-4 py-2 text-[17px] font-normal flex items-center shrink-0">
          {tickerTitle}
        </div>

        {/* Marquee Container */}
        <div className="scrool_2 overflow-hidden relative flex-1 py-2 px-3 flex items-center bg-[#FDFDFD]">
          <marquee
            direction="left"
            scrollamount={4}
            className="text-[16px] text-gray-800"
            onMouseOver={(e) => (e.currentTarget as any).stop()}
            onMouseOut={(e) => (e.currentTarget as any).start()}
          >
            {items.map((item) => (
              <span key={item.id} className="inline-flex items-center mx-4">
                <i className="fa fa-square text-[#9A1515] text-[7px] mr-2.5" aria-hidden="true"></i>
                <button
                  type="button"
                  onClick={() => onSelectArticle(item.articleId || item.id)}
                  className="hover:text-[#9A1515] text-[#222] text-[16px] hover:underline cursor-pointer bg-transparent border-none p-0 inline whitespace-nowrap"
                >
                  {item.title}
                </button>
              </span>
            ))}
          </marquee>
        </div>
      </div>
    </div>
  );
};
