/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE_HTTPS = "https://bo-chat.space";
const ADMIN_EMAIL = "bo-chat@gmail.com";

export default function BanForm() {
    const [userId, setUserId] = React.useState("");   
    const [durDays, setDurDays] = React.useState(7);
    const [name, setName] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

    const getToken = () =>
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token") ||
        "";
    const buildCandidates = (days: number) => [
        `${BASE_HTTPS}/banTill/${days}`,
        `${BASE_HTTPS}/banTill`,
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
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const body = {
        userid: userId,
        adminemail: ADMIN_EMAIL,
      };

      const candidates = buildCandidates(durDays);

      let lastErr: any = null;
      for (const url of candidates) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            mode: "cors",
          });

          const text = await res.clone().text().catch(() => "");
          let data: any = {};
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            // مش JSON — عادي
          }

          if (!res.ok) {
            const reason =
              data?.message ||
              data?.error ||
              `Request failed ${res.status} (${url})`;
            throw new Error(reason);
          }
          console.log("✅ Ban success:", data);
          setSuccessMsg("تم حظر الحساب بنجاح.");
          return;
        } catch (err) {
          lastErr = err;
        }
      }

      throw lastErr || new Error("فشل الطلب لكل المسارات المحتملة");
    } catch (err) {
      console.error("❌ Ban error:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "حدث خطأ أثناء تنفيذ الحظر"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-[#F6F6F6] p-6 shadow-sm" dir="rtl">
      <h2 className="mb-4 text-center text-[18px] font-semibold text-[#D12D2D]">
        حظر حساب
      </h2>

      <div className="space-y-4">
        {errorMsg && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {successMsg}
          </div>
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
          <Label className="mb-1 block text-right text-sm text-gray-600">
            UserId
          </Label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="مثال: 6877d5497b04a3c83759f122"
            className="h-11 rounded-2xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
          />
        </div>

        <div className="flex-1">
          <div className="mb-2 text-right text-sm font-medium text-gray-600">
            مدة الحظر
          </div>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 7].map((d) => {
              const active = d === durDays;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurDays(d)}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm transition-all",
                    active
                      ? "ring-1 ring-[#D12D2D] text-[#D12D2D] bg-white"
                      : "bg-[#EDEDED] text-gray-600",
                  ].join(" ")}
                >
                  {d === 1
                    ? "يوم"
                    : d === 2
                    ? "يومين"
                    : d === 3
                    ? "ثلاثة أيام"
                    : "أسبوع"}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={submit}
          disabled={getToken() === "" || loading}
          className="mt-2 h-12 w-full rounded-2xl bg-[#D12D2D] text-white hover:bg-[#be2525]"
          title={getToken() ? "" : "يجب أن يكون هناك توكن في localStorage"}
        >
          {loading ? "جارٍ الحظر…" : "حظر حساب"}
        </Button>
      </div>
    </div>
  );
}
