-- Color contrast/visibility fix.
-- The calendar_events table has a 'color' text column with default 'clay-soft'.
-- New UI color palette: terracotta, amber, gold, sage, blue, indigo, purple, pink, rose.
-- Legacy values (clay-soft, gold-soft, sage-soft) are migrated below.

-- STATUS: Executed manually in Supabase SQL Editor on 2026-09-06.

UPDATE calendar_events SET color = 'terracotta' WHERE color = 'clay-soft';
UPDATE calendar_events SET color = 'gold' WHERE color = 'gold-soft';
UPDATE calendar_events SET color = 'sage' WHERE color = 'sage-soft';