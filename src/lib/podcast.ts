/**
 * A podcast's episodes for the Listening section: read through
 * /api/podcast (see api/podcast.ts), saved on the device so the list opens
 * at once and with no internet, and refreshed now and then.
 */
import { useCallback, useEffect, useState } from 'react';
import type { CourseGroup } from '../data/courses';
import type { PodcastEpisode, PodcastFeed } from './podcastFeed';

/** Refresh the saved list when it's older than this. */
const STALE_MS = 3 * 60 * 60 * 1000;
/** Episodes per part, so ~600 episodes read as levels with their own progress. */
export const EPISODES_PER_PART = 50;

interface Saved {
  savedAt: number;
  feed: PodcastFeed;
}

const cacheKey = (appleId: string) => `khalil-podcast:${appleId}`;

function readSaved(appleId: string): Saved | null {
  try {
    const raw = localStorage.getItem(cacheKey(appleId));
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(appleId: string, feed: PodcastFeed) {
  try {
    localStorage.setItem(cacheKey(appleId), JSON.stringify({ savedAt: Date.now(), feed } satisfies Saved));
  } catch {
    // storage full or blocked: the list just loads again next time
  }
}

export async function fetchPodcast(appleId: string): Promise<PodcastFeed> {
  const res = await fetch(`/api/podcast?id=${encodeURIComponent(appleId)}`);
  if (!res.ok) throw new Error(`Podcast list answered ${res.status}`);
  const feed = (await res.json()) as PodcastFeed;
  if (!Array.isArray(feed.episodes)) throw new Error('Unexpected podcast list');
  return feed;
}

/** The episodes as parts of 50, numbered from the first episode. */
export function podcastGroups(sourceId: string, episodes: PodcastEpisode[]): CourseGroup[] {
  const groups: CourseGroup[] = [];
  for (let start = 0; start < episodes.length; start += EPISODES_PER_PART) {
    const part = episodes.slice(start, start + EPISODES_PER_PART);
    groups.push({
      id: `${sourceId}-${start / EPISODES_PER_PART + 1}`,
      name: `Episodes ${start + 1}–${start + part.length}`,
      lessons: part.map((e) => ({ id: e.id, title: e.title, seconds: e.seconds, kind: 'audio' as const, url: e.audio })),
    });
  }
  return groups;
}

export type PodcastStatus = 'loading' | 'ready' | 'error';

/** The podcast's episodes (saved copy first), with a way to try again after an error. */
export function usePodcast(appleId: string | undefined): { status: PodcastStatus; feed: PodcastFeed | null; retry: () => void } {
  const [state, setState] = useState<{ status: PodcastStatus; feed: PodcastFeed | null }>(() => {
    const saved = appleId ? readSaved(appleId) : null;
    return { status: saved ? 'ready' : 'loading', feed: saved?.feed ?? null };
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!appleId) return;
    const saved = readSaved(appleId);
    if (saved && Date.now() - saved.savedAt < STALE_MS && attempt === 0) return;
    let alive = true;
    fetchPodcast(appleId)
      .then((feed) => {
        save(appleId, feed);
        if (alive) setState({ status: 'ready', feed });
      })
      .catch(() => {
        // Keep showing the saved list when there is one.
        if (alive) setState((s) => (s.feed ? s : { status: 'error', feed: null }));
      });
    return () => {
      alive = false;
    };
  }, [appleId, attempt]);

  const retry = useCallback(() => {
    setState((s) => (s.feed ? s : { status: 'loading', feed: null }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
