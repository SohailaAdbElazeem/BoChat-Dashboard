/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE_HTTPS = "https://bo-chat.space";
const BASE_HTTP = "http://bo-chat.space";
const ADMIN_EMAIL = "bo-chat@gmail.com";

// Helpers
async function safeFetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const txt = await res.clone().text().catch(() => "");
  let data: any = {};
  try { data = txt ? JSON.parse(txt) : {}; } catch { /* non-JSON is fine */ }
  if (!res.ok) {
    const reason = data?.message || data?.error || `Request failed ${res.status}`;
    throw new Error(reason);
  }
  return data || txt || {};
}

export default function BanForm() {
  const [userId, setUserId] = React.useState("");
  const [name, setName] = React.useState("");
  const [durDays, setDurDays] = React.useState<number | "lock">(7);

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    "";

  const disabledCommon = !getToken() || !userId;

  const buildBanCandidates = (days: number) => [
    `${BASE_HTTPS}/banTill/${days}`,
    `${BASE_HTTPS}/banTill`,
    `${BASE_HTTP}/banTill/${days}`,
    `${BASE_HTTP}/banTill`,
  ];

  const submit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (!userId) throw new Error("من فضلك أدخل UserId");
      setLoading(true);

      const token = getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const body = {
        userid: userId,
        adminemail: ADMIN_EMAIL,
        name: name || undefined,
      };

      // لو اختار "قفل" يبقى API /pan
      if (durDays === "lock") {
        const candidates = [`${BASE_HTTP}/pan`, `${BASE_HTTPS}/pan`];
        let lastErr: any = null;
        for (const url of candidates) {
          try {
            const data = await safeFetchJSON(url, {
              method: "POST",
              headers,
              body: JSON.stringify(body),
              mode: "cors",
            });
            console.log("✅ Lock success:", data);
            setSuccessMsg("تم قفل الحساب بنجاح.");
            return;
          } catch (err) {
            lastErr = err;
          }
        }
        throw lastErr || new Error("فشل القفل عبر كل المسارات المحتملة");
      } else {
        // حظر بعدد أيام
        const candidates = buildBanCandidates(durDays);
        let lastErr: any = null;
        for (const url of candidates) {
          try {
            const data = await safeFetchJSON(url, {
              method: "POST",
              headers,
              body: JSON.stringify({ ...body, durationDays: durDays }),
              mode: "cors",
            });
            console.log("✅ Ban success:", data);
            setSuccessMsg(`تم حظر الحساب لمدة ${durDays} يوم${durDays > 1 ? "ًا" : ""} بنجاح.`);
            return;
          } catch (err) {
            lastErr = err;
          }
        }
        throw lastErr || new Error("فشل الحظر عبر كل المسارات المحتملة");
      }
    } catch (err) {
      console.error("❌ Ban/Lock error:", err);
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ أثناء التنفيذ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-[#F6F6F6] p-6 " dir="rtl">
      <h2 className="mb-4 text-center text-[18px] font-semibold text-[#D12D2D]">
        حظر حساب
      </h2>

      <div className="space-y-4">
        {errorMsg && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{successMsg}</div>
        )}

        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">
            اسم المستخدم 
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name: Abdo Mohamed"
            className="h-11 rounded-2xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">UserId</Label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="مثال: 6877d5497b04a3c83759f122"
            className="h-11 rounded-2xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
          />
        </div>

        <div className="flex-1">
          <div className="mb-2 text-right text-sm font-medium text-gray-600">مدة الحظر</div>
          <div className="flex flex-wrap gap-3">
            {[
              { d: 1, label: "يوم" },
              { d: 2, label: "يومين" },
              { d: 3, label: "ثلاثة أيام" },
              { d: 7, label: "أسبوع" },
              { d: 30, label: "شهر" },
            ].map(({ d, label }) => {
              const active = d === durDays;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurDays(d)}
                  className={[
                    "rounded-2xl px-6 py-3 text-sm transition-all",
                    active
                      ? "ring-1 ring-[#D12D2D] text-[#D12D2D] bg-white"
                      : "bg-[#EDEDED] text-gray-600",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setDurDays("lock")}
              className={[
                "rounded-2xl px-4 py-2 text-sm transition-all",
                durDays === "lock"
                  ? "ring-1 ring-[#D12D2D] text-[#D12D2D] bg-white"
                  : "bg-[#EDEDED] text-gray-600",
              ].join(" ")}
            >
              قفل
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            onClick={submit}
            disabled={disabledCommon || loading}
            className="mt-2 h-12 w-[250px] mx-auto rounded-2xl bg-[#D12D2D] text-white hover:bg-[#be2525]"
            title={getToken() ? "" : "يجب أن يكون هناك توكن في localStorage"}
            >
            حظر
          </Button>
        </div>
      </div>
    </div>
  );
}
