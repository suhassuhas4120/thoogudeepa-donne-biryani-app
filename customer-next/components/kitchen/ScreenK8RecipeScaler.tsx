'use client';

import React, { useState } from 'react';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useKitchenStore } from '../../store/useKitchenStore';
import { Scale, Flame, Printer, ArrowLeft, ArrowRight } from 'lucide-react';

export const ScreenK8RecipeScaler: React.FC = () => {
  const { setCurrentScreen } = useKitchenStore();
  const [portions, setPortions] = useState(50); // 50 portions default

  const scale = portions / 25; // Base recipe is 25 portions

  const ingredients = [
    { name: 'Seeraga Samba Biryani Rice', baseQty: 4.5, unit: 'kg' },
    { name: 'Fresh Tender Mutton Chunks', baseQty: 5.0, unit: 'kg' },
    { name: 'Pure Buffalo Ghee', baseQty: 0.75, unit: 'liters' },
    { name: 'Fresh Green Mint & Coriander', baseQty: 6, unit: 'bunches' },
    { name: 'Green Chillies & Garlic Paste', baseQty: 0.6, unit: 'kg' },
    { name: 'Stone Ground Garam Masala', baseQty: 125, unit: 'grams' },
    { name: 'Mutton Stock Liquefaction', baseQty: 7.5, unit: 'liters' },
  ];

  return (
    <KitchenTabletHousing screenNumber={8} screenTitle="DUM BIRYANI BATCH & RECIPE SCALER">
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-5 overflow-hidden">
        {/* Pot Size Selector */}
        <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">DEGH BATCH YIELD MULTIPLIER</h2>
              <p className="text-[11px] text-slate-400">Exact proportional ratios for master chef handi preparations</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-xl">
            {[25, 50, 100, 250].map((p) => (
              <button
                key={p}
                onClick={() => setPortions(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition ${
                  portions === p ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p} PORTIONS
              </button>
            ))}
          </div>
        </div>

        {/* Scaled Ingredients Grid */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {ingredients.map((ing, i) => {
            const scaledQty = (ing.baseQty * scale).toFixed(1);
            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-500">0{i + 1}</span>
                  <span className="font-bold text-sm text-white">{ing.name}</span>
                </div>
                <div className="flex items-baseline gap-1 font-mono font-black text-amber-400 text-base">
                  <span>{scaledQty}</span>
                  <span className="text-xs text-slate-400 font-bold">{ing.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <button
            onClick={() => setCurrentScreen(7)}
            className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Audio Alerts (7)</span>
          </button>
          <button
            onClick={() => setCurrentScreen(9)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
          >
            <span>Next: Station Handover Checklist (9)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
