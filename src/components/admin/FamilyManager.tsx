import React, { useState } from 'react';
import { FamilyMember } from '../../types';

interface FamilyManagerProps {
  members: FamilyMember[];
  onSaveMember: (member: Partial<FamilyMember>) => Promise<string>;
  onDeleteMember: (id: string) => Promise<void>;
}

export const FamilyManager: React.FC<FamilyManagerProps> = ({
  members,
  onSaveMember,
  onDeleteMember,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const defaultPlaceholder =
    'https://newssitedesign.com/professionalnews/wp-content/uploads/2018/01/Blank-Image-1.png';

  const handleEdit = (member: FamilyMember) => {
    setEditingId(member.id);
    setName(member.name);
    setDesignation(member.designation);
    setImage(member.image);
    setPhone(member.phone || '');
    setEmail(member.email || '');
    setBio(member.bio || '');
    setOrder(member.order || 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setName('');
    setDesignation('');
    setImage('');
    setPhone('');
    setEmail('');
    setBio('');
    setOrder(members.length + 1);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await onSaveMember({
        id: editingId || undefined,
        name: name.trim(),
        designation: designation.trim(),
        image: image.trim() || defaultPlaceholder,
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        order: Number(order) || Date.now(),
      });
      setMessage('সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!');
      handleReset();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('সংরক্ষণে ত্রুটি হয়েছে!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (window.confirm(`আপনি কি "${memberName}" কে তালিকা থেকে মুছে ফেলতে চান?`)) {
      await onDeleteMember(id);
    }
  };

  return (
    <div id="family-manager-panel" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-300 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <i className="fa fa-users text-[#2271b1]"></i>
            আমাদের পরিবার ও সম্পাদকীয় পরিষদ ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            ওয়েবসাইটের &quot;আমাদের পরিবার&quot; পেজে প্রদর্শিত সকল সদস্যের তালিকা ও তথ্য এডিট করুন
          </p>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 text-sm rounded">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel (Left Col) */}
        <div className="bg-white p-5 rounded border border-gray-300 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center justify-between">
            <span>{editingId ? 'সদস্যের তথ্য সম্পাদনা' : 'নতুন সদস্য যোগ করুন'}</span>
            {editingId && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                নতুন যোগ করুন
              </button>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                সদস্যের নাম *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোহাম্মদ হাসান আলী"
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                পদবি / দায়িত্ব *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="যেমন: প্রধান সম্পাদক / বার্তা ইনচার্জ"
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ছবির URL (বা ডিফল্ট ব্লাংক ছবি)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... (খালি রাখলে ডিফল্ট ছবি বসবে)"
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1] outline-none"
              />
              {image && (
                <div className="mt-2 w-20 h-20 rounded border overflow-hidden">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">মোবাইল</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="০১৭১১-xxxxxx"
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@..."
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">সংক্ষিপ্ত পরিচিতি</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="সদস্যের সংক্ষিপ্ত সাংবাদিকতা ব্যাকগ্রাউন্ড..."
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ক্রম নম্বর (Order)</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-24 text-sm border border-gray-300 rounded px-3 py-1.5 outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-sm font-semibold px-5 py-2 rounded shadow transition-colors cursor-pointer"
              >
                {isSaving ? 'সংরক্ষণ হচ্ছে...' : editingId ? 'আপডেট করুন' : 'যোগ করুন'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Member Cards / Table (Right 2 Cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded border border-gray-300 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center justify-between">
            <span>বর্তমান সদস্য তালিকা ({members.length} জন)</span>
            <span className="text-xs text-gray-500 font-normal">রিয়েল-টাইম ক্লাউড সিঙ্ক</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className={`border rounded p-3 text-center transition-all bg-gray-50 relative group ${
                  editingId === member.id ? 'border-[#2271b1] ring-2 ring-[#2271b1]/20 bg-blue-50/30' : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="w-20 h-20 mx-auto rounded overflow-hidden mb-2 bg-white border border-gray-200">
                  <img
                    src={member.image || defaultPlaceholder}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultPlaceholder;
                    }}
                  />
                </div>
                <h4 className="font-bold text-sm text-gray-900 truncate" title={member.name}>
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-[#004F8A] mt-0.5 truncate" title={member.designation}>
                  {member.designation}
                </p>

                <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <i className="fa fa-pencil"></i> এডিট
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id, member.name)}
                    className="text-red-600 hover:text-red-800 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <i className="fa fa-trash"></i> মুছুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
