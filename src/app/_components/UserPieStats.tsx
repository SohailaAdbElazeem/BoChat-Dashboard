'use client';

import React, { useMemo } from 'react';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type Duration =
  | 'today'
  | 'yesterday'
  | 'last7d'
  | 'last30d'
  | 'allTime'
  | string;

export interface ApiResponse {
  totalUsers?: number;
  activeUsers?: number;
  unActiveUsers?: number;
  publisher?: number;
  unPublisher?: number;
  percentageActive?: number;
  [key: string]: unknown;
}

interface ChartItem {
  name: string;
  value: number;
}

export const DEFAULT_COLORS = ['#dc3545', '#28a745', '#facc15', '#3b82f6'];

/** مساعد لتحويل الاستجابة إلى بيانات الرسم + نسبة الناشرين */
export function transformResponse(res: {
  activeUsers?: number;
  unActiveUsers?: number;
  publisher?: number;
  unPublisher?: number;
}) {
  const active = Number(res.activeUsers ?? 0);
  const unActive = Number(res.unActiveUsers ?? 0);
  const publisher = Number(res.publisher ?? 0);
  const unPublisher = Number(res.unPublisher ?? 0);

  // ترتيب ثابت للألوان:
  // [أحمر, أخضر, أصفر, أزرق] => [غير نشط, نشط, غير ناشرين, ناشرون]
  const rawData: ChartItem[] = [
    { name: 'غير نشط', value: unActive },
    { name: 'نشط', value: active },
    { name: 'غير ناشرين', value: unPublisher },
    { name: 'ناشرون', value: publisher },
  ];

  const data = rawData.filter(d => Number.isFinite(d.value) && d.value > 0);

  // احسب "نسبة الناشرين"
  const publisherTotal = publisher + unPublisher;
  const percentageLabel =
    publisherTotal > 0 ? `${Math.round((publisher / publisherTotal) * 100)}%` : '--';

  return { data, percentageLabel };
}

export interface UserPieStatsProps {
  apiData: ApiResponse | null;

  loading?: boolean;
  error?: string | null;

  title?: string;
  sideLabel?: string;
  colors?: string[];

  duration?: Duration;
}

export default function UserPieStats({
  apiData,
  loading = false,
  error = null,
  title = 'المستخدمين النشطين',
  sideLabel = 'اجمالي النسب',
  colors = DEFAULT_COLORS,
}: UserPieStatsProps) {

  const { data, percentageLabel } = useMemo(() => {
    if (!apiData) return { data: [] as ChartItem[], percentageLabel: '--' };
    return transformResponse(apiData);
  }, [apiData]);

  return (
    <div className='flex relative h-[200px] bg-[#F6F6F6] rounded-[40px] shadow kpi'>
      <div className='bg-[#D72229] relative w-[35%] rounded-br-[40px] rounded-tl-[40px] rounded-bl-[40px] p-2 text-white'>
        <h1 className='rotate-[270deg] w-fit h-fit text-[15px] absolute top-[50%] translate-y-[-50%] left-[-20%]'>
          {sideLabel}
        </h1>

        <div dir='rtl' className='text-right flex flex-col items-start'>
          {loading && <p className='text-[12px] opacity-90'>...جاري التحميل</p>}
          {error && <p className='text-[12px] text-yellow-200'>خطأ: {error}</p>}
          {!loading && !error && data.length === 0 && (
            <p className='text-[12px] opacity-90'>لا توجد بيانات للعرض.</p>
          )}
          {!loading && !error && data.map((item, index) => (
            <div key={index}>
              <p className='text-[10px]'>{item.name}</p>
              <h1 className='text-[18px]'>
                {item.value} <span className='text-[10px]'>شخص</span>
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-100 items-center justify-end ">
        <div className="flex justify-center flex-col gap-1 text-sm text-[#8989A2]" dir='rtl'>
          <h2 className="text-[17px] text-right text-[#D72229]">{title}</h2>

          {loading && <span className="text-xs">...جاري التحميل</span>}
          {error && <span className="text-xs text-red-500">خطأ في التحميل</span>}

          {!loading && !error && data.map((item, index) => (
            <div className="flex items-center gap-1" key={index}>
              <span
                className="w-[13px] h-[13px] rounded-[5px]"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              {item.name}
            </div>
          ))}
        </div>

        <ResponsiveContainer className={"relative"} width="50%" height={225}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={60}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} cornerRadius={3} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <div className="text-center text-2xl text-[#D72229] absolute top-[45%] left-[50%] translate-x-[-50%]">
            {loading ? '—' : percentageLabel}
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
