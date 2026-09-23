'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import {
  ArrowLeft,
  CreditCard,
  Users,
  Receipt,
  LogOut,
  Utensils,
  Check,
  Bell,
  ChefHat,
  Plus,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TabletScreen3TableDetail: React.FC = () => {
  const {
    selectedTableNumber,
    setCurrentScreen,
    activeCaptain,
  } = useWaiterStore();

  const {
    tables,
    pings,
    kdsTickets,
    waiterResolvePing,
    waiterMarkKitchenItemServed,
    waiterMergeTables,
    waiterRecordsPayment,
  } = useSharedBridge();

  const [rightPane, setRightPane] = useState<'default' | 'payment' | 'merge'>('default');
  const [selectedMergeChip, setSelectedMergeChip] = useState<string>('A-02');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('UPI');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const activeTable = tables.find((t) => t.number === selectedTableNumber) || tables[0];
  const runningTotal = activeTable?.currentBill || 0;
  const subtotal = Math.round(runningTotal / 1.05);
  const gst = Math.round(subtotal * 0.05);
  const cgst = Math.round(gst / 2);
  const sgst = gst - cgst;

  const isVacant = activeTable.status === 'VACANT';
  const isBilling = activeTable.status === 'BILLING';
  const isOccupied = activeTable.status === 'OCCUPIED';

  const tablePings = pings.filter((p) => p.tableNumber === activeTable.number);
  const tableReadyTickets = kdsTickets.filter(
    (k) => k.tableNumber === activeTable.number && k.status === 'READY'
  );

  const availableMergeTables = tables.filter(
    (t) => t.number !== activeTable.number && t.status !== 'CLEANING'
  );

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

  const handleConfirmMerge = () => {
    waiterMergeTables(activeTable.number, selectedMergeChip);
    showToast(`✓ Table ${selectedMergeChip} successfully merged into Table ${activeTable.number}`);
  };

  const handleQuickPayment = () => {
    waiterRecordsPayment(activeTable.number, paymentMethod, runningTotal);
    showToast(`✓ Payment of ₹ ${runningTotal} recorded via ${paymentMethod}`);
  };

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={3}
      screenTitle="DETAILED TABLE VIEW &amp; DYNAMIC COMMAND HUB"
    >
      <div className="flex flex-col flex-1 min-h-[700px] relative">
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-xs font-mono font-bold shadow-2xl border border-slate-700 flex items-center gap-3"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP HEADER */}
        <div className="border-b-2 border-slate-800 bg-white px-5 py-2.5 flex items-center justify-between shrink-0 font-mono text-xs select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen(2)}
              className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Floor</span>
            </button>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-950 text-sm">
                Table {activeTable.number}
              </h3>
              {activeTable.section && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-slate-600 border border-slate-200">
                  {activeTable.section}
                </span>
              )}
            </div>
            <span
              className={`px-2.5 py-0.5 rounded font-bold text-[11px] border ${getStatusBadge(
                activeTable.status
              )}`}
            >
              {activeTable.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-bold text-[11px]">
            <span>Captain: {activeCaptain || activeTable.serverName || 'Captain Ramesh'}</span>
            <span className="text-slate-300">•</span>
            <span>Capacity: {activeTable.capacity} Guests</span>
          </div>
        </div>

        {/* MAIN SPLIT: LEFT 60% / RIGHT 40% */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT 60%: TABLE DETAILS & ACTION BUTTONS */}
          <div className="w-[60%] border-r-2 border-slate-800 p-5 overflow-y-auto bg-slate-50 flex flex-col justify-between gap-4 font-mono">
            <div className="flex flex-col gap-3">
              {/* Running KOT Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center shadow-xs">
                <div>
                  <strong className="text-sm font-black text-slate-900 block">
                    {isVacant
                      ? 'Table Vacant • Ready for Seating'
                      : `KOT #${activeTable.kotCount || 1} • Seated: ${activeTable.seatedTime || 'Just now'}`}
                  </strong>
                  <div className="text-[11px] text-slate-500 font-bold mt-0.5">
                    {isVacant
                      ? `Clean & Sanitized • Fits up to ${activeTable.capacity} Guests`
                      : `Guests: ${activeTable.guestCount || 2} • Captain: ${activeCaptain || activeTable.serverName || 'Captain Ramesh'}`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="border border-orange-200 bg-orange-50 px-3 py-1 rounded-lg font-black text-orange-700 text-sm">
                    {runningTotal > 0 ? `₹ ${runningTotal}` : '₹ 0'}
                  </span>
                </div>
              </div>

              {/* Live Alerts (Customer Calls & Kitchen Ready) */}
              {tablePings.length > 0 && (
                <div className="space-y-2">
                  {tablePings.map((ping) => (
                    <div
                      key={ping.id}
                      className="rounded-xl border border-orange-300 bg-orange-50 p-3 flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Bell className="h-4 w-4 text-orange-600 animate-bounce shrink-0" />
                        <div>
                          <div className="text-xs font-black text-slate-900">
                            Customer Call: {ping.type}
                          </div>
                          <div className="text-[10.5px] text-slate-600 font-bold">
                            {ping.timestamp} • {ping.message || ping.guestName || 'Assistance requested'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          waiterResolvePing(ping.id);
                          showToast(`✓ Resolved ${ping.type} for Table ${activeTable.number}`);
                        }}
                        className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center gap-1 active:scale-95"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Resolve</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {tableReadyTickets.length > 0 && (
                <div className="space-y-2">
                  {tableReadyTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-3">
                        <ChefHat className="h-4 w-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-900">
                            Kitchen Alert: Dishes READY!
                          </div>
                          <div className="text-[10.5px] text-emerald-800 font-bold truncate">
                            {ticket.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          waiterMarkKitchenItemServed(ticket.id, ticket.items[0]?.id ?? '');
                          showToast(`✓ Dishes marked served for Table ${activeTable.number}`);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center gap-1 shrink-0 active:scale-95"
                      >
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Served</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Ordered Items List & Preparation Tracking */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-orange-600" />
                    <span>Running KOT Items — Table {activeTable.number}</span>
                  </span>
                  <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {isVacant ? 'VACANT' : `KOT #${activeTable.kotCount || 1}`}
                  </span>
                </div>

                {activeTable.activeItems && activeTable.activeItems.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {activeTable.activeItems.map((item, idx) => {
                      const isPrep =
                        item.status === 'PREPARING' ||
                        item.status === 'PREP' ||
                        item.status === 'Cooking';
                      const isReady =
                        item.status === 'READY' ||
                        item.status === 'PLATED' ||
                        item.status === 'Ready';
                      return (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center shadow-2xs"
                        >
                          <div>
                            <strong className="text-xs font-black text-slate-900">
                              {item.quantity}x {item.name}
                            </strong>
                            <div className="text-[10.5px] text-slate-500 font-bold mt-0.5">
                              {isPrep
                                ? 'Chef at tandoor / stove • Express preparation'
                                : isReady
                                ? 'Piping hot at kitchen pickup counter'
                                : 'Delivered to table'}
                            </div>
                          </div>
                          <span
                            className={`border px-2.5 py-0.5 rounded text-[10.5px] font-bold ${
                              isPrep
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : isReady
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : 'bg-stone-100 text-slate-800 border-slate-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : isVacant ? (
                  <div className="py-8 text-center font-mono">
                    <span className="text-3xl block mb-2">🍽️</span>
                    <p className="text-xs font-black text-slate-700">Table is Empty &amp; Sanitized</p>
                    <p className="text-[10.5px] text-slate-400 font-bold mt-1">
                      Tap Take New Order below to seat guests and fire KOT.
                    </p>
                  </div>
                ) : (
                  <div className="py-4 text-center font-mono text-slate-400 text-xs">
                    No active food items recorded for this table.
                  </div>
                )}
              </div>

              {/* Customer Service Notes */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col gap-1 text-[11px] shadow-2xs">
                <span className="font-black text-slate-500 uppercase text-[10px] flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>Service Notes &amp; Special Requests</span>
                </span>
                <div className="text-slate-700">
                  • Water and sanitized cutlery provided upon seating.
                </div>
                <div className="text-slate-700">
                  • Priority Donne Biryani turnaround • Handled by {activeCaptain || 'Floor Captain'}.
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (CLEAN 5-BUTTON LAYOUT) */}
            <div className="space-y-2 pt-2 border-t border-slate-200 shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCurrentScreen(4)}
                  className="py-3 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>Take New Order</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCurrentScreen(8)}
                  className="py-3 px-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Receipt className="h-4 w-4 text-blue-600" />
                  <span>Print Bill</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setRightPane('payment')}
                  className={`py-3 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs ${
                    rightPane === 'payment'
                      ? 'bg-emerald-600 text-white border border-emerald-700'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300'
                  }`}
                >
                  <CreditCard className={`h-4 w-4 ${rightPane === 'payment' ? 'text-white' : 'text-emerald-600'}`} />
                  <span>Settle Payment</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setRightPane('merge')}
                  className={`py-3 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 border shadow-2xs ${
                    rightPane === 'merge'
                      ? 'bg-purple-700 text-white border-purple-800'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-300'
                  }`}
                >
                  <Users className={`h-4 w-4 ${rightPane === 'merge' ? 'text-white' : 'text-purple-600'}`} />
                  <span>Merge / Split</span>
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setCurrentScreen(9)}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <LogOut className="h-4 w-4 text-amber-400" />
                <span>Vacate Table</span>
              </motion.button>
            </div>
          </div>

          {/* RIGHT 40%: DYNAMIC INTERACTIVE CONSOLE */}
          <div className="w-[40%] bg-white p-5 overflow-y-auto flex flex-col justify-between font-mono select-none">
            {/* Console Tab Bar */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 border border-slate-200">
              <button
                type="button"
                onClick={() => setRightPane('default')}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
                  rightPane === 'default'
                    ? 'bg-white text-slate-950 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bill Summary
              </button>
              <button
                type="button"
                onClick={() => setRightPane('payment')}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
                  rightPane === 'payment'
                    ? 'bg-white text-slate-950 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Payment
              </button>
              <button
                type="button"
                onClick={() => setRightPane('merge')}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition ${
                  rightPane === 'merge'
                    ? 'bg-white text-slate-950 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Merge
              </button>
            </div>

            {/* TAB 1: DEFAULT BILL SUMMARY */}
            {rightPane === 'default' && (
              <div className="flex flex-col gap-4">
                <span className="font-black text-xs text-slate-900 uppercase">
                  Live Bill Summary — Table {activeTable.number}
                </span>

                <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 bg-slate-50 shadow-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <strong className="text-xs font-black text-slate-900">
                      Running Tax Invoice
                    </strong>
                    <span className="text-[10px] font-bold text-slate-500">
                      5% GST Included
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Items Subtotal:</span>
                    <span>₹ {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>CGST (2.5%):</span>
                    <span>₹ {cgst}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>SGST (2.5%):</span>
                    <span>₹ {sgst}</span>
                  </div>
                  <div className="border-t-2 border-slate-900 pt-2.5 flex justify-between text-base font-black text-slate-950">
                    <span>Total Amount:</span>
                    <span className="text-orange-600">₹ {runningTotal}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-1.5 text-[11px] bg-white">
                  <span className="font-black text-slate-500 uppercase text-[10px]">
                    Customer &amp; Payment Preferences
                  </span>
                  <div className="text-slate-700">• Preferred Payment: UPI QR or Cash</div>
                  <div className="text-slate-700">
                    • Loyalty Membership: Silver Tier (50 pts available)
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen(8)}
                    className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <Receipt className="h-4 w-4 text-blue-600" />
                    <span>View &amp; Print Official Bill (Screen 8)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPane('payment')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Proceed to Settle Payment</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PAYMENT CONSOLE */}
            {rightPane === 'payment' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-black text-xs text-slate-950">
                    Payment Console — Table {activeTable.number}
                  </span>
                  <button
                    onClick={() => setRightPane('default')}
                    className="border border-slate-300 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 bg-slate-50">
                  <span className="text-xs font-black text-slate-900">
                    Choose Settlement Method:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['CASH', 'CARD', 'UPI'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 rounded-lg font-black text-xs transition border ${
                          paymentMethod === method
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {method === 'CARD' ? 'CARD POS' : method === 'UPI' ? 'UPI QR' : 'CASH'}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                    <span className="text-xs text-slate-600 font-bold">Total Bill:</span>
                    <span className="text-base font-black text-orange-600">₹ {runningTotal}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickPayment}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>Record {paymentMethod} Payment</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen(7)}
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs transition shadow-2xs flex items-center justify-center gap-2"
                  >
                    <CreditCard className="h-4 w-4 text-emerald-400" />
                    <span>Open Full Payment Processing (Screen 7)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentScreen(6)}
                    className="w-full py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs transition"
                  >
                    Split Bill Options (Screen 6)
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: MERGE TABLES CONSOLE */}
            {rightPane === 'merge' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-black text-xs text-slate-950">
                    Merge Tables Console
                  </span>
                  <button
                    onClick={() => setRightPane('default')}
                    className="border border-slate-300 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-600">
                    Select Table to Merge with Table {activeTable.number}:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {availableMergeTables.slice(0, 8).map((tbl) => (
                      <button
                        key={tbl.number}
                        type="button"
                        onClick={() => setSelectedMergeChip(tbl.number)}
                        className={`py-2 px-1 border rounded-lg text-xs font-black transition ${
                          selectedMergeChip === tbl.number
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {tbl.number}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Merged Preview */}
                {(() => {
                  const targetTableData = tables.find((t) => t.number === selectedMergeChip);
                  const combinedGuests = (activeTable.guestCount || 0) + (targetTableData?.guestCount || 0);
                  const combinedBill = runningTotal + (targetTableData?.currentBill || 0);

                  return (
                    <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-2 bg-white shadow-2xs text-[11px]">
                      <strong className="text-xs font-black text-slate-900">
                        Merged Table Preview
                      </strong>
                      <div className="text-slate-700">
                        Combined Tables: Table {activeTable.number} + Table {selectedMergeChip}
                      </div>
                      <div className="text-slate-700">
                        Total Guests: {combinedGuests} Guests (Combined Capacity)
                      </div>
                      <div className="text-slate-900 font-black text-xs pt-1 border-t border-dashed border-slate-200 flex justify-between">
                        <span>Consolidated Bill:</span>
                        <span className="text-orange-600">₹ {combinedBill}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmMerge}
                    className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black text-xs transition shadow-2xs flex items-center justify-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Confirm Merge &amp; Sync Bills</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentScreen(6)}
                    className="w-full py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs transition"
                  >
                    Advanced Split &amp; Transfer (Screen 6)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
