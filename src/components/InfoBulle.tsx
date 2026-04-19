'use client';

import { ReactNode } from 'react';
import { CircleHelp } from 'lucide-react';

interface InfoBulleProps {
  texte: string;
  children?: ReactNode;
}

export function InfoBulle({ texte, children }: InfoBulleProps) {
  return (
    <span className="group relative inline-flex items-center gap-1">
      {children}
      <CircleHelp className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-300 transition-colors" />
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-200 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
        {texte}
      </span>
    </span>
  );
}
