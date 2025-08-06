'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

interface Props {
  data: { month: string; value: number }[];
  title?: string;
  sideLabel?: string;
  lineColor?: string;
}

export default function UserGrowthStats({
  data,
  title = 'نمو المستخدمين',
  sideLabel = 'عدد المستخدمين',
  lineColor = '#D72229'
}: Props) {
  return (
    <div className='flex relative h-[225px]'>
      <div className='bg-[#D72229] relative translate-x-[50px] w-[145px] h-[225px] rounded-br-[40px] rounded-tl-[40px] rounded-bl-[40px] p-2 text-white'>
        <h1 className='rotate-[270deg] w-fit h-fit text-[15px] absolute top-[50%] translate-y-[-50%] left-[-20%]'>
          {sideLabel}
        </h1>
        <div dir='rtl' className='text-right flex flex-col items-start'>
          {data.map((item, index) => (
            <div key={index}>
              <p className='text-[13px]'>{item.month}</p>
              <h1 className='text-[20px]'>
                {item.value} <span className='text-[10px]'>مستخدم</span>
              </h1>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-100 items-center justify-end bg-[#F6F6F6] dark:bg-[#f6f6f6] p-5 rounded-br-[20px] rounded-tr-[20px] shadow">
        <h2 className="text-[17px] text-right text-[#D72229]">{title}</h2>
    
        <ResponsiveContainer className="relative ml-[48px]" width="100%" height={200}>
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
