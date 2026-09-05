create table calendar_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  date date not null,
  start_time time,
  end_time time,
  all_day boolean default false,
  completed boolean default false,
  color text default 'clay-soft',
  created_at bigint default extract(epoch from now()) * 1000,
  updated_at bigint default extract(epoch from now()) * 1000
);

alter table calendar_events enable row level security;

create policy "Users can view their own calendar events"
  on calendar_events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own calendar events"
  on calendar_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own calendar events"
  on calendar_events for update
  using (auth.uid() = user_id);

create policy "Users can delete their own calendar events"
  on calendar_events for delete
  using (auth.uid() = user_id);

create index if not exists idx_calendar_events_user_date on calendar_events(user_id, date);