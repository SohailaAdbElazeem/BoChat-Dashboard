// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import FilterBar, { type Filters } from "../_components/FilterBar";
// import RegistrationTable from "./_components/RegistrationTable";
// import { type RegistrationRow } from "../_components/LastLogins";

// const norm = (v: unknown) =>
//   String(v ?? "")
//     .toLowerCase()
//     .replace(/[\u064B-\u0652\u0640]/g, "")
//     .replace(/\s+/g, " ")
//     .trim()
//     .normalize("NFKD");
//   const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("auth_token") ||
//         "";
// function applyFilters(rows: RegistrationRow[], f: Filters) {
//   const q = norm(f.query);
//   return rows.filter((r) => {
//     if (f.type && r.type !== f.type) return false;
//     if (f.status && r.status !== f.status) return false;
//     if (f.country && r.country !== f.country) return false;
//     if (f.governorate && r.governorate !== f.governorate) return false;
//     if (f.gender && r.gender !== f.gender) return false;
//     if (f.role && r.role !== f.role) return false;

//     if (!q) return true;
//     const hay = norm(
//       [
//         r.userName,
//         r.emailOrPhone,
//         r.id,
//         r.type,
//         r.status,
//         r.country,
//         r.governorate,
//         r.gender,
//         r.role,
//       ].join(" ")
//     );
//     return hay.includes(q);
//   });
// }

// async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
//   const res = await fetch(input, init);
//   const txt = await res.clone().text().catch(() => "");
//   let data: any = {};
//   try {
//     data = txt ? JSON.parse(txt) : {};
//   } catch {
//   }
//   if (!res.ok) {
//     const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
//     throw new Error(reason);
//   }
//   return data ?? {};
// }

// const fromProvider = (p?: string): RegistrationRow["type"] => {
//   const s = (p || "").toLowerCase();
//   if (s.includes("google")) return "جوجل";
//   if (s.includes("facebook")) return "فيسبوك";
//   return "انشاء حساب";
// };

// function mapUserToRow(u: any, i: number): RegistrationRow {
//   const status: RegistrationRow["status"] = u?.active ? "نشط" : "غير نشط";
//   const gender: RegistrationRow["gender"] =
//     u?.gender === 0 ? "ذكر" : u?.gender === 1 ? "أنثى" : "";

//   return {
//     no: u?._id,
//     postImages: null,
//     comments: null,
//     likes: null,
//     publishedAgo: null,
//     avatar: u?.img || "/avatar-placeholder.png",
//     views: null,
//     postType: null,

//     governorate: u?.city || "",
//     gender,
//     role: u?.case || "مستخدم",
//     country: u?.country || "",

//     id: u?._id || "—",
//     index: i + 1,
//     avatarUrl: u?.img || "/avatar-placeholder.png",
//     userName: u?.username || u?.name || "—",
//     // ما نعرضش useremail عشان هو hash — هنظهر الموبايل لو موجود
//     emailOrPhone: (u?.phonenumber && String(u.phonenumber).trim()) || "—",
//     type: fromProvider(u?.provider),
//     birthDate: String(u?.dateofbirth || "—"),
//     status,
//   };
// }

// export default function UsersPage() {
//   const [rows, setRows] = useState<RegistrationRow[]>([]);
//   const [filters, setFilters] = useState<Filters>({ query: "" });
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
//   const didRun = useRef(false);

//   const filteredRows = useMemo(
//     () => applyFilters(rows, filters),
//     [rows, filters]
//   );

//   useEffect(() => {
//       fetch("https://bo-chat.space/dashboard/users",{
//         method: "GET",
//         headers:{
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         }
//       }).then(res=> res.json())


//     if (didRun.current) return;
//     didRun.current = true;

//     (async () => {
//       setLoading(true);
//       setErr(null);

//       const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("auth_token") ||
//         "";

//       if (!token) {
//         setErr("لا يوجد توكن في المتصفح.");
//         setLoading(false);
//         return;
//       }

//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       };

//       const endpoints = [
//         "https://bo-chat.space/dashboard/users",
//         "http://bo-chat.space/dashboard/users",
//       ];
//       try {
//         let data: any = null;
//         let lastErr: unknown = null;
//         for (const url of endpoints) {
//           try {
//             data = await safeFetchJSON(url, {
//               method: "GET",
//               headers,
//               mode: "cors",
//             });
//             break;
//           } catch (e) {
//             lastErr = e;
//           }
//         }
//         if (!data && lastErr) throw lastErr;

//         const list: any[] = Array.isArray(data?.response)
//           ? data.response
//           : Array.isArray(data?.data)
//           ? data.data
//           : Array.isArray(data?.users)
//           ? data.users
//           : Array.isArray(data)
//           ? data
//           : [];

//         const mapped = list.map(mapUserToRow);

//         setRows(mapped);
//       } catch (e: any) {
//         setErr(e?.message || "تعذر جلب المستخدمين");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <main className="p-4" dir="rtl">
//       <FilterBar rows={rows} filters={filters} onChange={setFilters} />

//       {loading && (
//         <div className="mt-3 rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600">
//           جاري التحميل…
//         </div>
//       )}
//       {err && (
//         <div className="mt-3 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       <div className="mt-4">
//         <RegistrationTable rows={filteredRows} title="المستخدمون" />
//       </div>
//     </main>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FilterBar, { type Filters } from "../_components/FilterBar";
import RegistrationTable from "./_components/RegistrationTable";
import { type RegistrationRow } from "../_components/LastLogins";

const norm = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFKD");

function applyFilters(rows: RegistrationRow[], f: Filters) {
  const q = norm(f.query);
  return rows.filter((r) => {
    if (f.type && r.type !== f.type) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.country && r.country !== f.country) return false;
    if (f.governorate && r.governorate !== f.governorate) return false;
    if (f.gender && r.gender !== f.gender) return false;
    if (f.role && r.role !== f.role) return false;

    if (!q) return true;
    const hay = norm(
      [
        r.userName,
        r.emailOrPhone,
        r.id,
        r.type,
        r.status,
        r.country,
        r.governorate,
        r.gender,
        r.role,
      ].join(" ")
    );
    return hay.includes(q);
  });
}

async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => "");
  let data: any = {};
  try {
    data = txt ? JSON.parse(txt) : {};
  } catch {
    // ignore
  }
  if (!res.ok) {
    const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
    throw new Error(reason);
  }
  return data ?? {};
}

const fromProvider = (p?: string): RegistrationRow["type"] => {
  const s = (p || "").toLowerCase();
  if (s.includes("google")) return "جوجل";
  if (s.includes("facebook")) return "فيسبوك";
  return "انشاء حساب";
};

function mapUserToRow(u: any, i: number): RegistrationRow {
  const status: RegistrationRow["status"] = u?.active ? "نشط" : "غير نشط";
  const gender: RegistrationRow["gender"] =
    u?.gender === 0 ? "ذكر" : u?.gender === 1 ? "أنثى" : "";

  return {
    no: u?._id,
    postImages: null,
    comments: null,
    likes: null,
    publishedAgo: null,
    avatar: u?.img || "/avatar-placeholder.png",
    views: null,
    postType: null,
    governorate: u?.city || "",
    gender,
    role: u?.case || "مستخدم",
    country: u?.country || "",
    id: u?._id || "—",
    index: i + 1,
    avatarUrl: u?.img || "/avatar-placeholder.png",
    userName: u?.username || u?.name || "—",
    emailOrPhone: (u?.phonenumber && String(u.phonenumber).trim()) || "—",
    type: fromProvider(u?.provider),
    birthDate: String(u?.dateofbirth || "—"),
    status,
  };
}

export default function UsersPage() {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [filters, setFilters] = useState<Filters>({ query: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const didRun = useRef(false);

  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const filteredRows = useMemo(
    () => applyFilters(rows, filters),
    [rows, filters]
  );

  // ✅ دالة جلب المستخدمين مع Pagination
  const fetchUsers = async (pageNum: number, limitNum: number) => {
    setLoading(true);
    setErr(null);

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      "";

    if (!token) {
      setErr("لا يوجد توكن في المتصفح.");
      setLoading(false);
      return;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // ✅ استخدم الرابط مع الـ Params
    const url = `https://bo-chat.space/dashboard/users/all?page=${pageNum}&limit=${limitNum}`;

    try {
      const data = await safeFetchJSON(url, {
        method: "GET",
        headers,
        mode: "cors",
      });

      // استخراج البيانات حسب شكل الـ Response
      let list: any[] = [];
      let total = 0;
      let pages = 0;

      if (data?.data?.users) {
        list = data.data.users;
        total = data.data.total || data.total || 0;
        pages = data.data.pages || data.pages || 0;
      } else if (data?.users) {
        list = data.users;
        total = data.total || 0;
        pages = data.pages || 0;
      } else if (Array.isArray(data?.response)) {
        list = data.response;
        total = data.total || data.response.length;
        pages = data.pages || 1;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
        total = data.total || data.data.length;
        pages = data.pages || 1;
      } else if (Array.isArray(data)) {
        list = data;
        total = data.length;
        pages = 1;
      }

      const mapped = list.map((user, index) => 
        mapUserToRow(user, (pageNum - 1) * limitNum + index + 1)
      );

      setRows(mapped);
      setTotalUsers(total);
      setTotalPages(pages || Math.ceil(total / limitNum));
      
    } catch (e: any) {
      setErr(e?.message || "تعذر جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  // ✅ جلب البيانات عند التحميل أو تغيير الصفحة
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    fetchUsers(page, limit);
  }, [page, limit]);

  // ✅ دوال التنقل بين الصفحات
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  // ✅ تغيير عدد العناصر في الصفحة
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // ارجع لأول صفحة
  };

  return (
    <main className="p-4" dir="rtl">
      <FilterBar rows={rows} filters={filters} onChange={setFilters} />

      {loading && (
        <div className="mt-3 rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600">
          جاري التحميل…
        </div>
      )}
      {err && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="mt-4">
        <RegistrationTable rows={filteredRows} title="المستخدمون" />
      </div>

      {/* ✅ Pagination Controls */}
      {!loading && rows.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          {/* معلومات الصفحة */}
          <div className="text-sm text-gray-600">
            عرض {(page - 1) * limit + 1} - {Math.min(page * limit, totalUsers)} من {totalUsers} مستخدم
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center gap-2">
            {/* زر الصفحة السابقة */}
            <button
              onClick={goToPrevPage}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              السابق
            </button>

            {/* أرقام الصفحات */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 rounded border transition-colors ${
                      page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* زر الصفحة التالية */}
            <button
              onClick={goToNextPage}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              التالي
            </button>
          </div>

          {/* تحديد عدد العناصر في الصفحة */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">عرض:</label>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </main>
  );
}