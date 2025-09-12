'use client';

import Image from 'next/image';
import * as React from 'react';
import FilterBar, { Filters } from '../_components/FilterBar';

// === نوع بيانات الإبلاغ ===
type Report = {
  id: string;
  userName: string;      // الاسم الظاهر
  userHandle: string;    // @handle
  avatar: string;

  // حقول مطلوبة للفلترة (لازم تبقى موجودة زي RegistrationRow)
  emailOrPhone: string;
  idNumber: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
  type?: string;   // نوع التسجيل
  status?: string; // الحالة

  // نص الإبلاغ + وصف المصدر/ملاحظة
  text: string;
  note?: string; // مثل: "هذا البلاغ وارد من قسم البلاغات…"

  sentAgo: string;  // مثل: "منذ أسبوع"
  source: 'من التطبيق' | 'من الموقع';

  // حالة الإجراء
  replied?: boolean;
  ignored?: boolean;
};

// === داتا تجريبية (بدّلها ببياناتك) ===
const SEED: Report[] = [
  {
    id: 'r1',
    userName: 'محمد أحمد',
    userHandle: 'm_ahmed@',
    avatar: '/avatars/a1.png',
    emailOrPhone: 'Abdallahsayed23@gmail.com',
    idNumber: '23896590',
    country: 'مصر',
    governorate: 'القاهرة',
    gender: 'ذكر',
    role: 'مستخدم',
    type: 'تسجيل بريد',
    status: 'نشط',
    text:
      'أود الإبلاغ عن عطل في (البنر) حيث أنها لا تعمل بشكل صحيح على جهازي (نوع الجهاز):',
    note: 'هذا البلاغ وارد من قسم البلاغات في التطبيق (حرف المستخدم)',
    sentAgo: 'منذ أسبوع',
    source: 'من التطبيق',
  },
  {
    id: 'r2',
    userName: 'محمود حمدي',
    userHandle: 'm_hamde@',
    avatar: '/avatars/a2.png',
    emailOrPhone: 'Abdallahsayed3@gmail.com',
    idNumber: '23896590',
    country: 'مصر',
    governorate: 'الجيزة',
    gender: 'ذكر',
    role: 'مستخدم',
    type: 'تسجيل جوال',
    status: 'نشط',
    text: 'هذا البلاغ وارد من قسم البلاغات في التطبيق (جزء المستخدم)',
    sentAgo: 'منذ شهر',
    source: 'من الموقع',
    replied: true,
  },
  // زوّد ما تشاء...
];

// === نفس دالة التطبيع المستخدمة داخل FilterBar ليتطابق الفلتر ===
const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD');

// فلترة في الصفحة (مطابقة لما يقوم به FilterBar داخلياً)
function applyFilters(rows: Report[], filters: Filters) {
  const q = norm(filters.query);
  return rows.filter((r) => {
    if (filters.type && r.type !== filters.type) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.country && r.country !== filters.country) return false;
    if (filters.governorate && r.governorate !== filters.governorate) return false;
    if (filters.gender && r.gender !== filters.gender) return false;
    if (filters.role && r.role !== filters.role) return false;

    if (!q) return true;
    const hay = norm(
      [
        r.userName,
        r.emailOrPhone,
        r.idNumber,
        r.type,
        r.status,
        r.country,
        r.governorate,
        r.gender,
        r.role,
      ].join(' ')
    );
    return hay.includes(q);
  });
}

// تحويل Report إلى الشكل المتوقع من FilterBar (RegistrationRow)
function toRegistrationRow(r: Report) {
  return {
    userName: r.userName,
    emailOrPhone: r.emailOrPhone,
    id: r.idNumber,
    type: r.type ?? '',
    status: r.status ?? '',
    country: r.country ?? '',
    governorate: r.governorate ?? '',
    gender: r.gender ?? '',
    role: r.role ?? '',
  };
}

export default function ReportsPage() {
  const [reports, setReports] = React.useState<Report[]>(SEED);
  const [filters, setFilters] = React.useState<Filters>({
    query: '',
    type: undefined,
    status: undefined,
    country: undefined,
    governorate: undefined,
    gender: undefined,
    role: undefined,
  });

  const filtered = React.useMemo(() => applyFilters(reports, filters), [reports, filters]);

  const setReplied = (id: string, replied: boolean) =>
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, replied, ignored: replied ? false : r.ignored } : r)));
  const setIgnored = (id: string, ignored: boolean) =>
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ignored, replied: ignored ? false : r.replied } : r)));

  return (
    <main className="p-6 ">
      <div className="mb-4 pl-[50px]" dir='rtl'>
        <FilterBar
          rows={reports.map(toRegistrationRow)}
          filters={filters}
          onChange={setFilters}
        />
      </div>

      {/* العنوان */}
      <h2 className="mb-3 text-right text-[18px] font-semibold text-[#D12D2D]">الإبلاغات</h2>

      {/* القائمة */}
      <div className="space-y-4 pl-[60px]">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-[140px_minmax(220px,300px)_1fr] items-start gap-3 rounded-3xl bg-[#F6F6F6] p-3 "
          >
            {/* عمود الإجراءات (يسار الكارت) */}
            <div className="flex w-[140px] flex-col gap-2">
              {r.replied ? (
                <button
                  className="h-10 w-full rounded-2xl bg-[#EDEDED] text-sm font-medium text-gray-600"
                  disabled
                >
                  تم الرد
                </button>
              ) : (
                <button
                  onClick={() => setReplied(r.id, true)}
                  className="h-10 w-full rounded-2xl bg-[#D12D2D] text-sm font-medium text-white hover:bg-[#be2525]"
                >
                  رد
                </button>
              )}

              {r.ignored ? (
                <button
                  className="h-10 w-full rounded-2xl border border-[#E6E6E6] bg-white text-sm font-medium text-gray-500"
                  disabled
                >
                  تم التجاهل
                </button>
              ) : (
                <button
                  onClick={() => setIgnored(r.id, true)}
                  className="h-10 w-full rounded-2xl border border-[#D12D2D] bg-white text-sm font-medium text-[#D12D2D] hover:bg-red-50"
                >
                  تجاهل
                </button>
              )}
            </div>

            {/* عمود البيانات المختصرة (وسط رمادي فاتح) */}
            <div className="rounded-2xl bg-[#EDEDED] p-3 text-xs text-gray-600">
              <div className="mb-1">
                الإيميل: {r.emailOrPhone} <span className="mx-2">|</span> رقم الهاتف:
                <span className="ms-1">01067706757</span>
              </div>
              <div className="mb-1">ID: {r.idNumber}</div>
              <div className="mb-1">وقت الإرسال: {r.sentAgo}</div>
              <div>نوع الإرسال: {r.source}</div>
            </div>

            {/* عمود المحتوى (يمين) */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="mb-1 text-right text-sm text-gray-500">
                  {r.text}
                </div>
                {r.note && (
                  <div className="text-right text-xs text-gray-400">{r.note}</div>
                )}
              </div>

              {/* بروفايل مصغّر */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">{r.userName}</div>
                  <div className="text-xs text-gray-500">{r.userHandle}</div>
                </div>
                <Image
                  src={r.avatar}
                  alt={r.userName}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-3xl bg-[#F6F6F6] p-8 text-center text-gray-500">
            لا توجد نتائج مطابقة للفلاتر الحالية.
          </div>
        )}
      </div>
    </main>
  );
}
