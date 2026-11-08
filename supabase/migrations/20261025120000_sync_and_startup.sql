-- Opening the app in one request, and only what changed since the last visit.
--
-- The load test (scripts/load/RESULTS.md) showed that an app open cost 26
-- requests and 0.7 MB on average (1.3 MB for a heavy user), most of it the
-- same words, flashcard states, habit days and wird days as the visit before.
-- The app now keeps those four on the device (src/lib/syncCache.ts) and asks
-- `app_startup` for the small lists, the startup settings and the rows of the
-- four that changed (or were deleted) since its last visit.
-- Until this migration runs, the app loads table by table as before.

-- 1. When a row last changed, by the server's clock (a device's clock can be wrong).
alter table public.habit_entries add column if not exists updated_at timestamptz not null default now();
-- Every row has one (the startup below reads by it); the trigger keeps it so.
update public.vocabulary_items set updated_at = coalesce(created_at, now()) where updated_at is null;

create or replace function public.touch_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists touch_updated_at on public.vocabulary_items;
create trigger touch_updated_at before insert or update on public.vocabulary_items for each row execute function public.touch_updated_at();
drop trigger if exists touch_updated_at on public.user_kv;
create trigger touch_updated_at before insert or update on public.user_kv for each row execute function public.touch_updated_at();
drop trigger if exists touch_updated_at on public.wird_days;
create trigger touch_updated_at before insert or update on public.wird_days for each row execute function public.touch_updated_at();
drop trigger if exists touch_updated_at on public.habit_entries;
create trigger touch_updated_at before insert or update on public.habit_entries for each row execute function public.touch_updated_at();

create index if not exists idx_vocabulary_items_user_updated on public.vocabulary_items (user_id, updated_at);
create index if not exists idx_user_kv_user_updated on public.user_kv (user_id, updated_at);
create index if not exists idx_wird_days_user_updated on public.wird_days (user_id, updated_at);
create index if not exists idx_habit_entries_user_updated on public.habit_entries (user_id, updated_at);

-- 2. What was deleted, so another device can drop it too. Written only by the
-- trigger below; a person reads their own. Kept 90 days: a device away longer
-- than 60 days loads everything again (syncCache.ts).
create table if not exists public.sync_deletions (
  user_id uuid not null,
  source text not null,
  row_key text not null,
  deleted_at timestamptz not null default now()
);
create index if not exists idx_sync_deletions_user on public.sync_deletions (user_id, deleted_at);
alter table public.sync_deletions enable row level security;
drop policy if exists "Users can read their own deletions" on public.sync_deletions;
create policy "Users can read their own deletions" on public.sync_deletions for select to authenticated using ((select auth.uid()) = user_id);
revoke insert, update, delete on public.sync_deletions from anon, authenticated;

create or replace function public.record_sync_deletion() returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_data jsonb := to_jsonb(old);
begin
  -- Not when the whole account is being deleted.
  if not exists (select 1 from auth.users where id = old.user_id) then
    return old;
  end if;
  insert into public.sync_deletions (user_id, source, row_key)
  values (
    old.user_id,
    tg_table_name,
    case tg_table_name
      when 'habit_entries' then (row_data ->> 'habit_id') || '|' || (row_data ->> 'date')
      else row_data ->> tg_argv[0]
    end
  );
  -- Now and then, forget this person's deletions older than 90 days.
  if random() < 0.02 then
    delete from public.sync_deletions where user_id = old.user_id and deleted_at < now() - interval '90 days';
  end if;
  return old;
end;
$$;

drop trigger if exists record_sync_deletion on public.vocabulary_items;
create trigger record_sync_deletion after delete on public.vocabulary_items for each row execute function public.record_sync_deletion('id');
drop trigger if exists record_sync_deletion on public.user_kv;
create trigger record_sync_deletion after delete on public.user_kv for each row execute function public.record_sync_deletion('key');
drop trigger if exists record_sync_deletion on public.wird_days;
create trigger record_sync_deletion after delete on public.wird_days for each row execute function public.record_sync_deletion('date');
drop trigger if exists record_sync_deletion on public.habit_entries;
create trigger record_sync_deletion after delete on public.habit_entries for each row execute function public.record_sync_deletion('');

-- 3. Everything the app needs when it opens, for the signed-in person (row-level
-- security still applies). `since`: this device's last visit. The four long
-- lists then bring only rows changed after it (two minutes earlier, to catch a
-- save that committed late), and `deleted` what was deleted. Without `since`,
-- or when it is older than 60 days (deletions are kept 90), everything comes and
-- `full` is true. `kv_keys`: the settings to bring.
-- json, not jsonb: Postgres builds it 3–4 times faster (a heavy user's first visit is 1.3 MB).
drop function if exists public.app_startup(timestamptz, text[]);
create function public.app_startup(since timestamptz default null, kv_keys text[] default '{}')
returns json
language sql
stable
set search_path = ''
as $$
  with me as (select auth.uid() as id),
  after_ as (select case when since > now() - interval '60 days' then since - interval '2 minutes' end as t),
  -- The lower bound of updated_at (all rows when everything comes), so the (user_id, updated_at) indexes read only the rows asked for.
  from_ as (select coalesce((select t from after_), '-infinity'::timestamptz) as t)
  select json_build_object(
    'now', now(),
    'full', (select t from after_) is null,
    'focus', (select coalesce(json_agg(row_to_json(f)), '[]'::json) from public.daily_focus f where f.user_id = (select id from me)),
    'todos', (select coalesce(json_agg(row_to_json(t) order by t.sort_order, t.id), '[]'::json) from public.todos t where t.user_id = (select id from me)),
    'life_categories', (select coalesce(json_agg(row_to_json(c) order by c.sort_order), '[]'::json) from public.life_categories c where c.user_id = (select id from me)),
    'sub_tracks', (select coalesce(json_agg(row_to_json(s) order by s.sort_order), '[]'::json) from public.sub_tracks s where s.user_id = (select id from me)),
    'habits', (select coalesce(json_agg(row_to_json(h) order by h.sort_order), '[]'::json) from public.habits h where h.user_id = (select id from me)),
    'vocabulary_categories', (select coalesce(json_agg(row_to_json(v) order by v.name), '[]'::json) from public.vocabulary_categories v where v.user_id = (select id from me)),
    'sticky_notes', (select coalesce(json_agg(row_to_json(n) order by n.sort_order), '[]'::json) from public.sticky_notes n where n.user_id = (select id from me)),
    'todo_notes', (select coalesce(json_agg(row_to_json(n) order by n.sort_order), '[]'::json) from public.todo_notes n where n.user_id = (select id from me)),
    'kv', (select coalesce(json_object_agg(k.key, k.value), '{}'::json) from public.user_kv k where k.user_id = (select id from me) and k.key = any (kv_keys)),
    'words', (select coalesce(json_agg(row_to_json(w) order by w.created_at, w.id), '[]'::json) from public.vocabulary_items w
              where w.user_id = (select id from me) and w.updated_at > (select t from from_)),
    'srs', (select coalesce(json_agg(json_build_object('key', k.key, 'value', k.value)), '[]'::json) from public.user_kv k
            where k.user_id = (select id from me) and k.key like 'srs:%' and k.updated_at > (select t from from_)),
    'habit_entries', (select coalesce(json_agg(row_to_json(e) order by e.date, e.id), '[]'::json) from public.habit_entries e
                      where e.user_id = (select id from me) and e.updated_at > (select t from from_)),
    'wird', (select coalesce(json_agg(json_build_object('date', d.date, 'data', d.data) order by d.date), '[]'::json) from public.wird_days d
             where d.user_id = (select id from me) and d.updated_at > (select t from from_)),
    'deleted', case when (select t from after_) is null then '[]'::json else
      (select coalesce(json_agg(json_build_object('source', x.source, 'key', x.row_key)), '[]'::json) from public.sync_deletions x
       where x.user_id = (select id from me) and x.deleted_at > (select t from after_)) end
  )
$$;

revoke all on function public.app_startup(timestamptz, text[]) from public, anon;
grant execute on function public.app_startup(timestamptz, text[]) to authenticated;

-- PostgREST reads the new function on its next schema reload; ask for it now.
notify pgrst, 'reload schema';
