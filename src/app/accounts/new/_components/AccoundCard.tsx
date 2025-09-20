// File: app/accounts/_components/AccountCard.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export type Admin = {
  _id: string;
  useremail: string; // من الـ API (هاش)
  username: string;
  userid: string;
  rules: string[];
};

export default function AccountCard({
  admin,
  onDelete,
  loading,
}: {
  admin: Admin;
  onDelete: (userid: string) => Promise<void> | void;
  loading?: boolean;
}) {
  return (
    <Card className="rounded-3xl bg-[#F6F6F6]" dir="rtl">
      <CardHeader>
        <CardTitle className="text-lg text-center text-[#D72229]">
          معلومات الحساب
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="bg-[#E6E6E6] p-[10px] rounded-[18px] my-2">
            ID: {admin.userid}
          </div>
          <div className="bg-[#E6E6E6] p-[10px] rounded-[18px] my-2">
            الاسم: {admin.username || "مسؤول بدون اسم"} 
          </div>
          <div className="bg-[#E6E6E6] p-[10px] rounded-[18px] overflow-cut my-2 line-clamp-2">
            الايميل:{admin.useremail || "مسؤول بدون اسم"}
          </div>
          <div className="text-xs text-muted-foreground mb-1">الصلاحيات:</div>
          <div className="flex flex-wrap gap-2">
            {admin.rules?.length ? (
              admin.rules.map((r) => (
                <Badge key={r} variant="secondary" className="rounded-xl bg-[#D72229]/10 cursor-normal">
                  {r}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                لا توجد صلاحيات
              </span>
            )}
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="px-[60px]">
              <Button
                disabled={!!loading}
                className="mt-2 w-full h-12 rounded-[20px] bg-[#D12D2D] hover:bg-[#be2525]"
                >
                حذف
              </Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد أنك تريد حذف المشرف <b>{admin.username}</b>؟ لا يمكن
                التراجع عن هذه العملية.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(admin.userid)}
                className="bg-[#D12D2D] hover:bg-[#be2525]"
              >
                تأكيد الحذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
