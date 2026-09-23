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
  Trash2,
  CheckCircle2,
  Clock,
  Utensils,
  Bell,
  ChefHat,
  Check,
  Printer,
  Sparkles,
  Info,
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

  // Active Pings for this specific table
  const tablePings = pings.filter(
    (p) => p.tableNumber === table.number && p.status !== 'RESOLVED'
  );

  // Ready Kitchen Tickets for this specific table
  const tableReadyTickets = kdsTickets.filter(
    (k) => k.tableNumber === table.number && k.status === 'READY'
  );

  const handleResolvePing = (pingId: string) => {
    waiterResolvePing(pingId);
    showToast(`✓ Call resolved for Table ${table.number}`);
  };

  const handleServeItem = (ticketId: string, itemId: string) => {
    waiterMarkKitchenItemServed(ticketId, itemId);
    showToast(`✓ Dishes marked served for Table ${table.number}`);
  };

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

  const getItemStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('ready') || s.includes('plated')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (s.includes('cooking') || s.includes('prep')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  // Bill calculations
  const totalBill = table.currentBill || 0;
  const subtotal = Math.round(totalBill / 1.05);
  const gst = totalBill - subtotal;

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
          {/* Top Header Bar */}
          <div className="flex items-center justify-between font-mono">
            <button
              onClick={() => setCurrentScreen(2)}
              className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-slate-900 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>All Tables</span>
            </button>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                table.status
              )}`}
            >
              {table.status}
            </span>
          </div>

          {/* Pending Alerts Banner for this Table */}
          {tablePings.length > 0 && (
            <div className="rounded-xl border border-orange-300 bg-orange-50 p-2.5 flex items-center justify-between font-mono shadow-2xs">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-orange-600 animate-bounce shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-orange-950">
                    {tablePings[0].type}: {tablePings[0].message || 'Customer assistance'}
                  </div>
                  <div className="text-[9.5px] font-bold text-orange-700">
                    Requested {tablePings[0].timestamp}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleResolvePing(tablePings[0].id)}
                className="py-1 px-2 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold rounded-lg transition active:scale-95 shadow-2xs"
              >
                Resolve
              </button>
            </div>
          )}

          {tableReadyTickets.length > 0 && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 flex items-center justify-between font-mono shadow-2xs">
              <div className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[11px] font-black text-emerald-950">
                    Dishes Ready at Kitchen Pass
                  </div>
                  <div className="text-[9.5px] font-bold text-emerald-700">
                    Ready for delivery to table
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleServeItem(
                    tableReadyTickets[0].id,
                    tableReadyTickets[0].items[0]?.id || ''
                  )
                }
                className="py-1 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1 active:scale-95 shadow-2xs"
              >
                <Check className="h-3 w-3 stroke-[2.5]" />
                <span>Mark Served</span>
              </button>
            </div>
          )}

          {/* Table Summary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs flex items-center justify-between font-mono">
            <div>
              <div className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>Table {table.number}</span>
                <span className="text-slate-400 font-normal text-xs">• {table.section}</span>
              </div>
              <div className="text-[10.5px] text-slate-500 mt-0.5 flex items-center gap-2">
                <span>Guests: {table.guestCount || 0} (Cap: {table.capacity})</span>
                <span>•</span>
                <span>Server: {table.serverName || activeCaptain || 'Captain'}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-slate-900">
                ₹ {totalBill}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" />
                <span>{table.status === 'VACANT' ? 'Vacant' : table.seatedTime}</span>
              </div>
            </div>
          </div>

          {/* Running KOTs / Ordered Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Utensils className="h-3 w-3 text-orange-600" />
                <span>Running Ordered Items</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {table.status === 'OCCUPIED' ? `KOT #${table.kotCount || 1}` : table.status}
              </span>
            </div>

            {table.status === 'VACANT' ? (
              <div className="py-6 text-center space-y-2">
                <div className="h-10 w-10 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-slate-400">
                  <Utensils className="h-5 w-5" />
                </div>
                <div className="text-xs font-black text-slate-700">
                  Table {table.number} is Vacant
                </div>
                <div className="text-[10.5px] text-slate-400">
                  Sanitized and ready for guest seating.
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentScreen(4)}
                  className="mt-1 py-1.5 px-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Seat Guests &amp; Take Order</span>
                </button>
              </div>
            ) : table.activeItems && table.activeItems.length > 0 ? (
              <div className="space-y-2 divide-y divide-slate-100">
                {table.activeItems.map((item, idx) => (
                  <div key={idx} className="pt-1.5 first:pt-0 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-black text-slate-900">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded border ${getItemStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                No items ordered yet. Tap Take Order below to add items.
              </div>
            )}

            {/* Bill Summary Breakdown (if bill > 0) */}
            {totalBill > 0 && (
              <div className="pt-2.5 mt-2 border-t border-dashed border-slate-200 text-[10.5px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹ {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹ {gst}</span>
                </div>
                <div className="flex justify-between font-black text-xs text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Amount:</span>
                  <span>₹ {totalBill}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Matrix (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-2 pt-0.5 font-mono">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(4)}
              className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-600/20 hover:bg-orange-700 transition"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Take Order</span>
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

        {/* Bottom Adaptive Actions */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 font-mono">
          {table.status === 'VACANT' ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(4)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 text-white text-xs font-black hover:bg-orange-700 transition shadow-md shadow-orange-600/20"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Seat Guests &amp; Start Order</span>
            </motion.button>
          ) : table.status === 'BILLING' ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(7)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-700 text-white text-xs font-black hover:bg-purple-800 transition shadow-md shadow-purple-700/20"
            >
              <CreditCard className="h-4 w-4" />
              <span>Collect Payment (₹ {totalBill})</span>
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(8)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition shadow-xs"
            >
              <Receipt className="h-4 w-4" />
              <span>Request Bill ➔ Print Bill</span>
            </motion.button>
          )}

          {table.status !== 'VACANT' && (
            <button
              type="button"
              onClick={() => setCurrentScreen(9)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition"
            >
              <Trash2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Vacate &amp; Clean Table ➔</span>
            </button>
          )}
        </div>
      </div>
    </WaiterTabletHousing>
  );
};
