'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FilterBar, { Filters } from '@/app/_components/FilterBar';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

type VerifyStatus = 'pending' | 'verified' | 'rejected';

type VerificationRequest = {
  id: string;
  email: string;
  fullName: string;
  verificationType: string;
  durationLabel: string;
  requestedAt?: string | null;
  status: VerifyStatus;
  type?: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
};

function VerificationRequestCard({
  row,
  onVerify,
  onReject,
}: {
  row: VerificationRequest;
  onVerify: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}) {
  const pill = (txt: string) => (
    <div className="h-9 rounded-[12px] bg-[#EDEDED] flex items-center justify-center px-3 text-[13px] text-[#6B7280]">
      {txt}
    </div>
  );

  const dateLabel = row.requestedAt
    ? new Date(row.requestedAt).toLocaleDateString('ar-EG')
    : '—';

  return (
    <div className="rounded-[20px] bg-[#F6F6F6] p-4">
      <div className="text-center text-[#D72229] font-semibold mb-3">معلومات الحساب</div>

      <div className="space-y-3">
        {pill(`الإيميل:  ${row.email || '—'}`)}
        {pill(`الاسم:   ${row.fullName || '—'}`)}
        <div className="grid grid-cols-2 gap-3">
          {pill(`نوع التوثيق: ${row.verificationType || '—'}`)}
          {pill(`مدة التوثيق: ${row.durationLabel || '—'}`)}
        </div>
        {pill(`تاريخ الإنشاء/الاشتراك:  ${dateLabel}`)}

        <div
          className={`h-9 rounded-[12px] flex items-center justify-center px-3 text-[13px] ${
            row.status === 'verified'
              ? 'bg-green-100 text-green-700'
              : row.status === 'rejected'
              ? 'bg-red-100 text-red-700'
              : 'bg-[#EFEFEF] text-[#8989A2]'
          }`}
        >
          {row.status === 'pending'
            ? 'قيد المراجعة'
            : row.status === 'verified'
            ? 'تم التوثيق'
            : 'تم الرفض'}
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onReject(row.id)}
            className="rounded-full bg-[#FCE8E8] text-[#D72229] py-2 hover:opacity-90"
          >
            رفض
          </button>
          <button
            onClick={() => onVerify(row.id)}
            className="rounded-full bg-[#D72229] text-white py-2 hover:opacity-90"
          >
            توثيق
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerificationRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<VerificationRequest[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: '' });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        // اقرأ التوكن و الـ USER_ID من اللوكال ستوريدج
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        // const storedUserId =
        //   typeof window !== 'undefined' ? localStorage.getItem('userid') : null;

        // لو عندك يوزر آي دي ثابت من برّه، استخدمه هنا:
        const FIXED_USER_ID = '6877d5497b04a3c83759f122';
        // وإلا استخدم اللي في localStorage
        // const USER_ID = storedUserId /* ?? FIXED_USER_ID */;

        if (!FIXED_USER_ID) {
          console.error('USER_ID is missing (localStorage.userid).');
          if (alive) setRows([]);
          return;
        }

        const url = `${API_BASE}/vip/request${FIXED_USER_ID}`; // مثال: http://bo-chat.space/vip/request6877d5497b04a3c83759f122

        const res = await fetch(url, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`Fetch failed ${res.status}: ${txt}`);
        }

        // شكل الريسبونس حسب مثالك:
        // [
        //   { "_id": "68d82bda29734eac5d23d1cf", "userid": "688cd75691e0a8db0c1a252c" }
        // ]
        const apiData: Array<{ _id: string; userid: string }> = await res.json();

        // حوِّلها لـ VerificationRequest بعناصر افتراضية قابلة للعرض
        const mapped: VerificationRequest[] = apiData.map((x) => ({
          id: x._id,
          email: '—',                 // لاحقًا لو عندك API للإيميل/الاسم بدّله هنا
          fullName: x.userid || '—',  // مؤقتًا بنعرض الـ userid كتعريف
          verificationType: '—',
          durationLabel: '—',
          requestedAt: null,
          status: 'pending',
          type: undefined,
          country: undefined,
          governorate: undefined,
          gender: undefined,
          role: undefined,
        }));

        if (alive) setRows(mapped);
      } catch (e) {
        console.error('fetch verification requests failed:', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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

  const norm = (v: unknown) =>
    String(v ?? '')
      .toLowerCase()
      .replace(/[\u064B-\u0652\u0640]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .normalize('NFKD');

  const [filtered] = useState(rows); // هنستخدم فلترة بسيطة لأن البيانات قليلة
  // أو استخدم فلترتك الحالية:
  // const filtered = useMemo(() => { ... }, [rows, filters]);

  const patch = (id: string, p: Partial<VerificationRequest>) =>
    setRows((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));

  // ملاحظة: ما بنضربش أي API للتوثيق/الرفض هنا (علشان قلتلي ما نخترعش endpoints)
  const onVerify = async (id: string) => {
    const old = rows.find((x) => x.id === id);
    patch(id, { status: 'verified' });
    // لو عندك endpoints جاهزة استبدل الجزء ده:
    // try {
    //   const token = localStorage.getItem('token');
    //   const res = await fetch(`${API_BASE}/your-verify-endpoint/${id}`, {
    //     method: 'POST',
    //     headers: { Authorization: `Bearer ${token ?? ''}` },
    //   });
    //   if (!res.ok) throw new Error('verify failed');
    // } catch (e) {
    //   if (old) patch(id, old);
    //   console.error(e);
    // }
  };

  const onReject = async (id: string) => {
    const old = rows.find((x) => x.id === id);
    patch(id, { status: 'rejected' });
    // نفس الملاحظة أعلاه بخصوص endpoints الرفض
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      <div className="mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-2">
          <Link href="/verification" className="rounded-full p-1 hover:bg-gray-100">
            <ChevronRight className="w-6 h-6 text-[#D72229]" />
          </Link>
          <h1 className="text-[#D72229] text-xl font-semibold">طلبات التوثيق</h1>
        </div>

        <FilterBar rows={regRows} filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[260px] rounded-[20px] bg-[#F6F6F6] animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center text-gray-500 py-20">لا توجد نتائج مطابقة حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rows.map((row) => (
              <VerificationRequestCard
                key={row.id}
                row={row}
                onVerify={onVerify}
                onReject={onReject}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
