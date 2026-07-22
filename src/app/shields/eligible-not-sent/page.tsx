/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FilterBar, { Filters } from '@/app/_components/FilterBar';
// const adminId = localStorage.getItem("userid")

/* ================= أنواع البيانات ================= */
type ShieldStatus = 'pending' | 'approved' | 'rejected' | 'charged' | 'awaiting-charge';
type ShieldRequest = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  shieldType: string;        // من type أو '—'
  followers?: number;
  status: ShieldStatus;      // (افتراضي pending)
  approvedAt?: string | null;
  chargeDate?: string | null;
  idImageUrl?: string | null;
  type?: string;             // القيمة الخام من الـ API (مثلاً "5000")
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;

  // مهم: راجع من API الrequests وهنبعته مع accept
  userid?: string;
};

export type RegistrationRow = {
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

/* ================= فورمات ================ */
const formatNum = (n?: number) => (typeof n === 'number' ? n.toLocaleString('ar-EG') : '');
const formatDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('ar-EG') : '—');

/* ================= الكارد ================= */
function ShieldRequestCard({
  req,
  onApprove,
  onReject,
  onCharge,
  busy,
}: {
  req: ShieldRequest;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onCharge: (id: string) => Promise<void>;
  busy?: boolean;
}) {
  const shieldImg =
    req.shieldType === '5000'
      ? '/imgs/bronze.svg'
      : req.shieldType === '10000'
      ? '/imgs/silver.svg'
      : '/imgs/default.svg';

  return (
    <div className="rounded-[34px] bg-[#F6F6F6] p-4">
      <div className="mb-3 text-center font-semibold text-[#D72229]">معلومات الحساب</div>

      <div className="space-y-3">
        <div className="flex !h-13 items-center !gap-2 rounded-[18px] bg-[#E6E6E6] px-3 text-[15px] text-[#6B7280]">
          <span>البريد:</span>
          <span className="text-[#666]">{req.email || '—'}</span>
        </div>

        <div className="flex h-13 items-center !gap-2 rounded-[18px] bg-[#E6E6E6] px-3 text-[15px] text-[#6B7280]">
          <span>الاسم:</span>
          <span className="text-[#666]">{req.fullName || '—'}</span>
        </div>

        <div className="flex h-13 items-center !gap-2 rounded-[18px] bg-[#E6E6E6] px-3 text-[15px] text-[#6B7280]">
          <span>رقم الهاتف:</span>
          <span className="text-[#666]">{req.phone || '—'}</span>
        </div>

        <div className="flex h-13 items-center !gap-2 rounded-[18px] bg-[#E6E6E6] px-3 text-[15px] text-[#6B7280]">
          <span>العنوان:</span>
          <span className="max-w-[60%] truncate text-[#666]">{req.address || '—'}</span>
        </div>

        <div className="flex h-13 items-center !gap-2 rounded-[18px] bg-[#D72229]/10 px-3 text-[15px] text-[#6B7280]">
          <span>نوع الدرع :</span>
          <span className="text-[#666]">
            {(() => {
              if (req.shieldType === '5000') {
                return `درع بو شات ستار | ${formatNum(5000)} متابع`;
              }
              if (req.shieldType === '10000') {
                return `درع بو شات برو | ${formatNum(10000)} متابع`;
              }
              return req.shieldType || '—';
            })()}
          </span>
        </div>

        <div className="flex h-13 items-center !gap-2 rounded-[18px] px-3 bg-[#D72229]/10 text-[15px]">
          <span>حالة الطلب:</span>
          <span className="font-medium">
            {req.status === 'pending'
              ? 'قيد المراجعة'
              : req.status === 'approved'
              ? 'تمت الموافقة'
              : req.status === 'rejected'
              ? 'تم الرفض'
              : req.status === 'charged'
              ? 'تم الشحن'
              : 'بانتظار الشحن'}
          </span>
        </div>

        <div className="flex items-center rounded-[18px]">
          <div className="h-[80px] w-[80px] rounded-[8px]">
            <img src={shieldImg} alt="shield" className="w-full h-full object-cover" />
          </div>
          <div className="bg-[#D72229]/10 w-full h-fit flex flex-col items-start p-3 rounded-tl-[18px] rounded-bl-[18px]">
            <div className="flex h-8 flex-1 items-center justify-center rounded-[18px] text-[15px] text-[#6B7280]">
              تاريخ الموافقة: {formatDate(req.approvedAt)}
            </div>
            <div className="flex h-8 flex-1 items-center justify-center rounded-[18px] text-[15px] text-[#6B7280]">
              تاريخ شحن الدرع: {formatDate(req.chargeDate)}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2" >
          <button
            onClick={() => onApprove(req.id)}
            className="rounded-[20px] cursor-pointer bg-[#D72229] py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy}
            aria-disabled={busy}
          >
            الموافقة
          </button>
          <button
            onClick={() => onReject(req.id)}
            className="rounded-[20px] cursor-pointer bg-[#D72229] py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy}
            aria-disabled={busy}
          >
            رفض
          </button>
          <button
            onClick={() => onCharge(req.id)}
            className="rounded-[20px] cursor-pointer border-1 border-[#D72229] py-3 text-[#D72229] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy}
            aria-disabled={busy}
          >
            الشحن
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= الصفحة ================= */
export default function ShieldRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ShieldRequest[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: '' });
  const [error, setError] = useState<string>('');
  const [busy, setBusy] = useState<string | null>(null); // يمسك id أثناء الطلب لمنع سبام

  const API_BASE =process.env.NEXT_PUBLIC_API_BASE 

  const [adminId, setAdminId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userid");
    setAdminId(id);
  }, []);


  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // if (!token) throw new Error('لا يوجد توكن في المتصفح. من فضلك سجّل الدخول.');
        // if (!adminId) return;
       if (!adminId) return;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) throw new Error('لا يوجد توكن في المتصفح. من فضلك سجّل الدخول.');
        const url =`${API_BASE}/request/shields/${adminId}`;
        const res = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
        }

        const raw = await res.json();
        const arr: any[] = Array.isArray(raw) ? raw : [raw];

        const mapped: ShieldRequest[] = arr.map((it) => {
          const fullName = (it.full_name || it.username || it.userid || '').toString().trim();
          const country = (it.country || '').toString().trim();
          const city = (it.city || '').toString().trim();
          const address = (it.address || '').toString().trim();
          const addressFinal =
            [address, [city, country].filter(Boolean).join(' - ')].filter(Boolean).join(' | ');

          return {
            id: it._id,
            email: it.email || '—',
            fullName: fullName || '—',
            phone: it.phone || '—',
            address: addressFinal || undefined,
            shieldType: it.type ? String(it.type) : '—',   // 5000 / 10000 ...
            type: it.type ? String(it.type) : undefined,
            status: 'pending',
            approvedAt: null,
            chargeDate: null,
            idImageUrl: null,
            country,
            governorate: undefined,
            gender: undefined,
            role: undefined,
            userid: it.userid, // 👈 مهم لنداء القَبول
          };
        });

        if (alive) setRows(mapped);
      } catch (e: any) {
        console.error('fetch shields failed:', e);
        if (alive) setError(e?.message || 'Fetch failed');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [adminId]); // run once

  // تحويل للـ FilterBar
  const registrationRows: RegistrationRow[] = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        userName: r.fullName,
        emailOrPhone: `${r.email} ${r.phone}`.trim(),
        type: r.type || r.shieldType,
        status: r.status,
        country: r.country,
        governorate: r.governorate,
        gender: r.gender,
        role: r.role,
      })),
    [rows]
  );

  // فلترة
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
      if (filters.status && r.status !== (filters.status as ShieldStatus)) return false;
      if (filters.country && r.country !== filters.country) return false;
      if (filters.governorate && r.governorate !== filters.governorate) return false;
      if (filters.gender && r.gender !== filters.gender) return false;
      if (filters.role && r.role !== filters.role) return false;
      if (!q) return true;

      const hay = norm(
        [
          r.fullName,
          r.email,
          r.phone,
          r.address,
          r.shieldType,
          r.status,
          r.country,
          r.governorate,
          r.gender,
          r.role,
        ]
          .filter(Boolean)
          .join(' ')
      );
      return hay.includes(q);
    });
  }, [rows, filters]);

  // تحديث محلي
  const patchLocal = (id: string, patch: Partial<ShieldRequest>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // ====== موافقة → POST /request/shield/accept ======
  const onApprove = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    const tk = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!tk) {
      alert('لا يوجد توكن — من فضلك سجّل الدخول.');
      return;
    }
    if (!row.userid) {
      alert('userid غير موجود على هذا الطلب — لا يمكن الإرسال.');
      return;
    }

    try {
      setBusy(id);

      const res = await fetch(`${API_BASE}/request/shield/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: row.userid,
          requestid: row.id,
        }),
      });

      const text = await res.text().catch(() => '');
      let payload: any = null;
      try { payload = text ? JSON.parse(text) : null; } catch {}

      if (!res.ok) {
        const msg =
          (payload && (payload.message || payload.case)) ||
          text ||
          res.statusText ||
          'Request failed';
        console.error('Accept failed:', res.status, msg);
        alert(`فشل القبول: ${msg}`);
        return;
      }

      patchLocal(id, { status: 'approved', approvedAt: new Date().toISOString() });
    } catch (e: any) {
      console.error('accept failed (network):', e);
      alert('حدث خطأ في الاتصال بالسيرفر.');
    } finally {
      setBusy(null);
    }
  };

  // رفض (محلي)
  const onReject = async (id: string) => {
    patchLocal(id, { status: 'rejected' });
  };

  // شحن (محلي)
  const onCharge = async (id: string) => {
    patchLocal(id, { status: 'charged', chargeDate: new Date().toISOString() });
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      <div className="mx-auto space-y-5 pr-[10px] py-6 !pl-[80px]">
        <div className="flex items-center gap-2">
          <Link href="/shields" className="rounded-full p-1 hover:bg-gray-100">
            <ChevronRight className="h-6 w-6 text-[#D72229]" />
          </Link>
          <h1 className="text-xl font-semibold text-[#D72229]">طلبات الحصول على الدرع</h1>
        </div>

        <FilterBar rows={registrationRows} filters={filters} onChange={setFilters} />

        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[300px] animate-pulse rounded-[20px] bg-[#F6F6F6]" />
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="py-20 text-center text-red-600">
            حدث خطأ أثناء جلب البيانات: {error}
          </div>
        )}

        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-500">لا توجد نتائج مطابقة حالياً</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((req) => (
                <ShieldRequestCard
                  key={req.id}
                  req={req}
                  onApprove={onApprove}
                  onReject={onReject}
                  onCharge={onCharge}
                  busy={busy === req.id}
                />
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}
