'use client';

import { useState } from 'react';

export type SearchRow = {
  no: number;
  keyword: string;
  searchCount: number;
  growthPct: number;
  lastSearchAgo: string;
  note?: string;
};

type Props = { rows: SearchRow[] };

export default function SearchKeywordsTable({ rows }: Props) {
  const [data, setData] = useState(rows);

  const handleNoteChange = (index: number, value: string) => {
    const updated = [...data];
    updated[index].note = value;
    setData(updated);
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-[#eee] bg-white" dir="rtl">
      <table className="min-w-full text-sm text-right border-collapse">
        <thead>
          <tr className="bg-[#FDECEE] text-[#D72229] font-medium">
            <th className="px-4 py-3 text-center">الرقم</th>
            <th className="px-4 py-3">الكلمة</th>
            <th className="px-4 py-3 text-center">مرات البحث</th>
            <th className="px-4 py-3 text-center">نسبة النمو</th>
            <th className="px-4 py-3 text-center">آخر بحث</th>
            <th className="px-4 py-3 text-center">ملاحظات</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((r, idx) => {
            const sign = r.growthPct >= 0 ? '+' : '';
            const growthColor =
              r.growthPct > 0
                ? 'text-[#1B8A5A]'
                : r.growthPct < 0
                ? 'text-[#D72229]'
                : 'text-[#777]';

            return (
              <tr key={r.no} className="hover:bg-[#FAFAFA]">
                <td className="px-4 py-2 text-center text-[#333]">{r.no}</td>
                <td className="px-4 py-2 text-[#333]">{r.keyword}</td>
                <td className="px-4 py-2 text-center text-[#333]">{r.searchCount}</td>
                <td className={`px-4 py-2 text-center ${growthColor}`}>
                  {sign}
                  {r.growthPct}%
                </td>
                <td className="px-4 py-2 text-center text-[#777]">{r.lastSearchAgo}</td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="text"
                    className="p-[8px] w-full text-xs text-[#999] rounded-2xl border-2 border-[#E6E6E6]"
                    value={r.note ?? ''}
                    onChange={(e) => handleNoteChange(idx, e.target.value)}
                    placeholder="اكتب هنا ملاحظتك"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
