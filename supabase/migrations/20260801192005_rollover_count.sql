-- Incremental migration: track stale todo rollovers with rollover_count
-- rolloverStaleTodos in src/store/appStore.ts silently reassigns incomplete daily/weekly
-- todos to the current day/week on every load, with no user-facing indication. This adds a
-- rollover_count column so the UI can surface how many times a todo was carried over, and
-- moves the rollover into a single atomic RPC. PostgREST's .update() cannot express
-- `rollover_count = rollover_count + 1` without reading the row first, and the previous two
-- separate .update() calls were not atomic.
-- After running, restart PostgREST so the schema cache picks up the new function.

alter table daily_todos add column if not exists rollover_count integer not null default 0;
alter table weekly_todos add column if not exists rollover_count integer not null default 0;

create or replace function rollover_stale_todos(
  p_user_id uuid,
  p_today date,
  p_week_start date
)
returns void
language plpgsql
as $$
begin
  update daily_todos
    set date = p_today,
        rollover_count = rollover_count + 1
    where user_id = p_user_id
      and completed = false
      and date < p_today;

  update weekly_todos
    set week_start = p_week_start,
        rollover_count = rollover_count + 1
    where user_id = p_user_id
      and completed = false
      and week_start is not null
      and week_start <> p_week_start;
end;
$$;
