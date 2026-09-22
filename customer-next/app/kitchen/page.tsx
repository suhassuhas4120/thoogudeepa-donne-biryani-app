'use client';

import React from 'react';
import Link from 'next/link';
import { useKitchenStore } from '../../store/useKitchenStore';
import { KitchenScreenId } from '../../types/kitchen';
import { ScreenK1Login } from '../../components/kitchen/ScreenK1Login';
import { ScreenK2Overview } from '../../components/kitchen/ScreenK2Overview';
import { ScreenK3Detail } from '../../components/kitchen/ScreenK3Detail';
import { ScreenK4Inventory86 } from '../../components/kitchen/ScreenK4Inventory86';
import { ScreenK5SOP } from '../../components/kitchen/ScreenK5SOP';
import { ScreenK6BumpBar } from '../../components/kitchen/ScreenK6BumpBar';
import { ScreenK7AudioAlerts } from '../../components/kitchen/ScreenK7AudioAlerts';
import { ScreenK8RecipeScaler } from '../../components/kitchen/ScreenK8RecipeScaler';
import { ScreenK9Handover } from '../../components/kitchen/ScreenK9Handover';
import { ScreenK10AuditLog } from '../../components/kitchen/ScreenK10AuditLog';
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
  AlertTriangle,
  BookOpen,
  Zap,
  Volume2,
  Scale,
  ClipboardCheck,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KitchenKDSPage() {
  const { currentScreen, setCurrentScreen, viewMode, setViewMode } = useKitchenStore();

  const screens = [
    {
      id: 1 as KitchenScreenId,
      name: '1. Station Login',
      icon: <ChefHat className="h-3.5 w-3.5 text-orange-500" />,
      comp: <ScreenK1Login />,
    },
    {
      id: 2 as KitchenScreenId,
      name: '2. Live Multi-Station KDS',
      icon: <Layers className="h-3.5 w-3.5 text-amber-500" />,
      comp: <ScreenK2Overview />,
    },
    {
      id: 3 as KitchenScreenId,
      name: '3. Table Detail & Stage Bump',
      icon: <Sliders className="h-3.5 w-3.5 text-emerald-500" />,
      comp: <ScreenK3Detail />,
    },
    {
      id: 4 as KitchenScreenId,
      name: '4. 86 Sold-Out Master',
      icon: <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />,
      comp: <ScreenK4Inventory86 />,
    },
    {
      id: 5 as KitchenScreenId,
      name: '5. Authentic Recipe SOP',
      icon: <BookOpen className="h-3.5 w-3.5 text-indigo-500" />,
      comp: <ScreenK5SOP />,
    },
    {
      id: 6 as KitchenScreenId,
      name: '6. Expediter Bump Bar (1-9)',
      icon: <Zap className="h-3.5 w-3.5 text-amber-400" />,
      comp: <ScreenK6BumpBar />,
    },
    {
      id: 7 as KitchenScreenId,
      name: '7. Audio Alerts & Decibel Monitor',
      icon: <Volume2 className="h-3.5 w-3.5 text-blue-500" />,
      comp: <ScreenK7AudioAlerts />,
    },
    {
      id: 8 as KitchenScreenId,
      name: '8. Recipe Yield Scaler',
      icon: <Scale className="h-3.5 w-3.5 text-orange-400" />,
      comp: <ScreenK8RecipeScaler />,
    },
    {
      id: 9 as KitchenScreenId,
      name: '9. Shift Handover Checklist',
      icon: <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />,
      comp: <ScreenK9Handover />,
    },
    {
      id: 10 as KitchenScreenId,
      name: '10. Kitchen Shift Audit Log',
      icon: <History className="h-3.5 w-3.5 text-purple-500" />,
      comp: <ScreenK10AuditLog />,
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
      case 4:
        return <ScreenK4Inventory86 />;
      case 5:
        return <ScreenK5SOP />;
      case 6:
        return <ScreenK6BumpBar />;
      case 7:
        return <ScreenK7AudioAlerts />;
      case 8:
        return <ScreenK8RecipeScaler />;
      case 9:
        return <ScreenK9Handover />;
      case 10:
        return <ScreenK10AuditLog />;
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
              KITCHEN DISPLAY SYSTEM (10 TABLET SCREENS)
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
              <span>CUSTOMER (12)</span>
            </Link>
            <span className="rounded-xl bg-orange-600 text-white px-3 py-1.5 shadow-xs flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-white" />
              <span>KITCHEN (10)</span>
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
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                viewMode === 'single'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>SINGLE TABLET</span>
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                viewMode === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>ALL 10 SCREENS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen Navigation Bar (Single Mode) */}
      {viewMode === 'single' && (
        <nav className="sticky top-[61px] z-30 flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-6 py-2 shadow-xs scrollbar-none">
          {screens.map((screen) => {
            const isActive = currentScreen === screen.id;
            return (
              <button
                key={screen.id}
                onClick={() => setCurrentScreen(screen.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {screen.icon}
                <span>{screen.name}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Main Workspace */}
      <div className="flex-1 p-6 flex justify-center items-center">
        {viewMode === 'single' ? (
          <div className="w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="w-full flex justify-center"
              >
                {renderActiveScreen()}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* All 10 Screens Grid Mode */
          <div className="w-full max-w-[1700px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
            {screens.map((screen) => (
              <div key={screen.id} className="flex flex-col items-center">
                <div className="mb-2 flex items-center gap-2 font-mono text-xs font-extrabold text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span>{screen.name}</span>
                </div>
                <div className="w-full scale-90 origin-top">
                  {screen.comp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
