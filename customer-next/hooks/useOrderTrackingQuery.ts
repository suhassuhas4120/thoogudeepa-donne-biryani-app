import { useQuery } from '@tanstack/react-query';
import { useCustomerStore } from '../store/useCustomerStore';
import { useSharedBridge } from '../store/useSharedBridge';

/**
 * useOrderTrackingQuery
 *
 * Polls the bridge kdsTickets every 3 seconds and returns the latest
 * non-completed ticket items for this table. This is a guaranteed
 * fallback for when BroadcastChannel messages are missed (mobile sleep,
 * tab throttling, etc.).
 *
 * - Primary sync: BroadcastChannel (0ms latency, same device)
 * - Secondary sync: localStorage polling (3s, same device)
 * - This hook: forces React Query refetch every 3s as UI guarantee
 */
export function useOrderTrackingQuery() {
  const tableNumber = useCustomerStore((s) => s.tableNumber);

  // React Query: refetch every 3s — forces re-render even if Zustand selector missed
  const query = useQuery({
    queryKey: ['orderTracking', tableNumber],
    queryFn: async () => {
      // Read directly from bridge (in-memory, no network needed)
      const state = useSharedBridge.getState();
      const myTickets = state.kdsTickets.filter(
        (t) => t.tableNumber === tableNumber && t.status !== 'COMPLETED'
      );
      const allItems = myTickets.flatMap((t) => t.items);
      return {
        tableNumber,
        ticketCount: myTickets.length,
        itemCount: allItems.length,
        // Return a hash so React Query sees a "change" when stage changes
        stageHash: allItems.map((i) => `${i.id}:${i.stage}`).join('|'),
        timestamp: Date.now(),
      };
    },
    refetchInterval: 3000,      // Poll every 3 seconds as guarantee
    staleTime: 1000,            // Consider fresh for 1 second
    refetchOnWindowFocus: true, // Immediately re-read on tab focus
    refetchIntervalInBackground: false,
  });

  return {
    isFetching: query.isFetching,
    ticketCount: query.data?.ticketCount ?? 0,
    stageHash: query.data?.stageHash ?? '',
  };
}
