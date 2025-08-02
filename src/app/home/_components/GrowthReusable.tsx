'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import dayjs from 'dayjs';
import { registrationLogs, dashboardStats } from '@/data/DashboardMockData';

const COLORS = ['#dc3545', '#28a745', '#facc15', '#3b82f6'];

export default function DashboardCharts() {
  const filteredGrowth = useMemo(() => {
    return registrationLogs.map((entry, index) => ({
      date: dayjs().subtract(index, 'day').format('YYYY-MM-DD'),
      users: index * 100 + 1000, // Mock value for growth
    })).reverse();
  }, []);

  const filteredBi = useMemo(() => {
    return registrationLogs.map((entry, index) => ({
      date: dayjs().subtract(index, 'day').format('YYYY-MM-DD'),
      active: entry.status === 'نشط' ? 1 : 0,
      inactive: entry.status !== 'نشط' ? 1 : 0,
    })).reverse();
  }, []);

  const userActivityData = [
    { name: 'غير نشط', value: 1200 },
    { name: 'نشط', value: 100 },
    { name: 'مشرفين للمحتوى', value: 3500 },
    { name: 'مشاهدون فقط', value: 1000 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
      {/* BiChart Representation like image */}
      <div className="bg-white dark:bg-[#f6f6f6] p-4 rounded-xl shadow col-span-1">
        <h2 className="text-lg font-bold mb-2 text-right text-[#D72229]">المستخدمين النشطين</h2>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={userActivityData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {userActivityData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center text-2xl font-bold text-[#D72229]">25.4%</div>
        <div className="flex justify-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#dc3545] rounded-full"></span> غير نشط</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#28a745] rounded-full"></span> نشط</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#facc15] rounded-full"></span> مشرفين للمحتوى</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#3b82f6] rounded-full"></span> مشاهدون فقط</div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white dark:bg-[#f6f6f6] p-4 rounded-xl shadow col-span-1 md:col-span-2">
        <h2 className="text-lg font-bold mb-2 text-right text-[#D72229]">نسبة نمو عدد المستخدمين</h2>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={filteredGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" reversed />
            <YAxis />
            <Tooltip />
            <Brush dataKey="date" height={30} stroke="#D72229" />
            <Line type="monotone" dataKey="users" stroke="#D72229" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bi Comparison Chart */}
      <div className="bg-white dark:bg-[#f6f6f6] p-4 rounded-xl shadow col-span-full">
        <h2 className="text-lg font-bold mb-2 text-right text-[#D72229]">المستخدمين النشطين مقابل غير النشطين</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredBi}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" reversed />
            <YAxis />
            <Tooltip />
            <Legend />
            <Brush dataKey="date" height={30} stroke="#D72229" />
            <Bar dataKey="active" fill="#28a745" name="نشط" />
            <Bar dataKey="inactive" fill="#dc3545" name="غير نشط" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}