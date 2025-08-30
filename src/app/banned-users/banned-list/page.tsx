'use client';

import React, { useMemo, useState } from 'react';
import FilterBar, { type Filters } from '@/app/_components/FilterBar'; // عدّل المسار حسب مشروعك

/** نفس النوع المستخدم في FilterBar */
export type RegistrationRow = {
  id: string;
  userName: string;
  emailOrPhone: string;
  type: 'Email' | 'Phone' | 'Google' | string;
  status: 'active' | 'blocked' | 'pending' | string;
  country?: string;
  governorate?: string;
  gender?: 'ذكر' | 'أنثى' | string;
  role?: 'user' | 'admin' | string;

  /** حقول خاصة بواجهة الحظر */
  banDurationLabel: string;     // مثال: "أسبوع" / "يومين" / "شهر"
  unbanned?: boolean;           // لو اتعمل Unban محليًا
};

/* -------- Fake data (بدّل لاحقًا ببيانات API) -------- */
const FAKE_ROWS: RegistrationRow[] = [
  {
    id: 'U-1001',
    userName: 'عبدالله محمد',
    emailOrPhone: 'Abdallahsayed23@gmail.com',
    type: 'Email',
    status: 'blocked',
    country: 'مصر',
    governorate: 'الجيزة',
    gender: 'ذكر',
    role: 'user',
    banDurationLabel: 'يومين',
  },
  {
    id: 'U-1002',
    userName: 'عبدالعزيز محمد',
    emailOrPhone: 'Abdallahsayed23@gmail.com',
    type: 'Email',
    status: 'blocked',
    country: 'مصر',
    governorate: 'القاهرة',
    gender: 'ذكر',
    role: 'user',
    banDurationLabel: 'أسبوع',
  },
  {
    id: 'U-1003',
    userName: 'عبدالله محمد',
    emailOrPhone: 'Abdallahsayed23@gmail.com',
    type: 'Phone',
    status: 'blocked',
    country: 'السعودية',
    governorate: 'الرياض',
    gender: 'ذكر',
    role: 'user',
    banDurationLabel: 'أسبوع',
  },
  {
    id: 'U-1004',
    userName: 'أحمد علي',
    emailOrPhone: 'ahmed@example.com',
    type: 'Google',
    status: 'blocked',
    country: 'مصر',
    governorate: 'الإسكندرية',
    gender: 'ذكر',
    role: 'user',
    banDurationLabel: 'يوم',
  },
  {
    id: 'U-1005',
    userName: 'مريم حسن',
    emailOrPhone: 'mariam@example.com',
    type: 'Email',
    status: 'blocked',
    country: 'مصر',
    governorate: 'القاهرة',
    gender: 'أنثى',
    role: 'user',
    banDurationLabel: 'أسبوع',
  },
  {
    id: 'U-1006',
    userName: 'سارة سمير',
    emailOrPhone: 'sara@example.com',
    type: 'Phone',
    status: 'blocked',
    country: 'مصر',
    governorate: 'بني سويف',
    gender: 'أنثى',
    role: 'user',
    banDurationLabel: '3 أيام',
  },
];

/* نفس دالة التطبيع الموجودة جوه FilterBar لضمان تطابق الفلترة */
const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD');

/* فلترة النتائج بنفس منطق FilterBar */
function applyFilters(rows: RegistrationRow[], filters: Filters) {
  const q = norm(filters.query);
  return rows.filter((r) => {
    if (filters.type && r.type !== filters.type) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.country && r.country !== filters.country) return false;
    if (filters.governorate && r.governorate !== filters.governorate) return false;
    if (filters.gender && r.gender !== filters.gender) return false;
    if (filters.role && r.role !== filters.role) return false;

    if (!q) return true;
    const hay = norm([
      r.userName,
      r.emailOrPhone,
      r.id,
      r.type,
      r.status,
      r.country,
      r.governorate,
      r.gender,
      r.role,
    ].join(' '));
    return hay.includes(q);
  });
}

/* بطاقة “الحساب المحظور” */
function BlockCard({
  row,
  onUnban,
}: {
  row: RegistrationRow;
  onUnban: (id: string) => void;
}) {
  const fieldBox =
    'h-9 w-full rounded-xl bg-[#EDEDED] text-[13px] text-[#7A7A7A] flex items-center px-3';
  return (
    <div className="rounded-[24px] bg-[#F6F6F6] p-5 shadow-sm border  border-[#F0F0F0]">
      <div className="text-center text-[#E73E3E] font-semibold mb-4">معلومات الحساب</div>

      <div className="space-y-2">
        <div className={fieldBox}>
          <span className="truncate">{row.emailOrPhone}</span>
          <span className="ms-auto text-[#B1B1B1]">البريد</span>
        </div>
        <div className={fieldBox}>
          <span className="truncate">{row.userName}</span>
          <span className="ms-auto text-[#B1B1B1]">الاسم</span>
        </div>
        <div className={`${fieldBox} !bg-[#d7222942]`}>
          <span className="truncate">{row.banDurationLabel}</span>
          <span className="ms-auto text-[#B1B1B1]">مدة الحظر</span>
        </div>
      </div>

      <button
        disabled={row.unbanned}
        onClick={() => onUnban(row.id)}
        className={[
          'mt-4 h-10 w-full rounded-[14px] text-white font-medium transition',
          row.unbanned
            ? 'bg-[#FFF] !text-[#E02020] cursor-default'
            : 'bg-[#E02020] hover:opacity-90',
        ].join(' ')}
      >
        {row.unbanned ? 'تم إلغاء الحظر' : 'إلغاء الحظر'}
      </button>
    </div>
  );
}

export default function BlockedAccountsPage() {
  // عادة هتجيب الداتا من API وتخزنها في state
  const [rows, setRows] = useState<RegistrationRow[]>(FAKE_ROWS);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    status: 'blocked', // افتراضيًا بنعرض المحظورين
  });

  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  const handleUnban = async (id: string) => {
    // هنا تقدر تنادي API:
    // await fetch('/api/unban', { method:'POST', body: JSON.stringify({ id }) })
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, unbanned: true, status: 'active' } : r)),
    );
  };

  return (
    <main className="py-6 pr-[10px] ">
      {/* شريط الفلاتر */}
      <div className="mb-6" dir='rtl'>
        <FilterBar rows={rows} filters={filters} onChange={setFilters} />
      </div>

      {/* العنوان */}
      <div className="mb-4 text-[#E02020] font-semibold text-lg text-end">الحسابات المحظورة</div>

      {/* الشبكة */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3  !pl-[80px]">
        {filtered.map((row) => (
          <BlockCard key={row.id} row={row} onUnban={handleUnban} />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex items-center justify-center rounded-2xl bg-white p-10 text-[#8F8F8F] border border-[#F0F0F0]">
            لا توجد نتائج مطابقة للفلتر الحالي.
          </div>
        )}
      </div>
    </main>
  );
}
