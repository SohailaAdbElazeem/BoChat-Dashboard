// // 'use client';

// // import React from 'react';
// // import Link from 'next/link';
// // import { Search } from 'lucide-react';
// // import { Input } from '@/components/ui/input';
// // import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
// // import CustomChart from '../_components/CustomChart';
// // import UserPieStats from '../_components/UserPieStats';

// // type Account = { id: string; name: string; email: string };

// // const API_BASE = 'http://bo-chat.space/vip/request'; 

// // export default function VerificationPage() {
// //   const pieData = [
// //     { name: 'موثّقون', value: 10800 },
// //     { name: 'موقّفون', value: 120 },
// //     { name: 'قيد المراجعة', value: 230 },
// //     { name: 'تم الرفض', value: 24 },
// //   ];
// //   const piePercent = '64%';

// //   const lineSeries = [
// //     { key: 'sent',     name: 'تم الإرسال',     color: '#3b82f6', strokeWidth: 2 },
// //     { key: 'approved', name: 'تم التوثيق',     color: '#22c55e', strokeWidth: 2 },
// //     { key: 'stopped',  name: 'موقّف',          color: '#ef4444', strokeWidth: 2 },
// //   ];
// //   const lineChartData = [
// //     { month: 'يناير',  sent: 9000,  approved: 4200, stopped:  60 },
// //     { month: 'فبراير', sent: 9800,  approved: 4600, stopped:  85 },
// //     { month: 'مارس',   sent: 10200, approved: 5000, stopped: 110 },
// //     { month: 'أبريل',  sent: 10800, approved: 5400, stopped: 100 },
// //     { month: 'مايو',   sent: 11000, approved: 5600, stopped:  95 },
// //     { month: 'يونيو',  sent: 10000, approved: 5200, stopped:  90 },
// //   ];
// //   const lineSideItems = [
// //     { label: 'موثّقون', value: 10800 },
// //     { label: 'طلبات قيد المراجعة', value: 3500 },
// //     { label: 'طلبات تم إرسالها', value: 8800 },
// //   ];

// //   // ---------- بحث (قابل للـ API)
// //   const [query, setQuery] = React.useState('');
// //   const [accounts, setAccounts] = React.useState<Account[]>([
// //     { id: '1', name: 'Abdallah Mohamed', email: 'abdallah@example.com' },
// //     { id: '2', name: 'Eslam Mohamed',    email: 'eslam@example.com' },
// //     { id: '3', name: 'Yasser El Helw',   email: 'yasser@example.com' },
// //   ]);

// //   // مثال جلب من API (اختياري الآن)
// //   React.useEffect(() => {
// //     if (!API_BASE) return;
// //     // (async () => {
// //     //   const res = await fetch(`${API_BASE}/verification/accounts?search=${encodeURIComponent(query)}`, { cache: 'no-store' });
// //     //   const json: Account[] = await res.json();
// //     //   setAccounts(json);
// //     // })();
// //   }, [query]);

// //   const filtered = React.useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     if (!q) return accounts;
// //     return accounts.filter(
// //       (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
// //     );
// //   }, [accounts, query]);

// //   return (
// //     <main className="min-h-screen bg-white" >
// //       <div className="mx-auto px-4 py-6 pl-[80px]">

// //         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
// //           <section className="lg:col-span-9 space-y-6">
// //             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
// //               <UserPieStats
// //                 data={pieData}
// //                 percentage={piePercent}
// //                 title="النِسب للتوثيق"
// //                 sideLabel="إجمالي النِّسب"
// //                 colors={['#D72229', '#28a745', '#facc15', '#3b82f6']}
// //               />

// //               <UserGrowthMultiStats
// //                 chartData={lineChartData}
// //                 series={lineSeries}
// //                 xKey="month"
// //                 sideItems={lineSideItems}
// //                 title="المؤهّلون للتوثيق"
// //                 sideLabel="عدد الحسابات"
// //               />
// //             </div>

// //             {/* كروت CTA */}
// //             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
// //               <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
// //                 <p className="mb-4 text-[#9AA0A6]">
// //                   اطلع على الحسابات التي تم قبول طلبات التوثيق الخاصة بها
// //                 </p>
// //                 <Link
// //                   href="/verification/approved"
// //                   className="inline-block rounded-full bg-[#D72229] px-8 py-3 text-white hover:opacity-90"
// //                 >
// //                   مشاهدة الحسابات الموثقة
// //                 </Link>
// //               </div>

// //               <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
// //                 <p className="mb-4 text-[#9AA0A6]">
// //                   اطلع على الحسابات التي أرسلت طلب التوثيق
// //                 </p>
// //                 <Link
// //                   href="/verification/requests"
// //                   className="inline-block rounded-full bg-[#5C7CF4] px-8 py-3 text-white hover:opacity-90"
// //                 >
// //                   مشاهدة الحسابات التي أرسلت طلب
// //                 </Link>
// //               </div>
// //             </div>
// //           </section>

// //           <aside className="lg:col-span-3 space-y-6">
// //                     {/* شريط البحث يمين */}
// //         <div className="mb-4 flex justify-start" dir='rtl'>
// //           <div className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3">
// //             <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#8989A2]/25">
// //               <Search className="text-[#8989A2]" />
// //             </div>
// //             <Input
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               placeholder="اكتب ما تبحث عنه"
// //               className="h-12 rounded-2xl border-none bg-white/70 -inner"
// //             />
// //           </div>
// //         </div>

// //             <div className="bg-[#F6F6F6] rounded-[40px] p-5">
// //               <h3 className="mb-2 text-[#D72229] text-sm font-semibold">نسبة الرفض بسبب نقص المستندات</h3>
// //               <CustomChart apiUrl={''} staticData1={[]} staticData2={[]} />
// //             </div>

// //             <div className="rounded-[28px] bg-[#F6F6F6] p-6">
// //               <p className="mb-4 text-[#9AA0A6]">
// //                 اطلع على الحسابات المؤهلة للتوثيق لكنها لم ترسل طلب
// //               </p>
// //               <Link
// //                 href="/verified/eligible-not-sent"
// //                 className="block w-full rounded-full bg-[#D72229] px-8 py-3 text-center text-white hover:opacity-90"
// //               >
// //                 مشاهدة
// //               </Link>
// //             </div>
// //           </aside>
// //         </div>

// //         {/* (اختياري) إظهار عدد نتائج البحث */}
// //         {query && (
// //           <div className="mt-6 rounded-2xl border bg-[#F9FAFB] p-3 text-sm text-gray-600">
// //             نتائج البحث في الحسابات: {filtered.length}
// //           </div>
// //         )}
// //       </div>
// //     </main>
// //   );
// // }


// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { Search } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
// import CustomChart, { type StaticChartPoint } from '../_components/CustomChart';
// import UserPieStats from '../_components/UserPieStats';

// type Account = { id: string; name: string; email: string };

// const API_BASE = 'http://bo-chat.space/vip/request'; 

// export default function VerificationPage() {
//   const pieData = [
//     { name: 'موثّقون', value: 10800 },
//     { name: 'موقّفون', value: 120 },
//     { name: 'قيد المراجعة', value: 230 },
//     { name: 'تم الرفض', value: 24 },
//   ];
//   const piePercent = '64%';

//   const lineSeries = [
//     { key: 'sent',     name: 'تم الإرسال',     color: '#3b82f6', strokeWidth: 2 },
//     { key: 'approved', name: 'تم التوثيق',     color: '#22c55e', strokeWidth: 2 },
//     { key: 'stopped',  name: 'موقّف',          color: '#ef4444', strokeWidth: 2 },
//   ];
//   const lineChartData = [
//     { month: 'يناير',  sent: 9000,  approved: 4200, stopped:  60 },
//     { month: 'فبراير', sent: 9800,  approved: 4600, stopped:  85 },
//     { month: 'مارس',   sent: 10200, approved: 5000, stopped: 110 },
//     { month: 'أبريل',  sent: 10800, approved: 5400, stopped: 100 },
//     { month: 'مايو',   sent: 11000, approved: 5600, stopped:  95 },
//     { month: 'يونيو',  sent: 10000, approved: 5200, stopped:  90 },
//   ];
//   const lineSideItems = [
//     { label: 'موثّقون', value: 10800 },
//     { label: 'طلبات قيد المراجعة', value: 3500 },
//     { label: 'طلبات تم إرسالها', value: 8800 },
//   ];

//   // ✅ بيانات نسبة الرفض بسبب نقص المستندات
//   const rejectionData: StaticChartPoint[] = [
//     { name: 'يناير', value: 15, value2: 8, value3: 5 },
//     { name: 'فبراير', value: 22, value2: 12, value3: 7 },
//     { name: 'مارس', value: 18, value2: 10, value3: 6 },
//     { name: 'أبريل', value: 25, value2: 15, value3: 9 },
//     { name: 'مايو', value: 30, value2: 18, value3: 11 },
//     { name: 'يونيو', value: 20, value2: 14, value3: 8 },
//     { name: 'يوليو', value: 28, value2: 16, value3: 10 },
//     { name: 'أغسطس', value: 35, value2: 20, value3: 13 },
//   ];

//   // ✅ بيانات إضافية (معدل الاحتفاظ)
//   const retentionData: StaticChartPoint[] = [
//     { name: 'يناير', value: 85, value2: 70, value3: 60 },
//     { name: 'فبراير', value: 82, value2: 68, value3: 58 },
//     { name: 'مارس', value: 88, value2: 72, value3: 62 },
//     { name: 'أبريل', value: 90, value2: 75, value3: 65 },
//     { name: 'مايو', value: 87, value2: 73, value3: 63 },
//     { name: 'يونيو', value: 92, value2: 78, value3: 68 },
//     { name: 'يوليو', value: 89, value2: 76, value3: 66 },
//     { name: 'أغسطس', value: 94, value2: 80, value3: 70 },
//   ];

//   // ---------- بحث (قابل للـ API)
//   const [query, setQuery] = React.useState('');
//   const [accounts, setAccounts] = React.useState<Account[]>([
//     { id: '1', name: 'Abdallah Mohamed', email: 'abdallah@example.com' },
//     { id: '2', name: 'Eslam Mohamed',    email: 'eslam@example.com' },
//     { id: '3', name: 'Yasser El Helw',   email: 'yasser@example.com' },
//   ]);

//   // مثال جلب من API (اختياري الآن)
//   React.useEffect(() => {
//     if (!API_BASE) return;
//     // (async () => {
//     //   const res = await fetch(`${API_BASE}/verification/accounts?search=${encodeURIComponent(query)}`, { cache: 'no-store' });
//     //   const json: Account[] = await res.json();
//     //   setAccounts(json);
//     // })();
//   }, [query]);

//   const filtered = React.useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return accounts;
//     return accounts.filter(
//       (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
//     );
//   }, [accounts, query]);

//   return (
//     <main className="min-h-screen bg-white" >
//       <div className="mx-auto px-4 py-6 pl-[80px]">

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
//           <section className="lg:col-span-9 space-y-6">
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               <UserPieStats
//                 data={pieData}
//                 percentage={piePercent}
//                 title="النِسب للتوثيق"
//                 sideLabel="إجمالي النِّسب"
//                 colors={['#D72229', '#28a745', '#facc15', '#3b82f6']}
//               />

//               <UserGrowthMultiStats
//                 chartData={lineChartData}
//                 series={lineSeries}
//                 xKey="month"
//                 sideItems={lineSideItems}
//                 title="المؤهّلون للتوثيق"
//                 sideLabel="عدد الحسابات"
//               />
//             </div>

//             {/* كروت CTA */}
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
//                 <p className="mb-4 text-[#9AA0A6]">
//                   اطلع على الحسابات التي تم قبول طلبات التوثيق الخاصة بها
//                 </p>
//                 <Link
//                   href="/verification/approved"
//                   className="inline-block rounded-full bg-[#D72229] px-8 py-3 text-white hover:opacity-90"
//                 >
//                   مشاهدة الحسابات الموثقة
//                 </Link>
//               </div>

//               <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
//                 <p className="mb-4 text-[#9AA0A6]">
//                   اطلع على الحسابات التي أرسلت طلب التوثيق
//                 </p>
//                 <Link
//                   href="/verification/requests"
//                   className="inline-block rounded-full bg-[#5C7CF4] px-8 py-3 text-white hover:opacity-90"
//                 >
//                   مشاهدة الحسابات التي أرسلت طلب
//                 </Link>
//               </div>
//             </div>
//           </section>

//           <aside className="lg:col-span-3 space-y-6">
//             {/* شريط البحث يمين */}
//             <div className="mb-4 flex justify-start" dir='rtl'>
//               <div className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3">
//                 <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#8989A2]/25">
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

//             {/* ✅ CustomChart - نسبة الرفض بسبب نقص المستندات */}
//             <div className="bg-[#F6F6F6] rounded-[40px] p-5">
//               <h3 className="mb-2 text-[#D72229] text-sm font-semibold">نسبة الرفض بسبب نقص المستندات</h3>
//               <CustomChart 
//                 apiUrl="" 
//                 staticData1={rejectionData} 
//                 staticData2={retentionData}
//                 tokenKey="token"
//                 apiLineName="نسبة الرفض"
//                 height={200}
//               />
//             </div>

//             <div className="rounded-[28px] bg-[#F6F6F6] p-6">
//               <p className="mb-4 text-[#9AA0A6]">
//                 اطلع على الحسابات المؤهلة للتوثيق لكنها لم ترسل طلب
//               </p>
//               <Link
//                 href="/verified/eligible-not-sent"
//                 className="block w-full rounded-full bg-[#D72229] px-8 py-3 text-center text-white hover:opacity-90"
//               >
//                 مشاهدة
//               </Link>
//             </div>
//           </aside>
//         </div>

//         {/* (اختياري) إظهار عدد نتائج البحث */}
//         {query && (
//           <div className="mt-6 rounded-2xl border bg-[#F9FAFB] p-3 text-sm text-gray-600">
//             نتائج البحث في الحسابات: {filtered.length}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }


'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import UserGrowthMultiStats from '../_components/UserGrowthMultiStats';
import CustomChart, { type StaticChartPoint } from '../_components/CustomChart';
import UserPieStats from '../_components/UserPieStats';

type Account = { id: string; name: string; email: string };

const API_BASE = 'http://bo-chat.space/vip/request'; 

export default function VerificationPage() {
  const pieData = [
    { name: 'موثّقون', value: 10800 },
    { name: 'موقّفون', value: 120 },
    { name: 'قيد المراجعة', value: 230 },
    { name: 'تم الرفض', value: 24 },
  ];
  const piePercent = '64%';

  const lineSeries = [
    { key: 'sent',     name: 'تم الإرسال',     color: '#3b82f6', strokeWidth: 2 },
    { key: 'approved', name: 'تم التوثيق',     color: '#22c55e', strokeWidth: 2 },
    { key: 'stopped',  name: 'موقّف',          color: '#ef4444', strokeWidth: 2 },
  ];
  const lineChartData = [
    { month: 'يناير',  sent: 9000,  approved: 4200, stopped:  60 },
    { month: 'فبراير', sent: 9800,  approved: 4600, stopped:  85 },
    { month: 'مارس',   sent: 10200, approved: 5000, stopped: 110 },
    { month: 'أبريل',  sent: 10800, approved: 5400, stopped: 100 },
    { month: 'مايو',   sent: 11000, approved: 5600, stopped:  95 },
    { month: 'يونيو',  sent: 10000, approved: 5200, stopped:  90 },
  ];
  const lineSideItems = [
    { label: 'موثّقون', value: 10800 },
    { label: 'طلبات قيد المراجعة', value: 3500 },
    { label: 'طلبات تم إرسالها', value: 8800 },
  ];

  // ✅ بيانات نسبة الرفض بسبب نقص المستندات (زي fakeData في MainPage)
  const rejectionData: StaticChartPoint[] = [
    { name: 'يناير', value: 30000, value2: 20000, value3: 60000 },
    { name: 'فبراير', value: 35000, value2: 25000, value3: 65000 },
    { name: 'مارس', value: 50000, value2: 30000, value3: 70000 },
    { name: 'أبريل', value: 55000, value2: 35000, value3: 75000 },
    { name: 'مايو', value: 70000, value2: 40000, value3: 80000 },
    { name: 'يونيو', value: 75000, value2: 45000, value3: 85000 },
  ];

  // ✅ بيانات إضافية (نفس fakeData)
  const retentionData: StaticChartPoint[] = [
    { name: 'يناير', value: 30000, value2: 20000, value3: 60000 },
    { name: 'فبراير', value: 35000, value2: 25000, value3: 65000 },
    { name: 'مارس', value: 50000, value2: 30000, value3: 70000 },
    { name: 'أبريل', value: 55000, value2: 35000, value3: 75000 },
    { name: 'مايو', value: 70000, value2: 40000, value3: 80000 },
    { name: 'يونيو', value: 75000, value2: 45000, value3: 85000 },
  ];

  // ---------- بحث
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
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [accounts, query]);

  return (
    <main className="min-h-screen bg-white" >
      <div className="mx-auto px-4 py-6 pl-[80px]">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <UserPieStats
                data={pieData}
                percentage={piePercent}
                title="النِسب للتوثيق"
                sideLabel="إجمالي النِّسب"
                colors={['#D72229', '#28a745', '#facc15', '#3b82f6']}
              />

              <UserGrowthMultiStats
                chartData={lineChartData}
                series={lineSeries}
                xKey="month"
                sideItems={lineSideItems}
                title="المؤهّلون للتوثيق"
                sideLabel="عدد الحسابات"
              />
            </div>

            {/* كروت CTA */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
                <p className="mb-4 text-[#9AA0A6]">
                  اطلع على الحسابات التي تم قبول طلبات التوثيق الخاصة بها
                </p>
                <Link
                  href="/verification/approved"
                  className="inline-block rounded-full bg-[#D72229] px-8 py-3 text-white hover:opacity-90"
                >
                  مشاهدة الحسابات الموثقة
                </Link>
              </div>

              <div className="rounded-[28px] bg-[#F6F6F6] p-6 text-center">
                <p className="mb-4 text-[#9AA0A6]">
                  اطلع على الحسابات التي أرسلت طلب التوثيق
                </p>
                <Link
                  href="/verification/requests"
                  className="inline-block rounded-full bg-[#5C7CF4] px-8 py-3 text-white hover:opacity-90"
                >
                  مشاهدة الحسابات التي أرسلت طلب
                </Link>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-3 space-y-6">
            {/* شريط البحث */}
            <div className="mb-4 flex justify-start" dir='rtl'>
              <div className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3">
                <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#8989A2]/25">
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

            {/* ✅ CustomChart - زي ما هو في MainPage بالضبط */}
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
                اطلع على الحسابات المؤهلة للتوثيق لكنها لم ترسل طلب
              </p>
              <Link
                href="/verified/eligible-not-sent"
                className="block w-full rounded-full bg-[#D72229] px-8 py-3 text-center text-white hover:opacity-90"
              >
                مشاهدة
              </Link>
            </div>
          </aside>
        </div>

        {/* (اختياري) إظهار عدد نتائج البحث */}
        {query && (
          <div className="mt-6 rounded-2xl border bg-[#F9FAFB] p-3 text-sm text-gray-600">
            نتائج البحث في الحسابات: {filtered.length}
          </div>
        )}
      </div>
    </main>
  );
}