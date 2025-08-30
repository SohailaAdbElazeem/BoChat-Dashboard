'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FilterBar, { Filters } from '@/app/_components/FilterBar';

// خليه فاضي لحد ما تربط الـ API
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

/* ================= أنواع البيانات ================= */
type ShieldStatus = 'pending' | 'approved' | 'rejected' | 'charged' | 'awaiting-charge';

type ShieldRequest = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  shieldType: 'يوتيوب' | 'تيك توك' | 'إنستغرام' | string;
  followers?: number;              // مثال: 10000
  status: ShieldStatus;
  approvedAt?: string | null;      // ISO
  chargeDate?: string | null;      // ISO
  idImageUrl?: string | null;      // صورة الهوية
  // حقول للفلترة
  type?: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
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

/* ============== دوال مساعدة + داتا فيك داخل نفس الملف ============== */
// مولّد عشوائي بسيط بseed ثابت عشان القيم تفضل ثابتة بعد الريفرش
let __seed = 20250816;
const rnd = () => {
  __seed = (1103515245 * __seed + 12345) % 2 ** 31;
  return __seed / 2 ** 31;
};
const int = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];

const NAMES = ['Abdallah Mohamed','Eslam Mohamed','Yasser El Helw','Nada Adel','Mona Ali','Omar Samir','Mostafa Saad'];
const COUNTRIES = ['Egypt','KSA','UAE'];
const GOVS = ['Cairo','Giza','Alex','Riyadh','Jeddah','Dubai'];
const GENDERS = ['ذكر','أنثى'];
const ROLES = ['عام','مميز'];
const SHIELDS = ['يوتيوب', 'تيك توك', 'إنستغرام'];

const emailOf = (name: string) => `${name.replace(/\s+/g,'').toLowerCase()}${int(10,99)}@example.com`;
const phone = () => `010${int(10000000, 99999999)}`;

function makeMockShieldRequests(count = 18): ShieldRequest[] {
  return Array.from({ length: count }, (_, i) => {
    const fullName = pick(NAMES);
    const followers = int(3_000, 120_000);
    const status: ShieldStatus = pick(['pending','approved','rejected','awaiting-charge','charged']);
    const approvedAt = (status === 'approved' || status === 'charged') ? new Date(2025, int(0,5), int(1,28)).toISOString() : null;
    const chargeDate = status === 'charged' ? new Date(2025, int(0,5), int(1,28)).toISOString() : null;
    const type = pick(SHIELDS);

    return {
      id: `SR-${1000 + i}`,
      email: emailOf(fullName),
      fullName,
      phone: phone(),
      address: `شارع ${int(1,200)}، ${pick(GOVS)}`,
      shieldType: type,
      followers,
      status,
      approvedAt,
      chargeDate,
      idImageUrl: null,
      type,
      country: pick(COUNTRIES),
      governorate: pick(GOVS),
      gender: pick(GENDERS),
      role: pick(ROLES),
    };
  });
}

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

  const statusColor =
    req.status === 'approved'
      ? 'bg-green-100 text-green-700'
      : req.status === 'rejected'
      ? 'bg-red-100 text-red-700'
      : req.status === 'charged'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-[#EFEFEF] text-[#8989A2]';

  return (
    <div className="rounded-[20px] bg-[#F6F6F6] p-4">
      <div className="mb-3 text-center font-semibold text-[#D72229]">معلومات الحساب</div>

      <div className="space-y-3">
        <div className="flex h-9 items-center justify-between rounded-[12px] bg-[#EDEDED] px-3 text-[13px] text-[#6B7280]">
          <span>البريد:</span>
          <span className="text-[#666]">{req.email}</span>
        </div>

        <div className="flex h-9 items-center justify-between rounded-[12px] bg-[#EDEDED] px-3 text-[13px] text-[#6B7280]">
          <span>الاسم:</span>
          <span className="text-[#666]">{req.fullName}</span>
        </div>

        <div className="flex h-9 items-center justify-between rounded-[12px] bg-[#EDEDED] px-3 text-[13px] text-[#6B7280]">
          <span>رقم الهاتف:</span>
          <span className="text-[#666]">{req.phone}</span>
        </div>

        <div className="flex h-9 items-center justify-between rounded-[12px] bg-[#EDEDED] px-3 text-[13px] text-[#6B7280]">
          <span>العنوان:</span>
          <span className="max-w-[60%] truncate text-[#666]">{req.address || '—'}</span>
        </div>

        <div className="flex h-9 items-center justify-between rounded-[12px] bg-[#EDEDED] px-3 text-[13px] text-[#6B7280]">
          <span>نوع الدرع:</span>
          <span className="text-[#666]">
            {req.shieldType} — {formatNum(req.followers)} متابع
          </span>
        </div>

        <div className={`flex h-9 items-center justify-between rounded-[12px] px-3 text-[13px] ${statusColor}`}>
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
          <div className="flex h-10 flex-1 items-center justify-center rounded-[12px] bg-[#EDEDED] text-[12px] text-[#6B7280]">
            تاريخ الموافقة: {formatDate(req.approvedAt)}
          </div>
          <div className="flex h-10 flex-1 items-center justify-center rounded-[12px] bg-[#EDEDED] text-[12px] text-[#6B7280]">
            تاريخ شحن الدرع: {formatDate(req.chargeDate)}
          </div>
          <div className="h-[46px] w-[46px] overflow-hidden rounded-[10px] border bg-white">
            {req.idImageUrl ? (
              <Image src={req.idImageUrl} alt="ID" width={46} height={46} className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <button onClick={() => onCharge(req.id)} className={`rounded-full border-1 border-[#D72229] py-2 text-[#D72229] `}>
            الشحن
          </button>
          <button onClick={() => onReject(req.id)} className={`rounded-full bg-[#D72229] py-2 text-[#fff] `}>
            رفض
          </button>
          <button onClick={() => onApprove(req.id)} className={`rounded-full bg-[#D72229] py-2 text-[#fff] `}>
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

  // جلب البيانات: لو API موجود يشتغل، غير كده نستخدم الموك المضمن فوق
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (API_BASE) {
          const res = await fetch(`${API_BASE}/shields/requests`, { cache: 'no-store' });
          const json: ShieldRequest[] = await res.json();
          if (alive) setRows(json);
        } else {
          const mock = makeMockShieldRequests(18);
          if (alive) setRows(mock);
        }
      } catch (e) {
        // لو حصل خطأ، برضه اعرض الموك
        if (alive) setRows(makeMockShieldRequests(18));
        console.error('Failed to fetch shields, using inline mock:', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // تحويل للـ FilterBar
  const registrationRows: RegistrationRow[] = useMemo(
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
        [r.fullName, r.email, r.phone, r.address, r.shieldType, r.status, r.country, r.governorate, r.gender, r.role].join(' ')
      );
      return hay.includes(q);
    });
  }, [rows, filters]);

  // أفعال (تحديث متفائل) – تعمل حتى مع الداتا الفيك
  const patchLocal = (id: string, patch: Partial<ShieldRequest>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const onApprove = async (id: string) => {
    const old = rows.find((r) => r.id === id);
    patchLocal(id, { status: 'approved', approvedAt: new Date().toISOString() });
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/shields/requests/${id}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('approve failed');
    } catch (e) {
      if (old) patchLocal(id, old);
      console.error(e);
    }
  };

  const onReject = async (id: string) => {
    const old = rows.find((r) => r.id === id);
    patchLocal(id, { status: 'rejected' });
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/shields/requests/${id}/reject`, { method: 'POST' });
      if (!res.ok) throw new Error('reject failed');
    } catch (e) {
      if (old) patchLocal(id, old);
      console.error(e);
    }
  };

  const onCharge = async (id: string) => {
    const old = rows.find((r) => r.id === id);
    patchLocal(id, { status: 'charged', chargeDate: new Date().toISOString() });
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/shields/requests/${id}/charge`, { method: 'POST' });
      if (!res.ok) throw new Error('charge failed');
    } catch (e) {
      if (old) patchLocal(id, old);
      console.error(e);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      <div className="mx-auto space-y-5 pr-[10px] py-6 !pl-[70px]">
        <div className="flex items-center gap-2">
          <Link href="/shields" className="rounded-full p-1 hover:bg-gray-100">
            <ChevronRight className="h-6 w-6 text-[#D72229]" />
          </Link>
          <h1 className="text-xl font-semibold text-[#D72229]">طلبات الحصول على الدرع</h1>
        </div>
        <FilterBar rows={registrationRows} filters={filters} onChange={setFilters} />
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[300px] animate-pulse rounded-[20px] bg-[#F6F6F6]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
        )}
      </div>
    </main>
  );
}
