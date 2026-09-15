-- Cleanup: drop functions left behind by the daily_todos/weekly_todos/backlog_todos
-- -> unified todos migration (20260808200000_unify_todo_tables.sql).
--
-- move_todo_item(...) — the pre-unification 5-argument overload operated on
-- the old per-gate tables via dynamic SQL. It went through two versions that
-- ended up as two DISTINCT overloads (Postgres identifies a function by its
-- parameter *type* sequence, not names, so `create or replace` only replaces
-- an exact type-sequence match):
--   * (uuid, text, text, jsonb, uuid)   — from 20260801191058_move_todo_item_rpc.sql
--   * (uuid, text, text, uuid, jsonb)   — from 20260808153247_fix_move_todo_item_atomic.sql,
--     which reordered p_user_id/p_payload but, being a different type
--     sequence, created a second overload instead of replacing the first.
-- Both were superseded by the 4-argument
-- move_todo_item(p_task_id uuid, p_to_gate text, p_date date, p_week_start date)
-- created in 20260808200000_unify_todo_tables.sql, which is the only signature
-- src/store/appStore.ts calls today. This also makes the
-- `ALTER FUNCTION move_todo_item(...)` in
-- 20260808000000_fix_function_search_paths.sql (which hardened the first
-- overload's search_path) apply to a function nothing calls anymore.
--
-- rollover_stale_todos(uuid, date, date) — created in
-- 20260801192005_rollover_count.sql to roll incomplete daily/weekly todos
-- forward. It targets the old daily_todos/weekly_todos tables directly, and
-- its only call site in src/store/appStore.ts's loadUserData has been
-- commented out ("Disabled rollover to prevent deleted todos from
-- reappearing on refresh"), so it's unreachable dead code.
--
-- None of these drops touch the old daily_todos/weekly_todos/backlog_todos
-- tables themselves — those are intentionally kept per the comment at the end
-- of 20260808200000_unify_todo_tables.sql ("Old tables are NOT dropped yet to
-- allow rollback").

DROP FUNCTION IF EXISTS public.move_todo_item(uuid, text, text, jsonb, uuid);
DROP FUNCTION IF EXISTS public.move_todo_item(uuid, text, text, uuid, jsonb);
DROP FUNCTION IF EXISTS public.rollover_stale_todos(uuid, date, date);
