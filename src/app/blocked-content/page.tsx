'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

type WordRow = {
  no: number;       
  id: string;        
  word: string;     
  addedBy: string;  
  usage: number;    
  addedAt: string;   
};

const SEED: WordRow[] = Array.from({ length: 14 }).map((_, i) => ({
  no: i + 1,
  id: `PW${String(i + 1).padStart(4, '0')}`,
  word: 'شخص براس كلبه',
  addedBy: i % 3 === 0 ? 'محمد احمد' : i % 3 === 1 ? 'محمود احمد' : 'عبدالله سيد',
  usage: 10992,
  addedAt: '01-04-2025',
}));

const arNumber = (n: number) =>
  n.toLocaleString('ar-EG');

export default function BlockedWordsPage() {
  const [rows, setRows] = React.useState<WordRow[]>(SEED);
  const [query, setQuery] = React.useState('');
  const [single, setSingle] = React.useState('');
  const [group, setGroup] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.word.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.addedBy.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const onDelete = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const addWords = () => {
    const baseNo = rows.length ? Math.max(...rows.map((r) => r.no)) : 0;
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const date = `${d}-${m}-${y}`;

    const groupWords = group
      .split(/[\n,;،]+/)
      .map((w) => w.trim())
      .filter(Boolean);

    const list = [
      ...groupWords,
      ...(single.trim() && groupWords.length === 0 ? [single.trim()] : []),
    ];

    if (list.length === 0) return;

    const next: WordRow[] = list.map((w, idx) => ({
      no: baseNo + idx + 1,
      id: `PW${String(baseNo + idx + 1).padStart(4, '0')}`,
      word: w,
      addedBy: 'نظام',
      usage: 0,
      addedAt: date,
    }));

    setRows((prev) => [...prev, ...next]);
    setSingle('');
    setGroup('');
  };

  const total = rows.length;

  return (
    <main className="p-6 pl-[80px]">
      <div className="mb-4 flex items-center gap-3 justifu-start" dir='rtl'>
        <div className="flex w-full max-w-[460px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3">
          <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#8989A2]/25">
            <Search className="text-[#8989A2]" />
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب ما تبحث عنه"
            className="h-12 rounded-2xl border-none bg-white/70 shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-8">
          <div className="overflow-hidden rounded-3xl bg-[#F6F6F6] shadow-sm">
            <div className="grid grid-cols-[110px_130px_1fr_180px_140px_150px] items-center gap-2 bg-[#EDEDED] px-4 py-3 text-sm font-medium text-gray-700">
              <div className="text-center">الإجراءات</div>
              <div className="text-center">تاريخ الإضافة</div>
              <div className="text-center">الاستخدام</div>
              <div className="text-center">المضيف</div>
              <div className="text-center">الكلمة</div>
              <div className="text-center">id</div>
            </div>

            {/* الصفوف */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[110px_130px_1fr_180px_140px_150px] items-center gap-2 border-t border-white/40 px-4 py-2 text-sm text-gray-700"
                >
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={() => onDelete(r.id)}
                      className="h-9 w-24 rounded-2xl bg-[#D12D2D] text-white hover:bg-[#be2525]"
                    >
                      حذف
                    </Button>
                  </div>
                  <div className="text-center text-gray-600">{r.addedAt}</div>
                  <div className="text-center text-gray-600">{arNumber(r.usage)}</div>
                  <div className="text-center text-gray-600">{r.addedBy}</div>
                  <div className="text-center text-gray-700">{r.word}</div>
                  <div className="text-center text-gray-600">{r.id}</div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="p-6 text-center text-gray-500">لا توجد نتائج مطابقة.</div>
              )}
            </div>
          </div>
        </section>

        {/* الفورم والبطاقة (يمين) */}
        <aside className="xl:col-span-4 space-y-6">
          {/* فورم إضافة كلمة محظورة */}
          <div className="rounded-3xl bg-[#F6F6F6] p-6 shadow-sm">
            <h3 className="mb-4 text-center text-[18px] font-semibold text-[#D12D2D]">
              إضافة كلمة محظورة
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="mb-1 block text-right text-sm text-gray-600">الكلمة المحظورة</Label>
                <Input
                  value={single}
                  onChange={(e) => setSingle(e.target.value)}
                  placeholder="اكتب هنا الكلمة التي تريد إضافتها"
                  className="h-11 rounded-xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
                />
                <p className="mt-1 text-right text-[11px] text-[#8989A2]">
                  إذا كنت تريد أن تكتب كلمة واحدة اكتُبها هنا
                </p>
              </div>

              <div>
                <Label className="mb-1 block text-right text-sm text-gray-600">مجموعة كلمات</Label>
                <Textarea
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder="اكتب هنا مجموعة الكلمات التي تريد إضافتها"
                  className="min-h-[110px] rounded-xl bg-[#EDEDED] text-sm placeholder:text-gray-500"
                />
                <p className="mt-1 text-right text-[11px] text-[#8989A2]">
                  إذا كنت تريد أن تضيف مجموعة كلمات اكتُبها هنا (كل سطر كلمة، أو افصلها بفاصلة)
                </p>
              </div>

              <Button
                onClick={addWords}
                className="mt-2 h-12 w-full rounded-2xl bg-[#D12D2D] text-white hover:bg-[#be2525]"
              >
                إضافة
              </Button>
            </div>
          </div>

          <div className="rounded-3xl bg-[#F6F6F6]  shadow-sm">
            <div className='p-5 '>
                <p className="text-right text-sm leading-7 text-gray-600">
                إجمالي عدد الكلمات المحظورة التي تمت إضافتها ومتابعتها داخل النظام حتى الآن
                </p>
            </div>

            <div className="overflow-hidden rounded-b-2xl">
              <div className="flex items-center justify-between bg-[#D12D2D] px-4 py-3 text-white">
                <span className="text-lg font-semibold">{arNumber(total)}</span>
                <span className="text-base">الإجمالي</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
