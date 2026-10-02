/**
 * Supabase DB Actions — all INSERT/UPDATE/DELETE operations in one place.
 * Used by customer store (placeOrder), kitchen (updateStage), waiter (ping).
 */

import { supabase } from '../lib/supabase';
import type { CartItem } from '../types/customer';

// ── Canonical dish key (strips [Seat N] tags for same-dish grouping) ─────────
export function getCanonicalDishKey(name: string): string {
  return name
    .replace(/\[seat\s*\d+\]/gi, '')
    .replace(/\[table\s*[^\]]+\]/gi, '')
    .replace(/[\[\]()]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

// ── Customer: Place order → INSERT ticket + items ─────────────────────────────
export async function placeOrderToSupabase(params: {
  tableId: string;
  seatNumber: number;
  customerName: string;
  cartItems: CartItem[];
  ticketId: string;
}) {
  const { tableId, seatNumber, customerName, cartItems, ticketId } = params;

  // 1. Insert the ticket
  const { error: ticketError } = await supabase.from('kds_tickets').insert({
    id: ticketId,
    table_id: tableId,
    seat_number: seatNumber,
    customer_name: customerName || 'Guest',
    status: 'NEW',
  });

  if (ticketError) {
    console.error('[placeOrder] ticket insert error:', ticketError.message);
    throw ticketError;
  }

  // 2. Insert all items
  const itemRows = cartItems.flatMap((ci, idx) =>
    Array.from({ length: 1 }, (_, i) => ({
      id: `${ticketId}-item-${String(idx + 1).padStart(2, '0')}`,
      ticket_id: ticketId,
      name: `${ci.menuItem.name} [Seat ${seatNumber}]`,
      quantity: ci.quantity,
      stage: 'PLACED',
      notes: [ci.selectedOption, ...ci.selectedAddOns].filter(Boolean).join(', '),
      seat_number: seatNumber,
      unit_price: ci.menuItem.price,
    }))
  );

  const { error: itemsError } = await supabase.from('kds_items').insert(itemRows);

  if (itemsError) {
    console.error('[placeOrder] items insert error:', itemsError.message);
    throw itemsError;
  }

  // 3. Mark table as OCCUPIED
  await supabase
    .from('restaurant_tables')
    .update({ status: 'OCCUPIED', active_seats: seatNumber })
    .eq('id', tableId);

  return { success: true, ticketId };
}

// ── Kitchen: Update a single item's stage ────────────────────────────────────
export async function updateItemStage(itemId: string, stage: string) {
  const { error } = await supabase
    .from('kds_items')
    .update({ stage })
    .eq('id', itemId);
  if (error) console.error('[updateItemStage] error:', error.message);
  return !error;
}

// ── Kitchen: Bulk update all items with the same canonical dish name ─────────
export async function bulkUpdateItemStageByName(
  canonicalName: string,
  stage: string,
  ticketIds?: string[]
) {
  // Fetch all matching items (filter by ticket IDs if provided)
  let query = supabase.from('kds_items').select('id, name, ticket_id');
  if (ticketIds?.length) {
    query = query.in('ticket_id', ticketIds);
  }

  const { data, error } = await query;
  if (error || !data) return false;

  const matchingIds = data
    .filter(item => {
      const key = getCanonicalDishKey(item.name);
      return key === canonicalName || key.includes(canonicalName) || canonicalName.includes(key);
    })
    .map(item => item.id);

  if (!matchingIds.length) return false;

  const { error: updateError } = await supabase
    .from('kds_items')
    .update({ stage })
    .in('id', matchingIds);

  if (updateError) console.error('[bulkUpdateStage] error:', updateError.message);
  return !updateError;
}

// ── Kitchen: Mark ticket completed ───────────────────────────────────────────
export async function completeTicket(ticketId: string) {
  const { error } = await supabase
    .from('kds_tickets')
    .update({ status: 'COMPLETED' })
    .eq('id', ticketId);
  if (error) console.error('[completeTicket] error:', error.message);
  return !error;
}

// ── Waiter: Send a ping ───────────────────────────────────────────────────────
export async function sendPing(
  tableId: string,
  seatNumber: number | null,
  type: string
) {
  const { error } = await supabase.from('pings').insert({
    table_id: tableId,
    seat_number: seatNumber,
    type,
    resolved: false,
  });
  if (error) console.error('[sendPing] error:', error.message);
  return !error;
}

// ── Waiter: Resolve a ping ───────────────────────────────────────────────────
export async function resolvePing(pingId: string) {
  const { error } = await supabase
    .from('pings')
    .update({ resolved: true })
    .eq('id', pingId);
  if (error) console.error('[resolvePing] error:', error.message);
  return !error;
}

// ── Waiter: Vacate table ─────────────────────────────────────────────────────
export async function vacateTable(tableId: string) {
  // Complete all remaining tickets for this table
  await supabase
    .from('kds_tickets')
    .update({ status: 'COMPLETED' })
    .eq('table_id', tableId)
    .neq('status', 'COMPLETED');

  // Mark table EMPTY
  const { error } = await supabase
    .from('restaurant_tables')
    .update({ status: 'EMPTY', active_seats: 0 })
    .eq('id', tableId);

  if (error) console.error('[vacateTable] error:', error.message);
  return !error;
}

// ── Fetch all tables ─────────────────────────────────────────────────────────
export async function fetchAllTables() {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .order('id');
  if (error) console.error('[fetchAllTables] error:', error.message);
  return data ?? [];
}
