import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 20,
    },
  },
  db: {
    schema: 'public',
  },
});

// ── Database Types ────────────────────────────────────────────────────────────
export interface DbRestaurantTable {
  id: string;              // 'A-01'
  section: string;         // 'A'
  number: number;
  capacity: number;
  status: 'EMPTY' | 'OCCUPIED' | 'RESERVED' | 'CLEANING';
  active_seats: number;
  merged_with: string[];
  updated_at: string;
}

export interface DbKdsTicket {
  id: string;              // 'KDS-A01-1728123456-001'
  table_id: string;
  seat_number: number | null;
  customer_name: string;
  status: 'NEW' | 'PREP' | 'READY' | 'COMPLETED';
  created_at: string;
  updated_at: string;
}

export interface DbKdsItem {
  id: string;
  ticket_id: string;
  name: string;
  quantity: number;
  stage: 'PLACED' | 'PREP' | 'PLATED' | 'SERVED';
  notes: string;
  seat_number: number | null;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

export interface DbPing {
  id: string;
  table_id: string;
  seat_number: number | null;
  type: 'WATER' | 'TISSUE' | 'CUTLERY' | 'TABLE_CLEAN' | 'CALL_WAITER';
  resolved: boolean;
  created_at: string;
}

// ── Ticket with nested items (joined) ────────────────────────────────────────
export interface DbKdsTicketWithItems extends DbKdsTicket {
  kds_items: DbKdsItem[];
}
