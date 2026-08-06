// // File: app/accounts/page.tsx
// "use client";

// import * as React from "react";
// import CustomChart from "@/app/_components/CustomChart";
// import AddAccountCard from "./_components/AddAccountCard";
// import SearchBar from "@/app/_components/SearchBar";
// import AccountCard, { Admin } from "./_components/AccoundCard";

// const USER_ID = "6877d5497b04a3c83759f122";

// // GET admins
// const ADMINS_URL = `http://bo-chat.space/dashboard/admins${USER_ID}`;

// // DELETE admin: ثابت + userid في الـ body
// const DEL_ADMIN_URL = `http://bo-chat.space/dashboard/delAdmin${USER_ID}`;

// export default function AccountsPage() {
//   const [admins, setAdmins] = React.useState<Admin[]>([]);
//   const [filtered, setFiltered] = React.useState<Admin[]>([]);
//   const [query, setQuery] = React.useState("");
//   const [loading, setLoading] = React.useState(false);

//   const fetchAdmins = React.useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token in localStorage");

//       const res = await fetch(ADMINS_URL, {
//         method: "GET",
//         cache: "no-store",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const json = await res.json();
//       const list: Admin[] = Array.isArray(json) ? json : json?.data ?? [];
//       setAdmins(list);
//       setFiltered(list);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   React.useEffect(() => {
//     fetchAdmins();
//   }, [fetchAdmins]);

//   // فلترة بالاسم أو الـ userid
//   React.useEffect(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return setFiltered(admins);
//     setFiltered(
//       admins.filter(
//         (a) =>
//           a.username?.toLowerCase().includes(q) ||
//           a.userid?.toLowerCase().includes(q)
//       )
//     );
//   }, [query, admins]);

//   const handleDelete = async (userid: string) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token in localStorage");

//       const res = await fetch(DEL_ADMIN_URL, {
//         method: "POST", // حسب وصفك
//         cache: "no-store",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userid }),
//       });

//       if (!res.ok) {
//         const msg = await res.text().catch(() => "");
//         throw new Error(`HTTP ${res.status} ${msg}`);
//       }

//       // نجاح: شيل الأدمن من الواجهة
//       setAdmins((prev) => prev.filter((a) => a.userid !== userid));
//       setFiltered((prev) => prev.filter((a) => a.userid !== userid));
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="p-6">
//       <div className="mx-auto pl-[60px] grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
//         <section className="xl:col-span-4 md:col-span-1">
//           {loading && !filtered.length ? (
//             <div className="text-sm text-muted-foreground">جارٍ التحميل…</div>
//           ) : filtered.length === 0 ? (
//             <div className="text-sm text-muted-foreground">لا توجد نتائج.</div>
//           ) : (
//             <div className="grid grid-cols-1 gap-5">
//               {filtered.map((admin) => (
//                 <AccountCard
//                   key={admin._id}
//                   admin={admin}
//                   onDelete={handleDelete}
//                   loading={loading}
//                 />
//               ))}
//             </div>
//           )}
//         </section>

//         <section className="xl:col-span-5 md:col-span-1">
//           <AddAccountCard
//             onAdded={({ userid, rules }) => {
//               // إضافة متفائلة
//               const optimistic: Admin = {
//                 _id: crypto.randomUUID(),
//                 useremail: "—",
//                 username: "—",
//                 userid,
//                 rules: rules ?? [],
//               };
//               setAdmins((prev) => [optimistic, ...prev]);
//               setFiltered((prev) => [optimistic, ...prev]);
//             }}
//           />
//         </section>

//         <aside className="xl:col-span-3 hidden xl:block">
//           <SearchBar
//             value={query}
//             onValueChange={setQuery}
//             onSubmit={(val) => setQuery(val)}
//             placeholder="اكتب ما تبحث عنه"
//             dir="rtl"
//             className="mb-2"
//           />
//           <CustomChart apiUrl={""} staticData1={[]} staticData2={[]} />

//         </aside>
//       </div>
//     </main>
//   );
// }



// File: app/accounts/page.tsx
"use client";

import * as React from "react";
import CustomChart from "@/app/_components/CustomChart";
import AddAccountCard from "./_components/AddAccountCard";
import SearchBar from "@/app/_components/SearchBar";
import AccountCard, { Admin } from "./_components/AccoundCard";

// GET admins - corrected URL
const ADMINS_URL = `https://bo-chat.space/dashboard/admins/All`;

// DELETE admin
const DEL_ADMIN_URL = `https://bo-chat.space/dashboard/delAdmin`;

export default function AccountsPage() {
  const [admins, setAdmins] = React.useState<Admin[]>([]);
  const [filtered, setFiltered] = React.useState<Admin[]>([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // ===== بيانات الرسوم البيانية =====
  
  // 1. بيانات نسبة التفاعل الشهري (بيانات ثابتة للعرض)
  const monthlyInteractionData = [
    { name: "يناير", value: 65 },
    { name: "فبراير", value: 72 },
    { name: "مارس", value: 58 },
    { name: "أبريل", value: 80 },
    { name: "مايو", value: 85 },
    { name: "يونيو", value: 90 },
    { name: "يوليو", value: 78 },
    { name: "أغسطس", value: 88 },
  ];

  // 2. بيانات معدل الاحتفاظ بالمستخدمين
  const retentionData = [
    { name: "الأسبوع 1", value: 95 },
    { name: "الأسبوع 2", value: 82 },
    { name: "الأسبوع 3", value: 75 },
    { name: "الأسبوع 4", value: 68 },
    { name: "الشهر 2", value: 55 },
    { name: "الشهر 3", value: 45 },
  ];

  // 3. بيانات إكمال الملفات الشخصية
  const profileCompletionData = [
    { name: "الصورة", value: 85 },
    { name: "السيرة", value: 70 },
    { name: "المهارات", value: 60 },
    { name: "التعليم", value: 50 },
    { name: "الخبرات", value: 40 },
  ];

  const fetchAdmins = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userid");
      
      if (!token) throw new Error("No token in localStorage");
      if (!userId) throw new Error("No userId in localStorage");

      const url = `${ADMINS_URL}?adminid=${userId}`;
      
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      const list: Admin[] = json.response || [];
      setAdmins(list);
      setFiltered(list);
      
      console.log("Fetched admins:", list);
    } catch (e) {
      console.error("Fetch error:", e);
      setAdmins([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // فلترة بالاسم أو الـ userid
  React.useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered(admins);
    setFiltered(
      admins.filter(
        (a) =>
          a.username?.toLowerCase().includes(q) ||
          a.userid?.toLowerCase().includes(q)
      )
    );
  }, [query, admins]);

  const handleDelete = async (userid: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userid");
      
      if (!token) throw new Error("No token in localStorage");
      if (!userId) throw new Error("No userId in localStorage");

      const url = `${DEL_ADMIN_URL}?adminid=${userId}`;
      
      const res = await fetch(url, {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${msg}`);
      }

      setAdmins((prev) => prev.filter((a) => a.userid !== userid));
      setFiltered((prev) => prev.filter((a) => a.userid !== userid));
    } catch (e) {
      console.error("Delete error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <div className="mx-auto pl-[60px] grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
        {/* العمود الأيسر - قائمة الحسابات */}
        <section className="xl:col-span-4 md:col-span-1">
          {loading && !filtered.length ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div 
                className="text-center animate-pulse"
                style={{
                  width: "287px",
                  height: "49px",
                  fontFamily: "Cairo",
                  fontWeight: 500,
                  fontSize: "30px",
                  lineHeight: "52px",
                  textAlign: "center",
                  color: "#D72229",
                  margin: "0 auto"
                }}
              >
                جارٍ التحميل...
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <div 
                className="text-center"
                style={{
                  width: "287px",
                  height: "49px",
                  fontFamily: "Cairo",
                  fontWeight: 500,
                  fontSize: "30px",
                  lineHeight: "52px",
                  textAlign: "center",
                  color: "#D72229",
                  margin: "0 auto"
                }}
              >
                لا توجد حسابات مضافة
              </div>
              <div 
                className="text-center"
                style={{
                  width: "423px",
                  height: "49px",
                  fontFamily: "Cairo",
                  fontWeight: 500,
                  fontSize: "21px",
                  lineHeight: "52px",
                  textAlign: "center",
                  color: "#8989A2",
                  margin: "0 auto"
                }}
              >
                ابدأ الآن أضف أول حساب لتفعيل لوحة التحكم
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filtered.map((admin) => (
                <AccountCard
                  key={admin._id}
                  admin={admin}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </section>

        {/* العمود الأوسط - إضافة حساب */}
        <section className="xl:col-span-5 md:col-span-1">
          <AddAccountCard
            onAdded={({ userid, rules }) => {
              const optimistic: Admin = {
                _id: crypto.randomUUID(),
                useremail: "—",
                username: "—",
                userid,
                rules: rules ?? [],
              };
              setAdmins((prev) => [optimistic, ...prev]);
              setFiltered((prev) => [optimistic, ...prev]);
            }}
          />
        </section>

        {/* العمود الأيمن - الرسوم البيانية */}
        <aside className="xl:col-span-3 hidden xl:block space-y-4">
          <SearchBar
            value={query}
            onValueChange={setQuery}
            onSubmit={(val) => setQuery(val)}
            placeholder="اكتب ما تبحث عنه"
            dir="rtl"
            className="mb-2"
          />
          
          {/* 1. نسبة التفاعل الشهري - رسم خطي */}
          <CustomChart
            staticData1={monthlyInteractionData}
            staticData2={[]}
            config={{
              type: 'line',
              title: 'نسبة التفاعل الشهري',
              color: '#7485FF',
              dataKey: 'value',
              showPercentage: true,
              showLegend: false,
              height: 200,
            }}
          />

          {/* 2. معدل الاحتفاظ بالمستخدمين - رسم مساحي */}
          <CustomChart
            staticData1={retentionData}
            staticData2={[]}
            config={{
              type: 'area',
              title: 'معدل الاحتفاظ بالمستخدمين',
              color: '#10B981',
              dataKey: 'value',
              showPercentage: true,
              showLegend: false,
              height: 200,
            }}
          />

          {/* 3. إكمال الملفات الشخصية - رسم دائري */}
          <CustomChart
            staticData1={profileCompletionData}
            staticData2={[]}
            config={{
              type: 'pie',
              title: 'إكمال الملفات الشخصية',
              colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'],
              dataKey: 'value',
              showPercentage: true,
              showLegend: true,
              height: 250,
            }}
          />
        </aside>
      </div>
    </main>
  );
}