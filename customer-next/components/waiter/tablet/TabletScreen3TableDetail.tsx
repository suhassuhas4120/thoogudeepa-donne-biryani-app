'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import {
  ArrowLeft,
  CreditCard,
  Users,
  Trash2,
  Utensils,
  Check,
  CheckCircle2,
  Receipt,
  Bell,
  ChefHat,
  Clock,
  Plus,
  Printer,
  Sparkles,
  ChevronRight,
  Info,
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
  } = useSharedBridge();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTable = tables.find((t) => t.number === selectedTableNumber) || tables[0];
  const runningTotal = activeTable?.currentBill || 0;
  const subtotal = Math.round(runningTotal / 1.05);
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.05);

  // Active alerts for this specific table
  const tablePings = pings.filter(
    (p) => p.tableNumber === activeTable.number && p.status !== 'RESOLVED'
  );
  const tableReadyTickets = kdsTickets.filter(
    (k) => k.tableNumber === activeTable.number && k.status === 'READY'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleResolvePing = (pingId: string) => {
    waiterResolvePing(pingId);
    showToast(`✓ Assistance call resolved for Table ${activeTable.number}`);
  };

  const handleServeItem = (ticketId: string, itemId: string) => {
    waiterMarkKitchenItemServed(ticketId, itemId);
    showToast(`✓ Dish marked served for Table ${activeTable.number}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OCCUPIED':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'BILLING':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'CLEANING':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'VACANT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      default:
        return 'bg-stone-50 text-slate-700 border-slate-200';
    }
  };

  const getItemStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('ready') || s.includes('plated')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
    if (s.includes('cooking') || s.includes('prep')) {
      return 'bg-amber-50 text-amber-800 border-amber-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={3}
      screenTitle="TABLE DETAILS &amp; SETTLEMENT"
    >
      <div className="flex flex-col flex-1 min-h-[700px] relative">
        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-xs font-mono font-bold shadow-xl border border-slate-700 flex items-center gap-2.5"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP HEADER */}
        <div className="border-b-2 border-slate-800 bg-white px-5 py-3 flex items-center justify-between shrink-0 font-mono text-xs select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen(2)}
              className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Back to Tables</span>
            </button>
            <h3 className="font-black text-slate-950 text-base">
              Table {activeTable.number}
            </h3>
            <span className="text-slate-500 font-bold text-xs">
              • {activeTable.section}
            </span>
            <span
              className={`border px-2.5 py-0.5 rounded-md font-bold text-[11px] ${getStatusBadge(
                activeTable.status
              )}`}
            >
              {activeTable.status}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-600 font-bold text-xs">
              Floor Captain: <strong className="text-slate-900">{activeTable.serverName || activeCaptain}</strong>
            </span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-slate-600 font-bold text-xs">
              Capacity: <strong className="text-slate-900">{activeTable.capacity} Guests</strong>
            </span>
          </div>
        </div>

        {/* MAIN SPLIT: LEFT 60% / RIGHT 40% */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT 60%: TABLE DETAILS & ACTION BUTTONS */}
          <div className="w-[60%] border-r-2 border-slate-800 p-5 overflow-y-auto bg-slate-50 flex flex-col justify-between gap-4 font-mono">
            <div className="flex flex-col gap-3.5">
              {/* Live Alerts Banner (Pings or Kitchen Ready) */}
              {tablePings.length > 0 && (
                <div className="rounded-xl border border-orange-300 bg-orange-50 p-3 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-orange-600 animate-bounce shrink-0" />
                    <div>
                      <div className="text-xs font-black text-orange-950">
                        {tablePings[0].type}: {tablePings[0].message || 'Customer assistance requested'}
                      </div>
                      <div className="text-[10px] font-bold text-orange-700">
                        Requested by {tablePings[0].guestName} • {tablePings[0].timestamp}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleResolvePing(tablePings[0].id)}
                    className="py-1 px-3 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-lg transition active:scale-95 shadow-2xs cursor-pointer"
                  >
                    Resolve Call
                  </button>
                </div>
              )}

              {tableReadyTickets.length > 0 && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <ChefHat className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-emerald-950">
                        Kitchen Pass: Dishes Ready for Delivery
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        {tableReadyTickets[0].items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
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
                    className="py-1 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>Mark Served</span>
                  </button>
                </div>
              )}

              {/* Running KOT Card */}
              <div className="bg-white border-2 border-slate-300 rounded-xl p-4 flex justify-between items-center shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-slate-900">
                      {activeTable.status === 'OCCUPIED'
                        ? `KOT #${activeTable.kotCount || 1}`
                        : `Table ${activeTable.number}`}
                    </strong>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activeTable.status === 'VACANT' ? 'Vacant' : `Seated at ${activeTable.seatedTime || '12:30 PM'}`}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-bold mt-1">
                    Guests: {activeTable.guestCount || 0} (Capacity: {activeTable.capacity}) • Server: {activeTable.serverName || activeCaptain}
                  </div>
                </div>
                <div className="text-right">
                  <span className="border-2 border-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg font-black text-slate-950 text-sm inline-block">
                    Running Total: ₹ {runningTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-orange-600" />
                    <span>Ordered Items &amp; Kitchen Status</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {activeTable.activeItems?.length || 0} Items
                  </span>
                </div>

                {activeTable.status === 'VACANT' ? (
                  <div className="py-8 text-center space-y-2.5">
                    <div className="h-12 w-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-800">
                        Table {activeTable.number} is Vacant
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Sanitized and ready for guest seating (Capacity: {activeTable.capacity} Guests).
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen(4)}
                      className="mt-2 py-2 px-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black transition inline-flex items-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer active:scale-95"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span>Seat Guests &amp; Take Order</span>
                    </button>
                  </div>
                ) : activeTable.activeItems && activeTable.activeItems.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {activeTable.activeItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="h-5 px-2 rounded bg-orange-100 border border-orange-200 text-orange-950 font-mono font-black text-xs flex items-center justify-center">
                            {item.quantity}×
                          </span>
                          <span className="font-black text-slate-900 text-xs">
                            {item.name}
                          </span>
                        </div>
                        <span
                          className={`border px-2.5 py-0.5 rounded text-[10.5px] font-bold ${getItemStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400 italic">
                    No items ordered yet. Tap Take Order below to add items.
                  </div>
                )}
              </div>

              {/* Table Service Notes */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 flex flex-col gap-1.5 text-[11px] shadow-2xs">
                <span className="font-black text-slate-600 uppercase text-[10px] flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-slate-500" />
                  <span>Table Service Notes</span>
                </span>
                <div className="text-slate-700">
                  • Customer Request: Authentic Donne Spices, extra raita and salna
                </div>
                <div className="text-slate-700">
                  • Assigned Section: {activeTable.section}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (CLEAN, DIRECT & PROFESSIONAL 4-ACTION GRID + VACATE) */}
            <div className="flex flex-col gap-2 pt-2 shrink-0">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentScreen(4)}
                  className="py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Take Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(8)}
                  className="py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Bill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(6)}
                  className="py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98"
                >
                  <Users className="h-4 w-4" />
                  <span>Split / Merge Bill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(7)}
                  className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Collect Payment</span>
                </button>
              </div>

              {activeTable.status !== 'VACANT' && (
                <button
                  type="button"
                  onClick={() => setCurrentScreen(9)}
                  className="w-full py-2 bg-stone-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Vacate &amp; Clean Table</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT 40%: DEDICATED BILL SUMMARY & PAYMENT OVERVIEW */}
          <div className="w-[40%] bg-white p-5 overflow-y-auto flex flex-col justify-between font-mono select-none">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-slate-800">
                <span className="font-black text-xs text-slate-900 uppercase flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-slate-700" />
                  <span>Bill Summary &amp; Settlement</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Table {activeTable.number}
                </span>
              </div>

              {activeTable.status === 'VACANT' ? (
                /* Vacant Table Right Console View */
                <div className="py-16 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50/50">
                  <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs border border-emerald-200">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Table {activeTable.number} is Ready
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                      Cleaned, sanitized, and ready for guest seating.
                    </p>
                    <div className="text-[11px] font-bold text-slate-600 mt-2">
                      Section: {activeTable.section} • Capacity: {activeTable.capacity} Guests
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentScreen(4)}
                    className="mt-3 py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-xs transition flex items-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer active:scale-98"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Seat Guests &amp; Take Order</span>
                  </button>
                </div>
              ) : (
                /* Active Table Bill Breakdown & Settlement Options */
                <>
                  {/* Bill Breakdown Card */}
                  <div className="border-2 border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 bg-slate-50 shadow-xs">
                    <strong className="text-xs font-black text-slate-900">
                      Current Table Bill
                    </strong>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Subtotal:</span>
                      <span>₹ {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>CGST (2.5%):</span>
                      <span>₹ {(gst / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>SGST (2.5%):</span>
                      <span>₹ {(gst / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Service Charge (5%):</span>
                      <span>₹ {serviceCharge.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-black text-slate-950">
                      <span>Total Amount Payable:</span>
                      <span>₹ {runningTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Workflow Options */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Settlement &amp; Checkout Workflow
                    </span>

                    {/* Option 1: Split Bill First */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen(6)}
                      className="w-full p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 rounded-xl font-black text-xs transition flex items-center justify-between cursor-pointer active:scale-98"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-purple-200/70 flex items-center justify-center text-purple-800 shrink-0">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-black text-xs">1. Split Bill Among Guests</div>
                          <div className="text-[10px] font-normal text-purple-700">Divide check by guests before payment</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-purple-800">
                        <span>Split</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </button>

                    {/* Option 2: Direct Payment */}
                    <button
                      type="button"
                      onClick={() => setCurrentScreen(7)}
                      className="w-full p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs transition flex items-center justify-between cursor-pointer shadow-xs active:scale-98"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white shrink-0">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-black text-xs">2. Settle Payment in Full</div>
                          <div className="text-[10px] font-normal text-emerald-100">Pay entire bill via UPI QR, Card, or Cash</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-100">
                        <span>Pay</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </button>
                  </div>

                  {/* Customer Notes & Preference */}
                  <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-1 text-[11px] bg-slate-50">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">
                      Customer Payment Preference
                    </span>
                    <div className="text-slate-700">• Preferred Method: UPI QR or Cash</div>
                    <div className="text-slate-700">
                      • Guest Capacity: {activeTable.guestCount || 0} of {activeTable.capacity} Guests
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Print Button at bottom of right column */}
            {activeTable.status !== 'VACANT' && (
              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentScreen(8)}
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print 80mm Customer Invoice</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};

