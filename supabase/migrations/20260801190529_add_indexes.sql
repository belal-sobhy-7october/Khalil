-- Incremental migration: add database indexes matching the query patterns in src/store/appStore.ts
-- These indexes speed up the filtered lookups issued by loadUserData and the individual CRUD actions.

create index if not exists idx_daily_todos_user_date on daily_todos(user_id, date);
create index if not exists idx_weekly_todos_user_week on weekly_todos(user_id, week_start);
create index if not exists idx_backlog_todos_user on backlog_todos(user_id);
create index if not exists idx_life_categories_user on life_categories(user_id);
create index if not exists idx_sub_tracks_user_category on sub_tracks(user_id, category_id);
create index if not exists idx_sub_track_entries_track_date on sub_track_entries(track_id, date);
create index if not exists idx_sub_track_entries_user on sub_track_entries(user_id);
create index if not exists idx_bookmark_categories_user on bookmark_categories(user_id);
create index if not exists idx_bookmarks_user_category on bookmarks(user_id, category_id);
create index if not exists idx_sticky_notes_user on sticky_notes(user_id);
create index if not exists idx_todo_notes_user on todo_notes(user_id);
