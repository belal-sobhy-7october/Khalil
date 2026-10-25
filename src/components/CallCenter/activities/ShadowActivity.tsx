import { useEffect, useRef, useState } from 'react';
import { Headphones, Repeat, Square } from 'lucide-react';
import { getScript } from '../../../data/callCenter';
import type { Speaker } from '../../../data/callCenter/types';
import { shadowLines, speakLines, ttsSupported } from '../../../lib/callCenter/voice';
import VoiceRecorder from '../VoiceRecorder';
import { ArabicNote, NaturalReaderButton, SpeakButton, secondaryBtn } from '../ui';
import { useSavedProgress } from '../useSavedProgress';

const SPEAKER_NAME: Record<Speaker, string> = {
  agent: 'Agent',
  customer: 'Customer',
  recruiter: 'Recruiter',
  you: 'You',
  colleague: 'Colleague',
  narrator: 'Narrator',
};

const SPEAKER_STYLE: Record<Speaker, string> = {
  agent: 'text-clay-soft-dark',
  you: 'text-clay-soft-dark',
  narrator: 'text-clay-soft-dark',
  customer: 'text-sage-soft-dark',
  recruiter: 'text-sage-soft-dark',
  colleague: 'text-sage-soft-dark',
};

const RATES = [0.8, 0.95, 1.1];

/**
 * Shadow a model call: hear it, then repeat each line in the pause after it,
 * copying the rhythm and the tone, and record yourself.
 */
export default function ShadowActivity({ refId, onDone, progressKey = `shadow:${refId}` }: { refId: string; onDone: () => void; progressKey?: string }) {
  const script = getScript(refId);
  const [current, setCurrent] = useState(-1);
  const [mode, setMode] = useState<'idle' | 'listen' | 'shadow'>('idle');
  const [rate, setRate] = useState(0.95);
  // Rounds done are saved, so two rounds can be split across visits.
  const [rounds, setRounds] = useSavedProgress(progressKey, 0);
  const roundsRef = useRef(rounds);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopRef.current?.(), []);
  if (!script) return <p className="text-sm text-ink-light">This call is missing.</p>;

  const lines = script.lines.map((l) => ({ text: l.text, who: l.who }));
  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
    setMode('idle');
  };
  const run = (next: 'listen' | 'shadow') => {
    stopRef.current?.();
    setMode(next);
    const onLine = (i: number) => {
      setCurrent(i);
      if (i !== -1) return;
      stopRef.current = null;
      setMode('idle');
      if (next === 'shadow') {
        roundsRef.current += 1;
        setRounds(roundsRef.current);
        if (roundsRef.current >= 2) onDone();
      }
    };
    stopRef.current = next === 'shadow' ? shadowLines(lines, { rate, onLine }) : speakLines(lines, { rate, onLine });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">
        <span className="font-medium">Notice: </span>
        {script.focus}
      </p>
      <ArabicNote>
        استمع إلى الجملة، وفي الوقفة التي تليها قلها بالسرعة والنغمة نفسيهما كأنك صدى. لا يهم أن تفهم كل كلمة من أول مرة. جولتان من المحاكاة، ثم سجّل صوتك.
      </ArabicNote>
      <div className="flex flex-wrap items-center gap-2">
        {mode === 'idle' ? (
          <>
            <button type="button" onClick={() => run('listen')} disabled={!ttsSupported()} className={secondaryBtn}>
              <Headphones size={13} /> Listen to the call
            </button>
            <button type="button" onClick={() => run('shadow')} disabled={!ttsSupported()} className={secondaryBtn}>
              <Repeat size={13} /> Shadow it (pause after each line)
            </button>
          </>
        ) : (
          <button type="button" onClick={stop} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white">
            <Square size={12} /> Stop
          </button>
        )}
        <div className="flex rounded-lg bg-ink/5 p-0.5" role="group" aria-label="Speed">
          {RATES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={rate === r}
              onClick={() => setRate(r)}
              className={`px-2 py-1 rounded-md text-xs tabular-nums ${rate === r ? 'bg-card text-ink shadow-sm' : 'text-ink-light'}`}
            >
              {r}×
            </button>
          ))}
        </div>
        {rounds > 0 && <span className="text-xs text-sage-soft-dark">Shadowed {rounds}×</span>}
      </div>

      <ol className="space-y-1.5 rounded-xl bg-ink/3 p-3">
        {script.lines.map((l, i) => (
          <li key={i} className={`flex items-start gap-2 rounded-lg px-2 py-1 transition-colors ${current === i ? 'bg-clay-soft/15' : ''}`}>
            <span className={`w-20 shrink-0 text-xs font-semibold pt-0.5 ${SPEAKER_STYLE[l.who]}`}>{SPEAKER_NAME[l.who]}</span>
            <p className="flex-1 text-sm text-ink leading-relaxed">{l.text}</p>
            <SpeakButton text={l.text} rate={rate} />
          </li>
        ))}
      </ol>
      <NaturalReaderButton text={script.lines.map((l) => l.text).join('\n')} />
      <div className="pt-1">
        <div className="text-xs font-medium text-ink-light mb-1.5">Record yourself saying the {script.lines.some((l) => l.who === 'you') ? 'lines' : "agent's lines"}</div>
        <VoiceRecorder promptId={`shadow:${script.id}`} onTake={onDone} history={false} />
      </div>
    </div>
  );
}
