/* eslint-disable @typescript-eslint/no-explicit-any */

// File: app/accounts/_components/AddAccountCard.tsx
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// File: app/accounts/types.ts
export type Account = {
id: string;
email: string;
name: string;
active: boolean;
};


export type AddAdminPayload = {
userid: string;
rules: string[];
};


// File: app/accounts/_lib/roles.ts
export const ROLE_LABEL_TO_KEY: Record<string, string> = {
"حذف الحسابات": "delete",
"الإبلاغات": "report",
"إضافة الحسابات": "add",
"نشر النصائح": "publish",
"محتوى المحظور": "blockedContent",
"حظر المستخدمين": "block",
"توثيق المستخدمين": "verify",
"قبول طلبات الدعم": "accept",
"مشاهدة المستند…": "watch",
};


export const ALL_ROLES_AR: string[] = [
"حذف الحسابات",
"الإبلاغات",
"إضافة الحسابات",
"نشر النصائح",
"حظر المستخدمين",
"محتوى المحظور",
"مشاهدة المستند…",
"قبول طلبات الدعم",
"توثيق المستخدمين",
];


export function mapArabicRolesToKeys(labels: string[]): string[] {
return labels.map((l) => ROLE_LABEL_TO_KEY[l]).filter(Boolean);
}

export default function AddAccountCard({
  apiUrl = "http://bo-chat.space/dashboard/addAdmin6877d5497b04a3c83759f122",
  onAdded,
}: {
  apiUrl?: string;
  onAdded?: (payload: AddAdminPayload) => void;
}) {
  const [name, setName] = React.useState(""); // للعرض فقط
  const [email, setEmail] = React.useState(""); // للعرض فقط
  const [userid, setUserid] = React.useState(""); // المطلوب فعليًا
  const [roles, setRoles] = React.useState<string[]>(["الإبلاغات", "نشر النصائح"]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  const toggleRole = (r: string) =>
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const handleSubmit = async () => {
    setError(null);
    setOkMsg(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("لم يتم العثور على التوكن في المتصفح. تأكد من تسجيل الدخول.");
      return;
    }
    if (!userid.trim()) {
      setError("الرجاء إدخال User ID المطلوب.");
      return;
    }

    const rules = mapArabicRolesToKeys(roles);
    const payload: AddAdminPayload = { userid: userid.trim(), rules };

    try {
      setSubmitting(true);
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        const msg = data?.message || data?.error || `فشل الطلب (HTTP ${res.status}).`;
        setError(msg);
        return;
      }

      setOkMsg("تم إضافة الأدمن بنجاح.");
      onAdded?.(payload);
      setUserid("");
    } catch (e: any) {
      setError(e?.message || "حدث خطأ غير متوقع أثناء الاتصال بالسيرفر.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[34px] bg-[#F6F6F6] p-6 " dir="rtl">
      <h2 className="mb-4 text-center text-[18px] font-semibold text-[#D12D2D]">إضافة حساب</h2>

      <div className="space-y-4">
        {/* عرض فقط */}
        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">اسم المستخدم (اختياري)</Label>
          <Input
            placeholder="Name: Abdo mohamed"
            className="h-11 rounded-xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">الإيميل (اختياري)</Label>
          <Input
            placeholder="Email: Abdallahsayed23@gmail.com"
            className="h-11 rounded-xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* المطلوب فعليًا */}
        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">User ID (مطلوب)</Label>
          <Input
            placeholder="686695914211804ef3875338"
            className="h-11 rounded-xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-2 text-right text-sm font-medium text-gray-600">الصلاحيات</div>
          <div className="flex flex-wrap gap-3">
            {ALL_ROLES_AR.map((r) => {
              const active = roles.includes(r);
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRole(r)}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm transition-all",
                    active
                      ? "ring-1 ring-[#D12D2D] text-[#D12D2D] bg-white"
                      : "bg-[#EDEDED] text-gray-500",
                  ].join(" ")}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {okMsg && (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{okMsg}</div>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="d-flex px-[70px]">
              <Button
                disabled={submitting || !userid.trim()}  
                className="mt-4 w-full rounded-[20px] bg-[#D12D2D] h-[50px] !p-[15px] hover:bg-[#be2525] disabled:opacity-60"
              >
                {submitting ? "جارٍ الإضافة..." : "إضافة"}
              </Button>
            </div>
          </AlertDialogTrigger>

          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الإضافة</AlertDialogTitle>
              <AlertDialogDescription>
                هل تريد بالتأكيد إضافة هذا الحساب كمسؤول؟
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit}
                
                className="bg-[#D12D2D] hover:bg-[#be2525]"
              >
                تأكيد الإضافة
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}



