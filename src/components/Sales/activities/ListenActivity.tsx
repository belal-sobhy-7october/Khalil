import { useState } from 'react';
import { ExternalLink, Headphones, Play } from 'lucide-react';
import { getListen } from '../../../data/sales/plan';
import type { Lang } from '../../../data/sales/types';
import { videoThumb } from '../../../data/courses';
import LoopPlayer from '../../English/LoopPlayer';
import { NeedsInternet, NoteBox } from '../ui';
import { primaryBtn, secondaryBtn } from '../../CallCenter/ui';
import { pick } from '../../../lib/sales/text';

/** Something to watch or hear: played in the page when the exact video is known, otherwise opened. */
export default function ListenActivity({ refId, taskId, lang, onDone }: { refId: string; taskId: string; lang: Lang; onDone: () => void }) {
  const item = getListen(refId);
  const [playing, setPlaying] = useState(false);
  if (!item) return null;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-light">
        <Headphones size={13} />
        <span>{item.source}</span>
        <span>·</span>
        <span>{pick(lang, `حوالي ${item.minutes} دقيقة`, `about ${item.minutes} min`)}</span>
        <NeedsInternet />
      </div>
      <p className="text-sm text-ink">{item.focus}</p>
      {item.videoId &&
        (playing ? (
          <div className="max-w-xl">
            <LoopPlayer source={{ videoId: item.videoId, listId: null }} />
          </div>
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group relative block w-full max-w-xl aspect-video rounded-xl overflow-hidden bg-black text-start">
            <img src={videoThumb(item.videoId, 'hqdefault')} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-white/95 text-clay-soft flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" />
              </span>
            </span>
            <span className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-black/80 to-transparent text-white text-sm font-semibold" dir="auto">
              {item.title}
            </span>
          </button>
        ))}
      <div className="flex flex-wrap items-center gap-2">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={item.videoId ? secondaryBtn : primaryBtn}>
          <ExternalLink size={13} /> {item.videoId ? pick(lang, 'افتح على يوتيوب', 'Open on YouTube') : pick(lang, 'افتح وابدأ', 'Open it')}
        </a>
      </div>
      <div className="space-y-2">
        <div className="text-xs font-semibold text-ink-light">{pick(lang, 'بعد ما تخلص، جاوب في دفترك', 'Afterwards, answer in your notebook')}</div>
        {item.questions.map((q, i) => (
          <NoteBox key={q} noteKey={`${taskId}#${i}`} label={q} rows={2} lang={lang} />
        ))}
      </div>
      <button type="button" onClick={onDone} className={secondaryBtn}>
        {pick(lang, 'سمعته وجاوبت', 'Listened and answered')}
      </button>
    </div>
  );
}
