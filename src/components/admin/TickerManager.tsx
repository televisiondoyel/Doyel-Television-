import React, { useState } from 'react';
import { TickerItem } from '../../types';

interface TickerManagerProps {
  tickerItems: TickerItem[];
  onSaveTickerItem: (item: Partial<TickerItem>) => Promise<string>;
  onDeleteTickerItem: (id: string) => Promise<void>;
}

export const TickerManager: React.FC<TickerManagerProps> = ({
  tickerItems,
  onSaveTickerItem,
  onDeleteTickerItem,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    try {
      await onSaveTickerItem({
        title: newTitle.trim(),
      });
      setNewTitle('');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      await onSaveTickerItem({
        id,
        title: editTitle.trim(),
      });
      setEditingId(null);
      setEditTitle('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`আপনি কি "${title}" শিরোনামটি মুছে ফেলতে চান?`)) {
      await onDeleteTickerItem(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-300">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            ব্রেকিং স্ক্রোলিং শিরোনাম (Breaking Ticker Headlines)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            ওয়েবসাইটের শীর্ষে চলমান লাল ও কালো বারের ব্রেকিং নিউজ সরাসরি এডিট ও যোগ করুন
          </p>
        </div>
        <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full border border-yellow-300">
          মোট {tickerItems.length} টি শিরোনাম চলমান
        </span>
      </div>

      {/* Add New Ticker Headline */}
      <div className="bg-white border border-[#c3c4c7] p-4 rounded shadow-2xs">
        <h2 className="text-sm font-semibold text-[#1d2327] mb-2 flex items-center gap-1.5">
          <i className="fa fa-plus-circle text-[#2271b1]"></i> নতুন স্ক্রোলিং শিরোনাম যোগ করুন
        </h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="ব্রেকিং সংবাদের আকর্ষণীয় শিরোনাম লিখুন..."
            className="flex-1 text-[13.5px] border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-[13px] font-semibold px-5 py-2 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            <i className="fa fa-plus"></i> যোগ করুন
          </button>
        </form>
      </div>

      {/* List of Ticker Items */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-2.5 bg-[#f6f7f7] border-b border-[#c3c4c7] font-semibold text-[13px] text-gray-700">
          বর্তমান সক্রিয় শিরোনাম তালিকা
        </div>
        <div className="divide-y divide-gray-100 p-2">
          {tickerItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              কোনো ব্রেকিং শিরোনাম পাওয়া যায়নি।
            </div>
          ) : (
            tickerItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 hover:bg-gray-50 rounded flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>

                  {editingId === item.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 text-[13.5px] border border-blue-400 rounded px-2.5 py-1 outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                      >
                        সেভ
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded"
                      >
                        বাতিল
                      </button>
                    </div>
                  ) : (
                    <span className="text-[13.5px] text-gray-800 font-medium truncate">
                      {item.title}
                    </span>
                  )}
                </div>

                {editingId !== item.id && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditTitle(item.title);
                      }}
                      className="p-1.5 text-[#2271b1] hover:bg-blue-50 rounded text-xs"
                      title="সম্পাদনা"
                    >
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-[#d63638] hover:bg-red-50 rounded text-xs"
                      title="মুছে ফেলুন"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
