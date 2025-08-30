/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";

const BASE = "https://bo-chat.space";
const ADMIN_ID = "6877d5497b04a3c83759f122";

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

  const fetchBanned = useCallback(async () => {
    setLoading(true);
    setErr(null);

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const candidates: Array<{ url: string; method: "GET" | "POST"; body?: any }> = [
      { url: `${BASE}/dashboard/bannedUsers?admin=${ADMIN_ID}`, method: "GET" },
    ];

    let lastErr: any = null;

    for (const c of candidates) {
      try {
        const data = await safeFetchJSON(c.url, {
          method: c.method,
          headers,
          ...(c.method === "POST" ? { body: JSON.stringify(c.body) } : {}),
          mode: "cors",
        });

        const list = normalizeList(data);
        console.log("✅ bannedUsers:", list);

        const normalized: BannedUser[] = list.map((u: any) => ({
          id: u?.id || u?._id || u?.userid || "—",
          name: u?.name || u?.username || "—",
          email: u?.email || u?.useremail || "—",
          until: u?.until ?? u?.blockTill ?? u?.banUntil ?? "—",
          durationMs: u?.durationMs ?? u?.banDurationMs ?? 0,
        }));

        setItems(normalized);
        setLoading(false);
        return;
      } catch (e) {
        lastErr = e;
      }
    }

    console.error("❌ bannedUsers error:", lastErr);
    setErr(lastErr instanceof Error ? lastErr.message : "Fetch failed");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBanned();
  }, [fetchBanned]);

  return (
    <div  dir="rtl">
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
        <div className="rounded-xl bg-[#EDEDED] p-3 text-center text-sm text-gray-600">
          لا يوجد مستخدمون محظورون.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {items.map((u) => (
          <div key={u.id} className="rounded-[30px] border border-gray-200  bg-[#F6F6F6] p-4">
            <h3 className="text-center mb-[5px] text-[#D12D2D]">معلومات الحساب</h3>
              <div className="text-xs text-gray-500">id: {u.id}</div>
            <div className="mb-2 flex items-center justify-between py-[15px] px-[20px] bg-[#E6E6E6] rounded-[18px]">
              <h5>الاسم:</h5>
              <div className="text-[15px] font-semibold text-[#333]">{u.name}</div>
            </div>

              <div className="mb-2 flex items-center justify-between py-[15px] px-[20px] bg-[#E6E6E6] rounded-[18px] overflow-hidden">
                <h5>الإيميل:</h5>
                <div className="rounded-xl px-4 text-gray-700">
                  {u.email}
                </div>
              </div>
              <div className="mb-2 flex items-center justify-between py-[15px] px-[20px] bg-[#D72229]/10 rounded-[18px] overflow-hidden">
                <div className="text-xs text-right text-gray-500">مدة الحظر:</div>
                <div className="rounded-xl  px-4 text-[#D12D2D]">
                  {String(u.until)}
                </div>
              </div>
            <div className="px-[50px]">
              <Button className="mt-[10px] !py-[22px] w-full rounded-[20px] bg-[#D72229] text-white hover:bg-[#be2525]">
                إلغاء الحظر
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
