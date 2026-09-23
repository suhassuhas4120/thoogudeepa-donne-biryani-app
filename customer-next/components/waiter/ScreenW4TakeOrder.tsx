'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../store/useWaiterStore';
import { useSharedBridge } from '../../store/useSharedBridge';
import { WaiterTabletHousing } from './WaiterTabletHousing';
import { INITIAL_MENU_ITEMS } from '../../data/menuItems';
import { MenuItem } from '../../types/customer';
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Ban,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ScreenW4TakeOrder: React.FC = () => {
  const {
    setCurrentScreen,
    selectedTableNumber,
    orderCart,
    addToOrderCart,
    updateOrderCartQty,
  } = useWaiterStore();

  const { inventory86 } = useSharedBridge();

  const [selectedCat, setSelectedCat] = useState('ALL');
  const [query, setQuery] = useState('');

  const categories = ['ALL', 'Rice & Bowls', 'Starters', 'Desserts'];

  const filtered = INITIAL_MENU_ITEMS.filter((i) => {
    const matchCat = selectedCat === 'ALL' || i.category === selectedCat;
    const matchQ = i.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const cartCount = orderCart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = orderCart.reduce((s, i) => s + i.totalPrice, 0);

  return (
    <WaiterTabletHousing screenNumber={4} screenTitle="TAKE ORDER MENU (FAST POS)">
      <div className="flex-1 flex flex-col p-3 space-y-2.5 overflow-hidden font-mono">
        {/* Top Header & Table Info */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentScreen(3)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>Table {selectedTableNumber || 'A-01'}</span>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-bold border border-orange-200">
                  Active KOT
                </span>
              </div>
            </div>
          </div>

          {cartCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen(5)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-600 text-white font-mono text-xs font-black shadow-md shadow-orange-600/20"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Cart ({cartCount}) • ₹ {cartTotal}</span>
            </motion.button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search donne biryani, starters..."
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black whitespace-nowrap transition border ${
                selectedCat === c
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Food Items 2-Col Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pb-1">
          {filtered.map((item) => {
            const item86 = inventory86.find((i) => i.id === item.id);
            const isSoldOut = !!item86?.is86;
            const cartItems = orderCart.filter((ci) => ci.menuItem.id === item.id);
            const totalQty = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-2.5 flex flex-col justify-between shadow-2xs transition ${
                  isSoldOut
                    ? 'bg-stone-50 border-rose-200 opacity-60'
                    : totalQty > 0
                    ? 'bg-orange-50/40 border-orange-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-xs font-black text-slate-900 line-clamp-1">
                      {item.name}
                    </span>
                    {isSoldOut ? (
                      <span className="text-[8px] font-black bg-rose-600 text-white px-1 py-0.2 rounded shrink-0">
                        86 SOLD
                      </span>
                    ) : item.badge ? (
                      <span className="text-[8px] font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded border border-amber-200 shrink-0">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs font-black text-orange-600 mt-0.5">
                    ₹ {item.price}
                  </div>
                </div>

                <div className="mt-2.5 flex gap-1">
                  {isSoldOut ? (
                    <div className="w-full py-1.5 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 bg-stone-200 text-slate-400 border border-slate-300 cursor-not-allowed">
                      <Ban className="h-3 w-3" />
                      <span>Sold Out</span>
                    </div>
                  ) : totalQty > 0 ? (
                    <div className="w-full flex items-center gap-1">
                      <div className="flex-1 flex items-center justify-between bg-orange-600 text-white rounded-xl px-1.5 py-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            if (cartItems[0]) {
                              updateOrderCartQty(cartItems[0].cartItemId, -1);
                            }
                          }}
                          className="p-1 hover:bg-orange-700 rounded-lg transition active:scale-90"
                        >
                          <Minus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                        <span className="text-xs font-black">{totalQty}</span>
                        <button
                          type="button"
                          onClick={() => addToOrderCart(item)}
                          className="p-1 hover:bg-orange-700 rounded-lg transition active:scale-90"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCurrentScreen(5);
                        }}
                        className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-[10px] font-bold border border-slate-200"
                        title="Customize"
                      >
                        <SlidersHorizontal className="h-3 w-3 text-slate-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex gap-1">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => addToOrderCart(item)}
                        className="flex-1 py-1.5 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1 bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100 transition shadow-2xs"
                      >
                        <Plus className="h-3 w-3 stroke-[2.5]" />
                        <span>Add</span>
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => {
                          addToOrderCart(item);
                          setCurrentScreen(5);
                        }}
                        className="px-2 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-600 text-[10px] font-bold border border-slate-200"
                        title="Customize item"
                      >
                        Opt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Bottom CTA */}
        {cartCount > 0 && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen(5)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-orange-600 text-white font-mono text-xs font-black shadow-lg shadow-orange-600/25 shrink-0"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Review Order &amp; Fire KOT ({cartCount} Items)</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-black">
              <span>₹ {cartTotal}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </motion.button>
        )}
      </div>
    </WaiterTabletHousing>
  );
};
