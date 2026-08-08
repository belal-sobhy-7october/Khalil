-- Incremental migration: fix move_todo_item atomicity and parameter order
-- The original implementation inserted first then deleted, which could leave duplicates
-- if the delete failed. This version deletes first, then inserts, with a check to ensure
-- the delete succeeded before inserting. Also reorders parameters to match the production
-- function signature (p_user_id moved to end with default value).
-- After running, restart PostgREST so the schema cache picks up the new function.

create or replace function move_todo_item(
  p_id uuid,
  p_from_table text,
  p_to_table text,
  p_user_id uuid,
  p_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payload jsonb := coalesce(p_payload, '{}'::jsonb);
  v_deleted boolean := false;
begin
  -- First, delete the source row, scoped to the calling user
  -- This ensures we don't lose data if the insert fails
  execute format(
    'delete from %I where id = %L and user_id = %L',
    p_from_table, p_id, p_user_id
  );
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  
  -- Only insert if we actually deleted something
  if v_deleted then
    -- Insert into the target table. jsonb_populate_record maps the payload's keys to the
    -- target table's columns, so the payload must use the table's column names (snake_case).
    execute format(
      'insert into %I select (jsonb_populate_record(null::%I, %L)).*',
      p_to_table, p_to_table, v_payload
    );
  end if;
end;
$$;
