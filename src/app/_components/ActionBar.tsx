/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils"; 
import { Button } from "@/components/ui/button";

type Item = {
  href: string;
  label: string;
  icon: string;
};

const ITEMS: Item[] = [
  { href: "/blocked-content",  label: "محتوى محظور", icon: "/icons/block-content.svg" },
  { href: "/tips", label: "بوست نصائح",  icon: "/icons/advice.svg" },
  { href: "/reports", label: "الإبلاغات",  icon:  "/icons/eblag.svg" },
  { href: "/accounts/new",label: "إضافة حساب",  icon: "/icons/user-add 1.svg" },
];

export default function ActionBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap justify-end gap-3", className)}>
      {ITEMS.map(({ href, label, icon }) => (
        <Button
          key={href}
          asChild
          variant="ghost"
          className="
            group rounded-[25px] px-1 !py-[30px]
            bg-[#F6F6F6]
            text-red-600 
            flex items-center justify-end
            w-[250px]
            h-[70px]
            "
        >
          <Link href={href} className="flex items-center justify-end gap-3">

            <span className="text-[20px] font-medium">{label}</span>
            <span
              className="
                grid h-15 w-15 place-items-center rounded-[22px]
                bg-[#E6E6E6] 
              "
            >
              <img src={icon} width={120} alt="icon" className="!h-6 !w-6" />
            </span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
