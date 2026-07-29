-- Incremental migration: add columns present in supabase_schema.sql but missing from production DB
-- After running, restart PostgREST so schema cache picks up the new columns.

-- sticky_notes: missing title column
ALTER TABLE sticky_notes ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';

-- todo_notes: title should already exist; skip unless needed
-- todo_notes: sort_order was added in a previous migration

-- daily_todos: missing sort_order
ALTER TABLE daily_todos ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- weekly_todos: missing sort_order
ALTER TABLE weekly_todos ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- backlog_todos: missing sort_order
ALTER TABLE backlog_todos ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
