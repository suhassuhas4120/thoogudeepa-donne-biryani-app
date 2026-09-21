'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import { ArrowLeft, CreditCard, Users, Trash2, Utensils, Check } from 'lucide-react';

export const TabletScreen3TableDetail: React.FC = () => {
  const {
    selectedTableNumber,
    setCurrentScreen,
    activeCaptain,
  } = useWaiterStore();
  const { tables, waiterMergeTables } = useSharedBridge();

  const [rightPane, setRightPane] = useState<'default' | 'payment' | 'merge'>('default');
  const [selectedMergeChip, setSelectedMergeChip] = useState<string>('A-02');
  const [mergeConfirmed, setMergeConfirmed] = useState(false);

  const activeTable = tables.find((t) => t.number === selectedTableNumber) || tables[0];
  const runningTotal = activeTable?.currentBill || 0;
  const subtotal = Math.round(runningTotal / 1.05);
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.05);

  const handleConfirmMerge = () => {
    waiterMergeTables(activeTable?.number || selectedTableNumber, selectedMergeChip);
    setMergeConfirmed(true);
    setTimeout(() => setMergeConfirmed(false), 3000);
  };

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={3}
      screenTitle="DETAILED TABLE VIEW &amp; DYNAMIC COMMAND HUB"
    >
      <div className="flex flex-col flex-1 min-h-[700px]">
        {/* TOP HEADER */}
        <div className="border-b-2 border-slate-800 bg-white px-5 py-2.5 flex items-center justify-between shrink-0 font-mono text-xs select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen(2)}
              className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>[⬅ BACK TO ALL TABLES (SCREEN 2)]</span>
            </button>
            <h3 className="font-black text-slate-950 text-sm">
              [{activeTable.number} SELECTED]
            </h3>
            <span className="border border-slate-900 bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-800 text-[11px]">
              [STATUS: {activeTable.status} • DINING]
            </span>
          </div>

          <span className="text-slate-600 font-bold text-[11px]">
            [ASSIGNED FLOOR CAPTAIN: {activeCaptain}]
          </span>
        </div>

        {/* MAIN SPLIT: LEFT 60% / RIGHT 40% */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT 60%: TABLE DETAILS & ACTION BUTTONS */}
          <div className="w-[60%] border-r-2 border-slate-800 p-5 overflow-y-auto bg-slate-50 flex flex-col justify-between gap-4 font-mono">
            <div className="flex flex-col gap-4">
              {/* Running KOT Card */}
              <div className="bg-white border-2 border-slate-300 rounded-xl p-4 flex justify-between items-center shadow-xs">
                <div>
                  <strong className="text-sm font-black text-slate-900 block">
                    [KOT #{activeTable.kotCount || 104} • ORDER PLACED {activeTable.seatedTime || '12:52 PM'}]
                  </strong>
                  <div className="text-[11px] text-slate-500 font-bold mt-0.5">
                    [GUEST COUNT: {activeTable.guestCount || 3} GUESTS • SERVER: {activeCaptain}]
                  </div>
                </div>
                <span className="border-2 border-slate-900 bg-slate-100 px-3 py-1 rounded-md font-black text-slate-950 text-xs">
                  [RUNNING BILL: ₹ {runningTotal.toFixed(2)}]
                </span>
              </div>

              {/* Ordered Items List */}
              <div>
                <span className="font-black text-xs text-slate-900 uppercase tracking-wider block mb-2">
                  [ORDERED ITEMS LIST &amp; PREPARATION TRACKING]:
                </span>

                <div className="flex flex-col gap-2">
                  <div className="bg-white border border-slate-300 rounded-lg p-3 flex justify-between items-center shadow-2xs">
                    <div>
                      <strong className="text-xs font-black text-slate-900">
                        1x Donne Chicken Biryani
                      </strong>
                      <div className="text-[10.5px] text-slate-500 font-bold">
                        [NOTE: LESS SPICE, EXTRA RAITA]
                      </div>
                    </div>
                    <span className="border border-slate-900 bg-amber-50 text-amber-950 px-2 py-0.5 rounded text-[10.5px] font-bold">
                      [STAGE 2: PREPARING]
                    </span>
                  </div>

                  <div className="bg-white border border-slate-300 rounded-lg p-3 flex justify-between items-center shadow-2xs">
                    <div>
                      <strong className="text-xs font-black text-slate-900">
                        2x Chicken Guntur Starter
                      </strong>
                      <div className="text-[10.5px] text-slate-500 font-bold">
                        [NOTE: CRISPY ROAST, LEMON SLICES]
                      </div>
                    </div>
                    <span className="border border-slate-900 bg-emerald-50 text-emerald-950 px-2 py-0.5 rounded text-[10.5px] font-bold">
                      [STAGE 3: READY FOR RUNNER]
                    </span>
                  </div>

                  <div className="bg-white border border-slate-300 rounded-lg p-3 flex justify-between items-center shadow-2xs">
                    <div>
                      <strong className="text-xs font-black text-slate-900">
                        1x Donne Mutton Biryani (Special)
                      </strong>
                      <div className="text-[10.5px] text-slate-500 font-bold">
                        [STANDARD PORTION • SERVED PIPING HOT]
                      </div>
                    </div>
                    <span className="border border-slate-900 bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10.5px] font-bold">
                      [STAGE 4: SERVED]
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Customer Service Notes */}
              <div className="bg-white border border-slate-300 rounded-xl p-3.5 flex flex-col gap-1 text-[11px] shadow-2xs">
                <span className="font-black text-slate-500 uppercase text-[10px]">
                  [SPECIAL CUSTOMER SERVICE NOTES]:
                </span>
                <div className="text-slate-700">
                  • [CUSTOMER REQUEST: EXTRA WATER BOTTLE PROVIDED AT 01:05 PM]
                </div>
                <div className="text-slate-700">
                  • [ALLERGY ALERT: NUT-FREE PREPARATION CONFIRMED WITH HEAD CHEF]
                </div>
              </div>
            </div>

            {/* 4 ACTION BUTTONS IN 60% LEFT (PROPERLY POSITIONED 2x2 GRID) */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentScreen(4)}
                className="py-3.5 px-4 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <Utensils className="h-4 w-4" />
                <span>🍽️ [TAKE ORDERS BUTTON ➔ SCREEN 4]</span>
              </button>

              <button
                type="button"
                onClick={() => setRightPane('payment')}
                className={`py-3.5 px-4 rounded-lg font-black text-xs transition flex items-center justify-center gap-2 shadow-2xs ${
                  rightPane === 'payment'
                    ? 'bg-orange-600 text-white border-2 border-orange-700'
                    : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>💳 [PAYMENT BUTTON (EXPANDS RIGHT 40%)]</span>
              </button>

              <button
                type="button"
                onClick={() => setRightPane('merge')}
                className={`py-3.5 px-4 rounded-lg font-black text-xs transition flex items-center justify-center gap-2 border ${
                  rightPane === 'merge'
                    ? 'bg-slate-900 text-white border-black'
                    : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-400'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>🔗 [MERGE TABLES BUTTON (EXPANDS RIGHT 40%)]</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen(9)}
                className="py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 border border-slate-400 rounded-lg font-black text-xs transition flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>🧹 [TABLE VACATE BUTTON ➔ SCREEN 9]</span>
              </button>
            </div>
          </div>

          {/* RIGHT 40%: DYNAMIC VIEW (CHANGES BASED ON BUTTON CLICKS) */}
          <div className="w-[40%] bg-white p-5 overflow-y-auto flex flex-col justify-between font-mono select-none">
            {rightPane === 'default' && (
              <div className="flex flex-col gap-4">
                <span className="font-black text-xs text-slate-900 uppercase">
                  [RIGHT 40% CONSOLE — LIVE BILL SUMMARY]:
                </span>

                <div className="border-2 border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 bg-slate-50 shadow-xs">
                  <strong className="text-xs font-black text-slate-900">
                    [BILL SUMMARY FOR {activeTable.number}]
                  </strong>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>[SUBTOTAL]:</span>
                    <span>₹ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>[CGST 2.5%]:</span>
                    <span>₹ {(gst / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>[SGST 2.5%]:</span>
                    <span>₹ {(gst / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>[SERVICE CHARGE 5%]:</span>
                    <span>₹ {serviceCharge.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-black text-slate-950">
                    <span>[NET AMOUNT PAYABLE]:</span>
                    <span>₹ {runningTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-3 flex flex-col gap-1 text-[11px] bg-white">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    [CUSTOMER PAYMENT PREFERENCE]:
                  </span>
                  <div className="text-slate-700">• [CUSTOMER PREFERS: CASH OR UPI QR]</div>
                  <div className="text-slate-700">
                    • [LOYALTY MEMBERSHIP: SILVER TIER (50 PTS AVAILABLE)]
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-400 rounded-xl p-4 text-[11px] text-slate-600 bg-slate-50 text-center font-bold">
                  [CLICK [PAYMENT] OR [MERGE TABLES] ON THE LEFT TO OPEN REAL-TIME CONTROLS HERE]
                </div>
              </div>
            )}

            {rightPane === 'payment' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2">
                  <span className="font-black text-xs text-slate-950">
                    [PAYMENT SETTLEMENT PANE — {activeTable.number}]
                  </span>
                  <button
                    onClick={() => setRightPane('default')}
                    className="border border-slate-400 rounded px-2 py-0.5 text-xs font-bold hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 flex flex-col gap-2.5 bg-slate-50">
                  <strong className="text-xs font-black text-slate-900">
                    [CHOOSE SETTLEMENT METHOD]:
                  </strong>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="py-2 bg-slate-900 text-white rounded font-bold text-[11px]">
                      [CASH]
                    </button>
                    <button className="py-2 border border-slate-400 bg-white text-slate-800 rounded font-bold text-[11px] hover:bg-slate-100">
                      [CARD POS]
                    </button>
                    <button className="py-2 border border-slate-400 bg-white text-slate-800 rounded font-bold text-[11px] hover:bg-slate-100">
                      [UPI QR]
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(7)}
                  className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs transition shadow-xs flex items-center justify-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>💳 [OPEN FULL PAYMENT PROCESSING (SCREEN 7) ➔]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(6)}
                  className="w-full py-3 border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold text-xs transition"
                >
                  ⚙️ [OPEN ADVANCED SPLIT BILL OPTIONS (SCREEN 6) ➔]
                </button>
              </div>
            )}

            {rightPane === 'merge' && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b-2 border-slate-800 pb-2">
                  <span className="font-black text-xs text-slate-950">
                    [MERGE TABLES CONTROLLER]
                  </span>
                  <button
                    onClick={() => setRightPane('default')}
                    className="border border-slate-400 rounded px-2 py-0.5 text-xs font-bold hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 flex flex-col gap-2.5 bg-slate-50">
                  <span className="text-[11px] font-bold text-slate-600">
                    [SELECT TABLE TO MERGE WITH {activeTable.number}]:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {['A-01', 'A-02', 'A-03', 'A-05'].map((tbl) => (
                      <button
                        key={tbl}
                        onClick={() => setSelectedMergeChip(tbl)}
                        className={`py-2 px-1 border rounded text-[11px] font-bold transition ${
                          selectedMergeChip === tbl
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        [{tbl}]
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-300 rounded-xl p-4 flex flex-col gap-1.5 text-[11px] bg-white">
                  <strong className="text-xs font-black text-slate-900 mb-1">
                    [MERGED TABLE RESULT PREVIEW]:
                  </strong>
                  <div className="text-slate-700">
                    [COMBINED TABLE: {activeTable.number} + {selectedMergeChip}]
                  </div>
                  <div className="text-slate-700">[TOTAL GUEST CAPACITY: 8 GUESTS]</div>
                  <div className="text-slate-700 font-bold">
                    [CONSOLIDATED RUNNING BILL: ₹ {(runningTotal + 1220).toFixed(2)}]
                  </div>
                </div>

                {mergeConfirmed && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-400 rounded text-emerald-800 text-xs font-bold text-center">
                    ✓ TABLES MERGED SUCCESSFULLY!
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConfirmMerge}
                  className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span>🔗 [CONFIRM MERGE &amp; SYNC BILLS]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen(6)}
                  className="w-full py-3 border border-slate-400 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold text-xs transition"
                >
                  ⚙️ [OPEN TABLE MERGE / SPLIT CUSTOMIZATION (SCREEN 6) ➔]
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
