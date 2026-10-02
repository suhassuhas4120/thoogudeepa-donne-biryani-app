'use client';

import React from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { ArrowLeft, Bell, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface WireHeaderProps {
  title: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showCallWaiter?: boolean;
  showCart?: boolean;
  leftSubtitle?: string;
}

export const WireHeader: React.FC<WireHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showCallWaiter = true,
  showCart = false,
  leftSubtitle,
}) => {
  const { navigateTo, previousScreen, cart } = useCustomer();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E8D5C3] bg-[#8A4228] px-4 py-3 shadow-md">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[#FFFCF7] shadow-sm transition hover:bg-white/25"
            onClick={onBack ? onBack : () => navigateTo(previousScreen || 2)}
            title="Go Back"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          </motion.button>
        )}
        <div className="min-w-0">
          {leftSubtitle && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#F3DFCC] font-mono">
              {leftSubtitle}
            </div>
          )}
          <div className="flex items-center gap-1.5 truncate text-sm font-extrabold tracking-tight text-[#FFFCF7]">
            {title}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showCallWaiter && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-[#D08A52] shadow-sm transition hover:bg-white/25"
            onClick={() => navigateTo(10)}
            title="Call Waiter"
          >
            <Bell className="h-4 w-4 stroke-[2.2] text-[#F3DFCC]" />
          </motion.button>
        )}

        {showCart && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#D08A52] text-[#FFFCF7] shadow-sm transition hover:brightness-110"
            onClick={() => navigateTo(4)}
            title="View Cart"
          >
            <ShoppingCart className="h-4 w-4 stroke-[2.2]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D92D20] text-[10px] font-black text-[#FFFCF7] ring-2 ring-[#8A4228] animate-in zoom-in">
                {totalCartCount}
              </span>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};
