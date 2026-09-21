'use client';

import React, { useState } from 'react';
import { useKitchenStore } from '../../store/useKitchenStore';
import { useSharedBridge } from '../../store/useSharedBridge';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useKitchenQuery } from '../../hooks/useKitchenQuery';
import {
  Clock,
  Flame,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  ArrowRight,
  Filter,
  Layers,
  ChefHat,
  Bell,
  UtensilsCrossed,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ScreenK2Overview: React.FC = () => {
  const {
    setCurrentScreen,
    tickets,
    bumpItemStage,
    bumpTable,
    setSelectedTableNumber,
    soundAlertsEnabled,
    toggleSoundAlerts,
    callFloorWaiter,
  } = useKitchenStore();

  const { isFetching: isKitchenSyncing } = useKitchenQuery();
  const [filterStation, setFilterStation] = useState<string>('ALL');

  // Pull real-time tickets from shared bridge (customer orders + waiter KOTs)
  const { kdsTickets: bridgeTickets } = useSharedBridge();
  const allTickets = bridgeTickets.length > 0 ? bridgeTickets : tickets;

  // Compute aggregated bulk quantities across all tickets
  const bulkItemsMap: { [key: string]: { count: number; tables: string[]; prepMode: string } } = {};
  allTickets.forEach((t) => {
    t.items.forEach((it) => {
      if (it.stage !== 'SERVED') {
        if (!bulkItemsMap[it.name]) {
          bulkItemsMap[it.name] = { count: 0, tables: [], prepMode: it.prepMode };
        }
        bulkItemsMap[it.name].count += it.quantity;
        if (!bulkItemsMap[it.name].tables.includes(t.tableNumber)) {
          bulkItemsMap[it.name].tables.push(t.tableNumber);
        }
      }
    });
  });

  const handleOpenTableDetail = (tableNumber: string) => {
    setSelectedTableNumber(tableNumber);
    setCurrentScreen(3);
  };

  return (
    <KitchenTabletHousing screenNumber={2} screenTitle="ALL TABLES KDS OVERVIEW (70/30 SPLIT)">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top KDS Header Bar (10-15%) */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-slate-400">
              [STATION FILTER]
            </span>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-slate-200">
              {['ALL', 'BIRYANI DUM', 'KEBAB FRY', 'PANTRY'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStation(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black font-mono transition ${
                    filterStation === st
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <Clock className="h-3.5 w-3.5 text-orange-600" />
              <span>AVG TICKET: 11 MIN</span>
            </div>
            <button
              onClick={toggleSoundAlerts}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-bold text-slate-700 hover:bg-stone-50"
            >
              {soundAlertsEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>ALERTS ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                  <span>MUTED</span>
                </>
              )}
            </button>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isKitchenSyncing ? 'bg-orange-500 animate-spin' : 'bg-emerald-500 animate-ping'
                }`}
              />
              {isKitchenSyncing ? 'Syncing...' : 'Live KDS Feed'}
            </span>
          </div>
        </div>

        {/* Bulk Display Bar (10-15%) */}
        <div className="bg-stone-100/90 border-b border-slate-200 px-4 py-2 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-extrabold uppercase tracking-wider text-slate-500">
              <Layers className="h-3 w-3 text-orange-600" />
              <span>[BULK AGGREGATED COOKING BAR - ACTIVE DISH COUNTS ACROSS ALL TABLES]</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {Object.keys(bulkItemsMap).length} TOTAL DISH BATCHES
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {Object.entries(bulkItemsMap).map(([name, data]) => (
              <div
                key={name}
                className="bg-white rounded-xl border border-slate-200/90 px-3 py-1.5 flex items-center gap-3 shrink-0 shadow-2xs"
              >
                <div>
                  <div className="text-[11px] font-black text-slate-900">{name}</div>
                  <div className="text-[9.5px] font-mono text-slate-400 mt-0.5">
                    Tables: {data.tables.join(', ')}
                  </div>
                </div>
                <span className="rounded-lg bg-orange-600 text-white px-2 py-1 font-mono text-xs font-black shadow-xs">
                  × {data.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main 70/30 Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left 70%: 3-Column Tables Matrix */}
          <div className="w-[70%] border-r border-slate-200 p-4 overflow-y-auto bg-stone-50/50">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                [ACTIVE TABLES MATRIX - CLICK TABLE CARD TO OPEN SCREEN 3 DEEP DIVE]
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {tickets.length} ACTIVE TABLES
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              {tickets.map((t) => {
                const isUrgent = t.elapsedMinutes > 12;
                return (
                  <motion.div
                    key={t.id}
                    whileHover={{ y: -2 }}
                    onClick={() => handleOpenTableDetail(t.tableNumber)}
                    className={`rounded-2xl border bg-white p-3.5 shadow-xs cursor-pointer transition flex flex-col justify-between ${
                      isUrgent
                        ? 'border-orange-300 ring-2 ring-orange-500/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-dashed border-slate-200 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-sm font-black text-slate-900">
                            [{t.tableNumber}]
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {t.serverName.split(' ')[1]}
                          </span>
                        </div>
                        <span
                          className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold ${
                            isUrgent
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-stone-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          <span>{t.elapsedMinutes}m</span>
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {t.items.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-start justify-between gap-2 p-1.5 rounded-lg bg-stone-50 border border-slate-100"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-extrabold text-slate-900 truncate">
                                {it.name}
                              </div>
                              <div className="text-[9.5px] font-mono text-slate-500">
                                {it.prepMode}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="font-mono text-xs font-black text-slate-900">
                                ×{it.quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  bumpItemStage(t.id, it.id);
                                }}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition ${
                                  it.stage === 'PLATED'
                                    ? 'bg-emerald-600 text-white'
                                    : it.stage === 'PREP'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {it.stage}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Card Action */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          bumpTable(t.id);
                        }}
                        className="rounded-lg bg-slate-900 text-white px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-slate-800 transition"
                      >
                        [BUMP ALL]
                      </button>
                      <span className="text-[10.5px] font-extrabold text-orange-600 flex items-center gap-0.5">
                        <span>Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right 30%: Chronological Time Queue */}
          <div className="w-[30%] bg-white p-4 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                [CHRONOLOGICAL TIME QUEUE]
              </span>
              <span className="text-[10px] font-mono text-slate-500">SORTED BY TIME</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {tickets.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => handleOpenTableDetail(t.tableNumber)}
                  className="p-3 rounded-xl border border-slate-200 bg-stone-50/70 hover:bg-stone-100/90 cursor-pointer transition shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-black text-slate-900">
                      TICKET #{t.id} • [{t.tableNumber}]
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {t.timestamp}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-slate-600 space-y-0.5 font-medium">
                    {t.items.map((i) => (
                      <div key={i.id} className="flex justify-between">
                        <span className="truncate">{i.name}</span>
                        <span className="font-mono font-bold">×{i.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-200 text-[9.5px] font-mono">
                    <span className="text-orange-700 font-bold">WAIT: {t.elapsedMinutes}m</span>
                    <span className="text-slate-500">{t.serverName}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => callFloorWaiter('EXPEDITE', 'Calling all runners to kitchen pass')}
              className="mt-3 w-full rounded-xl border border-orange-200 bg-orange-50 py-2.5 text-xs font-black uppercase text-orange-900 hover:bg-orange-100 transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Bell className="h-3.5 w-3.5 text-orange-600" />
              <span>[CALL FLOOR RUNNER TO PASS]</span>
            </button>
          </div>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
