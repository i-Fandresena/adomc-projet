'use client';

import { ComparisonPanel } from '@/components/ComparisonPanel';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

export default function DashboardComparaisonPage() {
  const { serveursSelectionnes, classementComplet, toggleComparison, clearComparison } = useDashboard();

  return (
    <ComparisonPanel
      selectedServers={serveursSelectionnes}
      availableServers={classementComplet}
      onAddServer={(serverId) => {
        const serveur = classementComplet.find((s) => s.id === serverId);
        if (serveur) toggleComparison(serveur);
      }}
      onRemoveServer={(serverId) => {
        const serveur = classementComplet.find((s) => s.id === serverId);
        if (serveur) toggleComparison(serveur);
      }}
      onClear={clearComparison}
    />
  );
}
