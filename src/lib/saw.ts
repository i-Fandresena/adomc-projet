import { Server, ServerWithScore, WeightDistribution } from '@/types';

export function minMaxNormalize(
  value: number,
  min: number,
  max: number,
  direction: 'max' | 'min'
): number {
  if (max === min) return 1;
  if (direction === 'max') {
    return (value - min) / (max - min);
  }
  return (max - value) / (max - min);
}

export function calculateNormalizedScores(
  servers: Server[]
): { min: number; max: number; normalized: ServerWithScore[] } {
  const getRange = (key: keyof Server) => {
    const values = servers.map(s => s[key] as number);
    return { min: Math.min(...values), max: Math.max(...values) };
  };

  const costRange = getRange('monthlyCost');
  const ramRange = getRange('ram');
  const cpuRange = getRange('cpu');
  const bandwidthRange = getRange('bandwidth');

  const normalized = servers.map(server => {
    const normalizedScores = {
      cost: minMaxNormalize(server.monthlyCost, costRange.min, costRange.max, 'min'),
      ram: minMaxNormalize(server.ram, ramRange.min, ramRange.max, 'max'),
      cpu: minMaxNormalize(server.cpu, cpuRange.min, cpuRange.max, 'max'),
      bandwidth: minMaxNormalize(server.bandwidth, bandwidthRange.min, bandwidthRange.max, 'max'),
    };

    return {
      ...server,
      normalizedScores,
      weightedScore: 0,
      performanceScore: 0,
      isParetoOptimal: false,
      scoreRecommandation: 0,
      niveauRecommandation: 'A etudier' as const,
    };
  });

  return { min: costRange.min, max: costRange.max, normalized };
}

export function calculateWeightedScores(
  normalizedServers: ServerWithScore[],
  weights: WeightDistribution
): ServerWithScore[] {
  const totalWeight = weights.cost + weights.ram + weights.cpu + weights.bandwidth;
  const normalizedWeights = {
    cost: weights.cost / totalWeight,
    ram: weights.ram / totalWeight,
    cpu: weights.cpu / totalWeight,
    bandwidth: weights.bandwidth / totalWeight,
  };

  return normalizedServers.map(server => {
    const weightedScore =
      server.normalizedScores.cost * normalizedWeights.cost +
      server.normalizedScores.ram * normalizedWeights.ram +
      server.normalizedScores.cpu * normalizedWeights.cpu +
      server.normalizedScores.bandwidth * normalizedWeights.bandwidth;

    const performanceScore =
      server.normalizedScores.ram * normalizedWeights.ram +
      server.normalizedScores.cpu * normalizedWeights.cpu +
      server.normalizedScores.bandwidth * normalizedWeights.bandwidth;

    return { ...server, weightedScore, performanceScore };
  });
}

export function appliquerRecommandationParDefaut(
  servers: ServerWithScore[]
): ServerWithScore[] {
  const poidsSysteme = {
    cost: 0.3,
    ram: 0.25,
    cpu: 0.2,
    bandwidth: 0.25,
  };

  return servers.map((server) => {
    const scoreRecommandation =
      server.normalizedScores.cost * poidsSysteme.cost +
      server.normalizedScores.ram * poidsSysteme.ram +
      server.normalizedScores.cpu * poidsSysteme.cpu +
      server.normalizedScores.bandwidth * poidsSysteme.bandwidth;

    let niveauRecommandation: ServerWithScore['niveauRecommandation'] = 'Non recommande' as const;
    if (scoreRecommandation >= 0.7) {
      niveauRecommandation = 'Recommande' as const;
    } else if (scoreRecommandation >= 0.55) {
      niveauRecommandation = 'A etudier' as const;
    }

    return { ...server, scoreRecommandation, niveauRecommandation };
  });
}

export function identifyParetoOptimal(servers: ServerWithScore[]): ServerWithScore[] {
  const paretoOptimal: ServerWithScore[] = [];

  for (const candidate of servers) {
    let isDominated = false;

    for (const other of servers) {
      if (candidate.id === other.id) continue;

      const dominates =
        other.monthlyCost <= candidate.monthlyCost &&
        other.ram >= candidate.ram &&
        other.cpu >= candidate.cpu &&
        other.bandwidth >= candidate.bandwidth &&
        (other.monthlyCost < candidate.monthlyCost ||
          other.ram > candidate.ram ||
          other.cpu > candidate.cpu ||
          other.bandwidth > candidate.bandwidth);

      if (dominates) {
        isDominated = true;
        break;
      }
    }

    paretoOptimal.push({ ...candidate, isParetoOptimal: !isDominated });
  }

  return paretoOptimal;
}

export function rankServers(servers: ServerWithScore[]): ServerWithScore[] {
  return [...servers].sort((a, b) => b.weightedScore - a.weightedScore);
}