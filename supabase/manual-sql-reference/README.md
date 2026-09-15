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
| `supabase_schema.sql` | Hand-written "run this in the SQL Editor" schema doc, used to bootstrap the project before `../migrations/` existed. **Superseded by `../migrations/20260801000000_baseline_schema.sql`**, which reproduces this same pre-unification schema (daily_todos/weekly_todos/backlog_todos, no habits/calendar_events yet) as a proper tracked migration so `supabase db reset` works on a fresh environment. Kept here only as a readable historical reference — do not run it. |
| `migration_add_missing_columns.sql` | One-off `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` patch that added `sort_order` (daily/weekly/backlog_todos) and `title` (sticky_notes) to production after they drifted from `supabase_schema.sql`. Already applied to production; its effect is now baked directly into `../migrations/20260801000000_baseline_schema.sql`. |
| `migration_add_sort_order_to_notes.sql` | One-off patch adding `sort_order` to `sticky_notes`/`todo_notes`. Same status as above — already applied to production, and now part of the baseline migration. |
| `backup_before_migrations_20260801_1955.sql` | A local `pg_dump` safety snapshot taken before running migrations by hand on 2026-08-01. Gitignored (`backup_before_migrations_*.sql`); kept locally only, not shared via the repo. |

## Execution Status

The four `supabase_migration_*.sql` files were executed manually in the Supabase SQL Editor on **2026-09-06**.

`supabase_schema.sql`, `migration_add_missing_columns.sql`, and `migration_add_sort_order_to_notes.sql` were also already applied to production (at various earlier points — see each file's own comments), before `../migrations/20260801000000_baseline_schema.sql` existed to track them formally. Re-running any of these against a database that already reflects them will likely fail (table/column/constraint already exists) — they're kept here purely as a historical record of how production reached its current schema.