'use client';

import Image from 'next/image';
import { useState } from 'react';
import { RegistrationRow } from './LastLogins';
import { MoreVertical } from 'lucide-react';
import ImageLightbox from './ImageLightbox';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type Props = { rows: RegistrationRow[] };

export default function RegistrationsTable({ rows }: Props) {
  // حالة اللايت بوكس
  const [open, setOpen] = useState(false);
  const [currentSet, setCurrentSet] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const openLightbox = (images: string[], index: number) => {
    if (!images?.length) return;
    setCurrentSet(images);
    setCurrentIndex(index);
    setOpen(true);
  };

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden rounded-3xl border border-[#eee] bg-white">
      <div className='max-h-[500px] overflow-auto scrollbar-hidden'>
        <table className="min-w-full text-right" dir="ltr">
          <thead className="bg-[#FDECEE] text-[#D72229] sticky top-0 z-10">
            <tr className="text-sm">
              <th className="p-3">الإجراءات</th>
              <th className="p-3">صورة البوست</th>
              <th className="p-3">نوع النشر</th>
              <th className="p-3">المشاهدات</th>
              <th className="p-3">تعليقات</th>
              <th className="p-3">إعجابات</th>
              <th className="p-3">نشر البوست</th>
              {rows?.status ? <th className="p-3">الحالة</th>:""}
              <th className="p-3">id</th>
              <th className="p-3">اسم المستخدم</th>
              <th className="p-3">صورة</th>
              <th className="p-3">الرقم</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.no} className="border-t text-sm hover:bg-[#fafafa]">
                <td className="py-3 px-2 text-center">
                  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 focus:outline-none"
      aria-label="إجراءات"
      onClick={(e) => e.stopPropagation()}
    >
      <MoreVertical className="h-4 w-4 text-gray-600" />
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="center" className="min-w-[140px] rounded-[15px]">
    {/* زر الحظر */}
    <DropdownMenuItem
      className="cursor-pointer text-[16px] text-rose-700 rounded-[10px] p-[10px] flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/banned-users?userid=${encodeURIComponent(r.id)}`);
      }}
    >
      حظر
    </DropdownMenuItem>

    {/* زر الحذف */}
    <DropdownMenuItem
      className="cursor-pointer text-[16px] text-red-600 rounded-[10px] p-[10px] flex items-center justify-center"
      onClick={async (e) => {
        e.stopPropagation();

        const confirmDelete = window.confirm('هل أنت متأكد من حذف هذا البوست؟');
        if (!confirmDelete) return;

        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('auth_token') ||
          '';

        if (!token) {
          alert('لا يوجد توكن في المتصفح');
          return;
        }

        try {
          const res = await fetch(`http://bo-chat.space/dashboard/posts/${r.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || 'فشل حذف البوست');
          }

          alert('تم حذف البوست بنجاح ✅');
          // ممكن تحدث القائمة لو عايز
          window.location.reload();
        } catch (err: any) {
          alert('حدث خطأ أثناء الحذف: ' + err.message);
        }
      }}
    >
      حذف
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
                  </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {r.postImages?.length ? (
                      r.postImages.slice(0, 6).map((src: string | StaticImport, i: number) => (
                        <button
                          key={ i}
                          className="relative h-6 w-6 overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          onClick={() => openLightbox(r.postImages, i)}
                          aria-label="عرض الصورة"
                          title="عرض الصورة"
                        >
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
              {r.status ? 
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
              :""}
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.userName}</td>
                <td className="p-3 flex items-center justify-center ">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full ">
                    <Image src={r.avatar} alt={r.userName} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-3">{r.no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
