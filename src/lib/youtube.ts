/** Parse YouTube links into video / playlist ids and build embed URLs. */

export interface YouTubeRef {
  videoId: string | null;
  listId: string | null;
  start?: number;
}

export function parseYouTube(url: string | undefined): YouTubeRef | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\.|^music\./, '');
    const listId = u.searchParams.get('list');
    const t = u.searchParams.get('t') ?? u.searchParams.get('start');
    const start = t ? parseInt(t, 10) || undefined : undefined;
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return id ? { videoId: id, listId, start } : null;
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const v = u.searchParams.get('v');
      if (v) return { videoId: v, listId, start };
      const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{6,})/);
      if (m && m[1] !== 'videoseries') return { videoId: m[1], listId, start };
      if (listId) return { videoId: null, listId, start };
    }
  } catch {
    // not a URL
  }
  return null;
}

export function youtubeId(url: string | undefined): string | null {
  return parseYouTube(url)?.videoId ?? null;
}

export function youtubeEmbedUrl(ref: YouTubeRef): string {
  const base = 'https://www.youtube-nocookie.com/embed/';
  const params = new URLSearchParams({ rel: '0' });
  if (ref.start) params.set('start', String(ref.start));
  if (ref.videoId) {
    if (ref.listId) params.set('list', ref.listId);
    return `${base}${ref.videoId}?${params}`;
  }
  params.set('list', ref.listId ?? '');
  return `${base}videoseries?${params}`;
}
