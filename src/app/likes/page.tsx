/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/engagement/page.tsx
'use client';

import UserGrowthMultiStats from '@/app/_components/UserGrowthMultiStats'; // عدّل المسار حسب مشروعك

type Row = {
  period: string;
  question: number;
  story: number;
  reels: number;
  post: number;
};

// نفس ترتيب الليبلات تحت الجراف
const AXIS = ['يوم', 'يومين', 'أسبوع', 'شهر', 'نصف سنوي', 'سنوي', 'الكل'];

function makeData(q: number[], s: number[], r: number[], p: number[]): Row[] {
  return AXIS.map((period, i) => ({
    period,
    question: q[i] ?? 0,
    story: s[i] ?? 0,
    reels: r[i] ?? 0,
    post: p[i] ?? 0,
  }));
}

export default function EngagementPage() {
  // بيانات تجريبية — بدّلها ببيانات الـ API
  const viewsData = makeData(
    [12, 15, 18, 22, 26, 24, 28],
    [10, 12, 14, 18, 20, 22, 19],
    [8,  11, 13, 16, 19, 21, 20],
    [6,  7,  9,  11, 12, 13, 12]
  );

  const likesData = makeData(
    [10, 13, 17, 20, 24, 26, 23],
    [9,  11, 12, 16, 19, 21, 22],
    [7,  9,  12, 15, 17, 20, 19],
    [5,  6,  8,  10, 12, 12, 11]
  );

  const legendSeries = [
    { key: 'question', name: 'سؤال',  color: '#1E3A8A' }, // أزرق داكن
    { key: 'story',    name: 'ستوري', color: '#84CAFF' }, // أزرق فاتح
    { key: 'reels',    name: 'ريلز',  color: '#D72229' }, // أحمر
    { key: 'post',     name: 'بوست',  color: '#D0D5DD', muted: true, labelColor: '#CBD5E1' }, // رمادي باهت
  ] as const;

  const sideStatsViews = [
    { label: 'مشاهدة الساعة', value: 100, unit: 'مرة' },
    { label: 'مشاهدة اليوم',  value: 1200, unit: 'مرة' },
    { label: 'مشاهدة الأسبوع',value: 3500, unit: 'مرة' },
    { label: 'مشاهدة الشهر',  value: 20000, unit: 'مرة' },
    { label: 'مشاهدة العام',  value: 20000, unit: 'مرة' },
  ];

  const sideStatsLikes = [
    { label: 'إعجاب الساعة', value: 100, unit: 'إعجاب' },
    { label: 'إعجاب اليوم',  value: 1200, unit: 'إعجاب' },
    { label: 'إعجاب الأسبوع',value: 3500, unit: 'إعجاب' },
    { label: 'إعجاب الشهر',  value: 20000, unit: 'إعجاب' },
    { label: 'إعجاب العام',  value: 20000, unit: 'إعجاب' },
  ];

  return (
    <main className="p-6 space-y-6 pl-[90px] pr-[40px]" dir="rtl">
      <h1 className="text-[#D72229] text-xl font-semibold text-right pr-5">الإعجابات</h1>
      <div className="grid gap-6 md:grid-cols-2">
          <UserGrowthMultiStats
            title="نسبة المشاهدة"
            sideLabel="إجمالي النسب"
            xKey="period"
            chartData={viewsData}
            series={legendSeries as any}
            sideItems={sideStatsViews}
          />
          <UserGrowthMultiStats
            title="نسبة الاعجابات"
            sideLabel="إجمالي النسب"
            xKey="period"
            chartData={likesData}
            series={legendSeries as any}
            sideItems={sideStatsLikes}
          />
      </div>
    </main>
  );
}
