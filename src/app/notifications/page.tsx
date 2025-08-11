// src/app/notifications/page.tsx
'use client';

import UserGrowthStats from '@/app/_components/UserGrowthStats'; // صحّح المسار حسب مشروعك

type Point = { month: string; value: number };

const AXIS: string[] = ['الكل','سنوي','نصف سنوي','شهر','أسبوع','يومين','يوم'];
const makeData = (vals: number[]): Point[] =>
  AXIS.map((m, i) => ({ month: m, value: vals[i] ?? 0 }));

export default function NotificationsPage() {
  const sideStats = [
    { label: 'إشعار الساعة', value: 100 },
    { label: 'إشعار اليوم',  value: 1200 },
    { label: 'إشعار الأسبوع',value: 3500 },
    { label: 'إشعار الشهر',  value: 20000 },
    { label: 'إشعار العام',  value: 20000 },
  ];

  const cards = [
    {
      title: 'نسبة إرسال الإشعار النصي',
      sideLabel: 'إجمالي الإشعارات',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',
      data: makeData([18, 22, 25, 21, 24, 28, 26]),
    },
    {
      title: 'نسبة إرسال إشعار الفيديو',
      sideLabel: 'إجمالي الإشعارات',
      lineColor: '#D72229',
      sideColor: '#2F6DFF',
      data: makeData([16, 20, 22, 23, 26, 29, 27]),
    },
    {
      title: 'نسبة إرسال إشعار الصور',
      sideLabel: 'إجمالي الإشعارات',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',
      data: makeData([14, 18, 21, 24, 27, 30, 28]),
    },
    {
      title: 'نسبة إرسال إشعار مرفق',
      sideLabel: 'إجمالي الإشعارات',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',
      data: makeData([15, 19, 22, 23, 25, 27, 26]),
    },
    {
      title: 'نسبة إرسال إشعار رابط',
      sideLabel: 'إجمالي الإشعارات',
      lineColor: '#D72229',
      sideColor: '#2F6DFF',
      data: makeData([13, 17, 20, 22, 24, 26, 25]),
    },
    {
      title: 'نسبة إرسال إشعارات النظام',
      sideLabel: 'إجمالي الإشعارات',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',
      data: makeData([12, 16, 19, 21, 23, 25, 24]),
    },
  ];

  return (
    <main className="p-6 space-y-4 pl-[80px]">
      <h1 className="text-[#D72229] text-xl font-semibold text-right">الإشعارات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} >
            <UserGrowthStats
              title={c.title}
              sideLabel={c.sideLabel}
              lineColor={c.lineColor}
              sideColor={c.sideColor}
              data={c.data}
            />
            <div className="hidden">{JSON.stringify(sideStats)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
