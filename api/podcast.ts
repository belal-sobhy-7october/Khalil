/**
 * GET /api/podcast?id=<Apple Podcasts id> — the episodes of a podcast in the
 * course catalog, as JSON for the Listening section. Runs on Vercel: the
 * browser can't read the feed itself (other site, no CORS).
 */
import { COURSE_CATALOG } from '../src/data/courseCatalog';
import { parsePodcastFeed } from '../src/lib/podcastFeed';

const ALLOWED = new Set(COURSE_CATALOG.flatMap((s) => s.sources.flatMap((src) => (src.kind === 'podcast' ? [src.appleId] : []))));

const json = (body: unknown, status: number, cache = 'no-store') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  });

export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!ALLOWED.has(id)) return json({ error: 'Unknown podcast' }, 404);
  try {
    const lookup = await fetch(`https://itunes.apple.com/lookup?id=${id}&entity=podcast`);
    const feedUrl: unknown = ((await lookup.json()) as { results?: Array<{ feedUrl?: string }> }).results?.[0]?.feedUrl;
    if (typeof feedUrl !== 'string') throw new Error('No feed for this podcast');
    const feed = await fetch(feedUrl, { headers: { 'User-Agent': 'Khalil (personal study app)' } });
    if (!feed.ok) throw new Error(`Feed answered ${feed.status}`);
    const parsed = parsePodcastFeed(await feed.text());
    if (!parsed.episodes.length) throw new Error('Feed has no episodes');
    // Cached on Vercel's edge for an hour, then refreshed in the background.
    return json(parsed, 200, 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Feed unavailable' }, 502);
  }
}
