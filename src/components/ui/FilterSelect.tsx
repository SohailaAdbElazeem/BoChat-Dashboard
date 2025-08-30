'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  placeholder: string;
  value?: string;                 // undefined = مفيش اختيار => يعرض placeholder
  onChange: (v?: string) => void;
  options: string[];
  className?: string;
  clearable?: boolean;
};

export default function FilterSelect({
  placeholder, value, onChange, options, className, clearable = true
}: Props) {
  return (
    <Select
      value={value ?? undefined}   
      onValueChange={(v) => {
        if (v === "__all") onChange(undefined);
        else onChange(v);
      }}
      dir="rtl"
    >
      <SelectTrigger className={`!h-12 w-[170px] rounded-2xl border-2 border-[#E6E6E6] p-3 text-sm  ${className || ""}`}>
        <SelectValue placeholder={placeholder} /> 
      </SelectTrigger>

      <SelectContent align="end" className="rounded-xl">
        {clearable && (
          <SelectItem value="__all">الكل</SelectItem> 
        )}
        {options.map((opt) => (
          <SelectItem key={String(opt)} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
