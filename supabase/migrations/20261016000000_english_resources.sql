-- Ratings and suggestions for the curated English resources list
-- (src/data/englishResources.ts). Ratings are visible to every signed-in
-- user so averages can be shown; each user can only write their own.

create table if not exists english_resource_ratings (
  resource_id text not null check (char_length(resource_id) between 1 and 100),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (resource_id, user_id)
);

alter table english_resource_ratings enable row level security;

drop policy if exists "Signed-in users can read all resource ratings" on english_resource_ratings;
create policy "Signed-in users can read all resource ratings"
  on english_resource_ratings for select to authenticated using (true);

drop policy if exists "Users can insert their own resource rating" on english_resource_ratings;
create policy "Users can insert their own resource rating"
  on english_resource_ratings for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can update their own resource rating" on english_resource_ratings;
create policy "Users can update their own resource rating"
  on english_resource_ratings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own resource rating" on english_resource_ratings;
create policy "Users can delete their own resource rating"
  on english_resource_ratings for delete to authenticated using (auth.uid() = user_id);

create table if not exists english_resource_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  url text not null check (char_length(url) <= 500 and url ~* '^https?://'),
  description text check (description is null or char_length(description) <= 500),
  category text,
  created_at timestamptz not null default now()
);

create index if not exists idx_english_resource_suggestions_user on english_resource_suggestions(user_id);

alter table english_resource_suggestions enable row level security;

drop policy if exists "Users can read their own suggestions" on english_resource_suggestions;
create policy "Users can read their own suggestions"
  on english_resource_suggestions for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can add suggestions" on english_resource_suggestions;
create policy "Users can add suggestions"
  on english_resource_suggestions for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own suggestions" on english_resource_suggestions;
create policy "Users can delete their own suggestions"
  on english_resource_suggestions for delete to authenticated using (auth.uid() = user_id);

notify pgrst, 'reload schema';
