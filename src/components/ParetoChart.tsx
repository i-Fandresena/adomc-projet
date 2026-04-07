'use client';

import { ServerWithScore } from '@/types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface ParetoChartProps {
  servers: ServerWithScore[];
  costMax: number;
}

export function ParetoChart({ servers, costMax }: ParetoChartProps) {
  const chartData = servers.map(server => ({
    name: server.name,
    cost: server.monthlyCost,
    performance: server.performanceScore * 100,
    isParetoOptimal: server.isParetoOptimal,
    score: server.weightedScore * 100,
  }));

  const paretoServers = servers.filter(s => s.isParetoOptimal);
  const paretoData = paretoServers
    .map(s => ({ cost: s.monthlyCost, performance: s.performanceScore * 100 }))
    .sort((a, b) => a.cost - b.cost);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="cost"
            name="Cout"
            domain={[0, costMax + 20]}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `${value} EUR`}
            label={{ value: 'Cout mensuel (EUR)', position: 'bottom', fill: '#9CA3AF', fontSize: 13 }}
          />
          <YAxis
            type="number"
            dataKey="performance"
            name="Performance"
            domain={[0, 105]}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            label={{ value: 'Score de performance (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 13 }}
          />
          <Tooltip
            formatter={(value: number | string, name: string) => {
              if (name === 'cost') return [`${value} EUR`, 'Cout'];
              if (name === 'performance') return [`${value}%`, 'Performance'];
              if (name === 'score') return [`${value}%`, 'Score global'];
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            itemStyle={{ color: '#D1D5DB' }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          
          {paretoData.length >= 2 && (
            <>
              {paretoData.slice(0, -1).map((point, i) => (
                <ReferenceLine
                  key={i}
                  segment={[
                    { x: point.cost, y: point.performance },
                    { x: paretoData[i + 1].cost, y: paretoData[i + 1].performance }
                  ]}
                  stroke="url(#paretoGradient)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              ))}
            </>
          )}

          <defs>
            <linearGradient id="paretoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          <Scatter
            data={chartData.filter(d => !d.isParetoOptimal)}
            fill="#6B7280"
            shape="circle"
          />
          <Scatter
            data={chartData.filter(d => d.isParetoOptimal)}
            fill="#10B981"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}