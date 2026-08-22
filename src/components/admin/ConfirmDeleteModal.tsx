import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  description?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  itemName,
  description = 'এটি স্থায়ীভাবে মুছে যাবে এবং পূর্বাবস্থায় ফিরিয়ে আনা সম্ভব নয়।',
  isDeleting = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-md w-full overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-red-50 px-5 py-4 border-b border-red-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
            <i className="fa fa-trash-o text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{title}</h3>
            <p className="text-xs text-red-600 font-medium">মুছে ফেলার নিশ্চিতকরণ</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-2 text-sm text-gray-700">
          {itemName && (
            <div className="p-2.5 bg-gray-50 rounded border border-gray-200 font-medium text-gray-900 line-clamp-2">
              &quot;{itemName}&quot;
            </div>
          )}
          <p className="text-xs text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            বাতিল করুন
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> মোছা হচ্ছে...
              </>
            ) : (
              <>
                <i className="fa fa-trash"></i> হ্যাঁ, মুছে ফেলুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
