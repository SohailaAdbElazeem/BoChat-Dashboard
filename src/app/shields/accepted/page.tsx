'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import FilterBar, { Filters } from '@/app/_components/FilterBar'; // عدّل المسار لو مختلف

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

// ===== Types =====
type SentShield = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  shieldType: string;    
  status: 'sent' | 'approved' | 'rejected';
  approvedAt?: string | null;
  shippedAt?: string | null; 
  idImageUrl?: string | null;

  type?: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
};

type RegistrationRow = {
  id: string;
  userName: string;
  emailOrPhone: string;
  type?: string;
  status?: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
};

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('ar-EG') : 'لا يوجد بعد';

// ===== Card =====
function SentShieldCard({
  row,
  onApprove,
  onResend,
}: {
  row: SentShield;
  onApprove: (id: string) => Promise<void>;
  onResend: (id: string) => Promise<void>;
}) {
  return (
    <div className="rounded-[20px] bg-[#F6F6F6] p-4">
      <div className="text-center text-[#D72229] font-semibold mb-3">معلومات الحساب</div>

      <div className="space-y-3 text-[13px]">
        <div className="h-9 rounded-[12px] bg-[#EDEDED] flex items-center justify-between px-3 text-[#6B7280]">
          <span>الإيميل:</span>
          <span className="text-[#666]">{row.email}</span>
        </div>
        <div className="h-9 rounded-[12px] bg-[#EDEDED] flex items-center justify-between px-3 text-[#6B7280]">
          <span>الاسم:</span>
          <span className="text-[#666]">{row.fullName}</span>
        </div>
        <div className="h-9 rounded-[12px] bg-[#EDEDED] flex items-center justify-between px-3 text-[#6B7280]">
          <span>رقم الهاتف:</span>
          <span className="text-[#666]">{row.phone}</span>
        </div>
        <div className="h-9 rounded-[12px] bg-[#EDEDED] flex items-center justify-between px-3 text-[#6B7280]">
          <span>العنوان:</span>
          <span className="text-[#666] truncate max-w-[60%]">{row.address || '—'}</span>
        </div>
        <div className="h-9 rounded-[12px] bg-[#EDEDED] flex items-center justify-between px-3 text-[#6B7280]">
          <span>نوع الدرع:</span>
          <span className="text-[#666]">{row.shieldType}</span>
        </div>

        {/* تواريخ + صورة */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-10 rounded-[12px] bg-[#EDEDED] flex items-center justify-center text-[#6B7280]">
            تاريخ الموافقة: {fmtDate(row.approvedAt)}
          </div>
          <div className="flex-1 h-10 rounded-[12px] bg-[#EDEDED] flex items-center justify-center text-[#6B7280]">
            تاريخ شحن الدرع: {fmtDate(row.shippedAt)}
          </div>
          <div className="w-[46px] h-[46px] overflow-hidden rounded-[10px] bg-white border">
            {row.idImageUrl ? (
              <Image src={row.idImageUrl} alt="ID" width={46} height={46} className="object-cover w-full h-full" />
            ) : null}
          </div>
        </div>

        {/* الأزرار */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onResend(row.id)}
            className="rounded-full bg-[#D72229] text-white py-2 hover:opacity-90"
          >
            إعادة إرسال
          </button>
          <button
            onClick={() => onApprove(row.id)}
            className="rounded-full bg-[#E7F6EE] text-[#1F9254] py-2 hover:opacity-90"
          >
            تم الموافقة
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SentShieldsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SentShield[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: '' });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/shields/sent`, { cache: 'no-store' });
        const json: SentShield[] = await res.json();
        if (alive) setRows(json);
      } catch (e) {
        console.error('fetch sent shields failed:', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // تجهيز داتا الفلتر
  const regRows: RegistrationRow[] = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        userName: r.fullName,
        emailOrPhone: `${r.email} ${r.phone}`,
        type: r.type || r.shieldType,
        status: r.status,
        country: r.country,
        governorate: r.governorate,
        gender: r.gender,
        role: r.role,
      })),
    [rows]
  );

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
      if (filters.type && (r.type || r.shieldType) !== filters.type) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.country && r.country !== filters.country) return false;
      if (filters.governorate && r.governorate !== filters.governorate) return false;
      if (filters.gender && r.gender !== filters.gender) return false;
      if (filters.role && r.role !== filters.role) return false;

      if (!q) return true;
      const hay = norm([r.fullName, r.email, r.phone, r.address, r.shieldType, r.status].join(' '));
      return hay.includes(q);
    });
  }, [rows, filters]);

  // Actions (optimistic)
  const patch = (id: string, p: Partial<SentShield>) =>
    setRows((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const onApprove = async (id: string) => {
    const old = rows.find((x) => x.id === id);
    patch(id, { status: 'approved', approvedAt: new Date().toISOString() });
    try {
      const res = await fetch(`${API_BASE}/shields/sent/${id}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('approve failed');
    } catch (e) {
      if (old) patch(id, old);
      console.error(e);
    }
  };

  const onResend = async (id: string) => {
    // ما نغيّرش الحالة محليًا إلا لو حابب تحسب عداد محاولات، هنا بننفّذ بس
    try {
      const res = await fetch(`${API_BASE}/shields/sent/${id}/resend`, { method: 'POST' });
      if (!res.ok) throw new Error('resend failed');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      <div className="mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-2">
          <Link href="/shields" className="rounded-full p-1 hover:bg-gray-100">
            <ChevronRight className="w-6 h-6 text-[#D72229]" />
          </Link>
          <h1 className="text-[#D72229] text-xl font-semibold">الدروع التي تم إرسالها</h1>
        </div>

        <FilterBar rows={regRows} filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[300px] rounded-[20px] bg-[#F6F6F6] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-20">لا توجد نتائج مطابقة حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((row) => (
              <SentShieldCard key={row.id} row={row} onApprove={onApprove} onResend={onResend} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
