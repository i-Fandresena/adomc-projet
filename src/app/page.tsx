'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { servers } from '@/lib/data';
import { calculerClassement } from '@/lib/decision';
import { WeightDistribution } from '@/types';
import { WeightSlider } from '@/components/WeightSlider';
import { ServerTable } from '@/components/ServerTable';
import {
  Calculator,
  BarChart3,
  Scale,
  Info,
  ShieldCheck,
  Target,
  Filter,
  Save,
  FolderOpen,
  Trash2,
  Download,
  Pencil,
  Check,
  X,
  FlaskConical,
} from 'lucide-react';

const ParetoChart = dynamic(() => import('@/components/ParetoChart').then((mod) => mod.ParetoChart), {
  ssr: false,
});

interface Scenario {
  id: string;
  nom: string;
  poids: WeightDistribution;
}

export default function Home() {
  const [weights, setWeights] = useState<WeightDistribution>(() => {
    if (typeof window === 'undefined') {
      return { cost: 25, ram: 25, cpu: 25, bandwidth: 25 };
    }

    const brut = window.localStorage.getItem('adomc-poids');
    if (!brut) return { cost: 25, ram: 25, cpu: 25, bandwidth: 25 };

    try {
      return JSON.parse(brut) as WeightDistribution;
    } catch {
      return { cost: 25, ram: 25, cpu: 25, bandwidth: 25 };
    }
  });

  const [budgetMax, setBudgetMax] = useState<number>(30);
  const [ramMin, setRamMin] = useState<number>(1);
  const [cpuMin, setCpuMin] = useState<number>(1);
  const [bandePassanteMin, setBandePassanteMin] = useState<number>(0.5);
  const [fournisseurSelectionne, setFournisseurSelectionne] = useState<string>('Tous');
  const [recommandesUniquement, setRecommandesUniquement] = useState(false);
  const [nomScenario, setNomScenario] = useState('');
  const [scenarioEditionId, setScenarioEditionId] = useState<string | null>(null);
  const [nomScenarioEdition, setNomScenarioEdition] = useState('');
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

  const fournisseurs = useMemo(() => {
    const uniques = Array.from(new Set(servers.map((s) => s.provider))).sort((a, b) => a.localeCompare(b));
    return ['Tous', ...uniques];
  }, []);

  const serveursFiltres = useMemo(() => {
    return calculerClassement(weights, {
      budgetMax,
      ramMin,
      cpuMin,
      bandePassanteMin,
      fournisseur: fournisseurSelectionne,
      recommandesUniquement,
    });
  }, [
    weights,
    budgetMax,
    ramMin,
    cpuMin,
    bandePassanteMin,
    fournisseurSelectionne,
    recommandesUniquement,
  ]);

  const indicateurs = useMemo(() => {
    const recommandes = serveursFiltres.filter((s) => s.niveauRecommandation === 'Recommande').length;
    const pareto = serveursFiltres.filter((s) => s.isParetoOptimal).length;
    return { recommandes, pareto, total: serveursFiltres.length };
  }, [serveursFiltres]);

  const costRange = useMemo(() => {
    const costs = servers.map(s => s.monthlyCost);
    return { min: Math.min(...costs), max: Math.max(...costs) };
  }, []);

  const handleWeightChange = (key: keyof WeightDistribution, value: number) => {
    const diff = value - weights[key];
    const otherKeys = Object.keys(weights).filter(k => k !== key) as (keyof WeightDistribution)[];
    
    const newWeights = { ...weights, [key]: value };
    const otherTotal = otherKeys.reduce((sum, k) => sum + newWeights[k], 0);
    
    if (otherTotal + diff !== 100) {
      const scale = (100 - value) / otherTotal;
      otherKeys.forEach(k => {
        newWeights[k] = Math.round(newWeights[k] * scale);
      });
    }
    
    const total = Object.values(newWeights).reduce((a, b) => a + b, 0);
    if (total !== 100) {
      const remainder = 100 - total;
      newWeights.cost += remainder;
    }
    
    setWeights(newWeights);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adomc-poids', JSON.stringify(newWeights));
    }
  };

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

    const nouveauScenario: Scenario = {
      id: `${Date.now()}`,
      nom,
      poids: weights,
    };

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
    if (serveursFiltres.length === 0) return;

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

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Calculator className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Aide a la decision multicritere</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="gradient-text">Methode SAW</span>
            <span className="text-white"> - Selection de VPS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Evaluez et classez des offres VPS avec une agregation ponderee. Ajustez vos criteres
            pour identifier la solution la plus adaptee a votre besoin.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">Offres analysees</p>
              <p className="text-2xl font-bold text-white">{indicateurs.total}</p>
            </div>
            <Target className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">Pareto optimales</p>
              <p className="text-2xl font-bold text-white">{indicateurs.pareto}</p>
            </div>
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">Recommandees</p>
              <p className="text-2xl font-bold text-white">{indicateurs.recommandes}</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-violet-400" />
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-semibold text-white">Ponderation des criteres</h2>
              </div>
              
              <div className="space-y-6">
                <WeightSlider
                  label="Cout mensuel"
                  value={weights.cost}
                  onChange={(v) => handleWeightChange('cost', v)}
                  color="bg-rose-500"
                  icon={<span className="text-rose-400 text-lg">$</span>}
                />
                <WeightSlider
                  label="RAM"
                  value={weights.ram}
                  onChange={(v) => handleWeightChange('ram', v)}
                  color="bg-cyan-500"
                  icon={<span className="text-cyan-400 text-lg">G</span>}
                />
                <WeightSlider
                  label="Performance CPU"
                  value={weights.cpu}
                  onChange={(v) => handleWeightChange('cpu', v)}
                  color="bg-violet-500"
                  icon={<span className="text-violet-400 text-lg">Hz</span>}
                />
                <WeightSlider
                  label="Bande passante"
                  value={weights.bandwidth}
                  onChange={(v) => handleWeightChange('bandwidth', v)}
                  color="bg-emerald-500"
                  icon={<span className="text-emerald-400 text-lg">&gt;</span>}
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total des poids</span>
                  <span className="font-semibold text-white">
                    {Object.values(weights).reduce((a, b) => a + b, 0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Filtres utilisateur</h3>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-gray-300">Budget maximal: {budgetMax} EUR</span>
                  <input
                    type="range"
                    min={Math.floor(costRange.min)}
                    max={Math.ceil(costRange.max)}
                    step="1"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-300">RAM minimale: {ramMin} GB</span>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={ramMin}
                    onChange={(e) => setRamMin(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-300">CPU minimal: {cpuMin} GHz / vCPU eq.</span>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={cpuMin}
                    onChange={(e) => setCpuMin(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-300">Bande passante minimale: {bandePassanteMin} Gbps</span>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={bandePassanteMin}
                    onChange={(e) => setBandePassanteMin(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-300">Fournisseur</span>
                  <select
                    value={fournisseurSelectionne}
                    onChange={(e) => setFournisseurSelectionne(e.target.value)}
                    className="mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200"
                  >
                    {fournisseurs.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={recommandesUniquement}
                    onChange={(e) => setRecommandesUniquement(e.target.checked)}
                    className="accent-violet-500"
                  />
                  Afficher uniquement les offres recommandees
                </label>
              </div>

              <button
                type="button"
                onClick={reinitialiserFiltres}
                className="mt-4 w-full rounded-lg border border-gray-700 bg-gray-800/70 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700/70 transition-colors"
              >
                Reinitialiser les filtres
              </button>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Lecture Pareto</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Les points verts sont des solutions non dominees. Une offre ne peut pas etre
                amelioree sur un critere sans se degrader sur au moins un autre critere.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-400">Pareto optimale</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-xs text-gray-400">Dominee</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center gap-3 mb-4">
                <Save className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Scenarios de ponderation</h3>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={nomScenario}
                  onChange={(e) => setNomScenario(e.target.value)}
                  placeholder="Nom du scenario"
                  className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={sauvegarderScenario}
                  className="rounded-lg bg-emerald-600/90 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500/90 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {scenarios.length === 0 ? (
                  <p className="text-xs text-gray-500">Aucun scenario enregistre.</p>
                ) : (
                  scenarios.map((s) => (
                    <div
                      key={s.id}
                      className="w-full flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2"
                    >
                      {scenarioEditionId === s.id ? (
                        <div className="w-full flex items-center gap-2">
                          <input
                            type="text"
                            value={nomScenarioEdition}
                            onChange={(e) => setNomScenarioEdition(e.target.value)}
                            className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-sm text-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => validerEditionScenario(s.id)}
                            className="text-emerald-400 hover:text-emerald-300 transition-colors"
                            aria-label={`Valider le renommage du scenario ${s.nom}`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={annulerEditionScenario}
                            className="text-gray-400 hover:text-gray-200 transition-colors"
                            aria-label={`Annuler le renommage du scenario ${s.nom}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => chargerScenario(s)}
                            className="flex items-center gap-2 text-left hover:text-cyan-300 transition-colors"
                          >
                            <span className="text-sm text-gray-200">{s.nom}</span>
                            <FolderOpen className="w-4 h-4 text-cyan-400" />
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => demarrerEditionScenario(s)}
                              className="text-gray-400 hover:text-cyan-400 transition-colors"
                              aria-label={`Renommer le scenario ${s.nom}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => supprimerScenario(s.id)}
                              className="text-gray-400 hover:text-rose-400 transition-colors"
                              aria-label={`Supprimer le scenario ${s.nom}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Analyse du front de Pareto</h2>
              </div>
              <ParetoChart servers={serveursFiltres} costMax={costRange.max} />
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="text-xl font-semibold text-white">Classement des serveurs</h2>
                <button
                  type="button"
                  onClick={exporterResultatsCsv}
                  disabled={serveursFiltres.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exporter CSV
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-6">
                L&apos;avis systeme est calcule avec des poids par defaut (cout 30%, RAM 25%, CPU 20%, bande passante 25%).
              </p>
              {serveursFiltres.length === 0 ? (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                  Aucun serveur ne correspond aux filtres actuels. Assouplissez les contraintes pour afficher des resultats.
                </div>
              ) : (
                <ServerTable servers={serveursFiltres} />
              )}
            </div>

            <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.45s' }}>
              <div className="flex items-center gap-3 mb-3">
                <FlaskConical className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-semibold text-white">Details de calcul SAW (Top 3)</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Transparence du calcul: chaque ligne montre les valeurs normalisees puis la contribution ponderee au score global.
              </p>
              {serveursFiltres.slice(0, 3).map((s) => (
                <div key={`detail-${s.id}`} className="mb-3 rounded-lg border border-gray-700 bg-gray-900/50 p-3">
                  <p className="text-sm font-semibold text-gray-100 mb-2">
                    {s.name} - {s.provider}
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-300">
                    <p>Cout normalise: {s.normalizedScores.cost.toFixed(3)} x {(weights.cost / 100).toFixed(2)}</p>
                    <p>RAM normalisee: {s.normalizedScores.ram.toFixed(3)} x {(weights.ram / 100).toFixed(2)}</p>
                    <p>CPU normalise: {s.normalizedScores.cpu.toFixed(3)} x {(weights.cpu / 100).toFixed(2)}</p>
                    <p>Bande passante normalisee: {s.normalizedScores.bandwidth.toFixed(3)} x {(weights.bandwidth / 100).toFixed(2)}</p>
                    <p className="md:col-span-2 text-emerald-300 font-medium">
                      Score global: {(s.weightedScore * 100).toFixed(2)}% | Score recommandation: {(s.scoreRecommandation * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
              {serveursFiltres.length === 0 && (
                <p className="text-sm text-gray-500">Aucun detail de calcul a afficher.</p>
              )}
            </div>
          </div>
        </div>

        <footer className="text-center py-8 text-gray-500 text-sm">
          <p>M2 2026 - Aide a la decision et optimisation multicritere</p>
        </footer>
      </div>
    </div>
  );
}