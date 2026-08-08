-- Migration: Unify daily_todos, weekly_todos, backlog_todos into single todos table
-- This migration preserves task identity and enables atomic movement via gate updates

-- Step 1: Create the unified todos table
CREATE TABLE IF NOT EXISTS todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  gate TEXT NOT NULL CHECK (gate IN ('daily', 'weekly', 'backlog')),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  created_at BIGINT DEFAULT (EXTRACT(epoch FROM now()) * 1000),
  date DATE, -- Only used for daily gate
  week_start DATE, -- Only used for weekly gate
  sort_order INTEGER DEFAULT 0,
  rollover_count INTEGER DEFAULT 0,
  updated_at BIGINT DEFAULT (EXTRACT(epoch FROM now()) * 1000),
  UNIQUE (user_id, id)
);

-- Step 2: Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies
DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
CREATE POLICY "Users can view their own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
CREATE POLICY "Users can insert their own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
CREATE POLICY "Users can update their own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;
CREATE POLICY "Users can delete their own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_todos_user_gate ON todos(user_id, gate);
CREATE INDEX IF NOT EXISTS idx_todos_user_date ON todos(user_id, date) WHERE gate = 'daily';
CREATE INDEX IF NOT EXISTS idx_todos_user_week ON todos(user_id, week_start) WHERE gate = 'weekly';

-- Step 5: Migrate existing data from daily_todos
INSERT INTO todos (id, user_id, gate, text, completed, priority, created_at, date, sort_order, rollover_count, updated_at)
SELECT id, user_id, 'daily'::text, text, completed, priority, created_at, date, sort_order, rollover_count, EXTRACT(epoch FROM now()) * 1000
FROM daily_todos
ON CONFLICT (id) DO NOTHING;

-- Step 6: Migrate existing data from weekly_todos
INSERT INTO todos (id, user_id, gate, text, completed, priority, created_at, week_start, sort_order, rollover_count, updated_at)
SELECT id, user_id, 'weekly'::text, text, completed, priority, created_at, week_start, sort_order, rollover_count, EXTRACT(epoch FROM now()) * 1000
FROM weekly_todos
ON CONFLICT (id) DO NOTHING;

-- Step 7: Migrate existing data from backlog_todos
INSERT INTO todos (id, user_id, gate, text, completed, priority, created_at, sort_order, updated_at)
SELECT id, user_id, 'backlog'::text, text, completed, priority, created_at, sort_order, EXTRACT(epoch FROM now()) * 1000
FROM backlog_todos
ON CONFLICT (id) DO NOTHING;

-- Step 8: Create the new atomic movement RPC
CREATE OR REPLACE FUNCTION move_todo_item(
  p_task_id uuid,
  p_to_gate text,
  p_date date DEFAULT NULL,
  p_week_start date DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_current_gate text;
  v_row_count int;
  v_result jsonb;
BEGIN
  -- Get the authenticated user ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'UNAUTHORIZED',
      'message', 'User not authenticated'
    );
  END IF;
  
  -- Validate destination gate
  IF p_to_gate NOT IN ('daily', 'weekly', 'backlog') THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'INVALID_GATE',
      'message', 'Invalid destination gate'
    );
  END IF;
  
  -- Get current state of the task
  SELECT gate INTO v_current_gate
  FROM todos
  WHERE id = p_task_id AND user_id = v_user_id
  FOR UPDATE; -- Lock the row for this transaction
  
  IF v_current_gate IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'NOT_FOUND',
      'message', 'Task not found or unauthorized'
    );
  END IF;
  
  -- If already in the target gate, return success (idempotent)
  IF v_current_gate = p_to_gate THEN
    RETURN jsonb_build_object(
      'success', true,
      'code', 'ALREADY_IN_GATE',
      'message', 'Task already in target gate',
      'task_id', p_task_id,
      'from_gate', v_current_gate,
      'to_gate', p_to_gate
    );
  END IF;
  
  -- Update the gate and related fields
  UPDATE todos
  SET 
    gate = p_to_gate,
    date = CASE WHEN p_to_gate = 'daily' THEN COALESCE(p_date, CURRENT_DATE) ELSE NULL END,
    week_start = CASE WHEN p_to_gate = 'weekly' THEN COALESCE(p_week_start, date_trunc('week', CURRENT_DATE)::date) ELSE NULL END,
    rollover_count = CASE 
      WHEN p_to_gate = 'backlog' THEN 0
      WHEN v_current_gate = 'backlog' THEN 0
      ELSE rollover_count + 1
    END,
    updated_at = EXTRACT(epoch FROM now()) * 1000
  WHERE id = p_task_id AND user_id = v_user_id;
  
  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  
  IF v_row_count = 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'code', 'UPDATE_FAILED',
      'message', 'Failed to update task'
    );
  END IF;
  
  -- Return success
  RETURN jsonb_build_object(
    'success', true,
    'code', 'MOVED',
    'message', 'Task moved successfully',
    'task_id', p_task_id,
    'from_gate', v_current_gate,
    'to_gate', p_to_gate
  );
END;
$$;

-- Step 9: Revoke execute from anon, grant to authenticated
REVOKE EXECUTE ON FUNCTION move_todo_item(uuid, text, date, date) FROM anon;
GRANT EXECUTE ON FUNCTION move_todo_item(uuid, text, date, date) TO authenticated;

-- Step 9: Create helper functions for querying by gate
CREATE OR REPLACE FUNCTION get_daily_todos(p_user_id uuid, p_date date DEFAULT CURRENT_DATE)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  text text,
  completed boolean,
  priority text,
  created_at bigint,
  date date,
  sort_order integer,
  rollover_count integer,
  updated_at bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, user_id, text, completed, priority, created_at, date, sort_order, rollover_count, updated_at
  FROM todos
  WHERE user_id = p_user_id AND gate = 'daily' AND date = p_date
  ORDER BY sort_order;
$$;

CREATE OR REPLACE FUNCTION get_weekly_todos(p_user_id uuid, p_week_start date DEFAULT date_trunc('week', CURRENT_DATE)::date)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  text text,
  completed boolean,
  priority text,
  created_at bigint,
  week_start date,
  sort_order integer,
  rollover_count integer,
  updated_at bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, user_id, text, completed, priority, created_at, week_start, sort_order, rollover_count, updated_at
  FROM todos
  WHERE user_id = p_user_id AND gate = 'weekly' AND week_start = p_week_start
  ORDER BY sort_order;
$$;

CREATE OR REPLACE FUNCTION get_backlog_todos(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  text text,
  completed boolean,
  priority text,
  created_at bigint,
  sort_order integer,
  updated_at bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT id, user_id, text, completed, priority, created_at, sort_order, updated_at
  FROM todos
  WHERE user_id = p_user_id AND gate = 'backlog'
  ORDER BY sort_order;
$$;

-- Note: Old tables are NOT dropped yet to allow rollback
-- They can be dropped in a separate migration after verification
