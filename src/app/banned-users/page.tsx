/* eslint-disable react/jsx-key */
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BanForm from './_components/BanForm';
import { BannedCard } from './_components/BannedCard';
import BannedListCard from './_components/BannedListCard';

const getToken = () =>
  localStorage.getItem('token') ||
  localStorage.getItem('auth_token') ||
  '';

type BannedUser = {
  id: string;          
  name: string;
  email: string;
  until: number;       
  durationMs: number; 
};

const ChartsSidebar = () => (
  <div className="space-y-4">
    <div className="rounded-3xl bg-[#F6F6F6] p-4 shadow-sm">
      <div className="mb-2 text-right text-[15px] font-semibold text-[#D12D2D]">نسبة الحظر الشهري</div>
      <div className="h-[160px] rounded-xl bg-white/50" />
    </div>
    <div className="rounded-3xl bg-[#F6F6F6] p-4 shadow-sm">
      <div className="mb-2 text-right text-[15px] font-semibold text-[#D12D2D]">نسبة الحظر من عدد المستخدمين</div>
      <div className="h-[160px] rounded-xl bg-white/50" />
    </div>
  </div>
);

export default function BanPage() {
  const [banned, setBanned] = React.useState<BannedUser[]>([]);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);






  const filtered = banned.filter(
    (u) =>
      !query ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="p-6 pl-[80px]">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-4 space-y-5">
          {/* {loading && <div className="rounded-3xl bg-[#F6F6F6] p-6 text-center text-gray-500">جارٍ التحميل…</div>}
          {error && !loading && (
            <div className="rounded-3xl bg-[#FDECEC] p-6 text-center text-[#D12D2D]">{error}</div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="rounded-3xl bg-[#F6F6F6] p-6 text-center text-gray-500">لا توجد حسابات محظورة.</div>
          )} */}
          <BannedCard/>
        </section>

        <section className="xl:col-span-5 space-y-5">
          <BanForm />
          <BannedListCard/>
        </section>

        <aside className="xl:col-span-3">
          <div className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3 mb-2" dir="rtl">
            <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#8989A2]/25">
              <Search className="text-[#8989A2]" />
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب ما تبحث عنه"
              className="h-12 rounded-2xl border-none bg-white/70 shadow-inner"
            />
          </div>
            <ChartsSidebar />
        </aside>
      </div>
    </main>
  );
}



