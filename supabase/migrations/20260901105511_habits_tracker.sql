create table habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  icon text default 'star',
  sort_order int default 0,
  active boolean default true,
  created_at bigint default extract(epoch from now()) * 1000
);

alter table habits enable row level security;
create policy "Users can view their own habits" on habits for select using (auth.uid() = user_id);
create policy "Users can insert their own habits" on habits for insert with check (auth.uid() = user_id);
create policy "Users can update their own habits" on habits for update using (auth.uid() = user_id);
create policy "Users can delete their own habits" on habits for delete using (auth.uid() = user_id);

create table habit_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  habit_id uuid references habits(id) on delete cascade not null,
  date date not null,
  unique (habit_id, date)
);

alter table habit_entries enable row level security;
create policy "Users can view their own habit entries" on habit_entries for select using (auth.uid() = user_id);
create policy "Users can insert their own habit entries" on habit_entries for insert with check (auth.uid() = user_id);
create policy "Users can delete their own habit entries" on habit_entries for delete using (auth.uid() = user_id);

create table daily_mood (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  mood int,
  motivation int,
  unique (user_id, date)
);

alter table daily_mood enable row level security;
create policy "Users can view their own daily mood" on daily_mood for select using (auth.uid() = user_id);
create policy "Users can insert their own daily mood" on daily_mood for insert with check (auth.uid() = user_id);
create policy "Users can update their own daily mood" on daily_mood for update using (auth.uid() = user_id);

create index if not exists idx_habits_user on habits(user_id);
create index if not exists idx_habit_entries_user_date on habit_entries(user_id, date);
create index if not exists idx_habit_entries_habit on habit_entries(habit_id);
create index if not exists idx_daily_mood_user_date on daily_mood(user_id, date);
