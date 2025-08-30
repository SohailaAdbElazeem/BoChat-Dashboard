'use client';
import RequireAuth from '../_components/RequireAuth';
import DashboardCharts from '../_components/DashboardCharts';
import './main.css'
import { dashboardStats, userGrowth } from '@/data/DashboardMockData';
import UserGrowthStats from '../_components/UserGrowthStats';
import CustomChart from '../_components/CustomChart';
import LastLogins, { RegistrationRow } from '../_components/LastLogins';
import ActionBar from '../_components/ActionBar';

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
  <div className="container main-page">
    <div >
      <div className='mb-[15px]'>
        <ActionBar/>
      </div>
      <div className='charts-container'>
        <DashboardCharts
          data={pieData}
          percentage={percentage}
        />
        <UserGrowthStats
          data={userGrowth}
          title="نمو المستخدمين حسب الأشهر"
          sideLabel="عدد المستخدمين"
        />
        <LastLogins
        />
      </div>
    </div>
    <aside className="right-col">
      <CustomChart />
    </aside>
  </div>
</RequireAuth>

  );
}

export default MainPage;
