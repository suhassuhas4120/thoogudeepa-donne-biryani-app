'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../store/useWaiterStore';
import { useSharedBridge } from '../../store/useSharedBridge';
import { WaiterTabletHousing } from './WaiterTabletHousing';
import { useWaiterQuery } from '../../hooks/useWaiterQuery';
import {
  Users,
  Bell,
  Clock,
  ArrowRight,
  Flame,
  CheckCircle2,
  Check,
  AlertCircle,
  Plus,
  Utensils,
  ChefHat,
  Sparkles,
  Layers,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScreenW2TablesFeed: React.FC = () => {
  const { setCurrentScreen, selectTable, activeSection, setActiveSection, activeCaptain } = useWaiterStore();

  const {
    tables,
    pings,
    kdsTickets,
    waiterResolvePing,
    waiterMarkKitchenItemServed,
  } = useSharedBridge();

  const kitchenReadyItems = kdsTickets.filter((tk) => tk.status === 'READY');
  const { isFetching: isFloorSyncing } = useWaiterQuery();

  const [activeTab, setActiveTab] = useState<'PINGS' | 'KITCHEN_READY'>('PINGS');
  const [selectedSection, setSelectedSection] = useState<string>(
    activeSection && activeSection !== 'ALL' ? activeSection : 'ALL'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const sections = ['ALL', 'SECTION A', 'SECTION B', 'TERRACE', 'FAMILY DINING'];

  // Dynamic Metrics
  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const vacantCount = tables.filter((t) => t.status === 'VACANT').length;
  const billingCount = tables.filter((t) => t.status === 'BILLING').length;

  const filteredTables = tables.filter((t) => {
    if (selectedSection === 'ALL') return true;
    if (selectedSection === 'SECTION A') return t.section === 'SECTION A';
    if (selectedSection === 'SECTION B') return t.section === 'SECTION B';
    if (selectedSection === 'TERRACE') return t.section.includes('TERRACE');
    if (selectedSection === 'FAMILY DINING') return t.section.includes('FAMILY');
    return t.section === selectedSection;
  });

  const handleTableClick = (tableNumber: string) => {
    selectTable(tableNumber);
    setCurrentScreen(3);
  };

  const handleTakeOrder = (e: React.MouseEvent, tableNumber: string) => {
    e.stopPropagation();
    selectTable(tableNumber);
    setCurrentScreen(4);
  };

  const handleVacateClick = (e: React.MouseEvent, tableNumber: string) => {
    e.stopPropagation();
    selectTable(tableNumber);
    setCurrentScreen(9);
  };

  const handleResolvePing = (pingId: string, tableNumber: string) => {
    waiterResolvePing(pingId);
    showToast(`✓ Ping resolved for Table ${tableNumber}`);
  };

  const handleServeItem = (ticketId: string, itemId: string, tableNumber: string) => {
    waiterMarkKitchenItemServed(ticketId, itemId);
    showToast(`✓ Dishes marked served to Table ${tableNumber}`);
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

  const getCardBorder = (status: string) => {
    switch (status) {
      case 'OCCUPIED':
        return 'border-orange-300 bg-orange-50/40 hover:border-orange-500';
      case 'BILLING':
        return 'border-purple-300 bg-purple-50/40 hover:border-purple-500';
      case 'CLEANING':
        return 'border-amber-300 bg-amber-50/40 hover:border-amber-500';
      case 'VACANT':
        return 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-500';
      default:
        return 'border-slate-200 bg-white hover:border-slate-400';
    }
  };

  return (
    <WaiterTabletHousing screenNumber={2} screenTitle="ALL TABLES &amp; LIVE FEEDS">
      <div className="flex-1 flex flex-col p-3 space-y-2.5 overflow-hidden relative">
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

        {/* 1. Floor Quick Metrics Strip */}
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-2xs flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none shrink-0 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">
              {activeCaptain || 'Captain'}
            </span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200 shrink-0" />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {vacantCount} VACANT
            </span>
            <span className="px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold border border-orange-200">
              {occupiedCount} OCCUPIED
            </span>
            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
              {billingCount} BILLING
            </span>
          </div>
        </div>

        {/* 2. Interactive Floor Zone Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none shrink-0">
          {sections.map((sec) => {
            const isSelected = selectedSection === sec;
            const count =
              sec === 'ALL'
                ? tables.length
                : tables.filter((t) =>
                    sec === 'TERRACE'
                      ? t.section.includes('TERRACE')
                      : sec === 'FAMILY DINING'
                      ? t.section.includes('FAMILY')
                      : t.section === sec
                  ).length;

            return (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  setSelectedSection(sec);
                  if (sec !== 'ALL') setActiveSection(sec);
                }}
                className={`py-1 px-2.5 rounded-lg border text-[10px] font-mono font-black whitespace-nowrap transition flex items-center gap-1 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-600 text-white shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-stone-50'
                }`}
              >
                <span>{sec}</span>
                <span
                  className={`text-[9px] rounded-full px-1.5 py-0.2 ${
                    isSelected ? 'bg-orange-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. Floor Tables Grid (Top 55%) */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xs flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Layers className="h-3 w-3 text-orange-600" />
              <span>
                {selectedSection} TABLES ({filteredTables.length})
              </span>
            </span>
            <span className="text-[9px] font-mono font-bold text-slate-400">
              Tap card for details • Quick Order
            </span>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto pr-0.5">
            {filteredTables.map((t) => {
              return (
                <motion.div
                  key={t.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTableClick(t.number)}
                  className={`rounded-xl border-2 p-2.5 flex flex-col justify-between cursor-pointer transition shadow-2xs ${getCardBorder(
                    t.status
                  )}`}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between font-mono">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-black text-slate-950">Table {t.number}</span>
                        {t.number === 'A-04' && (
                          <span className="text-amber-500 text-xs font-black">★</span>
                        )}
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold border ${getStatusBadge(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </div>

                    {/* Active Items Preview */}
                    <div className="text-[10px] font-mono text-slate-600 mt-1 line-clamp-1">
                      {t.activeItems && t.activeItems.length > 0 ? (
                        <span>
                          {t.activeItems[0].quantity}x {t.activeItems[0].name}
                        </span>
                      ) : t.status === 'VACANT' ? (
                        <span className="text-slate-400 italic">Cap: {t.capacity} • Empty</span>
                      ) : (
                        <span className="text-slate-400 italic">Seated: {t.seatedTime}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Bill in single line */}
                  <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between font-mono">
                    <span className="text-xs font-black text-slate-900">
                      {t.currentBill > 0 ? `₹${t.currentBill}` : '₹0'}
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-500">
                      {t.status === 'OCCUPIED' ? `KOT #${t.kotCount}` : `Cap: ${t.capacity}`}
                    </span>
                  </div>

                  {/* Actions Row: Order & Vacate */}
                  <div className="flex items-center gap-1.5 mt-1.5 font-mono">
                    <button
                      type="button"
                      onClick={(e) => handleTakeOrder(e, t.number)}
                      className="flex-1 py-1.5 px-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[9.5px] font-bold transition flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                    >
                      <Plus className="h-3 w-3 stroke-[2.5]" />
                      <span>Order</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleVacateClick(e, t.number)}
                      className="flex-1 py-1.5 px-1 border border-slate-300 hover:bg-stone-100 text-slate-700 rounded-lg text-[9.5px] font-bold transition flex items-center justify-center gap-1 active:scale-95"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>{t.status === 'BILLING' ? 'Bill / Vac' : 'Vacate'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. Live Dual Feed (Bottom 45%) */}
        <div className="h-[210px] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xs flex flex-col shrink-0 overflow-hidden">
          {/* Feed Tabs */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('PINGS')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-black transition flex items-center gap-1.5 ${
                  activeTab === 'PINGS'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                <Bell className="h-3 w-3" />
                <span>CUSTOMER CALLS</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'PINGS' ? 'bg-orange-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {pings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('KITCHEN_READY')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-black transition flex items-center gap-1.5 ${
                  activeTab === 'KITCHEN_READY'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                <ChefHat className="h-3 w-3" />
                <span>KITCHEN READY</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'KITCHEN_READY' ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {kitchenReadyItems.length}
                </span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto pt-1.5 space-y-1.5 pr-0.5">
            {activeTab === 'PINGS' ? (
              pings.length > 0 ? (
                pings.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-orange-50/80 border border-orange-200 text-xs shadow-2xs"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="font-mono font-black text-slate-900 text-[11px] truncate">
                        Table {p.tableNumber} • {p.type}
                      </div>
                      <div className="text-[9.5px] text-slate-500 font-mono">
                        {p.guestName} • {p.timestamp}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleResolvePing(p.id, p.tableNumber)}
                      className="rounded-lg bg-orange-600 text-white px-2.5 py-1 text-[10px] font-mono font-bold hover:bg-orange-700 active:scale-95 transition shadow-2xs shrink-0 flex items-center gap-1"
                    >
                      <Check className="h-3 w-3 stroke-[2.5]" />
                      <span>Resolve</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-4 text-center">
                  <Sparkles className="h-6 w-6 text-emerald-500 mb-1" />
                  <div className="font-mono text-xs font-bold text-slate-700">All Tables Attended</div>
                  <div className="font-mono text-[9.5px] text-slate-400">
                    No pending customer assistance calls
                  </div>
                </div>
              )
            ) : kitchenReadyItems.length > 0 ? (
              kitchenReadyItems.map((kr) => {
                const totalQty = kr.items.reduce((s, i) => s + i.quantity, 0);
                const dishTitle = kr.items.map((i) => i.name).join(', ');

                return (
                  <div
                    key={kr.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs shadow-2xs"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <div className="font-mono font-black text-slate-900 text-[11px] truncate">
                        Table {kr.tableNumber} • {totalQty}x {dishTitle}
                      </div>
                      <div className="text-[9.5px] text-slate-500 font-mono">
                        Pass ready at {kr.timestamp} • Chef Pick-up
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleServeItem(kr.id, kr.items[0]?.id ?? '', kr.tableNumber)
                      }
                      className="rounded-lg bg-emerald-700 text-white px-2.5 py-1 text-[10px] font-mono font-bold hover:bg-emerald-800 active:scale-95 transition shadow-2xs shrink-0 flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Served</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-4 text-center">
                <ChefHat className="h-6 w-6 text-slate-400 mb-1" />
                <div className="font-mono text-xs font-bold text-slate-700">Pass Window Clear</div>
                <div className="font-mono text-[9.5px] text-slate-400">
                  All ready dishes have been picked up &amp; served
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WaiterTabletHousing>
  );
};
