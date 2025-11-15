'use client';
import React from 'react';

type ReplyPopupProps = {
  open: boolean;
  onClose: () => void;
  userName?: string;
  onSubmit: (data: { title: string; description: string }) => void;
};

export default function ReplyPopup({ open, onClose, userName, onSubmit }: ReplyPopupProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit({ title, description });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="bg-white rounded-[24px] shadow-xl w-[600px] p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-[#D12D2D] text-[20px] font-semibold mb-6">
          ارسال رد علي البلاغ
        </h2>

        {/* اسم المستخدم */}
        <label className="text-sm text-gray-600 mb-1 block">اسم المستخدم</label>
        <input
          value={userName ?? ''}
          disabled
          className="w-full h-12 rounded-xl bg-[#F2F2F2] px-4 text-gray-700 mb-4"
        />

        {/* عنوان الرد */}
        <label className="text-sm text-gray-600 mb-1 block">عنوان الرد</label>
        <input
          placeholder="اكتب هنا العنوان"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-12 rounded-xl border border-[#D8D8D8] px-4 mb-4 outline-none focus:border-[#D12D2D]"
        />

        {/* الوصف */}
        <label className="text-sm text-gray-600 mb-1 block">الوصف</label>
        <textarea
          placeholder="اكتب هنا الوصف"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-32 rounded-xl border border-[#D8D8D8] px-4 py-2 outline-none focus:border-[#D12D2D] mb-6 resize-none"
        />

        {/* الأزرار */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="w-[150px] h-11 rounded-2xl border border-[#D12D2D] text-[#D12D2D] bg-white hover:bg-red-50"
          >
            الغاء
          </button>

          <button
            onClick={handleSubmit}
            className="w-[150px] h-11 rounded-2xl bg-[#D12D2D] text-white hover:bg-[#b52020]"
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
}
