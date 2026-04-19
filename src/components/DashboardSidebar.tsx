'use client';

import { ReactNode } from 'react';

export interface DashboardNavItem {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
}

interface DashboardSidebarProps {
  items: DashboardNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function DashboardSidebar({ items, activeId, onNavigate }: DashboardSidebarProps) {
  return (
    <aside className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="rounded-3xl border border-gray-700/80 bg-gray-950/80 backdrop-blur-xl p-3 shadow-2xl shadow-black/35">
        <nav className="flex flex-col gap-2">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <div key={item.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                    isActive
                      ? 'border-cyan-400/40 bg-cyan-500/20 text-cyan-100'
                      : 'border-gray-700 bg-gray-900/80 text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  aria-label={`Naviguer vers ${item.label}`}
                >
                  {item.icon}
                </button>

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
  );
}
