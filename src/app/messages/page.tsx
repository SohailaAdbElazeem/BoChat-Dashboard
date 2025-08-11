'use client';

import UserGrowthStats from '@/app/_components/UserGrowthStats'; // صحّح المسار حسب مشروعك

type Point = { month: string; value: number };

// نفس الليبلات اللي تحت الجراف
const AXIS: string[] = ['الكل','أسبوع','يومين','يوم'];

// داتا مساعدة
const makeData = (vals: number[]): Point[] =>
  AXIS.map((m, i) => ({ month: m, value: vals[i] ?? 0 }));

export default function MessagesPage() {
  const cards = [
    {
      title: 'نسبة إرسال الاستيكر',
      sideLabel: 'إجمالي النسب',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',     
      data: makeData([18, 22, 25, 21]),
    },
    {
      title: 'نسبة إرسال الفيديو',
      sideLabel: 'إجمالي النسب',
      lineColor: '#2F6DFF',
      sideColor: '#2F6DFF',    
      data: makeData([20, 21, 23, 22]),
    },
    {
      title: 'نسبة إرسال الصور',
      sideLabel: 'إجمالي النسب',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',
      data: makeData([16, 18, 20, 24]),
    },
    {
      title: 'نسبة إرسال رسالة نصية',
      sideLabel: 'إجمالي النسب',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',
      data: makeData([17, 19, 22, 23]),
    },
    {
      title: 'نسبة إرسال فيديو لينك',
      sideLabel: 'إجمالي النسب',
      lineColor: '#D72229',
      sideColor: '#2F6DFF',      
      data: makeData([14, 16, 20, 22]),
    },
    {
      title: 'نسبة إرسال الرسائل الصوتية',
      sideLabel: 'إجمالي النسب',
      lineColor: '#2F6DFF',
      sideColor: '#D72229',
      data: makeData([15, 17, 19, 21]),
    },
  ];

  return (
    <main className="p-6 space-y-4 pl-[80px]">
      <h1 className="text-[#D72229] text-xl font-semibold text-right">الرسائل</h1>
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
          </div>
        ))}
      </div>
    </main>
  );
}
