/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FilterBar, { type Filters } from '@/app/_components/FilterBar';
import { ArrowLeft } from 'lucide-react';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';

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
  banDurationLabel: string; // مثال: "أسبوع" / "يومين" / "شهر"
  unbanned?: boolean;
};
const URL = process.env.NEXT_PUBLIC_API_BASE

const ENDPOINT_LIST = `${URL}/dashboard/bannedUsers`;
const ENDPOINT_UNBAN = `${URL}/unbanTill`;
const ADMIN_EMAIL = 'bo-chat@gmail.com';

/* ===== Helpers ===== */

async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => '');
  let data: any = {};
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch {
    /* ممكن يكون نص */
  }
  if (!res.ok) {
    const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
    throw new Error(reason);
  }
  return data || {};
}

function normalizeToArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.users)) return data.users;
  return [data]; // fallback: عنصر واحد
}

/* عرض مدة الحظر كـ label أنيق */
function msToLabel(ms?: number): string {
  if (!ms || ms <= 0) return '';
  const d = Math.floor(ms / (24 * 60 * 60 * 1000));
  const h = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (d >= 30) return 'شهر';
  if (d >= 7 && d % 7 === 0) return 'أسبوع';
  if (d === 3) return 'ثلاثة أيام';
  if (d === 2) return 'يومين';
  if (d === 1) return 'يوم';
  if (d > 0) return `${d} يوم`;
  if (h > 0) return `${h} ساعة`;
  return `${Math.floor(ms / 60000)} دقيقة`;
}

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
    const hay = norm(
      [
        r.userName,
        r.emailOrPhone,
        r.id,
        r.type,
        r.status,
        r.country,
        r.governorate,
        r.gender,
        r.role,
      ].join(' '),
    );
    return hay.includes(q);
  });
}

/* بطاقة “الحساب المحظور” */
function BlockCard({
  row,
  onUnban,
  unbanning,
}: {
  row: RegistrationRow;
  onUnban: (id: string) => void;
  unbanning: boolean;
}) {
  const fieldBox =
    'relative mb-2 flex items-center justify-between overflow-hidden rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]';
  return (
    <div className="rounded-[24px] bg-[#F6F6F6] p-5  border  border-[#F0F0F0]">
      <div className="text-center text-[#E73E3E] font-semibold mb-4">معلومات الحساب</div>

      <div className="space-y-2" dir='rtl'>
        <div className={fieldBox}>
          <span className="ms-auto text-[#B1B1B1]">الايميل: </span>
          <span className="truncate">{row.emailOrPhone}</span>
        </div>
        <div className={fieldBox}>
          <span className="ms-auto text-[#B1B1B1]">الاسم: </span>
          <span className="truncate">{row.userName}</span>
        </div>
        <div className={`${fieldBox} !bg-[#d7222942]`}>
          <span className="ms-auto text-[#B1B1B1]">مدة الحظر: </span>
          <span className="truncate">{row.banDurationLabel}</span>
        </div>
      </div>
    <div className='flex items-center justify-center'>
      <button
        disabled={row.unbanned || unbanning}
        onClick={() => onUnban(row.id)}
        className={[
          'mt-4 w-70 px-5 !py-4 flex items-center justify-center   rounded-[20px] text-white font-medium transition',
          row.unbanned || unbanning
            ? 'bg-[#FFF] !text-[#E02020] cursor-default opacity-60'
            : 'bg-[#E02020] hover:opacity-90',
        ].join(' ')}
      >
        {row.unbanned ? 'تم إلغاء الحظر' : unbanning ? 'جارٍ فك الحظر…' : 'إلغاء الحظر'}
      </button>
    </div>

    </div>
  );
}

export default function BlockedAccountsPage() {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [filters, setFilters] = useState<Filters>({
    query: '',
    status: 'blocked',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const token = useMemo(
    () =>
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token') ||
      '',
    [],
  );

  const headers = useMemo(() => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  /* تحويل عنصر API إلى RegistrationRow */
  const mapToRow = useCallback((u: any): RegistrationRow => {
    const id = u?.id || u?._id || u?.userid || '—';
    const name = u?.name || u?.username || '—';
    const email = u?.email || u?.useremail || '—';
    const durationMs = u?.durationMs ?? u?.banDurationMs ?? 0;
    const until = u?.until ?? u?.blockTill ?? u?.banUntil ?? null;

    return {
      id,
      userName: name,
      emailOrPhone: email,
      type: u?.type || 'Email',
      status: 'blocked',
      country: u?.country,
      governorate: u?.governorate,
      gender: u?.gender,
      role: u?.role || 'user',
      banDurationLabel: msToLabel(Number(durationMs)) || String(until),
    };
  }, []);

  /* جلب المحظورين */
  const fetchBanned = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await safeFetchJSON(ENDPOINT_LIST, {
        method: 'GET',
        headers,
        mode: 'cors',
      });
      const list = normalizeToArray(data);
      const mapped = list.map(mapToRow);
      setRows(mapped);
    } catch (e: any) {
      console.error('❌ bannedUsers error:', e);
      setErr(e?.message || 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, [headers, mapToRow]);

  useEffect(() => {
    fetchBanned();
  }, [fetchBanned]);

  /* فك الحظر */
  const handleUnban = useCallback(
    async (id: string) => {
      try {
        setBusyId(id);
        const body = { userid: id, adminemail: ADMIN_EMAIL };

        await safeFetchJSON(ENDPOINT_UNBAN, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
          mode: 'cors',
        });

        setRows((prev) =>
          prev
            .filter((r) => r.id !== id)
            .map((r) => (r.id === id ? { ...r, unbanned: true, status: 'active' } : r)),
        );
      } catch (e) {
        console.error('❌ unban error:', e);
      } finally {
        setBusyId(null);
      }
    },
    [headers],
  );

  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);
  const router = useRouter();
  return (
    <main className="py-6 pr-[10px] ">
      <div className="mb-6" dir="rtl">
        <FilterBar rows={rows} filters={filters} onChange={setFilters} />
      </div>

      <div className="mb-4 text-[#E02020] flex items-center justify-between font-semibold text-lg text-end pl-[80px]" dir='rtl'>
       <h4> الحسابات المحظورة</h4>
       <div  onClick={() => router.back()}> <ArrowLeft className='text-red'/> </div>
      </div>

      {loading && (
        <div className="mb-4 rounded-2xl bg-[#EDEDED] p-4 text-center text-sm text-gray-600">
          جاري التحميل…
        </div>
      )}
      {err && (
        <div className="mb-4 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 !pl-[80px]">
        {filtered.map((row) => (
          <BlockCard
            key={row.id}
            row={row}
            onUnban={handleUnban}
            unbanning={busyId === row.id}
          />
        ))}

        {!loading && !err && filtered.length === 0 && (
          <div className="col-span-full flex items-center justify-center rounded-2xl bg-white p-10 text-[#8F8F8F] border border-[#F0F0F0]">
            لا توجد نتائج مطابقة للفلتر الحالي.
          </div>
        )}
      </div>
    </main>
  );
}
