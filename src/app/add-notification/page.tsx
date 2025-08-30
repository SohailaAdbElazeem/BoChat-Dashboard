/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Search } from "lucide-react";
import ScrollablePills from "./_components/ScrollablePills";
import SelectDropdown from "./_components/SelectDropdown";
import { LeftSidebar } from "./_components/LeftSideBar";

const formatNumber = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};
const windows = [
  "كل المستخدمين",
  "اسم المنتج",
  "مرسل الإشعار",
  "مستقبل الإشعار",
  "صورة المنشور",
  "موضوع المنشور",
  "صورة المستخدم",
  "اسم المستخدم",
  "مستخدم جديد",
];
const noteOptions = [
  { label: "كل المستخدمين", value: "all" },
  { label: "مستخدم جديد", value: "new_user" },
  { label: "اسم المنتج", value: "product_name" },
  { label: "مرسل الإشعار", value: "sender" },
  { label: "مستقبل الإشعار", value: "receiver" },
  { label: "صورة المنشور", value: "post_image" },
  { label: "موضوع المنشور", value: "post_subject" },
];
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

const PillButton: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border transition-all text-sm
      ${
        active
          ? "bg-[#C41F35] text-white "
          : "bg-[#F6F6F6] text-[#333] "
      }`}
  >
    {children}
  </button>
);

function monthKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  return `${months[(m - 1) % 12]}`;
}

const CustomChart: React.FC<{ items: PromoItem[]; title: string }> = ({ items, title }) => {
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
    }));
  }, [items]);

  return (
    <div className="bg-[#F6F6F6] rounded-lg p-4 mb-4">
      <h3 className="text-[#C41F35] text-sm font-semibold mb-3 text-right">{title}</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#888' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#888' }}
              tickFormatter={formatNumber}
            />
            <Tooltip 
              formatter={(value: number) => formatNumber(value)}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4F46E5" 
              strokeWidth={2} 
              dot={{ r: 3, fill: '#4F46E5' }}
              activeDot={{ r: 4, fill: '#4F46E5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100 ألف</span>
      </div>
    </div>
  );
};


/* -------------------- Center Form -------------------- */

const CenterForm: React.FC<{
  onAdd: (item: Omit<PromoItem, "id" | "createdAt" | "views" | "timeAgo">) => void;
}> = ({ onAdd }) => {
  const [selectedDuration, setSelectedDuration] = useState<Duration>("8 ساعات");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const submit = () => {
    onAdd({
      title: note || `إشعار جديد - ${selectedWindow}`,
      duration: selectedDuration,
      imageUrl: previewUrl || undefined,
    });
    // reset
    setNote("");
    setSelectedDuration("8 ساعات");
    setSelectedWindow("فترة الظهر");
    setFile(null);
  };
  const [selectedWindow, setSelectedWindow] = useState(windows[0]);

  return (
    <div className="bg-[#F6F6F6] rounded-lg p-6">
      <h2 className="text-center text-[#C41F35] text-xl font-semibold mb-8">إضافة إشعار للمستخدمين</h2>

      {/* عنوان الإشعار */}
      <div className="mb-6 text-right">
        <label className="block text-gray-700 font-semibold mb-3">عنوان الإشعار</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="اكتب هنا عنوان الإشعار"
          className="w-full p-3   rounded-lg bg-[#E6E6E6] text-right focus:outline-none "
        />
      </div>

      {/* نوع الإشعار */}
    <div className="mb-6 text-right">
      <label className="block text-gray-700 font-semibold mb-3">نوع الإشعار</label>

      <SelectDropdown
        options={noteOptions}
        value={note}
        onChange={setNote}
        placeholder="اختر نوع الإشعار من القائمة"
      />
    </div>

      {/* التوضيح */}
      <div className="mb-6 text-right">
        <label className="block text-gray-700 font-semibold mb-3">التوضيح</label>
        <textarea
          placeholder="اكتب هنا توضيح الإشعار"
          className="w-full h-24 p-3  rounded-lg bg-[#E6E6E6] text-right resize-none focus:outline-none"
        />
      </div>
        <div className="mb-6 text-right">

        <ScrollablePills
            items={windows}
            value={selectedWindow}
            onChange={setSelectedWindow}
            className="py-1"
        />
        </div>
      {/* رفع صورة */}
<div className="mb-6 text-right">
  <label className="block text-gray-700 font-semibold mb-3">ارفع صورة</label>

  <div className="flex items-center gap-4 bg-[#E6E6E6] rounded-2xl p-4">
    {/* مساحة المعاينة */}
    <div className="flex-1 h-40 rounded-2xl  flex items-center justify-center relative">
      {previewUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-40 rounded-2xl object-contain"
          />
          <button
            onClick={() => setFile(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
          >
            ×
          </button>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">لم يتم اختيار صورة</span>
      )}
    </div>

    {/* زر رفع الصورة */}
    <div className="shrink-0 w-[150px] h-[150px] bg-[#F6F6F6] rounded-2xl flex items-center justify-center">
      <label
        htmlFor="file-upload"
        className="w-16 h-16 bg-red-200 hover:bg-red-300 rounded-full flex items-center justify-center cursor-pointer transition"
      >
        <img src="/imgs/Vector.png" width={30} height={30} alt="" />
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
    </div>
  </div>

  {/* نص تنبيه تحت */}
  <p className="text-gray-500 text-sm mt-2 text-center underline cursor-default">
    اذا اردت ان تضف صورة اقصي عدد صور مسموح به هو صورة واحدة فقط
  </p>
</div>




      <div className="text-center px-[50px]">
        <button
          onClick={submit}
          className="bg-[#D72229] hover:bg-[#b31b2f] text-white px-8 py-4 rounded-[20px] font-medium transition-colors w-full "
        >
          إضافة إشعار
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
    <div className="space-y-6">
        <div className="flex w-full max-w-[360px] items-center gap-3 rounded-2xl bg-[#F6F6F6] p-3" dir='rtl'>
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

      {/* Charts */}
      <CustomChart items={items} title="نسبة المشاهدة الشهرية للإشعارات" />
      <CustomChart items={items} title="إحصائيات معدل النقر" />
    </div>
  );
};

/* -------------------- Main Component -------------------- */
export default function PromoAlertsPage() {
  const [items, setItems] = useState<PromoItem[]>([
    {
      id: "1",
      title: "النائب: عبدالله سيد",
      timeAgo: "تم النشر منذ 3.00pm",
      views: 2357,
      duration: "مدة النشر 6 ساعات",
      createdAt: new Date().getTime() - 1000 * 60 * 60 * 24 * 40,
    },
    {
      id: "2", 
      title: "محمد محمد محمود",
      timeAgo: "تم النشر منذ 3.00pm",
      views: 15234,
      duration: "مدة النشر 8 ساعات",
      createdAt: new Date().getTime() - 1000 * 60 * 60 * 24 * 10,
    },
  ]);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items.filter((item) => 
      item.title.includes(q) || item.duration.includes(q)
    );
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
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-6 !pl-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Left Sidebar */}
          <div className="lg:col-span-4">
            <LeftSidebar
                          items={filtered}
                          onDelete={handleDelete} onEdit={function (id: string): void {
                              throw new Error("Function not implemented.");
                          } }            />
          </div>

          {/* Center Form */}
          <div className="lg:col-span-5">
            <CenterForm onAdd={handleAdd} />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <RightSidebar 
              query={query} 
              setQuery={setQuery} 
              items={items} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}