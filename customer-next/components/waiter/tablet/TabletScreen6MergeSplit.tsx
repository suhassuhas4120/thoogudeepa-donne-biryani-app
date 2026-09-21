'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import { ArrowLeft, Users, CreditCard, CheckCircle2 } from 'lucide-react';

export const TabletScreen6MergeSplit: React.FC = () => {
  const { setCurrentScreen, selectedTableNumber } = useWaiterStore();
  const { tables, waiterMergeTables } = useSharedBridge();

  const [selectedMergeTables, setSelectedMergeTables] = useState<string[]>([
    selectedTableNumber || 'A-04',
    'A-05',
  ]);
  const [splitMethod, setSplitMethod] = useState<'ITEMS' | 'PERSONS'>('ITEMS');
  const [splitPersons, setSplitPersons] = useState(2);
  const [tipPercent, setTipPercent] = useState(15);
  const [mergeConfirmed, setMergeConfirmed] = useState(false);

  const activeTable = tables.find((t) => t.number === (selectedTableNumber || 'A-04')) || tables[0];
  const runningBill = activeTable?.currentBill || 0;
  const perPersonShare = Math.round(runningBill / splitPersons);
  const tipAmount = Math.round(runningBill * tipPercent / 100);
  const grandTotal = runningBill + tipAmount;

  const availableTables = tables
    .filter((t) => t.number !== (selectedTableNumber || 'A-04'))
    .slice(0, 7)
    .map((t) => t.number);

  const toggleMerge = (tableNum: string) => {
    const primary = selectedTableNumber || 'A-04';
    if (tableNum === primary) return;
    setSelectedMergeTables((prev) =>
      prev.includes(tableNum)
        ? prev.filter((t) => t !== tableNum && t !== primary)
        : [...prev, tableNum]
    );
  };

  const handleConfirmMerge = () => {
    if (selectedMergeTables.length >= 2) {
      waiterMergeTables(selectedMergeTables[0], selectedMergeTables[1]);
    }
    setMergeConfirmed(true);
    setTimeout(() => setMergeConfirmed(false), 3000);
  };

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={6}
      screenTitle="TABLE MERGE / SPLIT &amp; PAYMENT CUSTOMIZATION"
    >
      <div className="flex flex-col flex-1 min-h-[700px] p-5 font-mono select-none">
        {/* TOP HEADER */}
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4 shrink-0">
          <button
            onClick={() => setCurrentScreen(3)}
            className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 text-xs shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>[⬅ BACK TO {selectedTableNumber || 'TABLE'}]</span>
          </button>
          <h3 className="font-black text-slate-950 text-sm">
            [SCREEN 6: DETAILED TABLE &amp; PAYMENT CUSTOMIZATION]
          </h3>
          <span className="border border-slate-400 bg-slate-100 px-3 py-1 rounded font-bold text-xs text-slate-700">
            [MERGE / SPLIT CONTROLLER]
          </span>
        </div>

        {/* MAIN CONTENT: TWO COLUMNS */}
        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* LEFT COLUMN: TABLE MERGE & SPLIT */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* MERGE TABLES BY TABLE NUMBERS */}
            <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-3">
              <strong className="text-xs font-black text-slate-900">
                [1. MERGE TABLES BY TABLE NUMBERS]:
              </strong>
              <span className="text-[11px] font-bold text-slate-600">
                [SELECT TABLE NUMBERS TO MERGE TOGETHER]:
              </span>

              <div className="grid grid-cols-4 gap-2">
                {[(selectedTableNumber || 'A-04'), ...availableTables.slice(0, 7)].map((tbl) => {
                  const isPrimary = tbl === (selectedTableNumber || 'A-04');
                  const isSelected = selectedMergeTables.includes(tbl);
                  return (
                    <button
                      key={tbl}
                      onClick={() => toggleMerge(tbl)}
                      disabled={isPrimary}
                      className={`py-2.5 px-1 border rounded-lg text-[11.5px] font-bold transition ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      } ${isPrimary ? 'cursor-default opacity-80' : ''}`}
                    >
                      [{tbl}]
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-bold text-slate-600">
                [MERGED STATUS: {selectedMergeTables.join(' & ')} COMBINED]
              </div>
              <div className="text-[11px] font-bold text-slate-600">
                [TOTAL COMBINED SEATING: {selectedMergeTables.length * 3} GUESTS • CONSOLIDATED
                BILL: ₹ {(runningBill * selectedMergeTables.length).toLocaleString('en-IN')}.00]
              </div>

              {mergeConfirmed && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-400 rounded text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  ✓ TABLES MERGED SUCCESSFULLY — BILLS CONSOLIDATED!
                </div>
              )}
            </div>

            {/* SPLIT TABLE OR BILL */}
            <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-3">
              <strong className="text-xs font-black text-slate-900">[2. SPLIT TABLE OR BILL]:</strong>
              <div className="flex gap-2.5">
                {(['ITEMS', 'PERSONS'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setSplitMethod(method)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold transition ${
                      splitMethod === method
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    [SPLIT BY {method}]
                  </button>
                ))}
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-1">
                  [SPECIFY NUMBER OF PERSONS TO SPLIT]:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSplitPersons((n) => Math.max(1, n - 1))}
                    className="w-9 h-9 border-2 border-slate-800 rounded font-black text-slate-900 hover:bg-slate-100"
                  >
                    −
                  </button>
                  <span className="text-xl font-black text-slate-950 font-mono w-8 text-center">
                    {splitPersons}
                  </span>
                  <button
                    onClick={() => setSplitPersons((n) => Math.min(12, n + 1))}
                    className="w-9 h-9 border-2 border-slate-800 rounded font-black text-slate-900 hover:bg-slate-100"
                  >
                    +
                  </button>
                  <span className="text-[11px] font-bold text-slate-500">PERSONS</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen(4)}
              className="border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs px-4 py-3 transition flex items-center justify-center gap-2"
            >
              🍽️ [BACK TO MENU TO TAKE ORDERS FOR CUSTOMISED TABLE ➔]
            </button>
          </div>

          {/* RIGHT COLUMN: PAYMENT CUSTOMIZATION */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* Payment Customization & Split Breakdown */}
            <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-3">
              <strong className="text-xs font-black text-slate-900">
                [PAYMENT CUSTOMIZATION &amp; SPLIT BREAKDOWN]:
              </strong>

              <div className="flex flex-col gap-2 font-mono text-xs">
                {Array.from({ length: splitPersons }, (_, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-dashed border-slate-200 pb-1.5 text-slate-700"
                  >
                    <span>[PERSON {i + 1} SHARE]:</span>
                    <span className="font-bold">₹ {perPersonShare.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-2">
                  [WAITER TIPS PRESETS]:
                </span>
                <div className="flex gap-2">
                  {[10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTipPercent(pct)}
                      className={`flex-1 py-2 rounded border text-xs font-bold transition ${
                        tipPercent === pct
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      [{pct}%]
                    </button>
                  ))}
                  <button
                    onClick={() => setTipPercent(0)}
                    className={`flex-1 py-2 rounded border text-xs font-bold transition ${
                      tipPercent === 0
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    [CUSTOM]
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2 font-mono text-xs">
              <strong className="text-xs font-black text-slate-900">[PAYMENT SUMMARY]:</strong>
              <div className="flex justify-between text-slate-600">
                <span>[SPLIT TOTAL]:</span>
                <span>₹ {runningBill.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>[TIP ADDED ({tipPercent}%)]:</span>
                <span>₹ {tipAmount.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 border-t border-slate-900 pt-2 mt-1">
                <span>[GRAND TOTAL PAYABLE]:</span>
                <span>₹ {grandTotal.toLocaleString('en-IN')}.00</span>
              </div>
            </div>

            {/* Merge Confirm Button */}
            <button
              onClick={handleConfirmMerge}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-xs transition shadow-sm flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" />
              <span>🔗 [CONFIRM MERGE &amp; SYNC BILLS]</span>
            </button>

            {/* Proceed to Payment */}
            <button
              onClick={() => setCurrentScreen(7)}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>💳 [PROCEED TO PAYMENT SCREEN 7 ➔]</span>
            </button>
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
