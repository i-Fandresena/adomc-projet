'use client';

import { ServerWithScore } from '@/types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface PentagoneStatiqueProps {
  serveur?: ServerWithScore;
}

export function PentagoneStatique({ serveur }: PentagoneStatiqueProps) {
  if (!serveur) {
    return <p className="text-sm text-gray-500">Aucune donnee disponible pour le pentagone.</p>;
  }

  const data = [
    { critere: 'Cout', valeur: serveur.normalizedScores.cost * 100 },
    { critere: 'RAM', valeur: serveur.normalizedScores.ram * 100 },
    { critere: 'CPU', valeur: serveur.normalizedScores.cpu * 100 },
    { critere: 'Bande', valeur: serveur.normalizedScores.bandwidth * 100 },
    { critere: 'Global', valeur: serveur.weightedScore * 100 },
  ];

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="critere" tick={{ fill: '#D1D5DB', fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <Radar
            name="Profil"
            dataKey="valeur"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.35}
            isAnimationActive
            animationDuration={500}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
