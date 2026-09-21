'use client';

import React, { useState, useEffect } from 'react';
import { useSharedBridge } from '../../store/useSharedBridge';
import { useManagerStore } from '../../store/useManagerStore';
import { INITIAL_MENU_ITEMS } from '../../data/menuItems';
import { IndianRupee, Printer, Percent, Trash2, Plus, Minus, CreditCard, QrCode, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';

export function ScreenM4BillingPOS() {
  const { tables, waiterRecordsPayment, waiterVacatesTable } = useSharedBridge();
  const { selectedTableNumber, setSelectedTableNumber, setCurrentScreen } = useManagerStore();

  const selectedTable = tables.find((t) => t.number === selectedTableNumber) || tables[0];

  // Editable bill items
  const [items, setItems] = useState([
    { id: 1, name: 'Special Chicken Donne Biryani', price: 290, qty: 2, isFree: false },
    { id: 2, name: 'Mutton Chops Fry (Dry)', price: 340, qty: 1, isFree: false },
    { id: 3, name: 'Guntur Chicken Wings', price: 260, qty: 1, isFree: false },
    { id: 4, name: 'Special Filter Coffee', price: 40, qty: 2, isFree: false },
  ]);

  // Synchronize items with selected table's real running items if present
  useEffect(() => {
    if (selectedTable?.activeItems && selectedTable.activeItems.length > 0) {
      setItems(
        selectedTable.activeItems.map((ai, idx) => {
          const menuItem = INITIAL_MENU_ITEMS.find((m) => m.name === ai.name);
          return {
            id: idx + 1,
            name: ai.name,
            price: menuItem ? menuItem.price : 290,
            qty: ai.quantity,
            isFree: false,
          };
        })
      );
    }
  }, [selectedTableNumber, selectedTable?.activeItems]);

  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI' | 'AGGREGATOR'>('UPI');
  const [cashTendered, setCashTendered] = useState('1500');
  const [settledSuccess, setSettledSuccess] = useState(false);

  // Math
  const subtotal = items.reduce((acc, item) => acc + (item.isFree ? 0 : item.price * item.qty), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const cgst = Math.round(taxableAmount * 0.025);
  const sgst = Math.round(taxableAmount * 0.025);
  const grandTotal = taxableAmount + cgst + sgst;
  const tenderedNum = Number(cashTendered) || 0;
  const changeDue = Math.max(0, tenderedNum - grandTotal);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const toggleFree = (id: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isFree: !it.isFree } : it))
    );
  };

  const handleSettle = () => {
    waiterRecordsPayment(selectedTable.number, paymentMethod, grandTotal);
    waiterVacatesTable(selectedTable.number);
    setSettledSuccess(true);
    setTimeout(() => {
      setSettledSuccess(false);
      setCurrentScreen(2); // Jump to overview
    }, 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* Left Bill Items Editor */}
      <div className="md:col-span-7 bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                  [TAX INVOICE BILL]
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">INV-8942</span>
              </div>
              <h3 className="text-base font-black font-mono text-slate-900 mt-1">
                THOOGUDEEPA DONNE BIRYANI MANE
              </h3>
            </div>
            {/* Table Selector */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-600">TABLE:</span>
              <select
                value={selectedTableNumber}
                onChange={(e) => setSelectedTableNumber(e.target.value)}
                className="bg-stone-50 border-2 border-slate-900 rounded-lg px-2.5 py-1 font-mono text-xs font-black text-slate-900 focus:outline-none"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.number}>
                    Table {t.number} ({t.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-500 text-left">
                  <th className="pb-2">ITEM DESCRIPTION</th>
                  <th className="pb-2 text-center">QTY</th>
                  <th className="pb-2 text-right">PRICE</th>
                  <th className="pb-2 text-right">TOTAL</th>
                  <th className="pb-2 text-center">DEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-stone-50">
                    <td className="py-2.5 font-bold text-slate-800">
                      <div>{it.name}</div>
                      {it.isFree && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold">
                          [COMPLIMENTARY / FREE]
                        </span>
                      )}
                    </td>
                    <td className="py-2.5">
                      {/* Stepper */}
                      <div className="inline-flex items-center border border-slate-900 rounded bg-white overflow-hidden">
                        <button
                          onClick={() => updateQty(it.id, -1)}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 font-black"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold">{it.qty}</span>
                        <button
                          onClick={() => updateQty(it.id, 1)}
                          className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 font-black"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-700">₹ {it.price}</td>
                    <td className="py-2.5 text-right font-black text-slate-900">
                      ₹ {it.isFree ? '0.00' : (it.price * it.qty).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Discount Bar */}
          <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-slate-300">
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Percent className="h-3.5 w-3.5 text-orange-600" />
                <span>APPLY SPECIAL BILL DISCOUNT:</span>
              </span>
              <span className="text-orange-600">{discountPercent}% APPLIED</span>
            </div>
            <div className="flex gap-2">
              {[0, 5, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`flex-1 py-1 rounded border font-mono text-xs font-bold transition ${
                    discountPercent === pct
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-stone-100'
                  }`}
                >
                  {pct === 0 ? 'NONE' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-300 font-mono text-xs space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold">₹ {subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Special Discount ({discountPercent}%):</span>
              <span>- ₹ {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>CGST (2.5%):</span>
            <span>₹ {cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>SGST (2.5%):</span>
            <span>₹ {sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-900">
            <span>GRAND TOTAL PAYABLE:</span>
            <span>₹ {grandTotal.toLocaleString('en-IN')}.00</span>
          </div>
        </div>
      </div>

      {/* Right Payment Methods & Settlement */}
      <div className="md:col-span-5 bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_#0f172a] flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-black font-mono text-slate-900 pb-3 border-b border-slate-200 uppercase">
            Payment &amp; Settlement Desk
          </h3>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setPaymentMethod('UPI')}
              className={`p-3 rounded-lg border-2 font-mono text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                paymentMethod === 'UPI'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-stone-50'
              }`}
            >
              <QrCode className="h-5 w-5" />
              <span>UPI DYNAMIC QR</span>
            </button>
            <button
              onClick={() => setPaymentMethod('CASH')}
              className={`p-3 rounded-lg border-2 font-mono text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                paymentMethod === 'CASH'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-stone-50'
              }`}
            >
              <Banknote className="h-5 w-5" />
              <span>CASH COUNTER</span>
            </button>
            <button
              onClick={() => setPaymentMethod('CARD')}
              className={`p-3 rounded-lg border-2 font-mono text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                paymentMethod === 'CARD'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-stone-50'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>CARD EDC SWIPE</span>
            </button>
            <button
              onClick={() => setPaymentMethod('AGGREGATOR')}
              className={`p-3 rounded-lg border-2 font-mono text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                paymentMethod === 'AGGREGATOR'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-stone-50'
              }`}
            >
              <Smartphone className="h-5 w-5" />
              <span>SWIGGY / ZOMATO</span>
            </button>
          </div>

          {/* Cash Tendered Box */}
          {paymentMethod === 'CASH' && (
            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-slate-300 font-mono text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700">CASH TENDERED:</span>
                <input
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  className="w-28 text-right bg-white border border-slate-900 rounded p-1 font-mono font-bold"
                />
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>CHANGE DUE:</span>
                <span className="text-emerald-700">₹ {changeDue.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          )}

          {/* QR Code Demo Box */}
          {paymentMethod === 'UPI' && (
            <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-slate-300 text-center font-mono">
              <div className="w-24 h-24 mx-auto bg-white border-2 border-slate-900 p-1 flex items-center justify-center shadow-xs">
                <QrCode className="w-full h-full text-slate-900" />
              </div>
              <div className="text-xs font-bold text-slate-800 mt-2">
                UPI ID: thoogudeepabiryani@icici
              </div>
              <p className="text-[10px] text-slate-500">Auto-verifies on soundbox announcement</p>
            </div>
          )}
        </div>

        {/* Settlement Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 space-y-2.5">
          {settledSuccess ? (
            <div className="bg-emerald-50 border-2 border-emerald-600 p-3 rounded-xl text-center font-mono text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>BILL SETTLED SUCCESSFULLY! TILL CASH UPDATED</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleSettle}
                className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-600 transition shadow-[3px_3px_0px_#0f172a]"
              >
                <span>COLLECT ₹{grandTotal} &amp; SETTLE BILL ➔</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert(`Thermal Tax Invoice Printed for ₹${grandTotal}`)}
                  className="bg-stone-100 border border-slate-300 py-2 rounded-lg font-mono text-xs font-bold text-slate-700 hover:bg-stone-200 transition text-center flex items-center justify-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>PRINT INVOICE</span>
                </button>
                <button
                  onClick={() => alert('Digital Invoice sent via WhatsApp!')}
                  className="bg-stone-100 border border-slate-300 py-2 rounded-lg font-mono text-xs font-bold text-slate-700 hover:bg-stone-200 transition text-center"
                >
                  WHATSAPP BILL
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
