'use client';
import { useMemo } from 'react';
import { RegistrationRow } from './LastLogins';
import { Search } from 'lucide-react';
import FilterSelect from '../../components/ui/ui/FilterSelect';

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
  const tempFiltered = useMemo(() => {
    const q = norm(filters.query);
    return rows.filter((r) => {
      if (filters.type && r.type !== filters.type) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.country && r.country !== filters.country) return false;
      if (filters.governorate && r.governorate !== filters.governorate) return false;
      if (filters.gender && r.gender !== filters.gender) return false;
      if (filters.role && r.role !== filters.role) return false;

      if (!q) return true;
      const hay = norm([
        r.userName, r.emailOrPhone, r.id, r.type, r.status,
        r.country, r.governorate, r.gender, r.role
      ].join(' '));
      return hay.includes(q);
    });
  }, [rows, filters]);

  const options = useMemo(() => {
    const uniq = <T,>(arr: T[]) => Array.from(new Set(arr)).filter(Boolean) as T[];
    return {
      types:       uniq(tempFiltered.map(r => r.type)),
      statuses:    uniq(tempFiltered.map(r => r.status)),
      countries:   uniq(tempFiltered.map(r => r.country)),
      governorates:uniq(tempFiltered.map(r => r.governorate)),
      genders:     uniq(tempFiltered.map(r => r.gender)),
      roles:       uniq(tempFiltered.map(r => r.role)),
    };
  }, [tempFiltered]);

  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const onCountry = (v: string) => set({ country: v || undefined, governorate: undefined });

  return (
  <div className="flex flex-wrap items-center gap-2 bg-[#F6F6F6] w-fit p-[15px] rounded-[25px]">

  <div className='flex items-center gap-1'>
    <div className='w-12 h-12 flex p-[7px] items-center justify-center rounded-[15px] bg-[#8989A2]/25'>
      <Search className='text-[#8989A2]'/>
    </div>
    <input
      className="h-12 w-72 rounded-2xl border-2 border-[#E6E6E6] px-3 text-sm"
      placeholder="اكتب اسم المستخدم / الإيميل / ID"
      value={filters.query}
      onChange={(e)=>set({query:e.target.value})}
    />
  </div>

  <FilterSelect
    placeholder="نوع التسجيل"
    value={filters.type}
    onChange={(v)=>set({type:v||undefined})}
    options={options.types}
  />

  <FilterSelect
    placeholder="الحالة"
    value={filters.status}
    onChange={(v)=>set({status:v||undefined})}
    options={options.statuses}
  />

  <FilterSelect
    placeholder="البلد"
    value={filters.country}
    onChange={(v)=>onCountry(v||"")}
    options={options.countries}
  />

  <FilterSelect
    placeholder="المحافظة"
    value={filters.governorate}
    onChange={(v)=>set({governorate:v||undefined})}
    options={options.governorates}
  />

  <FilterSelect
    placeholder="الجنس"
    value={filters.gender}
    onChange={(v)=>set({gender:v||undefined})}
    options={options.genders}
  />

  <FilterSelect
    placeholder="الوضع"
    value={filters.role}
    onChange={(v)=>set({role:v||undefined})}
    options={options.roles}
  />
</div>
  );
}
