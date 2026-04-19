'use client';

import { useMemo, useState } from 'react';
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
  ZAxis,
} from 'recharts';

interface ParetoChartProps {
  servers: ServerWithScore[];
  costMax: number;
}

export function ParetoChart({ servers, costMax }: ParetoChartProps) {
  const [afficherDominees, setAfficherDominees] = useState(true);
  const [plafondCout, setPlafondCout] = useState(Math.ceil(costMax));

  const chartData = useMemo(
    () =>
      servers
        .filter((server) => server.monthlyCost <= plafondCout)
        .filter((server) => (afficherDominees ? true : server.isParetoOptimal))
        .map((server) => ({
          name: server.name,
          cost: server.monthlyCost,
          performance: server.performanceScore * 100,
          isParetoOptimal: server.isParetoOptimal,
          score: server.weightedScore * 100,
          taille: server.isParetoOptimal ? 180 : 120,
        })),
    [servers, plafondCout, afficherDominees]
  );

  const paretoServers = chartData.filter((s) => s.isParetoOptimal);
  const paretoData = paretoServers
    .map((s) => ({ cost: s.cost, performance: s.performance }))
    .sort((a, b) => a.cost - b.cost);

  return (
    <div className="w-full h-[440px]">
      <div className="mb-4 grid md:grid-cols-2 gap-3">
        <label className="text-xs text-gray-300 flex items-center gap-2">
          <input
            type="checkbox"
            checked={afficherDominees}
            onChange={(e) => setAfficherDominees(e.target.checked)}
            className="accent-emerald-500"
          />
          Afficher aussi les offres dominees
        </label>
        <label className="text-xs text-gray-300">
          Plafond de cout affiche: {plafondCout} EUR
          <input
            type="range"
            min={Math.floor(Math.min(...servers.map((s) => s.monthlyCost)))}
            max={Math.ceil(costMax)}
            value={plafondCout}
            onChange={(e) => setPlafondCout(Number(e.target.value))}
            className="mt-1 w-full"
          />
        </label>
      </div>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={440}>
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
            formatter={(value, name) => {
              const numericValue = typeof value === 'number' ? value : Number(value);
              const formattedValue = Number.isFinite(numericValue) ? numericValue.toFixed(1) : String(value ?? '');

              if (name === 'cost') return [`${formattedValue} EUR`, 'Cout'];
              if (name === 'performance') return [`${formattedValue}%`, 'Performance'];
              if (name === 'score') return [`${formattedValue}%`, 'Score global'];
              return [value ?? '', name];
            }}
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            itemStyle={{ color: '#D1D5DB' }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <ZAxis type="number" dataKey="taille" range={[90, 230]} />

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
            name="Dominee"
            isAnimationActive
            animationDuration={450}
          />
          <Scatter
            data={chartData.filter(d => d.isParetoOptimal)}
            fill="#10B981"
            shape="circle"
            name="Pareto optimale"
            isAnimationActive
            animationDuration={450}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}