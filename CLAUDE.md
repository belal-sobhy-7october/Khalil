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

## Checks

```bash
npm run lint
npx tsc -b --noEmit
npm test        # needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set (any values)
npm run build
```
