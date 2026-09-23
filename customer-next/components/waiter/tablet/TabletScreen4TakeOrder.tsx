'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import { INITIAL_MENU_ITEMS } from '../../../data/menuItems';
import { MenuItem } from '../../../types/customer';
import {
  ArrowLeft,
  ShoppingBag,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Ban,
  X,
  SlidersHorizontal,
  ArrowRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FSSAI Food Safety standard Veg / Non-Veg badge
const FoodTypeBadge: React.FC<{ isVeg: boolean }> = ({ isVeg }) => (
  <div
    className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center p-0.5 shrink-0 ${
      isVeg ? 'border-emerald-600 bg-emerald-50/60' : 'border-rose-700 bg-rose-50/60'
    }`}
    title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
  >
    <div
      className={`w-1.5 h-1.5 rounded-full ${
        isVeg ? 'bg-emerald-600' : 'bg-rose-700'
      }`}
    />
  </div>
);

const isVegItem = (item: MenuItem) => {
  const name = item.name.toLowerCase();
  return name.includes('paneer') || name.includes('payasam') || name.includes('veg');
};

export const TabletScreen4TakeOrder: React.FC = () => {
  const {
    selectedTableNumber,
    setCurrentScreen,
    orderCart,
    addToOrderCart,
    updateOrderCartQty,
    activeCaptain,
  } = useWaiterStore();

  const { inventory86 } = useSharedBridge();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const categories = ['ALL', 'Rice & Bowls', 'Starters', 'Desserts'];

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return INITIAL_MENU_ITEMS.length;
    return INITIAL_MENU_ITEMS.filter((i) => i.category === cat).length;
  };

  const filteredItems = INITIAL_MENU_ITEMS.filter((item) => {
    const matchCat =
      selectedCat === 'ALL' || item.category === selectedCat;
    const matchSearch =
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotal = orderCart.reduce((sum, i) => sum + i.totalPrice, 0);
  const cartItemCount = orderCart.reduce((sum, i) => sum + i.quantity, 0);

  const handleAdd = (item: MenuItem) => {
    addToOrderCart(item);
    setAddedItemNotice(item.name);
    setTimeout(() => setAddedItemNotice(null), 1800);
  };

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={4}
      screenTitle="POS TOUCH MENU ORDERING (2-COLUMN GRID)"
    >
      <div className="flex flex-col flex-1 min-h-[700px] p-5 font-mono select-none relative">
        {/* Added Item Toast Notification */}
        <AnimatePresence>
          {addedItemNotice && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Added {addedItemNotice} to KOT Cart</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP HEADER */}
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen(3)}
              className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 text-xs shadow-2xs active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Table {selectedTableNumber || 'A-01'}</span>
            </button>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-950 text-sm">
                Fast POS Menu — Table {selectedTableNumber || 'A-01'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                Captain: {activeCaptain || 'Floor Captain'}
              </span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentScreen(5)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-black text-xs transition flex items-center gap-2 shadow-md shadow-orange-600/20 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View KOT Cart ({cartItemCount}) • ₹ {cartTotal}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        {/* CATEGORIES & SEARCH & FILTERS */}
        <div className="flex gap-2.5 items-center mb-3 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition border flex items-center gap-1.5 ${
                  selectedCat === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCat === cat
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {getCategoryCount(cat)}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donne biryani, starters, desserts..."
              className="w-full pl-9 pr-8 py-2 border border-slate-300 rounded-xl text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* DOUBLE-COLUMN ITEMS GRID */}
        <div className="grid grid-cols-2 gap-3.5 flex-1 overflow-y-auto pr-1">
          {filteredItems.length === 0 ? (
            <div className="col-span-2 py-16 flex flex-col items-center justify-center text-center">
              <Search className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-black text-slate-800">
                No menu dishes found matching &quot;{search}&quot;
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for donne biryani, kebab, paneer, or payasam
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCat('ALL');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-2xs transition"
              >
                Clear Filter &amp; Show All
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const item86 = inventory86.find((i) => i.id === item.id);
              const isSoldOut = !!item86?.is86;
              const cartItems = orderCart.filter((ci) => ci.menuItem.id === item.id);
              const totalQty = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-2xs transition ${
                    isSoldOut
                      ? 'bg-stone-50 border-rose-200 opacity-60'
                      : totalQty > 0
                      ? 'bg-orange-50/40 border-orange-300'
                      : 'bg-white border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {/* Category, Prep Mode & Badges Header */}
                  <div className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FoodTypeBadge isVeg={isVegItem(item)} />
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 font-mono">
                        {item.category}
                      </span>
                      {item.prepMode && (
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-stone-200/70 text-slate-700 flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>{item.prepMode}</span>
                        </span>
                      )}
                    </div>

                    <div>
                      {isSoldOut ? (
                        <span className="bg-rose-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                          <Ban className="h-3 w-3" />
                          <span>86 SOLD OUT</span>
                        </span>
                      ) : item.badge ? (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9.5px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                          <Sparkles className="h-3 w-3 text-amber-600" />
                          <span>{item.badge}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-sm font-black text-slate-950 leading-snug">
                        {item.name}
                      </strong>
                      <span className="text-sm font-black text-orange-600 font-mono shrink-0">
                        ₹ {item.price}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-1">
                    {isSoldOut ? (
                      <div className="w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-stone-200 text-slate-400 border border-slate-300 cursor-not-allowed">
                        <Ban className="h-3.5 w-3.5" />
                        <span>Kitchen 86 — Sold Out</span>
                      </div>
                    ) : totalQty > 0 ? (
                      <div className="w-full flex items-center gap-1.5">
                        <div className="flex-1 flex items-center justify-between bg-orange-600 text-white rounded-xl px-2.5 py-1.5 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => {
                              if (cartItems[0]) {
                                updateOrderCartQty(cartItems[0].cartItemId, -1);
                              }
                            }}
                            className="p-1 hover:bg-orange-700 rounded-lg transition active:scale-90"
                          >
                            <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                          <span className="text-xs font-black">{totalQty} in KOT</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (cartItems[0]) {
                                updateOrderCartQty(cartItems[0].cartItemId, 1);
                              } else {
                                addToOrderCart(item);
                              }
                            }}
                            className="p-1 hover:bg-orange-700 rounded-lg transition active:scale-90"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCurrentScreen(5)}
                          className="p-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl border border-slate-300 transition active:scale-95 shrink-0"
                          title="Customize Options &amp; Spice Level"
                        >
                          <SlidersHorizontal className="h-4 w-4 text-slate-700" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-1.5">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={() => handleAdd(item)}
                          className="flex-1 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          <span>Add to KOT</span>
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => {
                            addToOrderCart(item);
                            setCurrentScreen(5);
                          }}
                          className="p-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl border border-slate-300 transition active:scale-95 shrink-0"
                          title="Customize Options &amp; Spice Level"
                        >
                          <SlidersHorizontal className="h-4 w-4 text-slate-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM ORDER SUMMARY BAR */}
        <div className="mt-3 border border-slate-200 bg-white rounded-2xl px-5 py-3 flex justify-between items-center shrink-0 shadow-xs">
          <div>
            {cartItemCount > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-orange-600" />
                  <span>{cartItemCount} Items in KOT Cart</span>
                </span>
                <span className="text-xs font-bold text-slate-400">•</span>
                <span className="text-xs font-black text-orange-600 font-mono">
                  Subtotal: ₹ {cartTotal}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-500">
                Cart is empty • Tap &quot;+ Add to KOT&quot; on dishes above
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={cartItemCount === 0}
            onClick={() => setCurrentScreen(5)}
            className={`px-5 py-2.5 rounded-xl font-black text-xs transition flex items-center gap-2 ${
              cartItemCount > 0
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 active:scale-95'
                : 'bg-stone-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Review KOT &amp; Customizations</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
