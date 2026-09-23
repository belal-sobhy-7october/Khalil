alter table habits add column start_date date not null default current_date;

-- Backfill existing habits: earlier of (earliest habit_entries.date, created_at's date),
-- falling back to current_date only if both are null. `least()` in Postgres ignores NULL
-- arguments and only returns NULL if every argument is NULL, so this gives exactly that.
-- habits.created_at is bigint epoch milliseconds (see 20260901105511_habits_tracker.sql),
-- hence the explicit to_timestamp(.../1000)::date cast.
update habits h
set start_date = coalesce(
  least(
    (select min(he.date) from habit_entries he where he.habit_id = h.id),
    to_timestamp(h.created_at / 1000)::date
  ),
  current_date
);
