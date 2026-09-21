'use client';

import React from 'react';
import Link from 'next/link';
import { useKitchenStore } from '../../store/useKitchenStore';
import { KitchenScreenId } from '../../types/kitchen';
import { ScreenK1Login } from '../../components/kitchen/ScreenK1Login';
import { ScreenK2Overview } from '../../components/kitchen/ScreenK2Overview';
import { ScreenK3Detail } from '../../components/kitchen/ScreenK3Detail';
import {
  Flame,
  LayoutGrid,
  Tablet,
  ChefHat,
  Sliders,
  Layers,
  ArrowRight,
  Sparkles,
  Utensils,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KitchenKDSPage() {
  const { currentScreen, setCurrentScreen, viewMode, setViewMode } = useKitchenStore();

  const screens = [
    {
      id: 1 as KitchenScreenId,
      name: '1. KDS Station Login',
      icon: <ChefHat className="h-3.5 w-3.5 text-orange-500" />,
      comp: <ScreenK1Login />,
    },
    {
      id: 2 as KitchenScreenId,
      name: '2. All Tables & Feeds (70/30)',
      icon: <Layers className="h-3.5 w-3.5 text-amber-500" />,
      comp: <ScreenK2Overview />,
    },
    {
      id: 3 as KitchenScreenId,
      name: '3. Table Detail & 86 Inventory',
      icon: <Sliders className="h-3.5 w-3.5 text-emerald-500" />,
      comp: <ScreenK3Detail />,
    },
  ];

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 1:
        return <ScreenK1Login />;
      case 2:
        return <ScreenK2Overview />;
      case 3:
        return <ScreenK3Detail />;
      default:
        return <ScreenK1Login />;
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Console Header */}
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-6 py-3 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-sm shadow-orange-500/30">
            <Flame className="h-5 w-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 rounded-md px-1.5 py-0.5">
                KITCHEN KDS TABLET FRAMEWORK • REACT 19 • NEXT.JS
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-400">
                THOOGUDEEPA DONNE BIRYANI MANE
              </span>
            </div>
            <h1 className="text-sm font-black tracking-tight text-slate-900 mt-0.5">
              KITCHEN DISPLAY SYSTEM (3 TABLET SCREENS)
            </h1>
          </div>
        </div>

        {/* Global Multi-Portal Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-stone-50 p-1 shadow-xs font-mono text-xs font-bold">
            <Link
              href="/"
              className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-slate-600 hover:text-slate-900 transition"
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>CUSTOMER (10)</span>
            </Link>
            <span className="rounded-xl bg-orange-600 text-white px-3 py-1.5 shadow-xs flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-white" />
              <span>KITCHEN (3)</span>
            </span>
            <Link
              href="/waiter"
              className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-slate-600 hover:text-slate-900 transition"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>WAITER (10)</span>
            </Link>
            <Link
              href="/manager"
              className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-slate-600 hover:text-slate-900 transition"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>MANAGER (16)</span>
            </Link>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-stone-50 p-1 shadow-xs">
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'single'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>SINGLE TABLET FLOW</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>ALL 3 SCREENS SIDE-BY-SIDE</span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen Navigation Tabs */}
      <nav className="w-full max-w-7xl mx-auto flex gap-2 overflow-x-auto px-6 py-3 scrollbar-none">
        {screens.map((sc) => {
          const isActive = viewMode === 'single' && currentScreen === sc.id;
          return (
            <motion.button
              key={sc.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentScreen(sc.id);
                if (viewMode !== 'single') setViewMode('single');
              }}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-bold transition shadow-2xs ${
                isActive
                  ? 'border-orange-500 bg-white text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                  : 'border-slate-200/80 bg-white/70 text-slate-600 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <span>{sc.icon}</span>
              <span>{sc.name}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Main Container */}
      <div className="flex-1 py-4 px-4">
        {viewMode === 'single' ? (
          <div className="flex justify-center pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -8 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center"
              >
                {renderActiveScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1680px] px-4 grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8 justify-items-center pb-20">
            {screens.map((sc) => (
              <div key={sc.id} className="flex flex-col items-center w-full max-w-[1080px]">
                {sc.comp}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
