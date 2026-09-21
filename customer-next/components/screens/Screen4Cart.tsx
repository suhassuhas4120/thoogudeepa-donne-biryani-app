'use client';

import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { ScreenHousing } from '../ui/ScreenHousing';
import { WireHeader } from '../ui/WireHeader';
import { StickyBottomBar } from '../ui/StickyBottomBar';
import { Plus, Minus, Flame, ArrowRight, ShoppingBag, Utensils, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Screen4Cart: React.FC = () => {
  const {
    setCurrentScreen,
    cart,
    updateCartQuantity,
    orderSeparately,
    placeAllOrders,
  } = useCustomer();

  const [separateNotice, setSeparateNotice] = useState<string | null>(null);

  const handleSeparateOrder = (cartItemId: string, name: string) => {
    orderSeparately(cartItemId);
    setSeparateNotice(`Order fired separately for ${name}!`);
    setTimeout(() => setSeparateNotice(null), 2500);
  };

  const totalCartAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <ScreenHousing screenNumber={4} screenTitle="CART PAGE">
      {/* Header */}
      <WireHeader
        title="[CART PAGE]"
        showBack={true}
        onBack={() => setCurrentScreen(2)}
        showCallWaiter={true}
        showCart={false}
      />

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          [SELECTED ITEMS LIST WITH IMAGE, PRICE &amp; CUSTOMISED DETAILS]
        </div>

        {separateNotice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white shadow-md"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>⚡ {separateNotice}</span>
          </motion.div>
        )}

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
            <ShoppingBag className="h-12 w-12 text-slate-300 stroke-[1.5]" />
            <div className="mt-3 text-sm font-extrabold text-slate-900">[CART IS EMPTY]</div>
            <p className="mt-1 text-xs text-slate-500">Explore the delicious menu and add dishes</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen(2)}
              className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm"
            >
              [BROWSE MENU]
            </motion.button>
          </div>
        ) : (
          <AnimatePresence>
            {cart.map((ci) => (
              <motion.div
                key={ci.cartItemId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-2.5 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-orange-200 bg-gradient-to-br from-amber-50 to-orange-50 text-[10px] font-black text-orange-900 font-mono">
                    <span className="text-base">🥘</span>
                    <span>[IMG]</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs font-extrabold text-slate-900">
                      [{ci.menuItem.name}]
                    </div>
                    <div className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                      [CUSTOM: {ci.selectedOption}
                      {ci.selectedAddOns.length > 0 ? ` + ${ci.selectedAddOns.join(', ')}` : ''}]
                    </div>
                    <div className="font-mono text-xs font-black text-slate-900 mt-1">
                      [PRICE: ₹ {ci.totalPrice}]
                    </div>
                  </div>

                  {/* Quantity Stepper (+,-) */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-stone-50 p-1 shadow-xs">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateCartQuantity(ci.cartItemId, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white font-black text-slate-700 shadow-xs hover:bg-slate-100"
                    >
                      <Minus className="h-3 w-3 stroke-[2.5]" />
                    </motion.button>
                    <span className="min-w-5 text-center font-mono text-xs font-black text-slate-900">
                      {ci.quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateCartQuantity(ci.cartItemId, 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-white font-black text-slate-700 shadow-xs hover:bg-slate-100"
                    >
                      <Plus className="h-3 w-3 stroke-[2.5]" />
                    </motion.button>
                  </div>
                </div>

                {/* Separate Ordering Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSeparateOrder(ci.cartItemId, ci.menuItem.name)}
                  className="rounded-xl border border-slate-200 bg-stone-50/70 py-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-slate-700 hover:bg-stone-100 transition"
                >
                  [ORDER THIS ITEM SEPARATELY]
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Sticky: Place Order Button */}
      <StickyBottomBar label="[PLACE ALL ORDERS BUTTON]">
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={cart.length === 0}
          onClick={placeAllOrders}
          className="flex w-full items-center justify-between rounded-2xl bg-orange-600 px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-orange-600/30 hover:bg-orange-700 disabled:opacity-50 transition"
        >
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 stroke-[2.2]" />
            <span>🔥 [PLACE ORDER (ALL ITEMS)]</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm font-bold text-amber-200">
              ₹ {totalCartAmount}
            </span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </div>
        </motion.button>
      </StickyBottomBar>
    </ScreenHousing>
  );
};
