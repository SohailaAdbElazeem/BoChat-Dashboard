'use client';
import { useEffect, useMemo } from 'react';
import { RegistrationRow } from './LastLogins';
import { Search } from 'lucide-react';
import FilterSelect from '../../components/ui/FilterSelect';

export type Filters = {
  query: string;
  type?: string;
  status?: string;
  country?: string;
  governorate?: string;
  gender?: string;
  role?: string;
};

const norm = (v: unknown) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFKD');

type Props = {
  rows: RegistrationRow[];
  filters: Filters;
  onChange: (next: Filters) => void;
};

export default function FilterBar({ rows, filters, onChange }: Props) {
  const baseByQuery = useMemo(() => {
    const q = norm(filters.query);
    if (!q) return rows;
    return rows.filter((r) => {
      const hay = norm(
        [
          r.userName,
          r.emailOrPhone,
          r.id,
          r.type,
          r.status,
          r.country,
          r.governorate,
          r.gender,
          r.role,
        ].join(' ')
      );
      return hay.includes(q);
    });
  }, [rows, filters.query]);


  // القوائم من baseByQuery فقط (ثابتة)، مع ربط المحافظات بالبلد
  const options = useMemo(() => {
    const uniq = <T,>(arr: T[]) =>
      Array.from(new Set(arr.filter((x) => x !== undefined && x !== null && String(x).trim() !== ''))) as T[];
    const sortStr = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b, 'ar'));

    const forGovSource = filters.country
      ? baseByQuery.filter((r) => r.country === filters.country)
      : baseByQuery;

    return {
      types:        sortStr(uniq(baseByQuery.map((r) => r.type))),
      statuses:     sortStr(uniq(baseByQuery.map((r) => r.status))),
      countries:    sortStr(uniq(baseByQuery.map((r) => r.country))),
      governorates: sortStr(uniq(forGovSource.map((r) => r.governorate))),
      genders:      sortStr(uniq(baseByQuery.map((r) => r.gender))),
      roles:        sortStr(uniq(baseByQuery.map((r) => r.role))),
    };
  }, [baseByQuery, filters.country]);

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const onCountry = (v: string) => set({ country: v || undefined, governorate: undefined });

  useEffect(() => {
    const next: Partial<Filters> = {};
    if (filters.type && !options.types.includes(filters.type)) next.type = undefined;
    if (filters.status && !options.statuses.includes(filters.status)) next.status = undefined;
    if (filters.country && !options.countries.includes(filters.country)) {
      next.country = undefined;
      next.governorate = undefined;
    }
    if (filters.governorate && !options.governorates.includes(filters.governorate)) next.governorate = undefined;
    if (filters.gender && !options.genders.includes(filters.gender)) next.gender = undefined;
    if (filters.role && !options.roles.includes(filters.role)) next.role = undefined;

    if (Object.keys(next).length) onChange({ ...filters, ...next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.types,
    options.statuses,
    options.countries,
    options.governorates,
    options.genders,
    options.roles,
  ]);

  return (
    <div className="flex flex-wrap items-center gap-2 bg-[#F6F6F6] w-fit p-[15px] rounded-[25px]">
      <div className="flex items-center gap-1">
        <div className="w-12 h-12 flex p-[7px] items-center justify-center rounded-[15px] bg-[#8989A2]/25">
          <Search className="text-[#8989A2]" />
        </div>
        <input
          className="h-12 w-65 rounded-2xl border-2 border-[#E6E6E6] px-3 text-sm"
          placeholder="اكتب اسم المستخدم / الإيميل / ID"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
        />
      </div>

      {/* 📌 ملاحظات هامة:
          - بنمرر value كـ String دايمًا ('' بدل undefined) علشان يفضل Controlled.
          - استخدمت key بسيط لكل Select مربوط بالقيمة المختارة لتجنّب بقاء قيمة قديمة في العرض. */}

      <FilterSelect
        key={`type-${filters.type ?? ''}`}
        placeholder="نوع التسجيل"
        value={filters.type ?? ''}                 // <-- String دائمًا
        onChange={(v) => set({ type: v || undefined })}
        options={options.types}
      />

      <FilterSelect
        key={`status-${filters.status ?? ''}`}
        placeholder="الحالة"
        value={filters.status ?? ''}               // <-- String دائمًا
        onChange={(v) => set({ status: v || undefined })}
        options={options.statuses}
      />

      <FilterSelect
        key={`country-${filters.country ?? ''}`}
        placeholder="البلد"
        value={filters.country ?? ''}              // <-- String دائمًا
        onChange={(v) => onCountry(v || '')}
        options={options.countries}
      />

      <FilterSelect
        key={`gov-${filters.governorate ?? ''}-${filters.country ?? ''}`}
        placeholder="المحافظة"
        value={filters.governorate ?? ''}          // <-- String دائمًا
        onChange={(v) => set({ governorate: v || undefined })}
        options={options.governorates}
      />

      <FilterSelect
        key={`gender-${filters.gender ?? ''}`}
        placeholder="الجنس"
        value={filters.gender ?? ''}               // <-- String دائمًا
        onChange={(v) => set({ gender: v || undefined })}
        options={options.genders}
      />

      <FilterSelect
        key={`role-${filters.role ?? ''}`}
        placeholder="الوضع"
        value={filters.role ?? ''}                 // <-- String دائمًا
        onChange={(v) => set({ role: v || undefined })}
        options={options.roles}
      />
    </div>
  );
}
