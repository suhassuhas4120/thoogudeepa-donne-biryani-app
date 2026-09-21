'use client';

import React, { useState } from 'react';
import { useWaiterStore } from '../../../store/useWaiterStore';
import { useSharedBridge } from '../../../store/useSharedBridge';
import { WaiterTabletLandscapeHousing } from './WaiterTabletLandscapeHousing';
import { ArrowLeft, QrCode, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';

type PayMode = 'CASH' | 'UPI' | 'POS';

export const TabletScreen7Payment: React.FC = () => {
  const { setCurrentScreen, selectedTableNumber } = useWaiterStore();
  const { tables, waiterRecordsPayment } = useSharedBridge();
  const [payMode, setPayMode] = useState<PayMode>('CASH');
  const [cashInput, setCashInput] = useState('2000');
  const [paidConfirmed, setPaidConfirmed] = useState(false);

  const activeTable = tables.find((t) => t.number === (selectedTableNumber || 'A-04')) || tables[0];
  const billAmount = activeTable?.currentBill || 0;
  const cashTendered = parseFloat(cashInput.replace(/[^0-9.]/g, '')) || 0;
  const changeToReturn = Math.max(0, cashTendered - billAmount);
  const qrTimer = '04:58';

  const handleConfirmPay = () => {
    waiterRecordsPayment(activeTable?.number || selectedTableNumber, payMode, billAmount);
    setPaidConfirmed(true);
    setTimeout(() => {
      setPaidConfirmed(false);
      setCurrentScreen(8);
    }, 2000);
  };

  return (
    <WaiterTabletLandscapeHousing
      screenNumber={7}
      screenTitle="PAYMENT GATEWAY &amp; QR / CASH SETTLEMENT"
    >
      <div className="flex flex-col flex-1 min-h-[700px] p-5 font-mono select-none">
        {/* TOP HEADER */}
        <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-4 shrink-0">
          <button
            onClick={() => setCurrentScreen(6)}
            className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 text-xs shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>[⬅ BACK TO CUSTOMIZATION (SCREEN 6)]</span>
          </button>
          <h3 className="font-black text-slate-950 text-sm">
            [SCREEN 7: PAYMENT GATEWAY &amp; QR / CASH SETTLEMENT]
          </h3>
          <span className="border border-slate-400 bg-slate-100 px-3 py-1 rounded font-bold text-xs text-slate-700">
            [{activeTable.number} SETTLEMENT]
          </span>
        </div>

        {/* PAYMENT SUCCESS BANNER */}
        {paidConfirmed && (
          <div className="mb-3 p-3 bg-emerald-700 text-white rounded-xl font-black text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 fill-white" />
            ✓ PAYMENT CONFIRMED — REDIRECTING TO BILL GENERATION (SCREEN 8)...
          </div>
        )}

        {/* PAYMENT METHOD SWITCHER */}
        <div className="flex gap-3 mb-4 shrink-0">
          {([
            { mode: 'CASH' as PayMode, icon: '💵', label: 'CASH SETTLEMENT' },
            { mode: 'UPI' as PayMode, icon: '📱', label: 'UPI SCAN & PAY' },
            { mode: 'POS' as PayMode, icon: '💳', label: 'POS SWIPE' },
          ]).map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setPayMode(mode)}
              className={`flex-1 py-3 rounded-xl border-2 font-black text-xs transition flex items-center justify-center gap-2 ${
                payMode === mode
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span>{icon}</span>
              <span>[{label}]</span>
            </button>
          ))}
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* LEFT: QR / VISUAL SECTION */}
          <div className="flex-1 border-2 border-slate-300 rounded-2xl bg-white flex flex-col items-center justify-center gap-4 p-6 text-center shadow-xs">
            {payMode === 'UPI' ? (
              <>
                <div className="w-52 h-52 border-2 border-dashed border-slate-400 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-3">
                  <QrCode className="h-20 w-20 text-slate-800" />
                  <span className="font-mono text-xs font-bold text-slate-600">
                    [QR SCANNER SPACE FOR CUSTOMER UPI / CARD PAYMENT]
                  </span>
                </div>
                <strong className="text-base font-black text-slate-950">
                  [SCAN TO PAY ₹ {billAmount.toLocaleString('en-IN')}.00]
                </strong>
                <span className="font-mono text-xs font-bold text-slate-500">
                  [SUPPORTED: UPI APPS, CREDIT/DEBIT CARDS, NETBANKING]
                </span>
                <div className="border border-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-slate-700">
                  [PAYMENT TIMEOUT: {qrTimer} MINS REMAINING]
                </div>
              </>
            ) : payMode === 'CASH' ? (
              <>
                <span className="text-6xl">💵</span>
                <strong className="text-base font-black text-slate-950">
                  [CASH TENDER COLLECTION]
                </strong>
                <div className="text-2xl font-black text-slate-950 font-mono">
                  ₹ {billAmount.toLocaleString('en-IN')}.00
                </div>
                <span className="font-mono text-xs font-bold text-slate-500">
                  [BILL AMOUNT PAYABLE]
                </span>
                <div className="border border-slate-300 bg-emerald-50 px-4 py-2 rounded-lg font-mono text-sm font-black text-emerald-800">
                  CHANGE: ₹ {changeToReturn.toFixed(2)}
                </div>
              </>
            ) : (
              <>
                <CreditCard className="h-20 w-20 text-slate-800" />
                <strong className="text-base font-black text-slate-950">
                  [POS SWIPE / CARD TERMINAL]
                </strong>
                <div className="text-2xl font-black text-slate-950 font-mono">
                  ₹ {billAmount.toLocaleString('en-IN')}.00
                </div>
                <div className="border border-slate-300 bg-slate-50 px-4 py-2 rounded-lg font-mono text-xs font-bold text-slate-700">
                  [INSERT CARD OR TAP TO PAY ON POS TERMINAL]
                </div>
              </>
            )}
          </div>

          {/* RIGHT: PAYMENT OPTIONS & CASH CALCULATOR */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
            {/* Bill Amount */}
            <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2.5">
              <strong className="text-xs font-black text-slate-900">[PAYMENT OPTIONS]:</strong>
              <div className="flex gap-2">
                {(['CASH SETTLEMENT', 'POS SWIPE', 'UPI SCAN'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPayMode(m === 'CASH SETTLEMENT' ? 'CASH' : m === 'POS SWIPE' ? 'POS' : 'UPI')}
                    className={`flex-1 py-2 rounded border text-[10.5px] font-bold transition ${
                      (m === 'CASH SETTLEMENT' && payMode === 'CASH') ||
                      (m === 'POS SWIPE' && payMode === 'POS') ||
                      (m === 'UPI SCAN' && payMode === 'UPI')
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    [{m}]
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Tendered Calculator */}
            {payMode === 'CASH' && (
              <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2.5">
                <strong className="text-xs font-black text-slate-900">
                  [CASH TENDERED CALCULATOR]:
                </strong>
                <div className="flex justify-between text-xs font-mono text-slate-600">
                  <span>[BILL AMOUNT]:</span>
                  <span>₹ {billAmount.toLocaleString('en-IN')}.00</span>
                </div>

                <div>
                  <label className="block font-bold text-[11px] text-slate-600 mb-1.5 uppercase">
                    [CASH RECEIVED FROM GUEST]:
                  </label>
                  <input
                    type="number"
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    className="w-full border border-slate-400 rounded-lg px-3 py-2 font-mono text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="₹ 0"
                  />
                </div>

                {/* Quick Cash Denomination Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashInput(String(amt))}
                      className="py-1.5 border border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded text-xs font-bold transition"
                    >
                      ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between text-sm font-black text-slate-950 border-t border-dashed border-slate-300 pt-2 font-mono">
                  <span>[CHANGE TO RETURN]:</span>
                  <span className={changeToReturn >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                    ₹ {Math.max(0, changeToReturn).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* POS Reference Entry */}
            {payMode === 'POS' && (
              <div className="border border-slate-300 bg-white rounded-xl p-4 flex flex-col gap-2.5">
                <strong className="text-xs font-black text-slate-900">
                  [POS TRANSACTION REFERENCE]:
                </strong>
                <input
                  type="text"
                  placeholder="[ENTER POS REF ID...]"
                  className="w-full border border-slate-400 rounded-lg px-3 py-2 font-mono text-xs bg-white focus:outline-none"
                />
              </div>
            )}

            {/* Loyalty Redemption */}
            <div className="border border-slate-300 bg-white rounded-xl p-3.5">
              <label className="flex items-center gap-2 text-[11.5px] font-mono cursor-pointer text-slate-800">
                <input type="checkbox" defaultChecked className="accent-slate-900 w-4 h-4" />
                [REDEEM 50 LOYALTY POINTS (-₹50.00 DISCOUNT)]
              </label>
            </div>

            {/* CONFIRM & PAY */}
            <button
              type="button"
              onClick={handleConfirmPay}
              className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-sm transition shadow-sm flex items-center justify-center gap-2 mt-auto"
            >
              <CheckCircle2 className="h-5 w-5 fill-white" />
              <span>✓ [CONFIRM &amp; PAY ➔ GENERATE BILL (SCREEN 8)]</span>
            </button>
          </div>
        </div>
      </div>
    </WaiterTabletLandscapeHousing>
  );
};
