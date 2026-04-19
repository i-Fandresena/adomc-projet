'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import { ServerWithScore, WeightDistribution } from '@/types';
import { redistributeWeights, WeightKey } from '@/lib/weights';
import { InfoBulle } from './InfoBulle';

interface SensitivityPanelProps {
  servers: ServerWithScore[];
  baseWeights: WeightDistribution;
  focusServer?: ServerWithScore;
  referenceServer?: ServerWithScore;
}

const weightLabels: Record<WeightKey, string> = {
  cost: 'Cout',
  ram: 'RAM',
  cpu: 'CPU',
  bandwidth: 'Bande passante',
};

const weightColors: Record<WeightKey, string> = {
  cost: '#f43f5e',
  ram: '#06b6d4',
  cpu: '#8b5cf6',
  bandwidth: '#10b981',
};

function scoreServer(server: ServerWithScore, weights: WeightDistribution) {
  return (
    server.normalizedScores.cost * (weights.cost / 100) +
    server.normalizedScores.ram * (weights.ram / 100) +
    server.normalizedScores.cpu * (weights.cpu / 100) +
    server.normalizedScores.bandwidth * (weights.bandwidth / 100)
  );
}

export function SensitivityPanel({ servers, baseWeights, focusServer, referenceServer }: SensitivityPanelProps) {
  const [criterion, setCriterion] = useState<WeightKey>('cost');

  const chartData = useMemo(() => {
    if (servers.length === 0) return [];

    const focus = focusServer ?? servers[0];
    const reference = referenceServer ?? servers.find((server) => server.id !== focus.id) ?? servers[0];

    return Array.from({ length: 11 }, (_, index) => index * 10).map((value) => {
      const weightsAtPoint = redistributeWeights(baseWeights, criterion, value);
      const scoredServers = servers
        .map((server) => ({
          server,
          score: scoreServer(server, weightsAtPoint),
        }))
        .sort((left, right) => right.score - left.score);

      const rankMap = new Map(scoredServers.map((entry, index) => [entry.server.id, index + 1]));
      const topServer = scoredServers[0];

      return {
        weight: value,
        focusScore: Number((scoreServer(focus, weightsAtPoint) * 100).toFixed(2)),
        referenceScore: Number((scoreServer(reference, weightsAtPoint) * 100).toFixed(2)),
        bestScore: Number((topServer.score * 100).toFixed(2)),
        focusRank: rankMap.get(focus.id) ?? servers.length,
        topServer: topServer.server.name,
      };
    });
  }, [baseWeights, criterion, focusServer, referenceServer, servers]);

  const summary = useMemo(() => {
    if (chartData.length === 0) {
      return null;
    }

    const bestRank = Math.min(...chartData.map((point) => point.focusRank));
    const worstRank = Math.max(...chartData.map((point) => point.focusRank));
    const wins = chartData.filter((point) => point.focusScore >= point.referenceScore).length;
    const maxGap = Math.max(0, ...chartData.map((point) => point.focusScore - point.referenceScore));

    return {
      bestRank,
      worstRank,
      wins,
      maxGap,
    };
  }, [chartData]);

  const focusLabel = focusServer?.name ?? servers[0]?.name ?? 'Serveur selectionne';
  const referenceLabel = referenceServer?.name ?? servers[1]?.name ?? 'Serveur de reference';

  return (
    <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white inline-flex items-center gap-2">
            Analyse de sensibilite
            <InfoBulle texte="On varie un poids de 0 a 100 et on observe comment les scores evoluent. Le reste des poids est reequilibre automatiquement." />
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Comparez la robustesse du classement entre {focusLabel} et {referenceLabel}.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-100">
          <Activity className="w-3.5 h-3.5" />
          Scenarios what-if
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 xl:items-end mb-5">
        <label className="flex-1 space-y-2">
          <span className="text-xs uppercase tracking-wider text-gray-500">Critere que l’on fait varier</span>
          <select
            value={criterion}
            onChange={(event) => setCriterion(event.target.value as WeightKey)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
          >
            {Object.entries(weightLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3 text-xs text-gray-300">
          <p className="text-gray-500 uppercase tracking-wider mb-1">Poids de base</p>
          <p>
            Coût {baseWeights.cost}% · RAM {baseWeights.ram}% · CPU {baseWeights.cpu}% · Bande passante {baseWeights.bandwidth}%
          </p>
        </div>
      </div>

      {summary && chartData.length > 0 ? (
        <>
          <div className="grid md:grid-cols-4 gap-3 mb-5">
            <div className="rounded-xl border border-gray-800 bg-gray-950/45 p-4">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Meilleur rang observe</p>
              <p className="mt-2 text-2xl font-bold text-white">#{summary.bestRank}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/45 p-4">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Pire rang observe</p>
              <p className="mt-2 text-2xl font-bold text-white">#{summary.worstRank}</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/45 p-4">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Points favorables</p>
              <p className="mt-2 text-2xl font-bold text-white">{summary.wins}/11</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-950/45 p-4">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Plus grand avantage</p>
              <p className="mt-2 text-2xl font-bold text-white">{summary.maxGap.toFixed(2)} pts</p>
            </div>
          </div>

          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={360}>
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="weight"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: `${weightLabels[criterion]} (%)`, position: 'bottom', fill: '#9CA3AF', fontSize: 13 }}
                />
                <YAxis
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                  domain={[0, 100]}
                  label={{ value: 'Score simule (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF', fontSize: 13 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const numericValue = typeof value === 'number' ? value : Number(value);
                    const formattedValue = Number.isFinite(numericValue)
                      ? `${numericValue.toFixed(2)}%`
                      : String(value ?? '');

                    if (name === 'focusScore') return [formattedValue, focusLabel];
                    if (name === 'referenceScore') return [formattedValue, referenceLabel];
                    if (name === 'bestScore') return [formattedValue, 'Meilleur score'];
                    return [value ?? '', name];
                  }}
                  labelFormatter={(value) => `Poids ${weightLabels[criterion]}: ${String(value ?? '')}%`}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#D1D5DB' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="focusScore"
                  name={focusLabel}
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="referenceScore"
                  name={referenceLabel}
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="bestScore"
                  name="Meilleur score du moment"
                  stroke={weightColors[criterion]}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-700 bg-gray-950/45 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Lecture rapide</h3>
            </div>
            <p className="text-sm text-gray-300">
              {focusLabel} garde un meilleur score que {referenceLabel} sur {summary.wins} points simulés.
              Le meilleur rang observe pour ce serveur est #{summary.bestRank} et son pire rang est #{summary.worstRank}.
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-sm text-gray-400">
          Aucune donnée disponible pour l’analyse de sensibilite.
        </div>
      )}
    </div>
  );
}