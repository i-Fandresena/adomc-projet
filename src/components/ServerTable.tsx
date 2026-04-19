'use client';

import { useMemo, useState } from 'react';
import { ServerWithScore } from '@/types';
import { ArrowLeft, ArrowLeftRight, ArrowRight, Award, Check, ChevronDown, ChevronUp, CircleCheck, CircleX, Server, TriangleAlert, TrendingUp } from 'lucide-react';

interface ServerTableProps {
  servers: ServerWithScore[];
  selectedIds?: string[];
  onToggleCompare?: (server: ServerWithScore) => void;
  enablePagination?: boolean;
  pageSizeMin?: number;
  pageSizeMax?: number;
  pageSizeStep?: number;
}

type SortKey = 'rank' | 'name' | 'provider' | 'monthlyCost' | 'ram' | 'cpu' | 'bandwidth' | 'weightedScore' | 'niveauRecommandation';
type SortDirection = 'asc' | 'desc';

function SortHeaderButton({
  label,
  column,
  activeColumn,
  activeDirection,
  onSort,
}: {
  label: string;
  column: SortKey;
  activeColumn: SortKey;
  activeDirection: SortDirection;
  onSort: (nextKey: SortKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className="inline-flex items-center gap-1 hover:text-gray-200 transition-colors"
    >
      <span>{label}</span>
      {activeColumn === column ? (
        activeDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 opacity-30" />
      )}
    </button>
  );
}

export function ServerTable({
  servers,
  selectedIds = [],
  onToggleCompare,
  enablePagination = false,
  pageSizeMin = 5,
  pageSizeMax = 50,
  pageSizeStep = 5,
}: ServerTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [pageSize, setPageSize] = useState<number>(Math.min(10, pageSizeMax));
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      setCurrentPage(1);
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === 'rank' ? 'asc' : 'desc');
    setCurrentPage(1);
  };

  const sortedServers = useMemo(() => {
    const withRank = servers.map((server, index) => ({ server, rank: index + 1 }));
    const sorted = [...withRank].sort((left, right) => {
      const leftServer = left.server;
      const rightServer = right.server;

      if (sortKey === 'rank') return left.rank - right.rank;
      if (sortKey === 'name') return leftServer.name.localeCompare(rightServer.name);
      if (sortKey === 'provider') return leftServer.provider.localeCompare(rightServer.provider);
      if (sortKey === 'niveauRecommandation') return leftServer.niveauRecommandation.localeCompare(rightServer.niveauRecommandation);

      const leftValue = leftServer[sortKey as keyof ServerWithScore] as number;
      const rightValue = rightServer[sortKey as keyof ServerWithScore] as number;
      return leftValue - rightValue;
    });

    if (sortDirection === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }, [servers, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedServers.length / pageSize));

  const currentPageClamped = enablePagination ? Math.min(currentPage, totalPages) : 1;

  const visibleServers = useMemo(() => {
    if (!enablePagination) return sortedServers;
    const start = (currentPageClamped - 1) * pageSize;
    const end = start + pageSize;
    return sortedServers.slice(start, end);
  }, [sortedServers, enablePagination, currentPageClamped, pageSize]);

  const pageSizeOptions = useMemo(() => {
    const options: number[] = [];
    for (let value = pageSizeMin; value <= pageSizeMax; value += pageSizeStep) {
      options.push(value);
    }
    return options;
  }, [pageSizeMin, pageSizeMax, pageSizeStep]);

  const getRecommendationStyle = (niveau: ServerWithScore['niveauRecommandation']) => {
    if (niveau === 'Recommande') {
      return {
        icon: <CircleCheck className="w-4 h-4 text-emerald-400" />,
        textClass: 'text-emerald-300',
        badgeClass: 'bg-emerald-500/10 border border-emerald-500/30',
      };
    }

    if (niveau === 'A etudier') {
      return {
        icon: <TriangleAlert className="w-4 h-4 text-amber-400" />,
        textClass: 'text-amber-300',
        badgeClass: 'bg-amber-500/10 border border-amber-500/30',
      };
    }

    return {
      icon: <CircleX className="w-4 h-4 text-rose-400" />,
      textClass: 'text-rose-300',
      badgeClass: 'bg-rose-500/10 border border-rose-500/30',
    };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-gray-400 border-b border-gray-700">
            <th className="pb-4 pl-4"><SortHeaderButton label="Rang" column="rank" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4"><SortHeaderButton label="Serveur" column="name" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4"><SortHeaderButton label="Fournisseur" column="provider" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4 text-right"><SortHeaderButton label="Cout" column="monthlyCost" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4 text-right"><SortHeaderButton label="RAM" column="ram" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4 text-right"><SortHeaderButton label="CPU" column="cpu" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4 text-right"><SortHeaderButton label="Bande passante" column="bandwidth" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4 text-right"><SortHeaderButton label="Score" column="weightedScore" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            <th className="pb-4 text-right pr-4"><SortHeaderButton label="Avis systeme" column="niveauRecommandation" activeColumn={sortKey} activeDirection={sortDirection} onSort={handleSort} /></th>
            {onToggleCompare && <th className="pb-4 text-right pr-4">Comparer</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {visibleServers.map(({ server, rank }) => (
            <tr
              key={server.id}
              className={`group transition-all duration-300 ${
                selectedIds.includes(server.id) ? 'bg-cyan-500/10 ring-1 ring-inset ring-cyan-400/30' : 'hover:bg-gray-800/50'
              }`}
            >
              <td className="py-4 pl-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-sm">
                  {rank}
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-200">{server.name}</span>
                  {rank <= 3 && (
                    <Award className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </td>
              <td className="py-4 text-gray-400">{server.provider}</td>
              <td className="py-4 text-right text-gray-300">{server.monthlyCost} EUR</td>
              <td className="py-4 text-right text-gray-300">{server.ram} GB</td>
              <td className="py-4 text-right text-gray-300">{server.cpu} GHz</td>
              <td className="py-4 text-right text-gray-300">{server.bandwidth} Gbps</td>
              <td className="py-4 pr-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-emerald-400">
                    {(server.weightedScore * 100).toFixed(1)}%
                  </span>
                </div>
              </td>
              <td className="py-4 pr-4 text-right">
                <div className="flex justify-end">
                  {(() => {
                    const recommendationStyle = getRecommendationStyle(server.niveauRecommandation);

                    return (
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${recommendationStyle.badgeClass} ${recommendationStyle.textClass}`}
                      >
                        {recommendationStyle.icon}
                        <span>{server.niveauRecommandation}</span>
                      </div>
                    );
                  })()}
                </div>
              </td>
              {onToggleCompare && (
                <td className="py-4 pr-4 text-right">
                  <button
                    type="button"
                    onClick={() => onToggleCompare(server)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      selectedIds.includes(server.id)
                        ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20'
                        : 'border-gray-700 bg-gray-900/70 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    aria-pressed={selectedIds.includes(server.id)}
                  >
                    {selectedIds.includes(server.id) ? <Check className="w-3.5 h-3.5" /> : <ArrowLeftRight className="w-3.5 h-3.5" />}
                    {selectedIds.includes(server.id) ? 'Comparé' : 'Comparer'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {enablePagination && sortedServers.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>Lignes par page</span>
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-sm text-gray-200"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-500">({pageSizeMin} - {pageSizeMax})</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Precedent
            </button>

            <span className="text-xs text-gray-400">
              Page {currentPageClamped} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPageClamped === totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-200 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}