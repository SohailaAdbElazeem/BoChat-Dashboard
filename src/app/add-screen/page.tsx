"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[#C41F35] text-lg  mb-3 flex items-center gap-2">
    <span className="inline-block w-2 h-2 rounded-full bg-[#C41F35]" />
    <h3>{children}</h3>
  </div>
);

const PillButton: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-full border transition-all text-sm min-w-[100px]
      ${
        active
          ? "bg-[#C41F35] text-white border-[#C41F35] "
          : "bg-white text-[#333] border-[#E5E7EB] hover:border-[#C41F35]"
      }`}
  >
    {children}
  </button>
);

/* -------------------- Types -------------------- */
type Duration = "3 ساعات" | "8 ساعات" | "12 ساعة" | "24 ساعة" | "48 ساعة" | "60 ساعة";
type Window = "فترة الصباح" | "فترة الظهر" | "فترة المساء";

type PromoItem = {
  id: string;
  title: string;
  timeAgo: string;
  views: number;
  duration: string;
  createdAt: number; 
  imageUrl?: string;
};

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatNumber = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

function monthKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${months[(m - 1) % 12]}`;
}

const CustomChart: React.FC<{ items: PromoItem[] }> = ({ items }) => {
  const data = useMemo(() => {
    const now = new Date();
    const keys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(monthKey(d.getTime()));
    }
    const map: Record<string, number> = {};
    keys.forEach((k) => (map[k] = 0));

    items.forEach((it) => {
      const k = monthKey(it.createdAt);
      if (k in map) map[k] += it.views;
    });

    return keys.map((k) => ({
      name: monthLabel(k),
      value: map[k],     
      value2: Math.round(map[k] * 0.6),
      value3: Math.round(map[k] * 1.2),
    }));
  }, [items]);

  const renderChart = () => (
    <ResponsiveContainer width="100%" height={200} className="right-chart">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
        <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value: number) => formatNumber(value)} />
        <Line type="monotone" dataKey="value"  stroke="#8884d8" strokeWidth={1} dot={{ r: 4 }} activeDot={{ r: 4 }} name="نسبة التفاعل الشهري" />
        <Line type="monotone" dataKey="value2" stroke="#ff7300" strokeWidth={1} dot={{ r: 4 }} activeDot={{ r: 4 }} name="معدل الاحتفاظ بالمستخدمين" />
        <Line type="monotone" dataKey="value3" stroke="#387908" strokeWidth={1} dot={{ r: 4 }} activeDot={{ r: 4 }} name="إكمال الملفات الشخصية" />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-[#F6F6F6] rounded-[40px] py-6 px-5 w-full">
      <div className="flex flex-col gap-5">
        {renderChart()}
        {renderChart()}
        {renderChart()}
      </div>
    </div>
  );
};

const LeftList: React.FC<{
  items: PromoItem[];
  onDelete: (id: string) => void;
  onRefreshTime: (id: string) => void;
}> = ({ items, onDelete, onRefreshTime }) => {
  return (
    <aside className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="bg-white rounded-[18px] border p-3 flex items-start gap-3">
          <div className="w-16 h-20 rounded-xl bg-black/90 overflow-hidden">
            {it.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500">عدد المشاهدات: {it.views.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{it.duration}</div>
            <div className="mt-1 font-semibold text-sm text-gray-700">{it.title}</div>
            <div className="text-[11px] text-gray-400">{it.timeAgo}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onDelete(it.id)} className="px-3 py-1.5 rounded-full text-[12px] bg-[#C41F35] text-white">حذف</button>
              <button onClick={() => onRefreshTime(it.id)} className="px-3 py-1.5 rounded-full text-[12px] bg-white border">تحديث الوقت</button>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
};

/* -------------------- Center Form -------------------- */
const durations: Duration[] = ["3 ساعات", "8 ساعات", "12 ساعة", "24 ساعة", "48 ساعة", "60 ساعة"];
const windows: Window[] = ["فترة الصباح", "فترة الظهر", "فترة المساء"];

const CenterForm: React.FC<{
  onAdd: (item: Omit<PromoItem, "id" | "createdAt" | "views" | "timeAgo">) => void;
}> = ({ onAdd }) => {
  const [selectedDuration, setSelectedDuration] = useState<Duration>("8 ساعات");
  const [selectedWindow, setSelectedWindow] = useState<Window>("فترة الظهر");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const submit = () => {
    onAdd({
      title: note ? note : `إشعار جديد - ${selectedWindow}`,
      duration: selectedDuration,
      imageUrl: previewUrl || undefined,
    });
    // reset
    setNote("");
    setSelectedDuration("8 ساعات");
    setSelectedWindow("فترة الظهر");
    setFile(null);
  };

  return (
    <div className="bg-white rounded-[28px] p-5 border">
      <h2 className="text-center text-[#C41F35] text-xl font-semibold mb-6">اضافة صورة إشعار عند دخول التطبيق</h2>

      {/* Upload */}
      <SectionTitle>ارفع صورة</SectionTitle>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 h-40 rounded-2xl bg-[#F6F6F6] border flex items-center justify-center text-gray-400">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="preview" className="h-full object-contain" />
          ) : (
            <span>اسحب وأفلت الصورة هنا</span>
          )}
        </div>
        <label className="h-40 rounded-2xl bg-[#F6F6F6] border flex flex-col items-center justify-center cursor-pointer">
          <svg width="34" height="34" viewBox="0 0 24 24"><path fill="#C41F35" d="M19 15v4H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4z"/><path fill="#C41F35" d="M11 16h2V8l3.5 3.5l1.42-1.42L12 4.66L7.08 10.08L8.5 11.5L11 9z"/></svg>
          <input type="file" accept="image/*" className="hidden" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} />
          <span className="text-[12px] text-gray-600 mt-2">اختر صورة</span>
        </label>
      </div>

      <div className="text-[11px] text-gray-400 mb-6">الحد: عدد صور مسموح به صورة واحدة فقط.</div>

      {/* Duration */}
      <SectionTitle>مدة بقاء الصورة</SectionTitle>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {durations.map((d) => (
          <PillButton key={d} active={d === selectedDuration} onClick={() => setSelectedDuration(d)}>
            {d}
          </PillButton>
        ))}
      </div>

      {/* Window */}
      <SectionTitle>نوع العرض</SectionTitle>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {windows.map((w) => (
          <PillButton key={w} active={w === selectedWindow} onClick={() => setSelectedWindow(w)}>
            {w}
          </PillButton>
        ))}
      </div>

      {/* Notes */}
      <SectionTitle>ملاحظة</SectionTitle>
      <textarea
        placeholder="اكتب ملاحظاتك هنا"
        className="w-full h-28 rounded-2xl bg-[#F6F6F6] border p-4 outline-none focus:border-[#C41F35]"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="mt-6 flex justify-center">
        <button onClick={submit} className="bg-[#C41F35] hover:bg-[#b31b2f] text-white rounded-full px-10 py-3 text-base font-medium">
          اضافة إشعار
        </button>
      </div>
    </div>
  );
};

/* -------------------- Right Sidebar -------------------- */
const RightSidebar: React.FC<{
  query: string;
  setQuery: (v: string) => void;
  items: PromoItem[];
}> = ({ query, setQuery, items }) => {
  return (
    <aside className="space-y-4 w-full">
      <div className="mb-4 flex justify-start" dir="rtl">
        <div className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3">
          <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-[#8989A2]/25">
            <Search className="text-[#8989A2]" />
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب ما تبحث عنه"
            className="h-12 rounded-2xl border-none bg-white/70 -inner"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold">نسبة المشاهدة الشهرية للصور</div>
        <CustomChart items={items} />
      </div>
    </aside>
  );
};

/* -------------------- Page (State Up) -------------------- */
export default function PromoAlertsPage() {
  // مصدر الحقيقة لكل شيء
  const [items, setItems] = useState<PromoItem[]>([
    {
      id: "1",
      title: "النائب: عبدالله سيد",
      timeAgo: "تم النشر منذ 3.00pm",
      views: 2357,
      duration: "مدة النشر 6 ساعات",
      createdAt: new Date().getTime() - 1000 * 60 * 60 * 24 * 40, // قبل ~40 يوم
    },
    {
      id: "2",
      title: "محمد محمد محمود",
      timeAgo: "تم النشر منذ 3.00pm",
      views: 15234,
      duration: "مدة النشر 8 ساعات",
      createdAt: new Date().getTime() - 1000 * 60 * 60 * 24 * 10, // قبل ~10 أيام
    },
  ]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items.filter((it) => it.title.includes(q) || it.duration.includes(q));
  }, [items, query]);

  const handleAdd = (payload: Omit<PromoItem, "id" | "createdAt" | "views" | "timeAgo">) => {
    const now = Date.now();
    setItems((prev) => [
      {
        id: String(Math.random()).slice(2),
        title: payload.title,
        duration: payload.duration,
        imageUrl: payload.imageUrl,
        views: 0,
        createdAt: now,
        timeAgo: "الآن",
      },
      ...prev,
    ]);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const handleRefreshTime = (id: string) => {
    setItems((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, createdAt: Date.now(), timeAgo: "الآن" } : x
      )
    );
  };

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto p-4 md:p-6 !pl-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-3">
            <LeftList items={filtered} onDelete={handleDelete} onRefreshTime={handleRefreshTime} />
          </div>

          <div className="lg:col-span-6">
            <CenterForm onAdd={handleAdd} />
          </div>

          <div className="lg:col-span-3">
            <RightSidebar query={query} setQuery={setQuery} items={items} />
          </div>
        </div>
      </div>
    </main>
  );
}
