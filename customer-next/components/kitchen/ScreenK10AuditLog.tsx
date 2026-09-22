'use client';

import React from 'react';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useKitchenStore } from '../../store/useKitchenStore';
import { History, ArrowLeft, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const ScreenK10AuditLog: React.FC = () => {
  const { setCurrentScreen } = useKitchenStore();

  const auditEvents = [
    { time: '14:22:10', type: 'BUMP', desc: 'Ticket #402 (Table A-04) marked READY by Chef Manjunath' },
    { time: '14:18:45', type: 'ALERT', desc: 'Table 7 Waiter Ping accepted (Extra Salna requested)' },
    { time: '14:05:12', type: '86_TOGGLE', desc: 'Item "Mutton Keema Balls" marked SOLD OUT by Station 2' },
    { time: '13:50:00', type: 'SHIFT', desc: 'Station Handover completed: Chef Manjunath signed in' },
    { time: '13:30:20', type: 'BUMP', desc: 'Ticket #398 (Table B-02) bumped to Plated' },
  ];

  return (
    <KitchenTabletHousing screenNumber={10} screenTitle="KITCHEN SHIFT AUDIT LOG">
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-5 overflow-hidden">
        <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">REAL-TIME SHIFT ACTION STREAM</h2>
              <p className="text-[11px] text-slate-400">Chronological tamper-proof audit trail for Head Chef & Manager review</p>
            </div>
          </div>
          <span className="font-mono text-xs text-slate-400">TODAY'S SHIFT</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {auditEvents.map((evt, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-amber-400">{evt.time}</span>
                <span className="text-xs font-bold text-slate-200">{evt.desc}</span>
              </div>
              <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                {evt.type}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <button
            onClick={() => setCurrentScreen(9)}
            className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Handover (9)</span>
          </button>
          <button
            onClick={() => setCurrentScreen(1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 border border-slate-600"
          >
            <span>Back to Station Login (1)</span>
          </button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
