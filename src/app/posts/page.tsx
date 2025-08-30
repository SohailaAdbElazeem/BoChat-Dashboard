'use client';

import React, { useMemo, useState } from 'react';
import { RegistrationRow } from '../_components/LastLogins';
import FilterBar, { Filters } from '../_components/FilterBar';
import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
import RegistrationsTable from '../_components/PostsTable';
export type RegistrationRow = {
  no: number;                 
  avatar: string;             
  userName: string;          
  id: string;                 
  status: 'نشط' | 'محظور' | 'معلق' | string;
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

const sampleRows: RegistrationRow[] = [
  {
    no: 1,
    avatar: 'https://i.pravatar.cc/80?img=15',
    userName: 'احمد محمد',
    id: 'ID23896590',
    status: 'نشط',
    publishedAgo: 'منذ ساعة',
    likes: 100,
    comments: 100,
    views: 700,
    postType: 'ستوري',
    postImages: [
      'https://picsum.photos/id/1011/80/80',
      'https://picsum.photos/id/1027/80/80',
      'https://picsum.photos/id/1035/80/80',
      'https://picsum.photos/id/1041/80/80',
      'https://picsum.photos/id/1043/80/80',
    ],
    type: 'email',
    country: 'السعودية',
    governorate: 'الرياض',
    gender: 'ذكر',
    role: 'user',
    emailOrPhone: 'ahmed@example.com',
  },
  {
    no: 2,
    avatar: 'https://i.pravatar.cc/80?img=23',
    userName: 'محمد احمد',
    id: 'ID23896591',
    status: 'نشط',
    publishedAgo: 'منذ ساعتين',
    likes: 120,
    comments: 90,
    views: 700,
    postType: 'بوست',
    postImages: ['https://picsum.photos/id/1050/80/80'],
    type: 'phone',
    country: 'مصر',
    governorate: 'القاهرة',
    gender: 'ذكر',
    role: 'admin',
    emailOrPhone: 'm.ahmed@example.com',
  },
  // أضف باقي الصفوف...
];

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

// نفس دالة التطبيع زي الفلتر لضمان نفس النتيجة
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
      ].join(' ')
    );
    return hay.includes(q);
  });
}

export default function PostsPage() {
  const [filters, setFilters] = useState<Filters>({ query: '' });
  const [rows] = useState<RegistrationRow[]>(sampleRows);

  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  return (
    <main className="p-4 md:p-6 space-y-4" dir="rtl">
      <FilterBar rows={rows} filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 !pl-[60px]" >
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
        <div className='pl-[60px]'>
            <RegistrationsTable rows={filtered} />
        </div>
    </main>
  );
}
