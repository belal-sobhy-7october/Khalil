-- Incremental migration: add toggle_sub_track_habit RPC for atomic habit toggling
-- Previously, toggleSubTrackHabit in src/store/appStore.ts performed the INSERT into
-- sub_track_entries and the UPDATE of sub_tracks.current_value as two separate Supabase
-- calls. If the INSERT succeeded but the UPDATE failed, an orphaned entry was left behind
-- and current_value was never incremented, producing inconsistent state. This RPC runs the
-- entry toggle and the current_value change inside a single transaction (a single SQL
-- function body), so either both happen or neither does. It returns whether the habit is
-- now on, the resulting current_value, and the new entry id so the client can update local
-- Zustand state without recomputing values client-side.
-- After running, restart PostgREST so the schema cache picks up the new function.

create or replace function toggle_sub_track_habit(
  p_track_id uuid,
  p_user_id uuid,
  p_date date
)
returns table (is_on boolean, new_value numeric, entry_id uuid)
language plpgsql
as $$
declare
  v_entry sub_track_entries%rowtype;
  v_target numeric;
  v_current numeric;
begin
  select target, current_value
    into v_target, v_current
    from sub_tracks
    where id = p_track_id and user_id = p_user_id;

  if not found then
    raise exception 'Sub track % not found for user %', p_track_id, p_user_id;
  end if;

  select * into v_entry
    from sub_track_entries
    where track_id = p_track_id and date = p_date and user_id = p_user_id;

  if v_entry.id is not null then
    -- Turn the habit off: delete the entry and decrement current_value (clamped at 0)
    delete from sub_track_entries where id = v_entry.id;
    v_current := greatest(0, v_current - 1);
    update sub_tracks set current_value = v_current
      where id = p_track_id and user_id = p_user_id;
    is_on := false;
    entry_id := null;
  else
    -- Turn the habit on: insert the entry and increment current_value (clamped at target)
    v_current := least(v_current + 1, v_target);
    update sub_tracks set current_value = v_current
      where id = p_track_id and user_id = p_user_id;
    insert into sub_track_entries (user_id, track_id, value, date, note)
      values (p_user_id, p_track_id, 1, p_date, '')
      returning id into entry_id;
    is_on := true;
  end if;

  new_value := v_current;
  return next;
end;
$$;
