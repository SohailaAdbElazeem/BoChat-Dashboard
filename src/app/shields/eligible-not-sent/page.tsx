'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FilterBar, { Filters } from '@/app/_components/FilterBar';

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

  // جديد: هنحتاجه في API القبول
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
}: {
  req: ShieldRequest;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onCharge: (id: string) => Promise<void>;
}) {
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

        <div className="flex items-center gap-3">
          <div className="flex h-10 flex-1 items-center justify-center rounded-[18px] bg-[#E6E6E6] text-[15px] text-[#6B7280]">
            تاريخ الموافقة: {formatDate(req.approvedAt)}
          </div>
          <div className="flex h-10 flex-1 items-center justify-center rounded-[18px] bg-[#E6E6E6] text-[15px] text-[#6B7280]">
            تاريخ شحن الدرع: {formatDate(req.chargeDate)}
          </div>
          <div className="h-[46px] w-[46px] overflow-hidden rounded-[10px] border bg-white">
            {req.idImageUrl ? (
              <Image src={req.idImageUrl} alt="ID" width={46} height={46} className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <button onClick={() => onCharge(req.id)} className="rounded-full border-1 border-[#D72229] py-2 text-[#D72229]">
            الشحن
          </button>
          <button onClick={() => onReject(req.id)} className="rounded-full bg-[#D72229] py-2 text-white">
            رفض
          </button>
          <button onClick={() => onApprove(req.id)} className="rounded-full bg-[#D72229] py-2 text-white">
            تم الموافقة
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

  // helper لعمل API_BASE (اختياري)
  const API_BASE =
    (process.env.NEXT_PUBLIC_API_BASE && /^https?:\/\//i.test(process.env.NEXT_PUBLIC_API_BASE)
      ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/+$/, '')
      : process.env.NEXT_PUBLIC_API_BASE
      ? `http://${process.env.NEXT_PUBLIC_API_BASE.replace(/\/+$/, '')}`
      : '') || '';

  // جلب البيانات من الـ API بالتوكن من localStorage
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError('');

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) throw new Error('لا يوجد توكن في المتصفح. من فضلك سجّل الدخول.');

        // لو محددتش NEXT_PUBLIC_API_BASE هنستخدم الرابط الكامل كـ fallback
        const url =
          API_BASE
            ? `${API_BASE}/request/shields/6877d5497b04a3c83759f122`
            : `http://bo-chat.space/request/shields/6877d5497b04a3c83759f122`;

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

        // ماب → ShieldRequest
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
            userid: it.userid, // مهم لنداء القَبول
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
  }, []); // run once

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

  // ====== زر "تم الموافقة" → POST /request/shield/accept ======
// ===== helper: فكّ الـ JWT وطباعة الـ claims (للدِيبَج) =====
function parseJwt(token?: string | null) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// ===== اختر هوست الإكشن من ENV وإلا فولباك مناسب =====
const ACTION_BASE =
  process.env.NEXT_PUBLIC_ACTION_BASE // مثلاً http://localhost:4000
    ? process.env.NEXT_PUBLIC_ACTION_BASE.replace(/\/+$/, '')
    : (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:4000'
    : 'http://bo-chat.space';

const onApprove = async (id: string) => {
  const row = rows.find((r) => r.id === id);
  if (!row) return;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    console.error('No token found in localStorage.');
    alert('لا يوجد توكن — من فضلك سجّل الدخول.');
    return;
  }
  if (!row.userid) {
    console.error('Missing userid on row; cannot accept.');
    alert('لا يوجد userid في العنصر — لا يمكن الإرسال.');
    return;
  }

  // اطبع الكليمز لفحص الدور/الصلاحيات
  const claims = parseJwt(token);
  console.log('[JWT claims]', claims);

  try {
    const res = await fetch(`${ACTION_BASE}/request/shield/accept`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: row.userid, // من الداتا الراجعة
        requestid: id,      // هو نفسه _id اللي اتحوّل لـ id
      }),
    });

    const text = await res.text().catch(() => '');
    // حاول نفك JSON إن أمكن
    let payload: any = null;
    try { payload = text ? JSON.parse(text) : null; } catch {}

    if (!res.ok) {
      // رجّع رسالة السيرفر لو متاحة
      const msg =
        (payload && (payload.message || payload.case)) ||
        text ||
        res.statusText ||
        'Request failed';
      console.error('Accept failed:', res.status, msg);
      alert(`فشل القبول: ${msg}`);
      return;
    }

    // Success → حدّث الواجهة
    patchLocal(id, { status: 'approved', approvedAt: new Date().toISOString() });
  } catch (e: any) {
    console.error('accept failed (network):', e);
    alert('حدث خطأ في الاتصال بالسيرفر.');
  }
};


  // رفض (محلي فقط حالياً)
  const onReject = async (id: string) => {
    patchLocal(id, { status: 'rejected' });
  };

  // شحن (محلي فقط حالياً)
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

        {/* حالات التحميل/الخطأ */}
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

        {/* المحتوى */}
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
                />
              ))}
            </div>
          )
        )}
      </div>
    </main>
  );
}
