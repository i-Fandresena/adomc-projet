'use client';

import { useMemo, useState } from 'react';
import { Download, FileText, Share2 } from 'lucide-react';
import { ServerTable } from '@/components/ServerTable';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

export default function DashboardClassementPage() {
  const {
    serveursFiltres,
    classementComplet,
    comparisonIds,
    shareStatus,
    exporterResultatsCsv,
    exporterResultatsPdf,
    partagerConfiguration,
    toggleComparison,
  } = useDashboard();
  const [voirToutCatalogue, setVoirToutCatalogue] = useState(false);

  const serveursAffiches = useMemo(
    () => (voirToutCatalogue ? classementComplet : serveursFiltres),
    [voirToutCatalogue, classementComplet, serveursFiltres]
  );

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h2 className="text-xl font-semibold text-white">Classement des serveurs</h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={partagerConfiguration} className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-sm text-violet-200 hover:bg-violet-500/20 transition-colors"><Share2 className="w-4 h-4" />Partager</button>
          <button type="button" onClick={exporterResultatsPdf} disabled={serveursFiltres.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><FileText className="w-4 h-4" />Exporter PDF</button>
          <button type="button" onClick={exporterResultatsCsv} disabled={serveursFiltres.length === 0} className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><Download className="w-4 h-4" />Exporter CSV</button>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4">L avis systeme est calcule avec des poids de reference (cout 30%, RAM 25%, CPU 20%, bande passante 25%).</p>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={voirToutCatalogue}
            onChange={(event) => setVoirToutCatalogue(event.target.checked)}
            className="accent-cyan-500"
          />
          Voir tout le catalogue mondial
        </label>
        <span className="text-xs text-cyan-200 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-3 py-1">
          {serveursAffiches.length} serveurs affiches
        </span>
      </div>

      {shareStatus && (
        <p className="mb-4 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs text-violet-200">{shareStatus}</p>
      )}

      {serveursAffiches.length === 0 ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">Aucun serveur ne correspond aux filtres actuels.</div>
      ) : (
        <ServerTable
          servers={serveursAffiches}
          selectedIds={comparisonIds}
          onToggleCompare={toggleComparison}
          enablePagination
          pageSizeMin={5}
          pageSizeMax={50}
          pageSizeStep={5}
        />
      )}
    </div>
  );
}
