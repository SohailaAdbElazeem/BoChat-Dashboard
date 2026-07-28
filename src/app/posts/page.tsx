// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import FilterBar, { type Filters } from '../_components/FilterBar';
// import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
// import RegistrationsTable from '../_components/PostsTable';


// const URL = process.env.NEXT_PUBLIC_API_BASE

// /** نوع الصف اللي جدول PostsTable مستنيه */
// export type RegistrationRow = {
//   no: number;
//   userimg: string;
//   userName: string;
//   id: string;
//   publishedAgo: string;
//   likes: number;
//   comments: number;
//   views: number;
//   postType: 'ستوري' | 'بوست' | 'ريلز' | 'سؤال' | string;
//   postImages: string[];
//   type?: string;
//   country?: string;
//   governorate?: string;
//   gender?: string;
//   role?: string;
//   emailOrPhone?: string;
// };

// /* رسم بياني (نموذجي) — سيبهم زي ما هما أو غيّرهم بعدين */
// const chartSeries = [
//   { key: 'private', name: 'خاص', color: '#D72229', strokeWidth: 2, dot: false },
//   { key: 'story', name: 'ستوري', color: '#1F6FEB', strokeWidth: 2, dot: false },
//   { key: 'reels', name: 'ريلز', color: '#2E9D61', strokeWidth: 2, dot: false },
//   { key: 'post', name: 'بوست', color: '#A78BFA', strokeWidth: 2, dot: false },
// ];

// const chartData = [
//   { month: 'الكل', private: 1200, story: 900, reels: 400, post: 600 },
//   { month: 'سنوي', private: 1400, story: 1100, reels: 500, post: 800 },
//   { month: 'نصف سنوي', private: 2000, story: 1800, reels: 900, post: 1200 },
//   { month: 'شهري', private: 3500, story: 2600, reels: 1400, post: 1700 },
//   { month: 'اسبوع', private: 3000, story: 2900, reels: 1600, post: 1900 },
//   { month: 'يومي', private: 2000, story: 2100, reels: 1200, post: 1500 },
// ];

// /* -------- utils للفلاتر والـ fetch والـ mapping -------- */
// const norm = (v: unknown) =>
//   String(v ?? '')
//     .toLowerCase()
//     .replace(/[\u064B-\u0652\u0640]/g, '')
//     .replace(/\s+/g, ' ')
//     .trim()
//     .normalize('NFKD');




// function applyFilters(rows: RegistrationRow[], filters: Filters) {
//   const q = norm(filters.query);
//   return rows.filter((r) => {
//     if (filters.type && r.type !== filters.type) return false;
//     if (filters.country && r.country !== filters.country) return false;
//     if (filters.governorate && r.governorate !== filters.governorate) return false;
//     if (filters.gender && r.gender !== filters.gender) return false;
//     if (filters.role && r.role !== filters.role) return false;

//     if (!q) return true;
//     const hay = norm(
//       [
//         r.userName,
//         r.userimg,
//         r.emailOrPhone,
//         r.id,
//         r.type,
//         r.country,
//         r.governorate,
//         r.gender,
//         r.role,
//       ].join(' ')
//     );
//     return hay.includes(q);
//   });
// }

// async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
//   const res = await fetch(input, init);
//   const txt = await res.clone().text().catch(() => '');
//   let data: any = {};
//   try {
//     data = txt ? JSON.parse(txt) : {};
//   } catch {
//     /* ignore non-json bodies */
//   }
//   if (!res.ok) {
//     const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
//     throw new Error(reason);
//   }
//   return data ?? {};
// }

// const fromProvider = (p?: string): RegistrationRow['type'] => {
//   const s = (p || '').toLowerCase();
//   if (s.includes('google')) return 'جوجل';
//   if (s.includes('facebook')) return 'فيسبوك';
//   return 'انشاء حساب';
// };

// const toArabicPostType = (t?: string): RegistrationRow['postType'] => {
//   const s = (t || '').toLowerCase();
//   if (s.includes('story')) return 'ستوري';
//   if (s.includes('reel')) return 'ريلز';
//   if (s.includes('question') || s.includes('ask')) return 'سؤال';
//   return 'بوست';
// };

// const formatAgo = (dateLike?: string | number) => {
//   if (!dateLike) return '—';
//   const d = new Date(dateLike);
//   if (isNaN(d.getTime())) return '—';
//   const diff = Date.now() - d.getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return 'الآن';
//   if (mins < 60) return `منذ ${mins} دقيقة`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `منذ ${hrs} ساعة`;
//   const days = Math.floor(hrs / 24);
//   return `منذ ${days} يوم`;
// };

// function pickImages(p: any): string[] {
//   if (Array.isArray(p?.media)) {
//     // media قد تكون [{url}, 'url', ...]
//     return p.media
//       .map((m: any) => (typeof m === 'string' ? m : m?.url))
//       .filter(Boolean);
//   }
//   if (Array.isArray(p?.images)) return p.images.filter(Boolean);
//   if (p?.image) return [p.image];
//   if (p?.thumbnail) return [p.thumbnail];
//   return [];
// }

// function mapPostToRow(p: any, i: number): RegistrationRow {
//   const u = p?.user || p?.owner || {};
  

//   const gender: RegistrationRow['gender'] =
//     u?.gender === 0 ? 'ذكر' : u?.gender === 1 ? 'أنثى' : undefined;

//   return {
//     no: i + 1,
//     avatar: u?.userimg || p?.userimg || '/avatar-placeholder.png',
//     userName: u?.username || u?.name || p?.username || p?.name || '—',
//     id: p?._id || p?.id || '—',
//     publishedAgo: formatAgo(p?.createdAt || p?.postedAt || p?.date || p?.timestamp),
//     likes:
//       typeof p?.likesCount === 'number'
//         ? p.likesCount
//         : Array.isArray(p?.likes)
//         ? p.likes.length
//         : typeof p?.reactions?.likes === 'number'
//         ? p.reactions.likes
//         : 0,
//     comments:
//       typeof p?.commentsCount === 'number'
//         ? p.commentsCount
//         : Array.isArray(p?.comments)
//         ? p.comments.length
//         : 0,
//     views: typeof p?.views === 'number' ? p.views : p?.viewersCount || 0,
//     postType: toArabicPostType(p?.type || p?.postType || p?.kind),
//     postImages: pickImages(p),

//     type: fromProvider(u?.provider || p?.provider),
//     country: u?.country || '',
//     governorate: u?.city || '',
//     gender,
//     role: u?.case || 'مستخدم',
//     emailOrPhone: (u?.phonenumber && String(u.phonenumber).trim()) || undefined,
//   };
// }

// /* ------------------ الصفحة ------------------ */
// export default function PostsPage() {
//   const [filters, setFilters] = useState<Filters>({ query: '' });
//   const [rows, setRows] = useState<RegistrationRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
//   const didRun = useRef(false);

//   const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

//   useEffect(() => {
//     if (didRun.current) return;
//     didRun.current = true;

//     (async () => {
//       setLoading(true);
//       setErr(null);

//       const token =
//         localStorage.getItem('token') ||
//         localStorage.getItem('auth_token') ||
//         '';

//       if (!token) {
//         setErr('لا يوجد توكن في المتصفح.');
//         setLoading(false);
//         return;
//       }

//       const headers: Record<string, string> = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       };
      
//       const endpoints = [
//         `${URL}/dashboard/posts`,
//         `${URL}/dashboard/posts`,
//       ];

//       try {
//         let data: any = null;
//         let lastErr: unknown = null;

//         for (const url of endpoints) {
//           try {
//             data = await safeFetchJSON(url, { method: 'GET', headers, mode: 'cors' });
//             break;
//           } catch (e) {
//             lastErr = e;
//           }
//         }
//         if (!data && lastErr) throw lastErr;

//         const list: any[] = Array.isArray(data?.response)
//           ? data.response
//           : Array.isArray(data?.data)
//           ? data.data
//           : Array.isArray(data?.posts)
//           ? data.posts
//           : Array.isArray(data)
//           ? data
//           : [];

//         const mapped: RegistrationRow[] = list.map(mapPostToRow);
//         setRows(mapped);
//       } catch (e: any) {
//         setErr(e?.message || 'تعذر جلب البوستات');
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <main className="p-4 md:p-6 space-y-4 overflow-hidden h-[100vh]" dir="rtl">
//       <div className='!pl-[40px]'>
//         <FilterBar rows={rows} filters={filters} onChange={setFilters} />
//       </div>

//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 !pl-[60px]">
//         <UserGrowthMultiStats
//           chartData={chartData}
//           series={chartSeries}
//           xKey="month"
//           sideLabel="إجمالي النسب"
//           title="نسبة المشاهدة"
//           sideItems={[
//             { label: 'متوسط الساعة', value: 100 },
//             { label: 'اليوم', value: 1200 },
//             { label: 'الأسبوع', value: 3500 },
//             { label: 'الشهر', value: 20000 },
//             { label: 'العام', value: 20000 },
//           ]}
//         />
//         <UserGrowthMultiStats
//           chartData={chartData}
//           series={chartSeries}
//           xKey="month"
//           sideLabel="إجمالي النسب"
//           title="نسبة البوستات"
//           sideItems={[
//             { label: 'متوسط الساعة', value: 100 },
//             { label: 'اليوم', value: 1200 },
//             { label: 'الأسبوع', value: 3500 },
//             { label: 'الشهر', value: 20000 },
//             { label: 'العام', value: 20000 },
//           ]}
//         />
//       </div>

//       {loading && (
//         <div className="rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600 !pl-[60px]">
//           جاري التحميل…
//         </div>
//       )}
//       {err && (
//         <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-700 !pl-[60px]">
//           {err}
//         </div>
//       )}

//       <div className="pl-[60px] overflow-hidden">
//         <RegistrationsTable rows={filtered} />
//       </div>
//     </main>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import FilterBar, { type Filters } from "../_components/FilterBar";
import UserGrowthMultiStats from "../_components/UserGrowthMultiStats";
import RegistrationsTable from "../_components/PostsTable";
import { type RegistrationRow } from "../_components/LastLogins";

const URL = process.env.NEXT_PUBLIC_API_BASE || 'https://bo-chat.space';

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

const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFKD");

function applyFilters(rows: RegistrationRow[], f: Filters) {
  const q = norm(f.query);
  return rows.filter((r) => {
    if (f.type && r.type !== f.type) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.country && r.country !== f.country) return false;
    if (f.governorate && r.governorate !== f.governorate) return false;
    if (f.gender && r.gender !== f.gender) return false;
    if (f.role && r.role !== f.role) return false;

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
      ].join(" ")
    );
    return hay.includes(q);
  });
}

async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => "");
  let data: any = {};
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch {
    // ignore
  }
  if (!res.ok) {
    const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
    throw new Error(reason);
  }
  return data ?? {};
}

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
  if (days < 30) return `منذ ${days} يوم`;
  const months = Math.floor(days / 30);
  if (months < 12) return `منذ ${months} شهر`;
  const years = Math.floor(months / 12);
  return `منذ ${years} سنة`;
};

// ✅ ضبط حقل no ليكون رقم التسلسل (index) بينما id يحمل المعرّف الحقيقي
function mapPostToRow(p: any, i: number): RegistrationRow {
  const userObj = p?.user || p?.author || {};
  const userImage = userObj?.img || userObj?.avatar || p?.img || "/avatar-placeholder.png";
  const userName = userObj?.username || userObj?.name || p?.username || p?.name || "—";
  
  return {
    no: i, // الرقم التسلسلي الذي يظهر في أول الجدول
    index: i,
    id: p?._id || "—", // الـ ID الحقيقي للبوست
    avatar: userImage,
    avatarUrl: userImage,
    userName: userName,
    publishedAgo: formatAgo(p?.createdAt || p?.date),
    likes: p?.likesCount ?? p?.likes ?? 0,
    comments: p?.commentsCount ?? p?.comments ?? 0,
    views: p?.viewsCount ?? p?.views ?? 0,
    postType: p?.postType || p?.type || 'بوست',
    postImages: p?.images || p?.postImages || (p?.image ? [p.image] : []),
    emailOrPhone: (userObj?.phonenumber && String(userObj.phonenumber).trim()) || "—",
    type: p?.postType || 'بوست',
    status: p?.active !== false ? "نشط" : "غير نشط",
    gender: "",
    country: userObj?.country || p?.country || "",
    governorate: userObj?.city || p?.city || "",
    role: userObj?.case || "مستخدم",
    birthDate: "—",
  };
}

export default function PostsPage() {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const filteredRows = useMemo(
    () => applyFilters(rows, filters),
    [rows, filters]
  );

  const fetchPosts = async (pageNum: number, limitNum: number) => {
    setLoading(true);
    setErr(null);

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      "";

    if (!token) {
      setErr("لا يوجد توكن في المتصفح.");
      setLoading(false);
      return;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const url = `${URL}/dashboard/users/all?page=${pageNum}&limit=${limitNum}`;

    try {
      const data = await safeFetchJSON(url, {
        method: "GET",
        headers,
        mode: "cors",
      });

      let list: any[] = [];
      let total = 0;
      let pages = 0;

      if (data?.data?.users) {
        list = data.data.users;
        total = data.data.total || data.total || 0;
        pages = data.data.pages || data.pages || 0;
      } else if (data?.users) {
        list = data.users;
        total = data.total || 0;
        pages = data.pages || 0;
      } else if (Array.isArray(data?.response)) {
        list = data.response;
        total = data.total || data.response.length;
        pages = data.pages || 1;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
        total = data.total || data.data.length;
        pages = data.pages || 1;
      } else if (Array.isArray(data)) {
        list = data;
        total = data.length;
        pages = 1;
      }

      const mapped = list.map((item, index) => 
        mapPostToRow(item, (pageNum - 1) * limitNum + index + 1)
      );

      setRows(mapped);
      setTotalPosts(total);
      setTotalPages(pages || Math.ceil(total / limitNum));
      
    } catch (e: any) {
      setErr(e?.message || "تعذر جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, limit);
  }, [page, limit]);

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <main className="p-4 md:p-6 space-y-4 overflow-hidden" dir="rtl">
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
        <div className="mt-3 rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600 !pl-[60px]">
          جاري التحميل…
        </div>
      )}
      {err && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700 !pl-[60px]">
          {err}
        </div>
      )}

      <div className="mt-4 !pl-[60px]">
        <RegistrationsTable rows={filteredRows} />
      </div>

      {/* ✅ Pagination Controls */}
      {!loading && rows.length > 0 && (
        <div className="mt-6 !pl-[60px] flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600">
            عرض {(page - 1) * limit + 1} - {Math.min(page * limit, totalPosts)} من {totalPosts} عنصر
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              السابق
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages || 1) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 rounded border transition-colors ${
                      page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              التالي
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">عرض:</label>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </main>
  );
}