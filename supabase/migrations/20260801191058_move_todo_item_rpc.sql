-- Incremental migration: add move_todo_item RPC for atomic move operations
-- Previously, moveToDaily / moveToWeekly / moveToBacklog in src/store/appStore.ts performed
-- the INSERT into the target table and the DELETE from the source table as two separate,
-- unguarded Supabase calls. If the INSERT succeeded but the DELETE failed, a duplicate row
-- was left behind in both tables. This RPC runs both statements inside a single transaction
-- (each RPC call is executed in one transaction), so either both succeed or neither does.
-- After running, restart PostgREST so the schema cache picks up the new function.

create or replace function move_todo_item(
  p_id uuid,
  p_from_table text,
  p_to_table text,
  p_payload jsonb,
  p_user_id uuid
)
returns void
language plpgsql
as $$
declare
  v_payload jsonb := coalesce(p_payload, '{}'::jsonb);
begin
  -- Insert into the target table. jsonb_populate_record maps the payload's keys to the
  -- target table's columns, so the payload must use the table's column names (snake_case).
  execute format(
    'insert into %I select (jsonb_populate_record(null::%I, %L)).*',
    p_to_table, p_to_table, v_payload
  );

  -- Delete the source row, scoped to the calling user.
  execute format(
    'delete from %I where id = %L and user_id = %L',
    p_from_table, p_id, p_user_id
  );
end;
$$;
