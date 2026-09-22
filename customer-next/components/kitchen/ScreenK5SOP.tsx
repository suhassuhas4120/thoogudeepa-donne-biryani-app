'use client';

import React, { useState } from 'react';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useKitchenStore } from '../../store/useKitchenStore';
import { BookOpen, ShieldCheck, Flame, Utensils, AlertCircle, ArrowLeft, ArrowRight, CheckSquare } from 'lucide-react';

export const ScreenK5SOP: React.FC = () => {
  const { setCurrentScreen } = useKitchenStore();
  const [activeTab, setActiveTab] = useState<'RECIPES' | 'HYGIENE' | 'ALLERGENS'>('RECIPES');

  return (
    <KitchenTabletHousing screenNumber={5} screenTitle="KITCHEN STANDARD OPERATING PROCEDURES (SOP)">
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-5 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('RECIPES')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === 'RECIPES' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>AUTHENTIC DONNE RECIPES</span>
          </button>
          <button
            onClick={() => setActiveTab('HYGIENE')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === 'HYGIENE' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>HYGIENE & CRITICAL TEMPS</span>
          </button>
          <button
            onClick={() => setActiveTab('ALLERGENS')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === 'ALLERGENS' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <span>ALLERGEN SAFETY MATRIX</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'RECIPES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-amber-400">1. Authentic Donne Mutton Biryani (Dum Process)</h3>
                  <span className="font-mono text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    35 MIN DUM • LOW CHARCOAL
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Soak premium Seeraga Samba rice for exactly 20 mins. Sauté whole spices in pure buffalo ghee. Add green masala paste (fresh mint, coriander, green chillies, shallots). Brown tender mutton chunks until half-cooked. Layer soaked rice, add mutton stock (1:1.75 ratio), seal degh with wheat flour dough. Cook on high flame for 7 mins, then transfer to charcoal embers for 28 mins dum.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-orange-400">2. Nati Koli (Country Chicken) Donne Biryani</h3>
                  <span className="font-mono text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">
                    42 MIN DUM • HIGH MOISTURE
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Country chicken requires extra pressure braising with stone-ground black pepper and crushed garlic before blending with the rice. Ensure meat reaches internal temp of 82°C before dum assembly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-rose-400">3. Guntur Chilli Chicken (Hot Pan Fryer)</h3>
                  <span className="font-mono text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                    6 MIN FLASH FRY
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Marinate chicken cubes with egg white, cornstarch, ginger paste. Flash fry at 180°C oil for 4 mins. Toss in cast iron wok with slit Guntur green chillies, roasted cumin, curry leaves, and lemon juice. Serve dry with onion rings.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'HYGIENE' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-widest">CRITICAL TEMPS</span>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li>• Walk-in Cold Freezer: <span className="font-mono font-bold text-emerald-400">-18°C to -22°C</span></li>
                  <li>• Chilled Raw Meat Storage: <span className="font-mono font-bold text-emerald-400">0°C to 4°C</span></li>
                  <li>• Cooked Meat Core Temp: <span className="font-mono font-bold text-amber-400">&gt; 75°C</span></li>
                  <li>• Serving Warm Table: <span className="font-mono font-bold text-orange-400">&gt; 65°C</span></li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
                <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-widest">STAFF HYGIENE</span>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li>• Mandatory 20-second hand washing every 45 mins</li>
                  <li>• Hairnet, beard-net & chef apron worn at all times</li>
                  <li>• Separate colour-coded cutting boards (Red: Meat, Green: Veg)</li>
                  <li>• Stainless steel tables disinfected hourly</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ALLERGENS' && (
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-3">
              <h3 className="text-sm font-black text-rose-400">Mandatory FSSAI Allergen Declaration</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inform front-of-house staff and customers immediately when preparing dishes with these allergens:
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold">
                  🥛 Dairy / Ghee: All Donne Biryanis & Salna
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-orange-300 font-bold">
                  🥜 Nuts / Cashews: Special Shahi Tukda & Biryani Garnish
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-rose-300 font-bold">
                  🌾 Gluten: Roti, Naan & Parotta dough
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <button
            onClick={() => setCurrentScreen(4)}
            className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to 86 Master (4)</span>
          </button>
          <button
            onClick={() => setCurrentScreen(6)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
          >
            <span>Next: Expediter Bump Bar (6)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
