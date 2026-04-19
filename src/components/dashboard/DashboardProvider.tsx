'use client';

import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react';
import { servers } from '@/lib/data';
import { calculerClassement } from '@/lib/decision';
import { redistributeWeights } from '@/lib/weights';
import { GeneratedProfile } from '@/lib/needs-profile';
import { ServerWithScore, WeightDistribution } from '@/types';

export interface Scenario {
  id: string;
  nom: string;
  poids: WeightDistribution;
}

export const DEFAULT_WEIGHTS: WeightDistribution = {
  cost: 25,
  ram: 25,
  cpu: 25,
  bandwidth: 25,
};

export const DEMO_PRESETS = [
  {
    label: 'Equilibre',
    description: 'Repartition homogene pour la presentation generale.',
    weights: DEFAULT_WEIGHTS,
    filters: {
      budgetMax: 24,
      ramMin: 1,
      cpuMin: 1,
      bandePassanteMin: 0.5,
      fournisseur: 'Tous',
      recommandesUniquement: false,
    },
  },
  {
    label: 'Budget serre',
    description: 'Accent fort sur le cout et les offres d entree de gamme.',
    weights: {
      cost: 55,
      ram: 15,
      cpu: 15,
      bandwidth: 15,
    },
    filters: {
      budgetMax: 8,
      ramMin: 1,
      cpuMin: 1,
      bandePassanteMin: 0.5,
      fournisseur: 'Tous',
      recommandesUniquement: false,
    },
  },
  {
    label: 'Performance',
    description: 'Priorite aux ressources pour simuler un besoin applicatif critique.',
    weights: {
      cost: 15,
      ram: 30,
      cpu: 30,
      bandwidth: 25,
    },
    filters: {
      budgetMax: 24,
      ramMin: 4,
      cpuMin: 2,
      bandePassanteMin: 2,
      fournisseur: 'Tous',
      recommandesUniquement: false,
    },
  },
  {
    label: 'Reseau critique',
    description: 'Mise en avant de la bande passante pour les charges intensives.',
    weights: {
      cost: 20,
      ram: 20,
      cpu: 20,
      bandwidth: 40,
    },
    filters: {
      budgetMax: 24,
      ramMin: 2,
      cpuMin: 1,
      bandePassanteMin: 2,
      fournisseur: 'Tous',
      recommandesUniquement: false,
    },
  },
];

interface DashboardContextValue {
  weights: WeightDistribution;
  budgetMax: number;
  ramMin: number;
  cpuMin: number;
  bandePassanteMin: number;
  fournisseurSelectionne: string;
  recommandesUniquement: boolean;
  nomScenario: string;
  scenarioEditionId: string | null;
  nomScenarioEdition: string;
  comparisonIds: string[];
  scenarios: Scenario[];
  guideNotes: string[];
  shareStatus: string;
  fournisseurs: string[];
  costRange: { min: number; max: number };
  resourceRanges: { ramMax: number; cpuMax: number; bandwidthMax: number };
  classementComplet: ServerWithScore[];
  serveursFiltres: ServerWithScore[];
  serveursSelectionnes: ServerWithScore[];
  serveurRadar?: ServerWithScore;
  serveurReference?: ServerWithScore;
  indicateurs: { recommandes: number; pareto: number; total: number };
  setNomScenario: (value: string) => void;
  setNomScenarioEdition: (value: string) => void;
  setScenarioEditionId: (value: string | null) => void;
  setBudgetMax: (value: number) => void;
  setRamMin: (value: number) => void;
  setCpuMin: (value: number) => void;
  setBandePassanteMin: (value: number) => void;
  setFournisseurSelectionne: (value: string) => void;
  setRecommandesUniquement: (value: boolean) => void;
  setShareStatus: (value: string) => void;
  handleWeightChange: (key: keyof WeightDistribution, value: number) => void;
  appliquerPreset: (index: number) => void;
  appliquerProfilGuide: (profil: GeneratedProfile) => void;
  toggleComparison: (server: ServerWithScore) => void;
  clearComparison: () => void;
  reinitialiserFiltres: () => void;
  sauvegarderScenario: () => void;
  chargerScenario: (scenario: Scenario) => void;
  supprimerScenario: (idScenario: string) => void;
  demarrerEditionScenario: (scenario: Scenario) => void;
  annulerEditionScenario: () => void;
  validerEditionScenario: (idScenario: string) => void;
  exporterResultatsCsv: () => void;
  exporterResultatsPdf: () => void;
  partagerConfiguration: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [weights, setWeights] = useState<WeightDistribution>(() => {
    if (typeof window === 'undefined') return DEFAULT_WEIGHTS;
    const brut = window.localStorage.getItem('adomc-poids');
    if (!brut) return DEFAULT_WEIGHTS;
    try {
      return JSON.parse(brut) as WeightDistribution;
    } catch {
      return DEFAULT_WEIGHTS;
    }
  });

  const [budgetMax, setBudgetMax] = useState<number>(24);
  const [ramMin, setRamMin] = useState<number>(1);
  const [cpuMin, setCpuMin] = useState<number>(1);
  const [bandePassanteMin, setBandePassanteMin] = useState<number>(0.5);
  const [fournisseurSelectionne, setFournisseurSelectionne] = useState<string>('Tous');
  const [recommandesUniquement, setRecommandesUniquement] = useState(false);
  const [nomScenario, setNomScenario] = useState('');
  const [scenarioEditionId, setScenarioEditionId] = useState<string | null>(null);
  const [nomScenarioEdition, setNomScenarioEdition] = useState('');
  const [comparisonIds, setComparisonIds] = useState<string[]>(() =>
    calculerClassement(DEFAULT_WEIGHTS)
      .slice(0, 2)
      .map((server) => server.id)
  );
  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    if (typeof window === 'undefined') return [];
    const brut = window.localStorage.getItem('adomc-scenarios');
    if (!brut) return [];
    try {
      return JSON.parse(brut) as Scenario[];
    } catch {
      return [];
    }
  });
  const [guideNotes, setGuideNotes] = useState<string[]>([]);
  const [shareStatus, setShareStatus] = useState('');

  const fournisseurs = useMemo(() => {
    const uniques = Array.from(new Set(servers.map((s) => s.provider))).sort((a, b) => a.localeCompare(b));
    return ['Tous', ...uniques];
  }, []);

  const costRange = useMemo(() => {
    const costs = servers.map((s) => s.monthlyCost);
    return { min: Math.min(...costs), max: Math.max(...costs) };
  }, []);

  const resourceRanges = useMemo(() => {
    const rams = servers.map((s) => s.ram);
    const cpus = servers.map((s) => s.cpu);
    const bandwidths = servers.map((s) => s.bandwidth);
    return {
      ramMax: Math.ceil(Math.max(...rams)),
      cpuMax: Math.ceil(Math.max(...cpus)),
      bandwidthMax: Math.ceil(Math.max(...bandwidths)),
    };
  }, []);

  const classementComplet = useMemo(() => calculerClassement(weights), [weights]);

  const serveursFiltres = useMemo(() => {
    return classementComplet.filter((s) => {
      if (s.monthlyCost > budgetMax) return false;
      if (s.ram < ramMin) return false;
      if (s.cpu < cpuMin) return false;
      if (s.bandwidth < bandePassanteMin) return false;
      if (fournisseurSelectionne !== 'Tous' && s.provider !== fournisseurSelectionne) return false;
      if (recommandesUniquement && s.niveauRecommandation !== 'Recommande') return false;
      return true;
    });
  }, [classementComplet, budgetMax, ramMin, cpuMin, bandePassanteMin, fournisseurSelectionne, recommandesUniquement]);

  const serveursSelectionnes = useMemo(
    () =>
      comparisonIds
        .map((id) => classementComplet.find((server) => server.id === id))
        .filter((server): server is ServerWithScore => Boolean(server)),
    [comparisonIds, classementComplet]
  );

  const serveurRadar = serveursSelectionnes[0] ?? serveursFiltres[0];
  const serveurReference = serveursSelectionnes[1] ?? serveursFiltres[1];

  const indicateurs = useMemo(() => {
    const recommandes = serveursFiltres.filter((s) => s.niveauRecommandation === 'Recommande').length;
    const pareto = serveursFiltres.filter((s) => s.isParetoOptimal).length;
    return { recommandes, pareto, total: serveursFiltres.length };
  }, [serveursFiltres]);

  const appliquerConfiguration = (
    prochainPoids: WeightDistribution,
    filtres: {
      budgetMax: number;
      ramMin: number;
      cpuMin: number;
      bandePassanteMin: number;
      fournisseur: string;
      recommandesUniquement: boolean;
    }
  ) => {
    setWeights(prochainPoids);
    setBudgetMax(filtres.budgetMax);
    setRamMin(filtres.ramMin);
    setCpuMin(filtres.cpuMin);
    setBandePassanteMin(filtres.bandePassanteMin);
    setFournisseurSelectionne(filtres.fournisseur);
    setRecommandesUniquement(filtres.recommandesUniquement);
    setComparisonIds(
      calculerClassement(prochainPoids)
        .slice(0, 2)
        .map((server) => server.id)
    );

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adomc-poids', JSON.stringify(prochainPoids));
    }
  };

  const handleWeightChange = (key: keyof WeightDistribution, value: number) => {
    const newWeights = redistributeWeights(weights, key as 'cost' | 'ram' | 'cpu' | 'bandwidth', value);
    setWeights(newWeights);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adomc-poids', JSON.stringify(newWeights));
    }
  };

  const appliquerPreset = (index: number) => {
    const preset = DEMO_PRESETS[index];
    if (!preset) return;
    appliquerConfiguration(preset.weights, preset.filters);
    setGuideNotes([]);
  };

  const appliquerProfilGuide = (profil: GeneratedProfile) => {
    appliquerConfiguration(profil.weights, profil.filters);
    setGuideNotes(profil.notes);
  };

  const toggleComparison = (server: ServerWithScore) => {
    setComparisonIds((current) => {
      if (current.includes(server.id)) {
        return current.filter((id) => id !== server.id);
      }
      if (current.length >= 3) return current;
      return [...current, server.id];
    });
  };

  const clearComparison = () => setComparisonIds([]);

  const reinitialiserFiltres = () => {
    setBudgetMax(Math.ceil(costRange.max));
    setRamMin(1);
    setCpuMin(1);
    setBandePassanteMin(0.5);
    setFournisseurSelectionne('Tous');
    setRecommandesUniquement(false);
  };

  const sauvegarderScenario = () => {
    const nom = nomScenario.trim();
    if (!nom) return;
    const nouveauScenario: Scenario = { id: `${Date.now()}`, nom, poids: weights };
    const maj = [nouveauScenario, ...scenarios].slice(0, 8);
    setScenarios(maj);
    setNomScenario('');
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adomc-scenarios', JSON.stringify(maj));
    }
  };

  const chargerScenario = (scenario: Scenario) => {
    setWeights(scenario.poids);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adomc-poids', JSON.stringify(scenario.poids));
    }
  };

  const supprimerScenario = (idScenario: string) => {
    const maj = scenarios.filter((s) => s.id !== idScenario);
    setScenarios(maj);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adomc-scenarios', JSON.stringify(maj));
    }
  };

  const demarrerEditionScenario = (scenario: Scenario) => {
    setScenarioEditionId(scenario.id);
    setNomScenarioEdition(scenario.nom);
  };

  const annulerEditionScenario = () => {
    setScenarioEditionId(null);
    setNomScenarioEdition('');
  };

  const validerEditionScenario = (idScenario: string) => {
    const nouveauNom = nomScenarioEdition.trim();
    if (!nouveauNom) return;
    const maj = scenarios.map((s) => (s.id === idScenario ? { ...s, nom: nouveauNom } : s));
    setScenarios(maj);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adomc-scenarios', JSON.stringify(maj));
    }
    annulerEditionScenario();
  };

  const exporterResultatsCsv = () => {
    if (serveursFiltres.length === 0 || typeof window === 'undefined') return;
    const entetes = [
      'Rang',
      'Serveur',
      'Fournisseur',
      'Cout_EUR',
      'RAM_GB',
      'CPU_GHz',
      'BandePassante_Gbps',
      'Score_global_pct',
      'Score_recommandation_pct',
      'Niveau_recommandation',
      'Pareto_optimale',
    ];
    const lignes = serveursFiltres.map((s, index) =>
      [
        index + 1,
        s.name,
        s.provider,
        s.monthlyCost,
        s.ram,
        s.cpu,
        s.bandwidth,
        (s.weightedScore * 100).toFixed(2),
        (s.scoreRecommandation * 100).toFixed(2),
        s.niveauRecommandation,
        s.isParetoOptimal ? 'Oui' : 'Non',
      ].join(';')
    );
    const contenu = [entetes.join(';'), ...lignes].join('\n');
    const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = 'classement-vps-saw.csv';
    lien.click();
    URL.revokeObjectURL(url);
  };

  const exporterResultatsPdf = () => {
    if (serveursFiltres.length === 0 || typeof window === 'undefined') return;
    const lignes = serveursFiltres
      .map(
        (serveur, index) =>
          `<tr><td>${index + 1}</td><td>${serveur.name}</td><td>${serveur.provider}</td><td>${serveur.monthlyCost.toFixed(2)} EUR</td><td>${serveur.ram} GB</td><td>${serveur.cpu.toFixed(1)} GHz</td><td>${serveur.bandwidth.toFixed(1)} Gbps</td><td>${(serveur.weightedScore * 100).toFixed(2)}%</td><td>${serveur.niveauRecommandation}</td></tr>`
      )
      .join('');

    const popup = window.open('', '_blank', 'width=1100,height=780');
    if (!popup) return;
    popup.document.write(`
      <html><head><title>Rapport SAW - Classement VPS</title>
      <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      h1 { margin: 0 0 10px; }
      .meta { margin-bottom: 16px; color: #444; }
      .chips { margin-bottom: 16px; }
      .chip { display: inline-block; margin-right: 8px; background: #f2f2f2; padding: 4px 8px; border-radius: 999px; font-size: 12px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }
      th { background: #f6f6f6; }
      </style></head>
      <body>
      <h1>Rapport SAW - Aide a la decision VPS</h1>
      <p class="meta">Genere le ${new Date().toLocaleString('fr-FR')}</p>
      <div class="chips">
      <span class="chip">Poids cout: ${weights.cost}%</span>
      <span class="chip">Poids RAM: ${weights.ram}%</span>
      <span class="chip">Poids CPU: ${weights.cpu}%</span>
      <span class="chip">Poids bande passante: ${weights.bandwidth}%</span>
      </div>
      <table><thead><tr><th>Rang</th><th>Serveur</th><th>Fournisseur</th><th>Cout</th><th>RAM</th><th>CPU</th><th>Bande passante</th><th>Score</th><th>Avis</th></tr></thead><tbody>${lignes}</tbody></table>
      </body></html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  const partagerConfiguration = async () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams({
      w_cost: String(weights.cost),
      w_ram: String(weights.ram),
      w_cpu: String(weights.cpu),
      w_bandwidth: String(weights.bandwidth),
      f_budget: String(budgetMax),
      f_ram: String(ramMin),
      f_cpu: String(cpuMin),
      f_bandwidth: String(bandePassanteMin),
      f_provider: fournisseurSelectionne,
      f_reco: recommandesUniquement ? '1' : '0',
    });
    const url = `${window.location.origin}/dashboard/classement?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Lien de configuration copie dans le presse-papiers.');
    } catch {
      setShareStatus(`Copie impossible automatiquement. Lien: ${url}`);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (![...params.keys()].some((key) => key.startsWith('w_') || key.startsWith('f_'))) return;

      const parsedWeights: WeightDistribution = {
        cost: Number(params.get('w_cost') ?? DEFAULT_WEIGHTS.cost),
        ram: Number(params.get('w_ram') ?? DEFAULT_WEIGHTS.ram),
        cpu: Number(params.get('w_cpu') ?? DEFAULT_WEIGHTS.cpu),
        bandwidth: Number(params.get('w_bandwidth') ?? DEFAULT_WEIGHTS.bandwidth),
      };
      const total = parsedWeights.cost + parsedWeights.ram + parsedWeights.cpu + parsedWeights.bandwidth;
      if (total !== 100) return;

      appliquerConfiguration(parsedWeights, {
        budgetMax: Number(params.get('f_budget') ?? 24),
        ramMin: Number(params.get('f_ram') ?? 1),
        cpuMin: Number(params.get('f_cpu') ?? 1),
        bandePassanteMin: Number(params.get('f_bandwidth') ?? 0.5),
        fournisseur: params.get('f_provider') ?? 'Tous',
        recommandesUniquement: params.get('f_reco') === '1',
      });
      setShareStatus('Configuration partagee chargee depuis l URL.');
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        weights,
        budgetMax,
        ramMin,
        cpuMin,
        bandePassanteMin,
        fournisseurSelectionne,
        recommandesUniquement,
        nomScenario,
        scenarioEditionId,
        nomScenarioEdition,
        comparisonIds,
        scenarios,
        guideNotes,
        shareStatus,
        fournisseurs,
        costRange,
        resourceRanges,
        classementComplet,
        serveursFiltres,
        serveursSelectionnes,
        serveurRadar,
        serveurReference,
        indicateurs,
        setNomScenario,
        setNomScenarioEdition,
        setScenarioEditionId,
        setBudgetMax,
        setRamMin,
        setCpuMin,
        setBandePassanteMin,
        setFournisseurSelectionne,
        setRecommandesUniquement,
        setShareStatus,
        handleWeightChange,
        appliquerPreset,
        appliquerProfilGuide,
        toggleComparison,
        clearComparison,
        reinitialiserFiltres,
        sauvegarderScenario,
        chargerScenario,
        supprimerScenario,
        demarrerEditionScenario,
        annulerEditionScenario,
        validerEditionScenario,
        exporterResultatsCsv,
        exporterResultatsPdf,
        partagerConfiguration,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard doit etre utilise dans DashboardProvider');
  }
  return context;
}
