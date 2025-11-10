'use client';

// import Image from 'next/image';
import * as React from 'react';
import FilterBar, { Filters } from '../_components/FilterBar';

type Report = {
  id: string;
  userName: string;
  userHandle: string;
  avatar: string;
  emailOrPhone: string;
  idNumber: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
  type?: string;
  status?: string;
  text: string;
  note?: string;
  sentAgo: string;
  source: 'من التطبيق' | 'من الموقع';
  replied?: boolean;
  ignored?: boolean;
};

const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD');

function applyFilters(rows: Report[], filters: Filters) {
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
        r.idNumber,
        r.type,
        r.status,
        r.country,
        r.governorate,
        r.gender,
        r.role,
      ].join(' ')
    );
    return hay.includes(q);
  });
}

function toRegistrationRow(r: Report) {
  return {
    userName: r.userName,
    emailOrPhone: r.emailOrPhone,
    id: r.idNumber,
    type: r.type ?? '',
    status: r.status ?? '',
    country: r.country ?? '',
    governorate: r.governorate ?? '',
    gender: r.gender ?? '',
    role: r.role ?? '',
  };
}

export default function ReportsPage() {
  const [reports, setReports] = React.useState<Report[]>([]);
  const [filters, setFilters] = React.useState<Filters>({
    query: '',
    type: undefined,
    status: undefined,
    country: undefined,
    governorate: undefined,
    gender: undefined,
    role: undefined,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ لا يوجد توكن في LocalStorage');
          setLoading(false);
          return;
        }

        const res = await fetch('http://bo-chat.space/dashboard/reports', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const data = await res.json();
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // 🔄 تحويل البيانات القادمة من الـAPI إلى شكل الكومبوننت
        const mapped = data.map((item: any) => ({
          id: item._id,
          userName: item.reporterid || 'مجهول',
          userHandle: '@' + (item.reporterid?.slice(0, 6) ?? 'unknown'),
          avatar: '/avatars/a1.png',
          emailOrPhone: item.reportedid ?? 'غير معروف',
          idNumber: item._id,
          country: 'غير محدد',
          governorate: 'غير محدد',
          gender: 'غير معروف',
          role: 'مستخدم',
          type: item.type,
          status: 'نشط',
          text: `تم الإبلاغ عن ${item.type === 'post' ? 'منشور': item.type === 'story' ? "حاله" : 'مستخدم'} برقم ${item.reportedid}`,
          note: `تاريخ البلاغ: ${new Date(item.createdAt).toLocaleDateString('ar-EG')}`,
          sentAgo: '—',
          source: 'من الموقع',
        }));

        setReports(mapped);
      } catch (err) {
        console.error('❌ خطأ في تحميل البلاغات:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filtered = React.useMemo(() => applyFilters(reports, filters), [reports, filters]);

  const setReplied = (id: string, replied: boolean) =>
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, replied, ignored: replied ? false : r.ignored } : r))
    );

  const setIgnored = (id: string, ignored: boolean) =>
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ignored, replied: ignored ? false : r.replied } : r))
    );

  return (
    <main className="p-6">
      <div className="mb-4 pl-[50px]" dir="rtl">
        <FilterBar rows={reports.map(toRegistrationRow)} filters={filters} onChange={setFilters} />
      </div>

      <h2 className="mb-3 text-right text-[18px] font-semibold text-[#D12D2D]">الإبلاغات</h2>

      {loading ? (
        <div className="rounded-[24px] bg-[#E6E6E6] p-8 text-center text-gray-500 animate-pulse">
          جاري تحميل البلاغات...
        </div>
      ) : (
        <div className="space-y-4 pl-[60px]">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[140px_minmax(220px,300px)_1fr] items-start justify-center gap-3 rounded-[24px] bg-[#E6E6E6]"
            >
              {/* أزرار الإجراءات */}
              <div className="flex w-[140px] flex-col py-4 px-4">
                {r.replied ? (
                  <button
                    className="h-10 w-full mb-2 rounded-2xl bg-[#EDEDED] text-sm font-medium text-gray-600"
                    disabled
                  >
                    تم الرد
                  </button>
                ) : (
                  <button
                    onClick={() => setReplied(r.id, true)}
                    className="h-10 w-full mb-2 rounded-2xl bg-[#D12D2D] text-sm font-medium text-white hover:bg-[#be2525]"
                  >
                    رد
                  </button>
                )}

                {r.ignored ? (
                  <button
                    className="h-10 w-full rounded-2xl border border-[#E6E6E6] bg-white text-sm font-medium text-gray-500"
                    disabled
                  >
                    تم التجاهل
                  </button>
                ) : (
                  <button
                    onClick={() => setIgnored(r.id, true)}
                    className="h-10 w-full rounded-2xl border border-[#D12D2D] bg-white text-sm font-medium text-[#D12D2D] hover:bg-red-50"
                  >
                    تجاهل
                  </button>
                )}
              </div>

              <div className="p-3 text-sm h-full text-gray-600 border-r flex flex-col justify-center border-[#D8D8D8] border-l" dir='rtl'>
                <div className="mb-1">{r.idNumber}  :ID</div>
                <div className="mb-1">نوع البلاغ: {r.type}</div>
                <div className="mb-1">{r.note}</div>
              </div>

              {/* المحتوى */}
              <div className="gap-3 flex flex-col justify-center h-full p-3">
                 <div className="text-right gap-2">
                  <div className="text-right">
                    <div className="text-sm text-right font-medium text-gray-700">{r.userName}</div>
                    <div className="text-xs text-right text-gray-500">{r.userHandle}</div>
                  </div>
                  {/* <Image
                    src={r.avatar}
                    alt={r.userName}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  /> */}
                </div>
                <div className="">
                  <div className=" text-sm text-right text-gray-500">
                    <bdi>{r.text}</bdi>
                    </div>
                  {/* {r.note && <div className="text-right text-xs text-gray-400">{r.note}</div>} */}
                </div>
               
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="rounded-[24px] bg-[#F6F6F6] p-8 text-center text-gray-500">
              لا توجد نتائج مطابقة للفلاتر الحالية.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
