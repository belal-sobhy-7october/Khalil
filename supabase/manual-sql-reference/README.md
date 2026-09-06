# Manual SQL Reference

These files document SQL statements that were already executed **manually and directly in the Supabase Dashboard SQL Editor** (not via the Supabase CLI).

## Important Notes

- **Historical reference only** — these statements have already been applied to the live database.
- **Re-running them may fail** (e.g., constraint already exists, duplicate key errors) or may need adaptation before any re-run.
- They are **not part of the official Supabase CLI migration pipeline**.
- The official, version-controlled migrations live in `../migrations/` (timestamped files managed by `supabase migration` commands).

## Files

| File | Description |
|------|-------------|
| `supabase_migration_colors.sql` | Migrates legacy color values to new palette (`clay-soft`→`terracotta`, `gold-soft`→`gold`, `sage-soft`→`sage`) |
| `supabase_migration_event_validation.sql` | Adds DB-level CHECK constraints: valid color palette, `end_time > start_time` |
| `supabase_migration_navigation.sql` | Creates `user_preferences` table with RLS (shared with routing feature) |
| `supabase_migration_routing.sql` | Documents client-side route persistence; references `user_preferences` from navigation file |

## Execution Status

All four files were executed manually in the Supabase SQL Editor on **2026-09-06**.