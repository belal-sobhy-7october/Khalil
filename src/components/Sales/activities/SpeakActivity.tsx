import { useEffect, useRef, useState } from 'react';
import { Download, Mic, Square } from 'lucide-react';
import { getSpeak } from '../../../data/sales/plan';
import type { Lang } from '../../../data/sales/types';
import { speakFeedbackPrompt } from '../../../lib/sales/prompts';
import { useRecorder } from '../../../lib/useRecorder';
import { AiButtons, SpeakButton } from '../ui';
import { primaryBtn, secondaryBtn } from '../../CallCenter/ui';
import { pick } from '../../../lib/sales/text';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Say it out loud and record it (on the device only), with a timer against the target length. */
export default function SpeakActivity({ refId, lang, onDone }: { refId: string; lang: Lang; onDone: () => void }) {
  const s = getSpeak(refId);
  const { recording, url, error, start, stop } = useRecorder();
  const [seconds, setSeconds] = useState(0);
  const [took, setTook] = useState<number | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!recording) return;
    startedAt.current = Date.now();
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - startedAt.current) / 1000)), 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  if (!s) return null;
  const finish = () => {
    stop();
    setTook(seconds);
    onDone();
  };
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink leading-relaxed">{s.prompt}</p>
      <ol className="list-decimal ps-5 text-sm text-ink-light space-y-0.5">
        {s.structure.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        {recording ? (
          <button type="button" onClick={finish} className={`${primaryBtn} bg-red-500 hover:bg-red-600`}>
            <Square size={13} /> {pick(lang, 'وقّف', 'Stop')} · {clock(seconds)}
          </button>
        ) : (
          <button type="button" onClick={() => void start().then(() => setSeconds(0))} className={primaryBtn}>
            <Mic size={13} /> {url ? pick(lang, 'سجّل تاني', 'Record again') : pick(lang, 'سجّل', 'Record')}
          </button>
        )}
        <span className="text-xs text-ink-light tabular-nums">
          {pick(lang, `الهدف: حوالي ${s.seconds} ثانية`, `Target: about ${s.seconds} seconds`)}
        </span>
      </div>
      {error && <p className="text-xs text-red-600">{pick(lang, 'المايك مش متاح. اسمح بيه من المتصفح، أو قولها بصوت عالي وعلّم إنها خلصت.', 'The microphone is not available. Allow it in the browser, or just say it out loud and mark it done.')}</p>}
      {url && !recording && (
        <div className="space-y-1.5">
          <audio src={url} controls className="w-full max-w-md" />
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-light">
            {took !== null && (
              <span className="tabular-nums">
                {pick(lang, `${took} ثانية`, `${took} seconds`)}
                {took > s.seconds * 1.3 ? pick(lang, ' · أطول من الهدف: اختصر', ' · longer than the target: cut it down') : ''}
                {took < s.seconds * 0.5 ? pick(lang, ' · قصير: زوّد مثال', ' · short: add an example') : ''}
              </span>
            )}
            <a href={url} download={`${s.id}.webm`} className={secondaryBtn}>
              <Download size={13} /> {pick(lang, 'نزّل التسجيل', 'Download')}
            </a>
          </div>
          <p className="text-[11px] text-ink-light">{pick(lang, 'التسجيل بيفضل على جهازك ومش بيتحفظ هنا. نزّله لو عاوز تقارن بعدين.', 'The recording stays on your device and is not saved here. Download it to compare later.')}</p>
        </div>
      )}
      {s.model && (
        <details>
          <summary className="cursor-pointer text-xs text-ink-light hover:text-ink">{pick(lang, 'شوف نموذج بعد ما تجرب', 'See a model after your try')}</summary>
          <div className="mt-2 flex items-start gap-1 rounded-xl bg-sage-soft/8 border border-sage-soft/30 p-3">
            <p className="flex-1 text-sm text-ink leading-relaxed">{s.model}</p>
            {lang === 'en' && <SpeakButton text={s.model} />}
          </div>
        </details>
      )}
      <details>
        <summary className="cursor-pointer text-xs text-ink-light hover:text-ink">{pick(lang, 'خد رأي الـ AI (اكتب اللي قلته)', 'Get AI feedback (type what you said)')}</summary>
        <div className="mt-2">
          <AiButtons prompt={speakFeedbackPrompt(s, lang)} lang={lang} />
        </div>
      </details>
    </div>
  );
}
