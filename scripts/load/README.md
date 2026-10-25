# Load test: 20,000 users on a local copy of the backend

Measures how Khalil's backend holds up with 20,000 accounts and many people using
the app at once, **without touching the real Supabase project**. Everything runs on
this machine.

## The stack (`stack.sh`)

| Part | Here | On Supabase |
|---|---|---|
| Database | Postgres 16 with every migration in `supabase/migrations` (and `supabase/vocabulary_tables.sql`), row-level security on | Postgres 17, the same migrations |
| Auth for the database | `supabase-shim.sql`: the `anon` / `authenticated` / `authenticator` roles, `auth.users`, `auth.uid()` as Supabase defines them | the same, from Supabase |
| Data API | PostgREST 12.2 (`DB_POOL` connections, 10 by default) | PostgREST, behind the Kong gateway |
| Gateway | `gateway.mjs`: `/rest/v1` → PostgREST, and the few `/auth/v1` calls supabase-js makes for a saved session | Kong + GoTrue |

Not covered: signing in (Google sign-in can't be simulated; tokens are minted with
`jwt.mjs`), Kong's own cost, the network between people and Supabase, and Realtime
(Khalil doesn't use it).

```bash
scripts/load/stack.sh up        # Postgres :54322, PostgREST :54331, gateway :54321
psql -h 127.0.0.1 -p 54322 -U postgres -v users=20000 -f scripts/load/seed.sql   # ~10 min, ~6 GB
scripts/load/stack.sh down      # or `reset` to delete the database
```

## The users (`seed.sql`)

20,000 accounts at three levels of use, with the data people really keep in Khalil:

| Level | Share | Tasks | Habits (days kept) | Wird days | Words | Flashcard states | Focus sessions |
|---|---|---|---|---|---|---|---|
| light | 6 in 10 | 6 | 1 | 0 | 10 | 0 | 0 |
| medium | 3 in 10 | 40 | 4 (60) | 60 | 150 | 100 | 40 |
| heavy | 1 in 10 | 150 | 8 (180) | 365 | 1,000 | 900 | 300 |

Plus settings and progress values (`user_kv`), the calendar, moods, life pillars,
notes and bookmarks. User *n*'s id is `md5('khalil-load-user-n')`.

## What one visit sends (`record.mjs`)

`record.mjs` opens the **real app** (a production build pointed at the gateway) as one
seeded user, goes through the main pages and lists every request; it fails if the real
PostgREST refuses any of them. `run.mjs` replays the same requests.

```bash
KEY=$(node -e "import('./scripts/load/jwt.mjs').then((m) => console.log(m.ANON_KEY))")
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=$KEY npx vite build --outDir /tmp/khalil-local
npx vite preview --outDir /tmp/khalil-local --port 5175 &
node scripts/load/record.mjs http://localhost:5175 10    # user 10 is a heavy user
```

## The test (`run.mjs`)

Each simulated person opens the app (all its startup requests, in parallel like a
browser), then does 5–15 things with pauses of about `THINK` seconds (10 by default):
ticks a task, a prayer or a habit, reviews flashcards, saves lesson progress, adds a
task, opens the tasks page or Analytics. Then they leave and someone else arrives. Of
the people online, about half are heavy users, 4 in 10 medium and 1 in 10 light.

```bash
node scripts/load/run.mjs isolation        # nobody can read or change another's data
node scripts/load/run.mjs steady 1000 120  # 1000 people using the app at once, 2 minutes
node scripts/load/run.mjs open 2000 60     # 2000 people open the app within a minute
OUT=results.json node scripts/load/run.mjs all
```

Each run prints requests per second, errors, response times (p50 / p95 / p99) per kind of
request, the CPU used by Postgres, PostgREST and the generator, and the slowest queries
(`pg_stat_statements`).

The generator shares the machine's 4 cores with the database and the API, so the numbers
are a floor: the same test on Supabase's own servers would only do better on CPU, but
adds the network. Compare runs with each other (before and after a change), not with a
promise of a number of users.
