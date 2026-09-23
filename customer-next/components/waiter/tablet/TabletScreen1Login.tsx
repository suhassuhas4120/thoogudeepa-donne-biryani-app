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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sections = ['SECTION A & B', 'TERRACE ROOFTOP', 'FAMILY AC DINING', 'ALL SECTIONS'];

  const matchedProfile = CAPTAIN_PROFILES.find((p) => p.name === activeCaptain);
  const expectedPin = selectedProfilePin || (matchedProfile ? matchedProfile.pin : null);
  const isVerified = Boolean(activeCaptain && pin.length === 4 && expectedPin && pin === expectedPin);

  const handleNum = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === 4) {
        if (expectedPin) {
          if (nextPin !== expectedPin) {
            setErrorMessage(`Incorrect password for ${activeCaptain || 'Captain'}.`);
          } else {
            setErrorMessage(null);
          }
        } else {
          const matched = CAPTAIN_PROFILES.find((p) => p.pin === nextPin);
          if (matched) {
            setActiveCaptain(matched.name);
            setActiveSection(matched.section);
            setSelectedProfilePin(matched.pin);
            setErrorMessage(null);
          } else {
            setErrorMessage('Invalid PIN. Please select your captain name first.');
          }
        }
      }
    }
  };

  const handleSelectProfile = (profile: CaptainProfile) => {
    setActiveCaptain(profile.name);
    setActiveSection(profile.section);
    setSelectedProfilePin(profile.pin);
    setPin(''); // Never auto-fill password to preserve captain privacy!
    setErrorMessage(null);
  };

  const handleDel = () => {
    setPin((p) => p.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    setPin('');
    setErrorMessage(null);
  };

  const handleReset = () => {
    setPin('');
    setSelectedProfilePin(null);
    setErrorMessage(null);
    setActiveCaptain('');
    setActiveSection('SECTION A & B');
  };

  const handleLogin = () => {
    if (!activeCaptain || activeCaptain.trim() === '') {
      setErrorMessage('Please select your Captain name first.');
      return;
    }

    if (pin.length < 4) {
      setErrorMessage(`Please enter the 4-digit password for ${activeCaptain}.`);
      return;
    }

    if (expectedPin && pin !== expectedPin) {
      setErrorMessage(`Incorrect password for ${activeCaptain}. Access denied.`);
      return;
    }

    setErrorMessage(null);
    setCurrentScreen(2);
  };

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
            <div className="w-full h-28 border-2 border-dashed border-slate-300 bg-white rounded-xl flex flex-col items-center justify-center gap-2 mb-6">
              <span className="text-3xl">🍗</span>
              <span className="font-mono text-xs font-black tracking-wider text-slate-700">
                Thoogudeepa Donne Biryani
              </span>
            </div>

            <h1 className="text-xl font-black tracking-tight text-slate-950 font-mono">
              THOOGUDEEPA DONNE BIRYANI MANE
            </h1>
            <p className="font-mono text-xs font-extrabold text-orange-600 mt-1 uppercase tracking-wider">
              Floor Captain / Waiter Service Console
            </p>

            {/* Active Shift Announcement */}
            <div className="mt-6 border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2 font-mono text-xs shadow-2xs">
              <span className="font-bold text-slate-500 uppercase text-[10px]">
                Active Shift Announcement:
              </span>
              <div className="font-bold text-slate-900 text-sm">
                Shift A: 08:00 AM - 04:00 PM
              </div>
              <div className="text-slate-600 text-[11px]">
                Assigned Zone: Main Dining Hall • Section A &amp; B
              </div>
              <div className="text-slate-600 text-[11px]">
                Tables Under Management: 16 Active Tables
              </div>
            </div>

            {/* Service Protocol Check */}
            <div className="mt-4 border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2 font-mono text-[11px] shadow-2xs">
              <span className="font-bold text-slate-500 uppercase text-[10px]">
                Service Protocol Check:
              </span>
              <div className="text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Check water bottles &amp; cutlery stands</span>
              </div>
              <div className="text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Confirm kitchen KDS chef connection</span>
              </div>
            </div>
          </div>

          {/* Bottom Company Platform Tag */}
          <div className="border-t border-dashed border-slate-400 pt-4 text-center">
            <span className="font-mono text-[10px] text-slate-500 font-bold">
              Powered by Thoogudeepa Restaurant OS • Tablet Client v2.4
            </span>
          </div>
        </div>

        {/* RIGHT 58%: AUTHENTICATION KEYPAD TERMINAL */}
        <div className="w-[58%] bg-white p-8 flex flex-col justify-center gap-4 overflow-y-auto">
          {/* Top Live Shift Banner (Matching Mobile) */}
          <div className="max-w-[480px] mx-auto w-full rounded-2xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-2.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="font-mono text-[10px] font-bold text-slate-800">
                <span className="text-orange-600 font-black">SHIFT ACTIVE</span> Peak Rush (12:00 - 23:00)
              </div>
            </div>
            <span className="font-mono text-[9px] font-black text-slate-500 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
              POS TERMINAL #01
            </span>
          </div>

          <div className="max-w-[480px] mx-auto w-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  CAPTAIN TERMINAL ACCESS
                </span>
                <h2 className="text-base font-black text-slate-900 font-mono">
                  Floor Captain Verification
                </h2>
              </div>
              {matchedProfile && (
                <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{matchedProfile.role}</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Staff Preset Selector */}
          <div className="max-w-[480px] mx-auto w-full">
            <label className="block font-mono text-xs font-black text-slate-600 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-orange-600" />
                <span>SELECT CAPTAIN PROFILE:</span>
              </span>
              <span className="text-[10px] text-orange-600 font-extrabold uppercase">Tap name to choose</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CAPTAIN_PROFILES.map((prof) => {
                const isSelected = activeCaptain === prof.name;
                return (
                  <button
                    key={prof.pin}
                    type="button"
                    onClick={() => handleSelectProfile(prof)}
                    className={`py-2 px-3 border rounded-xl text-left transition flex items-center gap-2 font-mono shadow-2xs ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/30'
                        : 'border-slate-200 bg-white hover:bg-stone-50 text-slate-700'
                    }`}
                  >
                    <span className="text-lg leading-none">{prof.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black truncate">{prof.name}</div>
                      <div className={`text-[10px] font-bold truncate ${isSelected ? 'text-orange-700' : 'text-slate-500'}`}>
                        {prof.role} • {prof.section}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-orange-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Captain Card */}
          <div className="max-w-[480px] mx-auto w-full">
            <label className="block font-mono text-[11px] font-bold text-slate-600 mb-1 uppercase">
              Selected Captain
            </label>
            <div className="px-4 py-2.5 rounded-xl border border-slate-200 bg-stone-50 flex items-center justify-between font-mono">
              {matchedProfile ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{matchedProfile.avatar}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-black text-slate-900 truncate">{matchedProfile.name}</div>
                    <div className="text-xs font-bold text-slate-500 truncate">{matchedProfile.role} • {matchedProfile.section}</div>
                  </div>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-400 italic">
                  Tap your captain profile above
                </span>
              )}
              {matchedProfile && (
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md shrink-0">
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Floor Section Selection */}
          <div className="max-w-[480px] mx-auto w-full">
            <label className="block font-mono text-[11px] font-bold text-slate-600 mb-1 uppercase">
              Assigned Floor Zone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setActiveSection(sec)}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-mono font-bold transition ${
                    activeSection === sec
                      ? 'border-orange-500 bg-orange-600 text-white shadow-xs ring-1 ring-orange-500/20'
                      : 'border-slate-200 bg-stone-50 text-slate-700 hover:bg-stone-100'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* PIN Lock Indicator - Enlarged Tablet Display */}
          <div className="max-w-[480px] mx-auto w-full">
            <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
              <label className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-orange-600" />
                <span>{activeCaptain ? `4-Digit PIN for ${activeCaptain.toUpperCase()}` : '4-Digit Security PIN'}</span>
              </label>
              <span
                className={`font-black font-mono text-xs ${
                  isVerified
                    ? 'text-emerald-700'
                    : errorMessage
                    ? 'text-rose-600'
                    : 'text-slate-400'
                }`}
              >
                {isVerified
                  ? '✓ PIN VERIFIED'
                  : errorMessage
                  ? '⚠ ACCESS DENIED'
                  : `(${4 - pin.length} digits remaining)`}
              </span>
            </div>

            {/* Prominent 4-Slot POS PIN Box Container */}
            <div
              className={`rounded-2xl border-2 p-3 transition-all flex items-center justify-center shadow-xs ${
                errorMessage
                  ? 'border-rose-400 bg-rose-50/60'
                  : isVerified
                  ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                  : 'border-slate-300 bg-stone-50/90'
              }`}
            >
              <div className="flex items-center justify-center gap-4 py-1">
                {[0, 1, 2, 3].map((idx) => {
                  const filled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                        filled
                          ? isVerified
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-md scale-105'
                            : errorMessage
                            ? 'border-rose-500 bg-rose-500 text-white shadow-sm scale-105'
                            : 'border-slate-900 bg-slate-900 text-white shadow-xs scale-105'
                          : 'border-slate-300 bg-white shadow-2xs'
                      }`}
                    >
                      {filled ? (
                        <span className="text-2xl font-black leading-none">●</span>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error or Verified Status Banner */}
            {errorMessage ? (
              <p className="text-xs font-mono text-rose-600 font-bold mt-2 text-center bg-rose-50 border border-rose-200 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs">
                <span>⚠ {errorMessage}</span>
              </p>
            ) : isVerified ? (
              <p className="text-xs font-mono text-emerald-800 font-black mt-2 text-center bg-emerald-50 border border-emerald-300 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Password Verified for {activeCaptain} • Ready to Unlock Console</span>
              </p>
            ) : (
              <p className="text-xs font-mono text-slate-500 font-bold mt-1.5 text-center">
                {activeCaptain
                  ? `Enter confidential 4-digit PIN for ${activeCaptain}`
                  : 'Select your captain name above to enter password'}
              </p>
            )}
          </div>

          {/* Keypad Grid (Scaled to h-14 with text-xl for 10" Tablet) */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[480px] mx-auto w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNum(num)}
                className="h-14 font-mono text-xl font-black bg-white border border-slate-200 rounded-2xl hover:bg-stone-100 active:scale-95 transition shadow-2xs flex items-center justify-center text-slate-900"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDel}
              className="h-14 font-mono text-xs font-bold bg-stone-100 border border-slate-200 rounded-2xl hover:bg-stone-200 active:scale-95 transition text-slate-700 flex items-center justify-center gap-1"
            >
              <Delete className="h-4 w-4" />
              <span>DEL</span>
            </button>
            <button
              type="button"
              onClick={() => handleNum('0')}
              className="h-14 font-mono text-xl font-black bg-white border border-slate-200 rounded-2xl hover:bg-stone-100 active:scale-95 transition shadow-2xs flex items-center justify-center text-slate-900"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="h-14 font-mono text-xs font-bold bg-stone-100 border border-slate-200 rounded-xl hover:bg-stone-200 active:scale-95 transition text-slate-700 flex items-center justify-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              <span>CLR</span>
            </button>
          </div>

          {/* Action Buttons (Scaled py-4 text-sm font-black for 10" Tablet) */}
          <div className="flex gap-3 max-w-[480px] mx-auto w-full">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-4 border border-slate-300 rounded-2xl font-mono text-sm font-bold text-slate-700 bg-stone-100 hover:bg-stone-200 transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className={`flex-[2] py-4 rounded-2xl font-mono text-sm font-black text-white transition flex items-center justify-center gap-2 active:scale-95 ${
                isVerified
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-600/30 ring-2 ring-orange-400'
                  : 'bg-slate-800 hover:bg-slate-900 shadow-2xs'
              }`}
            >
              <span>Unlock Floor Console</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
