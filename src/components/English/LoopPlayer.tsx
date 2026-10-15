import { useEffect, useRef, useState } from 'react';
import { Repeat, RotateCcw, Flag, Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { loadYouTubeApi, type YTPlayer } from '../../lib/youtubeIframeApi';
import type { YouTubeRef } from '../../lib/youtube';

const RATES = [0.5, 0.75, 1, 1.25];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * YouTube player with shadowing controls: speed, "back 5s", and an A–B loop
 * to repeat one sentence until it sounds right.
 */
export default function LoopPlayer({ source }: { source: YouTubeRef }) {
  const { t } = useTranslation();
  // React owns the host only; the API replaces its child with an iframe.
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [rate, setRate] = useState(1);
  const [a, setA] = useState<number | null>(null);
  const [b, setB] = useState<number | null>(null);
  const [looping, setLooping] = useState(false);

  useEffect(() => {
    let alive = true;
    const host = hostRef.current;
    loadYouTubeApi()
      .then((YT) => {
        if (!alive || !host) return;
        const mount = document.createElement('div');
        host.replaceChildren(mount);
        playerRef.current = new YT.Player(mount, {
          width: '100%',
          height: '100%',
          host: 'https://www.youtube-nocookie.com',
          videoId: source.videoId ?? undefined,
          playerVars: {
            rel: 0,
            playsinline: 1,
            ...(source.start ? { start: source.start } : {}),
            ...(source.listId ? { listType: 'playlist', list: source.listId } : {}),
          },
          events: {
            onReady: () => alive && setReady(true),
            onError: () => alive && setFailed(true),
          },
        });
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      try {
        playerRef.current?.destroy();
      } catch {
        // already gone
      }
      playerRef.current = null;
      host?.replaceChildren();
    };
  }, [source.videoId, source.listId, source.start]);

  // A–B loop: jump back to A whenever playback passes B.
  useEffect(() => {
    if (!looping || a === null || b === null || b <= a) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (p && p.getCurrentTime() >= b) p.seekTo(a, true);
    }, 150);
    return () => window.clearInterval(id);
  }, [looping, a, b]);

  const now = () => playerRef.current?.getCurrentTime() ?? 0;
  const changeRate = (r: number) => {
    setRate(r);
    playerRef.current?.setPlaybackRate(r);
  };
  const clearLoop = () => {
    setA(null);
    setB(null);
    setLooping(false);
  };

  const btn = 'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors';

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
        <div ref={hostRef} className="absolute inset-0" />
        {!ready && !failed && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm p-4 text-center">
            {t('english.player.failed')}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2" dir="ltr">
        <div className="flex rounded-lg border border-border-subtle overflow-hidden">
          {RATES.map((r) => (
            <button
              key={r}
              onClick={() => changeRate(r)}
              disabled={!ready}
              className={`px-2 py-1.5 text-xs ${rate === r ? 'bg-clay-soft text-white' : 'text-ink hover:bg-ink/5'}`}
            >
              {r}x
            </button>
          ))}
        </div>
        <button disabled={!ready} onClick={() => playerRef.current?.seekTo(Math.max(0, now() - 5), true)} className={`${btn} bg-ink/5 text-ink hover:bg-ink/10`}>
          <RotateCcw size={13} /> 5s
        </button>
        <button disabled={!ready} onClick={() => { setA(now()); setLooping(false); }} className={`${btn} bg-ink/5 text-ink hover:bg-ink/10`}>
          <Flag size={13} /> A{a !== null ? ` ${fmt(a)}` : ''}
        </button>
        <button
          disabled={!ready || a === null}
          onClick={() => {
            const end = now();
            if (a !== null && end > a) {
              setB(end);
              setLooping(true);
              playerRef.current?.seekTo(a, true);
            }
          }}
          className={`${btn} bg-ink/5 text-ink hover:bg-ink/10 disabled:opacity-40`}
        >
          <Flag size={13} /> B{b !== null ? ` ${fmt(b)}` : ''}
        </button>
        <button
          disabled={a === null || b === null}
          onClick={() => setLooping((l) => !l)}
          className={`${btn} ${looping ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'} disabled:opacity-40`}
          aria-pressed={looping}
        >
          <Repeat size={13} /> {t('english.player.loop')}
        </button>
        {(a !== null || b !== null) && (
          <button onClick={clearLoop} className="text-xs text-ink-lighter hover:text-ink">{t('english.player.clear')}</button>
        )}
      </div>
      <p className="text-[11px] text-ink-lighter">{t('english.player.hint')}</p>
    </div>
  );
}
