/**
 * Supabase DB Actions — aligned with production schema
 * Tables: orders, kds_tickets, order_items, tables, payments
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

// ── Customer: Place order → INSERT into orders, kds_tickets, order_items ─────
export async function placeOrderToSupabase(params: {
  tableId: string;
  seatNumber: number;
  customerName: string;
  cartItems: CartItem[];
  ticketId: string;
}) {
  const { tableId, seatNumber, customerName, cartItems, ticketId } = params;

  const orderId = `ORD-${tableId.replace('-', '')}-${Date.now()}`;
  const subtotal = cartItems.reduce((acc, c) => acc + (c.totalPrice || c.menuItem.price * c.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + tax;

  // 1. Insert Order
  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    table_number: tableId,
    guest_name: customerName || `Seat ${seatNumber}`,
    guest_count: 1,
    subtotal,
    tax,
    total_amount: totalAmount,
    status: 'UNPAID',
    source: 'CUSTOMER',
  });

  if (orderError) {
    console.error('[placeOrderToSupabase] Order insert error:', orderError.message);
    throw orderError;
  }

  // 2. Insert KDS Ticket
  const { error: ticketError } = await supabase.from('kds_tickets').insert({
    id: ticketId,
    order_id: orderId,
    table_number: tableId,
    server_name: customerName || `Seat ${seatNumber}`,
    status: 'NEW',
  });

  if (ticketError) {
    console.error('[placeOrderToSupabase] Ticket insert error:', ticketError.message);
  }

  // 3. Insert Order Items
  const itemRows = cartItems.map((ci, idx) => ({
    id: `${orderId}-item-${String(idx + 1).padStart(2, '0')}`,
    order_id: orderId,
    name: `${ci.menuItem.name} [Seat ${seatNumber}]`,
    quantity: ci.quantity,
    unit_price: ci.menuItem.price,
    total_price: ci.totalPrice || ci.menuItem.price * ci.quantity,
    stage: 'PLACED',
    prep_mode: ci.prepMode || 'Handi',
    selected_option: ci.selectedOption || 'Regular',
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(itemRows);

  if (itemsError) {
    console.error('[placeOrderToSupabase] Items insert error:', itemsError.message);
    throw itemsError;
  }

  // 4. Update table status to OCCUPIED
  await supabase
    .from('tables')
    .update({ status: 'OCCUPIED', updated_at: new Date().toISOString() })
    .eq('number', tableId);

  return { success: true, orderId, ticketId };
}

// ── Kitchen: Update a single item's stage ────────────────────────────────────
export async function updateItemStage(itemId: string, stage: string) {
  const { error } = await supabase
    .from('order_items')
    .update({ stage })
    .eq('id', itemId);
  if (error) console.error('[updateItemStage] error:', error.message);
  return !error;
}

// ── Kitchen: Bulk update all items with the same canonical dish name ─────────
export async function bulkUpdateItemStageByName(
  canonicalName: string,
  stage: string,
  orderIds?: string[]
) {
  let query = supabase.from('order_items').select('id, name, order_id');
  if (orderIds?.length) {
    query = query.in('order_id', orderIds);
  }

  const { data, error } = await query;
  if (error || !data) return false;

  const matchingIds = data
    .filter((item) => {
      const key = getCanonicalDishKey(item.name);
      return key === canonicalName || key.includes(canonicalName) || canonicalName.includes(key);
    })
    .map((item) => item.id);

  if (!matchingIds.length) return false;

  const { error: updateError } = await supabase
    .from('order_items')
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

// ── Waiter / Customer: Vacate table ──────────────────────────────────────────
export async function vacateTable(tableNumber: string) {
  // Complete all open tickets for this table
  await supabase
    .from('kds_tickets')
    .update({ status: 'COMPLETED' })
    .eq('table_number', tableNumber)
    .neq('status', 'COMPLETED');

  // Mark table VACANT
  const { error } = await supabase
    .from('tables')
    .update({ status: 'VACANT', current_bill: 0, guest_count: 0, updated_at: new Date().toISOString() })
    .eq('number', tableNumber);

  if (error) console.error('[vacateTable] error:', error.message);
  return !error;
}
