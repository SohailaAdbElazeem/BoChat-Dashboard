'use client';

import Image from 'next/image';
import { RegistrationRow } from '../../_components/LastLogins';

type Props = {
  title?: string;
  rows: RegistrationRow[];
  onRowClick?: (row: RegistrationRow) => void;
};

const badgeClasses = (status: RegistrationRow['status']) =>
  status === 'نشط' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700';

const typeClasses = (t: RegistrationRow['type']) => {
  switch (t) {
    case 'جوجل':
      return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200';
    case 'فيسبوك':
      return 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200';
    default:
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200';
  }
};

export default function RegistrationTable({
  title = 'المستخدمون',
  rows,
  onRowClick,
}: Props) {
  return (
    <section className="!w-full !pl-[70px] max-h-[620px] overflow-hidden scrollbar-hidden" dir="rtl">
      <header className="mb-3">
        <h2 className="text-rose-600 text-lg font-semibold">{title}</h2>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white ">
        <div className="max-h-[720px] overflow-auto scrollbar-hidden">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-rose-50/60 backdrop-blur supports-[backdrop-filter]:bg-rose-50/50">
              <tr className="text-gray-600">
                <th className="w-16 py-3 pr-4 pl-2 text-center font-medium">الرقم</th>
                <th className="w-16 py-3 px-2 text-right font-medium">صورة</th>
                <th className="py-3 px-2 text-right font-medium">اسم المستخدم</th>
                <th className="py-3 px-2 text-right font-medium">id</th>
                <th className="py-3 px-2 text-right font-medium">الحالة</th>
                <th className="py-3 px-2 text-right font-medium">تاريخ الميلاد</th>
                <th className="py-3 px-2 text-right font-medium">الإيميل</th>
                <th className="py-3 px-2 text-right font-medium">نوع التسجيل</th>
                <th className="py-3 px-2 text-right font-medium">الوضع</th>
                <th className="py-3 px-2 text-right font-medium">البلد</th>
                <th className="py-3 px-2 text-right font-medium">المحافظة</th>
                <th className="py-3 px-2 text-right font-medium">الجنس</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.index}
                  onClick={() => onRowClick?.(r)}
                  className="even:bg-gray-50/60 hover:bg-rose-50/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 pr-4 pl-2 text-center text-gray-700">{r.index}</td>

                  <td className="py-3 px-2">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white ">
                      <Image
                        src={r.avatarUrl || '/avatar-placeholder.png'}
                        alt={r.userName}
                        fill
                        sizes="36px"
                      />
                    </div>
                  </td>

                  <td className="py-3 px-2 font-medium text-gray-800">{r.userName}</td>
                  <td className="py-3 px-2 text-gray-500">{r.id}</td>

                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses(r.status)}`}>
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-gray-600">{r.birthDate}</td>
                  <td className="py-3 px-2 text-gray-700">{r.emailOrPhone}</td>

                  <td className="py-3 px-2">
                    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${typeClasses(r.type)}`}>
                      {r.type}
                    </span>
                  </td>

                  <td className="py-3 px-2 text-gray-700">{r.role}</td>
                  <td className="py-3 px-2 text-gray-700">{r.country}</td>
                  <td className="py-3 px-2 text-gray-700">{r.governorate}</td>
                  <td className="py-3 px-2 text-gray-700">{r.gender}</td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-10 text-center text-gray-500">
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
