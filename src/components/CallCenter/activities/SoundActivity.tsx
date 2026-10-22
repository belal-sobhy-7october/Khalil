import { useState } from 'react';
import { Mic, Snail, Square } from 'lucide-react';
import { getSound } from '../../../data/callCenter';
import type { SoundTarget } from '../../../data/callCenter/types';
import { useRecorder } from '../../../lib/useRecorder';
import { speakText } from '../../../lib/callCenter/voice';
import YouGlishModal from '../../Vocabulary/YouGlishModal';
import { ArabicNote, NeedsInternet, ReadAloud, SpeakButton, secondaryBtn } from '../ui';

function DrillLine({ text, onRecorded }: { text: string; onRecorded: () => void }) {
  const { recording, url, error, start, stop } = useRecorder();
  return (
    <li className="space-y-1.5">
      <div className="flex items-start gap-1">
        <p className="flex-1 text-ink leading-relaxed">{text}</p>
        <SpeakButton text={text} />
        <button type="button" onClick={() => speakText(text, 0.65)} aria-label="Listen slowly" title="Slowly" className="p-1.5 rounded-lg text-ink-light hover:text-clay-soft hover:bg-clay-soft/10">
          <Snail size={15} />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {recording ? (
          <button
            type="button"
            onClick={() => {
              stop();
              onRecorded();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white animate-pulse"
          >
            <Square size={12} /> Stop
          </button>
        ) : (
          <button type="button" onClick={() => void start()} className={secondaryBtn}>
            <Mic size={13} /> {url ? 'Record again' : 'Record yourself'}
          </button>
        )}
        {url && <audio src={url} controls className="h-8 max-w-full" />}
        {error && <span className="text-[11px] text-red-500">The microphone is blocked.</span>}
      </div>
    </li>
  );
}

function SoundCard({ sound, onRecorded }: { sound: SoundTarget; onRecorded: () => void }) {
  const [glish, setGlish] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <div>
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className="font-semibold text-ink">{sound.title}</h4>
          <span className="text-xs text-clay-soft-dark font-mono">{sound.label}</span>
        </div>
        <p className="mt-1 text-sm text-ink">{sound.how}</p>
        <ArabicNote className="mt-1">{sound.tipAr}</ArabicNote>
      </div>

      {sound.pairs && (
        <div>
          <div className="text-xs font-medium text-ink-light mb-1.5">Hear the difference, then say both</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {sound.pairs.map(([a, b]) => (
              <div key={`${a}-${b}`} className="flex items-center justify-between gap-1 rounded-lg bg-ink/4 px-2 py-1 text-sm">
                <button type="button" onClick={() => speakText(a, 0.8)} className="text-ink hover:text-clay-soft">
                  {a}
                </button>
                <span className="text-ink-lighter text-xs">·</span>
                <button type="button" onClick={() => speakText(b, 0.8)} className="text-ink hover:text-clay-soft">
                  {b}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-medium text-ink-light">Hear real Americans say it on YouGlish</span>
          <NeedsInternet />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sound.words.map((w) => (
            <button key={w} type="button" onClick={() => setGlish(w)} className="px-2.5 py-1 rounded-full border border-border-subtle text-xs text-ink hover:border-clay-soft hover:text-clay-soft">
              {w}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-ink-light mb-1.5">Say it, record it, compare</div>
        <ul className="space-y-3">
          {sound.drills.map((d) => (
            <DrillLine key={d} text={d} onRecorded={onRecorded} />
          ))}
        </ul>
        <div className="mt-2">
          <ReadAloud text={sound.drills.join(' ')} />
        </div>
      </div>
      {glish && <YouGlishModal word={glish} onClose={() => setGlish(null)} />}
    </div>
  );
}

/** Sound of the day: one sound (or a comma-separated review of several). */
export default function SoundActivity({ refId, onDone }: { refId: string; onDone: () => void }) {
  const sounds = refId.split(',').map(getSound).filter((s): s is SoundTarget => !!s);
  return (
    <div className="space-y-6 divide-y divide-border-subtle [&>*+*]:pt-6">
      {sounds.map((s) => (
        <SoundCard key={s.id} sound={s} onRecorded={onDone} />
      ))}
    </div>
  );
}
