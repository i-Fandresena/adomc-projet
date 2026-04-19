'use client';

import { ReactNode } from 'react';

interface WeightSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
  icon: ReactNode;
}

export function WeightSlider({ label, value, onChange, color, icon }: WeightSliderProps) {
  return (
    <div className="relative group rounded-xl border border-gray-700/70 bg-gray-900/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-20 border border-white/10`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span className={`text-sm px-2 py-1 rounded-md font-semibold ${color.replace('bg-', 'text-')} bg-black/20`}>
          {value}%
        </span>
      </div>
      <div className="relative h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-gray-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}