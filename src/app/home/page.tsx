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

const rows: RegistrationRow[] = [
  {
    index: 1,
    avatarUrl: '/avatars/1.png',
    userName: 'احمد محمد',
    id: 'ID23896590',
    status: 'نشط',
    birthDate: '1/8/2010',
    emailOrPhone: '01060507080',
    type: 'جوجل',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
  {
    index: 2,
    avatarUrl: '/avatars/2.png',
    userName: 'احمد محمد',
    id: 'ID23896590',
    status: 'غير نشط',
    birthDate: '1/8/2010',
    emailOrPhone: '01060507080',
    type: 'انشاء حساب',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
  {
    index: 3,
    avatarUrl: '/avatars/3.png',
    userName: 'محمد احمد',
    id: 'ID23896590',
    status: 'نشط',
    birthDate: '1/8/2010',
    emailOrPhone: 'boapp2023@gmail.com',
    type: 'فيسبوك',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
    {
      index: 12,
      avatarUrl: '/avatars/1.png',
      userName: 'احمد محمد',
      id: 'ID23896590',
      status: 'نشط',
      birthDate: '1/8/2010',
      emailOrPhone: '01060507080',
      type: 'جوجل',
      governorate: '',
      gender: '',
      role: '',
      country: undefined,
      no: undefined,
      postImages: undefined,
      comments: undefined,
      likes: undefined,
      publishedAgo: undefined,
      avatar: undefined,
      views: undefined,
      postType: undefined
    },
  {
    index: 23,
    avatarUrl: '/avatars/2.png',
    userName: 'احمد محمد',
    id: 'ID23896590',
    status: 'غير نشط',
    birthDate: '1/8/2010',
    emailOrPhone: '01060507080',
    type: 'انشاء حساب',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
  {
    index: 34,
    avatarUrl: '/avatars/3.png',
    userName: 'محمد احمد',
    id: 'ID23896590',
    status: 'نشط',
    birthDate: '1/8/2010',
    emailOrPhone: 'boapp2023@gmail.com',
    type: 'فيسبوك',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
    {
      index: 15,
      avatarUrl: '/avatars/1.png',
      userName: 'احمد محمد',
      id: 'ID23896590',
      status: 'نشط',
      birthDate: '1/8/2010',
      emailOrPhone: '01060507080',
      type: 'جوجل',
      governorate: '',
      gender: '',
      role: '',
      country: undefined,
      no: undefined,
      postImages: undefined,
      comments: undefined,
      likes: undefined,
      publishedAgo: undefined,
      avatar: undefined,
      views: undefined,
      postType: undefined
    },
  {
    index: 26,
    avatarUrl: '/avatars/2.png',
    userName: 'احمد محمد',
    id: 'ID23896590',
    status: 'غير نشط',
    birthDate: '1/8/2010',
    emailOrPhone: '01060507080',
    type: 'انشاء حساب',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
  {
    index: 37,
    avatarUrl: '/avatars/3.png',
    userName: 'محمد احمد',
    id: 'ID23896590',
    status: 'نشط',
    birthDate: '1/8/2010',
    emailOrPhone: 'boapp2023@gmail.com',
    type: 'فيسبوك',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
    {
      index: 18,
      avatarUrl: '/avatars/1.png',
      userName: 'احمد محمد',
      id: 'ID23896590',
      status: 'نشط',
      birthDate: '1/8/2010',
      emailOrPhone: '01060507080',
      type: 'جوجل',
      governorate: '',
      gender: '',
      role: '',
      country: undefined,
      no: undefined,
      postImages: undefined,
      comments: undefined,
      likes: undefined,
      publishedAgo: undefined,
      avatar: undefined,
      views: undefined,
      postType: undefined
    },
  {
    index: 29,
    avatarUrl: '/avatars/2.png',
    userName: 'احمد محمد',
    id: 'ID23896590',
    status: 'غير نشط',
    birthDate: '1/8/2010',
    emailOrPhone: '01060507080',
    type: 'انشاء حساب',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
  {
    index: 30,
    avatarUrl: '/avatars/3.png',
    userName: 'محمد احمد',
    id: 'ID23896590',
    status: 'نشط',
    birthDate: '1/8/2010',
    emailOrPhone: 'boapp2023@gmail.com',
    type: 'فيسبوك',
    governorate: '',
    gender: '',
    role: '',
    country: undefined,
    no: undefined,
    postImages: undefined,
    comments: undefined,
    likes: undefined,
    publishedAgo: undefined,
    avatar: undefined,
    views: undefined,
    postType: undefined
  },
];

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
          rows={rows}
          onRowClick={(r) => console.log('row clicked', r)}
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
