'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../store/useWaiterStore';
import { WaiterTabletHousing } from './WaiterTabletHousing';
import {
  UserCheck,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Delete,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CaptainProfile {
  pin: string;
  name: string;
  section: string;
  role: string;
  avatar: string;
}

const CAPTAIN_PROFILES: CaptainProfile[] = [
  { pin: '1001', name: 'Captain Ramesh', section: 'SECTION A', role: 'Sr. Floor Captain', avatar: '👨‍💼' },
  { pin: '1002', name: 'Captain Suresh', section: 'SECTION B', role: 'Station Captain', avatar: '🤵' },
  { pin: '1003', name: 'Captain Vijay', section: 'TERRACE', role: 'Rooftop Captain', avatar: '🧑‍💼' },
  { pin: '1004', name: 'Captain Anand', section: 'FAMILY DINING', role: 'AC Hall Captain', avatar: '👨‍🍳' },
];

export const ScreenW1Login: React.FC = () => {
  const {
    setCurrentScreen,
    activeCaptain,
    setActiveCaptain,
    activeSection,
    setActiveSection,
  } = useWaiterStore();

  const [pin, setPin] = useState('');
  const [selectedProfilePin, setSelectedProfilePin] = useState<string | null>(null);
  const [pinError, setPinError] = useState(false);

  const sections = ['ALL', 'SECTION A', 'SECTION B', 'TERRACE', 'FAMILY DINING'];

  const handleNum = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setPinError(false);

      if (nextPin.length === 4) {
        if (selectedProfilePin) {
          if (nextPin !== selectedProfilePin) {
            setPinError(true);
          } else {
            setPinError(false);
          }
        } else {
          const matched = CAPTAIN_PROFILES.find((p) => p.pin === nextPin);
          if (matched) {
            setActiveCaptain(matched.name);
            setActiveSection(matched.section);
            setSelectedProfilePin(matched.pin);
            setPinError(false);
          } else {
            setPinError(true);
          }
        }
      }
    }
  };

  const handleSelectProfile = (profile: CaptainProfile) => {
    setActiveCaptain(profile.name);
    setActiveSection(profile.section);
    setSelectedProfilePin(profile.pin);
    setPin(''); // Keep secret PIN empty so waiter must enter it
    setPinError(false);
  };

  const handleClear = () => {
    setPin('');
    setPinError(false);
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setPinError(false);
  };

  const handleLogin = () => {
    if (pin.length > 0 && pin.length < 4) {
      setPinError(true);
      return;
    }

    if (pin.length === 4) {
      if (selectedProfilePin && pin !== selectedProfilePin) {
        setPinError(true);
        return;
      }
      const matched = CAPTAIN_PROFILES.find((p) => p.pin === pin);
      if (matched) {
        setActiveCaptain(matched.name);
        setActiveSection(matched.section);
      }
    }

    if (!activeCaptain || activeCaptain.trim() === '') {
      setActiveCaptain('Captain Ramesh');
    }

    setCurrentScreen(2);
  };

  const matchedProfile = CAPTAIN_PROFILES.find((p) => p.pin === pin || p.name === activeCaptain);

  return (
    <WaiterTabletHousing screenNumber={1} screenTitle="CAPTAIN AUTH &amp; SECTION LOGIN">
      <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto space-y-3">
        <div className="space-y-3">
          {/* Top Live Shift Banner */}
          <div className="rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-2.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="font-mono text-[10px] font-bold text-slate-800">
                <span className="text-orange-600 font-black">[SHIFT ACTIVE]</span> Peak Rush (12:00 - 23:00)
              </div>
            </div>
            <span className="font-mono text-[9px] font-black text-slate-500 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
              POS TERMINAL #01
            </span>
          </div>

          {/* Quick Staff Selector (Profile Select) */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10px] font-black font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-orange-600" />
                <span>SELECT CAPTAIN PROFILE</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-bold">[TAP TO SELECT]</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {CAPTAIN_PROFILES.map((prof) => {
                const isSelected = selectedProfilePin === prof.pin || activeCaptain === prof.name;
                return (
                  <button
                    key={prof.pin}
                    type="button"
                    onClick={() => handleSelectProfile(prof)}
                    className={`p-2 rounded-xl border text-left transition flex items-center gap-2 shadow-2xs ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-950 ring-1 ring-orange-500/30'
                        : 'border-slate-200 bg-white hover:bg-stone-50 text-slate-700'
                    }`}
                  >
                    <span className="text-lg leading-none">{prof.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-black font-mono truncate">{prof.name}</div>
                      <div className="text-[9px] font-mono text-slate-500 font-bold truncate">
                        {prof.role} • {prof.section}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Captain Name & Floor Section Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs space-y-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 font-mono uppercase flex items-center justify-between">
                <span>[ASSIGNED CAPTAIN NAME]</span>
                {matchedProfile && (
                  <span className="text-emerald-700 font-black text-[9.5px]">
                    ✓ {matchedProfile.role}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={activeCaptain}
                onChange={(e) => {
                  setActiveCaptain(e.target.value);
                  setSelectedProfilePin(null);
                }}
                placeholder="e.g. Captain Ramesh"
                className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-stone-50 text-xs font-black text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 font-mono uppercase block mb-1">
                [ACTIVE FLOOR ZONE / SECTION]
              </label>
              <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                {sections.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setActiveSection(sec)}
                    className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-mono font-black whitespace-nowrap transition ${
                      activeSection === sec
                        ? 'border-orange-500 bg-orange-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-stone-50 text-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PIN Lock Display Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1 px-0.5">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
                [ENTER 4-DIGIT SECURITY PIN]
              </span>
              <span className={`text-[10px] font-mono font-bold ${pin.length === 4 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {pin.length === 4 ? '✓ PIN ENTERED' : `(${4 - pin.length} digits left)`}
              </span>
            </div>

            <div
              className={`h-11 rounded-xl bg-white border-2 flex items-center justify-center gap-4 shadow-2xs transition ${
                pinError
                  ? 'border-rose-400 bg-rose-50/50'
                  : pin.length === 4
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-slate-300'
              }`}
            >
              {[0, 1, 2, 3].map((idx) => {
                const filled = pin.length > idx;
                return (
                  <motion.div
                    key={idx}
                    animate={filled ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    className={`h-3.5 w-3.5 rounded-full border-2 transition-all ${
                      filled
                        ? pin.length === 4
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'bg-slate-900 border-slate-900'
                        : 'border-slate-300 bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
            {pinError && (
              <p className="text-[10px] font-mono text-rose-600 font-bold mt-1 text-center">
                Please enter a full 4-digit PIN (e.g. 1001)
              </p>
            )}
          </div>

          {/* Numeric Touch Keypad */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleNum(n)}
                className="h-10 rounded-xl border border-slate-200 bg-white text-base font-black font-mono text-slate-800 hover:bg-stone-100 transition active:scale-95 shadow-2xs flex items-center justify-center"
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-10 rounded-xl border border-slate-200 bg-stone-100 font-mono text-xs font-bold text-slate-600 hover:bg-stone-200 active:scale-95 transition flex items-center justify-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>CLR</span>
            </button>
            <button
              type="button"
              onClick={() => handleNum('0')}
              className="h-10 rounded-xl border border-slate-200 bg-white font-mono text-base font-black text-slate-800 hover:bg-stone-100 active:scale-95 transition shadow-2xs flex items-center justify-center"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-10 rounded-xl border border-slate-200 bg-stone-100 font-mono text-xs font-bold text-slate-600 hover:bg-stone-200 active:scale-95 transition flex items-center justify-center gap-1"
            >
              <Delete className="h-3 w-3" />
              <span>DEL</span>
            </button>
          </div>
        </div>

        {/* Unlock Action Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleLogin}
          className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-600/30 hover:bg-orange-700 transition"
        >
          <span>[UNLOCK FLOOR CONSOLE]</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </motion.button>
      </div>
    </WaiterTabletHousing>
  );
};
