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
    <div className="relative group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span className={`text-lg font-bold ${color.replace('bg-', 'text-')}`}>
          {value}%
        </span>
      </div>
      <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
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
    </div>
  );
}