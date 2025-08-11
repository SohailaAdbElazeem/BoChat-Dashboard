'use client';

import React from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
interface Props {
  data: { month: string; value: number }[];
  title?: string;
  sideLabel?: string;
  lineColor?: string;
  sideColor?: string;
}

export default function UserGrowthStats({
  data,
  title = 'نمو المستخدمين',
  sideLabel = 'عدد المستخدمين',
  lineColor = '#D72229',
  sideColor = '#D72229',
}: Props) {
  return (
    <div className='flex relative h-[200px] bg-[#F6F6F6] rounded-[40px] shadow pie'>
      <div
        className='relative w-[35%] rounded-br-[40px] rounded-tl-[40px] rounded-bl-[40px] p-2 text-white'
        style={{ backgroundColor: sideColor }} 
      >
        <h1 className='rotate-[270deg] w-fit h-fit text-[13px] absolute top-[50%] translate-y-[-50%] left-[-18%]'>
          {sideLabel}
        </h1>
        <div dir='rtl' className='text-right flex flex-col items-start'>
          {data.map((item, index) => (
            <div key={index}>
              <p className='text-[10px]'>{item.month}</p>
              <h1 className='text-[18px]'>
                {item.value} <span className='text-[10px]'>مستخدم</span>
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="flex relative flex-col items-center justify-end py-2 rounded-br-[40px] rounded-tr-[40px] flex-1">
        <h2 className="text-[15px] text-center text-[#D72229]">{title}</h2>
        <ResponsiveContainer className="relative flex items-center" width={320}>
          <LineChart data={data}>
            <Line type="monotone" dot={false} dataKey="value" stroke={lineColor} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-between gap-1 text-sm text-[#8989A2]" dir='rtl'>
          {data.map((item, index) => (
            <div className="flex items-center gap-1" key={index}>
              {item.month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
