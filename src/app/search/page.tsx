'use client';

import React, { useMemo, useState } from 'react';
import SearchKeywordsTable, { SearchRow } from '../_components/SearchKeywordsTable';
import FilterBar, { Filters } from '../_components/FilterBar';
import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';

const searchRowsSeed: SearchRow[] = [
  { no: 1, keyword: 'بيزا', searchCount: 3600, growthPct: 15, lastSearchAgo: 'منذ 10 دقائق' },
  { no: 2, keyword: 'بيزا', searchCount: 3600, growthPct: 15, lastSearchAgo: 'منذ ساعة' },
  { no: 3, keyword: 'بيزا', searchCount: 3600, growthPct: 15, lastSearchAgo: 'منذ ساعة' },
  { no: 4, keyword: 'بيزا', searchCount: 3600, growthPct: 15, lastSearchAgo: 'منذ أسبوع' },
  { no: 5, keyword: 'بيزا', searchCount: 3600, growthPct: 15, lastSearchAgo: 'منذ ساعة' },
  { no: 6, keyword: 'بيزا', searchCount: 3600, growthPct: 15, lastSearchAgo: 'منذ ساعة' },
  { no: 7, keyword: 'بيزا', searchCount: 3600, growthPct: 15, lastSearchAgo: 'منذ 15 دقيقة' },
];

const chartSeries = [
  { key: 'private', name: 'خاص', color: '#D72229', strokeWidth: 2, dot: false },
  { key: 'story',   name: 'منشور', color: '#1F6FEB', strokeWidth: 2, dot: false },
  { key: 'reels',   name: 'ريلز',  color: '#2E9D61', strokeWidth: 2, dot: false },
  { key: 'post',    name: 'بوست',  color: '#A78BFA', strokeWidth: 2, dot: false },
];

const chartData = [
  { month: 'الكل',  private: 1200, story: 900,  reels: 400,  post: 600  },
  { month: 'سنوي',  private: 1400, story: 1100, reels: 500,  post: 800  },
  { month: 'نصف سنوي', private: 2000, story: 1800, reels: 900,  post: 1200 },
  { month: 'شهري',  private: 3500, story: 2600, reels: 1400, post: 1700 },
  { month: 'أسبوع', private: 3000, story: 2900, reels: 1600, post: 1900 },
  { month: 'يومي',  private: 2000, story: 2100, reels: 1200, post: 1500 },
];

// نفس دالة التطبيع
const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD');

function applyFilters(rows: SearchRow[], filters: Filters) {
  const q = norm(filters.query);
  if (!q) return rows;
  return rows.filter((r) => norm(r.keyword).includes(q));
}

export default function SearchStatsPage() {
  const [filters, setFilters] = useState<Filters>({ query: '' });
  const [rows] = useState<SearchRow[]>(searchRowsSeed);
  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  return (
    <main className="p-4 md:p-6 space-y-4" dir="rtl">
      <FilterBar
        rows={
          rows.map((r, i) => ({
            no: i + 1,
            avatar: '',
            userName: r.keyword,
            id: '',
            status: '',
            publishedAgo: '',
            likes: 0,
            comments: 0,
            views: r.searchCount,
            postType: '',
            postImages: [],
            type: '',
            country: '',
            governorate: '',
            gender: '',
            role: '',
            emailOrPhone: r.keyword,
          }))
        }
        filters={filters}
        onChange={setFilters}
      />
      <div className='!pl-[60px] '>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mb-[20px]">
          <UserGrowthMultiStats
            chartData={chartData}
            series={chartSeries}
            xKey="month"
            title="إحصائيات البحث العام"
            sideLabel="إجمالي النسب"
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
            title="إحصائيات كلمات البحث"
            sideLabel="إجمالي النسب"
            sideItems={[
              { label: 'متوسط الساعة', value: 100 },
              { label: 'اليوم', value: 1200 },
              { label: 'الأسبوع', value: 3500 },
              { label: 'الشهر', value: 20000 },
              { label: 'العام', value: 20000 },
            ]}
          />
        </div>
        <SearchKeywordsTable   rows={filtered} />
      </div>
    </main>
  );
}
