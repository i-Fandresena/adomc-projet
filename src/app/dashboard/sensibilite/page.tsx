'use client';

import dynamic from 'next/dynamic';
import { useDashboard } from '@/components/dashboard/DashboardProvider';

const SensitivityPanel = dynamic(() => import('@/components/SensitivityPanel').then((mod) => mod.SensitivityPanel), { ssr: false });

export default function DashboardSensibilitePage() {
  const { serveursFiltres, weights, serveurRadar, serveurReference } = useDashboard();

  return (
    <SensitivityPanel
      servers={serveursFiltres}
      baseWeights={weights}
      focusServer={serveurRadar}
      referenceServer={serveurReference}
    />
  );
}
