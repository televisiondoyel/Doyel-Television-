import React, { useState } from 'react';
import { FamilyMember } from '../types';

interface OurFamilyPageProps {
  members: FamilyMember[];
  onHome: () => void;
}

export const OurFamilyPage: React.FC<OurFamilyPageProps> = ({
  members,
  onHome,
}) => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Default fallback image if member image fails
  const defaultPlaceholder =
    'https://newssitedesign.com/professionalnews/wp-content/uploads/2018/01/Blank-Image-1.png';

  return (
    <div id="our-family-page" className="archive-page-section py-2">
      {/* Category Info / Breadcrumb bar */}
      <div className="category_info flex items-center gap-2 mb-4 bg-[#F7F7F7] p-2.5 sm:px-4 border-l-4 border-[#004F8A]">
        <button
          type="button"
          onClick={onHome}
          className="text-[#004F8A] font-bold hover:underline flex items-center gap-1.5 cursor-pointer bg-transparent border-none p-0"
        >
          <i className="fa fa-home"></i> হোম
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-800 font-bold">আমাদের পরিবার</span>
      </div>

      {/* Main Archive Section with 4 Columns per Row */}
      <section className="archive-section">
        {/* news option */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {members.map((member, index) => {
            // Determine display text format (Name :: Designation or separate)
            const hasCombinedTitle = member.name.includes('::');
            const displayName = hasCombinedTitle
              ? member.name
              : member.designation
              ? `${member.name} :: ${member.designation}`
              : member.name;

            return (
              <div key={member.id || index} className="w-full">
                <div
                  id={`profile-news-${member.id || index}`}
                  className="profile_news group cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="block relative overflow-hidden bg-slate-100">
                    <img
                      width="500"
                      height="300"
                      src={member.image || defaultPlaceholder}
                      alt={member.name}
                      className="attachment-post-thumbnail size-post-thumbnail wp-post-image transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultPlaceholder;
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="bg-[#004F8A] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        <i className="fa fa-user mr-1"></i> বিবরণ দেখুন
                      </span>
                    </div>
                  </div>

                  <div className="family_border">
                    <h4 className="family hover:text-[#9A1515] transition-colors">
                      {displayName}
                    </h4>
                    {member.designation && hasCombinedTitle && (
                      <h4 className="family_deg">{member.designation}</h4>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Member Details Modal Popup */}
      {selectedMember && (
        <div
          id="member-modal-overlay"
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedMember(null)}
        >
          <div
            id="member-modal-card"
            className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#1F4565] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa fa-id-badge text-yellow-400 text-lg"></i>
                <h3 className="font-bold text-lg">সম্পাদকীয় পরিষদ প্রোফাইল</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="text-gray-300 hover:text-white text-xl p-1 leading-none cursor-pointer"
                title="বন্ধ করুন"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src={selectedMember.image || defaultPlaceholder}
                  alt={selectedMember.name}
                  className="w-28 h-28 object-cover rounded-lg border-2 border-gray-200 shadow-sm shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultPlaceholder;
                  }}
                />
                <div className="text-center sm:text-left flex-1">
                  <h4 className="text-xl font-bold text-gray-900">
                    {selectedMember.name.split('::')[0].trim()}
                  </h4>
                  <p className="text-sm font-semibold text-[#004F8A] mt-0.5">
                    {selectedMember.designation ||
                      (selectedMember.name.includes('::')
                        ? selectedMember.name.split('::')[1]?.trim()
                        : 'সম্পাদকীয় পরিষদ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    দোয়েল টেলিভিশন ডিজিটাল মিডিয়া
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-gray-700">
                    {selectedMember.email && (
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <i className="fa fa-envelope text-gray-400 w-4"></i>
                        <span>{selectedMember.email}</span>
                      </div>
                    )}
                    {selectedMember.phone && (
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <i className="fa fa-phone text-gray-400 w-4"></i>
                        <span>{selectedMember.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  পরিচিতি ও দায়িত্ব
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedMember.bio ||
                    `${selectedMember.name} দোয়েল টেলিভিশন পরিবারের একজন দায়িত্বশীল সদস্য হিসেবে বস্তুনিষ্ঠ তথ্য পরিবেশনে অবদান রাখছেন।`}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="bg-[#1F4565] hover:bg-[#004F8A] text-white text-sm font-medium px-4 py-2 rounded transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
