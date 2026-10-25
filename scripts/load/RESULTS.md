# Load test results — 25 October 2026

How to run it: `README.md`. Setup: 20,000 seeded users (12 million rows, 3.9 GB), Postgres 16 +
PostgREST 12.2 (pool of 10 connections) on one machine with **4 cores and 16 GB**, shared with the
load generator. Simulated people open the app and then act every ~10 s (ticks, flashcards, saves).

## Security

`run.mjs isolation`: 200 pairs of users, 8 tables, reads / updates / deletes / inserts across
users, anonymous requests and a forged token. **No user could read, change or delete another
user's data**, on the full 20,000-user database.

## One app open

What the real app sends when it opens (`record.mjs`, production build), whatever page it opens on:

| | Requests | Data |
|---|---|---|
| A heavy user (1,000 words, a year of wird and habits) | 26 | 1.28 MB |
| The mix of people online (half heavy) | 26 | 0.71 MB on average |

The largest parts for a heavy user: the word list (600 KB), the flashcard states (277 KB), all the
habit days (168 KB), all the wird days (101 KB), a year of focus sessions (52 KB) and all tasks (45 KB).

## Many people opening the app (`open N 60`)

| App opens | Requests/s | Errors | Whole app loaded (p50 / p95 / p99) |
|---|---|---|---|
| 10 a second | 260 | 0 | 19 / 31 / 39 ms |
| 20 a second | 520 | 0 | 17 / 27 / 33 ms |
| 30 a second | 778 | 0 | 18 / 31 / 44 ms |
| 40 a second | 1,039 | 0 | 19 / 44 / 120 ms |
| 50 a second | 1,299 | 0 | 20 / 75 / 150 ms |

## Many people using it at once (`steady N 150`, arriving over a minute)

| People at once | Requests/s | Errors | Response time (p50 / p95 / p99) |
|---|---|---|---|
| 100 ² | 39 | 0 | 8 / 23 / 31 ms |
| 500 ² | 204 | 0 | 7 / 19 / 25 ms |
| 1,000 ² | 407 | 4 ¹ | 8 / 88 / 142 ms |
| 1,500 | 525 | 10 ¹ | 7 / 24 / 41 ms |
| 2,000 | 697 | 19 ¹ | 8 / 28 / 99 ms |
| 2,000, after the fix ¹ | 689 | **0** | 8 / 33 / 167 ms |
| 3,000 | 834 | 28 ¹ | 2.2 s / 17 s / 19 s — overloaded |
| 4,000 | 873 | 22 ¹ | 7 s / 40 s / 44 s — overloaded |

¹ All the errors were the same: the same person ticking a habit on two devices at once got a
duplicate-key error (409), and the app then showed the habit as not done though it was saved.
Fixed in `appStore.toggleHabitEntry` (a tick already made elsewhere counts as done; untick by habit
and day); the 2,000 run after the fix has no errors.

² Earlier runs: 90 s, with everyone arriving within 20 s.

A burst is different from a crowd: 2,000 people arriving **within 20 seconds** (100 app opens a
second) overloaded the server (p50 7–10 s) even with a pool of 20, while the same 2,000 arriving
over a minute ran in tens of milliseconds.

## Where the limit is

- Postgres is not it: its queries take 0.3–4 ms (the word list is the slowest, 4 ms), and its
  connections wait on PostgREST most of the time.
- PostgREST's CPU is: about 2,600 small requests a second here, and about 350 a second for a
  1,000-word list (≈ 205 MB/s). An app open costs it 26 requests and 0.7 MB, so the number of
  requests and their size are what decide how many people one server takes.
- On this machine: about **50 app opens a second** and **2,000–2,500 people using the app at the
  same moment**. Supabase's smaller computes have fewer cores, so the same app reaches its limit
  earlier there.

## What 20,000 users means

20,000 accounts don't use the app at the same time. Even if all 20,000 opened it within the same
hour (≈ 6 opens a second, a few hundred people at once), that's well within the measured limits.

The cost to watch is **egress** (data sent to users): at 0.7 MB per open, 5,000 opens a day is
about 3.5 GB a day, around 100 GB a month, before any compression. Supabase's Free plan includes
5 GB a month and Pro 250 GB, then $0.09 per GB
([Supabase: managing egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)).

## What would help most (before the changes below)

1. **Don't download again what the device already has.** The words, flashcard states, habit days
   and wird days are kept on the device; fetching only what changed since the last visit
   (`updated_at`) would cut most of the 0.7 MB per open.
2. **One request instead of many** for the small lists and settings at startup (an RPC that returns
   them together): 26 requests → about 8. Needs a migration.
3. **Load a page's data when the page opens**: focus sessions, the calendar, moods, bookmarks and
   notes aren't on the tasks page.

## After: one request, only what changed (same day, same machine)

All three are done (`supabase/migrations/20261025120000_sync_and_startup.sql`, `src/lib/startup.ts`,
`src/lib/syncCache.ts`): the app opens with one `app_startup` request, keeps the words, flashcard
states, habit days and wird days on the device and asks only for what changed since its last visit,
and the calendar, bookmarks and focus sessions load when their page opens.

### One app open

What the real app sends when it opens now (`record.mjs`, production build):

| | Requests | First visit on a device | Opening it again a minute later | A day later ¹ |
|---|---|---|---|---|
| A heavy user | 26 → **1** | 1.23 MB | **56 KB** | 113 KB |
| A medium user | 26 → **1** | 187 KB | 19 KB | 34 KB |
| A light user | 26 → **1** | 9 KB | 3 KB | 3 KB |
| The mix online (half heavy) | 26 → **1** | 0.69 MB | **36 KB** | 70 KB |

¹ `app_startup` with `since` a day back: what a heavy user changes in a day (about 60 words and
flashcard states) plus the small lists, which always come whole (the tasks are most of it: 45 KB
for 150 tasks).

The first visit on a device costs what it did; every visit after it costs about a tenth. A page that
loads its own data asks once when it opens: the calendar (11 KB), the focus sessions (50 KB, on Focus
and Analytics), the English hub's progress (one request for all its values).

### The load test again (`OPEN=startup`, 1 open in 10 on a device with no copy yet)

| | Before (26 requests) | After (1 request) |
|---|---|---|
| 2,000 people at once | p50 8 · p95 33 · p99 167 ms | p50 2.7 · p95 **7.2** · p99 **17** ms |
| 3,000 people at once | **overloaded** (p50 2.2 s) | p50 2.7 · p95 9.2 · p99 137 ms |
| 4,000 people at once | **overloaded** (p50 7 s) | p50 2.8 · p95 17 · p99 517 ms |
| 50 app opens a second | app loaded in p50 20 · p95 75 · p99 150 ms | p50 8.3 · p95 37 · p99 49 ms |
| 100 app opens a second | **collapsed** (a burst of 100 a second) | p50 7.9 · p95 36 · p99 50 ms |
| 200 app opens a second | — | p50 8.7 · p95 36 · p99 55 ms |
| 50 a second, all on new devices (`FIRST=1`) | (as 50 above) | p50 21 · p95 52 · p99 66 ms |

No errors in any run. The work moved: Postgres now builds the response (PostgREST used to), so on a
first visit it does more than before; the function returns `json`, not `jsonb`, which Postgres builds
3–4 times faster (a heavy user's first visit: 17–23 ms instead of 57–86 ms). A returning visit reads only
the changed rows through the `(user_id, updated_at)` indexes: about 3 ms in Postgres.

What it means for 20,000 users: the machine that reached its limit at 2,000–2,500 people at once now
serves 4,000 with room to spare, and **egress** falls with the size of a visit: at 5,000 opens a day,
1 in 10 on a new device (0.69 MB) and the rest a day after the last (70 KB), about 0.65 GB a day
(≈ 20 GB a month) instead of 3.5 GB a day (≈ 100 GB a month); within Supabase Pro's 250 GB.
