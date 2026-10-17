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
- `scripts/e2e/offline.mjs` checks all of this against a production build.

## English hub sections (courses)

The English hub's tabs after Vocabulary are study sections (Pronunciation & Accent, Listening,
Reading, Grammar, Shadowing), named in English in both languages on the owner's request.

- `src/data/courseCatalog.ts` lists each section's sources and their levels in study order.
  YouTube episodes are generated into `src/data/courseEpisodes.ts` by
  `node scripts/sync-courses.mjs` (YouTube's web API; run it to pick up new episodes).
- Dalilk's daily podcast is read at runtime through `api/podcast.ts` (a Vercel function that
  finds the feed via Apple Podcasts) and played inside the page; the list is saved on the device.
- Dalilk's novel library (`src/data/dalilkNovels.ts`) appears in Reading once that list is filled.
- Progress (`english-course-progress`) and watch positions (`english-course-positions`) are
  per-user `user_kv` values; lessons resume where they stopped and tick themselves near the end.

## Call Center Prep (owner-only)

A private section (`callcenter`): the owner's plan from B1 to C1 and an English call center job in
Egypt. **Read `src/data/callCenter/README.md` before changing it**; Levels 4–5 are still to build,
and their detailed plan is in `src/data/callCenter/ROADMAP.md`.

- Only the owner's account sees it: `src/lib/callCenter/access.ts` compares a salted SHA-256 of the
  signed-in email. The repo is public, so never write the owner's email anywhere. For screenshots
  and E2E runs, build with `VITE_CALL_CENTER_PREVIEW=1` (never on the deployed site).
- Progress is in `user_kv` (`callcenter-*` keys); voice recordings stay on the device (IndexedDB).
- The word bank (`src/data/callCenter/vocab.ts`, 384 words, a unit a day in Level 1) goes into the
  Vocabulary flashcards, so its progress is the flashcards' mastery; every word has YouGlish and
  every passage a read-aloud bar (device voice or NaturalReader).
- The Library tab's playlists are in `src/data/callCenter/catalog.ts`;
  `node scripts/sync-courses.mjs callcenter` regenerates their episodes.

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
`node scripts/e2e/flows.mjs …` (add, edit, delete, reload) and, with `VITE_CALL_CENTER_PREVIEW=1` on
the dev server, `node scripts/e2e/callcenter.mjs …` (every tab, and progress kept after a reload).
`scripts/e2e/offline.mjs` runs against a production build (see Offline).
