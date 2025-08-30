"use client";

import React, { useMemo, useRef, useState } from "react";

type Props = {
  items: string[];
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
};

export default function ScrollablePills({ items, value, onChange, className }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // تحويل عجلة الماوس لأفقي
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!scrollerRef.current) return;
    // منع الـ scroll العمودي داخل السلايدر
    e.preventDefault();
    scrollerRef.current.scrollLeft += e.deltaY;
  };

  // سحب بالماوس (grab/drag)
  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!scrollerRef.current) return;
    setDragging(true);
    startX.current = e.pageX - scrollerRef.current.offsetLeft;
    scrollLeft.current = scrollerRef.current.scrollLeft;
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || !scrollerRef.current) return;
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2; // حساسية السحب
    scrollerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const endDrag = () => setDragging(false);

  // لمس للموبايل
  const touchStartX = useRef(0);
  const touchScrollLeft = useRef(0);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!scrollerRef.current) return;
    touchStartX.current = e.touches[0].pageX - scrollerRef.current.offsetLeft;
    touchScrollLeft.current = scrollerRef.current.scrollLeft;
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!scrollerRef.current) return;
    const x = e.touches[0].pageX - scrollerRef.current.offsetLeft;
    const walk = (x - touchStartX.current) * 1.2;
    scrollerRef.current.scrollLeft = touchScrollLeft.current - walk;
  };

  return (
    <div className={`relative select-none ${className ?? ""}`} dir="rtl">
      {/* حواف تدرج بسيطة (اختياري) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/70 to-transparent rounded-r-2xl" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/70 to-transparent rounded-l-2xl" />

      <div
        ref={scrollerRef}
        className={`no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pr-2 pl-2 
          ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {items.map((label) => {
          const active = value === label;
          return (
            <button
              key={label}
              onClick={() => onChange?.(label)}
              className={`whitespace-nowrap px-[5px] py-3 rounded-full border text-sm transition-all
                min-w-[110px] text-center 
                ${active
                  ? "bg-[#D72229] text-white border-[#D72229] shadow"
                  : "bg-[#E6E6E6] text-[#333] border-gray-200 hover:border-[#D72229]/50"
                }`}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
