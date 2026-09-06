-- DB-level constraints matching the client-side validation in the Add Event modal.

-- Restrict color column to the new valid palette.
-- STATUS: Executed manually in Supabase SQL Editor on 2026-09-06.
ALTER TABLE calendar_events
ADD CONSTRAINT check_valid_color
CHECK (color IN (
  'terracotta', 'amber', 'gold', 'sage',
  'blue', 'indigo', 'purple', 'pink', 'rose'
));

-- Ensure end_time is after start_time when both are provided.
-- Before adding this constraint, one existing row ("البقال", 2026-09-30) had
-- start_time and end_time reversed (15:50 / 14:50). It was corrected by
-- swapping the two values before this constraint was applied.
-- STATUS: Executed manually in Supabase SQL Editor on 2026-09-06,
-- after fixing the one bad row above.
ALTER TABLE calendar_events
ADD CONSTRAINT check_end_time_after_start
CHECK (
  (start_time IS NULL AND end_time IS NULL)
  OR (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  OR (all_day = true)
);