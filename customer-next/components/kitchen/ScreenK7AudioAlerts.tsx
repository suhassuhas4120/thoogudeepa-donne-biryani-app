'use client';

import React, { useState } from 'react';
import { KitchenTabletHousing } from './KitchenTabletHousing';
import { useKitchenStore } from '../../store/useKitchenStore';
import { Volume2, VolumeX, Bell, AlertTriangle, Radio, Play, ArrowLeft, ArrowRight } from 'lucide-react';

export const ScreenK7AudioAlerts: React.FC = () => {
  const { setCurrentScreen, soundAlertsEnabled, toggleSoundAlerts } = useKitchenStore();
  const [decibels, setDecibels] = useState(85);
  const [playingTest, setPlayingTest] = useState<string | null>(null);

  const testAudio = (type: string) => {
    setPlayingTest(type);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = type === 'URGENT' ? 880 : 587.33;
      gain.gain.value = 0.2;
      osc.start();
      setTimeout(() => {
        osc.stop();
        setPlayingTest(null);
      }, 350);
    } catch (e) {
      setTimeout(() => setPlayingTest(null), 500);
    }
  };

  return (
    <KitchenTabletHousing screenNumber={7} screenTitle="KITCHEN AUDIO ALERTS & SOUND MONITOR">
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-5 overflow-hidden">
        {/* Master Sound Switch */}
        <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              {soundAlertsEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-sm font-black text-white">INDUSTRIAL AUDIO CHIME MASTER</h2>
              <p className="text-[11px] text-slate-400">High-frequency acoustic chimes designed to pierce noisy exhaust hoods</p>
            </div>
          </div>

          <button
            onClick={toggleSoundAlerts}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              soundAlertsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {soundAlertsEnabled ? 'AUDIO ENABLED' : 'AUDIO MUTED'}
          </button>
        </div>

        {/* Volume & Decibel Calibration */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 mb-4 space-y-3 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Kitchen Decibel Level Output</span>
            <span className="font-mono font-black text-amber-400">{decibels} dB (Industrial Peak)</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            value={decibels}
            onChange={(e) => setDecibels(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        {/* Test Chimes Grid */}
        <div className="flex-1 grid grid-cols-3 gap-3 overflow-y-auto pr-1">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                <Bell className="h-4 w-4" />
                <span>New KOT Order Ping</span>
              </div>
              <p className="text-[11px] text-slate-400">Dual bell tone when customer or waiter punches new order</p>
            </div>
            <button
              onClick={() => testAudio('NEW_ORDER')}
              className="mt-3 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{playingTest === 'NEW_ORDER' ? 'Playing...' : 'Test Sound'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Ticket Delay &gt;15m Buzzer</span>
              </div>
              <p className="text-[11px] text-slate-400">Intermittent 880Hz alert when biryani pot delayed beyond 15 mins</p>
            </div>
            <button
              onClick={() => testAudio('URGENT')}
              className="mt-3 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{playingTest === 'URGENT' ? 'Playing...' : 'Test Sound'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                <Radio className="h-4 w-4" />
                <span>Floor Waiter Call Bell</span>
              </div>
              <p className="text-[11px] text-slate-400">Chime triggered when captain calls kitchen for rush pickup</p>
            </div>
            <button
              onClick={() => testAudio('CALL_BELL')}
              className="mt-3 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{playingTest === 'CALL_BELL' ? 'Playing...' : 'Test Sound'}</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3 shrink-0">
          <button
            onClick={() => setCurrentScreen(6)}
            className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Bump Bar (6)</span>
          </button>
          <button
            onClick={() => setCurrentScreen(8)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
          >
            <span>Next: Recipe Yield Scaler (8)</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </KitchenTabletHousing>
  );
};
