'use client';
import RequireAuth from '../_components/RequireAuth';
import DashboardCharts from '../_components/DashboardCharts';
// import UserGrowthChart from '../_components/UserGrowthChart';

import { dashboardStats, userGrowth } from '@/data/DashboardMockData';
import UserGrowthStats from '../_components/UserGrowthStats';

function MainPage() {
  const pieData = [
    { name: 'غير نشط', value: dashboardStats.blocked },
    { name: 'نشط', value: dashboardStats.activeUsers },
    { name: 'مشرفين للمحتوى', value: dashboardStats.tips },
    { name: 'مشاهدون فقط', value: dashboardStats.posts },
  ];

  const percentage = `${dashboardStats.percentage}%`;

  return (
    <RequireAuth>
      <main className="py-5 container px-[50px] flex gap-[10px]">
        <DashboardCharts data={pieData} percentage={percentage} />
        <UserGrowthStats data={userGrowth} title="نمو المستخدمين حسب الأشهر" sideLabel="عدد المستخدمين" />
      </main>
    </RequireAuth>
  );
}

export default MainPage;
