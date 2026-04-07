'use client';

import { ServerWithScore } from '@/types';
import { Award, Server, TrendingUp, CircleCheck, TriangleAlert, CircleX } from 'lucide-react';

interface ServerTableProps {
  servers: ServerWithScore[];
}

export function ServerTable({ servers }: ServerTableProps) {
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
            <th className="pb-4 pl-4">Rang</th>
            <th className="pb-4">Serveur</th>
            <th className="pb-4">Fournisseur</th>
            <th className="pb-4 text-right">Cout</th>
            <th className="pb-4 text-right">RAM</th>
            <th className="pb-4 text-right">CPU</th>
            <th className="pb-4 text-right">Bande passante</th>
            <th className="pb-4 text-right">Score</th>
            <th className="pb-4 text-right pr-4">Avis systeme</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {servers.map((server, index) => (
            <tr
              key={server.id}
              className="group hover:bg-gray-800/50 transition-all duration-300"
            >
              <td className="py-4 pl-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-sm">
                  {index + 1}
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-200">{server.name}</span>
                  {index < 3 && (
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
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getRecommendationStyle(server.niveauRecommandation).badgeClass} ${getRecommendationStyle(server.niveauRecommandation).textClass}`}
                  >
                    {getRecommendationStyle(server.niveauRecommandation).icon}
                    <span>{server.niveauRecommandation}</span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}