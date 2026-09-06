-- Optional: user_preferences table for storing last active section server-side,
-- shared by both the navigation feature and route persistence (Prompt 2 and 3).
-- This table is defined here only; supabase_migration_routing.sql references it
-- instead of duplicating the CREATE TABLE statement.

-- STATUS: Executed manually in Supabase SQL Editor on 2026-09-06.
-- The table and its RLS policies now exist in the live database.
-- IMPORTANT: this table alone does nothing yet — the frontend code has
-- NOT been updated to read/write to it. The app still only uses
-- localStorage (khalil-active-section). Until the frontend is wired up
-- to sync with this table on auth state change, this table stays empty
-- and has zero effect on app behavior.

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid references auth.users(id) on delete cascade primary key,
  last_active_section text default 'todo',
  updated_at bigint default extract(epoch from now()) * 1000
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);