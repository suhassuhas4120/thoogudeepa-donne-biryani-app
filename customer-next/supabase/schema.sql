-- ═══════════════════════════════════════════════════════════════════════════
-- THOOGUDEEPA DONNE BIRYANI MANE — SUPABASE SCHEMA
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Restaurant Tables ─────────────────────────────────────────────────────
DROP TABLE IF EXISTS pings CASCADE;
DROP TABLE IF EXISTS kds_items CASCADE;
DROP TABLE IF EXISTS kds_tickets CASCADE;
DROP TABLE IF EXISTS restaurant_tables CASCADE;
DROP TABLE IF EXISTS shift_stats CASCADE;

CREATE TABLE restaurant_tables (
  id          TEXT PRIMARY KEY,            -- 'A-01', 'B-03', etc.
  section     TEXT NOT NULL,               -- 'A', 'B', 'TERRACE', 'FAMILY_DINING'
  number      INTEGER NOT NULL,
  capacity    INTEGER DEFAULT 4,
  status      TEXT DEFAULT 'EMPTY',        -- EMPTY | OCCUPIED | RESERVED | CLEANING
  active_seats INTEGER DEFAULT 0,
  merged_with TEXT[] DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. KDS Tickets ───────────────────────────────────────────────────────────
CREATE TABLE kds_tickets (
  id            TEXT PRIMARY KEY,          -- 'KDS-A01-1728123456-001'
  table_id      TEXT REFERENCES restaurant_tables(id) ON DELETE CASCADE,
  seat_number   INTEGER,                   -- NULL = whole-table order
  customer_name TEXT DEFAULT 'Guest',
  status        TEXT DEFAULT 'NEW',        -- NEW | PREP | READY | COMPLETED
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. KDS Items ─────────────────────────────────────────────────────────────
CREATE TABLE kds_items (
  id          TEXT PRIMARY KEY,
  ticket_id   TEXT REFERENCES kds_tickets(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,              -- 'Special Chicken Donne Biryani [Seat 1]'
  quantity    INTEGER DEFAULT 1,
  stage       TEXT DEFAULT 'PLACED',      -- PLACED | PREP | PLATED | SERVED
  notes       TEXT DEFAULT '',
  seat_number INTEGER,
  unit_price  NUMERIC DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Pings (Waiter calls from customer) ────────────────────────────────────
CREATE TABLE pings (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_id    TEXT REFERENCES restaurant_tables(id) ON DELETE CASCADE,
  seat_number INTEGER,
  type        TEXT DEFAULT 'CALL_WAITER', -- WATER | TISSUE | CUTLERY | TABLE_CLEAN | CALL_WAITER
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. Shift Stats ───────────────────────────────────────────────────────────
CREATE TABLE shift_stats (
  id                      UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shift_name              TEXT NOT NULL,
  tables_served           INTEGER DEFAULT 0,
  total_revenue           NUMERIC DEFAULT 0,
  tips_earned             NUMERIC DEFAULT 0,
  avg_turnaround_minutes  INTEGER DEFAULT 0,
  opened_at               TIMESTAMPTZ DEFAULT NOW(),
  closed_at               TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: 8 Restaurant Tables across 4 sections
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO restaurant_tables (id, section, number, capacity, status) VALUES
  ('A-01', 'A', 1, 4, 'EMPTY'),
  ('A-02', 'A', 2, 4, 'EMPTY'),
  ('A-03', 'A', 3, 6, 'EMPTY'),
  ('B-01', 'B', 1, 4, 'EMPTY'),
  ('B-02', 'B', 2, 4, 'EMPTY'),
  ('C-01', 'TERRACE', 1, 8, 'EMPTY'),
  ('C-02', 'TERRACE', 2, 6, 'EMPTY'),
  ('D-01', 'FAMILY_DINING', 1, 10, 'EMPTY');

-- ═══════════════════════════════════════════════════════════════════════════
-- REALTIME: Enable Realtime on all tables
-- ═══════════════════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE restaurant_tables;
ALTER PUBLICATION supabase_realtime ADD TABLE kds_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE kds_items;
ALTER PUBLICATION supabase_realtime ADD TABLE pings;

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY: Open for dev (lock down before production)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE kds_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE kds_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_stats ENABLE ROW LEVEL SECURITY;

-- Allow anon read+write for all (dev only — tighten before go-live)
CREATE POLICY "anon_all_restaurant_tables" ON restaurant_tables FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_kds_tickets" ON kds_tickets FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_kds_items" ON kds_items FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_pings" ON pings FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_shift_stats" ON shift_stats FOR ALL TO anon USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS: Auto-update updated_at timestamps
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kds_tickets_updated_at
  BEFORE UPDATE ON kds_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_kds_items_updated_at
  BEFORE UPDATE ON kds_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_restaurant_tables_updated_at
  BEFORE UPDATE ON restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
