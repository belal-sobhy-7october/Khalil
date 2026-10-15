-- Key/value user settings (appearance, pomodoro preferences, study links …),
-- pomodoro session history and the daily wird (worship) tracker.

create table if not exists user_kv (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  key text not null check (char_length(key) between 1 and 100),
  value jsonb not null default 'null'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

create table if not exists pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  minutes integer not null check (minutes between 1 and 600),
  label text check (label is null or char_length(label) <= 200),
  completed boolean not null default true
);
create index if not exists idx_pomodoro_sessions_user_started on pomodoro_sessions(user_id, started_at);

create table if not exists wird_days (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

do $$
declare t text;
begin
  foreach t in array array['user_kv', 'pomodoro_sessions', 'wird_days'] loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "own rows select" on %I', t);
    execute format('create policy "own rows select" on %I for select to authenticated using (auth.uid() = user_id)', t);
    execute format('drop policy if exists "own rows insert" on %I', t);
    execute format('create policy "own rows insert" on %I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('drop policy if exists "own rows update" on %I', t);
    execute format('create policy "own rows update" on %I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('drop policy if exists "own rows delete" on %I', t);
    execute format('create policy "own rows delete" on %I for delete to authenticated using (auth.uid() = user_id)', t);
  end loop;
end $$;

notify pgrst, 'reload schema';
