'use client';

import { NeedsWizard } from '@/components/NeedsWizard';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

export default function DashboardGuidePage() {
  const { fournisseurs, appliquerProfilGuide, guideNotes } = useDashboard();

  return (
    <div className="space-y-4">
      <NeedsWizard providers={fournisseurs} onApply={appliquerProfilGuide} />
      {guideNotes.length > 0 && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <p className="font-semibold mb-2">Configuration appliquee depuis le pre-guide</p>
          <ul className="space-y-1 text-xs">
            {guideNotes.map((note, index) => (
              <li key={index}>- {note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
