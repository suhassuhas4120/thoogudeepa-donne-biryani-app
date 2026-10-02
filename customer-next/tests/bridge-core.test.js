/**
 * tests/bridge-core.test.js
 * 
 * Core tests for:
 * 1. Canonical dish key grouping (Same Dish List)
 * 2. Stage sync (Live Tracking)
 * 3. Filter logic
 */

// ─────────────────────────────────────────────────────────
// Re-implement the exact logic from useSharedBridge.ts here
// so we can test without a browser environment
// ─────────────────────────────────────────────────────────

function getCanonicalDishKey(name) {
  return name
    .replace(/\[Seat \d+\]/gi, '')
    .replace(/\[Table [^\]]+\]/gi, '')
    .replace(/[\[\]()]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function toK2Stage(bridgeStage) {
  if (bridgeStage === 'PREP') return 'PREPARING';
  if (bridgeStage === 'PLATED') return 'READY';
  if (bridgeStage === 'SERVED') return 'SERVED';
  return 'RECEIVED'; // PLACED
}

/**
 * Simulate the bulkAggregation useMemo logic from ScreenK2Overview
 */
function computeBulkAggregation(bridgeTickets) {
  const map = new Map();

  bridgeTickets
    .filter((tk) => tk.status !== 'COMPLETED')
    .forEach((tk) => {
      tk.items.forEach((it) => {
        const key = getCanonicalDishKey(it.name);
        const existing = map.get(key);
        const k2Stage = toK2Stage(it.stage);
        const tableLabel = `TBL ${tk.tableNumber} (x${it.quantity})`;
        if (existing) {
          existing.total += it.quantity;
          existing.sources.push(tableLabel);
          existing.stages.push(k2Stage);
          existing.ticketIds.add(tk.id);
        } else {
          map.set(key, {
            displayName: it.name
              .replace(/\s*\[Seat \d+\]/gi, '')
              .replace(/\s*\[Table [^\]]+\]/gi, '')
              .trim(),
            canonical: key,
            total: it.quantity,
            sources: [tableLabel],
            stages: [k2Stage],
            ticketIds: new Set([tk.id]),
          });
        }
      });
    });

  // BUGGY filter (current): b.total >= 2 || b.sources.length >= 1
  // shows everything because sources.length is always >= 1
  const buggyResult = Array.from(map.values())
    .filter((b) => b.total >= 2 || b.sources.length >= 1);

  // CORRECT filter: show only dishes appearing in 2+ tickets OR qty > 1
  const correctResult = Array.from(map.values())
    .filter((b) => b.ticketIds.size >= 2 || b.total > 1);

  return { buggyResult, correctResult, map };
}

function getBulkCurrentStage(stages) {
  if (stages.every((s) => s === 'SERVED')) return 'SERVED';
  if (stages.every((s) => s === 'READY' || s === 'SERVED')) return 'READY';
  if (stages.some((s) => s === 'PREPARING')) return 'PREPARING';
  return 'RECEIVED';
}

// ─────────────────────────────────────────────────────────
// TEST HELPERS
// ─────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

function assertEqual(a, b, msg) {
  const ok = JSON.stringify(a) === JSON.stringify(b);
  if (ok) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    console.error(`     Expected: ${JSON.stringify(b)}`);
    console.error(`     Got:      ${JSON.stringify(a)}`);
    failed++;
  }
}

// ─────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────

// ── TEST SUITE 1: Canonical Key Normalization ─────────────
console.log('\n══ SUITE 1: getCanonicalDishKey normalization ══');

assert(
  getCanonicalDishKey('Special Chicken Donne Biryani [Seat 1]') ===
  getCanonicalDishKey('Special Chicken Donne Biryani [Seat 4]'),
  'Same dish different seat tags → same key'
);

assert(
  getCanonicalDishKey('Special Chicken Donne Biryani [Seat 1]') ===
  getCanonicalDishKey('Special Chicken Donne Biryani'),
  'Dish with seat tag === dish without tag'
);

assert(
  getCanonicalDishKey('Kshatriya Chicken Kebab (Crispy) [Seat 2]') ===
  getCanonicalDishKey('kshatriya chicken kebab crispy'),
  'Parens stripped + case insensitive'
);

assert(
  getCanonicalDishKey('  Special   Chicken   Donne  Biryani  ') ===
  'special chicken donne biryani',
  'Extra whitespace collapsed'
);

assertEqual(
  getCanonicalDishKey('Special Chicken Donne Biryani [Seat 1]'),
  'special chicken donne biryani',
  'Exact canonical form is correct'
);


// ── TEST SUITE 2: Bulk Aggregation - Filter Bug ───────────
console.log('\n══ SUITE 2: Bulk aggregation filter bug ══');

const SINGLE_ITEM_TICKETS = [
  {
    id: 'KDS-101',
    tableNumber: 'A-02',
    status: 'NEW',
    items: [
      { id: 'i1', name: 'Special Chicken Donne Biryani [Seat 1]', quantity: 1, stage: 'PLACED' },
    ],
  },
];

const { buggyResult: buggy1, correctResult: correct1 } = computeBulkAggregation(SINGLE_ITEM_TICKETS);

assert(
  buggy1.length === 1,
  'BUGGY filter shows 1 item (even single qty=1 from 1 table) — confirms the bug'
);

assert(
  correct1.length === 0,
  'CORRECT filter: single dish, single ticket, qty=1 → NOT shown in same-dish list'
);


// ── TEST SUITE 3: Bulk Aggregation - Cross-Table Grouping ─
console.log('\n══ SUITE 3: Cross-table same-dish grouping ══');

const CROSS_TABLE_TICKETS = [
  {
    id: 'KDS-101',
    tableNumber: 'A-02',
    status: 'NEW',
    items: [
      { id: 'i1', name: 'Special Chicken Donne Biryani [Seat 1]', quantity: 1, stage: 'PLACED' },
      { id: 'i2', name: 'Kshatriya Chicken Kebab (Crispy) [Seat 2]', quantity: 1, stage: 'PLACED' },
    ],
  },
  {
    id: 'KDS-102',
    tableNumber: 'C-02',
    status: 'PREP',
    items: [
      { id: 'i3', name: 'Special Chicken Donne Biryani [Seat 1]', quantity: 2, stage: 'PREP' },
      { id: 'i4', name: 'Gunpowder Pepper Chicken Dry [Seat 2]', quantity: 1, stage: 'PLACED' },
    ],
  },
  {
    id: 'KDS-103',
    tableNumber: 'B-01',
    status: 'NEW',
    items: [
      { id: 'i5', name: 'Kshatriya Chicken Kebab (Crispy) [Seat 1]', quantity: 1, stage: 'PLACED' },
    ],
  },
];

const { correctResult: correct3, map: map3 } = computeBulkAggregation(CROSS_TABLE_TICKETS);

// Special Chicken Donne Biryani: appears in KDS-101 (qty=1) + KDS-102 (qty=2) → total=3, ticketIds.size=2
const biryaniEntry = correct3.find(b => b.canonical === 'special chicken donne biryani');
assert(biryaniEntry !== undefined, 'Special Chicken Donne Biryani appears in same-dish list');
assert(biryaniEntry?.total === 3, `Biryani total qty = 3 (got ${biryaniEntry?.total})`);
assert(biryaniEntry?.ticketIds.size === 2, `Biryani appears in 2 tickets (got ${biryaniEntry?.ticketIds.size})`);
assert(biryaniEntry?.sources.length === 2, `Biryani has 2 source entries (got ${biryaniEntry?.sources.length})`);

// Kshatriya Chicken Kebab: appears in KDS-101 + KDS-103 → should appear
const kebabEntry = correct3.find(b => b.canonical.includes('kshatriya'));
assert(kebabEntry !== undefined, 'Kshatriya Kebab appears in same-dish list (cross-table)');
assert(kebabEntry?.ticketIds.size === 2, `Kebab in 2 tickets (got ${kebabEntry?.ticketIds.size})`);
assert(kebabEntry?.total === 2, `Kebab total = 2 (got ${kebabEntry?.total})`);

// Gunpowder only appears once (1 ticket, qty=1)
const gunpowderEntry = correct3.find(b => b.canonical.includes('gunpowder'));
assert(gunpowderEntry === undefined, 'Gunpowder (single ticket, qty=1) NOT shown in same-dish list');

// Verify no duplicates in correct result — each canonical key appears at most once
const canonicalKeys = correct3.map(b => b.canonical);
const uniqueKeys = new Set(canonicalKeys);
assert(canonicalKeys.length === uniqueKeys.size, 'No duplicate dishes in same-dish list');


// ── TEST SUITE 4: Stage Derivation for Live Tracking ─────
console.log('\n══ SUITE 4: Live tracking stage derivation ══');

function deriveOverallStage(items) {
  if (items.length === 0) return 'PLACED'; // fallback
  const allServed = items.every(i => i.stage === 'SERVED');
  const allPlated = items.every(i => i.stage === 'PLATED' || i.stage === 'SERVED');
  const anyPrep   = items.some(i => i.stage === 'PREP');
  if (allServed) return 'SERVED';
  if (allPlated) return 'PLATED';
  if (anyPrep)   return 'PREP';
  return 'PLACED';
}

// All items PLACED → overall PLACED
assertEqual(
  deriveOverallStage([
    { stage: 'PLACED' },
    { stage: 'PLACED' },
  ]),
  'PLACED',
  'All PLACED → overall PLACED'
);

// Any item PREP → overall PREP
assertEqual(
  deriveOverallStage([
    { stage: 'PLACED' },
    { stage: 'PREP' },
  ]),
  'PREP',
  'Any PREP → overall PREP'
);

// All PLATED or SERVED → overall PLATED
assertEqual(
  deriveOverallStage([
    { stage: 'PLATED' },
    { stage: 'SERVED' },
  ]),
  'PLATED',
  'All PLATED/SERVED → overall PLATED'
);

// All SERVED → overall SERVED
assertEqual(
  deriveOverallStage([
    { stage: 'SERVED' },
    { stage: 'SERVED' },
  ]),
  'SERVED',
  'All SERVED → overall SERVED'
);

// Mixed: some PLACED some PREP → PREP (highest active)
assertEqual(
  deriveOverallStage([
    { stage: 'PLACED' },
    { stage: 'PREP' },
    { stage: 'SERVED' },
  ]),
  'PREP',
  'Mixed PLACED+PREP+SERVED → PREP'
);


// ── TEST SUITE 5: Table Number Matching ───────────────────
console.log('\n══ SUITE 5: tableNumber exact match ══');

const TICKETS_FOR_TABLE = [
  { id: 'KDS-101', tableNumber: 'A-04', status: 'NEW', items: [{ id: 'i1', stage: 'PLACED' }] },
  { id: 'KDS-102', tableNumber: 'B-01', status: 'NEW', items: [{ id: 'i2', stage: 'PREP' }] },
  { id: 'KDS-103', tableNumber: 'A-04', status: 'PREP', items: [{ id: 'i3', stage: 'PREP' }] },
  { id: 'KDS-104', tableNumber: 'A-04', status: 'COMPLETED', items: [{ id: 'i4', stage: 'SERVED' }] },
];

const tableNumber = 'A-04';

// Find all non-completed tickets for table A-04
const myTickets = TICKETS_FOR_TABLE.filter(
  t => t.tableNumber === tableNumber && t.status !== 'COMPLETED'
);

assertEqual(myTickets.length, 2, 'Finds 2 active tickets for A-04 (excludes COMPLETED)');
assert(myTickets.every(t => t.tableNumber === 'A-04'), 'All found tickets belong to A-04');
assert(!myTickets.some(t => t.status === 'COMPLETED'), 'No completed tickets in result');

const allItems = myTickets.flatMap(t => t.items);
assertEqual(allItems.length, 2, 'Total 2 items from 2 tickets');
assertEqual(
  deriveOverallStage(allItems),
  'PREP',
  'Overall stage = PREP (one item PLACED, one PREP)'
);


// ── TEST SUITE 6: Stage Propagation from Bulk Action ──────
console.log('\n══ SUITE 6: kitchenSetBulkItemStage match logic ══');

function simulateBulkStageUpdate(tickets, itemName, newStage) {
  const targetKey = getCanonicalDishKey(itemName);
  return tickets.map(t => {
    let changed = false;
    const newItems = t.items.map(it => {
      const itemKey = getCanonicalDishKey(it.name);
      if (itemKey === targetKey || itemKey.includes(targetKey) || targetKey.includes(itemKey)) {
        changed = true;
        return { ...it, stage: newStage };
      }
      return it;
    });
    return changed ? { ...t, items: newItems } : t;
  });
}

const BULK_TEST_TICKETS = [
  {
    id: 'KDS-101',
    tableNumber: 'A-02',
    items: [
      { id: 'i1', name: 'Special Chicken Donne Biryani [Seat 1]', stage: 'PLACED' },
      { id: 'i2', name: 'Kshatriya Chicken Kebab [Seat 2]', stage: 'PLACED' },
    ],
  },
  {
    id: 'KDS-102',
    tableNumber: 'C-02',
    items: [
      { id: 'i3', name: 'Special Chicken Donne Biryani [Seat 4]', stage: 'PLACED' },
      { id: 'i4', name: 'Gunpowder Pepper Chicken', stage: 'PLACED' },
    ],
  },
];

// Apply bulk stage update for biryani → PREP
const updated = simulateBulkStageUpdate(
  BULK_TEST_TICKETS,
  'Special Chicken Donne Biryani', // displayName (no seat tag)
  'PREP'
);

// Check ticket 1 item 1 (biryani with seat 1) → PREP
assert(updated[0].items[0].stage === 'PREP', 'KDS-101 biryani [Seat 1] → PREP');
// Check ticket 1 item 2 (kebab) → unchanged PLACED
assert(updated[0].items[1].stage === 'PLACED', 'KDS-101 kebab → still PLACED');
// Check ticket 2 item 1 (biryani with seat 4) → PREP
assert(updated[1].items[0].stage === 'PREP', 'KDS-102 biryani [Seat 4] → PREP');
// Check ticket 2 item 2 (gunpowder) → unchanged
assert(updated[1].items[1].stage === 'PLACED', 'KDS-102 gunpowder → still PLACED');


// ─────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('ALL TESTS PASSED ✅');
} else {
  console.log(`${failed} TEST(S) FAILED ❌`);
  process.exit(1);
}
