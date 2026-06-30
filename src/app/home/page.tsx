/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';

import RequireAuth from '../_components/RequireAuth';
import './main.css';
import UserGrowthStats from '../_components/UserGrowthStats';
import LastLogins from '../_components/LastLogins';
import ActionBar from '../_components/ActionBar';
import UserPieStats, { ApiResponse } from '../_components/UserPieStats';
import CustomChart, { StaticChartPoint } from '../_components/CustomChart';
import SearchBar from '../_components/SearchBar';

type LoginStatsResponse = {
  logs: number;
  stats: {
    day?: number;
    days2?: number;
    week?: number;
    month?: number;
    halfYear?: number;
    year?: number;
    allTime?: number;
    [k: string]: number | undefined;
  };
};

const STAT_LABELS_AR: Record<keyof NonNullable<LoginStatsResponse['stats']>, string> = {
  day: 'اليوم',
  days2: 'آخر يومين',
  week: 'أسبوع',
  month: 'شهر',
  halfYear: '6 أشهر',
  year: 'سنة',
  allTime: 'طوال المدة',
};

const fakeData: StaticChartPoint[] = [
  { name: 'يناير', value: 30000, value2: 20000, value3: 60000 },
  { name: 'فبراير', value: 35000, value2: 25000, value3: 65000 },
  { name: 'مارس', value: 50000, value2: 30000, value3: 70000 },
  { name: 'أبريل', value: 55000, value2: 35000, value3: 75000 },
  { name: 'مايو', value: 70000, value2: 40000, value3: 80000 },
  { name: 'يونيو', value: 75000, value2: 45000, value3: 85000 },
];

function toGrowthSeries(res: LoginStatsResponse) {
  const s = res?.stats ?? {};
  const order: (keyof typeof STAT_LABELS_AR)[] = [
    'day',
    'days2',
    'week',
    'month',
    'halfYear',
    'year',
    'allTime',
  ];
  return order.map((k) => ({
    month: STAT_LABELS_AR[k],
    value: Number(s[k] ?? 0),
  }));
}

function MainPage() {
  // ===== Const config =====
  const duration = 'allTime';
  // const apiUrl = 'https://bo-chat.space/totalStatistics';
  const apiUrl = 'https://bo-chat.space/dashboard/features/TotalStatistics';
  const loginStatsUrl = 'https://bo-chat.space/features/LogInStatistics'; // نفس الشكل اللي انت بعته
  const tokenKey = 'token';

  // ===== State =====
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [growthSeries, setGrowthSeries] = useState<{ month: string; value: number }[]>([]);
  const [query, setQuery] = useState<string>(''); // <-- مضافة

  // ===== Effects =====
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem(tokenKey) ??
          localStorage.getItem('authToken') ??
          localStorage.getItem('access_token') ??
          localStorage.getItem('jwt') ??
          '';

        if (!token) {
          setError('لم يتم العثور على التوكن في المتصفح.');
          setLoading(false);
          return;
        }

        const [pieRes, growthRes] = await Promise.all([
          fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ duration }),
            signal: controller.signal,
          }),
          fetch(loginStatsUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }),
        ]);

        if (!pieRes.ok) {
          const text = await pieRes.text().catch(() => '');
          throw new Error(`Pie HTTP ${pieRes.status} — ${text || pieRes.statusText}`);
        }
        if (!growthRes.ok) {
          const text = await growthRes.text().catch(() => '');
          throw new Error(`Growth HTTP ${growthRes.status} — ${text || growthRes.statusText}`);
        }

        const pieJson = (await pieRes.json()) as ApiResponse;
        const growthJson = (await growthRes.json()) as LoginStatsResponse;

        setApiData(pieJson);
        setGrowthSeries(toGrowthSeries(growthJson));
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          setError(e?.message || 'خطأ غير متوقع أثناء جلب البيانات.');
        }
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [apiUrl, loginStatsUrl, duration, tokenKey]);

  return (
    <RequireAuth>
      <div className="main-page">
        <div>
          <div className="mb-[15px]">
            <ActionBar />
          </div>
          <div className="">
            <div className='flex gap-4'>
            <UserPieStats
              apiData={apiData}
              loading={loading}
              error={error}
              title="المستخدمين النشطين"
              sideLabel="اجمالي النسب"
              />
            <UserGrowthStats
              data={growthSeries}
              title="نمو المستخدمين حسب الأشهر"
              sideLabel="عدد المستخدمين"
              />
              </div>
            <LastLogins filterQuery={query}/>
          </div>
        </div>
        <aside className="right-col">
          <SearchBar
            value={query}
            onValueChange={setQuery}
            onSubmit={(val) => setQuery(val)}
            placeholder="اكتب ما تبحث عنه"
            dir="rtl"
            className="mb-2"
          />
          <CustomChart
            apiUrl="https://bo-chat.space/reactStatistics"
            tokenKey={tokenKey}
            staticData1={fakeData}
            staticData2={fakeData}
            apiLineName="تفاعلات آخر 30 يوم"
            height={200}
          />
        </aside>
      </div>
    </RequireAuth>
  );
}

export default MainPage;
