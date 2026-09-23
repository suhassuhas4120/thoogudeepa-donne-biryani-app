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
    waiterMergeTables,
    waiterRecordsPayment,
    waiterResolvePing,
    waiterMarkKitchenItemServed,
  } = useSharedBridge();

  const [rightPane, setRightPane] = useState<'default' | 'payment' | 'merge'>('default');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CASH' | 'CARD POS' | 'UPI QR'>('UPI QR');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [mergeConfirmed, setMergeConfirmed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTable = tables.find((t) => t.number === selectedTableNumber) || tables[0];
  const runningTotal = activeTable?.currentBill || 0;
  const subtotal = Math.round(runningTotal / 1.05);
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.05);

  // Candidate tables for merge (excluding current table)
  const candidateMergeTables = tables.filter((t) => t.number !== activeTable.number);
  const [selectedMergeChip, setSelectedMergeChip] = useState<string>(
    candidateMergeTables[0]?.number || 'A-02'
  );

  const targetMergeTable = tables.find((t) => t.number === selectedMergeChip);
  const mergedTotalCapacity = activeTable.capacity + (targetMergeTable?.capacity || 2);
  const mergedRunningBill = runningTotal + (targetMergeTable?.currentBill || 0);

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

  const handleConfirmMerge = () => {
    waiterMergeTables(activeTable.number, selectedMergeChip);
    setMergeConfirmed(true);
    showToast(`✓ Table ${activeTable.number} successfully merged with ${selectedMergeChip}`);
    setTimeout(() => setMergeConfirmed(false), 3000);
  };

  const handleQuickPayment = () => {
    waiterRecordsPayment(activeTable.number, selectedPaymentMethod, runningTotal);
    setPaymentConfirmed(true);
    showToast(`✓ Payment of ₹${runningTotal} recorded via ${selectedPaymentMethod}`);
    setTimeout(() => setPaymentConfirmed(false), 3000);
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
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
              <span>Back to All Tables</span>
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
                        Guest: {tablePings[0].guestName} • Requested {tablePings[0].timestamp}
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
                    Running Bill: ₹ {runningTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Ordered Items List */}
              <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-orange-600" />
                    <span>Ordered Items &amp; Preparation Tracking</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {activeTable.activeItems?.length || 0} Items
                  </span>
                </div>

                {activeTable.status === 'VACANT' ? (
                  <div className="py-6 text-center space-y-2">
                    <div className="h-10 w-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-black text-slate-800">
                      Table {activeTable.number} is Vacant
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Sanitized and ready for guest seating.
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen(4)}
                      className="mt-1 py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-black transition inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
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
                        <div>
                          <strong className="text-xs font-black text-slate-900">
                            {item.quantity}x {item.name}
                          </strong>
                          <div className="text-[10.5px] text-slate-500 font-bold mt-0.5">
                            Kitchen Item #{idx + 1}
                          </div>
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

              {/* Special Customer Service Notes */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 flex flex-col gap-1 text-[11px] shadow-2xs">
                <span className="font-black text-slate-600 uppercase text-[10px]">
                  Special Customer Service Notes
                </span>
                <div className="text-slate-700">
                  • Customer Request: Authentic Donne Spices, extra raita and salna
                </div>
                <div className="text-slate-700">
                  • Table sanitized and setup verified by {activeTable.serverName || activeCaptain}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS IN 60% LEFT (STRUCTURED 2-ROW GRID) */}
            <div className="flex flex-col gap-2.5 pt-2 shrink-0">
              {/* Row 1: Primary Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentScreen(4)}
                  className="py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Take Orders ➔ Screen 4</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(8)}
                  className="py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <Receipt className="h-4 w-4" />
                  <span>Print Bill ➔ Screen 8</span>
                </button>
              </div>

              {/* Row 2: Secondary Console & Utility Actions */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRightPane(rightPane === 'payment' ? 'default' : 'payment')}
                  className={`py-2.5 px-3 rounded-lg font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer border ${
                    rightPane === 'payment'
                      ? 'bg-purple-700 text-white border-purple-800'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>{rightPane === 'payment' ? 'Close Payment' : 'Payment Console'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRightPane(rightPane === 'merge' ? 'default' : 'merge')}
                  className={`py-2.5 px-3 rounded-lg font-black text-xs transition flex items-center justify-center gap-1.5 border shadow-2xs cursor-pointer ${
                    rightPane === 'merge'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>{rightPane === 'merge' ? 'Close Merge' : 'Merge Tables'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(9)}
                  className="py-2.5 px-3 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded-lg font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Vacate ➔ Screen 9</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 40%: DYNAMIC VIEW (CHANGES BASED ON BUTTON CLICKS) */}
          <div className="w-[40%] bg-white p-5 overflow-y-auto flex flex-col justify-between font-mono select-none">
            {rightPane === 'default' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b-2 border-slate-800">
                  <span className="font-black text-xs text-slate-900 uppercase">
                    Console • Live Bill Summary
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Table {activeTable.number}
                  </span>
                </div>

                <div className="border-2 border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 bg-slate-50 shadow-xs">
                  <strong className="text-xs font-black text-slate-900">
                    Bill Summary for Table {activeTable.number}
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
                    <span>Net Amount Payable:</span>
                    <span>₹ {runningTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-3 flex flex-col gap-1 text-[11px] bg-white">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Customer Payment Preference
                  </span>
                  <div className="text-slate-700">• Customer Preference: Cash or UPI QR</div>
                  <div className="text-slate-700">
                    • Loyalty Membership: Silver Tier (50 pts available)
                  </div>
                </div>

                {/* Quick actions for console */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen(8)}
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Receipt className="h-4 w-4" />
                    <span>Print 80mm Bill / WhatsApp ➔</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPane('payment')}
                    className="w-full py-2.5 border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Open Payment Settlement Panel</span>
                  </button>
                </div>
              </div>
            )}

            {rightPane === 'payment' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2">
                  <span className="font-black text-xs text-slate-950">
                    Payment Settlement • Table {activeTable.number}
                  </span>
                  <button
                    onClick={() => setRightPane('default')}
                    className="border border-slate-400 rounded-md p-1 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 flex flex-col gap-2.5 bg-slate-50">
                  <strong className="text-xs font-black text-slate-900">
                    Choose Settlement Method:
                  </strong>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI QR', 'CARD POS', 'CASH'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method)}
                        className={`py-2 px-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                          selectedPaymentMethod === method
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-black text-slate-900">
                    <span>Payable Amount:</span>
                    <span>₹ {runningTotal.toFixed(2)}</span>
                  </div>
                </div>

                {paymentConfirmed && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-400 rounded-lg text-emerald-800 text-xs font-bold text-center">
                    ✓ Payment Recorded &amp; Table Moved to Billing!
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleQuickPayment}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Record Quick {selectedPaymentMethod} Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(7)}
                  className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Open Full Payment Processing (Screen 7) ➔</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(6)}
                  className="w-full py-2.5 border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Open Advanced Split Bill Options (Screen 6) ➔
                </button>
              </div>
            )}

            {rightPane === 'merge' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2">
                  <span className="font-black text-xs text-slate-950">
                    Merge Tables Controller • Table {activeTable.number}
                  </span>
                  <button
                    onClick={() => setRightPane('default')}
                    className="border border-slate-400 rounded-md p-1 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 flex flex-col gap-2.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-600">
                    Select Table to Merge with {activeTable.number}:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {candidateMergeTables.slice(0, 4).map((tbl) => (
                      <button
                        key={tbl.number}
                        onClick={() => setSelectedMergeChip(tbl.number)}
                        className={`py-2 px-1 border rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          selectedMergeChip === tbl.number
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {tbl.number}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 flex flex-col gap-1.5 text-[11px] bg-white">
                  <strong className="text-xs font-black text-slate-900 mb-1">
                    Merged Table Result Preview:
                  </strong>
                  <div className="text-slate-700">
                    Combined Table: <strong>{activeTable.number} + {selectedMergeChip}</strong>
                  </div>
                  <div className="text-slate-700">
                    Total Guest Capacity: <strong>{mergedTotalCapacity} Guests</strong>
                  </div>
                  <div className="text-slate-900 font-black">
                    Consolidated Running Bill: ₹ {mergedRunningBill.toFixed(2)}
                  </div>
                </div>

                {mergeConfirmed && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-400 rounded-lg text-emerald-800 text-xs font-bold text-center">
                    ✓ Tables Merged Successfully!
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirmMerge}
                  className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="h-4 w-4" />
                  <span>Confirm Merge &amp; Sync Bills</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(6)}
                  className="w-full py-2.5 border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold text-xs transition cursor-pointer"
                >
                  Open Table Merge / Split Customization (Screen 6) ➔
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};

