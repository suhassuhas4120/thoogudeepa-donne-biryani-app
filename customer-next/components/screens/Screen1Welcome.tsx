'use client';

import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { ScreenHousing } from '../ui/ScreenHousing';
import { Wifi, ArrowRight, Crown, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const Screen1Welcome: React.FC = () => {
  const { setCurrentScreen, guestName, setGuestName, venueName, tableNumber, setTableNumber } =
    useCustomer();
  const [wifiConnected, setWifiConnected] = useState(false);
  const [seatNumber, setSeatNumber] = useState<number | null>(null);

  // Read ?table=A-01&seat=1 from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tbl = params.get('table');
    const seat = params.get('seat');
    if (tbl) setTableNumber(tbl.toUpperCase());
    if (seat) setSeatNumber(parseInt(seat, 10) || 1);
  }, [setTableNumber]);

  const handleProceed = () => {
    if (!guestName.trim()) setGuestName(`Guest (${tableNumber || 'A-01'})`);
    setCurrentScreen(2);
  };

  return (
    <ScreenHousing screenNumber={1} screenTitle="WELCOME & CONNECT">
      <div className="flex h-full flex-col justify-between p-6 bg-gradient-to-b from-amber-50/40 via-white to-stone-50">

        {/* Top: Venue Logo & Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-3 pt-4"
        >
          <motion.div
            initial={{ rotate: -8, scale: 0.85 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
            className="relative flex h-24 w-24 flex-col items-center justify-center rounded-3xl border-2 border-orange-200/80 bg-gradient-to-tr from-amber-100 to-orange-50 p-2 shadow-md shadow-orange-500/10"
          >
            <Crown className="h-10 w-10 text-orange-600 stroke-[1.8]" />
            <span className="mt-1 text-[8.5px] font-black tracking-wider text-orange-950 text-center uppercase">
              THOOGUDEEPA
            </span>
          </motion.div>

          <div className="mt-2 w-full">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 shadow-sm">
              <h2 className="text-base font-black tracking-wide text-slate-900">{venueName}</h2>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                Authentic Donne Biryani &amp; Military Flavours
              </p>
            </div>
          </div>

          {/* Table + Seat Badge */}
          {(tableNumber || seatNumber) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-[11px] font-bold text-orange-800"
            >
              <MapPin className="h-3 w-3 text-orange-600" />
              <span>Table {tableNumber || 'A-01'}</span>
              {seatNumber && <span className="text-orange-400">·</span>}
              {seatNumber && <span>Seat {seatNumber}</span>}
            </motion.div>
          )}
        </motion.div>

        {/* Middle: Wi-Fi + Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 my-auto"
        >
          {/* Wi-Fi Connect */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setWifiConnected(true)}
            className={`flex w-full items-center justify-center gap-2.5 rounded-2xl border py-3.5 px-4 text-xs font-extrabold tracking-wide transition shadow-sm ${
              wifiConnected
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-800 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            {wifiConnected ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Wi-Fi Connected — Free High-Speed</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-orange-600 animate-pulse" />
                <span>Connect to Restaurant Free Wi-Fi</span>
              </>
            )}
          </motion.button>

          {/* Continue with Mobile Data */}
          <button
            onClick={handleProceed}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <span>🌐</span>
            <span>Continue with Mobile Data</span>
          </button>

          {/* Customer Name Input */}
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
          />
        </motion.div>

        {/* Bottom: Go To Menu */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 pb-2"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleProceed}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 px-4 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-orange-600/25 hover:bg-orange-700 transition"
          >
            <span>Proceed to Menu</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </motion.button>

          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-bold text-slate-600 shadow-xs">
              <Sparkles className="h-3 w-3 text-orange-500" />
              <span>Powered by Thoogudeepa POS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </ScreenHousing>
  );
};
