import { useCallback, useRef, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { VIDEOS } from '../../../data/callCenter';
import type { VideoInfo } from '../../../data/callCenter/types';
import { videoThumb, videoUrl } from '../../../data/courses';
import { useKv } from '../../../lib/useKv';
import { getToday } from '../../../store/dateHelpers';
import {
  COURSE_POSITIONS_KEY, COURSE_PROGRESS_KEY, clockLength, dropPositions, isNearEnd, resumeAt, setDone, type CourseProgress, type WatchPositions,
} from '../../../lib/courseProgress';
import LoopPlayer from '../../English/LoopPlayer';
import { NeedsInternet, Pill, secondaryBtn } from '../ui';

const SAVE_EVERY_MS = 15_000;

/**
 * A video lesson, played in the page. Its progress is the same as in the
 * English hub and the Library, so a video watched anywhere counts here.
 */
export default function WatchActivity({ refId, onDone, video }: {
  refId: string;
  onDone: () => void;
  /** For videos that aren't in videos.ts (a grammar course lesson). */
  video?: VideoInfo;
}) {
  const info = video ?? VIDEOS[refId];
  const [progress, setProgress] = useKv<CourseProgress>(COURSE_PROGRESS_KEY, {});
  const [positions, setPositions] = useKv<WatchPositions>(COURSE_POSITIONS_KEY, {});
  const [playing, setPlaying] = useState<number | null>(null);
  const lastSave = useRef(0);
  const finished = useRef(false);
  const seconds = info?.seconds ?? 0;

  const onProgress = useCallback(
    (at: number, isPlaying: boolean) => {
      if (finished.current) return;
      if (isNearEnd(at, seconds)) {
        finished.current = true;
        setProgress((p) => setDone(p, [refId], true, getToday()));
        setPositions((p) => dropPositions(p, [refId]));
        onDone();
        return;
      }
      if (!isPlaying || Date.now() - lastSave.current >= SAVE_EVERY_MS) {
        lastSave.current = Date.now();
        setPositions((p) => ({ ...p, [refId]: Math.floor(at) }));
      }
    },
    [refId, seconds, setProgress, setPositions, onDone]
  );

  if (!info) return <p className="text-sm text-ink-light">This video is missing.</p>;
  const watched = !!progress[refId];
  const position = positions[refId] ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-light">
        <span>{info.channel}</span>
        <span>·</span>
        <span className="tabular-nums">{clockLength(info.seconds)}</span>
        {info.arabic && <Pill tone="accent">بالعربي</Pill>}
        {watched && <Pill tone="good">Watched</Pill>}
        <NeedsInternet />
      </div>
      {playing === null ? (
        <button
          type="button"
          onClick={() => setPlaying(watched ? 0 : resumeAt(position, seconds))}
          className="group relative block w-full max-w-xl aspect-video rounded-xl overflow-hidden bg-black text-start"
        >
          <img src={videoThumb(refId, 'hqdefault')} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-14 h-14 rounded-full bg-white/95 text-clay-soft flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play size={24} fill="currentColor" className="translate-x-[2px]" />
            </span>
          </span>
          <span className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-black/80 to-transparent text-white text-sm font-semibold" dir="auto">
            {position > 0 && !watched ? `Resume at ${clockLength(position)} · ` : ''}
            {info.title}
          </span>
        </button>
      ) : (
        <div className="max-w-xl">
          <LoopPlayer source={{ videoId: refId, listId: null, start: playing || undefined }} onProgress={onProgress} onEnded={() => onProgress(seconds, false)} />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {watched && (
          // Watched in the English hub or the Library: count it here too.
          <button type="button" onClick={onDone} className={secondaryBtn}>
            Watched it already: mark as done
          </button>
        )}
        <a href={videoUrl(refId)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-ink-light hover:text-clay-soft">
          <ExternalLink size={12} /> Open on YouTube
        </a>
      </div>
    </div>
  );
}
