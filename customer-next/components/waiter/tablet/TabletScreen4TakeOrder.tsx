'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import { INITIAL_MENU_ITEMS } from '../../../data/menuItems';
import { ArrowLeft, ShoppingBag, Search, Plus, Check, Ban } from 'lucide-react';

export const TabletScreen4TakeOrder: React.FC = () => {
  const {
    selectedTableNumber,
    setCurrentScreen,
    orderCart,
    addToOrderCart,
  } = useWaiterStore();

  const { inventory86 } = useSharedBridge();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = ['ALL', 'BIRYANI', 'STARTERS', 'GRAVY & SIDES', 'BEVERAGES'];

  const filteredItems = INITIAL_MENU_ITEMS.filter((item) => {
    const matchCat =
      selectedCat === 'ALL' ||
      item.category.toUpperCase().includes(selectedCat) ||
      (selectedCat === 'BIRYANI' && item.name.toLowerCase().includes('biryani'));
    const matchSearch =
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotal = orderCart.reduce((sum, i) => sum + i.totalPrice, 0);
  const cartItemCount = orderCart.reduce((sum, i) => sum + i.quantity, 0);

  const handleAdd = (item: any) => {
    addToOrderCart(item);
    setAddedItemNotice(item.name);
    setTimeout(() => setAddedItemNotice(null), 1500);
  };

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={4}
      screenTitle="POS TOUCH MENU ORDERING (2-COLUMN GRID)"
    >
      <div className="flex flex-col flex-1 min-h-[700px] p-5 font-mono select-none">
        {/* TOP HEADER */}
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen(3)}
              className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 text-xs shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>[⬅ BACK TO {selectedTableNumber || 'TABLE'}]</span>
            </button>
            <h3 className="font-black text-slate-950 text-sm">
              [SCREEN 4: MENU PAGE — ORDER TAKING FOR {selectedTableNumber || 'TABLE A-04'}]
            </h3>
          </div>

          <button
            onClick={() => setCurrentScreen(5)}
            className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-black text-xs transition flex items-center gap-2 shadow-xs"
          >
            <ShoppingBag className="h-4 w-4 text-orange-400" />
            <span>🛒 [VIEW CART / ITEM CUSTOMIZATION (SCREEN 5) ➔]</span>
            {cartItemCount > 0 && (
              <span className="bg-orange-500 text-white rounded-full px-1.5 py-0.2 text-[10px]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* CATEGORIES & SEARCH & FILTERS */}
        <div className="flex gap-2 flex-wrap items-center mb-3 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                selectedCat === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              [{cat === 'ALL' ? 'ALL CATEGORIES' : cat}]
            </button>
          ))}

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="[SEARCH MENU DISHES...]"
              className="w-full pl-9 pr-3 py-1.5 border border-slate-400 rounded-lg text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Add Notice Toast */}
        {addedItemNotice && (
          <div className="mb-2 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 shrink-0">
            <Check className="h-3.5 w-3.5" />
            <span>✓ ADDED: {addedItemNotice} (KOT CART UPDATED)</span>
          </div>
        )}

        {/* DOUBLE-COLUMN ITEMS GRID */}
        <div className="grid grid-cols-2 gap-3.5 flex-1 overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const item86 = inventory86.find((i) => i.id === item.id);
            const isSoldOut = !!item86?.is86;

            return (
              <div
                key={item.id}
                className={`border-2 rounded-xl p-3.5 flex flex-col justify-between gap-2 shadow-2xs transition ${
                  isSoldOut
                    ? 'bg-stone-50 border-rose-200 opacity-60'
                    : 'bg-white border-slate-300 hover:border-slate-800'
                }`}
              >
                <div className="relative w-full h-24 border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg flex items-center justify-center gap-2 text-slate-600">
                  <span className="text-2xl">{isSoldOut ? '🚫' : '🍛'}</span>
                  <span className="font-mono text-xs font-bold">[{item.category.toUpperCase()}]</span>
                  {isSoldOut && (
                    <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                      86 SOLD OUT
                    </span>
                  )}
                </div>

                <div>
                  <strong className="text-sm font-black text-slate-950 block">
                    [{item.name}]
                  </strong>
                  <span className="text-[11px] font-bold text-slate-500">
                    [{item.category}] • [PRICE: ₹ {item.price.toFixed(2)}]
                  </span>
                  <p className="text-[10.5px] text-slate-600 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => !isSoldOut && handleAdd(item)}
                  className={`w-full py-2 rounded-lg font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs mt-1 ${
                    isSoldOut
                      ? 'bg-stone-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {isSoldOut ? <Ban className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>{isSoldOut ? '[SOLD OUT IN KITCHEN]' : `[+ ADD ${item.name.toUpperCase()}]`}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ORDER SUMMARY BAR */}
        <div className="mt-3 border-2 border-slate-800 bg-slate-100 rounded-xl px-5 py-3 flex justify-between items-center shrink-0 shadow-xs">
          <div>
            <strong className="text-xs font-black text-slate-950">
              [CURRENT SELECTION: {cartItemCount} ITEMS ADDED]
            </strong>
            <span className="text-xs font-bold text-slate-600 ml-3">
              [ESTIMATED SUBTOTAL: ₹ {cartTotal > 0 ? cartTotal.toFixed(2) : '840.00'}]
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCurrentScreen(5)}
            className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-black text-xs transition shadow-2xs"
          >
            [CONFIRM ORDER &amp; CUSTOMIZE ITEMS ➔]
          </button>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
