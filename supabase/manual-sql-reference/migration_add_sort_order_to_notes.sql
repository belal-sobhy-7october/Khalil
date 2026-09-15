-- Incremental migration: add missing sort_order column to sticky_notes and todo_notes
-- These columns exist in supabase_schema.sql but were never added to the production DB.
-- The frontend code (appStore.ts) sends sort_order on every INSERT and update for these tables,
-- causing PGRST204 errors that silently prevented data persistence.
--
-- STATUS: Already applied to production. Superseded by
-- ../migrations/20260801000000_baseline_schema.sql, which now creates these
-- columns directly as part of the tracked baseline. Kept here for historical
-- reference only — do not re-run against a database that already has it.

ALTER TABLE sticky_notes ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE todo_notes  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
