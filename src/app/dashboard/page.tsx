'use client';

import { BarChart3, ShieldCheck, Target } from 'lucide-react';
import { InfoBulle } from '@/components/InfoBulle';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

export default function DashboardOverviewPage() {
  const { indicateurs } = useDashboard();

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 inline-flex items-center gap-1">
              Offres analysees
              <InfoBulle texte="Nombre total d offres restant apres application des filtres actifs." />
            </p>
            <p className="text-2xl font-bold text-white">{indicateurs.total}</p>
          </div>
          <Target className="w-6 h-6 text-cyan-400" />
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 inline-flex items-center gap-1">
              Pareto optimales
              <InfoBulle texte="Offres non dominees: on ne peut pas ameliorer un critere sans en degrader un autre." />
            </p>
            <p className="text-2xl font-bold text-white">{indicateurs.pareto}</p>
          </div>
          <BarChart3 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="glass-panel p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 inline-flex items-center gap-1">
              Recommandees
              <InfoBulle texte="Offres considerees comme recommandees selon les regles par defaut du systeme." />
            </p>
            <p className="text-2xl font-bold text-white">{indicateurs.recommandes}</p>
          </div>
          <ShieldCheck className="w-6 h-6 text-violet-400" />
        </div>
      </section>

      <section className="glass-panel p-6">
        <h2 className="text-xl font-semibold text-white mb-3">Bienvenue dans le dashboard multicritere</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Cette version multipage segmente chaque etape de decision: saisie du besoin, parametrage SAW, visualisation,
          comparaison, sensibilite et details de calcul. Utilisez la sidebar flottante pour naviguer entre les modules.
        </p>
      </section>
    </div>
  );
}
