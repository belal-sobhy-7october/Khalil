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

## Checks

```bash
npm run lint
npx tsc -b --noEmit
npm test        # needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set (any values)
npm run build
```
