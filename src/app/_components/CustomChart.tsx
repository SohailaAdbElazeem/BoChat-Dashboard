  // /* eslint-disable react-hooks/exhaustive-deps */
  // /* eslint-disable @typescript-eslint/no-explicit-any */
  // 'use client';

  // import React, { useEffect, useMemo, useState } from 'react';
  // import {
  //   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  // } from 'recharts';

  // // ===== Types =====
  // export interface StaticChartPoint {
  //   name: string;   // label on X axis (e.g., "يناير")
  //   value: number;
  //   value2?: number;
  //   value3?: number;
  // }

  // type ApiRow = { day: string; count: number };

  // type Props = {
  //   /** API endpoint that returns [{ day: 'YYYY-MM-DD', count: number }, ...] */
  //   apiUrl: string;
  //   /** localStorage key for bearer token (we'll also try common fallbacks) */
  //   tokenKey?: string;

  //   /** the two static datasets (will be used as-is) */
  //   staticData1: StaticChartPoint[];
  //   staticData2: StaticChartPoint[];

  //   /** optional overrides */
  //   apiLineName?: string;
  //   height?: number;
  // };

  // // ===== Helpers =====
  // const formatNumber = (num: number): string => (num >= 1000 ? (num / 1000).toFixed(1) + 'K' : String(num));

  // /** Get token from localStorage with a few common fallbacks */
  // function getToken(primaryKey?: string): string {
  //   const candidates = [
  //     primaryKey,
  //     'authToken',
  //     'access_token',
  //     'jwt',
  //     'token',
  //   ].filter(Boolean) as string[];

  //   for (const k of candidates) {
  //     const v = localStorage.getItem(k);
  //     if (v) return v;
  //   }
  //   return '';
  // }

  // /** Transform API rows to recharts points */
  // function mapApiRows(rows: ApiRow[]) {
  //   return rows.map(r => ({ name: r.day, count: r.count }));
  // }

  // // ===== Component =====
  // const CustomChart: React.FC<Props> = ({
  //   apiUrl,
  //   tokenKey,
  //   staticData1,
  //   staticData2,
  //   apiLineName = 'تفاعلات آخر 30 يوم',
  //   height = 200,
  // }) => {
  //   const [apiPoints, setApiPoints] = useState<{ name: string; count: number }[]>([]);
  //   const [apiError, setApiError] = useState<string | null>(null);
  //   const [loadingApi, setLoadingApi] = useState<boolean>(false);

  //   useEffect(() => {
  //     const controller = new AbortController();
  //     (async () => {
  //       try {
  //         setLoadingApi(true);
  //         setApiError(null);

  //         const token = getToken(tokenKey);
  //         if (!token) {
  //           setApiError('لم يتم العثور على التوكن في المتصفح.');
  //           setLoadingApi(false);
  //           return;
  //         }

  //         const res = await fetch(apiUrl, {
  //           method: 'GET',
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //           signal: controller.signal,
  //         });

  //         if (!res.ok) {
  //           const text = await res.text().catch(() => '');
  //           throw new Error(`HTTP ${res.status} — ${text || res.statusText}`);
  //         }

  //         const json = (await res.json()) as ApiRow[];
  //         setApiPoints(mapApiRows(json ?? []));
  //       } catch (e: any) {
  //         if (e?.name !== 'AbortError') setApiError(e?.message || 'خطأ أثناء جلب بيانات التفاعلات.');
  //       } finally {
  //         setLoadingApi(false);
  //       }
  //     })();
  //     return () => controller.abort();
  //   }, [apiUrl, tokenKey]);

  //   const skeleton = (
  //     <div style={{ height }} className="w-full rounded-[16px] bg-[#eee] animate-pulse" />
  //   );

  //   // ===== Renderers =====
  //   const renderApiChart = useMemo(() => {
  //     if (loadingApi) return skeleton;
  //     if (apiError) {
  //       return (
  //         <div className="p-3 rounded-[12px] bg-[#fee2e2] text-[#991b1b]" style={{ minHeight: height }}>
  //           {apiError}
  //         </div>
  //       );
  //     }
  //     return (
  //       <div>
  //         <h1 className='text-right text-[#D72229] text-[20px]'>نسبة التفاعل الشهري</h1>
  //         <ResponsiveContainer width="100%" height={height} className="right-chart">
  //           <LineChart data={apiPoints}>
  //             <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
  //             <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
  //             <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
  //             <Tooltip formatter={(value: number) => formatNumber(value)} />
  //             <Line
  //               type="monotone"
  //               dataKey="count"
  //               stroke="#1f77b4"
  //               strokeWidth={1.5}
  //               dot={{ r: 3 }}
  //               activeDot={{ r: 4 }}
  //               name={apiLineName}
  //               />
  //           </LineChart>
  //         </ResponsiveContainer>
  //       </div>
  //     );
  //   }, [loadingApi, skeleton, apiError, height, apiPoints, apiLineName]);

  //   const renderStaticChart = (data: StaticChartPoint[]) => (
  //     <ResponsiveContainer width="100%" height={height} className="right-chart">
  //       <LineChart data={data}>
  //         <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
  //         <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
  //         <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
  //         <Tooltip formatter={(value: number) => formatNumber(value as number)} />
  //         <Line
  //           type="monotone"
  //           dataKey="value"
  //           stroke="#8884d8"
  //           strokeWidth={1}
  //           dot={{ r: 4 }}
  //           activeDot={{ r: 4 }}
  //           name="نسبة التفاعل الشهري"
  //         />
  //         <Line
  //           type="monotone"
  //           dataKey="value2"
  //           stroke="#ff7300"
  //           strokeWidth={1}
  //           dot={{ r: 4 }}
  //           activeDot={{ r: 4 }}
  //           name="معدل الاحتفاظ بالمستخدمين"
  //         />
  //         <Line
  //           type="monotone"
  //           dataKey="value3"
  //           stroke="#387908"
  //           strokeWidth={1}
  //           dot={{ r: 4 }}
  //           activeDot={{ r: 4 }}
  //           name="إكمال الملفات الشخصية"
  //         />
  //       </LineChart>
  //     </ResponsiveContainer>
  //   );

  //   return (
  //     <div className="bg-[#F6F6F6] rounded-[40px] py-[40px] px-[20px]" style={{ maxWidth: '100%' }}>
  //       <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
  //         {/* 1) API */}
  //         {renderApiChart}
  //         {/* 2) Static #1 */}
  //         {renderStaticChart(staticData1)}
  //         {/* 3) Static #2 */}
  //         {renderStaticChart(staticData2)}
  //       </div>
  //     </div>
  //   );
  // };

  // export default CustomChart;

////////////////////////////////////////////////////////

//   /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';

// // ===== Types =====
// export interface StaticChartPoint {
//   name: string;   // label on X axis (e.g., "يناير")
//   value: number;
//   value2?: number;
//   value3?: number;
// }

// type ApiRow = { day: string; count: number };

// type Props = {
//   /** API endpoint that returns { success: boolean, response: [{ day: 'YYYY-MM-DD', count: number }, ...] } */
//   apiUrl: string;
//   /** localStorage key for bearer token (we'll also try common fallbacks) */
//   tokenKey?: string;

//   /** the two static datasets (will be used as-is) */
//   staticData1: StaticChartPoint[];
//   staticData2: StaticChartPoint[];

//   /** optional overrides */
//   apiLineName?: string;
//   height?: number;
// };

// // ===== Helpers =====
// const formatNumber = (num: number): string => (num >= 1000 ? (num / 1000).toFixed(1) + 'K' : String(num));

// /** Get token from localStorage with a few common fallbacks */
// function getToken(primaryKey?: string): string {
//   const candidates = [
//     primaryKey,
//     'authToken',
//     'access_token',
//     'jwt',
//     'token',
//   ].filter(Boolean) as string[];

//   for (const k of candidates) {
//     const v = localStorage.getItem(k);
//     if (v) return v;
//   }
//   return '';
// }

// /** Transform API rows to recharts points */
// function mapApiRows(rows: ApiRow[]) {
//   return (Array.isArray(rows) ? rows : []).map(r => ({ name: r.day, count: r.count }));
// }

// // ===== Component =====
// const CustomChart: React.FC<Props> = ({
//   apiUrl,
//   tokenKey,
//   staticData1,
//   staticData2,
//   apiLineName = 'تفاعلات آخر 30 يوم',
//   height = 200,
// }) => {
//   const [apiPoints, setApiPoints] = useState<{ name: string; count: number }[]>([]);
//   const [apiError, setApiError] = useState<string | null>(null);
//   const [loadingApi, setLoadingApi] = useState<boolean>(false);

//   useEffect(() => {
//     const controller = new AbortController();
//     (async () => {
//       try {
//         setLoadingApi(true);
//         setApiError(null);

//         const token = getToken(tokenKey);
//         if (!token) {
//           setApiError('لم يتم العثور على التوكن في المتصفح.');
//           setLoadingApi(false);
//           return;
//         }

//         const res = await fetch(apiUrl, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           signal: controller.signal,
//         });

//         if (!res.ok) {
//           const text = await res.text().catch(() => '');
//           throw new Error(`HTTP ${res.status} — ${text || res.statusText}`);
//         }

//         const json = await res.json();
        
//         // استخراج المصفوفة بأمان سواء كانت الاستجابة مباشرة أو داخل كائن response أو data
//         const rowsArray = Array.isArray(json) 
//           ? json 
//           : Array.isArray(json?.response) 
//           ? json.response 
//           : Array.isArray(json?.data) 
//           ? json.data 
//           : [];

//         setApiPoints(mapApiRows(rowsArray));
//       } catch (e: any) {
//         if (e?.name !== 'AbortError') setApiError(e?.message || 'خطأ أثناء جلب بيانات التفاعلات.');
//       } finally {
//         setLoadingApi(false);
//       }
//     })();
//     return () => controller.abort();
//   }, [apiUrl, tokenKey]);

//   const skeleton = (
//     <div style={{ height }} className="w-full rounded-[16px] bg-[#eee] animate-pulse" />
//   );

//   // ===== Renderers =====
//   const renderApiChart = useMemo(() => {
//     if (loadingApi) return skeleton;
//     if (apiError) {
//       return (
//         <div className="p-3 rounded-[12px] bg-[#fee2e2] text-[#991b1b]" style={{ minHeight: height }}>
//           {apiError}
//         </div>
//       );
//     }
//     return (
//       <div>
//         <h1 className='text-right text-[#D72229] text-[20px]'>نسبة التفاعل الشهري</h1>
//         <ResponsiveContainer width="100%" height={height} className="right-chart">
//           <LineChart data={apiPoints}>
//             <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
//             <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
//             <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
//             <Tooltip formatter={(value: number) => formatNumber(value)} />
//             <Line
//               type="monotone"
//               dataKey="count"
//               stroke="#1f77b4"
//               strokeWidth={1.5}
//               dot={{ r: 3 }}
//               activeDot={{ r: 4 }}
//               name={apiLineName}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     );
//   }, [loadingApi, skeleton, apiError, height, apiPoints, apiLineName]);

//   const renderStaticChart = (data: StaticChartPoint[]) => (
//     <ResponsiveContainer width="100%" height={height} className="right-chart">
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
//         <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
//         <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
//         <Tooltip formatter={(value: number) => formatNumber(value as number)} />
//         <Line
//           type="monotone"
//           dataKey="value"
//           stroke="#8884d8"
//           strokeWidth={1}
//           dot={{ r: 4 }}
//           activeDot={{ r: 4 }}
//           name="نسبة التفاعل الشهري"
//         />
//         <Line
//           type="monotone"
//           dataKey="value2"
//           stroke="#ff7300"
//           strokeWidth={1}
//           dot={{ r: 4 }}
//           activeDot={{ r: 4 }}
//           name="معدل الاحتفاظ بالمستخدمين"
//         />
//         <Line
//           type="monotone"
//           dataKey="value3"
//           stroke="#387908"
//           strokeWidth={1}
//           dot={{ r: 4 }}
//           activeDot={{ r: 4 }}
//           name="إكمال الملفات الشخصية"
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );

//   return (
//     <div className="bg-[#F6F6F6] rounded-[40px] py-[40px] px-[20px]" style={{ maxWidth: '100%' }}>
//       <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//         {/* 1) API */}
//         {renderApiChart}
//         {/* 2) Static #1 */}
//         {renderStaticChart(staticData1)}
//         {/* 3) Static #2 */}
//         {renderStaticChart(staticData2)}
//       </div>
//     </div>
//   );
// };

// export default CustomChart;















// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
// } from 'recharts';

// // ===== Types =====
// export interface StaticChartPoint {
//   name: string;
//   value: number;
//   value2?: number;
//   value3?: number;
//   [key: string]: any; // للسماح بإضافة حقول إضافية
// }

// export interface ChartConfig {
//   // نوع الرسم البياني
//   type: 'line' | 'bar' | 'pie' | 'area';
//   // عنوان الرسم البياني
//   title: string;
//   // اللون الأساسي
//   color?: string;
//   // ألوان متعددة للرسوم البيانية التي تحتاج أكثر من لون
//   colors?: string[];
//   // اسم حقل البيانات الرئيسي
//   dataKey?: string;
//   // أسماء حقول البيانات الإضافية
//   dataKeys?: string[];
//   // عرض النسب المئوية
//   showPercentage?: boolean;
//   // عرض الأسطورة
//   showLegend?: boolean;
//   // ارتفاع الرسم البياني
//   height?: number;
//   // تنسيق مخصص للـ tooltip
//   tooltipFormatter?: (value: any) => string;
//   // تسميات مخصصة
//   labels?: {
//     xAxis?: string;
//     yAxis?: string;
//   };
// }

// type Props = {
//   // API endpoint
//   apiUrl?: string;
//   tokenKey?: string;
  
//   // بيانات ثابتة
//   staticData?: StaticChartPoint[];
//   staticData1?: StaticChartPoint[];
//   staticData2?: StaticChartPoint[];
  
//   // تكوين الرسم البياني
//   config: ChartConfig;
  
//   // اسم خط API
//   apiLineName?: string;
  
//   // Callback عند تحميل البيانات
//   onDataLoaded?: (data: any[]) => void;
// };

// // ===== Helpers =====
// const formatNumber = (num: number): string => (num >= 1000 ? (num / 1000).toFixed(1) + 'K' : String(num));

// const formatPercentage = (num: number): string => `${num}%`;

// function getToken(primaryKey?: string): string {
//   const candidates = [
//     primaryKey,
//     'authToken',
//     'access_token',
//     'jwt',
//     'token',
//   ].filter(Boolean) as string[];

//   for (const k of candidates) {
//     const v = localStorage.getItem(k);
//     if (v) return v;
//   }
//   return '';
// }

// function mapApiRows(rows: any[]) {
//   return (Array.isArray(rows) ? rows : []).map(r => ({ 
//     name: r.day || r.date || r.month || r.name || '',
//     value: r.count || r.value || r.percentage || 0,
//     ...r 
//   }));
// }

// // ألوان افتراضية
// const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F472B6'];

// // ===== Component =====
// const CustomChart: React.FC<Props> = ({
//   apiUrl,
//   tokenKey,
//   staticData,
//   staticData1,
//   staticData2,
//   config,
//   apiLineName = 'بيانات API',
//   onDataLoaded,
// }) => {
//   const [apiPoints, setApiPoints] = useState<any[]>([]);
//   const [apiError, setApiError] = useState<string | null>(null);
//   const [loadingApi, setLoadingApi] = useState<boolean>(false);

//   // دمج البيانات من staticData أو staticData1/staticData2
//   const mergedStaticData = useMemo(() => {
//     if (staticData && staticData.length > 0) return staticData;
//     if (staticData1 && staticData1.length > 0) return staticData1;
//     if (staticData2 && staticData2.length > 0) return staticData2;
//     return [];
//   }, [staticData, staticData1, staticData2]);

//   // جلب البيانات من API
//   useEffect(() => {
//     if (!apiUrl) {
//       setLoadingApi(false);
//       return;
//     }

//     const controller = new AbortController();
//     (async () => {
//       try {
//         setLoadingApi(true);
//         setApiError(null);

//         const token = getToken(tokenKey);
//         if (!token) {
//           setApiError('لم يتم العثور على التوكن في المتصفح.');
//           setLoadingApi(false);
//           return;
//         }

//         const res = await fetch(apiUrl, {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           signal: controller.signal,
//         });

//         if (!res.ok) {
//           const text = await res.text().catch(() => '');
//           throw new Error(`HTTP ${res.status} — ${text || res.statusText}`);
//         }

//         const json = await res.json();
        
//         const rowsArray = Array.isArray(json) 
//           ? json 
//           : Array.isArray(json?.response) 
//           ? json.response 
//           : Array.isArray(json?.data) 
//           ? json.data 
//           : [];

//         const mappedData = mapApiRows(rowsArray);
//         setApiPoints(mappedData);
//         if (onDataLoaded) onDataLoaded(mappedData);
//       } catch (e: any) {
//         if (e?.name !== 'AbortError') {
//           setApiError(e?.message || 'خطأ أثناء جلب البيانات.');
//         }
//       } finally {
//         setLoadingApi(false);
//       }
//     })();
//     return () => controller.abort();
//   }, [apiUrl, tokenKey, onDataLoaded]);

//   const skeleton = (
//     <div style={{ height: config.height || 200 }} className="w-full rounded-[16px] bg-[#eee] animate-pulse" />
//   );

//   // دالة لعرض الرسم البياني حسب النوع
//   const renderChart = (data: any[], chartConfig: ChartConfig) => {
//     if (!data || data.length === 0) {
//       return <div className="text-center text-gray-400 py-8">لا توجد بيانات لعرضها</div>;
//     }

//     const {
//       type,
//       color = '#3B82F6',
//       colors = DEFAULT_COLORS,
//       dataKey = 'value',
//       dataKeys = ['value'],
//       showPercentage = false,
//       showLegend = true,
//       height = 200,
//       tooltipFormatter,
//       labels = {},
//     } = chartConfig;

//     const formatValue = tooltipFormatter || (showPercentage ? formatPercentage : formatNumber);

//     // إعداد الألوان
//     const chartColors = colors.length > 0 ? colors : [color];

//     switch(type) {
//       case 'pie':
//         return (
//           <ResponsiveContainer width="100%" height={height}>
//             <PieChart>
//               <Pie
//                 data={data}
//                 dataKey={dataKey}
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={Math.min(80, height / 2.5)}
//                 label={(entry) => {
//                   const val = entry[dataKey];
//                   return `${entry.name}: ${showPercentage ? val + '%' : val}`;
//                 }}
//                 labelLine={false}
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
//                 ))}
//               </Pie>
//               <Tooltip formatter={formatValue} />
//               {showLegend && <Legend />}
//             </PieChart>
//           </ResponsiveContainer>
//         );

//       case 'bar':
//         return (
//           <ResponsiveContainer width="100%" height={height}>
//             <BarChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" tick={{ fontSize: 11 }} label={labels.xAxis ? { value: labels.xAxis, position: 'insideBottom' } : undefined} />
//               <YAxis 
//                 tick={{ fontSize: 11 }} 
//                 tickFormatter={showPercentage ? (v) => `${v}%` : formatNumber}
//                 label={labels.yAxis ? { value: labels.yAxis, angle: -90, position: 'insideLeft' } : undefined}
//               />
//               <Tooltip formatter={formatValue} />
//               {dataKeys.map((key, index) => (
//                 <Bar 
//                   key={key} 
//                   dataKey={key} 
//                   fill={chartColors[index % chartColors.length]} 
//                   radius={[4, 4, 0, 0]}
//                 />
//               ))}
//               {showLegend && <Legend />}
//             </BarChart>
//           </ResponsiveContainer>
//         );

//       case 'area':
//         return (
//           <ResponsiveContainer width="100%" height={height}>
//             <AreaChart data={data}>
//               <defs>
//                 {dataKeys.map((key, index) => (
//                   <linearGradient key={`gradient-${key}`} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.1}/>
//                   </linearGradient>
//                 ))}
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" tick={{ fontSize: 11 }} />
//               <YAxis tickFormatter={showPercentage ? (v) => `${v}%` : formatNumber} />
//               <Tooltip formatter={formatValue} />
//               {dataKeys.map((key, index) => (
//                 <Area
//                   key={key}
//                   type="monotone"
//                   dataKey={key}
//                   stroke={chartColors[index % chartColors.length]}
//                   fill={`url(#gradient-${key})`}
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                 />
//               ))}
//               {showLegend && <Legend />}
//             </AreaChart>
//           </ResponsiveContainer>
//         );

//       default: // line
//         return (
//           <ResponsiveContainer width="100%" height={height}>
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
//               <XAxis 
//                 dataKey="name" 
//                 strokeWidth={0} 
//                 axisLine={false} 
//                 tickLine={false} 
//                 tick={{ fontSize: 11 }} 
//               />
//               <YAxis 
//                 tickFormatter={showPercentage ? (v) => `${v}%` : formatNumber} 
//                 axisLine={false} 
//                 tickLine={false} 
//                 tick={{ fontSize: 11 }}
//               />
//               <Tooltip formatter={formatValue} />
//               {dataKeys.map((key, index) => (
//                 <Line
//                   key={key}
//                   type="monotone"
//                   dataKey={key}
//                   stroke={chartColors[index % chartColors.length]}
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                   name={key === dataKey ? config.title : key}
//                 />
//               ))}
//               {showLegend && <Legend />}
//             </LineChart>
//           </ResponsiveContainer>
//         );
//     }
//   };

//   // تحديد البيانات المراد عرضها
//   const chartData = useMemo(() => {
//     if (apiPoints.length > 0) return apiPoints;
//     if (mergedStaticData.length > 0) return mergedStaticData;
//     return [];
//   }, [apiPoints, mergedStaticData]);

//   // ===== Render =====
//   if (loadingApi) return skeleton;

//   if (apiError) {
//     return (
//       <div className="p-4 rounded-[12px] bg-[#fee2e2] text-[#991b1b]" style={{ minHeight: config.height || 200 }}>
//         <p className="text-sm">{apiError}</p>
//         {mergedStaticData.length > 0 && (
//           <div className="mt-2">
//             <p className="text-xs text-gray-500">عرض البيانات الثابتة كبديل</p>
//             {renderChart(mergedStaticData, config)}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-[20px] p-4 shadow-sm hover:shadow-md transition-shadow">
//       {config.title && (
//         <h3 className="text-right text-[#D72229] text-[18px] font-semibold mb-4">
//           {config.title}
//         </h3>
//       )}
//       <div className="w-full">
//         {chartData.length > 0 ? renderChart(chartData, config) : (
//           <div className="text-center text-gray-400 py-8">
//             لا توجد بيانات لعرضها
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomChart;












/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

// ===== Types =====
export interface StaticChartPoint {
  name: string;
  value: number;
  value2?: number;
  value3?: number;
  [key: string]: any;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  color?: string;
  colors?: string[];
  dataKey?: string;
  dataKeys?: string[];
  showPercentage?: boolean;
  showLegend?: boolean;
  height?: number;
  hideXAxis?: boolean;
  yAxisTicks?: number[];
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: any) => string;
  labels?: {
    xAxis?: string;
    yAxis?: string;
  };
}

type Props = {
  apiUrl?: string;
  tokenKey?: string;
  staticData?: StaticChartPoint[];
  staticData1?: StaticChartPoint[];
  staticData2?: StaticChartPoint[];
  config?: ChartConfig; // جعل config اختياري
  apiLineName?: string;
  onDataLoaded?: (data: any[]) => void;
};

// ===== Helpers =====
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
  return String(num);
};

const formatPercentage = (num: number): string => `${num}%`;

function getToken(primaryKey?: string): string {
  const candidates = [primaryKey, 'authToken', 'access_token', 'jwt', 'token'].filter(Boolean) as string[];
  for (const k of candidates) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return '';
}

function mapApiRows(rows: any[]) {
  return (Array.isArray(rows) ? rows : []).map(r => ({ 
    name: r.day || r.date || r.month || r.name || '',
    value: r.count || r.value || r.percentage || 0,
    ...r 
  }));
}

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F472B6'];

// القيم الافتراضية للـ config
const DEFAULT_CONFIG: ChartConfig = {
  type: 'line',
  title: 'رسم بياني',
  color: '#3B82F6',
  colors: DEFAULT_COLORS,
  dataKey: 'value',
  dataKeys: ['value'],
  showPercentage: false,
  showLegend: true,
  height: 200,
  hideXAxis: false,
  yAxisTicks: undefined,
  yAxisFormatter: undefined,
  tooltipFormatter: undefined,
  labels: {},
};

// ===== Component =====
const CustomChart: React.FC<Props> = ({
  apiUrl,
  tokenKey,
  staticData,
  staticData1,
  staticData2,
  config,
  apiLineName = 'بيانات API',
  onDataLoaded,
}) => {
  // دمج config مع القيم الافتراضية
  const mergedConfig: ChartConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config,
  }), [config]);

  const [apiPoints, setApiPoints] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loadingApi, setLoadingApi] = useState<boolean>(false);

  const mergedStaticData = useMemo(() => {
    if (staticData && staticData.length > 0) return staticData;
    if (staticData1 && staticData1.length > 0) return staticData1;
    if (staticData2 && staticData2.length > 0) return staticData2;
    return [];
  }, [staticData, staticData1, staticData2]);

  useEffect(() => {
    if (!apiUrl) {
      setLoadingApi(false);
      return;
    }

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
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} — ${text || res.statusText}`);
        }

        const json = await res.json();
        const rowsArray = Array.isArray(json) 
          ? json 
          : Array.isArray(json?.response) 
          ? json.response 
          : Array.isArray(json?.data) 
          ? json.data 
          : [];

        const mappedData = mapApiRows(rowsArray);
        setApiPoints(mappedData);
        if (onDataLoaded) onDataLoaded(mappedData);
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          setApiError(e?.message || 'خطأ أثناء جلب البيانات.');
        }
      } finally {
        setLoadingApi(false);
      }
    })();
    return () => controller.abort();
  }, [apiUrl, tokenKey, onDataLoaded]);

  const skeleton = (
    <div style={{ height: mergedConfig.height || 200 }} className="w-full rounded-[16px] bg-[#eee] animate-pulse" />
  );

  const renderChart = (data: any[], chartConfig: ChartConfig) => {
    if (!data || data.length === 0) {
      return <div className="text-center text-gray-400 py-8">لا توجد بيانات لعرضها</div>;
    }

    const {
      type,
      color = '#3B82F6',
      colors = DEFAULT_COLORS,
      dataKey = 'value',
      dataKeys = ['value'],
      showPercentage = false,
      showLegend = true,
      height = 200,
      hideXAxis = false,
      yAxisTicks,
      yAxisFormatter,
      tooltipFormatter,
      labels = {},
    } = chartConfig;

    const formatValue = tooltipFormatter || (showPercentage ? formatPercentage : formatNumber);
    const chartColors = colors.length > 0 ? colors : [color];
    
    const formatYAxis = yAxisFormatter || (showPercentage 
      ? (v: number) => `${v}%` 
      : (v: number) => formatNumber(v)
    );

    switch(type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={Math.min(80, height / 2.5)}
                label={(entry) => {
                  const val = entry[dataKey];
                  return `${entry.name}: ${showPercentage ? val + '%' : val}`;
                }}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatValue} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }} 
                hide={hideXAxis}
                label={labels.xAxis ? { value: labels.xAxis, position: 'insideBottom' } : undefined} 
              />
              <YAxis 
                tick={{ fontSize: 11 }} 
                tickFormatter={formatYAxis}
                ticks={yAxisTicks}
                label={labels.yAxis ? { value: labels.yAxis, angle: -90, position: 'insideLeft' } : undefined}
              />
              <Tooltip formatter={formatValue} />
              {dataKeys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={chartColors[index % chartColors.length]} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
              {showLegend && <Legend />}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <defs>
                {dataKeys.map((key, index) => (
                  <linearGradient key={`gradient-${key}`} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }} 
                hide={hideXAxis}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                ticks={yAxisTicks}
              />
              <Tooltip formatter={formatValue} />
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartColors[index % chartColors.length]}
                  fill={`url(#gradient-${key})`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
              {showLegend && <Legend />}
            </AreaChart>
          </ResponsiveContainer>
        );

      default: // line
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="0" horizontal vertical={false} />
              <XAxis 
                dataKey="name" 
                strokeWidth={0} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11 }}
                hide={hideXAxis}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11 }}
                ticks={yAxisTicks}
              />
              <Tooltip formatter={formatValue} />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartColors[index % chartColors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={key === dataKey ? mergedConfig.title : key}
                />
              ))}
              {showLegend && <Legend />}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const chartData = useMemo(() => {
    if (apiPoints.length > 0) return apiPoints;
    if (mergedStaticData.length > 0) return mergedStaticData;
    return [];
  }, [apiPoints, mergedStaticData]);

  if (loadingApi) return skeleton;

  if (apiError) {
    return (
      <div className="p-4 rounded-[12px] bg-[#fee2e2] text-[#991b1b]" style={{ minHeight: mergedConfig.height || 200 }}>
        <p className="text-sm">{apiError}</p>
        {mergedStaticData.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">عرض البيانات الثابتة كبديل</p>
            {renderChart(mergedStaticData, mergedConfig)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-4 shadow-sm hover:shadow-md transition-shadow">
      {mergedConfig.title && (
        <h3 className="text-right text-[#D72229] text-[18px] font-semibold mb-4">
          {mergedConfig.title}
        </h3>
      )}
      <div className="w-full">
        {chartData.length > 0 ? renderChart(chartData, mergedConfig) : (
          <div className="text-center text-gray-400 py-8">
            لا توجد بيانات لعرضها
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomChart;