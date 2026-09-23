'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, UserCheck, RotateCcw, Delete } from 'lucide-react';

interface CaptainProfile {
  pin: string;
  name: string;
  section: string;
  role: string;
  avatar: string;
}

const CAPTAIN_PROFILES: CaptainProfile[] = [
  { pin: '1001', name: 'Captain Ramesh', section: 'SECTION A & B', role: 'Sr. Floor Captain', avatar: '👨‍💼' },
  { pin: '1002', name: 'Captain Suresh', section: 'SECTION A & B', role: 'Station Captain', avatar: '🤵' },
  { pin: '1003', name: 'Captain Vijay', section: 'TERRACE ROOFTOP', role: 'Rooftop Captain', avatar: '🧑‍💼' },
  { pin: '1004', name: 'Captain Anand', section: 'FAMILY AC DINING', role: 'AC Hall Captain', avatar: '👨‍🍳' },
];

export const TabletScreen1Login: React.FC = () => {
  const { setCurrentScreen, activeCaptain, setActiveCaptain, activeSection, setActiveSection } =
    useWaiterStore();
  const [pin, setPin] = useState('');
  const [selectedProfilePin, setSelectedProfilePin] = useState<string | null>(null);

  const sections = ['SECTION A & B', 'TERRACE ROOFTOP', 'FAMILY AC DINING', 'ALL SECTIONS'];

  const handleNum = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);

      if (nextPin.length === 4) {
        const matched = CAPTAIN_PROFILES.find((p) => p.pin === nextPin);
        if (matched) {
          setActiveCaptain(matched.name);
          setActiveSection(matched.section);
          setSelectedProfilePin(matched.pin);
        } else if (!activeCaptain) {
          setActiveCaptain('Captain Ramesh');
        }
      }
    }
  };

  const handleSelectProfile = (profile: CaptainProfile) => {
    setActiveCaptain(profile.name);
    setActiveSection(profile.section);
    setSelectedProfilePin(profile.pin);
    setPin(''); // Keep secret PIN empty so waiter must enter it securely
  };

  const handleDel = () => {
    setPin((p) => p.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setSelectedProfilePin(null);
  };

  const handleLogin = () => {
    if (pin.length === 4) {
      const matched = CAPTAIN_PROFILES.find((p) => p.pin === pin);
      if (matched && (!activeCaptain || activeCaptain === '')) {
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
    <WaiterTabletLandscapeHousing
      screenNumber={1}
      screenTitle="CAPTAIN AUTHENTICATION &amp; TABLET LOGIN"
    >
      <div className="flex flex-1 min-h-[700px]">
        {/* LEFT 42%: BRAND & HOTEL METADATA */}
        <div className="w-[42%] border-r-2 border-slate-800 bg-slate-100 p-8 flex flex-col justify-between select-none">
          <div>
            {/* Hotel Logo Space */}
            <div className="w-full h-28 border-2 border-dashed border-slate-400 bg-white rounded-xl flex flex-col items-center justify-center gap-2 mb-6">
              <span className="text-3xl">🍗</span>
              <span className="font-mono text-xs font-black tracking-wider text-slate-700">
                [ESTABLISHMENT LOGO SPACE]
              </span>
            </div>

            <h1 className="text-xl font-black tracking-tight text-slate-950 font-mono">
              THOOGUDEEPA DONNE BIRYANI MANE
            </h1>
            <p className="font-mono text-xs font-extrabold text-orange-600 mt-1 uppercase tracking-wider">
              [FLOOR CAPTAIN / WAITER SERVICE CONSOLE]
            </p>

            {/* Active Shift Announcement */}
            <div className="mt-6 border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2 font-mono text-xs shadow-2xs">
              <span className="font-bold text-slate-500 uppercase text-[10px]">
                [ACTIVE SHIFT ANNOUNCEMENT]:
              </span>
              <div className="font-bold text-slate-900 text-sm">
                [SHIFT A: 08:00 AM - 04:00 PM]
              </div>
              <div className="text-slate-600 text-[11px]">
                [ASSIGNED ZONE: MAIN DINING HALL • SECTION A &amp; B]
              </div>
              <div className="text-slate-600 text-[11px]">
                [TABLES UNDER MANAGEMENT: 16 ACTIVE TABLES]
              </div>
            </div>

            {/* Service Protocol Check */}
            <div className="mt-4 border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2 font-mono text-[11px] shadow-2xs">
              <span className="font-bold text-slate-500 uppercase text-[10px]">
                [SERVICE PROTOCOL CHECK]:
              </span>
              <div className="text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>[CHECK WATER BOTTLES &amp; CUTLERY STANDS]</span>
              </div>
              <div className="text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>[CONFIRM KITCHEN KDS CHEF CONNECTION]</span>
              </div>
            </div>
          </div>

          {/* Bottom Company Platform Tag */}
          <div className="border-t border-dashed border-slate-400 pt-4 text-center">
            <span className="font-mono text-[10px] text-slate-500 font-bold">
              [POWERED BY THOOGUDEEPA RESTAURANT OS • TABLET CLIENT v2.4]
            </span>
          </div>
        </div>

        {/* RIGHT 58%: AUTHENTICATION KEYPAD TERMINAL */}
        <div className="w-[58%] bg-white p-8 flex flex-col justify-center gap-4 overflow-y-auto">
          <div className="max-w-[460px] mx-auto w-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                [AUTHENTICATION CREDENTIALS]:
              </span>
              {matchedProfile && (
                <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {matchedProfile.role}
                </span>
              )}
            </div>
            <h2 className="text-lg font-black text-slate-950 font-mono mt-1">
              [ENTER WAITER NAME &amp; NUMBER LOCK PIN]
            </h2>
          </div>

          {/* Quick Staff Preset Selector */}
          <div className="max-w-[460px] mx-auto w-full">
            <label className="block font-mono text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>[SELECT CAPTAIN PROFILE]:</span>
              <span className="text-[10px] text-orange-600 font-extrabold">[TAP TO SELECT]</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAPTAIN_PROFILES.map((prof) => {
                const isSelected = selectedProfilePin === prof.pin || activeCaptain === prof.name;
                return (
                  <button
                    key={prof.pin}
                    type="button"
                    onClick={() => handleSelectProfile(prof)}
                    className={`py-2 px-3 border rounded-lg text-left transition flex items-center gap-2 font-mono ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="text-base leading-none">{prof.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black truncate">{prof.name}</div>
                      <div className={`text-[10px] font-bold truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {prof.role} • {prof.section}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Waiter Name Input */}
          <div className="max-w-[460px] mx-auto w-full">
            <label className="block font-mono text-[11px] font-bold text-slate-600 mb-1">
              [ENTER WAITER / CAPTAIN NAME]:
            </label>
            <input
              type="text"
              value={activeCaptain}
              onChange={(e) => {
                setActiveCaptain(e.target.value);
                setSelectedProfilePin(null);
              }}
              className="w-full border-2 border-slate-800 rounded-lg px-4 py-2 font-mono text-sm font-bold text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Captain Ramesh"
            />
          </div>

          {/* Floor Section Selection */}
          <div className="max-w-[460px] mx-auto w-full">
            <label className="block font-mono text-[11px] font-bold text-slate-600 mb-1">
              [ASSIGNED FLOOR SECTION]:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setActiveSection(sec)}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-mono font-bold transition ${
                    activeSection === sec
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* PIN Lock Indicator */}
          <div className="max-w-[460px] mx-auto w-full">
            <div className="flex justify-between items-center mb-1 font-mono text-[11px]">
              <label className="font-bold text-slate-600">[NUMBER LOCK PASSWORD / PIN]:</label>
              <span className={`font-bold ${pin.length === 4 ? 'text-emerald-700' : 'text-orange-600'}`}>
                {pin.length === 4 ? '[PIN VERIFIED ✓]' : `[${4 - pin.length} DIGITS REQUIRED]`}
              </span>
            </div>
            <div className="border-2 border-slate-800 rounded-lg p-2.5 flex justify-center gap-4 bg-slate-100">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full border-2 border-slate-900 transition-all ${
                    idx < pin.length ? 'bg-slate-900 scale-110' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2 max-w-[460px] mx-auto w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNum(num)}
                className="h-11 font-mono text-lg font-black bg-white border-2 border-slate-800 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition shadow-2xs flex items-center justify-center text-slate-950"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDel}
              className="h-11 font-mono text-xs font-black bg-slate-100 border-2 border-slate-800 rounded-lg hover:bg-slate-200 active:bg-slate-300 transition text-slate-800"
            >
              [⌫ DEL]
            </button>
            <button
              type="button"
              onClick={() => handleNum('0')}
              className="h-11 font-mono text-lg font-black bg-white border-2 border-slate-800 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition text-slate-950"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-11 font-mono text-xs font-black bg-slate-100 border-2 border-slate-800 rounded-lg hover:bg-slate-200 active:bg-slate-300 transition text-slate-800"
            >
              [✕ CLR]
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 max-w-[460px] mx-auto w-full">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-3 border-2 border-slate-800 rounded-lg font-mono text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 transition"
            >
              [RESET]
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className="flex-[2] py-3 border-2 border-slate-900 rounded-lg font-mono text-xs font-black text-white bg-slate-900 hover:bg-black transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>[GO TO DASHBOARD]</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
