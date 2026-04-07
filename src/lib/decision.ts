import { servers } from '@/lib/data';
import {
  calculateNormalizedScores,
  calculateWeightedScores,
  identifyParetoOptimal,
  rankServers,
  appliquerRecommandationParDefaut,
} from '@/lib/saw';
import { ServerWithScore, WeightDistribution } from '@/types';

export interface FiltresUtilisateur {
  budgetMax?: number;
  ramMin?: number;
  cpuMin?: number;
  bandePassanteMin?: number;
  fournisseur?: string;
  recommandesUniquement?: boolean;
}

export function calculerClassement(
  poids: WeightDistribution,
  filtres?: FiltresUtilisateur
): ServerWithScore[] {
  const { normalized } = calculateNormalizedScores(servers);
  const weighted = calculateWeightedScores(normalized, poids);
  const pareto = identifyParetoOptimal(weighted);
  const recommandes = appliquerRecommandationParDefaut(pareto);
  const classes = rankServers(recommandes);

  if (!filtres) {
    return classes;
  }

  return classes.filter((s) => {
    if (filtres.budgetMax !== undefined && s.monthlyCost > filtres.budgetMax) return false;
    if (filtres.ramMin !== undefined && s.ram < filtres.ramMin) return false;
    if (filtres.cpuMin !== undefined && s.cpu < filtres.cpuMin) return false;
    if (filtres.bandePassanteMin !== undefined && s.bandwidth < filtres.bandePassanteMin) return false;
    if (filtres.fournisseur && filtres.fournisseur !== 'Tous' && s.provider !== filtres.fournisseur) return false;
    if (filtres.recommandesUniquement && s.niveauRecommandation !== 'Recommande') return false;
    return true;
  });
}
