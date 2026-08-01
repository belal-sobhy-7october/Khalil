-- Incremental migration: add ON DELETE CASCADE to sub_track_entries.track_id
-- In supabase_schema.sql, sub_track_entries.track_id references sub_tracks(id) without an
-- ON DELETE CASCADE clause, so deleting a sub_tracks row leaves orphaned sub_track_entries
-- rows behind (appStore.ts deletes sub_tracks directly and only mirrors the removal in local
-- Zustand state). This migration recreates the foreign key with CASCADE so the database keeps
-- sub_track_entries in sync automatically, and cleans up any orphans already present.
-- After running, restart PostgREST so the schema cache picks up the change.

alter table sub_track_entries drop constraint if exists sub_track_entries_track_id_fkey;
alter table sub_track_entries add constraint sub_track_entries_track_id_fkey
  foreign key (track_id) references sub_tracks(id) on delete cascade;

-- Remove any sub_track_entries whose track_id no longer exists in sub_tracks
delete from sub_track_entries where track_id not in (select id from sub_tracks);
