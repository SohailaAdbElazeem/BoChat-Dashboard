"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  email: string;
  onSubmit?: (payload: { email: string; pass1: string; pass2: string }) => Promise<void> | void;
};

export default function ResetPasswordDialog({ open, onOpenChange, email, onSubmit }: Props) {
  const [show1, setShow1] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [pass1, setPass1] = React.useState("BOCHAT2025");
  const [pass2, setPass2] = React.useState("BOCHAT2025");
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onSubmit?.({ email, pass1, pass2 });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          rounded-3xl p-6 sm:p-8 max-w-[560px]
          data-[state=open]:animate-in
        "
      >
        <DialogHeader dir="rtl">
          <DialogTitle className="text-center text-[20px] font-semibold text-[#D12D2D]">
            إعادة تعيين كلمة المرور
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-4" dir="rtl">
          <div>
            <Label className="mb-1 block text-right text-sm text-gray-500">إيميل المستخدم</Label>
            <Input
              value={email}
              readOnly
              className="h-11 rounded-xl bg-[#EDEDED] text-sm text-gray-500"
            />
          </div>

          <div>
            <Label className="mb-1 block text-right text-sm text-gray-500">إعادة كتابة كلمة المرور</Label>
            <div className="relative">
              <Input
                type={show1 ? "text" : "password"}
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
                className="h-11 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShow1((s) => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="toggle password"
              >
                {show1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label className="mb-1 block text-right text-sm text-gray-500">إعادة كتابة كلمة المرور</Label>
            <div className="relative">
              <Input
                type={show2 ? "text" : "password"}
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                className="h-11 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShow2((s) => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="toggle password"
              >
                {show2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 flex w-full gap-3 sm:justify-center" dir="rtl">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-2xl border-[#D12D2D] text-[#D12D2D] hover:bg-red-50"
          >
            الغاء
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || pass1.length === 0 || pass1 !== pass2}
            className="rounded-2xl bg-[#D12D2D] hover:bg-[#be2525]"
          >
            {loading ? "جارٍ الحفظ…" : "حفظ التعديلات"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
