'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useKitchenStore } from '../../store/useKitchenStore';
import { useSharedBridge, getCanonicalDishKey } from '../../store/useSharedBridge';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import {
  Clock,
  Bell,
  UtensilsCrossed,
  X,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Authentic default seeded tables matching Screenshot 2 wireframe
interface K2TableItem {
  id: string;
  name: string;
  quantity: number;
  stage: 'RECEIVED' | 'PREPARING' | 'READY' | 'SERVED';
}

interface K2Table {
  id: string;
  tableNumber: string;
  isVip?: boolean;
  kotNumber: string;
  elapsedMinutes: number;
  serverName: string;
  items: K2TableItem[];
}

const STAGE_ORDER = ['RECEIVED', 'PREPARING', 'READY', 'SERVED'] as const;
type K2Stage = typeof STAGE_ORDER[number];

const toK2Stage = (bridgeStage: string): K2Stage => {
  if (bridgeStage === 'PREP') return 'PREPARING';
  if (bridgeStage === 'PLATED') return 'READY';
  if (bridgeStage === 'SERVED') return 'SERVED';
  return 'RECEIVED'; // PLACED
};

const toBridgeStage = (k2Stage: K2Stage): 'PLACED' | 'PREP' | 'PLATED' | 'SERVED' => {
  if (k2Stage === 'PREPARING') return 'PREP';
  if (k2Stage === 'READY') return 'PLATED';
  if (k2Stage === 'SERVED') return 'SERVED';
  return 'PLACED';
};

const STAGE_COLORS: Record<K2Stage, string> = {
  RECEIVED:  'bg-slate-100 text-slate-700 border-slate-300',
  PREPARING: 'bg-amber-50 text-amber-800 border-amber-300',
  READY:     'bg-blue-50 text-blue-800 border-blue-300',
  SERVED:    'bg-emerald-50 text-emerald-800 border-emerald-300',
};

const STAGE_ACTIVE_COLORS: Record<K2Stage, string> = {
  RECEIVED:  'bg-slate-800 text-white border-slate-900',
  PREPARING: 'bg-amber-600 text-white border-amber-700',
  READY:     'bg-blue-600 text-white border-blue-700',
  SERVED:    'bg-emerald-600 text-white border-emerald-700',
};

export const ScreenK2Overview: React.FC = () => {
  const {
    setCurrentScreen,
    setSelectedTableNumber,
    callFloorWaiter,
  } = useKitchenStore();

  const {
    kdsTickets: bridgeTickets,
    kitchenSetItemStage,
    kitchenSetBulkItemStage,
    kitchenClearCompleted,
    kitchenNotifications,
    kitchenDismissNotification,
    kitchenDismissAllNotifications,
    resetToFreshDemoState,
  } = useSharedBridge();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3000);
  };

  // Elapsed minutes counter — re-renders every minute
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Convert bridge tickets to K2Table format ─────────────────────
  const activeTables: K2Table[] = React.useMemo(() => {
    return bridgeTickets
      .filter((tk) => tk.status !== 'COMPLETED')
      .map((tk) => ({
        id: tk.id,
        tableNumber: `TABLE ${tk.tableNumber}`,
        kotNumber: tk.id.replace('KDS-', ''),
        elapsedMinutes: tk.elapsedMinutes || 1,
        serverName: tk.serverName || 'Captain',
        isVip: tk.source === 'CUSTOMER',
        items: tk.items.map((it) => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          stage: toK2Stage(it.stage),
        })),
      }));
  }, [bridgeTickets, tick]);

  // ── Bulk Aggregation: computed live from bridge tickets ───────────
  const bulkAggregation = React.useMemo(() => {
    const map = new Map<string, {
      displayName: string;
      canonical: string;
      total: number;
      sources: string[];
      stages: K2Stage[];
      ticketIds: Set<string>; // track distinct tickets this dish appears in
    }>();

    bridgeTickets
      .filter((tk) => tk.status !== 'COMPLETED')
      .forEach((tk) => {
        tk.items.forEach((it) => {
          const key = getCanonicalDishKey(it.name);
          const existing = map.get(key);
          const k2Stage = toK2Stage(it.stage);
          const tableLabel = `TBL ${tk.tableNumber} (x${it.quantity})`;
          if (existing) {
            existing.total += it.quantity;
            existing.sources.push(tableLabel);
            existing.stages.push(k2Stage);
            existing.ticketIds.add(tk.id);
          } else {
            map.set(key, {
              displayName: it.name
                .replace(/\s*\[Seat \d+\]/gi, '')
                .replace(/\s*\[Table [^\]]+\]/gi, '')
                .trim(),
              canonical: key,
              total: it.quantity,
              sources: [tableLabel],
              stages: [k2Stage],
              ticketIds: new Set([tk.id]),
            });
          }
        });
      });

    // Only show dishes that appear in 2+ distinct tickets OR have total qty > 1
    // (single qty=1 from a single ticket doesn't need batch aggregation)
    return Array.from(map.values()).filter(
      (b) => b.ticketIds.size >= 2 || b.total > 1
    );
  }, [bridgeTickets]);


  // ── Compute overall stage for a bulk group ────────────────────────
  const getBulkCurrentStage = (stages: K2Stage[]): K2Stage => {
    if (stages.every((s) => s === 'SERVED')) return 'SERVED';
    if (stages.every((s) => s === 'READY' || s === 'SERVED')) return 'READY';
    if (stages.some((s) => s === 'PREPARING')) return 'PREPARING';
    return 'RECEIVED';
  };

  // ── Item stage handler ────────────────────────────────────────────
  const handleSetItemStage = (ticketId: string, itemId: string, newStage: K2Stage) => {
    kitchenSetItemStage(ticketId, itemId, toBridgeStage(newStage));
  };

  // ── Bulk stage handler ────────────────────────────────────────────
  const handleSetBulkStage = (displayName: string, newStage: K2Stage) => {
    kitchenSetBulkItemStage(displayName, toBridgeStage(newStage));
    showToast(`✅ All "${displayName}" → ${newStage}`);
  };

  // ── Undismissed kitchen notifications ────────────────────────────
  const activeNotifs = kitchenNotifications.filter((n) => !n.dismissed);

  // ── Handle clear completed ────────────────────────────────────────
  const handleClearCompleted = () => {
    kitchenClearCompleted();
    showToast('✅ Completed orders cleared');
  };

  const completedCount = bridgeTickets.filter((tk) => tk.status === 'COMPLETED').length;

  return (
    <KitchenTabletHousing screenNumber={2} screenTitle="ALL TABLES & FEEDS (70/30 SPLIT)">
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">

        {/* ── TOP: NOTIFICATION STRIP ─────────────────────────────── */}
        <AnimatePresence>
          {activeNotifs.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-slate-900 border-b-2 border-orange-500 overflow-hidden shrink-0"
            >
              <div className="px-4 py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
                  <span className="flex items-center gap-1 text-orange-400 font-mono text-[10px] font-black shrink-0 animate-pulse">
                    <Bell className="h-3 w-3" />
                    [{activeNotifs.length} NEW ORDER{activeNotifs.length > 1 ? 'S' : ''}]
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {activeNotifs.map((n) => (
                      <div key={n.id} className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 shrink-0">
                        <span className="font-mono text-[10px] text-white font-bold">
                          TABLE {n.tableNumber} — {n.itemCount} item{n.itemCount !== 1 ? 's' : ''} [{n.timestamp}]
                        </span>
                        <button
                          onClick={() => kitchenDismissNotification(n.id)}
                          className="text-slate-400 hover:text-white transition ml-1"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={kitchenDismissAllNotifications}
                  className="shrink-0 font-mono text-[10px] text-slate-400 hover:text-white border border-slate-700 rounded px-2 py-1 transition"
                >
                  CLEAR ALL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TOP FILTER & CONTROLS BAR ────────────────────────────── */}
        <div className="bg-white border-b-2 border-slate-900 px-4 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-mono text-[10px] font-black uppercase text-slate-500 mr-1">
              [FILTER]:
            </span>
            {['ALL', 'BIRYANI', 'STARTERS', 'CURRY', 'DRINKS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded border font-mono text-[10.5px] font-black transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-stone-50 text-slate-700 border-slate-300 hover:bg-stone-200'
                }`}
              >
                [{cat}]
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded font-mono text-[10px] font-black text-emerald-800 transition"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>[CLEAR {completedCount} DONE]</span>
              </button>
            )}
            <button
              onClick={() => callFloorWaiter('CALL_WAITER', 'Kitchen requests Captain at pass')}
              className="bg-stone-100 hover:bg-orange-100 border border-slate-300 px-2.5 py-1 rounded font-mono text-[10px] font-black text-slate-900 flex items-center gap-1 transition"
            >
              <Bell className="h-3 w-3 text-orange-600" />
              <span>[CALL WAITER]</span>
            </button>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-red-50 hover:bg-red-100 border border-red-300 px-2.5 py-1 rounded font-mono text-[10px] font-black text-red-700 flex items-center gap-1 transition"
              >
                <RefreshCw className="h-3 w-3" />
                <span>[RESET ALL]</span>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <span className="font-mono text-[10px] text-red-700 font-black">Confirm?</span>
                <button
                  onClick={() => { resetToFreshDemoState(); setShowResetConfirm(false); showToast('Kitchen reset. All tables cleared.'); }}
                  className="bg-red-600 text-white px-2 py-1 rounded font-mono text-[10px] font-black"
                >
                  YES
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-slate-200 text-slate-700 px-2 py-1 rounded font-mono text-[10px] font-black"
                >
                  NO
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── BULK AGGREGATION BAR ──────────────────────────────────── */}
        {bulkAggregation.length > 0 && (
          <div className="bg-stone-50 border-b-2 border-slate-900 p-3 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10.5px] font-black text-slate-900 uppercase">
                [📦 SAME DISH LIST — COMBINED ACROSS TABLES]
              </span>
              <span className="font-mono text-[10px] text-slate-500 font-bold">
                [{bulkAggregation.length} UNIQUE DISH{bulkAggregation.length !== 1 ? 'ES' : ''} ACTIVE]
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {bulkAggregation.map((b) => {
                const currentStage = getBulkCurrentStage(b.stages);
                return (
                  <div
                    key={b.canonical}
                    className="bg-white border-2 border-slate-900 rounded-xl p-2.5 shadow-[2px_2px_0px_#0f172a] flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="font-mono text-[11px] font-black text-slate-900 truncate" title={b.displayName}>
                        [{b.displayName}]
                      </span>
                      <span className="font-mono text-[10px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded ml-1 shrink-0">
                        ×{b.total}
                      </span>
                    </div>
                    <div className="font-mono text-[9px] text-slate-600 truncate">
                      {b.sources.join(', ')}
                    </div>
                    <div className={`text-center font-mono text-[9px] font-black px-1.5 py-0.5 rounded border ${STAGE_COLORS[currentStage]}`}>
                      {currentStage === 'RECEIVED' ? '⏳ PENDING'
                        : currentStage === 'PREPARING' ? '🔥 COOKING'
                        : currentStage === 'READY' ? '✅ READY'
                        : '🍽️ SERVED'}
                    </div>

                    {/* Bulk stage buttons */}
                    <div className="grid grid-cols-4 gap-0.5 font-mono text-[8px] font-black pt-0.5 border-t border-slate-100">
                      {STAGE_ORDER.map((stg, sIdx) => {
                        const labels = ['REC', 'PREP', 'RDY', 'SRV'];
                        const isActive = currentStage === stg;
                        return (
                          <button
                            key={stg}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetBulkStage(b.displayName, stg);
                            }}
                            className={`py-1 rounded text-center transition border ${
                              isActive
                                ? STAGE_ACTIVE_COLORS[stg]
                                : 'bg-stone-50 text-slate-700 border-slate-300 hover:bg-orange-100 hover:text-orange-900'
                            }`}
                            title={`Set all ${b.displayName} → ${stg}`}
                          >
                            {labels[sIdx]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MAIN BODY: 70% LEFT / 30% RIGHT ──────────────────────── */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT 70%: ACTIVE ORDERS GRID */}
          <div className="w-[70%] border-r-2 border-slate-900 p-3 overflow-y-auto bg-stone-100/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[10.5px] font-black text-slate-900 uppercase">
                [ACTIVE ORDERS — CLICK ANY TABLE TO OPEN DETAIL]
              </span>
              <span className="font-mono text-[10px] text-slate-500 font-bold">
                [{activeTables.length} ACTIVE]
              </span>
            </div>

            {activeTables.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                <UtensilsCrossed className="h-8 w-8 mb-2 opacity-40" />
                <p className="font-mono text-[11px] font-bold text-slate-500">[NO ACTIVE ORDERS]</p>
                <p className="font-mono text-[9px] text-slate-400 mt-1">Orders placed by customers or waiters will appear here in real time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {activeTables.map((tbl) => {
                  const ticketId = tbl.id; // tbl.id IS the ticket id
                  const ticket = bridgeTickets.find((tk) => tk.id === ticketId);
                  const allDone = tbl.items.every((it) => it.stage === 'SERVED');
                  const allReady = tbl.items.every((it) => it.stage === 'READY' || it.stage === 'SERVED');

                  return (
                    <motion.div
                      key={tbl.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        setSelectedTableNumber(tbl.tableNumber.replace('TABLE ', ''));
                        setCurrentScreen(3);
                      }}
                      className={`bg-white border-2 rounded-xl p-3 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] cursor-pointer transition flex flex-col gap-2 ${
                        allDone
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : allReady
                          ? 'border-blue-500 bg-blue-50/30'
                          : 'border-slate-900'
                      }`}
                    >
                      {/* Table header */}
                      <div className="flex items-center justify-between pb-1.5 border-b-2 border-slate-200">
                        <div className="flex items-center gap-1 font-mono text-xs font-black text-slate-900">
                          <span>[{tbl.tableNumber}]</span>
                          {tbl.isVip && <span className="text-amber-500">★</span>}
                          {allDone && <span className="text-[9px] bg-emerald-100 text-emerald-700 border border-emerald-200 rounded px-1 font-mono">ALL SERVED</span>}
                          {!allDone && allReady && <span className="text-[9px] bg-blue-100 text-blue-700 border border-blue-200 rounded px-1 font-mono animate-pulse">ALL READY</span>}
                        </div>
                        <span className="font-mono text-[10px] font-bold text-slate-600 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-orange-500" />
                          {tbl.elapsedMinutes}m · #{tbl.kotNumber}
                        </span>
                      </div>

                      {/* Items with stage steppers */}
                      <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                        {tbl.items.map((it) => (
                          <div key={it.id} className="bg-stone-50 border border-slate-200 rounded-lg p-2 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono font-black">
                              <span className="text-slate-900 truncate pr-1">
                                {it.quantity}× {it.name}
                              </span>
                              <span className={`font-mono text-[8.5px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${STAGE_COLORS[it.stage]}`}>
                                {it.stage}
                              </span>
                            </div>

                            {/* 4-Stage Stepper */}
                            <div className="grid grid-cols-4 gap-0.5">
                              {STAGE_ORDER.map((stg, sIdx) => {
                                const labels = ['REC', 'PREP', 'RDY', 'SRV'];
                                const isActive = it.stage === stg;
                                return (
                                  <button
                                    key={stg}
                                    onClick={() => {
                                      if (ticket) {
                                        handleSetItemStage(ticket.id, it.id, stg);
                                      }
                                    }}
                                    className={`py-1 rounded font-mono text-[8px] font-black text-center transition border ${
                                      isActive
                                        ? STAGE_ACTIVE_COLORS[stg]
                                        : 'bg-white text-slate-600 border-slate-300 hover:bg-stone-200'
                                    }`}
                                  >
                                    {labels[sIdx]}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Manage button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTableNumber(tbl.tableNumber.replace('TABLE ', ''));
                          setCurrentScreen(3);
                        }}
                        className="w-full py-1.5 bg-slate-900 hover:bg-orange-600 text-white font-mono text-[10px] font-black rounded uppercase tracking-wider transition text-center"
                      >
                        [MANAGE {tbl.tableNumber} ➔]
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT 30%: TIME QUEUE (ORDER RECEIPT HISTORY) */}
          <div className="w-[30%] bg-white p-3 overflow-y-auto flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-slate-900">
              <span className="font-mono text-[10.5px] font-black text-slate-900 uppercase">
                [ORDER QUEUE]
              </span>
              <span className="font-mono text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 rounded px-1.5">
                {bridgeTickets.filter(t => t.status !== 'COMPLETED').length} ACTIVE
              </span>
            </div>

            <div className="space-y-2 flex-1">
              {bridgeTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-center">
                  <p className="font-mono text-[10px]">No orders yet.</p>
                  <p className="font-mono text-[9px] mt-1 text-slate-300">Waiting for orders from tables...</p>
                </div>
              ) : (
                [...bridgeTickets].reverse().map((tk) => {
                  const isCompleted = tk.status === 'COMPLETED';
                  return (
                    <div
                      key={tk.id}
                      onClick={() => {
                        setSelectedTableNumber(tk.tableNumber);
                        setCurrentScreen(3);
                      }}
                      className={`p-2.5 rounded-lg border-2 cursor-pointer transition shadow-[2px_2px_0px_#0f172a] ${
                        isCompleted
                          ? 'border-slate-200 bg-slate-50 opacity-60'
                          : tk.status === 'READY'
                          ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                          : tk.status === 'PREP'
                          ? 'border-amber-400 bg-amber-50 hover:bg-amber-100'
                          : 'border-slate-900 bg-stone-50 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-black text-slate-900">
                          [#{tk.id.replace('KDS-', '')}] · TABLE {tk.tableNumber}
                        </span>
                        <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          isCompleted ? 'bg-slate-100 text-slate-400 border-slate-200' :
                          tk.status === 'READY' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          tk.status === 'PREP' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-orange-100 text-orange-700 border-orange-200'
                        }`}>
                          {isCompleted ? 'DONE' : tk.status}
                        </span>
                      </div>
                      <div className="font-mono text-[9px] text-slate-500 mb-1">{tk.timestamp} · {tk.serverName}</div>
                      <div className="space-y-0.5 font-mono text-[9px] text-slate-700">
                        {tk.items.map((it) => (
                          <div key={it.id} className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              it.stage === 'SERVED' ? 'bg-emerald-500' :
                              it.stage === 'PLATED' ? 'bg-blue-500' :
                              it.stage === 'PREP' ? 'bg-amber-500' :
                              'bg-slate-300'
                            }`} />
                            <span className="truncate">{it.quantity}× {it.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => callFloorWaiter('EXPEDITE', 'Calling floor runners to pass')}
              className="w-full py-2.5 rounded-xl border-2 border-slate-900 bg-stone-100 hover:bg-orange-50 font-mono text-xs font-black uppercase text-slate-900 flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#0f172a] transition"
            >
              <Bell className="h-3.5 w-3.5 text-orange-600" />
              <span>[CALL FLOOR RUNNER]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg z-50 font-mono"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </KitchenTabletHousing>
  );
};
