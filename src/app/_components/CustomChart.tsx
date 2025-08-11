import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  value2: number;
  value3: number;
}

const data: ChartData[] = [
  { name: 'يناير', value: 30000, value2: 20000, value3: 60000 },
  { name: 'فبراير', value: 35000, value2: 25000, value3: 65000 },
  { name: 'مارس', value: 50000, value2: 30000, value3: 70000 },
  { name: 'أبريل', value: 55000, value2: 35000, value3: 75000 },
  { name: 'مايو', value: 70000, value2: 40000, value3: 80000 },
  { name: 'يونيو', value: 75000, value2: 45000, value3: 85000 },
];

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'; 
  }
  return num.toString(); 
};

const CustomChart: React.FC = () => {
  const renderChart = () => (
    <ResponsiveContainer width="100%" height={200} className="right-chart">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="0" horizontal={true} vertical={false} />
        <XAxis dataKey="name" strokeWidth={0} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatNumber} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value: number) => formatNumber(value)} />
        
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          strokeWidth={1}
          dot={{ r: 4 }}
          activeDot={{ r: 4 }}
          name="نسبة التفاعل الشهري"
          className='shadow-b-[#8884d8]'
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
    <div className='bg-[#F6F6F6] rounded-[40px] py-[40px] px-[20px] ' style={{maxWidth:"100%"}}>
      <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {renderChart()}
        {renderChart()}
        {renderChart()}
      </div>
    </div>
  );
};

export default CustomChart;
