'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  Activity,
  BrainCircuit,
  ChartScatter,
  FileSpreadsheet,
  FlaskConical,
  GitCompare,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  UserCircle2,
  WandSparkles,
} from 'lucide-react';
import { deconnecterUtilisateur, obtenirSessionUtilisateur } from '@/lib/auth-client';

interface DashboardShellProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Apercu', description: 'Vue globale des indicateurs SAW', icon: <LayoutDashboard className="w-4 h-4" /> },
  { href: '/dashboard/guide', label: 'Pre-guide', description: 'Formulaire de besoin utilisateur', icon: <WandSparkles className="w-4 h-4" /> },
  { href: '/dashboard/weights', label: 'Ponderation', description: 'Poids, filtres et scenarios', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { href: '/dashboard/visualisation', label: 'Visualisation', description: 'Pareto et radar', icon: <ChartScatter className="w-4 h-4" /> },
  { href: '/dashboard/classement', label: 'Classement', description: 'Tableau et exports', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { href: '/dashboard/comparaison', label: 'Comparaison', description: 'Comparaison directe multi-serveurs', icon: <GitCompare className="w-4 h-4" /> },
  { href: '/dashboard/sensibilite', label: 'Sensibilite', description: 'Analyse what-if des poids', icon: <Activity className="w-4 h-4" /> },
  { href: '/dashboard/calculs', label: 'Calcul SAW', description: 'Details de normalisation et score', icon: <FlaskConical className="w-4 h-4" /> },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const currentSession = obtenirSessionUtilisateur();
      setSession(currentSession);
      setIsReady(true);

      if (!currentSession) {
        router.replace('/login');
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  if (!isReady) {
    return (
      <div className="min-h-screen p-6 md:p-10 lg:pl-28">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-6 animate-pulse-subtle text-sm text-gray-400">Chargement du dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 lg:pl-28">
      <aside className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="rounded-3xl border border-gray-700/80 bg-gray-950/80 backdrop-blur-xl p-3 shadow-2xl shadow-black/35">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                      isActive
                        ? 'border-cyan-400/40 bg-cyan-500/20 text-cyan-100'
                        : 'border-gray-700 bg-gray-900/80 text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    aria-label={`Aller a ${item.label}`}
                  >
                    {item.icon}
                  </Link>

                  <div className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="min-w-52 rounded-xl border border-gray-700 bg-gray-950/95 px-3 py-2 shadow-xl">
                      <p className="text-xs font-semibold text-white">{item.label}</p>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="max-w-7xl mx-auto space-y-6">
        <header className="glass-panel p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/80 to-cyan-500/70 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <BrainCircuit className="w-5 h-5 text-white" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-gray-900" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-violet-200">Dashboard SAW</p>
              <h1 className="text-xl font-semibold text-white">Selection multicritere de serveurs VPS</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/70 px-3 py-1.5">
                <UserCircle2 className="w-4 h-4 text-cyan-300" />
                <span className="text-xs text-gray-300">Session active: {session}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                deconnecterUtilisateur();
                router.replace('/login');
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/70 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Deconnexion
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
