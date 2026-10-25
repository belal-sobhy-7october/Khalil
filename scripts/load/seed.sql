-- Fills the local database with :users made-up users (20,000 by default) and
-- the data people really keep in Khalil, at three levels of use:
--   light  (6 in 10): tried it, a few tasks and words
--   medium (3 in 10): uses it most days for a couple of months
--   heavy  (1 in 10): uses everything every day for about a year
-- Ids are fixed (user n is md5('khalil-load-user-n')), so the load test can
-- sign in as any of them. Run: psql … -v users=20000 -f scripts/load/seed.sql
\if :{?users}
\else
  \set users 20000
\endif
\timing on
set client_min_messages = warning;
set synchronous_commit = off;

-- Who is who: user n, its id and how much it uses Khalil.
create temp table seed_users as
select n,
       md5('khalil-load-user-' || n)::uuid as id,
       case when n % 10 = 0 then 'heavy' when n % 10 in (1, 2, 3) then 'medium' else 'light' end as tier
from generate_series(1, :users) n;
create index on seed_users (tier);

-- How many of each thing a tier has.
create temp table seed_sizes (tier text primary key, todos int, habits int, habit_days int, wird_days int,
  vocab_cats int, words int, reviewed int, lessons int, path_done int, pomodoros int, events int, moods int,
  pillars int, notes int, bookmarks int);
insert into seed_sizes values
  ('light',   6, 1,   0,   0, 1,   10,   0,   5,   0,   0,  0,  0, 0, 0,  0),
  ('medium', 40, 4,  60,  60, 3,  150, 100,  80,  60,  40,  8, 20, 4, 2,  5),
  ('heavy', 150, 8, 180, 365, 8, 1000, 900, 400, 300, 300, 40, 90, 4, 6, 30);

insert into auth.users (id, email, created_at)
select id, 'user' || n || '@load.test', now() - (n % 365) * interval '1 day' from seed_users
on conflict (id) do nothing;

-- Tasks: today's and the last two weeks', this week's, and the backlog; most of the old ones done.
insert into todos (user_id, gate, text, completed, priority, date, week_start, sort_order, created_at, updated_at)
select u.id,
       case when k % 5 < 3 then 'daily' when k % 5 = 3 then 'weekly' else 'backlog' end,
       'Task ' || k || ' of user ' || u.n,
       (k % 3) <> 0,
       (array['low', 'medium', 'high'])[1 + k % 3],
       case when k % 5 < 3 then current_date - (k % 14) end,
       case when k % 5 = 3 then date_trunc('week', current_date)::date - 7 * (k % 4) end,
       k,
       (extract(epoch from now()) * 1000)::bigint - k * 3600000,
       (extract(epoch from now()) * 1000)::bigint - k * 1800000
from seed_users u join seed_sizes s using (tier), generate_series(1, s.todos) k;

-- Habits, and the days they were done (about 7 days in 10).
insert into habits (id, user_id, name, icon, sort_order, active, start_date, schedule_days)
select md5('habit-' || u.n || '-' || k)::uuid, u.id, 'Habit ' || k, 'star', k, true,
       current_date - s.habit_days, case when k % 4 = 0 then array[0, 2, 4] end
from seed_users u join seed_sizes s using (tier), generate_series(1, s.habits) k;

insert into habit_entries (user_id, habit_id, date)
select u.id, md5('habit-' || u.n || '-' || k)::uuid, current_date - d
from seed_users u join seed_sizes s using (tier), generate_series(1, s.habits) k, generate_series(0, s.habit_days - 1) d
where s.habit_days > 0 and (u.n + k * 7 + d * 13) % 10 < 7;

-- The wird: a day's prayers, Quran and adhkar.
insert into wird_days (user_id, date, data, updated_at)
select u.id, current_date - d,
       jsonb_build_object(
         'prayers', jsonb_build_object('fajr', case when d % 3 = 0 then 'alone' else 'jamaah' end, 'dhuhr', 'jamaah', 'asr', 'jamaah', 'maghrib', 'jamaah', 'isha', 'alone'),
         'qiyam', d % 4, 'rawatib', jsonb_build_object('fajrBefore', true, 'dhuhrBefore', d % 2 = 0, 'maghribAfter', true),
         'quran', (d % 4) * 0.25 + 0.25, 'adhkarAM', d % 3 <> 1, 'adhkarPM', d % 2 = 0),
       now() - d * interval '1 day'
from seed_users u join seed_sizes s using (tier), generate_series(0, s.wird_days - 1) d
where s.wird_days > 0;

-- Words and their groups.
insert into vocabulary_categories (id, user_id, name, color, icon)
select md5('vcat-' || u.n || '-' || k)::uuid, u.id, 'Group ' || k, 'clay-soft', 'book'
from seed_users u join seed_sizes s using (tier), generate_series(1, s.vocab_cats) k;

insert into vocabulary_items (id, user_id, category_id, word, type, definition, example_sentence, mastery_level, review_count,
  last_reviewed_at, created_at, updated_at, lapse_count, correct_streak, is_hard)
select md5('word-' || u.n || '-' || k)::uuid, u.id, md5('vcat-' || u.n || '-' || (1 + k % s.vocab_cats))::uuid,
       'word' || k, (array['word', 'phrase', 'verb', 'idiom'])[1 + k % 4],
       'A short learner''s definition of word number ' || k || '.',
       'An example sentence that uses word' || k || ' in the meaning it has in its topic.',
       k % 6, k % 9, case when k <= s.reviewed then now() - (k % 30) * interval '1 day' end,
       now() - (k % 200) * interval '1 day', now() - (k % 30) * interval '1 day', k % 5 / 4, k % 7, k % 37 = 0
from seed_users u join seed_sizes s using (tier), generate_series(1, s.words) k;

-- Each reviewed word's schedule is a user_kv row (srs:<word id>), as srsSync.ts writes it.
insert into user_kv (user_id, key, value, updated_at)
select u.id, 'srs:' || md5('word-' || u.n || '-' || k)::uuid,
       jsonb_build_object('due', now() + ((k % 40) - 10) * interval '1 day', 'stability', 3.2 + k % 20, 'difficulty', 4.1 + (k % 50) / 10.0,
         'elapsed_days', k % 12, 'scheduled_days', k % 30, 'learning_steps', 0, 'reps', 1 + k % 9, 'lapses', k % 5 / 4, 'state', 2,
         'last_review', now() - (k % 30) * interval '1 day'),
       now() - (k % 30) * interval '1 day'
from seed_users u join seed_sizes s using (tier), generate_series(1, s.reviewed) k
where s.reviewed > 0;

-- Settings and progress values (user_kv), with sizes like real ones.
insert into user_kv (user_id, key, value)
select u.id, kv.key, kv.value
from seed_users u join seed_sizes s using (tier),
lateral (values
  ('tasks-settings', '{"startup":"tasks","completed":"nextDay","recurringPosition":"top","doneRecurring":"stay","prayerTick":"jamaah","todayWird":true,"todayHabits":true}'::jsonb),
  ('wird-items', '[{"id":"prayers","inToday":true},{"id":"qiyam","goal":11},{"id":"rawatib","goal":12},{"id":"quran","goal":1,"inToday":true},{"id":"adhkarAM","inToday":true},{"id":"adhkarPM","inToday":true}]'::jsonb),
  ('habit-links', '{}'::jsonb),
  ('srs-settings', '{"newPerDay":20,"retention":0.9,"reminderTime":"20:00","notify":false}'::jsonb),
  ('appearance', '"default"'::jsonb),
  ('english-course-progress', (select coalesce(jsonb_object_agg('lesson-' || u.n || '-' || k, to_char(current_date - k % 90, 'YYYY-MM-DD')), '{}') from generate_series(1, s.lessons) k)),
  ('english-course-positions', (select coalesce(jsonb_object_agg('video-' || k, k * 37 % 600), '{}') from generate_series(1, least(s.lessons, 40)) k)),
  ('learning-path-v2', jsonb_build_object('startedAt', to_char(current_date - 120, 'YYYY-MM-DD'),
     'settings', '{"level":"B1","minutes":20,"listening":"voa","listeningLevel":"intermediate","reading":"british-council","readingLevel":"B1","shadowingLevel":"A1"}'::jsonb,
     'done', (select coalesce(jsonb_object_agg('review:' || k, to_char(current_date - k % 120, 'YYYY-MM-DD')), '{}') from generate_series(1, s.path_done) k),
     'notes', '{}'::jsonb))
) kv(key, value)
on conflict (user_id, key) do nothing;

-- The rest of a user's things.
insert into pomodoro_sessions (user_id, started_at, ended_at, minutes, label, completed)
select u.id, now() - k * interval '20 hours', now() - k * interval '20 hours' + interval '25 minutes', 25, 'Study', true
from seed_users u join seed_sizes s using (tier), generate_series(1, s.pomodoros) k where s.pomodoros > 0;

insert into calendar_events (user_id, title, date, start_time, end_time, all_day, color)
select u.id, 'Event ' || k, current_date + (k % 60) - 20, '10:00', '11:00', k % 5 = 0, 'clay-soft'
from seed_users u join seed_sizes s using (tier), generate_series(1, s.events) k where s.events > 0;

insert into daily_focus (user_id, text, date)
select id, 'Finish the day''s lesson', current_date from seed_users where tier <> 'light';

insert into daily_mood (user_id, date, mood, motivation)
select u.id, current_date - d, 1 + d % 5, 1 + d % 4
from seed_users u join seed_sizes s using (tier), generate_series(0, s.moods - 1) d where s.moods > 0;

insert into life_categories (id, user_id, name, icon, color, sort_order)
select md5('pillar-' || u.n || '-' || k)::uuid, u.id, 'Pillar ' || k, 'heart', 'terracotta', k
from seed_users u join seed_sizes s using (tier), generate_series(1, s.pillars) k where s.pillars > 0;

insert into sub_tracks (user_id, category_id, name, progress_type, target, unit, current_value, sort_order)
select u.id, md5('pillar-' || u.n || '-' || k)::uuid, 'Track ' || k || '.' || j, 'counter', 30, 'pages', j * 3, j
from seed_users u join seed_sizes s using (tier), generate_series(1, s.pillars) k, generate_series(1, 2) j where s.pillars > 0;

insert into sticky_notes (user_id, title, text, sort_order)
select u.id, 'Note ' || k, 'Something to remember', k
from seed_users u join seed_sizes s using (tier), generate_series(1, s.notes) k where s.notes > 0;

insert into todo_notes (user_id, title, items, sort_order)
select u.id, 'List ' || k, '[{"id":"a","text":"First","done":false},{"id":"b","text":"Second","done":true}]', k
from seed_users u join seed_sizes s using (tier), generate_series(1, s.notes) k where s.notes > 0;

insert into bookmark_categories (id, user_id, name)
select md5('bcat-' || u.n || '-' || k)::uuid, u.id, 'Links ' || k
from seed_users u join seed_sizes s using (tier), generate_series(1, greatest(1, s.bookmarks / 10)) k where s.bookmarks > 0;

insert into bookmarks (user_id, category_id, title, url)
select u.id, md5('bcat-' || u.n || '-' || (1 + k % greatest(1, s.bookmarks / 10)))::uuid, 'Link ' || k, 'https://example.com/' || k
from seed_users u join seed_sizes s using (tier), generate_series(1, s.bookmarks) k where s.bookmarks > 0;

analyze;

select tier, count(*) as users from seed_users group by tier order by 1;
select relname as "table", n_live_tup as rows, pg_size_pretty(pg_total_relation_size(relid)) as size
from pg_stat_user_tables where schemaname = 'public' and n_live_tup > 0 order by n_live_tup desc;
select pg_size_pretty(pg_database_size(current_database())) as database_size;
