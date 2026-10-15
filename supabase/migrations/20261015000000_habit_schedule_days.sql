-- Per-habit schedule: the weekdays a habit is due (0 = Sunday … 6 = Saturday).
-- NULL means every day, so existing habits keep their current behaviour.
alter table habits add column if not exists schedule_days smallint[];

alter table habits drop constraint if exists habits_schedule_days_valid;
alter table habits add constraint habits_schedule_days_valid
  check (schedule_days is null or schedule_days <@ array[0,1,2,3,4,5,6]::smallint[]);

-- Habits were all backfilled to the same start date by 20260923152341. Pull
-- each start back to its first check, so a habit's history is never hidden.
update habits h
set start_date = least(h.start_date, (select min(he.date) from habit_entries he where he.habit_id = h.id))
where exists (select 1 from habit_entries he where he.habit_id = h.id and he.date < h.start_date);

notify pgrst, 'reload schema';
