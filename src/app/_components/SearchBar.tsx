/* eslint-disable react/jsx-key */
'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

type SearchBarProps = {
  /** Controlled value */
  value: string;
  /** Called on every keystroke */
  onValueChange: (val: string) => void;
  /** Optional: called when user presses Enter */
  onSubmit?: (val: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Layout direction for the whole field (default: 'rtl') */
  dir?: 'rtl' | 'ltr' | 'auto';
  /** Optional extra classes for outer wrapper */
  className?: string;
  /** If you want a different icon */
  icon?: React.ReactNode;
  /** Max width constraint (default 360px like your design) */
  maxWidthClass?: string; // e.g. "max-w-full" or "max-w-[480px]"
};

export default function SearchBar({
  value,
  onValueChange,
  onSubmit,
  placeholder = 'اكتب ما تبحث عنه',
  dir = 'rtl',
  className = '',
  icon,
  maxWidthClass = 'max-w-[360px]',
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div
      className={`flex w-full ${maxWidthClass} items-center gap-3 rounded-[25px] bg-[#F6F6F6] p-3 ${className}`}
      dir={dir}
      role="search"
      aria-label="Search"
    >
      <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#8989A2]/25">
        {icon ?? <SearchIcon className="text-[#8989A2]" />}
      </div>

      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-12 flex-1 rounded-2xl border-[#8989A2] focus:outline-none focus:shadow-[0px] bg-white/70"
        aria-label={placeholder}
      />
    </div>
  );
}
