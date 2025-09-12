// src/app/accounts/new/_components/AccountCard.tsx
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";

type Account = { id: string; email: string; name: string; active: boolean };

export default function AccountCard({
  account,
  onDelete,
}: {
  account: Account;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-3xl bg-[#F6F6F6] p-5" dir="rtl">
      {/* ... */}
      <Button onClick={() => onDelete(account.id)} className="mt-5 w-full rounded-2xl bg-[#D12D2D] hover:bg-[#be2525]">
        حذف
      </Button>
    </div>
  );
}
