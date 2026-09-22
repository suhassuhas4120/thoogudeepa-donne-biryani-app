'use client';

import React, { useState } from 'react';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useKitchenStore } from '../../store/useKitchenStore';
import { CheckSquare, Square, ClipboardCheck, ArrowLeft, ArrowRight } from 'lucide-react';

export const ScreenK9Handover: React.FC = () => {
  const { setCurrentScreen } = useKitchenStore();
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'c1': true,
    'c2': true,
    'c3': false,
    'c4': true,
    'c5': false,
  });

  const items = [
    { id: 'c1', label: 'Walk-in freezer temperature checked & verified (-18°C)' },
    { id: 'c2', label: 'Raw mutton & nati koli meat logs reconciled with cold storage' },
    { id: 'c3', label: 'LPG gas main line valves inspected for zero leakage' },
    { id: 'c4', label: 'Donne biryani deghs and dum handis scrubbed and disinfected' },
    { id: 'c5', label: 'Fryer oil filtered and calibrated for evening shift rush' },
  ];

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <KitchenTabletHousing screenNumber={9} screenTitle="STATION SHIFT HANDOVER CHECKLIST">
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-5 overflow-hidden">
        <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">SHIFT TRANSITION VERIFICATION</h2>
              <p className="text-[11px] text-slate-400">Head Chef shift sign-off (Morning Shift ➔ Evening Shift)</p>
            </div>
          </div>
          <span className="font-mono text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl border border-emerald-500/30 font-bold">
            SHIFT B APPROVED
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {items.map((it) => {
            const isChecked = !!checklist[it.id];
            return (
              <button
                key={it.id}
                onClick={() => toggleCheck(it.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition text-left ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-800/60 text-white'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="h-5 w-5 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="h-5 w-5 text-slate-500 shrink-0" />
                )}
                <span className="text-xs font-bold leading-relaxed">{it.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <button
            onClick={() => setCurrentScreen(8)}
            className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Yield Scaler (8)</span>
          </button>
          <button
            onClick={() => setCurrentScreen(10)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
          >
            <span>Next: Kitchen Shift Audit Log (10)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
