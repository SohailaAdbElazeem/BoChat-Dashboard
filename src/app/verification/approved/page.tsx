'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FilterBar, { Filters } from '@/app/_components/FilterBar'; // عدّل المسار لو مختلف

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

/* ========== Types ========== */
type SuspendedAccount = {
  id: string;
  email: string;
  fullName: string;
  verificationType: string; // مجاني/مدفوع
  durationLabel: string;    // عام/6 أشهر ...
  remainingDays: number;    // باقي على انتهاء الإيقاف
  status: 'suspended' | 'active';

  // فلترة اختيارية
  type?: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
};

/* ========== Card ========== */
function SuspendedAccountCard({
  row,
  onOpenPeriod,
  onCancelVerification,
}: {
  row: SuspendedAccount;
  onOpenPeriod: (id: string) => Promise<void>;
  onCancelVerification: (id: string) => Promise<void>;
}) {
  const pill = (txt: string) => (
    <div className="h-9 rounded-[12px] bg-[#EDEDED] flex items-center justify-center px-3 text-[13px] text-[#6B7280]">
      {txt}
    </div>
  );

  return (
    <div className="rounded-[20px] bg-[#F6F6F6] p-4">
      <div className="text-center text-[#D72229] font-semibold mb-3">معلومات الحساب</div>

      <div className="space-y-3">
        {pill(`الإيميل:  ${row.email}`)}
        {pill(`الاسم:   ${row.fullName}`)}
        <div className="grid grid-cols-2 gap-3">
          {pill(`نوع التوثيق: ${row.verificationType}`)}
          {pill(`مدة التوثيق: ${row.durationLabel}`)}
        </div>
        {pill(`متبقي على انتهاء الإيقاف: ${row.remainingDays} يوم`)}

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenPeriod(row.id)}
            className="rounded-full bg-[#D72229] text-white py-2 hover:opacity-90"
          >
            فتح مدة
          </button>
          <button
            onClick={() => onCancelVerification(row.id)}
            className="rounded-full bg-[#FCE8E8] text-[#D72229] py-2 hover:opacity-90"
          >
            إلغاء التوثيق
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== Page ========== */
export default function SuspendedAccountsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SuspendedAccount[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: '' });

  // Fetch from API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/verification/suspended`, { cache: 'no-store' });
        const json: SuspendedAccount[] = await res.json();
        if (alive) setRows(json);
      } catch (e) {
        console.error('fetch suspended accounts failed:', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // تجهيز بيانات الفلتر
  const regRows = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        userName: r.fullName,
        emailOrPhone: r.email,
        type: r.type || r.verificationType,
        status: r.status,
        country: r.country,
        governorate: r.governorate,
        gender: r.gender,
        role: r.role,
      })),
    [rows]
  );

  // فلترة الكروت
  const norm = (v: unknown) =>
    String(v ?? '')
      .toLowerCase()
      .replace(/[\u064B-\u0652\u0640]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .normalize('NFKD');

  const filtered = useMemo(() => {
    const q = norm(filters.query);
    return rows.filter((r) => {
      if (filters.type && (r.type || r.verificationType) !== filters.type) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.country && r.country !== filters.country) return false;
      if (filters.governorate && r.governorate !== filters.governorate) return false;
      if (filters.gender && r.gender !== filters.gender) return false;
      if (filters.role && r.role !== filters.role) return false;
      if (!q) return true;

      const hay = norm([r.fullName, r.email, r.verificationType, r.durationLabel, r.status].join(' '));
      return hay.includes(q);
    });
  }, [rows, filters]);

  // Actions (optimistic update)
  const patch = (id: string, p: Partial<SuspendedAccount>) =>
    setRows((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const onOpenPeriod = async (id: string) => {
    const old = rows.find((x) => x.id === id);
    patch(id, { status: 'active' });
    try {
      const res = await fetch(`${API_BASE}/verification/suspended/${id}/open-period`, { method: 'POST' });
      if (!res.ok) throw new Error('open period failed');
    } catch (e) {
      if (old) patch(id, old);
      console.error(e);
    }
  };

  const onCancelVerification = async (id: string) => {
    const old = rows.find((x) => x.id === id);
    patch(id, { status: 'active' }); // أو أي حالة مناسبة بعد الإلغاء
    try {
      const res = await fetch(`${API_BASE}/verification/suspended/${id}/cancel`, { method: 'POST' });
      if (!res.ok) throw new Error('cancel failed');
    } catch (e) {
      if (old) patch(id, old);
      console.error(e);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      <div className="mx-auto  px-4 py-6 space-y-5">
        {/* عنوان + رجوع */}
        <div className="flex items-center gap-2">
          <Link href="/verification" className="rounded-full p-1 hover:bg-gray-100">
            <ChevronRight className="w-6 h-6 text-[#D72229]" />
          </Link>
          <h1 className="text-[#D72229] text-xl font-semibold">قائمة الحسابات الموقّفة</h1>
        </div>

        {/* شريط الفلاتر */}
        <FilterBar rows={regRows} filters={filters} onChange={setFilters} />

        {/* الشبكة */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[260px] rounded-[20px] bg-[#F6F6F6] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-20">لا توجد نتائج مطابقة حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((row) => (
              <SuspendedAccountCard
                key={row.id}
                row={row}
                onOpenPeriod={onOpenPeriod}
                onCancelVerification={onCancelVerification}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
