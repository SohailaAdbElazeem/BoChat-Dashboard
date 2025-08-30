"use client";

import React, {useEffect, useRef, useState} from "react";

type Option = { label: string; value: string };
type Props = {
  options: Option[];
  value?: string | null;
  onChange?: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SelectDropdown({
  options,
  value = null,
  onChange,
  placeholder = "اختر نوع الإشعار من القائمة",
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  // إغلاق عند الضغط خارج القائمة
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // تنقل بالكيبورد
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      setOpen(true);
      setHighlight(0);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      setHighlight((h) => Math.min(options.length - 1, (h < 0 ? 0 : h) + 1));
    } else if (e.key === "ArrowUp") {
      setHighlight((h) => Math.max(0, (h < 0 ? 0 : h) - 1));
    } else if (e.key === "Enter") {
      if (highlight >= 0) {
        onChange?.(options[highlight].value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`} dir="rtl">
      {/* الحقل الرئيسي بنفس التصميم */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="w-full h-12 px-4 rounded-2xl bg-[#E6E6E6] flex items-center justify-between
                   text-gray-600 focus:outline-none cursor-pointer"
      >
        <span className={`text-sm ${selected ? "text-gray-800" : "text-gray-500"}`}>
          {selected ? selected.label : placeholder}
        </span>

        {/* السهم */}
        <svg
          className={`w-5 h-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* القائمة */}
      {open && (
        <div
          className="absolute z-50 mt-2 right-0 left-0 bg-white rounded-2xl shadow-lg p-1
                     max-h-64 overflow-auto no-scrollbar border border-gray-100"
        >
          {options.map((opt, i) => {
            const isActive = value === opt.value;
            const isHighlight = i === highlight;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-right px-4 py-3 rounded-xl text-sm transition
                  ${isActive ? "bg-[#D72229]/10 text-[#D72229]" : "text-gray-700"}
                  ${isHighlight && !isActive ? "bg-gray-100" : ""}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
