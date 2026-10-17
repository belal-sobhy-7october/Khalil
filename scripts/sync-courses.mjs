#!/usr/bin/env node
/**
 * Regenerates src/data/courseEpisodes.ts: the episodes (id, title, length)
 * of every YouTube playlist listed in src/data/courseCatalog.ts, in
 * playlist order.
 *
 *   node scripts/sync-courses.mjs
 *
 * Reads public playlists through YouTube's web client API (the one
 * youtube.com itself calls) — no API key needed. Unavailable/private
 * episodes, the catalog's `exclude` ids and lessons already in an earlier
 * playlist of the same source are dropped.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const { COURSE_CATALOG } = await import(new URL('src/data/courseCatalog.ts', root).href);

const API = 'https://youtubei.googleapis.com/youtubei/v1/browse?prettyPrint=false';
const CONTEXT = { client: { clientName: 'WEB', clientVersion: '2.20250101.00.00', hl: 'en', gl: 'US' } };

async function browse(body) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, context: CONTEXT }),
  });
  if (!res.ok) throw new Error(`YouTube answered ${res.status}`);
  return res.json();
}

/** Every value stored under `key` anywhere in the response. */
function* walk(node, key) {
  if (Array.isArray(node)) for (const v of node) yield* walk(v, key);
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === key) yield v;
      yield* walk(v, key);
    }
  }
}

const text = (t) => t?.simpleText ?? t?.runs?.map((r) => r.text).join('') ?? '';
const seconds = (len) => len.split(':').reduce((total, part) => total * 60 + Number(part), 0);
// Status marks in some titles would read as "already done" next to a checkbox.
const cleanTitle = (title) => title.replace(/[✅🔥]/gu, '').replace(/\s{2,}/g, ' ').trim();

/** Episodes in one page of a playlist, from either of YouTube's layouts. */
function* pageEpisodes(data) {
  for (const v of walk(data, 'playlistVideoRenderer')) {
    if (v.videoId && v.isPlayable !== false && v.lengthText) {
      yield { id: v.videoId, title: text(v.title), length: text(v.lengthText) };
    }
  }
  for (const v of walk(data, 'lockupViewModel')) {
    if (v.contentType !== 'LOCKUP_CONTENT_TYPE_VIDEO') continue;
    const badge = walk(v.contentImage, 'thumbnailBadgeViewModel').next().value;
    const title = v.metadata?.lockupMetadataViewModel?.title?.content;
    // Unavailable videos carry no length badge.
    if (v.contentId && title && /^\d+(:\d+)+$/.test(badge?.text ?? '')) yield { id: v.contentId, title, length: badge.text };
  }
}

/** A lesson title without what the course and level already say (sources with `tidyTitles`). */
export function tidyTitle(title, playlistName) {
  let t = title.split('|')[0];
  // "A1 English Listening Practice - Cooking" in the "A1 English Listening Practice" level → "Cooking"
  if (t.toLowerCase().startsWith(playlistName.toLowerCase())) t = t.slice(playlistName.length).replace(/^\s*[-–:]\s*/, '');
  t = t
    .replace(/\b(?:beginner|intermediate|upper-intermediate|advanced)\s+english\s+story\b/gi, ' ')
    .replace(/\blevel\s+\d+(?:\s*[-–]\s*\d+)?\b/gi, ' ')
    .replace(/\b[ABC][12](?:\s*[-–/]\s*[ABC][12])?\b/g, ' ')
    .replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s\-–:,]+|[\s\-–:,]+$/g, '');
  return t || title;
}

async function playlistEpisodes(listId) {
  const episodes = [];
  const seen = new Set();
  let pages = 1;
  let data = await browse({ browseId: `VL${listId}` });
  for (;;) {
    for (const e of pageEpisodes(data)) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      episodes.push({ id: e.id, title: cleanTitle(e.title), seconds: seconds(e.length) });
    }
    // The token sits in a nested continuationCommand; the outer one wraps it.
    const next = [...walk(data, 'continuationCommand')].find((c) => c.token)?.token;
    if (!next || ++pages > 50) return episodes;
    data = await browse({ continuation: next });
  }
}

const out = {};
const youtubeSources = COURSE_CATALOG.flatMap((section) =>
  section.sources.filter((s) => s.kind === 'youtube').map((source) => ({ label: `${section.id}/${source.id}`, source }))
);
for (const { label, source } of youtubeSources) {
  const inSource = new Set();
  for (const playlist of source.playlists) {
    const skip = new Set(playlist.exclude ?? []);
    const episodes = (await playlistEpisodes(playlist.id))
      .filter((e) => !skip.has(e.id) && !inSource.has(e.id))
      .map((e) => (source.tidyTitles ? { ...e, title: tidyTitle(e.title, playlist.name) } : e));
    for (const e of episodes) inSource.add(e.id);
    if (!episodes.length) throw new Error(`No episodes found for ${playlist.id} — has YouTube's response changed?`);
    out[playlist.id] = episodes;
    console.log(`${label.padEnd(30)} ${String(episodes.length).padStart(3)}  ${playlist.name}`);
  }
}

const file = fileURLToPath(new URL('src/data/courseEpisodes.ts', root));
const body = Object.entries(out)
  .map(([id, eps]) => `  '${id}': [\n${eps.map((e) => `    ${JSON.stringify(e)},`).join('\n')}\n  ],`)
  .join('\n');
writeFileSync(
  file,
  `// Generated by scripts/sync-courses.mjs on ${new Date().toISOString().slice(0, 10)} — do not edit by hand.\n` +
    `import type { CourseLesson } from './courses';\n\n` +
    `export const COURSE_EPISODES: Record<string, Pick<CourseLesson, 'id' | 'title' | 'seconds'>[]> = {\n${body}\n};\n`
);
console.log(`Wrote ${file}`);
