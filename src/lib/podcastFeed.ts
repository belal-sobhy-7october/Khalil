/**
 * Reads a podcast's RSS feed into the episodes the Listening section plays.
 * Used by api/podcast.ts (the server side, which can fetch the feed) and
 * kept free of browser/server APIs so it is easy to test.
 */

export interface PodcastEpisode {
  /** `pod:<guid>` — the key progress is saved under. */
  id: string;
  title: string;
  /** The audio file. */
  audio: string;
  seconds: number;
  /** Publication date, YYYY-MM-DD. */
  date: string;
}

export interface PodcastFeed {
  title: string;
  /** Oldest first, so the list reads like a course. */
  episodes: PodcastEpisode[];
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
      if (code[0] === '#') {
        const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
      }
      return ENTITIES[code.toLowerCase()] ?? whole;
    })
    .trim();
}

/** The text inside the first `<tag>` of `xml` (tag may carry a namespace prefix such as itunes:). */
function tag(xml: string, name: string): string | undefined {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : undefined;
}

function attr(xml: string, name: string, attribute: string): string | undefined {
  const m = xml.match(new RegExp(`<${name}\\s[^>]*\\b${attribute}="([^"]*)"`, 'i'));
  return m ? decode(m[1]) : undefined;
}

/** "1:02:03", "12:05" or "725" → seconds. */
export function parseDuration(value: string | undefined): number {
  if (!value) return 0;
  const parts = value.trim().split(':').map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return 0;
  return Math.round(parts.reduce((total, n) => total * 60 + n, 0));
}

function isoDate(value: string | undefined): string {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
}

export function parsePodcastFeed(xml: string): PodcastFeed {
  const channel = xml.split(/<item[\s>]/i)[0];
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const episodes: PodcastEpisode[] = [];
  const seen = new Set<string>();
  items.forEach((item, i) => {
    const audio = attr(item, 'enclosure', 'url');
    if (!audio) return;
    const guid = tag(item, 'guid') || audio;
    const id = `pod:${guid}`;
    if (seen.has(id)) return;
    seen.add(id);
    episodes.push({
      id,
      title: tag(item, 'title') || `Episode ${items.length - i}`,
      audio,
      seconds: parseDuration(tag(item, 'itunes:duration')),
      date: isoDate(tag(item, 'pubDate')),
    });
  });
  // Feeds list the newest first; keep feed order for episodes on the same day.
  const ordered = episodes
    .map((e, i) => ({ e, i }))
    .sort((a, b) => (a.e.date && b.e.date && a.e.date !== b.e.date ? (a.e.date < b.e.date ? -1 : 1) : b.i - a.i))
    .map(({ e }) => e);
  return { title: tag(channel, 'title') ?? '', episodes: ordered };
}
