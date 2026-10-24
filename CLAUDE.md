# Khalil — notes for agents

Personal dashboard (React 19 + TypeScript + Vite + Tailwind + Zustand + Supabase). See
`README.md` for setup and scripts. The owner uses the app in Arabic (Egyptian) and English.

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
Knowledge books (sales, psychology, marketing, negotiation) are daily tasks in Levels 1–2 (Egyptian Arabic),
then Level 3 is the same skills in English; Today shows only one day. Selling electronics (the owner's current
job, learned inside the company) is an Extra tab outside the plan. **Read `src/data/sales/README.md`
before changing it.** Progress is in `user_kv` (`sales-*` keys). Listening tasks link searches unless a video id is confirmed.

## Learning Path (مسار التعلم)

A 90-day English roadmap, open to every account: the first tab of the English hub (`path`; the old
`path` section redirects there). It isn't a separate course: every day has the same six blocks, one per
hub section (Vocabulary, Pronunciation & Accent, Listening, Reading, Grammar, Shadowing), about 20
minutes each (10/15/20/30 in its settings), and plays the hub's own lessons inside the block.

- `src/lib/learningPath.ts` builds the days (`buildPath(settings)`): each section's lessons in study order,
  packed into days by length × a study factor (`STUDY_FACTOR`), long lessons cut into parts. Vocabulary is
  the flashcard review plus the words of the day's topic (`PATH_TOPICS`: all 90 Topic Library packs, one
  a day, B1 → B2 → C1); Grammar is Ibrahim Adel's course, then the grammar point of the day's topic.
- Settings choose the sources and levels: Listening VOA (American English, the default) or Ibrahim Adel,
  Reading British Council (the default) or Ibrahim Adel, and the Shadowing level.
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
tab, and progress kept after a reload) and `node scripts/e2e/sales.mjs …` (the same for Sales Prep).
`scripts/e2e/offline.mjs` runs against a production build (see Offline).

Phones and tablets: `node scripts/e2e/devices.mjs http://localhost:5173 <dir>` goes through every
section, tab and main dialog with touch on 10 devices (iPhone SE to iPad Pro, Android phones and
tablets, a fold, phones held sideways) in both languages, and writes `<dir>/report.md`. Read
`.claude/skills/device-check/SKILL.md` first: it explains the options and the findings, and how
they've been fixed here. Controls that show on hover need `[@media(hover:none)]:opacity-100`
(phones have no hover), and dialogs use `svh`, not `vh`.
