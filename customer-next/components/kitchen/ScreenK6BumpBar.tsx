'use client';

import React, { useState } from 'react';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useSharedBridge } from '../../store/useSharedBridge';
import { useKitchenStore } from '../../store/useKitchenStore';
import { Zap, Clock, CheckCircle2, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

export const ScreenK6BumpBar: React.FC = () => {
  const { setCurrentScreen } = useKitchenStore();
  const { kdsTickets, kitchenBumpTable } = useSharedBridge();
  const [bumpLog, setBumpLog] = useState<string[]>([]);

  const activeTickets = kdsTickets.filter((t) => t.status !== 'COMPLETED');

  const handleBump = (ticketId: string, tableNum: string) => {
    kitchenBumpTable(ticketId);
    setBumpLog((prev) => [`Ticket #${ticketId.slice(-4)} (Table ${tableNum}) marked READY at ${new Date().toLocaleTimeString()}`, ...prev]);
  };

  return (
    <KitchenTabletHousing screenNumber={6} screenTitle="EXPEDITER HARDWARE BUMP BAR TERMINAL">
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-5 overflow-hidden">
        {/* Hardware Keyboard Shortcuts Header */}
        <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            <div>
              <span className="font-black text-sm text-white">INDUSTRIAL BUMP BAR SHORTCUTS</span>
              <p className="text-[11px] text-slate-400">Press 1-9 on physical keyboard or tap keys below to instantly bump tickets</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span key={n} className="h-7 w-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-orange-400">
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Tickets Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 pr-1">
          {activeTickets.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center h-64 text-slate-500 font-mono">
              <CheckCircle2 className="h-12 w-12 text-emerald-500/60 mb-2" />
              <span>ALL KOT TICKETS CLEARED & BUMPED!</span>
            </div>
          ) : (
            activeTickets.slice(0, 9).map((tk, idx) => {
              const isUrgent = tk.elapsedMinutes > 15;
              return (
                <div
                  key={tk.id}
                  className={`flex flex-col justify-between p-3.5 rounded-2xl border transition ${
                    isUrgent
                      ? 'bg-rose-950/20 border-rose-600 animate-pulse'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-md bg-orange-600 text-white font-mono font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm text-white">TABLE {tk.tableNumber}</span>
                      </div>
                      <span className="font-mono text-xs text-amber-400 font-bold">
                        {tk.elapsedMinutes}m ago
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {tk.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-slate-300">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{it.prepMode}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBump(tk.id, tk.tableNumber)}
                    className="mt-3 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>BUMP TICKET [KEY {idx + 1}]</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <button
            onClick={() => setCurrentScreen(5)}
            className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to SOP (5)</span>
          </button>
          <button
            onClick={() => setCurrentScreen(7)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
          >
            <span>Next: Audio Alerts & Sound Monitor (7)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
