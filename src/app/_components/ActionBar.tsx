"use client";

import Link from "next/link";
import { Ban, Plus, Newspaper, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils"; 
import { Button } from "@/components/ui/button";

type Item = {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const ITEMS: Item[] = [
  { href: "/blocked-content",     label: "محتوى محظور", Icon: Ban },
  { href: "/tips",    label: "بوست نصائح",  Icon: Plus },
  { href: "/reports",     label: "الإبلاغات",    Icon: Newspaper },
  { href: "/accounts/new",label: "إضافة حساب",  Icon: UserPlus },
];

export default function ActionBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap justify-end gap-3", className)}>
      {ITEMS.map(({ href, label, Icon }) => (
        <Button
          key={href}
          asChild
          variant="ghost"
          className="
            group rounded-[25] px-1 !py-[30px]
            bg-[#F6F6F6] hover:bg-neutral-100
            text-red-600 shadow-sm ring-1 ring-red-100
            flex items-center justify-end
            w-[200px]
            "
        >
          <Link href={href} className="flex items-center justify-end gap-3">

            <span className="text-sm font-medium">{label}</span>
            <span
              className="
                grid h-14 w-15 place-items-center rounded-[22px]
                bg-[#E6E6E6] group-hover:bg-red-200
              "
            >
              <Icon className="!h-6 !w-6" />
            </span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
