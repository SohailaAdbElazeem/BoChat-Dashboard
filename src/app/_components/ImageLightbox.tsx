/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  images: string[];
  index: number;
  onChange: (nextIndex: number) => void;
  onClose: () => void;
};

export default function ImageLightbox({ images, index, onChange, onClose }: Props) {
  if (!images?.length) return null;

  const clamp = (i: number) => (i + images.length) % images.length;
  const prev  = () => onChange(clamp(index - 1)); // ⟵ السابق
  const next  = () => onChange(clamp(index + 1)); // ⟶ التالي

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();   // نفس السلوك مع الكيبورد
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, next, onClose, prev]);

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
        <div className="absolute right-[70px] top-[70px] flex gap-2">
          <button
            className="rounded-full bg-white/90 p-2 hover:bg-white"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="السابق"
            title="السابق"
          >
            <ChevronRight /> 
          </button>
          <button
            className="rounded-full bg-white/90 p-2 hover:bg-white"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="التالي"
            title="التالي"
          >
            <ChevronLeft />
          </button>
          <button
            className="rounded-full bg-white/90 p-2 hover:bg-white"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="إغلاق"
            title="إغلاق"
          >
            <X />
          </button>
        </div>
      <div
        className="relative mx-4 flex w-[min(1100px,95vw)] max-h-[90vh] gap-6"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex-1 flex items-center justify-center">
          <img
            src={images[index]}
            alt=""
            className="h-[80vh] max-w-full rounded-[40px] object-contain"
          />
        </div>
        <div className="flex w-[86px] !pt-[20px] flex-col items-center gap-3">
          {images.map((src, i) => (
            <button
              key={ i}
              className={`relative h-[68px] w-[68px] overflow-hidden rounded-2xl ring-2 transition
                ${i === index ? 'ring-red-600' : 'ring-transparent hover:ring-white/40'}`}
              onClick={() => onChange(i)}
              aria-label={`اختر صورة ${i + 1}`}
              title={`صورة ${i + 1}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
