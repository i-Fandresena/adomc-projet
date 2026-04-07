import { describe, expect, it } from 'vitest';
import {
  minMaxNormalize,
  calculateNormalizedScores,
  calculateWeightedScores,
  identifyParetoOptimal,
  rankServers,
  appliquerRecommandationParDefaut,
} from '@/lib/saw';
import { servers } from '@/lib/data';
import { WeightDistribution } from '@/types';

describe('Moteur SAW', () => {
  it('normalise correctement un critere a maximiser', () => {
    expect(minMaxNormalize(5, 0, 10, 'max')).toBe(0.5);
  });

  it('normalise correctement un critere a minimiser', () => {
    expect(minMaxNormalize(2, 0, 10, 'min')).toBe(0.8);
  });

  it('retourne 1 si max et min sont egaux', () => {
    expect(minMaxNormalize(5, 5, 5, 'max')).toBe(1);
  });

  it('calcule des scores ponderes et classe les offres', () => {
    const poids: WeightDistribution = { cost: 40, ram: 20, cpu: 20, bandwidth: 20 };
    const { normalized } = calculateNormalizedScores(servers);
    const ponderes = calculateWeightedScores(normalized, poids);
    const pareto = identifyParetoOptimal(ponderes);
    const recommandes = appliquerRecommandationParDefaut(pareto);
    const classes = rankServers(recommandes);

    expect(classes).toHaveLength(servers.length);
    expect(classes[0].weightedScore).toBeGreaterThanOrEqual(classes[1].weightedScore);
    expect(classes.every((s) => s.weightedScore >= 0 && s.weightedScore <= 1)).toBe(true);
  });

  it('attribue un niveau de recommandation valide', () => {
    const poids: WeightDistribution = { cost: 25, ram: 25, cpu: 25, bandwidth: 25 };
    const { normalized } = calculateNormalizedScores(servers);
    const ponderes = calculateWeightedScores(normalized, poids);
    const pareto = identifyParetoOptimal(ponderes);
    const recommandes = appliquerRecommandationParDefaut(pareto);

    expect(
      recommandes.every((s) =>
        ['Recommande', 'A etudier', 'Non recommande'].includes(s.niveauRecommandation)
      )
    ).toBe(true);
  });
});
