'use client';

import dynamic from 'next/dynamic';
import { BarChart3 } from 'lucide-react';
import { InfoBulle } from '@/components/InfoBulle';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

const ParetoChart = dynamic(() => import('@/components/ParetoChart').then((mod) => mod.ParetoChart), { ssr: false });
const PentagoneStatique = dynamic(() => import('@/components/PentagoneStatique').then((mod) => mod.PentagoneStatique), { ssr: false });

export default function DashboardVisualisationPage() {
  const { serveursFiltres, costRange, serveurRadar } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-white inline-flex items-center gap-2">
            Analyse du front de Pareto
            <InfoBulle texte="Graphe interactif cout-performance avec filtrage dynamique et front de Pareto." />
          </h2>
        </div>
        <ParetoChart servers={serveursFiltres} costMax={costRange.max} />
      </div>

      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          <h2 className="text-xl font-semibold text-white inline-flex items-center gap-2">
            Illustration pentagone (radar)
            <InfoBulle texte="Profil visuel du meilleur serveur courant sur cinq dimensions decisionnelles." />
          </h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">Le pentagone illustre le profil de la meilleure offre actuelle sur 5 axes.</p>
        <PentagoneStatique serveur={serveurRadar} />
      </div>
    </div>
  );
}
