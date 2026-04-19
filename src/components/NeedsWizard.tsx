'use client';

import { useState } from 'react';
import { ClipboardCheck, Sparkles } from 'lucide-react';
import { InfoBulle } from './InfoBulle';
import { buildProfileFromNeeds, NeedsFormData, GeneratedProfile } from '@/lib/needs-profile';

interface NeedsWizardProps {
  providers: string[];
  onApply: (profile: GeneratedProfile) => void;
}

const initialForm: NeedsFormData = {
  usageType: 'web',
  priority: 'balanced',
  load: 'medium',
  budgetMax: 24,
  provider: 'Tous',
  highAvailability: false,
  burstTraffic: false,
  lowLatency: false,
  dataIntensive: false,
  computeIntensive: false,
  recommendedOnly: false,
};

export function NeedsWizard({ providers, onApply }: NeedsWizardProps) {
  const [form, setForm] = useState<NeedsFormData>(initialForm);
  const [lastNotes, setLastNotes] = useState<string[]>([]);

  const update = <K extends keyof NeedsFormData>(key: K, value: NeedsFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const profile = buildProfileFromNeeds(form);
    setLastNotes(profile.notes);
    onApply(profile);
  };

  return (
    <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.11s' }}>
      <div className="flex items-center gap-3 mb-4">
        <ClipboardCheck className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white inline-flex items-center gap-2">
          Pre-guide de besoin
          <InfoBulle texte="Décrivez votre besoin technique et l'application propose automatiquement des poids SAW et des filtres adaptés." />
        </h3>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-gray-500">Utilisation principale</span>
            <select
              value={form.usageType}
              onChange={(e) => update('usageType', e.target.value as NeedsFormData['usageType'])}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            >
              <option value="web">Application web</option>
              <option value="api">API / backend</option>
              <option value="database">Base de donnees</option>
              <option value="analytics">Analytique / ETL</option>
              <option value="devops">CI/CD / DevOps</option>
              <option value="backup">Sauvegarde</option>
              <option value="media">Streaming / media</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-gray-500">Priorite business</span>
            <select
              value={form.priority}
              onChange={(e) => update('priority', e.target.value as NeedsFormData['priority'])}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            >
              <option value="balanced">Equilibre</option>
              <option value="cost">Cout minimum</option>
              <option value="performance">Performance globale</option>
              <option value="network">Performance reseau</option>
              <option value="memory">Memoire</option>
              <option value="cpu">CPU</option>
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-gray-500">Charge attendue</span>
            <select
              value={form.load}
              onChange={(e) => update('load', e.target.value as NeedsFormData['load'])}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Elevee</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-gray-500">Budget max (EUR)</span>
            <input
              type="number"
              min={1}
              value={form.budgetMax}
              onChange={(e) => update('budgetMax', Number(e.target.value || 1))}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-gray-500">Fournisseur prefere</span>
            <select
              value={form.provider}
              onChange={(e) => update('provider', e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200"
            >
              {providers.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-3">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Checklist technique</p>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.highAvailability} onChange={(e) => update('highAvailability', e.target.checked)} className="accent-emerald-500" />
              Haute disponibilite
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.burstTraffic} onChange={(e) => update('burstTraffic', e.target.checked)} className="accent-emerald-500" />
              Pics de trafic
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.lowLatency} onChange={(e) => update('lowLatency', e.target.checked)} className="accent-emerald-500" />
              Latence critique
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.dataIntensive} onChange={(e) => update('dataIntensive', e.target.checked)} className="accent-emerald-500" />
              Traitement de donnees important
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.computeIntensive} onChange={(e) => update('computeIntensive', e.target.checked)} className="accent-emerald-500" />
              Calcul intensif
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.recommendedOnly} onChange={(e) => update('recommendedOnly', e.target.checked)} className="accent-emerald-500" />
              Proposer seulement les offres recommandees
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600/90 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500/90 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generer ma configuration recommandee
        </button>
      </form>

      {lastNotes.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="text-xs uppercase tracking-wider text-emerald-200 mb-2">Ajustements appliques</p>
          <ul className="space-y-1 text-xs text-emerald-100">
            {lastNotes.map((note, index) => (
              <li key={index}>- {note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
