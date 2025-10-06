/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback, useMemo } from "react";

const BASE = process.env.NEXT_PUBLIC_API_BASE
;
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

export function BannedCard() {
  const [items, setItems] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // حالة تحميل لكل مستخدم أثناء فك الحظر
  const [unbanningId, setUnbanningId] = useState<string | null>(null);

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

  const fetchBanned = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await safeFetchJSON(
        `${BASE}/dashboard/bannedUsers?admin=${encodeURIComponent(
          ADMIN_EMAIL
        )}`,
        {
          method: "GET",
          headers,
          mode: "cors",
        }
      );
      const list = normalizeList(data);
      const normalized: BannedUser[] = list.map((u: any) => ({
        id: u?.id || u?._id || u?.userid || "—",
        name: u?.name || u?.username || "—",
        email: u?.email || u?.useremail || "—",
        until: u?.until ?? u?.blockTill ?? u?.banUntil ?? "—",
        durationMs: u?.durationMs ?? u?.banDurationMs ?? 0,
      }));
      setItems(normalized);
    } catch (e: any) {
      setErr(e?.message || "Fetch failed");
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
        const candidates = [
         `${BASE}/unbanTill`,
          `${BASE}/unbanTill`,
        ];

        let lastErr: any = null;
        for (const url of candidates) {
          try {
            const data = await safeFetchJSON(url, {
              method: "POST",
              headers,
              body: JSON.stringify({
                userid: userId,
                adminemail: ADMIN_EMAIL,
              }),
              mode: "cors",
            });
            console.log("✅ Unban success:", data);

            // شيل الكارت من الواجهة بعد النجاح
            setItems((prev) => prev.filter((u) => u.id !== userId));
            setUnbanningId(null);
            return;
          } catch (err) {
            lastErr = err;
          }
        }
        throw lastErr || new Error("فشل فك الحظر عبر كل المسارات المحتملة");
      } catch (e) {
        console.error("❌ Unban error:", e);
        setUnbanningId(null);
      }
    },
    [headers]
  );

  return (
    <div dir="rtl">
      {loading && (
        <div className="rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600">
          جاري التحميل…
        </div>
      )}

      {err && (
        <div className="rounded-xl bg-red-50 p-3 text-center text-sm text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && items.length === 0 && (
        <div className="rounded-xl pt-[40px] text-center">
          <h1 className=" text-[30px] text-[#D72229]">لا توجد حسابات محظورة</h1>
          <p className="text-[#8989A2]">ابدأ الآن احظر أول حساب لتفعيل لوحة هذا الجزء</p> 
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((u) => (
          <div
            key={u.id}
            className="rounded-[30px]  bg-[#F6F6F6] p-4"
          >
            <h3 className="mb-[5px] text-center text-[#D12D2D]">
              معلومات الحساب
            </h3>
            <div className="text-xs text-gray-500">id: {u.id}</div>

            <div className="mb-2 flex items-center justify-between rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
              <h5>الاسم:</h5>
              <div className="text-[15px] font-semibold text-[#333]">
                {u.name}
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between overflow-hidden rounded-[18px] bg-[#E6E6E6] px-[20px] py-[15px]">
              <h5>الإيميل:</h5>
              <div className="rounded-xl px-4 text-gray-700">{u.email}</div>
            </div>

            <div className="mb-2 flex items-center justify-between overflow-hidden rounded-[18px] bg-[#D72229]/10 px-[20px] py-[15px]">
              <div className="text-xs text-right text-gray-500">مدة الحظر:</div>
              <div className="rounded-xl px-4 text-[#D12D2D]">
                {String(u.until)}
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
        ))}
      </div>
    </div>
  );
}
