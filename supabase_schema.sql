-- Khalil Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. daily_focus
create table daily_focus (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  text text default '',
  date date default current_date
);

alter table daily_focus enable row level security;

create policy "Users can view their own daily focus"
  on daily_focus for select
  using (auth.uid() = user_id);

create policy "Users can insert their own daily focus"
  on daily_focus for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own daily focus"
  on daily_focus for update
  using (auth.uid() = user_id);

create policy "Users can delete their own daily focus"
  on daily_focus for delete
  using (auth.uid() = user_id);

-- 2. daily_todos
create table daily_todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  priority text default 'medium',
  created_at bigint default extract(epoch from now()) * 1000,
  date date default current_date,
  sort_order int default 0
);

alter table daily_todos enable row level security;

create policy "Users can view their own daily todos"
  on daily_todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own daily todos"
  on daily_todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own daily todos"
  on daily_todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own daily todos"
  on daily_todos for delete
  using (auth.uid() = user_id);

-- 3. weekly_todos
create table weekly_todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  priority text default 'medium',
  created_at bigint default extract(epoch from now()) * 1000,
  week_start date,
  sort_order int default 0
);

alter table weekly_todos enable row level security;

create policy "Users can view their own weekly todos"
  on weekly_todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own weekly todos"
  on weekly_todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own weekly todos"
  on weekly_todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own weekly todos"
  on weekly_todos for delete
  using (auth.uid() = user_id);

-- 4. backlog_todos
create table backlog_todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  priority text default 'medium',
  created_at bigint default extract(epoch from now()) * 1000,
  sort_order int default 0
);

alter table backlog_todos enable row level security;

create policy "Users can view their own backlog todos"
  on backlog_todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own backlog todos"
  on backlog_todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own backlog todos"
  on backlog_todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own backlog todos"
  on backlog_todos for delete
  using (auth.uid() = user_id);

-- 5. life_categories
create table life_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  name_key text default '',
  icon text default 'heart',
  color text default 'terracotta',
  sort_order int default 0
);

alter table life_categories enable row level security;

create policy "Users can view their own life categories"
  on life_categories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own life categories"
  on life_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own life categories"
  on life_categories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own life categories"
  on life_categories for delete
  using (auth.uid() = user_id);

-- 6. sub_tracks
create table sub_tracks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references life_categories(id) on delete cascade not null,
  name text not null,
  name_key text default '',
  icon text default 'star',
  progress_type text default 'counter',
  target numeric default 0,
  unit text default 'pages',
  current_value numeric default 0,
  sort_order int default 0
);

alter table sub_tracks enable row level security;

create policy "Users can view their own sub tracks"
  on sub_tracks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sub tracks"
  on sub_tracks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sub tracks"
  on sub_tracks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sub tracks"
  on sub_tracks for delete
  using (auth.uid() = user_id);

-- 7. sub_track_entries
create table sub_track_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  track_id uuid references sub_tracks(id) on delete cascade not null,
  value numeric default 0,
  date date default current_date,
  note text default ''
);

alter table sub_track_entries enable row level security;

create policy "Users can view their own sub track entries"
  on sub_track_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sub track entries"
  on sub_track_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sub track entries"
  on sub_track_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sub track entries"
  on sub_track_entries for delete
  using (auth.uid() = user_id);

-- 8. bookmark_categories
create table bookmark_categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text default 'general',
  color text default 'terracotta'
);

alter table bookmark_categories enable row level security;

create policy "Users can view their own bookmark categories"
  on bookmark_categories for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmark categories"
  on bookmark_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookmark categories"
  on bookmark_categories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bookmark categories"
  on bookmark_categories for delete
  using (auth.uid() = user_id);

-- 9. bookmarks
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id uuid references bookmark_categories(id) on delete cascade not null,
  title text not null,
  url text not null,
  description text default '',
  note text default '',
  created_at bigint default extract(epoch from now()) * 1000
);

alter table bookmarks enable row level security;

create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookmarks"
  on bookmarks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- 10. sticky_notes (column notes)
create table sticky_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default '',
  text text default '',
  position jsonb default '{"x": 20, "y": 100}',
  sort_order int default 0,
  created_at bigint default extract(epoch from now()) * 1000
);

alter table sticky_notes enable row level security;

create policy "Users can view their own sticky notes"
  on sticky_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sticky notes"
  on sticky_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sticky notes"
  on sticky_notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sticky notes"
  on sticky_notes for delete
  using (auth.uid() = user_id);

-- 11. todo_notes (column todo lists)
create table todo_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default '',
  items jsonb default '[]',
  position jsonb default '{"x": 40, "y": 140}',
  sort_order int default 0,
  created_at bigint default extract(epoch from now()) * 1000
);

alter table todo_notes enable row level security;

create policy "Users can view their own todo notes"
  on todo_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own todo notes"
  on todo_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todo notes"
  on todo_notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todo notes"
  on todo_notes for delete
  using (auth.uid() = user_id);
