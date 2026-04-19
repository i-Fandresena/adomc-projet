'use client';

import { useMemo, useState } from 'react';
import { CircleCheck, CircleX, Plus, Target, Trash2 } from 'lucide-react';
import { ServerWithScore } from '@/types';
import { InfoBulle } from './InfoBulle';

interface ComparisonPanelProps {
  selectedServers: ServerWithScore[];
  availableServers: ServerWithScore[];
  onAddServer: (serverId: string) => void;
  onRemoveServer: (serverId: string) => void;
  onClear: () => void;
}

interface CriterionDefinition {
  label: string;
  key: keyof Pick<ServerWithScore, 'monthlyCost' | 'ram' | 'cpu' | 'bandwidth'>;
  normalizedKey: keyof ServerWithScore['normalizedScores'];
  direction: 'min' | 'max';
  format: (value: number) => string;
  accent: string;
}

const criteria: CriterionDefinition[] = [
  {
    label: 'Cout',
    key: 'monthlyCost',
    normalizedKey: 'cost',
    direction: 'min',
    format: (value) => `${value.toFixed(2)} EUR`,
    accent: 'bg-rose-500',
  },
  {
    label: 'RAM',
    key: 'ram',
    normalizedKey: 'ram',
    direction: 'max',
    format: (value) => `${value.toFixed(0)} GB`,
    accent: 'bg-cyan-500',
  },
  {
    label: 'CPU',
    key: 'cpu',
    normalizedKey: 'cpu',
    direction: 'max',
    format: (value) => `${value.toFixed(1)} GHz`,
    accent: 'bg-violet-500',
  },
  {
    label: 'Bande passante',
    key: 'bandwidth',
    normalizedKey: 'bandwidth',
    direction: 'max',
    format: (value) => `${value.toFixed(1)} Gbps`,
    accent: 'bg-emerald-500',
  },
];

function getRecommendationStyle(niveau: ServerWithScore['niveauRecommandation']) {
  if (niveau === 'Recommande') {
    return {
      icon: <CircleCheck className="w-4 h-4 text-emerald-400" />,
      textClass: 'text-emerald-300',
      badgeClass: 'bg-emerald-500/10 border border-emerald-500/30',
    };
  }

  if (niveau === 'A etudier') {
    return {
      icon: <Target className="w-4 h-4 text-amber-400" />,
      textClass: 'text-amber-300',
      badgeClass: 'bg-amber-500/10 border border-amber-500/30',
    };
  }

  return {
    icon: <CircleX className="w-4 h-4 text-rose-400" />,
    textClass: 'text-rose-300',
    badgeClass: 'bg-rose-500/10 border border-rose-500/30',
  };
}

export function ComparisonPanel({
  selectedServers,
  availableServers,
  onAddServer,
  onRemoveServer,
  onClear,
}: ComparisonPanelProps) {
  const [serverToAdd, setServerToAdd] = useState('');

  const remainingServers = useMemo(
    () => availableServers.filter((server) => !selectedServers.some((selected) => selected.id === server.id)),
    [availableServers, selectedServers]
  );

  const orderedServers = useMemo(
    () =>
      selectedServers
        .slice()
        .sort((left, right) => right.weightedScore - left.weightedScore)
        .map((server) => ({
          ...server,
          recommendationStyle: getRecommendationStyle(server.niveauRecommandation),
        })),
    [selectedServers]
  );

  const leaders = useMemo(() => {
    return criteria
      .map((criterion) => {
        if (selectedServers.length === 0) {
          return null;
        }

        const sorted = [...selectedServers].sort((left, right) => {
          const leftValue = left[criterion.key];
          const rightValue = right[criterion.key];

          if (criterion.direction === 'min') {
            return leftValue - rightValue;
          }

          return rightValue - leftValue;
        });

        return {
          ...criterion,
          leader: sorted[0],
        };
      })
      .filter(Boolean) as Array<CriterionDefinition & { leader: ServerWithScore }>;
  }, [selectedServers]);

  const handleAdd = () => {
    if (!serverToAdd) return;
    onAddServer(serverToAdd);
    setServerToAdd('');
  };

  return (
    <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.45s' }}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white inline-flex items-center gap-2">
            Comparaison directe
            <InfoBulle texte="Sélectionnez jusqu'à trois serveurs pour visualiser leurs compromis côte à côte et justifier le choix final." />
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Ajoutez des serveurs depuis le tableau pour comparer les coûts, performances et recommandations.
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={selectedServers.length === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/70 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Vider
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-3 xl:items-end mb-5">
        <label className="flex-1 space-y-2">
          <span className="text-xs uppercase tracking-wider text-gray-500">Ajouter un serveur</span>
          <select
            value={serverToAdd}
            onChange={(event) => setServerToAdd(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            disabled={remainingServers.length === 0 || selectedServers.length >= 3}
          >
            <option value="">Choisir un serveur</option>
            {remainingServers.map((server) => (
              <option key={server.id} value={server.id}>
                {server.name} - {server.provider}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!serverToAdd || selectedServers.length >= 3}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600/90 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-500/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>

        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
          Sélection active: {selectedServers.length}/3
        </div>
      </div>

      {selectedServers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-sm text-gray-400">
          Aucune comparaison sélectionnée. Utilisez le bouton <span className="text-cyan-300">Comparer</span> dans le tableau pour ajouter un serveur.
        </div>
      ) : (
        <>
          <div className={`grid gap-4 ${selectedServers.length === 1 ? 'grid-cols-1' : 'md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'}`}>
            {orderedServers.map((server, index) => (
              <article
                key={server.id}
                className="min-w-0 rounded-2xl border border-gray-700/80 bg-gray-950/45 p-4 shadow-lg shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-bold">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-semibold text-white">{server.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 break-words">{server.provider}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveServer(server.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-700 bg-gray-900/80 px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    aria-label={`Retirer ${server.name} de la comparaison`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Retirer
                  </button>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-gray-500">Cout</p>
                      <p className="mt-1 font-semibold text-rose-200">{server.monthlyCost.toFixed(2)} EUR</p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-gray-500">Score SAW</p>
                      <p className="mt-1 font-semibold text-emerald-200">{(server.weightedScore * 100).toFixed(2)}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {criteria.map((criterion) => {
                      const value = server[criterion.key];
                      const width = Math.max(8, Math.round(server.normalizedScores[criterion.normalizedKey] * 100));

                      return (
                        <div key={criterion.key}>
                          <div className="flex items-start justify-between gap-2 text-xs mb-1">
                            <span className="text-gray-400 leading-tight">{criterion.label}</span>
                            <span className="text-gray-200 text-right leading-tight">{criterion.format(value)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                            <div className={`h-full ${criterion.accent}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800 text-xs">
                    <div className="inline-flex items-center gap-2 text-gray-400 min-w-0">
                      {server.recommendationStyle.icon}
                      <span className="truncate">{server.niveauRecommandation}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 text-gray-400 justify-end min-w-0">
                      <span className={`inline-block h-2 w-2 rounded-full ${server.isParetoOptimal ? 'bg-emerald-400' : 'bg-gray-500'}`} />
                      <span className="truncate">{server.isParetoOptimal ? 'Pareto optimale' : 'Dominee'}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-gray-700 bg-gray-950/45 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Leaders par critere dans la comparaison</h3>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
              {leaders.map((leader) => (
                <div key={leader.key} className="rounded-xl border border-gray-800 bg-gray-900/60 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">{leader.label}</p>
                  <p className="text-sm font-semibold text-white">{leader.leader.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{leader.format(leader.leader[leader.key])}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}