// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import UserPieStats from '../_components/UserPieStats';
// import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
// import CustomChart from '../_components/CustomChart';
// import { Search } from 'lucide-react';
// import { Input } from '@/components/ui/input';

// type Account = { id: string; name: string; email: string };


// export default function ShieldsPage() {
//   // ---- داتا الشارتس (نفس اللي عندك)
//   const pieData = [
//     { name: 'مؤهّلون', value: 12450 },
//     { name: 'حصل على الدرع', value: 120 },
//     { name: 'طلب قيد المراجعة', value: 230 },
//     { name: 'تم الرفض', value: 24 },
//   ];
//   const piePercent = '62%';

//   const lineSeries = [
//     { key: 'sent',     name: 'تم الإرسال',     color: '#3b82f6', strokeWidth: 2 },
//     { key: 'accepted', name: 'تم القبول',      color: '#22c55e', strokeWidth: 2 },
//     { key: 'rejected', name: 'تم الرفض',       color: '#ef4444', strokeWidth: 2 },
//   ];
//   const lineChartData = [
//     { month: 'يناير',  sent: 10000, accepted: 3500, rejected: 1200 },
//     { month: 'فبراير', sent:  8800, accepted: 4100, rejected:  980 },
//     { month: 'مارس',   sent:  9400, accepted: 4300, rejected: 1100 },
//     { month: 'أبريل',  sent: 10200, accepted: 4700, rejected:  950 },
//     { month: 'مايو',   sent: 10800, accepted: 5200, rejected:  900 },
//     { month: 'يونيو',  sent: 10000, accepted: 5000, rejected:  870 },
//   ];
//   const lineSideItems = [
//     { label: 'مؤهّلون للحصول على الدرع', value: 10000 },
//     { label: 'طلبات قيد المراجعة', value: 3500 },
//     { label: 'مؤهّلون تم إرسال طلب', value: 8800 },
//   ];

//   // ---- بحث + داتا قابلة للـ API
//   const [query, setQuery] = React.useState('');
//   const [accounts, setAccounts] = React.useState<Account[]>([
//     // افتراضيًا – امسحه بعد ربط الـ API
//     { id: '1', name: 'Abdallah Mohamed', email: 'abdallah@example.com' },
//     { id: '2', name: 'Eslam Mohamed',    email: 'eslam@example.com' },
//     { id: '3', name: 'Yasser El Helw',   email: 'yasser@example.com' },
//   ]);



//   const filtered = React.useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return accounts;
//     return accounts.filter(
//       (u) =>
//         u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
//     );
//   }, [accounts, query]);

//   return (
//     <main className="min-h-screen bg-white">
//       <div className="mx-auto px-4 py-6 pl-[80px]">


//         {query && (
//           <div className="mb-4 rounded-2xl border bg-[#F9FAFB] p-3 text-sm text-gray-600">
//             النتائج: {filtered.length}
//           </div>
//         )}

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
//           <section className="lg:col-span-9 space-y-6">
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 <UserPieStats
//                     data={pieData}
//                     percentage={piePercent}
//                     title="النسب للحصول على الدرع"
//                     sideLabel="إجمالي النِّسب"
//                     colors={['#D72229', '#28a745', '#facc15', '#3b82f6']}
//                 />
//                 <UserGrowthMultiStats
//                     chartData={lineChartData}
//                     series={lineSeries}
//                     xKey="month"
//                     sideItems={lineSideItems}
//                     title="المؤهّلون للحصول على الدرع"
//                     sideLabel="عدد الحسابات"
//                 />
//             </div>

//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
//                 <p className="mb-4 text-[#9AA0A6]">
//                   اطلع على الحسابات التي تم قبول طلبات الحصول على الدرع
//                 </p>
//                 <Link
//                   href="/shields/accepted"
//                   className="inline-block rounded-full bg-[#D72229] px-8 py-3 text-white hover:opacity-90"
//                 >
//                   مشاهدة الدروع
//                 </Link>
//               </div>

//               <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
//                 <p className="mb-4 text-[#9AA0A6]">
//                   اطلع على الحسابات التي أرسلت طلب لقبول الدرع
//                 </p>
//                 <Link
//                     href="/shields/eligible-not-sent"
//                     className="inline-block rounded-full bg-[#5C7CF4] px-8 py-3 text-white hover:opacity-90"
//                 >
//                   مشاهدة الحسابات التي أرسلت طلب
//                 </Link>
//               </div>
//             </div>
//           </section>

//           <aside className="lg:col-span-3 space-y-6">
//             <div className="mb-4 flex justify-end">
//               <div className="flex w-full max-w-[340px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3" dir='rtl'>
//                 <div className="grid h-12 w-15 place-items-center rounded-[15px] bg-[#8989A2]/25">
//                   <Search className="text-[#8989A2]" />
//                 </div>
//                 <Input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="اكتب ما تبحث عنه"
//                   className="h-12 rounded-2xl border-none bg-white/70 -inner"
//                 />
//               </div>
//             </div>
//             <CustomChart apiUrl={''} staticData1={[]} staticData2={[]} />

//             <div className="rounded-[28px] bg-[#F6F6F6] p-6">
//               <p className="mb-4 text-[#9AA0A6]">
//                 اطلع على الحسابات المؤهلة للحصول على الدرع لكنّها لم ترسل طلب
//               </p>
//               <Link
//                 href="/shields/sent"
//                 className="block w-full rounded-full bg-[#D72229] px-8 py-3 text-center text-white hover:opacity-90"
//               >
//                 مشاهدة
//               </Link>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </main>
//   );
// }



'use client';

import React from 'react';
import Link from 'next/link';
import UserPieStats from '../_components/UserPieStats';
import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
import CustomChart, { type StaticChartPoint } from '../_components/CustomChart';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Account = { id: string; name: string; email: string };

export default function ShieldsPage() {
  // ---- داتا الشارتس
  const pieData = [
    { name: 'مؤهّلون', value: 12450 },
    { name: 'حصل على الدرع', value: 120 },
    { name: 'طلب قيد المراجعة', value: 230 },
    { name: 'تم الرفض', value: 24 },
  ];
  const piePercent = '62%';

  const lineSeries = [
    { key: 'sent',     name: 'تم الإرسال',     color: '#3b82f6', strokeWidth: 2 },
    { key: 'accepted', name: 'تم القبول',      color: '#22c55e', strokeWidth: 2 },
    { key: 'rejected', name: 'تم الرفض',       color: '#ef4444', strokeWidth: 2 },
  ];
  const lineChartData = [
    { month: 'يناير',  sent: 10000, accepted: 3500, rejected: 1200 },
    { month: 'فبراير', sent:  8800, accepted: 4100, rejected:  980 },
    { month: 'مارس',   sent:  9400, accepted: 4300, rejected: 1100 },
    { month: 'أبريل',  sent: 10200, accepted: 4700, rejected:  950 },
    { month: 'مايو',   sent: 10800, accepted: 5200, rejected:  900 },
    { month: 'يونيو',  sent: 10000, accepted: 5000, rejected:  870 },
  ];
  const lineSideItems = [
    { label: 'مؤهّلون للحصول على الدرع', value: 10000 },
    { label: 'طلبات قيد المراجعة', value: 3500 },
    { label: 'مؤهّلون تم إرسال طلب', value: 8800 },
  ];

  // ✅ بيانات CustomChart (نسبة الرفض بسبب نقص المستندات)
  const rejectionData: StaticChartPoint[] = [
    { name: 'يناير', value: 30000, value2: 20000, value3: 60000 },
    { name: 'فبراير', value: 35000, value2: 25000, value3: 65000 },
    { name: 'مارس', value: 50000, value2: 30000, value3: 70000 },
    { name: 'أبريل', value: 55000, value2: 35000, value3: 75000 },
    { name: 'مايو', value: 70000, value2: 40000, value3: 80000 },
    { name: 'يونيو', value: 75000, value2: 45000, value3: 85000 },
  ];

  // ✅ بيانات إضافية (نفس البيانات)
  const retentionData: StaticChartPoint[] = [
    { name: 'يناير', value: 30000, value2: 20000, value3: 60000 },
    { name: 'فبراير', value: 35000, value2: 25000, value3: 65000 },
    { name: 'مارس', value: 50000, value2: 30000, value3: 70000 },
    { name: 'أبريل', value: 55000, value2: 35000, value3: 75000 },
    { name: 'مايو', value: 70000, value2: 40000, value3: 80000 },
    { name: 'يونيو', value: 75000, value2: 45000, value3: 85000 },
  ];

  // ---- بحث
  const [query, setQuery] = React.useState('');
  const [accounts, setAccounts] = React.useState<Account[]>([
    { id: '1', name: 'Abdallah Mohamed', email: 'abdallah@example.com' },
    { id: '2', name: 'Eslam Mohamed',    email: 'eslam@example.com' },
    { id: '3', name: 'Yasser El Helw',   email: 'yasser@example.com' },
  ]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [accounts, query]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto px-4 py-6 pl-[80px]">

        {query && (
          <div className="mb-4 rounded-2xl border bg-[#F9FAFB] p-3 text-sm text-gray-600">
            النتائج: {filtered.length}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <UserPieStats
                data={pieData}
                percentage={piePercent}
                title="النسب للحصول على الدرع"
                sideLabel="إجمالي النِّسب"
                colors={['#D72229', '#28a745', '#facc15', '#3b82f6']}
              />
              <UserGrowthMultiStats
                chartData={lineChartData}
                series={lineSeries}
                xKey="month"
                sideItems={lineSideItems}
                title="المؤهّلون للحصول على الدرع"
                sideLabel="عدد الحسابات"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
                <p className="mb-4 text-[#9AA0A6]">
                  اطلع على الحسابات التي تم قبول طلبات الحصول على الدرع
                </p>
                <Link
                  href="/shields/accepted"
                  className="inline-block rounded-full bg-[#D72229] px-8 py-3 text-white hover:opacity-90"
                >
                  مشاهدة الدروع
                </Link>
              </div>

              <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
                <p className="mb-4 text-[#9AA0A6]">
                  اطلع على الحسابات التي أرسلت طلب لقبول الدرع
                </p>
                <Link
                  href="/shields/eligible-not-sent"
                  className="inline-block rounded-full bg-[#5C7CF4] px-8 py-3 text-white hover:opacity-90"
                >
                  مشاهدة الحسابات التي أرسلت طلب
                </Link>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-3 space-y-6">
            <div className="mb-4 flex justify-end">
              <div className="flex w-full max-w-[340px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3" dir='rtl'>
                <div className="grid h-12 w-15 place-items-center rounded-[15px] bg-[#8989A2]/25">
                  <Search className="text-[#8989A2]" />
                </div>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="اكتب ما تبحث عنه"
                  className="h-12 rounded-2xl border-none bg-white/70 -inner"
                />
              </div>
            </div>

            {/* ✅ CustomChart - نسبة الرفض بسبب نقص المستندات */}
            <div className="bg-[#F6F6F6] rounded-[40px] p-5">
              <h3 className="mb-2 text-[#D72229] text-sm font-semibold">نسبة الرفض بسبب نقص المستندات</h3>
              <CustomChart
                apiUrl="https://bo-chat.space/dashboard/features/ReactsInLastMonth"
                tokenKey="token"
                staticData1={rejectionData}
                staticData2={retentionData}
                apiLineName="تفاعلات آخر 30 يوم"
                height={200}
              />
            </div>

            <div className="rounded-[28px] bg-[#F6F6F6] p-6">
              <p className="mb-4 text-[#9AA0A6]">
                اطلع على الحسابات المؤهلة للحصول على الدرع لكنّها لم ترسل طلب
              </p>
              <Link
                href="/shields/sent"
                className="block w-full rounded-full bg-[#D72229] px-8 py-3 text-center text-white hover:opacity-90"
              >
                مشاهدة
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}