-- Vocabulary Hard Words System Migration
-- Adds fields to track words the user keeps getting wrong
-- 
-- NOTE: After running this migration, the PostgREST schema cache must be reloaded:
-- NOTIFY pgrst, 'reload schema';
-- Or via Supabase Dashboard: Database > API > Reload schema cache
--
-- NOTE: supabase/vocabulary_tables.sql lives outside supabase/migrations so
-- `supabase db reset` doesn't create these tables. Run the SQL in
-- supabase/vocabulary_tables.sql manually after a reset, or apply this
-- migration separately. Do not move it unless explicitly asked.

-- Add new columns to vocabulary_items
ALTER TABLE vocabulary_items
  ADD COLUMN IF NOT EXISTS lapse_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS correct_streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_result TEXT CHECK (last_result IN ('correct', 'incorrect', 'skipped')),
  ADD COLUMN IF NOT EXISTS is_hard BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill lapse_count from existing vocabulary_reviews where result='incorrect'
UPDATE vocabulary_items vi
SET lapse_count = COALESCE((
  SELECT COUNT(*)
  FROM vocabulary_reviews vr
  WHERE vr.vocabulary_item_id = vi.id
    AND vr.result = 'incorrect'
), 0);

-- Add index for querying hard words by user
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_user_id_lapse_count
  ON vocabulary_items(user_id, lapse_count);

-- Update updated_at trigger to also fire on these new columns (already covered by existing trigger)
-- The existing update_vocabulary_items_updated_at trigger will handle updated_at automatically.