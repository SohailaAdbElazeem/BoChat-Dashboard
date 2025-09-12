/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  data: { month: string; value: number }[];
  title?: string;
  sideLabel?: string;
  lineColor?: string;
  sideColor?: string;
  /** اختياري: يُستدعى عند اختيار شهر من الشريط السفلي */
  onSelect?: (item: { month: string; value: number }, index: number) => void;
}

export default function UserGrowthStats({
  data,
  title = 'نمو المستخدمين',
  sideLabel = 'عدد المستخدمين',
  lineColor = '#D72229',
  sideColor = '#D72229',
  onSelect,
}: Props) {
  // يختار آخر نقطة افتراضيًا إن وُجدت
  const [selectedIndex, setSelectedIndex] = React.useState<number>(() =>
    data.length ? data.length - 1 : 0
  );

  // لو البيانات اتغيرت، نحافظ على فهرس صالح
  React.useEffect(() => {
    if (data.length) {
      setSelectedIndex((prev) => Math.min(prev, data.length - 1));
    } else {
      setSelectedIndex(0);
    }
  }, [data]);

  const selected = data[selectedIndex] ?? { month: '', value: 0 };
  const firstFour = React.useMemo(() => data.slice(0, 4), [data]);

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    onSelect?.(data[idx], idx);
  };

  return (
    <div className="flex relative h-[200px] bg-[#F6F6F6] rounded-[40px] pie">
      <div
        className=" relative w-[35%] rounded-br-[40px] rounded-tl-[40px] rounded-bl-[40px] p-2 text-white"
        style={{ backgroundColor: sideColor }}
      >
        <h1 className="rotate-[270deg] w-fit h-fit text-[13px] absolute top-[50%] translate-y-[-50%] left-[-18%]">
          {sideLabel}
        </h1>
        <div dir="rtl" className="text-right flex flex-col items-start">
          {firstFour.map((item, index) => (
            <div key={index}>
              <p className="text-[10px]">{item.month}</p>
              <h1 className="text-[18px] font-bold">
                {item.value} <span className="text-[10px] font-normal">مستخدم</span>
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="flex relative flex-col items-center justify-end rounded-br-[40px] rounded-tr-[40px] flex-1">
        <h2 className="text-[15px] text-center text-[#D72229] mb-[10px]">{title}</h2>
        <div className="absolute top-2 right-3 rounded-xl bg-white/90 shadow px-3 py-2 text-[12px]" dir="rtl">
          <div className="font-semibold text-[#D72229]">{selected.month || '—'}</div>
          <div className="text-[#444]">
            {selected.value} <span className="opacity-70">مستخدم</span>
          </div>
        </div>

        <ResponsiveContainer className="relative flex items-center" width={380} height={120}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dot={false}
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              activeDot={{
                r: 5,
                onClick: (_e: any) => {
                  const idx = _e?.index ?? selectedIndex;
                  if (typeof idx === 'number') handleSelect(idx);
                },
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-between text-sm text-[#8989A2] px-1 w-full pb-3" dir="rtl">
          {data.map((item, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                type="button"
                key={index}
                onClick={() => handleSelect(index)}
                className={`min-w-0 shrink text-ellipsis whitespace-nowrap px-2 py-1 rounded-lg transition
                  ${isActive ? 'text-[#D72229]' : ''}`}
                aria-pressed={isActive}
                title={`عرض إحصائيات ${item.month}`}
              >
                {item.month}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
