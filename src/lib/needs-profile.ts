import { WeightDistribution } from '@/types';

export type UsageType =
  | 'web'
  | 'api'
  | 'database'
  | 'analytics'
  | 'devops'
  | 'backup'
  | 'media';

export type PriorityType = 'balanced' | 'cost' | 'performance' | 'network' | 'memory' | 'cpu';
export type LoadType = 'low' | 'medium' | 'high';

export interface NeedsFormData {
  usageType: UsageType;
  priority: PriorityType;
  load: LoadType;
  budgetMax: number;
  provider: string;
  highAvailability: boolean;
  burstTraffic: boolean;
  lowLatency: boolean;
  dataIntensive: boolean;
  computeIntensive: boolean;
  recommendedOnly: boolean;
}

export interface GeneratedProfile {
  weights: WeightDistribution;
  filters: {
    budgetMax: number;
    ramMin: number;
    cpuMin: number;
    bandePassanteMin: number;
    fournisseur: string;
    recommandesUniquement: boolean;
  };
  notes: string[];
}

function normalizeWeights(raw: WeightDistribution): WeightDistribution {
  const total = raw.cost + raw.ram + raw.cpu + raw.bandwidth;
  if (total <= 0) {
    return { cost: 25, ram: 25, cpu: 25, bandwidth: 25 };
  }

  const exact = {
    cost: (raw.cost / total) * 100,
    ram: (raw.ram / total) * 100,
    cpu: (raw.cpu / total) * 100,
    bandwidth: (raw.bandwidth / total) * 100,
  };

  const floored = {
    cost: Math.floor(exact.cost),
    ram: Math.floor(exact.ram),
    cpu: Math.floor(exact.cpu),
    bandwidth: Math.floor(exact.bandwidth),
  };

  const remainders = [
    { key: 'cost' as const, value: exact.cost - floored.cost },
    { key: 'ram' as const, value: exact.ram - floored.ram },
    { key: 'cpu' as const, value: exact.cpu - floored.cpu },
    { key: 'bandwidth' as const, value: exact.bandwidth - floored.bandwidth },
  ].sort((a, b) => b.value - a.value);

  let missing = 100 - (floored.cost + floored.ram + floored.cpu + floored.bandwidth);
  let cursor = 0;
  while (missing > 0) {
    const target = remainders[cursor % remainders.length].key;
    floored[target] += 1;
    missing -= 1;
    cursor += 1;
  }

  return floored;
}

function baseWeightsByPriority(priority: PriorityType): WeightDistribution {
  if (priority === 'cost') {
    return { cost: 50, ram: 20, cpu: 15, bandwidth: 15 };
  }
  if (priority === 'performance') {
    return { cost: 15, ram: 30, cpu: 30, bandwidth: 25 };
  }
  if (priority === 'network') {
    return { cost: 20, ram: 20, cpu: 20, bandwidth: 40 };
  }
  if (priority === 'memory') {
    return { cost: 20, ram: 45, cpu: 20, bandwidth: 15 };
  }
  if (priority === 'cpu') {
    return { cost: 20, ram: 20, cpu: 45, bandwidth: 15 };
  }

  return { cost: 25, ram: 25, cpu: 25, bandwidth: 25 };
}

export function buildProfileFromNeeds(form: NeedsFormData): GeneratedProfile {
  const weights = baseWeightsByPriority(form.priority);
  const notes: string[] = [];

  if (form.usageType === 'web' || form.usageType === 'api') {
    weights.bandwidth += 8;
    notes.push('Cas web/API: bande passante renforcée pour la réactivité réseau.');
  }
  if (form.usageType === 'database') {
    weights.ram += 10;
    weights.cpu += 6;
    notes.push('Cas base de données: RAM et CPU augmentés pour les requêtes.');
  }
  if (form.usageType === 'analytics') {
    weights.cpu += 12;
    weights.ram += 8;
    notes.push('Cas analytique: forte pondération CPU/RAM pour les traitements.');
  }
  if (form.usageType === 'media') {
    weights.bandwidth += 12;
    weights.cpu += 6;
    notes.push('Cas média: bande passante et CPU renforcés.');
  }
  if (form.usageType === 'backup') {
    weights.cost += 8;
    weights.bandwidth += 6;
    notes.push('Cas sauvegarde: compromis coût/réseau privilégié.');
  }

  if (form.highAvailability) {
    weights.ram += 4;
    weights.cpu += 4;
    notes.push('Haute disponibilité: ressources renforcées pour la stabilité.');
  }
  if (form.burstTraffic) {
    weights.bandwidth += 8;
    notes.push('Pics de trafic: accent sur la capacité réseau.');
  }
  if (form.lowLatency) {
    weights.bandwidth += 8;
    notes.push('Latence critique: priorité renforcée au réseau.');
  }
  if (form.dataIntensive) {
    weights.ram += 8;
    notes.push('Charge data-intensive: mémoire augmentée.');
  }
  if (form.computeIntensive) {
    weights.cpu += 10;
    notes.push('Calcul intensif: priorité CPU augmentée.');
  }

  const normalizedWeights = normalizeWeights(weights);

  let ramMin = 1;
  let cpuMin = 1;
  let bandePassanteMin = 0.5;

  if (form.load === 'medium') {
    ramMin = 2;
    cpuMin = 2;
    bandePassanteMin = 1;
  }
  if (form.load === 'high') {
    ramMin = 4;
    cpuMin = 3;
    bandePassanteMin = 2;
    notes.push('Niveau de charge élevé: filtres minimums durcis.');
  }

  if (form.dataIntensive) {
    ramMin = Math.max(ramMin, 4);
  }
  if (form.computeIntensive) {
    cpuMin = Math.max(cpuMin, 3);
  }
  if (form.burstTraffic || form.lowLatency || form.usageType === 'media') {
    bandePassanteMin = Math.max(bandePassanteMin, 2);
  }

  return {
    weights: normalizedWeights,
    filters: {
      budgetMax: Math.max(1, form.budgetMax),
      ramMin,
      cpuMin,
      bandePassanteMin,
      fournisseur: form.provider,
      recommandesUniquement: form.recommendedOnly,
    },
    notes,
  };
}
