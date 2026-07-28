// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Button } from "@/components/ui/button";
// import { useEffect, useState, useCallback, useMemo } from "react";

// const BASE = process.env.NEXT_PUBLIC_API_BASE;
// const ADMIN_EMAIL = "bo-chat@gmail.com";

// type BannedUser = {
//   id: string;
//   name: string;
//   email: string;
//   until: number | string;
//   durationMs: number;
// };

// async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
//   const res = await fetch(input, init);
//   const txt = await res.clone().text().catch(() => "");
//   let data: any = {};
//   try { data = txt ? JSON.parse(txt) : {}; } catch {}
//   if (!res.ok) {
//     const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
//     throw new Error(reason);
//   }
//   return data || {};
// }

// const normalizeList = (data: any): any[] => {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.data)) return data.data;
//   if (Array.isArray(data?.users)) return data.users;
//   return [];
// };

// // 🧩 وظيفة لتقصير الإيميل لو طويل
// function shortenEmail(email: string, maxLen = 15): string {
//   if (!email) return "";
//   if (email.length <= maxLen) return email;
//   const [user, domain] = email.split("@");
//   if (!domain) return email.slice(0, maxLen) + "...";
//   // خلي أول 10 حروف فقط قبل الـ "@" والباقي النطاق
//   const visibleUser = user.slice(0, 10);
//   return `${visibleUser}...@${domain}`;
// }

// function normalizeUntilMs(until: number | string): number | null {
//   if (until == null) return null;
//   if (typeof until === "number") {
//     if (until > 1e10 && until < 1e13) return until; // ms
//     if (until > 1e9 && until < 1e10) return until * 1000; // sec
//     return until;
//   }
//   const parsed = Date.parse(until);
//   if (!Number.isNaN(parsed)) return parsed;
//   return null;
// }

// function formatRemainingDays(days: number): string {
//   if (days <= 0) return "انتهى الحظر";
//   if (days === 1) return "باقي يوم";
//   if (days === 2) return "باقي يومين";
//   if (days >= 3 && days <= 10) return `باقي ${days} أيام`;
//   return `باقي ${days} يومًا`;
// }

// function getRemainingDays(until: number | string): string {
//   const untilMs = normalizeUntilMs(until);
//   if (!untilMs) return "—";
//   const now = Date.now();
//   const remainingMs = untilMs - now;
//   const days = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
//   return formatRemainingDays(days);
// }

// async function copyToClipboard(text: string) {
//   try {
//     await navigator.clipboard.writeText(text);
//     return true;
//   } catch {
//     try {
//       const el = document.createElement("textarea");
//       el.value = text;
//       el.style.position = "fixed";
//       el.style.opacity = "0";
//       document.body.appendChild(el);
//       el.select();
//       document.execCommand("copy");
//       document.body.removeChild(el);
//       return true;
//     } catch {
//       return false;
//     }
//   }
// }

// export function BannedCard() {
//   const [items, setItems] = useState<BannedUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);
//   const [unbanningId, setUnbanningId] = useState<string | null>(null);
//   const [copiedKey, setCopiedKey] = useState<string | null>(null);

//   const token = useMemo(
//     () =>
//       localStorage.getItem("token") ||
//       localStorage.getItem("auth_token") ||
//       "",
//     []
//   );

//   const headers = useMemo(() => {
//     const h: Record<string, string> = { "Content-Type": "application/json" };
//     if (token) h.Authorization = `Bearer ${token}`;
//     return h;
//   }, [token]);

//   const fetchBanned = useCallback(async () => {
//     setLoading(true);
//     setErr(null);
//     try {
//       const data = await safeFetchJSON(
//         `${BASE}/dashboard/bannedUsers?admin=${encodeURIComponent(
//           ADMIN_EMAIL
//         )}`,
//         {
//           method: "GET",
//           headers,
//           mode: "cors",
//         }
//       );
//       const list = normalizeList(data);
//       const normalized: BannedUser[] = list.map((u: any) => ({
//         id: u?.id || u?._id || u?.userid || "—",
//         name: u?.name || u?.username || "—",
//         email: u?.email || u?.useremail || "—",
//         until: u?.until ?? u?.blockTill ?? u?.banUntil ?? "—",
//         durationMs: u?.durationMs ?? u?.banDurationMs ?? 0,
//       }));
//       setItems(normalized);
//     } catch (e: any) {
//       setErr(e?.message || "Fetch failed");
//     } finally {
//       setLoading(false);
//     }
//   }, [headers]);

//   useEffect(() => {
//     fetchBanned();
//   }, [fetchBanned]);

//   const handleUnban = useCallback(
//     async (userId: string) => {
//       try {
//         setUnbanningId(userId);
//         const candidates = [`${BASE}/unbanTill`, `${BASE}/unbanTill`];
//         let lastErr: any = null;
//         for (const url of candidates) {
//           try {
//             const data = await safeFetchJSON(url, {
//               method: "POST",
//               headers,
//               body: JSON.stringify({
//                 userid: userId,
//                 adminemail: ADMIN_EMAIL,
//               }),
//               mode: "cors",
//             });
//             console.log("✅ Unban success:", data);
//             setItems((prev) => prev.filter((u) => u.id !== userId));
//             setUnbanningId(null);
//             return;
//           } catch (err) {
//             lastErr = err;
//           }
//         }
//         throw lastErr || new Error("فشل فك الحظر عبر كل المسارات المحتملة");
//       } catch (e) {
//         console.error("❌ Unban error:", e);
//         setUnbanningId(null);
//       }
//     },
//     [headers]
//   );

//   const handleCopy = useCallback(async (key: string, text: string) => {
//     const ok = await copyToClipboard(text);
//     if (ok) {
//       setCopiedKey(key);
//       setTimeout(() => setCopiedKey(null), 1200);
//     }
//   }, []);

//   return (
//     <div dir="rtl">
//       {loading && (
//         <div className="rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600">
//           جاري التحميل…
//         </div>
//       )}

//       {err && (
//         <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       {!loading && !err && items.length === 0 && (
//         <div className="rounded-xl pt-[40px] text-center">
//           <h1 className=" text-[30px] text-[#D72229]">لا توجد حسابات محظورة</h1>
//           <p className="text-[#8989A2]">
//             ابدأ الآن احظر أول حساب لتفعيل لوحة هذا الجزء
//           </p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-4">
//         {items.map((u) => {
//           const copyKeyId = `id:${u.id}`;
//           const copyKeyEmail = `email:${u.id}`;
//           const remaining = getRemainingDays(u.until);
//           const shortEmail = shortenEmail(u.email);

//           return (
//             <div key={u.id} className="rounded-[30px] bg-[#F6F6F6] p-4">
//               <h3 className="mb-[5px] text-center text-[#D12D2D]">
//                 معلومات الحساب
//               </h3>

//               {/* ID */}
//                <div className="relative mb-2 mt-2 flex items-center justify-between rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
//                 <span>id: </span>
//                 <button
//                   type="button"
//                   onClick={() => handleCopy(copyKeyId, u.id)}
//                   className="hover:text-[#D12D2D] transition-colors cursor-pointer"
//                   title="انسخ id"
//                 >
//                   {u.id}
//                 </button>
//                 {copiedKey === copyKeyId && (
//                   <span className="absolute left-0  ml-2 rounded-full bg-green-100 px-3 py-[4px] text-[10px] text-green-700">
//                     تم النسخ
//                   </span>
//                 )}
//               </div>

//               {/* الاسم */}
//               <div className="mb-2 mt-2 flex items-center justify-between rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
//                 <h5>الاسم:</h5>
//                 <div className="text-[15px] font-semibold text-[#333]">
//                   {u.name}
//                 </div>
//               </div>

//               {/* الإيميل */}
//               <div className="relative mb-2 flex items-center justify-between overflow-hidden rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
//                 <h5>الإيميل:</h5>
//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => handleCopy(copyKeyEmail, u.email)}
//                     title={u.email}
//                     className="cursor-pointer rounded-lg px-2 py-1 text-sm text-gray-700  hover:text-[#D12D2D] transition-colors max-w-[180px] truncate"
//                   >
//                     {shortEmail}
//                   </button>
//                   {copiedKey === copyKeyEmail && (
//                     <span className="absolute left-0  ml-2 rounded-full bg-green-100 px-3 py-[4px] text-[10px] text-green-700">
//                       تم النسخ
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* مدة الحظر */}
//               <div className="mb-2 flex items-center justify-between overflow-hidden rounded-[18px] bg-[#D72229]/10 px-[20px] py-[15px]">
//                 <div className="text-xs text-right text-gray-500">مدة الحظر:</div>
//                 <div className="text-right">
//                   <div className="rounded-xl px-0 text-[#D12D2D] font-semibold">
//                     {remaining}
//                   </div>
//                 </div>
//               </div>

//               <div className="px-[50px]">
//                 <Button
//                   onClick={() => handleUnban(u.id)}
//                   disabled={unbanningId === u.id}
//                   className="mt-[10px] !py-[25px] w-full rounded-[20px] bg-[#D72229] text-white text-[18px] hover:bg-[#be2525] disabled:opacity-60"
//                 >
//                   {unbanningId === u.id ? "جارٍ فك الحظر…" : "إلغاء الحظر"}
//                 </Button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useMemo } from "react";

const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
const ADMIN_EMAIL = "bo-chat@gmail.com";

type BannedUser = {
  id: string;
  name: string;
  email: string;
  until: number | string;
  durationMs: number;
};

async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => "");
  let data: any = {};
  try { data = txt ? JSON.parse(txt) : {}; } catch {}
  if (!res.ok) {
    const reason = data?.message || data?.error || `Fetch failed ${res.status}`;
    throw new Error(reason);
  }
  return data || {};
}

const normalizeList = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.users)) return data.users;
  return [];
};

// 🧩 وظيفة لتقصير الإيميل لو طويل
function shortenEmail(email: string, maxLen = 15): string {
  if (!email) return "";
  if (email.length <= maxLen) return email;
  const [user, domain] = email.split("@");
  if (!domain) return email.slice(0, maxLen) + "...";
  const visibleUser = user.slice(0, 10);
  return `${visibleUser}...@${domain}`;
}

function normalizeUntilMs(until: number | string): number | null {
  if (until == null) return null;
  if (typeof until === "number") {
    if (until > 1e10 && until < 1e13) return until; // ms
    if (until > 1e9 && until < 1e10) return until * 1000; // sec
    return until;
  }
  const parsed = Date.parse(until);
  if (!Number.isNaN(parsed)) return parsed;
  return null;
}

function formatRemainingDays(days: number): string {
  if (days <= 0) return "انتهى الحظر";
  if (days === 1) return "باقي يوم";
  if (days === 2) return "باقي يومين";
  if (days >= 3 && days <= 10) return `باقي ${days} أيام`;
  return `باقي ${days} يومًا`;
}

function getRemainingDays(until: number | string): string {
  const untilMs = normalizeUntilMs(until);
  if (!untilMs) return "—";
  const now = Date.now();
  const remainingMs = untilMs - now;
  const days = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  return formatRemainingDays(days);
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}

export function BannedCard() {
  const [items, setItems] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [unbanningId, setUnbanningId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const token = useMemo(
    () =>
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      "",
    []
  );

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  // ✅ جلب المحظورين من API
  const fetchBanned = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      // ✅ الرابط الصحيح مع admin parameter
      const url = `${BASE}/dashboard/users/bannedUsers?admin=${encodeURIComponent(
        ADMIN_EMAIL
      )}`;
      
      console.log('📡 Fetching banned users from:', url);
      
      const data = await safeFetchJSON(url, {
        method: "GET",
        headers,
        mode: "cors",
      });
      
      console.log('📦 Banned users response:', data);
      
      // ✅ استخراج الـ admin من الـ Response
      const adminId = data?.admin;
      const list = normalizeList(data);
      
      const normalized: BannedUser[] = list.map((u: any) => ({
        id: u?.id || u?._id || u?.userid || "—",
        name: u?.name || u?.username || "—",
        email: u?.email || u?.useremail || "—",
        until: u?.until ?? u?.blockTill ?? u?.banUntil ?? u?.expiresAt ?? "—",
        durationMs: u?.durationMs ?? u?.banDurationMs ?? u?.duration ?? 0,
      }));
      
      setItems(normalized);
    } catch (e: any) {
      console.error('❌ Fetch banned error:', e);
      setErr(e?.message || "فشل جلب الحسابات المحظورة");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchBanned();
  }, [fetchBanned]);

  // ✅ فك الحظر
  const handleUnban = useCallback(
    async (userId: string) => {
      try {
        setUnbanningId(userId);
        
        // ✅ الرابط الصحيح لفك الحظر
        const url = `${BASE}/dashboard/users/unban`;
        
        console.log('📡 Unbanning user:', userId);
        
        const data = await safeFetchJSON(url, {
          method: "POST",
          headers,
          body: JSON.stringify({
            userid: userId,
            adminemail: ADMIN_EMAIL,
          }),
          mode: "cors",
        });
        
        console.log('✅ Unban success:', data);
        
        // ✅ إزالة المستخدم من القائمة
        setItems((prev) => prev.filter((u) => u.id !== userId));
        setUnbanningId(null);
      } catch (e: any) {
        console.error('❌ Unban error:', e);
        setErr(e?.message || "فشل فك الحظر");
        setUnbanningId(null);
      }
    },
    [headers]
  );

  const handleCopy = useCallback(async (key: string, text: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1200);
    }
  }, []);

  return (
    <div dir="rtl">
      {loading && (
        <div className="rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600">
          جاري التحميل…
        </div>
      )}

      {err && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
          ⚠️ {err}
        </div>
      )}

      {!loading && !err && items.length === 0 && (
        <div className="rounded-xl pt-[40px] text-center">
          <h1 className="text-[30px] text-[#D72229]">لا توجد حسابات محظورة</h1>
          <p className="text-[#8989A2]">
            ابدأ الآن احظر أول حساب لتفعيل لوحة هذا الجزء
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((u) => {
          const copyKeyId = `id:${u.id}`;
          const copyKeyEmail = `email:${u.id}`;
          const remaining = getRemainingDays(u.until);
          const shortEmail = shortenEmail(u.email);

          return (
            <div key={u.id} className="rounded-[30px] bg-[#F6F6F6] p-4">
              <h3 className="mb-[5px] text-center text-[#D12D2D]">
                معلومات الحساب
              </h3>

              {/* ID */}
              <div className="relative mb-2 mt-2 flex items-center justify-between rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
                <span>id: </span>
                <button
                  type="button"
                  onClick={() => handleCopy(copyKeyId, u.id)}
                  className="hover:text-[#D12D2D] transition-colors cursor-pointer"
                  title="انسخ id"
                >
                  {u.id}
                </button>
                {copiedKey === copyKeyId && (
                  <span className="absolute left-0 ml-2 rounded-full bg-green-100 px-3 py-[4px] text-[10px] text-green-700">
                    تم النسخ
                  </span>
                )}
              </div>

              {/* الاسم */}
              <div className="mb-2 mt-2 flex items-center justify-between rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
                <h5>الاسم:</h5>
                <div className="text-[15px] font-semibold text-[#333]">
                  {u.name}
                </div>
              </div>

              {/* الإيميل */}
              <div className="relative mb-2 flex items-center justify-between overflow-hidden rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
                <h5>الإيميل:</h5>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(copyKeyEmail, u.email)}
                    title={u.email}
                    className="cursor-pointer rounded-lg px-2 py-1 text-sm text-gray-700 hover:text-[#D12D2D] transition-colors max-w-[180px] truncate"
                  >
                    {shortEmail}
                  </button>
                  {copiedKey === copyKeyEmail && (
                    <span className="absolute left-0 ml-2 rounded-full bg-green-100 px-3 py-[4px] text-[10px] text-green-700">
                      تم النسخ
                    </span>
                  )}
                </div>
              </div>

              {/* مدة الحظر */}
              <div className="mb-2 flex items-center justify-between overflow-hidden rounded-[18px] bg-[#D72229]/10 px-[20px] py-[15px]">
                <div className="text-xs text-right text-gray-500">مدة الحظر:</div>
                <div className="text-right">
                  <div className="rounded-xl px-0 text-[#D12D2D] font-semibold">
                    {remaining}
                  </div>
                </div>
              </div>

              <div className="px-[50px]">
                <Button
                  onClick={() => handleUnban(u.id)}
                  disabled={unbanningId === u.id}
                  className="mt-[10px] !py-[25px] w-full rounded-[20px] bg-[#D72229] text-white text-[18px] hover:bg-[#be2525] disabled:opacity-60"
                >
                  {unbanningId === u.id ? "جارٍ فك الحظر…" : "إلغاء الحظر"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}