# Khalil — notes for agents

Personal dashboard (React 19 + TypeScript + Vite + Tailwind + Zustand + Supabase). See
`README.md` for setup and scripts. The app is in Arabic and English.

## Arabic is Fusha only (الفصحى فقط)

**Every Arabic word in Khalil is Modern Standard Arabic (الفصحى): no Egyptian or any other dialect, ever.**
This covers the interface (`translations.ts`), lessons and data, notes, prompts sent to the AI, docs, comments,
tests and e2e scripts. Write simple, friendly Fusha (لماذا، الآن، لا، هذا، اليوم), and use Arabic words where they
exist (تمثيل الأدوار، التسويق، المبيعات) instead of English ones spelled in Arabic letters.
`src/i18n/fusha.test.ts` lists the dialect words to avoid and fails on them in `src`,
`scripts`, `api`, `docs`, `.claude` and the top-level docs. Its `NOT_OURS` list is only for text that isn't ours (YouTube
titles as their channels wrote them, and the keywords that recognize what a user types); never add a file there to
silence the test, rewrite the text instead.

## Adding English topics (Topic Library)

**Read `src/data/topicPacks/README.md` before adding or editing a topic.** Every topic is a
full lesson that follows the owner's course method (warm-up → 12 words with the meaning they
have in the topic and an example → one grammar point → discussion → one-minute speaking
task → paragraph). The file explains the format, the quality rules and the checks.

## Offline

Khalil must keep working with no internet (the owner studies topics where there is no
network at all):

- `scripts/offlinePlugin.ts` writes `dist/sw.js` from `scripts/sw.template.js` at build time;
  it saves every built file on the device. `src/lib/offline.ts` registers it and holds the
  online/offline and "saved on this device" state.
- Topic packs are bundled data, so they work offline. Don't move them to the network.
- With no internet, `App.tsx` opens with the session saved on the device instead of waiting
  for supabase-js to fail refreshing the token.
- `scripts/e2e/offline.mjs` checks all of this against a production build, on a desktop, two phones
  (iPhone SE, Galaxy S24) and a tablet (iPad Mini) with touch (`--device` picks others).

## Public pages (search engines)

The app is behind a sign-in, so search engines only saw a login screen. The build now writes ~225 public
pages from the app's own data: home pages (`/ar`, `/en`), the Topic Library (`/{ar,en}/english-topics`, a page
per lesson in English), Call Center Prep (`/{ar,en}/call-center`, the interview questions in Arabic and English
and a page per question, the word bank in Arabic and English) and the Arabic sales chapters (`/ar/sales`).
**Read `docs/seo/README.md` before changing them** (the plan for the owner, in Arabic, then notes for developers).

- `src/seo/` describes the pages (`pages/*.ts`) and writes them as HTML and Markdown (`render.ts`), with
  `sitemap.xml`, `robots.txt`, `llms.txt`, `sitemap.md` and `404.html` (`site.ts`); `scripts/seoPlugin.ts`
  writes them into `dist/` and makes `vite preview` serve them like `vercel.json` does. New content in the
  data shows up as pages by itself; `src/seo/site.test.ts` checks titles, hreflang, links and routing.
- Never rename a published address: it comes from a topic's `id`, a question's `id`, a chapter's `id` and a
  vocabulary unit's **title** (`vocab.ts`).
- The Arabic word meanings and question translations are in `src/data/callCenter/vocabAr.ts` and
  `interviewAr.ts`; a new word or question needs its line there (the data test checks).
- The service worker doesn't save these files (`isSeoFile`); they aren't part of the app.

## Opening the app (one request, only what changed)

`appStore.loadUserData` asks `app_startup` (`supabase/migrations/20261025120000_sync_and_startup.sql`,
`src/lib/startup.ts`) for everything the tasks page needs in one request: the small lists in full, the
settings in `STARTUP_KV_KEYS`, and only the words, flashcard states, habit days and wird days that
changed since this device's last visit. The rest comes from the device's copy (`src/lib/syncCache.ts`,
IndexedDB, one record per account); a copy older than 60 days, or a `since` the server finds too old,
loads everything again.

- The migration stamps `updated_at` with the server's clock on those four tables, and its triggers write
  every deletion to `sync_deletions` (kept 90 days), so another device drops it too. A new table that the
  app keeps on the device needs the same triggers, a key in `applyChanges` and in the e2e fake.
- Until the migration runs on a database, `app_startup` doesn't exist and the app loads table by table
  (`loadTables`); the e2e scripts test that with `KHALIL_E2E_LEGACY=1`.
- `loadKv` takes the startup's settings without a request (`prefetchKv`); other keys asked for at the
  same moment go in one request, and a value loaded or saved less than a minute ago isn't asked for again.
- The calendar, the bookmarks and the focus sessions load when their page opens (`loadCalendarEvents`,
  `loadBookmarks`, `loadSessions`); moods and sub track entries aren't loaded (nothing shows them).

## Guests, the account buttons and Khalil's tour

Khalil opens without signing in (`src/lib/guest.ts`): a visitor gets an anonymous Supabase account, so
everything works and saves, in that browser only. The header shows "Create account" (links Google to that
same account, `linkIdentity`, so nothing is lost) and "Sign in" (an account made before) instead of the
account menu. After the guest's first change (`src/lib/writes.ts` hears every write the Supabase client
sends) Khalil asks them to create an account. With anonymous sign-ins off in Supabase, or no internet, the
visitor browses with nothing saved, and a store action that needs an account opens "Create account"
(`askForAccount`). Search engines get the welcome page (`LoginPage`), not an account. README → Setup →
step 4 has the Supabase switches.

- Khalil is also a character: his poses are `src/assets/mascot/<pose>.webp` (`Mascot`, `mascotPoses.ts`);
  a pose without its picture shows "خ". **Read `docs/mascot/README.md`** (the prompts and the 14 poses).
- His tour (`src/components/Guide/`, `src/lib/guide.ts`) opens once for a new guest; "Skip this part"
  and "Skip the tour"; anyone can take it again from the sidebar or the account menu. It is the last step
  of the character's work, so it waits for his pictures: until every pose it shows has one, it neither opens
  nor is offered, except in a browser with localStorage `khalil-guide-preview` = `1` (`guideAvailable`). A step points at
  an element by `data-guide="…"`, `#section-…` or another selector; keep those when moving things.
- `scripts/e2e/guest.mjs` checks all of it (guest account, tour, the save prompt, linking, a crawler,
  browsing with no account).

## Tasks & Habits (the page Khalil opens on)

The sidebar's first item (`todo`), in this order: Tasks & Habits, Focus, Learn Languages, Learn Skills,
Calendar, Bookmarks, Analytics, Settings. Choosing an item closes the menu on every screen size. Khalil
always opens on this page (a reload keeps the browser tab's page; Settings → General can open the last
page instead). It holds the daily focus, today's and this week's tasks, the whole wird sheet, the habits
(and tracking) and the backlog; Settings → Tasks & Habits orders and hides them (`src/lib/tasksSettings.ts`,
`user_kv` `tasks-settings`). The old `wird` and `life` sections are parts of it (`App.tsx` jumps to
`#section-wird` / `#section-life`).

- **One fact, one owner** (`src/lib/wirdSync.ts`): a prayer, a juz or the adhkar live in the wird
  (`wird_days`), a habit's day in `habit_entries`, a task in `todos`. Today's tasks list the wird items
  marked "in today's tasks" and the habits due today as rows that read and write their owner, never as
  copies (copying tasks into each day is what made the old rollover bring deleted ones back).
- A habit can be linked to a wird target (`prayer:fajr`, `prayer:fajr:jamaah` or an item id), saved in
  `user_kv` `habit-links`. While linked, its days are read from the wird (`useHabitEntries`, used by the
  habits grid and Analytics) and ticking it writes the wird. Linking moves its past days into the wird;
  unlinking writes the wird's days back as its own.
- The wird is the user's own (`src/lib/wirdItems.ts`, `user_kv` `wird-items`): the built-in items (the
  five prayers, rawatib, qiyam, Quran, adhkar) can be hidden, reordered and given goals, and the user's
  own items (`c-…`, a count or done/not done) keep their values in `WirdDay.custom`. `wirdScore` weights
  the shown items; with only the built-in ones it is the old score.
- Finished tasks stay, sink or hide (at once, the next day, after 24 hours) by `settings.completed`; a
  task's `updatedAt` is when it was ticked. Hidden ones are still saved, counted in Analytics and listed
  under "Finished".
- "Suggestion or problem?" (account menu, Settings, the sidebar) opens WhatsApp with the owner, on the
  owner's request (`src/lib/contact.ts`).
- The day's focus card has a focus shortcut (`QuickFocus`): one click starts a session with the timer's
  settings; the Focus page has the rest.

## Learn Languages and Learn Skills

Two sections in the sidebar hold the learning parts of Khalil, open to every account:
**Learn Languages** (`languages`: English, plus ten languages marked Soon) and **Learn Skills**
(`skills`: Call Center Prep and Sales Prep, plus 24 money-making skills marked Soon, nothing haram and
no trading). `src/data/learnCatalog.ts` lists them: an item with a `section` opens that section (English
is still `vocabulary`, then `callcenter` and `sales`), the rest are Soon. Names and one-line blurbs are
`learn.*` keys in `translations.ts`, icons are in `src/components/Learn/icons.ts`. The sidebar marks the
hub of the open section (`hubOf`), and each open section has a way back (`HubCrumb`, in `App.tsx`). To
open a Soon item, build its section and give it a `section` in the catalog.

## English hub sections (courses)

The English hub's tabs after Vocabulary are study sections (Pronunciation & Accent, Listening,
Reading, Grammar, Shadowing), named in English in both languages on the owner's request.

- `src/data/courseCatalog.ts` lists each section's sources and their levels in study order.
  YouTube episodes are generated into `src/data/courseEpisodes.ts` by
  `node scripts/sync-courses.mjs` (YouTube's web API; run it to pick up new episodes). A playlist can
  be `reverse`d (newest-first playlists) or limited to a `pick` of video ids in a chosen order (VOA's).
- The owner learns American English: VOA Learning English is in Listening and Pronunciation, and the
  Topic Library is written in American English (its test checks).
- Dalilk's daily podcast is read at runtime through `api/podcast.ts` (a Vercel function that
  finds the feed via Apple Podcasts) and played inside the page; the list is saved on the device.
- Reading starts with British Council LearnEnglish's graded texts (`src/data/britishCouncil.ts`, A1–C1,
  lesson kind `text`): read on their site, ticked by hand. Their site refuses cloud machines, so the
  list came from search results; add a lesson by its slug in `/free-resources/reading/<level>/<slug>`.
- Dalilk's novel library (`src/data/dalilkNovels.ts`) appears in Reading once that list is filled.
- Progress (`english-course-progress`) and watch positions (`english-course-positions`) are
  per-user `user_kv` values; lessons resume where they stopped and tick themselves near the end.

## Call Center Prep (in Learn Skills)

A section (`callcenter`), open to every account: a plan from B1 to C1 and an English call center job in
Egypt, first written for the owner. **Read `src/data/callCenter/README.md` before changing it**; Levels 4–5 are still to build,
and their detailed plan is in `src/data/callCenter/ROADMAP.md`.

- The repo is public, so never write the owner's email anywhere.
- Progress is in `user_kv` (`callcenter-*` keys); voice recordings stay on the device (IndexedDB).
- Selecting English text anywhere in the app shows "Add to my words" (`SelectionWordMenu`, mounted in
  `App.tsx`); an element's `data-vocab-group` picks the flashcard group (the section uses My words).
- The word bank (`src/data/callCenter/vocab.ts`, 384 words, a unit a day in Level 1) goes into the
  Vocabulary flashcards, so its progress is the flashcards' mastery; every word has YouGlish and
  every passage a read-aloud bar (device voice or NaturalReader).
- Ibrahim Adel's three grammar playlists are daily `lesson` tasks in Levels 1–3; his accent course is the
  optional Accent tab and must stay out of the plan (`src/data/callCenter/ibrahimAdel.ts`).
- The Library tab's playlists are in `src/data/callCenter/catalog.ts`;
  `node scripts/sync-courses.mjs callcenter` regenerates their episodes.

## Sales Prep (in Learn Skills)

A section (`sales`), open to every account: sales, marketing and negotiation from zero, as knowledge for any job. Four
Knowledge books (sales, psychology, marketing, negotiation) are daily tasks in Levels 1–2 (Arabic, Fusha),
then Level 3 is the same skills in English; Today shows only one day. Selling electronics (the owner's current
job, learned inside the company) is an Extra tab outside the plan. **Read `src/data/sales/README.md`
before changing it.** Progress is in `user_kv` (`sales-*` keys). Listening tasks link searches unless a video id is confirmed.

## Learning Path (مسار التعلم)

Daily English practice from the learner's own level (A1 to C1), with no end date, open to every account:
the first tab of the English hub (`path`; the old `path` section redirects there). It promises no level
and no deadline (the owner's rule): it gives every day a little of every skill. It isn't a separate
course: every day has the same six blocks, one per hub section (Vocabulary, Pronunciation & Accent,
Listening, Reading, Grammar, Shadowing), about 20 minutes each (10/15/20/30 in its settings), and plays
the hub's own lessons inside the block.

- `src/lib/learningPath.ts` builds the days (`buildPath(settings)`): each section's lessons in study order,
  packed into days by length × a study factor (`STUDY_FACTOR`), long lessons cut into parts. The path lasts
  as long as any section has lessons (about two years at 20 minutes) and grows by itself when content is
  added; a section that ran out gives its time to "your choice" in its tab. Vocabulary is the flashcard
  review plus the words of the day's topic (`PATH_TOPICS`, a topic a day from the learner's level up,
  then the easier ones; the library has B1–C1 topics, so A1–A2 start with the easiest); Grammar is
  Ibrahim Adel's course, then the grammar point of the day's topic (every topic's once).
- Settings: "Your level" (`level`) sets where the topics start and, through `startsFor`, where every
  section starts; then the sources (Listening VOA, the default, or Ibrahim Adel; Reading British Council,
  the default, or Ibrahim Adel) and each section's own start can still be changed.
- Lessons are ticked in the hub's progress (`english-course-progress`), so one finished here or in its tab
  is done in both. The path's own `user_kv` value (`learning-path-v2`) keeps the settings, what the hub
  can't know (reviews, grammar points, sound drills, parts of lessons) and notes, keyed by `itemKey`.
- Words reach the flashcards only through the "Add to my flashcards" button. `flows.mjs` has a
  `learning-path` flow.

## Spaced repetition (flashcards)

Reviews are scheduled with FSRS (`ts-fsrs`, Anki's algorithm) in `src/lib/srs.ts`: Again / Hard / Good /
Easy with interval previews, learning steps 1m/10m, a daily new-word limit, hard words and leeches.
Each word's state is a `user_kv` row `srs:<word id>` (`src/lib/srsSync.ts`, mirrored on the device) — no
table change; `mastery_level` is still written (derived from the state) for the stars and Call Center's
"known" counts. Words reviewed before FSRS are estimated from their old level (`legacyCard`). Settings are
`srs-settings`; reminders (`src/lib/reviewReminder.ts`, `ReviewReminders` in `App.tsx`) notify while Khalil
is open and offer a calendar event for when it's closed.

## Checks

```bash
npm run lint
npx tsc -b --noEmit
npm test        # needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set (any values)
npm run build
```

End to end (Playwright, against a fake Supabase), with a dev server on port 5173
(`VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite --port 5173`):
`node scripts/e2e/smoke.mjs http://localhost:5173 <dir>` (every section, both languages and themes),
`node scripts/e2e/flows.mjs …` (add, edit, delete, reload), `node scripts/e2e/callcenter.mjs …` (every
tab, and progress kept after a reload), `node scripts/e2e/sales.mjs …` (the same for Sales Prep) and
`node scripts/e2e/guest.mjs …` (opening without an account).
`scripts/e2e/offline.mjs` runs against a production build (see Offline).

Phones and tablets: `node scripts/e2e/devices.mjs http://localhost:5173 <dir>` goes through every
section, tab and main dialog with touch on 10 devices (iPhone SE to iPad Pro, Android phones and
tablets, a fold, phones held sideways) in both languages, and writes `<dir>/report.md`. Read
`.claude/skills/device-check/SKILL.md` first: it explains the options and the findings, and how
they've been fixed here. Controls that show on hover need `[@media(hover:none)]:opacity-100`
(phones have no hover), and dialogs use `svh`, not `vh`.
