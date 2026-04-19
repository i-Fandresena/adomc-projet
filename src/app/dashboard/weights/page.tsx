'use client';

import { Check, Filter, FolderOpen, Info, Pencil, Save, Scale, Trash2, X, Coins, Cpu, MemoryStick, Network } from 'lucide-react';
import { WeightSlider } from '@/components/WeightSlider';
import { InfoBulle } from '@/components/InfoBulle';
import { DEMO_PRESETS, useDashboard } from '@/components/dashboard/DashboardProvider';

export default function DashboardWeightsPage() {
  const {
    weights,
    costRange,
    resourceRanges,
    budgetMax,
    ramMin,
    cpuMin,
    bandePassanteMin,
    fournisseurSelectionne,
    recommandesUniquement,
    fournisseurs,
    nomScenario,
    scenarios,
    scenarioEditionId,
    nomScenarioEdition,
    setNomScenario,
    setNomScenarioEdition,
    setBudgetMax,
    setRamMin,
    setCpuMin,
    setBandePassanteMin,
    setFournisseurSelectionne,
    setRecommandesUniquement,
    handleWeightChange,
    appliquerPreset,
    reinitialiserFiltres,
    sauvegarderScenario,
    chargerScenario,
    supprimerScenario,
    demarrerEditionScenario,
    annulerEditionScenario,
    validerEditionScenario,
  } = useDashboard();

  return (
    <div className="grid xl:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-semibold text-white inline-flex items-center gap-2">
              Ponderation des criteres
              <InfoBulle texte="Reglez l importance relative de chaque critere. La somme est automatiquement maintenue a 100%." />
            </h2>
          </div>

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 mb-5">
            <p className="text-xs text-violet-200">Ajustement intelligent: la somme reste 100%.</p>
            <div className="mt-3 h-2 rounded-full bg-gray-800 overflow-hidden flex">
              <div className="bg-rose-500" style={{ width: `${weights.cost}%` }} />
              <div className="bg-cyan-500" style={{ width: `${weights.ram}%` }} />
              <div className="bg-violet-500" style={{ width: `${weights.cpu}%` }} />
              <div className="bg-emerald-500" style={{ width: `${weights.bandwidth}%` }} />
            </div>
          </div>

          <div className="space-y-6">
            <WeightSlider label="Cout mensuel" value={weights.cost} onChange={(v) => handleWeightChange('cost', v)} color="bg-rose-500" icon={<Coins className="w-4 h-4 text-rose-300" />} />
            <WeightSlider label="RAM" value={weights.ram} onChange={(v) => handleWeightChange('ram', v)} color="bg-cyan-500" icon={<MemoryStick className="w-4 h-4 text-cyan-300" />} />
            <WeightSlider label="Performance CPU" value={weights.cpu} onChange={(v) => handleWeightChange('cpu', v)} color="bg-violet-500" icon={<Cpu className="w-4 h-4 text-violet-300" />} />
            <WeightSlider label="Bande passante" value={weights.bandwidth} onChange={(v) => handleWeightChange('bandwidth', v)} color="bg-emerald-500" icon={<Network className="w-4 h-4 text-emerald-300" />} />
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Scenarios de demonstration</h3>
          </div>
          <div className="grid gap-3">
            {DEMO_PRESETS.map((preset, index) => (
              <button key={preset.label} type="button" onClick={() => appliquerPreset(index)} className="text-left rounded-xl border border-gray-700 bg-gray-900/60 p-3 hover:border-cyan-400/30 hover:bg-gray-800/70 transition-colors">
                <p className="text-sm font-semibold text-white">{preset.label}</p>
                <p className="text-xs text-gray-400 mt-1">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Filtres utilisateur</h3>
          </div>

          <div className="space-y-4">
            <label className="block"><span className="text-sm text-gray-300">Budget maximal: {budgetMax} EUR</span><input type="range" min={Math.floor(costRange.min)} max={Math.ceil(costRange.max)} step="1" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} className="mt-2 w-full" /></label>
            <label className="block"><span className="text-sm text-gray-300">RAM minimale: {ramMin} GB</span><input type="range" min="1" max={resourceRanges.ramMax} step="1" value={ramMin} onChange={(e) => setRamMin(Number(e.target.value))} className="mt-2 w-full" /></label>
            <label className="block"><span className="text-sm text-gray-300">CPU minimal: {cpuMin} GHz</span><input type="range" min="1" max={resourceRanges.cpuMax} step="1" value={cpuMin} onChange={(e) => setCpuMin(Number(e.target.value))} className="mt-2 w-full" /></label>
            <label className="block"><span className="text-sm text-gray-300">Bande passante minimale: {bandePassanteMin} Gbps</span><input type="range" min="0.5" max={resourceRanges.bandwidthMax} step="0.5" value={bandePassanteMin} onChange={(e) => setBandePassanteMin(Number(e.target.value))} className="mt-2 w-full" /></label>
            <label className="block"><span className="text-sm text-gray-300">Fournisseur</span><select value={fournisseurSelectionne} onChange={(e) => setFournisseurSelectionne(e.target.value)} className="mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200">{fournisseurs.map((f) => <option key={f} value={f}>{f}</option>)}</select></label>
            <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" checked={recommandesUniquement} onChange={(e) => setRecommandesUniquement(e.target.checked)} className="accent-violet-500" />Afficher uniquement les offres recommandees</label>
          </div>

          <button type="button" onClick={reinitialiserFiltres} className="mt-4 w-full rounded-lg border border-gray-700 bg-gray-800/70 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700/70 transition-colors">Reinitialiser les filtres</button>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <Save className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Scenarios de ponderation</h3>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={nomScenario} onChange={(e) => setNomScenario(e.target.value)} placeholder="Nom du scenario" className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500" />
            <button type="button" onClick={sauvegarderScenario} className="rounded-lg bg-emerald-600/90 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500/90 transition-colors">Sauvegarder</button>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {scenarios.length === 0 ? (
              <p className="text-xs text-gray-500">Aucun scenario enregistre.</p>
            ) : (
              scenarios.map((s) => (
                <div key={s.id} className="w-full flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900/60 px-3 py-2">
                  {scenarioEditionId === s.id ? (
                    <div className="w-full flex items-center gap-2">
                      <input type="text" value={nomScenarioEdition} onChange={(e) => setNomScenarioEdition(e.target.value)} className="flex-1 rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-sm text-gray-200" />
                      <button type="button" onClick={() => validerEditionScenario(s.id)} className="text-emerald-400 hover:text-emerald-300 transition-colors"><Check className="w-4 h-4" /></button>
                      <button type="button" onClick={annulerEditionScenario} className="text-gray-400 hover:text-gray-200 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <button type="button" onClick={() => chargerScenario(s)} className="flex items-center gap-2 text-left hover:text-cyan-300 transition-colors">
                        <span className="text-sm text-gray-200">{s.nom}</span>
                        <FolderOpen className="w-4 h-4 text-cyan-400" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => demarrerEditionScenario(s)} className="text-gray-400 hover:text-cyan-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button type="button" onClick={() => supprimerScenario(s.id)} className="text-gray-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
