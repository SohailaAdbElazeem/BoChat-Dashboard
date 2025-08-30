// app/accounts/page.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import CustomChart from "@/app/_components/CustomChart";
import ResetPasswordDialog from "@/app/_components/ResetPasswordDialog";



type Account = {
  id: string;
  email: string;
  name: string;
  active: boolean;
};

function AccountCard({ account, onDelete }: { account: Account; onDelete: (id: string) => void }) {
    const [openReset, setOpenReset] = React.useState(false);

    return (
        <div className="rounded-3xl bg-[#F6F6F6] p-5 shadow-sm" dir="rtl">
            <h3 className="mb-4 text-center text-[15px] font-semibold text-[#D12D2D]">
                معلومات الحساب
            </h3>

            <div className="space-y-3">
                <div className="text-xs text-right text-gray-500">الإيميل:</div>
                <div className="h-10 rounded-xl bg-[#EDEDED] px-4 flex items-center text-sm text-gray-500">
                {account.email}
                </div>

                <div className="text-xs text-right text-gray-500">الاسم:</div>
                <div className="h-10 rounded-xl bg-[#EDEDED] px-4 flex items-center text-sm text-gray-500">
                {account.name}
                </div>

                <div className="text-xs text-right text-gray-500">الحالة:</div>
                <div className="h-10 rounded-xl bg-[#F7D9DC] px-4 flex items-center text-sm text-[#D12D2D]">
                {account.active ? "نشط" : "غير نشط"}
                </div>
            </div>

<Button
        onClick={() => onDelete(account.id)}
        className="mt-5 w-full rounded-2xl bg-[#D12D2D] hover:bg-[#be2525]"
      >
        حذف
      </Button>

      {/* رابط فتح المودال */}
      <p className="mt-2 text-center text-[11px] text-gray-400">
        هل نسيت كلمة المرور؟{" "}
        <button
          type="button"
          onClick={() => setOpenReset(true)}
          className="underline decoration-dotted text-[#D12D2D]"
        >
          اعادة تعيين كلمة مرور
        </button>
      </p>

      {/* المودال */}
      <ResetPasswordDialog
        open={openReset}
        onOpenChange={setOpenReset}
        email={account.email}
        onSubmit={async ({ email, pass1, pass2 }) => {
          console.log("reset password =>", { email, pass1, pass2 });
        }}
      />
    </div>
    );
}

function EmptyLeft() {
  return (
    <div className="flex h-[500px] items-center justify-center" dir="rtl">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#D12D2D]">لا توجد حسابات مضافة</h2>
        <p className="mt-2 text-gray-500">
          ابدأ الآن، أضف أول حساب لتفعيل لوحة التحكم
        </p>
      </div>
    </div>
  );
}

function AddAccountCard() {
  const [showPass, setShowPass] = React.useState(false);
  const [roles, setRoles] = React.useState<string[]>(["الإبلاغات", "نشر النصائح"]);

  const allRoles = [
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

  const toggleRole = (r: string) =>
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  return (
    <div className="rounded-3xl bg-[#F6F6F6] p-6 shadow-sm" dir="rtl">
      <h2 className="mb-4 text-center text-[18px] font-semibold text-[#D12D2D]">إضافة حساب</h2>

      <div className="space-y-4">
        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">اسم المستخدم</Label>
          <Input
            placeholder="Name: Abdo mohamed"
            className="h-11 rounded-xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">الإيميل</Label>
          <Input
            placeholder="Email: Abdallahsayed23@gmail.com"
            className="h-11 rounded-xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label className="mb-1 block text-right text-sm text-gray-600">كلمة المرور</Label>
          <div className="relative">
            <Input
              type={showPass ? "text" : "password"}
              defaultValue="BOCHAT2025"
              className="h-11 rounded-xl bg-[#EDEDED] pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-label="toggle password"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 text-right text-sm font-medium text-gray-600">الصلاحيات</div>
          <div className="flex flex-wrap gap-3">
            {allRoles.map((r) => {
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

        <Button className="mt-4 w-full rounded-2xl bg-[#D12D2D] hover:bg-[#be2525]">
          إضافة
        </Button>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = React.useState<Account[]>([
    {
      id: "1",
      email: "Abdallahsayed23@gmail.com",
      name: "عبدالله محمد",
      active: true,
    },
    {
      id: "2",
      email: "user@example.com",
      name: "مستخدم آخر",
      active: true,
    },
  ]);
//   const [accounts, setAccounts] = React.useState<Account[]>([]);

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <main className="p-6">
      <div className="mx-auto pl-[60px] grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
        <section className="xl:col-span-4 md:col-span-1">
          {accounts.length === 0 ? (
            <EmptyLeft />
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {accounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>

        <section className="xl:col-span-4 md:col-span-1">
          <AddAccountCard />
        </section>

        <aside className="xl:col-span-4 hidden xl:block">
          <CustomChart />
        </aside>
      </div>
    </main>
  );
}
