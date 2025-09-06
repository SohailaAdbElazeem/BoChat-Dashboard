/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ===== Types =====
export interface StaticChartPoint {
  name: string;   // label on X axis (e.g., "يناير")
  value: number;
  value2?: number;
  value3?: number;
}

type ApiRow = { day: string; count: number };

type Props = {
  /** API endpoint that returns [{ day: 'YYYY-MM-DD', count: number }, ...] */
  apiUrl: string;
  /** localStorage key for bearer token (we'll also try common fallbacks) */
  tokenKey?: string;

  /** the two static datasets (will be used as-is) */
  staticData1: StaticChartPoint[];
  staticData2: StaticChartPoint[];

  /** optional overrides */
  apiLineName?: string;
  height?: number;
};

// ===== Helpers =====
const formatNumber = (num: number): string => (num >= 1000 ? (num / 1000).toFixed(1) + 'K' : String(num));

/** Get token from localStorage with a few common fallbacks */
function getToken(primaryKey?: string): string {
  const candidates = [
    primaryKey,
    'authToken',
    'access_token',
    'jwt',
    'token',
  ].filter(Boolean) as string[];

  for (const k of candidates) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return '';
}

/** Transform API rows to recharts points */
function mapApiRows(rows: ApiRow[]) {
  // X-axis label => use day as-is (YYYY-MM-DD). You can format if you like.
  return rows.map(r => ({ name: r.day, count: r.count }));
}

// ===== Component =====
const CustomChart: React.FC<Props> = ({
  apiUrl,
  tokenKey,
  staticData1,
  staticData2,
  apiLineName = 'تفاعلات آخر 30 يوم',
  height = 200,
}) => {
  const [apiPoints, setApiPoints] = useState<{ name: string; count: number }[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingApi, setLoadingApi] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoadingApi(true);
        setApiError(null);

        const token = getToken(tokenKey);
        if (!token) {
          setApiError('لم يتم العثور على التوكن في المتصفح.');
          setLoadingApi(false);
          return;
        }

        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} — ${text || res.statusText}`);
        }

        const json = (await res.json()) as ApiRow[];
        setApiPoints(mapApiRows(json ?? []));
      } catch (e: any) {
        if (e?.name !== 'AbortError') setApiError(e?.message || 'خطأ أثناء جلب بيانات التفاعلات.');
      } finally {
        setLoadingApi(false);
      }
    })();
    return () => controller.abort();
  }, [apiUrl, tokenKey]);

  // Skeleton بسيط
  const skeleton = (
    <div style={{ height }} className="w-full rounded-[16px] bg-[#eee] animate-pulse" />
  );

  // ===== Renderers =====
  const renderApiChart = useMemo(() => {
    if (loadingApi) return skeleton;
    if (apiError) {
      return (
        <div className="p-3 rounded-[12px] bg-[#fee2e2] text-[#991b1b]" style={{ minHeight: height }}>
          {apiError}
        </div>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={height} className="right-chart">
        <LineChart data={apiPoints}>
          <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
          <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => formatNumber(value)} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#1f77b4"
            strokeWidth={1.5}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
            name={apiLineName}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }, [loadingApi, skeleton, apiError, height, apiPoints, apiLineName]);

  const renderStaticChart = (data: StaticChartPoint[]) => (
    <ResponsiveContainer width="100%" height={height} className="right-chart">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
        <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value: number) => formatNumber(value as number)} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={1}
          dot={{ r: 4 }}
          activeDot={{ r: 4 }}
          name="نسبة التفاعل الشهري"
        />
        <Line
          type="monotone"
          dataKey="value2"
          stroke="#ff7300"
          strokeWidth={1}
          dot={{ r: 4 }}
          activeDot={{ r: 4 }}
          name="معدل الاحتفاظ بالمستخدمين"
        />
        <Line
          type="monotone"
          dataKey="value3"
          stroke="#387908"
          strokeWidth={1}
          dot={{ r: 4 }}
          activeDot={{ r: 4 }}
          name="إكمال الملفات الشخصية"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-[#F6F6F6] rounded-[40px] py-[40px] px-[20px]" style={{ maxWidth: '100%' }}>
      <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 1) API */}
        {renderApiChart}
        {/* 2) Static #1 */}
        {renderStaticChart(staticData1)}
        {/* 3) Static #2 */}
        {renderStaticChart(staticData2)}
      </div>
    </div>
  );
};

export default CustomChart;
