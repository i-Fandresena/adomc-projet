export interface Server {
  id: string;
  name: string;
  provider: string;
  monthlyCost: number;
  ram: number;
  cpu: number;
  bandwidth: number;
}

export interface Criteria {
  name: string;
  key: keyof Server;
  weight: number;
  direction: 'max' | 'min';
}

export interface ServerWithScore extends Server {
  normalizedScores: {
    cost: number;
    ram: number;
    cpu: number;
    bandwidth: number;
  };
  weightedScore: number;
  performanceScore: number;
  isParetoOptimal: boolean;
  scoreRecommandation: number;
  niveauRecommandation: 'Recommande' | 'A etudier' | 'Non recommande';
}

export interface WeightDistribution {
  cost: number;
  ram: number;
  cpu: number;
  bandwidth: number;
}