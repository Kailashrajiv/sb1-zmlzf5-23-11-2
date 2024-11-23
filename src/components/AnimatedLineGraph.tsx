import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface DataPoint {
  timestamp: string;
  value: number;
}

const generateInitialData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      timestamp: time.toLocaleTimeString(),
      value: Math.sin(i * 0.5) * 50 // Generate sine wave data
    });
  }
  return data;
};

export default function AnimatedLineGraph() {
  const [data, setData] = useState<DataPoint[]>(generateInitialData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        const now = new Date();
        newData.push({
          timestamp: now.toLocaleTimeString(),
          value: Math.sin(now.getTime() * 0.001) * 50
        });
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className={`text-sm font-bold ${
            payload[0].value >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Value: {payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-xl shadow-sm p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            opacity={0.5}
          />

          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#9ca3af' }}
            axisLine={{ stroke: '#9ca3af' }}
          />

          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#9ca3af' }}
            axisLine={{ stroke: '#9ca3af' }}
            domain={[-60, 60]}
            tickFormatter={(value) => `${value}`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />

          <ReferenceLine
            y={0}
            stroke="#9ca3af"
            strokeDasharray="3 3"
          />

          <Line
            type="monotone"
            dataKey="value"
            name="Real-time Value"
            stroke="url(#colorGradient)"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}