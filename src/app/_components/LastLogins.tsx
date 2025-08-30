/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

export type RegistrationRow = {
  no: Key | null | undefined;
  postImages: any;
  comments: ReactNode;
  likes: ReactNode;
  publishedAgo: ReactNode;
  avatar: string | StaticImport;
  views: ReactNode;
  postType: ReactNode;
  governorate: string;
  gender: string;
  role: string;
  country: any;
  id: string;
  index: number; 
  avatarUrl?: string;
  userName: string; 
  emailOrPhone: string; 
  type: 'جوجل' | 'فيسبوك' | 'انشاء حساب'; 
  birthDate: string; 
  status: 'نشط' | 'غير نشط'; 
};

type Props = {
  title?: string;
  rows: RegistrationRow[];
  onRowClick?: (row: RegistrationRow) => void;
};

const badgeClasses = (status: RegistrationRow['status']) =>
  status === 'نشط'
    ? 'bg-sky-100 text-sky-700'
    : 'bg-rose-100 text-rose-700';

const typeClasses = (t: RegistrationRow['type']) => {
  switch (t) {
    case 'جوجل':
      return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200';
    case 'فيسبوك':
      return 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200';
    default:
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200';
  }
};

export default function LastLogins({ title = 'اخر عمليات تسجيل', rows, onRowClick }: Props) {
const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    // شيل التشكيل والتطويل
    .replace(/[\u064B-\u0652\u0640]/g, '')
    // وحّد المسافات
    .replace(/\s+/g, ' ')
    .trim()
    // طباعة يونيكود (تفيد مع بعض الحالات)
    .normalize('NFKD');

const [query, setQuery] = useState('');
const filtered = useMemo(() => {
  const q = norm(query);
  if (!q) return rows;

  return rows.filter((r) => {
    const haystack = norm(
      [r.userName, r.emailOrPhone, r.id, r.type, r.status].join(' ')
    );
    return haystack.includes(q);
  });
}, [rows, query]);


  return (
    <section className="!w-full logins-table">
      <header className="mb-3">
        <h2 className="text-rose-600 text-lg font-semibold" dir="rtl">{title}</h2>
      </header>
      <div className="flex justify-end mb-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم / الايميل / الحالة"
          className="h-9 w-72 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" dir="rtl">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-rose-50/60 backdrop-blur supports-[backdrop-filter]:bg-rose-50/50">
              <tr className="text-gray-600">
                <th className="w-16 py-3 pr-4 pl-2 text-center font-medium">الرقم</th>
                <th className="w-16 py-3 px-2 text-right font-medium">صورة</th>
                <th className="py-3 px-2 text-right font-medium">اسم المستخدم</th>
                <th className="py-3 px-2 text-right font-medium">id</th>
                <th className="py-3 px-2 text-right font-medium">الحالة</th>
                <th className="py-3 px-2 text-right font-medium">تاريخ الميلاد</th>
                <th className="py-3 px-2 text-right font-medium">الايميل</th>
                <th className="py-3 pl-4 pr-2 text-right font-medium">نوع التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.index}
                  onClick={() => onRowClick?.(r)}
                  className="even:bg-gray-50/60 hover:bg-rose-50/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 pr-4 pl-2 text-center text-gray-700">{r.index}</td>

                  <td className="py-3 px-2">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                      <Image
                        src={r.avatarUrl || '/avatar-placeholder.png'}
                        alt={r.userName}
                        fill
                        sizes="36px"
                      />
                    </div>
                  </td>

                  <td className="py-3 px-2 font-medium text-gray-800">{r.userName}</td>
                  <td className="py-3 px-2 text-gray-500">{r.id}</td>

                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(r.status)}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-gray-600">{r.birthDate}</td>
                  <td className="py-3 px-2 text-gray-700">{r.emailOrPhone}</td>

                  <td className="py-3 pl-4 pr-2">
                    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${typeClasses(r.type)}`}>
                      {r.type}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
