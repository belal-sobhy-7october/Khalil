import { useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { clockLength } from '../../lib/courseProgress';

const RATES = [0.75, 1, 1.25, 1.5];

/**
 * Plays a podcast episode inside the page, reporting where it is like the
 * YouTube player does, so episodes resume and tick themselves off.
 */
export default function AudioPlayer({ src, start = 0, onProgress, onEnded }: {
  src: string;
  /** Seconds to start from. */
  start?: number;
  /** Where playback is, every second while playing and when it pauses or ends. */
  onProgress?: (seconds: number, playing: boolean) => void;
  onEnded?: () => void;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(start);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);
  const callbacks = useRef({ onProgress, onEnded });
  useEffect(() => {
    callbacks.current = { onProgress, onEnded };
  });

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    let lastReport = 0;
    const report = (isPlaying: boolean) => {
      lastReport = Date.now();
      callbacks.current.onProgress?.(audio.currentTime, isPlaying);
    };
    const onMeta = () => {
      setDuration(audio.duration || 0);
      if (start) audio.currentTime = start;
      setState('ready');
      void audio.play().catch(() => {
        // autoplay refused: the play button is there
      });
    };
    const onTime = () => {
      setCurrent(audio.currentTime);
      if (!audio.paused && Date.now() - lastReport >= 1000) report(true);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => {
      setPlaying(false);
      if (!audio.ended) report(false);
    };
    const onEnd = () => {
      setPlaying(false);
      report(false);
      callbacks.current.onEnded?.();
    };
    const onError = () => setState('error');
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
      if (!audio.paused) report(false);
      audio.pause();
    };
  }, [src, start]);

  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => setState('error'));
    else audio.pause();
  };
  const jump = (by: number) => {
    const audio = ref.current;
    if (audio) audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + by));
  };
  const changeRate = (r: number) => {
    setRate(r);
    if (ref.current) ref.current.playbackRate = r;
  };

  const ready = state === 'ready';
  const round = 'w-10 h-10 rounded-full flex items-center justify-center text-ink-light hover:text-ink hover:bg-ink/5 disabled:opacity-40 transition-colors';

  return (
    <div className="rounded-2xl border border-border-subtle bg-linear-to-br from-clay-soft/10 via-card/60 to-gold-soft/10 p-4 sm:p-5 space-y-4">
      <audio ref={ref} src={src} preload="metadata" />
      {state === 'error' ? (
        <p className="text-sm text-ink-light text-center py-4">
          {t('english.courses.audioFailed')}{' '}
          <a href={src} target="_blank" rel="noopener noreferrer" className="text-clay-soft hover:underline">
            {t('english.courses.openAudio')}
          </a>
        </p>
      ) : (
        <>
          <div className="flex items-center justify-center gap-3" dir="ltr">
            <button type="button" onClick={() => jump(-10)} disabled={!ready} className={round} aria-label={t('english.courses.back10')}>
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              onClick={toggle}
              disabled={!ready}
              aria-label={t(playing ? 'english.courses.pause' : 'english.links.play')}
              className="w-14 h-14 rounded-full bg-clay-soft text-white flex items-center justify-center shadow-lg shadow-clay-soft/30 hover:bg-clay-soft-dark transition-colors disabled:opacity-60"
            >
              {!ready ? (
                <Loader2 size={22} className="animate-spin" />
              ) : playing ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="translate-x-[2px]" />
              )}
            </button>
            <button type="button" onClick={() => jump(10)} disabled={!ready} className={round} aria-label={t('english.courses.forward10')}>
              <RotateCw size={18} />
            </button>
          </div>
          <div className="space-y-1" dir="ltr">
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(duration))}
              step={1}
              value={Math.floor(current)}
              disabled={!ready}
              onChange={(e) => {
                if (ref.current) ref.current.currentTime = Number(e.target.value);
              }}
              aria-label={t('english.courses.seek')}
              className="w-full accent-clay-soft cursor-pointer"
            />
            <div className="flex justify-between text-[11px] tabular-nums text-ink-light">
              <span>{clockLength(current)}</span>
              <span>{duration ? clockLength(duration) : '–:––'}</span>
            </div>
          </div>
          <div className="flex justify-center" dir="ltr">
            <div className="flex rounded-lg border border-border-subtle overflow-hidden">
              {RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => changeRate(r)}
                  className={`px-2.5 py-1 text-xs transition-colors ${rate === r ? 'bg-clay-soft text-white' : 'text-ink hover:bg-ink/5'}`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
