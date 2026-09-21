'use client';

import React, { useState } from 'react';
import { useKitchenStore } from '../../store/useKitchenStore';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { KitchenStation } from '../../types/kitchen';
import { ChefHat, Flame, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ScreenK1Login: React.FC = () => {
  const { setCurrentScreen, activeStation, setActiveStation, chefName, setChefName } =
    useKitchenStore();
  const [enteredPin, setEnteredPin] = useState<string>('');

  const stations: { id: KitchenStation; name: string; icon: string; desc: string }[] = [
    {
      id: 'MAIN',
      name: 'Main Kitchen Master Dispatch',
      icon: '🍳',
      desc: 'All tables & bulk preparation overview',
    },
    {
      id: 'DUM_BIRYANI',
      name: 'Donne Biryani Dum Station',
      icon: '🥘',
      desc: 'Seeraga samba dum pots & deg dispatch',
    },
    {
      id: 'TANDOOR_BHATTI',
      name: 'Kebab & Tandoor Station',
      icon: '🔥',
      desc: 'Kshatriya kebabs & charcoal fry',
    },
    {
      id: 'DESSERT_PANTRY',
      name: 'Desserts & Beverage Pantry',
      icon: '🥥',
      desc: 'Elaneer payasam & cold counter',
    },
  ];

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 4) {
      setEnteredPin((prev) => prev + num);
    }
  };

  const handleClear = () => setEnteredPin('');
  const handleBackspace = () => setEnteredPin((prev) => prev.slice(0, -1));

  const handleLogin = () => {
    if (enteredPin.length >= 4 || enteredPin === '') {
      setCurrentScreen(2);
    }
  };

  return (
    <KitchenTabletHousing screenNumber={1} screenTitle="KDS STATION & STAFF LOGIN">
      <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center p-6 gap-6 overflow-y-auto">
        {/* Left Card: Station Selection */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1">
              [STEP 1: SELECT KITCHEN STATION TO DISPLAY]
            </div>
            <h2 className="text-base font-black text-slate-900 mb-3">
              Thoogudeepa KDS Station Routing
            </h2>

            <div className="space-y-2.5">
              {stations.map((st) => {
                const isSelected = activeStation === st.id;
                return (
                  <motion.div
                    key={st.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveStation(st.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 shadow-xs ring-2 ring-orange-500/20'
                        : 'border-slate-200 bg-stone-50/60 hover:bg-stone-100/80'
                    }`}
                  >
                    <span className="text-2xl">{st.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black text-slate-900">{st.name}</div>
                      <div className="text-[10.5px] text-slate-500 mt-0.5">{st.desc}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-orange-600 shrink-0" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>[VENUE: THOOGUDEEPA DONNE BIRYANI MANE]</span>
            <span className="text-emerald-600 font-bold">KDS v2.4 CONNECTED</span>
          </div>
        </div>

        {/* Right Card: Staff Selection & PIN Pad */}
        <div className="w-full md:w-80 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1">
              [STEP 2: STAFF AUTHENTICATION PIN]
            </div>

            <div className="mb-3">
              <label className="text-[10.5px] font-bold text-slate-600 font-mono">
                CHEF DE CUISINE
              </label>
              <input
                type="text"
                value={chefName}
                onChange={(e) => setChefName(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-stone-50 text-xs font-bold text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* PIN Dots Display */}
            <div className="h-11 rounded-xl bg-stone-100 border border-slate-200 flex items-center justify-center gap-3 mb-3">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`h-3 w-3 rounded-full border-2 border-slate-800 transition ${
                    enteredPin.length > idx ? 'bg-slate-900' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="h-10 rounded-lg border border-slate-200 bg-stone-50 hover:bg-stone-100 font-mono text-sm font-bold text-slate-800 transition active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="h-10 rounded-lg border border-slate-200 bg-stone-100 hover:bg-stone-200 font-mono text-[10px] font-bold text-slate-600 transition"
              >
                CLR
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="h-10 rounded-lg border border-slate-200 bg-stone-50 hover:bg-stone-100 font-mono text-sm font-bold text-slate-800 transition active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-10 rounded-lg border border-slate-200 bg-stone-100 hover:bg-stone-200 font-mono text-[10px] font-bold text-slate-600 transition"
              >
                DEL
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-orange-600/30 hover:bg-orange-700 transition"
          >
            <span>[START SHIFT &amp; ENTER KDS]</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </motion.button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
