/**
 * useSharedBridge.ts
 * ──────────────────────────────────────────────────────────────────────
 * The SINGLE source of truth for cross-section real-time state.
 * Customer → Kitchen → Waiter all read and write from here.
 *
 * Flow:
 *  Customer places order → creates a KDS ticket + waiter table bill entry
 *  Customer pings waiter → creates a ping in waiter pings list
 *  Waiter fires KOT    → creates a KDS ticket in kitchen
 *  Kitchen bumps stage → waiter kitchenReadyItems updates
 *  Kitchen marks 86    → customer menu item grays out (is86 flag)
 *  Waiter vacates table → clears table in shared tables
 */

import { create } from 'zustand';
import { INITIAL_MENU_ITEMS } from '../data/menuItems';
import { MenuItem } from '../types/customer';
import { OrderStage } from '../types/customer';

/* ── Shared Types ──────────────────────────────────────────────── */
export interface SharedKDSItem {
  id: string;
  name: string;
  quantity: number;
  stage: OrderStage;
  prepMode: string;
  options?: string;
  addOns?: string[];
}

export interface SharedKDSTicket {
  id: string;
  tableNumber: string;
  serverName: string;
  timestamp: string;
  elapsedMinutes: number;
  status: 'NEW' | 'PREP' | 'READY' | 'COMPLETED';
  items: SharedKDSItem[];
  source: 'CUSTOMER' | 'WAITER'; // who originated the order
}

export interface SharedTable {
  id: string;
  number: string;
  section: string;
  capacity: number;
  status: 'VACANT' | 'OCCUPIED' | 'BILLING' | 'CLEANING';
  guestCount: number;
  seatedTime: string;
  currentBill: number;
  serverName: string;
  kotCount: number;
  mergedWith?: string;
  activeItems?: { name: string; quantity: number; status: string }[];
}

export interface SharedPing {
  id: string;
  tableNumber: string;
  type: string;
  message?: string;
  timestamp: string;
  status: 'PENDING' | 'ACCEPTED' | 'RESOLVED';
  guestName: string;
}

export interface SharedMenuItem86 {
  id: string;
  name: string;
  category: string;
  is86: boolean;
  prepDelayMinutes: number;
}

export interface SharedShiftStats {
  tablesServed: number;
  totalRevenue: number;
  tipsEarned: number;
  avgTurnaroundMinutes: number;
}

/* ── Initial Data ───────────────────────────────────────────────── */
const freshTables: SharedTable[] = [
  { id: 't-1', number: 'A-01', section: 'SECTION A', capacity: 4, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Ramesh', kotCount: 0 },
  { id: 't-2', number: 'A-02', section: 'SECTION A', capacity: 2, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Ramesh', kotCount: 0 },
  { id: 't-3', number: 'A-03', section: 'SECTION A', capacity: 6, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Ramesh', kotCount: 0 },
  { id: 't-4', number: 'A-04', section: 'SECTION A', capacity: 4, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Ramesh', kotCount: 0 },
  { id: 't-5', number: 'B-01', section: 'SECTION B', capacity: 4, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Suresh', kotCount: 0 },
  { id: 't-6', number: 'B-02', section: 'SECTION B', capacity: 2, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Suresh', kotCount: 0 },
  { id: 't-7', number: 'B-03', section: 'SECTION B', capacity: 6, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Suresh', kotCount: 0 },
  { id: 't-8', number: 'C-01', section: 'SECTION C', capacity: 8, status: 'VACANT', guestCount: 0, seatedTime: '--', currentBill: 0, serverName: 'Captain Vijay', kotCount: 0 },
];

const freshInventory86: SharedMenuItem86[] = INITIAL_MENU_ITEMS.map((item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  is86: false,
  prepDelayMinutes: 0,
}));

let ticketCounter = 1;
const makeTicketId = () => `KDS-${String(100 + ticketCounter++).padStart(3, '0')}`;
const nowTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

/* ── Store Interface ────────────────────────────────────────────── */
interface SharedBridgeState {
  // Shared cross-section state
  tables: SharedTable[];
  kdsTickets: SharedKDSTicket[];
  pings: SharedPing[];
  inventory86: SharedMenuItem86[];
  shiftStats: SharedShiftStats;

  // ── Customer actions ────────────────────────────────────────────
  /** Customer places order → adds KDS ticket + sets table as OCCUPIED */
  customerPlacesOrder: (
    tableNumber: string,
    guestName: string,
    guestCount: number,
    items: Array<{ item: MenuItem; selectedOption: string; addOns: string[]; quantity: number }>
  ) => void;

  /** Customer pings waiter */
  customerPingsWaiter: (tableNumber: string, type: string, guestName: string, msg?: string) => void;

  // ── Kitchen actions ─────────────────────────────────────────────
  /** Kitchen bumps an item stage — when ALL items of a ticket are PLATED, 
   *  creates a kitchenReadyItem visible in waiter feed */
  kitchenBumpItemStage: (ticketId: string, itemId: string) => void;
  kitchenBumpTable: (ticketId: string) => void;

  /** Kitchen toggles 86 (out of stock) — affects customer menu immediately */
  kitchenToggle86: (itemId: string) => void;
  kitchenUpdatePrepDelay: (itemId: string, deltaMinutes: number) => void;

  // ── Waiter actions ──────────────────────────────────────────────
  /** Waiter fires KOT → adds KDS ticket to kitchen */
  waiterFiresKOT: (
    tableNumber: string,
    captainName: string,
    items: Array<{ item: MenuItem; selectedOption: string; quantity: number }>
  ) => void;

  /** Waiter seats guests at a table */
  waiterSeatsGuests: (tableNumber: string, guestCount: number, captainName: string) => void;

  /** Waiter merges two tables — combines bills */
  waiterMergeTables: (targetTable: string, sourceTable: string) => void;

  /** Waiter resolves ping */
  waiterResolvePing: (pingId: string) => void;

  /** Waiter records payment */
  waiterRecordsPayment: (tableNumber: string, method: string, amount: number) => void;

  /** Waiter vacates table → sets to CLEANING then VACANT */
  waiterVacatesTable: (tableNumber: string) => void;

  /** Waiter marks a kitchen-ready item as served → removes from waiter feed + updates table item status */
  waiterMarkKitchenItemServed: (ticketId: string, itemId: string) => void;
}

/* ── Store Implementation ───────────────────────────────────────── */
export const useSharedBridge = create<SharedBridgeState>((set, get) => ({
  tables: freshTables,
  kdsTickets: [],
  pings: [],
  inventory86: freshInventory86,
  shiftStats: {
    tablesServed: 0,
    totalRevenue: 0,
    tipsEarned: 0,
    avgTurnaroundMinutes: 38,
  },

  /* ─── Customer Places Order ──────────────────────────────────── */
  customerPlacesOrder: (tableNumber, guestName, guestCount, items) => {
    const ticket: SharedKDSTicket = {
      id: makeTicketId(),
      tableNumber,
      serverName: guestName,
      timestamp: nowTime(),
      elapsedMinutes: 0,
      status: 'NEW',
      source: 'CUSTOMER',
      items: items.map((i, idx) => ({
        id: `ki-c-${Date.now()}-${idx}`,
        name: i.item.name,
        quantity: i.quantity,
        stage: 'PLACED',
        prepMode: i.item.prepMode,
        options: i.selectedOption,
        addOns: i.addOns,
      })),
    };
    const orderTotal = items.reduce((s, i) => s + i.item.price * i.quantity, 0);
    set((state) => ({
      kdsTickets: [...state.kdsTickets, ticket],
      tables: state.tables.map((t) =>
        t.number === tableNumber
          ? {
              ...t,
              status: 'OCCUPIED',
              guestCount: guestCount || t.guestCount || 1,
              seatedTime: nowTime(),
              currentBill: t.currentBill + orderTotal,
              kotCount: t.kotCount + 1,
              activeItems: items.map((i) => ({
                name: i.item.name,
                quantity: i.quantity,
                status: 'Cooking',
              })),
            }
          : t
      ),
    }));
  },

  /* ─── Customer Pings Waiter ──────────────────────────────────── */
  customerPingsWaiter: (tableNumber, type, guestName, msg) => {
    const ping: SharedPing = {
      id: 'p-' + Date.now(),
      tableNumber,
      type,
      message: msg,
      timestamp: nowTime(),
      status: 'PENDING',
      guestName,
    };
    set((state) => ({ pings: [...state.pings, ping] }));
  },

  /* ─── Kitchen Bumps Item Stage ───────────────────────────────── */
  kitchenBumpItemStage: (ticketId, itemId) => {
    const stageOrder: OrderStage[] = ['PLACED', 'PREP', 'PLATED', 'SERVED'];
    set((state) => {
      const newTickets = state.kdsTickets.map((t) => {
        if (t.id !== ticketId) return t;
        const newItems = t.items.map((it) => {
          if (it.id !== itemId) return it;
          const curIdx = stageOrder.indexOf(it.stage);
          const nextStage = curIdx < stageOrder.length - 1 ? stageOrder[curIdx + 1] : stageOrder[curIdx];
          return { ...it, stage: nextStage };
        });
        const allPlated = newItems.every((i) => i.stage === 'PLATED' || i.stage === 'SERVED');
        const allServed = newItems.every((i) => i.stage === 'SERVED');
        return {
          ...t,
          items: newItems,
          status: (allServed ? 'COMPLETED' : allPlated ? 'READY' : 'PREP') as SharedKDSTicket['status'],
        };
      });

      // Update waiter table's activeItems stages
      const updatedTables = state.tables.map((tbl) => {
        const ticket = newTickets.find((tk) => tk.tableNumber === tbl.number && tk.id === ticketId);
        if (!ticket) return tbl;
        return {
          ...tbl,
          activeItems: ticket.items.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            status: it.stage === 'PLATED' ? 'Ready' : it.stage === 'PREP' ? 'Cooking' : it.stage,
          })),
        };
      });

      return { kdsTickets: newTickets, tables: updatedTables };
    });
  },

  /* ─── Kitchen Bumps Entire Table ─────────────────────────────── */
  kitchenBumpTable: (ticketId) => {
    set((state) => ({
      kdsTickets: state.kdsTickets.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'READY',
          items: t.items.map((i) => ({ ...i, stage: 'PLATED' })),
        };
      }),
    }));
  },

  /* ─── Kitchen Toggle 86 ──────────────────────────────────────── */
  kitchenToggle86: (itemId) => {
    set((state) => ({
      inventory86: state.inventory86.map((item) =>
        item.id === itemId ? { ...item, is86: !item.is86 } : item
      ),
    }));
  },

  /* ─── Kitchen Update Prep Delay ──────────────────────────────── */
  kitchenUpdatePrepDelay: (itemId, deltaMinutes) => {
    set((state) => ({
      inventory86: state.inventory86.map((item) =>
        item.id === itemId
          ? { ...item, prepDelayMinutes: Math.max(0, item.prepDelayMinutes + deltaMinutes) }
          : item
      ),
    }));
  },

  /* ─── Waiter Fires KOT ───────────────────────────────────────── */
  waiterFiresKOT: (tableNumber, captainName, items) => {
    const ticket: SharedKDSTicket = {
      id: makeTicketId(),
      tableNumber,
      serverName: captainName,
      timestamp: nowTime(),
      elapsedMinutes: 0,
      status: 'NEW',
      source: 'WAITER',
      items: items.map((i, idx) => ({
        id: `ki-w-${Date.now()}-${idx}`,
        name: i.item.name,
        quantity: i.quantity,
        stage: 'PLACED',
        prepMode: i.item.prepMode,
        options: i.selectedOption,
      })),
    };
    const kotTotal = items.reduce((s, i) => s + i.item.price * i.quantity, 0);
    set((state) => ({
      kdsTickets: [...state.kdsTickets, ticket],
      tables: state.tables.map((t) =>
        t.number === tableNumber
          ? {
              ...t,
              status: 'OCCUPIED',
              currentBill: t.currentBill + kotTotal,
              kotCount: t.kotCount + 1,
              activeItems: [
                ...(t.activeItems || []),
                ...items.map((i) => ({ name: i.item.name, quantity: i.quantity, status: 'Cooking' })),
              ],
            }
          : t
      ),
    }));
  },

  /* ─── Waiter Seats Guests ────────────────────────────────────── */
  waiterSeatsGuests: (tableNumber, guestCount, captainName) => {
    set((state) => ({
      tables: state.tables.map((t) =>
        t.number === tableNumber
          ? { ...t, status: 'OCCUPIED', guestCount, seatedTime: nowTime(), serverName: captainName }
          : t
      ),
    }));
  },

  /* ─── Waiter Merges Two Tables ───────────────────────────────── */
  waiterMergeTables: (targetTable, sourceTable) => {
    set((state) => {
      const target = state.tables.find((t) => t.number === targetTable);
      const source = state.tables.find((t) => t.number === sourceTable);
      if (!target || !source) return state;
      const mergedBill = target.currentBill + source.currentBill;
      const mergedGuests = target.guestCount + source.guestCount;
      return {
        tables: state.tables.map((t) => {
          if (t.number === targetTable) {
            return {
              ...t,
              currentBill: mergedBill,
              guestCount: mergedGuests,
              mergedWith: sourceTable,
              activeItems: [...(t.activeItems || []), ...(source.activeItems || [])],
            };
          }
          if (t.number === sourceTable) {
            return { ...t, status: 'VACANT', currentBill: 0, guestCount: 0, mergedWith: targetTable };
          }
          return t;
        }),
      };
    });
  },

  /* ─── Waiter Resolves Ping ───────────────────────────────────── */
  waiterResolvePing: (pingId) => {
    set((state) => ({ pings: state.pings.filter((p) => p.id !== pingId) }));
  },

  /* ─── Waiter Records Payment ─────────────────────────────────── */
  waiterRecordsPayment: (tableNumber, method, amount) => {
    set((state) => ({
      tables: state.tables.map((t) =>
        t.number === tableNumber ? { ...t, status: 'BILLING' } : t
      ),
      shiftStats: {
        ...state.shiftStats,
        totalRevenue: state.shiftStats.totalRevenue + amount,
        tablesServed: state.shiftStats.tablesServed + 1,
      },
    }));
  },

  /* ─── Waiter Vacates Table ───────────────────────────────────── */
  waiterVacatesTable: (tableNumber) => {
    set((state) => ({
      tables: state.tables.map((t) =>
        t.number === tableNumber
          ? { ...t, status: 'VACANT', currentBill: 0, guestCount: 0, kotCount: 0, seatedTime: '--', activeItems: [] }
          : t
      ),
      // Remove completed KDS tickets for this table
      kdsTickets: state.kdsTickets.filter(
        (tk) => !(tk.tableNumber === tableNumber && tk.status === 'COMPLETED')
      ),
    }));
  },

  /* ─── Waiter Marks Kitchen Item Served ───────────────────────── */
  waiterMarkKitchenItemServed: (ticketId, itemId) => {
    set((state) => ({
      kdsTickets: state.kdsTickets.map((t) => {
        if (t.id !== ticketId) return t;
        const newItems = t.items.map((it) =>
          it.id === itemId ? { ...it, stage: 'SERVED' as OrderStage } : it
        );
        const allServed = newItems.every((i) => i.stage === 'SERVED');
        return { ...t, items: newItems, status: allServed ? 'COMPLETED' : t.status };
      }),
    }));
  },
}));
