'use client';

import Image from 'next/image';
import { useState } from 'react';
import { RegistrationRow } from './LastLogins';
import { MoreVertical } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

type Props = { rows: RegistrationRow[] };

export default function RegistrationsTable({ rows }: Props) {
  // حالة اللايت بوكس
  const [open, setOpen] = useState(false);
  const [currentSet, setCurrentSet] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (images: string[], index: number) => {
    if (!images?.length) return;
    setCurrentSet(images);
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-[#eee] bg-white">
      <table className="min-w-full text-right" dir="ltr">
        <thead className="bg-[#FDECEE] text-[#D72229]">
          <tr className="text-sm">
            <th className="p-3">الإجراءات</th>
            <th className="p-3">صورة البوست</th>
            <th className="p-3">نوع النشر</th>
            <th className="p-3">المشاهدات</th>
            <th className="p-3">تعليقات</th>
            <th className="p-3">إعجابات</th>
            <th className="p-3">نشر البوست</th>
            <th className="p-3">الحالة</th>
            <th className="p-3">id</th>
            <th className="p-3">اسم المستخدم</th>
            <th className="p-3">صورة</th>
            <th className="p-3">الرقم</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.no} className="border-t text-sm hover:bg-[#fafafa]">
              <td className="p-3">
                <button
                  className="rounded-xl border px-2 py-1 text-[#777] hover:bg-[#f3f3f3]"
                  aria-label="Actions"
                >
                  <MoreVertical size={16} />
                </button>
              </td>

              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {r.postImages?.length ? (
                    r.postImages.slice(0, 6).map((src: string | StaticImport, i: number) => (
                      <button
                        key={src + i}
                        className="relative h-6 w-6 overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={() => openLightbox(r.postImages, i)}
                        aria-label="عرض الصورة"
                        title="عرض الصورة"
                      >
                        {/* ثَمَنيلز صغيرة - next/image */}
                        <Image src={src} alt="" fill className="object-cover" />
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-[#999]">لا يوجد صورة للبوست</span>
                  )}
                </div>
              </td>

              <td className="p-3">{r.postType}</td>
              <td className="p-3">{r.views}</td>
              <td className="p-3">{r.comments}</td>
              <td className="p-3">{r.likes}</td>
              <td className="p-3">{r.publishedAgo}</td>

              <td className="p-3">
                <span
                  className={[
                    'rounded-full px-3 py-1 text-xs',
                    r.status === 'نشط'
                      ? 'bg-[#E7F7EE] text-[#1B8A5A]'
                      : r.status === 'محظور'
                      ? 'bg-[#FDECEE] text-[#D72229]'
                      : 'bg-[#FFF7E6] text-[#B96A00]',
                  ].join(' ')}
                >
                  {r.status}
                </span>
              </td>

              <td className="p-3">{r.id}</td>
              <td className="p-3">{r.userName}</td>
              <td className="p-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white shadow">
                  <Image src={r.avatar} alt={r.userName} fill className="object-cover" />
                </div>
              </td>
              <td className="p-3">{r.no}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <ImageLightbox
          images={currentSet}
          index={currentIndex}
          onChange={setCurrentIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
