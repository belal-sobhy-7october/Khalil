-- Per-topic self-test progress (pronunciation, listening, shadowing, AI talk).
create table if not exists topic_challenges (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category_id uuid not null references vocabulary_categories(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, category_id)
);

alter table topic_challenges enable row level security;

drop policy if exists "Users can read their own topic challenges" on topic_challenges;
create policy "Users can read their own topic challenges"
  on topic_challenges for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can insert their own topic challenges" on topic_challenges;
create policy "Users can insert their own topic challenges"
  on topic_challenges for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update their own topic challenges" on topic_challenges;
create policy "Users can update their own topic challenges"
  on topic_challenges for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own topic challenges" on topic_challenges;
create policy "Users can delete their own topic challenges"
  on topic_challenges for delete to authenticated using (auth.uid() = user_id);

notify pgrst, 'reload schema';
