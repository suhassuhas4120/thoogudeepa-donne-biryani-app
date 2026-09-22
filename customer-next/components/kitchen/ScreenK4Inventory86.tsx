'use client';

import React, { useState } from 'react';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useSharedBridge } from '../../store/useSharedBridge';
import { useKitchenStore } from '../../store/useKitchenStore';
import { INITIAL_MENU_ITEMS } from '../../data/menuItems';
import { Sliders, Search, AlertTriangle, CheckCircle2, Clock, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

export const ScreenK4Inventory86: React.FC = () => {
  const { setCurrentScreen } = useKitchenStore();
  const { inventory86, kitchenToggle86, kitchenUpdatePrepDelay } = useSharedBridge();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  const categories = ['ALL', 'Donne Biryani', 'Starters & Kebabs', 'Sides & Desserts', 'Beverages'];

  const filteredItems = INITIAL_MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <KitchenTabletHousing screenNumber={4} screenTitle="86 / SOLD-OUT INVENTORY MASTER">
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-5 overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-white">LIVE 86 / AVAILABILITY ENGINE</h2>
              <p className="text-[11px] text-slate-400">
                Toggling SOLD OUT instantly disables dishes in Customer App & blocks Waiter POS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search dish or ingredient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 w-56"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 86 Master Table Grid */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredItems.map((item) => {
            const isSoldOut = inventory86.find((i) => i.id === item.id)?.is86 || false;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                  isSoldOut
                    ? 'bg-rose-950/20 border-rose-800/60'
                    : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isSoldOut ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.name}</span>
                      <span className="font-mono text-xs text-orange-400 font-extrabold">₹{item.price}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{item.category} • {item.prepMode}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Delay Adjustment */}
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-mono">
                    <Clock className="h-3.5 w-3.5 text-amber-400 ml-1.5" />
                    <button
                      onClick={() => kitchenUpdatePrepDelay(item.id, -5)}
                      className="px-2 py-0.5 hover:bg-slate-800 rounded text-slate-300 font-bold"
                    >
                      -5m
                    </button>
                    <span className="text-slate-400 px-1">Delay</span>
                    <button
                      onClick={() => kitchenUpdatePrepDelay(item.id, 5)}
                      className="px-2 py-0.5 hover:bg-slate-800 rounded text-slate-300 font-bold"
                    >
                      +5m
                    </button>
                  </div>

                  {/* 86 Toggle Button */}
                  <button
                    onClick={() => kitchenToggle86(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md ${
                      isSoldOut
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isSoldOut ? (
                      <>
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>86'D (SOLD OUT)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>AVAILABLE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <button
            onClick={() => setCurrentScreen(3)}
            className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Table Detail (3)</span>
          </button>
          <button
            onClick={() => setCurrentScreen(5)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
          >
            <span>Next: Standard Operating Procedures (5)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
