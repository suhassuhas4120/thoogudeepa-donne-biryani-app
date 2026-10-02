'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase, DbKdsTicket, DbKdsItem } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ── Stage ordering for display ────────────────────────────────────────────────
const STAGE_ORDER = { PLACED: 0, PREP: 1, PLATED: 2, SERVED: 3 } as const;

export type ItemStage = 'PLACED' | 'PREP' | 'PLATED' | 'SERVED';
export type TicketStatus = 'NEW' | 'PREP' | 'READY' | 'COMPLETED';

export interface TrackedItem {
  id: string;
  name: string;
  quantity: number;
  stage: ItemStage;
  seatNumber: number | null;
  unitPrice: number;
  notes: string;
}

export interface TrackedTicket {
  id: string;
  tableId: string;
  seatNumber: number | null;
  customerName: string;
  status: TicketStatus;
  items: TrackedItem[];
  overallStage: ItemStage;
  createdAt: string;
}

/**
 * Derives the overall "worst" stage from a list of items.
 * PLACED < PREP < PLATED < SERVED
 */
export function deriveOverallStage(items: TrackedItem[]): ItemStage {
  if (!items.length) return 'PLACED';
  const allServed  = items.every(i => i.stage === 'SERVED');
  const allPlated  = items.every(i => STAGE_ORDER[i.stage] >= STAGE_ORDER.PLATED);
  const anyPrep    = items.some(i => i.stage === 'PREP');
  if (allServed) return 'SERVED';
  if (allPlated) return 'PLATED';
  if (anyPrep)   return 'PREP';
  return 'PLACED';
}

/**
 * Fetches and subscribes to all active (non-completed) tickets for a table.
 * Returns real-time updated ticket list and helper actions.
 */
export function useRealtimeTickets(tableId: string) {
  const [tickets, setTickets] = useState<TrackedTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // ── Helper: map DB rows → TrackedTicket ────────────────────────────────────
  const toTrackedTicket = useCallback(
    (t: DbKdsTicket, items: DbKdsItem[]): TrackedTicket => {
      const trackedItems: TrackedItem[] = items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        stage: i.stage as ItemStage,
        seatNumber: i.seat_number,
        unitPrice: i.unit_price,
        notes: i.notes,
      }));
      return {
        id: t.id,
        tableId: t.table_id,
        seatNumber: t.seat_number,
        customerName: t.customer_name,
        status: t.status as TicketStatus,
        items: trackedItems,
        overallStage: deriveOverallStage(trackedItems),
        createdAt: t.created_at,
      };
    },
    []
  );

  // ── Fetch all active tickets for this table ────────────────────────────────
  const fetchTickets = useCallback(async () => {
    if (!tableId) return;
    const { data, error } = await supabase
      .from('kds_tickets')
      .select('*, kds_items(*)')
      .eq('table_id', tableId)
      .neq('status', 'COMPLETED')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[useRealtimeTickets] fetch error:', error.message);
      return;
    }

    const mapped = (data as (DbKdsTicket & { kds_items: DbKdsItem[] })[]).map(t =>
      toTrackedTicket(t, t.kds_items ?? [])
    );
    setTickets(mapped);
    setIsLoading(false);
  }, [tableId, toTrackedTicket]);

  // ── Subscribe to Supabase Realtime ─────────────────────────────────────────
  useEffect(() => {
    if (!tableId) return;

    fetchTickets();

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`tickets_table_${tableId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kds_tickets',
          filter: `table_id=eq.${tableId}`,
        },
        () => fetchTickets()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'kds_items',
        },
        () => fetchTickets()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [tableId, fetchTickets]);

  return { tickets, isLoading, refetch: fetchTickets };
}

/**
 * Kitchen-wide: subscribes to ALL active tickets across all tables.
 * Used by ScreenK2Overview.
 */
export function useRealtimeAllTickets() {
  const [tickets, setTickets] = useState<TrackedTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const toTrackedTicket = useCallback(
    (t: DbKdsTicket, items: DbKdsItem[]): TrackedTicket => {
      const trackedItems: TrackedItem[] = items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        stage: i.stage as ItemStage,
        seatNumber: i.seat_number,
        unitPrice: i.unit_price,
        notes: i.notes,
      }));
      return {
        id: t.id,
        tableId: t.table_id,
        seatNumber: t.seat_number,
        customerName: t.customer_name,
        status: t.status as TicketStatus,
        items: trackedItems,
        overallStage: deriveOverallStage(trackedItems),
        createdAt: t.created_at,
      };
    },
    []
  );

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from('kds_tickets')
      .select('*, kds_items(*)')
      .neq('status', 'COMPLETED')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[useRealtimeAllTickets] error:', error.message);
      return;
    }

    const mapped = (data as (DbKdsTicket & { kds_items: DbKdsItem[] })[]).map(t =>
      toTrackedTicket(t, t.kds_items ?? [])
    );
    setTickets(mapped);
    setIsLoading(false);
  }, [toTrackedTicket]);

  useEffect(() => {
    fetchAll();

    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const channel = supabase
      .channel('kitchen_all_tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kds_tickets' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kds_items' }, fetchAll)
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchAll]);

  return { tickets, isLoading, refetch: fetchAll };
}
