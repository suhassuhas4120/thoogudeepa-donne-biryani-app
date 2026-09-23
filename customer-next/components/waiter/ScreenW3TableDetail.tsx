'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../store/useWaiterStore';
import { useSharedBridge } from '../../store/useSharedBridge';
import { WaiterTabletHousing } from './WaiterTabletHousing';
import {
  ArrowLeft,
  Plus,
  Receipt,
  Users,
  CreditCard,
  LogOut,
  Flame,
  CheckCircle2,
  Clock,
  Utensils,
  Bell,
  ChefHat,
  Check,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScreenW3TableDetail: React.FC = () => {
  const {
    setCurrentScreen,
    selectedTableNumber,
    activeCaptain,
  } = useWaiterStore();

  const {
    tables,
    pings,
    kdsTickets,
    waiterResolvePing,
    waiterMarkKitchenItemServed,
  } = useSharedBridge();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const table =
    tables.find((t) => t.number === selectedTableNumber) || tables[0];

  const tablePings = pings.filter((p) => p.tableNumber === table.number);
  const tableReadyTickets = kdsTickets.filter(
    (k) => k.tableNumber === table.number && k.status === 'READY'
  );

  const isVacant = table.status === 'VACANT';
  const isBilling = table.status === 'BILLING';
  const isOccupied = table.status === 'OCCUPIED';

  const subtotal = Math.round((table.currentBill || 0) / 1.05);
  const gst = Math.round(subtotal * 0.05);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OCCUPIED':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'BILLING':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'CLEANING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'VACANT':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-stone-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <WaiterTabletHousing screenNumber={3} screenTitle="TABLE DETAIL &amp; ACTION HUB">
      <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto space-y-3 relative">
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-2 left-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-3.5 py-2 text-xs font-mono font-bold shadow-xl border border-slate-700 flex items-center justify-between"
            >
              <span>{toastMessage}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen(2)}
              className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 font-mono transition"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Back to Floor</span>
            </button>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${getStatusBadge(
                table.status
              )}`}
            >
              {table.status}
            </span>
          </div>

          {/* Live Table Alerts (Calls & Kitchen Dishes for this table) */}
          {tablePings.length > 0 && (
            <div className="space-y-1.5 font-mono">
              {tablePings.map((ping) => (
                <div
                  key={ping.id}
                  className="rounded-xl border border-orange-300 bg-orange-50 p-2.5 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-orange-600 animate-bounce shrink-0" />
                    <div>
                      <div className="text-xs font-black text-slate-900">
                        Customer Request: {ping.type}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {ping.timestamp} • {ping.message || ping.guestName || 'Assistance requested'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      waiterResolvePing(ping.id);
                      showToast(`✓ Resolved ${ping.type} for Table ${table.number}`);
                    }}
                    className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition flex items-center gap-1 active:scale-95"
                  >
                    <Check className="h-3 w-3" />
                    <span>Resolve</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {tableReadyTickets.length > 0 && (
            <div className="space-y-1.5 font-mono">
              {tableReadyTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <ChefHat className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-black text-slate-900">
                        Kitchen Alert: Dishes READY!
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold truncate">
                        {ticket.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      waiterMarkKitchenItemServed(ticket.id, ticket.items[0]?.id ?? '');
                      showToast(`✓ Dishes marked served for Table ${table.number}`);
                    }}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition flex items-center gap-1 shrink-0 active:scale-95"
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>Served</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Table Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs flex items-center justify-between font-mono">
            <div>
              <div className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>Table {table.number}</span>
                {table.section && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-slate-600 border border-slate-200">
                    {table.section}
                  </span>
                )}
              </div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">
                {isVacant
                  ? `Capacity: ${table.capacity} Guests • Vacant`
                  : `Guests: ${table.guestCount || 2} • Captain: ${activeCaptain || table.serverName || 'Captain Ramesh'}`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-orange-600">
                {table.currentBill > 0 ? `₹ ${table.currentBill}` : '₹ 0'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {isVacant ? 'Ready for Seating' : `Seated: ${table.seatedTime || 'Just now'}`}
              </div>
            </div>
          </div>

          {/* Running KOT Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-mono">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Utensils className="h-3 w-3 text-orange-600" />
                <span>Running KOT Items — Table {table.number}</span>
              </span>
              <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {isVacant ? 'VACANT' : `KOT #${table.kotCount || 1}`}
              </span>
            </div>

            {table.activeItems && table.activeItems.length > 0 ? (
              <div className="space-y-2 font-mono">
                {table.activeItems.map((item, idx) => {
                  const isPrep = item.status === 'PREPARING' || item.status === 'PREP';
                  const isReady = item.status === 'READY' || item.status === 'PLATED';
                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs py-1 border-b border-dashed border-slate-100 last:border-b-0"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-black text-slate-900 truncate">
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {isPrep
                            ? 'Chef at tandoor / stove'
                            : isReady
                            ? 'Ready at kitchen pickup counter'
                            : 'Delivered to table'}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[9.5px] font-bold shrink-0 border ${
                          isPrep
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : isReady
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-stone-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : isVacant ? (
              <div className="py-5 text-center font-mono">
                <span className="text-2xl block mb-1">🍽️</span>
                <p className="text-xs font-black text-slate-700">Table is Empty &amp; Sanitized</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  Tap &quot;Take New Order&quot; to seat guests and start KOT.
                </p>
              </div>
            ) : (
              <div className="py-3 text-center font-mono text-slate-400 text-xs">
                No active food items recorded for this table.
              </div>
            )}
          </div>

          {/* Running Bill Summary Breakdown */}
          {table.currentBill > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-1.5 font-mono text-xs">
              <div className="text-[10px] font-black uppercase text-slate-400 pb-1 border-b border-slate-100">
                Running Bill Breakdown
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Items Subtotal:</span>
                <span>₹ {subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>5% GST:</span>
                <span>₹ {gst}</span>
              </div>
              <div className="pt-1.5 border-t border-dashed border-slate-200 flex justify-between font-black text-slate-950 text-sm">
                <span>Total Amount:</span>
                <span className="text-orange-600">₹ {table.currentBill}</span>
              </div>
            </div>
          )}

          {/* Quick Action Matrix (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(4)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-600/20 hover:bg-orange-700 transition"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Take New Order</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(6)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-black shadow-2xs hover:bg-stone-50 transition"
            >
              <Users className="h-4 w-4 text-purple-600" />
              <span>Merge / Split</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(7)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-black shadow-2xs hover:bg-stone-50 transition"
            >
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <span>Collect Payment</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(8)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-black shadow-2xs hover:bg-stone-50 transition"
            >
              <Receipt className="h-4 w-4 text-blue-600" />
              <span>Print Bill</span>
            </motion.button>
          </div>
        </div>

        {/* Adaptive Bottom CTA */}
        <div className="space-y-2 pt-2 border-t border-slate-100 font-mono">
          {isVacant ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(4)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-orange-600 text-white text-xs font-black hover:bg-orange-700 transition shadow-md shadow-orange-600/20"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Seat Guests &amp; Start Order</span>
            </motion.button>
          ) : isBilling ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(7)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-purple-700 text-white text-xs font-black hover:bg-purple-800 transition shadow-md shadow-purple-700/20"
            >
              <CreditCard className="h-4 w-4" />
              <span>Collect Payment (₹ {table.currentBill})</span>
            </motion.button>
          ) : isOccupied ? (
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentScreen(8)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-purple-50 border border-purple-300 text-purple-800 text-xs font-black hover:bg-purple-100 transition shadow-2xs"
              >
                <Receipt className="h-4 w-4" />
                <span>Request Bill</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentScreen(9)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-black transition shadow-2xs"
              >
                <LogOut className="h-4 w-4" />
                <span>Vacate Table</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(9)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-black transition shadow-xs"
            >
              <LogOut className="h-4 w-4 text-amber-400" />
              <span>Vacate &amp; Clean Table</span>
            </motion.button>
          )}
        </div>
      </div>
    </WaiterTabletHousing>
  );
};
