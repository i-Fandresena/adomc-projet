'use client';

import { FlaskConical } from 'lucide-react';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

export default function DashboardCalculsPage() {
  const { serveursFiltres, weights } = useDashboard();

  return (
    <div className="glass-panel p-6" title="Details de calculs SAW pour explicabilite du classement.">
      <div className="flex items-center gap-3 mb-3">
        <FlaskConical className="w-5 h-5 text-violet-400" />
        <h2 className="text-xl font-semibold text-white">Details de calcul SAW (Top 3)</h2>
      </div>
      <p className="text-sm text-gray-400 mb-4">Chaque ligne montre les valeurs normalisees puis la contribution ponderee au score global.</p>

      {serveursFiltres.slice(0, 3).map((s) => (
        <div key={`detail-${s.id}`} className="mb-3 rounded-lg border border-gray-700 bg-gray-900/50 p-3">
          <p className="text-sm font-semibold text-gray-100 mb-2">{s.name} - {s.provider}</p>
          <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-300">
            <p>Cout normalise: {s.normalizedScores.cost.toFixed(3)} x {(weights.cost / 100).toFixed(2)}</p>
            <p>RAM normalisee: {s.normalizedScores.ram.toFixed(3)} x {(weights.ram / 100).toFixed(2)}</p>
            <p>CPU normalise: {s.normalizedScores.cpu.toFixed(3)} x {(weights.cpu / 100).toFixed(2)}</p>
            <p>Bande passante normalisee: {s.normalizedScores.bandwidth.toFixed(3)} x {(weights.bandwidth / 100).toFixed(2)}</p>
            <p className="md:col-span-2 text-emerald-300 font-medium">Score global: {(s.weightedScore * 100).toFixed(2)}% | Score recommandation: {(s.scoreRecommandation * 100).toFixed(2)}%</p>
          </div>
        </div>
      ))}

      {serveursFiltres.length === 0 && <p className="text-sm text-gray-500">Aucun detail de calcul a afficher.</p>}
    </div>
  );
}
