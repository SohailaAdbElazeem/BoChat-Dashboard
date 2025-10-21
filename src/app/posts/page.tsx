/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import FilterBar, { type Filters } from '../_components/FilterBar';
import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
import RegistrationsTable from '../_components/PostsTable';


const URL = process.env.NEXT_PUBLIC_API_BASE

/** نوع الصف اللي جدول PostsTable مستنيه */
export type RegistrationRow = {
  no: number;
  userimg: string;
  userName: string;
  id: string;
  publishedAgo: string;
  likes: number;
  comments: number;
  views: number;
  postType: 'ستوري' | 'بوست' | 'ريلز' | 'سؤال' | string;
  postImages: string[];
  type?: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
  emailOrPhone?: string;
};

/* رسم بياني (نموذجي) — سيبهم زي ما هما أو غيّرهم بعدين */
const chartSeries = [
  { key: 'private', name: 'خاص', color: '#D72229', strokeWidth: 2, dot: false },
  { key: 'story', name: 'ستوري', color: '#1F6FEB', strokeWidth: 2, dot: false },
  { key: 'reels', name: 'ريلز', color: '#2E9D61', strokeWidth: 2, dot: false },
  { key: 'post', name: 'بوست', color: '#A78BFA', strokeWidth: 2, dot: false },
];

const chartData = [
  { month: 'الكل', private: 1200, story: 900, reels: 400, post: 600 },
  { month: 'سنوي', private: 1400, story: 1100, reels: 500, post: 800 },
  { month: 'نصف سنوي', private: 2000, story: 1800, reels: 900, post: 1200 },
  { month: 'شهري', private: 3500, story: 2600, reels: 1400, post: 1700 },
  { month: 'اسبوع', private: 3000, story: 2900, reels: 1600, post: 1900 },
  { month: 'يومي', private: 2000, story: 2100, reels: 1200, post: 1500 },
];

/* -------- utils للفلاتر والـ fetch والـ mapping -------- */
const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD');




function applyFilters(rows: RegistrationRow[], filters: Filters) {
  const q = norm(filters.query);
  return rows.filter((r) => {
    if (filters.type && r.type !== filters.type) return false;
    if (filters.country && r.country !== filters.country) return false;
    if (filters.governorate && r.governorate !== filters.governorate) return false;
    if (filters.gender && r.gender !== filters.gender) return false;
    if (filters.role && r.role !== filters.role) return false;

    if (!q) return true;
    const hay = norm(
      [
        r.userName,
        r.userimg,
        r.emailOrPhone,
        r.id,
        r.type,
        r.country,
        r.governorate,
        r.gender,
        r.role,
      ].join(' ')
    );
    return hay.includes(q);
  });
}

async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => '');
  let data: any = {};
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch {
    /* ignore non-json bodies */
  }
  if (!res.ok) {
    const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
    throw new Error(reason);
  }
  return data ?? {};
}

const fromProvider = (p?: string): RegistrationRow['type'] => {
  const s = (p || '').toLowerCase();
  if (s.includes('google')) return 'جوجل';
  if (s.includes('facebook')) return 'فيسبوك';
  return 'انشاء حساب';
};

const toArabicPostType = (t?: string): RegistrationRow['postType'] => {
  const s = (t || '').toLowerCase();
  if (s.includes('story')) return 'ستوري';
  if (s.includes('reel')) return 'ريلز';
  if (s.includes('question') || s.includes('ask')) return 'سؤال';
  return 'بوست';
};

const formatAgo = (dateLike?: string | number) => {
  if (!dateLike) return '—';
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return '—';
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
};

function pickImages(p: any): string[] {
  if (Array.isArray(p?.media)) {
    // media قد تكون [{url}, 'url', ...]
    return p.media
      .map((m: any) => (typeof m === 'string' ? m : m?.url))
      .filter(Boolean);
  }
  if (Array.isArray(p?.images)) return p.images.filter(Boolean);
  if (p?.image) return [p.image];
  if (p?.thumbnail) return [p.thumbnail];
  return [];
}

function mapPostToRow(p: any, i: number): RegistrationRow {
  const u = p?.user || p?.owner || {};
  

  const gender: RegistrationRow['gender'] =
    u?.gender === 0 ? 'ذكر' : u?.gender === 1 ? 'أنثى' : undefined;

  return {
    no: i + 1,
    avatar: u?.userimg || p?.userimg || '/avatar-placeholder.png',
    userName: u?.username || u?.name || p?.username || p?.name || '—',
    id: p?._id || p?.id || '—',
    publishedAgo: formatAgo(p?.createdAt || p?.postedAt || p?.date || p?.timestamp),
    likes:
      typeof p?.likesCount === 'number'
        ? p.likesCount
        : Array.isArray(p?.likes)
        ? p.likes.length
        : typeof p?.reactions?.likes === 'number'
        ? p.reactions.likes
        : 0,
    comments:
      typeof p?.commentsCount === 'number'
        ? p.commentsCount
        : Array.isArray(p?.comments)
        ? p.comments.length
        : 0,
    views: typeof p?.views === 'number' ? p.views : p?.viewersCount || 0,
    postType: toArabicPostType(p?.type || p?.postType || p?.kind),
    postImages: pickImages(p),

    type: fromProvider(u?.provider || p?.provider),
    country: u?.country || '',
    governorate: u?.city || '',
    gender,
    role: u?.case || 'مستخدم',
    emailOrPhone: (u?.phonenumber && String(u.phonenumber).trim()) || undefined,
  };
}

/* ------------------ الصفحة ------------------ */
export default function PostsPage() {
  const [filters, setFilters] = useState<Filters>({ query: '' });
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const didRun = useRef(false);

  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      setLoading(true);
      setErr(null);

      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token') ||
        '';

      if (!token) {
        setErr('لا يوجد توكن في المتصفح.');
        setLoading(false);
        return;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      
      const endpoints = [
        `${URL}/dashboard/posts`,
        `${URL}/dashboard/posts`,
      ];

      try {
        let data: any = null;
        let lastErr: unknown = null;

        for (const url of endpoints) {
          try {
            data = await safeFetchJSON(url, { method: 'GET', headers, mode: 'cors' });
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (!data && lastErr) throw lastErr;

        const list: any[] = Array.isArray(data?.response)
          ? data.response
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.posts)
          ? data.posts
          : Array.isArray(data)
          ? data
          : [];

        const mapped: RegistrationRow[] = list.map(mapPostToRow);
        setRows(mapped);
      } catch (e: any) {
        setErr(e?.message || 'تعذر جلب البوستات');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="p-4 md:p-6 space-y-4 overflow-hidden h-[100vh]" dir="rtl">
      <div className='!pl-[40px]'>
        <FilterBar rows={rows} filters={filters} onChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 !pl-[60px]">
        <UserGrowthMultiStats
          chartData={chartData}
          series={chartSeries}
          xKey="month"
          sideLabel="إجمالي النسب"
          title="نسبة المشاهدة"
          sideItems={[
            { label: 'متوسط الساعة', value: 100 },
            { label: 'اليوم', value: 1200 },
            { label: 'الأسبوع', value: 3500 },
            { label: 'الشهر', value: 20000 },
            { label: 'العام', value: 20000 },
          ]}
        />
        <UserGrowthMultiStats
          chartData={chartData}
          series={chartSeries}
          xKey="month"
          sideLabel="إجمالي النسب"
          title="نسبة البوستات"
          sideItems={[
            { label: 'متوسط الساعة', value: 100 },
            { label: 'اليوم', value: 1200 },
            { label: 'الأسبوع', value: 3500 },
            { label: 'الشهر', value: 20000 },
            { label: 'العام', value: 20000 },
          ]}
        />
      </div>

      {loading && (
        <div className="rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600 !pl-[60px]">
          جاري التحميل…
        </div>
      )}
      {err && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-700 !pl-[60px]">
          {err}
        </div>
      )}

      <div className="pl-[60px] overflow-hidden">
        <RegistrationsTable rows={filtered} />
      </div>
    </main>
  );
}
