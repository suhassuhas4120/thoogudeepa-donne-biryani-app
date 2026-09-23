'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge, SharedTable, SharedPing, SharedKDSTicket } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import {
  Bell,
  CheckCircle2,
  Clock,
  UtensilsCrossed,
  AlertTriangle,
  ChefHat,
  Sparkles,
  Plus,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TabletScreen2TablesFeed: React.FC = () => {
  const { selectTable, setCurrentScreen, activeCaptain, activeSection, setActiveSection } =
    useWaiterStore();
  const {
    tables,
    pings,
    kdsTickets,
    waiterResolvePing,
    waiterMarkKitchenItemServed,
  } = useSharedBridge();

  const kitchenReadyItems = kdsTickets.filter((tk) => tk.status === 'READY');

  const [selectedSection, setSelectedSection] = useState<string>(
    activeSection && activeSection !== 'ALL' && activeSection !== 'ALL SECTIONS'
      ? activeSection.includes('TERRACE')
        ? 'TERRACE'
        : activeSection.includes('FAMILY')
        ? 'FAMILY DINING'
        : activeSection.includes('B') && !activeSection.includes('A')
        ? 'SECTION B'
        : activeSection.includes('A') && !activeSection.includes('B')
        ? 'SECTION A'
        : 'ALL SECTIONS'
      : 'ALL SECTIONS'
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const sections = ['ALL SECTIONS', 'SECTION A', 'SECTION B', 'TERRACE', 'FAMILY DINING'];

  const occupiedCount = tables.filter((t) => t.status === 'OCCUPIED').length;
  const vacantCount = tables.filter((t) => t.status === 'VACANT').length;
  const billingCount = tables.filter((t) => t.status === 'BILLING').length;
  const activeOrdersCount = tables.filter(
    (t) => t.status === 'OCCUPIED' || t.status === 'BILLING'
  ).length;
  const totalGuests = tables.reduce((acc, t) => acc + (t.guestCount || 0), 0);

  const filteredTables = tables.filter((table: SharedTable) => {
    if (selectedSection === 'ALL SECTIONS' || selectedSection === 'ALL') return true;
    if (selectedSection === 'SECTION A') return table.section === 'SECTION A';
    if (selectedSection === 'SECTION B') return table.section === 'SECTION B';
    if (selectedSection === 'TERRACE') return table.section.includes('TERRACE');
    if (selectedSection === 'FAMILY DINING') return table.section.includes('FAMILY');
    return table.section === selectedSection;
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

  const handleServedClick = (e: React.MouseEvent, tableNumber: string) => {
    e.stopPropagation();
    const readyTicket = kitchenReadyItems.find((tk) => tk.tableNumber === tableNumber);
    if (readyTicket) {
      waiterMarkKitchenItemServed(readyTicket.id, readyTicket.items[0]?.id ?? '');
    }
    showToast(`✓ Dishes marked served for Table ${tableNumber}`);
  };

  const handleResolvePing = (pingId: string, tableNumber: string) => {
    waiterResolvePing(pingId);
    showToast(`✓ Customer call resolved for Table ${tableNumber}`);
  };

  const handleServeItem = (ticketId: string, itemId: string, tableNumber: string) => {
    waiterMarkKitchenItemServed(ticketId, itemId);
    showToast(`✓ Order served to Table ${tableNumber}`);
  };

  const getCardStatusBorder = (status: string) => {
    switch (status) {
      case 'OCCUPIED':
        return 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500/20';
      case 'BILLING':
        return 'border-purple-500 bg-purple-50/20 ring-1 ring-purple-500/20';
      case 'CLEANING':
        return 'border-amber-500 bg-amber-50/20 ring-1 ring-amber-500/20';
      case 'VACANT':
        return 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/20';
      default:
        return 'border-slate-300 bg-white';
    }
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

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={2}
      screenTitle="ALL TABLES MATRIX &amp; DUAL LIVE NOTIFICATIONS"
    >
      <div className="flex flex-col flex-1 min-h-[700px] relative">
        {/* Floating In-App Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-3 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-mono font-bold shadow-2xl border border-slate-700 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP FLOOR METRICS HEADER */}
        <div className="border-b-2 border-slate-800 bg-white px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none">
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
            <span className="font-extrabold text-slate-950 uppercase tracking-wider">
              [FLOOR METRICS]:
            </span>
            <span className="border border-slate-300 bg-slate-50 px-2.5 py-1 rounded font-bold text-slate-700">
              TOTAL: {tables.length}
            </span>
            <span className="border border-orange-500 bg-orange-50 text-orange-800 px-2.5 py-1 rounded font-black">
              FILLED: {occupiedCount}
            </span>
            <span className="border border-emerald-500 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded font-black">
              EMPTY: {vacantCount}
            </span>
            <span className="border border-purple-500 bg-purple-50 text-purple-800 px-2.5 py-1 rounded font-black">
              BILLING: {billingCount}
            </span>
            <span className="border border-slate-800 bg-slate-900 px-2.5 py-1 rounded font-bold text-white">
              ACTIVE ORDERS: {activeOrdersCount}
            </span>
            <span className="border border-slate-300 bg-slate-50 px-2.5 py-1 rounded font-bold text-slate-700">
              GUESTS: {totalGuests}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="border-2 border-orange-500 bg-orange-50 px-3 py-1 rounded-lg font-black text-orange-950 shadow-2xs">
              👤 {activeCaptain || 'Captain Ramesh'}
            </span>
            <button
              type="button"
              onClick={() => setCurrentScreen(10)}
              className="border border-slate-800 bg-slate-900 hover:bg-black text-white px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <span>📊 [SHIFT STATS]</span>
            </button>
          </div>
        </div>

        {/* SECTION FILTER TABS BAR */}
        <div className="border-b border-slate-200 bg-stone-50 px-5 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-mono text-xs font-black text-slate-500 mr-1 uppercase flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-orange-600" />
              <span>ZONE:</span>
            </span>
            {sections.map((sec) => {
              const isSelected = selectedSection === sec;
              const count =
                sec === 'ALL SECTIONS'
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
                    if (sec !== 'ALL SECTIONS') setActiveSection(sec);
                  }}
                  className={`py-1 px-3 rounded-lg border font-mono text-xs font-black transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-600 text-white shadow-2xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{sec}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-orange-800 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-xs font-bold text-slate-500">
            Showing {filteredTables.length} tables
          </span>
        </div>

        {/* MAIN SPLIT: LEFT 60% (TABLES MATRIX) / RIGHT 40% (DUAL NOTIFS) */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT 60%: ALL TABLES MATRIX */}
          <div className="w-[60%] border-r-2 border-slate-800 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-300 pb-2 shrink-0 font-mono">
              <span className="font-black text-xs text-slate-950 uppercase flex items-center gap-1.5">
                <span>🍽</span>
                <span>FLOOR TABLES MATRIX — {selectedSection}</span>
              </span>
              <span className="text-[10.5px] font-bold text-slate-500">
                [TAP CARD = TABLE HUB • [+ ORDER] = TAKE ORDER]
              </span>
            </div>

            {/* 3-Column Tables Grid */}
            <div className="grid grid-cols-3 gap-3">
              {filteredTables.map((table: SharedTable) => {
                const isOccupied = table.status === 'OCCUPIED';
                const hasReadyDish = kitchenReadyItems.some((k) => k.tableNumber === table.number);

                return (
                  <div
                    key={table.id}
                    onClick={() => handleTableClick(table.number)}
                    className={`bg-white border-2 rounded-xl p-3.5 flex flex-col gap-2.5 cursor-pointer transition shadow-xs hover:border-black hover:-translate-y-0.5 ${getCardStatusBorder(
                      table.status
                    )}`}
                  >
                    {/* Card Top Row */}
                    <div className="flex justify-between items-center border-b border-dashed border-slate-300 pb-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm font-black text-slate-950">
                          [{table.number}]
                        </strong>
                        {table.number === 'A-04' && (
                          <span className="text-amber-500 text-xs font-black">★</span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${getStatusBadge(
                          table.status
                        )}`}
                      >
                        {isOccupied ? `⏱ ${table.seatedTime}` : table.status}
                      </span>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="text-[11px] font-mono flex flex-col gap-1 text-slate-700 min-h-[48px]">
                      {table.activeItems && table.activeItems.length > 0 ? (
                        table.activeItems.slice(0, 2).map((item: any, idx: number) => (
                          <div key={idx} className="truncate flex justify-between">
                            <span className="truncate">
                              • {item.quantity}x {item.name}
                            </span>
                            <span className="text-[9.5px] font-bold text-slate-500 ml-1 shrink-0">
                              [{item.status}]
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[10.5px]">
                          Cap: {table.capacity} • {table.status === 'VACANT' ? 'Ready for Seating' : 'Cleaning in Progress'}
                        </span>
                      )}
                    </div>

                    {/* Bill & Status Tag */}
                    <div className="flex justify-between items-center font-mono text-[10.5px] pt-1 border-t border-slate-100">
                      <span className="font-bold text-slate-500">
                        {isOccupied ? `KOT #${table.kotCount}` : `Cap: ${table.capacity}`}
                      </span>
                      <span className="font-black text-slate-900">
                        {table.currentBill > 0 ? `₹ ${table.currentBill}` : '₹ 0'}
                      </span>
                    </div>

                    {/* Card Bottom Buttons */}
                    <div className="flex gap-1.5 mt-auto pt-1 font-mono">
                      <button
                        type="button"
                        onClick={(e) => handleTakeOrder(e, table.number)}
                        className="flex-1 py-1.5 px-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-black transition flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                      >
                        <Plus className="h-3 w-3 stroke-[3]" />
                        <span>[ORDER]</span>
                      </button>

                      {hasReadyDish ? (
                        <button
                          type="button"
                          onClick={(e) => handleServedClick(e, table.number)}
                          className="flex-1 py-1.5 px-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 shadow-2xs active:scale-95"
                        >
                          ✓ [SERVED]
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleVacateClick(e, table.number)}
                          className="flex-1 py-1.5 px-1 border border-slate-300 hover:bg-stone-100 text-slate-700 rounded-lg text-[10px] font-bold transition flex items-center justify-center"
                        >
                          {table.status === 'BILLING' ? '[PAY/VAC]' : '[VACATE]'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 40%: DUAL NOTIFICATION SECTION */}
          <div className="w-[40%] bg-white flex flex-col select-none">
            {/* TOP RIGHT: CUSTOMER NOTIFICATIONS (50%) */}
            <div className="flex-1 border-b-2 border-slate-800 p-4 overflow-y-auto flex flex-col gap-2.5">
              <div className="flex justify-between items-center border-b border-slate-300 pb-2 shrink-0 font-mono">
                <span className="font-black text-xs text-slate-950 flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-orange-600" />
                  <span>CUSTOMER ASSISTANCE REQUESTS</span>
                </span>
                <span className="text-[10px] font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {pings.length} PENDING
                </span>
              </div>

              {pings.length > 0 ? (
                pings.map((ping: SharedPing) => (
                  <div
                    key={ping.id}
                    className="border-2 border-orange-200 bg-orange-50/70 rounded-xl p-3 flex justify-between items-center gap-3 font-mono shadow-2xs"
                  >
                    <div>
                      <strong className="text-xs font-black text-slate-900 block">
                        [{ping.tableNumber}: REQUESTED {ping.type}]
                      </strong>
                      <span className="text-[10px] text-slate-500 font-bold">
                        ⏱ {ping.timestamp} • {ping.guestName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleResolvePing(ping.id, ping.tableNumber)}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition shadow-2xs shrink-0 active:scale-95"
                    >
                      [RESOLVE]
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <Sparkles className="h-8 w-8 text-emerald-500 mb-2" />
                  <div className="font-mono text-xs font-bold text-slate-800">All Tables Attended</div>
                  <div className="font-mono text-[10.5px] text-slate-400 mt-0.5">
                    No pending customer assistance calls
                  </div>
                </div>
              )}
            </div>

            {/* BOTTOM RIGHT: KITCHEN NOTIFICATIONS (50%) */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2.5">
              <div className="flex justify-between items-center border-b border-slate-300 pb-2 shrink-0 font-mono">
                <span className="font-black text-xs text-slate-950 flex items-center gap-1.5">
                  <ChefHat className="h-4 w-4 text-emerald-600" />
                  <span>KITCHEN PASS DISPATCH</span>
                </span>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {kitchenReadyItems.length} READY
                </span>
              </div>

              {kitchenReadyItems.length > 0 ? (
                kitchenReadyItems.map((item: SharedKDSTicket) => {
                  const totalQty = item.items.reduce((s: number, it: any) => s + it.quantity, 0);
                  const dishTitle = item.items.map((it: any) => it.name).join(', ');
                  return (
                    <div
                      key={item.id}
                      className="border-2 border-emerald-200 bg-emerald-50/70 rounded-xl p-3 flex justify-between items-center gap-3 font-mono shadow-2xs"
                    >
                      <div>
                        <strong className="text-xs font-black text-slate-900 block">
                          [{item.tableNumber}: {totalQty}x {dishTitle} READY]
                        </strong>
                        <span className="text-[10px] text-slate-500 font-bold">
                          ⏱ {item.timestamp} • Chef Pass Window
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleServeItem(item.id, item.items[0]?.id ?? '', item.tableNumber)
                        }
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition shadow-2xs shrink-0 active:scale-95"
                      >
                        [SERVED]
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <ChefHat className="h-8 w-8 text-slate-400 mb-2" />
                  <div className="font-mono text-xs font-bold text-slate-800">Pass Window Clear</div>
                  <div className="font-mono text-[10.5px] text-slate-400 mt-0.5">
                    All ready dishes have been picked up &amp; served
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
