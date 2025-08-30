'use client';

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

type Series = {
  key: string;
  name: string;
  color: string;
  strokeWidth?: number;
  dot?: boolean;
  muted?: boolean;       
  labelColor?: string;  
};


type SideItem = { label: string; value: number | string; unit?: string };

interface Props {
  chartData: Array<Record<string, string | number>>;
  series: Series[];
  xKey?: string;               
  sideItems?: SideItem[];     
  title?: string;
  sideLabel?: string;
}

export default function UserGrowthMultiStats({
  chartData,
  series,
  xKey = 'month',
  sideItems = [],
  title = 'نمو المستخدمين',
  sideLabel = 'عدد المستخدمين',
}: Props) {
  
  return (
    <div className='flex relative  bg-[#F6F6F6] rounded-[40px] shadow pie' dir='rtl' >
      <div className="flex relative flex-col items-center justify-end py-2 rounded-br-[40px] rounded-tr-[40px] flex-1">
        <div className="flex items-center justify-between w-full !px-5" >
          <div className="flex items-center gap-3 text-[12px]">
            {series.map((s) => (
              <div
                key={s.key}
                className={`flex items-center gap-1 ${s.muted ? 'opacity-40' : ''}`}
              >
                <span
                  className="inline-block size-3 rounded-[4px]"
                  style={{ backgroundColor: s.color }}
                />
                <span
                  className="font-medium"
                  style={{ color: s.labelColor ?? s.color }}
                >
                  {s.name}
                </span>
              </div>
            ))}

          </div>
          <h2 className="text-[18px]  text-[#D72229] tracking-tight">
            {title}
          </h2>
        </div>
        <ResponsiveContainer className="relative flex items-center" width="100%" height="100%">
          <LineChart data={chartData}>
            {series.map(s => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={s.strokeWidth ?? 2}
                dot={s.dot ?? false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-between gap-1 text-sm text-[#8989A2]" dir='rtl'>
          {chartData.map((item, i) => (
            <div className="flex items-center gap-1" key={`${String(item[xKey])}-${i}`}>
              {String(item[xKey])}
            </div>
          ))}
        </div>
      </div>
      <div className='bg-[#D72229] relative w-[30%] rounded-br-[40px] rounded-tl-[40px] rounded-bl-[40px] p-2 text-white'>
        <h1 className='rotate-[270deg] w-fit h-fit text-[13px] absolute top-[50%] translate-y-[-50%] left-[-10%]'>
          {sideLabel}
        </h1>
        <div dir='rtl' className='text-right flex flex-col items-start'>
          {sideItems.map((s, i) => (
            <div key={`${s.label}-${i}`}>
              <p className='text-[10px]'>{s.label}</p>
              <h1 className='text-[18px]'>
                {s.value} {s.unit ? <span className='text-[10px]'>{s.unit}</span> : null}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
