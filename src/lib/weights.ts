import { WeightDistribution } from '@/types';

const weightKeys = ['cost', 'ram', 'cpu', 'bandwidth'] as const;

export type WeightKey = (typeof weightKeys)[number];

export function redistributeWeights(
  weights: WeightDistribution,
  key: WeightKey,
  nextValue: number
): WeightDistribution {
  const clampedValue = Math.max(0, Math.min(100, Math.round(nextValue)));
  const otherKeys = weightKeys.filter((weightKey) => weightKey !== key);
  const targetForOthers = 100 - clampedValue;
  const currentOthersTotal = otherKeys.reduce((sum, weightKey) => sum + weights[weightKey], 0);

  if (targetForOthers <= 0 || currentOthersTotal <= 0) {
    return {
      cost: key === 'cost' ? clampedValue : 0,
      ram: key === 'ram' ? clampedValue : 0,
      cpu: key === 'cpu' ? clampedValue : 0,
      bandwidth: key === 'bandwidth' ? clampedValue : 0,
    };
  }

  const exactAllocations = otherKeys.map((weightKey) => {
    const exact = (weights[weightKey] / currentOthersTotal) * targetForOthers;
    const floored = Math.floor(exact);

    return {
      key: weightKey,
      value: floored,
      remainder: exact - floored,
    };
  });

  const allocated = exactAllocations.reduce((sum, item) => sum + item.value, 0);
  let remainder = targetForOthers - allocated;
  const sortedByFraction = [...exactAllocations].sort((a, b) => {
    if (b.remainder !== a.remainder) return b.remainder - a.remainder;
    return weightKeys.indexOf(a.key) - weightKeys.indexOf(b.key);
  });

  const nextWeights: WeightDistribution = {
    cost: key === 'cost' ? clampedValue : 0,
    ram: key === 'ram' ? clampedValue : 0,
    cpu: key === 'cpu' ? clampedValue : 0,
    bandwidth: key === 'bandwidth' ? clampedValue : 0,
  };

  for (const allocation of exactAllocations) {
    nextWeights[allocation.key] = allocation.value;
  }

  let cursor = 0;
  while (remainder > 0) {
    const target = sortedByFraction[cursor % sortedByFraction.length];
    nextWeights[target.key] += 1;
    remainder -= 1;
    cursor += 1;
  }

  return nextWeights;
}