/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Key,
  type ReactNode,
} from 'react';

export type RegistrationRow = {
  no: Key | null | undefined;
  postImages: any;
  comments: ReactNode;
  likes: ReactNode;
  publishedAgo: ReactNode;
  avatar: string;
  views: ReactNode;
  postType: ReactNode;
  governorate: string;
  gender: string;
  role: string;
  country: any;
  id: string;
  index: number;
  avatarUrl?: string;
  userName: string;
  emailOrPhone: string;
  type: 'جوجل' | 'فيسبوك' | 'انشاء حساب';
  birthDate: string;
  status: 'نشط' | 'غير نشط';
};

type Props = {
  title?: string;
  rows?: RegistrationRow[];
  onRowClick?: (row: RegistrationRow) => void;
  /** نص البحث القادم من الكومبوننت الخارجي (SearchBar) */
  filterQuery?: string;
};

const badgeClasses = (status: RegistrationRow['status']) =>
  status === 'نشط' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700';

const typeClasses = (t: RegistrationRow['type']) => {
  switch (t) {
    case 'جوجل':
      return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200';
    case 'فيسبوك':
      return 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200';
    default:
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200';
  }
};

async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => '');
  let data: any = {};
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch {}
  if (!res.ok) {
    const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
    throw new Error(reason);
  }
  return data || {};
}

const fromProvider = (p?: string): 'جوجل' | 'فيسبوك' | 'انشاء حساب' => {
  const s = (p || '').toLowerCase();
  if (s.includes('google')) return 'جوجل';
  if (s.includes('facebook')) return 'فيسبوك';
  return 'انشاء حساب';
};

const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD');

export default function LastLogins({
  title = 'آخر عمليات تسجيل الدخول',
  rows = [],
  onRowClick,
  filterQuery = '',
}: Props) {
  const [apiRows, setApiRows] = useState<RegistrationRow[]>(rows);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const didRun = useRef(false);
  const CACHE_KEY = 'lastLoginsCache';
  const CACHE_DURATION = 24 * 60 * 60 * 1000;

  const ENDPOINTS = useMemo(
    () => ['http://bo-chat.space/lastLogIn', 'https://bo-chat.space/lastLogIn'],
    [],
  );

  const token = useMemo(
    () => localStorage.getItem('token') || localStorage.getItem('auth_token') || '',
    [],
  );

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (rows && rows.length > 0) {
      setApiRows(rows);
      return;
    }

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const cacheStr = localStorage.getItem(CACHE_KEY);
        if (cacheStr) {
          const cache = JSON.parse(cacheStr);
          const isValid = Date.now() - cache.timestamp < CACHE_DURATION;
          if (isValid && Array.isArray(cache.data)) {
            setApiRows(cache.data);
            setLoading(false);
            return;
          }
        }
      } catch {}

      try {
        if (!token) {
          setErr('لا يوجد توكن للمصادقة');
          setLoading(false);
          return;
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        let fetched: any[] = [];
        let lastErr: any = null;

        for (const url of ENDPOINTS) {
          try {
            const data = await safeFetchJSON(url, { method: 'GET', headers, mode: 'cors' });
            fetched = Array.isArray(data?.response)
              ? data.response
              : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data)
              ? data
              : [];
            break;
          } catch (e) {
            lastErr = e;
          }
        }
        if (!fetched.length && lastErr) throw lastErr;

        const sorted = [...fetched].sort(
          (a, b) => (Date.parse(b?.lastLogIn || '') || 0) - (Date.parse(a?.lastLogIn || '') || 0),
        );

        const mapped: RegistrationRow[] = sorted.map((u: any, i: number) => {
          const phone = u?.phonenumber && String(u.phonenumber).trim();
          const img = u?.img || '/avatar-placeholder.png';
          return {
            no: u?._id,
            postImages: null,
            comments: null,
            likes: null,
            publishedAgo: null,
            avatar: img,
            views: null,
            postType: null,
            governorate: u?.city || '',
            gender: u?.gender === 0 ? 'ذكر' : u?.gender === 1 ? 'أنثى' : '',
            role: 'user',
            country: u?.country || '',
            id: u?._id || '—',
            index: i + 1,
            avatarUrl: img,
            userName: u?.username || u?.name || '—',
            emailOrPhone: phone || '—',
            type: fromProvider(u?.provider),
            birthDate: String(u?.lastLogIn || '—'),
            status: u?.active ? 'نشط' : 'غير نشط',
          };
        });

        setApiRows(mapped);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: mapped }),
        );
      } catch (e: any) {
        setErr(e?.message || 'فشل جلب البيانات');
      } finally {
        setLoading(false);
      }
    })();
  }, [rows, token, ENDPOINTS]);

  const filtered = useMemo(() => {
    const q = norm(filterQuery);
    if (!q) return apiRows;
    return apiRows.filter((r) => {
      const haystack = norm([r.userName, r.emailOrPhone, r.id, r.type, r.status].join(' '));
      return haystack.includes(q);
    });
  }, [apiRows, filterQuery]);

  return (
    <section className="!w-full logins-table ">
      <header className="mb-3">
        <h2 className="text-rose-600 text-lg font-semibold" dir="rtl">
          {title}
        </h2>
      </header>


      {loading && (
        <div className="mb-2 rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600" dir="rtl">
          جاري التحميل…
        </div>
      )}
      {err && (
        <div className="mb-2 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700" dir="rtl">
          {err}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white " dir="rtl">
        <div className="max-h-[420px] overflow-auto scrollbar-hidden">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-rose-50/60 backdrop-blur supports-[backdrop-filter]:bg-rose-50/50">
              <tr className="text-gray-600">
                <th className="w-16 py-3 pr-4 pl-2 text-center font-medium">الرقم</th>
                <th className="w-16 py-3 px-2 text-right font-medium">صورة</th>
                <th className="py-3 px-2 text-right font-medium">اسم المستخدم</th>
                <th className="py-3 px-2 text-right font-medium">id</th>
                <th className="py-3 px-2 text-right font-medium">الحالة</th>
                <th className="py-3 px-2 text-right font-medium">آخر تسجيل</th>
                <th className="py-3 px-2 text-right font-medium">الايميل</th>
                <th className="py-3 pl-4 pr-2 text-right font-medium">نوع التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.index}
                  onClick={() => onRowClick?.(r)}
                  className="even:bg-gray-50/60 hover:bg-rose-50/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 pr-4 pl-2 text-center text-gray-700">{r.index}</td>

                  <td className="py-3 px-2">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white ">
                      <Image
                        src={r.avatarUrl || '/avatar-placeholder.png'}
                        alt={r.userName}
                        fill
                        sizes="36px"
                      />
                    </div>
                  </td>

                  <td className="py-3 px-2 font-medium text-gray-800">{r.userName}</td>
                  <td className="py-3 px-2 text-gray-500">{r.id}</td>

                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(
                        r.status,
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-gray-600">{r.birthDate}</td>
                  <td className="py-3 px-2 text-gray-700">{r.emailOrPhone}</td>

                  <td className="py-3 pl-4 pr-2">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${typeClasses(
                        r.type,
                      )}`}
                    >
                      {r.type}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
